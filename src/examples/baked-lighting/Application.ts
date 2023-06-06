import { Canvas } from '../../Canvas';
import { BakedLighting } from './BakedLighting';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BakedLighting());
        canvas.init();
    }

}

Application.main();
