import { Canvas } from '../../Canvas';
import { AbstractCubeScene } from './AbstractCubeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new AbstractCubeScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
