import { Canvas } from '../../Canvas';
import { BunnyScene } from './BunnyScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new BunnyScene());
        canvas.init();
    }

}

Application.main();
