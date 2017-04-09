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

}