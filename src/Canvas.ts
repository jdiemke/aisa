import Framebuffer from './Framebuffer';
import Texture from './Texture';



export class Canvas {

    private canvas: HTMLCanvasElement;
    private backbufferCanvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private backbufferContext: CanvasRenderingContext2D;
    private framebuffer: Framebuffer;

    //
    private texture: Texture;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');

        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext('2d');

        this.context.mozImageSmoothingEnabled = false;
        this.context.oImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;

        this.backbufferCanvas = document.createElement('canvas');
        this.backbufferCanvas.width = 320;
        this.backbufferCanvas.height = 200;

        this.backbufferContext = this.backbufferCanvas.getContext('2d');
        this.framebuffer = new Framebuffer(320, 200);
    }

    public render(): void {
        this.framebuffer.draw(this.texture);
        // this.framebuffer.drawTexture(50, -48 / 2, this.texture);
    }

    getImageData(image: HTMLImageElement): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
           // conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            
            c++;
        }
        return conv;
    }

    public init(): void {
        let img = new Image();
        img.addEventListener("load", () => {
            this.texture = new Texture();
            this.texture.texture = this.getImageData(img);
            this.texture.width = img.width;
            this.texture.height = img.height;
            this.renderLoop();
        });
        img.src = "stone.png";
    }

    public display(): void {

    }

    public renderLoop(): void {
        this.render();
        this.flipBackbuffer();
        requestAnimationFrame(() => this.renderLoop());
    }

    public flipBackbuffer(): void {
        this.backbufferContext.putImageData(this.framebuffer.getImageData(), 0, 0);
        this.context.drawImage(this.backbufferCanvas, 0, 0, 320, 200, 0, 0, 320 * 2, 200 * 2);
    }

    public appendTo(element: HTMLElement): void {
        element.appendChild(this.canvas);
    }

}