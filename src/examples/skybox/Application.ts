import { Canvas } from '../../Canvas';
import { SkyBoxScene } from './SkyBoxScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new SkyBoxScene());
        canvas.init();
    }

}

new Application().main();
