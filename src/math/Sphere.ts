import { Matrix4f } from './Matrix4f';
import { Vector4f } from './index';
import { BoundingVolume } from './BoundingVolume';
import Plane from './Plane';
import { Vector3f } from './Vector3f';

export class Sphere implements BoundingVolume {

    private center: Vector4f;
    private radius: number;

    public constructor(position: Vector4f, radius: number) {
        this.center = position;
        this.radius = radius;
    }

    public isInsidePositiveHalfSpace(plane: Plane): boolean {
        console.log('abstand: '+(plane.getNormal().dot(this.center)));
        console.log('abstand2:'+ (plane.getNormal().dot(this.center) - plane.getDistance()) );
        console.log('radius: '+this.radius);
        let dist = (plane.getNormal().dot(this.center) - plane.getDistance()) > this.radius;
        return dist;
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