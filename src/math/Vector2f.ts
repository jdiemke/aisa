
export class Vector2f {

    constructor(public x: number, public y: number) {

    }

    public perp(): Vector2f {
        return new Vector2f(-this.y, this.x);
    }

}
