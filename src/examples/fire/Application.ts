import { Canvas } from '../../Canvas';
import { FireScene } from './FireScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FireScene());
        canvas.init();
    }

}

Application.main();
