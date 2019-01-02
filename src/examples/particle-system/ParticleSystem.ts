import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Matrix3f } from '../../math/index';
import { Texture } from '../../texture/index';
import { Particle } from './Particle';

export class ParticleSystem {

    private particles: Array<Particle>;

    constructor() {
        this.particles = Array(300).fill(null).map(() => new Particle());
    }

    public drawParticleStreams(framebuffer: Framebuffer, elapsedTime: number, texture: Texture): void {

        this.particles.forEach((x: Particle) => {
            if (x.dead) {
                x.init();
            }
            x.update();
            x.transformedPosition = framebuffer.project(x.position); // no temp object!
        });

        this.particles.sort((a: Particle, b: Particle) => {
            return a.transformedPosition.z - b.transformedPosition.z;
        });

        this.particles.forEach((element: Particle) => {
            const size: number = -(element.size * 192 / (element.transformedPosition.z));
            if (!element.dead && element.transformedPosition.z < -4) {
                framebuffer.drawParticleNoDepth(
                    Math.round(element.transformedPosition.x - size / 2),
                    Math.round(element.transformedPosition.y - size / 2),
                    Math.round(size),
                    Math.round(size),
                    texture,
                    1 / element.transformedPosition.z,
                    element.alpha
                );
            }
        });
    }

}
