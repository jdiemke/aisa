import { Canvas } from '../../Canvas';
import { CinematicScroller } from './CinematicScroller';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new CinematicScroller());
        canvas.init();
    }

}

Application.main();
