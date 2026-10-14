import { Primitives2D } from '@engine/geometry/primitives/Primitives2D';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Color } from '@core/Color';
import { AbstractScene } from '@core/AbstractScene';

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
