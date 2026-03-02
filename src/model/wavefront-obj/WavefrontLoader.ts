import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Face } from '../../blender/face';
import { Mesh } from '../../blender/mesh';
import { convertToMeshArray } from '../../blender/parseUtils';
import { Vector } from '../../blender/vector';
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
            const materialMeshes: Array<MaterialMesh> = [];

            for (const mesh of meshes) {
                // Group faces by material name
                const facesByMaterial: Map<string, Array<Face>> = new Map();

                for (const face of mesh.faces) {
                    const matName: string = face.materialName || '__default__';
                    if (!facesByMaterial.has(matName)) {
                        facesByMaterial.set(matName, []);
                    }
                    facesByMaterial.get(matName).push(face);
                }

                // Convert shared vertex/normal data once
                const points: Array<Vector4f> = mesh.vertices.map(
                    (v: Vector) => new Vector4f(v.x, v.y, v.z)
                );
                const normals: Array<Vector4f> = mesh.normals.map(
                    (v: Vector) => new Vector4f(v.x, v.y, v.z).normalize()
                );

                // Create one FlatshadedMesh per material group
                facesByMaterial.forEach((faces: Array<Face>, matName: string) => {
                    const flatFaces: Array<FlatShadedFace> = faces.map((f: Face) => ({
                        n1: f.normals[0],
                        n2: f.normals[1],
                        n3: f.normals[2],
                        v1: f.vertices[0],
                        v2: f.vertices[1],
                        v3: f.vertices[2],
                    }));

                    const subMesh: FlatshadedMesh = {
                        faces: flatFaces,
                        normals,
                        points,
                        transformedNormals: normals.map(() => new Vector4f(0, 0, 0, 0)),
                        transformedPoints: points.map(() => new Vector4f(0, 0, 0, 0)),
                    };

                    materialMeshes.push({ mesh: subMesh, materialName: matName });
                });
            }

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
