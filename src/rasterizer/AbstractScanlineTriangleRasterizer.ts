import { Framebuffer } from "../Framebuffer";
import { Vertex } from "../Vertex";
import { AbstractTriangleRasterizer } from "./AbstractTriangleRasterizer";

export abstract class AbstractScannlineTriangleRasterizer extends AbstractTriangleRasterizer {

    private temp: Vertex = null;
    
    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     */
    public drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void {

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
        } else {
            const x: number = (p3.projection.x - p1.projection.x) * (p2.projection.y - p1.projection.y) /
                (p3.projection.y - p1.projection.y) + p1.projection.x;
            if (x > p2.projection.x) {
                this.fillLongRightTriangle(framebuffer, p1, p2, p3);
            } else {
                this.fillLongLeftTriangle(framebuffer,p1,p2,p3);
            }
        }
    }

    protected abstract fillLongRightTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void;
    protected abstract fillLongLeftTriangle(framebuffer: Framebuffer, v1: Vertex, v2: Vertex, v3: Vertex): void;

    /**
     * Perspective-correct bilinear texture sample.
     * @param framebuffer - the framebuffer whose bob texture is sampled
     * @param uStart - perspective-divided u (u/z accumulated along edge)
     * @param vStart - perspective-divided v (v/z accumulated along edge)
     * @param wStart - 1/z value at the current pixel
     * @returns packed ARGB colour from the bilinear filter
     */
    protected sampleTexturePerspective(
        framebuffer: Framebuffer,
        uStart: number,
        vStart: number,
        wStart: number,
    ): number {
        const z = 1 / wStart;
        const u = uStart * z * (framebuffer.bob.width - 1);
        const v = vStart * z * (framebuffer.bob.height - 1);
        return framebuffer.bob.getBilinearFilteredPixelRasterizer(u, v);
    }

    /**
     * Affine (non-perspective) nearest-neighbour texture sample for 2-D triangles.
     * @param framebuffer - the framebuffer whose bob texture is sampled
     * @param uStart - normalised u coordinate in [0, 1]
     * @param vStart - normalised v coordinate in [0, 1]
     * @returns packed ARGB colour from the texture
     */
    protected sampleTexture2D(
        framebuffer: Framebuffer,
        uStart: number,
        vStart: number,
    ): number {
        const u = Math.max(Math.min(uStart * framebuffer.bob.width, framebuffer.bob.width - 1), 0) | 0;
        const v = Math.max(Math.min(vStart * framebuffer.bob.height, framebuffer.bob.height - 1), 0) | 0;
        return framebuffer.bob.texture[u + v * framebuffer.bob.width];
    }
}
