
import { AbstractClipEdge } from './AbstractClipEdge';
import { ClipMode } from './ClipMode';
import { RightClipEdge } from './RightClipEdge';
import { LeftClipEdge } from './LeftClipEdge';
import { BottomClipEdge } from './BottomClipEdge';
import { TopClipEdge } from './TopClipEdge';
import { Vertex } from '@primitives/Vertex';
import { Framebuffer } from '../Framebuffer';

export class SutherlandHodgman2DClipper {

    private clipRegion: Array<AbstractClipEdge>;

    /** Pre-allocated double buffers to avoid per-call array allocations. */
    private bufferA: Array<Vertex> = [];
    private bufferB: Array<Vertex> = [];

    private framebuffer: Framebuffer;

    constructor(framebuffer: Framebuffer) {
        this.setFramebuffer(framebuffer);
    }

    public setFramebuffer(framebuffer: Framebuffer): void {
        if (this.framebuffer === framebuffer) {
            return;
        }
        this.framebuffer = framebuffer;
        this.clipRegion = new Array<AbstractClipEdge>(
            new RightClipEdge(framebuffer),
            new LeftClipEdge(framebuffer),
            new BottomClipEdge(framebuffer),
            new TopClipEdge(framebuffer)
        );
    }

    /**
     * Clips a convex polygon against the clip region using the
     * Sutherland-Hodgman algorithm.
     *
     * Reads the subject directly and skips edges containing the entire polygon.
     * Partially clipped polygons use reusable double buffers. The returned
     * array is independent of the subject and subsequent calls.
     *
     * @param {Array<Vertex>} subject       The polygon vertices to clip
     * @param {ClipMode}      [mode]        Intersection mode (default: GOURAUD)
     * @param {Array<AbstractClipEdge>} [region] Optional clip region override
     * @return {Array<Vertex>} The clipped polygon vertices
     */
    public clipConvexPolygon(
        subject: Array<Vertex>,
        mode: ClipMode = ClipMode.GOURAUD,
        region?: Array<AbstractClipEdge>,
    ): Array<Vertex> {

        const edges = region || this.clipRegion;

        let input = subject;
        let output = this.bufferA;

        for (let j = 0; j < edges.length; j++) {
            const edge: AbstractClipEdge = edges[j];
            const count = input.length;

            if (count === 0) {
                break;
            }

            let firstOutside = 0;
            while (firstOutside < count && edge.isInside(input[firstOutside])) {
                firstOutside++;
            }
            if (firstOutside === count) {
                continue;
            }

            output.length = 0;
            let S = input[count - 1];
            const lastInside = firstOutside < count - 1 && edge.isInside(S);
            let sInside = lastInside;

            for (let i = 0; i < count; i++) {
                const point = input[i];
                const pInside = i < firstOutside ||
                    (i > firstOutside && (i === count - 1 ? lastInside : edge.isInside(point)));

                if (pInside) {
                    if (!sInside) {
                        output.push(edge.computeIntersectionForMode(S, point, mode));
                    }
                    output.push(point);
                } else if (sInside) {
                    output.push(edge.computeIntersectionForMode(S, point, mode));
                }

                S = point;
                sInside = pInside;
            }

            // Swap buffers for the next edge
            input = output;
            output = output === this.bufferA ? this.bufferB : this.bufferA;
        }

        // Return a copy — the internal buffers are reused on the next call
        return input.slice(0);
    }

}
