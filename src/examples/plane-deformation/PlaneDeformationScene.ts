import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { Color } from '../../core/Color';
import { Utils } from '../../core/Utils';

/**
 * Plane deformation
 *
 * 2D plane deformations using lookup tables was a great
 * way to get smooth animations of complex calculations
 * running on slower processors. These effects were very
 * common in the 90s demoscene.
 *
 * The idea was to take a texture and deform it using a
 * pre-calculated math reference table. Different formulas
 * gave different effects such as fake 3d tunnels, wormholes
 * and landscapes.
 *
 * https://www.iquilezles.org/www/articles/deform/deform.htm
 *
 */

export class PlaneDeformationScene {

    private mLUT: Int32Array;
    public texture: Texture;

    constructor(
        private effectStyle: number,
        private texturePath: string
    ) {
    }

    onInit() { }

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(this.texturePath, false).then(
                (texture: Texture) => {
                    this.texture = texture;
                    this.createLUT(this.effectStyle, framebuffer.width, framebuffer.height, this.texture.width, this.texture.height);
                }
            ),
        ]);

    }

    // fill math lookup table values with crazy values
    public createLUT(effectStyle: number, effectWidth: number, effectHeight: number, textureWidth: number, textureHeight: number): Promise<any> {

        // initializae lookup array
        this.mLUT = new Int32Array(3 * effectWidth * effectHeight);

        // increment placeholder
        let k = 0;

        // u and v are euclidean coordinates
        let u = 0;
        let v = 0
        let bright = 0;

        for (let j = 0; j < effectHeight; j++) {
            const y = -1.00 + 2.00 * j / effectHeight;
            for (let i = 0; i < effectWidth; i++) {
                const x = -1.00 + 2.00 * i / effectWidth;
                const d = Math.sqrt(x * x + y * y);
                const a = Math.atan2(y, x);

                const r = d;
                switch (effectStyle) {
                    case 1:   // stereographic projection / anamorphosis
                        u = Math.cos(a) / d;
                        v = Math.sin(a) / d;
                        bright = -50 * (2 / (6 * r + 3 * x));
                        break;
                    case 2:  // hypnotic rainbow spiral
                        v = Math.sin(a + Math.cos(3 * r)) / (Math.pow(r, .2));
                        u = Math.cos(a + Math.cos(3 * r)) / (Math.pow(r, .2));
                        bright = 1;
                        break;
                    case 3:  // rotating tunnel
                        v = 2 / (6 * r + 3 * x);
                        u = a * 3 / Math.PI;
                        bright = 25 * -v;
                        break;
                    case 4:  // wavy star-burst
                        v = (-0.4 / r) + .1 * Math.sin(8 * a);
                        u = .5 + .5 * a / Math.PI;
                        bright = 0;
                        break;
                    case 5:  // hyper-space travel
                        u = (0.02 * y + 0.03) * Math.cos(a * 3) / r;
                        v = (0.02 * y + 0.03) * Math.sin(a * 3) / r;
                        bright = 0;
                        break;
                    case 6:  // five point magnetic flare
                        u = 1 / (r + 0.5 + 0.5 * Math.sin(5 * a));
                        v = a * 3 / Math.PI;
                        bright = 0;
                        break;
                    case 7:  // cloud like dream scroll
                        u = 0.1 * x / (0.11 + r * 0.5);
                        v = 0.1 * y / (0.11 + r * 0.5);
                        bright = 0;
                        break;
                    case 8:  // floor and ceiling with fade to dark horizon
                        u = x / Math.abs(y);
                        v = 1 / Math.abs(y);
                        bright = 10 * -v;
                        break;
                    case 9:  // hot magma liquid swirl
                        u = 0.5 * (a) / Math.PI;
                        v = Math.sin(2 * r);
                        bright = 0;
                        break;
                    case 10:  // clockwise flush down the toilet
                        v = Math.pow(r, 0.1);
                        u = (1 * a / Math.PI) + r;
                        bright = 0;
                        break;
                    case 11:  // 3D ball
                        v = x * (3 - Math.sqrt(4 - 5 * r * r)) / (r * r + 1);
                        u = y * (3 - Math.sqrt(4 - 5 * r * r)) / (r * r + 1);
                        bright = 7 * -18.7 * (x + y + r * r - (x + y - 1) * Math.sqrt(4 - 5 * r * r) / 3) / (r * r + 1);
                        break;
                    default:  // show texture with no deformation or lighting
                        u = x;
                        v = y;
                        bright = 0;
                        break;
                }
                this.mLUT[k++] = (textureWidth * u) & textureWidth - 1;
                this.mLUT[k++] = (textureHeight * v) & textureHeight - 1;
                this.mLUT[k++] = Utils.clamp(bright, -255, 255);
            }
        }
        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        // this.drawOldPlaneDeformationStar(framebuffer, time >> 3);
        // this.drawOldPlaneDeformationFloor(framebuffer, time >> 3);
        this.drawPlaneDeformation(framebuffer, time >> 3, time >> 3);
    }

    /**
     * For every frame, go through every pixel and use the reference table (mLUT)
     * to get which pixel of the texture it should draw at the current pixel.
     *
     * TODO:
     * - Rotate effect via rotozoomer class
     *   use drawOldPlaneDeformationStar to add another lookup layer [mLUT * 4]
     *   use drawOldPlaneDeformationFloor to update createLUT(8) floor algorithm
     *
     */
    drawPlaneDeformation(framebuffer: Framebuffer, elapsedTimeY: number, elapsedTimeX: number) {

        for (let pixelCount = 0; pixelCount < framebuffer.framebuffer.length; pixelCount++) {
            const o = (pixelCount << 1) + pixelCount; // equivalent to 3 * pixelCount
            const u = this.mLUT[o + 0] + elapsedTimeX; // to look like its animating, add timeDisplacement
            const v = this.mLUT[o + 1] + elapsedTimeY;
            const adjustBrightness = this.mLUT[o + 2]; // fade out

            // get the R,G,B values from texture
            let currentPixel = this.texture.texture[this.texture.width * (v & this.texture.height - 1) + (u & this.texture.width - 1)];

            // only apply brightness if it was calculated
            if (adjustBrightness !== 0) {

                // disassemble pixel using bit mask to remove color components for greater speed
                let r = currentPixel & 0xFF;        // get red
                let g = currentPixel >> 8 & 0xFF;   // get green
                let b = currentPixel >> 16 & 0xFF;  // get blue

                // make darker or brighter
                r += adjustBrightness;
                g += adjustBrightness;
                b += adjustBrightness;

                // constrain RGB to make sure they are within 0-255 color range
                r = Utils.clamp(r, 0, 255);
                g = Utils.clamp(g, 0, 255);
                b = Utils.clamp(b, 0, 255);

                // reassemble colors back into pixel
                currentPixel = new Color(r, g, b, 255).toPackedFormat();
            }

            // put texture pixel on buffer screen
            framebuffer.framebuffer[pixelCount] = currentPixel;
        }
    }

    /**
     *
     * Previous Plane deformation without lookup tables for reference
     *
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    drawOldPlaneDeformationFloor(framebuffer: Framebuffer, elapsedTime: number) {
        /*
        mLUT(8)
            u = x / Math.abs(y);
            v = 1 / Math.abs(y);
            bright = 10 * -v;
        */
        let i = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            const ydist = (y - framebuffer.height / 2);
            const v = (((1 / Math.abs(ydist / 100 * 0.02) + elapsedTime * 0.069) % 256) + 256) % 256;
            const alpha = 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
            for (let x = 0; x < framebuffer.width; x++) {
                const xdist = (x - (framebuffer.width / 2));
                const u = (((((xdist / framebuffer.width) / Math.abs(ydist / 100 * 0.02))) % 256) + 256) % 256;
                const color1 = this.texture.texture[(u | 0) + (v | 0) * 256];
                const r = (((color1 >> 0) & 0xff) * (alpha)) | 0;
                const g = (((color1 >> 8) & 0xff) * (alpha)) | 0;
                const b = (((color1 >> 16) & 0xff) * (alpha)) | 0;
                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

    drawOldPlaneDeformationStar(framebuffer: Framebuffer, elapsedTime: number) {
        let i = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const xdist = (x - (framebuffer.width / 2)) / (framebuffer.width / 2);
                const ydist = (y - framebuffer.height / 2) / (framebuffer.height / 2);
                const alpha = 1;// 1 - Math.min(1, (1 / Math.abs(ydist / 10)));
                const a = Math.atan2(ydist, xdist) + Date.now() * 0.0004;
                const v = (a * 3 / Math.PI + Date.now() * 0.0004) * 128 % 256;
                const d = Math.sqrt(xdist * xdist + ydist * ydist);
                const u = (1 / (d + 0.5 + 0.5 * Math.sin(5 * a)) * 32 + Date.now() * 0.03) % 256;
                const color1 = this.texture.texture[(u | 0) + (v | 0) * 256];
                const r = (((color1 >> 0) & 0xff) * (alpha)) | 0;
                const g = (((color1 >> 8) & 0xff) * (alpha)) | 0;
                const b = (((color1 >> 16) & 0xff) * (alpha)) | 0;
                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

}
