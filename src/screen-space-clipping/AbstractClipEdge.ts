import { Vector3f } from '../math';
import { Vertex } from "../Vertex";

// TODO:
// - use polymorphism in order to have different intersection methods
// - one for plain clipping / one for tex coords / one for multitexturing / gouraud shading etc
export abstract class AbstractClipEdge {

    public abstract isInside(p: Vertex): boolean;
    public abstract isInside2(p: Vertex): boolean;
    public abstract computeIntersection(p1: Vertex, p2: Vertex): Vertex;
    public abstract computeIntersection2(p1: Vertex, p2: Vertex): Vertex;

}
