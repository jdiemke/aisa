import { Canvas } from '../../Canvas';
import { TunnelScene } from './TunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TunnelScene());
        canvas.init();
    }

}

Application.main();
