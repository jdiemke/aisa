import { Vector3f } from '../math';
import { CameraFrame } from './CameraFrame';

export class CameraPath {
    public frames: Array<CameraFrame>;
    constructor() {
        this.frames = new Array<CameraFrame>();
    }
}

