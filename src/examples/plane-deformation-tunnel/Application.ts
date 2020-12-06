import { Canvas } from '../../Canvas';
import { PlaneDeformationTunnelScene } from './PlaneDeformationTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlaneDeformationTunnelScene());
        canvas.init();
    }

}

Application.main();
