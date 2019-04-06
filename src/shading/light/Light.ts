import { Color } from '../../core/Color';
import { Vector4f } from '../../math/index';

export abstract class Light {

    public ambientIntensity: Vector4f;
    public diffuseIntensity: Vector4f;
    public specularIntensity: Vector4f;

}
