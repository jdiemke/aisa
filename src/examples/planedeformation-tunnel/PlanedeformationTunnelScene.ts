import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class PlanedeformationTunnelScene extends AbstractScene {

    private heightmap: Texture;
    private metall: Texture;
    private hoodlumLogo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.load(require('../../assets/metall.png'), false).then(
                (texture: Texture) => this.metall = texture
            ),
            TextureUtils.load(require('../../assets/hoodlumLogo.png'), true).then(
                (texture: Texture) => this.hoodlumLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.heightmap, this.metall);
        const ukBasslineBpm = 140;
        const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
        const smashTime = (Date.now()) % ukBasslineClapMs;
        const smash = (framebuffer.cosineInterpolate(0, 15, smashTime) -
            framebuffer.cosineInterpolate(15, 200, smashTime) +
            0.4 * framebuffer.cosineInterpolate(200, 300, smashTime) -
            0.4 * framebuffer.cosineInterpolate(300, 400, smashTime)) * 35;
        framebuffer.drawScaledTextureClip((320 / 2 - (this.hoodlumLogo.width + smash) / 2) | 0,
            (200 / 2 - (this.hoodlumLogo.height - smash) / 2) | 0, this.hoodlumLogo.width + smash, (this.hoodlumLogo.height - smash) | 0, this.hoodlumLogo, 1.0);
    }

    /**
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    drawPlanedeformationTunnel(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, texture2: Texture) {

        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = 256 * 20 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                let dist2 = dist;
                dist += elapsedTime * 0.02;
                dist2 += elapsedTime * 0.039;
                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 128 + elapsedTime * 0.0069;

                let color1 = texture.texture[(dist2 & 0xff) + (angle & 0xff) * 255];
                let color2 = texture2.texture[(dist & 0xff) + (angle & 0xff) * 255];

                let alpha = 0.4;
                let inverseAlpha = 1 - alpha;

                let r = (((color1 >> 0) & 0xff) * (inverseAlpha) + (((color2) >> 0) & 0xff) * (alpha)) | 0;
                let g = (((color1 >> 8) & 0xff) * (inverseAlpha) + (((color2) >> 8) & 0xff) * (alpha)) | 0;
                let b = (((color1 >> 16) & 0xff) * (inverseAlpha) + ((color2 >> 16) & 0xff) * (alpha)) | 0;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }



}
