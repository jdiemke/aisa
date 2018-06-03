import { Vector3f, Vector4f } from './math';

export class TextureCoordinate {
    public u: number;
    public v: number;

    constructor(u?: number, v?: number) {
        this.u = u;
        this.v = v;
    }
}

export class Vertex {
    public position: Vector4f;
    public textureCoordinate: TextureCoordinate;
}
