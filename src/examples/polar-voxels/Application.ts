import { Canvas } from '../../Canvas';
import { PolarVoxelsScene } from './PolarVoxelsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(300, 200, new PolarVoxelsScene());
        canvas.init();
    }

}

Application.main();
