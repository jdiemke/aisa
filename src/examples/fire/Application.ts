import { Canvas } from '../../Canvas';
import { FireScene } from './FireScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new FireScene());
        canvas.init();
    }

}

Application.main();
