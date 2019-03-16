export class Vector4f {

    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number, y: number, z: number, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public sub(vec: Vector4f): Vector4f {
        return new Vector4f(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }

    public add(vec: Vector4f): Vector4f {
        return new Vector4f(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w);
    }

    public cross(vec: Vector4f): Vector4f {
        return new Vector4f(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x, 0.0);
    }

    public normalize(): Vector4f {
        const reci: number = 1.0 / this.length();
        return this.mul(reci);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public mul(scal: number): Vector4f {
        return new Vector4f(this.x * scal, this.y * scal, this.z * scal, this.w);
    }

    public dot(vec: Vector4f): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

}
