import { Canvas } from '../../Canvas';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * TODO: extract lens into effect class
 */
export class PlasmaScene extends AbstractScene {

    public render(framebuffer: Framebuffer): void {
        framebuffer.drawOldSchoolPlasma(Date.now());
    }

}
