import { Vector3f } from '../math';
import { AbstractClipEdge } from './AbstractClipEdge';
import { RightClipEdge } from './RightClipEdge';
import { LeftClipEdge } from './LeftClipEdge';
import { BottomClipEdge } from './BottomClipEdge';
import { TopClipEdge } from './TopClipEdge';
import { Vertex } from '../Vertex';

export class SutherlandHodgman2DClipper {



    /**
     * FIXME: optimize by minimizing creation of new arrays
     *
     * @param {Vector3f} v1
     * @param {Vector3f} v2
     * @param {Vector3f} v3
     * @param {number} color
     * @returns {void}
     * @memberof Framebuffer
     */
    public static clipConvexPolygon(subject: Array<Vertex>): Array<Vertex> {

        let output = subject;

        for (let j = 0; j < SutherlandHodgman2DClipper.clipRegion.length; j++) {
            const edge: AbstractClipEdge = SutherlandHodgman2DClipper.clipRegion[j];
            const input = output;
            output = new Array<Vertex>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                if (edge.isInside(point)) {
                    if (!edge.isInside(S)) {
                        output.push(edge.computeIntersection(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside(S)) {
                    output.push(edge.computeIntersection(point, S));
                }
                S = point;
            }
        }

        return output;
    }

    private static clipRegion: Array<AbstractClipEdge> = new Array<AbstractClipEdge>(
        new RightClipEdge(),
        new LeftClipEdge(),
        new BottomClipEdge(),
        new TopClipEdge()
    );

}
