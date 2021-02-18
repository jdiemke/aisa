import { Canvas } from '../../Canvas';
import { BunnyScene } from './BunnyScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BunnyScene());
        canvas.init();
    }

}

Application.main();
