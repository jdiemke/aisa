import { Framebuffer } from '../../../Framebuffer';
import { Color } from '../../../core/Color';
import { AbstractScene } from '../../../scenes/AbstractScene';

export class LoadingScene extends AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([
        ]);
    }

    public render(framebuffer: Framebuffer, percent: number): void {
        // update the progress bar via canvas
        const outputX = Math.ceil(framebuffer.width * percent);
        framebuffer.drawRect2(0, (framebuffer.height / 2) - 5, outputX, 10, Color.WHITE.toPackedFormat());
    }

}
