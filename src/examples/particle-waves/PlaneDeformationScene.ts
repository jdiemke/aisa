import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils } from '../../texture';
import { Texture } from '../../texture/Texture';

export class PlaneDeformationScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        const currentTime: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawParticleWaves(currentTime, this.particleTexture2, true);

        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.85);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(currentTime, this.noise);
    }

    public createProceduralTexture3(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const dx = 127 - x
                    const dy = 127 - y
                    const r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1) c = 0;
                    c = Math.min(1, c * 2.9);

                    texture.texture[x + y * 256] = 235 | 255 << 8 | 235 << 16 | (c * 255) << 24;
                }
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

}
