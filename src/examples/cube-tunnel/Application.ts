import { Canvas } from '../../Canvas';
import { CubeTunnelScene } from './CubeTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new CubeTunnelScene());
        canvas.init();
    }

}

Application.main();
