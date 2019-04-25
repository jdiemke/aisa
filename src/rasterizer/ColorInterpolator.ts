import { Color } from '../core/Color';

export class ColorInterpolator {

    public startColor: Color = new Color();
    public colorSlope: Color = new Color();

    public setup(c1: Color, c2: Color, distance: number): void {
        this.colorSlope.r = (c2.r - c1.r) / distance;
        this.colorSlope.g = (c2.g - c1.g) / distance;
        this.colorSlope.b = (c2.b - c1.b) / distance;

        this.startColor.r = c1.r;
        this.startColor.g = c1.g;
        this.startColor.b = c1.b;
    }

    public advance(): void {
        this.startColor.r += this.colorSlope.r;
        this.startColor.g += this.colorSlope.g;
        this.startColor.b += this.colorSlope.b;
    }

}
