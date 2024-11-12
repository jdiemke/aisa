import { Canvas } from '../../Canvas';
import { MatterScene } from './MatterScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MatterScene());
        canvas.init();
    }

}

Application.main();
