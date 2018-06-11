import { Canvas } from '../../Canvas';
import { FrustumCullingScene } from './FrustumCullingScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FrustumCullingScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
