import { Canvas } from '../../Canvas';
import { WavefrontScene } from './Md2ModelScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WavefrontScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
