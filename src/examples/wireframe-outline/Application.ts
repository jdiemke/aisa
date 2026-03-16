import { Canvas } from '../../Canvas';
import { WireframeOutlineScene } from './WireframeOutlineScene';

class Application {
    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WireframeOutlineScene());
        canvas.init();
    }
}

Application.main();
