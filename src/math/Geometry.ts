import { Vector3f, Vector4f } from './index';
import { Sphere } from './Sphere';

export class ComputationalGeometryUtils {

    public computeBoundingSphere(vertices: Array<Vector4f>): Sphere {

        if (vertices.length === 0) {
            throw new Error('More than one vertex required.');
        }

        if (vertices.length === 1) {
            return new Sphere(vertices[0], 0);
        }

        let center = new Vector4f(0, 0, 0, 0);
        let radius = 0;

        vertices.forEach(point => {
            center = center.add(new Vector4f(point.x, point.y, point.z, 0.0));
        });

        center = center.mul(1.0 / vertices.length);

        vertices.forEach(point => {
            radius = Math.max(radius, center.sub(point).length());
        });

        return new Sphere(center, radius);
    }

}