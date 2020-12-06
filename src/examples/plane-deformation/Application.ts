import { Canvas } from '../../Canvas';
import { PlaneDeformationScene } from './PlaneDeformationScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlaneDeformationScene(6, require('../../assets/textures/tex4_256.png')));
        canvas.init();
    }

}

Application.main();
