import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math/index';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

/**
 * TODO: extract lens into effect class
 */
export class Mode7Scene extends AbstractScene {

    private map: Texture;
    private back: Texture;
    private mario: Texture;
    private grass: Texture;
    private pos: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938, 0);
    private angle: number = 270;
    private startTime: number = Date.now();
    public init(framebuffer: Framebuffer): Promise<any> {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.which === 38) {
                this.pos.x += Math.cos(2 * Math.PI / 360 * this.angle) * 7;
                this.pos.y += Math.sin(2 * Math.PI / 360 * this.angle) * 7;
            }
            if (e.which === 40) {
                this.pos.x -= Math.cos(2 * Math.PI / 360 * this.angle) * 7;
                this.pos.y -= Math.sin(2 * Math.PI / 360 * this.angle) * 7;
            }
            if (e.which === 37) {
                this.angle -= 1;
            }
            if (e.which === 39) {
                this.angle += 1;
            }
        });

        return Promise.all([
            TextureUtils.load(require('./assets/map.png'), false).then(
                (texture: Texture) => this.map = texture
            ),
            TextureUtils.load(require('./assets/background.png'), false).then(
                (texture: Texture) => this.back = texture
            ),
            TextureUtils.load(require('./assets/grass.png'), false).then(
                (texture: Texture) => this.grass = texture
            ),
            TextureUtils.load(require('./assets/mario.png'), true).then(
                (texture: Texture) => this.mario = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        // TODO: optimize
        // * moving constants outside of loop
        // * use DDA for scanlines
        // * dont use put pixel but use linear offset and increment each pixel!
        const time: number = Date.now() * 0.06;
        for (let y: number = 21; y < 200; y++) {
            for (let x: number = 0; x < 320; x++) {
                const d: number = 160;
                const cameraHeight: number = 80;
                const distance: number = d * cameraHeight / (y - 20);

                const step: number = distance / d;
                let xSampl: number = ((x - 320 / 2) * step) * 0.1 + 50 + this.pos.x;
                let ySampl: number = (distance) * 0.4 + this.pos.y;

                // Update
                const scannlineCenterX: number = Math.cos(2 * Math.PI / 360 * this.angle) * distance + this.pos.x;
                const scannlineCenterY: number = Math.sin(2 * Math.PI / 360 * this.angle) * distance + this.pos.y;

                const xStep: number = -Math.sin(2 * Math.PI / 360 * this.angle) * step;
                const yStep: number = Math.cos(2 * Math.PI / 360 * this.angle) * step;

                xSampl = scannlineCenterX - (320 / 2 * xStep) + x * xStep;
                ySampl = scannlineCenterY - (320 / 2 * yStep) + x * yStep;
                xSampl *= 0.3;
                ySampl *= 0.3;
                let texel: number;
                if (xSampl >= 0 && xSampl <= 1023 &&
                    ySampl >= 0 && ySampl <= 1023) {
                    texel = this.map.getPixel2(
                        this.map,
                        Math.round(xSampl) % 1024,
                       (1023 - ( Math.round(ySampl) % 1024)));
                } else {
                    texel = this.grass.getPixel2(
                        this.grass,
                        ((Math.round(xSampl) % 8) + 8) % 8,
                        (7 - (((Math.round(ySampl) % 8) + 8) % 8))
                    );
                }
                framebuffer.drawPixel(x, y, texel);
            }
        }
        framebuffer.drawTexture(0, 0, this.back, 1.0);
        framebuffer.drawTexture(320 / 2 - 16, 200 - 32 - 32 * 3
            + Math.floor(1 * Math.sin((time - this.startTime))),
            this.mario, 1.0);
    }

}
