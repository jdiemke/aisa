import { Canvas } from '../../Canvas';
import { DistortedSphereScene } from './DistortedSphereScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new DistortedSphereScene());
        canvas.init();
    }

}

Application.main();
