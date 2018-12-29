import { Canvas } from '../../Canvas';
import { FloorScene } from './FloorScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FloorScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
