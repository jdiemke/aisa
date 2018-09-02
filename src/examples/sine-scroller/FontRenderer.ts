import { Framebuffer } from '../../Framebuffer';
import { Texture, TextureUtils } from '../../texture';

export class FontRenderer {

    private fontTexture: Texture;
    private witdh: number = 32;
    private height: number = 34;
    private charToIndex: Map<number, number>;

    constructor(private framebuffer: Framebuffer, private file: string) {
        this.charToIndex = new Map<number, number>();

        const fonts: string =
            'ABCDEFGHIJ' +
            'KLMNOPQRST' +
            'UVWXYZ@+# ' +
            '0123456789' +
            '!\'()?-/.,';

        for (let x: number = 0; x < fonts.length; x++) {
            this.addCharInex(fonts.charCodeAt(x), x);
        }
    }

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(this.file, true).then(
                (texture: Texture) => this.fontTexture = texture
            )
        ]);
    }

    public draw(): void {
        this.framebuffer.drawTextureRectFastAlpha(0, 0, 0, 0, 50, 50, this.fontTexture);
    }

    public drawText(x: number, y: number, text: string, time: number): void {
        let xpos: number = x;
        const firstIndex: number = 'A'.charCodeAt(0);
        const xFonts: number = this.fontTexture.width / this.witdh;

        const speed: number = 0.07;
        const xOff: number = Math.floor(time * speed) % this.witdh;
        const textOff: number = Math.floor((time * speed) / this.witdh) % text.length;
        xpos -= xOff;
        for (let i: number = 0; i < Math.floor(320 / this.witdh + 1); i++) {
            const asciiCode: number = text.charCodeAt((i + textOff) % text.length);
            const index: number = this.charToIndex.has(asciiCode) ? this.charToIndex.get(asciiCode) : 0;
            const tx: number = Math.floor(index % xFonts) * this.witdh;
            const ty: number = Math.floor(index / xFonts) * this.height;
            this.drawTextureRectFastAlpha(xpos,
                y, tx, ty, this.witdh, this.height, this.fontTexture, time);
            xpos += this.witdh;
        }
    }

    public drawTextureRectFastAlpha(xs: number, ys: number, xt: number, yt: number,
        width: number, height: number, texture: Texture, time: number): void {
        const startW: number = Math.max(0, 0 - xs);
        const endW: number = Math.min(xs + width, 320) - xs;
        for (let w: number = startW; w < endW; w++) {
            const yDisp: number = Math.round(Math.sin(time * 0.004 + (xs + w) * 0.013) * 40);
            let texIndex: number = xt + w + yt * texture.width;
            let frIndex: number = xs + w + (ys + yDisp) * 320;

            for (let h: number = 0; h < height; h++) {
                const color: number = texture.texture[texIndex];
                if (color & 0xff000000) {
                    this.framebuffer.framebuffer[frIndex] = color;
                }

                texIndex += texture.width;
                frIndex += 320;
            }

        }

    }

    private addCharInex(char: number, index: number): void {
        this.charToIndex.set(char, index);
    }
}
