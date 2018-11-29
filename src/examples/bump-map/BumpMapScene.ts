import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { FontRenderer } from '../sine-scroller/FontRenderer';


/**
 * http://pascal.sources.ru/demo/bumpmap.htm
 */
export class BumpMapScene extends AbstractScene {

    private map: Texture;
    private bump: Texture;
    private phong: Texture;
    private fontRenderer2: FontRenderer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.phong = new Texture(new Uint32Array(256 * 256), 256, 256);
        for (let i = 0; i < 255; i++) {
            for (let j = 0; j < 255; j++) {
                let nX = (i - 128) / 128;
                let nY = (j - 128) / 128;
                let nZ = 1 - Math.sqrt(nX * nX + nY * nY);
                if (nZ < 0) {
                    nZ = 0;
                }
                let inten = Math.round(nZ * 255) & 0xff;
                this.phong.texture[i + 256 * j] = inten |
                    inten << 8 | inten << 16 | 255 << 24;
            }
        }
        const fonts: string =
            'ABCDEFGHIJ' +
            'KLMNOPQRST' +
            'UVWXYZ@+# ' +
            '0123456789' +
            '!\'()?-/.,';
        this.fontRenderer2 = new FontRenderer(
            framebuffer,
            32, 34, fonts,
            require('../sine-scroller/assets/fraxionFont.png')
        );

        return Promise.all([
            TextureUtils.load(require('./map.png'), false).then(texture => this.map = texture),
            TextureUtils.load(require('./bump.png'), false).then(texture => this.bump = texture),
            this.fontRenderer2.init()
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        let elapsedTime: number = Date.now() ;
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.bump.texture);

        for (let x = 0; x < 320; x++) {
            for (let y = 0; y < 200; y++) {
                let lx = x - Math.sin(2 * Date.now() * 0.0008) * 160 - 160;
                let ly = y - Math.sin(3 * Date.now() * 0.0008) * 100 - 100;
                let nx = ((this.bump.getPixel3(this.bump, x - 1, y) & 0xff) - (this.bump.getPixel3(this.bump, x + 1, y) & 0xff));
                let ny = ((this.bump.getPixel3(this.bump, x, y - 1) & 0xff) - (this.bump.getPixel3(this.bump, x, y + 1) & 0xff));

                nx = Math.round((-nx - lx) + 128);
                ny = Math.round((-ny - ly) + 128);
                let pixel = this.phong.getPixel2(this.phong,
                    Math.max(0, Math.min(nx, 255)), Math.max(0, Math.min((ny), 255)));
                let scale = Math.min((pixel & 0xff) + 80, 255) / 255;

                let texel = this.map.getPixel2(this.map, x, y);
                let red = (texel >> 0) & 0xff;
                let green = (texel >> 8) & 0xff;
                let blue = (texel >> 16) & 0xff;
                framebuffer.drawPixel(x, y,
                    Math.round(red * scale) |
                    Math.round(green * scale) << 8 |
                    Math.round(blue * scale) << 16 | 255 << 24
                );
            }
        }

        this.fontRenderer2.drawText(0, 100,
            '   * WE REALLY LOVE SCROLLERS * HOW ABOUT YOU? THIS PRODUCTION IS FROM HOODLUM' +
            '~< LETS GO ON WITH THE GENERAL BLAH BLAH      ', elapsedTime * 1.4, true);
    }

}
