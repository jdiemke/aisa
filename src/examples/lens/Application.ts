import { Canvas } from '../../Canvas';
import { LensScene } from './LensScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new LensScene());
        canvas.init();
    }

}

Application.main();
