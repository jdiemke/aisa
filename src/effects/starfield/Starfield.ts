import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';

export class Starfield {

    private stars: Array<Vector3f> = [];
    private brightStars: Array<Vector3f> = [];
    private width: number;
    private height: number;

    public render(framebuffer: Framebuffer, elapsedTime: number): void {
        if (framebuffer.width !== this.width || framebuffer.height !== this.height) {
            this.initializeStars(framebuffer);
        }

        const darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        const lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        const backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;

        framebuffer.clearColorBuffer(backgroundColor);

        for (const star of this.stars) {
            framebuffer.drawPixel(((star.x + elapsedTime * 0.02) | 0) % framebuffer.width, star.y, darkStarColor);
        }

        for (const star of this.brightStars) {
            framebuffer.drawPixel(((star.x + elapsedTime * 0.04) | 0) % framebuffer.width, star.y, lightStarColor);
        }
    }

    private initializeStars(framebuffer: Framebuffer): void {
        this.width = framebuffer.width;
        this.height = framebuffer.height;

        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        this.stars = [];
        this.brightStars = [];

        for (let i = 0; i < 100; i++) {
            this.stars.push(new Vector3f(rng.getFloat() * framebuffer.width, Math.round(rng.getFloat() * framebuffer.height), 0));
        }

        for (let i = 0; i < 60; i++) {
            this.brightStars.push(new Vector3f(rng.getFloat() * framebuffer.width, Math.round(rng.getFloat() * framebuffer.height), 0));
        }
    }

}
