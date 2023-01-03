import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { ThirdPersonCameraScene } from '../third-person-camera/ThirdPersonCameraScene';

export class TitanEffectScene extends AbstractScene {

  
    private scene: ThirdPersonCameraScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new ThirdPersonCameraScene();
        return Promise.all([
            this.scene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.scene.render(framebuffer);
        framebuffer.drawFog(new Color(10,25,10,45),0.04, 0);
    }


}
