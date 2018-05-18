import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import Texture from '../../Texture';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { TextureUtils } from '../../TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class RazorScene extends AbstractScene {

    private texture10: Texture;
    private texture11: Texture;
    private texture13: Texture;
    private dirt: Texture;
    private noise: Texture;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/spark.png'), true).then(texture => this.texture10 = texture),
            TextureUtils.load(require('./assets/ring.png'), true).then(texture => this.texture11 = texture),
            TextureUtils.load(require('./assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            TextureUtils.load(require('./assets/dirt.png'), true).then(texture => this.dirt = texture),
            this.createProceduralTexture4().then(texture => this.noise = texture),
        ]);
    }

    public createProceduralTexture4(): Promise<Texture> {
        return new Promise((resolve) => {
            const texture = new Texture();
            texture.texture = new Uint32Array(256 * 256);

            const rng: RandomNumberGenerator = new RandomNumberGenerator();
            rng.setSeed(100);

            for (let i: number = 0; i < 256 * 256; i++) {
                const scale: number = rng.getFloat();
                texture.texture[i] = 200 * scale | 255 * scale << 8 | 205 * scale << 16 | 255 << 24;
            }

            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.setCullFace(CullFace.BACK);
        framebuffer.reproduceRazorScene(time * 0.0018, [
            { tex: this.texture10, scale: 0.0, alpha: 1.0 },
            { tex: this.texture11, scale: 2.3, alpha: 0.5 },
            { tex: this.texture13, scale: 1.6, alpha: 0.25 },
            { tex: this.texture13, scale: 0.7, alpha: 0.22 },
            { tex: this.texture13, scale: -0.4, alpha: 0.22 },
        ], this.dirt);

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise, 0.04);
    }

}
