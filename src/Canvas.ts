import { Framebuffer } from './Framebuffer';
import { AbstractScene } from './scenes/AbstractScene';

export class Canvas {

    public framebuffer: Framebuffer;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private boundRenderLoop: (time: number) => void;

    constructor(width: number, height: number, private scene: AbstractScene) {
        this.canvas = document.createElement('canvas');

        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        this.canvas.style.width = `${width * 2}px`;
        this.canvas.style.height = `${height * 2}px`;

        this.context = this.canvas.getContext('2d');

        (this.context as any).oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        (this.context as any).webkitImageSmoothingEnabled = false;

        this.framebuffer = new Framebuffer(320, 200);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }

    //  Move parts
    public init(): void {
        // FIXME: move fullsccreen handling into utils class
        let fullscreen: boolean = false;
        const toggleFullscreen: () => void = (): void => {
            if (!fullscreen) {
                this.canvas.requestFullscreen();
                fullscreen = true;
            } else {
                document.exitFullscreen();
                fullscreen = false;
            }
        };
        let lastClick: number = 0;
        // click supported on mobile and desktop. dblclick only supported on browser
        // so emulate dblclick
        this.canvas.addEventListener('click', function (evt) {
            evt.preventDefault();
            const currentClick: number = Date.now();
            if (currentClick - lastClick < 200) {
                toggleFullscreen.bind(this)();
            }
            lastClick = currentClick;
        });
        this.scene.init(this.framebuffer).then(() => {
            this.renderLoop(0);
        });
    }

    public renderLoop(time: number): void {
        this.scene.render(this.framebuffer);
        this.flipBackbuffer();
        requestAnimationFrame(this.boundRenderLoop);
    }

    public flipBackbuffer(): void {
        this.context.putImageData(this.framebuffer.getImageData(), 0, 0);
    }

    public appendTo(element: HTMLElement): void {
        element.appendChild(this.canvas);
    }

}
