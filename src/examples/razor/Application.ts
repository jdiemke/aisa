import { Canvas } from '../../Canvas';
import { RazorScene } from './RazorScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new RazorScene());
        canvas.init();
    }

}

Application.main();
