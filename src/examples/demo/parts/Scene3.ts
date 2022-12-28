import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

// chick on phone
export class Scene3 {
    private logo: Texture;
    private background: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../../assets/logos/chick-on-phone.png'), true).then(
                (texture: Texture) => this.background = texture
            ),
            TextureUtils.load(require('../../../assets/logos/pizza_express.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.background.height / 2)) | 0, this.background, 1.0);

        framebuffer.drawTexture(
            ((framebuffer.width / 2) - (this.logo.width / 2)) | 0,
            ((framebuffer.height / 2) - (this.logo.height / 2)) | 0,
            this.logo,
            1.0);
    }

}
