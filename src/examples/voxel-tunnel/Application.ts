import { Canvas } from '../../Canvas';
import { VoxelTunnelScene } from './VoxelTunnelScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new VoxelTunnelScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
