import { Canvas } from '../../Canvas';
import { Bobs } from './Bobs';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new Bobs());
        canvas.init();
    }

}

Application.main();
