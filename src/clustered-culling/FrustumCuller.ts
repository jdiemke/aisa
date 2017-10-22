import { Sphere } from '../math/Sphere';
import { Vector4f } from '../math/index';
import { BoundingVolume } from '../math/BoundingVolume';
import Plane from "../math/Plane";
import { Matrix4f } from "../math/Matrix4f";
import { Vector3f } from "../math/Vector3f";

export class FrustumCuller {

    private planes: Array<Plane>;
    mat: Matrix4f;

    public updateFrustum(modelViewMatrix: Matrix4f, position: Vector3f): void {
        this.planes = [];
        this.mat = modelViewMatrix;
        let nearPlaneNormal = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(0.0, 0.0, -1.0, 0.0));
        let farPlaneNormal = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(0.0, 0.0, 1.0, 0.0));
        let fov = 108;
        let fov2 = 88;
        let right = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(-Math.cos(Math.PI * 2 / 360 * fov), 0, -Math.sin(Math.PI * 2 / 360 * fov), 0.0));
        let left = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(Math.cos(Math.PI * 2 / 360 * -fov), 0, Math.sin(-Math.PI * 2 / 360 * fov), 0.0));
        let bottom = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(0, -Math.cos(Math.PI * 2 / 360 * fov2), -Math.sin(Math.PI * 2 / 360 * fov2), 0.0));
        let top = modelViewMatrix.getInverseRotation().multiplyHom(new Vector4f(0, Math.cos(Math.PI * 2 / 360 * -fov2), Math.sin(-Math.PI * 2 / 360 * fov2), 0.0));



        let pos = new Vector4f(-position.x, -position.y, -position.z);

        this.planes.push(new Plane(nearPlaneNormal, -nearPlaneNormal.dot(pos) ));
        this.planes.push(new Plane(farPlaneNormal, -farPlaneNormal.dot(pos) - 71));
        this.planes.push(new Plane(left, -left.dot(pos)));
        this.planes.push(new Plane(right, -right.dot(pos)));


        this.planes.push(new Plane(bottom, -bottom.dot(pos)));
        this.planes.push(new Plane(top, -top.dot(pos)));
    }

    public isPotentiallyVisible(boudingVolume: Sphere): boolean {
        for (let i = 0; i < this.planes.length; i++) {
            if (!boudingVolume.isInsidePositiveHalfSpace(this.planes[i])) {
                return false;
            }
        }

        return true;
    }

}