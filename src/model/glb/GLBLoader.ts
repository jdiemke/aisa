import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector4f } from '../../math/Vector4f';
import { Material } from '../../shading/material/Material';

/**
 * GLB (Binary glTF 2.0) file format loader.
 *
 * Specification: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#glb-file-format-specification
 *
 * GLB layout (little-endian):
 *  - 12-byte header: magic (0x46546C67), version, total length
 *  - Chunk 0 (JSON):  chunkLength, chunkType 0x4E4F534A, JSON payload
 *  - Chunk 1 (BIN):   chunkLength, chunkType 0x004E4942, binary payload
 *
 * The JSON chunk contains standard glTF 2.0 JSON with meshes, accessors,
 * bufferViews, buffers, materials, nodes, and scenes.  The BIN chunk
 * holds the raw vertex/index data referenced by buffer 0.
 */
export class GLBLoader {

    // ── glTF component-type constants ──────────────────────────────
    private static readonly BYTE          = 5120;
    private static readonly UNSIGNED_BYTE = 5121;
    private static readonly SHORT         = 5122;
    private static readonly UNSIGNED_SHORT = 5123;
    private static readonly UNSIGNED_INT  = 5125;
    private static readonly FLOAT         = 5126;

    // ── glTF chunk-type constants ──────────────────────────────────
    private static readonly CHUNK_TYPE_JSON = 0x4E4F534A;
    private static readonly CHUNK_TYPE_BIN  = 0x004E4942;

    // ── glTF magic number ──────────────────────────────────────────
    private static readonly GLB_MAGIC = 0x46546C67;

    /**
     * A single parsed mesh group carrying its flat-shaded geometry together
     * with the engine-ready {@link Material} converted from glTF PBR data.
     */
    public static readonly MeshGroup = class {
        constructor(
            public readonly mesh: FlatshadedMesh,
            public readonly material: Material,
            public readonly materialName: string,
            public readonly doubleSided: boolean = false
        ) {}
    };

    // ── Public API ─────────────────────────────────────────────────

    /**
     * Fetches a `.glb` file and returns an array of mesh groups, one per
     * glTF primitive.  Each group contains the flat-shaded mesh and its
     * converted PBR material.
     */
    public static load(url: string): Promise<Array<InstanceType<typeof GLBLoader.MeshGroup>>> {
        return fetch(url)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => GLBLoader.parse(arrayBuffer));
    }

    /**
     * Fetches a `.glb` file and returns the raw parsed glTF JSON object
     * and the BIN chunk.  Used by animation / skinning code that needs
     * access to the full glTF document.
     */
    public static loadRaw(url: string): Promise<{ gltf: any; binChunk: ArrayBuffer | null }> {
        return fetch(url)
            .then((response: Response) => response.arrayBuffer())
            .then((arrayBuffer: ArrayBuffer) => GLBLoader.parseRaw(arrayBuffer));
    }

    // ── Parsing entry point ────────────────────────────────────────

    private static parseRaw(arrayBuffer: ArrayBuffer): { gltf: any; binChunk: ArrayBuffer | null } {
        const { jsonChunk, binChunk } = GLBLoader.extractChunks(arrayBuffer);
        const gltf = JSON.parse(jsonChunk);
        return { gltf, binChunk };
    }

    private static parse(arrayBuffer: ArrayBuffer): Array<InstanceType<typeof GLBLoader.MeshGroup>> {
        const { jsonChunk, binChunk } = GLBLoader.extractChunks(arrayBuffer);
        const gltf = JSON.parse(jsonChunk);
        return GLBLoader.buildMeshGroups(gltf, binChunk);
    }

    private static extractChunks(arrayBuffer: ArrayBuffer): { jsonChunk: string; binChunk: ArrayBuffer | null } {
        const view = new DataView(arrayBuffer);

        // ── Header ─────────────────────────────────────────────────
        const magic   = view.getUint32(0, true);
        const version = view.getUint32(4, true);

        if (magic !== GLBLoader.GLB_MAGIC) {
            throw new Error('GLBLoader: invalid magic number – not a GLB file');
        }
        if (version < 2) {
            throw new Error(`GLBLoader: unsupported GLB version ${version}`);
        }

        // ── Chunks ─────────────────────────────────────────────────
        let offset = 12;
        let jsonChunk: string | null = null;
        let binChunk: ArrayBuffer | null = null;

        while (offset < arrayBuffer.byteLength) {
            const chunkLength = view.getUint32(offset, true);
            const chunkType   = view.getUint32(offset + 4, true);
            const chunkStart  = offset + 8;

            if (chunkType === GLBLoader.CHUNK_TYPE_JSON) {
                const decoder = new TextDecoder('utf-8');
                jsonChunk = decoder.decode(new Uint8Array(arrayBuffer, chunkStart, chunkLength));
            } else if (chunkType === GLBLoader.CHUNK_TYPE_BIN) {
                binChunk = arrayBuffer.slice(chunkStart, chunkStart + chunkLength);
            }

            offset = chunkStart + chunkLength;
        }

        if (!jsonChunk) {
            throw new Error('GLBLoader: missing JSON chunk');
        }

        return { jsonChunk, binChunk };
    }

    // ── Build mesh groups from glTF JSON + BIN ─────────────────────

    private static buildMeshGroups(
        gltf: any,
        binChunk: ArrayBuffer | null
    ): Array<InstanceType<typeof GLBLoader.MeshGroup>> {
        const meshGroups: Array<InstanceType<typeof GLBLoader.MeshGroup>> = [];

        // Pre-parse materials (with doubleSided flag)
        const parsedMats = GLBLoader.parseMaterials(gltf);
        const materials: Array<Material> = parsedMats.map(p => p.material);
        const doubleSidedFlags: Array<boolean> = parsedMats.map(p => p.doubleSided);
        const materialNames: Array<string> = (gltf.materials || []).map(
            (m: any, i: number) => m.name || `material_${i}`
        );

        // Traverse scene graph to collect (meshIndex, worldTransform) pairs
        const meshInstances = GLBLoader.collectMeshInstances(gltf);

        for (const { meshIndex, worldTransform } of meshInstances) {
            const gltfMesh = gltf.meshes[meshIndex];

            // Pre-compute normal transform and determinant for this node
            const cofactor = GLBLoader.computeCofactorMatrix(worldTransform);
            const det3x3 = GLBLoader.compute3x3Determinant(worldTransform);
            const flipWinding = det3x3 < 0;

            for (const primitive of gltfMesh.primitives) {
                const mode = primitive.mode !== undefined ? primitive.mode : 4;
                if (mode !== 4) {
                    // Only triangle topology supported
                    continue;
                }

                const posAccessorIdx = primitive.attributes.POSITION;
                if (posAccessorIdx === undefined) { continue; }

                const positions = GLBLoader.readAccessorVec3(gltf, binChunk, posAccessorIdx);

                // Apply node world transform to positions
                for (let p = 0; p < positions.length; p++) {
                    const src = positions[p];
                    const tx = worldTransform.m11 * src.x + worldTransform.m12 * src.y + worldTransform.m13 * src.z + worldTransform.m14;
                    const ty = worldTransform.m21 * src.x + worldTransform.m22 * src.y + worldTransform.m23 * src.z + worldTransform.m24;
                    const tz = worldTransform.m31 * src.x + worldTransform.m32 * src.y + worldTransform.m33 * src.z + worldTransform.m34;
                    src.x = tx; src.y = ty; src.z = tz;
                }

                // Normals — compute flat normals when not provided
                let normals: Array<Vector4f>;
                const normalAccessorIdx = primitive.attributes.NORMAL;
                if (normalAccessorIdx !== undefined) {
                    normals = GLBLoader.readAccessorVec3(gltf, binChunk, normalAccessorIdx);

                    // Apply cofactor (normal) transform to provided normals
                    const sign = det3x3 < 0 ? -1 : 1;
                    for (let n = 0; n < normals.length; n++) {
                        const src = normals[n];
                        const nx = cofactor.m11 * src.x + cofactor.m12 * src.y + cofactor.m13 * src.z;
                        const ny = cofactor.m21 * src.x + cofactor.m22 * src.y + cofactor.m23 * src.z;
                        const nz = cofactor.m31 * src.x + cofactor.m32 * src.y + cofactor.m33 * src.z;
                        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
                        if (len > 1e-10) {
                            src.x = sign * nx / len;
                            src.y = sign * ny / len;
                            src.z = sign * nz / len;
                        }
                    }
                } else {
                    normals = []; // filled below per-face
                }

                // Indices
                let indices: Array<number>;
                if (primitive.indices !== undefined) {
                    indices = GLBLoader.readAccessorScalar(gltf, binChunk, primitive.indices);
                } else {
                    indices = Array.from({ length: positions.length }, (_, k) => k);
                }

                // If normals were not provided, compute flat normals
                const hasNormals = normalAccessorIdx !== undefined;
                if (!hasNormals) {
                    // We'll compute per-face normals below during face assembly
                    // Fill placeholder normals array same length as positions
                    normals = positions.map(() => new Vector4f(0, 0, 0, 0));
                }

                // Build faces
                const faces: Array<FlatShadedFace> = [];
                const faceNormals: Array<Vector4f> = [];

                for (let t = 0; t + 2 < indices.length; t += 3) {
                    const i0 = indices[t];
                    let i1 = indices[t + 1];
                    let i2 = indices[t + 2];

                    // Flip winding when node transform has negative determinant
                    if (flipWinding) {
                        const tmp = i1;
                        i1 = i2;
                        i2 = tmp;
                    }

                    if (!hasNormals) {
                        // Compute flat normal for this face
                        const edge1 = positions[i1].sub(positions[i0]);
                        const edge2 = positions[i2].sub(positions[i0]);
                        const faceNormal = edge1.cross(edge2).normalize();
                        const nIdx = faceNormals.length;
                        faceNormals.push(faceNormal);

                        faces.push({
                            v1: i0, v2: i1, v3: i2,
                            n1: nIdx, n2: nIdx, n3: nIdx
                        } as FlatShadedFace);
                    } else {
                        faces.push({
                            v1: i0, v2: i1, v3: i2,
                            n1: i0, n2: i1, n3: i2
                        } as FlatShadedFace);
                    }
                }

                // For computed flat normals replace the normals array
                const finalNormals = hasNormals ? normals : faceNormals;

                const transformedPoints  = positions.map(() => new Vector4f(0, 0, 0, 0));
                const transformedNormals = finalNormals.map(() => new Vector4f(0, 0, 0, 0));

                const mesh: FlatshadedMesh = {
                    points: positions,
                    normals: finalNormals,
                    faces,
                    transformedPoints,
                    transformedNormals
                } as FlatshadedMesh;

                // Material
                const matIdx = primitive.material !== undefined ? primitive.material : -1;
                const material = matIdx >= 0 && matIdx < materials.length
                    ? materials[matIdx]
                    : GLBLoader.defaultMaterial();
                const matName = matIdx >= 0 && matIdx < materialNames.length
                    ? materialNames[matIdx]
                    : '__default__';
                const ds = matIdx >= 0 && matIdx < doubleSidedFlags.length
                    ? doubleSidedFlags[matIdx]
                    : false;

                meshGroups.push(new GLBLoader.MeshGroup(mesh, material, matName, ds));
            }
        }

        return meshGroups;
    }

    // ── Scene-graph traversal ──────────────────────────────────────

    private static collectMeshInstances(gltf: any): Array<{ meshIndex: number; worldTransform: Matrix4f }> {
        const instances: Array<{ meshIndex: number; worldTransform: Matrix4f }> = [];

        const visitNode = (nodeIdx: number, parentTransform: Matrix4f): void => {
            const node = gltf.nodes[nodeIdx];
            const localTransform = GLBLoader.nodeToMatrix4f(node);
            const worldTransform = parentTransform.multiplyMatrix(localTransform);

            if (node.mesh !== undefined) {
                instances.push({ meshIndex: node.mesh, worldTransform });
            }
            if (node.children) {
                for (const childIdx of node.children) {
                    visitNode(childIdx, worldTransform);
                }
            }
        };

        const identity = Matrix4f.constructIdentityMatrix();

        if (gltf.scenes && gltf.scenes.length > 0) {
            const sceneIdx = gltf.scene !== undefined ? gltf.scene : 0;
            const scene = gltf.scenes[sceneIdx];
            if (scene.nodes) {
                for (const rootNode of scene.nodes) {
                    visitNode(rootNode, identity);
                }
            }
        } else if (gltf.nodes) {
            // No scenes — treat all nodes as roots
            for (let i = 0; i < gltf.nodes.length; i++) {
                visitNode(i, identity);
            }
        }

        return instances;
    }

    // ── Accessor readers ───────────────────────────────────────────

    /**
     * Reads a VEC3 float accessor and returns an array of Vector4f (w=1).
     */
    public static readAccessorVec3(
        gltf: any,
        binChunk: ArrayBuffer | null,
        accessorIdx: number
    ): Array<Vector4f> {
        const accessor    = gltf.accessors[accessorIdx];
        const bufferView  = gltf.bufferViews[accessor.bufferView];
        const buffer      = GLBLoader.getBufferData(gltf, binChunk, bufferView.buffer);
        const byteOffset  = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const count       = accessor.count;
        const stride      = bufferView.byteStride || 12; // 3 * float32

        const result: Array<Vector4f> = [];
        const dv = new DataView(buffer);

        for (let i = 0; i < count; i++) {
            const base = byteOffset + i * stride;
            const x = dv.getFloat32(base,     true);
            const y = dv.getFloat32(base + 4, true);
            const z = dv.getFloat32(base + 8, true);
            result.push(new Vector4f(x, y, z, 1));
        }

        return result;
    }

    /**
     * Reads a SCALAR accessor (typically indices) and returns a plain number
     * array, handling UNSIGNED_BYTE / UNSIGNED_SHORT / UNSIGNED_INT types.
     */
    public static readAccessorScalar(
        gltf: any,
        binChunk: ArrayBuffer | null,
        accessorIdx: number
    ): Array<number> {
        const accessor    = gltf.accessors[accessorIdx];
        const bufferView  = gltf.bufferViews[accessor.bufferView];
        const buffer      = GLBLoader.getBufferData(gltf, binChunk, bufferView.buffer);
        const byteOffset  = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const count       = accessor.count;
        const compType    = accessor.componentType;

        const result: Array<number> = [];
        const dv = new DataView(buffer);

        for (let i = 0; i < count; i++) {
            switch (compType) {
                case GLBLoader.UNSIGNED_BYTE:
                    result.push(dv.getUint8(byteOffset + i));
                    break;
                case GLBLoader.UNSIGNED_SHORT:
                    result.push(dv.getUint16(byteOffset + i * 2, true));
                    break;
                case GLBLoader.UNSIGNED_INT:
                    result.push(dv.getUint32(byteOffset + i * 4, true));
                    break;
                case GLBLoader.FLOAT:
                    result.push(dv.getFloat32(byteOffset + i * 4, true));
                    break;
                default:
                    result.push(dv.getUint16(byteOffset + i * 2, true));
                    break;
            }
        }

        return result;
    }

    /**
     * Returns the raw ArrayBuffer for the given buffer index.
     * Buffer 0 with no URI is the GLB-stored BIN chunk.
     */
    public static getBufferData(
        gltf: any,
        binChunk: ArrayBuffer | null,
        bufferIdx: number
    ): ArrayBuffer {
        const bufferDef = gltf.buffers[bufferIdx];
        if (bufferIdx === 0 && !bufferDef.uri) {
            if (!binChunk) {
                throw new Error('GLBLoader: BIN chunk missing but referenced by buffer 0');
            }
            return binChunk;
        }
        throw new Error('GLBLoader: external buffer URIs are not supported in GLB mode');
    }

    // ── Node transform helpers ───────────────────────────────────────

    /**
     * Builds a Matrix4f from a glTF node's transform properties.
     * A node may specify either a `matrix` (column-major 16 floats) or
     * separate `translation`, `rotation` (quaternion), `scale` properties.
     * If none are present, the identity matrix is returned.
     */
    private static nodeToMatrix4f(node: any): Matrix4f {
        if (node.matrix) {
            return GLBLoader.fromColumnMajor(node.matrix);
        }

        let mat = Matrix4f.constructIdentityMatrix();

        if (node.scale) {
            mat = Matrix4f.constructScaleMatrix(node.scale[0], node.scale[1], node.scale[2]);
        }
        if (node.rotation) {
            const rotMat = GLBLoader.quaternionToMatrix4f(node.rotation);
            mat = rotMat.multiplyMatrix(mat);
        }
        if (node.translation) {
            const transMat = Matrix4f.constructTranslationMatrix(
                node.translation[0], node.translation[1], node.translation[2]
            );
            mat = transMat.multiplyMatrix(mat);
        }

        return mat;
    }

    /** Builds a Matrix4f from a column-major 16-float array (glTF convention). */
    private static fromColumnMajor(m: number[]): Matrix4f {
        const mat = Matrix4f.constructIdentityMatrix();
        mat.m11 = m[0];  mat.m12 = m[4];  mat.m13 = m[8];   mat.m14 = m[12];
        mat.m21 = m[1];  mat.m22 = m[5];  mat.m23 = m[9];   mat.m24 = m[13];
        mat.m31 = m[2];  mat.m32 = m[6];  mat.m33 = m[10];  mat.m34 = m[14];
        mat.m41 = m[3];  mat.m42 = m[7];  mat.m43 = m[11];  mat.m44 = m[15];
        return mat;
    }

    /**
     * Converts a glTF quaternion [x, y, z, w] to a Matrix4f rotation matrix.
     */
    public static quaternionToMatrix4f(q: number[]): Matrix4f {
        const [x, y, z, w] = q;
        const mat = Matrix4f.constructIdentityMatrix();

        mat.m11 = 1 - 2 * (y * y + z * z);
        mat.m12 = 2 * (x * y - w * z);
        mat.m13 = 2 * (x * z + w * y);

        mat.m21 = 2 * (x * y + w * z);
        mat.m22 = 1 - 2 * (x * x + z * z);
        mat.m23 = 2 * (y * z - w * x);

        mat.m31 = 2 * (x * z - w * y);
        mat.m32 = 2 * (y * z + w * x);
        mat.m33 = 1 - 2 * (x * x + y * y);

        return mat;
    }

    /**
     * Computes the cofactor matrix of the upper-left 3x3 of the given
     * Matrix4f.  This equals `det(M) * inverse(M)^T` and is used to
     * correctly transform normals even under non-uniform scale.
     * After multiplication the result must be re-normalised.
     */
    private static computeCofactorMatrix(m: Matrix4f): Matrix4f {
        const result = Matrix4f.constructIdentityMatrix();

        result.m11 =  (m.m22 * m.m33 - m.m23 * m.m32);
        result.m12 = -(m.m21 * m.m33 - m.m23 * m.m31);
        result.m13 =  (m.m21 * m.m32 - m.m22 * m.m31);

        result.m21 = -(m.m12 * m.m33 - m.m13 * m.m32);
        result.m22 =  (m.m11 * m.m33 - m.m13 * m.m31);
        result.m23 = -(m.m11 * m.m32 - m.m12 * m.m31);

        result.m31 =  (m.m12 * m.m23 - m.m13 * m.m22);
        result.m32 = -(m.m11 * m.m23 - m.m13 * m.m21);
        result.m33 =  (m.m11 * m.m22 - m.m12 * m.m21);

        return result;
    }

    /** Computes the determinant of the upper-left 3x3 of the given Matrix4f. */
    private static compute3x3Determinant(m: Matrix4f): number {
        return m.m11 * (m.m22 * m.m33 - m.m23 * m.m32)
             - m.m12 * (m.m21 * m.m33 - m.m23 * m.m31)
             + m.m13 * (m.m21 * m.m32 - m.m22 * m.m31);
    }

    // ── Material conversion ────────────────────────────────────────

    /**
     * Converts glTF PBR metallic-roughness materials into the engine's
     * Phong-like {@link Material} objects, also extracting the doubleSided flag.
     */
    private static parseMaterials(gltf: any): Array<{ material: Material; doubleSided: boolean }> {
        if (!gltf.materials) { return []; }

        return gltf.materials.map((gltfMat: any) => {
            const mat = new Material();
            const pbr = gltfMat.pbrMetallicRoughness || {};

            // Base color (RGBA, default white)
            const bc = pbr.baseColorFactor || [1, 1, 1, 1];

            // Metallic / roughness
            const metallic  = pbr.metallicFactor  !== undefined ? pbr.metallicFactor  : 1.0;
            const roughness = pbr.roughnessFactor !== undefined ? pbr.roughnessFactor : 1.0;

            // Approximate Phong ambient / diffuse / specular from PBR values
            const ambientScale = 0.8;
            mat.ambientColor  = new Vector4f(
                bc[0] * ambientScale,
                bc[1] * ambientScale,
                bc[2] * ambientScale, 1
            );
            mat.diffuseColor  = new Vector4f(
                bc[0] * (1.0 - metallic * 0.5),
                bc[1] * (1.0 - metallic * 0.5),
                bc[2] * (1.0 - metallic * 0.5), 1
            );

            // Higher metallic → stronger specular; lower roughness → sharper highlights
            const specIntensity = 0.3 + metallic * 0.7;
            mat.specularColor = new Vector4f(specIntensity, specIntensity, specIntensity, 1);
            mat.shininess     = (1.0 - roughness) * 128;

            // Emissive
            const ef = gltfMat.emissiveFactor || [0, 0, 0];
            mat.emissiveColor = new Vector4f(ef[0], ef[1], ef[2], 1);

            const doubleSided = gltfMat.doubleSided === true;
            return { material: mat, doubleSided };
        });
    }

    /** A neutral grey default material. */
    private static defaultMaterial(): Material {
        const mat = new Material();
        mat.ambientColor  = new Vector4f(0.3, 0.3, 0.3, 1);
        mat.diffuseColor  = new Vector4f(0.8, 0.8, 0.8, 1);
        mat.specularColor = new Vector4f(0.3, 0.3, 0.3, 1);
        mat.emissiveColor = new Vector4f(0, 0, 0, 1);
        mat.shininess     = 32;
        return mat;
    }

    private constructor() { /* static-only */ }
}
