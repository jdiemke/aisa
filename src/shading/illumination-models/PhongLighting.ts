import { Color } from '../../core/Color';
import { Vector4f } from '../../math/index';
import { Light } from '../light/Light';
import { PointLight } from '../light/PointLight';
import { Material } from '../material/Material';

export class PhongLighting {

    public computeColor(mat: Material, light: PointLight, normal: Vector4f, vertex: Vector4f): Vector4f {
        let finalColor: Vector4f;

        const ambientIntensity: Vector4f = this.computeAmbientIntensity(mat, light);
        const diffuseIntensity: Vector4f = this.computeDiffuseIntensity(mat, light, normal, vertex);
        const specularIntensity: Vector4f = this.computeSpecularIntensity(mat, light, normal, vertex);

        finalColor = ambientIntensity
            .add(diffuseIntensity)
            .add(specularIntensity);

        return finalColor;
    }

    private computeAmbientIntensity(mat: Material, l: PointLight): Vector4f {
        return mat.ambientColor.componentWiseMul(l.ambientIntensity);
    }

    private computeDiffuseIntensity(mat: Material, l: PointLight, normal: Vector4f, vertex: Vector4f): Vector4f {
        const lightDirection: Vector4f = l.position.sub(vertex).normalize();
        const scale: number = Math.min(Math.max(normal.dot(lightDirection), 0), 1.0);
        return mat.diffuseColor.componentWiseMul(l.diffuseIntensity).mul(scale);
    }

    private computeSpecularIntensity(mat: Material, l: PointLight, normal: Vector4f, vertex: Vector4f): Vector4f {
        const lightDirection: Vector4f = l.position.sub(vertex).normalize();
        const r: Vector4f = normal.mul(normal.dot(lightDirection) * 2.0).sub(lightDirection);
        const v: Vector4f = vertex.mul(-1).normalize();
        const scale: number =
            Math.pow(Math.max(r.dot(v), 0), mat.shininess);
        return mat.specularColor.componentWiseMul(l.specularIntensity).mul(scale);
    }

}
