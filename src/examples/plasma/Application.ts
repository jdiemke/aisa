import { Canvas } from '../../Canvas';
import { PlasmaScene } from './PlasmaScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlasmaScene());
        canvas.init();
    }

}

Application.main();
