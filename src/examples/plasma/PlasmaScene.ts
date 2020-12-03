import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Vector3f } from '../../math';

/**
 * TODO: extract lens into effect class
 */
export class PlasmaScene extends AbstractScene {

    public render(framebuffer: Framebuffer): void {
        this.drawOldSchoolPlasma(framebuffer, Date.now());
    }

    public drawOldSchoolPlasma(framebuffer: Framebuffer, elapsedTime: number): void {
        const time = elapsedTime * 0.0007 * 1.0;
        const lineDirection = new Vector3f(Math.sin(time), Math.cos(time), 0);
        const radialWaveCenter = new Vector3f(470.0 / 2.0, 230.0 / 2.0, 0).add(new Vector3f(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));

        const difference = new Vector3f(0, 0, 0);
        // TODO: implement sin/cos lookup tables plus starfield ;)
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
