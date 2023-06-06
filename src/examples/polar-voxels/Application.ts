import { Canvas } from '../../Canvas';
import { PolarVoxelsScene } from './PolarVoxelsScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(300, 200, new PolarVoxelsScene());
        canvas.init();
    }

}

Application.main();
