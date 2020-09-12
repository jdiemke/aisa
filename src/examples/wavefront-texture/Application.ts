import { Canvas } from '../../Canvas';
import { WaveFrontTextureScene } from './WaveFrontTextureScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WaveFrontTextureScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
