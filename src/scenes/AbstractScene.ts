import { Framebuffer } from './../Framebuffer';

export abstract class AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([]);
    }

    public onInit(): void {
        console.warn();
    }

    public abstract render(framebuffer: Framebuffer): void;

}
