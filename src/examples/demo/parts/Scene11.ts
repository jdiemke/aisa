import { Framebuffer } from '@engine/rendering/Framebuffer';
import { AbstractCube } from '@examples/abstract-cube/AbstractCube';

export class Scene11 {
    private AbstractCube: AbstractCube;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.AbstractCube = new AbstractCube();

        return Promise.all([
            this.AbstractCube.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.AbstractCube.render(framebuffer, time);
    }

}