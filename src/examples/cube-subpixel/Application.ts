import { Canvas } from '../../Canvas';
import { SubPixelCubeScene } from './SubPixelCubeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new SubPixelCubeScene());
        canvas.init();
    }

}

Application.main();
