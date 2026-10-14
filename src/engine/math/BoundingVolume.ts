import { Plane } from '@engine/math/Plane';

export interface BoundingVolume {

    isInsidePositiveHalfSpace(plane: Plane): boolean;

}
