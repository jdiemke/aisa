import { Canvas } from '../../Canvas';
import { DemoScene } from './DemoScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new DemoScene());
        canvas.init();
    }

}

Application.main();
