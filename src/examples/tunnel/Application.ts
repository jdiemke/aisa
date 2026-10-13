import { Canvas } from '@platform/browser';
import { TunnelScene } from './TunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new TunnelScene());
        canvas.init();
    }

}

Application.main();
