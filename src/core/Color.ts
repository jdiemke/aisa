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
    public static readonly LIME: Color = new Color(0, 255, 0, 255);
    public static readonly BLUE: Color = new Color(0, 0, 255, 255);
    public static readonly DARK_BLUE: Color = new Color(0, 0, 64, 255);
    public static readonly YELLOW: Color = new Color(255, 255, 0, 255);
    public static readonly CYAN: Color = new Color(0, 255, 255, 255);
    public static readonly MAGENTA: Color = new Color(255, 0, 255, 255);
    public static readonly SLATE_GRAY: Color = new Color(112, 128, 144, 255);
    public static readonly DARK_GRAY: Color = new Color( 19, 19, 20, 255);

    constructor(public r: number, public g: number, public b: number, public a: number) {
    }

    public toPackedFormat(): number {
        return this.r | this.g << 8 | this.b << 16 | this.a << 24;
    }

}
