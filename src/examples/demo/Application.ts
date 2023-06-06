import { Canvas } from '../../Canvas';
import { DemoScene } from './DemoScene';
import './../../demo-style.css';

class Application {

    // HD Resolution 1920 x 1080
    public static readonly CANVAS_WIDTH = 1920 / 5;
    public static readonly CANVAS_HEIGHT = 1080 / 5;

    public static main(): void {
        const canvas: Canvas = new Canvas(Application.CANVAS_WIDTH, Application.CANVAS_HEIGHT, new DemoScene());
        canvas.init();
    }

}

Application.main();
