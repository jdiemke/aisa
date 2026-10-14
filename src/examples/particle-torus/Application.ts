import { Canvas } from '@platform/browser';
import { ParticleTorusScene } from './ParticleTorusScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleTorusScene());
        canvas.init();
    }

}

Application.main();
