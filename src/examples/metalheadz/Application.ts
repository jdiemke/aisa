import { Canvas } from '../../Canvas';
import { MetalHeadzScene } from './MetalHeadzScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new MetalHeadzScene());
        canvas.init();
    }

}

new Application().main();
