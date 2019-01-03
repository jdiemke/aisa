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

    constructor() {
        this.init();
    }

    public init(): void {
        this.position = new Vector3f(Math.sin(1 * Date.now() * 0.002) * 2.3, Math.cos(2 * Date.now() * 0.002) * 2.3, + Math.sin(2 * Date.now() * 0.002) * 2.3);
        this.velocity = new Vector3f(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        ).mul(Math.random());
        this.alpha = Math.random();
        this.size = (Math.random() + 0.5) * 1.8;
        this.start = Date.now();
        this.lifespan = Math.random() * 900 + 500;
        this.dead = false;
    }

    public update(): void {
        this.position = this.position.add(this.velocity.mul(0.3));
        this.alpha = 1 - (Date.now() - this.start) / this.lifespan;
        this.velocity = this.velocity.sub(new Vector3f(0, +0.005, 0));
        if ((this.start + this.lifespan) < Date.now()) {
            this.dead = true;
        }
    }

}
