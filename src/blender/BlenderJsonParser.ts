import { FlatShadedFace } from '../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/index';
import { BlenderScene } from './BlenderScene';
import { Face } from './face';
import { Mesh } from './mesh';
import { Vector } from './vector';

export class BlenderJsonParser {

    public static parse(blenderScene: BlenderScene, invert: boolean = false): Array<FlatshadedMesh> {
        const scene: Array<FlatshadedMesh> = [];

        blenderScene.forEach((object: Mesh) => {
            const points: Array<Vector4f> = new Array<Vector4f>();
            const normals: Array<Vector4f> = new Array<Vector4f>();

            object.vertices.forEach((v: Vector) => {
                points.push(new Vector4f(v.x, v.y, v.z).mul(2));
            });

            object.normals.forEach((v: Vector) => {
                normals.push(
                    invert ? new Vector4f(v.x, v.y, v.z).normalize().mul(-1) : new Vector4f(v.x, v.y, v.z).normalize()
                );
            });

            const faces: Array<FlatShadedFace> = [];
            object.faces.forEach((f: Face) => {
                faces.push({
                    n1: f.normals[0],
                    n2: f.normals[1],
                    n3: f.normals[2],
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
