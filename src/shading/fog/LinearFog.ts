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
        const f: number = Math.max(0.0, Math.min(1.0, (this.zEnd - vertex.z) / (this.zEnd - this.zStart)));
        return color.mul(f).add(this.fogColor.mul(1 - f));
    }

}
