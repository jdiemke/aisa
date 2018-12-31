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
        let darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        let lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        let backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;

        let rng = new RandomNumberGenerator();
        rng.setSeed(666);
        let stars = new Array<Vector3f>();
        let stars2 = new Array<Vector3f>();

        for (let i = 0; i < 100; i++) {
            stars.push(new Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }

        for (let i = 0; i < 60; i++) {
            stars2.push(new Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }

        frambuffer.clearColorBuffer(backgroundColor);

        for (let i = 0; i < 100; i++) {
            frambuffer.drawPixel(((stars[i].x + elapsedTime * 0.02) | 0) % 320, stars[i].y, darkStarColor);
        }

        for (let i = 0; i < 60; i++) {
            frambuffer.drawPixel(((stars2[i].x + elapsedTime * 0.04) | 0) % 320, stars2[i].y, lightStarColor);
        }
    }

}
