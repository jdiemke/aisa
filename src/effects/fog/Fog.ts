import { Color } from '@core/Color';
import { Framebuffer } from '../../Framebuffer';

export class Fog {

    public static drawFog(fb: Framebuffer, color: Color, fogScale: number, fogOffset: number): void {
        const videoMemorySize: number = fb.width * fb.height;
        const wBufferScale: number = -fogScale;

        for (let index: number = 0; index < videoMemorySize; index++) {
            const alpha = Math.max(Math.min(wBufferScale * (1 / fb.wBuffer[index] + fogOffset), 1.0), 0.0);
            const inverseAlpha = 1.0 - alpha;

            const r = (fb.framebuffer[index] >> 0 & 0xff) * inverseAlpha + color.r * alpha;
            const g = (fb.framebuffer[index] >> 8 & 0xff) * inverseAlpha + color.g * alpha;
            const b = (fb.framebuffer[index] >> 16 & 0xff) * inverseAlpha + color.b * alpha;

            fb.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);
        }
    }

}
