import { Canvas } from '../../Canvas';
import { PsychadelicPlaneDeformationScene } from './PsychadelicPlaneDeformationScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PsychadelicPlaneDeformationScene());
        canvas.init();
    }

}

Application.main();
