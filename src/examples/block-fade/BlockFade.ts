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
    WIPE = 6
}

export class BlockFade extends AbstractScene {
    private ledTexture: Texture;
    private startTime: number = Date.now();
    private transitionTemp: Texture;

    public transitionCircle: Texture;
    public transitionWipe: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.transitionTemp = new Texture(new Uint32Array(framebuffer.width * framebuffer.height), framebuffer.width, framebuffer.height);

        // draw side wipe
        const texture: Texture = new Texture();
        texture.texture = new Uint32Array(framebuffer.width * framebuffer.height);
        texture.width = framebuffer.width;
        texture.height = framebuffer.height;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const c2 = Utils.map(x, 0, texture.width, 0, 255);
                const color = new Color(c2, c2, c2, 255).toPackedFormat();
                texture.texture[x + y * texture.width] = color;
            }
        }
        this.transitionWipe = texture;

        // draw circle gradient
        const textureCircle: Texture = new Texture();
        textureCircle.texture = new Uint32Array(framebuffer.width * framebuffer.height);
        textureCircle.width = framebuffer.width;
        textureCircle.height = framebuffer.height;
        this.transitionCircle = textureCircle;
        this.transitionCircle.texture.fill(Color.WHITE.toPackedFormat(), 0, this.transitionCircle.texture.length);

        for (let d = 0; d < this.transitionCircle.width / 2; d += 1) {
            const c3 = Utils.map(d, 0, this.transitionCircle.width / 2, 0, 255);
            const color = new Color(c3, c3, c3, 255).toPackedFormat();
            this.drawCircle(this.transitionCircle.width / 2, this.transitionCircle.height / 2, d, color);
        }

        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (textureBackground: Texture) => this.ledTexture = textureBackground
            ),
        ]);
    }

    private putpixel(x: number, y: number, color: number) {
        this.transitionCircle.texture[x + y * this.transitionCircle.width] = new Color(color, color, color, 255).toPackedFormat();
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
                this.blockFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0, 255, 0, 12000), 0);
                break;
            case TransitionMethods.CROSSFADE: // 0 - 512
                this.crossFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0, 255, 0, 512));
                break;
            case TransitionMethods.FADEIN: // 0-255
                this.fadeIn(framebuffer, this.transitionTemp, transitionValue, 0);
                break;
            case TransitionMethods.FADEOUT: // 0-255
                this.fadeOut(framebuffer, this.transitionTemp, transitionValue, 0);
                break;
            case TransitionMethods.WIPE: // 0 - 512
                this.crossFadeImage(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0, 255, 0, 512), this.transitionWipe);
                break;
            case TransitionMethods.CIRCLE: // 0 - 512
                this.crossFadeImage(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0, 255, 0, 512), this.transitionCircle);
                break;
            default: // 0 - 512
                this.crossFade(framebuffer, this.transitionTemp, Utils.map(transitionValue, 0, 255, 0, 12000));
        }
    }



    public blockFade(framebuffer: Framebuffer, texture: Texture, time: number, startTime: number) {
        const horizontalUnits = Math.floor(framebuffer.width / 20);
        const verticalUnits = Math.floor(framebuffer.height / 20);

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
                framebuffer.drawTextureRect(x * 20, y * 20, x * 20, y * 20, 20, 20, texture,
                    framebuffer.interpolate(startTime + fadeArray[x + y * horizontalUnits],
                        startTime + fadeArray[x + y * horizontalUnits] + 700, time));
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
