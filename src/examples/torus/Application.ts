import { Canvas } from '../../Canvas';
import { TorusScene } from './TorusScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TorusScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
