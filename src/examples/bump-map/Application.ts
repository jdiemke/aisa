import { Canvas } from '../../Canvas';
import { BumpMap } from './BumpMap';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new BumpMap());
        canvas.init();
    }

}

Application.main();
