import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';

export class LineRasterizerNoZ {

    constructor(private framebuffer: Framebuffer) { }

    public drawLineDDANoZ(start: Vector3f, end: Vector3f, color: number): void {
        let xDistance: number = end.x - start.x;
        let yDistance: number = end.y - start.y;

        let dx: number, dy: number, length: number;

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

            this.framebuffer.drawPixel(Math.round(xPosition), Math.round(yPosition), color);

            xPosition += dx;
            yPosition += dy;

        }
    }

}
