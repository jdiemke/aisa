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
    private kartPosition: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938 - 1024, 0);
    private angle: number = 270;
    private startTime: number = Date.now();
    public init(framebuffer: Framebuffer): Promise<any> {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.which === 38) {
                this.kartPosition.x += Math.cos(2 * Math.PI / 360 * this.angle) * 7;
                this.kartPosition.y += Math.sin(2 * Math.PI / 360 * this.angle) * 7;
            }
            if (e.which === 40) {
                this.kartPosition.x -= Math.cos(2 * Math.PI / 360 * this.angle) * 7;
                this.kartPosition.y -= Math.sin(2 * Math.PI / 360 * this.angle) * 7;
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
        // https://www.gamedev.net/forums/topic/51626-making-mario-kart-type-of-gameswhats-involved/
        // https://www.coranac.com/tonc/text/mode7.htm

        const time: number = Date.now() * 0.06;

        const screenDistance: number = 160;
        const cameraHeight: number = 80;
        const horizonHeight: number = 20;
        const cameraDistance: number = 153.4 - 90 * (Math.sin(time * 0.01) * 0.5 + 0.5);

        for (let y: number = 21; y < 200; y++) {
            for (let x: number = 0; x < 320; x++) {
                const distance: number = screenDistance * cameraHeight / (y - horizonHeight);

                const step: number = distance / screenDistance;

                const scannlineCenterX: number = Math.cos(2 * Math.PI / 360 * this.angle) *
                    distance + this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.angle) * cameraDistance;
                const scannlineCenterY: number = Math.sin(2 * Math.PI / 360 * this.angle) *
                    distance + this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.angle) * cameraDistance;

                const xStep: number = -Math.sin(2 * Math.PI / 360 * this.angle) * step;
                const yStep: number = Math.cos(2 * Math.PI / 360 * this.angle) * step;

                let xSampl: number = scannlineCenterX - (320 / 2 * xStep) + x * xStep;
                let ySampl: number = scannlineCenterY - (320 / 2 * yStep) + x * yStep;
                xSampl *= 0.3;
                ySampl *= 0.3;
                let texel: number;

                if (xSampl >= 0 && xSampl <= 1023 && ySampl >= 0 && ySampl <= 1023) {
                    texel = this.map.getPixel2(
                        this.map,
                        Math.round(xSampl) % 1024,
                        Math.round(ySampl) % 1024);
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
        /* framebuffer.drawTexture(320 / 2 - 16, 200 - 32 - 32 * 3
             + Math.floor(1 * Math.sin((time - this.startTime))),
             this.mario, 1.0);
 */
        // draw kart and enemies

        // project by scalar product lateron
        // only project for other players and use original size for own player
        const yPos: number = cameraHeight * screenDistance / cameraDistance;
        const marioHeight: number = 32;
        const projectionHeightScale: number = yPos / cameraHeight;
        framebuffer.scaleClipBlitter.drawScaledTextureClip(
            Math.round(320 / 2 - (marioHeight * projectionHeightScale) / 2),
            Math.round(horizonHeight + yPos) - Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale), this.mario, 1.0);
    }

}
