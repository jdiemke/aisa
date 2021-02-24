import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';
import { RotoZoomerScene } from '../roto-zoomer/RotoZoomerScene';
import { Color } from '../../core/Color';
import { CubeScene } from '../cube/CubeScene';

export class RotoZoomDemoScene extends AbstractScene {

    private logoTexture: Texture;
    private zoomer: RotoZoomerScene = new RotoZoomerScene();
    private cube: CubeScene = new CubeScene();
    
    fbo2: Framebuffer = new Framebuffer(214,188);
    public init(framebuffer: Framebuffer): Promise<any> {
        

        return Promise.all([
           this.zoomer.init(framebuffer),
            this.cube.init(this.fbo2)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
       const fbo: Framebuffer = new Framebuffer(90,60);
        
        const texture: Texture = new Texture(fbo.framebuffer, 90,60);
        this.zoomer.render(fbo, time*0.5);

     
        const texture2: Texture = new Texture(this.fbo2.framebuffer, 214, 188);
        this.cube.render(this.fbo2, time);

        framebuffer.clearColorBuffer(Color.WHITE.toPackedFormat());

        framebuffer.drawTextureColorized(6,6, texture, new Color(255,160,160,255));
        framebuffer.drawTextureColorized(6,6 + 60 +4, texture, new Color(160,255,160,255));
        framebuffer.drawTextureColorized(6,6 + (60 +4)*2, texture, new Color(160,160,255,255));

        framebuffer.drawTextureColorized(320-214-6,6, texture2, new Color(255,250,255,255));
        
        //framebuffer.addReflections();
    }

}
