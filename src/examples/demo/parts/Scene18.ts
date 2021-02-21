import { Framebuffer } from '../../../Framebuffer';
import { TwisterScene } from '../../twister/TwisterScene';

export class Scene18 {
    private TwisterScene: TwisterScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.TwisterScene = new TwisterScene();

        return Promise.all([
            this.TwisterScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.TwisterScene.render(framebuffer, time);
    }

}