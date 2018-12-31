import { Canvas } from '../../Canvas';
import { ScrollingBackgroundScene } from './ScrollingBackgroundScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ScrollingBackgroundScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
