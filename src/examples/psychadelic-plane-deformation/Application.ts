import { Canvas } from '../../Canvas';
import { RadialBlur } from './RadialBlur';


class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new RadialBlur());
        canvas.init();
    }

}

Application.main();
