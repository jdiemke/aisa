import { Canvas } from '../../Canvas';
import { ParallaxScrollingScene } from './ParallaxScrollingScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new ParallaxScrollingScene());
        canvas.init();
    }

}

Application.main();
