import { Canvas } from '../../Canvas';
import { RotatingGearsScene } from './RotatingGearsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RotatingGearsScene());
        canvas.init();
    }

}

Application.main();
