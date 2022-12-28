import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';

export class Icosahedron extends AbstractGeometricObject {

    public constructor() {
        super();

        const phi = (1 + Math.sqrt(5)) * 0.5;
        const a = 0.5;
        const b = a * 2 / (2 * phi);

        const points: Array<Vector4f> = [
            new Vector4f(-b, 0, a), new Vector4f(b, 0, a), new Vector4f(-b, 0, -a), new Vector4f(b, 0, -a),
            new Vector4f(0, a, b), new Vector4f(0, a, -b), new Vector4f(0, -a, b), new Vector4f(0, -a, -b),
            new Vector4f(a, b, 0), new Vector4f(-a, b, 0), new Vector4f(a, -b, 0), new Vector4f(-a, -b, 0)
        ];

        const index: Array<number> = [
            1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4,
            1, 8, 4, 1, 10, 8, 10, 3, 8, 8, 3, 5,
            3, 2, 5, 3, 7, 2, 3, 10, 7, 10, 6, 7,
            6, 11, 7, 6, 0, 11, 6, 1, 0, 10, 1, 6,
            11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7
        ];

        this.buildMesh(points, index);
    }

}
