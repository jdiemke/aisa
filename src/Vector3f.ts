export default class Vector3f {

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

    mul(scal: number): Vector3f {
        return new Vector3f(this.x * scal, this.y * scal, this.z * scal);
    }

    add(vec: Vector3f): Vector3f {
        return new Vector3f(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    cross(vec: Vector3f): Vector3f {
        return new Vector3f(this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x);
    }

    length() {
        return Math.sqrt(this.x*this.x +this.y*this.y +this.z*this.z);
    }

    normalize(): Vector3f {
        let reci = 1.0/this.length();
        return this.mul(reci);
    }

    dot(vec:Vector3f): number {
        return this.x*vec.x+this.y*vec.y+this.z*vec.z;
    }

}