import { Canvas } from '../../Canvas';
import { BakedLighting } from './BakedLighting';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new BakedLighting());
        canvas.init();
    }

}

Application.main();
