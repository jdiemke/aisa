import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils } from '../../texture/TextureUtils';
import { Texture } from '../../texture/Texture';
import { FontRenderer } from '../sine-scroller/FontRenderer';
import { PixelInterpolator } from './PixelInterpolator';
import { Vector2f } from '../../math/index';
import { PlaneDeformationScene } from '../plane-deformation/PlaneDeformationScene';

export class PixelEffectScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private fontRenderer2: FontRenderer;
    private startTime = Date.now();
    private pixels: Array<PixelInterpolator> = new Array<PixelInterpolator>();
    private PlaneDeformationFloorScene = new PlaneDeformationScene(8, require('../../assets/heightmap.png'));

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
            TextureUtils.load(require('../../assets/tristar.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            ),
            this.fontRenderer2.init(),
            this.PlaneDeformationFloorScene.init(framebuffer)
        ]).then(
            () => {
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
            });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationFloorScene.drawPlaneDeformation(framebuffer, time >> 3, 0);

        this.fontRenderer2.drawText(framebuffer, 0, framebuffer.height - 32 - 16,
            '              WELCOME TO A NEW RELEASE FROM YOUR FRIENDS IN CRIME! HOW DO YOU LIKE THIS INTRO?'
            , (Date.now() - this.startTime) * 0.8, false);

        for (let x = 0; x < this.pixels.length; x++) {
            const pos = this.pixels[x].getPos((Date.now() - this.startTime - this.pixels[x].startTime) * 0.0002, x);
            if (pos.x < 0 || pos.x > (framebuffer.width - 1) || pos.y < 0 || pos.y > (framebuffer.height - 1)) continue;
            const alpha =
                Math.max(0, Math.min(1, (Date.now() - this.startTime - this.pixels[x].startTime) * 0.001));
            framebuffer.drawPixel4(pos.x, pos.y, this.pixels[x].pixel, alpha);
        }
    }
}
