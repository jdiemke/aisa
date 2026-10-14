import { Framebuffer } from '@engine/rendering/Framebuffer';
import { GearsScene } from '@examples/gears/GearsScene';

export class Scene14 {
    private GearsScene: GearsScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.GearsScene = new GearsScene();

        return Promise.all([
            this.GearsScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.GearsScene.render(framebuffer, time);
    }

}