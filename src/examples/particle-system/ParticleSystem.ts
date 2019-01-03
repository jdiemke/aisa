import { Framebuffer } from '../../Framebuffer';
import { Matrix4f, Vector3f, Matrix3f } from '../../math/index';
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

    constructor() {
        this.particles = Array(600).fill(null).map(() => new Particle());
    }

    public drawParticleStreams(framebuffer: Framebuffer, elapsedTime: number, texture: Texture,
                               matrix: Matrix4f): void {

        this.particles.forEach((x: Particle) => {
            if (x.dead) {
                x.init();
            }
            x.update();

            x.transformedPosition = framebuffer.project(matrix.multiply(x.position)); // no temp object!
        });

        this.particles.sort((a: Particle, b: Particle) => {
            return a.transformedPosition.z - b.transformedPosition.z;
        });

        this.particles.forEach((element: Particle) => {
            const size: number = -(element.size * 192 / (element.transformedPosition.z));
            if (!element.dead && element.transformedPosition.z < -4) {
                framebuffer.drawSoftParticle(
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
