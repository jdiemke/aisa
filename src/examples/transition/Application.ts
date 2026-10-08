import { Canvas } from '../../Canvas';
import { TransitionScene } from './TransitionScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TransitionScene());
        canvas.init();
    }

}

Application.main();
