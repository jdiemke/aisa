import { Color } from '../core/Color';
import { Utils } from '../core/Utils';
import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';
import { AbstractTriangleRasterizer } from './AbstractTriangleRasterizer';

export class FlatShadingTriangleRasterizer extends AbstractTriangleRasterizer {

    private temp: Vertex = null;
    private slope1: number;
    private slope2: number;
    private zslope1: number;
    private zslope2: number;
    private curz1: number;
    private curz2: number;
    private xPosition: number;
    private xPosition2: number;
    private yPosition: number;

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
    public fillTriangle(v0, v1, v2, color: Color) {

        if (this.isCcw(v0, v1, v2)) {
            return;
        }

        const minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
        const maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
        const minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
        const maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));

        // precalculate the area of the parallelogram defined by our triangle
        const area = this.cross(v0, v1, v2);

        // calculate edges
        const edge0 = { x: v2.x - v1.x, y: v2.y - v1.y };
        const edge1 = { x: v0.x - v2.x, y: v0.y - v2.y };
        const edge2 = { x: v1.x - v0.x, y: v1.y - v0.y };

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
            z: null
        };

        for (let y = minY; y < maxY; y += .5) {
            for (let x = minX; x < maxX; x += .5) {
                // sample from the center of the pixel, not the top-left corner
                p.x = x + 0.5; p.y = y + .5;

                // calculate vertex weights
                // should divide these by area, but we do that later
                // so we divide once, not three times
                const w0 = this.cross(v1, v2, p);
                const w1 = this.cross(v2, v0, p);
                const w2 = this.cross(v0, v1, p);

                // if the point is not inside our polygon, skip fragment
                if (w0 < 0 || w1 < 0 || w2 < 0) {
                    continue;
                }

                // if this is a right or bottom edge, skip fragment (top-left rule):
                if ((w0 === 0 && edgeRight0) || (w1 === 0 && edgeRight1) || (w2 === 0 && edgeRight2)) {
                    continue;
                }

                // interpolate our vertices
                fragment.r = (w0 * v0.r + w1 * v1.r + w2 * v2.r) / area;
                fragment.g = (w0 * v0.g + w1 * v1.g + w2 * v2.g) / area;
                fragment.b = (w0 * v0.b + w1 * v1.b + w2 * v2.b) / area;
                fragment.a = (w0 * v0.x + w1 * v1.x + w2 * v2.x) / area;
                fragment.z = (w0 * v0.z + w1 * v1.z + w2 * v2.z) / area;

                // this can be optimized to only draw aliased pixels on the edges
                this.framebuffer.drawPixelAntiAliasedSpacial(x, y, color.toPackedFormat());
                // this.framebuffer.drawPixelAliased(x, y, color.toPackedFormat());

            }
        }
    }

    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDAOriginal(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {
        if (p1.projection.y > p3.projection.y) {
            this.temp = p1;
            p1 = p3;
            p3 = this.temp;
        }

        if (p1.projection.y > p2.projection.y) {
            this.temp = p1;
            p1 = p2;
            p2 = this.temp;
        }

        if (p2.projection.y > p3.projection.y) {
            this.temp = p2;
            p2 = p3;
            p3 = this.temp;
        }

        if (p1.projection.y === p3.projection.y) {
            return;
        } else if (p2.projection.y === p3.projection.y) {
            if (p2.projection.x > p3.projection.x) {
                this.temp = p2;
                p2 = p3;
                p3 = this.temp;
            }
            this.fillBottomFlatTriangle(p1, p2, p3);
        } else if (p1.projection.y === p2.projection.y) {
            if (p1.projection.x > p2.projection.x) {
                this.temp = p1;
                p1 = p2;
                p2 = this.temp;
            }
            this.fillTopFlatTriangle(p1, p2, p3);
        } else {
            const x: number = (p3.projection.x - p1.projection.x) *
                (p2.projection.y - p1.projection.y) / (p3.projection.y - p1.projection.y) + p1.projection.x;
            if (x > p2.projection.x) {
                this.fillLongRightTriangle(p1, p2, p3);
            } else {
                this.fillLongLeftTriangle(p1, p2, p3);
            }
        }
    }


    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {
        this.fillTriangle(
            { x: p1.projection.x, y: p1.projection.y, z: p1.projection.z },
            { x: p2.projection.x, y: p2.projection.y, z: p2.projection.z },
            { x: p3.projection.x, y: p3.projection.y, z: p3.projection.z }, p1.color)
    }

    private fillBottomFlatTriangle(v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();

        const yDistance: number = v3.projection.y - v1.projection.y;

        this.slope1 = (v2.projection.x - v1.projection.x) / yDistance;
        this.slope2 = (v3.projection.x - v1.projection.x) / yDistance;

        this.zslope1 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistance;
        this.zslope2 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistance;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v1.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v1.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(yDistance, color);
    }

    fillTopFlatTriangle(v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();
        const yDistance = v3.projection.y - v1.projection.y;

        this.slope1 = (v3.projection.x - v1.projection.x) / yDistance;
        this.slope2 = (v3.projection.x - v2.projection.x) / yDistance;

        this.zslope1 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistance;
        this.zslope2 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistance;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v2.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v2.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(yDistance, color);
    }


    fillLongRightTriangle(v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();

        let yDistanceLeft = v2.projection.y - v1.projection.y;
        const yDistanceRight = v3.projection.y - v1.projection.y;

        this.slope1 = (v2.projection.x - v1.projection.x) / yDistanceLeft;
        this.slope2 = (v3.projection.x - v1.projection.x) / yDistanceRight;

        this.zslope1 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceLeft;
        this.zslope2 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceRight;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v1.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v1.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(yDistanceLeft, color);

        yDistanceLeft = v3.projection.y - v2.projection.y;
        this.slope1 = (v3.projection.x - v2.projection.x) / yDistanceLeft;
        this.zslope1 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceLeft;

        this.xPosition = v2.projection.x;
        this.yPosition = v2.projection.y;

        this.drawSpan(yDistanceLeft, color);
    }

    fillLongLeftTriangle(v1: Vertex, v2: Vertex, v3: Vertex): void {
        const color: number = v1.color.toPackedFormat();

        let yDistanceRight = v2.projection.y - v1.projection.y;
        const yDistanceLeft = v3.projection.y - v1.projection.y;

        this.slope2 = (v2.projection.x - v1.projection.x) / yDistanceRight;
        this.slope1 = (v3.projection.x - v1.projection.x) / yDistanceLeft;

        this.zslope2 = (1 / v2.projection.z - 1 / v1.projection.z) / yDistanceRight;
        this.zslope1 = (1 / v3.projection.z - 1 / v1.projection.z) / yDistanceLeft;

        this.curz1 = 1.0 / v1.projection.z;
        this.curz2 = 1.0 / v1.projection.z;

        this.xPosition = v1.projection.x;
        this.xPosition2 = v1.projection.x;
        this.yPosition = v1.projection.y;

        this.drawSpan(yDistanceRight, color);

        yDistanceRight = v3.projection.y - v2.projection.y;
        this.slope2 = (v3.projection.x - v2.projection.x) / yDistanceRight;
        this.zslope2 = (1 / v3.projection.z - 1 / v2.projection.z) / yDistanceRight;

        this.curz2 = 1.0 / v2.projection.z;
        this.xPosition2 = v2.projection.x;
        this.yPosition = v2.projection.y;

        this.drawSpan(yDistanceRight, color);
    }

    drawSpan(distance: number, color: number) {
        for (let i = 0; i < distance; i++) {
            const length = (this.xPosition2) - (this.xPosition);
            const spanzStep = Math.round(this.curz2 - this.curz1) / length;
            let wStart = this.curz1;
            for (let j = 0; j < length; j++) {

                const framebufferIndex = Math.round(this.yPosition) * this.framebuffer.width + Math.round(this.xPosition + j);
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.drawPixelAliased(this.xPosition + j, this.yPosition, color);
                }
                wStart += spanzStep;
            }
            this.xPosition += this.slope1;
            this.xPosition2 += this.slope2;
            this.yPosition++;
            this.curz1 += this.zslope1;
            this.curz2 += this.zslope2;
        }
    }

}
