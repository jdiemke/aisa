import { Canvas } from '../../Canvas';
import { GLBAnimationScene } from './GLBAnimationScene';

class Application {
    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new GLBAnimationScene());
        canvas.init();
    }
}

Application.main();
