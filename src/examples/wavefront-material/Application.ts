import { Canvas } from '../../Canvas';
import { WavefrontMaterialScene } from './WavefrontMaterialScene';

class Application {
    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WavefrontMaterialScene());
        canvas.init();
    }
}

Application.main();
