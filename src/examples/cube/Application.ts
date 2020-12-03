import { Canvas } from '../../Canvas';
import { CubeScene } from './CubeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new CubeScene());
        canvas.init();
    }

}

Application.main();
