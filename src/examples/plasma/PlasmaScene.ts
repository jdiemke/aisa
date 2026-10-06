import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Plasma } from '../../effects/plasma/Plasma';

export class PlasmaScene extends AbstractScene {

    private plasma = new Plasma();

    public init(): Promise<void> {
        return this.plasma.init();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.plasma.render(framebuffer, time);
    }
}
