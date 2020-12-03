import { Canvas } from '../../Canvas';
import { TexturedTorusScene } from './TexturedTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TexturedTorusScene());
        canvas.init();
    }

}

Application.main();
