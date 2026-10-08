import { Color } from '../../core/Color';
import { Utils } from '../../core/Utils';
import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
import RandomNumberGenerator from '../../RandomNumberGenerator';
import { AbstractScene } from '../../scenes/AbstractScene';
import { TransitionMethods } from './TransitionMethods';
import { Particle } from './Particle';

export class Transition {
    private transitionFramebufferTo: Framebuffer;

    public transitionCircle: Uint32Array;
    public verticalWipe: Uint32Array;
    public horizontalWipe: Uint32Array;
    private blockFadeTimings: number[] = [];
    private blockFadeWidth = 0;
    private blockFadeHeight = 0;

    // dissolve 
    private croud: Float32Array;        // Stores data for mask control
    private prevMask: Array<boolean>;    // mask picture
    private curMask: Array<boolean>;
    private diff: Array<boolean>;       // difference mask
    private noiseMask: Array<boolean>;  // particle mask
    private croudMask: Uint32Array;     // cloud mask
    private particleArray: Array<Particle>;

    public init(framebuffer: Framebuffer): Promise<void> {
        this.transitionFramebufferTo = new Framebuffer(framebuffer.width, framebuffer.height);

        // vertical wipe
        this.verticalWipe = new Uint32Array(framebuffer.width * framebuffer.height);
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const progress = x / Math.max(framebuffer.width - 1, 1);
                const easedProgress = progress * progress * (3 - 2 * progress);
                const c2 = Math.round(easedProgress * 255);
                const color = new Color(c2, c2, c2, 255).toPackedFormat();
                this.verticalWipe[x + y * framebuffer.width] = color;
            }
        }

        // horizontal wipe
        this.horizontalWipe = new Uint32Array(framebuffer.width * framebuffer.height);
        for (let y = 0; y < framebuffer.height; y++) {
            const color = new Color(Utils.map(y, 0, framebuffer.height, 0, 255), 0, 0, 255).toPackedFormat();
            this.horizontalWipe.fill(color, y * framebuffer.width, (y + 1) * framebuffer.width);
        }

        // draw circle gradient
        this.transitionCircle = new Uint32Array(framebuffer.width * framebuffer.height);
        this.transitionCircle.fill(Color.WHITE.toPackedFormat(), 0, this.transitionCircle.length);
        for (let d = 0; d < framebuffer.width / 2; d += 1) {
            const c3 = Utils.map(d, 0, framebuffer.width / 2, 0, 255);
            this.drawCircle(framebuffer.width / 2, framebuffer.height / 2, d, c3);
        }

        //dissolve effect
        this.initDissolve(framebuffer.width, framebuffer.height);

        return Promise.resolve();
    }

    private initDissolve(width: number, height: number) {
        this.croud = new Float32Array(width * height);
        this.prevMask = new Array<boolean>(width * height);
        this.curMask = new Array<boolean>(width * height);
        this.diff = new Array<boolean>(width * height);
        this.noiseMask = new Array<boolean>(width * height);
        this.particleArray = new Array<Particle>();

        this.croudMask = new Uint32Array(width * height);
        this.particleArray.splice(0, this.particleArray.length);

        this.createCroud(width, height);
        const threshold = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                const isBackground = (this.croudMask[y * width + x] & 0xFF) < 0x80;
                if (isBackground) {
                    this.croud[index] = 0xFF000000;
                }
                this.prevMask[index] = this.curMask[index] = this.croud[index] < threshold;
                if (Math.random() > 0.90) {
                    this.noiseMask[index] = !isBackground;
                }
            }
        }
    }

    private createCroud(width: number, height: number) {
        if (this.croud == null) {
            this.croud = new Float32Array(width * height);
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.croudMask[y * width + x] = 0xFFFFFFFF;
            }
        }

        const bias: number = Math.min(150.0, 0xFF);
        const xbase = Math.random() * 100;
        const ybase = Math.random() * 100;

        let xnoise = 0.0;
        let ynoise = 0.0;
        const inc = 0.02;

        const pn = Utils.PerlinNoise;

        for (let y = 0; y < height; y++) {
            const curBias = y * bias / height;
            for (let x = 0; x < width; x++) {
                const _gray = (pn.noise((xnoise + xbase), (ynoise + ybase), 0) * (0xFF - bias) + curBias);
                this.croud[y * width + x] = _gray;
                xnoise += inc;
            }
            xnoise = 0.0;
            ynoise += inc;
        }
    }

    // dissolve
    public dissolve(renderBuffer: Framebuffer, renderBuffer2: Uint32Array, time: number) {

        if (time <= 5) {

            // update mask for current scene
            for (let y = 0; y < renderBuffer.height; y++) {
                for (let x = 0; x < renderBuffer.width; x++) {
                    const index = y * renderBuffer.width + x;
                    const isBackground = (this.croudMask[y * renderBuffer.width + x] & 0xFF) < 0x80;
                    if (isBackground) {
                        this.croud[index] = renderBuffer2[index];
                    }
                    this.prevMask[index] = this.curMask[index] = this.croud[index] < 0;
                }
            }

            // delete loose particles
            this.particleArray.length = 0;
        }

        for (let y = 0; y < renderBuffer.height; y++) {
            for (let x = 0; x < renderBuffer.width; x++) {
                const index = y * renderBuffer.width + x;
                this.curMask[index] = this.croud[index] < time;
                this.diff[index] = this.prevMask[index] != this.curMask[index];
                this.prevMask[index] = this.curMask[index];

                if (this.curMask[index]) {
                    renderBuffer.framebuffer[index] = renderBuffer2[index];
                }

                if (this.diff[index]) {
                    if (this.noiseMask[index]) {
                        const particle = new Particle(x, y, renderBuffer[index], renderBuffer.width, renderBuffer.height);
                        particle._color = renderBuffer.framebuffer[index];
                        this.particleArray.push(particle);
                    }
                    renderBuffer.framebuffer[index] = 0xFFFFFFFF;
                }
            }
        }

        for (let it = 0; it < this.particleArray.length;) {
            const particle = this.particleArray[it];

            if (!particle.update()) {
                this.particleArray[it] = this.particleArray[this.particleArray.length - 1];
                this.particleArray.pop();
                continue;
            }

            const index = particle.y * renderBuffer.width + particle.x;
            renderBuffer.framebuffer[index] = Framebuffer.addColor(renderBuffer.framebuffer[index], particle._color);
            it++;
        }
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

    /**
     * Renders the source and destination scenes, then composites them using the selected transition.
     *
     * `sceneData.transitionType` selects the transition and `sceneData.transitionValue` controls its progress
     * from 0 to 255. Block fade maps that value to its internal time range.
     *
     * @param framebuffer Framebuffer that receives the composited image.
     * @param transitionSceneFrom Scene rendered as the transition source.
     * @param transitionSceneTo Scene rendered as the transition destination.
     * @param time Scene time passed to both scenes.
     * @param sceneData Synchronization data containing `transitionType` and `transitionValue`.
     */
    public render(
        framebuffer: Framebuffer,
        transitionSceneFrom: AbstractScene,
        transitionSceneTo: AbstractScene,
        time: number,
        sceneData: any) {

        const transitionValue = sceneData.transitionValue;

        // render the 'To' effect into the framebuffer
        transitionSceneTo.render(this.transitionFramebufferTo, time, sceneData);

        // render 'From' effect into framebuffer
        transitionSceneFrom.render(framebuffer, time, sceneData);
        // apply transition to framebuffer (fromEffect) using texture (toEffect) 0-255
        switch (Math.trunc(sceneData.transitionType)) {
            case TransitionMethods.BLOCKFADE: // 0 - 12000
                this.blockFade(framebuffer, this.transitionFramebufferTo.framebuffer, this.transitionFramebufferTo.width, Utils.map(transitionValue, 0, 255, 0, 12000), 0);
                break;
            case TransitionMethods.CROSSFADE: // 0 - 255
                this.crossFade(framebuffer.framebuffer, transitionValue);
                break;
            case TransitionMethods.DISSOLVE: // 0 - 255
                this.dissolve(framebuffer, this.transitionFramebufferTo.framebuffer, transitionValue);
                break;
            case TransitionMethods.FADEIN: // 0-255
                this.fadeIn(framebuffer, transitionValue, 0);
                break;
            case TransitionMethods.FADEOUT: // 0-255
                this.fadeOut(framebuffer, transitionValue, 0);
                break;
            case TransitionMethods.WIPE_VERTICAL: // 0 - 255
                this.crossFadeImage(framebuffer, transitionValue, this.verticalWipe);
                break;
            case TransitionMethods.WIPE_HORIZONTAL: // 0 - 255
                this.crossFadeImage(framebuffer, transitionValue, this.horizontalWipe);
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
        const horizontalUnits = Math.ceil(framebuffer.width / blockWidth);
        const verticalUnits = Math.ceil(framebuffer.height / blockWidth);

        if (this.blockFadeWidth !== framebuffer.width || this.blockFadeHeight !== framebuffer.height) {
            const rng = new RandomNumberGenerator();
            rng.setSeed(366);
            this.blockFadeTimings = Array.from({ length: horizontalUnits * verticalUnits }, () => {
                return 500 + Math.round(rng.getFloat() * 600000) % 10000;
            });
            this.blockFadeWidth = framebuffer.width;
            this.blockFadeHeight = framebuffer.height;
        }

        for (let y = 0; y < verticalUnits; y++) {
            const yPos = y * blockWidth;

            for (let x = 0; x < horizontalUnits; x++) {
                const xPos = x * blockWidth;
                const fadeIndex = x + y * horizontalUnits;
                framebuffer.drawTextureRect(xPos, yPos, xPos, yPos, blockWidth, blockWidth, pixelArray, pixelArrayWidth,
                    Interpolator.interpolate(startTime + this.blockFadeTimings[fadeIndex], startTime + this.blockFadeTimings[fadeIndex] + 700, time)
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
                        framebuffer.framebuffer[x + y * framebuffer.width],
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

}
