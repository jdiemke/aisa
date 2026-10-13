import { Canvas } from '@platform/browser';
import { WireframeOutlineScene } from './WireframeOutlineScene';
class Application {

    public static main(): void {
        const scene = new WireframeOutlineScene();
        const canvas: Canvas = new Canvas(320, 200, scene);
        canvas.init();
    }

}

Application.main();
