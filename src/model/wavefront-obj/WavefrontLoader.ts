import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Face } from '../../blender/face';
import { Mesh } from '../../blender/mesh';
import { convertToMeshArray } from '../../blender/parseUtils';
import { FlatShadedFace } from '../../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../../math/Vector4f';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { MtlLoader } from './MtlLoader';
import { MtlMaterial } from './MtlMaterial';
import { MaterialMesh, WavefrontMaterialModel } from './WavefrontMaterialModel';

export class WavefrontLoader {

    private flatMeshes: Array<FlatshadedMesh>;
    private texMeshes: Array<TexturedMesh>;

    private constructor(flatMeshes: Array<FlatshadedMesh> = [], texMeshes: Array<TexturedMesh> = []) {
        this.flatMeshes = flatMeshes;
        this.texMeshes = texMeshes;
    }

    /**
     * Returns the loaded flat-shaded meshes.
     * Use {@link WavefrontLoader.loadModel} to obtain an instance.
     */
    public getMesh(): Array<FlatshadedMesh> {
        return this.flatMeshes;
    }

    /**
     * Returns the loaded textured meshes.
     * Use {@link WavefrontLoader.loadTexturedModel} to obtain an instance.
     */
    public getTexturedMesh(): Array<TexturedMesh> {
        return this.texMeshes;
    }

    /**
     * Creates a WavefrontLoader instance with the flat-shaded meshes loaded
     * from the given OBJ file, so that {@link getMesh} can be called on it.
     */
    public static loadModel(filename: any): Promise<WavefrontLoader> {
        return WavefrontLoader.load(filename).then(
            (meshes: Array<FlatshadedMesh>) => new WavefrontLoader(meshes, [])
        );
    }

    /**
     * Creates a WavefrontLoader instance with the textured meshes loaded
     * from the given OBJ file, so that {@link getTexturedMesh} can be called on it.
     */
    public static loadTexturedModel(filename: any): Promise<WavefrontLoader> {
        return WavefrontLoader.loadWithTexture(filename).then(
            (meshes: Array<TexturedMesh>) => new WavefrontLoader([], meshes)
        );
    }

    /**
     * Loads an OBJ file together with its companion MTL material library.
     *
     * The meshes are split by `usemtl` assignments so each returned
     * {@link MaterialMesh} contains only the faces that share the same
     * material, paired with the material name for look-up in the
     * returned materials map.
     *
     * @param objUrl  URL of the .obj file (e.g. via `require('@assets/...')`)
     * @param mtlUrl  URL of the .mtl file (e.g. via `require('@assets/...')`)
     * @returns A promise resolving to a {@link WavefrontMaterialModel}.
     */
    public static loadWithMaterial(
        objUrl: string,
        mtlUrl: string
    ): Promise<WavefrontMaterialModel> {
        return Promise.all([
            fetch(objUrl).then((r: Response) => r.text()).then((text: string) => convertToMeshArray(text)),
            MtlLoader.load(mtlUrl)
        ]).then(([meshes, materials]: [Array<Mesh>, Map<string, MtlMaterial>]) => {
            // ── Merge all mesh vertices & normals into single arrays ──
            const allPoints: Array<Vector4f> = [];
            const allNormals: Array<Vector4f> = [];
            const allFacesWithMaterial: Array<{ face: Face; pointOffset: number; normalOffset: number }> = [];

            for (const mesh of meshes) {
                const pointOffset: number = allPoints.length;
                const normalOffset: number = allNormals.length;

                for (const v of mesh.vertices) {
                    allPoints.push(new Vector4f(v.x, v.y, v.z));
                }
                for (const v of mesh.normals) {
                    allNormals.push(new Vector4f(v.x, v.y, v.z).normalize());
                }
                for (const face of mesh.faces) {
                    allFacesWithMaterial.push({ face, pointOffset, normalOffset });
                }
            }

            const transformedPoints: Array<Vector4f> = allPoints.map(() => new Vector4f(0, 0, 0, 0));
            const transformedNormals: Array<Vector4f> = allNormals.map(() => new Vector4f(0, 0, 0, 0));

            // ── Group faces by material name ────────────────────────
            const materialMeshes: Array<MaterialMesh> = [];
            const facesByMaterial: Map<string, Array<FlatShadedFace>> = new Map();

            for (const { face, pointOffset, normalOffset } of allFacesWithMaterial) {
                const matName: string = face.materialName || '__default__';
                if (!facesByMaterial.has(matName)) {
                    facesByMaterial.set(matName, []);
                }
                facesByMaterial.get(matName).push({
                    v1: face.vertices[0] + pointOffset,
                    v2: face.vertices[1] + pointOffset,
                    v3: face.vertices[2] + pointOffset,
                    n1: face.normals[0] + normalOffset,
                    n2: face.normals[1] + normalOffset,
                    n3: face.normals[2] + normalOffset,
                });
            }

            facesByMaterial.forEach((flatFaces: Array<FlatShadedFace>, matName: string) => {
                const subMesh: FlatshadedMesh = {
                    faces: flatFaces,
                    normals: allNormals,
                    points: allPoints,
                    transformedNormals,
                    transformedPoints,
                };
                materialMeshes.push({ mesh: subMesh, materialName: matName });
            });

            return new WavefrontMaterialModel(materialMeshes, materials);
        });
    }

    /** @deprecated Use {@link loadModel} for an instance-based API. */
    public static load(filename: any): Promise<Array<FlatshadedMesh>> {
        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).then((meshes: Array<Mesh>) => {
            return BlenderJsonParser.parse(meshes);
        });
    }

    /** @deprecated Use {@link loadTexturedModel} for an instance-based API. */
    public static loadWithTexture(filename: any): Promise<Array<TexturedMesh>> {
        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).then((meshes: Array<Mesh>) => {
            return BlenderJsonParser.getBlenderScene(meshes);
        });
    }

}
