import { Framebuffer } from '../../Framebuffer';
import { Texture } from '../../texture/Texture';

export class PlaneDeformNoCalc {

    public static drawPlaneDeformation(fb: Framebuffer, elapsedTime: number, texture: Texture): void {
        // optimize
        // power of two modulo with &
        // fb.clearColor(new Color());
        // precompute LUD + render to half size backbuffer
        const IMG_WIDTH = texture.width;
        const IMG_HEIGHT = texture.height;

        let framebufferIndex = 0;

        for (let y = 0; y < fb.height; y++) {
            const yy = (-1.00 + 2.00 * y / fb.height);

            for (let x = 0; x < fb.width; x++) {

                const xx = (-1.00 + 2.00 * x / fb.width);

                // magic formulas here
                const u = ((xx / Math.abs(yy)) * IMG_WIDTH * 0.05) | 0;
                const v = (1.0 / Math.abs(yy) * IMG_HEIGHT * 0.05 + elapsedTime * 0.008) | 0;

                const scale = 1 - Math.max(Math.min(1 / Math.abs(yy) * 0.2, 1), 0);
                let color = texture.texture[(u & 0xff) + (v & 0xff) * IMG_WIDTH];
                const r = ((color >> 0) & 0xff) * scale;
                const g = ((color >> 8) & 0xff) * scale;
                const b = ((color >> 16) & 0xff) * scale;
                color = (255 << 24) | (b << 16) | (g << 8) | (r << 0);

                fb.framebuffer[framebufferIndex++] = color;
            }
        }
    }

}
