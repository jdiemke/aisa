import { Canvas } from '../Canvas';
import { Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { Plane } from '../math/Plane';
import { Sphere } from '../math/Sphere';
import { Vector3f } from '../math/Vector3f';

export class FrustumCuller {

    private planes: Array<Plane>;
    private pos: Vector4f;
    private normals: Array<Vector4f>;

    public constructor() {
        this.planes = new Array<Plane>();

        for (let i: number = 0; i < 4; i++) {
            this.planes.push(new Plane(new Vector4f(0, 0, 0, 0), 0));
        }

        this.pos = new Vector4f(0, 0, 0, 0);

        // for some reason this is fucked up
        // READ: http://www.cubic.org/docs/3dclip.htm
        this.normals = [
            //  new Vector4f(Math.cos(-HALF_HORIZONTAL_FOV), 0, Math.sin(-HALF_HORIZONTAL_FOV), 0.0),
            //  new Vector4f(-Math.cos(HALF_HORIZONTAL_FOV), 0, -Math.sin(HALF_HORIZONTAL_FOV), 0.0),
            //  new Vector4f(0, -Math.cos(HALF_VERTICAL_FOV), -Math.sin(HALF_VERTICAL_FOV), 0.0),
            // new Vector4f(0, Math.cos(-HALF_VERTICAL_FOV), Math.sin(-HALF_VERTICAL_FOV), 0.0),
            // new Vector4f(0.0, 0.0, -1.0, 0.0),
            // new Vector4f(0.0, 0.0, 1.0, 0.0)
        ];

        const halfWidth =  Canvas.WIDTH / 2;
        const halfHeight = Canvas.HEIGHT / 2;
        const magicWidth =  292;
        const vertices: Array<Vector4f> = [
            new Vector4f(-halfWidth / 2, -halfHeight / 2, magicWidth),
            new Vector4f(halfWidth / 2, -halfHeight / 2, magicWidth),
            new Vector4f(halfWidth / 2, halfHeight / 2, magicWidth),
            new Vector4f(-halfWidth / 2, halfHeight / 2, magicWidth),
        ];
        for (let i: number = 0; i < vertices.length; i++) {
            const normal: Vector4f = vertices[i].cross(vertices[(i + 1) % vertices.length]).normalize().mul(-1);
            this.normals.push(normal);
        }

    }

    public updateFrustum(modelViewMatrix: Matrix4f, position: Vector3f): void {
        const inverseRotation: Matrix4f = modelViewMatrix.getInverseRotation();

        inverseRotation.multiplyHomArr(this.normals[0], this.planes[0].normal); // left
        inverseRotation.multiplyHomArr(this.normals[1], this.planes[1].normal); // right
        inverseRotation.multiplyHomArr(this.normals[2], this.planes[2].normal); // bottom
        inverseRotation.multiplyHomArr(this.normals[3], this.planes[3].normal); // top
        // inverseRotation.multiplyHomArr(this.normals[4], this.planes[4].normal); // near
        // inverseRotation.multiplyHomArr(this.normals[5], this.planes[5].normal); // far

        this.pos.x = -position.x;
        this.pos.y = -position.y;
        this.pos.z = -position.z;

        this.planes[0].distance = -this.planes[0].normal.dot(this.pos);
        this.planes[1].distance = -this.planes[1].normal.dot(this.pos);
        this.planes[2].distance = -this.planes[2].normal.dot(this.pos);
        this.planes[3].distance = -this.planes[3].normal.dot(this.pos);
        // TODO: bugfix near and far plane!
        // this.planes[4].distance = -this.planes[4].normal.dot(this.pos) + this.near;
        // this.planes[5].distance = -this.planes[3].normal.dot(this.pos) - this.far;
    }

    public getPlanes(): Array<Plane> {
        return this.planes;
    }

    public isPotentiallyVisible(boundingVolume: Sphere): boolean {
        for (let i: number = 0; i < this.planes.length; i++) {
            if (!boundingVolume.isInsidePositiveHalfSpace(this.planes[i])) {
                return false;
            }
        }
        return true;
    }

}
