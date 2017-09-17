import Framebuffer from './Framebuffer';
import Texture from './Texture';

declare function require(string): string;

export class Canvas {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    public framebuffer: Framebuffer;
    start: number;

    private texture: Texture;
    private texture2: Texture;
    private texture3: Texture;
    private texture4: Texture;
    private texture5: Texture;
    private texture6: Texture;
    private texture7: Texture;
    private texture8: Texture;
    private texture9: Texture;
    private texture10: Texture;
    private texture11: Texture;
    private texture12: Texture;
    private texture13: Texture;
    private texture14: Texture;
    private boundRenderLoop: (time: number) => void;

    constructor(width: number, height: number) {
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

        let aspect = Math.round(200 / 320 * 100);

        this.canvas.style.width = '100%';//640px';
        this.canvas.style.height = '100%';//'400px';

        this.context = this.canvas.getContext('2d');

        this.context.oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;


        this.framebuffer = new Framebuffer(320, 200);



        this.boundRenderLoop = this.renderLoop.bind(this)
    }


    fpsStartTime = Date.now();
    fpsCount = 0;
    fps: number = 0;

    /**
     * http://www.hugi.scene.org/online/coding/hugi%20se%204%20-%20index%20sorted%20by%20topic.htm
     * http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_01_Prologue.shtml
     * http://insolitdust.sourceforge.net/code.html
     * 
     * http://www.wab.com/screen.php?screen=20
     * http://www.helixsoft.nl/articles/circle/sincos.htm
     * https://gamedev.stackexchange.com/questions/24957/doing-an-snes-mode-7-affine-transform-effect-in-pygame
     * https://www.coranac.com/tonc/text/mode7ex.htm
     * 
     * http://codeincomplete.com/posts/javascript-racer-v1-straight/
     * http://www.extentofthejam.com/pseudo/
     * 
     * http://hugi.scene.org/online/hugi24/coding%20graphics%20bonz%20sines%20and%20cosines%20for%20fun%20and%20profit.htm
     * 
     * @memberof Canvas
     */
    public render(): void {


        let currentTime: number = Date.now();
        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        let time: number = (Date.now() - this.start) % 215000;

        if (time < 5000) {
            this.framebuffer.drawTitanEffect();
            this.framebuffer.shadingTorus(time * 0.02);
            this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
            //this.framebuffer.drawText(8, 192 - 18, '3D TORUS', this.texture4);
        } else if (time < 15000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
            this.framebuffer.draw(this.texture, time);
            //this.framebuffer.drawText(8, 192 - 18, 'TEXTURED TWISTER', this.texture4);
        } else if (time < 25000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
            this.framebuffer.drawLens(this.texture5, this.texture6, time);
            //this.framebuffer.drawText(8, 192 - 18, '2D LENS EFFECT', this.texture4);
        } else if (time < 30000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingDemo(time * 0.02);
            // this.framebuffer.drawText(8, 192 - 18, 'SHADED 3D CUBE', this.texture4);
        } else if (time < 35000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingSphere(time * 0.01);
            //this.framebuffer.drawText(8, 192 - 18, 'DISTORTED 3D SPHERE', this.texture4);
        } else if (time < 40000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.wireFrameSphereClipping(time * 0.01);
            //this.framebuffer.drawText(8, 192 - 18, 'WIREFRAME SPHERE', this.texture4);
        } else if (time < 45000) {
            this.framebuffer.drawVoxelLandscape2(this.texture3, time);
            this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
            //this.framebuffer.drawText(8, 192 - 18, 'VOXEL LANDSCAPE', this.texture4);
        } else if (time < 50000) {
            this.framebuffer.drawOldSchoolPlasma(time);
            //this.framebuffer.drawText(8, 192 - 18, 'OLD SCHOOL PLASMA', this.texture4);
        } else if (time < 55000) {
            // https://www.youtube.com/watch?v=ccYLb7cLB1I&t=773s
            this.framebuffer.drawMetaballs();
            // this.framebuffer.drawText(8, 192 - 18, '2D METABALLS', this.texture4);
        } else if (time < 60000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
            this.framebuffer.shadingTorus2(time * 0.02);
            // this.framebuffer.drawText(8, 192 - 18, 'POLYGON CLIPPING', this.texture4);
        } else if (time < 70000) {
            this.framebuffer.floodFill(this.texture5, time - 60000);
            // this.framebuffer.drawText(8, 192 - 18, 'FLOOD FILL', this.texture4);
        } else if (time < 80000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
            this.framebuffer.drawBobs(this.texture7, time);
            // this.framebuffer.drawText(8, 192 - 18, 'UNLIMITED BOBS', this.texture4);
        } else if (time < 95000) {
            this.framebuffer.blockFace(this.texture5, time, 80000);
            // this.framebuffer.drawText(8, 192 - 18, 'MOSAIC FADE IN', this.texture4);
        } else if (time < 140000) {
            this.framebuffer.scrollingBackground(this.texture8, time - 95000);
            // this.framebuffer.drawText(8, 192 - 18, 'SCROLLING BACKGROUND', this.texture4);
        } else if (time < 160000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture9.texture);
            this.framebuffer.cinematicScroller(this.texture4, time - 140000);
            // this.framebuffer.drawText(8, 192 - 18, 'CINEMATIC SCROLLER', this.texture4);
        } else if (time < 185000) {
            this.framebuffer.shadingSphereClip((time - 170000) * 0.003);
            this.framebuffer.cinematicScroller(this.texture4, time - 160000);
            //   this.framebuffer.drawText(8, 192 - 18, 'TRIANGLE NEAR PLANE CLIPPING', this.texture4);
        } else if (time < 200000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture12.texture);
            this.framebuffer.shadingTorus(time * 0.02);
            this.framebuffer.drawLensFlare(time - 185000, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 }
            ]);
        } else if (time < 210000) {
            this.framebuffer.blur();
            this.framebuffer.shadingTorus3(time * 0.015);
            this.framebuffer.drawTexture(32, 70, this.texture2, 1.0);
        } else {
            this.framebuffer.led(time, this.texture14);
            this.framebuffer.drawTexture(32, 64, this.texture2, 1.0);
        }


        // this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
        // this.framebuffer.shadingTorus2(time * 0.02);
        // this.framebuffer.drawTexture(32, 60, this.texture2, 1.0);

        //this.framebuffer.clear();

        //this.framebuffer.wireFrameTerrain(time*0.01, this.texture3);
        //   this.framebuffer.pixelate();



        //     this.framebuffer.wireFrameTerrain(time*0.008,this.texture3);
        //    this.framebuffer.cinematicScroller(this.texture4, time );
        // todo: radial blur -> pouet.net

        // this.framebuffer.reproduceRazorScene(2);
        // http://www.cubic.org/docs/camera.htm
        // http://www.cubic.org/docs/3dclip.htm
        // http://www.cubic.org/docs/backcull.htm

        // this.framebuffer.addReflections();

        // this.framebuffer.drawRaster();
        this.framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);
        // this.framebuffer.drawText(8, 26, 'TME: ' + time, this.texture4);
        // this.framebuffer.scene9(time*0.01);

        //this.framebuffer.drawText(80 + 0, 100 + 8, '   IN JAVASCRIPT!    ', this.texture4);

        // TODO: text
        // 3d line clipping for fly by :)
        // different transitions:
        // - stripes etc
        // - chessboard
        // wobble logo
        // ball 3d with precalculated sizes lookup
        // starfield 2d /3d
        // tv noise
        // wormhole
        // glitch logo

        /**
         * TODO: lenslfare effect
         * - procedural lens flare textures
         * - lens flare fade in
         * - read zbuffer
         * - http://blackpawn.com/texts/lensflare/
         */
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

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


            let img2 = new Image();
            img2.addEventListener("load", () => {
                this.texture2 = new Texture();
                this.texture2.texture = this.getImageData(img2, true);
                this.texture2.width = img2.width;
                this.texture2.height = img2.height;


                let img3 = new Image();
                img3.addEventListener("load", () => {
                    this.texture3 = new Texture();
                    this.texture3.texture = this.getImageData(img3);
                    this.texture3.width = img3.width;
                    this.texture3.height = img3.height;


                    let img4 = new Image();
                    img4.addEventListener("load", () => {
                        this.texture4 = new Texture();
                        this.texture4.texture = this.getImageData(img4, true);
                        this.texture4.width = img4.width;
                        this.texture4.height = img4.height;


                        let img5 = new Image();
                        img5.addEventListener("load", () => {
                            this.texture5 = new Texture();
                            this.texture5.texture = this.getImageData(img5);
                            this.texture5.width = img5.width;
                            this.texture5.height = img5.height;

                            let img6 = new Image();
                            img6.addEventListener("load", () => {
                                this.texture6 = new Texture();
                                this.texture6.texture = this.getImageData(img6, true);
                                this.texture6.width = img6.width;
                                this.texture6.height = img6.height;

                                let img7 = new Image();
                                img7.addEventListener("load", () => {
                                    this.texture7 = new Texture();
                                    this.texture7.texture = this.getImageData(img7, true);
                                    this.texture7.width = img7.width;
                                    this.texture7.height = img7.height;

                                    let img8 = new Image();
                                    img8.addEventListener("load", () => {
                                        this.texture8 = new Texture();
                                        this.texture8.texture = this.getImageData(img8);
                                        this.texture8.width = img8.width;
                                        this.texture8.height = img8.height;

                                        let img9 = new Image();
                                        img9.addEventListener("load", () => {
                                            this.texture9 = new Texture();
                                            this.texture9.texture = this.getImageData(img9);
                                            this.texture9.width = img9.width;
                                            this.texture9.height = img9.height;

                                            let img10 = new Image();
                                            img10.addEventListener("load", () => {
                                                this.texture10 = new Texture();
                                                this.texture10.texture = this.getImageData(img10, true);
                                                this.texture10.width = img10.width;
                                                this.texture10.height = img10.height;


                                                let img11 = new Image();
                                                img11.addEventListener("load", () => {
                                                    this.texture11 = new Texture();
                                                    this.texture11.texture = this.getImageData(img11, true);
                                                    this.texture11.width = img11.width;
                                                    this.texture11.height = img11.height;

                                                    let img12 = new Image();
                                                    img12.addEventListener("load", () => {
                                                        this.texture12 = new Texture();
                                                        this.texture12.texture = this.getImageData(img12, true);
                                                        this.texture12.width = img12.width;
                                                        this.texture12.height = img12.height;

                                                        let img13 = new Image();
                                                        img13.addEventListener("load", () => {
                                                            this.texture13 = new Texture();
                                                            this.texture13.texture = this.getImageData(img13, true);
                                                            this.texture13.width = img13.width;
                                                            this.texture13.height = img13.height;

                                                            let img14 = new Image();
                                                            img14.addEventListener("load", () => {
                                                                this.texture14 = new Texture();
                                                                this.texture14.texture = this.getImageData(img14, false);
                                                                this.texture14.width = img14.width;
                                                                this.texture14.height = img14.height;
                                                                let myAudio = new Audio(require('./assets/3dGalax.mp3'));
                                                                myAudio.loop = true;
                                                                this.start = Date.now();
                                                                myAudio.play();
                                                                this.renderLoop(0);
                                                            });
                                                            img14.src = require("./assets/led.png");
                                                        });
                                                        img13.src = require("./assets/bokeh.png");
                                                    });
                                                    img12.src = require("./assets/sky.png");
                                                });
                                                img11.src = require("./assets/ring.png");
                                            });
                                            img10.src = require("./assets/spark.png");

                                        });
                                        img9.src = require("./assets/battleofilona.png");
                                    });
                                    img8.src = require("./assets/pandabear.png");
                                });
                                img7.src = require("./assets/ball2.png");
                            });
                            img6.src = require("./assets/lens.png");
                        });
                        img5.src = require("./assets/atlantis.png");
                    });
                    img4.src = require("./assets/font.png");
                });
                img3.src = require("./assets/heightmap.png");
            });
            img2.src = require("./assets/razor1911.png");
        });
        img.src = require("./assets/logo.png");
    }

    public display(): void {

    }

    public renderLoop(time: number): void {
        this.render();
        this.flipBackbuffer();
        requestAnimationFrame(this.boundRenderLoop);
    }

    public flipBackbuffer(): void {
        //this.backbufferContext.putImageData(this.framebuffer.getImageData(), 0, 0);
        //this.context.drawImage(this.backbufferCanvas, 0, 0, 320, 200, 0, 0, 320 * 2, 200 * 2);
        this.context.putImageData(this.framebuffer.getImageData(), 0, 0);
    }

    public appendTo(element: HTMLElement): void {
        element.appendChild(this.canvas);
    }

}