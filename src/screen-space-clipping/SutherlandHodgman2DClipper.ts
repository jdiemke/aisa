
import { AbstractClipEdge } from './AbstractClipEdge';
import { ClipMode } from './ClipMode';
import { RightClipEdge } from './RightClipEdge';
import { LeftClipEdge } from './LeftClipEdge';
import { BottomClipEdge } from './BottomClipEdge';
import { TopClipEdge } from './TopClipEdge';
import { Vertex } from '../Vertex';
import { Framebuffer } from '../Framebuffer';

export class SutherlandHodgman2DClipper {

    private clipRegion: Array<AbstractClipEdge>;

    /** Pre-allocated double buffers to avoid per-call array allocations. */
    private bufferA: Array<Vertex> = [];
    private bufferB: Array<Vertex> = [];

    constructor(private framebuffer: Framebuffer) {
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
     * Uses double-buffered arrays to avoid allocating new arrays on each
     * clip-edge iteration and caches isInside results to halve the number
     * of inside/outside tests.
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

        // Seed bufferA with the subject polygon
        let input = this.bufferA;
        let output = this.bufferB;
        input.length = subject.length;
        for (let k = 0; k < subject.length; k++) {
            input[k] = subject[k];
        }

        for (let j = 0; j < edges.length; j++) {
            const edge: AbstractClipEdge = edges[j];
            output.length = 0;

            if (input.length === 0) {
                break;
            }

            let S = input[input.length - 1];
            let sInside = edge.isInside(S);

            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                const pInside = edge.isInside(point);

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
            const temp = input;
            input = output;
            output = temp;
        }

        // Return a copy — the internal buffers are reused on the next call
        return input.slice(0);
    }

}
