import { Canvas } from '../../Canvas';
import { BilinearZoom } from './BilinearZoom';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BilinearZoom());
        canvas.init();
    }

}

Application.main();
