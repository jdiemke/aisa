import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class Bobs extends AbstractScene {

    private texture5: Texture;
    private texture7: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.texture5 = texture
            ),
            TextureUtils.load(require('../../assets/ball2.png'), true).then(
                (texture: Texture) => this.texture7 = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);
        this.drawBobs(framebuffer, this.texture7, Date.now());
    }

    public drawBobs(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const scaledTime: number = time * 0.2;
        const BALL_SIZE: number = 16;

        for (let i = 0; i < 30; i++) {
            const x = (Math.cos(3 * scaledTime * 0.002 + i * 0.11) * (320 / 2 - BALL_SIZE / 2)) | 0;
            const y = (Math.sin(4 * scaledTime * 0.002 + i * 0.11) * (200 / 2 - BALL_SIZE / 2)) | 0;

            framebuffer.drawTextureNoClipAlpha(
                320 / 2 - BALL_SIZE / 2 + x,
                200 / 2 - BALL_SIZE / 2 + y,
                texture
            );
        }
    }

}
