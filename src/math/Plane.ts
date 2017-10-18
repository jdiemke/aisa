/**
 * Defines a plane as used for primitive clipping against the
 * view frustum. 
 */

import { Vector3f } from './Vector3f';

export default class Plane {

    private distance: number;
    private normal: Vector3f;

    isInsideClipVolumen(point: Vector3f): boolean {
        return this.normal.dot(point) > this.distance;
    }

    isOutsideClipVolumen(point: Vector3f): boolean {
        return this.normal.dot(point) < this.distance;
    }

}