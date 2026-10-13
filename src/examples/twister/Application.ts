import { Canvas } from '@platform/browser';
import { TwisterScene } from './TwisterScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TwisterScene());
        canvas.init();
    }

}

Application.main();
