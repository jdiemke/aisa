import { Vector3f } from '../math';

export class CameraKeyFrame {

    public position: Vector3f;
    public rotation: Vector3f;

    constructor(position: Vector3f, rotation: Vector3f) {
        this.position = position;
        this.rotation = rotation;
    }

}