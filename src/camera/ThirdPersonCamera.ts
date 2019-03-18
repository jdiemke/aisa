import { Matrix4f, Vector3f } from '../math/index';

/**
 * http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Eiserloh_Squirrel_JuicingYourCameras.pdf
 * https://www.gamasutra.com/blogs/ItayKeren/20150511/243083/Scroll_Back_The_Theory_and_Practice_of_Cameras_in_SideScrollers.php
 * https://www.gameenginebook.com/resources/gameconn2011-final.pdf
 * https://en.wikipedia.org/wiki/Virtual_camera_system
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.924.6065&rep=rep1&type=pdf
 * https://gamedev.stackexchange.com/questions/123543/damping-the-camera-lookat-rotation/123553#123553
 * https://mashable.com/2017/04/03/video-game-cameras-suck/?europe=true#0bJy.os1Qmqs
 * https://www.gamasutra.com/blogs/SamanthaStahlke/20170919/305840/Prototyping_a_Dynamic_Camera_System.php
 * https://code.tutsplus.com/tutorials/unity3d-third-person-cameras--mobile-11230
 */
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
