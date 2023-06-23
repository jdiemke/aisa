import { Canvas } from '../../Canvas';
import { Bobs } from './Bobs';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Bobs());
        canvas.init();
    }

}

Application.main();
