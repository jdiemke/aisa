
export class Vector2f {

    constructor(public x: number, public y: number) {

    }

    public perp(): Vector2f {
        return new Vector2f(-this.y, this.x);
    }

    public sub(vec: Vector2f): Vector2f {
        return new Vector2f(this.x - vec.x, this.y - vec.y);
    }

    public mul(scal: number): Vector2f {
        return new Vector2f(this.x * scal, this.y * scal);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vector2f {
        const reci: number = 1.0 / this.length();
        return this.mul(reci);
    }

    public dot(vec: Vector2f): number {
        return this.x * vec.x + this.y * vec.y;
    }

}
