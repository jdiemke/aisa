import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { CubeScene } from '../cube/CubeScene';

export class BouncingTextScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private blurred: Texture;
    private cross: Texture;
    private micro: Texture;
    private noise: Texture;
    private atlantisBackground: Texture;
    private startTime: number;
    private scene: CubeScene;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.startTime = Date.now();
        this.scene = new CubeScene();
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('@assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            ),
            TextureUtils.load(require('@assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            TextureUtils.generateProceduralNoise().then(texture => this.noise = texture),
            TextureUtils.load(require('@assets/blurredBackground.png'), false).then(texture => this.blurred = texture),
            TextureUtils.load(require('@assets/cross.png'), true).then(texture => this.cross = texture),
            TextureUtils.load(require('@assets/microstrange.png'), false).then(texture => this.micro = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // const time: number = Date.now() - this.startTime;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

        const ukBasslineBpm = 140;
        const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
        const smashTime = (Date.now() - this.startTime) % ukBasslineClapMs;
        const smash = (Interpolator.cosineInterpolate(0, 15, smashTime) -
        Interpolator.cosineInterpolate(15, 200, smashTime) +
            0.4 * Interpolator.cosineInterpolate(200, 300, smashTime) -
            0.4 * Interpolator.cosineInterpolate(300, 400, smashTime)) * 35;


        const size = Math.round(1 * smash);
        const size2 = Math.round(1* smash);
        framebuffer.drawScaledTextureClipBiAdd(
            320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
            200 / 2 - 20 + size,
            this.micro.width * 2, this.micro.height * 2, this.micro, 0.5);

        framebuffer.drawScaledTextureClipBiAdd(
            320 - (((time * 0.05) | 0) % (this.micro.width + 320)) ,
            200 / 2 - 60 - size2,
            this.micro.width, this.micro.height, this.micro, 0.5);
        //framebuffer.glitchScreen(time, this.noise);
    }
}
