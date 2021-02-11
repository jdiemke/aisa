import { Canvas } from '../../Canvas';
import { BlenderCameraScene } from './WavefrontScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new BlenderCameraScene());
        canvas.init();
    }

}

new Application().main();
