import { Canvas } from '@platform/browser';
import { TextZoomScene } from './TextZoomScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TextZoomScene());
        canvas.init();
    }

}

Application.main();
