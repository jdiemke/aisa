import * as AISA from './Canvas';

class Application {

    public main(): void {
        const canvas: AISA.Canvas = new AISA.Canvas(320, 200);
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

new Application().main();
