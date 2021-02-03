import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { TorusKnot } from '../../geometrical-objects/TorusKnot';
import { Vector4f } from '../../math/index';
import { Matrix4f } from '../../math/Matrix4f';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { LinearFog } from '../../shading/fog/LinearFog';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class TorusKnotScene extends AbstractScene {

    private rave: Texture;
    private torus: TorusKnot = new TorusKnot();
    private noise: Texture;
    private micro: Texture;
    private startTime: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.renderingPipeline.setCullFace(CullFace.BACK);
        framebuffer.renderingPipeline.setFog(new LinearFog(-160, -380, new Vector4f(0, 0, 0, 1)));
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/rave.png'), false).then(
                (texture: Texture) => this.rave = texture
            ),
            TextureUtils.load(require('../../assets/microstrange.png'), false).then(
                (texture: Texture) => this.micro = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {

        this.raveMoview(framebuffer, time * 5, this.rave);

        this.glitchScreen(framebuffer, time, this.noise);
        // framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);

        framebuffer.drawScaledTextureClipAdd(
            framebuffer.width - (((time * 0.13) | 0) % (this.micro.width * 2 + framebuffer.width)),
            framebuffer.height / 2 - 20,
            this.micro.width * 2, this.micro.height * 2, this.micro, 0.5);

        framebuffer.drawScaledTextureClipAdd(
            (((time * 0.1) | 0) % (this.micro.width + framebuffer.width)) - framebuffer.width,
            framebuffer.height / 2 - 60,
            this.micro.width, this.micro.height, this.micro, 0.5);

        framebuffer.setCullFace(CullFace.BACK);
        this.shadingTorus5(framebuffer, time * 0.03);
        /*
                framebuffer.drawScaledTextureClipAdd(
                    framebuffer.width - (((time * 0.05) | 0) % (this.micro.width + framebuffer.width)),
                    framebuffer.height / 2 - 60,
                    this.micro.width, this.micro.height, this.micro);*/
    }

    public raveMoview(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {
        framebuffer.fastFramebufferCopyOffset(framebuffer.framebuffer, texture.texture, -(Math.round(elapsedTime / 200) % 11) * 200);
    }

    public glitchScreen(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noise: boolean = true): void {

        const glitchFactor = (Math.sin(elapsedTime * 0.0003) * 0.5 + 0.5);
        const rng = new RandomNumberGenerator();
        rng.setSeed((elapsedTime / 250) | 0);
        const texture2 = new Texture();
        texture2.height = framebuffer.height;
        texture2.width = framebuffer.width;
        texture2.texture = framebuffer.framebuffer;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 10; y++) {
                if (rng.getFloat() > 0.25) {
                    continue;
                }

                framebuffer.drawTextureRect(20 * (16 - x), 20 * ((16 * rng.getFloat()) | 0), 20 * x, 20 * y, 20, 20, texture2.texture, texture2.width, 0.1 + 0.35 * glitchFactor);
            }
        }

        if (noise) {
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 10; y++) {
                    framebuffer.drawTextureRect(x * 20, y * 20, 20 * (Math.round(elapsedTime / 100 + x + y) % 12), 0, 20, 20, texture.texture, texture.width, 0.1 + 0.3 * glitchFactor);
                }
            }
        }

        framebuffer.fastFramebufferCopy(framebuffer.tmpGlitch, framebuffer.framebuffer);

        // now distort the tmpGlitch buffer and render to framebuffer again

        const rng2 = new RandomNumberGenerator();

        for (let k = 0; k < 8; k++) {
            let yStart = Math.round(rng.getFloat() * 180);
            const size = 3 + Math.round(rng.getFloat() * 20);
            rng2.setSeed((elapsedTime / 250) | 0);
            const scale = rng2.getFloat() * glitchFactor;
            const off = rng.getFloat() * glitchFactor;
            for (let y = 0; y < size; y++) {
                const offset = Math.abs(Math.round(off * 25) + Math.round(rng2.getFloat() * 3)
                    + Math.round(Math.cos(y * 0.01 + elapsedTime * 0.002 + off) * scale * 5));

                let index = yStart * framebuffer.width;
                let glIndex = yStart * framebuffer.width + framebuffer.width - offset;

                for (let i = 0; i < Math.max(0, offset); i++) {
                    framebuffer.framebuffer[index++] = framebuffer.tmpGlitch[glIndex++];
                }

                glIndex = yStart * framebuffer.width;
                const count = framebuffer.width - offset;

                for (let i = 0; i < count; i++) {
                    framebuffer.framebuffer[index++] = framebuffer.tmpGlitch[glIndex++];
                }
                yStart++;
            }
        }
    }


    private shadingTorus5(framebuffer: Framebuffer, time: number) {
        framebuffer.clearDepthBuffer();

        const scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(time * 0.035));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(time * 0.04));

        const ukBasslineBpm = 130 / 2;
        const ukBasslineClapMs = 60000 / ukBasslineBpm;
        const smashTime = (time * 10) % ukBasslineClapMs;
        const smash = (framebuffer.cosineInterpolate(0, 15, smashTime) - framebuffer.cosineInterpolate(15, 200, smashTime) +
            0.4 * framebuffer.cosineInterpolate(200, 300, smashTime) - 0.4 * framebuffer.cosineInterpolate(300, 400, smashTime)
        )
            * 12;
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(time * 0.04) * 20,
            Math.sin(time * 0.05) * 8 - smash * 5, -28 - 250).multiplyMatrix(modelViewMartrix);

        framebuffer.renderingPipeline.draw(framebuffer, this.torus.getMesh(), modelViewMartrix);
    }

}
