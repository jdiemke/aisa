import { Canvas } from '../../Canvas';
import { StarfieldScene } from './StarfieldScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new StarfieldScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
