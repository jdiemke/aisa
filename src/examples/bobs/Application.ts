import { Canvas } from '../../Canvas';
import { BobScene } from './BobScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BobScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
