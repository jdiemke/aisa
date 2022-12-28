import { Framebuffer } from './../Framebuffer';

export abstract class AbstractScene {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([]);
    }

    public onInit(): void {

    }

    public abstract render(framebuffer: Framebuffer, time: number): void;

}
