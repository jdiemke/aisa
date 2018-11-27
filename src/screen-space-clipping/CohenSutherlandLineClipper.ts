import { Framebuffer } from "../Framebuffer";
import { Vector3f } from "../math/Vector3f";

export class CohenSutherlandLineClipper {

    public static REGION_CODE_CENTER = 0b0000;
    public static REGION_CODE_LEFT = 0b0001;
    public static REGION_CODE_RIGHT = 0b0010;
    public static REGION_CODE_BOTTOM = 0b0100;
    public static REGION_CODE_TOP = 0b1000;

    constructor(private framebuffer: Framebuffer) { }

    public cohenSutherlandLineClipper(start: Vector3f, end: Vector3f, col: number) {
        let p1: Vector3f = new Vector3f(start.x, start.y, start.z);
        let p2: Vector3f = new Vector3f(end.x, end.y, end.z);

        let code1: number = this.computeRegionCode(p1);
        let code2: number = this.computeRegionCode(p2);

        let accept: boolean = false;
        let done: boolean = false;

        while (!done) {

            if (this.isTrivialAccept(code1, code2)) {
                accept = true;
                done = true;
            } else if (this.isTrivialReject(code1, code2)) {
                done = true;
            } else {

                if (code1 == CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    let tempCode: number = code1;
                    code1 = code2;
                    code2 = tempCode;

                    let tempPoint: Vector3f = p1;
                    p1 = p2;
                    p2 = tempPoint;
                }

                if ((code1 & CohenSutherlandLineClipper.REGION_CODE_TOP) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.x = (p1.x + (p2.x - p1.x) * (Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.maxWindow.y;
                } else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_BOTTOM) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.x = (p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.minWindow.y;
                } else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_RIGHT) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.y = (p1.y + (p2.y - p1.y) * (Framebuffer.maxWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer.maxWindow.x;
                } else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_LEFT) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.y = (p1.y + (p2.y - p1.y) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer.minWindow.x;
                }

                code1 = this.computeRegionCode(p1);
            }
        }

        if (accept) {
            this.framebuffer.drawLineDDA(p1, p2, col);
        }
    }

    public isTrivialAccept(code1: number, code2: number): boolean {
        return (code1 | code2) === CohenSutherlandLineClipper.REGION_CODE_CENTER;
    }

    public isTrivialReject(code1: number, code2: number): boolean {
        return (code1 & code2) !== CohenSutherlandLineClipper.REGION_CODE_CENTER;
    }

    public computeRegionCode(point: Vector3f): number {
        let regionCode: number = CohenSutherlandLineClipper.REGION_CODE_CENTER;

        if (point.x < Framebuffer.minWindow.x) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_LEFT;
        } else if (point.x > Framebuffer.maxWindow.x) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_RIGHT;
        }

        if (point.y < Framebuffer.minWindow.y) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_BOTTOM;
        } else if (point.y > Framebuffer.maxWindow.y) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_TOP;
        }

        return regionCode;
    }

}
