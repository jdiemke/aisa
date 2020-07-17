import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';

export class Cube extends AbstractGeometricObject {

    public constructor() {
        super();
        const a: number = 0.5;

        const points: Array<Vector4f> = [
            new Vector4f(-a, -a, -a),
            new Vector4f(a, -a, -a),
            new Vector4f(a, a, -a),
            new Vector4f(-a, a, -a),
            new Vector4f(-a, -a, a),
            new Vector4f(a, -a, a),
            new Vector4f(a, a, a),
            new Vector4f(-a, a, a)
        ];

        const index: Array<number> = [
            0, 2, 1, 0, 3, 2, 5, 7, 4, 5, 6, 7, 1, 6, 5, 1, 2, 6, 4, 3, 0, 4, 7, 3, 4, 1, 5, 4, 0, 1, 3, 6, 2, 3, 7, 6
        ];

        this.buildMesh(points, index);
    }

}
