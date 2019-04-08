import { Vector4f } from '../../math/index';
import { Fog } from './Fog';

export class LinearFog extends Fog {

    private zStart: number;
    private zEnd: number;
    private fogColor: Vector4f;

    public constructor(zStart: number, zEnd: number, fogColor: Vector4f) {
        super();
        this.zStart = zStart;
        this.zEnd = zEnd;
        this.fogColor = fogColor;
    }

    public computeVertexColor(color: Vector4f, vertex: Vector4f): Vector4f {
        if (vertex.z >= this.zStart) {
            return color;
        } else if (vertex.z <= this.zEnd) {
            return this.fogColor;
        } else {
            const f: number = (this.zEnd - vertex.z) / (this.zEnd - this.zStart);
            return color.mul(f).add(this.fogColor.mul(1 - f));
        }
    }

}
