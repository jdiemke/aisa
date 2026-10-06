import { Framebuffer } from '../../Framebuffer';
import { Texture } from '../../texture/Texture';

export class ParticleSprite {

    public static drawParticle2(
        fb: Framebuffer, xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number,
        imgNum: number = 0, spritH: number): void {
        const xStep = texture.width / width;
        const yStep = spritH / height;
        let xx = 0;
        let yy = 0;
        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;
        if (yp + height < 0 ||
            yp > (fb.height - 1) ||
            xp + width < 0 ||
            xp > (fb.width - 1)) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - fb.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - fb.height, 0);
        }
        let xTextureStart: number;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - fb.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - fb.width, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * fb.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (fb.wBuffer[index2] > z) {

                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, spritH - 1) * texture.width +
                        spritH * texture.width * imgNum;

                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                    const inverseAlpha = 1 - alpha;
                    const framebufferPixel = fb.framebuffer[index2];
                    const texturePixel = texture.texture[textureIndex];

                    const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                    const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                    const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                    fb.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + fb.width;
        }
    }

}
