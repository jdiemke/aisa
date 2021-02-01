import { Matrix4f, Vector3f } from '../math';

export class EulerAngleCamera {

    protected position: Vector3f;
    protected rx: number;
    protected ry: number;
    protected rz: number;

    constructor(position: Vector3f, rx: number, ry: number, rz: number) {
        this.position = position;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
    }

    public getViewMatrix(): Matrix4f {
        const rz = Matrix4f.constructZRotationMatrix(-this.rz);
        const rx = Matrix4f.constructXRotationMatrix(-this.rx);
        const ry = Matrix4f.constructYRotationMatrix(-this.ry);

        const translation = Matrix4f.constructTranslationMatrix(-this.position.x, -this.position.y, -this.position.z);

        return rx.multiplyMatrix(ry).multiplyMatrix(rz).multiplyMatrix(translation);
    }

    public getPosition(): Vector3f {
        return this.position;
    }

}
