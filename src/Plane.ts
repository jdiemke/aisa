/**
 * Defines a plane as used for primitive clipping against the
 * view frustum. 
 */

import Vector3 from './Vector3f';

export default class Plane {

    private distance: number;
    private normal: Vector3;

    isInsideClipVolumen(point: Vector3): boolean {
        return this.normal.dot(point) > this.distance;
    }

    isOutsideClipVolumen(point: Vector3): boolean {
        return this.normal.dot(point) < this.distance;
    }

}