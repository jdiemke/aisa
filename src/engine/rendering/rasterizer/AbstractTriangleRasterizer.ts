import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Vertex } from '@engine/geometry/primitives/Vertex';

export abstract class AbstractTriangleRasterizer {

    public abstract drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void;

}
