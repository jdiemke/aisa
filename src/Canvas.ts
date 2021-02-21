import { Framebuffer } from './Framebuffer';
import { FullscreenUtils } from './fullscreen/FullscreenUtils';
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
        this.canvas.id = 'aisa-canvas';

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

        // FIXME: make this cross browser compatible!
        (this.context as any).oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        (this.context as any).webkitImageSmoothingEnabled = false;

        this.framebuffer = new Framebuffer(width, height);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }

    public init(): void {
        // add canvas element to target element
        this.appendTo(document.getElementById('aisa'));

        // Add fullscreen toggle on click
        this.canvas.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            FullscreenUtils.toggleFullscreen(this.canvas);
        });

        // Init scene and start rendering
        this.scene.init(this.framebuffer).then(
            () => {
                this.scene.onInit();
                this.renderLoop(0);
            }
        );
    }

    public renderLoop(time: number): void {
        this.scene.render(this.framebuffer, time);
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
