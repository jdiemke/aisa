import { Canvas } from '@platform/browser';
import { VoxelLandscapeScene } from './VoxelLandscapeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new VoxelLandscapeScene());
        canvas.init();
    }

}

Application.main();
