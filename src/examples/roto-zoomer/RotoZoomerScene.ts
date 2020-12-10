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

    public render(framebuffer: Framebuffer, time: number): void {
        this.drawRotoZoomer(framebuffer, time);
    }

    drawRotoZoomer(framebuffer: Framebuffer, time: number) {
        const scale = Math.sin(time * 0.0005) + 1.1;

        const yStepX = Math.sin(time * 0.0003) * scale;
        const yStepY = Math.cos(time * 0.0003) * scale;

        const xStepX = yStepY;
        const xStepY = -yStepX;

        let texYCoord = Math.sin(time * 0.0002) * 512;
        let texXCoord = Math.cos(time * 0.0002) * 512;

        let texYCoordInner = 0;
        let texXCoordInner = 0;
        let framebufferPos = 0;

        for (let y = 0; y < framebuffer.height; y++) {
            texXCoordInner = texXCoord;
            texYCoordInner = texYCoord;

            for (let x = 0; x < framebuffer.width; x++) {
                framebuffer.framebuffer[framebufferPos++] = this.logoTexture.texture[(texXCoordInner & 63) + (texYCoordInner & 0xff) * 64];

                texXCoordInner += xStepX;
                texYCoordInner += xStepY;
            }

            texXCoord += yStepX;
            texYCoord += yStepY;
        }
    }


}
