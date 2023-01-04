import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractScannlineTriangleRasterizer } from './AbstractScanlineTriangleRasterizer';
import { ColorInterpolator } from './ColorInterpolator';
import { SlopeInterpolator } from './SlopeInterpolator';

export class GouraudShadingTriangleRasterizer extends AbstractScannlineTriangleRasterizer {


    private colorInterpolator1: ColorInterpolator = new ColorInterpolator();
    private colorInterpolator2: ColorInterpolator = new ColorInterpolator();
    private colorInterpolator3: ColorInterpolator = new ColorInterpolator();
    private rowColorInterpolator: ColorInterpolator = new ColorInterpolator();
    private leftSlope: SlopeInterpolator = new SlopeInterpolator();
    private rightSlope: SlopeInterpolator = new SlopeInterpolator();

    constructor(private framebuffer: Framebuffer) {
        super();
    }

    protected fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
        this.leftSlope.setup(v1, v2);
        this.rightSlope.setup(v1, v3);
        this.colorInterpolator1.setup(v1.color, v2.color, this.leftSlope.yDistance);
        this.colorInterpolator2.setup(v1.color, v3.color, this.rightSlope.yDistance);
        this.drawSpan(framebuffer, this.leftSlope, this.colorInterpolator1, this.colorInterpolator2, this.leftSlope, this.rightSlope);

        this.leftSlope.setup(v2, v3);
        this.colorInterpolator3.setup(v2.color, v3.color, this.leftSlope.yDistance);
        this.drawSpan(framebuffer, this.leftSlope, this.colorInterpolator3, this.colorInterpolator2,this.leftSlope, this.rightSlope);
    }

    protected fillLongLeftTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
        this.leftSlope.setup(v1, v3);
        this.rightSlope.setup(v1, v2);
        this.colorInterpolator2.setup(v1.color, v2.color, this.rightSlope.yDistance);
        this.colorInterpolator1.setup(v1.color, v3.color, this.leftSlope.yDistance);
        this.drawSpan(framebuffer, this.rightSlope, this.colorInterpolator1, this.colorInterpolator2,this.leftSlope, this.rightSlope);

        this.rightSlope.setup(v2, v3);
        this.colorInterpolator3.setup(v2.color, v3.color, this.rightSlope.yDistance);
        this.drawSpan(framebuffer, this.rightSlope, this.colorInterpolator1, this.colorInterpolator3,this.leftSlope, this.rightSlope);
    }

    drawSpan(framebuffer: Framebuffer, shortSlope: SlopeInterpolator, colorInterpolator1: ColorInterpolator, colorInterpolator2: ColorInterpolator,
        leftSlope: SlopeInterpolator, rightSlope: SlopeInterpolator) {
        
        let yPosition = shortSlope.yStart;
        for (let i = 0; i < shortSlope.yDistance; i++) {
            const length = Math.round(rightSlope.currentX) - Math.round(leftSlope.currentX);
            this.rowColorInterpolator.setup(colorInterpolator1.startColor, colorInterpolator2.startColor, length);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(leftSlope.currentX);
            const spanzStep = (rightSlope.currentZ - leftSlope.currentZ) / length;
            let wStart = leftSlope.currentZ;
            for (let j = 0; j < length; j++) {
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;
                    framebuffer.framebuffer[framebufferIndex] = this.rowColorInterpolator.startColor.toPackedFormat();
                }
                framebufferIndex++;
                wStart += spanzStep;
                this.rowColorInterpolator.advance();
            }

            leftSlope.advance()
            rightSlope.advance();
           
            colorInterpolator1.advance();
            colorInterpolator2.advance();

            yPosition++;
        }
    }

}
