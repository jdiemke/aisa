import { Canvas } from '../../Canvas';
import { ParticleTorusScene } from './ParticleTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new ParticleTorusScene());
        canvas.init();
    }

}

Application.main();
