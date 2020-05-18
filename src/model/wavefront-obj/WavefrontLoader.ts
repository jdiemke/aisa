import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Mesh } from '../../blender/mesh';
import { convertToMeshArray } from '../../blender/parseUtils';
import { FlatshadedMesh } from '../../geometrical-objects/FlatshadedMesh';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';

export class WavefrontLoader {

    public static load(filename: any): Promise<Array<FlatshadedMesh>> {
        return fetch(filename.default).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).then((meshes: Array<Mesh>) => {
            return BlenderJsonParser.parse(meshes);
        });
    }

    public static loadWithTexture(filename: any): Promise<Array<TexturedMesh>> {
        return fetch(filename.default).then((response: Response) => {
            return response.text();
        }).then((text: string): Array<Mesh> => {
            return convertToMeshArray(text);
        }).then((meshes: Array<Mesh>) => {
            return BlenderJsonParser.getBlenderScene(meshes);
        });
    }

    private constructor() {

    }

}
