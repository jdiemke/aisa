import { BoundingVolume } from '@engine/math/BoundingVolume';
import { Vector4f } from '@engine/math/Vector4f';
import { Matrix4f } from '@engine/math/Matrix4f';
import { Plane } from '@engine/math/Plane';

export class Sphere implements BoundingVolume {

    private center: Vector4f;
    private radius: number;

    public constructor(position: Vector4f, radius: number) {
        this.center = position;
        this.radius = radius;
    }

    /**
     *
     * @param {Plane} plane
     * @returns {boolean}
     * @memberof Sphere
     */
    public isInsidePositiveHalfSpace(plane: Plane): boolean {
        return plane.getNormal().dot(this.center) - plane.getDistance() > - this.radius;
    }

    public getTran(mat: Matrix4f): Vector4f {
        return mat.multiplyHom(this.center);
    }

    public getRadius(): number {
        return this.radius;
    }

    public getCenter(): Vector4f {
        return this.center;
    }

}
