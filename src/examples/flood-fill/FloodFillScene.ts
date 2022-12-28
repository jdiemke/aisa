import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

/**
 * TODO: extract lens into effect class
 */
export class FloodFillScene extends AbstractScene {

    private ledTexture: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        this.floodFill(framebuffer, this.ledTexture, time);
    }

    public floodFill(framebuffer: Framebuffer, texture: Texture, time: number) {
        const pos = Math.floor(time * 0.02) % framebuffer.height;
        let index = framebuffer.width * framebuffer.height;

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

}
