import { Framebuffer } from '../../../Framebuffer';
import { PlasmaScene } from '../../plasma/PlasmaScene';

export class Scene10 {
    private PlasmaScene: PlasmaScene;
    public init(framebuffer: Framebuffer): Promise<any> {

        this.PlasmaScene = new PlasmaScene();

        return Promise.all([
            this.PlasmaScene.init(framebuffer),
        ])
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlasmaScene.render(framebuffer, time);
    }

}