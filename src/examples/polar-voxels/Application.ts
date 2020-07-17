import { Canvas } from '../../Canvas';
import { PolarVoxelsScene } from './PolarVoxelsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PolarVoxelsScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
