import { FlatShadedFace } from '../geometrical-objects/FlatShadedFace';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/index';
import { BlenderScene } from './BlenderScene';
import { Face } from './face';
import { Mesh } from './mesh';
import { Vector } from './vector';
import { TexturedMesh } from '../rendering-pipelines/TexturedMesh';
import { TextureCoordinate } from '../TextureCoordinate';
import { ComputationalGeometryUtils } from '../math/Geometry';
import { TexCoord } from './tex-coord';

export class BlenderJsonParser {

    public static parse(blenderScene: BlenderScene, invert: boolean = false): Array<FlatshadedMesh> {
        const scene: Array<FlatshadedMesh> = [];

        blenderScene.forEach((object: Mesh) => {
            const points: Array<Vector4f> = new Array<Vector4f>();
            const normals: Array<Vector4f> = new Array<Vector4f>();

            object.vertices.forEach((v: Vector) => {
                points.push(new Vector4f(v.x, v.y, v.z).mul(1));
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

    public static getBlenderScene(
        file: BlenderScene, disp: boolean = true): Array<TexturedMesh> {
        const scene: Array<TexturedMesh> = [];

        file.forEach((object: Mesh) => {
            const points: Array<Vector4f> = new Array<Vector4f>();
            const normals: Array<Vector4f> = new Array<Vector4f>();
            let coords: Array<TextureCoordinate>;

            if (object.uv) {
                coords = [];
                object.uv.forEach((v: TexCoord) => {
                    const uv: TextureCoordinate = new TextureCoordinate();
                    uv.u = v.u;
                    uv.v = 1.0 - v.v;
                    coords.push(uv);
                });
            }

            object.vertices.forEach((v: Vector) => {
                // some transformation in order for the vertices to be in worldspace
                if (disp)
                    points.push(new Vector4f(v.x, v.y, v.z).mul(2).add(new Vector4f(0, -2.7, 0, 0)));
                else
                    points.push(new Vector4f(v.x, v.y, v.z).mul(2));
            });

            object.normals.forEach((v: Vector) => {
                normals.push(new Vector4f(v.x, v.y, v.z));
            });

            const sphere = new ComputationalGeometryUtils().computeBoundingSphere(points);
            sphere.getCenter().w = 1;

            // Create class for objects
            const obj = {
                points,
                normals,
                uv: coords,           // NO!!!
                faces: object.faces, // NOO!!!
                points2: points.map(() => new Vector4f(0, 0, 0, 0)),
                normals2: normals.map(() => new Vector4f(0, 0, 0, 0)),
                boundingSphere: sphere, // NO!!!
                name: object.name /// NO!
            };
            scene.push(obj);
        });

        return scene;
    }

}
