import { Color } from '../../core/Color';
import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { ThirdPersonCameraScene } from '../third-person-camera/ThirdPersonCameraScene';

export class FogScene extends AbstractScene {

    private scene: ThirdPersonCameraScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new ThirdPersonCameraScene();
        return Promise.all([
            this.scene.init(framebuffer)
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(framebuffer: Framebuffer, time: number): void {
        this.scene.render(framebuffer);
        framebuffer.drawFog(new Color(10,25,10,45),0.04, 0);
    }


}
