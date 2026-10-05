import { Framebuffer } from '../../Framebuffer';
import { Interpolator } from '../../math/Interpolator';
import { Texture } from '../../texture/Texture';

export class PlaneDeformationTunnelAnim {

    public static drawPlanedeformationTunnelAnim(fb: Framebuffer, elapsedTime: number, texture: Texture): void {
        let i = 0;
        for (let y = 0; y < fb.height; y++) {
            for (let x = 0; x < fb.width; x++) {
                const xdist = (x - fb.width / 2);
                const ydist = (y - fb.height / 2);
                const dist = 256 * 0.2 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                const dist2 = dist + elapsedTime * 0.002;
                const angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 16 + elapsedTime * 0.00069;

                const color1 = texture.texture[(dist2 & 0x1f) + (angle & 0x1f) * 32];
                // darkening can be done with alpha blended texture
                const scale = 1 - Interpolator.cosineInterpolate(1.0, 6.0, dist);
                const r = ((color1 >> 0) & 0xff) * scale;
                const g = ((color1 >> 8) & 0xff) * scale;
                const b = ((color1 >> 16) & 0xff) * scale;
                const final = r | g << 8 | b << 16;

                fb.framebuffer[i++] = final;
            }
        }
    }

}
