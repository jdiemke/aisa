import { Canvas } from '@platform/browser';
import { ScrollingBackgroundScene } from './ScrollingBackgroundScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ScrollingBackgroundScene());
        canvas.init();
    }

}

Application.main();
