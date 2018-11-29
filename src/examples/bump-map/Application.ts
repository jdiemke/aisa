import { Canvas } from '../../Canvas';
import { BumpMapScene } from './BumpMapScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BumpMapScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
