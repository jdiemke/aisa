import { Canvas } from '../../Canvas';
import { GearsScene } from './GearsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new GearsScene());
        canvas.init();
    }

}

Application.main();
