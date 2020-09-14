import { Canvas } from '../../Canvas';
import { Scene } from './Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Scene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
