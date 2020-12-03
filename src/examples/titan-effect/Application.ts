import { Canvas } from '../../Canvas';
import { TitanEffectScene } from './TitanEffectScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new TitanEffectScene());
        canvas.init();
    }

}

Application.main();
