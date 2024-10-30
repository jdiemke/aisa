import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

// chick on phone
export class Scene2 {
    private logo: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('@assets/logos/chick-on-phone.png'), true).then(
                (texture: Texture) => this.logo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);
    }

}
