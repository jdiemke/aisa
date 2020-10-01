import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

/**
 * TODO: extract lens into effect class
 */
export class BlockFade extends AbstractScene {

    private ledTexture: Texture;
    private startTime: number = Date.now();

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        framebuffer.clear();
        this.blockFace(framebuffer, this.ledTexture, time, 0);
    }

    public blockFace(framebuffer: Framebuffer, texture: Texture, time: number, startTime: number) {
        const fadeArray = new Array<number>(16 * 10);
        const rng = new RandomNumberGenerator();
        rng.setSeed(366);
        // TODO: different fadeArray algorithms
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 16; x++) {
                fadeArray[x + y * 16] = 500 + Math.round(rng.getFloat() * 600000) % 10000;
            }
        }

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 16; x++) {
                framebuffer.drawTextureRect(x * 20, y * 20, x * 20, y * 20, 20, 20, texture,
                    framebuffer.interpolate(startTime + fadeArray[x + y * 16],
                        startTime + fadeArray[x + y * 16] + 700, time));
            }
        }
    }

}
