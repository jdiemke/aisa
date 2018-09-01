import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

export class SineScrollerScene extends AbstractScene {

    private atlantisBackground: Texture;
    private startTime: number;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('./assets/atlantis.png'), false).then(
                (texture: Texture) => this.atlantisBackground = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now() - this.startTime;
        const elapsedTime: number = 0.004 * time;

        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.atlantisBackground.texture);

    }

}
