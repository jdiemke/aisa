import { Canvas } from '../../Canvas';
import { PlaneDeformationFloorScene } from './PlaneDeformationFloorScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlaneDeformationFloorScene());
        canvas.init();
    }

}

Application.main();
