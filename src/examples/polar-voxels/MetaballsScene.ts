import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class MetaballsScene extends AbstractScene {

    private heightmap: Texture;
    private noise: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture)
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() * 3;
        this.drawVoxelLandscape4(framebuffer, this.heightmap, time);
        const tempTexture: Texture = new Texture();
        tempTexture.texture = new Uint32Array(256 * 256);
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                let ypos = 199 - Math.round(200 / 256 * x);
                let xpos = Math.round(320 / 256 * y);
                tempTexture.texture[x + y * 256] = framebuffer.framebuffer[xpos + ypos * 320];
            }
        }
        framebuffer.drawPolarDistotion2(time, tempTexture);
        framebuffer.noise(time, this.noise);
    }

    public drawVoxelLandscape4(framebuffer: Framebuffer, texture: Texture, time: number): void {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 14;
        const MAX_DIST = 80;

        let camX = time * 0.02;
        let camY = 0;

        const focus = 29.7;
        const center = 90;
        const eye = 10;

        for (let x = 0; x < 320; x++) {
            let dirX;
            let dirY;

            dirX = Math.cos(time * 0.0001 + Math.PI * 2 / 320 * x) * 1.99;
            dirY = Math.sin(time * 0.0001 + Math.PI * 2 / 320 * x) * 1.99;

            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                let height = //this.getBilinearFilteredPixel(texture, rayX, rayY)*0.6;
                    (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * Math.sin(Math.abs((dist - MIN_DIST) * 0.5 / (MAX_DIST - MIN_DIST))) * 3.5;
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
