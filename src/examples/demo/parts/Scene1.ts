import { Framebuffer } from '../../../Framebuffer';
import { PlaneDeformationScene } from '../../plane-deformation/PlaneDeformationScene';

// sideways 3D office scene
export class Scene1 {
    private PlaneDeformationFloorScene: PlaneDeformationScene;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.PlaneDeformationFloorScene = new PlaneDeformationScene(8, require('../../../assets/ground.png'));

        return Promise.all([
            this.PlaneDeformationFloorScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationFloorScene.drawPlaneDeformation(framebuffer, 0, time >> 3);
    }

}
