import { Canvas } from '../../Canvas';
import { PlaneDeformationAbstractScene } from './PlaneDeformationAbstractScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlaneDeformationAbstractScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
