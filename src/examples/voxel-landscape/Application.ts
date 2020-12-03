import { Canvas } from '../../Canvas';
import { VoxelLandscapeScene } from './VoxelLandscapeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(Canvas.WIDTH, Canvas.HEIGHT, new VoxelLandscapeScene());
        canvas.init();
    }

}

Application.main();
