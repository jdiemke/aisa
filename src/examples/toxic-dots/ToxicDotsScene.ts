import { Framebuffer } from '../../Framebuffer';
import { Vector3f, Matrix4f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';

export class ToxicDotsScene extends AbstractScene {

    private tmp: Uint32Array;
    private tmp2: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.tmp = new Uint32Array(framebuffer.width * framebuffer.height);
        this.tmp2 = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();

        this.blur(framebuffer);
        this.shadingTorus3(framebuffer, time * 0.003);
    }

    public shadingTorus3(framebuffer: Framebuffer, elapsedTime: number): void {
        const points: Array<Vector3f> = [];
        const STEPS = 15 * 2;
        const STEPS2 = 12 * 2;
        for (let i = 0; i < STEPS; i++) {
            const frame = framebuffer.torusFunction(i * 2 * Math.PI / STEPS);
            const frame2 = framebuffer.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            const up = new Vector3f(0.0, 4.0, 0);
            const right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                const pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }

        const scale = 1.2;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        const points2: Array<Vector3f> = new Array<Vector3f>();

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25,
            Math.sin(elapsedTime * 0.05) * 9, -34).multiplyMatrix(modelViewMartrix);

        for (let p = 0; p < points.length; p++) {
            const transformed = modelViewMartrix.multiply(points[p]);

            const x = transformed.x;
            const y = transformed.y;
            const z = transformed.z; // TODO: use translation matrix!

            const xx = (framebuffer.width * 0.5) + (x / (-z * 0.0078));
            const yy = (framebuffer.height * 0.5) + (y / (-z * 0.0078));

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        for (let i = 0; i < points2.length; i++) {
            const v1 = points2[i];
            const color = 0xffbbffbb;
            if (v1.x > framebuffer.minWindow.x && v1.x < framebuffer.maxWindow.x &&
                v1.y > framebuffer.minWindow.y && v1.y < framebuffer.maxWindow.y) {
                framebuffer.drawPixel(v1.x, v1.y, color);
            }
        }
    }

    // optimization:
    // - downscale image to half the size before bluring
    // render result to texture in order to not blur the logo

    public blur(framebuffer: Framebuffer) {
        const scale = 1 / (3.1);
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        let index = 1 + framebuffer.width;
        let sumIndex = framebuffer.width;
        let color: number;
        for (let y = 0; y < framebuffer.height - 2; y++) {
            for (let x = 0; x < framebuffer.width - 2; x++) {
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

        index = framebuffer.width + 1;
        sumIndex = 1;
        for (let x = 1; x < framebuffer.width - 1; x++) {
            sumIndex = x;
            for (let y = 0; y < framebuffer.height - 2; y++) {
                color = this.tmp[sumIndex];
                r = color & 0xff;
                g = color >> 8 & 0xff;
                b = color >> 16 & 0xff;
                sumIndex += framebuffer.width;

                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += framebuffer.width;

                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += framebuffer.width;

                sumIndex -= framebuffer.width * 2;
                r *= scale; g *= scale; b *= scale;
                this.tmp2[index] = r | g << 8 | b << 16 | 255 << 24;
                index += framebuffer.width;
            }
            index += -(framebuffer.height - 2) * framebuffer.width + 1;
        }

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.tmp2);
    }

}
