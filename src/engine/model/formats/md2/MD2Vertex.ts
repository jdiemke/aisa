import { Vector3f } from '@engine/math';

export class MD2Vertex {

    public vector: Vector3f;
    public normalIndex: number;

    constructor(vector: Vector3f, normalIndex: number) {
        this.vector = vector;
        this.normalIndex = normalIndex;
    }
}
