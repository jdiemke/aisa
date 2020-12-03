import { Canvas } from '../../Canvas';
import { TorusKnotTunnelScene } from './TorusKnotTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TorusKnotTunnelScene());
        canvas.init();
    }

}

Application.main();
