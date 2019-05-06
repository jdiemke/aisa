import { Canvas } from '../../Canvas';
import { MovingTorusScene } from './MovingTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MovingTorusScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
