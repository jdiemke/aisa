import { Canvas } from '../../Canvas';
import { CubeScene } from './CubeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new CubeScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
