import { Canvas } from '../../Canvas';
import { RotatingGearsScene } from './RotatingGearsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new RotatingGearsScene());
        canvas.init();
    }

}

Application.main();
