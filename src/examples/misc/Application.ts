import { Canvas } from '../../Canvas';
import { Scene } from './Scene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new Scene());
        canvas.init();
    }

}

Application.main();
