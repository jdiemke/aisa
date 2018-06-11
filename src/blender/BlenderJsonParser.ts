import { FlatShadedFace } from '../geometrical-objects/Face';
import { FlatshadedMesh } from '../geometrical-objects/Mesh';
import { Vector4f } from '../math';
import { ComputationalGeometryUtils } from '../math/Geometry';

export class BlenderJsonParser {

    public static parse(file: any, disp: boolean = true, flat: boolean = false): Array<FlatshadedMesh> {
        const scene: Array<FlatshadedMesh> = [];

        file.forEach((object) => {
            let points: Array<Vector4f> = new Array<Vector4f>();
            let normals: Array<Vector4f> = new Array<Vector4f>();

            object.vertices.forEach((v) => {
                    points.push(new Vector4f(v.x, v.y, v.z).mul(2));
            });

            object.normals.forEach((v) => {
                normals.push(new Vector4f(v.x, v.y, v.z));
            });

            let faces: Array<FlatShadedFace> = [];
            object.faces.forEach(f => {
                faces.push({
                    v1: f.vertices[0],
                    v2: f.vertices[1],
                    v3: f.vertices[2],
                    normal: f.normals[0]
                })
            });

            let sphere = new ComputationalGeometryUtils().computeBoundingSphere(points);
            sphere.getCenter().w = 1;


            // Create class for objects
            let obj: FlatshadedMesh = {
                points,
                normals,
                faces, // NOO!!!
                transformedPoints: points.map(() => new Vector4f(0, 0, 0, 0)),
                transformedNormals: normals.map(() => new Vector4f(0, 0, 0, 0)),
                boundingSphere: sphere,
            };
            scene.push(obj);
        });

        return scene;
    }

}
