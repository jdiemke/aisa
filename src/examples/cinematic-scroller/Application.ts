import { Canvas } from '../../Canvas';
import { CinematicScroller } from './CinematicScroller';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new CinematicScroller());
        canvas.init();
    }

}

Application.main();
