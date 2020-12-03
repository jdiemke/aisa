import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class CinematicScroller extends AbstractScene {

    private ledTexture: Texture;
    private texture4: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/battleofilona.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
            TextureUtils.load(require('../../assets/font.png'), true).then(
                (texture: Texture) => this.texture4 = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        // framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.ledTexture.texture);
        framebuffer.drawScaledTextureClipBi(
            0,
            0,
            framebuffer.width, framebuffer.height, this.ledTexture, 1.0);

        this.cinematicScroller(framebuffer, this.texture4, time - 140000);
    }

    public floodFill(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const pos: number = Math.floor(time * 0.02) % framebuffer.height;
        let index: number = framebuffer.width * framebuffer.height;

        for (let y = 0; y < pos; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[index] = texture.texture[index];
                index--;
            }
        }

        let index2 = index;
        for (let y = 0; y < framebuffer.height - pos; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[index] = texture.texture[index2];
                index--;
                index2--;
            }
            index2 += framebuffer.width;
        }
    }

    public cinematicScroller(framebuffer: Framebuffer, texture: Texture, time: number): void {
        const scrollText: Array<string> = [
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

        const scrollerOffset = Math.round(framebuffer.interpolate(0, 250, time & 0xff) * 8);

        for (let i = 1; i < framebuffer.height / 8; i++) {
            const text = scrollText[Math.floor((i + (time / 256))) % scrollText.length];
            const x = (framebuffer.width / 2 - text.length * 8 / 2) | 0;
            const y = 8 * i - scrollerOffset;
            // TODO: proper text clipping to rect
            // maybe just for first and last row
            framebuffer.drawText(x, y, text, texture);
        }
    }

}
