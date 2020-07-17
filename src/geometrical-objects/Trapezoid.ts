import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';
import { Mesh } from './Mesh';

export class Trapezoid extends AbstractGeometricObject {

    public constructor() {
        super();

        const a = 0.5;
        const b = 0.05;

        const points: Array<Vector4f> = [
            new Vector4f(-b, a, -b),
            new Vector4f(b, a, -b),
            new Vector4f(a, -a, -a),
            new Vector4f(-a, -a, -a),
            new Vector4f(-b, a, b),
            new Vector4f(b, a, b),
            new Vector4f(a, -a, a),
            new Vector4f(-a, -a, a)
        ];

        const index: Array<number> = [
            0, 1, 2,
            0, 2, 3,
            5, 4, 7,
            5, 7, 6,
            1, 5, 6,
            1, 6, 2,
            4, 0, 3,
            4, 3, 7,
            4, 5, 1,
            4, 1, 0
        ];

        this.buildMesh(points, index);
    }

}
