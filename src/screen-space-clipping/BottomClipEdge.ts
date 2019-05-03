import { Framebuffer } from '../Framebuffer';
import { Vector3f, Vector4f } from '../math';
import { TextureCoordinate } from '../TextureCoordinate';
import { Vertex } from "../Vertex";
import { AbstractClipEdge } from './AbstractClipEdge';

export class BottomClipEdge extends AbstractClipEdge {

    public isInside(p: Vertex): boolean {
        return p.projection.y >= Framebuffer.minWindow.y;
    }

    public isInside2(p: Vertex): boolean {
        return p.position.y >= Framebuffer.minWindow.y;
    }

    public computeIntersection(p1: Vertex, p2: Vertex): Vertex {
        const vertex: Vertex = new Vertex();
        // since this is for flat shading no interpolation is required
        const factor: number = (Framebuffer.minWindow.y - p1.projection.y) / (p2.projection.y - p1.projection.y);
        vertex.color = p2.color.sub(p1.color).mul(factor).add(p1.color);
        vertex.projection = new Vector4f(
            p1.projection.x + (p2.projection.x - p1.projection.x) * factor,
            Framebuffer.minWindow.y,
            1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * factor));
        return vertex;
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const vertex: Vertex = new Vertex();
        vertex.position =
            new Vector4f(
                Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)),
                Framebuffer.minWindow.y,
                1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)));

        const textCoord: TextureCoordinate = new TextureCoordinate();
        const z: number = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

}
