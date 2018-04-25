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
        return polygon;
    }

}
