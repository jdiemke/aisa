/**
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_00_introduction.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_00_research.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_01_pipeline.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_02_transformations.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_03_projections.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_04_lighting.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_05_rasterization.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_06_texturing.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_07_shadows.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_08_transparencyReflection.pdf
 * https://cg.informatik.uni-freiburg.de/teaching.htm
 * @author Johannes Diemke
 * @since 2017-05-07
 */

import Vector3f from './Vector3f';
import Vector4f from './Vector4f';

export default class Matrix4f {

    public m11: number;
    public m12: number;
    public m13: number;
    public m14: number;

    public m21: number;
    public m22: number;
    public m23: number;
    public m24: number;

    public m31: number;
    public m32: number;
    public m33: number;
    public m34: number;

    public m41: number;
    public m42: number;
    public m43: number;
    public m44: number;

    static constructIdentityMatrix(): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = 0.0;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    public transpose(): Matrix4f {
        let transpose = new Matrix4f();

        transpose.m11 = this.m11;
        transpose.m12 = this.m21;
        transpose.m13 = this.m31;
        transpose.m14 = this.m41;

        transpose.m21 = this.m12;
        transpose.m22 = this.m22;
        transpose.m23 = this.m32;
        transpose.m24 = this.m42;

        transpose.m31 = this.m13;
        transpose.m32 = this.m23;
        transpose.m33 = this.m33;
        transpose.m34 = this.m43;

        transpose.m41 = this.m14;
        transpose.m42 = this.m24;
        transpose.m43 = this.m34;
        transpose.m44 = this.m44;

        return transpose;
    }

    public computeNormalMatrix(): Matrix4f {
        // http://www.lighthouse3d.com/tutorials/glsl-12-tutorial/the-normal-matrix/
        // https://www.gamedev.net/forums/topic/443040-inverse-of-modelview-matrix/
        // https://computergraphics.stackexchange.com/questions/1502/why-is-the-transposed-inverse-of-the-model-view-matrix-used-to-transform-the-nor
        return this.inverse().transpose();
    }

    public inverse(): Matrix4f {
        // Inverse hack
        // - only works when the MV matrix only contains
        // translation and rotation and scaling that is the same in all directions

        let inverseTranslation =  Matrix4f.constructIdentityMatrix();
        inverseTranslation.m14 = -this.m14;
        inverseTranslation.m24 = -this.m24;
        inverseTranslation.m34 = -this.m34;

        let scale = 1.0/ Math.sqrt(this.m11 * this.m11 + this.m12 * this.m12 + this.m13 * this.m13);
        let inverseRotation = Matrix4f.constructIdentityMatrix();
        inverseRotation.m11 = this.m11* scale;
        inverseRotation.m21 = this.m12* scale;
        inverseRotation.m31 = this.m13* scale;

        inverseRotation.m12 = this.m21* scale;
        inverseRotation.m22 = this.m22* scale;
        inverseRotation.m32 = this.m23* scale;

        inverseRotation.m13 = this.m31* scale;
        inverseRotation.m23 = this.m32* scale;
        inverseRotation.m33 = this.m33* scale;

        return inverseRotation.multiplyMatrix(inverseTranslation);
    }

    static constructShadowMatrix(): Matrix4f {
        let planePoint: Vector3f = new Vector3f(0, -1.5, 0);
        let planeNormal: Vector3f = new Vector3f(0, 1, 0);
        let lightPosition: Vector3f = new Vector3f(17, 13, 17);

        let d = -planePoint.dot(planeNormal);
        let NdotL = planeNormal.x * lightPosition.x +
            planeNormal.y * lightPosition.y +
            planeNormal.z * lightPosition.z;

        let shadowMatrix: Matrix4f = new Matrix4f();

        shadowMatrix.m11 = NdotL + d - lightPosition.x * planeNormal.x;
        shadowMatrix.m12 = - lightPosition.x * planeNormal.y;
        shadowMatrix.m13 = - lightPosition.x * planeNormal.z;
        shadowMatrix.m14 = - lightPosition.x * d;

        shadowMatrix.m21 = - lightPosition.y * planeNormal.x;
        shadowMatrix.m22 = NdotL + d - lightPosition.y * planeNormal.y;
        shadowMatrix.m23 = - lightPosition.y * planeNormal.z;
        shadowMatrix.m24 = - lightPosition.y * d;

        shadowMatrix.m31 = - lightPosition.z * planeNormal.x;
        shadowMatrix.m32 = - lightPosition.z * planeNormal.y;
        shadowMatrix.m33 = NdotL + d - lightPosition.z * planeNormal.z;
        shadowMatrix.m34 = - lightPosition.z * d;

        shadowMatrix.m41 = - planeNormal.x;
        shadowMatrix.m42 = - planeNormal.y;
        shadowMatrix.m43 = - planeNormal.z;
        shadowMatrix.m44 = NdotL;

        return shadowMatrix;
    }

    static constructTranslationMatrix(tx: number, ty: number, tz: number): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = tx;

        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = ty;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = tz;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    static constructXRotationMatrix(alpha: number): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = Math.cos(alpha);
        matrix.m23 = -Math.sin(alpha);
        matrix.m24 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = Math.sin(alpha);
        matrix.m33 = Math.cos(alpha);
        matrix.m34 = 0.0;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    static constructYRotationMatrix(alpha: number): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = Math.cos(alpha);
        matrix.m12 = 0.0;
        matrix.m13 = Math.sin(alpha);
        matrix.m14 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;

        matrix.m31 = -Math.sin(alpha);
        matrix.m32 = 0.0;
        matrix.m33 = Math.cos(alpha);
        matrix.m34 = 0.0;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    static constructZRotationMatrix(alpha: number): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = Math.cos(alpha);
        matrix.m12 = -Math.sin(alpha);
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;

        matrix.m21 = Math.sin(alpha);
        matrix.m22 = Math.cos(alpha);
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = 0.0;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    static constructScaleMatrix(sx: number, sy: number, sz: number): Matrix4f {
        let matrix: Matrix4f = new Matrix4f();

        matrix.m11 = sx;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;

        matrix.m21 = 0.0;
        matrix.m22 = sy;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;

        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = sz;
        matrix.m34 = 0.0;

        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;

        return matrix;
    }

    public multiplyMatrix(matrix: Matrix4f): Matrix4f {
        let result = new Matrix4f();

        result.m11 = this.m11 * matrix.m11 + this.m12 * matrix.m21 + this.m13 * matrix.m31 + this.m14 * matrix.m41;
        result.m21 = this.m21 * matrix.m11 + this.m22 * matrix.m21 + this.m23 * matrix.m31 + this.m24 * matrix.m41;
        result.m31 = this.m31 * matrix.m11 + this.m32 * matrix.m21 + this.m33 * matrix.m31 + this.m34 * matrix.m41;
        result.m41 = this.m41 * matrix.m11 + this.m42 * matrix.m21 + this.m43 * matrix.m31 + this.m44 * matrix.m41;

        result.m12 = this.m11 * matrix.m12 + this.m12 * matrix.m22 + this.m13 * matrix.m32 + this.m14 * matrix.m42;
        result.m22 = this.m21 * matrix.m12 + this.m22 * matrix.m22 + this.m23 * matrix.m32 + this.m24 * matrix.m42;
        result.m32 = this.m31 * matrix.m12 + this.m32 * matrix.m22 + this.m33 * matrix.m32 + this.m34 * matrix.m42;
        result.m42 = this.m41 * matrix.m12 + this.m42 * matrix.m22 + this.m43 * matrix.m32 + this.m44 * matrix.m42;

        result.m13 = this.m11 * matrix.m13 + this.m12 * matrix.m23 + this.m13 * matrix.m33 + this.m14 * matrix.m43;
        result.m23 = this.m21 * matrix.m13 + this.m22 * matrix.m23 + this.m23 * matrix.m33 + this.m24 * matrix.m43;
        result.m33 = this.m31 * matrix.m13 + this.m32 * matrix.m23 + this.m33 * matrix.m33 + this.m34 * matrix.m43;
        result.m43 = this.m41 * matrix.m13 + this.m42 * matrix.m23 + this.m43 * matrix.m33 + this.m44 * matrix.m43;

        result.m14 = this.m11 * matrix.m14 + this.m12 * matrix.m24 + this.m13 * matrix.m34 + this.m14 * matrix.m44;
        result.m24 = this.m21 * matrix.m14 + this.m22 * matrix.m24 + this.m23 * matrix.m34 + this.m24 * matrix.m44;
        result.m34 = this.m31 * matrix.m14 + this.m32 * matrix.m24 + this.m33 * matrix.m34 + this.m34 * matrix.m44;
        result.m44 = this.m41 * matrix.m14 + this.m42 * matrix.m24 + this.m43 * matrix.m34 + this.m44 * matrix.m44;

        return result;
    }

    public multiply(vector: Vector3f): Vector3f {
        return new Vector3f(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14,
            this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24,
            this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34);
    }

    public multiplyHom(vector: Vector4f): Vector4f {
        return new Vector4f(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w,
            this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w,
            this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w,
            this.m41 * vector.x + this.m42 * vector.y + this.m43 * vector.z + this.m44 * vector.w);
    }


    public multiplyHomArr(vector: Vector4f, result: Vector4f): void {
        result.x = this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w;
        result.y = this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w;
        result.z = this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w;
    }

    public multiplyArr(vector: Vector3f, result: Vector3f): void {
        result.x = this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14;
        result.y = this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24;
        result.z = this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34;
    }

}