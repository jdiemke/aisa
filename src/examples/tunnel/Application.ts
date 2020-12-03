import { Canvas } from '../../Canvas';
import { PlanedeformationTunnelScene } from './PlanedeformationTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlanedeformationTunnelScene());
        canvas.init();
    }

}

Application.main();
