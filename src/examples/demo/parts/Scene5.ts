import { Framebuffer } from '../../../Framebuffer';
import { TorusScene } from '../../torus/TorusScene';

export class Scene5 {
    private TorusScene: TorusScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.TorusScene = new TorusScene();

        return Promise.all([
            this.TorusScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.TorusScene.render(framebuffer, time);
    }

}