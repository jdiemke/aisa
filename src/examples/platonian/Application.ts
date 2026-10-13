import { Canvas } from '@platform/browser';
import { PlatonianScene } from './PlatonianScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlatonianScene());
        canvas.init();
    }

}

Application.main();
