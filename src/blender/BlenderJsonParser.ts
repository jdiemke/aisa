import { FlatShadedFace } from '../geometrical-objects/Face';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math';
import { Face } from './face';
import { Mesh } from './mesh';
import { Vector } from './vector';

export class BlenderJsonParser {

    public static parse(file: any, disp: boolean = true, flat: boolean = false): Array<FlatshadedMesh> {
        const scene: Array<FlatshadedMesh> = [];

        file.forEach((object: Mesh) => {
            const points: Array<Vector4f> = new Array<Vector4f>();
            const normals: Array<Vector4f> = new Array<Vector4f>();

            object.vertices.forEach((v: Vector) => {
                points.push(new Vector4f(v.x, v.y, v.z).mul(2));
            });

            object.normals.forEach((v: Vector) => {
                normals.push(new Vector4f(v.x, v.y, v.z));
            });

            const faces: Array<FlatShadedFace> = [];
            object.faces.forEach((f: Face) => {
                faces.push({
                    normal: f.normals[0],
                    v1: f.vertices[0],
                    v2: f.vertices[1],
                    v3: f.vertices[2],
                });
            });

            const obj: FlatshadedMesh = {
                faces,
                normals,
                points,
                transformedNormals: normals.map(() => new Vector4f(0, 0, 0, 0)),
                transformedPoints: points.map(() => new Vector4f(0, 0, 0, 0)),
            };

            scene.push(obj);
        });

        return scene;
    }

}