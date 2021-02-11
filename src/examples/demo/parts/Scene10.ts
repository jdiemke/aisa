import { Framebuffer } from '../../../Framebuffer';
import { MetalHeadzScene } from '../../metalheadz/MetalHeadzScene';

export class Scene10 {
    private MetalHeadzScene: MetalHeadzScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.MetalHeadzScene = new MetalHeadzScene();

        return Promise.all([
            this.MetalHeadzScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.MetalHeadzScene.render(framebuffer, time);
    }

}