import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';
import { Mesh } from './Mesh';

export class Pyramid extends AbstractGeometricObject {

    public constructor() {
        super();

        let phi = (1 + Math.sqrt(5)) * 0.5;
        let a = 0.5;
        let b = a * 2 / (2 * phi);

        const points: Array<Vector4f> = [
            new Vector4f(0, a, 0),
            new Vector4f(a, -a, -a),
            new Vector4f(-a, -a, -a),
            new Vector4f(a, -a, a),
            new Vector4f(-a, -a, a)
        ];

        const index: Array<number> = [
            0, 1, 2,
            0, 3, 1,
            0, 4, 3,
            0, 2, 4
        ];

        this.buildMesh(points, index);
    }

}
