import { Canvas } from '../../Canvas';
import { ToxicDotsScene } from './ToxicDotsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ToxicDotsScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
