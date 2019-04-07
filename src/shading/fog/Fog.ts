import { Vector4f } from '../../math/index';

export class Fog {

    public computeVertexColor(color: Vector4f, vertex: Vector4f): Vector4f {
        const fogColor: Vector4f = new Vector4f(0.67, 0.4, 0.5, 1.0);

        const zEnd: number = -240;
        const zStart: number = -50;
        const f: number = Math.max(0.0, Math.min(1.0, (zEnd - vertex.z) / (zEnd - zStart)));
        return color.mul(f).add(fogColor.mul(1 - f));
    }

}
