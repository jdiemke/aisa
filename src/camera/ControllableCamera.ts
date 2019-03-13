import { Vector3f } from '../math';
import { BasicCamera } from './BasicCamera';

export class ControllableCamera extends BasicCamera {

    constructor(position: Vector3f, yaw: number, pitch: number, roll: number) {
        super(position, yaw, pitch, roll);
    }

    public moveForward(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.position.x += distance * -Math.sin(this.yaw);
        this.position.z += distance * -Math.cos(this.yaw);
    }

    public moveBackward(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.position.x -= distance * -Math.sin(this.yaw);
        this.position.z -= distance * -Math.cos(this.yaw);
    }

    public turnLeft(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.yaw += distance;
    }

    public turnRight(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.yaw -= distance;
    }

    public turnUp(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.pitch += distance;
    }

    public turnDown(speed: number, deltaTime: number): void {
        let distance = speed * deltaTime;
        this.pitch -= distance;
    }

}
