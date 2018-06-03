import { Vector4f } from '../math/Vector4f';
import { TextureCoordinate } from '../Vertex';

export class TexturedMesh {

    public points: Array<Vector4f>;
    // public normals: Array<Vector4f>;
    public uv: Array<TextureCoordinate>;

    public faces: Array<{
        vertices: Array<number>,
        // normals: Array<number>
        uv: Array<number>
    }>;

    public points2: Array<Vector4f>;
    // public normals2: Array<Vector4f>;

}
