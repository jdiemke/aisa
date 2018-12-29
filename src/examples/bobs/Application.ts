import { Canvas } from '../../Canvas';
import { Bobs } from './Bobs';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Bobs());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
