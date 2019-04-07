import { Framebuffer } from "../Framebuffer";
import { Vector3f, Vector4f } from "../math";
import { TextureCoordinate } from "../TextureCoordinate";
import { Vertex } from "../Vertex";
import { AbstractClipEdge } from "./AbstractClipEdge";

export class TopClipEdge extends AbstractClipEdge {

    public isInside(p: Vertex): boolean {
        return p.projection.y < Framebuffer.maxWindow.y + 1;
    }

    public isInside2(p: Vertex): boolean {
        return p.position.y < Framebuffer.maxWindow.y + 1;
    }

    public computeIntersection(p1: Vertex, p2: Vertex): Vertex {
        let vertex = new Vertex();
        vertex.projection =new Vector4f(
            Math.round(p1.projection.x + (p2.projection.x - p1.projection.x) * (Framebuffer.maxWindow.y + 1 - p1.projection.y) / (p2.projection.y - p1.projection.y)),
            Framebuffer.maxWindow.y + 1,
            1 / (1 / p1.projection.z + (1 / p2.projection.z - 1 / p1.projection.z) * (Framebuffer.maxWindow.y + 1 - p1.projection.y) / (p2.projection.y - p1.projection.y)));
            return vertex;
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        let vertex = new Vertex();
        vertex.position =
            new Vector4f(
                Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)),
                Framebuffer.maxWindow.y + 1,
                1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)));

        let textCoord = new TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;

        vertex.textureCoordinate = textCoord;
        return vertex;
    }


}
