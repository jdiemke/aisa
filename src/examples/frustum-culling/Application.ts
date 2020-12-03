import { Canvas } from '../../Canvas';
import { FrustumCullingScene } from './FrustumCullingScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new FrustumCullingScene());
        canvas.init();
    }

}

Application.main();
