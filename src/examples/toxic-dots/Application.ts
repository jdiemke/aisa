import { Canvas } from '../../Canvas';
import { ToxicDotsScene } from './ToxicDotsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new ToxicDotsScene());
        canvas.init();
    }

}

Application.main();
