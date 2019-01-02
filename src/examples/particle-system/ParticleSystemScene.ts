import { Framebuffer } from '../../Framebuffer';
import { Matrix3f } from '../../math/Matrix3';
import { Matrix4f } from '../../math/Matrix4f';
import { Vector3f } from '../../math/Vector3f';
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
        this.particleSystem = new ParticleSystem();
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
        const time: number = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.particleSystem.drawParticleStreams(framebuffer, time, this.particleTexture2);
        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.55);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }

}
