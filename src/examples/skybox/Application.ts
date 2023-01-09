import { Canvas } from '../../Canvas';
import { MetalHeadzScene } from './MetalHeadzScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MetalHeadzScene());
        canvas.init();
    }

}

new Application().main();
