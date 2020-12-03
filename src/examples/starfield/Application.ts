import { Canvas } from '../../Canvas';
import { StarfieldScene } from './StarfieldScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new StarfieldScene());
        canvas.init();
    }

}

Application.main();
