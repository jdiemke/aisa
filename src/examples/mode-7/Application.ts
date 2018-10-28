import { Canvas } from '../../Canvas';
import { Mode7Scene } from './Mode7Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Mode7Scene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
