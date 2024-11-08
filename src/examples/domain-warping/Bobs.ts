import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { PlaneDeformationTunnelScene } from '../plane-deformation-tunnel/PlaneDeformationTunnelScene';

/**
 * TODO: extract lens into effect class
 */
export class Bobs extends AbstractScene {

    private overlayTexture: Texture;
    private scene: PlaneDeformationTunnelScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new PlaneDeformationTunnelScene();
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('@assets/flower.png'), true).then((texture: Texture) => {
                this.overlayTexture = texture;
                this.overlayTexture.setClamp(false);
            })
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.scene.PlaneDeformationScene.render(framebuffer, time);
        time = time * 0.5;

        const scale = Math.sin(time * 0.0002) * 130;
        const scale2 = 1.2;

        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                const xoff = Math.sin(time * 0.0021 + y * 0.013) * scale;
                const yoff = Math.sin(time * 0.0022 + x * 0.012) * scale;

                const texturePixel = this.overlayTexture.getBilinearFilteredPixel2(x * scale2 + xoff, y * scale2 + yoff);
                const framebufferPixel = framebuffer.framebuffer[x + y * 320];
                const alpha = ((texturePixel >> 24) & 0xff) / 255;
                const inverseAlpha = 1 - alpha;

                const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                framebuffer.framebuffer[x + y * 320] = r | (g << 8) | (b << 16) | (255 << 24);
            }
        }
    }

}