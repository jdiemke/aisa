import { Framebuffer } from '../Framebuffer';
import { AbstractRenderingPipeline } from '../rendering-pipelines/AbstractRenderingPipeline';
import { Vertex } from '../Vertex';
import { AbstractScannlineTriangleRasterizer } from './AbstractScanlineTriangleRasterizer';

export class TexturedAlphaBlendingTriangleRasterizer extends AbstractScannlineTriangleRasterizer {

    

    // requires
    // bob und wbuffer
    constructor(private framebuffer: Framebuffer, private pipeline: AbstractRenderingPipeline) { 
        super();
    }


    protected fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
        let yDistanceLeft = v2.projection.y - v1.projection.y;




        const yDistanceRight = v3.projection.y - v1.projection.y;

        let slope1 = (v2.projection.x - v1.projection.x) / yDistanceLeft;
        const slope2 = (v3.projection.x - v1.projection.x) / yDistanceRight;

        let tslope1u = (v2.textureCoordinate.u / v2.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceLeft;
        const tslope2u = (v3.textureCoordinate.u / v3.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceRight;

        let tslope1v = (v2.textureCoordinate.v / v2.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceLeft;
        const tslope2v = (v3.textureCoordinate.v / v3.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceRight;

        let zslope1 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceLeft;
        const zslope2 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceRight;

        let curz1 = 1.0 / v1.projection.z;
        let curz2 = 1.0 / v1.projection.z;

        let curu1 = v1.textureCoordinate.u / v1.projection.z;
        let curv1 = v1.textureCoordinate.v / v1.projection.z;
        let curu2 = v1.textureCoordinate.u / v1.projection.z;
        let curv2 = v1.textureCoordinate.v / v1.projection.z;

        let xPosition = v1.projection.x;
        let xPosition2 = v1.projection.x;
        let yPosition = v1.projection.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * this.framebuffer.width + Math.round(xPosition)
            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                const currentColor = this.framebuffer.framebuffer[framebufferIndex];
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;

                    const u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    const v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    const color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    // TODO: move out of loops!
                    const alpha = this.pipeline.alpha * (color2 >> 24 & 0xff) / 255;
                    const inverseAlpha = 1 - alpha;


                    const r = (currentColor >> 0 & 0xff) * inverseAlpha + (color2 >> 0 & 0xff) * alpha;
                    const g = (currentColor >> 8 & 0xff) * inverseAlpha + (color2 >> 8 & 0xff) * alpha;
                    const b = (currentColor >> 16 & 0xff) * inverseAlpha + (color2 >> 16 & 0xff) * alpha;

                    this.framebuffer.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);

                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }


        yDistanceLeft = v3.projection.y - v2.projection.y;

        if (yDistanceLeft === 0) {
            return;
        }

        slope1 = (v3.projection.x - v2.projection.x) / yDistanceLeft;
        zslope1 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceLeft;
        tslope1u = (v3.textureCoordinate.u / v3.projection.z - v2.textureCoordinate.u / v2.projection.z) / yDistanceLeft;
        tslope1v = (v3.textureCoordinate.v / v3.projection.z - v2.textureCoordinate.v / v2.projection.z) / yDistanceLeft;

        curz1 = 1.0 / v2.projection.z;
        curu1 = v2.textureCoordinate.u / v2.projection.z;
        curv1 = v2.textureCoordinate.v / v2.projection.z;
        xPosition = v2.projection.x;
        yPosition = v2.projection.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * this.framebuffer.width + Math.round(xPosition)

            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;

                    const z = 1 / wStart;


                    const u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    const v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    const color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    const alpha = this.pipeline.alpha * (color2 >> 24 & 0xff) / 255;
                    const inverseAlpha = 1 - alpha;


                    const r = (this.framebuffer.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (color2 >> 0 & 0xff) * alpha;
                    const g = (this.framebuffer.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (color2 >> 8 & 0xff) * alpha;
                    const b = (this.framebuffer.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (color2 >> 16 & 0xff) * alpha;

                    this.framebuffer.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;



            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }


    protected fillLongLeftTriangle(framebuffer: Framebuffer,  v1: Vertex, v2: Vertex, v3: Vertex): void {

        let yDistanceRight = v2.projection.y - v1.projection.y;
        const yDistanceLeft = v3.projection.y - v1.projection.y;

        let slope2 = (v2.projection.x - v1.projection.x) / yDistanceRight;
        const slope1 = (v3.projection.x - v1.projection.x) / yDistanceLeft;

        const tslope1u = (v3.textureCoordinate.u / v3.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceLeft;
        let tslope2u = (v2.textureCoordinate.u / v2.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceRight;

        const tslope1v = (v3.textureCoordinate.v / v3.projection.z - v1.textureCoordinate.v  / v1.projection.z) / yDistanceLeft;
        let tslope2v = (v2.textureCoordinate.v  / v2.projection.z - v1.textureCoordinate.v  / v1.projection.z) / yDistanceRight;


        let zslope2 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceRight;
        const zslope1 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceLeft;

        let curz1 = 1.0 / v1.projection.z;
        let curz2 = 1.0 / v1.projection.z;

        let curu1 = v1.textureCoordinate.u / v1.projection.z;
        let curv1 = v1.textureCoordinate.v / v1.projection.z;
        let curu2 = v1.textureCoordinate.u / v1.projection.z;
        let curv2 = v1.textureCoordinate.v / v1.projection.z;

        let xPosition = v1.projection.x;
        let xPosition2 = v1.projection.x;
        let yPosition = v1.projection.y;

        for (let i = 0; i < yDistanceRight; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * this.framebuffer.width + Math.round(xPosition)
            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;


                    const u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    const v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    const color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    const alpha = this.pipeline.alpha * (color2 >> 24 & 0xff) / 255;
                    const inverseAlpha = 1 - alpha;


                    const r = (this.framebuffer.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (color2 >> 0 & 0xff) * alpha;
                    const g = (this.framebuffer.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (color2 >> 8 & 0xff) * alpha;
                    const b = (this.framebuffer.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (color2 >> 16 & 0xff) * alpha;

                    this.framebuffer.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;


            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }

        yDistanceRight = v3.projection.y - v2.projection.y;
        slope2 = (v3.projection.x - v2.projection.x) / yDistanceRight;
        zslope2 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceRight;

        tslope2u = (v3.textureCoordinate.u / v3.projection.z - v2.textureCoordinate.u / v2.projection.z) / yDistanceRight;
        tslope2v = (v3.textureCoordinate.v / v3.projection.z - v2.textureCoordinate.v / v2.projection.z) / yDistanceRight;

        curz2 = 1.0 / v2.projection.z;

        curu2 = v2.textureCoordinate.u / v2.projection.z;
        curv2 = v2.textureCoordinate.v / v2.projection.z;

        xPosition2 = v2.projection.x;
        yPosition = v2.projection.y;

        for (let i = 0; i < yDistanceRight; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * this.framebuffer.width + Math.round(xPosition)


            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;

                    const u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    const v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    const color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    const alpha = this.pipeline.alpha * (color2 >> 24 & 0xff) / 255;
                    const inverseAlpha = 1 - alpha;


                    const r = (this.framebuffer.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (color2 >> 0 & 0xff) * alpha;
                    const g = (this.framebuffer.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (color2 >> 8 & 0xff) * alpha;
                    const b = (this.framebuffer.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (color2 >> 16 & 0xff) * alpha;

                    this.framebuffer.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }

}
