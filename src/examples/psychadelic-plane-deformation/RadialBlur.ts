import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { TorusKnotScene } from '../torus-knot/TorusKnotScene';

export class RadialBlur extends AbstractScene {

    hoodlumLogo: Texture;
    abstract: Texture;


    public init(framebuffer: Framebuffer): Promise<any> {

        return Promise.all([
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(texture => this.hoodlumLogo = texture),
            TextureUtils.load(require('../../assets/abstract.png'), false).then(texture => this.abstract = texture),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawPlanedeformationTunnelV2(framebuffer, time, this.abstract);
        framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
    }

    /**
     * This code is pretty slow. About 12 fps with 6 x slowdown int chrome!
     * FIXME:
     * - optimize
     * - precompute dist & angle
     * - maybe use 8 * 8 block interpolation
     */
    public drawPlanedeformationTunnelV2(framebuffer: Framebuffer, elapsedTime: number, texture: Texture) {
        let i = 0;
        for (let y = 0; y < framebuffer.height; y++) {
            for (let x = 0; x < framebuffer.width; x++) {
                const scale = 1.2;
                const xdist = (x - framebuffer.width / 2) + Math.sin(elapsedTime * 0.0001) * 80 * scale;
                const ydist = (y - framebuffer.height / 2) + Math.cos(elapsedTime * 0.0001) * 80 * scale;
                const xdist2 = (x - framebuffer.width / 2) + Math.sin(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                const ydist2 = (y - framebuffer.height / 2) + Math.cos(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                let dist = 256 * 20 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                dist += Math.sin(Math.atan2(xdist, ydist) * 5) * 8;
                let dist2 = 256 * 20 / Math.max(1.0, Math.sqrt(xdist2 * xdist2 + ydist2 * ydist2));
                dist2 += Math.sin(Math.atan2(xdist2, ydist2) * 5) * 8;
                const finalDist = dist - dist2 + elapsedTime * 0.019;

                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;
                angle -= (Math.atan2(xdist2, ydist2) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;

                // FIXME: scale by 256
                const color1 = texture.texture[(finalDist & 0xff) + (angle & 0xff) * 255];
                const cScale = Math.min(60 / (dist), 1.0) * Math.min(60 / (dist2), 1.0);
                const r = (color1 & 0xff) * cScale;
                const g = (color1 >> 8 & 0xff) * cScale;
                const b = (color1 >> 16 & 0xff) * cScale;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }


}
