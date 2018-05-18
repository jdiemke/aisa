import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import Texture from '../../Texture';
import { TextureUtils } from '../../TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class LensScene extends AbstractScene {

    private texture5: Texture;
    private texture6: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.texture5 = texture
            ),
            TextureUtils.load(require('./assets/lens.png'), true).then(
                (texture: Texture) => this.texture6 = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);
        framebuffer.drawLens(this.texture5, this.texture6, time);
    }

}
