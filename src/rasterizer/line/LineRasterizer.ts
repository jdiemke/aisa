import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';

/**
 * digital differential analyser line drawing algorithm
 * using fixed point math.
 * renders approx 1400 lines per millisecond on my machine
 */
export class LineRasterizerDda {

    constructor(private framebuffer: Framebuffer) { }

    public drawLineDDA(start: Vector3f, end: Vector3f, color: number): void {
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
            if (wStart < this.framebuffer.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320]) {
                this.framebuffer.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320] = wStart;
                this.framebuffer.drawPixel(Math.round(xPosition), Math.round(yPosition), color);
            }
            xPosition += dx;
            yPosition += dy;
            wStart += wDelta;
        }
    }

}
