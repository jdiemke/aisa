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


    public sub2(vec1: Vector4f, vec2: Vector4f): void {
        this.x = vec1.x - vec2.x;
        this.y = vec1.y - vec2.y;
        this.z = vec1.z - vec2.z;
    }

    public add2(vec: Vector4f, vec2: Vector4f): void {
        this.x = vec.x + vec2.x;
        this.y = vec.y + vec2.y;
        this.z = vec.z + vec2.z;
    }


    public mul(scal: number): Vector4f {
        return new Vector4f(this.x * scal, this.y * scal, this.z * scal, this.w);
    }

    public componentWiseMul(vec: Vector4f): Vector4f {
        return new Vector4f(this.x * vec.x, this.y * vec.y, this.z * vec.z, this.w * vec.w);
    }

    public dot(vec: Vector4f): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    public cross2(vec1: Vector4f, vec2: Vector4f): void {
        this.x = vec1.y * vec2.z - vec1.z * vec2.y;
        this.y = vec1.z * vec2.x - vec1.x * vec2.z;
        this.z = vec1.x * vec2.y - vec1.y * vec2.x;
    }

    public normalize2(): void {
        const reci: number = 1.0 / this.length();
        this.x *= reci;
        this.y *= reci;
        this.z *= reci;
    }


}
