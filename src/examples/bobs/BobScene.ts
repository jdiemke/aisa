import { Canvas } from '../../Canvas';
import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils} from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class BobScene extends AbstractScene {

    private texture5: Texture;
    private texture7: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(texture => this.texture5 = texture),
            TextureUtils.load(require('../../assets/ball2.png'), true).then(texture => this.texture7 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);
        framebuffer.drawBobs(this.texture7, Date.now());
    }

}
