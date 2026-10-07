import { Canvas } from '../../Canvas';
import { BumpMapScene } from './BumpMapScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BumpMapScene());
        canvas.init();
    }

}

Application.main();
