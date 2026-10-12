import { Framebuffer } from '../../Framebuffer';
import { Starfield } from '../../effects/starfield/Starfield';
import { AbstractScene } from '../../scenes/AbstractScene';

export class StarfieldScene extends AbstractScene {

    private starfield = new Starfield();

    public render(framebuffer: Framebuffer, time: number): void {
        this.starfield.render(framebuffer, time);
    }

}
