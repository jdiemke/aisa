import { Canvas } from '../../Canvas';
import { LedPlasmaScene } from './LedPlasmaScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new LedPlasmaScene());
        canvas.init();
    }

}

Application.main();
