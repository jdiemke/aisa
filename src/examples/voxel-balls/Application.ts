import { Canvas } from '../../Canvas';
import { VoxelBallsScene } from './VoxelBallsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new VoxelBallsScene());
        canvas.init();
    }

}

Application.main();
