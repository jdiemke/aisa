import { Canvas } from '../../Canvas';
import { BlockFade } from './BlockFade';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new BlockFade());
        canvas.init();
    }

}

Application.main();
