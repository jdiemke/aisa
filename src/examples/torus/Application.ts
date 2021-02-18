import { Canvas } from '../../Canvas';
import { TorusScene } from './TorusScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TorusScene());
        canvas.init();
    }

}

Application.main();
