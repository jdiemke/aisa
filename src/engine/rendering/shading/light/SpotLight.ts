import { Vector4f } from '@engine/math/Vector4f';
import { PointLight } from '@engine/rendering/shading/light/PointLight';

export class SpotLight extends PointLight {

    public direction: Vector4f;
    public cuttOff: number;
    public exponent: number;

}
