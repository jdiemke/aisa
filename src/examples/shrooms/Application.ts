import { Canvas } from '../../Canvas';
import { Shrooms } from './Shrooms';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Shrooms());
        canvas.init();
    }

}

Application.main();
