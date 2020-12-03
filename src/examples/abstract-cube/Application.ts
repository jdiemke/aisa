import { Canvas } from '../../Canvas';
import { AbstractCube } from './AbstractCube';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new AbstractCube());
        canvas.init();
    }

}

Application.main();
