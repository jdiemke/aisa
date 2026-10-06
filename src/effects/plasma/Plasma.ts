import { Framebuffer } from '../../Framebuffer';
import { Color } from '@core/Color';

export class Plasma {

    private readonly GRADIENTLEN = 1500;
    private readonly SWINGLEN = this.GRADIENTLEN * 3;
    private readonly SWINGMAX = this.GRADIENTLEN / 2 - 1;
    private colorGrad: Array<number>;
    private swingCurve: Array<number>;

    public init(): Promise<void> {
        return Promise.resolve().then(() => {
            this.makeGradient(this.GRADIENTLEN);
            this.makeSwingCurve(this.SWINGLEN, this.SWINGMAX);
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawPlasma(framebuffer, time);
    }

    public makeSwingCurve(arrlen: number, maxval: number): void {
        const factor1 = 2;
        const factor2 = 3;
        const factor3 = 6;
        this.swingCurve = new Array<number>(this.SWINGLEN);
        const halfmax = maxval / factor1;
        for (let index = 0; index < arrlen; index++) {
            const phase = index * (Math.PI * 2) / arrlen;
            this.swingCurve[index] = Math.round(
                Math.cos(phase * factor1) *
                Math.cos(phase * factor2) *
                Math.cos(phase * factor3) *
                halfmax + halfmax);
        }
    }

    public makeGradient(arrlen: number): void {
        const rf = 2;
        const gf = 4;
        const bf = 4;
        const rd = 818;
        const gd = 1095;
        const bd = 1351;
        this.colorGrad = new Array<number>(this.GRADIENTLEN);
        for (let index = 0; index < arrlen; index++) {
            const red = this.cos256(arrlen / rf, index + rd);
            const green = this.cos256(arrlen / gf, index + gd);
            const blue = this.cos256(arrlen / bf, index + bd);
            this.colorGrad[index] = new Color(red, green, blue, 255).toPackedFormat();
        }
    }

    private cos256(amplitude: number, position: number): number {
        return Math.trunc(Math.cos(position * (Math.PI * 2) / amplitude) * 127 + 127);
    }

    private swing(index: number): number {
        return this.swingCurve[index % this.SWINGLEN];
    }

    private gradient(index: number): number {
        return this.colorGrad[index % this.GRADIENTLEN];
    }

    public drawPlasma(framebuffer: Framebuffer, time: number): void {
        let index = 0;
        const tick = Math.trunc(time >> 3);
        const swingT = this.swing(tick);
        for (let y = 0; y < framebuffer.height; y++) {
            const swingY = this.swing(y);
            const swingYT = this.swing(y + tick);
            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[index++] = this.gradient(this.swing(
                    this.swing(x + swingT) + swingYT) +
                    this.swing(this.swing(x + tick) + swingY));
            }
        }
    }

}