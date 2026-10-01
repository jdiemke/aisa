import { Framebuffer } from './../Framebuffer';
import { sceneData } from '../sound/MusicProperties';

export abstract class AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        return Promise.all([]);
    }

    public onInit(): void {

    }

    public abstract render(framebuffer: Framebuffer, time: number, sceneData?: sceneData): void;

}
