import { Canvas } from '../../Canvas';
import { DemoScene } from './DemoScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new DemoScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
