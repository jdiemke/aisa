import { Canvas } from '@platform/browser';
import { SubPixelScene } from './SubPixelScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new SubPixelScene());
        canvas.init();
    }

}

Application.main();
