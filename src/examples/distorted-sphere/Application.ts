import { Canvas } from '../../Canvas';
import { DistortedSphereScene } from './DistortedSphereScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new DistortedSphereScene());
        canvas.init();
    }

}

Application.main();
