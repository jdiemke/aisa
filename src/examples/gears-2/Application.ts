import { Canvas } from '../../Canvas';
import { Gears2Scene } from './Gears2Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Gears2Scene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
