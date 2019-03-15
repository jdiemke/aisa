import { Matrix4f, Vector3f } from '../math/index';

export class ThirdPersonCamera {

    public computeMatrix(eyePosition: Vector3f, targetPosition: Vector3f, up: Vector3f): Matrix4f {

        const translation: Matrix4f = Matrix4f.constructTranslationMatrix(
            -eyePosition.x,
            -eyePosition.y,
            -eyePosition.z
        );

        const forwardVector: Vector3f = eyePosition.sub(targetPosition).normalize();
        const leftVector: Vector3f = up.cross(forwardVector).normalize();
        const upVector: Vector3f = forwardVector.cross(leftVector);

        const rotation: Matrix4f = new Matrix4f();

        rotation.m11 = leftVector.x;
        rotation.m12 = leftVector.y;
        rotation.m13 = leftVector.z;
        rotation.m14 = 0.0;

        rotation.m21 = upVector.x;
        rotation.m22 = upVector.y;
        rotation.m23 = upVector.z;
        rotation.m24 = 0.0;

        rotation.m31 = forwardVector.x;
        rotation.m32 = forwardVector.y;
        rotation.m33 = forwardVector.z;
        rotation.m34 = 0.0;

        rotation.m41 = 0.0;
        rotation.m42 = 0.0;
        rotation.m43 = 0.0;
        rotation.m44 = 1.0;

        return rotation.multiplyMatrix(translation);
    }

}
