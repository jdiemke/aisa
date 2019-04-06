import { Vector4f } from '../../math/Vector4f';
import { PointLight } from './PointLight';

export class SpotLight extends PointLight {

    public direction: Vector4f;
    public cuttOff: number;
    public exponent: number;

}
