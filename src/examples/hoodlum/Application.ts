import { Canvas } from '../../Canvas';
import { HoodlumScene } from './HoodlumScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new HoodlumScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
