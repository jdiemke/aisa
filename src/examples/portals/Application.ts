import { Canvas } from '../../Canvas';
import { PortalScene } from './PortalScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new PortalScene());
        canvas.init();
    }

}

new Application().main();
