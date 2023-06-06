import { Canvas } from '../../Canvas';
import { RoomScene } from './RoomScene';

import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RoomScene());
        canvas.init();
    }

}

Application.main();
