import { Framebuffer } from '@engine/rendering/Framebuffer';
import { DofBallsScene } from '@examples/dof-balls/DofBallsScene';

export class Scene12 {
    private DofBallsScene: DofBallsScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.DofBallsScene = new DofBallsScene();

        return Promise.all([
            this.DofBallsScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.DofBallsScene.render(framebuffer, time);
    }

}