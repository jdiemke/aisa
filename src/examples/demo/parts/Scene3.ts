import { Framebuffer } from '../../../Framebuffer';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';
import { PlaneDeformationScene } from '../../plane-deformation/PlaneDeformationScene';

// logo title of demo
export class Scene3 {

    private logo: Texture;
    private PlaneDeformationFloorScene = new PlaneDeformationScene(8, require('../../../assets/cyber.png'));

    public init(framebuffer: Framebuffer): Promise<any> {

        // https://hyperpix.net/text-effects/80s/3d-80s-text-effect/
        return Promise.all([
            TextureUtils.load(require('../../../assets/logos/pizza_express.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
            this.PlaneDeformationFloorScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationFloorScene.drawPlaneDeformation(framebuffer, time >> 3, 0);
         framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);
    }

}
