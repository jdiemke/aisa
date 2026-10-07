import { Framebuffer } from '../../Framebuffer';
import { BumpMap } from '../../effects/bump-map/BumpMap';
import { AbstractScene } from '../../scenes/AbstractScene';

export class BumpMapScene extends AbstractScene {

    private bumpMap = new BumpMap();

    public init(framebuffer: Framebuffer): Promise<any> {
        return this.bumpMap.init(framebuffer);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.bumpMap.render(framebuffer, time);
    }
}