import { CullFace } from './CullFace';
import Framebuffer from './Framebuffer';
import { Vector4f } from './math/index';
import { Matrix4f } from './math/Matrix4f';
import { Sphere } from './math/Sphere';
import { Vector3f } from './math/Vector3f';
import RandomNumberGenerator from './RandomNumberGenerator';
import Texture from './Texture';
import { Scene } from './Scene';

export class Canvas {

    public framebuffer: Framebuffer;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private boundRenderLoop: (time: number) => void;

    constructor(width: number, height: number, private scene: Scene) {
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

        this.context.oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;

        this.framebuffer = new Framebuffer(320, 200);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }

    //  Move parts
    public init(): void {
        let fullscreen = false;
        let toggleFullscreen = function () {
            if (!fullscreen) {
                fullscreen = true;
                if ('requestFullscreen' in this) {
                    this['requestFullscreen']();
                } else if ('webkitRequestFullScreen' in this) {
                    this['webkitRequestFullScreen']();
                } else if ('mozRequestFullScreen' in this) {
                    this['mozRequestFullScreen']();
                } else if ('msRequestFullscreen' in this) {
                    this['msRequestFullscreen']();
                } else {
                    fullscreen = false;
                }
            } else {
                fullscreen = false;
                if ('exitFullscreen' in document) {
                    document['exitFullscreen']();
                } else if ('mozCancelFullScreen' in document) {
                    document['mozCancelFullScreen']();
                } else if ('webkitExitFullscreen' in document) {
                    document['webkitExitFullscreen']();
                } else if ('msExitFullScreen' in document) {
                    document['msExitFullScreen']();
                } else {
                    fullscreen = true;
                }
            }
        };
        let lastClick = 0;
        // click supported on mobile and desktop. dblclick only supported on browser
        // so emulate dblclick
        this.canvas.addEventListener('click', function (evt) {
            evt.preventDefault();
            let currentClick = Date.now();
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
