import { Framebuffer } from '@engine/rendering/Framebuffer';
import { BakedLighting } from '@examples/baked-lighting/BakedLighting';

export class Scene15 {
    private BakedLighting: BakedLighting;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.BakedLighting = new BakedLighting();

        return Promise.all([
            this.BakedLighting.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.BakedLighting.render(framebuffer, time);
    }

}