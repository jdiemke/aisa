import { Vector4f } from '../../math/index';

export abstract class Fog {

    public abstract computeVertexColor(color: Vector4f, vertex: Vector4f): Vector4f;

}
