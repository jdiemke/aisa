import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { Vector2f } from '../../math/Vector2f';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { FontRenderer } from './FontRenderer';

export class SineScrollerScene extends AbstractScene {

    private texture2: Texture;
    private startTime: number;
    private fontRenderer: FontRenderer;
    private fontRenderer2: FontRenderer;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.startTime = Date.now();

        const fonts: string =
            'ABCDEFGHIJ' +
            'KLMNOPQRST' +
            'UVWXYZ@+# ' +
            '0123456789' +
            '!\'()?-/.,';
        this.fontRenderer = new FontRenderer(
            framebuffer,
            32, 34, fonts,
            require('./assets/fraxionFont.png')
        );

        const fonts2: string =
            'ABCDEFGHIJ' +
            'KLMNOPQRST' +
            'UVWXYZ 012' +
            '3456789*:?' +
            '!-(),\'.+~<' +
            '>>#// ';
        this.fontRenderer2 = new FontRenderer(
            framebuffer,
            16, 18, fonts2,
            require('./assets/anarchyFont.png')
        );
        /*
                const fonts: string =
                'ABCDEFGHIJ' +
                'KLMNOPQRST' +
                'UVWXYZ!?:;' +
                '0123456789' +
                '"(),-.\'@# ';
                this.fontRenderer = new FontRenderer(
                    framebuffer,
                    32, 25, fonts,
                    require('./assets/dragonsFont.png')
                );*/
        return Promise.all([
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.texture2 = texture
            ),
            this.fontRenderer.init(),
            this.fontRenderer2.init()
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawStarField(framebuffer, time);

        framebuffer.drawTexture(0, 0, this.texture2, 1.0);

        this.fontRenderer.drawText(0, 102, ' # TEAM GENESIS # IS BACK IN 2018 WITH A NEW PC FIRST! \'STAR WARS - EMPIRE AT WAR\' DO YOU LIKE THIS?    ', time);
        this.fontRenderer2.drawText(0, 200 - 20,
            '   * WE REALLY LOVE SCROLLERS * HOW ABOUT YOU? THIS PRODUCTION IS FROM HOODLUM' +
            '~< LETS GO ON WITH THE GENERAL BLAH BLAH      ', time * 1.6, false);

        for (let i: number = 0; i < 20; i++) {
            const myTime = time * 0.003;
            const waveSum = i / 20 * 0.6;
            const red = (Math.cos(Math.PI * waveSum / 0.5 + myTime) + 1.0) * 0.5 * 255;
            const green = (Math.sin(Math.PI * waveSum / 0.5 + myTime) + 1.0) * 0.5 * 255;
            const blue = (Math.sin(myTime) + 1.0) * 0.5 * 255;

            const color: number = 255 << 24 | blue << 16 | green << 8 | red;
            framebuffer.drawRect(i * 16, 68, 16, color);
            framebuffer.drawRect((19 - i) * 16, 168, 16, color);
        }
    }

    public drawStarField(frambuffer: Framebuffer, elapsedTime: number): void {
        const darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        const lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        const backgroundColor = 255 << 24 | 0 << 16 | 0 << 8 | 0;

        const rng = new RandomNumberGenerator();
        rng.setSeed(666);
        const stars = new Array<Vector2f>();
        const stars2 = new Array<Vector2f>();

        for (let i = 0; i < 100; i++) {
            stars.push(new Vector2f(rng.getFloat() * 320, Math.round(rng.getFloat() * 100 + 68)));
        }

        for (let i = 0; i < 60; i++) {
            stars2.push(new Vector2f(rng.getFloat() * 320, Math.round(rng.getFloat() * 100 + 68)));
        }

        frambuffer.clearColorBuffer(backgroundColor);
        frambuffer.drawRect2(0, 68, 320, 100, Color.DARK_BLUE.toPackedFormat());

        for (let i = 0; i < 100; i++) {
            frambuffer.drawPixel(((stars[i].x + elapsedTime * 0.02) | 0) % 320, stars[i].y, darkStarColor);
        }

        for (let i = 0; i < 60; i++) {
            frambuffer.drawPixel(((stars2[i].x + elapsedTime * 0.04) | 0) % 320, stars2[i].y, lightStarColor);
        }
    }

}
