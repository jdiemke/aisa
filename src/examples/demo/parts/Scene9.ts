import { Framebuffer } from '../../../Framebuffer';
import { BlenderCameraScene } from '../../blender-camera-animation/WavefrontScene';
export class Scene9 {
    private BlenderCameraScene: BlenderCameraScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.BlenderCameraScene = new BlenderCameraScene();

        return Promise.all([
            this.BlenderCameraScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.clearColorBuffer(0);
        framebuffer.clearDepthBuffer();
        this.BlenderCameraScene.render(framebuffer, time);
    }

}