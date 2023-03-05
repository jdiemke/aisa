import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class VoxelLandscapeScene extends AbstractScene {

    private heightmap: Texture;
    private abstract: Texture;
    private texture2: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/razor1911.png'), true).then(
                (texture: Texture) => this.texture2 = texture
            ),
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.load(require('../../assets/abstract.png'), false).then(
                (texture: Texture) => this.abstract = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.drawVoxelLandscape3(framebuffer, this.heightmap, time);
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
    public drawVoxelLandscape2(framebuffer: Framebuffer, texture: Texture, time: number) {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 45;
        const MAX_DIST = 200;

        const camX = time * 0.008;
        const camY = 0;

        const focus = 125.7;
        const center = 300;
        const eye = 260;

        for (let x = 0; x < framebuffer.width; x++) {
            const dirX = Math.cos(time * 0.0005 + x * 0.005) * 0.4;
            const dirY = Math.sin(time * 0.0005 + x * 0.005) * 0.4;

            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                const height = texture.getBilinearFilteredPixel(rayX, rayY);
                const projHeight = Math.round((height - eye) * focus / dist + center);
                const color = Math.round(height) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)) * 10);
                const packedRGB = 255 << 24 | (color + 10) << 16 | (color + 20) << 8 | (color + 13);

                if (projHeight > highestPoint) {
                    let index = x + ((framebuffer.height - 1) - highestPoint) * framebuffer.width;
                    const max = Math.min(projHeight, framebuffer.height);

                    for (let i = highestPoint; i < max; i++) {
                        framebuffer.framebuffer[index] = packedRGB;
                        index -= framebuffer.width;
                    }

                    if (max === framebuffer.height) {
                        break;
                    }

                    highestPoint = projHeight;
                }

                rayX += dirX;
                rayY += dirY;
            }
        }
    }

    public drawVoxelLandscape3(framebuffer: Framebuffer, texture: Texture, time: number) {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 35;
        const MAX_DIST = 300;

        const camX = time * 0.008;
        const camY = 0;

        const focus = 45;
        const center = 300;
        const eye = 480;

        for (let x = 0; x < framebuffer.width; x++) {
            const dirX = Math.cos(time * 0.0005 + x * 0.0018) * 0.4;
            const dirY = Math.sin(time * 0.0005 + x * 0.0018) * 0.4;

            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                const height = texture.getPixel(texture, rayX, rayY) & 0xff;
                const projHeight = Math.round((height - eye) * focus / dist + center);
                const packedRGB = texture.getPixel(this.abstract, rayX, rayY) | 255 << 24;

                if (projHeight > highestPoint) {
                    let index = x + ((framebuffer.height - 1) - highestPoint) * framebuffer.width;
                    const max: number = Math.min(projHeight, framebuffer.height);

                    for (let i: number = highestPoint; i < max; i++) {
                        framebuffer.framebuffer[index] = packedRGB;
                        index -= framebuffer.width;
                    }

                    if (max === framebuffer.height) {
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
