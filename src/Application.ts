import * as AISA from './Canvas';
import { Scene } from './Scene';

class Application {

    public main(): void {
        const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new Scene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
