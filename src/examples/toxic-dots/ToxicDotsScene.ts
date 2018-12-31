import { Framebuffer } from '../../Framebuffer';
import { Vector3f, Matrix4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';

export class ToxicDotsScene extends AbstractScene {

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.blur(framebuffer);
        this.shadingTorus3(framebuffer, time * 0.003);
    }

    public shadingTorus3(framebuffer: Framebuffer, elapsedTime: number): void {
        let points: Array<Vector3f> = [];
        const STEPS = 15 * 2;
        const STEPS2 = 12 * 2;
        for (let i = 0; i < STEPS; i++) {
            let frame = framebuffer.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = framebuffer.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }

        let scale = 1.2;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        let points2: Array<Vector3f> = new Array<Vector3f>();

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25,
            Math.sin(elapsedTime * 0.05) * 9, -34).multiplyMatrix(modelViewMartrix);

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        for (let i = 0; i < points2.length; i++) {
            let v1 = points2[i];
            let color = 0xffbbffbb;
            if (v1.x > Framebuffer.minWindow.x && v1.x < Framebuffer.maxWindow.x &&
                v1.y > Framebuffer.minWindow.y && v1.y < Framebuffer.maxWindow.y) {
                framebuffer.drawPixel(v1.x, v1.y, color);
            }
        }
    }

    // optimization:
    // - downscale image to half the size before bluring
    // render result to texture in order to not blur the logo
    tmp = new Uint32Array(320 * 200);
    tmp2 = new Uint32Array(320 * 200);
    public blur(framebuffer: Framebuffer) {
        let scale = 1 / (3.1);
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        let index = 1 + 320;
        let sumIndex = 320;
        let color: number;
        for (let y = 0; y < 198; y++) {
            for (let x = 0; x < 318; x++) {
                color = framebuffer.framebuffer[sumIndex];
                r = color & 0xff;
                g = color >> 8 & 0xff;
                b = color >> 16 & 0xff;
                sumIndex++;

                color = framebuffer.framebuffer[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex++;

                color = framebuffer.framebuffer[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex++;

                sumIndex -= 2;
                r *= scale; g *= scale; b *= scale;
                this.tmp[index] = r | g << 8 | b << 16 | 255 << 24;
                index++;
            }
            sumIndex += 2;
            index += 2;
        }

        index = 320 + 1;
        sumIndex = 1;
        for (let x = 1; x < 320 - 1; x++) {
            //   index = x + 320;
            sumIndex = x;
            for (let y = 0; y < 198; y++) {
                color = this.tmp[sumIndex];
                r = color & 0xff;
                g = color >> 8 & 0xff;
                b = color >> 16 & 0xff;
                sumIndex += 320;

                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += 320;

                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += 320;

                sumIndex -= 320 * 2;
                r *= scale; g *= scale; b *= scale;
                this.tmp2[index] = r | g << 8 | b << 16 | 255 << 24;
                index += 320;
            }
            index += -198 * 320 + 1;
        }

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.tmp2);
    }

}
