import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Mesh } from '../../blender/mesh';
import { convertToMeshArray } from '../../blender/parseUtils';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';

export class WavefrontLoader {

    public static load(filename: string): Promise<Array<FlatshadedMesh>> {
        return fetch(filename).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).then((meshes: Array<Mesh>) => {
            return BlenderJsonParser.parse(meshes);
        });
    }

    private constructor() {

    }

}
