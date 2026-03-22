import { Canvas } from '../../Canvas';
import { WireframeScene } from './WireframeScene';
import './../../default-style.css';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new WireframeScene());
        canvas.init();
    }

}

Application.main();
