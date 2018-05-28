import { Vector3f } from '../math';
import { Vertex } from '../Vertex';

// TODO:
// - use polymorphism in order to have different intersection methods
// - one for plain clipping / one for tex coords / one for multitexturing / gouraud shading etc
export abstract class AbstractClipEdge {

    public abstract isInside(p: Vector3f): boolean;
    public abstract isInside2(p: Vertex): boolean;
    public abstract computeIntersection(p1: Vector3f, p2: Vector3f): Vector3f;
    public abstract computeIntersection2(p1: Vertex, p2: Vertex): Vertex;

}
