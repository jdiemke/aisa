import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TextureUtils } from '../../texture';
import { Texture } from '../../texture/Texture';

/**
 * TODO: extract lens into effect class
 */
export class FloodFillScene extends AbstractScene {

    private ledTexture: Texture;
    private texture4: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/battleofilona.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
            TextureUtils.load(require('../../assets/font.png'), true).then(
                texture => this.texture4 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.ledTexture.texture);
        this.cinematicScroller(framebuffer, this.texture4, time - 140000);
    }

    public floodFill(framebuffer: Framebuffer, texture: Texture, time: number) {
        let pos = Math.floor(time * 0.02) % 200;
        let index = 320 * 200;

        for (let y = 0; y < pos; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.framebuffer[index] = texture.texture[index];
                index--;
            }
        }

        let index2 = index;
        for (let y = 0; y < 200 - pos; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.framebuffer[index] = texture.texture[index2];
                index--;
                index2--;
            }
            index2 += 320;
        }
    }

    public cinematicScroller(framebuffer: Framebuffer, texture: Texture, time: number) {
        let scrollText: Array<string> = [
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '',
            'YOU HAVE BEEN WATCHING',
            '',
            'D A R K   M A T T E R',
            '',
            'A JAVASCRIPT DEMO MADE FOR',
            'NORDLICHT 2018',
            '',
            'CREDITS',
            '',
            'CODE BY',
            'TRIGGER',
            '',
            'GRAFICS BY',
            'PREMIUM',
            '',
            'MUSIC BY',
            'VIRGILL'
        ];
        time = time * 0.6;

        let scrollerOffset = Math.round(framebuffer.interpolate(0, 250, time & 0xff) * 8);

        for (let i = 1; i < 200 / 8; i++) {
            let text = scrollText[Math.floor((i + (time / 256))) % scrollText.length];
            let x = (320 / 2 - text.length * 8 / 2) | 0;
            let y = 8 * i - scrollerOffset;
            // TODO: proper text clipping to rect
            // maybe just for first and last row
            framebuffer.drawText(x, y, text, texture);
        }
    }

}
