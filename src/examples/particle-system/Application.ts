import { Canvas } from '../../Canvas';
import { ParticleSystemScene } from './ParticleSystemScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleSystemScene());
        canvas.init();
    }

}

Application.main();
