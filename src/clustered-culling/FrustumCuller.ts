import { BoundingVolume } from '../math/BoundingVolume';
import { Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { Plane } from '../math/Plane';
import { Sphere } from '../math/Sphere';
import { Vector3f } from '../math/Vector3f';

export class FrustumCuller {

    private planes: Array<Plane>;
    private pos: Vector4f;
    private normals: Array<Vector4f>;
    private near: number;
    private far: number;

    public constructor() {
        this.planes = new Array<Plane>();

        for (let i: number = 0; i < 6; i++) {
            this.planes.push(new Plane(new Vector4f(0, 0, 0, 0), 0));
        }

        this.pos = new Vector4f(0, 0, 0, 0);

        const DISTANCE: number = 192;

        const SCREEN_HEIGHT: number = 320 / 2;
        let SCREEN_WIDTH = 200 / 2;

        let HORIZONTAL_FIELD_OF_VIEW = 2.0 * Math.atan(SCREEN_HEIGHT / (2.0 * DISTANCE));
        let VERTICAL_FIELD_OF_VIEW = 2.0 * Math.atan(SCREEN_WIDTH / (2.0 * DISTANCE));

        let HALF_HORIZONTAL_FOV = HORIZONTAL_FIELD_OF_VIEW * 1.0;
        let HALF_VERTICAL_FOV = VERTICAL_FIELD_OF_VIEW * 1.0;

        const NEAR_DISTANCE: number = 1.7;
        const FAR_DISTANCE: number = 30.0;

        this.near = NEAR_DISTANCE;
        this.far = FAR_DISTANCE;

        this.normals = [
            new Vector4f(Math.cos(-HALF_HORIZONTAL_FOV), 0, Math.sin(-HALF_HORIZONTAL_FOV), 0.0),
            new Vector4f(-Math.cos(HALF_HORIZONTAL_FOV), 0, -Math.sin(HALF_HORIZONTAL_FOV), 0.0),
            new Vector4f(0, -Math.cos(HALF_VERTICAL_FOV), -Math.sin(HALF_VERTICAL_FOV), 0.0),
            new Vector4f(0, Math.cos(-HALF_VERTICAL_FOV), Math.sin(-HALF_VERTICAL_FOV), 0.0),
            new Vector4f(0.0, 0.0, -1.0, 0.0),
            new Vector4f(0.0, 0.0, 1.0, 0.0)
        ];
    }

    public updateFrustum(modelViewMatrix: Matrix4f, position: Vector3f): void {
        const inverseRotation: Matrix4f = modelViewMatrix.getInverseRotation();

        inverseRotation.multiplyHomArr(this.normals[0], this.planes[0].normal); // left
        inverseRotation.multiplyHomArr(this.normals[1], this.planes[1].normal); // right
        inverseRotation.multiplyHomArr(this.normals[2], this.planes[2].normal); // bottom
        inverseRotation.multiplyHomArr(this.normals[3], this.planes[3].normal); // top
        inverseRotation.multiplyHomArr(this.normals[4], this.planes[4].normal); // near
        inverseRotation.multiplyHomArr(this.normals[5], this.planes[5].normal); // far

        this.pos.x = -position.x;
        this.pos.y = -position.y;
        this.pos.z = -position.z;

        this.planes[0].distance = -this.planes[0].normal.dot(this.pos);
        this.planes[1].distance = -this.planes[1].normal.dot(this.pos);
        this.planes[2].distance = -this.planes[2].normal.dot(this.pos);
        this.planes[3].distance = -this.planes[3].normal.dot(this.pos);
        // TODO: bugfix near and far plane!
        this.planes[4].distance = -this.planes[4].normal.dot(this.pos) + this.near;
        this.planes[5].distance = -this.planes[3].normal.dot(this.pos) - this.far;
    }

    public isPotentiallyVisible(boundingVolume: Sphere): boolean {
        for (let i = 0; i < this.planes.length; i++) {
            if (!boundingVolume.isInsidePositiveHalfSpace(this.planes[i])) {
                return false;
            }
        }
        return true;
    }

}
