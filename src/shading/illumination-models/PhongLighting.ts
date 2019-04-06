import { Color } from '../../core/Color';
import { Vector4f } from '../../math/index';
import { Light } from '../light/Light';
import { PointLight } from '../light/PointLight';
import { Material } from '../material/Material';

export class PhongLighting {

    public computeColor(mat: Material, light: PointLight, normal: Vector4f, vertex: Vector4f): Color {
        let finalColor: Vector4f;

        const ambientIntensity: Vector4f = this.computeAmbientIntensity(mat, light);
        const diffuseIntensity: Vector4f = this.computeDiffuseIntensity(mat, light, normal, vertex);
        const specularIntensity: Vector4f = this.computeSpecularIntensity();

        finalColor = ambientIntensity
            .add(diffuseIntensity)
            .add(specularIntensity);

        return new Color(
            finalColor.x * 255,
            finalColor.y * 255,
            finalColor.z * 255,
            255
        );
    }

    private computeAmbientIntensity(mat: Material, l: PointLight): Vector4f {
        return mat.ambientColor.componentWiseMul(l.ambientIntensity);
    }

    private computeDiffuseIntensity(mat: Material, l: PointLight, normal: Vector4f, vertex: Vector4f): Vector4f {
        const lightDirection: Vector4f = l.position.sub(vertex);
        const scale: number = Math.max(normal.dot(lightDirection), 0);
        return  mat.diffuseColor.componentWiseMul(l.diffuseIntensity).mul(scale);
    }

    private computeSpecularIntensity(): Vector4f {
        return new Vector4f(0, 0, 0, 0);
    }

}
