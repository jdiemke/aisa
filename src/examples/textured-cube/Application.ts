import { Canvas } from '../../Canvas';
import { TexturedCubeScene } from './TexturedCubeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TexturedCubeScene());
        canvas.init();
    }

}

Application.main();
