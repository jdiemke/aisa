import { Canvas } from '../../Canvas';
import { ParticleWavesScene } from './ParticleWavesScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleWavesScene());
        canvas.init();
    }

}

Application.main();
