import { Canvas } from '../../Canvas';
import { GLBScene } from './GLBScene';

class Application {
    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new GLBScene());
        canvas.init();
    }
}

Application.main();
