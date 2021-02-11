import { Framebuffer } from '../../../Framebuffer';
import { TorusKnotTunnelScene } from '../../torus-knot-tunnel/TorusKnotTunnelScene';

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