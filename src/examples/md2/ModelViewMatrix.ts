import { Matrix4f } from '../../math/index';

/**
 * The primary purpose of the model view matrix class is to reduce
 * the instanciation of temporary matrix classes by reusing existing instances.
 */
export class ModelViewMatrix {

    private currtentMatrix: Matrix4f;
    private tempMatrix: Matrix4f;
    private temp: Matrix4f;
    private transformation: Matrix4f;

    public constructor() {
        this.currtentMatrix = new Matrix4f();
        this.tempMatrix = new Matrix4f();
        this.temp = new Matrix4f();
        this.transformation = new Matrix4f();
    }

    public getMatrix(): Matrix4f {
        return this.currtentMatrix;
    }

    public setIdentity(): void {
        this.currtentMatrix.setIdentityMatrix();
    }

    public multMatrix(mat: Matrix4f): void {
        this.currtentMatrix = this.currtentMatrix.multiplyMatrix(mat);
    }

    public translate(x: number, y: number, z: number): void {
        this.transformation.setTranslationMatrix(x, y, z);
        this.applyMat();
    }

    public scal(x: number, y: number, z: number): void {
        this.transformation.setScaleMatrix(x, y, z);
        this.applyMat();
    }

    public xRotate(x: number): void {
        this.transformation.setXRotationMatrix(x);
        this.applyMat();
    }

    public zRotate(x: number): void {
        this.transformation.setZRotationMatrix(x);
        this.applyMat();
    }

    public yRotate(x: number): void {
        this.transformation.setYRotationMatrix(x);
        this.applyMat();
    }

    public rotate(x,y,z, angle: number): void {
        this.transformation.setRotationMatrix(x,y,z,angle);
        this.applyMat();
    }

    private applyMat(): void {

        this.tempMatrix.multiply2(this.currtentMatrix, this.transformation);
        // switch back and front
        this.temp = this.currtentMatrix;
        this.currtentMatrix = this.tempMatrix;
        this.tempMatrix = this.temp;
    }

}
