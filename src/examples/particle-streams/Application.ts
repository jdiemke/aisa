import { Canvas } from '../../Canvas';
import { ParticleStreamsScene } from './ParticleStreamsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new ParticleStreamsScene());
        canvas.init();
    }

}

Application.main();
