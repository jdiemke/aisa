import { Canvas } from '../../Canvas';
import { FloodFillScene } from './FloodFillScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new FloodFillScene());
        canvas.init();
    }

}

Application.main();
