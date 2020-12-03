import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class MetaballsScene extends AbstractScene {

    public render(framebuffer: Framebuffer): void {
        this.drawMetaballs(framebuffer);
    }

    private drawMetaballs(framebuffer: Framebuffer): void {
        const balls: Array<Vector3f> = [
            new Vector3f(Math.sin(Date.now() * 0.002) * 100 + (framebuffer.width/2),
                Math.cos(Date.now() * 0.0035) * 70 + 100, 0),
            new Vector3f(Math.sin(Date.now() * 0.0015) * 100 + (framebuffer.width/2),
                Math.cos(Date.now() * 0.002) * 70 + 100, 0),
            new Vector3f(Math.sin(Date.now() * 0.003) * 100 + (framebuffer.width/2),
                Math.cos(Date.now() * 0.0045) * 70 + 100, 0)
        ];

        let index = 0;

        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                let intensity = 0;
                for (let b = 0; b < 3; b++) {
                    const xx = (balls[b].x - x);
                    const yy = (balls[b].y - y);
                    const length = Math.sqrt(xx * xx + yy * yy);
                    intensity += 5500 / length;
                }
                framebuffer.framebuffer[index++] = 255 << 24 | this.mapColor(intensity);
            }
        }
    }

    private interpolateColor(start: number, end: number, value: number, color1: number, color2: number): number {
        const scale = this.interpolate(start, end, value);
        const red = (color1 >> 0 & 0xff) * (1 - scale) + scale * (color2 >> 0 & 0xff);
        const green = (color1 >> 8 & 0xff) * (1 - scale) + scale * (color2 >> 8 & 0xff);
        const blue = (color1 >> 16 & 0xff) * (1 - scale) + scale * (color2 >> 16 & 0xff);
        return red | green << 8 | blue << 16;
    }

    /**
     * FIXME: move into interpolation utils or something like that since this is also
     * used by other methods in the framebuffer class
     */
    private interpolate(start: number, end: number, current: number): number {
        if (current <= start) {
            return 0;
        }
        if (current >= end) {
            return 1;
        }
        return (current - start) / (end - start);
    }

    private mapColor(intensity: number): number {
        if (intensity >= 235) {
            return 255;
        } else if (intensity >= 230) {
            return this.interpolateColor(230, 235, intensity, 255 << 8 | 255, 255);
        } else if (intensity >= 100) {
            return this.interpolateColor(100, 230, intensity, 255 << 8, 255 << 8 | 255);
        }
        return 255 << 8;
    }

}
