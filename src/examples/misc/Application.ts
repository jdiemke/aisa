import { Canvas } from '../../Canvas';
import { Scene } from './Scene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Scene());
        canvas.init();
    }

}

Application.main();
