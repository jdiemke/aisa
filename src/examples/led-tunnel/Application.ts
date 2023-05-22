import { Canvas } from '../../Canvas';
import { LedTunnelScene } from './LedTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new LedTunnelScene());
        canvas.init();
    }

}

Application.main();
