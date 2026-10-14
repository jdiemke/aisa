import { Canvas } from '@platform/browser';
import { MetaballsScene } from './MetaballsScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MetaballsScene());
        canvas.init();
    }

}

Application.main();
