import { Framebuffer } from '../../Framebuffer';
import { Utils } from '../../core/Utils';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { PlaneDeformationTunnelScene } from '../plane-deformation-tunnel/PlaneDeformationTunnelScene';
import { PlasmaScene } from '../plasma/PlasmaScene';

/**
 * TODO: extract lens into effect class
 */
export class Bobs extends AbstractScene {

    private texture5: Texture;
    private texture7: Texture;
    private scene: PlaneDeformationTunnelScene;

    public init(framebuffer): Promise<any> {
        this.scene = new PlaneDeformationTunnelScene();
        return Promise.all([
            this.scene.init(framebuffer),
            TextureUtils.load(require('../../assets/pattern.png'), false).then(
                (texture: Texture) => this.texture5 = texture
            ),
            TextureUtils.load(require('../../assets/ball2.png'), true).then(
                (texture: Texture) => this.texture7 = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.scene.PlaneDeformationScene.render(framebuffer, time);
        time = time *0.5;
        //framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.texture5.texture);

       const scale = Math.sin(time * 0.0002)*3;
       const scale2 = 1.7;
        this.texture5.setClamp(false);
        for(let y = 0; y < 200; y++) {
            for(let x = 0; x < 320; x++) {
                const xoff =time*0.13 +  Math.cos(time*0.006+y*0.03) *18;
                const yoff =time*0.15 +  Math.sin(time*0.006+x*0.03) *38;


                const texturePixel =this.texture5.getBilinearFilteredPixel2(x*scale2+xoff-10, y*scale2+yoff-10);
                const framebufferPixel =framebuffer.framebuffer[x + y * 320];
                const alpha =((texturePixel>>24)&0xff)/255;
                const inverseAlpha = 1 - alpha;
                const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                framebuffer.framebuffer[x + y * 320]= r | (g << 8) | (b << 16) | (255 << 24);
            }
        }
    }

}
