import { Canvas } from '../../Canvas';
import { WaveFrontTextureScene } from './WaveFrontTextureScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new WaveFrontTextureScene());
        canvas.init();
    }

}

Application.main();
