import { Canvas } from '../../Canvas';
import { ParticleWavesScene } from './ParticleWavesScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleWavesScene());
        canvas.init();
    }

}

Application.main();
