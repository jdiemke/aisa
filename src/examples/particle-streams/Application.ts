import { Canvas } from '@platform/browser';
import { ParticleStreamsScene } from './ParticleStreamsScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleStreamsScene());
        canvas.init();
    }

}

Application.main();
