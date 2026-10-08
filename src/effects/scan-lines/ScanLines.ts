import { Color } from '../../core/Color';
import { Utils } from '../../core/Utils';
import { Framebuffer } from '../../Framebuffer';

export class ScanLines {

    public static renderScanlines(framebuffer: Framebuffer, shiftAmount: number): void {
        let i = 0;

        const offRed = (2 * shiftAmount) << 0;
        const offGreen = (5 * shiftAmount) << 0;
        const offBlue = (2 * shiftAmount) << 0;

        for (let y = 0; y < framebuffer.height; y++) {
            const strips = (y & 1) * 16;
            const verticalPosition = y * framebuffer.width;

            for (let x = 0; x < framebuffer.width; x++) {
                const imagePixelR = framebuffer.framebuffer[Utils.clamp(x + offRed, 0, framebuffer.width - 1) + verticalPosition] & 0xFF;
                const imagePixelG = framebuffer.framebuffer[Utils.clamp(x + offGreen, 0, framebuffer.width - 1) + verticalPosition] >> 8 & 0xFF;
                const imagePixelB = framebuffer.framebuffer[Utils.clamp(x + offBlue, 0, framebuffer.width - 1) + verticalPosition] >> 16 & 0xFF;

                framebuffer.framebuffer[i++] = new Color(
                    Utils.clamp(imagePixelR - strips, 0, 255),
                    Utils.clamp(imagePixelG - strips, 0, 255),
                    Utils.clamp(imagePixelB - strips, 0, 255)).toPackedFormat();
            }
        }
    }

}