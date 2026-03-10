import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../../math/Vector4f';
import { Material } from '../../shading/material/Material';
import { GLBLoader } from './GLBLoader';

/**
 * Represents a fully loaded GLB model.
 *
 * All mesh primitives are merged into a single {@link FlatshadedMesh} with
 * a parallel tag array that maps each face to its material.  Engine-ready
 * {@link Material} objects are pre-built from the glTF PBR data.
 *
 * The class also provides {@link sortFacesByDepth} which produces a
 * back-to-front face-index order suitable for the painter's algorithm.
 */
export class GLBModel {

    /** The single merged mesh containing all faces. */
    public readonly mergedMesh: FlatshadedMesh;

    /** Material for each face (parallel to `mergedMesh.faces`). */
    private readonly faceMaterials: Array<Material>;

    /** Material name for each face (parallel to `mergedMesh.faces`). */
    private readonly faceMatNames: Array<string>;

    /** Whether each face belongs to a doubleSided material (parallel). */
    private readonly facesDoubleSided: Array<boolean>;

    /** Engine-ready materials keyed by name. */
    public readonly engineMaterials: Map<string, Material>;

    constructor(meshGroups: Array<InstanceType<typeof GLBLoader.MeshGroup>>) {
        this.engineMaterials = new Map();
        this.faceMaterials = [];
        this.faceMatNames = [];
        this.facesDoubleSided = [];

        const allPoints:  Array<Vector4f> = [];
        const allNormals: Array<Vector4f> = [];
        const allFaces:   Array<FlatShadedFace> = [];

        for (const group of meshGroups) {
            const pointOffset  = allPoints.length;
            const normalOffset = allNormals.length;

            for (const p of group.mesh.points) {
                allPoints.push(p);
            }
            for (const n of group.mesh.normals) {
                allNormals.push(n);
            }

            for (const face of group.mesh.faces) {
                allFaces.push({
                    v1: face.v1 + pointOffset,
                    v2: face.v2 + pointOffset,
                    v3: face.v3 + pointOffset,
                    n1: face.n1 + normalOffset,
                    n2: face.n2 + normalOffset,
                    n3: face.n3 + normalOffset,
                } as FlatShadedFace);

                this.faceMaterials.push(group.material);
                this.faceMatNames.push(group.materialName);
                this.facesDoubleSided.push(group.doubleSided);
            }

            this.engineMaterials.set(group.materialName, group.material);
        }

        const transformedPoints  = allPoints.map(() => new Vector4f(0, 0, 0, 0));
        const transformedNormals = allNormals.map(() => new Vector4f(0, 0, 0, 0));

        this.mergedMesh = {
            faces: allFaces,
            points: allPoints,
            normals: allNormals,
            transformedPoints,
            transformedNormals,
        } as FlatshadedMesh;
    }

    /**
     * Returns an array of face indices sorted back-to-front by average
     * view-space Z of each triangle's three vertices.
     *
     * **Call this after** the mesh's `transformedPoints` have been updated
     * for the current frame.
     */
    public sortFacesByDepth(): Array<number> {
        const mesh = this.mergedMesh;
        const faceOrder: Array<number> = Array.from(
            { length: mesh.faces.length }, (_, k) => k
        );

        faceOrder.sort((a: number, b: number) => {
            const fa: FlatShadedFace = mesh.faces[a];
            const fb: FlatShadedFace = mesh.faces[b];
            const za: number =
                mesh.transformedPoints[fa.v1].z +
                mesh.transformedPoints[fa.v2].z +
                mesh.transformedPoints[fa.v3].z;
            const zb: number =
                mesh.transformedPoints[fb.v1].z +
                mesh.transformedPoints[fb.v2].z +
                mesh.transformedPoints[fb.v3].z;
            return za - zb;
        });

        return faceOrder;
    }

    /** Returns the engine {@link Material} for the face at the given index. */
    public getMaterialForFace(faceIndex: number): Material {
        return this.faceMaterials[faceIndex];
    }

    /** Returns the material name string for the face at the given index. */
    public getMaterialNameForFace(faceIndex: number): string {
        return this.faceMatNames[faceIndex];
    }

    /** Returns whether the face belongs to a doubleSided material. */
    public isFaceDoubleSided(faceIndex: number): boolean {
        return this.facesDoubleSided[faceIndex];
    }

    /**
     * Computes the axis-aligned bounding box of the model's points
     * (in glTF world space, with node transforms applied) and returns
     * the centre and bounding-sphere radius.
     */
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
        const radius = Math.sqrt(dx * dx + dy * dy + dz * dz) / 2;

        return { center: new Vector4f(cx, cy, cz, 1), radius };
    }
}
