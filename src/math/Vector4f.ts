export  class Vector4f {

    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number, y:number, z:number, w:number = 1) {
        this.x=x;
        this.y=y;
        this.z=z;
        this.w=w;
    }

    sub(vec: Vector4f): Vector4f {
        return new Vector4f(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }

        cross(vec: Vector4f): Vector4f {
        return new Vector4f(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x, 0.0);
    }

        normalize(): Vector4f {
        let reci = 1.0/this.length();
        return this.mul(reci);
    }

        length() {
        return Math.sqrt(this.x*this.x +this.y*this.y +this.z*this.z);
    }

        mul(scal: number): Vector4f {
        return new Vector4f(this.x * scal, this.y * scal, this.z * scal, this.w);
    }

        dot(vec:Vector4f): number {
        return this.x*vec.x+this.y*vec.y+this.z*vec.z;
    }

}