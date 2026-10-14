import { CameraFrame } from '@engine/camera/CameraFrame';

export class CameraPath {
    public frames: Array<CameraFrame>;
    constructor() {
        this.frames = new Array<CameraFrame>();
    }
}

