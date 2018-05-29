import { Vector4f } from '../math/Vector4f';

export class Cube {
    
    public getCubeMesh(): any {
        let points: Array<Vector4f> = new Array<Vector4f>();
        let normals: Array<Vector4f> = new Array<Vector4f>();
        let index: Array<number> = new Array<number>();

        // https://github.com/chiptune/lol3d/blob/master/index.html
        let a = 0.5;

        points = [
            new Vector4f(-a, -a, -a),
            new Vector4f(a, -a, -a),
            new Vector4f(a, a, -a),
            new Vector4f(-a, a, -a),
            new Vector4f(-a, -a, a),
            new Vector4f(a, -a, a),
            new Vector4f(a, a, a),
            new Vector4f(-a, a, a)
        ];

        index = [
            0, 2, 1, 0, 3, 2, 5, 7, 4, 5, 6, 7, 1, 6, 5, 1, 2, 6, 4, 3, 0, 4, 7, 3, 4, 1, 5, 4, 0, 1, 3, 6, 2, 3, 7, 6
        ];

        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }

        let faces: Array<{ vertices: number[], normals: number[] }> = new Array();

        for (let i = 0; i < index.length; i += 3) {

            faces.push({
                vertices: [index[0+i],index[1+i],index[2+i]],
                normals: [i/3,i/3,i/3]
            });
        }

        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            faces: faces,
            points2: points.map(() => new Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new Vector4f(0, 0, 0, 0))
        };

        return obj;
    }

}
