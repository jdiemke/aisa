import { Canvas } from '../../Canvas';
import { PlaneDeformationScene } from './PlaneDeformationScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlaneDeformationScene());
        canvas.init();
    }

}

Application.main();
