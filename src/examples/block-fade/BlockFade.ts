import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

export class BlockFade extends AbstractScene {

    private ledTexture: Texture;
    private startTime: number = Date.now();

    public transitionCircle: Texture;
    public transitionRadial: Texture;
    public transitionWipe: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
            TextureUtils.load(require('../../assets/transitions/wipe.png'), false).then(
                (texture: Texture) => this.transitionWipe = texture
            ),
            TextureUtils.load(require('../../assets/transitions/radial.png'), false).then(
                (texture: Texture) => this.transitionRadial = texture
            ),
            TextureUtils.load(require('../../assets/transitions/circle.png'), false).then(
                (texture: Texture) => this.transitionCircle = texture
            )

        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        framebuffer.clear();
        this.blockFade(framebuffer, this.ledTexture, time, 0);
    }

    public blockFade(framebuffer: Framebuffer, texture: Texture, time: number, startTime: number) {
        const fadeArray = new Array<number>(16 * 10);
        const rng = new RandomNumberGenerator();
        rng.setSeed(366);
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

    // blend entire image to another image
    public crossFade(framebuffer: Framebuffer, texture: Texture, alpha: number) {
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        framebuffer.framebuffer[x + y * 320],
                        texture.texture[x + y * 320],
                        this.clamp(alpha, 0, 255))
                );
            }
        }
    }

    // transition using image
    // https://github.com/Slynchy/SDL-AlphaMaskWipes/blob/master/Transition.h
    public crossFadeImage(framebuffer: Framebuffer, texture: Texture, alpha: number, transitionImage: Texture) {
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        framebuffer.framebuffer[x + y * 320],
                        texture.texture[x + y * 320],
                        this.clamp(
                            (alpha) - (transitionImage.texture[x + y * 320] >> 8 & 0xff),
                            0, 255)
                    )
                );
            }
        }
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    };

    // fade in from solid color
    public fadeIn(framebuffer: Framebuffer, texture: Texture, alpha: number, startColor: number) {
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        startColor,
                        texture.texture[x + y * 320],
                        alpha)
                );
            }
        }
    }

    // fade out to solid color
    public fadeOut(framebuffer: Framebuffer, texture: Texture, alpha: number, endColor: number) {
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        texture.texture[x + y * 320],
                        endColor,
                        alpha)
                );
            }
        }
    }

}
