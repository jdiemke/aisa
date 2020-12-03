import { Canvas } from '../../Canvas';
import { ParticleSystemScene } from './ParticleSystemScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new ParticleSystemScene());
        canvas.init();
    }

}

Application.main();
