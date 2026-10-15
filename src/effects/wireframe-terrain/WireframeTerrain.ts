import type { Framebuffer } from '@engine/rendering/Framebuffer';
import { Matrix3f, Vector3f } from '@engine/math';
import { LineRenderingPipeline } from '@engine/rendering/pipelines';
import { type Texture } from '@engine/texture';

export class WireframeTerrain {

    public static wireFrameTerrain(framebuffer: Framebuffer, elapsedTime: number, heightmap: Texture): void {
        framebuffer.clearDepthBuffer();
        const lines = new LineRenderingPipeline(framebuffer);
        const index: Array<number> = [];
        const points: Array<Vector3f> = [];
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                points.push(new Vector3f((x - 128) * 20.0,
                    (heightmap.texture[x + y * 256] & 0x000000ff) * 128 / 256 - 70, (y - 128) * 20.0));
            }
        }

        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256 - 1; x++) {
                index.push(x + y * 256);
                index.push(1 + x + y * 256);
            }
        }

        for (let x = 0; x < 256; x++) {
            for (let y = 0; y < 256 - 1; y++) {
                index.push(x + y * 256);
                index.push(x + (y + 1) * 256);
            }
        }

        const modelViewMatrix = Matrix3f.constructYRotationMatrix(elapsedTime * 0.003);
        const points2: Array<Vector3f> = [];
        const xOff = Math.cos(elapsedTime * 0.000001) * 128 * 20;
        const zOff = Math.sin(elapsedTime * 0.000001) * 128 * 20;
        points.forEach(element => {
            const transformed = modelViewMatrix.multiply(element);
            points2.push(new Vector3f(transformed.x + xOff, transformed.y, transformed.z + zOff));
        });

        for (let i = 0; i < index.length; i += 2) {
            const scale = 1 - Math.min(255, -points2[index[i]].z * 0.9) / 255;
            const color = (255 * scale) << 8 | 100 * scale | (framebuffer.height * scale) << 16 | 255 << 24;
            lines.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }
}
