import { Canvas } from '../../Canvas';
import { WobbleScene } from './WobbleScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WobbleScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
