import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { Matrix4f, Vector3f } from '../../math';
import { Interpolator } from '../../math/Interpolator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils } from '../../texture';
import { Texture } from '../../texture/Texture';

export class ParticleWavesScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('@assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawParticleWaves(framebuffer, time, this.particleTexture2, true);

        const texture3 = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.85);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }



    public drawParticleWaves(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) { framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24); }
        framebuffer.clearDepthBuffer();

        const points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const scale = 2;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {

                const x = (j - num / 2) * scale;
                const y = 4 * (Math.sin(j * 0.09 * 2 + elapsedTime * 0.0008) + Math.cos(i * 0.08 * 2 + elapsedTime * 0.0009));
                const z = (i - num / 2) * scale;

                points.push(new Vector3f(x, y, z));
            }
        }

        const modelViewMartrix = Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(

            Matrix4f.constructXRotationMatrix(Math.PI * 0.1).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.00006))
        );

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach((element) => {

            const transformed = framebuffer.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort((a, b) => {
            return a.z - b.z;
        });

        points2.forEach((element) => {
            const size = -(1.3 * 192 / (element.z));
            framebuffer.drawParticle(
                Math.round(element.x - size / 2),
                Math.round(element.y - size / 2),
                Math.round(size), Math.round(size), texture, 1 / element.z, Interpolator.interpolate(-60, -25, element.z));
        });
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
