import { Framebuffer } from '../../../Framebuffer';
import { SineScrollerScene } from '../../sine-scroller/SineScrollerScene';

export class Scene20 {
    private SineScrollerScene: SineScrollerScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.SineScrollerScene = new SineScrollerScene();

        return Promise.all([
            this.SineScrollerScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.SineScrollerScene.render(framebuffer, time);
    }

}