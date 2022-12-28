
import { AbstractClipEdge } from './AbstractClipEdge';
import { RightClipEdge } from './RightClipEdge';
import { LeftClipEdge } from './LeftClipEdge';
import { BottomClipEdge } from './BottomClipEdge';
import { TopClipEdge } from './TopClipEdge';
import { Vertex } from '../Vertex';
import { Framebuffer } from '../Framebuffer';

export class SutherlandHodgman2DClipper {


    private clipRegion: Array<AbstractClipEdge>;

    constructor(private framebuffer: Framebuffer) {
        this.clipRegion = new Array<AbstractClipEdge>(
            new RightClipEdge(framebuffer),
            new LeftClipEdge(framebuffer),
            new BottomClipEdge(framebuffer),
            new TopClipEdge(framebuffer)
        );

    }

    /**
     * FIXME: optimize by minimizing creation of new arrays
     *
     * @param {Array<Vertex>} subject
     * @return {Array<Vertex>}
     */
    public clipConvexPolygon(subject: Array<Vertex>): Array<Vertex> {

        let output = subject;

        for (let j = 0; j < this.clipRegion.length; j++) {
            const edge: AbstractClipEdge = this.clipRegion[j];
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
                    output.push(edge.computeIntersection(S, point));
                }
                S = point;
            }
        }

        return output;
    }

}
