import { Framebuffer } from '../../../Framebuffer';
import { HoodlumScene } from '../../hoodlum/HoodlumScene';

export class Scene17 {
    private HoodlumScene: HoodlumScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.HoodlumScene = new HoodlumScene();

        return Promise.all([
            this.HoodlumScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.HoodlumScene.render(framebuffer, time);
    }

}