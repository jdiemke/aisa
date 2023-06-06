import { Canvas } from '../../Canvas';
import { FogScene } from './FogScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FogScene());
        canvas.init();
    }

}

Application.main();
