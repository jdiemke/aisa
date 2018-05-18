import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class VoxelLandscapeScene extends AbstractScene {

    private heightmap: Texture;
    private texture2: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/razor1911.png'), true).then(
                (texture: Texture) => this.texture2 = texture
            ),
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        framebuffer.drawVoxelLandscape2(this.heightmap, time);
        framebuffer.drawTexture(32, 1, this.texture2, 1.0);
    }

}
