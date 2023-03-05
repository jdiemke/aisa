import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class PolarVoxelsScene extends AbstractScene {

    private heightmap: Texture;
    private noise: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        
        this.drawVoxelLandscape4(framebuffer, this.heightmap, time);
        this.drawPolarDistotion2( framebuffer, time, this.getTempTexture(framebuffer, time));
        framebuffer.noise(time, this.noise);
    }
    
    public getTempTexture(framebuffer: Framebuffer, time: number): Texture {

        const typeSwitch= ((time / 2000) | 0) % 2;
        const tempTexture: Texture = new Texture();
        tempTexture.texture = new Uint32Array(256 * 256);
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                const ypos = typeSwitch ? (framebuffer.height-1) - Math.round(framebuffer.height / 256 * x) : Math.round(framebuffer.height / 256 * x);
                const xpos = Math.round(framebuffer.width / 256 * y);
                tempTexture.texture[x + y * 256] = framebuffer.framebuffer[xpos + ypos * framebuffer.width];
            }
        }

        return tempTexture;
    }
    
    public drawPolarDistotion2( framebuffer:Framebuffer,elapsedTime: number, texture: Texture): void {
        let i = 0;
        const distScale = 1.355 * (0.4 + 0.6 * 0.5 * (1 + Math.sin(elapsedTime * 0.00017)));
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const xdist = (x - framebuffer.width / 2);
                const ydist = (y - framebuffer.height / 2);
                const dist = Math.sqrt(xdist * xdist + ydist * ydist) * distScale;
                const angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256;

                const color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];

                framebuffer.framebuffer[i++] = color1;
            }
        }
    }



    public drawVoxelLandscape4(framebuffer: Framebuffer, texture: Texture, time: number): void {
        framebuffer.clearColorBuffer(255 << 24);

        const MIN_DIST = 14;
        const MAX_DIST = 80;

        const camX = time * 0.02;
        const camY = 0;

        const focus = 29.7;
        const center = 90;
        const eye = 10;

        for (let x = 0; x < framebuffer.width; x++) {

            const dirX = Math.cos(time * 0.0001 + Math.PI * 2 / framebuffer.width * x) * 1.99;
            const dirY = Math.sin(time * 0.0001 + Math.PI * 2 / framebuffer.width * x) * 1.99;

            let highestPoint = 0;

            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;

            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {

                const height = // this.getBilinearFilteredPixel(texture, rayX, rayY)*0.6;
                    (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * Math.sin(Math.abs((dist - MIN_DIST) * 0.5 / (MAX_DIST - MIN_DIST))) * 3.5;
                const projHeight = Math.round((height - eye) * focus / dist + center) - 50;
                const color = (Math.round(height) * 200 / 255 + 55) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)));
                const packedRGB = 255 << 24 | (color * 0.7) << 16 | (color) << 8 | (color * 0.8);

                if (projHeight > highestPoint) {
                    let index = x + ((framebuffer.height-1) - highestPoint) * framebuffer.width;
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

}
