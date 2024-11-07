import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class TextZoomScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private blurred: Texture;
    private cross: Texture;
    private micro: Texture;
    private noise: Texture;
    private atlantisBackground: Texture;
    private startTime: number;

    start: number;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.startTime = Date.now();

        this.start = Date.now();
        return Promise.all([

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

            framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);

           // framebuffer.setCullFace(CullFace.BACK);
            //framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);

            framebuffer.drawScaledTextureClipAdd(
                320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                200 / 2 - 20,
                this.micro.width * 2, this.micro.height * 2, this.micro);

            framebuffer.drawScaledTextureClipAdd(
                320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                200 / 2 - 60,
                this.micro.width, this.micro.height, this.micro);

            const tmpGlitch = new Uint32Array(320 * 200);
            framebuffer.fastFramebufferCopy(tmpGlitch, framebuffer.framebuffer);

            const texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;

            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (Interpolator.cosineInterpolate(0, 20, smashTime) -
            Interpolator.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 50);
            const height = Math.round(200 + smash * 200 / 50);

            // slow
            framebuffer.drawScaledTextureClipBi(
                Math.round(320 / 2 - width / 2),
                Math.round(200 / 2 - height / 2),
                width, height, texture, 1.0);

            framebuffer.noise(time, this.noise);

    }


}
