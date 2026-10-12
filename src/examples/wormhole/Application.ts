import { Canvas } from '../../Canvas';
import { WormholeScene } from './WormholeScene';

import '../../default-style.css';

class Application {

    public static main(): void {
        const canvas = new Canvas(320, 200, new WormholeScene());
        canvas.init();
    }
}

Application.main();
