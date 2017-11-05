import { Sphere } from '../math/Sphere';
import { Vector4f } from '../math/index';
import { BoundingVolume } from '../math/BoundingVolume';
import Plane from "../math/Plane";
import { Matrix4f } from "../math/Matrix4f";
import { Vector3f } from "../math/Vector3f";

export class FrustumCuller {

    private planes: Array<Plane>;

    public updateFrustum(modelViewMatrix: Matrix4f, position: Vector3f): void {
        const DISTANCE = 192;
        let fov = 2.0 * Math.atan(320/2 / (2.0 * DISTANCE))*0.5;
        let fov2 = 2.0 * Math.atan(200/2 / (2.0 * DISTANCE))*0.5;

        const HORIZONTAL_FOV: number = 39;
        const VERTICAL_FOV: number = 28;
        const NEAR_DISTANCE: number = 1.7;
        const FAR_DISTANCE: number = 30.0;

        console.log('fov: '+fov + " " + fov2)
        console.log('fovr: '+((Math.PI * 2 / 360 * HORIZONTAL_FOV)) + " " + ((Math.PI * 2 / 360 * VERTICAL_FOV)))
        


        this.planes = [];

        const inverseRotation = modelViewMatrix.getInverseRotation();

        let nearPlaneNormal = inverseRotation.multiplyHom(new Vector4f(0.0, 0.0, -1.0, 0.0));
        let farPlaneNormal = inverseRotation.multiplyHom(new Vector4f(0.0, 0.0, 1.0, 0.0));

     /*   let right = inverseRotation.multiplyHom(new Vector4f(-Math.cos(Math.PI * 2 / 360 * HORIZONTAL_FOV), 0, -Math.sin(Math.PI * 2 / 360 * HORIZONTAL_FOV), 0.0));
        let left = inverseRotation.multiplyHom(new Vector4f(Math.cos(Math.PI * 2 / 360 * -HORIZONTAL_FOV), 0, Math.sin(-Math.PI * 2 / 360 * HORIZONTAL_FOV), 0.0));
        let bottom = inverseRotation.multiplyHom(new Vector4f(0, -Math.cos(Math.PI * 2 / 360 * VERTICAL_FOV), -Math.sin(Math.PI * 2 / 360 * VERTICAL_FOV), 0.0));
        let top = inverseRotation.multiplyHom(new Vector4f(0, Math.cos(Math.PI * 2 / 360 * -VERTICAL_FOV), Math.sin(-Math.PI * 2 / 360 * VERTICAL_FOV), 0.0));
*/
        let right = inverseRotation.multiplyHom(new Vector4f(-Math.cos(fov), 0, -Math.sin(fov), 0.0));
        let left = inverseRotation.multiplyHom(new Vector4f(Math.cos(-fov), 0, Math.sin(-fov), 0.0));
        let bottom = inverseRotation.multiplyHom(new Vector4f(0, -Math.cos(fov2), -Math.sin(fov2), 0.0));
        let top = inverseRotation.multiplyHom(new Vector4f(0, Math.cos(-fov2), Math.sin(-fov2), 0.0));


        let pos = new Vector4f(-position.x, -position.y, -position.z);

        this.planes.push(new Plane(nearPlaneNormal, -nearPlaneNormal.dot(pos) + NEAR_DISTANCE));
        this.planes.push(new Plane(farPlaneNormal, -farPlaneNormal.dot(pos) - FAR_DISTANCE));
        this.planes.push(new Plane(left, -left.dot(pos)));
        this.planes.push(new Plane(right, - right.dot(pos)));
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