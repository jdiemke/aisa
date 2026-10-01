import { Framebuffer } from '../../../Framebuffer';
import { Interpolator } from '../../../math/Interpolator';
import { sceneData } from '../../../sound/MusicProperties';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

export class Scene1 {

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
    public render(framebuffer: Framebuffer, time: number, sceneData?: sceneData): void {
            const w = framebuffer.width;
            const h = framebuffer.height;

            framebuffer.drawScaledTextureClipBi(0, 0, w, h, this.blurred, 1.0);

           // framebuffer.setCullFace(CullFace.BACK);
            //framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);

            framebuffer.drawScaledTextureClipAdd(
                w - (((time * 0.09) | 0) % (this.micro.width * 2 + w)),
                h / 2 - 20,
                this.micro.width * 2, this.micro.height * 2, this.micro);

            framebuffer.drawScaledTextureClipAdd(
                w - (((time * 0.05) | 0) % (this.micro.width + w)),
                h / 2 - 60,
                this.micro.width, this.micro.height, this.micro);

            const tmpGlitch = new Uint32Array(w * h);
            framebuffer.fastFramebufferCopy(tmpGlitch, framebuffer.framebuffer);

            const texture = new Texture();
            texture.texture = tmpGlitch;
            texture.width = w;
            texture.height = h;

            const bass = sceneData?.bass ?? 0;
            const smash = bass * 35;
            const width = Math.round(w + smash * w / 50);
            const height = Math.round(h + smash * h / 50);

            // slow
            framebuffer.drawScaledTextureClipBi(
                Math.round(w / 2 - width / 2),
                Math.round(h / 2 - height / 2),
                width, height, texture, 1.0);

            framebuffer.noise(time, this.noise);

    }

}
