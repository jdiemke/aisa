import { Canvas } from '../../Canvas';
import { HoodlumScene } from './HoodlumScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new HoodlumScene());
        canvas.init();
    }

}

Application.main();
