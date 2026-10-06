import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { Utils } from '../../core/Utils';

/**
 * Fire effect
 *
 * The fire effect has been used quite often for oldskool demos.
 * First you create a palette of 256 colors ranging from red to
 * yellow (including black). For every frame, calculate each row
 * of pixels based on the two rows below it: The value of each pixel,
 * becomes the sum of the 3 pixels below it (one directly below, one
 * to the left, and one to the right), and one pixel directly two
 * rows below it. Then divide the sum so that the fire dies out
 * as it rises.
 */
export class Fire {

    private fireBuffer: Array<number>;
    private flamePalette: Array<number>;
    private tile: Array<number>;
    private widthLeft: number;
    private widthRight: number;
    private fireLength: number;
    private pong = 0;
    private pongDir = 1;

    public init(framebuffer: Framebuffer): void {
        this.widthLeft = framebuffer.width - 1;
        this.widthRight = framebuffer.width + 1;
        this.fireLength = framebuffer.width * framebuffer.height;

        this.fireBuffer = new Array<number>(this.fireLength + this.widthRight);
        this.flamePalette = new Array<number>(256);
        this.tile = new Array<number>(framebuffer.width * framebuffer.height);

        for (let i = 0; i < 64; i++) {
            this.flamePalette[i] = new Color(i << 2, 0, 0, i << 2).toPackedFormat();
            this.flamePalette[i + 64] = new Color(255, i << 2, 0, 255).toPackedFormat();
            this.flamePalette[i + 128] = new Color(255, 255, i << 2, 255).toPackedFormat();
            this.flamePalette[i + 192] = new Color(255, 255, 255, 255).toPackedFormat();
        }

        this.tile = this.makeTile(framebuffer.width, framebuffer.height);
    }

    public render(framebuffer: Framebuffer): void {
        this.drawFire(framebuffer);
    }

    public drawFire(framebuffer: Framebuffer): void {
        this.pong += this.pongDir;

        if (this.pong > 150) {
            this.pongDir = -1;
            this.pong = 150;
        }

        if (this.pong < 1) {
            this.pongDir = 1;
            this.pong = 0;
        }

        Utils.arrayCopy(this.tile, (this.pong * framebuffer.width), this.fireBuffer, this.fireLength, framebuffer.width + 4);

        /*
        for (let x = 0; x < framebuffer.width + 4; x++) {
            this.fireBuffer[x + this.fireLength] = Math.random() * 255;
        }
        */

        for (let currentPixelIndex = 0; currentPixelIndex < this.fireLength; currentPixelIndex++) {
            this.fireBuffer[currentPixelIndex] =
                (((this.fireBuffer[currentPixelIndex]
                    + this.fireBuffer[currentPixelIndex + this.widthLeft]
                    + this.fireBuffer[currentPixelIndex + framebuffer.width]
                    + this.fireBuffer[currentPixelIndex + this.widthRight])) >> 2) - 1;

            if (this.fireBuffer[currentPixelIndex] > 0) {
                framebuffer.framebuffer[currentPixelIndex] = this.flamePalette[this.fireBuffer[currentPixelIndex]];
            }
        }
    }

    private makeTile(w: number, h: number): number[] {
        const ns = 0.015;
        const tt = 0;
        const pn = Utils.PerlinNoise;

        for (let x = 0; x < w; x++) {
            let counterr = 0;
            for (let y = 0; y < h; y++) {
                const u = x / w;
                const v = y / h;

                const noise00 = pn.noise(x * ns, y * ns, 0);
                const noise01 = pn.noise(x * ns, (y + h) * ns, tt);
                const noise10 = pn.noise((x + w) * ns, y * ns, tt);
                const noise11 = pn.noise((x + w) * ns, (y + h) * ns, tt);

                const noisea = u * v * noise00 + u * (1 - v) * noise01 + (1 - u) * v * noise10 + (1 - u) * (1 - v) * noise11;

                let value = Math.round((255 * noisea) & 0xFF);
                value = Math.round((255 * pn.noise(x * ns, counterr++ * ns, 0)));

                let r = value;
                let g = value;
                let b = value;

                if (r > 255) r = 255;
                if (r < 0) r = 0;

                if (g > 255) g = 255;
                if (g < 0) g = 0;

                if (b > 255) b = 255;
                if (b < 0) b = 0;
                this.tile[x + y * w] = value;
            }
        }
        return this.tile;
    }

}