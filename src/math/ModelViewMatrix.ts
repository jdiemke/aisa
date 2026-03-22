import { Matrix4f } from './Matrix4f';
import { Vector4f } from './Vector4f';

/**
 * Reusable builder for the common "auto-fit orbit camera" model-view
 * matrix used by many demo scenes.
 *
 * The transform chain is (applied right-to-left):
 *  1. Center the model at the origin
 *  2. Uniform scale (auto-fit to a target radius)
 *  3. X rotation (tumble)
 *  4. Y rotation (turntable)
 *  5. Translate to camera distance (with optional lateral shift)
 *
 * Usage:
 * ```ts
 * const mv = new ModelViewMatrix();
 * mv.autoFit(mesh.points);        // compute center, scale, cameraZ
 * // per frame:
 * const mat = mv.getMatrix(time);  // animated orbit matrix
 * ```
 */
export class ModelViewMatrix {

    /** Centre of the model bounding box. */
    public center: Vector4f = new Vector4f(0, 0, 0);

    /** Uniform scale that maps the model into `targetRadius` units. */
    public scale: number = 1;

    /** Camera distance along -Z (negative value). */
    public cameraZ: number = -17.4;

    /** Y-rotation speed (radians per millisecond, sign = direction). */
    public ySpeed: number = -0.0006;

    /** X-rotation speed (radians per millisecond). */
    public xSpeed: number = 0.0004;

    /** Extra uniform scale applied after auto-fit (e.g. to shrink side-by-side views). */
    public extraScale: number = 1;

    /** Target bounding-sphere radius used by {@link autoFit}. */
    public targetRadius: number = 3.0;

    /** Distance multiplier: cameraZ = -(factor * targetRadius). */
    public distanceFactor: number = 5.8;

    // ── Auto-fit ────────────────────────────────────────────────────

    /**
     * Computes {@link center}, {@link scale}, and {@link cameraZ} from
     * the mesh's point cloud so the model fills the viewport.
     */
    public autoFit(points: ArrayLike<Vector4f> | Vector4f[]): void {
        const min = new Vector4f(Infinity, Infinity, Infinity);
        const max = new Vector4f(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (p.x < min.x) min.x = p.x;
            if (p.y < min.y) min.y = p.y;
            if (p.z < min.z) min.z = p.z;
            if (p.x > max.x) max.x = p.x;
            if (p.y > max.y) max.y = p.y;
            if (p.z > max.z) max.z = p.z;
        }

        this.center = new Vector4f(
            (min.x + max.x) / 2,
            (min.y + max.y) / 2,
            (min.z + max.z) / 2
        );

        const dx = max.x - min.x;
        const dy = max.y - min.y;
        const dz = max.z - min.z;
        const radius = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz) / 2, 0.001);

        this.scale = this.targetRadius / radius;
        this.cameraZ = -(this.distanceFactor * this.targetRadius);
    }

    // ── Matrix construction ─────────────────────────────────────────

    /**
     * Builds the model-view matrix for the given elapsed time.
     *
     * @param elapsedTime  Time in milliseconds (drives rotation).
     * @param xShift       Lateral shift as a fraction of |cameraZ|
     *                     (e.g. -0.25 for left, 0.25 for right).
     */
    public getMatrix(elapsedTime: number, xShift: number = 0): Matrix4f {
        const s = this.scale * this.extraScale;
        return Matrix4f.constructTranslationMatrix(xShift * -this.cameraZ, 0, this.cameraZ)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(this.ySpeed * elapsedTime))
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(this.xSpeed * elapsedTime))
            .multiplyMatrix(Matrix4f.constructScaleMatrix(s, s, s))
            .multiplyMatrix(Matrix4f.constructTranslationMatrix(
                -this.center.x, -this.center.y, -this.center.z
            ));
    }
}
