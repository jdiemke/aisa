import { Vector4f } from '@engine/math';

export abstract class Fog {

    public abstract computeVertexColor(color: Vector4f, vertex: Vector4f): Vector4f;

}
