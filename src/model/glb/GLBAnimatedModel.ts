import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector4f } from '../../math/Vector4f';
import { Material } from '../../shading/material/Material';
import {
    AnimationClip, AnimationChannel, NodeHierarchy, NodeTRS,
    SkinData, SkinningAttributes
} from './GLBAnimationData';
import { GLBAnimationLoader } from './GLBAnimationLoader';
import { GLBLoader } from './GLBLoader';

/**
 * A GLB model with skeletal animation support.
 *
 * Modelled after the {@link MD2Model} pattern: call {@link getMesh} each
 * frame with the current time and receive a {@link FlatshadedMesh} whose
 * vertices have been deformed by the active animation clip.
 *
 * Supports the glTF 2.0 skinning model:
 *   skinnedPosition = Σ weight_i * (jointMatrix_i * inverseBindMatrix_i * bindPosition)
 */
export class GLBAnimatedModel {

    public readonly mergedMesh: FlatshadedMesh;
    public readonly engineMaterials: Map<string, Material>;

    private readonly faceMaterials: Array<Material>;
    private readonly faceMatNames: Array<string>;
    private readonly facesDoubleSided: Array<boolean>;

    // Bind-pose geometry (never mutated)
    private readonly bindPositions: Float32Array;   // xyz interleaved
    private readonly bindNormals: Float32Array;      // xyz interleaved

    // Skinning attributes
    private readonly jointIndices: Uint16Array;     // 4 per vertex
    private readonly jointWeights: Float32Array;     // 4 per vertex

    // Skeleton
    private readonly skin: SkinData;
    private readonly hierarchy: NodeHierarchy;
    private readonly animations: Array<AnimationClip>;

    // Pre-allocated scratch space
    private readonly jointWorldMatrices: Array<Matrix4f>;
    private readonly skinMatrices: Array<Matrix4f>;
    private readonly currentTRS: Array<NodeTRS>;

    constructor(
        gltf: any,
        binChunk: ArrayBuffer | null,
    ) {
        this.engineMaterials = new Map();
        this.faceMaterials = [];
        this.faceMatNames = [];
        this.facesDoubleSided = [];

        // Parse animation data
        this.animations = GLBAnimationLoader.parseAnimations(gltf, binChunk);
        const skins = GLBAnimationLoader.parseSkins(gltf, binChunk);
        this.hierarchy = GLBAnimationLoader.parseNodeHierarchy(gltf);
        const meshToSkin = GLBAnimationLoader.buildMeshToSkinMap(gltf);

        // Use first skin (T-Rex has one skin)
        this.skin = skins.length > 0 ? skins[0] : null;

        // Parse materials
        const parsedMats = GLBAnimatedModel.parseMaterials(gltf);
        const materialNames: Array<string> = (gltf.materials || []).map(
            (m: any, i: number) => m.name || `material_${i}`
        );

        // Build merged mesh from all mesh primitives, collecting skinning
        // attributes alongside geometry
        const allPoints: Array<Vector4f> = [];
        const allNormals: Array<Vector4f> = [];
        const allFaces: Array<FlatShadedFace> = [];
        const allJoints: Array<number> = [];  // 4 per vertex
        const allWeights: Array<number> = []; // 4 per vertex

        // For animated models we skip the node world transform since the
        // skeleton joints handle positioning.
        for (let meshIdx = 0; meshIdx < (gltf.meshes || []).length; meshIdx++) {
            const gltfMesh = gltf.meshes[meshIdx];

            for (const primitive of gltfMesh.primitives) {
                const mode = primitive.mode !== undefined ? primitive.mode : 4;
                if (mode !== 4) { continue; }

                const posAccessorIdx = primitive.attributes.POSITION;
                if (posAccessorIdx === undefined) { continue; }

                const positions = GLBLoader.readAccessorVec3(gltf, binChunk, posAccessorIdx);
                const pointOffset = allPoints.length;
                const normalOffset = allNormals.length;

                // Normals
                let normals: Array<Vector4f>;
                const normalAccessorIdx = primitive.attributes.NORMAL;
                const hasNormals = normalAccessorIdx !== undefined;
                if (hasNormals) {
                    normals = GLBLoader.readAccessorVec3(gltf, binChunk, normalAccessorIdx);
                } else {
                    normals = positions.map(() => new Vector4f(0, 0, 0, 0));
                }

                // Skinning attributes
                const skinAttrs = GLBAnimationLoader.parseSkinningAttributes(gltf, binChunk, primitive);

                for (let p = 0; p < positions.length; p++) {
                    allPoints.push(positions[p]);
                    if (skinAttrs) {
                        const base = p * 4;
                        allJoints.push(
                            skinAttrs.joints[base], skinAttrs.joints[base + 1],
                            skinAttrs.joints[base + 2], skinAttrs.joints[base + 3]
                        );
                        allWeights.push(
                            skinAttrs.weights[base], skinAttrs.weights[base + 1],
                            skinAttrs.weights[base + 2], skinAttrs.weights[base + 3]
                        );
                    } else {
                        allJoints.push(0, 0, 0, 0);
                        allWeights.push(1, 0, 0, 0);
                    }
                }

                // Indices
                let indices: Array<number>;
                if (primitive.indices !== undefined) {
                    indices = GLBLoader.readAccessorScalar(gltf, binChunk, primitive.indices);
                } else {
                    indices = Array.from({ length: positions.length }, (_, k) => k);
                }

                // Build faces
                const faceNormals: Array<Vector4f> = [];

                for (let t = 0; t + 2 < indices.length; t += 3) {
                    const i0 = indices[t];
                    const i1 = indices[t + 1];
                    const i2 = indices[t + 2];

                    if (!hasNormals) {
                        const edge1 = positions[i1].sub(positions[i0]);
                        const edge2 = positions[i2].sub(positions[i0]);
                        const fn = edge1.cross(edge2).normalize();
                        const nIdx = faceNormals.length;
                        faceNormals.push(fn);
                        allFaces.push({
                            v1: i0 + pointOffset, v2: i1 + pointOffset, v3: i2 + pointOffset,
                            n1: nIdx + normalOffset, n2: nIdx + normalOffset, n3: nIdx + normalOffset,
                        } as FlatShadedFace);
                    } else {
                        allFaces.push({
                            v1: i0 + pointOffset, v2: i1 + pointOffset, v3: i2 + pointOffset,
                            n1: i0 + normalOffset, n2: i1 + normalOffset, n3: i2 + normalOffset,
                        } as FlatShadedFace);
                    }

                    // Material
                    const matIdx = primitive.material !== undefined ? primitive.material : -1;
                    this.faceMaterials.push(
                        matIdx >= 0 && matIdx < parsedMats.length
                            ? parsedMats[matIdx].material : GLBAnimatedModel.defaultMaterial()
                    );
                    this.faceMatNames.push(
                        matIdx >= 0 && matIdx < materialNames.length
                            ? materialNames[matIdx] : '__default__'
                    );
                    this.facesDoubleSided.push(
                        matIdx >= 0 && matIdx < parsedMats.length
                            ? parsedMats[matIdx].doubleSided : false
                    );
                }

                const finalNormals = hasNormals ? normals : faceNormals;
                for (const n of finalNormals) {
                    allNormals.push(n);
                }
                // Normal skinning weights mirror vertex weights (when normals
                // are per-vertex they share the same indices).
            }
        }

        // Store bind-pose as flat arrays for fast skinning
        this.bindPositions = new Float32Array(allPoints.length * 3);
        this.bindNormals = new Float32Array(allNormals.length * 3);
        for (let i = 0; i < allPoints.length; i++) {
            this.bindPositions[i * 3]     = allPoints[i].x;
            this.bindPositions[i * 3 + 1] = allPoints[i].y;
            this.bindPositions[i * 3 + 2] = allPoints[i].z;
        }
        for (let i = 0; i < allNormals.length; i++) {
            this.bindNormals[i * 3]     = allNormals[i].x;
            this.bindNormals[i * 3 + 1] = allNormals[i].y;
            this.bindNormals[i * 3 + 2] = allNormals[i].z;
        }

        this.jointIndices = new Uint16Array(allJoints);
        this.jointWeights = new Float32Array(allWeights);

        const transformedPoints = allPoints.map(() => new Vector4f(0, 0, 0, 1));
        const transformedNormals = allNormals.map(() => new Vector4f(0, 0, 0, 0));

        this.mergedMesh = {
            points: allPoints,
            normals: allNormals,
            faces: allFaces,
            transformedPoints,
            transformedNormals,
        } as FlatshadedMesh;

        // Build material map
        for (let i = 0; i < this.faceMaterials.length; i++) {
            this.engineMaterials.set(this.faceMatNames[i], this.faceMaterials[i]);
        }

        // Pre-allocate joint matrices
        const jointCount = this.skin ? this.skin.joints.length : 0;
        this.jointWorldMatrices = new Array(this.hierarchy.count);
        this.skinMatrices = new Array(jointCount);
        for (let i = 0; i < this.hierarchy.count; i++) {
            this.jointWorldMatrices[i] = Matrix4f.constructIdentityMatrix();
        }
        for (let i = 0; i < jointCount; i++) {
            this.skinMatrices[i] = Matrix4f.constructIdentityMatrix();
        }

        // Deep-copy default TRS for animation to mutate
        this.currentTRS = this.hierarchy.defaultTRS.map(trs => ({
            translation: [...trs.translation] as [number, number, number],
            rotation: [...trs.rotation] as [number, number, number, number],
            scale: [...trs.scale] as [number, number, number],
        }));
    }

    // ── Animation query ────────────────────────────────────────────

    public get animationCount(): number { return this.animations.length; }
    public getAnimationName(index: number): string { return this.animations[index].name; }
    public getAnimationDuration(index: number): number { return this.animations[index].duration; }

    public getAnimationIndex(name: string): number {
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i].name === name) { return i; }
        }
        return -1;
    }

    // ── Per-frame update ───────────────────────────────────────────

    /**
     * Evaluates the animation at the given time (seconds) and deforms the
     * mesh vertices.  Returns the mesh for rendering (mirrors MD2Model.getMesh).
     *
     * @param timeSeconds  Current animation time in seconds.
     * @param clipIndex    Which animation clip to play (default 0).
     */
    public getMesh(timeSeconds: number, clipIndex: number = 0): FlatshadedMesh {
        if (this.animations.length === 0 || !this.skin) {
            return this.mergedMesh;
        }

        const clip = this.animations[clipIndex];
        const t = clip.duration > 0 ? (timeSeconds % clip.duration) : 0;

        // 1. Reset TRS to defaults
        for (let i = 0; i < this.hierarchy.count; i++) {
            const def = this.hierarchy.defaultTRS[i];
            this.currentTRS[i].translation[0] = def.translation[0];
            this.currentTRS[i].translation[1] = def.translation[1];
            this.currentTRS[i].translation[2] = def.translation[2];
            this.currentTRS[i].rotation[0] = def.rotation[0];
            this.currentTRS[i].rotation[1] = def.rotation[1];
            this.currentTRS[i].rotation[2] = def.rotation[2];
            this.currentTRS[i].rotation[3] = def.rotation[3];
            this.currentTRS[i].scale[0] = def.scale[0];
            this.currentTRS[i].scale[1] = def.scale[1];
            this.currentTRS[i].scale[2] = def.scale[2];
        }

        // 2. Apply animation channels
        for (const ch of clip.channels) {
            this.evaluateChannel(ch, t);
        }

        // 3. Compute world transforms for all nodes (depth-first)
        this.computeWorldTransforms();

        // 4. Compute skin matrices = worldTransform[joint] * inverseBindMatrix[joint]
        for (let j = 0; j < this.skin.joints.length; j++) {
            const nodeIdx = this.skin.joints[j];
            GLBAnimatedModel.multiplyInto(
                this.skinMatrices[j],
                this.jointWorldMatrices[nodeIdx],
                this.skin.inverseBindMatrices[j]
            );
        }

        // 5. Skin vertices
        this.skinVertices();

        return this.mergedMesh;
    }

    // ── Depth-sorted face order (same as GLBModel) ─────────────────

    public sortFacesByDepth(): Array<number> {
        const mesh = this.mergedMesh;
        const faceOrder = Array.from({ length: mesh.faces.length }, (_, k) => k);
        faceOrder.sort((a, b) => {
            const fa = mesh.faces[a];
            const fb = mesh.faces[b];
            const za = mesh.transformedPoints[fa.v1].z
                     + mesh.transformedPoints[fa.v2].z
                     + mesh.transformedPoints[fa.v3].z;
            const zb = mesh.transformedPoints[fb.v1].z
                     + mesh.transformedPoints[fb.v2].z
                     + mesh.transformedPoints[fb.v3].z;
            return za - zb;
        });
        return faceOrder;
    }

    public getMaterialForFace(fi: number): Material { return this.faceMaterials[fi]; }
    public getMaterialNameForFace(fi: number): string { return this.faceMatNames[fi]; }
    public isFaceDoubleSided(fi: number): boolean { return this.facesDoubleSided[fi]; }

    public computeBounds(): { center: Vector4f; radius: number } {
        const pts = this.mergedMesh.points;
        if (pts.length === 0) {
            return { center: new Vector4f(0, 0, 0, 1), radius: 1 };
        }
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (const p of pts) {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.z < minZ) minZ = p.z;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
            if (p.z > maxZ) maxZ = p.z;
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const cz = (minZ + maxZ) / 2;
        const dx = maxX - minX;
        const dy = maxY - minY;
        const dz = maxZ - minZ;
        return {
            center: new Vector4f(cx, cy, cz, 1),
            radius: Math.sqrt(dx * dx + dy * dy + dz * dz) / 2,
        };
    }

    // ── Animation evaluation ───────────────────────────────────────

    private evaluateChannel(ch: AnimationChannel, t: number): void {
        const times = ch.times;
        const values = ch.values;
        const count = times.length;
        if (count === 0) { return; }

        // Clamp
        if (t <= times[0]) {
            this.applyChannelValue(ch, values, 0);
            return;
        }
        if (t >= times[count - 1]) {
            this.applyChannelValue(ch, values, count - 1);
            return;
        }

        // Find keyframe pair
        let lo = 0;
        for (let i = 1; i < count; i++) {
            if (times[i] > t) { lo = i - 1; break; }
        }
        const hi = lo + 1;

        if (ch.interpolation === 'STEP') {
            this.applyChannelValue(ch, values, lo);
            return;
        }

        // LINEAR interpolation
        const dt = times[hi] - times[lo];
        const alpha = dt > 0 ? (t - times[lo]) / dt : 0;
        const trs = this.currentTRS[ch.nodeIndex];
        const stride = ch.path === 'rotation' ? 4 : 3;
        const loOff = lo * stride;
        const hiOff = hi * stride;

        if (ch.path === 'rotation') {
            // SLERP for quaternions
            GLBAnimatedModel.slerp(
                values[loOff], values[loOff + 1], values[loOff + 2], values[loOff + 3],
                values[hiOff], values[hiOff + 1], values[hiOff + 2], values[hiOff + 3],
                alpha, trs.rotation
            );
        } else {
            const arr = ch.path === 'translation' ? trs.translation : trs.scale;
            arr[0] = values[loOff]     + (values[hiOff]     - values[loOff])     * alpha;
            arr[1] = values[loOff + 1] + (values[hiOff + 1] - values[loOff + 1]) * alpha;
            arr[2] = values[loOff + 2] + (values[hiOff + 2] - values[loOff + 2]) * alpha;
        }
    }

    private applyChannelValue(ch: AnimationChannel, values: Float32Array, index: number): void {
        const trs = this.currentTRS[ch.nodeIndex];
        if (ch.path === 'rotation') {
            const off = index * 4;
            trs.rotation[0] = values[off];
            trs.rotation[1] = values[off + 1];
            trs.rotation[2] = values[off + 2];
            trs.rotation[3] = values[off + 3];
        } else {
            const off = index * 3;
            const arr = ch.path === 'translation' ? trs.translation : trs.scale;
            arr[0] = values[off];
            arr[1] = values[off + 1];
            arr[2] = values[off + 2];
        }
    }

    // ── Skeleton hierarchy ─────────────────────────────────────────

    private computeWorldTransforms(): void {
        // Find root nodes: nodes that are NOT anyone else's child
        const hasParent = new Uint8Array(this.hierarchy.count);
        for (let i = 0; i < this.hierarchy.count; i++) {
            for (const child of this.hierarchy.children[i]) {
                hasParent[child] = 1;
            }
        }

        for (let i = 0; i < this.hierarchy.count; i++) {
            if (!hasParent[i]) {
                this.computeNodeWorld(i, null);
            }
        }
    }

    private computeNodeWorld(nodeIdx: number, parentWorld: Matrix4f | null): void {
        const trs = this.currentTRS[nodeIdx];
        const local = GLBAnimatedModel.trsToMatrix(trs);

        if (parentWorld) {
            GLBAnimatedModel.multiplyInto(this.jointWorldMatrices[nodeIdx], parentWorld, local);
        } else {
            GLBAnimatedModel.copyMatrix(this.jointWorldMatrices[nodeIdx], local);
        }

        for (const child of this.hierarchy.children[nodeIdx]) {
            this.computeNodeWorld(child, this.jointWorldMatrices[nodeIdx]);
        }
    }

    // ── Vertex skinning ────────────────────────────────────────────

    private skinVertices(): void {
        const pts = this.mergedMesh.points;
        const norms = this.mergedMesh.normals;
        const bp = this.bindPositions;
        const bn = this.bindNormals;
        const ji = this.jointIndices;
        const jw = this.jointWeights;

        for (let v = 0; v < pts.length; v++) {
            const vx = bp[v * 3], vy = bp[v * 3 + 1], vz = bp[v * 3 + 2];
            const base = v * 4;

            let sx = 0, sy = 0, sz = 0;

            for (let k = 0; k < 4; k++) {
                const w = jw[base + k];
                if (w === 0) { continue; }
                const m = this.skinMatrices[ji[base + k]];
                sx += w * (m.m11 * vx + m.m12 * vy + m.m13 * vz + m.m14);
                sy += w * (m.m21 * vx + m.m22 * vy + m.m23 * vz + m.m24);
                sz += w * (m.m31 * vx + m.m32 * vy + m.m33 * vz + m.m34);
            }

            pts[v].x = sx;
            pts[v].y = sy;
            pts[v].z = sz;
        }

        // Skin normals (use upper-3×3 of skin matrices — no translation)
        for (let n = 0; n < norms.length; n++) {
            const nx = bn[n * 3], ny = bn[n * 3 + 1], nz = bn[n * 3 + 2];

            // Normals share indices with vertices when per-vertex.
            // When per-face (computed flat normals) we can't really skin them,
            // so just pass through.
            if (n >= pts.length) {
                // Flat normal — recompute from skinned face later if needed.
                // For now leave as bind-pose.
                continue;
            }

            const base = n * 4;
            let snx = 0, sny = 0, snz = 0;
            for (let k = 0; k < 4; k++) {
                const w = jw[base + k];
                if (w === 0) { continue; }
                const m = this.skinMatrices[ji[base + k]];
                snx += w * (m.m11 * nx + m.m12 * ny + m.m13 * nz);
                sny += w * (m.m21 * nx + m.m22 * ny + m.m23 * nz);
                snz += w * (m.m31 * nx + m.m32 * ny + m.m33 * nz);
            }

            // Normalize
            const len = Math.sqrt(snx * snx + sny * sny + snz * snz);
            if (len > 1e-10) {
                norms[n].x = snx / len;
                norms[n].y = sny / len;
                norms[n].z = snz / len;
            }
        }
    }

    // ── Math helpers ───────────────────────────────────────────────

    private static trsToMatrix(trs: NodeTRS): Matrix4f {
        const [tx, ty, tz] = trs.translation;
        const [qx, qy, qz, qw] = trs.rotation;
        const [sx, sy, sz] = trs.scale;

        // Rotation from quaternion
        const xx = qx * qx, yy = qy * qy, zz = qz * qz;
        const xy = qx * qy, xz = qx * qz, yz = qy * qz;
        const wx = qw * qx, wy = qw * qy, wz = qw * qz;

        const m = Matrix4f.constructIdentityMatrix();
        m.m11 = (1 - 2 * (yy + zz)) * sx;
        m.m12 = (2 * (xy - wz)) * sy;
        m.m13 = (2 * (xz + wy)) * sz;
        m.m14 = tx;

        m.m21 = (2 * (xy + wz)) * sx;
        m.m22 = (1 - 2 * (xx + zz)) * sy;
        m.m23 = (2 * (yz - wx)) * sz;
        m.m24 = ty;

        m.m31 = (2 * (xz - wy)) * sx;
        m.m32 = (2 * (yz + wx)) * sy;
        m.m33 = (1 - 2 * (xx + yy)) * sz;
        m.m34 = tz;

        m.m41 = 0; m.m42 = 0; m.m43 = 0; m.m44 = 1;
        return m;
    }

    private static slerp(
        ax: number, ay: number, az: number, aw: number,
        bx: number, by: number, bz: number, bw: number,
        t: number, out: [number, number, number, number]
    ): void {
        let dot = ax * bx + ay * by + az * bz + aw * bw;

        // If dot < 0, negate one quaternion to take the shorter arc
        if (dot < 0) {
            bx = -bx; by = -by; bz = -bz; bw = -bw;
            dot = -dot;
        }

        if (dot > 0.9995) {
            // Very close — linear interpolation
            out[0] = ax + (bx - ax) * t;
            out[1] = ay + (by - ay) * t;
            out[2] = az + (bz - az) * t;
            out[3] = aw + (bw - aw) * t;
        } else {
            const theta = Math.acos(dot);
            const sinTheta = Math.sin(theta);
            const wa = Math.sin((1 - t) * theta) / sinTheta;
            const wb = Math.sin(t * theta) / sinTheta;
            out[0] = ax * wa + bx * wb;
            out[1] = ay * wa + by * wb;
            out[2] = az * wa + bz * wb;
            out[3] = aw * wa + bw * wb;
        }

        // Normalize
        const len = Math.sqrt(out[0] * out[0] + out[1] * out[1] + out[2] * out[2] + out[3] * out[3]);
        if (len > 0) {
            out[0] /= len; out[1] /= len; out[2] /= len; out[3] /= len;
        }
    }

    /** result = A * B  (writes into the pre-allocated `result` matrix). */
    private static multiplyInto(result: Matrix4f, a: Matrix4f, b: Matrix4f): void {
        result.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41;
        result.m12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42;
        result.m13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43;
        result.m14 = a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44;

        result.m21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41;
        result.m22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42;
        result.m23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43;
        result.m24 = a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44;

        result.m31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41;
        result.m32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42;
        result.m33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43;
        result.m34 = a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44;

        result.m41 = a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41;
        result.m42 = a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42;
        result.m43 = a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43;
        result.m44 = a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44;
    }

    private static copyMatrix(dst: Matrix4f, src: Matrix4f): void {
        dst.m11 = src.m11; dst.m12 = src.m12; dst.m13 = src.m13; dst.m14 = src.m14;
        dst.m21 = src.m21; dst.m22 = src.m22; dst.m23 = src.m23; dst.m24 = src.m24;
        dst.m31 = src.m31; dst.m32 = src.m32; dst.m33 = src.m33; dst.m34 = src.m34;
        dst.m41 = src.m41; dst.m42 = src.m42; dst.m43 = src.m43; dst.m44 = src.m44;
    }

    // ── Material parsing (reused from GLBLoader pattern) ───────────

    private static parseMaterials(gltf: any): Array<{ material: Material; doubleSided: boolean }> {
        if (!gltf.materials) { return []; }
        return gltf.materials.map((gltfMat: any) => {
            const mat = new Material();
            const pbr = gltfMat.pbrMetallicRoughness || {};
            const bc = pbr.baseColorFactor || [1, 1, 1, 1];
            const metallic = pbr.metallicFactor !== undefined ? pbr.metallicFactor : 1.0;
            const roughness = pbr.roughnessFactor !== undefined ? pbr.roughnessFactor : 1.0;

            mat.ambientColor = new Vector4f(bc[0] * 0.8, bc[1] * 0.8, bc[2] * 0.8, 1);
            mat.diffuseColor = new Vector4f(
                bc[0] * (1.0 - metallic * 0.5),
                bc[1] * (1.0 - metallic * 0.5),
                bc[2] * (1.0 - metallic * 0.5), 1
            );
            const specIntensity = 0.3 + metallic * 0.7;
            mat.specularColor = new Vector4f(specIntensity, specIntensity, specIntensity, 1);
            mat.shininess = (1.0 - roughness) * 128;
            const ef = gltfMat.emissiveFactor || [0, 0, 0];
            mat.emissiveColor = new Vector4f(ef[0], ef[1], ef[2], 1);
            return { material: mat, doubleSided: gltfMat.doubleSided === true };
        });
    }

    private static defaultMaterial(): Material {
        const mat = new Material();
        mat.ambientColor = new Vector4f(0.3, 0.3, 0.3, 1);
        mat.diffuseColor = new Vector4f(0.8, 0.8, 0.8, 1);
        mat.specularColor = new Vector4f(0.3, 0.3, 0.3, 1);
        mat.emissiveColor = new Vector4f(0, 0, 0, 1);
        mat.shininess = 32;
        return mat;
    }
}
