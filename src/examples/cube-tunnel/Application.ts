import { Canvas } from '../../Canvas';
import { CubeTunnelScene } from './CubeTunnelScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new CubeTunnelScene());
        canvas.init();
    }

}

Application.main();
