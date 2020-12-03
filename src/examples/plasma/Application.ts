import { Canvas } from '../../Canvas';
import { PlasmaScene } from './PlasmaScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlasmaScene());
        canvas.init();
    }

}

Application.main();
