import { Canvas } from '@platform/browser';
import { Scene } from './Scene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Scene());
        canvas.init();
    }

}

Application.main();
