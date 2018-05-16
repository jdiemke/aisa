import * as AISA from './Canvas';
import { MetalHeadzScene } from './MetalHeadzScene';
import { PortalScene } from './PortalScene';
import { Scene } from './Scene';
import { TorusScene } from './TorusScene';

class Application {

    public main(): void {
        // const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new PortalScene());
        // const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new TorusScene());
        const canvas: AISA.Canvas = new AISA.Canvas(320, 200, new MetalHeadzScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
