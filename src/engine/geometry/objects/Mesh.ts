import { Vector4f } from '@engine/math';
import { Face } from '@engine/geometry/objects/Face';

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
