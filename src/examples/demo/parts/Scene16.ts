import { Framebuffer } from '@engine/rendering/Framebuffer';
import { ParticleStreamsScene } from '@examples/particle-streams/ParticleStreamsScene';

export class Scene16 {
    private ParticleStreamsScene: ParticleStreamsScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.ParticleStreamsScene = new ParticleStreamsScene();

        return Promise.all([
            this.ParticleStreamsScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.ParticleStreamsScene.render(framebuffer, time);
    }

}