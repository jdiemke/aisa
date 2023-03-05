import { Framebuffer } from '../Framebuffer';
import { Vector3f } from '../math/Vector3f';
import { Vector4f } from '../math/Vector4f';
import { Vertex } from '../Vertex';
import { AbstractScannlineTriangleRasterizer } from './AbstractScanlineTriangleRasterizer';

export class TexturedTriangleRasterizer extends AbstractScannlineTriangleRasterizer{

    // requires
    // bob und wbuffer
    constructor(private framebuffer: Framebuffer) {
        super();
    }

    protected fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {

        // left slope
        let yDistanceLeft = v2.projection.y - v1.projection.y;
        let slope1 = (v2.projection.x - v1.projection.x) / yDistanceLeft;
        let tslope1u = (v2.textureCoordinate.u / v2.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceLeft;
        let tslope1v = (v2.textureCoordinate.v / v2.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceLeft;
        let zslope1 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceLeft;
        let curz1 = 1.0 / v1.projection.z;
        let curu1 = v1.textureCoordinate.u / v1.projection.z;
        let curv1 = v1.textureCoordinate.v / v1.projection.z;
        let xPosition = v1.projection.x;

        // right slope
        const yDistanceRight = v3.projection.y - v1.projection.y;
        const slope2 = (v3.projection.x - v1.projection.x) / yDistanceRight;
        const tslope2u = (v3.textureCoordinate.u / v3.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceRight;
        const tslope2v = (v3.textureCoordinate.v / v3.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceRight;
        const zslope2 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceRight;
        let curz2 = 1.0 / v1.projection.z;
        let curu2 = v1.textureCoordinate.u / v1.projection.z;
        let curv2 = v1.textureCoordinate.v / v1.projection.z;
        let xPosition2 = v1.projection.x;

        let yPosition = v1.projection.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            const length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)
            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;

                    let u = Math.max(Math.min((uStart * z * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];


                    u = uStart * z * (framebuffer.bob.width-1);
                    v = vStart * z * (framebuffer.bob.height-1);

                   color2 = framebuffer.bob.getBilinearFilteredPixelRasterizer(u,v);

                    framebuffer.framebuffer[framebufferIndex] = color2;

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
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)

            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;

                    const z = 1 / wStart;


                    let u = Math.max(Math.min((uStart * z * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];

                    u = uStart * z * (framebuffer.bob.width-1);
                    v = vStart * z * (framebuffer.bob.height-1);

                   color2 = framebuffer.bob.getBilinearFilteredPixelRasterizer(u,v);

                    framebuffer.framebuffer[framebufferIndex] = color2;
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

    protected fillLongLeftTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {

        let yDistanceRight = v2.projection.y - v1.projection.y;
        const yDistanceLeft = v3.projection.y - v1.projection.y;

        let slope2 = (v2.projection.x - v1.projection.x) / yDistanceRight;
        const slope1 = (v3.projection.x - v1.projection.x) / yDistanceLeft;

        const tslope1u = (v3.textureCoordinate.u / v3.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceLeft;
        let tslope2u = (v2.textureCoordinate.u / v2.projection.z - v1.textureCoordinate.u / v1.projection.z) / yDistanceRight;

        const tslope1v = (v3.textureCoordinate.v / v3.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceLeft;
        let tslope2v = (v2.textureCoordinate.v / v2.projection.z - v1.textureCoordinate.v / v1.projection.z) / yDistanceRight;


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
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)
            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;


                    let u = Math.max(Math.min((uStart * z * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];



                    u = uStart * z * (framebuffer.bob.width-1);
                    v = vStart * z * (framebuffer.bob.height-1);

                   color2 = framebuffer.bob.getBilinearFilteredPixelRasterizer(u,v);

                    framebuffer.framebuffer[framebufferIndex] = color2;
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
            let framebufferIndex = Math.round(yPosition) * framebuffer.width + Math.round(xPosition)


            const spanzStep = (curz2 - curz1) / length;
            const spanuStep = (curu2 - curu1) / length;
            const spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < framebuffer.wBuffer[framebufferIndex]) {
                    framebuffer.wBuffer[framebufferIndex] = wStart;
                    const z = 1 / wStart;

                    let u = Math.max(Math.min((uStart * z * framebuffer.bob.width), framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * framebuffer.bob.height), framebuffer.bob.height - 1), 0) | 0;
                    let color2 = framebuffer.bob.texture[u + v * framebuffer.bob.width];

                    u = uStart * z * (framebuffer.bob.width-1);
                    v = vStart * z * (framebuffer.bob.height-1);

                   color2 = framebuffer.bob.getBilinearFilteredPixelRasterizer(u,v);

                    framebuffer.framebuffer[framebufferIndex] = color2;
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
