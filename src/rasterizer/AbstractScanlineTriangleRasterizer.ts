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
}
