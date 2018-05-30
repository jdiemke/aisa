import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Vector3f } from '../../math';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class LedPlasmaScene extends AbstractScene {

    private ledTexture: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/led.png'), false).then(
                (texture: Texture) => this.ledTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.led(framebuffer, Date.now(), this.ledTexture);
    }

     // TODO: create interesting pattern!
     public led(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {
        let time = elapsedTime * 0.0007 * 1.0;
        let lineDirection = new Vector3f(Math.sin(time), Math.cos(time), 0);
        let radialWaveCenter = new Vector3f(40.0 / 2.0, 35.0 / 2.0, 0).add(new Vector3f(40.0 / 2.0 *
            Math.sin(-time * 1.2), 35.0 / 2.0 * Math.cos(-time * 1.2), 0));
        let difference: Vector3f = new Vector3f(0, 0, 0);
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                let directionalWave = (Math.sin((x * lineDirection.x + y * lineDirection.y) * 0.8 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                let radialWave = (Math.cos(difference.length() * 0.7) + 1.0) * 0.5;
                let waveSum: number = (radialWave + directionalWave) * 0.5;

                let intensity = ((waveSum * 15) | 0) % 16;
                framebuffer.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * intensity, 8, 8, texture);
            }
        }
    }


}
