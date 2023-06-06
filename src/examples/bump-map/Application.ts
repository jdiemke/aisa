import { Canvas } from '../../Canvas';
import { BumpMap } from './BumpMap';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BumpMap());
        canvas.init();
    }

}

Application.main();
