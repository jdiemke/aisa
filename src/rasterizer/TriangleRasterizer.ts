import { Framebuffer } from "../Framebuffer";
import { Vector3f } from "../math/Vector3f";

export class TriangleRasterizer {

    constructor(private framebuffer: Framebuffer) {
        
    }

    
    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     * TODO: rotate around center and check for correctness!!
     */
    public drawTriangleDDA(p1: Vector3f, p2: Vector3f, p3: Vector3f, color: number): void {
        if (p1.y > p3.y) {
            let temp: Vector3f = p1;
            p1 = p3;
            p3 = temp;
        }

        if (p1.y > p2.y) {
            let temp: Vector3f = p1;
            p1 = p2;
            p2 = temp;
        }

        if (p2.y > p3.y) {
            let temp: Vector3f = p2;
            p2 = p3;
            p3 = temp;
        }

        if (p1.y == p3.y) {
            return;
        } else if (p2.y == p3.y) {
            if (p2.x > p3.x) {
                let temp: Vector3f = p2;
                p2 = p3;
                p3 = temp;
            }
            this.fillBottomFlatTriangle(p1, p2, p3, color);
        } else if (p1.y == p2.y) {
            if (p1.x > p2.x) {
                let temp: Vector3f = p1;
                p1 = p2;
                p2 = temp;
            }
            this.fillTopFlatTriangle(p1, p2, p3, color);
        } else {
            let x = (p3.x - p1.x) * (p2.y - p1.y) / (p3.y - p1.y) + p1.x;
            if (x > p2.x) {
                this.fillLongRightTriangle(p1, p2, p3, color);
            } else {
                this.fillLongLeftTriangle(p1, p2, p3, color);
            }
        }
    }


    
    fillBottomFlatTriangle(v1: Vector3f, v2: Vector3f, v3: Vector3f, color: number): void {

        let yDistance = v3.y - v1.y;

        let slope1 = (v2.x - v1.x) / yDistance;
        let slope2 = (v3.x - v1.x) / yDistance;

        let zslope1 = (1 / v2.z - 1 / v1.z) / yDistance;
        let zslope2 = (1 / v3.z - 1 / v1.z) / yDistance;

        let curx1 = v1.x;
        let curx2 = v1.x;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;

        let length = Math.round(yDistance);

        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;

        for (let i = 0; i < yDistance; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }


    fillTopFlatTriangle(v1: Vector3f, v2: Vector3f, v3: Vector3f, color: number): void {
        let yDistance = v3.y - v1.y;
        let slope1 = (v3.x - v1.x) / yDistance;
        let slope2 = (v3.x - v2.x) / yDistance;

        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistance;
        let zslope2 = (1 / v3.z - 1 / v2.z) / yDistance;

        let curx1 = v1.x;
        let curx2 = v2.y;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v2.z;

        let xPosition = v1.x;
        let xPosition2 = v2.x;
        let yPosition = v1.y;

        for (let i = 0; i < yDistance; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            for (let j = 0; j < length; j++) {
                let wStart = (curz2 - curz1) / (length) * j + curz1;
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }

    fillLongRightTriangle(v1: Vector3f, v2: Vector3f, v3: Vector3f, color: number): void {

        let yDistanceLeft = v2.y - v1.y;
        let yDistanceRight = v3.y - v1.y;

        let slope1 = (v2.x - v1.x) / yDistanceLeft;
        let slope2 = (v3.x - v1.x) / yDistanceRight;

        let zslope1 = (1 / v2.z - 1 / v1.z) / yDistanceLeft;
        let zslope2 = (1 / v3.z - 1 / v1.z) / yDistanceRight;

        let curx1 = v1.x;
        let curx2 = v1.x;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;

        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }

        yDistanceLeft = v3.y - v2.y;
        slope1 = (v3.x - v2.x) / yDistanceLeft;
        zslope1 = (1 / v3.z - 1 / v2.z) / yDistanceLeft;
        curx1 = v2.x;
        curz1 = 1.0 / v2.z;
        xPosition = v2.x;
        yPosition = v2.y;

        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }


    fillLongLeftTriangle(v1: Vector3f, v2: Vector3f, v3: Vector3f, color: number): void {

        let yDistanceRight = v2.y - v1.y;
        let yDistanceLeft = v3.y - v1.y;

        let slope2 = (v2.x - v1.x) / yDistanceRight;
        let slope1 = (v3.x - v1.x) / yDistanceLeft;

        let zslope2 = (1 / v2.z - 1 / v1.z) / yDistanceRight;
        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistanceLeft;

        let curx1 = v1.x;
        let curx2 = v1.x;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;

        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;

        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }

        yDistanceRight = v3.y - v2.y;
        slope2 = (v3.x - v2.x) / yDistanceRight;
        zslope2 = (1 / v3.z - 1 / v2.z) / yDistanceRight;
        curx2 = v2.x;
        curz2 = 1.0 / v2.z;
        xPosition2 = v2.x;
        yPosition = v2.y;

        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }

            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }

}
