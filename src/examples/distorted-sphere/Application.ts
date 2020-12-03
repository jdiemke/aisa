import { Canvas } from '../../Canvas';
import { DistortedSphereScene } from './DistortedSphereScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new DistortedSphereScene());
        canvas.init();
    }

}

Application.main();
