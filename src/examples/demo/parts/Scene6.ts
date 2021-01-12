import { Framebuffer } from '../../../Framebuffer';
import { PlaneDeformationScene } from '../../plane-deformation/PlaneDeformationScene';
import { DistortedSphereScene } from '../../distorted-sphere/DistortedSphereScene';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class Scene6 {
    private PlaneDeformationScene: PlaneDeformationScene;
    private DistortedSphereScene: DistortedSphereScene;
    private logo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.PlaneDeformationScene = new PlaneDeformationScene(3, require('../../../assets/textures/checker.png'));
        this.DistortedSphereScene = new DistortedSphereScene();

        return Promise.all([
            this.DistortedSphereScene.init(framebuffer),
            this.PlaneDeformationScene.init(framebuffer),
            // https://www.pngitem.com/middle/iwTwxh_face-facial-hair-sitting-tongue-fear-woman-png/
            TextureUtils.load(require('../../../assets/logos/drug-chick-2.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {

        this.PlaneDeformationScene.render(framebuffer, time);
        this.DistortedSphereScene.renderTransparent(framebuffer, time);
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);
    }

}