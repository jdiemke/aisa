import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class VoxelTunnelScene extends AbstractScene {

    private heightmap: Texture;
    private abstract: Texture;
    private texture2: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
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
        let tempTexture = new Texture();
        tempTexture.texture = new Uint32Array(256 * 256);
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                let ypos = Math.round(200 / 256 * x);
                let xpos = Math.round(320 / 256 * y);
                tempTexture.texture[x + y * 256] = framebuffer.framebuffer[xpos + ypos * 320];
            }
        }
        this.drawPolarDistotion(framebuffer, time, tempTexture);
    }

    public drawPolarDistotion(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {
        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = Math.sqrt(xdist * xdist + ydist * ydist) * 1.355;
                let angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256;

                let color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];

                framebuffer.framebuffer[i++] = color1;
            }
        }
    }

    drawVoxelLandscape3(framebuffer: Framebuffer, texture: Texture, time: number) {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 10;
        const MAX_DIST = 100;

        let camX = time * 0.006;
        let camY = 0;

        const focus = 28.7;
        const center = 220;
        const eye = 120;

        for (let x = 0; x < 320; x++) {
            let dirX = Math.cos(time * 0.0005 + x * 0.005) * 0.4;
            let dirY = Math.sin(time * 0.0005 + x * 0.005) * 0.4;

            dirX = Math.cos(time * 0.0001 + Math.PI * 2 / 320 * x) * 0.4;
            dirY = Math.sin(time * 0.0001 + Math.PI * 2 / 320 * x) * 0.4;

            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                let height = //this.getBilinearFilteredPixel(texture, rayX, rayY)*0.6;
                    (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * 0.6;
                let projHeight = Math.round((height - eye) * focus / dist + center) - 50;
                let color = (Math.round(height) * 200 / 255 + 55) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)));
                let packedRGB = 255 << 24 | (color * 0.7) << 16 | (color) << 8 | (color * 0.8);

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
