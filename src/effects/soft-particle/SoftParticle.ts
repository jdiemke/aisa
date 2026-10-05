import { Framebuffer } from '../../Framebuffer';
import { Texture } from '../../texture/Texture';

export class SoftParticle {

    public static drawSoftParticle(fb: Framebuffer, xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
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
                    // float scale = 0.2f;
                    // float fade = clamp((depthMapDepth.x-depth)*scale, 0.0, 1.0);
                    const zDist = Math.min(Math.max(((1 / z - 1 / fb.wBuffer[index2])), 0.0), 1.0);
                    // fb.wBuffer[index2] = z;
                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale * zDist;
                    const inverseAlpha = 1 - alpha;

                    const r = (fb.framebuffer[index2] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                    const g = (fb.framebuffer[index2] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                    const b = (fb.framebuffer[index2] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;

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
