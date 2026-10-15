import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Interpolator } from '@engine/math';
import { AbstractScene } from '@core';
import { Texture, TextureUtils } from '@engine/texture';

export class ScrollingBackgroundScene extends AbstractScene {

    private logoTexture: Texture;
    private startTime: number = Date.now();

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('@assets/pandabear.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        this.scrollingBackground(framebuffer, this.logoTexture, time);
    }

    public scrollingBackground(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const offset: number = Math.round(
            -(1 - Interpolator.interpolate(250, 10250, time * 0.25)) * (texture.height - 200)
        );

        framebuffer.fastFramebufferCopyOffset(framebuffer.framebuffer, texture.texture, offset);
    }

}
