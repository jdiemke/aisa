import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class LensScene extends AbstractScene {

    private texture5: Texture;
    private texture6: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.texture5 = texture
            ),
            TextureUtils.load(require('./assets/lens.png'), true).then(
                (texture: Texture) => this.texture6 = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);
        this.drawLens(framebuffer, this.texture5, this.texture6, time);
    }


    public drawLens(framebuffer: Framebuffer, texture: Texture, tex: Texture, time: number) {

        const radius = 47;
        let xoff = 320 / 2 + Math.cos(6 * time * 0.0002) * (320 / 2 - 50);
        let yoff = 200 / 2 + Math.sin(4 * time * 0.0002) * (200 / 2 - 50);

        // TODO: precalculate displacement in an array
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {

                    let xx = Math.round(x + xoff);
                    let yy = Math.round(y + yoff);

                    let z = 1 + Math.sqrt(radius * radius - x * x - y * y) * 0.03;
                    let xx2 = Math.round(x / z + xoff);
                    let yy2 = Math.round(y / z + yoff);
                    let col = texture.texture[xx2 + yy2 * 320];

                    let index = xx + yy * 320;
                    framebuffer.framebuffer[index] = col;
                }
            }
        }

        framebuffer.drawTexture(Math.round(xoff - 50), Math.round(yoff - 50), tex, 1.0);
    }


}
