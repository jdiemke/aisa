import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import RandomNumberGenerator from '../../RandomNumberGenerator';

export class Starfield {

    private stars: Array<Vector3f> = [];
    private brightStars: Array<Vector3f> = [];
    private depthStars: Array<{ x: number; y: number; phase: number; visibleProgress: number }> = [];
    private readonly backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;
    private readonly lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
    private readonly backgroundRed = this.backgroundColor & 0xff;
    private readonly backgroundGreen = this.backgroundColor >> 8 & 0xff;
    private readonly backgroundBlue = this.backgroundColor >> 16 & 0xff;
    private readonly redRange = (this.lightStarColor & 0xff) - this.backgroundRed;
    private readonly greenRange = (this.lightStarColor >> 8 & 0xff) - this.backgroundGreen;
    private readonly blueRange = (this.lightStarColor >> 16 & 0xff) - this.backgroundBlue;
    private width: number;
    private height: number;

    public init(): Promise<void> {
        this.initializeDepthStars();
        return Promise.resolve();
    }

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

    public render3D(framebuffer: Framebuffer, elapsedTime: number): void {
        if (this.depthStars.length === 0) {
            this.initializeDepthStars();
        }

        framebuffer.clearColorBuffer(this.backgroundColor);
        const { width, height } = framebuffer;
        const time = elapsedTime / 6000;

        for (const star of this.depthStars) {
            const progress = ((star.phase + time) % 1 + 1) % 1;
            const depth = 1 - progress * 0.98;
            const x = Math.floor(width * (0.5 + star.x / depth));
            const y = Math.floor(height * (0.5 + star.y / depth));
            const size = 1 + Math.floor(progress * 2);
            const left = Math.max(0, x);
            const top = Math.max(0, y);
            const right = Math.min(width, x + size);
            const bottom = Math.min(height, y + size);
            if (left >= right || top >= bottom) {
                continue;
            }

            const brightness = Math.min(progress / star.visibleProgress, 1);
            const red = Math.round(this.backgroundRed + this.redRange * brightness);
            const green = Math.round(this.backgroundGreen + this.greenRange * brightness);
            const blue = Math.round(this.backgroundBlue + this.blueRange * brightness);
            const color = 255 << 24 | blue << 16 | green << 8 | red;

            for (let py = top; py < bottom; py++) {
                for (let px = left; px < right; px++) {
                    framebuffer.drawPixel(px, py, color);
                }
            }
        }
    }

    private initializeDepthStars(): void {
        if (this.depthStars.length !== 0) {
            return;
        }

        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        for (let i = 0; i < 160; i++) {
            const x = rng.getFloat() - 0.5;
            const y = rng.getFloat() - 0.5;
            this.depthStars.push({
                x: x * 0.3,
                y: y * 0.3,
                phase: rng.getFloat(),
                visibleProgress: Math.min(1, (1 - Math.max(Math.abs(x), Math.abs(y)) * 0.6) / 0.98)
            });
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
