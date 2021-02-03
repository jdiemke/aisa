import { Framebuffer } from '../Framebuffer';
import { Vertex } from '../Vertex';

export abstract class AbstractTriangleRasterizer {

    public abstract drawTriangleDDA(framebuffer: Framebuffer, p1: Vertex, p2: Vertex, p3: Vertex): void;

}
