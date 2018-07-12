import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class WobbleScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private atlantisBackground: Texture;
    private startTime: number;
    private noise: Texture;

    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            ),
            TextureUtils.load(require('./assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            TextureUtils.generateProceduralNoise().then(
                (texture: Texture) => this.noise = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
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
                Math.round(Math.sin(i * 0.009 + elapsedTime *0.9 + Math.PI * 2 / 4) * 60+100),
                Math.round(Math.sin(i * 0.009 + elapsedTime *0.9 + Math.PI * 2 / 4 * 2) * 60+100),
                Math.max(0,Math.sin(i * 0.009 + elapsedTime *0.9 + Math.PI * 2 / 4 * 2.5))*0.85+0.15
            );
        }

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.65);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);

        // framebuffer.noise(time, this.noise);
    }

    public drawVerticalSpan(framebuffer: Framebuffer, texture: Texture, x: number, y1: number, y2: number, scale: number =1.0): void {
        const delta: number = Math.abs(y2 - y1);
        const textureStep: number = texture.height / delta;
        const alpha: number = 1.0;
        let texpos: number = 0;
        const pixelStep: number = y2 > y1 ? 320 : -320;
        let index: number = x + y1 * 320;
        let shiny= Math.pow(scale,20);
        for (let i: number = 0; i < delta; i++) {
            let texel = texture.texture[x + Math.round(texpos) * texture.width];
            let alpha = ((texel >> 24) & 0xff) / 255 ;
            let inverseAlpha = 1 - alpha;
            alpha*= scale;
            let fbColor = framebuffer.framebuffer[index];
           
            let r = (((fbColor >> 0) & 0xff) * (inverseAlpha) + ((Math.min(255,((texel >> 0)& 0xff)+shiny*180)))  * (alpha)) | 0;
            let g = (((fbColor >> 8) & 0xff) * (inverseAlpha) + ((Math.min(255,((texel >> 8)& 0xff)+shiny*100))) * (alpha)) | 0;
            let b = (((fbColor >> 16) & 0xff) * (inverseAlpha) + ((Math.min(255,((texel >> 16)& 0xff)+shiny*100)))  * (alpha)) | 0;

            framebuffer.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);

            texpos += textureStep;
            index += pixelStep;
        }
    }

}
