import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Vector3f } from '@engine/math';
import { Primitives2D } from '@engine/geometry/primitives';

export class Pixelate {

    public static pixelate(fb: Framebuffer): void {
        const xoff = 200;
        const yoff = 50;

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                Primitives2D.drawBox2(fb, x * 10 + xoff, y * 10 + yoff, 10, 10, Primitives2D.readPixel(fb, x * 10 + xoff, y * 10 + yoff));
            }
        }
        Primitives2D.drawLineDDA(fb, new Vector3f(xoff, yoff, -0.3), new Vector3f(xoff + 20 * 5, yoff, -0.3), 0xffffffff);
        Primitives2D.drawLineDDA(fb, new Vector3f(xoff, yoff + 20 * 5, -0.3), new Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
        Primitives2D.drawLineDDA(fb, new Vector3f(xoff, yoff, -0.3), new Vector3f(xoff, yoff + 20 * 5, -0.3), 0xffffffff);
        Primitives2D.drawLineDDA(fb, new Vector3f(xoff + 20 * 5, yoff, -0.3), new Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
    }

}
