import { Vector4f } from '../math';

export class Polygon {

    public vertices: Array<Vector4f>;

    constructor(vertices: Array<Vector4f> = null) {
        this.vertices = vertices;
    }

}
