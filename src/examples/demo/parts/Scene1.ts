import { Framebuffer } from '../../../Framebuffer';
import { PlaneDeformationScene } from '../../plane-deformation/PlaneDeformationScene';

// sideways 3D office scene
export class Scene1 {
    private PlaneDeformationFloorScene = new PlaneDeformationScene(8, require('../../../assets/ground.png'));

    public init(framebuffer: Framebuffer): Promise<any> {

        return Promise.all([
            this.PlaneDeformationFloorScene.init(framebuffer)
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        this.PlaneDeformationFloorScene.drawPlaneDeformation(framebuffer, 0, time >> 3);
    }

}
