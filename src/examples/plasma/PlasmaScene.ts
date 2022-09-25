import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Vector3f } from '../../math';
import { Color } from '../../core/Color';

export class PlasmaScene extends AbstractScene {

    private GRADIENTLEN = 1500;

    // swing/wave function parameters
    private SWINGLEN = this.GRADIENTLEN * 3;
    private SWINGMAX = this.GRADIENTLEN / 2 - 1;

    // gradient & swing curve arrays
    private colorGrad: Array<number>;
    private swingCurve: Array<number>;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.makeGradient(this.GRADIENTLEN);
        this.makeSwingCurve(this.SWINGLEN, this.SWINGMAX);
        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawPlasma(framebuffer, time);
        // this.drawOldSchoolPlasma(framebuffer, Date.now());
    }

    // fill the given array with a nice swingin' curve
    // three cos waves are layered together for that
    // the wave "wraps" smoothly around
    makeSwingCurve(arrlen: number, maxval: number) {
        const factor1 = 2;
        const factor2 = 3;
        const factor3 = 6;

        this.swingCurve = new Array<number>(this.SWINGLEN);

        const halfmax = maxval / factor1;

        for (let i = 0; i < arrlen; i++) {
            const ni = i * (Math.PI * 2) / arrlen; // ni goes [0..TWO_PI] -> one complete cos wave
            this.swingCurve[i] = Math.round(
                Math.cos(ni * factor1) *
                Math.cos(ni * factor2) *
                Math.cos(ni * factor3) *
                halfmax + halfmax);
        }
    }

    // create a smooth, colorful gradient by cosinus curves in the RGB channels
    makeGradient(arrlen: number) {
        // random between 1 and 5
        const rf = 2;
        const gf = 4;
        const bf = 4;

        // random between 0 and gradient length
        const rd = 818; // 0;
        const gd = 1095; // arrlen / gf;
        const bd = 1351; // arrlen / bf / 2;

        this.colorGrad = new Array<number>(this.GRADIENTLEN);

        // fill gradient array
        for (let i = 0; i < arrlen; i++) {
            const r = this.cos256(arrlen / rf, i + rd);
            const g = this.cos256(arrlen / gf, i + gd);
            const b = this.cos256(arrlen / bf, i + bd);
            this.colorGrad[i] = new Color(r, g, b, 255).toPackedFormat();
        }
    }

    // helper: get cosinus sample normalized to 0..255
    private cos256(amplitude: number, x: number) {
        return Math.trunc(Math.cos(x * (Math.PI * 2) / amplitude) * 127 + 127);
    }

    // helper: get a swing curve sample
    private swing(i: number) {
        return this.swingCurve[i % this.SWINGLEN];
    }

    // helper: get a gradient sample
    private gradient(i: number) {
        return this.colorGrad[i % this.GRADIENTLEN];
    }

    drawPlasma(framebuffer: Framebuffer, time: number) {
        let i = 0;
        const t = Math.trunc(time >> 3);
        const swingT = this.swing(t);

        for (let y = 0; y < framebuffer.height; y++) {
            const swingY = this.swing(y);
            const swingYT = this.swing(y + t);
            for (let x = 0; x < framebuffer.width; x++) {
                // this is where the magic happens: map x, y, t around
                // the swing curves and lookup a color from the gradient
                // the "formula" was found by a lot of experimentation
                framebuffer.framebuffer[i++] = this.gradient(this.swing(
                    this.swing(x + swingT) + swingYT) +
                    this.swing(this.swing(x + t) + swingY));
            }
        }
    }

    public drawOldSchoolPlasma(framebuffer: Framebuffer, elapsedTime: number) {
        const time = elapsedTime * 0.0007 * 1.0;
        const lineDirection = new Vector3f(Math.sin(time), Math.cos(time), 0);
        const radialWaveCenter = new Vector3f(470.0 / 2.0, 230.0 / 2.0, 0).add(new Vector3f(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));

        const difference = new Vector3f(0, 0, 0);
        let index = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const directionalWave = Math.sin(((x * lineDirection.x + y * lineDirection.y) * 0.02 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                const radialWave = (Math.cos(difference.length() * 0.03) + 1.0) * 0.5;
                const waveSum: number = (radialWave + directionalWave) * 0.5;

                const red = (Math.cos(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                const green = (Math.sin(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                const blue = (Math.sin(time) + 1.0) * 0.5 * 255;

                framebuffer.framebuffer[index++] = 255 << 24 | blue << 16 | green << 8 | red;
            }
        }
    }


}
