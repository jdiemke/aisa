import { Canvas } from '../../Canvas';
import { DifferentMd2ModelScene } from './DifferentMd2ModelScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new DifferentMd2ModelScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
