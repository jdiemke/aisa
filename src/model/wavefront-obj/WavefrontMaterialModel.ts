import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../../math/Vector4f';
import { Material } from '../../shading/material/Material';
import { MtlMaterial } from './MtlMaterial';

/**
 * Tracks a face together with its material name so that a globally
 * sorted draw loop can switch materials on the fly.
 */
export interface TaggedFace {
    face: FlatShadedFace;
    materialName: string;
}

/**
 * A flat-shaded mesh paired with its MTL material name.
 */
export interface MaterialMesh {
    mesh: FlatshadedMesh;
    materialName: string;
}

/**
 * Encapsulates an OBJ model loaded together with its companion MTL
 * material library.
 *
 * All per-material mesh groups are merged into a single
 * {@link FlatshadedMesh} with a parallel {@link TaggedFace} array that
 * maps each face index to its material name.  Engine-ready
 * {@link Material} objects are pre-built from the parsed MTL data.
 *
 * The class also provides {@link sortFacesByDepth} which produces a
 * back-to-front face-index order suitable for the painter's algorithm,
 * keeping the sorting concern inside the model rather than in the scene.
 */
export class WavefrontMaterialModel {

    /** The single merged mesh containing all faces from every material group. */
    public readonly mergedMesh: FlatshadedMesh;

    /** Parallel array — `taggedFaces[i]` describes `mergedMesh.faces[i]`. */
    public readonly taggedFaces: Array<TaggedFace>;

    /** Engine-ready materials keyed by the name used in the MTL file. */
    public readonly engineMaterials: Map<string, Material>;

    /** Raw parsed MTL materials keyed by name. */
    public readonly mtlMaterials: Map<string, MtlMaterial>;

    constructor(
        materialMeshes: Array<MaterialMesh>,
        mtlMaterials: Map<string, MtlMaterial>
    ) {
        this.mtlMaterials = mtlMaterials;

        // ── Pre-build engine Material objects from MTL data ─────────
        this.engineMaterials = new Map();
        mtlMaterials.forEach((mtl: MtlMaterial, name: string) => {
            const mat: Material = new Material();
            mat.ambientColor = new Vector4f(mtl.ambientColor[0], mtl.ambientColor[1], mtl.ambientColor[2], 1);
            mat.diffuseColor = new Vector4f(mtl.diffuseColor[0], mtl.diffuseColor[1], mtl.diffuseColor[2], 1);
            mat.specularColor = new Vector4f(mtl.specularColor[0], mtl.specularColor[1], mtl.specularColor[2], 1);
            mat.emissiveColor = new Vector4f(mtl.emissiveColor[0], mtl.emissiveColor[1], mtl.emissiveColor[2], 1);
            mat.shininess = mtl.specularExponent / 1000 * 128; // map 0–1000 → 0–128
            this.engineMaterials.set(name, mat);
        });

        // ── Merge all material groups into one mesh ─────────────────
        this.taggedFaces = [];
        const allFaces: Array<FlatShadedFace> = [];

        for (const entry of materialMeshes) {
            for (const face of entry.mesh.faces) {
                allFaces.push(face);
                this.taggedFaces.push({ face, materialName: entry.materialName });
            }
        }

        const ref: FlatshadedMesh = materialMeshes[0].mesh;
        this.mergedMesh = {
            faces: allFaces,
            points: ref.points,
            normals: ref.normals,
            transformedPoints: ref.transformedPoints,
            transformedNormals: ref.transformedNormals,
        };
    }

    /**
     * Returns an array of face indices sorted back-to-front by average
     * view-space Z of each triangle's three vertices.
     *
     * **Call this after** the mesh's `transformedPoints` have been updated
     * for the current frame (i.e. after multiplying by the model-view
     * matrix).
     */
    public sortFacesByDepth(): Array<number> {
        const mesh: FlatshadedMesh = this.mergedMesh;
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

    /**
     * Returns the engine {@link Material} for the face at the given index,
     * or `undefined` if the material name was not found in the MTL file.
     */
    public getMaterialForFace(faceIndex: number): Material | undefined {
        return this.engineMaterials.get(this.taggedFaces[faceIndex].materialName);
    }

    /**
     * Returns the material name string for the face at the given index.
     */
    public getMaterialNameForFace(faceIndex: number): string {
        return this.taggedFaces[faceIndex].materialName;
    }

}
