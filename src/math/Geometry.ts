import { Vector3f } from './Vector3f';
import { Vector4f } from './Vector4f';
import { Sphere } from './Sphere';

export class ComputationalGeometryUtils {

    public static spherePoint(theta: number, phi: number): Vector4f {
        return new Vector4f(Math.cos(theta) * Math.cos(phi),
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta), 1.0);
    }

    public static circlePoint(angle: number, radius: number = 10): Vector3f {
        return new Vector3f(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
    }

    public static triangleDeterminant(
        first: { x: number, y: number },
        second: { x: number, y: number },
        third: { x: number, y: number }
    ): number {
        return first.x * second.y - second.x * first.y +
            second.x * third.y - third.x * second.y +
            third.x * first.y - first.x * third.y;
    }

    public static normalMapCoords(normal: { x: number, y: number }): { u: number, v: number } {
        return {
            u: 0.5 + Math.asin(normal.x) / Math.PI,
            v: 0.5 - Math.asin(normal.y) / Math.PI,
        };
    }

    public static sphereMapCoords(direction: { x: number, y: number, z: number }): { u: number, v: number } {
        const length = Math.hypot(direction.x, direction.y, direction.z);
        const normalizedX = direction.x / length;
        const normalizedY = direction.y / length;
        const normalizedZ = direction.z / length;
        const denominator = 2.0 * Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY +
            (normalizedZ + 1.0) * (normalizedZ + 1.0));

        return {
            u: normalizedX / denominator + 0.5,
            v: normalizedY / denominator + 0.5,
        };
    }

    public static reflectionVector(normal: Vector4f, eyeSpaceVertex: Vector4f): Vector4f {
        const incidentVector = eyeSpaceVertex.normalize();
        return incidentVector.sub(normal.mul(incidentVector.dot(normal) * 2.0));
    }

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
