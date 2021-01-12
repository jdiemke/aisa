import { Framebuffer } from '../../../Framebuffer';
import { RotoZoomerScene } from '../../roto-zoomer/RotoZoomerScene';
import { CubeScene } from '../../cube/CubeScene';
import { Texture } from '../../../texture/Texture';
import { TextureUtils } from '../../../texture/TextureUtils';

export class Scene7 {
    private RotoZoomerScene: RotoZoomerScene;
    private CubeScene: CubeScene;
    private logo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.RotoZoomerScene = new RotoZoomerScene();
        this.CubeScene = new CubeScene();

        return Promise.all([
            this.CubeScene.init(framebuffer),
            this.RotoZoomerScene.init(framebuffer),
            // pngitem.com/middle/Tommih_happy-surprised-woman-surprised-girl-png-transparent-png/
            TextureUtils.load(require('../../../assets/logos/drug-chick.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.RotoZoomerScene.render(framebuffer, time);
        this.CubeScene.renderBackground(framebuffer, time);
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.logo.height / 2)) | 0, this.logo, 1.0);

    }

}