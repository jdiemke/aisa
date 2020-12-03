import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class RotoZoomerScene extends AbstractScene {

    private logoTexture: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('../../assets/logo.png'), false).then(
                (texture: Texture) => this.logoTexture = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        this.drawRotoZoomer(framebuffer, this.logoTexture);
    }

    drawRotoZoomer(framebuffer: Framebuffer, texture: Texture) {
        const scale = Math.sin(Date.now() * 0.0005) + 1.1;

        const yStepX = Math.sin(Date.now() * 0.0003) * scale;
        const yStepY = Math.cos(Date.now() * 0.0003) * scale;

        const xStepX = yStepY;
        const xStepY = -yStepX;

        let texYCoord = Math.sin(Date.now() * 0.0002) * 512;
        let texXCoord = Math.cos(Date.now() * 0.0002) * 512;

        let texYCoordInner = 0;
        let texXCoordInner = 0;
        let framebufferPos = 0;

        for (let y = 0; y < framebuffer.height; y++) {
            texXCoordInner = texXCoord;
            texYCoordInner = texYCoord;

            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[framebufferPos++] = texture.texture[(texXCoordInner & 63) + (texYCoordInner & 0xff) * 64];

                texXCoordInner += xStepX;
                texYCoordInner += xStepY;
            }

            texXCoord += yStepX;
            texYCoord += yStepY;
        }
    }


}
