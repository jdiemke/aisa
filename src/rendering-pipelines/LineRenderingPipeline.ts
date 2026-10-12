import type { Framebuffer } from '../Framebuffer';
import { Matrix4f } from '../math/Matrix4f';
import { Vector3f } from '../math/Vector3f';
import { Vector4f } from '../math/Vector4f';
import { ComputationalGeometryUtils } from '../math/Geometry';
import { Sphere } from '../math/Sphere';
import { CohenSutherlandLineClipper } from '../screen-space-clipping/CohenSutherlandLineClipper';

export class LineRenderingPipeline {

    private lineClipper: CohenSutherlandLineClipper;

    constructor(private framebuffer: Framebuffer) {
        this.lineClipper = new CohenSutherlandLineClipper(framebuffer);
    }

    public static project(framebuffer: Framebuffer, point: { x: number, y: number, z: number }): Vector3f {
        return new Vector3f(Math.round((framebuffer.width / 2) + (292 * point.x / (-point.z))),
            Math.round((framebuffer.height / 2) - (point.y * 292 / (-point.z))),
            point.z);
    }

    public nearPlaneClipping(t1: Vector3f, t2: Vector3f, color: number): void {
        const NEAR_PLANE_Z = -1.7;

        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.lineClipper.cohenSutherlandLineClipper(
                LineRenderingPipeline.project(this.framebuffer, t1), LineRenderingPipeline.project(this.framebuffer, t2), color);
        } else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        } else if (t1.z < NEAR_PLANE_Z) {
            const ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            const t3 = new Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.lineClipper.cohenSutherlandLineClipper(
                LineRenderingPipeline.project(this.framebuffer, t1), LineRenderingPipeline.project(this.framebuffer, t3), color);
        } else if (t2.z < NEAR_PLANE_Z) {
            const ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            const t3 = new Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.lineClipper.cohenSutherlandLineClipper(
                LineRenderingPipeline.project(this.framebuffer, t2), LineRenderingPipeline.project(this.framebuffer, t3), color);
        }
    }

    public drawBoundingSphere(sphere: Sphere, matrix: Matrix4f, color: number): void {
        const points: Array<Vector4f> = [];
        const STEPS = 8;
        const STEPS2 = 8;

        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                const pos = ComputationalGeometryUtils.spherePoint(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2)
                    .mul(sphere.getRadius() + 0.01).add(sphere.getCenter());
                pos.w = 1;
                points.push(pos);
            }
        }

        const index: Array<number> = [];
        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2));
                index.push(((STEPS2 * j) + (0 + i) % STEPS2));
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2));

                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2));
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2));
                index.push(((STEPS2 * j) + (0 + i) % STEPS2));
            }
        }

        const points2: Array<Vector3f> = [];
        for (let p = 0; p < points.length; p++) {
            const transformed = matrix.multiplyHom(points[p]);
            points2.push(new Vector3f(transformed.x, transformed.y, transformed.z));
        }

        for (let i = 0; i < index.length; i += 3) {
            const v1 = points2[index[i]];
            const v2 = points2[index[i + 1]];
            const v3 = points2[index[i + 2]];
            this.nearPlaneClipping(v1, v2, color);
            this.nearPlaneClipping(v1, v3, color);
            this.nearPlaneClipping(v3, v2, color);
        }
    }
}
