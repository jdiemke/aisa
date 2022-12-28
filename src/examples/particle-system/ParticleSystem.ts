import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/index';
import { Texture } from '../../texture/index';
import { Particle } from './Particle';

/**
 * https://learnopengl.com/
 * http://www.mbsoftworks.sk/tutorials/opengl3/23-particle-system/
 * https://natureofcode.com/book/chapter-4-particle-systems/
 * https://code.tutsplus.com/tutorials/generating-a-particle-system-with-javascript--net-10668
 * https://en.wikipedia.org/wiki/Particle_system
 * http://www.gamasutra.com/view/feature/131565/building_an_advanced_particle_.php?page=2
 * https://www.lri.fr/~mbl/ENS/IG2/devoir2/files/docs/particles.pdf
 * https://cesiumjs.org/tutorials/Particle-Systems-Tutorial/
 * http://www.videotutorialsrock.com/opengl_tutorial/particle_system/text.php
 */
export class ParticleSystem {

    private particles: Array<Particle>;
    private lastTime: number = 0;

    constructor(elapsedTime: number) {
        this.particles = Array(600).fill(null).map(() => new Particle(elapsedTime));
    }

    public drawParticleStreams(framebuffer: Framebuffer, elapsedTime: number, texture: Texture,
        matrix: Matrix4f): void {

        const deltaTime: number = elapsedTime - this.lastTime;
        this.lastTime = elapsedTime;

        for (let i: number = 0; i < this.particles.length; i++) {
            const x: Particle = this.particles[i];

            if (x.dead) {
                x.init(elapsedTime);
            }

            x.update(elapsedTime, deltaTime);
            x.transformedPosition = framebuffer.project(matrix.multiply(x.position)); // no temp object!
        }

        this.particles.sort((a: Particle, b: Particle) => {
            return a.transformedPosition.z - b.transformedPosition.z;
        });

        for (let i: number = 0; i < this.particles.length; i++) {
            this.drawParticle(this.particles[i], framebuffer, texture); // remove framebuffer and texture
        }
    }

    private drawParticle(particle: Particle, framebuffer: Framebuffer, texture: Texture): void {
        const size: number = -(particle.size * 192 / (particle.transformedPosition.z));
        if (!particle.dead && particle.transformedPosition.z < -4) {
            framebuffer.drawSoftParticle(
                Math.round(particle.transformedPosition.x - size / 2),
                Math.round(particle.transformedPosition.y - size / 2),
                Math.round(size),
                Math.round(size),
                texture,
                1 / particle.transformedPosition.z,
                particle.alpha
            );
        }
    }

}
