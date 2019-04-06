import { Framebuffer } from '../Framebuffer';
import { Vector3f } from '../math/Vector3f';
import { Vector4f } from '../math/Vector4f';
import { Vertex } from "../Vertex";

export class TexturedTriangleRasterizer {

    private temp: Vertex = null;

    // requires
    // bob und wbuffer
    constructor(private framebuffer: Framebuffer) { }

    public drawTriangleDDA2(p1: Vertex, p2: Vertex, p3: Vertex): void {

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
                this.fillLongRightTriangle2(p1, p2, p3);
            } else {
                let tex = p1.textureCoordinate;
                let tex2 = p2.textureCoordinate;
                let tex3 = p3.textureCoordinate;

                this.fillLongLeftTriangle2(
                    p1.position,
                    p2.position,
                    p3.position,
                    new Vector3f(tex.u, tex.v, 0),
                    new Vector3f(tex2.u, tex2.v, 0),
                    new Vector3f(tex3.u, tex3.v, 0)
                );
            }
        }
    }

    private fillLongRightTriangle2(v1: Vertex, v2: Vertex, v3: Vertex): void {
        let yDistanceLeft = v2.position.y - v1.position.y;
        let yDistanceRight = v3.position.y - v1.position.y;

        let slope1 = (v2.position.x - v1.position.x) / yDistanceLeft;
        let slope2 = (v3.position.x - v1.position.x) / yDistanceRight;

        let tslope1u = (v2.textureCoordinate.u / v2.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceLeft;
        let tslope2u = (v3.textureCoordinate.u / v3.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceRight;

        let tslope1v = (v2.textureCoordinate.v / v2.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceLeft;
        let tslope2v = (v3.textureCoordinate.v / v3.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceRight;

        let zslope1 = (1 / v2.position.z - 1 / v1.position.z) / yDistanceLeft;
        let zslope2 = (1 / v3.position.z - 1 / v1.position.z) / yDistanceRight;

        let curx1 = v1.position.x;
        let curx2 = v1.position.x;

        let curz1 = 1.0 / v1.position.z;
        let curz2 = 1.0 / v1.position.z;

        let curu1 = v1.textureCoordinate.u / v1.position.z;
        let curv1 = v1.textureCoordinate.v / v1.position.z;
        let curu2 = v1.textureCoordinate.u / v1.position.z;
        let curv2 = v1.textureCoordinate.v / v1.position.z;

        let xPosition = v1.position.x;
        let xPosition2 = v1.position.x;
        let yPosition = v1.position.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;

                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    /** shading code */
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;

                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }

        yDistanceLeft = v3.position.y - v2.position.y;
        slope1 = (v3.position.x - v2.position.x) / yDistanceLeft;
        zslope1 = (1 / v3.position.z - 1 / v2.position.z) / yDistanceLeft;
        tslope1u = (v3.textureCoordinate.u / v3.position.z - v2.textureCoordinate.u / v2.position.z) / yDistanceLeft;
        tslope1v = (v3.textureCoordinate.v / v3.position.z - v2.textureCoordinate.v / v2.position.z) / yDistanceLeft;

        curx1 = v2.position.x;
        curz1 = 1.0 / v2.position.z;
        curu1 = v2.textureCoordinate.u / v2.position.z;
        curv1 = v2.textureCoordinate.v / v2.position.z;
        xPosition = v2.position.x;
        yPosition = v2.position.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)

            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;

                    let z = 1 / wStart;


                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }


    fillLongLeftTriangle2(v1: Vector4f, v2: Vector4f, v3: Vector4f, t1: Vector3f, t2: Vector3f, t3: Vector3f): void {

        let yDistanceRight = v2.y - v1.y;
        let yDistanceLeft = v3.y - v1.y;

        let slope2 = (v2.x - v1.x) / yDistanceRight;
        let slope1 = (v3.x - v1.x) / yDistanceLeft;

        let tslope1u = (t3.x / v3.z - t1.x / v1.z) / yDistanceLeft;
        let tslope2u = (t2.x / v2.z - t1.x / v1.z) / yDistanceRight;

        let tslope1v = (t3.y / v3.z - t1.y / v1.z) / yDistanceLeft;
        let tslope2v = (t2.y / v2.z - t1.y / v1.z) / yDistanceRight;


        let zslope2 = (1 / v2.z - 1 / v1.z) / yDistanceRight;
        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistanceLeft;

        let curx1 = v1.x;
        let curx2 = v1.x;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;

        let curu1 = t1.x / v1.z;
        let curv1 = t1.y / v1.z;
        let curu2 = t1.x / v1.z;
        let curv2 = t1.y / v1.z;

        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;

        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;


                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }

        yDistanceRight = v3.y - v2.y;
        slope2 = (v3.x - v2.x) / yDistanceRight;
        zslope2 = (1 / v3.z - 1 / v2.z) / yDistanceRight;

        tslope2u = (t3.x / v3.z - t2.x / v2.z) / yDistanceRight;
        tslope2v = (t3.y / v3.z - t2.y / v2.z) / yDistanceRight;

        curx2 = v2.x;
        curz2 = 1.0 / v2.z;

        curu2 = t2.x / v2.z;
        curv2 = t2.y / v2.z;

        xPosition2 = v2.x;
        yPosition = v2.y;

        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)


            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;

            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;

                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;

            curu1 += tslope1u;
            curu2 += tslope2u;

            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }

}
