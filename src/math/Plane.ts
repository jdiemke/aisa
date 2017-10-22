/**
 * Defines a plane as used for primitive clipping against the
 * view frustum. 
 */
import { Vector4f } from './index';

export default class Plane {

    private distance: number;
    private normal: Vector4f;

    constructor(normal: Vector4f, distance: number) {
        this.normal = normal;
        this.distance = distance;
    }

    public getNormal(): Vector4f {
        return this.normal;
    }

    public getDistance(): number {
        return this.distance;
    }

}