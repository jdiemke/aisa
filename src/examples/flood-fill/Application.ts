import { Canvas } from '../../Canvas';
import { FloodFillScene } from './FloodFillScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new FloodFillScene());
        canvas.init();
    }

}

Application.main();
