import { Canvas } from '../../Canvas';
import { GlowScene } from './GlowScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new GlowScene());
        canvas.init();
    }

}

Application.main();
