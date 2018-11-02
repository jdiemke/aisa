import { Framebuffer } from '../../Framebuffer';
import { Texture, TextureUtils } from '../../texture';

export class FontRenderer {

    private fontTexture: Texture;
    private charToIndex: Map<number, number>;

    constructor(private framebuffer: Framebuffer, private width: number,
        private height: number, fonts: string, private file: string) {
        this.charToIndex = new Map<number, number>();

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

    public drawText2(x: number, y: number, text: string): void {
        let xpos: number = x;
        const xFonts: number = this.fontTexture.width / this.width;

        for (let i: number = 0; i < text.length; i++) {
            const asciiCode: number = text.charCodeAt(i);
            const index: number = this.charToIndex.has(asciiCode) ? this.charToIndex.get(asciiCode) : 0;
            const tx: number = Math.floor(index % xFonts) * this.width;
            const ty: number = Math.floor(index / xFonts) * this.height;
            this.framebuffer.drawTextureRectFastAlpha(xpos, y, tx, ty, 8, 14, this.fontTexture);
            xpos += this.width;
        }
    }

    public drawText(x: number, y: number, text: string, time: number, sine: boolean = true): void {
        let xpos: number = x;
        const xFonts: number = this.fontTexture.width / this.width;

        const speed: number = 0.07;
        const xOff: number = Math.floor(time * speed) % this.width;
        const textOff: number = Math.floor((time * speed) / this.width) % text.length;
        xpos -= xOff;
        for (let i: number = 0; i < Math.floor(320 / this.width + 1); i++) {
            const asciiCode: number = text.charCodeAt((i + textOff) % text.length);
            const index: number = this.charToIndex.has(asciiCode) ? this.charToIndex.get(asciiCode) : 0;
            const tx: number = Math.floor(index % xFonts) * this.width;
            const ty: number = Math.floor(index / xFonts) * this.height;
            this.drawTextureRectFastAlpha(xpos,
                y, tx, ty, this.width, this.height, this.fontTexture, time, sine);
            xpos += this.width;
        }
    }

    public drawTextureRectFastAlpha(xs: number, ys: number, xt: number, yt: number,
        width: number, height: number, texture: Texture, time: number, sine: boolean = true): void {
        const startW: number = Math.max(0, 0 - xs);
        const endW: number = Math.min(xs + width, 320) - xs;
        for (let w: number = startW; w < endW; w++) {

            const yDisp: number = sine ? Math.round(Math.sin(time * 0.004 + (xs + w) * 0.013) * 30) : 0;
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
