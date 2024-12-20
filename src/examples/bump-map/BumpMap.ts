import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * http://pascal.sources.ru/demo/bumpmap.htm
 */
export class BumpMap extends AbstractScene {

    private map: Texture;
    private bump: Texture;
    private phong: Texture;
    private normals: Array<[number, number]>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.normals = new Array<[number, number]>(framebuffer.width * framebuffer.height);
        this.phong = new Texture(new Uint32Array(256 * 256), 256, 256);
        for (let i = 0; i < 255; i++) {
            for (let j = 0; j < 255; j++) {
                const nX = (i - 128) / 128;
                const nY = (j - 128) / 128;
                let nZ = 1 - Math.sqrt(nX * nX + nY * nY);
                if (nZ < 0) {
                    nZ = 0;
                }
                const inten = Math.round(nZ * 255) & 0xff;
                this.phong.texture[i + 256 * j] = inten |
                    inten << 8 | inten << 16 | 255 << 24;
            }
        }

        return Promise.all([
            TextureUtils.load(require('@assets/map.png'), false).then(texture => this.map = texture),
            TextureUtils.load(require('@assets/bump.png'), false).then(texture => this.bump = texture),
        ]).then(
            () => {
                // precompute normal map
                let framebufferIndex: number = 0;
                for (let y = 0; y < framebuffer.height; y++) {
                    for (let x = 0; x < framebuffer.width; x++) {
                        const nx = ((this.bump.getPixel3(this.bump, x - 1, y) & 0xff) - (this.bump.getPixel3(this.bump, x + 1, y) & 0xff));
                        const ny = ((this.bump.getPixel3(this.bump, x, y - 1) & 0xff) - (this.bump.getPixel3(this.bump, x, y + 1) & 0xff));
                        this.normals[framebufferIndex++] = [nx, ny];
                    }
                }
            });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        let framebufferIndex: number = 0;
        const lightPosX = - Math.sin(2 * time * 0.0008) * (framebuffer.width/2) - (framebuffer.width/2);
        const lightPosY = - Math.sin(3 * time * 0.0008) * (framebuffer.height/2) - (framebuffer.height/2);
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {

                const lx = x + lightPosX;
                const ly = y + lightPosY;

                const normal = this.normals[framebufferIndex];

                const nx = ((-normal[0] - lx) + 128) | 0;
                const ny = ((-normal[1] - ly) + 128) | 0;
                const pixel = this.phong.getPixel2(this.phong,
                    Math.max(0, Math.min(nx, 255)), Math.max(0, Math.min((ny), 255)));
                const scale = Math.min((pixel & 0xff) + 80, 255) / 255;

                const texel = this.map.texture[framebufferIndex];
                const red = (texel >> 0) & 0xff;
                const green = (texel >> 8) & 0xff;
                const blue = (texel >> 16) & 0xff;
                framebuffer.framebuffer[framebufferIndex++] =
                    Math.round(red * scale) |
                    Math.round(green * scale) << 8 |
                    Math.round(blue * scale) << 16 | 255 << 24;
            }
        }

    }

}