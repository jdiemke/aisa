import { Canvas } from '@platform/browser';
import { RotoZoomDemoScene } from './RotoZoomDemoScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RotoZoomDemoScene());
        canvas.init();
    }

}

Application.main();
