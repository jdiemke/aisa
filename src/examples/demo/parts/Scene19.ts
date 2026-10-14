import { Framebuffer } from '@engine/rendering/Framebuffer';
import { RazorScene } from '@examples/razor/RazorScene';

export class Scene19 {
    private RazorScene: RazorScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.RazorScene = new RazorScene();

        return Promise.all([
            this.RazorScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.RazorScene.render(framebuffer, time);
    }

}