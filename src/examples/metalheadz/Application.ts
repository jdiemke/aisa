import { Canvas } from '@platform/browser';
import { MetalHeadzScene } from './MetalHeadzScene';

import '../../default-style.css';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MetalHeadzScene());
        canvas.init();
    }

}

new Application().main();
