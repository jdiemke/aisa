import { Canvas } from '../../Canvas';
import { RoomScene } from './RoomScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RoomScene());
        canvas.init();
    }

}

Application.main();
