import { Color } from '../../core/Color';
import { Utils } from '../../core/Utils';
import { Framebuffer } from '../../Framebuffer';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

// Transitions
export enum TransitionMethods {
    FADEIN = 1,
    FADEOUT = 2,
    BLOCKFADE = 3,
    CROSSFADE = 4,
    CIRCLE = 5,
    WIPE_LEFT = 6
}

export class BlockFade extends AbstractScene {
    private ledTexture: Texture;
    private startTime: number = Date.now();
    private transitionFramebufferTo: Framebuffer;

    public transitionCircle: Uint32Array;
    public transitionWipe: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.transitionFramebufferTo = new Framebuffer(framebuffer.width, framebuffer.height);

        // draw side wipe
        this.transitionWipe = new Uint32Array(framebuffer.width * framebuffer.height);
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const c2 = Utils.map(x, 0, framebuffer.width, 0, 255);
                const color = new Color(c2, c2, c2, 255).toPackedFormat();
                this.transitionWipe[x + y * framebuffer.width] = color;
            }
        }

        // draw circle gradient
        this.transitionCircle = new Uint32Array(framebuffer.width * framebuffer.height);
        this.transitionCircle.fill(Color.WHITE.toPackedFormat(), 0, this.transitionCircle.length);
        for (let d = 0; d < framebuffer.width / 2; d += 1) {
            const c3 = Utils.map(d, 0, framebuffer.width / 2, 0, 255);
            const color = new Color(c3, c3, c3, 255).toPackedFormat();
            this.drawCircle(framebuffer.width / 2, framebuffer.height / 2, d, c3);
        }

        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (textureBackground: Texture) => this.ledTexture = textureBackground
            ),
        ]);
    }

    private putpixel(x: number, y: number, color: number) {
        this.transitionCircle[x + y * this.transitionFramebufferTo.width] = new Color(color, color, color, 255).toPackedFormat();
    }

    private drawCircle(x0: number, y0: number, radius: number, color: number) {
        let x = 0;
        let y = radius;
        let d = -(radius >>> 1);

        while (x <= y) {
            this.putpixel(x + x0, y + y0, color);
            this.putpixel(y + x0, x + y0, color);
            this.putpixel(-x + x0, y + y0, color);
            this.putpixel(-y + x0, x + y0, color);
            this.putpixel(-x + x0, -y + y0, color);
            this.putpixel(-y + x0, -x + y0, color);
            this.putpixel(x + x0, -y + y0, color);
            this.putpixel(y + x0, -x + y0, color);

            if (d <= 0) {
                x++;
                d += x;
            } else {
                y--;
                d -= y;
            }
        }
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        framebuffer.clear();
        this.blockFade(framebuffer, this.ledTexture.texture, this.ledTexture.width, time, 0);
    }

    /**
     * Transitions from one effect to another using using "transition" value from JSRocket
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
        transitionSceneTo.render(this.transitionFramebufferTo, time);

        // render 'From' effect into framebuffer
        transitionSceneFrom.render(framebuffer, time);

        // apply transition to framebuffer (fromEffect) using texture (toEffect) 0-255
        switch (transitionMethod) {
            case TransitionMethods.BLOCKFADE: // 0 - 12000
                this.blockFade(framebuffer, this.transitionFramebufferTo.framebuffer, this.transitionFramebufferTo.width, Utils.map(transitionValue, 0, 255, 0, 12000), 0);
                break;
            case TransitionMethods.CROSSFADE: // 0 - 255
                this.crossFade(framebuffer.framebuffer, transitionValue);
                break;
            case TransitionMethods.FADEIN: // 0-255
                this.fadeIn(framebuffer, transitionValue, 0);
                break;
            case TransitionMethods.FADEOUT: // 0-255
                this.fadeOut(framebuffer, transitionValue, 0);
                break;
            case TransitionMethods.WIPE_LEFT: // 0 - 255
                this.crossFadeImage(framebuffer, transitionValue, this.transitionWipe);
                break;
            case TransitionMethods.CIRCLE: // 0 - 255
                this.crossFadeImage(framebuffer, transitionValue, this.transitionCircle);
                break;
            default: // 0 - 512
                this.crossFade(framebuffer.framebuffer, Utils.map(transitionValue, 0, 255, 0, 12000));
        }
    }

    public blockFade(framebuffer: Framebuffer, pixelArray: Uint32Array, pixelArrayWidth: number, time: number, startTime: number) {
        const blockWidth = 20;
        const horizontalUnits = Math.floor(framebuffer.width / blockWidth);
        const verticalUnits = Math.floor(framebuffer.height / blockWidth);

        const fadeArray = new Array<number>(horizontalUnits * verticalUnits);
        const rng = new RandomNumberGenerator();
        rng.setSeed(366);
        for (let y = 0; y < verticalUnits; y++) {
            for (let x = 0; x < horizontalUnits; x++) {
                fadeArray[x + y * horizontalUnits] = 500 + Math.round(rng.getFloat() * 600000) % 10000;
            }
        }

        for (let y = 0; y < verticalUnits; y++) {
            for (let x = 0; x < horizontalUnits; x++) {
                framebuffer.drawTextureRect(x * blockWidth, y * blockWidth, x * blockWidth, y * blockWidth, blockWidth, blockWidth, pixelArray, pixelArrayWidth,
                    framebuffer.interpolate(startTime + fadeArray[x + y * horizontalUnits], startTime + fadeArray[x + y * horizontalUnits] + 700, time)
                );
            }
        }
    }

    // blend entire image to another image
    public crossFade(framebuffer: Uint32Array, alpha: number) {
        for (let i = 0; i < framebuffer.length; i++) {
            framebuffer[i] = Framebuffer.blend(
                framebuffer[i],
                this.transitionFramebufferTo.framebuffer[i],
                alpha)
        }
    }

    // transition using image
    // https://github.com/Slynchy/SDL-AlphaMaskWipes/blob/master/Transition.h
    public crossFadeImage(framebuffer: Framebuffer, alpha: number, transitionImage: Uint32Array) {
        for (let i = 0; i < framebuffer.framebuffer.length; i++) {
            framebuffer.framebuffer[i] = Framebuffer.blend(
                framebuffer.framebuffer[i],
                this.transitionFramebufferTo.framebuffer[i],
                Utils.clamp(
                    (alpha * 2) - (transitionImage[i] & 0xff),
                    0, 255))
        }
    }

    // fade in from solid color
    public fadeIn(framebuffer: Framebuffer, alpha: number, startColor: number) {
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    Framebuffer.blend(
                        startColor,
                        this.transitionFramebufferTo.framebuffer[x + y * framebuffer.width],
                        alpha)
                );
            }
        }
    }

    // fade out to solid color
    public fadeOut(framebuffer: Framebuffer, alpha: number, endColor: number) {
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.drawPixel(x, y,
                    Framebuffer.blend(
                        framebuffer.framebuffer[x + y * framebuffer.width],
                        endColor,
                        alpha)
                );
            }
        }
    }

    // Alternating scanlines + RGB Distort /w external input
    public renderScanlines(framebuffer: Framebuffer, shiftAmount: number) {
        let i = 0;

        const offRed = Math.round(2 * shiftAmount);
        const offGreen = Math.round(5 * shiftAmount);
        const offBlue = Math.round(2 * shiftAmount);

        for (let y = 0; y < framebuffer.height; y++) {

            // horizontal scanlines * intensity
            const strips = (y & 1) * 16;
            const verticalPosition = y * framebuffer.width;

            for (let x = 0; x < framebuffer.width; x++) {
                const imagePixelR = framebuffer.framebuffer[Utils.clamp(x + offRed, 0, framebuffer.width - 1) + verticalPosition] & 0xFF;
                const imagePixelG = framebuffer.framebuffer[Utils.clamp(x + offGreen, 0, framebuffer.width - 1) + verticalPosition] >> 8 & 0xFF;
                const imagePixelB = framebuffer.framebuffer[Utils.clamp(x + offBlue, 0, framebuffer.width - 1) + verticalPosition] >> 16 & 0xFF;

                framebuffer.framebuffer[i++] = new Color(
                    Utils.clamp(imagePixelR - strips, 0, 255),
                    Utils.clamp(imagePixelG - strips, 0, 255),
                    Utils.clamp(imagePixelB - strips, 0, 255)).toPackedFormat();
            }
        }
    }

}
