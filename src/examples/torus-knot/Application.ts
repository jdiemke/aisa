import { Canvas } from '../../Canvas';
import { TorusKnotScene } from './TorusKnotScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TorusKnotScene());
        canvas.init();
    }

}

Application.main();
