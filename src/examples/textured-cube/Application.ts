import { Canvas } from '../../Canvas';
import { TexturedTorusScene } from './TexturedTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TexturedTorusScene());
        canvas.init();
    }

}

Application.main();
