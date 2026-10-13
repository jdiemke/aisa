import { Canvas } from '@platform/browser';
import { StarfieldScene } from './StarfieldScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new StarfieldScene());
        canvas.init();
    }

}

Application.main();
