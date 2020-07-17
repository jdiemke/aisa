import { AbstractClipEdge } from './AbstractClipEdge';
import { Vector3f } from '../math/Vector3f';
import { TextureCoordinate } from '../TextureCoordinate';
import { Vertex } from '../Vertex';
import { Framebuffer } from '../Framebuffer';
import { Vector4f } from '../math/Vector4f';

export class LeftClipEdge extends AbstractClipEdge {

    public isInside(p: Vertex): boolean {
        return p.projection.x >= 0;
    }

    public isInside2(p: Vertex): boolean {
        return p.position.x >= 0;
    }

    public computeIntersection(p1: Vertex, p2: Vertex): Vertex {
        const vertex = new Vertex();
        const factor: number = (Framebuffer.minWindow.x - p1.projection.x) / (p2.projection.x - p1.projection.x);
        vertex.color = p2.color.sub(p1.color).mul(factor).add(p1.color);
        vertex.projection = new Vector4f(Framebuffer.minWindow.x,
            Math.round(p1.projection.y + (p2.projection.y - p1.projection.y) * factor),
            1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * factor));
        return vertex;
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const vertex = new Vertex();
        vertex.position =
            new Vector4f(Framebuffer.minWindow.x,
                Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)),
                1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)));

        const textCoord = new TextureCoordinate();
        const z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

}
