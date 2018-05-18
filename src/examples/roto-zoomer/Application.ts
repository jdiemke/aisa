import { Canvas } from '../../Canvas';
import { RotoZoomerScene } from './RotoZoomerScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RotoZoomerScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
