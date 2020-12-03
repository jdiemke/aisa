import { Canvas } from '../../Canvas';
import { MovingTorusScene } from './MovingTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new MovingTorusScene());
        canvas.init();
    }

}

Application.main();
