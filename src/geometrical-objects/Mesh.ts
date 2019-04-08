import { Vector4f } from '../math';
import { Face } from './Face';
import { FlatShadedFace } from "./FlatShadedFace";

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
