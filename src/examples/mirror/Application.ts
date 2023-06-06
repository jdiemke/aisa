import { Canvas } from '../../Canvas';
import { MirrorScene } from './MirrorScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MirrorScene());
        canvas.init();
    }

}

Application.main();
