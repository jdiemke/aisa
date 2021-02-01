import { Canvas } from '../../Canvas';
import { WavefrontScene } from './WavefrontScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new WavefrontScene());
        canvas.init();
    }

}

new Application().main();
