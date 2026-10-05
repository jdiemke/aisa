import { Framebuffer } from '../Framebuffer';
import { Vector3f } from '../math';

/**
 * 2D drawing primitives (pixel plotting, lines and rectangles) that operate
 * directly on a {@link Framebuffer}'s pixel/depth buffers.
 */
export class Primitives2D {

    public static drawPixel(fb: Framebuffer, x: number, y: number, color: number): void {
        fb.framebuffer[x + y * fb.width] = color;
    }

    public static drawPixel4(fb: Framebuffer, x: number, y: number, color: number, alpha: number): void {
        const index: number = x + y * fb.width;
        const inverseAlpha = 1 - alpha;
        const r = (((fb.framebuffer[index] >> 0) & 0xff) * (inverseAlpha)
            + ((color >> 0) & 0xff) * (alpha)) | 0;
        const g = (((fb.framebuffer[index] >> 8) & 0xff) * (inverseAlpha) +
            ((color >> 8) & 0xff) * (alpha)) | 0;
        const b = (((fb.framebuffer[index] >> 16) & 0xff) * (inverseAlpha) +
            ((color >> 16) & 0xff) * (alpha)) | 0;
        fb.framebuffer[x + y * fb.width] = r | (g << 8) | (b << 16) | (255 << 24);
    }

    public static drawPixel3(fb: Framebuffer, x: number, y: number, color: number, alpha2: number): void {
        const index: number = x + y * fb.width;
        const alpha = ((color >> 24) & 0xff) / 255 * alpha2;
        const inverseAlpha = 1 - alpha;

        const r = (((fb.framebuffer[index] >> 0) & 0xff) * (inverseAlpha)
            + ((color >> 0) & 0xff) * (alpha)) | 0;
        const g = (((fb.framebuffer[index] >> 8) & 0xff) * (inverseAlpha) +
            ((color >> 8) & 0xff) * (alpha)) | 0;
        const b = (((fb.framebuffer[index] >> 16) & 0xff) * (inverseAlpha) +
            ((color >> 16) & 0xff) * (alpha)) | 0;

        fb.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);
    }

    /**
     * Renders a pixel using fractional x,y coordinates
     * blended with the framebuffer background
     */
    public static drawPixelAntiAliased(fb: Framebuffer, x: number, y: number, color: number): void {
        if ((x < 0 || x >= fb.width) || (y < 0 || y >= fb.height)) return;
        const roundedX = Math.floor(x);
        const roundedY = Math.floor(y);
        const percentX = 1 - Math.abs(x - roundedX);
        const percentY = 1 - Math.abs(y - roundedY);
        const percent = percentX * percentY;
        Primitives2D.drawPixel3(fb, roundedX, roundedY, color, percent);
    }

    /**
     * Renders a pixel using fractional x,y coordinates
     * to the framebuffer background
     */
    public static drawPixelAliased(fb: Framebuffer, x: number, y: number, color: number): void {
        if ((x < 0 || x >= fb.width) || (y < 0 || y >= fb.height)) return;
        const roundedX = Math.round(x);
        const roundedY = Math.round(y);
        Primitives2D.drawPixel(fb, roundedX, roundedY, color);
    }

    /**
     * Renders a pixel using fractional x,y coordinates
     * blended with the framebuffer background in a 4x4 matrix
     * https://en.wikipedia.org/wiki/Spatial_anti-aliasing
     */
    public static drawPixelAntiAliasedSpacial(fb: Framebuffer, x: number, y: number, color: number): void {
        if ((x < 0 || x >= fb.width) || (y < 0 || y >= fb.height)) return;
        for (let roundedX = Math.floor(x); roundedX <= Math.ceil(x); roundedX++) {
            for (let roundedY = Math.floor(y); roundedY <= Math.ceil(y); roundedY++) {
                const percentX = 1 - Math.abs(x - roundedX);
                const percentY = 1 - Math.abs(y - roundedY);
                const percent = percentX * percentY;
                Primitives2D.drawPixel4(fb, roundedX, roundedY, color, percent);
            }
        }
    }

    public static readPixel(fb: Framebuffer, x: number, y: number): number {
        return fb.framebuffer[x + y * fb.width];
    }

    public static drawRect(fb: Framebuffer, x: number, y: number, width: number, color: number): void {
        let start = x + y * fb.width;
        for (let i = 0; i < width; i++) {
            fb.framebuffer[start++] = color;
        }
    }

    public static drawRect2(fb: Framebuffer, x: number, y: number, width: number, height: number, color: number): void {
        let start = x + y * fb.width;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                fb.framebuffer[start++] = color;
            }
            start += fb.width - width;
        }
    }

    /**
     * Digital differential analyser line drawing with w=1/z depth testing.
     */
    public static drawLineDDA(fb: Framebuffer, start: Vector3f, end: Vector3f, color: number): void {
        const xDistance: number = end.x - start.x;
        const yDistance: number = end.y - start.y;

        let dx: number;
        let dy: number;
        let length: number;

        if (Math.abs(xDistance) > Math.abs(yDistance)) {
            dx = Math.sign(xDistance);
            dy = yDistance / Math.abs(xDistance);
            length = Math.abs(xDistance);
        } else {
            dx = xDistance / Math.abs(yDistance);
            dy = Math.sign(yDistance);
            length = Math.abs(yDistance);
        }

        let xPosition: number = start.x;
        let yPosition: number = start.y;

        // w=1/z interpolation for z-buffer
        let wStart = 1 / (start.z);
        const wDelta = (1 / end.z - 1 / start.z) / length;

        for (let i = 0; i <= length; i++) {
            const index = Math.round(xPosition) + Math.round(yPosition) * fb.width;
            if (wStart < fb.wBuffer[index]) {
                fb.wBuffer[index] = wStart;
                Primitives2D.drawPixel(fb, Math.round(xPosition), Math.round(yPosition), color);
            }
            xPosition += dx;
            yPosition += dy;
            wStart += wDelta;
        }
    }

    /**
     * Digital differential analyser line drawing without depth testing.
     */
    public static drawLineDDANoZ(fb: Framebuffer, start: Vector3f, end: Vector3f, color: number): void {
        const xDistance: number = end.x - start.x;
        const yDistance: number = end.y - start.y;

        let dx: number;
        let dy: number;
        let length: number;

        if (Math.abs(xDistance) > Math.abs(yDistance)) {
            dx = Math.sign(xDistance);
            dy = yDistance / Math.abs(xDistance);
            length = Math.abs(xDistance);
        } else {
            dx = xDistance / Math.abs(yDistance);
            dy = Math.sign(yDistance);
            length = Math.abs(yDistance);
        }

        let xPosition: number = start.x;
        let yPosition: number = start.y;

        for (let i = 0; i <= length; i++) {
            Primitives2D.drawPixel(fb, Math.round(xPosition), Math.round(yPosition), color);
            xPosition += dx;
            yPosition += dy;
        }
    }

}
