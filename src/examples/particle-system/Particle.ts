import { Vector3f } from '../../math/index';

export class Particle {

    public position: Vector3f;
    public transformedPosition: Vector3f;
    public velocity: Vector3f;
    public size: number;
    public alpha: number;
    public lifespan: number;
    public dead: boolean;
    public start: number;

    constructor(elapsedTime: number) {
        this.init(elapsedTime);
    }

    public init(elapsedTime: number): void {
        this.position = new Vector3f(Math.sin(1 * elapsedTime * 0.002) * 2.3, Math.cos(2 * elapsedTime * 0.002) * 2.3, + Math.sin(2 * elapsedTime * 0.002) * 2.3);
        const scale: number = 1.3;
        this.velocity = new Vector3f(
            (Math.random() - 0.5) * scale,
            (Math.random() - 0.5) * scale,
            (Math.random() - 0.5) * scale
        ).mul(Math.random());
        this.alpha = Math.random();
        this.size = (Math.random() + 0.5) * 1.8;
        this.start = elapsedTime;
        this.lifespan = Math.random() * 900 + 500;
        this.dead = false;
    }

    public update(elapsedTime: number, deltaTime: number): void {
        this.position = this.position.add(this.velocity.mul(deltaTime / 1000));
        this.alpha = 1 - (elapsedTime - this.start) / this.lifespan;
        // this.velocity = this.velocity.sub(new Vector3f(0, +0.005 * deltaTime / 1000, 0));
        if ((this.start + this.lifespan) < elapsedTime) {
            this.dead = true;
        }
    }

}
