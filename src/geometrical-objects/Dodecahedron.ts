import { AbstractGeometricObject } from './AbstractGeometricObject';
import { Vector4f } from '../math/Vector4f';

export class Dodecahedron extends AbstractGeometricObject {

    constructor() {

        super();

        // https://github.com/chiptune/lol3d/blob/master/index.html
        const phi = (1 + Math.sqrt(5)) * 0.5;
        const a = 1;
        const b = 1 / phi;
        const c = 2 - phi;

        const points: Array<Vector4f> = [
            new Vector4f(c, 0, a), new Vector4f(-c, 0, a), new Vector4f(-b, b, b), new Vector4f(0, a, c),
            new Vector4f(b, b, b), new Vector4f(b, -b, b), new Vector4f(0, -a, c), new Vector4f(-b, -b, b),
            new Vector4f(c, 0, -a), new Vector4f(-c, 0, -a), new Vector4f(-b, -b, -b), new Vector4f(0, -a, -c),
            new Vector4f(b, -b, -b), new Vector4f(b, b, -b), new Vector4f(0, a, -c), new Vector4f(-b, b, -b),
            new Vector4f(1, c, 0), new Vector4f(-a, c, 0), new Vector4f(-1, -c, 0), new Vector4f(a, -c, 0)
        ];

        const index: Array<number> = [
            0, 4, 1, 1, 3, 2, 1, 4, 3, 1, 7, 0,
            0, 6, 5, 0, 7, 6, 8, 12, 9, 9, 11, 10,
            9, 12, 11, 9, 15, 8, 8, 14, 13, 8, 15, 14,
            14, 3, 13, 13, 4, 16, 13, 3, 4, 3, 14, 2,
            2, 15, 17, 2, 14, 15, 11, 6, 10, 10, 7, 18,
            10, 6, 7, 6, 11, 5, 5, 12, 19, 5, 11, 12,
            16, 4, 19, 19, 0, 5, 19, 4, 0, 19, 12, 16,
            16, 8, 13, 16, 12, 8, 17, 15, 18, 18, 9, 10,
            18, 15, 9, 18, 7, 17, 17, 1, 2, 17, 7, 1
        ];

        this.buildMesh(points, index);
    }

}
