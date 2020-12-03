import { Canvas } from '../../Canvas';
import { PolarVoxelsScene } from './PolarVoxelsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PolarVoxelsScene());
        canvas.init();
    }

}

Application.main();
