import { Vector4f } from '@engine/math';

export abstract class Light {

    public ambientIntensity: Vector4f;
    public diffuseIntensity: Vector4f;
    public specularIntensity: Vector4f;

}
