import { CullFace } from './CullFace';
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
    private metal: Texture;
    private spheremap: Texture;
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

        this.canvas.style.width = `${320*2}px`;
        this.canvas.style.height =`${200*2}px`;

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

        let time: number = (Date.now() - this.start) % 260000;

       
        /*
      //  time = time *6;
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
        } else if (time < 215000) {
            this.framebuffer.led(time, this.texture14);
            this.framebuffer.drawTexture(32, 64, this.texture2, 1.0);
        } else if (time < 230000) {
            this.framebuffer.setBob(this.metal);
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
            this.framebuffer.shadingTorus4(time * 0.002);
            this.framebuffer.drawLensFlare(time - 185000, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 }
            ]);
            this.framebuffer.cinematicScroller(this.texture4, time);
        } else if (time < 240000) {
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.clear();
            this.framebuffer.shadingTorusENvironment(time * 0.006);
            this.framebuffer.drawLensFlare(time - 185000, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 }
            ]);
        } else {
            this.framebuffer.setCullFace(CullFace.BACK);
            this.framebuffer.reproduceRazorScene(time * 0.003);
            this.framebuffer.drawLensFlare(time - 185000, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 }
            ]);
        }
        */

        this.framebuffer.setCullFace(CullFace.BACK);

        this.framebuffer.setBob(this.spheremap);
        this.framebuffer.clear();
        this.framebuffer.reflectionBunny(time * 0.002);

        this.framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);
        this.framebuffer.drawText(8, 26, 'TME: ' + time, this.texture4);

        /**
         * FIXME: winding problem due to projection method and culling!
         */
        //  this.framebuffer.shadingSphereClip((time ) * 0.003);
        // this.framebuffer.cinematicScroller(this.texture4, time );
        //   this.framebuffer.drawText(8, 192 - 18, 'TRIANGLE NEAR PLANE CLIPPING', this.texture4);

        // TODO:
        // - textured cube / dynamic textures
        // - skybox
        // - specular highlights
        // - environment mapping (metal)
        // - 3d bobs (with shadows)
        // - plane deformation effect
        // - sine scroller (color bar texture)
        // - dot tunnel
        // - 2d / 3d start field
        // - 2d vector start
        // - wobble logo
        // - text writer
        // - scroller / sine scroller
        // - fractalplasma fade in
        // - water effect
        // - cross fade
        // - 2d bump mapping ( maybe on 3d object)
        // - smooth shading (gouraud)
        // - voxel landscape with color
        // - metaballs
        // - rasterbars
        // - 3d particles / 3d particle collision
        // - vector morphing
        // - voxel tunnel / sphere / torus
        // - stencil vectors
        // - chess zoomer / chess waver
        // - raycaster

        // this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
        // this.framebuffer.shadingTorus2(time * 0.02);
        // this.framebuffer.drawTexture(32, 60, this.texture2, 1.0);

        //this.framebuffer.clear();

        //this.framebuffer.wireFrameTerrain(time*0.01, this.texture3);
        // this.framebuffer.pixelate();



        //     this.framebuffer.wireFrameTerrain(time*0.008,this.texture3);
        //    this.framebuffer.cinematicScroller(this.texture4, time );
        // todo: radial blur -> pouet.net

        // this.framebuffer.reproduceRazorScene(2);
        // http://www.cubic.org/docs/camera.htm
        // http://www.cubic.org/docs/3dclip.htm
        // http://www.cubic.org/docs/backcull.htm

        // this.framebuffer.addReflections();

        // this.framebuffer.drawRaster();
        // this.framebuffer.enableBackfaceCulling();
        // this.framebuffer.setCullFace(FRONT);

      
   
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

    public createTexture(path: string, hasAlpha: boolean): Promise<Texture> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        });
    }

    public init(): void {
        Promise.all([
            this.createTexture(require('./assets/spheremap.png'), false).then(texture => this.spheremap = texture),
            this.createTexture(require('./assets/metall.png'), false).then(texture => this.metal = texture),
            this.createTexture(require('./assets/logo.png'), false).then(texture => this.texture = texture),
            this.createTexture(require('./assets/razor1911.png'), true).then(texture => this.texture2 = texture),
            this.createTexture(require('./assets/heightmap.png'), false).then(texture => this.texture3 = texture),
            this.createTexture(require('./assets/font.png'), true).then(texture => this.texture4 = texture),
            this.createTexture(require('./assets/atlantis.png'), false).then(texture => this.texture5 = texture),
            this.createTexture(require('./assets/lens.png'), true).then(texture => this.texture6 = texture),
            this.createTexture(require('./assets/ball2.png'), true).then(texture => this.texture7 = texture),
            this.createTexture(require('./assets/pandabear.png'), false).then(texture => this.texture8 = texture),
            this.createTexture(require('./assets/battleofilona.png'), false).then(texture => this.texture9 = texture),
            this.createTexture(require('./assets/spark.png'), true).then(texture => this.texture10 = texture),
            this.createTexture(require('./assets/ring.png'), true).then(texture => this.texture11 = texture),
            this.createTexture(require('./assets/sky.png'), true).then(texture => this.texture12 = texture),
            this.createTexture(require('./assets/bokeh.png'), true).then(texture => this.texture13 = texture),
            this.createTexture(require('./assets/led.png'), false).then(texture => this.texture14 = texture),
        ]).then(() => {
            let myAudio = new Audio(require('./assets/3dGalax.mp3'));
            myAudio.loop = true;
            this.start = Date.now();
            myAudio.play();
            this.renderLoop(0);
        });  
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