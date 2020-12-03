import { Canvas } from '../../Canvas';
import { MetaballsScene } from './MetaballsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new MetaballsScene());
        canvas.init();
    }

}

Application.main();
