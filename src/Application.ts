import * as AISA from './Canvas';
import { PortalScene } from './PortalScene';
import { TorusScene } from './TorusScene';

class Application {

    public main(): void {
        //const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new PortalScene());
        const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new TorusScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
