import { Framebuffer } from '@engine/rendering/Framebuffer';
import { AbstractScene } from '@core';
import { LedPlasma } from '@effects/led-plasma/LedPlasma';

export class LedPlasmaScene extends AbstractScene {

    private ledPlasma = new LedPlasma();

    public init(): Promise<void> {
        return this.ledPlasma.init();
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.ledPlasma.render(framebuffer, time);
    }

}
