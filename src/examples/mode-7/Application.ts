import { Canvas } from '../../Canvas';
import { Mode7Scene } from './Mode7Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new Mode7Scene());
        canvas.init();
    }

}

Application.main();
