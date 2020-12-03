import { Canvas } from '../../Canvas';
import { PlaneDeformationAbstractScene } from './PlaneDeformationAbstractScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlaneDeformationAbstractScene());
        canvas.init();
    }

}

Application.main();
