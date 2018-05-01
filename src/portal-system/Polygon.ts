import { Vector3f, Vector4f } from '../math';
import { Plane } from '../math/Plane';

export class Polygon {

    public vertices: Array<Vector4f>;

    constructor(vertices: Array<Vector4f> = null) {
        this.vertices = vertices;
    }

    public getPlanes(pos: Vector3f): Array<Plane> {
        const frustum: Array<Plane> = new Array<Plane>();
        const position: Vector4f = new Vector4f(pos.x, pos.y, pos.z);

        for (let i: number = 0; i < this.vertices.length; i++) {
            const normal: Vector4f = this.vertices[i]
                .sub(position).cross(this.vertices[(i + 1) % this.vertices.length].sub(position)).normalize().mul(-1);
            const distance: number = normal.dot(position);
            frustum.push(new Plane(normal, distance));
        }

        return frustum;
    }

    public isVisible(): boolean {
        return this.vertices.length >= 3;
    }

}
