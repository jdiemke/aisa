import { Canvas } from '../../Canvas';
import { RazorScene } from './RazorScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RazorScene());
        canvas.init();
    }

}

Application.main();
