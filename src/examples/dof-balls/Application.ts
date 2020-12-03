import { Canvas } from '../../Canvas';
import { DofBallsScene } from './DofBallsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new DofBallsScene());
        canvas.init();
    }

}

Application.main();
