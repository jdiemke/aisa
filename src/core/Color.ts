/**
 * Color
 *
 * @export
 * @class Color
 * @see https://www.rapidtables.com/web/color/RGB_Color.html
 * @author Johannes Diemke
 */
export class Color {

    public static readonly BLACK: Color = new Color(0, 0, 0, 255);
    public static readonly WHITE: Color = new Color(255, 255, 255, 255);
    public static readonly RED: Color = new Color(255, 0, 0, 255);
    public static readonly GREEN: Color = new Color(0, 255, 0, 255);
    public static readonly LIME: Color = new Color(0, 255, 0, 255);
    public static readonly BLUE: Color = new Color(0, 0, 255, 255);
    public static readonly DARK_BLUE: Color = new Color(0, 0, 64, 255);
    public static readonly YELLOW: Color = new Color(255, 255, 0, 255);
    public static readonly CYAN: Color = new Color(0, 255, 255, 255);
    public static readonly MAGENTA: Color = new Color(255, 0, 255, 255);
    public static readonly SLATE_GRAY: Color = new Color(112, 128, 144, 255);
    public static readonly DARK_GRAY: Color = new Color(19, 19, 20, 255);
    public static readonly ORANGE: Color = new Color(255, 160, 122);

    constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) {
    }

    public static blend(firstColor: number, secondColor: number, alpha: number): number {
        if (0 === alpha) {
            return firstColor;
        }

        if (255 === alpha) {
            return secondColor;
        }

        const inverseAlpha = 255 - alpha;
        const firstRed = (firstColor & 0x00FF0000) >> 16;
        const secondRed = (secondColor & 0x00FF0000) >> 16;
        const red = (secondRed * alpha + firstRed * inverseAlpha) >> 8;
        const firstGreen = (firstColor & 0x0000FF00) >> 8;
        const secondGreen = (secondColor & 0x0000FF00) >> 8;
        const green = (secondGreen * alpha + firstGreen * inverseAlpha) >> 8;
        const firstBlue = firstColor & 0x000000FF;
        const secondBlue = secondColor & 0x000000FF;
        const blue = (secondBlue * alpha + firstBlue * inverseAlpha) >> 8;

        return 0xff000000 | red << 16 | green << 8 | blue;
    }

    public static addColor(firstColor: number, secondColor: number): number {
        const firstRed = (firstColor >> 16) & 0xFF;
        const firstGreen = (firstColor >> 8) & 0xFF;
        const firstBlue = firstColor & 0xFF;
        const secondRed = (secondColor >> 16) & 0xFF;
        const secondGreen = (secondColor >> 8) & 0xFF;
        const secondBlue = secondColor & 0xFF;

        const red = firstRed + secondRed < 0xFF ? firstRed + secondRed : 0xFF;
        const green = firstGreen + secondGreen < 0xFF ? firstGreen + secondGreen : 0xFF;
        const blue = firstBlue + secondBlue < 0xFF ? firstBlue + secondBlue : 0xFF;

        return 0xFF << 24 | red << 16 | green << 8 | blue;
    }

    public toPackedFormat(): number {
        return this.r | this.g << 8 | this.b << 16 | this.a << 24;
    }

    public sub(color: Color): Color {
        return new Color(this.r - color.r, this.g - color.g, this.b - color.b, 255);
    }

    public add(color: Color): Color {
        return new Color(this.r + color.r, this.g + color.g, this.b + color.b, 255);
    }

    public div(num: number): Color {
        return new Color(this.r / num, this.g / num, this.b / num, 255);
    }

    public mul(num: number): Color {
        return new Color(this.r * num, this.g * num, this.b * num, 255);
    }

}
