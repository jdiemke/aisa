import { Vector4f } from '@engine/math';
import { TextureCoordinate } from '@engine/geometry/primitives';

export class TexturedMesh {

    public points: Array<Vector4f>;
    public normals?: Array<Vector4f>;
    public uv: Array<TextureCoordinate>;

    public faces: Array<{
        vertices: Array<number>,
        normals?: Array<number>
        uv: Array<number>
    }>;

    public points2: Array<Vector4f>;
    public normals2?: Array<Vector4f>;

}
