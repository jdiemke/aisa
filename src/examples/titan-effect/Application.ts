import { Canvas } from '@platform/browser';
import { TitanEffectScene } from './TitanEffectScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TitanEffectScene());
        canvas.init();
    }

}

Application.main();
