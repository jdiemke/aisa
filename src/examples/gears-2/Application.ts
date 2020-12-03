import { Canvas } from '../../Canvas';
import { Gears2Scene } from './Gears2Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new Gears2Scene());
        canvas.init();
    }

}

Application.main();
