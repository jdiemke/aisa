import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * Lens Effect
 *
 * A picture is shown and it looks like a magnifying glass
 * is drawn over the picture. One of the most famous demos
 * that has a lens effect is 2nd reality by future crew.
 * The trick is to precalculate the entire effect. Just make
 * an array that for each pixel in the destination picture
 * tells which pixel to take from the source picture. This
 * array is called the transformation array. The tricky part
 * is to calculate the transformation array to make the
 * destination look like a lens is beeing held over the source
 * picture.
 *
 * TODO: extract lens into effect class
 *
 */

export class LensScene extends AbstractScene {

    private lensDiameter: number = 100;
    private lensRadius: number = this.lensDiameter / 2;
    private textureBackground: Texture;
    private textureLens: Texture;
    private width: number = 320;
    private height: number = 200;

    private lensArrayA: Array<number> = [this.lensDiameter * this.lensDiameter];
    private lensArrayB: Array<number> = [this.lensDiameter * this.lensDiameter];

    private rightBorder: number = this.width - this.lensDiameter; // hit right wall
    private ballBase: number = this.height - this.lensDiameter;
    private ballX: number = 0;          // horizontal position
    private ballY: number = 0;          // vertical position
    private ballXV: number = 2;         // horizontal velocity
    private ballYV: number = 0;         // vertical velocity

    public init(framebuffer: Framebuffer): Promise<any> {

        this.calculateTransformation(20);

        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(
                (texture: Texture) => this.textureBackground = texture
            ),
            TextureUtils.load(require('./assets/blueLens.png'), true).then(
                (texture: Texture) => this.textureLens = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {

        // draw the background
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.textureBackground.texture);

        // move the lens around
        // this.moveWave();
        this.moveBounce();

        // apply the lens effect
        this.drawLensFast(framebuffer, this.textureBackground, this.textureLens);
        // this.drawLens(framebuffer, this.textureBackground, this.textureLens);
    }

    public drawLens(framebuffer: Framebuffer, texture: Texture, tex: Texture): void {

        for (let y: number = -this.lensRadius; y <= this.lensRadius; y++) {
            for (let x: number = -this.lensRadius; x <= this.lensRadius; x++) {
                if (x * x + y * y <= this.lensRadius * this.lensRadius) {

                    const xx: number = Math.round(x + this.ballX);
                    const yy: number = Math.round(y + this.ballY);

                    const z: number = 1 + Math.sqrt(this.lensRadius * this.lensRadius - x * x - y * y) * 0.03;
                    const xx2: number = Math.round(x / z + this.ballX);
                    const yy2: number = Math.round(y / z + this.ballY);
                    const col: number = texture.texture[xx2 + yy2 * this.width];
                    framebuffer.framebuffer[xx + yy * this.width] = col;
                }
            }
        }

        framebuffer.drawTexture(Math.round(this.ballX - 50), Math.round(this.ballY - 50), tex, 1.0);
    }

    public drawLensFast(framebuffer: Framebuffer, texture: Texture, tex: Texture): void {
        // For each pixel in the lens rectangle, apply the
        // offset from lensArray to the original background
        let i: number = 0;
        for (let y: number = 0; y < this.lensDiameter; y++) {
            const ypos: number = this.ballX + (y + this.ballY) * this.width;
            for (let x: number = 0; x < this.lensDiameter; x++) {
                framebuffer.framebuffer[x + ypos] = texture.texture[
                    this.ballX + this.lensArrayA[i] +
                    (this.ballY + this.lensArrayB[i++]) * this.width];
            }
        }

        // draw transparent lens bubble image over everything
        framebuffer.drawTexture(this.ballX, this.ballY, tex, 1.0);
    }

    // precalculate lens transformation array
    private calculateTransformation(magnificationStrength: number): void {
        let a: number;
        let b: number;
        const s: number = this.lensRadius * this.lensRadius - magnificationStrength * magnificationStrength;

        for (let y: number = -this.lensRadius; y < this.lensRadius; y++) {
            for (let x: number = -this.lensRadius; x < this.lensRadius; x++) {
                if (x * x + y * y >= s) {
                    a = x;
                    b = y;
                } else {
                    const z: number = Math.sqrt(this.lensRadius * this.lensRadius - x * x - y * y);
                    a = Math.floor(x * magnificationStrength / z);
                    b = Math.floor(y * magnificationStrength / z);
                }
                const index: number = (y + this.lensRadius) * this.lensDiameter + (x + this.lensRadius);
                const value: number = (b + this.lensRadius) * this.lensDiameter + (a + this.lensRadius);
                this.lensArrayA[index] = Math.floor(value % this.lensDiameter);
                this.lensArrayB[index] = Math.floor(value / this.lensDiameter);
            }
        }
    }

    // sine wave movement
    private moveWave(): void {
        const time: number = Date.now();
        this.ballX = this.width / 2 + Math.cos(6 * time * 0.0002) * (this.width / 2 - 50);
        this.ballY = this.height / 2 + Math.sin(4 * time * 0.0002) * (this.height / 2 - 50);
    }

    // bouncing ball movement
    private moveBounce(): void {
        this.ballX += this.ballXV;
        if ((this.ballX < 1) || (this.ballX > this.rightBorder)) { this.ballXV = -this.ballXV; }

        // move the ball down
        this.ballY += this.ballYV;

        // reflect if ball reaches screen boundries
        if ((this.ballYV > 0) && (this.ballY > this.ballBase)) {
            // reflect in YBASE
            this.ballY = this.ballBase - (this.ballY - this.ballBase);
            // reverse vertical velocity (bounce up)
            this.ballYV = -this.ballYV;
        }

        // gravity
        this.ballYV++;
    }

}
