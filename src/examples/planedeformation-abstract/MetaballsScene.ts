import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { ScaleClipBlitter } from '../../blitter/ScaleClipBlitter';
import { FontRenderer } from '../sine-scroller/FontRenderer';

/**
 * TODO: extract lens into effect class
 */
export class MetaballsScene extends AbstractScene {

    private heightmap: Texture;
    private metall: Texture;
    private hoodlumLogo: Texture;
    private fontRenderer2: FontRenderer;
    private startTime = Date.now();

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
            TextureUtils.load(require('../../assets/checker.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ), this.fontRenderer2.init()
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.heightmap, this.heightmap);

        framebuffer.drawTexture(((320 / 2) - (this.hoodlumLogo.width / 2)) | 0, ((200 / 2) - (this.hoodlumLogo.height / 2)) | 0, this.hoodlumLogo, 1.0);
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


            for (let x = 0; x < 320; x++) {
                const xdist = (x - (320 / 2)) / 160;
                const ydist = (y - 200 / 2) / 100;
                const alpha = 1;// 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
                const a = Math.atan2(ydist, xdist) + Date.now() * 0.0004;
                const v = (a * 3 / Math.PI + Date.now() * 0.0004) * 128 % 256;
                const d = Math.sqrt(xdist * xdist + ydist * ydist);

                const u = (1 / (d + 0.5 + 0.5 * Math.sin(5 * a)) * 32 + Date.now() * 0.03) % 256;

                const color1 = texture2.texture[(u | 0) + (v | 0) * 256];




                const r = (((color1 >> 0) & 0xff) * (alpha)) | 0;
                const g = (((color1 >> 8) & 0xff) * (alpha)) | 0;
                const b = (((color1 >> 16) & 0xff) * (alpha)) | 0;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

}
