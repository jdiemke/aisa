/**
 * Defines a plane as used for primitive clipping against the
 * view frustum.
 */
import { Vector4f } from './';

export class Plane {

    public distance: number;
    public normal: Vector4f;

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

    public isInside(point: Vector4f): boolean {
        const dot: number = point.dot(this.normal);
        return dot >= this.distance;
    }

    public computeIntersection(p1: Vector4f, p2: Vector4f): Vector4f {
        const dot1: number = p1.dot(this.normal);
        const dot2: number = p2.dot(this.normal);
        const scale: number = (this.distance - dot1) / (dot2 - dot1);
        return p2.sub(p1).mul(scale).add(p1);
    }

}
