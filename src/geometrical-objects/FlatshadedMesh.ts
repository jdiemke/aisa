import { Vector4f } from '../math/Vector4f';
import { FlatShadedFace } from './FlatShadedFace';

export class FlatshadedMesh {

    public points: Array<Vector4f>;
    public normals: Array<Vector4f>;

    public transformedPoints: Array<Vector4f>;
    public transformedNormals: Array<Vector4f>;

    public faces: Array<FlatShadedFace>;

    /**
     * Duplicate vertices per face so that each face owns its own
     * vertex copies.  This lets computeSurfaceIds distinguish faces
     * with different normals (shared vertices defeat the union-find).
     */
    public static explode(source: FlatshadedMesh): FlatshadedMesh {
        const faceCount = source.faces.length;
        const points: Array<Vector4f> = new Array(faceCount * 3);
        const faces: Array<FlatShadedFace> = new Array(faceCount);

        for (let i = 0; i < faceCount; i++) {
            const f = source.faces[i];
            points[i * 3]     = source.points[f.v1];
            points[i * 3 + 1] = source.points[f.v2];
            points[i * 3 + 2] = source.points[f.v3];

            const face = new FlatShadedFace();
            face.v1 = i * 3;
            face.v2 = i * 3 + 1;
            face.v3 = i * 3 + 2;
            face.n1 = f.n1;
            face.n2 = f.n2;
            face.n3 = f.n3;
            faces[i] = face;
        }

        const mesh = new FlatshadedMesh();
        mesh.points = points;
        mesh.normals = source.normals;
        mesh.faces = faces;
        mesh.transformedPoints = points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.transformedNormals = source.normals.map(() => new Vector4f(0, 0, 0, 0));
        return mesh;
    }

}
