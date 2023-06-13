import { CullFace } from '../CullFace';
import { Framebuffer } from '../Framebuffer';

export class AbstractRenderingPipeline {

    public NEAR_PLANE_Z: number = -1.7;
    public alpha: number;
    private cullMode: CullFace = CullFace.BACK;

    constructor(protected framebuffer: Framebuffer) { }

    public setCullFace(face: CullFace): void {
        this.cullMode = face;
    }

    public setAlpha(alpha: number): void {
        this.alpha = Math.max(Math.min(alpha, 1.0), 0.0);
    }

    public isInFrontOfNearPlane(p: { x: number; y: number; z: number }): boolean {
        return p.z < this.NEAR_PLANE_Z;
    }

    /**
     * based on signed polygon area computation:
     * http://www.faqs.org/faqs/graphics/algorithms-faq/
     * https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
     * http://csharphelper.com/blog/2014/07/calculate-the-area-of-a-polygon-in-c/
     * http://mathworld.wolfram.com/PolygonArea.html
     *
     * @private
     * @param {{ x: number, y: number, z: number }} v1
     * @param {{ x: number, y: number, z: number }} v2
     * @param {{ x: number, y: number, z: number }} v3
     * @returns {boolean}
     * @memberof Framebuffer
     *
     */
    public isTriangleCCW(v1: { x: number, y: number, z: number },
        v2: { x: number, y: number, z: number },
        v3: { x: number, y: number, z: number }): boolean {
        if (this.cullMode == CullFace.DISABLED) {
            return true;
        }
        const det: number =
            v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v1.y - v1.x * v3.y;
        if (this.cullMode == CullFace.BACK) {
            return det < 0.0;
        } else {
            return det > 0.0;
        }
    }

    public isTriangleCCW2(v1: { x: number, y: number, z: number },
        v2: { x: number, y: number, z: number },
        v3: { x: number, y: number, z: number },
        v4: { x: number, y: number, z: number }): boolean {
            if (this.cullMode == CullFace.DISABLED) {
                return true;
            }
        const det: number =
            v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v4.y - v4.x * v3.y +
            v4.x * v1.y - v1.x * v4.y;
        if (this.cullMode === CullFace.BACK) {
            return det < 0.0;
        } else {
            return det > 0.0;
        }
    }

}
