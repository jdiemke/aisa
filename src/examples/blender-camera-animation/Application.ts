import { Canvas } from '../../Canvas';
import { BlenderCameraScene } from './BlenderCameraScene';

import './../../default-style.css';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BlenderCameraScene());
        canvas.init();
    }

}

new Application().main();
