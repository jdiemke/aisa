import { Vector4f } from '../math/Vector4f';
import { AbstractGeometricObject } from './AbstractGeometricObject';
import { Mesh } from './Mesh';
import { Vector3f } from '../math/Vector3f';

export class Torus extends AbstractGeometricObject {

    public constructor(invert: boolean = false) {
        super();

        const points: Array<Vector4f> =  [];

        const STEPS = 15;
        const STEPS2 = 12;
        // find a better solution for inversion
        // maybe configuration by constructor of base class and construction of geometry
        // in template method pattern method
        this.inverse = invert;

        for (let i = 0; i < STEPS; i++) {
            const frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            const frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            const up = new Vector3f(0.0, 4.0, 0);
            const right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                const pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new Vector4f(pos.x, pos.y, pos.z, 1.0));
            }
        }

        const index: Array<number> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length);
            }
        }

        this.buildMesh(points, index);
    }

    public torusFunction(alpha: number): Vector3f {
        return new Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }

}
