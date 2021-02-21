import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture';
import { TorusKnotScene } from '../torus-knot/TorusKnotScene';

export class RadialBlur extends AbstractScene {

    private tunnelScene: TorusKnotScene = new TorusKnotScene();
    public tmpGlitch: Uint32Array;
    private texture = new Texture();
    
    public init(framebuffer: Framebuffer): Promise<any> {
        this.tmpGlitch = new Uint32Array(framebuffer.width * framebuffer.height);

        return Promise.all([
            this.tunnelScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.tunnelScene.render(framebuffer, time);
        this.applyRadialBlur(framebuffer, time);
    }

    private applyRadialBlur(framebuffer: Framebuffer, time: number): void {
        
        framebuffer.fastFramebufferCopy(this.tmpGlitch, framebuffer.framebuffer);
        const intensity: number = (Math.sin(time * 0.0002) * 0.5 + 0.5)* 4;
        this.texture.texture = this.tmpGlitch;
        this.texture.width = framebuffer.width;
        this.texture.height = framebuffer.height;
        let width = framebuffer.width;
        let height = framebuffer.height;
        for (let i = 0; i < 15; i++) {
            width += framebuffer.width * 0.03+i*0.4;
            height += framebuffer.height * 0.03+i*0.4;
            framebuffer.scaleClipBlitter.drawScaledTextureClip(
                framebuffer.width / 2 - width / 2,
                framebuffer.height / 2 - height / 2,
                width, height, this.texture, 0.0+ intensity * 0.19* (14- i) / 14);
                framebuffer.fastFramebufferCopy(this.tmpGlitch, framebuffer.framebuffer);
        }
    }

}
