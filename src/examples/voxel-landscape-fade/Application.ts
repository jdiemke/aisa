import { Canvas } from '../../Canvas';
import { VoxelLandScapeFadeScene } from './VoxelLandcapeFadeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new VoxelLandScapeFadeScene());
        canvas.init();
    }

}

Application.main();
