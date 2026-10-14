import { Canvas } from '@platform/browser';
import { ThirdPersonCameraScene } from './ThirdPersonCameraScene';

import '../../default-style.css';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ThirdPersonCameraScene());
        canvas.init();
    }

}

new Application().main();
