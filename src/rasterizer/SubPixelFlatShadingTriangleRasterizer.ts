import { Color } from '../core/Color';
import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractTriangleRasterizer } from './AbstractTriangleRasterizer';
import { Vector2f, Vector4f } from '../math';

// http://www.hugi.scene.org/online/coding/hugi%2017%20-%20cotriang.htm
// TODO:
// debug clipper and rasterizer
export class SubPixelFlatShadingTriangleRasterizer extends AbstractTriangleRasterizer {

    private leftX: number;
    private rightX: number;

    constructor(private framebuffer: Framebuffer) {
        super();
    }

    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDA(p1: Vertex, p2: Vertex, p3: Vertex): void {
        const color: number = p1.color.toPackedFormat();

        if (p1.projection.y > p2.projection.y) {
            [p1, p2] = [p2, p1];
        }

        if (p1.projection.y > p3.projection.y) {
            [p1, p3] = [p3, p1];
        }

        if (p2.projection.y > p3.projection.y) {
            [p2, p3] = [p3, p2];
        }

        const y1i: number = Math.ceil(p1.projection.y);
        const y2i: number = Math.ceil(p2.projection.y);
        const y3i: number = Math.ceil(p3.projection.y);

        if (y1i === y3i) {
            return;
        }

        const dXdYV1V3: number = (p3.projection.y - p1.projection.y) > 0 ? (p3.projection.x - p1.projection.x) / (p3.projection.y - p1.projection.y) : 0;
        const dXdYV2V3: number = (p3.projection.y - p2.projection.y) > 0 ? (p3.projection.x - p2.projection.x) / (p3.projection.y - p2.projection.y) : 0;
        const dXdYV1V2: number = (p2.projection.y - p1.projection.y) > 0 ? (p2.projection.x - p1.projection.x) / (p2.projection.y - p1.projection.y) : 0;



        const isRightSideLong: boolean = dXdYV1V3 > dXdYV1V2;

        if (y1i === y2i && p2.projection.x !== p1.projection.x) {
            if (p2.projection.x < p1.projection.x) {
                let correction: number = Math.ceil(p1.projection.y) - p1.projection.y;
                this.rightX = p1.projection.x + correction * dXdYV1V3;
                correction = Math.ceil(p2.projection.y) - p2.projection.y;
                this.leftX = p2.projection.x + correction * dXdYV2V3;
                this.drawSegement(y2i, y3i, dXdYV2V3, dXdYV1V3, color);
            } else {
                let correction: number = Math.ceil(p1.projection.y) - p1.projection.y;
                this.leftX = p1.projection.x + correction * dXdYV1V3;
                correction = Math.ceil(p2.projection.y) - p2.projection.y;
                this.rightX = p2.projection.x + correction * dXdYV2V3;
                this.drawSegement(y2i, y3i, dXdYV1V3, dXdYV2V3, color);
            }
        } else if (isRightSideLong) {
            const correction: number = Math.ceil(p1.projection.y) - p1.projection.y;
            this.rightX = p1.projection.x + correction * dXdYV1V3;
            if (y1i < y2i) {

                this.leftX = p1.projection.x + correction * dXdYV1V2;

                this.drawSegement(y1i, y2i, dXdYV1V2, dXdYV1V3, color);
            }
            if (y2i < y3i) {
                const correction: number = Math.ceil(p2.projection.y) - p2.projection.y;
                this.leftX = p2.projection.x + correction * dXdYV2V3;
                this.drawSegement(y2i, y3i, dXdYV2V3, dXdYV1V3, color);
            }
        } else {
            const correction: number = Math.ceil(p1.projection.y) - p1.projection.y;
            this.leftX = p1.projection.x + correction * dXdYV1V3;
            if (y1i < y2i) {

                this.rightX = p1.projection.x + correction * dXdYV1V2;
                this.drawSegement(y1i, y2i, dXdYV1V3, dXdYV1V2, color);
            }
            if (y2i < y3i) {
                const correction: number = Math.ceil(p2.projection.y) - p2.projection.y;
                this.rightX = p2.projection.x + correction * dXdYV2V3;
                this.drawSegement(y2i, y3i, dXdYV1V3, dXdYV2V3, color);
            }
        }
    }

    private drawSegement(
        yStart: number,
        yEnd: number,
        leftdXdY: number,
        rightdXdY: number, color: number): void {
        for (let i: number = yStart; i < yEnd; i++) {
            const x1: number = Math.ceil(this.leftX);
            const x2: number = Math.ceil(this.rightX);
            let index: number = 320 * i + x1;
            for (let x: number = x1; x < x2; x++) {
                this.framebuffer.framebuffer[index++] = color;
            }

            this.leftX += leftdXdY;
            this.rightX += rightdXdY;
        }
    }

    private drawVertex(v: Vertex): void {
        this.framebuffer.drawPixel(
            Math.ceil(v.projection.x),
            Math.ceil(v.projection.y),
            Color.GREEN.toPackedFormat()
        );
    }

}
