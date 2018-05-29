import { Vector4f } from '../math';

export class Mesh {

    public points: Array<Vector4f>;
    public normals: Array<Vector4f>;
    public points2: Array<Vector4f>;
    public normals2: Array<Vector4f>;
    public faces: Array<{ vertices: Array<number>, normals: Array<number> }>;

}
