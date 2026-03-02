import { Vertex } from '../Vertex';
import { ClipMode } from './ClipMode';

// TODO:
// - use polymorphism in order to have different intersection methods
// - one for plain clipping / one for tex coords / one for multitexturing / gouraud shading etc
export abstract class AbstractClipEdge {

    public abstract isInside(p: Vertex): boolean;
    public abstract isInside2(p: Vertex): boolean;
    public abstract computeIntersection(p1: Vertex, p2: Vertex): Vertex;
    public abstract computeIntersection2(p1: Vertex, p2: Vertex): Vertex;
    public abstract computeIntersection3(p1: Vertex, p2: Vertex): Vertex;

    /**
     * Dispatches to the appropriate intersection method based on ClipMode.
     */
    public computeIntersectionForMode(p1: Vertex, p2: Vertex, mode: ClipMode): Vertex {
        switch (mode) {
            case ClipMode.PERSPECTIVE_TEXTURE:
                return this.computeIntersection2(p1, p2);
            case ClipMode.AFFINE_TEXTURE:
                return this.computeIntersection3(p1, p2);
            case ClipMode.GOURAUD:
            default:
                return this.computeIntersection(p1, p2);
        }
    }
}
