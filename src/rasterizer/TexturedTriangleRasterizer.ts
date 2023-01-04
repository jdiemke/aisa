import { Framebuffer } from '../Framebuffer';
import { Vector3f } from '../math/Vector3f';
import { Vector4f } from '../math/Vector4f';
import { Vertex } from '../Vertex';

export class TexturedTriangleRasterizer {

    private temp: Vertex = null;

    // requires
    // bob und wbuffer
    constructor(private framebuffer: Framebuffer) { }

    public drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {

        if (p1.position.y > p3.position.y) {
            this.temp = p1;
            p1 = p3;
            p3 = this.temp;
        }

        if (p1.position.y > p2.position.y) {
            this.temp = p1;
            p1 = p2;
            p2 = this.temp;
        }

        if (p2.position.y > p3.position.y) {
            this.temp = p2;
            p2 = p3;
            p3 = this.temp;
        }

        if (p1.position.y === p3.position.y) {
            return;
        } else {
            const x: number = (p3.position.x - p1.position.x) * (p2.position.y - p1.position.y) /
                (p3.position.y - p1.position.y) + p1.position.x;
            if (x > p2.position.x) {
                this.fillLongRightTriangle2(framebuffer, p1, p2, p3);
            } else {
                this.fillLongLeftTriangle2(framebuffer,p1,p2,p3);
            }
        }
    }

    private fillLongRightTriangle2(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {
       
        // left slope
        let yDistanceLeft = v2.position.y - v1.position.y;
        let slope1 = (v2.position.x - v1.position.x) / yDistanceLeft;
        let tslope1u = (v2.textureCoordinate.u / v2.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceLeft;
        let tslope1v = (v2.textureCoordinate.v / v2.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceLeft;
        let zslope1 = (1 / v2.position.z - 1 / v1.position.z) / yDistanceLeft;
        let curz1 = 1.0 / v1.position.z;
        let curu1 = v1.textureCoordinate.u / v1.position.z;
        let curv1 = v1.textureCoordinate.v / v1.position.z;
        let xPosition = v1.position.x;

        // right slope
        const yDistanceRight = v3.position.y - v1.position.y;
        const slope2 = (v3.position.x - v1.position.x) / yDistanceRight;
        const tslope2u = (v3.textureCoordinate.u / v3.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceRight;
        const tslope2v = (v3.textureCoordinate.v / v3.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceRight;
        const zslope2 = (1 / v3.position.z - 1 / v1.position.z) / yDistanceRight;
        let curz2 = 1.0 / v1.position.z;
        let curu2 = v1.textureCoordinate.u / v1.position.z;
        let curv2 = v1.textureCoordinate.v / v1.position.z;
        let xPosition2 = v1.position.x;

        let yPosition = v1.position.y;

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
                    
                
                    u = uStart * z * framebuffer.bob.width;
                    v = vStart * z * framebuffer.bob.height;
                
                   color2 = framebuffer.bob.getBilinearFilteredPixel2(u,v);

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


        yDistanceLeft = v3.position.y - v2.position.y;

        if (yDistanceLeft === 0) {
            return;
        }

        slope1 = (v3.position.x - v2.position.x) / yDistanceLeft;
        zslope1 = (1 / v3.position.z - 1 / v2.position.z) / yDistanceLeft;
        tslope1u = (v3.textureCoordinate.u / v3.position.z - v2.textureCoordinate.u / v2.position.z) / yDistanceLeft;
        tslope1v = (v3.textureCoordinate.v / v3.position.z - v2.textureCoordinate.v / v2.position.z) / yDistanceLeft;

        curz1 = 1.0 / v2.position.z;
        curu1 = v2.textureCoordinate.u / v2.position.z;
        curv1 = v2.textureCoordinate.v / v2.position.z;
        xPosition = v2.position.x;
        yPosition = v2.position.y;

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

                    u = uStart * z * framebuffer.bob.width;
                    v = vStart * z * framebuffer.bob.height;
                
                   color2 = framebuffer.bob.getBilinearFilteredPixel2(u,v);

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

    fillLongLeftTriangle2(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void {

        let yDistanceRight = v2.position.y - v1.position.y;
        const yDistanceLeft = v3.position.y - v1.position.y;

        let slope2 = (v2.position.x - v1.position.x) / yDistanceRight;
        const slope1 = (v3.position.x - v1.position.x) / yDistanceLeft;

        const tslope1u = (v3.textureCoordinate.u / v3.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceLeft;
        let tslope2u = (v2.textureCoordinate.u / v2.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceRight;

        const tslope1v = (v3.textureCoordinate.v / v3.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceLeft;
        let tslope2v = (v2.textureCoordinate.v / v2.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceRight;


        let zslope2 = (1 / v2.position.z - 1 / v1.position.z) / yDistanceRight;
        const zslope1 = (1 / v3.position.z - 1 / v1.position.z) / yDistanceLeft;

        let curz1 = 1.0 / v1.position.z;
        let curz2 = 1.0 / v1.position.z;

        let curu1 = v1.textureCoordinate.u / v1.position.z;
        let curv1 = v1.textureCoordinate.v / v1.position.z;
        let curu2 = v1.textureCoordinate.u / v1.position.z;
        let curv2 = v1.textureCoordinate.v / v1.position.z;

        let xPosition = v1.position.x;
        let xPosition2 = v1.position.x;
        let yPosition = v1.position.y;

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
                   
                   
                    u = uStart * z * framebuffer.bob.width;
                    v = vStart * z * framebuffer.bob.height;
                
                   color2 = framebuffer.bob.getBilinearFilteredPixel2(u,v);

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

        yDistanceRight = v3.position.y - v2.position.y;
        slope2 = (v3.position.x - v2.position.x) / yDistanceRight;
        zslope2 = (1 / v3.position.z - 1 / v2.position.z) / yDistanceRight;

        tslope2u = (v3.textureCoordinate.u / v3.position.z - v2.textureCoordinate.u / v2.position.z) / yDistanceRight;
        tslope2v = (v3.textureCoordinate.v / v3.position.z - v2.textureCoordinate.v / v2.position.z) / yDistanceRight;

        curz2 = 1.0 / v2.position.z;

        curu2 = v2.textureCoordinate.u / v2.position.z;
        curv2 = v2.textureCoordinate.v / v2.position.z;

        xPosition2 = v2.position.x;
        yPosition = v2.position.y;

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

                    u = uStart * z * framebuffer.bob.width;
                    v = vStart * z * framebuffer.bob.height;
                
                   color2 = framebuffer.bob.getBilinearFilteredPixel2(u,v);

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
