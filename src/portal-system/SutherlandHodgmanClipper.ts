import { Vector4f } from '../math';
import { Plane } from '../math/Plane';
import { Polygon } from './Polygon';

/**
 * Used for Portal Clipping
 *
 * @export
 * @class SutherlandHodgmanClipper
 * @see https://www.phatcode.net/res/224/files/html/ch65/65-01.html
 * @see http://www.cubic.org/docs/3dclip.htm
 */
export class SutherlandHodgmanClipper {

    public static clip(polygon: Polygon, planes: Array<Plane>): Polygon {
        let output: Array<Vector4f> = polygon.vertices;

        for (let j: number = 0; j < planes.length; j++) {
            const plane: Plane = planes[j];
            const input: Array<Vector4f> = output;
            output = new Array<Vector4f>();
            let S: Vector4f = input[input.length - 1];

            for (let i: number = 0; i < input.length; i++) {
                const point: Vector4f = input[i];
                if (plane.isInside(point)) {
                    if (!plane.isInside(S)) {
                        output.push(plane.computeIntersection(S, point));
                    }
                    output.push(point);
                } else if (plane.isInside(S)) {
                    output.push(plane.computeIntersection(S, point));
                }
                S = point;
            }
        }

        return new Polygon(output);
    }

}
