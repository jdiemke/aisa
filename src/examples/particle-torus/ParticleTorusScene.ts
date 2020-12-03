import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector3f } from '../../math/Vector3f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class ParticleTorusScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private start: number;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.start = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralParticleTexture().then((texture) => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then((texture) => this.noise = texture)
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawParticleTorus(framebuffer, time, this.particleTexture2, true);

        const tmpGlitch: Uint32Array = new Uint32Array(framebuffer.width * framebuffer.height);
        framebuffer.fastFramebufferCopy(tmpGlitch, framebuffer.framebuffer);

        const texture: Texture = new Texture();
        texture.texture = tmpGlitch;
        texture.width = framebuffer.width;
        texture.height = framebuffer.height;

        const ukBasslineBpm: number = 140;
        const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
        const smashTime: number = (Date.now() - this.start) % ukBasslineClapMs;
        const smash: number = (framebuffer.cosineInterpolate(0, 20, smashTime) -
            framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
        const width: number = Math.round(framebuffer.width + smash * framebuffer.width / 100);
        const height: number = Math.round(framebuffer.height + smash * framebuffer.height / 100);

        framebuffer.drawScaledTextureClipBi(
            Math.round(framebuffer.width / 2 - width / 2),
            Math.round(framebuffer.height / 2 - height / 2),
            width, height, texture, 1.0);

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.85);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        framebuffer.noise(time, this.noise);
    }

    public drawParticleTorus(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) { framebuffer.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24); }
        framebuffer.clearDepthBuffer();

        const points: Array<Vector3f> = new Array<Vector3f>();
        const num = 300;
        for (let i = 0; i < num; i++) {
            const radi = 3.4 * (2 + Math.sin((i * Math.PI / (num / 2)) * 2 + elapsedTime * 0.0004)); // *sinf(Time*0.0008f)));
            const move = elapsedTime * 0.0015;
            const x = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 7);
            const y = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 4);
            const z = radi * Math.sin(((move + i) * Math.PI / (num / 2)) * 7);

            points.push(new Vector3f(x, y, z));
        }

        const modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -20)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.0003)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.0003)));

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach((element) => {

            const transformed = framebuffer.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort((a, b) => {
            return a.z - b.z;
        });

        points2.forEach((element) => {
            const size = -(2.2 * 192 / (element.z));
            framebuffer.drawParticle(
                Math.round(element.x) - Math.round(size / 2),
                Math.round(element.y) - Math.round(size / 2),
                Math.round(size), Math.round(size), texture, 1 / element.z, 1.0);
        });
    }

}
