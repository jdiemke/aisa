import { Canvas } from '../../Canvas';
import { VoxelBallsScene } from './VoxelBallsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new VoxelBallsScene());
        canvas.init();
    }

}

Application.main();
