import { Canvas } from '../../Canvas';
import { TwisterScene } from './TwisterScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TwisterScene());
        canvas.init();
    }

}

Application.main();
