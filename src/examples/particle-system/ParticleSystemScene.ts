import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/Matrix4f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { ParticleSystem } from './ParticleSystem';

export class ParticleSystemScene extends AbstractScene {

    private blurred: Texture;
    private particleTexture2: Texture;
    private noise: Texture;
    private particleSystem: ParticleSystem;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        this.particleSystem = new ParticleSystem(Date.now() * 0.8);
        return Promise.all([
            TextureUtils.load(require('../../assets/blurredBackground.png'), false).then(
                (texture: Texture) => this.blurred = texture
            ),
            TextureUtils.generateProceduralParticleTexture().then(
                (texture: Texture) => this.particleTexture2 = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() * 0.8;
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        framebuffer.clearDepthBuffer();
        const mat: Matrix4f = this.getMV(time * 3);
        this.particleSystem.drawParticleStreams(framebuffer, time, this.particleTexture2, mat);
        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.55);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

    private getMV(elapsedTime: number): Matrix4f {
        const camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -24 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 2)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.00035).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0003)
                    ));

        return camera.multiplyMatrix(Matrix4f.constructScaleMatrix(3, 3, 3));
    }

}
