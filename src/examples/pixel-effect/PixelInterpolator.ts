import { Vector2f } from '../../math/index';

export class PixelInterpolator {
    constructor(public start: Vector2f, public end: Vector2f, public pixel: number, public startTime: number = 0) {

    }

    public getPos(time: number, count): Vector2f {
        if (time <= 0) return this.start;
        if (time >= 1) return this.end;

        return new Vector2f(
            Math.round(CosineInterpolate(this.start.x, this.end.x, time) + Math.sin(time * 55 + count * 0.15) * 40 * (1 - time)),
            Math.round(CosineInterpolate(this.start.y, this.end.y, time) + Math.cos(time * 55 + count * 0.15) * 40 * (1 - time)));
    }
}

function CosineInterpolate(y1: number, y2: number, mu: number): number {
    const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (y1 * (1 - mu2) + y2 * mu2);
}
