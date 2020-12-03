import { Canvas } from '../../Canvas';
import { PixelEffectScene } from './PixelEffectScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PixelEffectScene());
        canvas.init();
    }

}

Application.main();
