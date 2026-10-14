import { Wormhole } from '@effects/wormhole/Wormhole';
import { Keyboard } from '@platform/input';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { AbstractScene } from '@core/AbstractScene';

export class WormholeScene extends AbstractScene {

    private wormhole = new Wormhole();
    private keyboard = new Keyboard();

    public init(framebuffer: Framebuffer): Promise<void> {
        return this.wormhole.init(framebuffer);
    }

    public onInit(): void {
        this.keyboard.addKeyDownListener((event: KeyboardEvent) => {
            let spin = this.wormhole.directionX;
            let pull = this.wormhole.directionY;
            switch (event.keyCode) {
                case Keyboard.LEFT:
                    spin--;
                    break;
                case Keyboard.RIGHT:
                    spin++;
                    break;
                case Keyboard.UP:
                    pull++;
                    break;
                case Keyboard.DOWN:
                    pull--;
                    break;
                case Keyboard.KEY_S:
                    spin = 0;
                    pull = 0;
                    break;
                default:
                    return;
            }
            event.preventDefault();
            this.wormhole.directionX = Math.max(-5, Math.min(5, spin));
            this.wormhole.directionY = Math.max(-5, Math.min(5, pull));
        });
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.wormhole.render(framebuffer, time);
    }

}
