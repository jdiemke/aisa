import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractScannlineTriangleRasterizer } from './AbstractScanlineTriangleRasterizer';

export class FlatShadingTriangleRasterizer extends AbstractScannlineTriangleRasterizer {

    private slope1: number;
    private slope2: number;
    private zslope1: number;
    private zslope2: number;
    private curz1: number;
    private curz2: number;
    private xPosition: number;
    private xPosition2: number;
    private yPosition: number;

    constructor(private framebuffer: Framebuffer) {
        super();
    }

    protected fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();

        let yDistanceLeft = v2.projection.y - v1.projection.y;
        const yDistanceRight = v3.projection.y - v1.projection.y;

        this.slope1 = (v2.projection.x - v1.projection.x) / yDistanceLeft;
        this.slope2 = (v3.projection.x - v1.projection.x) / yDistanceRight;

        this.zslope1 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceLeft;
        this.zslope2 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceRight;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v1.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v1.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(framebuffer, yDistanceLeft, color);

        yDistanceLeft = v3.projection.y - v2.projection.y;
        this.slope1 = (v3.projection.x - v2.projection.x) / yDistanceLeft;
        this.zslope1 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceLeft;

        this.xPosition = v2.projection.x;
        this.yPosition = v2.projection.y;

        this.drawSpan(framebuffer, yDistanceLeft, color);
    }

    protected fillLongLeftTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();

        let yDistanceRight = v2.projection.y - v1.projection.y;
        const yDistanceLeft = v3.projection.y - v1.projection.y;

        this.slope2 = (v2.projection.x - v1.projection.x) / yDistanceRight;
        this.slope1 = (v3.projection.x - v1.projection.x) / yDistanceLeft;

        this.zslope2 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceRight;
        this.zslope1 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceLeft;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v1.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v1.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(framebuffer, yDistanceRight, color);

        yDistanceRight = v3.projection.y - v2.projection.y;
        this.slope2 = (v3.projection.x - v2.projection.x) / yDistanceRight;
        this.zslope2 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceRight;

        this.curz2 = 1.0 / v2.projection.z;
        this.xPosition2 = v2.projection.x;
        this.yPosition = v2.projection.y;

        this.drawSpan(framebuffer, yDistanceRight, color);
    }

    drawSpan(framebuffer: Framebuffer, distance: number, color: number) {
        for (let i = 0; i < distance; i++) {
            const length = (this.xPosition2) - (this.xPosition);
            const spanzStep = Math.round(this.curz2 - this.curz1) / length;
            let wStart = this.curz1;
            for (let j = 0; j < length; j++) {
                const framebufferIndex = Math.round(this.yPosition) * framebuffer.width + Math.round(this.xPosition + j);
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;
                    framebuffer.framebuffer[framebufferIndex] = color;
                }
                wStart += spanzStep;
            }
            this.xPosition += this.slope1;
            this.xPosition2 += this.slope2;
            this.yPosition++;
            this.curz1 += this.zslope1;
            this.curz2 += this.zslope2;
        }
    }

}
