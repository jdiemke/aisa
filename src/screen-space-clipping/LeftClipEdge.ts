import { AbstractClipEdge } from "./AbstractClipEdge";
import { Vector3f } from "../math/Vector3f";
import { Vertex, TextureCoordinate } from "../Vertex";
import { Framebuffer } from "../Framebuffer";
import { Vector4f } from "../math/Vector4f";

export class LeftClipEdge extends AbstractClipEdge {

    public isInside(p: Vector3f): boolean {
        return p.x >= 0;
    }

    public isInside2(p: Vertex): boolean {
        return p.position.x >= 0;
    }

    public computeIntersection(p1: Vector3f, p2: Vector3f): Vector3f {
        return new Vector3f(Framebuffer.minWindow.x,
            Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)),
            1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)));
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        let vertex = new Vertex();
        vertex.position =
            new Vector4f(Framebuffer.minWindow.x,
                Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)),
                1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)));

        let textCoord = new TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

}
