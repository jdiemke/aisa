import { Canvas } from '../../Canvas';
import { CubeScene } from './CubeScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new CubeScene());
        canvas.init();
    }

}

Application.main();
