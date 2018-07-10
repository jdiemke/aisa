import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class WobbleScene extends AbstractScene {

    private hoodlumLogo: Texture;
    private startTime: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('./assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        const elapsedTime: number = 0.004 * time;
        this.drawOldSchoolPlasma(framebuffer, time);

        for (let i: number = 0; i < this.hoodlumLogo.width; i++) {
            this.drawVerticalSpan(framebuffer, this.hoodlumLogo, i,
                Math.round(Math.sin(i * 0.02 + elapsedTime + Math.PI * 2 / 4
                ) * 20 + 100 - 50),
                Math.round(Math.sin(i * 0.02 + elapsedTime + Math.PI * 2 / 4 * 2
                ) * 20 + 100 + 50));
        }
    }

    public drawVerticalSpan(framebuffer: Framebuffer, texture: Texture, x: number, y1: number, y2: number): void {
        const delta: number = Math.abs(y2 - y1);
        const textureStep: number = texture.height / delta;
        const alpha: number = 1.0;
        let texpos: number = 0;
        const pixelStep: number = y2 > y1 ? 1 : -1;
        let pixPos: number = y1;
        for (let i: number = 0; i < delta; i++) {
            framebuffer.drawPixel3(x, pixPos, texture.getPixel2(texture, x,
                Math.max(0, Math.min(Math.round(texpos), texture.height))), alpha);
            texpos += textureStep;
            pixPos += pixelStep;
        }
    }

    public drawOldSchoolPlasma(framebuffer: Framebuffer, elapsedTime: number): void {
        let time = elapsedTime * 0.0007 * 1.0;
        let lineDirection = new Vector3f(Math.sin(time), Math.cos(time), 0);
        let radialWaveCenter = new Vector3f(470.0 / 2.0, 230.0 / 2.0, 0).add(new Vector3f(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));

        let difference = new Vector3f(0, 0, 0);
        // TODO: implement sin/cos lookup tables plus starfield ;)
        let index = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let directionalWave = Math.sin(((x * lineDirection.x + y * lineDirection.y) * 0.02 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                let radialWave = (Math.cos(difference.length() * 0.03) + 1.0) * 0.5;
                let waveSum: number = (radialWave + directionalWave) * 0.5;

                let red = (Math.cos(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let green = (Math.sin(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let blue = (Math.sin(time) + 1.0) * 0.5 * 255;

                framebuffer.framebuffer[index++] = 255 << 24 | blue << 16 | green << 8 | red;
            }
        }
    }


}
