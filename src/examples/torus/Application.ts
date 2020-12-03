import { Canvas } from '../../Canvas';
import { TorusScene } from './TorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TorusScene());
        canvas.init();
    }

}

Application.main();
