import { Canvas } from '@platform/browser';
import { ToxicDotsScene } from './ToxicDotsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ToxicDotsScene());
        canvas.init();
    }

}

Application.main();
