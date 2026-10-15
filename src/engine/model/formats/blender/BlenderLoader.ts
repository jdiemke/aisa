import { BlenderJsonParser, BlenderScene } from '@engine/model/formats/blender';
import { FlatshadedMesh } from '@engine/geometry/objects';
import { TexturedMesh } from '@engine/rendering/pipelines';

/**
 * Load Wavefront OBJ file that was converted via obj2json utility.
 * to save the convertToMeshArray step
 * renamed to JSX file to load file at runtime
 */
export class BlenderLoader {

    public static load(filename: string): Promise<Array<FlatshadedMesh>> {
        return fetch(filename).then((response: Response) => {
            return response.json();
        }).then((meshes: BlenderScene) => {
            return BlenderJsonParser.parse(meshes);
        });
    }

    public static loadWithTexture(filename: string): Promise<Array<TexturedMesh>> {
        return fetch(filename).then((response: Response) => {
            return response.json();
        }).then((meshes: BlenderScene) => {
            return BlenderJsonParser.getBlenderScene(meshes, false);
        });
    }

    private constructor() {

    }
}
