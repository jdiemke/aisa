import { Vector4f } from '../math/Vector4f';
import { FlatShadedFace } from './Face';

export class FlatshadedMesh {

    public points: Array<Vector4f>;
    public normals: Array<Vector4f>;

    public transformedPoints: Array<Vector4f>;
    public transformedNormals: Array<Vector4f>;

    public faces: Array<FlatShadedFace>;

}
