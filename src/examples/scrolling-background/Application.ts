import { Canvas } from '../../Canvas';
import { ScrollingBackgroundScene } from './ScrollingBackgroundScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new ScrollingBackgroundScene());
        canvas.init();
    }

}

Application.main();
