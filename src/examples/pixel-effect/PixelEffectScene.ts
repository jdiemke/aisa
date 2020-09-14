import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils } from '../../texture/TextureUtils';
import { Texture } from '../../texture/Texture';
import { ScaleClipBlitter } from '../../blitter/ScaleClipBlitter';
import { FontRenderer } from '../sine-scroller/FontRenderer';
import { PixelInterpolator } from './PixelInterpolator';
import { Vector2f } from '../../math/index';

/**
 * TODO: extract lens into effect class
 */
export class PixelEffectScene extends AbstractScene {

    private heightmap: Texture;
    private metall: Texture;
    private hoodlumLogo: Texture;
    private fontRenderer2: FontRenderer;
    private startTime = Date.now();

    private pixels: Array<PixelInterpolator> = new Array<PixelInterpolator>();

    private scaleClipBlitter: ScaleClipBlitter;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scaleClipBlitter = new ScaleClipBlitter(framebuffer);

        const fonts2: string =
            ' !"    \'  ' +
            '  ,-. 0123' +
            '456789:; =' +
            ' ? ABCDEFG' +
            'HIJKLMNOPQ' +
            'RSTUVWXYZ ';
        this.fontRenderer2 = new FontRenderer(
            framebuffer,
            32, 32, fonts2,
            require('./../../assets/equinox.png')
        );

        return Promise.all([
            TextureUtils.load(require('../../assets/scify.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.load(require('../../assets/tristar.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ), this.fontRenderer2.init()
        ]);
    }

    public onInit(): void {
        let count = 0;
        for (let x = 0; x < this.hoodlumLogo.width; x++) {
            for (let y = 0; y < this.hoodlumLogo.height; y++) {

                const pixel = this.hoodlumLogo.getPixel2(this.hoodlumLogo, x, y);
                if (((pixel >> 24) & 0xff) === 255) {
                    this.pixels.push(new PixelInterpolator(
                        new Vector2f(
                            Math.round(Math.sin(4 * count * 0.0004 * Math.PI * 2) * 150 + 160),
                            Math.round(Math.cos(3 * count * 0.0004 * Math.PI * 2) * 90 + 100)),
                        new Vector2f(x, y + 67),
                        pixel,
                        count * 3
                    )
                    );
                    count++;
                }

            }
        }
    }

    public render(framebuffer: Framebuffer): void {
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.heightmap, this.heightmap);

        this.fontRenderer2.drawText(0, 200 - 32 - 16,
            '              WELCOME TO A NEW RELEASE FROM YOUR FRIENDS IN CRIME! HOW DO YOU LIKE THIS INTRO?'
            , (Date.now() - this.startTime) * 0.8, false);

        for (let x = 0; x < this.pixels.length; x++) {
            const pos = this.pixels[x].getPos((Date.now() - this.startTime - this.pixels[x].startTime) * 0.0002, x);
            if (pos.x < 0 || pos.x > 319 || pos.y < 0 || pos.y > 199) continue;
            const alpha =
                Math.max(0, Math.min(1, (Date.now() - this.startTime - this.pixels[x].startTime) * 0.001));
            framebuffer.drawPixel4(pos.x, pos.y, this.pixels[x].pixel, alpha);
        }
    }

    /**
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    drawPlanedeformationTunnel(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, texture2: Texture) {

        let i = 0;
        for (let y = 0; y < 200; y++) {
            const ydist = (y - 200 / 2);
            const v = (((1 / Math.abs(ydist / 100 * 0.02) + elapsedTime * 0.069) % 256) + 256) % 256;
            const alpha = 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
            for (let x = 0; x < 320; x++) {
                const xdist = (x - (320 / 2));


                const u = (((((xdist / 160) / Math.abs(ydist / 100 * 0.02))) % 256) + 256) % 256;

                const color1 = texture2.texture[(u | 0) + (v | 0) * 256];



                const r = (((color1 >> 0) & 0xff) * (alpha)) | 0;
                const g = (((color1 >> 8) & 0xff) * (alpha)) | 0;
                const b = (((color1 >> 16) & 0xff) * (alpha)) | 0;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

}
