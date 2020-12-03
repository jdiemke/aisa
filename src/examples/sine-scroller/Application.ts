import { Canvas } from '../../Canvas';
import { SineScrollerScene } from './SineScrollerScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new SineScrollerScene());
        canvas.init();
    }

}

Application.main();
