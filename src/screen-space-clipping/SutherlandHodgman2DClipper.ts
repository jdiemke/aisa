import { Vector3f } from '../math';
import { AbstractClipEdge } from './AbstractClipEdge';
import { RightClipEdge } from './RightClipEdge';
import { LeftClipEdge } from './LeftClipEdge';
import { BottomClipEdge } from './BottomClipEdge';
import { TopClipEdge } from './TopClipEdge';

export class SutherlandHodgman2DClipper {

    private static clipRegion = new Array<AbstractClipEdge>(
        new RightClipEdge(),
        new LeftClipEdge(),
        new BottomClipEdge(),
        new TopClipEdge()
    );

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
    public static clipConvexPolygon(subject: Array<Vector3f>): Array<Vector3f> {

        let output = subject;

        for (let j = 0; j < SutherlandHodgman2DClipper.clipRegion.length; j++) {
            const edge = SutherlandHodgman2DClipper.clipRegion[j];
            const input = output;
            output = new Array<Vector3f>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                if (edge.isInside(point)) {
                    if (!edge.isInside(S)) {
                        output.push(edge.computeIntersection(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside(S)) {
                    output.push(edge.computeIntersection(S, point));
                }
                S = point;
            }
        }

        return output;
    }

}
