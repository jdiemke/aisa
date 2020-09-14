import { Matrix4f, Vector3f } from '../math';

export class BasicCamera {

    protected position: Vector3f;
    protected yaw: number;
    protected pitch: number;
    protected roll: number;

    constructor(position: Vector3f, yaw: number, pitch: number, roll: number) {
        this.position = position;
        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
    }

    public getViewMatrix(): Matrix4f {
        const roll = Matrix4f.constructZRotationMatrix(-this.roll);
        const pitch = Matrix4f.constructXRotationMatrix(-this.pitch);
        const yaw = Matrix4f.constructYRotationMatrix(-this.yaw);

        const translation = Matrix4f.constructTranslationMatrix(-this.position.x, -this.position.y, -this.position.z);

        return roll.multiplyMatrix(pitch).multiplyMatrix(yaw).multiplyMatrix(translation);
    }

    public getPosition(): Vector3f {
        return this.position;
    }

}
