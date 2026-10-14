import { Framebuffer } from '@engine/rendering/Framebuffer';
import { TorusScene } from '@examples/torus/TorusScene';

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