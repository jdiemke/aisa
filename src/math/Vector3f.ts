export class Vector3f {

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public mult(scale: number): Vector3f {
        return new Vector3f(this.x * scale, this.y * scale, this.z * scale);
    }

    public sub(vec: Vector3f): Vector3f {
        return new Vector3f(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    public sub2(vec1: Vector3f, vec2: Vector3f): void {
        this.x = vec1.x - vec2.x;
        this.y = vec1.y - vec2.y;
        this.z = vec1.z - vec2.z;
    }

    public mul(scal: number): Vector3f {
        return new Vector3f(this.x * scal, this.y * scal, this.z * scal);
    }

    public add(vec: Vector3f): Vector3f {
        return new Vector3f(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    public add2(vec: Vector3f, vec2: Vector3f): void {
        this.x = vec.x + vec2.x;
        this.y = vec.y + vec2.y;
        this.z = vec.z + vec2.z;
    }

    public cross(vec: Vector3f): Vector3f {
        return new Vector3f(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x);
    }

    public cross2(vec1: Vector3f, vec2: Vector3f): void {
        this.x = vec1.y * vec2.z - vec1.z * vec2.y;
        this.y = vec1.z * vec2.x - vec1.x * vec2.z;
        this.z = vec1.x * vec2.y - vec1.y * vec2.x;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(): Vector3f {
        const reci: number = 1.0 / this.length();
        return this.mul(reci);
    }

    public normalize2(): void {
        const reci: number = 1.0 / this.length();
        this.x *= reci;
        this.y *= reci;
        this.z *= reci;
    }

    public dot(vec: Vector3f): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

}
