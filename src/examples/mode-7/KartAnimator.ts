import { Vector2f } from '../../math/Vector2f';

export class KartAnimator {

    public pos: Vector2f;
    private keyFrames: Array<Vector2f>;

    // TODO:
    // - should we really loop or better restart??
    // - dont use linear interpolation see bourke
    // - maybe quaternions and slerp for rotation
    // temp solution: no linear for

    public setKeyFrames(keyFrames: Array<Vector2f>): void {
        this.keyFrames = keyFrames;
    }

    public getPos(elapsedTime: number): Vector2f {
        const keyFrameDuration: number = 700;

        let first = ((elapsedTime / keyFrameDuration) | 0) % this.keyFrames.length;
        let zero = ((first - 1) + this.keyFrames.length) % this.keyFrames.length;
        let second = (first + 1) % this.keyFrames.length;
        let third = (first + 2) % this.keyFrames.length;
        let fraction = ((elapsedTime / keyFrameDuration) % this.keyFrames.length) - first;

        let position = new Vector2f(
            CubicInterpolate(this.keyFrames[zero].x, this.keyFrames[first].x, this.keyFrames[second].x, this.keyFrames[third].x, fraction),
            CubicInterpolate(this.keyFrames[zero].y, this.keyFrames[first].y, this.keyFrames[second].y, this.keyFrames[third].y, fraction)
        );

        return position;
    }

}

function CosineInterpolate(y1: number, y2: number, mu: number): number {
    let mu2: number;
    mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (y1 * (1 - mu2) + y2 * mu2);
}

function CubicInterpolate(y0: number, y1: number, y2: number, y3: number, mu: number): number {
    let a0: number;
    let a1: number;
    let a2: number;
    let a3: number;
    let mu2: number;

    mu2 = mu * mu;
    a0 = -0.5 * y0 + 1.5 * y1 - 1.5 * y2 + 0.5 * y3;
    a1 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
    a2 = -0.5 * y0 + 0.5 * y2;
    a3 = y1;

    return (a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3);
}
