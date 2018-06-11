import { Vector4f } from '../math';
import { Face, FlatShadedFace } from './Face';
import { Sphere } from '../math/Sphere';

/**
 * Flatshader Mesh
 */
export class Mesh {

    public points: Array<Vector4f>;
    public normals: Array<Vector4f>;
    public points2: Array<Vector4f>;
    public normals2: Array<Vector4f>;
    public faces: Array<Face>;

}

export class FlatshadedMesh {

    public points: Array<Vector4f>;
    public normals: Array<Vector4f>;

    public transformedPoints: Array<Vector4f>;
    public transformedNormals: Array<Vector4f>;

    public faces: Array<FlatShadedFace>;
    public boundingSphere?: Sphere; // remove here and create new data scruture that has mesh and bounding volume

}
