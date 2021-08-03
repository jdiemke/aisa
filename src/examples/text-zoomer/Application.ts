import { Canvas } from '../../Canvas';
import { TextZoomerScene } from './TextZoomerScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TextZoomerScene());
        canvas.init();
    }

}

Application.main();
