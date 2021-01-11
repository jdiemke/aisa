import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

// pizza being delivered
export class Scene5 {

    private logo: Texture;
    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../../assets/logos/pizza-party.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);
    }

}
