import { Framebuffer } from '@engine/rendering/Framebuffer';
import { TwisterScene } from '@examples/twister/TwisterScene';

export class Scene18 {
    private TwisterScene: TwisterScene;
    public init(): Promise<any> {

        this.TwisterScene = new TwisterScene();

        return Promise.all([
            this.TwisterScene.init(),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.TwisterScene.render(framebuffer, time);
    }

}