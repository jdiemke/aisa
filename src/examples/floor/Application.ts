import { Canvas } from '../../Canvas';
import { FloorScene } from './FloorScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new FloorScene());
        canvas.init();
    }

}

Application.main();
