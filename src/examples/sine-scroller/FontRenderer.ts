import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { Texture, TextureUtils } from '../../texture';

export class FontRenderer {

    private fontTexture: Texture;
    private charToIndex: Map<number, number>;

    constructor(
        private framebuffer: Framebuffer,
        private width: number,
        private height: number,
        fonts: string,
        private file: any) {
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
            this.framebuffer.drawTextureRectFastAlpha(xpos, y, tx, ty, this.width, this.height, this.fontTexture);
            xpos += this.width;
        }
    }

    public drawText(framebuffer: Framebuffer, x: number, y: number, text: string, time: number, sine: boolean = true): void {
        let xpos: number = x;
        const xFonts: number = this.fontTexture.width / this.width;

        const speed: number = 0.07;
        const xOff: number = Math.floor(time * speed) % this.width;
        const textOff: number = Math.floor((time * speed) / this.width) % text.length;
        xpos -= xOff;
        for (let i: number = 0; i < Math.floor(this.framebuffer.width / this.width + 1); i++) {
            const asciiCode: number = text.charCodeAt((i + textOff) % text.length);
            const index: number = this.charToIndex.has(asciiCode) ? this.charToIndex.get(asciiCode) : 0;
            const tx: number = Math.floor(index % xFonts) * this.width;
            const ty: number = Math.floor(index / xFonts) * this.height;
            this.drawTextureRectFastAlpha(framebuffer, xpos,
                y, tx, ty, this.width, this.height, this.fontTexture, time, sine);
            xpos += this.width;
        }
    }

    public drawText3(framebuffer: Framebuffer, x: number, y: number, text: string, time: number, sine: boolean = true, points: Array<Vector3f>): void {
        let xpos: number = x;
        const xFonts: number = this.fontTexture.width / this.width;

        const speed: number = 0.07;
        const xOff: number = Math.floor(time * speed) % this.width;
        const textOff: number = Math.floor((time * speed) / this.width) % text.length;
        xpos -= xOff;
        for (let i: number = 0; i < Math.floor(this.framebuffer.width / this.width + 1); i++) {
            const asciiCode: number = text.charCodeAt((i + textOff) % text.length);
            const index: number = this.charToIndex.has(asciiCode) ? this.charToIndex.get(asciiCode) : 0;
            const tx: number = Math.floor(index % xFonts) * this.width;
            const ty: number = Math.floor(index / xFonts) * this.height;
            this.drawTextureRectFastAlpha3(framebuffer, xpos,
                y, tx, ty, this.width, this.height, this.fontTexture, time, sine, points);
            xpos += this.width;
        }
    }


    public drawTextureRectFastAlpha3(framebuffer: Framebuffer, xs: number, ys: number, xt: number, yt: number,
        width: number, height: number, texture: Texture, time: number, sine: boolean = true, points: Array<Vector3f>): void {
        const startW: number = Math.max(0, 0 - xs);
        const endW: number = Math.min(xs + width, framebuffer.width) - xs;
        const speed: number = 0.07;
        const xOff: number =(time * speed) % 1;
        for (let w: number = startW; w < endW; w++) {

            let texIndex: number = xt + w + yt * texture.width;

            for (let h: number = 0; h < height; h++) {
                const color: number = texture.texture[texIndex];
                if (((color & 0x00000ff)>>0) > 100) {

                    const y = 0-h*1.2+4;
                    const xpos=  (xs+w)*1.2-160-xOff*1.2;
                    points.push(new Vector3f(
                        xpos,
                        Math.sin(xpos*0.06)*y+Math.sin(xpos*0.2)*1,
                        Math.cos(xpos*0.06)*y+Math.cos(xpos*0.2)*1));
                }

                texIndex += texture.width;
            }

        }

    }

    public drawTextureRectFastAlpha(framebuffer: Framebuffer, xs: number, ys: number, xt: number, yt: number,
        width: number, height: number, texture: Texture, time: number, sine: boolean = true): void {
        const startW: number = Math.max(0, 0 - xs);
        const endW: number = Math.min(xs + width, framebuffer.width) - xs;
        for (let w: number = startW; w < endW; w++) {

            const yDisp: number = sine ? Math.round(Math.sin(time * 0.004 + (xs + w) * 0.013) * 30) : 0;
            let texIndex: number = xt + w + yt * texture.width;
            let frIndex: number = xs + w + (ys + yDisp) * framebuffer.width;

            for (let h: number = 0; h < height; h++) {
                const color: number = texture.texture[texIndex];
                if (color & 0xff000000) {
                    framebuffer.framebuffer[frIndex] = color;
                }

                texIndex += texture.width;
                frIndex += this.framebuffer.width;
            }

        }

    }

    private addCharInex(char: number, index: number): void {
        this.charToIndex.set(char, index);
    }
}
