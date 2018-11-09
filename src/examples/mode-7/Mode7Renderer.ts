import { Framebuffer } from '../../Framebuffer';
import { Vector2f } from '../../math/index';
import { Texture } from '../../texture/index';

export class Camera {

    public position: Vector2f;
    public angle: number;
    public height: number;
    public screenDistance: number;

    public getViewDirection(): Vector2f {
        return new Vector2f(
            Math.cos(2 * Math.PI / 360 * this.angle),
            Math.sin(2 * Math.PI / 360 * this.angle)
        );
    }

}

// tslint:disable-next-line:max-classes-per-file
export class Mode7Renderer {

    private camera: Camera;

    constructor(private map: Texture, private grass: Texture) {

    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }
    public render(framebuffer: Framebuffer): void {
        const horizonHeight: number = 20;
        const mapScale: number = 0.3;

        let framebufferPos: number = (horizonHeight + 1) * 320;
        const viewDirection: Vector2f = this.camera.getViewDirection();
        const viewDirectionPerpendicular: Vector2f = viewDirection.perp();

        for (let y: number = 21; y < 200; y++) {
            const distance: number = this.camera.screenDistance * this.camera.height / (y - horizonHeight);

            const step: number = distance / this.camera.screenDistance;

            const scannlineCenterX: number = viewDirection.x * distance + this.camera.position.x;
            const scannlineCenterY: number = viewDirection.y * distance + this.camera.position.y;

            const xStep: number = viewDirectionPerpendicular.x * step;
            const yStep: number = viewDirectionPerpendicular.y * step;
            let texel: number;

            let xSampl: number = scannlineCenterX - (320 / 2 * xStep);
            let ySampl: number = scannlineCenterY - (320 / 2 * yStep);
            xSampl *= mapScale;
            ySampl *= mapScale;
            const xStepDelta: number = xStep * mapScale;
            const yStepDelta: number = yStep * mapScale;

            for (let x: number = 0; x < 320; x++) {
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

                framebuffer.framebuffer[framebufferPos++] = texel;

                xSampl += xStepDelta;
                ySampl += yStepDelta;
            }
        }
    }

}
