import { Canvas } from '../../Canvas';
import { MovingTorusScene } from './MovingTorusScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MovingTorusScene());
        canvas.init();
    }

}

Application.main();
