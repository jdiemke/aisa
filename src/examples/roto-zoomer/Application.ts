import { Canvas } from '../../Canvas';
import { RotoZoomerScene } from './RotoZoomerScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new RotoZoomerScene());
        canvas.init();
    }

}

Application.main();
