import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math/index';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

/**
 * TODO:
 * - optimize rendering scene
 * - draw sorted sprites
 * - add enemies following splines
 * - add collision
 * - add control keyboard and touch
 *
 * - physics:
 *      - http://rmgi.blog./pygame-2d-car-tutorial.html
 *      - http://engineeringdotnet.blogspot.com/2010/04/simple-2d-car-physics-in-games.html
 *      - https://github.com/leonardo-ono/Java2DRacingPhysicsTest
 *      - https://www.gamedev.net/articles/programming/math-and-physics/2d-car-physics-r2443/
 */
export class Mode7Scene extends AbstractScene {

    private map: Texture;
    private back: Texture;
    private mario: Texture;
    private grass: Texture;
    private pipe: Texture;
    private kartPosition: Vector3f = new Vector3f(273.79803081006753, 2565.460311653938 - 1024, 0);
    private pipePositions: Array<Vector3f>;
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

        this.pipePositions = new Array<Vector3f>();
        for (let i: number = 0; i < 100; i++) {
            this.pipePositions.push(
                new Vector3f(Math.random() * 1024, Math.random() * 1024, 0)
            );
        }

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
            ),
            TextureUtils.load(require('./assets/pipe.png'), true).then(
                (texture: Texture) => this.pipe = texture
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
        const cameraDistance: number = 153.4;

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
        // HINT: real mario cart does not scale sprites but uses different versions for different sizes
        const yPos: number = cameraHeight * screenDistance / cameraDistance;
        const marioHeight: number = 32;
        const projectionHeightScale: number = yPos / cameraHeight;
        framebuffer.scaleClipBlitter.drawScaledTextureClip(
            Math.round(320 / 2 - (marioHeight * projectionHeightScale) / 2),
            Math.round(horizonHeight + yPos) - Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale),
            Math.round(marioHeight * projectionHeightScale), this.mario, 1.0);

        // draw pipes
        let sortedPipes: Array<Vector3f> = new Array<Vector3f>();

        const camPos: Vector3f = new Vector3f(
            this.kartPosition.x - Math.cos(2 * Math.PI / 360 * this.angle) * cameraDistance,
            this.kartPosition.y - Math.sin(2 * Math.PI / 360 * this.angle) * cameraDistance, 0);

        const camDir: Vector3f = new Vector3f(
            Math.cos(2 * Math.PI / 360 * this.angle),
            Math.sin(2 * Math.PI / 360 * this.angle), 0);

        const camDirX: Vector3f = new Vector3f(
            -Math.sin(2 * Math.PI / 360 * this.angle),
            Math.cos(2 * Math.PI / 360 * this.angle), 0);

        for (let i: number = 0; i < 100; i++) {
            const pipe: Vector3f = this.pipePositions[i].mul(1 / 0.3);

            const pipeDist: number = pipe.sub(camPos).dot(camDir);
            pipe.z = pipeDist;
            sortedPipes.push(pipe);
        }

        sortedPipes.sort((a: Vector3f, b: Vector3f) => b.z - a.z);

        // TODO: create sprite object with z for all sprites and sort them.

        for (let i: number = 0; i < 100; i++) {
            const pipe: Vector3f = sortedPipes[i];
            let pipeDist: number = pipe.z;
            if (pipeDist > 0) {
                const pipeDistX: number = pipe.sub(camPos).dot(camDirX);

                const projectionHeightScale: number = screenDistance / pipeDist;
                const yPos: number = cameraHeight * projectionHeightScale;

                const pipeH: number = 33;
                const pipeW: number = 24;

                framebuffer.scaleClipBlitter.drawScaledTextureClip(
                    Math.round(320 / 2 + pipeDistX * projectionHeightScale - (pipeW * projectionHeightScale) / 2),
                    Math.round(horizonHeight + yPos) - Math.round(pipeH * projectionHeightScale),
                    Math.round(pipeW * projectionHeightScale),
                    Math.round(pipeH * projectionHeightScale), this.pipe, 1.0);
            }
        }
    }

}
