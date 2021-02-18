import { Canvas } from '../../Canvas';
import { ParticleStreamsScene } from './ParticleStreamsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleStreamsScene());
        canvas.init();
    }

}

Application.main();
