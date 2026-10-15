import { Fog } from '@effects/fog/Fog';
import { Color, AbstractScene } from '@core';
import { Framebuffer } from '@engine/rendering/Framebuffer';
import { ThirdPersonCameraScene } from '@examples/third-person-camera/ThirdPersonCameraScene';

export class FogScene extends AbstractScene {

    private scene: ThirdPersonCameraScene;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.scene = new ThirdPersonCameraScene();
        return Promise.all([
            this.scene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.scene.render(framebuffer);
        Fog.drawFog(framebuffer, new Color(10,25,10,45),0.04, 0);
    }


}
