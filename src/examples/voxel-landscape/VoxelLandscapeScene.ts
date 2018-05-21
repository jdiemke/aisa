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

        this.drawVoxelLandscape2(framebuffer, this.heightmap, time);
        framebuffer.drawTexture(32, 1, this.texture2, 1.0);
    }

    /**
     * Generates a voxel landscape.
     * 
     * TODO:
     * - y-span color interpolation
     * - texturing
     * 
     * http://simulationcorner.net/index.php?page=comanche
     * http://www.flipcode.com/archives/Realtime_Voxel_Landscape_Engines-Part_2_Rendering_the_Landscapes_Structure.shtml
     * http://www.massal.net/article/voxel/
     * 
     * @param {Texture} texture The heightmap
     * @param {number} time Elapsed time in milliseconds
     * 
     * @memberof Framebuffer
     */
    drawVoxelLandscape2(framebuffer: Framebuffer, texture: Texture, time: number) {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 45;
        const MAX_DIST = 200;

        let camX = time * 0.008;
        let camY = 0;

        const focus = 125.7;
        const center = 300;
        const eye = 250;

        for (let x = 0; x < 320; x++) {
            let dirX = Math.cos(time * 0.0005 + x * 0.005) * 0.4;
            let dirY = Math.sin(time * 0.0005 + x * 0.005) * 0.4;


            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                let height = framebuffer.getBilinearFilteredPixel(texture, rayX, rayY);
                let projHeight = Math.round((height - eye) * focus / dist + center);
                let color = Math.round(height) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)) * 10);
                let packedRGB = 255 << 24 | (color + 10) << 16 | (color + 20) << 8 | (color + 13);

                if (projHeight > highestPoint) {
                    let index = x + (199 - highestPoint) * 320;
                    let max = Math.min(projHeight, 200);

                    for (let i = highestPoint; i < max; i++) {
                        framebuffer.framebuffer[index] = packedRGB;
                        index -= 320;
                    }

                    if (max == 200) {
                        break;
                    }

                    highestPoint = projHeight;
                }

                rayX += dirX;
                rayY += dirY;
            }
        }
    }

}
