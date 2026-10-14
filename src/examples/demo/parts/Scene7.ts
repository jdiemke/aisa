import { Framebuffer } from '@engine/rendering/Framebuffer';
import { RotoZoomerScene } from '@examples/roto-zoomer/RotoZoomerScene';
import { CubeScene } from '@examples/cube/CubeScene';
import { Texture } from '@engine/texture/Texture';
import { TextureUtils } from '@engine/texture/TextureUtils';

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
            TextureUtils.load(require('@assets/logos/drug-chick.png'), true).then(
                (texture: Texture) => this.logo = texture
            ),
        ])
    }

    onInit() {
        this.RotoZoomerScene.onInit();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.RotoZoomerScene.render(framebuffer, time);
        this.CubeScene.renderBackground(framebuffer, time);
        framebuffer.drawTexture(0, framebuffer.height - this.logo.height, this.logo, 1.0);

    }

}
