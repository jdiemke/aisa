import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
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
            TextureUtils.load(require('@assets/eye-background.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralParticleTexture().then((texture) => this.particleTexture2 = texture),
            TextureUtils.generateProceduralNoise().then((texture) => this.noise = texture)
        ]);
    }

    private slowDateNow(): number {
        return Date.now() *0.5;
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.drawScaledTextureClipBi(0,0,framebuffer.width, framebuffer.height, this.blurred, 1.0);
        this.drawParticleTorus(framebuffer, time*4, this.particleTexture2, true);

        const tmpGlitch: Uint32Array = new Uint32Array(framebuffer.width * framebuffer.height);
        framebuffer.fastFramebufferCopy(tmpGlitch, framebuffer.framebuffer);

        const texture: Texture = new Texture();
        texture.texture = tmpGlitch;
        texture.width = framebuffer.width;
        texture.height = framebuffer.height;

        const ukBasslineBpm: number = 140;
        const ukBasslineClapMs: number = 60000 / ukBasslineBpm * 2;
        const smashTime: number = (this.slowDateNow() - this.start*0.5) % ukBasslineClapMs;
        const smash: number = (Interpolator.cosineInterpolate(0, 20, smashTime) -
        Interpolator.cosineInterpolate(20, 300, smashTime)) * 35;
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
            const radi = 3.4 * (2 + Math.sin((i * Math.PI / (num / 2)) * 2 + elapsedTime * 0.0008)); // *sinf(Time*0.0008f)));
            const move = elapsedTime * 0.03;
            const x = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 7);
            const y = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 4);
            const z = radi * Math.sin(((move + i) * Math.PI / (num / 2)) * 7);

            points.push(new Vector3f(x, y, z));
        }

        const modelViewMartrix = Matrix4f.constructTranslationMatrix(1, 0, -63)
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
            const size = -(4.9 * 192 / (element.z));
            framebuffer.drawParticle2Sub(
                element.x - size / 2,
                element.y - size / 2,
                size, size, texture, 1 / element.z, 0.7, 0, 256,
                0.5,1.0,0.3
            );

        });
    }

}
