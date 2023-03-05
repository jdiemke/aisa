import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';

export class Plane extends AbstractGeometricObject {

    public constructor() {
        super();

        const a = 0.5;

        const points: Array<Vector4f> = [
            new Vector4f(-a, 0, a),
            new Vector4f(a, 0, a),
            new Vector4f(a, 0, -a),
            new Vector4f(-a, 0, -a),
        ];

        const index: Array<number> = [
            0, 1, 2, 2, 3, 0
        ];

        this.buildMesh(points, index);
    }

}
