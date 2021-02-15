import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';
import { PlasmaScene } from '../../plasma/PlasmaScene';

// pizza being delivered
export class Scene4 {

    private pizza: Texture;
    private image: Texture;
    private PlasmaScene: PlasmaScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.PlasmaScene = new PlasmaScene();

        return Promise.all([
            // https://www.pngkey.com/detail/u2r5r5o0o0e6a9i1_sign-up-for-deals-pizza-delivery-guy-png/
            TextureUtils.load(require('../../../assets/logos/pizza-delivery.png'), true).then(
                (texture: Texture) => this.pizza = texture
            ),
            TextureUtils.load(require('../../../assets/lsd.png'), true).then(
                (texture: Texture) => this.image = texture
            ),
            this.PlasmaScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlasmaScene.render(framebuffer, time);
        framebuffer.drawTexture(50,  ((framebuffer.height / 2) - (this.image.height / 2)) | 0, this.image, 1.0);
        framebuffer.drawTexture(framebuffer.width - this.pizza.width, (framebuffer.height ) - (this.pizza.height ) | 0, this.pizza, 1.0);
    }

}
