import { Color } from '../core/Color';
import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractTriangleRasterizer } from './AbstractTriangleRasterizer';

export class SubPixelTriangleRasterizer extends AbstractTriangleRasterizer {

    // create depth buffer
    // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
    private depthBuffer;

    constructor(private framebuffer: Framebuffer) {
        super();
        this.depthBuffer = new Uint16Array(this.framebuffer.width * this.framebuffer.height)
        // add some properties and methods to make using this easier
        this.depthBuffer.width = this.framebuffer.width;
        this.depthBuffer.height = this.framebuffer.height;
        this.depthBuffer.clear = function () { this.fill(65535); };
        this.depthBuffer.getDepth = function (x, y) { return this[y * this.width + x] / 65535.0; };
        this.depthBuffer.setDepth = function (x, y, v) { this[y * this.width + x] = (v * 65535) | 0; };
        this.depthBuffer.testDepth = function (x, y, v) {
            const value = (v * 65535) | 0;
            if (value < 0 || value > 65535) {
                return false;
            }
            const index = y * this.width + x;
            if (value < this[index]) {
                this[index] = value;
                return true;
            }
            return false;
        };
        this.depthBuffer.clear();
    }

    // returns true if vertices are in counterclockwise order
    isCcw(v0, v1, v2) {
        return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
    }

    cross(a, b, c) {
        return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
    }

    // https://kitsunegames.com/assets/software-3d-rendering-in-javascript-pt2/result/
    public fillTriangle(v0: Vertex, v1: Vertex, v2: Vertex) {

        if (this.isCcw(v0.projection, v1.projection, v2.projection)) {
            return;
        }

        const minX = Math.floor(Math.min(v0.projection.x, v1.projection.x, v2.projection.x));
        const maxX = Math.ceil(Math.max(v0.projection.x, v1.projection.x, v2.projection.x));
        const minY = Math.floor(Math.min(v0.projection.y, v1.projection.y, v2.projection.y));
        const maxY = Math.ceil(Math.max(v0.projection.y, v1.projection.y, v2.projection.y));

        // precalculate the area of the parallelogram defined by our triangle
        const area = this.cross(v0.projection, v1.projection, v2.projection);

        // calculate edges
        const edge0 = { x: v2.projection.x - v1.projection.x, y: v2.projection.y - v1.projection.y };
        const edge1 = { x: v0.projection.x - v2.projection.x, y: v0.projection.y - v2.projection.y };
        const edge2 = { x: v1.projection.x - v0.projection.x, y: v1.projection.y - v0.projection.y };

        // calculate which edges are right edges so we can easily skip them
        // right edges go up, or (bottom edges) are horizontal edges that go right
        const edgeRight0 = edge0.y < 0 || (edge0.y === 0 && edge0.x > 0);
        const edgeRight1 = edge1.y < 0 || (edge1.y === 0 && edge0.x > 0);
        const edgeRight2 = edge2.y < 0 || (edge2.y === 0 && edge0.x > 0);

        // p is our 2D pixel location point
        const p = { x: null, y: null };

        // fragment is the resulting pixel with all the vertex attributes interpolated
        const fragment = {
            r: undefined,
            g: undefined,
            b: undefined,
            a: undefined,
            z: 0
        };

        for (let y = minY; y < maxY; y += .5) {
            for (let x = minX; x < maxX; x += .5) {
                // sample from the center of the pixel, not the top-left corner
                p.x = x + 0.5; p.y = y + .5;

                // calculate vertex weights
                // should divide these by area, but we do that later
                // so we divide once, not three times
                const w0 = this.cross(v1.projection, v2.projection, p);
                const w1 = this.cross(v2.projection, v0.projection, p);
                const w2 = this.cross(v0.projection, v1.projection, p);

                // if the point is not inside our polygon, skip fragment
                if (w0 < 0 || w1 < 0 || w2 < 0) {
                    continue;
                }

                // if this is a right or bottom edge, skip fragment (top-left rule):
                if ((w0 === 0 && edgeRight0) || (w1 === 0 && edgeRight1) || (w2 === 0 && edgeRight2)) {
                    continue;
                }

                // interpolate our vertices
                fragment.r = (w0 * v0.color.r + w1 * v1.color.r + w2 * v2.color.r) / area;
                fragment.g = (w0 * v0.color.g + w1 * v1.color.g + w2 * v2.color.g) / area;
                fragment.b = (w0 * v0.color.b + w1 * v1.color.b + w2 * v2.color.b) / area;
                fragment.a = (w0 * v0.projection.x + w1 * v1.projection.x + w2 * v2.projection.x) / area;
                fragment.z = (w0 * v0.projection.z + w1 * v1.projection.z + w2 * v2.projection.z) / area;

                const fragColor = new Color(
                    fragment.r, fragment.g, fragment.b, fragment.a
                )

                // this can be optimized to only draw aliased pixels on the edges

                // if (this.depthBuffer.testDepth(x, y, fragment.z)) {
                this.framebuffer.drawPixelAntiAliasedSpacial(x, y, fragColor.toPackedFormat());
                // }

            }
        }
    }

    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {
        this.fillTriangle(p1, p2, p3);
        // this.drawTriangleDDAOriginal(framebuffer, p1, p2, p3);
    }

}
