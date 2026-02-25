import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractTriangleRasterizer } from './AbstractTriangleRasterizer';

export class SubPixelTriangleRasterizer extends AbstractTriangleRasterizer {

    constructor(private framebuffer: Framebuffer) {
        super();
    }

    // returns true if vertices are in counterclockwise order
    isCcw(v0, v1, v2) {
        return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
    }

    cross(a, b, c) {
        return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
    }

    // https://kitsunegames.com/assets/software-3d-rendering-in-javascript-pt2/result/
    public fillTriangle(framebuffer: Framebuffer, v0: Vertex, v1: Vertex, v2: Vertex) {

        if (this.isCcw(v0.projection, v1.projection, v2.projection)) {
            return;
        }

        const minX = Math.max(0, Math.floor(Math.min(v0.projection.x, v1.projection.x, v2.projection.x)));
        const maxX = Math.min(framebuffer.width, Math.ceil(Math.max(v0.projection.x, v1.projection.x, v2.projection.x)));
        const minY = Math.max(0, Math.floor(Math.min(v0.projection.y, v1.projection.y, v2.projection.y)));
        const maxY = Math.min(framebuffer.height, Math.ceil(Math.max(v0.projection.y, v1.projection.y, v2.projection.y)));

        // precalculate the area of the parallelogram defined by our triangle
        const area = this.cross(v0.projection, v1.projection, v2.projection);
        // precompute reciprocal so we multiply instead of divide per pixel
        const invArea = 1 / area;

        // hoist projection and color reads out of the loop
        const v0p = v0.projection, v1p = v1.projection, v2p = v2.projection;
        const v0r = v0.color.r, v0g = v0.color.g, v0b = v0.color.b, v0a = v0.color.a;
        const v1r = v1.color.r, v1g = v1.color.g, v1b = v1.color.b, v1a = v1.color.a;
        const v2r = v2.color.r, v2g = v2.color.g, v2b = v2.color.b, v2a = v2.color.a;

        // calculate which edges are right edges so we can easily skip them
        // right edges go up, or (bottom edges) are horizontal edges that go right
        const e0x = v2p.x - v1p.x, e0y = v2p.y - v1p.y;
        const e1x = v0p.x - v2p.x, e1y = v0p.y - v2p.y;
        const e2x = v1p.x - v0p.x, e2y = v1p.y - v0p.y;
        const edgeRight0 = e0y < 0 || (e0y === 0 && e0x > 0);
        const edgeRight1 = e1y < 0 || (e1y === 0 && e1x > 0);
        const edgeRight2 = e2y < 0 || (e2y === 0 && e2x > 0);

        // incremental barycentric step deltas (step size = 0.5 to match loop increment)
        // cross(a,b,p) is linear in p, so Δw per step = (b.y-a.y)*Δx or -(b.x-a.x)*Δy
        const dw0dx = (v2p.y - v1p.y) * 0.5, dw0dy = -(v2p.x - v1p.x) * 0.5;
        const dw1dx = (v0p.y - v2p.y) * 0.5, dw1dy = -(v0p.x - v2p.x) * 0.5;
        const dw2dx = (v1p.y - v0p.y) * 0.5, dw2dy = -(v1p.x - v0p.x) * 0.5;

        // if a sample's weight exceeds this threshold, all 4 surrounding integer-pixel
        // neighbors are also inside the triangle — no blending needed
        const thresh0 = Math.abs(dw0dx) + Math.abs(dw0dy);
        const thresh1 = Math.abs(dw1dx) + Math.abs(dw1dy);
        const thresh2 = Math.abs(dw2dx) + Math.abs(dw2dy);

        // compute starting barycentric weights at the first sample point (minX+0.5, minY+0.5)
        // inlined to avoid allocating a temporary object per triangle
        const psx = minX + 0.5, psy = minY + 0.5;
        let w0Row = (v2p.x - v1p.x) * -(psy - v1p.y) - -(v2p.y - v1p.y) * (psx - v1p.x);
        let w1Row = (v0p.x - v2p.x) * -(psy - v2p.y) - -(v0p.y - v2p.y) * (psx - v2p.x);
        let w2Row = (v1p.x - v0p.x) * -(psy - v0p.y) - -(v1p.y - v0p.y) * (psx - v0p.x);

        for (let iy = 0, y = minY; y < maxY; iy++, y += 0.5) {
            const yIsInt = (iy & 1) === 0;
            let w0 = w0Row;
            let w1 = w1Row;
            let w2 = w2Row;

            for (let ix = 0, x = minX; x < maxX; ix++, x += 0.5) {
                const xIsInt = (ix & 1) === 0;

                // if the point is inside the triangle and not on a right/bottom edge
                if (w0 >= 0 && w1 >= 0 && w2 >= 0 &&
                    !((w0 === 0 && edgeRight0) || (w1 === 0 && edgeRight1) || (w2 === 0 && edgeRight2))) {

                    // interior: all 4 surrounding integer pixels are also inside — no blending needed
                    const interior = w0 > thresh0 && w1 > thresh1 && w2 > thresh2;

                    // interior sub-pixel samples are skipped — integer-position writes cover them fully
                    if (!interior || (xIsInt && yIsInt)) {
                        const r = (w0 * v0r + w1 * v1r + w2 * v2r) * invArea;
                        const g = (w0 * v0g + w1 * v1g + w2 * v2g) * invArea;
                        const b = (w0 * v0b + w1 * v1b + w2 * v2b) * invArea;
                        const a = (w0 * v0a + w1 * v1a + w2 * v2a) * invArea;
                        const packed = (r | 0) | ((g | 0) << 8) | ((b | 0) << 16) | ((a | 0) << 24);

                        if (interior) {
                            framebuffer.drawPixel(x, y, packed);
                        } else {
                            framebuffer.drawPixelAntiAliasedSpacial(x, y, packed);
                        }
                    }
                }

                w0 += dw0dx;
                w1 += dw1dx;
                w2 += dw2dx;
            }

            // step row weights down by one y-step
            w0Row += dw0dy;
            w1Row += dw1dy;
            w2Row += dw2dy;
        }
    }

    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {
        this.fillTriangle(framebuffer, p1, p2, p3);
        // this.drawTriangleDDAOriginal(framebuffer, p1, p2, p3);
    }

}
