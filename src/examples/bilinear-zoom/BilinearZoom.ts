import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture/index';

export class BilinearZoom extends AbstractScene {
    private texture5: Texture;
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);
        return Promise.all([
            TextureUtils.load(require('../../assets/atlantis.png'), false).then(texture => this.texture5 = texture),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const currentTime: number = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);

        // SCALE
        const texture = new Texture();
        texture.texture = this.accumulationBuffer;
        texture.width = 320;
        texture.height = 200;

        const scale2 = (1 + Math.sin(currentTime * 0.0005)) * 0.5 * 20 + 1;
        const width2 = 320 * scale2;
        const height2 = 200 * scale2;

        // looks crappy with linear interpolation!
        // probably  bilinear is required here
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.drawScaledTextureClipBi(
            Math.round(320 / 2 - width2 / 2),
            Math.round(200 / 2 - height2 / 2),
            width2 | 0, height2 | 0, texture, 1.0);
    }

}
