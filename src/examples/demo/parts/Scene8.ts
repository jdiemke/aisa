import { Framebuffer } from '../../../Framebuffer';
import { VoxelBallsScene } from '../../voxel-balls/VoxelBallsScene';
import { LedPlasmaScene } from '../../led-plasma/LedPlasmaScene';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

export class Scene8 {
    private VoxelBallsScene: VoxelBallsScene;
    private LedPlasmaScene: LedPlasmaScene;
    private logo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.VoxelBallsScene = new VoxelBallsScene();
        this.LedPlasmaScene = new LedPlasmaScene();

        return Promise.all([
            this.LedPlasmaScene.init(framebuffer),
            this.VoxelBallsScene.init(framebuffer),
            // pngitem.com/middle/Tommih_happy-surprised-woman-surprised-girl-png-transparent-png/
            TextureUtils.load(require('../../../assets/logos/drug-chick.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.LedPlasmaScene.render(framebuffer, time);
        this.VoxelBallsScene.renderTransparent(framebuffer, time);
        // framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);

    }

}