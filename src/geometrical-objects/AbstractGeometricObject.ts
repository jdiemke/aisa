import { Vector4f } from '../math/index';
import { FlatShadedFace } from './FlatShadedFace';
import { FlatshadedMesh } from './FlatshadedMesh';

export class AbstractGeometricObject {

    protected mesh: FlatshadedMesh;
    protected inverse: boolean;

    protected buildMesh(points: Array<Vector4f>, index: Array<number>, inverse: boolean = false): void {
        this.inverse = inverse;
        const normals: Array<Vector4f> = new Array<Vector4f>();

        // todo use index array for normals to have less normal objects
        // compute normal and check wheter the normal already exists. then reuse inded
        // maybe have a similarity faktor to reuse similar normals
        for (let i = 0; i < index.length; i += 3) {
            const normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(this.inverse ? normal.normalize().mul(-1) : normal.normalize()); // normalize?
        }


        const faces: Array<FlatShadedFace> = new Array<FlatShadedFace>();

        for (let i = 0; i < index.length; i += 3) {

            faces.push({
                n1: i / 3,
                n2: i / 3,
                n3: i / 3,
                v1: index[0 + i],
                v2: index[1 + i],
                v3: index[2 + i],
            });
        }

        // Create class for objects
        this.mesh = {
            points,
            normals,
            faces,
            transformedPoints: points.map(() => new Vector4f(0, 0, 0, 0)),
            transformedNormals: normals.map(() => new Vector4f(0, 0, 0, 0))
        };
    }

    public getMesh(): FlatshadedMesh {
        return this.mesh;
    }

}
