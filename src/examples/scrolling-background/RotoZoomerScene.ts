import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class RotoZoomerScene extends AbstractScene {

    private logoTexture: Texture;
    private startTime: number = Date.now();

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/pandabear.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        this.scrollingBackground(framebuffer, this.logoTexture, time);
    }

    public scrollingBackground(framebuffer: Framebuffer, texture: Texture, time: number) {
        let offset = Math.round(-(1 - framebuffer.interpolate(250, 10250, time * 0.25)) * (texture.height - 200));
        framebuffer.fastFramebufferCopyOffset(framebuffer.framebuffer, texture.texture, offset);
    }

}
