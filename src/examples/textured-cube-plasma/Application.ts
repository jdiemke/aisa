import { Canvas } from '../../Canvas';
import { TexturedCubePlasmaScene } from './TexturedCubePlasmaScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TexturedCubePlasmaScene());
        canvas.init();
    }

}

Application.main();
