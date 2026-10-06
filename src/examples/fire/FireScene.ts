import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Fire } from '../../effects/fire/Fire';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class FireScene extends AbstractScene {

    private fire = new Fire();
    private logo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.fire.init(framebuffer);
        return TextureUtils.load(require('@assets/tristar.png'), true).then(
            texture => this.logo = texture
        );
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.fire.render(framebuffer);
        framebuffer.drawTextureNoClipAlpha(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo);
    }

}
