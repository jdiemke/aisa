import { Canvas } from '../../Canvas';
import { GearsScene2 } from './GearsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new GearsScene2());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
