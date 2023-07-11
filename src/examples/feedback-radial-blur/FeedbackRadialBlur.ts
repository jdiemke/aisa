import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture';
import { TorusKnotTunnelScene } from '../torus-knot-tunnel/TorusKnotTunnelScene';

export class FeedbackRadialBlur extends AbstractScene {

    private tunnelScene: TorusKnotTunnelScene = new TorusKnotTunnelScene();
    private accumulationBuffer: Uint32Array;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.accumulationBuffer = new Uint32Array(framebuffer.width * framebuffer.height);

        return Promise.all([
            this.tunnelScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.tunnelScene.render(framebuffer, time);
        this.applyRadialBlur(framebuffer, time);
    }

    public applyRadialBlur(framebuffer: Framebuffer, time: number): void {
        const texture: Texture = new Texture();

        texture.texture = this.accumulationBuffer;
        texture.width = framebuffer.width;
        texture.height = framebuffer.height;

        const scaleX = 1.018;
        const scaleY = 1.018;
        const width = framebuffer.width * scaleX;
        const height = framebuffer.height* scaleY;

        const alphaScale = (Math.sin(time * 0.00005) * 0.5) + 0.5;

        framebuffer.drawScaledTextureClipBi(
            Math.round(framebuffer.width / 2 - width / 2),
            Math.round(framebuffer.height / 2 - height / 2),
            width, height, texture, 1.0 * alphaScale
        );

        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }

}
