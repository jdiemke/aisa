import { Framebuffer } from '@engine/rendering/Framebuffer';
import { TorusKnotTunnelScene } from '@examples/torus-knot-tunnel/TorusKnotTunnelScene';

export class Scene13 {
    private TorusKnotTunnelScene: TorusKnotTunnelScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.TorusKnotTunnelScene = new TorusKnotTunnelScene();

        return Promise.all([
            this.TorusKnotTunnelScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.TorusKnotTunnelScene.render(framebuffer, time);
    }

}