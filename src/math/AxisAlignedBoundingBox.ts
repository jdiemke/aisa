import { BoundingVolume } from './BoundingVolume';
import { Plane } from './Plane';
import { Vector3f } from './Vector3f';

export class AxisAlignedBoundingBox implements BoundingVolume {

    private min: Vector3f;
    private max: Vector3f;

    public constructor(min: Vector3f, max: Vector3f) {
        this.min = min;
        this.max = max;
    }

    public intersects(aabb: AxisAlignedBoundingBox): boolean {
        return (this.min.x < aabb.max.x && this.min.y < aabb.max.y && this.min.z < aabb.max.z &&
            this.max.x > aabb.min.x && this.max.y > aabb.min.y && this.max.z < aabb.min.z);
    }

    /**
     * @see https://fgiesen.wordpress.com/2010/10/17/view-frustum-culling/
     * @param plane
     */
    public isInsidePositiveHalfSpace(plane: Plane): boolean {
        console.info('plane', plane);
        throw new Error('Method not implemented.');
    }

}
