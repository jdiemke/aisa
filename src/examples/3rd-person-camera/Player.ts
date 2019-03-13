import { Vector2f } from '../../math/index';

export class Player {

    public position: Vector2f = new Vector2f(0, 0);
    public angle: number = 0;

    public moveForward(speed: number, deltaTime: number): void {
        const distance: number = speed * deltaTime;
        this.position.x += distance * -Math.sin(Math.PI * 2 / 360 * this.angle);
        this.position.y += distance * -Math.cos(Math.PI * 2 / 360 * this.angle);
    }

    public moveBackward(speed: number, deltaTime: number): void {
        const distance: number = speed * deltaTime;
        this.position.x -= distance * -Math.sin(Math.PI * 2 / 360 * this.angle);
        this.position.y -= distance * -Math.cos(Math.PI * 2 / 360 * this.angle);
    }

    public turnLeft(speed: number, deltaTime: number): void {
        const distance: number = speed * deltaTime;
        this.angle += distance;
    }

    public turnRight(speed: number, deltaTime: number): void {
        const distance: number = speed * deltaTime;
        this.angle -= distance;
    }

}
