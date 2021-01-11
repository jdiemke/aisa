import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';
import { PlasmaScene } from '../../plasma/PlasmaScene';

// pizza being delivered
export class Scene4 {

    private logo: Texture;
    private PlasmaScene: PlasmaScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.PlasmaScene = new PlasmaScene();

        return Promise.all([
            TextureUtils.load(require('../../../assets/logos/pizza-delivery.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
            this.PlasmaScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlasmaScene.render(framebuffer, time);
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);
    }

}
