import { Canvas } from '../../Canvas';
import { VuMeterScene } from './VuMeterScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new VuMeterScene());
        canvas.init();
    }

}

Application.main();
