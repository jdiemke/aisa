import { Canvas } from '../../Canvas';
import { DofBallsScene } from './DofBallsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new DofBallsScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
