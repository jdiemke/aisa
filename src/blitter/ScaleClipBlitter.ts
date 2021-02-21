import { Framebuffer } from '../Framebuffer';
import { Texture } from '../texture/Texture';

export class ScaleClipBlitter {

    constructor(private framebuffer: Framebuffer) {

    }

    public drawScaledTextureClip(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.framebuffer.height - 1) ||
            xp + width < 0 ||
            xp > (this.framebuffer.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.framebuffer.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.framebuffer.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.framebuffer.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.framebuffer.width, 0);
        }

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.framebuffer.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                const xxInt = xx | 0;
                const yyInt = yy | 0;
                const textureIndex = xxInt + yyInt * texture.width;
                //(xxInt > texture.width - 1 ? texture.width - 1 : xxInt) +
                //(yyInt > texture.height - 1 ? texture.height - 1 : yyInt) * texture.width;

                const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                const inverseAlpha = 1 - alpha;

                const framebufferPixel = this.framebuffer.framebuffer[index2];
                const texturePixel = texture.texture[textureIndex];

                const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                this.framebuffer.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.framebuffer.width;
        }
    }

}
