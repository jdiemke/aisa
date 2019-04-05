import { Canvas } from '../../Canvas';
import { ParticleTorusScene } from './ParticleTorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParticleTorusScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
