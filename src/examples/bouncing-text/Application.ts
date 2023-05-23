import { Canvas } from '../../Canvas';
import { BouncingTextScene } from './BouncingTextScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BouncingTextScene());
        canvas.init();
    }

}

Application.main();
