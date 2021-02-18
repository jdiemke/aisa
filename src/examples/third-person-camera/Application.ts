import { Canvas } from '../../Canvas';
import { ThirdPersonCameraScene } from './ThirdPersonCameraScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ThirdPersonCameraScene());
        canvas.init();
    }

}

new Application().main();
