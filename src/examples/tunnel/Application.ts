import { Canvas } from '../../Canvas';
import { TunnelScene } from './TunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TunnelScene());
        canvas.init();
    }

}

Application.main();
