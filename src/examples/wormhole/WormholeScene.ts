import { Wormhole } from '@effects/wormhole/Wormhole';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';

export class WormholeScene extends AbstractScene {

    private wormhole = new Wormhole();

    public init(framebuffer: Framebuffer): Promise<void> {
        return this.wormhole.init(framebuffer);
    }

    public onInit(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            let spin = this.wormhole.directionX;
            let pull = this.wormhole.directionY;
            switch (event.key) {
                case 'ArrowLeft': spin--; break;
                case 'ArrowRight': spin++; break;
                case 'ArrowUp': pull++; break;
                case 'ArrowDown': pull--; break;
                case 's':
                case 'S':
                    spin = 0;
                    pull = 0;
                    break;
                default: return;
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
