import { Canvas } from '../../Canvas';
import { LedPlasmaScene } from './LedPlasmaScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new LedPlasmaScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
