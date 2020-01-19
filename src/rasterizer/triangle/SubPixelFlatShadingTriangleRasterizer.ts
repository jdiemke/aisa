import { Framebuffer } from '../../Framebuffer';
import { Vertex } from '../../Vertex';
import { AbstractTriangleRasterizer } from './AbstractTriangleRasterizer';

// http://www.hugi.scene.org/online/coding/hugi%2017%20-%20cotriang.htm
// TODO:
// debug clipper and rasterizer
// https://web.archive.org/web/20160311235624/http://freespace.virgin.net/hugo.elias/graphics/x_lines.htm
// https://web.archive.org/web/20160406022253/http://freespace.virgin.net/hugo.elias/graphics/x_polygo.htm
// https://web.archive.org/web/20160417204209/http://freespace.virgin.net/hugo.elias/graphics/x_stars.htm
// https://web.archive.org/web/20160409195406/http://freespace.virgin.net/hugo.elias/graphics/x_polyph.htm
// https://web.archive.org/web/20160311235629/http://freespace.virgin.net/hugo.elias/graphics/x_polyp2.htm
// https://web.archive.org/web/20160311235808/http://freespace.virgin.net/hugo.elias/graphics/x_polyb2.htm
// https://web.archive.org/web/20160303195040/http://freespace.virgin.net/hugo.elias/graphics/x_polybm.htm
// https://web.archive.org/web/20160311235824/http://freespace.virgin.net/hugo.elias/graphics/x_polyop.htm
// https://github.com/niklasekstrom/blitter-subpixel-line/blob/master/Sub-pixel%20accurate%20rasterization%20of%20polygons%20using%20the%20Amiga%20blitter.pdf
// https://web.archive.org/web/20160310034558/http://freespace.virgin.net/hugo.elias/graphics/x_main.htm
// https://web.archive.org/web/20160408133525/http://freespace.virgin.net/hugo.elias/graphics/x_wuline.htm
// https://web.archive.org/web/20160417165227/http://freespace.virgin.net/hugo.elias/graphics/x_wupixl.htm
// https://web.archive.org/web/20160325025208/http://freespace.virgin.net/hugo.elias/graphics/x_polysc.htm
// http://www.hugi.scene.org/online/coding/hugi%2017%20-%20cotriang.htm
// http://www.hugi.scene.org/online/coding/hugi%20se%204%20-%20index%20sorted%20by%20topic.htm
// http://www.flipcode.com/archives/High_Speed_Software_Rendering.shtml
// https://dokumen.tips/documents/cs602-computer-graphics-pdf-handouts-virtual-university.html
// http://www-users.mat.uni.torun.pl/~wrona/3d_tutor/tri_fillers.html
// https://www.coursehero.com/file/23655884/Lecture-22/
// https://www.coursehero.com/file/pqood7/The-idea-of-sub-pixel-accuracy-is-to-pre-step-the-x-coordinate-of-each-of-the/
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
        let temp: Vertex;

        if (p1.projection.y > p2.projection.y) {
            temp = p1;
            p1 = p2;
            p2 = temp;
        }

        if (p1.projection.y > p3.projection.y) {
            temp = p1;
            p1 = p3;
            p3 = temp;
        }

        if (p2.projection.y > p3.projection.y) {
            temp = p2;
            p2 = p3;
            p3 = temp;
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

}
