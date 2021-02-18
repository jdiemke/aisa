import { Canvas } from '../../Canvas';
import { PixelEffectScene } from './PixelEffectScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PixelEffectScene());
        canvas.init();
    }

}

Application.main();
