import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Vector3f } from '../../math';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * TODO: extract lens into effect class
 */
export class MetaballsScene extends AbstractScene {

    private heightmap: Texture;
    private noise: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/heightmap.png'), false).then(
                (texture: Texture) => this.heightmap = texture
            ),
            TextureUtils.generateProceduralNoise().then((texture: Texture) => this.noise = texture)
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now()*3;
        framebuffer.drawVoxelLandscape4(this.heightmap, time);
        const tempTexture: Texture = new Texture();
        tempTexture.texture = new Uint32Array(256 * 256);
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                let ypos = 199 - Math.round(200 / 256 * x);
                let xpos = Math.round(320 / 256 * y);
                tempTexture.texture[x + y * 256] = framebuffer.framebuffer[xpos + ypos * 320];
            }
        }
        framebuffer.drawPolarDistotion2(time, tempTexture);
        framebuffer.noise(time, this.noise);
    }



}
