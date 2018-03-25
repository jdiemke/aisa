import { Vector3f } from './math';

export class TextureCoordinate {
    public u: number;
    public v: number;

    constructor(u?: number, v?: number) {
        this.u = u;
        this.v = v;
    }
}

export class Vertex {
    public position: Vector3f;
    public textureCoordinate: TextureCoordinate;
}
