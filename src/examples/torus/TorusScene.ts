import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import Texture from '../../Texture';

export class TorusScene extends AbstractScene {

    private razorLogo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            this.createTexture(require('./assets/razor1911.png'), true).then(
                (texture: Texture) => this.razorLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.02 * time;
        framebuffer.drawTitanEffect();
        framebuffer.shadingTorus(elapsedTime);
        framebuffer.drawTexture(32, 1, this.razorLogo, 1.0);
    }

}
