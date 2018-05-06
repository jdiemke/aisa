import { AbstractScene } from "./scenes/AbstractScene";
import { CullFace } from "./CullFace";
import Framebuffer from "./Framebuffer";
import Texture from "./Texture";

export class TorusScene extends AbstractScene {

    private razorLogo: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.setCullFace(CullFace.FRONT);

        return Promise.all([
            this.createTexture(require('./assets/razor1911.png'), true).then(texture => this.razorLogo = texture)
        ]);
    }

    public render(framebuffer: any): void {
        framebuffer.drawTitanEffect();
        framebuffer.shadingTorus(0);
        framebuffer.drawTexture(32, 1, this.razorLogo, 1.0);
    }

}