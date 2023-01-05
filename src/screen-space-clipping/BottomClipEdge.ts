import { Framebuffer } from '../Framebuffer';
import { Vector4f } from '../math';
import { TextureCoordinate } from '../TextureCoordinate';
import { Vertex } from '../Vertex';
import { AbstractClipEdge } from './AbstractClipEdge';

export class BottomClipEdge extends AbstractClipEdge {


    constructor(private framebuffer: Framebuffer) {
        super();
    }

    public isInside(p: Vertex): boolean {
        return p.projection.y >= this.framebuffer.minWindow.y;
    }

    public isInside2(p: Vertex): boolean {
        return p.projection.y >= this.framebuffer.minWindow.y;
    }

    public computeIntersection(p1: Vertex, p2: Vertex): Vertex {
        const vertex: Vertex = new Vertex();
        // since this is for flat shading no interpolation is required
        const factor: number = (this.framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y);
        vertex.color = p2.color.sub(p1.color).mul(factor).add(p1.color);
        vertex.projection = new Vector4f(
            Math.round(p1.projection.x + (p2.projection.x - p1.projection.x) * factor),
            this.framebuffer.minWindow.y,
            1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * factor));
        return vertex;
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const vertex: Vertex = new Vertex();
        vertex.projection =
            new Vector4f(
                Math.round(p1.projection.x + (p2.projection.x - p1.projection.x) * (this.framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y)),
                this.framebuffer.minWindow.y,
                1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * (this.framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y)));

        const textCoord: TextureCoordinate = new TextureCoordinate();
        const z: number = vertex.projection.z;
        textCoord.u = (p1.textureCoordinate.u / p1.projection.z + (p2.textureCoordinate.u / p2.projection.z - p1.textureCoordinate.u / p1.projection.z) * (this.framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.projection.z + (p2.textureCoordinate.v / p2.projection.z - p1.textureCoordinate.v / p1.projection.z) * (this.framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

}
