import Plane from './Plane';

export interface BoundingVolume {

    isInsidePositiveHalfSpace(plane: Plane): boolean;

}