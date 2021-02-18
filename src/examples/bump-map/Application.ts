import { Canvas } from '../../Canvas';
import { BumpMap } from './BumpMap';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BumpMap());
        canvas.init();
    }

}

Application.main();
