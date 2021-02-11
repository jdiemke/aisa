import { Framebuffer } from '../../../Framebuffer';
import { BakedLighting } from '../../baked-lighting/BakedLighting';

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