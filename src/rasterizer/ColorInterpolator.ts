import { Color } from '../core/Color';

export class ColorInterpolator {

    private startColor: Color;
    private colorSlope: Color;

    constructor(c1: Color, c2: Color, distance: number) {
        this.colorSlope = c2.sub(c1).div(distance);
        this.startColor = c1;
    }

    public getColor(): Color {
        return this.startColor;
    }

    public advance(): void {
        this.startColor = this.startColor.add(this.colorSlope);
    }

}
