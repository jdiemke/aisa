import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';

export class Reflections {

    public static addReflections(fb: Framebuffer): void {
        const start = 150;
        for (let i = 0; i < 50; i++) {
            for (let x = 0; x < fb.width; x++) {
                fb.framebuffer[(start + i) * fb.width + x] = fb.framebuffer[(start - i * 3 - 1) * fb.width + x +
                    Interpolator.interpolate(0, 50, i) * (Math.sin(Date.now() * 0.002 + i * 0.2) * 14) | 0];
            }
        }
    }

}
