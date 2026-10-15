import { Primitives2D } from '@engine/geometry/primitives';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Color, AbstractScene } from '@core';

export class LoadingScene extends AbstractScene {

    public init(): Promise<any> {
        return Promise.all([
        ]);
    }

    public render(framebuffer: Framebuffer, percent: number): void {
        // update the progress bar via canvas
        const outputX = Math.ceil(framebuffer.width * percent);
        Primitives2D.drawRect2(framebuffer, 0, (framebuffer.height / 2) - 5, outputX, 10, Color.WHITE.toPackedFormat());
    }

}
