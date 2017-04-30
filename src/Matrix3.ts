import Vector3 from './Vector3f';

export default class Matrix3f {

    public m11: number;
    public m12: number;
    public m13: number;

    public m21: number;
    public m22: number;
    public m23: number;

    public m31: number;
    public m32: number;
    public m33: number;

    static constructXRotationMatrix(angle: number) {
        let matrix = new Matrix3f();

        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = Math.cos(angle);
        matrix.m23 = -Math.sin(angle);

        matrix.m31 = 0.0;
        matrix.m32 = Math.sin(angle);
        matrix.m33 = Math.cos(angle);

        return matrix;
    }

    static constructYRotationMatrix(angle: number) {
        let matrix = new Matrix3f();

        matrix.m11 = Math.cos(angle);
        matrix.m12 = 0.0;
        matrix.m13 = Math.sin(angle);

        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;

        matrix.m31 = -Math.sin(angle);
        matrix.m32 = 0.0;
        matrix.m33 = Math.cos(angle);

        return matrix;
    }

    static constructZRotationMatrix(angle: number) {
        let matrix = new Matrix3f();

        matrix.m11 = Math.cos(angle);
        matrix.m12 = -Math.sin(angle);
        matrix.m13 = 0.0;

        matrix.m21 = Math.sin(angle);
        matrix.m22 = Math.cos(angle);
        matrix.m23 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;

        return matrix;
    }

    static constructScaleMatrix(xScale: number, yScale: number, zScale: number) {
        let matrix = new Matrix3f();

        matrix.m11 = xScale;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = yScale;
        matrix.m23 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = zScale;

        return matrix;
    }

    public multiplyMatrix(matrix: Matrix3f): Matrix3f {
        let result = new Matrix3f();

        result.m11 = this.m11 * matrix.m11 + this.m12 * matrix.m21 + this.m13 * matrix.m31;
        result.m21 = this.m21 * matrix.m11 + this.m22 * matrix.m21 + this.m23 * matrix.m31;
        result.m31 = this.m31 * matrix.m11 + this.m32 * matrix.m21 + this.m33 * matrix.m31;

        result.m12 = this.m11 * matrix.m12 + this.m12 * matrix.m22 + this.m13 * matrix.m32;
        result.m22 = this.m21 * matrix.m12 + this.m22 * matrix.m22 + this.m23 * matrix.m32;
        result.m32 = this.m31 * matrix.m12 + this.m32 * matrix.m22 + this.m33 * matrix.m32;

        result.m13 = this.m11 * matrix.m13 + this.m12 * matrix.m23 + this.m13 * matrix.m33;
        result.m23 = this.m21 * matrix.m13 + this.m22 * matrix.m23 + this.m23 * matrix.m33;
        result.m33 = this.m31 * matrix.m13 + this.m32 * matrix.m23 + this.m33 * matrix.m33;

        return result;

    }

    public multiply(vector: Vector3): Vector3 {
        return new Vector3(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z,
            this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z,
            this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z);
    }
}