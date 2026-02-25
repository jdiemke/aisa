import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Mesh } from '../../blender/mesh';
import { convertToMeshArray } from '../../blender/parseUtils';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';

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
