import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { FontRenderer } from '../sine-scroller/FontRenderer';

export class FloorScene extends AbstractScene {

    private heightmap: Texture;
    private hoodlumLogo: Texture;
    private fontRenderer2: FontRenderer;
    private startTime: number = Date.now();

    public init(framebuffer: Framebuffer): Promise<any> {

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
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.heightmap);

        this.fontRenderer2.drawText(0, framebuffer.height - 32 - 16,
            '              WELCOME TO A NEW RELEASE FROM YOUR FRIENDS IN CRIME! HOW DO YOU LIKE THIS INTRO?'
            , (Date.now() - this.startTime) * 0.8, false);
        framebuffer.drawTexture(0, ((framebuffer.height / 2) - (this.hoodlumLogo.height / 2)) | 0, this.hoodlumLogo, 1.0);
    }

    /**
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    private drawPlanedeformationTunnel(framebuffer: Framebuffer, elapsedTime: number, texture2: Texture): void {

        let i = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            const ydist = (y - framebuffer.height / 2);
            const v = (((1 / Math.abs(ydist / 100 * 0.02) + elapsedTime * 0.069) % 256) + 256) % 256;
            const alpha = 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
            for (let x = 0; x < framebuffer.width; x++) {
                const xdist = (x - (framebuffer.width / 2));

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
