import { Canvas } from '../../Canvas';
import { TwisterScene } from './TwisterScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TwisterScene());
        canvas.init();
    }

}

Application.main();
