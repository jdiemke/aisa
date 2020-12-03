import { Canvas } from '../../Canvas';
import { PlatonianScene } from './PlatonianScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PlatonianScene());
        canvas.init();
    }

}

Application.main();
