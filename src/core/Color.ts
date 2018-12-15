/**
 * Color
 *
 * @export
 * @class Color
 * @see https://www.rapidtables.com/web/color/RGB_Color.html
 * @author Johannes Diemke
 */
export class Color {

    public static readonly BLACK = new Color(0, 0, 0, 255);
    public static readonly WHITE = new Color(255, 255, 255, 255);
    public static readonly RED = new Color(255, 0, 0, 255);
    public static readonly LIME = new Color(0, 255, 0, 255);
    public static readonly BLUE = new Color(0, 0, 255, 255);
    public static readonly DARK_BLUE = new Color(0, 0, 64, 255);
    public static readonly YELLOW = new Color(255, 255, 0, 255);
    public static readonly CYAN = new Color(0, 255, 255, 255);
    public static readonly MAGENTA = new Color(255, 0, 255, 255);
    public static readonly SLATE_GRAY = new Color(112, 128, 144, 255);
    public static readonly DARK_GRAY = new Color( 19, 19, 20, 255);



    constructor(private r: number, private g: number, private b: number, private a: number) {
    }

    public toPackedFormat(): number {
        return this.r | this.g << 8 | this.b << 16 | this.a << 24;
    }

}
