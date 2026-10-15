import { Framebuffer } from '@engine/rendering/Framebuffer';
import { Starfield } from '@effects/starfield/Starfield';
import { AbstractScene } from '@core';

export class StarfieldScene extends AbstractScene {

    private starfield = new Starfield();

    public render(framebuffer: Framebuffer, time: number): void {
        this.starfield.render(framebuffer, time);
    }

}
