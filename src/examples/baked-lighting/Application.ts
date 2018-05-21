import { Canvas } from '../../Canvas';
import { BakedLighting } from './BakedLighting';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BakedLighting());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
