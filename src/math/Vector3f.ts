export class Vector3f {

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y:number, z:number) {
        this.x=x;
        this.y=y;
        this.z=z;
    }

    public mult(scale: number) {
        return new Vector3f(this.x*scale, this.y * scale, this.z * scale);
    }

    sub(vec: Vector3f): Vector3f {
        return new Vector3f(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    sub2(vec1: Vector3f, vec2: Vector3f): void {
       this.x = vec1.x - vec2.x;
       this.y = vec1.y - vec2.y;
       this.z =  vec1.z - vec2.z;
    }

    mul(scal: number): Vector3f {
        return new Vector3f(this.x * scal, this.y * scal, this.z * scal);
    }

    add(vec: Vector3f): Vector3f {
        return new Vector3f(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    add2(vec: Vector3f,vec2: Vector3f): void {
        this.x = vec.x + vec2.x;
        this.y =  vec.y + vec2.y;
        this.z =  vec.z + vec2.z;
    }

    cross(vec: Vector3f): Vector3f {
        return new Vector3f(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x);
    }

    cross2(vec1: Vector3f,vec2: Vector3f): void {
        this.x =vec1.y * vec2.z - vec1.z * vec2.y;
        this.y =vec1.z * vec2.x - vec1.x * vec2.z;
        this.z =vec1.x * vec2.y - vec1.y * vec2.x;
    }

    length() {
        return Math.sqrt(this.x*this.x +this.y*this.y +this.z*this.z);
    }

    normalize(): Vector3f {
        let reci = 1.0/this.length();
        return this.mul(reci);
    }

    normalize2(): void {
        let reci = 1.0/this.length();
       this.x *= reci;
       this.y *= reci;
       this.z *= reci;
    }

    dot(vec:Vector3f): number {
        return this.x*vec.x+this.y*vec.y+this.z*vec.z;
    }

}