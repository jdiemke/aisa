import { Canvas } from '@platform/browser';
import { WavefrontScene } from './WavefrontScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WavefrontScene());
        canvas.init();
    }

}

new Application().main();
