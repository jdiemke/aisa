import { Canvas } from '../../Canvas';
import { PlanedeformationTunnelScene } from './PlanedeformationTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new PlanedeformationTunnelScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
