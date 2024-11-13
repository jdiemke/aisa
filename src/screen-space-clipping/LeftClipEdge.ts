import { AbstractClipEdge } from './AbstractClipEdge';
import { TextureCoordinate } from '../TextureCoordinate';
import { Vertex } from '../Vertex';
import { Framebuffer } from '../Framebuffer';
import { Vector4f } from '../math/Vector4f';

export class LeftClipEdge extends AbstractClipEdge {

    constructor(private framebuffer: Framebuffer) {
        super();
    }

    public isInside(p: Vertex): boolean {
        return p.projection.x >= 0;
    }

    public isInside2(p: Vertex): boolean {
        return p.projection.x >= 0;
    }

    public computeIntersection(p1: Vertex, p2: Vertex): Vertex {
        const vertex = new Vertex();
        const factor: number = (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x);
        vertex.color = p2.color.sub(p1.color).mul(factor).add(p1.color);
        vertex.projection = new Vector4f(this.framebuffer.minWindow.x,
            Math.round(p1.projection.y + (p2.projection.y - p1.projection.y) * factor),
            1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * factor));
        return vertex;
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const vertex = new Vertex();
        vertex.projection =
            new Vector4f(this.framebuffer.minWindow.x,
                Math.round(p1.projection.y + (p2.projection.y - p1.projection.y) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)),
                1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)));

        const textCoord = new TextureCoordinate();
        const z = vertex.projection.z;
        textCoord.u = (p1.textureCoordinate.u / p1.projection.z + (p2.textureCoordinate.u / p2.projection.z - p1.textureCoordinate.u / p1.projection.z) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.projection.z + (p2.textureCoordinate.v / p2.projection.z - p1.textureCoordinate.v / p1.projection.z) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

    public computeIntersection3(p1: Vertex, p2: Vertex): Vertex {
        const vertex = new Vertex();
        vertex.projection =
            new Vector4f(this.framebuffer.minWindow.x,
                Math.round(p1.projection.y + (p2.projection.y - p1.projection.y) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)),
               0);

        const textCoord = new TextureCoordinate();

        textCoord.u = (p1.textureCoordinate.u  + (p2.textureCoordinate.u - p1.textureCoordinate.u) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)) ;
        textCoord.v = (p1.textureCoordinate.v  + (p2.textureCoordinate.v  - p1.textureCoordinate.v) * (this.framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x)) ;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }
}
