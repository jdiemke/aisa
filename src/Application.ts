import * as AISA from './Canvas'

// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/


// angabe von canvas und framebuffer size!

class ImagePreloader {

    private images: Array<string> = new Array<string>();
    private loaded: number = 0;
    private onComplete: Function;

    addImage(path: string): void {
        this.images.push(path);
        console.log(path);
    }

    onLoad() {
        this.loaded++;
        console.log('on load'+ this.loaded);
        if(this.loaded == this.images.length) {
            this.onComplete();
        }
    }

    setOnComplete(method: Function) {
        this.onComplete = method;
    }

    load() {
        this.images.forEach((image) => {
            let img = new Image();
            img.addEventListener("load", this.onLoad.bind(this));
            img.src = image;

        });
    }

}



/**
 * Tutorials:
 * - http://www.ecere.com/3dbhole/
 * - https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/
 * Algorithms:
 * - http://joshbeam.com/articles/triangle_rasterization/ (scanline)
 * - http://forum.devmaster.net/t/advanced-rasterization/6145 (half space)
 * - sutherland clipping
 */
class Application {

    public main(): void {
        let canvas: AISA.Canvas = new AISA.Canvas(320, 200);
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();

        // TODO: copy image file into dist

       // let preloader = new ImagePreloader();
       // preloader.addImage('ball.png');
       // preloader.setOnComplete(canvas.renderLoop.bind(canvas));
       // preloader.load();
    }

}

new Application().main();