import { Canvas } from '../../Canvas';
import { LedPlasmaScene } from './LedPlasmaScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new LedPlasmaScene());
        canvas.init();
    }

}

Application.main();
