import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class TitanEffectScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private atlantisBackground: Texture;
    private startTime: number;

    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // const time: number = Date.now() - this.startTime;
        const elapsedTime: number = 0.004 * time;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.atlantisBackground.texture);

        /*for (let i: number = 0; i < this.hoodlumLogo.width; i++) {
            this.drawVerticalSpan(framebuffer, this.hoodlumLogo, i,
                Math.round(Math.sin(i * 0.02 + elapsedTime + Math.PI * 2 / 4) * 20 + 100 - 50),
                Math.round(Math.sin(i * 0.02 + elapsedTime + Math.PI * 2 / 4 * 2) * 20 + 100 + 50)
            );
        }*/

        for (let i: number = 0; i < this.hoodlumLogo.width; i++) {
            this.drawVerticalSpan(framebuffer, this.hoodlumLogo, i,
                Math.round(Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4) * 60 + 100),
                Math.round(Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4 * 2) * 60 + 100),
                Math.max(0, Math.sin(i * 0.009 + elapsedTime * 0.9 + Math.PI * 2 / 4 * 2.5)) * 0.85 + 0.15
            );
        }

        const texture3: Texture = new Texture(this.accumulationBuffer, framebuffer.width, framebuffer.height);
        framebuffer.drawTexture(0, 0, texture3, 0.65);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }

    public drawVerticalSpan(framebuffer: Framebuffer, texture: Texture, x: number, y1: number,
        y2: number, scale: number = 1.0): void {
        const delta: number = Math.abs(y2 - y1);
        const textureStep: number = texture.height / delta;
        let texpos: number = 0;
        const pixelStep: number = y2 > y1 ? framebuffer.width : -framebuffer.width;
        let index: number = x + y1 * framebuffer.width;
        const shiny: number = Math.pow(scale, 20);
        for (let i: number = 0; i < delta; i++) {
            const texel: number = texture.texture[x + Math.round(texpos) * texture.width];
            let alpha: number = ((texel >> 24) & 0xff) / 255;
            const inverseAlpha: number = 1 - alpha;
            alpha *= scale;
            const fbColor: number = framebuffer.framebuffer[index];

            const r: number = (((fbColor >> 0) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 0) & 0xff) + shiny * 180))) * (alpha)) | 0;
            const g: number = (((fbColor >> 8) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 8) & 0xff) + shiny * 100))) * (alpha)) | 0;
            const b: number = (((fbColor >> 16) & 0xff) * (inverseAlpha) +
                ((Math.min(255, ((texel >> 16) & 0xff) + shiny * 100))) * (alpha)) | 0;

            framebuffer.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);

            texpos += textureStep;
            index += pixelStep;
        }
    }

}
