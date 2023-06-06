import { Canvas } from '../../Canvas';
import { PortalScene } from './PortalScene';

import './../../default-style.css';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PortalScene());
        canvas.init();
    }

}

new Application().main();
