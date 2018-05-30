import { Mesh } from "./Mesh";
import { Vector4f } from "../math";

export class AbstractGeometricObject {
    
    protected mesh: Mesh;
    protected inverse: boolean;


    protected buildMesh(points: Array<Vector4f>, index: Array<number>): void {
        const normals: Array<Vector4f> = new Array<Vector4f>();

        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(this.inverse ? normal.normalize().mul(-1) : normal.normalize()); // normalize?
        }

        let faces: Array<{ vertices: number[], normals: number[] }> = new Array();

        for (let i = 0; i < index.length; i += 3) {

            faces.push({
                vertices: [index[0 + i], index[1 + i], index[2 + i]],
                normals: [i / 3, i / 3, i / 3]
            });
        }

        // Create class for objects
        this.mesh = {
            points: points,
            normals: normals,
            faces: faces,
            points2: points.map(() => new Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new Vector4f(0, 0, 0, 0))
        };
    }

    public getMesh(): Mesh {
        return this.mesh;
    }

}
