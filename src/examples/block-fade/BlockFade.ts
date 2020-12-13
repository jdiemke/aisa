import { Utils } from '../../core/Utils';
import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

// todo: gradient generation to save on loading transition textures
// https://www.openprocessing.org/sketch/790560

// Transitions
export enum TransitionMethods {
    FADEIN = 1,
    FADEOUT = 2,
    BLOCKFADE = 3,
    CROSSFADE = 4,
    CIRCLE = 5,
    WIPE = 6,
    RADIAL = 7,
}

export class BlockFade extends AbstractScene {
    private ledTexture: Texture;
    private startTime: number = Date.now();
    private transitionTemp: Texture;

    public transitionCircle: Texture;
    public transitionRadial: Texture;
    public transitionWipe: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.transitionTemp = new Texture(new Uint32Array(framebuffer.width * framebuffer.height), framebuffer.width, framebuffer.height);

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
    /**
     * Transitions from one effect to another using using "transition" value from JSRocket
     * uses transitionTemp as the temp
     *
     * @param  {Framebuffer} framebuffer            pixels
     * @param  {Any} transitionSceneFrom            previous effect
     * @param  {Any} transitionSceneTo              effect we are transitioning to
     * @param  {number} transitionMethod            transition effect to use (blend, wipe, crossfade, etc)
     */
    public transition(
        framebuffer: Framebuffer,
        transitionSceneFrom: AbstractScene,
        transitionSceneTo: AbstractScene,
        transitionMethod: TransitionMethods,
        transitionValue: number,
        time: number) {
        // render the 'To' effect into the framebuffer
        transitionSceneTo.render(framebuffer, time);

        //  copy framebuffer to the texture
        framebuffer.fastFramebufferCopy(this.transitionTemp.texture, framebuffer.framebuffer);

        // render 'From' effect into framebuffer
        transitionSceneFrom.render(framebuffer, time);

        // apply transition to framebuffer (fromEffect) using texture (toEffect) 0-255
        switch (transitionMethod) {
            case TransitionMethods.BLOCKFADE: // 0 - 12000
                this.blockFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,12000), 0);
                break;
            case TransitionMethods.CROSSFADE: // 0 - 512
                this.crossFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,512));
                break;
            case TransitionMethods.FADEIN: // 0-255
                this.fadeIn(framebuffer, this.transitionTemp, transitionValue, 0);
                break;
            case TransitionMethods.FADEOUT: // 0-255
                this.fadeOut(framebuffer, this.transitionTemp, transitionValue, 0);
                break;
            case TransitionMethods.WIPE: // 0 - 512
                this.crossFadeImage(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,512), this.transitionWipe);
                break;
            case TransitionMethods.RADIAL: // 0 - 512
                this.crossFadeImage(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,512), this.transitionRadial);
                break;
            case TransitionMethods.CIRCLE: // 0 - 512
                this.crossFadeImage(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,512), this.transitionCircle);
                break;
            default: // 0 - 512
                this.crossFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0,255,0,12000));
        }
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
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        framebuffer.framebuffer[x + y * framebuffer.width],
                        texture.texture[x + y * framebuffer.width],
                        Utils.clamp(alpha, 0, 255))
                );
            }
        }
    }

    // transition using image
    // https://github.com/Slynchy/SDL-AlphaMaskWipes/blob/master/Transition.h
    public crossFadeImage(framebuffer: Framebuffer, texture: Texture, alpha: number, transitionImage: Texture) {
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        framebuffer.framebuffer[x + y * framebuffer.width],
                        texture.texture[x + y * framebuffer.width],
                        Utils.clamp(
                            (alpha) - (transitionImage.texture[x + y * framebuffer.width] >> 8 & 0xff),
                            0, 255)
                    )
                );
            }
        }
    }

    // fade in from solid color
    public fadeIn(framebuffer: Framebuffer, texture: Texture, alpha: number, startColor: number) {
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        startColor,
                        texture.texture[x + y * framebuffer.width],
                        alpha)
                );
            }
        }
    }

    // fade out to solid color
    public fadeOut(framebuffer: Framebuffer, texture: Texture, alpha: number, endColor: number) {
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    framebuffer.blend(
                        texture.texture[x + y * framebuffer.width],
                        endColor,
                        alpha)
                );
            }
        }
    }

}
