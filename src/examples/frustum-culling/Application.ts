import { Canvas } from '../../Canvas';
import { FrustumCullingScene } from './FrustumCullingScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FrustumCullingScene());
        canvas.init();
    }

}

Application.main();
