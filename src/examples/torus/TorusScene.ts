import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class TorusScene extends AbstractScene {

    private razorLogo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            TextureUtils.load(require('./assets/razor1911.png'), true).then(
                (texture: Texture) => this.razorLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;
        this.drawTitanEffect(framebuffer);
        framebuffer.shadingTorus(elapsedTime);
        framebuffer.drawTexture(32, 1, this.razorLogo, 1.0);
    }

    private drawTitanEffect(framebuffer: Framebuffer) {
        framebuffer.clear();
        const horizontalNum = 320 / 20;
        const verticalNum = 200 / 20;

        for (let x = 0; x < horizontalNum; x++) {
            for (let y = 0; y < verticalNum; y++) {

                let scale = ((Math.sin(Date.now() * 0.004 + x * 0.7 + y * 0.4) + 1) / 2);
                let size = Math.round(scale * 8 + 1) * 2;
                let offset = (20 / 2 - size / 2) | 0;
                let color = 255 << 24 | (85 * scale) << 16 | (55 * scale) << 8 | (55 * scale);
                framebuffer.drawBox2(x * 20 + offset, y * 20 + offset, size, size, color);
            }
        }

    }

}
