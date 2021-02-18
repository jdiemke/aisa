import { Canvas } from '../../Canvas';
import { PlaneDeformationTunnelScene } from './PlaneDeformationTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlaneDeformationTunnelScene());
        canvas.init();
    }

}

Application.main();
