import { Canvas } from '../../Canvas';
import { HoodlumScene } from './HoodlumScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new HoodlumScene());
        canvas.init();
    }

}

Application.main();
