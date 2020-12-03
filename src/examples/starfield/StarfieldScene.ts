import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * TODO: extract lens into effect class
 */
export class StarfieldScene extends AbstractScene {

    public render(framebuffer: Framebuffer): void {
        this.drawStarField(framebuffer, Date.now());
    }

    public drawStarField(frambuffer: Framebuffer, elapsedTime: number): void {
        const darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        const lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        const backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;

        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        const stars = new Array<Vector3f>();
        const stars2 = new Array<Vector3f>();

        for (let i = 0; i < 100; i++) {
            stars.push(new Vector3f(rng.getFloat() * frambuffer.width, Math.round(rng.getFloat() * frambuffer.height), 0));
        }

        for (let i = 0; i < 60; i++) {
            stars2.push(new Vector3f(rng.getFloat() * frambuffer.width, Math.round(rng.getFloat() * frambuffer.height), 0));
        }

        frambuffer.clearColorBuffer(backgroundColor);

        for (let i = 0; i < 100; i++) {
            frambuffer.drawPixel(((stars[i].x + elapsedTime * 0.02) | 0) % frambuffer.width, stars[i].y, darkStarColor);
        }

        for (let i = 0; i < 60; i++) {
            frambuffer.drawPixel(((stars2[i].x + elapsedTime * 0.04) | 0) % frambuffer.width, stars2[i].y, lightStarColor);
        }
    }

}
