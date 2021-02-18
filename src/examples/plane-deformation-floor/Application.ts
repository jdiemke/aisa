import { Canvas } from '../../Canvas';
import { PlaneDeformationFloorScene } from './PlaneDeformationFloorScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlaneDeformationFloorScene());
        canvas.init();
    }

}

Application.main();
