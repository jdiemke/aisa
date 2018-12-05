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
            TextureUtils.load(require('../../assets/scify.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.load(require('../../assets/tristar.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ), this.fontRenderer2.init()
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.heightmap, this.heightmap);

        this.fontRenderer2.drawText(0, 200 - 32 - 16,
            '              WELCOME TO A NEW RELEASE FROM YOUR FRIENDS IN CRIME! HOW DO YOU LIKE THIS INTRO?'
            , (Date.now() - this.startTime) * 0.8, false);
        framebuffer.drawTexture(0, ((200 / 2) - (this.hoodlumLogo.height / 2)) | 0, this.hoodlumLogo, 1.0);
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
            let ydist = (y - 200 / 2);
            let v = (((1 / Math.abs(ydist / 100 * 0.02) + elapsedTime * 0.069) % 256) + 256) % 256;
            let alpha = 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
            for (let x = 0; x < 320; x++) {
                let xdist = (x - (320 / 2));


                let u = (((((xdist / 160) / Math.abs(ydist / 100 * 0.02))) % 256) + 256) % 256;

                let color1 = texture2.texture[(u | 0) + (v | 0) * 256];



                let r = (((color1 >> 0) & 0xff) * (alpha)) | 0;
                let g = (((color1 >> 8) & 0xff) * (alpha)) | 0;
                let b = (((color1 >> 16) & 0xff) * (alpha)) | 0;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

}
