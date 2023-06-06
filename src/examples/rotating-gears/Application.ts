import { Canvas } from '../../Canvas';
import { RotatingGearsScene } from './RotatingGearsScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RotatingGearsScene());
        canvas.init();
    }

}

Application.main();
