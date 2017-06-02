/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector3f {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    mult(scale) {
        return new Vector3f(this.x * scale, this.y * scale, this.z * scale);
    }
    sub(vec) {
        return new Vector3f(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    mul(scal) {
        return new Vector3f(this.x * scal, this.y * scal, this.z * scal);
    }
    add(vec) {
        return new Vector3f(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    cross(vec) {
        return new Vector3f(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        let reci = 1.0 / this.length();
        return this.mul(reci);
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
}
exports.default = Vector3f;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector4f {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    sub(vec) {
        return new Vector4f(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }
    cross(vec) {
        return new Vector4f(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x, 0.0);
    }
    normalize() {
        let reci = 1.0 / this.length();
        return this.mul(reci);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    mul(scal) {
        return new Vector4f(this.x * scal, this.y * scal, this.z * scal, this.w);
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
}
exports.default = Vector4f;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(4);
const Texture_1 = __webpack_require__(7);
class Canvas {
    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.context.oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.backbufferCanvas = document.createElement('canvas');
        this.backbufferCanvas.width = 320;
        this.backbufferCanvas.height = 200;
        this.backbufferContext = this.backbufferCanvas.getContext('2d');
        this.framebuffer = new Framebuffer_1.default(320, 200);
        this.start = Date.now();
    }
    render() {
        let time = (Date.now() - this.start) % 30000;
        if (time < 5000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingDemo(Date.now() * 0.02);
        }
        else if (time < 10000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.draw(this.texture);
        }
        else if (time < 15000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingTorus(Date.now() * 0.02);
        }
        else if (time < 20000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingSphere(Date.now() * 0.01);
        }
        else if (time < 25000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.wireFrameSphereClipping(Date.now() * 0.01);
            this.framebuffer.draw(this.texture);
        }
        else {
            // https://www.youtube.com/watch?v=ccYLb7cLB1I&t=773s
            this.framebuffer.drawMetaballs();
        }
        this.framebuffer.drawTexture(35, 0, this.texture2, 1.0);
        /**
         * TODO: lenslfare effect
         * - procedural lens flare textures
         * - lens flare fade in
         * - read zbuffer
         * - http://blackpawn.com/texts/lensflare/
         */
    }
    getImageData(image, withAlpha) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }
            else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }
            c++;
        }
        return conv;
    }
    init() {
        let img = new Image();
        img.addEventListener("load", () => {
            this.texture = new Texture_1.default();
            this.texture.texture = this.getImageData(img, false);
            this.texture.width = img.width;
            this.texture.height = img.height;
            let img2 = new Image();
            img2.addEventListener("load", () => {
                this.texture2 = new Texture_1.default();
                this.texture2.texture = this.getImageData(img2, true);
                this.texture2.width = img2.width;
                this.texture2.height = img2.height;
                let myAudio = new Audio(__webpack_require__(8));
                myAudio.loop = true;
                myAudio.play();
                this.renderLoop();
            });
            img2.src = __webpack_require__(10);
        });
        img.src = __webpack_require__(9);
    }
    display() {
    }
    renderLoop() {
        this.render();
        this.flipBackbuffer();
        requestAnimationFrame(() => this.renderLoop());
    }
    flipBackbuffer() {
        this.backbufferContext.putImageData(this.framebuffer.getImageData(), 0, 0);
        this.context.drawImage(this.backbufferCanvas, 0, 0, 320, 200, 0, 0, 320 * 2, 200 * 2);
    }
    appendTo(element) {
        element.appendChild(this.canvas);
    }
}
exports.Canvas = Canvas;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AISA = __webpack_require__(2);
// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
// angabe von canvas und framebuffer size!
class ImagePreloader {
    constructor() {
        this.images = new Array();
        this.loaded = 0;
    }
    addImage(path) {
        this.images.push(path);
        console.log(path);
    }
    onLoad() {
        this.loaded++;
        console.log('on load' + this.loaded);
        if (this.loaded == this.images.length) {
            this.onComplete();
        }
    }
    setOnComplete(method) {
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
    main() {
        let canvas = new AISA.Canvas(640, 400);
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(0);
const Vector4f_1 = __webpack_require__(1);
const Matrix3_1 = __webpack_require__(5);
const Matrix4f_1 = __webpack_require__(6);
let json = __webpack_require__(11);
class Framebuffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float32Array(320 * 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
    }
    getImageData() {
        this.imageData.data.set(this.unsignedIntArray);
        return this.imageData;
    }
    clear() {
        let color = this.toColor(0);
        let count = this.width * this.height;
        for (let i = 0; i < count; i++) {
            this.framebuffer[i] = color;
        }
    }
    clearCol(color) {
        this.framebuffer.fill(color);
    }
    drawPixel(x, y, color) {
        this.framebuffer[x + y * this.width] = color;
    }
    toColor(red) {
        return (255 << 24) |
            (red << 16) |
            (red << 8) |
            (red);
    }
    drawRect(x, y, width, color) {
        let start = x + y * this.width;
        for (let i = 0; i < width; i++) {
            this.framebuffer[start++] = color;
        }
    }
    drawTexture(x, y, texture, alpha2) {
        const SCREEN_WIDTH = 320;
        const SCREEN_HEIGHT = 200;
        let framebufferIndex = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;
        let width = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        let height = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);
        let textureRowOffset = texture.width - width;
        let framebufferRowOffset = this.width - width;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let alpha = ((texture.texture[textureIndex] >> 24) & 0xff) / 255 * alpha2;
                let inverseAlpha = 1 - alpha;
                let r = (((this.framebuffer[framebufferIndex] >> 0) & 0xff) * (inverseAlpha) + ((texture.texture[textureIndex] >> 0) & 0xff) * (alpha)) | 0;
                let g = (((this.framebuffer[framebufferIndex] >> 8) & 0xff) * (inverseAlpha) + ((texture.texture[textureIndex] >> 8) & 0xff) * (alpha)) | 0;
                let b = (((this.framebuffer[framebufferIndex] >> 16) & 0xff) * (inverseAlpha) + ((texture.texture[textureIndex] >> 16) & 0xff) * (alpha)) | 0;
                this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                framebufferIndex++;
                textureIndex++;
            }
            textureIndex += textureRowOffset;
            framebufferIndex += framebufferRowOffset;
        }
    }
    /**
     * Span Renderer
     *
     * http://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack
     */
    drawSpan(dist, xpos, ypos, scale, texture) {
        let framebufferIndex = xpos + ypos * this.width;
        let textureIndex = (((ypos - Date.now() * 0.029) | 0) & 0xff) * texture.width;
        let textureForwardDifference = texture.width / dist;
        let hightlight = Math.pow(scale, 11) * 115;
        for (let j = 0; j < dist; j++) {
            let color = texture.texture[textureIndex | 0];
            let r = Math.min(((color >> 0 & 0xff) * scale) + hightlight, 255);
            let g = Math.min(((color >> 8 & 0xff) * scale) + hightlight, 255);
            let b = Math.min(((color >> 16 & 0xff) * scale) + hightlight, 255);
            this.framebuffer[framebufferIndex] = r | g << 8 | b << 16 | 255 << 24;
            framebufferIndex++;
            textureIndex += textureForwardDifference;
        }
    }
    // TODO:
    // - implement scale and translate using homogenous 4x4 matrices
    //   instead of fucking around with the projection formular
    scene8(elapsedTime) {
        let index = [
            0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6,
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4,
        ];
        let points = [
            new Vector3f_1.default(1.0, 1.0, -1.0), new Vector3f_1.default(-1.0, 1.0, -1.0),
            new Vector3f_1.default(-1.0, 1.0, 1.0), new Vector3f_1.default(1.0, 1.0, 1.0),
            new Vector3f_1.default(1.0, -1.0, 1.0), new Vector3f_1.default(-1.0, -1.0, 1.0),
            new Vector3f_1.default(-1.0, -1.0, -1.0), new Vector3f_1.default(1.0, -1.0, -1.0)
        ];
        let scale = 1.8;
        let modelViewMartrix = Matrix3_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3_1.default.constructXRotationMatrix(elapsedTime * 0.05));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 6 + Math.sin(elapsedTime); // TODO: use translation matrix!
            let xx = (320 / 2) + (x / (-z * 0.0078));
            let yy = (200 / 2) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(xx, yy, z));
        });
        let color = 255 << 8 | 255 << 24;
        for (let i = 0; i < index.length; i += 2) {
            let color = (255 * (-(points2[index[i]].z + 5))) & 0xff | 0 << 16 | 255 << 24;
            this.drawLineDDA(points2[index[i]], points2[index[i + 1]], color);
        }
    }
    /**
     * https://mikro.naprvyraz.sk/docs/
     * http://simonstechblog.blogspot.de/2012/04/software-rasterizer-part-1.html
     * http://www.lysator.liu.se/~mikaelk/doc/perspectivetexture/
     * http://chrishecker.com/Miscellaneous_Technical_Articles
     * http://www.gamasutra.com/blogs/MichaelKissner/20160112/263097/Writing_a_Game_Engine_from_Scratch__Part_4_Graphics_Library.php
     * https://www.codeproject.com/Articles/170296/D-Software-Rendering-Engine-Part-I
     * https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/
     * https://www.youtube.com/playlist?list=PLEETnX-uPtBXP_B2yupUKlflXBznWIlL5
     * https://www.youtube.com/watch?v=cQY3WTKRI7I
     * https://www.youtube.com/playlist?list=PLEETnX-uPtBUbVOok816vTl1K9vV1GgH5
     * https://www.youtube.com/playlist?list=PLEETnX-uPtBUG4iRqc6bEBv5uxMXswlEL
     * https://www.youtube.com/playlist?list=PLbCDZQXIq7uYaf263gr-zb0wZGoCL-T5G
     * https://www.youtube.com/watch?v=9A5TVh6kPLA
     * http://joshbeam.com/articles/triangle_rasterization/
     * http://developers-club.com/posts/257107/
     * https://www.codeproject.com/Articles/170296/3D-Software-Rendering-Engine-Part-I
     * https://gamedev.stackexchange.com/questions/44263/fast-software-color-interpolating-triangle-rasterization-technique
     * https://fgiesen.wordpress.com/2011/07/05/a-trip-through-the-graphics-pipeline-2011-part-5/
     * http://insolitdust.sourceforge.net/code.html
     */
    debug(elapsedTime) {
        this.wBuffer.fill(100);
        let index = [
            1, 2, 3, 3, 4, 1,
            1 + 8, 2 + 8, 3 + 8, 3 + 8, 4 + 8, 1 + 8,
        ];
        let points = [
            new Vector3f_1.default(-1.0, -1.0, 1.0), new Vector3f_1.default(1.0, -1.0, 1.0),
            new Vector3f_1.default(1.0, 1.0, 1.0), new Vector3f_1.default(-1.0, 1.0, 1.0),
            new Vector3f_1.default(-1.0, -1.0, -1.0), new Vector3f_1.default(1.0, -1.0, -1.0),
            new Vector3f_1.default(1.0, 1.0, -1.0), new Vector3f_1.default(-1.0, 1.0, -1.0),
            new Vector3f_1.default(-1.0, -1.0, 1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)), new Vector3f_1.default(1.0, -1.0, 1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)),
            new Vector3f_1.default(1.0, 1.0, 1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)), new Vector3f_1.default(-1.0, 1.0, 1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)),
            new Vector3f_1.default(-1.0, -1.0, -1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)), new Vector3f_1.default(1.0, -1.0, -1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)),
            new Vector3f_1.default(1.0, 1.0, -1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)), new Vector3f_1.default(-1.0, 1.0, -1.0).add(new Vector3f_1.default(2.0, 0.0, 0.0)),
        ];
        let colorAr = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];
        let scale = 3.2;
        let modelViewMartrix = Matrix3_1.default.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3_1.default.constructZRotationMatrix(elapsedTime * 0.08));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        });
        for (let i = 0; i < index.length; i += 3) {
            // TODO: use eye space triangles for backface culling
            let col = 255 << 24 | 255 << 16;
            let col2 = 255 << 24 | 255;
            this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], colorAr[(((i) / 3) | 0) % 6]);
        }
    }
    sphereFunction(theta, phi) {
        let pos = new Vector4f_1.default(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta), 1.0);
        let radius = (Math.sin(pos.z * 11 + Date.now() * 0.001) + 1) / 2 +
            (Math.sin(pos.x * 11 + Date.now() * 0.001) + 1) / 3;
        pos.x = pos.x + pos.x * radius;
        pos.y = pos.y + pos.y * radius;
        pos.z = pos.z + pos.z * radius;
        return pos;
    }
    sphereFunction2(theta, phi) {
        let pos = new Vector4f_1.default(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta), 1.0);
        return pos;
    }
    drawBox() {
        let height = Framebuffer.maxWindow.y - Framebuffer.minWindow.y + 1;
        let width = Framebuffer.maxWindow.x - Framebuffer.minWindow.x + 1;
        let index = Framebuffer.minWindow.y * 320 + Framebuffer.minWindow.x;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(255 << 24 | 55 << 16 | 55 << 8 | 55, index, index + width);
            index += 320;
        }
    }
    wireFrameSphereClipping(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 16;
        const STEPS2 = 16;
        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                points.push(this.sphereFunction2(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2));
            }
        }
        let index = [];
        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2)); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); //3
                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2)); //4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); //3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 5
            }
        }
        // Create MV Matrix
        let scale = 10.8 + 5 * (Math.sin(elapsedTime * 0.16) + 1) / 2;
        let modelViewMartrix = Matrix4f_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f_1.default.constructYRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f_1.default.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f_1.default.constructTranslationMatrix(0 + 20 * Math.sin(elapsedTime * 0.04), 5 * Math.sin(elapsedTime * 0.06), -36).multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z;
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        }
        // draw clip region
        let colred = 255 << 24 | 230 << 16 | 200 << 16 | 200;
        this.drawLineDDA(new Vector3f_1.default(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f_1.default(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f_1.default(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), new Vector3f_1.default(Framebuffer.maxWindow.x + 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f_1.default(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f_1.default(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), colred);
        this.drawLineDDA(new Vector3f_1.default(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), new Vector3f_1.default(Framebuffer.maxWindow.x + 2, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawBox();
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {
            // Only render triangles with CCW-ordered vertices
            // 
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];
            let colLine = 255 << 24 | 255 << 16 | 255 << 8 | 255;
            if (this.isTriangleCCW(v1, v2, v3)) {
                this.cohenSutherlandLineClipper(v1, v2, colLine);
                this.cohenSutherlandLineClipper(v1, v3, colLine);
                this.cohenSutherlandLineClipper(v3, v2, colLine);
            }
        }
    }
    // seems to habe a small bug
    cohenSutherlandLineClipper(start, end, col) {
        let p1 = new Vector3f_1.default(start.x, start.y, start.z);
        let p2 = new Vector3f_1.default(end.x, end.y, end.z);
        let code1 = this.computeRegionCode(p1);
        let code2 = this.computeRegionCode(p2);
        let accept = false;
        let done = false;
        while (!done) {
            if (this.isTrivialAccept(code1, code2)) {
                accept = true;
                done = true;
            }
            else if (this.isTrivialReject(code1, code2)) {
                done = true;
            }
            else {
                if (code1 == Framebuffer.REGION_CODE_CENTER) {
                    let tempCode = code1;
                    code1 = code2;
                    code2 = tempCode;
                    let tempPoint = p1;
                    p1 = p2;
                    p2 = tempPoint;
                }
                if ((code1 & Framebuffer.REGION_CODE_TOP) != Framebuffer.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.maxWindow.y;
                }
                else if ((code1 & Framebuffer.REGION_CODE_BOTTOM) != Framebuffer.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.minWindow.y;
                }
                else if ((code1 & Framebuffer.REGION_CODE_RIGHT) != Framebuffer.REGION_CODE_CENTER) {
                    p1.y = Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.maxWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer.maxWindow.x;
                }
                else if ((code1 & Framebuffer.REGION_CODE_LEFT) != Framebuffer.REGION_CODE_CENTER) {
                    p1.y = Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer.minWindow.x;
                }
                code1 = this.computeRegionCode(p1);
            }
        }
        if (accept) {
            this.drawLineDDA(p1, p2, col);
        }
    }
    isTrivialAccept(code1, code2) {
        return (code1 | code2) == Framebuffer.REGION_CODE_CENTER;
    }
    isTrivialReject(code1, code2) {
        return (code1 & code2) != Framebuffer.REGION_CODE_CENTER;
    }
    dec2bin(dec) {
        return (dec >>> 0).toString(2);
    }
    computeRegionCode(point) {
        let regionCode = Framebuffer.REGION_CODE_CENTER;
        if (point.x < Framebuffer.minWindow.x) {
            regionCode |= Framebuffer.REGION_CODE_LEFT;
        }
        else if (point.x > Framebuffer.maxWindow.x) {
            regionCode |= Framebuffer.REGION_CODE_RIGHT;
        }
        if (point.y < Framebuffer.minWindow.y) {
            regionCode |= Framebuffer.REGION_CODE_BOTTOM;
        }
        else if (point.y > Framebuffer.maxWindow.y) {
            regionCode |= Framebuffer.REGION_CODE_TOP;
        }
        return regionCode;
    }
    shadingSphere(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 16;
        const STEPS2 = 16;
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                points.push(this.sphereFunction(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2));
            }
        }
        let index = [];
        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2)); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); //3
                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2)); //4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); //3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 5
            }
        }
        // compute normals
        let normals = new Array();
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }
        // Create MV Matrix
        let scale = 5.8;
        let modelViewMartrix = Matrix4f_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f_1.default.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f_1.default.constructTranslationMatrix(0, 0, -26 + 4 * Math.sin(elapsedTime * 0.7)).multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        normals.forEach(element => {
            normals2.push(modelViewMartrix.multiplyHom(element));
        });
        points.forEach(element => {
            let transformed = modelViewMartrix.multiplyHom(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z;
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        });
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {
            // Only render triangles with CCW-ordered vertices
            // 
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];
            let colLine = 255 << 24 | 255 << 16 | 255 << 8 | 255;
            if (this.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector4f_1.default(0.5, 0.5, 0.5, 0.0).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
                this.drawTriangleDDA(v1, v2, v3, color);
                //this.drawLineDDA(v1, v2, colLine);
                //this.drawLineDDA(v1, v3, colLine);
                //this.drawLineDDA(v3, v2, colLine);
            }
        }
    }
    torusFunction(alpha) {
        return new Vector3f_1.default(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }
    shadingTorus(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f_1.default(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }
        let index = [];
        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2) % points.length); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length); //3
                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length); //4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length); //3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length); // 5
            }
        }
        // compute normals
        let normals = new Array();
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }
        let scale = 1.0;
        let modelViewMartrix = Matrix4f_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f_1.default.constructXRotationMatrix(elapsedTime * 0.08));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        modelViewMartrix = Matrix4f_1.default.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);
        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        }
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {
            // Only render triangles with CCW-ordered vertices
            // 
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];
            if (this.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f_1.default(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
                this.drawTriangleDDA(v1, v2, v3, color);
            }
        }
    }
    /**
     * Full Pipeline:
     * https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
     * http://www.songho.ca/index.html
     * https://en.wikipedia.org/wiki/Graphics_pipeline
     * https://en.wikipedia.org/wiki/Clipping_(computer_graphics)
     * https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html
     * http://www.gamasutra.com/blogs/MichaelKissner/20160112/263097/Writing_a_Game_Engine_from_Scratch__Part_4_Graphics_Library.php
     * culling:
     * https://developer.tizen.org/development/guides/native-application/graphics/opengl-es/primitive-assembly-and-rasterization
     * assumption:
     * By default, vertices of every 3D triangle are in a counter-clockwise (CCW) order
     */
    shadingDemo(elapsedTime) {
        this.wBuffer.fill(100);
        let index = [
            1, 2, 3, 4, 1, 3,
            5, 7, 6, 8, 7, 5,
            2, 6, 7, 7, 3, 2,
            5, 1, 4, 4, 8, 5,
            4, 3, 7, 7, 8, 4,
            1, 6, 2, 5, 6, 1
        ];
        let points = [
            new Vector3f_1.default(-1.0, -1.0, 1.0), new Vector3f_1.default(1.0, -1.0, 1.0),
            new Vector3f_1.default(1.0, 1.0, 1.0), new Vector3f_1.default(-1.0, 1.0, 1.0),
            new Vector3f_1.default(-1.0, -1.0, -1.0), new Vector3f_1.default(1.0, -1.0, -1.0),
            new Vector3f_1.default(1.0, 1.0, -1.0), new Vector3f_1.default(-1.0, 1.0, -1.0),
        ];
        // compute normals
        let normals = new Array();
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1]));
            normals.push(normal);
        }
        let colorAr = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];
        let scale = 3.2;
        let modelViewMartrix = Matrix3_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3_1.default.constructXRotationMatrix(elapsedTime * 0.08));
        /**
         * Vertex Shader Stage:
         * 1. Local Space -> World Space -> Eye Space -> Clip Space -> NDC Space -> Screen Space
         * 2. Computes Lighting per Vertex
         */
        let points2 = new Array();
        let normals2 = new Array();
        normals.forEach(element => {
            normals2.push(modelViewMartrix.multiply(element));
        });
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        });
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < index.length; i += 3) {
            /**
             * Only render triangles with CCW-ordered vertices
             *
             * Reference:
             * David H. Eberly (2006).
             * 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
             * p. 69. Morgan Kaufmann Publishers, United States.
             */
            let v1 = points2[index[i] - 1];
            let v2 = points2[index[i + 1] - 1];
            let v3 = points2[index[i + 2] - 1];
            if (this.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];
                let light = new Vector3f_1.default(0.5, 0.5, 0.5);
                let ambient = new Vector3f_1.default(50, 100, 50);
                let diffuse = new Vector3f_1.default(90, 90, 90).mul(Math.max(0.0, normal.normalize().dot(light.normalize())));
                let reflection = new Vector3f_1.default(0, 0, 1).sub(light.mul(-1).normalize());
                // http://www.lighthouse3d.com/tutorials/glsl-tutorial/directional-lights-per-vertex-ii/
                let specular = new Vector3f_1.default(0, 0, 0);
                let phong = ambient.add(diffuse).add(specular);
                let color = 255 << 24 | (phong.z & 0xff) << 16 | (phong.y & 0xff) << 8 | (phong.x & 0xff);
                this.drawTriangleDDA(v1, v2, v3, color);
            }
        }
    }
    isTriangleCCW(v1, v2, v3) {
        let det = (v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x);
        return det > 0;
    }
    scene10(elapsedTime) {
        this.wBuffer.fill(100);
        let index = [
            1, 2, 3, 4, 1, 3,
            5, 7, 6, 8, 7, 5,
            2, 6, 7, 7, 3, 2,
            5, 1, 4, 4, 8, 5,
            4, 3, 7, 7, 8, 4,
            1, 6, 2, 5, 6, 1
        ];
        let points = [
            new Vector3f_1.default(-1.0, -1.0, 1.0), new Vector3f_1.default(1.0, -1.0, 1.0),
            new Vector3f_1.default(1.0, 1.0, 1.0), new Vector3f_1.default(-1.0, 1.0, 1.0),
            new Vector3f_1.default(-1.0, -1.0, -1.0), new Vector3f_1.default(1.0, -1.0, -1.0),
            new Vector3f_1.default(1.0, 1.0, -1.0), new Vector3f_1.default(-1.0, 1.0, -1.0),
        ];
        let colorAr = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];
        let scale = 3.2;
        let modelViewMartrix = Matrix3_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3_1.default.constructXRotationMatrix(elapsedTime * 0.08));
        for (let i = 0; i < 2; i++) {
            let points2 = new Array();
            points.forEach(element => {
                let transformed = modelViewMartrix.multiply(element);
                let x = transformed.x + i * 4 - 2;
                let y = transformed.y;
                let z = transformed.z - 9; // TODO: use translation matrix!
                let xx = (320 * 0.5) + (x / (-z * 0.0078));
                let yy = (200 * 0.5) - (y / (-z * 0.0078));
                points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
            });
            for (let i = 0; i < index.length; i += 3) {
                if (points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1])).z < 0) {
                    // TODO: use eye space triangles for backface culling
                    let col = 255 << 24 | 255 << 16;
                    let col2 = 255 << 24 | 255;
                    this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], colorAr[(((i) / 6) | 0) % 6]);
                }
            }
        }
    }
    scene9(elapsedTime) {
        this.wBuffer.fill(100);
        let data = json;
        let index = data.faces;
        let points = new Array();
        data.vertices.forEach(x => {
            points.push(new Vector3f_1.default(x.x, x.y, x.z));
        });
        let scale = 4.0;
        let modelViewMartrix = Matrix3_1.default.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3_1.default.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3_1.default.constructXRotationMatrix(elapsedTime * 0.05));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f_1.default(Math.round(xx), Math.round(yy), z));
        });
        let color = 255 | 255 << 16 | 255 << 24;
        for (let i = 0; i < index.length; i += 3) {
            // backface culling
            if (points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1])).z < 0) {
                let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1])).mul(-1);
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f_1.default(1, -1, 0).normalize())) * 155), 255) + 100;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;
                let col3 = 255 << 24 | 0;
                this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], color);
                //       this.drawLineDDA(points2[index[i] - 1], points2[index[i + 1] - 1], col3);
                //      this.drawLineDDA(points2[index[i + 1] - 1], points2[index[i + 2] - 1], col3);
                //    this.drawLineDDA(points2[index[i + 2] - 1], points2[index[i] - 1], col3);
            }
        }
    }
    drawTriangleSpan(dist, xpos, ypos, color) {
        let framebufferIndex = xpos + ypos * this.width;
        this.framebuffer.fill(color, framebufferIndex, framebufferIndex + dist);
    }
    /**
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix
     * http://www.flipcode.com/archives/articles.shtml
     * http://lodev.org/cgtutor/
     * http://lodev.org/cgtutor/lineclipping.html
     * http://www.hugi.scene.org/online/coding/
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/perspective-correct-interpolation-vertex-attributes
     * http://simonstechblog.blogspot.de/2012/04/software-rasterizer-part-2.html
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview
     * http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/visibility-problem-depth-buffer-depth-interpolation
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/perspective-correct-interpolation-vertex-attributes
     * https://gamedev.stackexchange.com/questions/38213/depth-interpolation-for-z-buffer-with-scanline
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/shading-normals
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/transforming-objects-using-matrices
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-polygon-mesh
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/3d-viewing-pinhole-camera
     * https://www.scratchapixel.com/lessons/3d-basic-rendering/computing-pixel-coordinates-of-3d-point/mathematics-computing-2d-coordinates-of-3d-points
     */
    fillLongRightTriangle(v1, v2, v3, color) {
        let yDistanceLeft = v2.y - v1.y;
        let yDistanceRight = v3.y - v1.y;
        let slope1 = (v2.x - v1.x) / yDistanceLeft;
        let slope2 = (v3.x - v1.x) / yDistanceRight;
        let zslope1 = (1 / v2.z - 1 / v1.z) / yDistanceLeft;
        let zslope2 = (1 / v3.z - 1 / v1.z) / yDistanceRight;
        let curx1 = v1.x;
        let curx2 = v1.x;
        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;
        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;
        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
        yDistanceLeft = v3.y - v2.y;
        slope1 = (v3.x - v2.x) / yDistanceLeft;
        zslope1 = (1 / v3.z - 1 / v2.z) / yDistanceLeft;
        curx1 = v2.x;
        curz1 = 1.0 / v2.z;
        xPosition = v2.x;
        yPosition = v2.y;
        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
    }
    fillLongLeftTriangle(v1, v2, v3, color) {
        let yDistanceRight = v2.y - v1.y;
        let yDistanceLeft = v3.y - v1.y;
        let slope2 = (v2.x - v1.x) / yDistanceRight;
        let slope1 = (v3.x - v1.x) / yDistanceLeft;
        let zslope2 = (1 / v2.z - 1 / v1.z) / yDistanceRight;
        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistanceLeft;
        let curx1 = v1.x;
        let curx2 = v1.x;
        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;
        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;
        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
        yDistanceRight = v3.y - v2.y;
        slope2 = (v3.x - v2.x) / yDistanceRight;
        zslope2 = (1 / v3.z - 1 / v2.z) / yDistanceRight;
        curx2 = v2.x;
        curz2 = 1.0 / v2.z;
        xPosition2 = v2.x;
        yPosition = v2.y;
        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
    }
    fillBottomFlatTriangle(v1, v2, v3, color) {
        let yDistance = v3.y - v1.y;
        let slope1 = (v2.x - v1.x) / yDistance;
        let slope2 = (v3.x - v1.x) / yDistance;
        let zslope1 = (1 / v2.z - 1 / v1.z) / yDistance;
        let zslope2 = (1 / v3.z - 1 / v1.z) / yDistance;
        let curx1 = v1.x;
        let curx2 = v1.x;
        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;
        let length = Math.round(yDistance);
        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;
        for (let i = 0; i < yDistance; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let wStart = curz1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                wStart += spanzStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
    }
    fillTopFlatTriangle(v1, v2, v3, color) {
        let yDistance = v3.y - v1.y;
        let slope1 = (v3.x - v1.x) / yDistance;
        let slope2 = (v3.x - v2.x) / yDistance;
        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistance;
        let zslope2 = (1 / v3.z - 1 / v2.z) / yDistance;
        let curx1 = v1.x;
        let curx2 = v2.y;
        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v2.z;
        let xPosition = v1.x;
        let xPosition2 = v2.x;
        let yPosition = v1.y;
        for (let i = 0; i < yDistance; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            for (let j = 0; j < length; j++) {
                let wStart = (curz2 - curz1) / (length) * j + curz1;
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
        }
    }
    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     * TODO: rotate around center and check for correctness!!
     */
    drawTriangleDDA(p1, p2, p3, color) {
        if (p1.y > p3.y) {
            let temp = p1;
            p1 = p3;
            p3 = temp;
        }
        if (p1.y > p2.y) {
            let temp = p1;
            p1 = p2;
            p2 = temp;
        }
        if (p2.y > p3.y) {
            let temp = p2;
            p2 = p3;
            p3 = temp;
        }
        if (p1.y == p3.y) {
            return;
        }
        else if (p2.y == p3.y) {
            if (p2.x > p3.x) {
                let temp = p2;
                p2 = p3;
                p3 = temp;
            }
            this.fillBottomFlatTriangle(p1, p2, p3, color);
        }
        else if (p1.y == p2.y) {
            if (p1.x > p2.x) {
                let temp = p1;
                p1 = p2;
                p2 = temp;
            }
            this.fillTopFlatTriangle(p1, p2, p3, color);
        }
        else {
            let x = (p3.x - p1.x) * (p2.y - p1.y) / (p3.y - p1.y) + p1.x;
            if (x > p2.x) {
                this.fillLongRightTriangle(p1, p2, p3, color);
            }
            else {
                this.fillLongLeftTriangle(p1, p2, p3, color);
            }
        }
    }
    /**
     * digital differential analyser line drawing algorithm
     * using fixed point math.
     * renders approx 1400 lines per millisecond on my machine
     */
    drawLineDDA(start, end, color) {
        let xDistance = end.x - start.x;
        let yDistance = end.y - start.y;
        let dx, dy, length;
        if (Math.abs(xDistance) > Math.abs(yDistance)) {
            dx = Math.sign(xDistance);
            dy = yDistance / Math.abs(xDistance);
            length = Math.abs(xDistance);
        }
        else {
            dx = xDistance / Math.abs(yDistance);
            dy = Math.sign(yDistance);
            length = Math.abs(yDistance);
        }
        let xPosition = start.x;
        let yPosition = start.y;
        // w=1/z interpolation for z-buffer
        let wStart = 1 / (start.z + 0.1);
        let wDelta = (1 / end.z - 1 / start.z) / length;
        for (let i = 0; i < length; i++) {
            //if (wStart < this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320]) {
            //  this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320] = wStart;
            this.drawPixel(Math.round(xPosition), Math.round(yPosition), color);
            //}
            xPosition += dx;
            yPosition += dy;
            wStart += wDelta;
        }
    }
    /**
     * TODO:
     * - adjust method in order to have window coordinates as parameter
     *   that gonna be used to define the area to be displayed
     * - http://qzx.com/pc-gpe/
     */
    drawRotoZoomer(texture) {
        let scale = Math.sin(Date.now() * 0.0005) + 1.1;
        let yStepX = Math.sin(Date.now() * 0.0003) * scale;
        let yStepY = Math.cos(Date.now() * 0.0003) * scale;
        let xStepX = yStepY;
        let xStepY = -yStepX;
        let texYCoord = Math.sin(Date.now() * 0.0002) * 512;
        let texXCoord = Math.cos(Date.now() * 0.0002) * 512;
        let texYCoordInner = 0;
        let texXCoordInner = 0;
        let framebufferPos = 0;
        for (let y = 0; y < 200; y++) {
            texXCoordInner = texXCoord;
            texYCoordInner = texYCoord;
            for (let x = 0; x < 320; x++) {
                this.framebuffer[framebufferPos++] = texture.texture[(texXCoordInner & 63) + (texYCoordInner & 0xff) * 64];
                texXCoordInner += xStepX;
                texYCoordInner += xStepY;
            }
            texXCoord += yStepX;
            texYCoord += yStepY;
        }
    }
    drawMetaballs() {
        let balls = [
            new Vector3f_1.default(Math.sin(Date.now() * 0.002) * 100 + 150, Math.cos(Date.now() * 0.003) * 100 + 100, 0),
            new Vector3f_1.default(Math.sin(Date.now() * 0.001) * 100 + 150, Math.cos(Date.now() * 0.002) * 100 + 100, 0)
        ];
        let index = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let intensity = 0;
                for (let b = 0; b < 2; b++) {
                    let xx = (balls[b].x - x);
                    let yy = (balls[b].y - y);
                    let length = Math.sqrt(xx * xx + yy * yy);
                    intensity += 8000 / length;
                }
                this.framebuffer[index++] = 255 << 24 | Math.min(intensity, 255);
                ;
            }
        }
    }
    draw(texture) {
        // this.clearCol(80 << 16 | 80 << 8 | 99 << 0 | 255 << 24)
        let a = Date.now() * 0.001;
        for (let i = 0; i < 200; i++) {
            let xoff = (Math.sin(a + i * 0.01) * 50) | 0;
            let rot = Math.sin(a * 0.4 + i * 0.0021) * Math.PI * 2;
            let x1 = (Math.sin(rot) * 32) | 0;
            let x2 = (Math.sin(Math.PI * 2 / 4 + rot) * 32) | 0;
            let x3 = (Math.sin(Math.PI * 2 / 4 * 2 + rot) * 32) | 0;
            let x4 = (Math.sin(Math.PI * 2 / 4 * 3 + rot) * 32) | 0;
            if (x2 > x1) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 1.5 + rot));
                let dist = x2 - x1;
                let xPos = x1 + 120 + xoff;
                this.drawSpan(dist, xPos, i, scale, texture);
            }
            if (x3 > x2) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 2.5 + rot));
                let dist = x3 - x2;
                let xPos = x2 + 120 + xoff;
                this.drawSpan(dist, xPos, i, scale, texture);
            }
            if (x4 > x3) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 3.5 + rot));
                let dist = x4 - x3;
                let xPos = x3 + 120 + xoff;
                this.drawSpan(dist, xPos, i, scale, texture);
            }
            if (x1 > x4) {
                let scale = Math.max(0, Math.sin(Math.PI * 2 / 4 * 4.5 + rot));
                let dist = x1 - x4;
                let xPos = x4 + 120 + xoff;
                this.drawSpan(dist, xPos, i, scale, texture);
            }
        }
    }
}
Framebuffer.PIXEL_SIZE_IN_BYTES = 4;
Framebuffer.minWindow = new Vector3f_1.default(0 + 5, 0 + 50, 0);
Framebuffer.maxWindow = new Vector3f_1.default(319 - 5, 199 - 50, 0);
Framebuffer.REGION_CODE_CENTER = 0b0000;
Framebuffer.REGION_CODE_LEFT = 0b0001;
Framebuffer.REGION_CODE_RIGHT = 0b0010;
Framebuffer.REGION_CODE_BOTTOM = 0b0100;
Framebuffer.REGION_CODE_TOP = 0b1000;
exports.default = Framebuffer;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(0);
class Matrix3f {
    static constructXRotationMatrix(angle) {
        let matrix = new Matrix3f();
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = cos;
        matrix.m23 = -sin;
        matrix.m31 = 0.0;
        matrix.m32 = sin;
        matrix.m33 = cos;
        return matrix;
    }
    static constructYRotationMatrix(angle) {
        let matrix = new Matrix3f();
        matrix.m11 = Math.cos(angle);
        matrix.m12 = 0.0;
        matrix.m13 = Math.sin(angle);
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m31 = -Math.sin(angle);
        matrix.m32 = 0.0;
        matrix.m33 = Math.cos(angle);
        return matrix;
    }
    static constructZRotationMatrix(angle) {
        let matrix = new Matrix3f();
        matrix.m11 = Math.cos(angle);
        matrix.m12 = -Math.sin(angle);
        matrix.m13 = 0.0;
        matrix.m21 = Math.sin(angle);
        matrix.m22 = Math.cos(angle);
        matrix.m23 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        return matrix;
    }
    static constructScaleMatrix(xScale, yScale, zScale) {
        let matrix = new Matrix3f();
        matrix.m11 = xScale;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = yScale;
        matrix.m23 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = zScale;
        return matrix;
    }
    multiplyMatrix(matrix) {
        let result = new Matrix3f();
        result.m11 = this.m11 * matrix.m11 + this.m12 * matrix.m21 + this.m13 * matrix.m31;
        result.m21 = this.m21 * matrix.m11 + this.m22 * matrix.m21 + this.m23 * matrix.m31;
        result.m31 = this.m31 * matrix.m11 + this.m32 * matrix.m21 + this.m33 * matrix.m31;
        result.m12 = this.m11 * matrix.m12 + this.m12 * matrix.m22 + this.m13 * matrix.m32;
        result.m22 = this.m21 * matrix.m12 + this.m22 * matrix.m22 + this.m23 * matrix.m32;
        result.m32 = this.m31 * matrix.m12 + this.m32 * matrix.m22 + this.m33 * matrix.m32;
        result.m13 = this.m11 * matrix.m13 + this.m12 * matrix.m23 + this.m13 * matrix.m33;
        result.m23 = this.m21 * matrix.m13 + this.m22 * matrix.m23 + this.m23 * matrix.m33;
        result.m33 = this.m31 * matrix.m13 + this.m32 * matrix.m23 + this.m33 * matrix.m33;
        return result;
    }
    multiply(vector) {
        return new Vector3f_1.default(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z);
    }
}
exports.default = Matrix3f;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_00_introduction.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_00_research.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_01_pipeline.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_02_transformations.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_03_projections.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_04_lighting.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_05_rasterization.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_06_texturing.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_07_shadows.pdf
 * https://cg.informatik.uni-freiburg.de/course_notes/graphics_08_transparencyReflection.pdf
 * https://cg.informatik.uni-freiburg.de/teaching.htm
 * @author Johannes Diemke
 * @since 2017-05-07
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(0);
const Vector4f_1 = __webpack_require__(1);
class Matrix4f {
    static constructIdentityMatrix() {
        let matrix = new Matrix4f();
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = 0.0;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    static constructTranslationMatrix(tx, ty, tz) {
        let matrix = new Matrix4f();
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = tx;
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = ty;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = tz;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    static constructXRotationMatrix(alpha) {
        let matrix = new Matrix4f();
        matrix.m11 = 1.0;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = Math.cos(alpha);
        matrix.m23 = -Math.sin(alpha);
        matrix.m24 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = Math.sin(alpha);
        matrix.m33 = Math.cos(alpha);
        matrix.m34 = 0.0;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    static constructYRotationMatrix(alpha) {
        let matrix = new Matrix4f();
        matrix.m11 = Math.cos(alpha);
        matrix.m12 = 0.0;
        matrix.m13 = Math.sin(alpha);
        matrix.m14 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = 1.0;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;
        matrix.m31 = -Math.sin(alpha);
        matrix.m32 = 0.0;
        matrix.m33 = Math.cos(alpha);
        matrix.m34 = 0.0;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    static constructZRotationMatrix(alpha) {
        let matrix = new Matrix4f();
        matrix.m11 = Math.cos(alpha);
        matrix.m12 = -Math.sin(alpha);
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;
        matrix.m21 = Math.sin(alpha);
        matrix.m22 = Math.cos(alpha);
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = 1.0;
        matrix.m34 = 0.0;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    static constructScaleMatrix(sx, sy, sz) {
        let matrix = new Matrix4f();
        matrix.m11 = sx;
        matrix.m12 = 0.0;
        matrix.m13 = 0.0;
        matrix.m14 = 0.0;
        matrix.m21 = 0.0;
        matrix.m22 = sy;
        matrix.m23 = 0.0;
        matrix.m24 = 0.0;
        matrix.m31 = 0.0;
        matrix.m32 = 0.0;
        matrix.m33 = sz;
        matrix.m34 = 0.0;
        matrix.m41 = 0.0;
        matrix.m42 = 0.0;
        matrix.m43 = 0.0;
        matrix.m44 = 1.0;
        return matrix;
    }
    multiplyMatrix(matrix) {
        let result = new Matrix4f();
        result.m11 = this.m11 * matrix.m11 + this.m12 * matrix.m21 + this.m13 * matrix.m31 + this.m14 * matrix.m41;
        result.m21 = this.m21 * matrix.m11 + this.m22 * matrix.m21 + this.m23 * matrix.m31 + this.m24 * matrix.m41;
        result.m31 = this.m31 * matrix.m11 + this.m32 * matrix.m21 + this.m33 * matrix.m31 + this.m34 * matrix.m41;
        result.m41 = this.m41 * matrix.m11 + this.m42 * matrix.m21 + this.m43 * matrix.m31 + this.m44 * matrix.m41;
        result.m12 = this.m11 * matrix.m12 + this.m12 * matrix.m22 + this.m13 * matrix.m32 + this.m14 * matrix.m42;
        result.m22 = this.m21 * matrix.m12 + this.m22 * matrix.m22 + this.m23 * matrix.m32 + this.m24 * matrix.m42;
        result.m32 = this.m31 * matrix.m12 + this.m32 * matrix.m22 + this.m33 * matrix.m32 + this.m34 * matrix.m42;
        result.m42 = this.m41 * matrix.m12 + this.m42 * matrix.m22 + this.m43 * matrix.m32 + this.m44 * matrix.m42;
        result.m13 = this.m11 * matrix.m13 + this.m12 * matrix.m23 + this.m13 * matrix.m33 + this.m14 * matrix.m43;
        result.m23 = this.m21 * matrix.m13 + this.m22 * matrix.m23 + this.m23 * matrix.m33 + this.m24 * matrix.m43;
        result.m33 = this.m31 * matrix.m13 + this.m32 * matrix.m23 + this.m33 * matrix.m33 + this.m34 * matrix.m43;
        result.m43 = this.m41 * matrix.m13 + this.m42 * matrix.m23 + this.m43 * matrix.m33 + this.m44 * matrix.m43;
        result.m14 = this.m11 * matrix.m14 + this.m12 * matrix.m24 + this.m13 * matrix.m34 + this.m14 * matrix.m44;
        result.m24 = this.m21 * matrix.m14 + this.m22 * matrix.m24 + this.m23 * matrix.m34 + this.m24 * matrix.m44;
        result.m34 = this.m31 * matrix.m14 + this.m32 * matrix.m24 + this.m33 * matrix.m34 + this.m34 * matrix.m44;
        result.m44 = this.m41 * matrix.m14 + this.m42 * matrix.m24 + this.m43 * matrix.m34 + this.m44 * matrix.m44;
        return result;
    }
    multiply(vector) {
        return new Vector3f_1.default(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34);
    }
    multiplyHom(vector) {
        return new Vector4f_1.default(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w, this.m41 * vector.x + this.m42 * vector.y + this.m43 * vector.z + this.m44 * vector.w);
    }
}
exports.default = Matrix4f;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Texture {
}
exports.default = Texture;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0e7cabddfc9af1214d72c4201b0da9d9.mp3";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "36fbc222529fa8e2b722e7de1ca8f010.png";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b30d17fb175566e9e20d5584d7ae6bfb.png";

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
	"vertices": [
		{
			"x": -0.06687,
			"y": 0.164502,
			"z": -1.558026
		},
		{
			"x": -0.053139,
			"y": 0.143871,
			"z": -1.792698
		},
		{
			"x": -0.075402,
			"y": 0.12585,
			"z": -1.792698
		},
		{
			"x": -0.093846,
			"y": 0.143712,
			"z": -1.557438
		},
		{
			"x": -0.117405,
			"y": 0.011547,
			"z": -1.556802
		},
		{
			"x": -0.091668,
			"y": 0.021099,
			"z": -1.792698
		},
		{
			"x": -0.075873,
			"y": -0.002562,
			"z": -1.792698
		},
		{
			"x": -0.097239,
			"y": -0.017955,
			"z": -1.556802
		},
		{
			"x": -0.053745,
			"y": -0.021087,
			"z": -1.792698
		},
		{
			"x": -0.069015,
			"y": -0.041088,
			"z": -1.556802
		},
		{
			"x": -0.091365,
			"y": 0.102555,
			"z": -1.792698
		},
		{
			"x": -0.117222,
			"y": 0.113007,
			"z": -1.55703
		},
		{
			"x": -0.03675,
			"y": 0.174036,
			"z": -1.558566
		},
		{
			"x": -0.027318,
			"y": 0.151965,
			"z": -1.794801
		},
		{
			"x": -0.127881,
			"y": 0.045036,
			"z": -1.556802
		},
		{
			"x": -0.099843,
			"y": 0.04797,
			"z": -1.792698
		},
		{
			"x": 0.003666,
			"y": 0.179154,
			"z": -1.558881
		},
		{
			"x": 0.003666,
			"y": 0.153759,
			"z": -1.792698
		},
		{
			"x": -0.04209,
			"y": -0.029466,
			"z": -1.795719
		},
		{
			"x": -0.035019,
			"y": -0.055971,
			"z": -1.556802
		},
		{
			"x": -0.099741,
			"y": 0.075876,
			"z": -1.792698
		},
		{
			"x": -0.127815,
			"y": 0.079794,
			"z": -1.556802
		},
		{
			"x": -0.035793,
			"y": -0.015873,
			"z": -1.592484
		},
		{
			"x": -0.044634,
			"y": -0.009231,
			"z": -1.589646
		},
		{
			"x": -0.063315,
			"y": 0.007872,
			"z": -1.589646
		},
		{
			"x": -0.076488,
			"y": 0.027606,
			"z": -1.589652
		},
		{
			"x": -0.083274,
			"y": 0.049914,
			"z": -1.589655
		},
		{
			"x": -0.08319,
			"y": 0.07302,
			"z": -1.589661
		},
		{
			"x": -0.076248,
			"y": 0.09513,
			"z": -1.589667
		},
		{
			"x": -0.06297,
			"y": 0.114507,
			"z": -1.58967
		},
		{
			"x": -0.044742,
			"y": 0.129249,
			"z": -1.589676
		},
		{
			"x": -0.023574,
			"y": 0.135867,
			"z": -1.591653
		},
		{
			"x": 0.003666,
			"y": 0.137445,
			"z": -1.589676
		},
		{
			"x": 0.030903,
			"y": 0.135867,
			"z": -1.591653
		},
		{
			"x": 0.052071,
			"y": 0.129249,
			"z": -1.589676
		},
		{
			"x": 0.070299,
			"y": 0.114507,
			"z": -1.58967
		},
		{
			"x": 0.083577,
			"y": 0.09513,
			"z": -1.589667
		},
		{
			"x": 0.090519,
			"y": 0.07302,
			"z": -1.589661
		},
		{
			"x": 0.090603,
			"y": 0.049914,
			"z": -1.589655
		},
		{
			"x": 0.083817,
			"y": 0.027606,
			"z": -1.589652
		},
		{
			"x": 0.070644,
			"y": 0.007872,
			"z": -1.589646
		},
		{
			"x": 0.051963,
			"y": -0.009231,
			"z": -1.589646
		},
		{
			"x": 0.043122,
			"y": -0.015873,
			"z": -1.592484
		},
		{
			"x": 0.003666,
			"y": -0.021249,
			"z": -1.58964
		},
		{
			"x": 0.003666,
			"y": -0.037311,
			"z": -1.792698
		},
		{
			"x": 0.003666,
			"y": -0.061413,
			"z": -1.556457
		},
		{
			"x": 0.101175,
			"y": 0.143712,
			"z": -1.557438
		},
		{
			"x": 0.082731,
			"y": 0.12585,
			"z": -1.792698
		},
		{
			"x": 0.060468,
			"y": 0.143871,
			"z": -1.792698
		},
		{
			"x": 0.074199,
			"y": 0.164502,
			"z": -1.558026
		},
		{
			"x": 0.104568,
			"y": -0.017955,
			"z": -1.556802
		},
		{
			"x": 0.083202,
			"y": -0.002562,
			"z": -1.792698
		},
		{
			"x": 0.098997,
			"y": 0.021099,
			"z": -1.792698
		},
		{
			"x": 0.124734,
			"y": 0.011547,
			"z": -1.556802
		},
		{
			"x": 0.076344,
			"y": -0.041088,
			"z": -1.556802
		},
		{
			"x": 0.061074,
			"y": -0.021087,
			"z": -1.792698
		},
		{
			"x": 0.124551,
			"y": 0.113007,
			"z": -1.55703
		},
		{
			"x": 0.098694,
			"y": 0.102555,
			"z": -1.792698
		},
		{
			"x": 0.034647,
			"y": 0.151965,
			"z": -1.794801
		},
		{
			"x": 0.044079,
			"y": 0.174036,
			"z": -1.558566
		},
		{
			"x": 0.107172,
			"y": 0.04797,
			"z": -1.792698
		},
		{
			"x": 0.13521,
			"y": 0.045036,
			"z": -1.556802
		},
		{
			"x": 0.042348,
			"y": -0.055971,
			"z": -1.556802
		},
		{
			"x": 0.049419,
			"y": -0.029466,
			"z": -1.795719
		},
		{
			"x": 0.135144,
			"y": 0.079794,
			"z": -1.556802
		},
		{
			"x": 0.10707,
			"y": 0.075876,
			"z": -1.792698
		},
		{
			"x": -0.047745,
			"y": -0.013368,
			"z": -1.792683
		},
		{
			"x": -0.038334,
			"y": -0.020439,
			"z": -1.795704
		},
		{
			"x": 0.003666,
			"y": -0.02616,
			"z": -1.792677
		},
		{
			"x": 0.045663,
			"y": -0.020439,
			"z": -1.795704
		},
		{
			"x": 0.055074,
			"y": -0.013368,
			"z": -1.792683
		},
		{
			"x": 0.074955,
			"y": 0.004836,
			"z": -1.792683
		},
		{
			"x": 0.088977,
			"y": 0.025839,
			"z": -1.792689
		},
		{
			"x": 0.096198,
			"y": 0.049581,
			"z": -1.792695
		},
		{
			"x": 0.096111,
			"y": 0.074175,
			"z": -1.792701
		},
		{
			"x": 0.088722,
			"y": 0.097707,
			"z": -1.792704
		},
		{
			"x": 0.074589,
			"y": 0.118332,
			"z": -1.79271
		},
		{
			"x": 0.055185,
			"y": 0.134025,
			"z": -1.792713
		},
		{
			"x": 0.032655,
			"y": 0.141066,
			"z": -1.794819
		},
		{
			"x": 0.003666,
			"y": 0.142749,
			"z": -1.792716
		},
		{
			"x": -0.025326,
			"y": 0.141066,
			"z": -1.794819
		},
		{
			"x": -0.047856,
			"y": 0.134025,
			"z": -1.792713
		},
		{
			"x": -0.06726,
			"y": 0.118332,
			"z": -1.79271
		},
		{
			"x": -0.081393,
			"y": 0.097707,
			"z": -1.792704
		},
		{
			"x": -0.088782,
			"y": 0.074175,
			"z": -1.792701
		},
		{
			"x": -0.088869,
			"y": 0.049581,
			"z": -1.792695
		},
		{
			"x": -0.081648,
			"y": 0.025839,
			"z": -1.792689
		},
		{
			"x": -0.067626,
			"y": 0.004836,
			"z": -1.792683
		},
		{
			"x": -0.678606,
			"y": 0.028212,
			"z": -1.604802
		},
		{
			"x": -0.678606,
			"y": 0.023367,
			"z": -1.654662
		},
		{
			"x": -0.678606,
			"y": 0.021198,
			"z": -1.65462
		},
		{
			"x": -0.324378,
			"y": 0.053574,
			"z": -1.309359
		},
		{
			"x": -0.324363,
			"y": 0.049578,
			"z": -0.995292
		},
		{
			"x": -0.678513,
			"y": 0.020964,
			"z": -1.450872
		},
		{
			"x": -0.678558,
			"y": 0.021081,
			"z": -1.552746
		},
		{
			"x": -0.324393,
			"y": 0.05757,
			"z": -1.623429
		},
		{
			"x": -0.324393,
			"y": 0.065532,
			"z": -1.624158
		},
		{
			"x": -0.324393,
			"y": 0.070665,
			"z": -1.470072
		},
		{
			"x": -0.678609,
			"y": 0.028212,
			"z": -1.554846
		},
		{
			"x": -0.324396,
			"y": 0.073716,
			"z": -1.315986
		},
		{
			"x": -0.678474,
			"y": 0.028212,
			"z": -1.502859
		},
		{
			"x": -0.324261,
			"y": 0.074397,
			"z": -1.155636
		},
		{
			"x": -0.67845,
			"y": 0.023601,
			"z": -1.450872
		},
		{
			"x": -0.324309,
			"y": 0.056754,
			"z": -0.995289
		},
		{
			"x": -0.678582,
			"y": 0.021141,
			"z": -1.603683
		},
		{
			"x": -0.324387,
			"y": 0.055572,
			"z": -1.466394
		},
		{
			"x": 0.685935,
			"y": 0.021198,
			"z": -1.65462
		},
		{
			"x": 0.685935,
			"y": 0.023367,
			"z": -1.654662
		},
		{
			"x": 0.685935,
			"y": 0.028212,
			"z": -1.604802
		},
		{
			"x": 0.685887,
			"y": 0.021081,
			"z": -1.552746
		},
		{
			"x": 0.685842,
			"y": 0.020964,
			"z": -1.450872
		},
		{
			"x": 0.331692,
			"y": 0.049578,
			"z": -0.995292
		},
		{
			"x": 0.331707,
			"y": 0.053574,
			"z": -1.309359
		},
		{
			"x": 0.331722,
			"y": 0.065532,
			"z": -1.624158
		},
		{
			"x": 0.331722,
			"y": 0.05757,
			"z": -1.623429
		},
		{
			"x": 0.331722,
			"y": 0.070665,
			"z": -1.470072
		},
		{
			"x": 0.331725,
			"y": 0.073716,
			"z": -1.315986
		},
		{
			"x": 0.685938,
			"y": 0.028212,
			"z": -1.554846
		},
		{
			"x": 0.33159,
			"y": 0.074397,
			"z": -1.155636
		},
		{
			"x": 0.685803,
			"y": 0.028212,
			"z": -1.502859
		},
		{
			"x": 0.331638,
			"y": 0.056754,
			"z": -0.995289
		},
		{
			"x": 0.685779,
			"y": 0.023601,
			"z": -1.450872
		},
		{
			"x": 0.331716,
			"y": 0.055572,
			"z": -1.466394
		},
		{
			"x": 0.685911,
			"y": 0.021141,
			"z": -1.603683
		},
		{
			"x": 0.003666,
			"y": 0.905907,
			"z": -1.483485
		},
		{
			"x": 0.006609,
			"y": 0.905907,
			"z": -1.548126
		},
		{
			"x": 0.00699,
			"y": 0.905907,
			"z": -1.603344
		},
		{
			"x": 0.007452,
			"y": 0.905907,
			"z": -1.673838
		},
		{
			"x": 0.007872,
			"y": 0.905907,
			"z": -1.737897
		},
		{
			"x": 0.008214,
			"y": 0.905907,
			"z": -1.787904
		},
		{
			"x": 0.003666,
			"y": 0.905907,
			"z": -1.78794
		},
		{
			"x": -0.000885,
			"y": 0.905907,
			"z": -1.787904
		},
		{
			"x": -0.000543,
			"y": 0.905907,
			"z": -1.737897
		},
		{
			"x": -0.000123,
			"y": 0.905907,
			"z": -1.673838
		},
		{
			"x": 0.000339,
			"y": 0.905907,
			"z": -1.603344
		},
		{
			"x": 0.00072,
			"y": 0.905907,
			"z": -1.548126
		},
		{
			"x": 0.003666,
			"y": 0.249198,
			"z": -0.570483
		},
		{
			"x": 0.003666,
			"y": 0.368028,
			"z": -0.948078
		},
		{
			"x": 0.00018,
			"y": 0.350166,
			"z": -1.05282
		},
		{
			"x": -0.011637,
			"y": 0.221964,
			"z": -0.864645
		},
		{
			"x": -0.002367,
			"y": 0.341442,
			"z": -1.180371
		},
		{
			"x": -0.027228,
			"y": 0.219087,
			"z": -1.000926
		},
		{
			"x": -0.003927,
			"y": 0.339852,
			"z": -1.302927
		},
		{
			"x": -0.041046,
			"y": 0.210348,
			"z": -1.169736
		},
		{
			"x": -0.025374,
			"y": 0.243348,
			"z": -1.320333
		},
		{
			"x": -0.037479,
			"y": 0.197859,
			"z": -1.323618
		},
		{
			"x": -0.006741,
			"y": 0.247455,
			"z": -1.557042
		},
		{
			"x": -0.006774,
			"y": 0.339609,
			"z": -1.557666
		},
		{
			"x": 0.003666,
			"y": 0.339609,
			"z": -1.557822
		},
		{
			"x": 0.003666,
			"y": 0.248208,
			"z": -1.557123
		},
		{
			"x": 0.003666,
			"y": 0.245514,
			"z": -1.320564
		},
		{
			"x": 0.003666,
			"y": 0.201984,
			"z": -1.324026
		},
		{
			"x": 0.003666,
			"y": 0.636969,
			"z": -1.21578
		},
		{
			"x": 0.00045,
			"y": 0.628038,
			"z": -1.300473
		},
		{
			"x": -0.001014,
			"y": 0.623676,
			"z": -1.391859
		},
		{
			"x": -0.002025,
			"y": 0.622881,
			"z": -1.488381
		},
		{
			"x": -0.002931,
			"y": 0.622758,
			"z": -1.581888
		},
		{
			"x": -0.005319,
			"y": 0.339609,
			"z": -1.425876
		},
		{
			"x": -0.003648,
			"y": 0.622758,
			"z": -1.656429
		},
		{
			"x": -0.006414,
			"y": 0.339609,
			"z": -1.524954
		},
		{
			"x": 0.003666,
			"y": 0.339615,
			"z": -1.524732
		},
		{
			"x": 0.013743,
			"y": 0.339609,
			"z": -1.524954
		},
		{
			"x": 0.014103,
			"y": 0.339609,
			"z": -1.557666
		},
		{
			"x": 0.003666,
			"y": 0.622761,
			"z": -1.656336
		},
		{
			"x": 0.018966,
			"y": 0.221964,
			"z": -0.864645
		},
		{
			"x": 0.007149,
			"y": 0.350166,
			"z": -1.05282
		},
		{
			"x": 0.034557,
			"y": 0.219087,
			"z": -1.000926
		},
		{
			"x": 0.009696,
			"y": 0.341442,
			"z": -1.180371
		},
		{
			"x": 0.048375,
			"y": 0.210348,
			"z": -1.169736
		},
		{
			"x": 0.011256,
			"y": 0.339852,
			"z": -1.302927
		},
		{
			"x": 0.044808,
			"y": 0.197859,
			"z": -1.323618
		},
		{
			"x": 0.032703,
			"y": 0.243348,
			"z": -1.320333
		},
		{
			"x": 0.01407,
			"y": 0.247455,
			"z": -1.557042
		},
		{
			"x": 0.006879,
			"y": 0.628038,
			"z": -1.300473
		},
		{
			"x": 0.008343,
			"y": 0.623676,
			"z": -1.391859
		},
		{
			"x": 0.009354,
			"y": 0.622881,
			"z": -1.488381
		},
		{
			"x": 0.012648,
			"y": 0.339609,
			"z": -1.425876
		},
		{
			"x": 0.01026,
			"y": 0.622758,
			"z": -1.581888
		},
		{
			"x": 0.010977,
			"y": 0.622758,
			"z": -1.656429
		},
		{
			"x": -0.324411,
			"y": 0.078528,
			"z": -0.123071
		},
		{
			"x": -0.7149,
			"y": 0.070176,
			"z": -0.386874
		},
		{
			"x": -0.714999,
			"y": 0.061017,
			"z": -0.261247
		},
		{
			"x": -0.324414,
			"y": 0.062163,
			"z": 0.043308
		},
		{
			"x": -0.715002,
			"y": 0.058455,
			"z": -0.261247
		},
		{
			"x": -0.324417,
			"y": 0.059328,
			"z": 0.043308
		},
		{
			"x": -0.714996,
			"y": 0.044712,
			"z": -0.386568
		},
		{
			"x": -0.32442,
			"y": 0.036234,
			"z": -0.123064
		},
		{
			"x": -0.714963,
			"y": 0.042732,
			"z": -0.565731
		},
		{
			"x": -0.324378,
			"y": 0.032799,
			"z": -0.413025
		},
		{
			"x": -0.714996,
			"y": 0.045201,
			"z": -0.700491
		},
		{
			"x": -0.324414,
			"y": 0.036861,
			"z": -0.614991
		},
		{
			"x": -0.714993,
			"y": 0.049788,
			"z": -0.859224
		},
		{
			"x": -0.324408,
			"y": 0.044394,
			"z": -0.852888
		},
		{
			"x": -0.323904,
			"y": 0.089319,
			"z": -0.593358
		},
		{
			"x": -0.714528,
			"y": 0.072327,
			"z": -0.699957
		},
		{
			"x": -0.714366,
			"y": 0.072642,
			"z": -0.564903
		},
		{
			"x": -0.323781,
			"y": 0.085203,
			"z": -0.411783
		},
		{
			"x": -0.324405,
			"y": 0.04878,
			"z": -0.854355
		},
		{
			"x": -0.71499,
			"y": 0.052773,
			"z": -0.860274
		},
		{
			"x": -1.105584,
			"y": 0.059871,
			"z": -0.565803
		},
		{
			"x": -1.105584,
			"y": 0.057579,
			"z": -0.565803
		},
		{
			"x": -1.105389,
			"y": 0.061824,
			"z": -0.650676
		},
		{
			"x": -1.10499,
			"y": 0.059799,
			"z": -0.730524
		},
		{
			"x": -1.105224,
			"y": 0.058149,
			"z": -0.804579
		},
		{
			"x": -1.105578,
			"y": 0.056766,
			"z": -0.866193
		},
		{
			"x": -1.105578,
			"y": 0.055179,
			"z": -0.865563
		},
		{
			"x": -1.105716,
			"y": 0.053013,
			"z": -0.809643
		},
		{
			"x": -1.105587,
			"y": 0.052389,
			"z": -0.730854
		},
		{
			"x": -1.105575,
			"y": 0.05319,
			"z": -0.650073
		},
		{
			"x": 0.331743,
			"y": 0.062163,
			"z": 0.043308
		},
		{
			"x": 0.722328,
			"y": 0.061017,
			"z": -0.261247
		},
		{
			"x": 0.722229,
			"y": 0.070176,
			"z": -0.386874
		},
		{
			"x": 0.33174,
			"y": 0.078528,
			"z": -0.123071
		},
		{
			"x": 0.331746,
			"y": 0.059328,
			"z": 0.043308
		},
		{
			"x": 0.722331,
			"y": 0.058455,
			"z": -0.261247
		},
		{
			"x": 0.331749,
			"y": 0.036234,
			"z": -0.123064
		},
		{
			"x": 0.722325,
			"y": 0.044712,
			"z": -0.386568
		},
		{
			"x": 0.331707,
			"y": 0.032799,
			"z": -0.413025
		},
		{
			"x": 0.722292,
			"y": 0.042732,
			"z": -0.565731
		},
		{
			"x": 0.331743,
			"y": 0.036861,
			"z": -0.614991
		},
		{
			"x": 0.722325,
			"y": 0.045201,
			"z": -0.700491
		},
		{
			"x": 0.331737,
			"y": 0.044394,
			"z": -0.852888
		},
		{
			"x": 0.722322,
			"y": 0.049788,
			"z": -0.859224
		},
		{
			"x": 0.33111,
			"y": 0.085203,
			"z": -0.411783
		},
		{
			"x": 0.721695,
			"y": 0.072642,
			"z": -0.564903
		},
		{
			"x": 0.721857,
			"y": 0.072327,
			"z": -0.699957
		},
		{
			"x": 0.331233,
			"y": 0.089319,
			"z": -0.593358
		},
		{
			"x": 0.722319,
			"y": 0.052773,
			"z": -0.860274
		},
		{
			"x": 0.331734,
			"y": 0.04878,
			"z": -0.854355
		},
		{
			"x": 1.112913,
			"y": 0.057579,
			"z": -0.565803
		},
		{
			"x": 1.112913,
			"y": 0.059871,
			"z": -0.565803
		},
		{
			"x": 1.112718,
			"y": 0.061824,
			"z": -0.650676
		},
		{
			"x": 1.112319,
			"y": 0.059799,
			"z": -0.730524
		},
		{
			"x": 1.112553,
			"y": 0.058149,
			"z": -0.804579
		},
		{
			"x": 1.112907,
			"y": 0.056766,
			"z": -0.866193
		},
		{
			"x": 1.112907,
			"y": 0.055179,
			"z": -0.865563
		},
		{
			"x": 1.113048,
			"y": 0.053013,
			"z": -0.809643
		},
		{
			"x": 1.112916,
			"y": 0.052389,
			"z": -0.730854
		},
		{
			"x": 1.112904,
			"y": 0.05319,
			"z": -0.650073
		},
		{
			"x": 0.003666,
			"y": 0.31539,
			"z": 1.013703
		},
		{
			"x": -0.013974,
			"y": 0.312537,
			"z": 1.013652
		},
		{
			"x": 0.003666,
			"y": 0.240891,
			"z": 1.126905
		},
		{
			"x": -0.075615,
			"y": 0.329226,
			"z": 0.771249
		},
		{
			"x": -0.107874,
			"y": 0.259182,
			"z": 0.771249
		},
		{
			"x": -0.10536,
			"y": 0.25617,
			"z": 0.844521
		},
		{
			"x": -0.073863,
			"y": 0.323358,
			"z": 0.844866
		},
		{
			"x": -0.017961,
			"y": 0.219765,
			"z": 1.126863
		},
		{
			"x": -0.009966,
			"y": 0.230328,
			"z": 1.126884
		},
		{
			"x": -0.030243,
			"y": 0.302526,
			"z": 1.013649
		},
		{
			"x": -0.048714,
			"y": 0.281553,
			"z": 1.013649
		},
		{
			"x": 0.003666,
			"y": 0.359562,
			"z": 0.916179
		},
		{
			"x": -0.019485,
			"y": 0.353214,
			"z": 0.916461
		},
		{
			"x": -0.045411,
			"y": 0.357291,
			"z": 0.844851
		},
		{
			"x": -0.047871,
			"y": 0.364449,
			"z": 0.771249
		},
		{
			"x": -0.065232,
			"y": 0.234399,
			"z": 1.013649
		},
		{
			"x": -0.066909,
			"y": 0.320121,
			"z": 0.617301
		},
		{
			"x": -0.041367,
			"y": 0.353814,
			"z": 0.617466
		},
		{
			"x": -0.034884,
			"y": 0.331812,
			"z": 0.538794
		},
		{
			"x": -0.059925,
			"y": 0.303351,
			"z": 0.536403
		},
		{
			"x": -0.049965,
			"y": 0.273177,
			"z": 0.444381
		},
		{
			"x": -0.076344,
			"y": 0.267591,
			"z": 0.535056
		},
		{
			"x": -0.016512,
			"y": 0.348144,
			"z": 0.540225
		},
		{
			"x": -0.011745,
			"y": 0.318162,
			"z": 0.445995
		},
		{
			"x": -0.025233,
			"y": 0.302595,
			"z": 0.445611
		},
		{
			"x": -0.076263,
			"y": 0.331488,
			"z": 0.704496
		},
		{
			"x": -0.10566,
			"y": 0.261819,
			"z": 0.704496
		},
		{
			"x": 0.003666,
			"y": 0.379836,
			"z": 0.616497
		},
		{
			"x": 0.003666,
			"y": 0.356319,
			"z": 0.54177
		},
		{
			"x": -0.019752,
			"y": 0.370905,
			"z": 0.616929
		},
		{
			"x": -0.094758,
			"y": 0.263499,
			"z": 0.616395
		},
		{
			"x": 0.003666,
			"y": 0.387915,
			"z": 0.771252
		},
		{
			"x": -0.023874,
			"y": 0.381117,
			"z": 0.771249
		},
		{
			"x": -0.023508,
			"y": 0.371592,
			"z": 0.844809
		},
		{
			"x": 0.003666,
			"y": 0.38022,
			"z": 0.844836
		},
		{
			"x": -0.064215,
			"y": 0.310257,
			"z": 0.917283
		},
		{
			"x": -0.040827,
			"y": 0.338712,
			"z": 0.916812
		},
		{
			"x": -0.092634,
			"y": 0.248325,
			"z": 0.919314
		},
		{
			"x": -0.022362,
			"y": 0.383712,
			"z": 0.704496
		},
		{
			"x": -0.046584,
			"y": 0.366933,
			"z": 0.704496
		},
		{
			"x": 0.003666,
			"y": 0.391431,
			"z": 0.704499
		},
		{
			"x": 0.003666,
			"y": 0.324243,
			"z": 0.447411
		},
		{
			"x": 0.021303,
			"y": 0.312537,
			"z": 1.013652
		},
		{
			"x": 0.081192,
			"y": 0.323358,
			"z": 0.844866
		},
		{
			"x": 0.112689,
			"y": 0.25617,
			"z": 0.844521
		},
		{
			"x": 0.115203,
			"y": 0.259182,
			"z": 0.771249
		},
		{
			"x": 0.082944,
			"y": 0.329226,
			"z": 0.771249
		},
		{
			"x": 0.056043,
			"y": 0.281553,
			"z": 1.013649
		},
		{
			"x": 0.037572,
			"y": 0.302526,
			"z": 1.013649
		},
		{
			"x": 0.017295,
			"y": 0.230328,
			"z": 1.126884
		},
		{
			"x": 0.02529,
			"y": 0.219765,
			"z": 1.126863
		},
		{
			"x": 0.026814,
			"y": 0.353214,
			"z": 0.916461
		},
		{
			"x": 0.0552,
			"y": 0.364449,
			"z": 0.771249
		},
		{
			"x": 0.05274,
			"y": 0.357291,
			"z": 0.844851
		},
		{
			"x": 0.072561,
			"y": 0.234399,
			"z": 1.013649
		},
		{
			"x": 0.067254,
			"y": 0.303351,
			"z": 0.536403
		},
		{
			"x": 0.042213,
			"y": 0.331812,
			"z": 0.538794
		},
		{
			"x": 0.048696,
			"y": 0.353814,
			"z": 0.617466
		},
		{
			"x": 0.074238,
			"y": 0.320121,
			"z": 0.617301
		},
		{
			"x": 0.083673,
			"y": 0.267591,
			"z": 0.535056
		},
		{
			"x": 0.057294,
			"y": 0.273177,
			"z": 0.444381
		},
		{
			"x": 0.032562,
			"y": 0.302595,
			"z": 0.445611
		},
		{
			"x": 0.019074,
			"y": 0.318162,
			"z": 0.445995
		},
		{
			"x": 0.023841,
			"y": 0.348144,
			"z": 0.540225
		},
		{
			"x": 0.112989,
			"y": 0.261819,
			"z": 0.704496
		},
		{
			"x": 0.083592,
			"y": 0.331488,
			"z": 0.704496
		},
		{
			"x": 0.027081,
			"y": 0.370905,
			"z": 0.616929
		},
		{
			"x": 0.102087,
			"y": 0.263499,
			"z": 0.616395
		},
		{
			"x": 0.030837,
			"y": 0.371592,
			"z": 0.844809
		},
		{
			"x": 0.031203,
			"y": 0.381117,
			"z": 0.771249
		},
		{
			"x": 0.048156,
			"y": 0.338712,
			"z": 0.916812
		},
		{
			"x": 0.071544,
			"y": 0.310257,
			"z": 0.917283
		},
		{
			"x": 0.099963,
			"y": 0.248325,
			"z": 0.919314
		},
		{
			"x": 0.053913,
			"y": 0.366933,
			"z": 0.704496
		},
		{
			"x": 0.029691,
			"y": 0.383712,
			"z": 0.704496
		},
		{
			"x": -0.324417,
			"y": 0.059328,
			"z": 0.043308
		},
		{
			"x": -0.324417,
			"y": 0.060879,
			"z": 0.194449
		},
		{
			"x": -0.324414,
			"y": 0.062163,
			"z": 0.043308
		},
		{
			"x": -0.323904,
			"y": 0.089319,
			"z": -0.593358
		},
		{
			"x": -0.324402,
			"y": 0.079482,
			"z": -0.864639
		},
		{
			"x": -0.324405,
			"y": 0.04878,
			"z": -0.854355
		},
		{
			"x": -0.324363,
			"y": 0.049578,
			"z": -0.995292
		},
		{
			"x": -0.324408,
			"y": 0.044394,
			"z": -0.852888
		},
		{
			"x": -0.324129,
			"y": 0.079482,
			"z": -0.995286
		},
		{
			"x": -0.324309,
			"y": 0.056754,
			"z": -0.995289
		},
		{
			"x": -0.119103,
			"y": 0.005493,
			"z": 0.231552
		},
		{
			"x": -0.119109,
			"y": 0.005496,
			"z": 0.782934
		},
		{
			"x": -0.075234,
			"y": 0.008556,
			"z": 0.685005
		},
		{
			"x": -0.070341,
			"y": 0.008523,
			"z": 0.705825
		},
		{
			"x": -0.066891,
			"y": 0.008523,
			"z": 0.725547
		},
		{
			"x": -0.065304,
			"y": 0.008286,
			"z": 0.743607
		},
		{
			"x": -0.044532,
			"y": 0.005823,
			"z": 0.760269
		},
		{
			"x": 0.003666,
			"y": 0.000786,
			"z": 0.769449
		},
		{
			"x": -0.095481,
			"y": 0.023709,
			"z": 0.611949
		},
		{
			"x": -0.086022,
			"y": 0.023235,
			"z": 0.648279
		},
		{
			"x": -0.079434,
			"y": 0.022992,
			"z": 0.682713
		},
		{
			"x": -0.073908,
			"y": 0.022206,
			"z": 0.714003
		},
		{
			"x": -0.029934,
			"y": 0.013551,
			"z": 0.777252
		},
		{
			"x": 0.003666,
			"y": 0.005352,
			"z": 0.771327
		},
		{
			"x": -0.052419,
			"y": 0.262077,
			"z": 0.349071
		},
		{
			"x": -0.049965,
			"y": 0.273177,
			"z": 0.444381
		},
		{
			"x": -0.035889,
			"y": 0.275397,
			"z": 0.39621
		},
		{
			"x": -0.02181,
			"y": 0.27843,
			"z": 0.348039
		},
		{
			"x": 0.003666,
			"y": 0.283692,
			"z": 0.265017
		},
		{
			"x": -0.103584,
			"y": 0.219108,
			"z": 0.348129
		},
		{
			"x": -0.106782,
			"y": 0.220683,
			"z": 0.446676
		},
		{
			"x": -0.052047,
			"y": 0.249894,
			"z": 0.19053
		},
		{
			"x": -0.099921,
			"y": 0.216912,
			"z": 0.190853
		},
		{
			"x": -0.027228,
			"y": 0.219087,
			"z": -1.000926
		},
		{
			"x": -0.041046,
			"y": 0.210348,
			"z": -1.169736
		},
		{
			"x": -0.092736,
			"y": 0.20163,
			"z": -1.172028
		},
		{
			"x": -0.097479,
			"y": 0.210366,
			"z": -1.000176
		},
		{
			"x": -0.011637,
			"y": 0.221964,
			"z": -0.864645
		},
		{
			"x": -0.097593,
			"y": 0.210366,
			"z": -0.864642
		},
		{
			"x": -0.097065,
			"y": 0.210369,
			"z": -0.598257
		},
		{
			"x": -0.031932,
			"y": 0.234246,
			"z": -0.586857
		},
		{
			"x": -0.097344,
			"y": 0.210369,
			"z": -0.416553
		},
		{
			"x": -0.042063,
			"y": 0.233841,
			"z": -0.41781
		},
		{
			"x": -0.098352,
			"y": 0.212226,
			"z": -0.123868
		},
		{
			"x": -0.051663,
			"y": 0.233085,
			"z": -0.123472
		},
		{
			"x": -0.054819,
			"y": 0.239052,
			"z": 0.037823
		},
		{
			"x": -0.099099,
			"y": 0.214401,
			"z": 0.038205
		},
		{
			"x": -0.037479,
			"y": 0.197859,
			"z": -1.323618
		},
		{
			"x": -0.082599,
			"y": 0.187407,
			"z": -1.322853
		},
		{
			"x": -0.114117,
			"y": 0.04563,
			"z": 0.773961
		},
		{
			"x": -0.12573,
			"y": 0.046767,
			"z": 0.702294
		},
		{
			"x": -0.102501,
			"y": 0.044499,
			"z": 0.845628
		},
		{
			"x": -0.170121,
			"y": 0.058254,
			"z": 0.844758
		},
		{
			"x": -0.178026,
			"y": 0.058254,
			"z": 0.771243
		},
		{
			"x": 0.003666,
			"y": 0.068781,
			"z": 1.711194
		},
		{
			"x": -0.014079,
			"y": 0.08874,
			"z": 1.64658
		},
		{
			"x": -0.023991,
			"y": 0.0786,
			"z": 1.64646
		},
		{
			"x": -0.004527,
			"y": 0.064041,
			"z": 1.711047
		},
		{
			"x": 0.003666,
			"y": 0.053046,
			"z": 1.731126
		},
		{
			"x": 0.003666,
			"y": 0.09876,
			"z": 1.645296
		},
		{
			"x": -0.113253,
			"y": -0.009579,
			"z": 0.497484
		},
		{
			"x": -0.123204,
			"y": -0.016383,
			"z": 0.491601
		},
		{
			"x": -0.128118,
			"y": -0.026919,
			"z": 0.483906
		},
		{
			"x": -0.118902,
			"y": -0.047502,
			"z": 0.478539
		},
		{
			"x": -0.09216,
			"y": -0.071676,
			"z": 0.479358
		},
		{
			"x": -0.054702,
			"y": -0.086934,
			"z": 0.479712
		},
		{
			"x": 0.003666,
			"y": -0.094197,
			"z": 0.479889
		},
		{
			"x": 0.062031,
			"y": -0.086934,
			"z": 0.479712
		},
		{
			"x": 0.099489,
			"y": -0.071676,
			"z": 0.479358
		},
		{
			"x": 0.126231,
			"y": -0.047502,
			"z": 0.478539
		},
		{
			"x": 0.135447,
			"y": -0.026919,
			"z": 0.483906
		},
		{
			"x": 0.130533,
			"y": -0.016383,
			"z": 0.491601
		},
		{
			"x": 0.120582,
			"y": -0.009579,
			"z": 0.497484
		},
		{
			"x": 0.003666,
			"y": -0.013803,
			"z": 0.484086
		},
		{
			"x": -0.117711,
			"y": 0.223158,
			"z": 0.70449
		},
		{
			"x": -0.115209,
			"y": 0.221619,
			"z": 0.616395
		},
		{
			"x": -0.130857,
			"y": 0.190014,
			"z": 0.616392
		},
		{
			"x": -0.13122,
			"y": 0.19077,
			"z": 0.704502
		},
		{
			"x": -0.118707,
			"y": 0.223167,
			"z": 0.771249
		},
		{
			"x": -0.128244,
			"y": 0.191469,
			"z": 0.771243
		},
		{
			"x": -0.124824,
			"y": 0.192369,
			"z": 0.844989
		},
		{
			"x": -0.115776,
			"y": 0.222429,
			"z": 0.844842
		},
		{
			"x": -0.104598,
			"y": 0.219897,
			"z": 0.91788
		},
		{
			"x": -0.116562,
			"y": 0.191469,
			"z": 0.916443
		},
		{
			"x": -0.085989,
			"y": 0.214182,
			"z": 1.014645
		},
		{
			"x": -0.104595,
			"y": 0.187941,
			"z": 1.014168
		},
		{
			"x": -0.041367,
			"y": -0.078579,
			"z": -1.320717
		},
		{
			"x": 0.003666,
			"y": -0.084978,
			"z": -1.320396
		},
		{
			"x": 0.003666,
			"y": -0.101466,
			"z": -1.071558
		},
		{
			"x": -0.045003,
			"y": -0.087711,
			"z": -1.071852
		},
		{
			"x": -0.226965,
			"y": 0.046782,
			"z": -0.864723
		},
		{
			"x": -0.227373,
			"y": 0.046782,
			"z": -0.996729
		},
		{
			"x": -0.134061,
			"y": 0.023583,
			"z": -1.071852
		},
		{
			"x": -0.119091,
			"y": 0.00549,
			"z": -0.822987
		},
		{
			"x": -0.119055,
			"y": 0.005502,
			"z": -0.123062
		},
		{
			"x": -0.119007,
			"y": 0.005511,
			"z": -0.413109
		},
		{
			"x": -0.126219,
			"y": -0.004764,
			"z": -0.123062
		},
		{
			"x": -0.186315,
			"y": 0.046776,
			"z": 0.349881
		},
		{
			"x": -0.205215,
			"y": 0.046779,
			"z": 0.206643
		},
		{
			"x": -0.139527,
			"y": 0.04677,
			"z": 0.6234
		},
		{
			"x": -0.159105,
			"y": 0.047214,
			"z": 0.540126
		},
		{
			"x": -0.014649,
			"y": 0.28848,
			"z": 0.349029
		},
		{
			"x": 0.003666,
			"y": 0.295659,
			"z": 0.348669
		},
		{
			"x": -0.158763,
			"y": 0.117753,
			"z": 0.771165
		},
		{
			"x": -0.144021,
			"y": 0.149115,
			"z": 0.771243
		},
		{
			"x": -0.149151,
			"y": 0.1491,
			"z": 0.704244
		},
		{
			"x": -0.166674,
			"y": 0.117561,
			"z": 0.704412
		},
		{
			"x": -0.216381,
			"y": 0.046782,
			"z": -0.413109
		},
		{
			"x": -0.226035,
			"y": 0.049335,
			"z": -0.61284
		},
		{
			"x": -0.119049,
			"y": 0.005499,
			"z": -0.612786
		},
		{
			"x": 0.003666,
			"y": 0.136248,
			"z": 1.543827
		},
		{
			"x": -0.0081,
			"y": 0.133716,
			"z": 1.543839
		},
		{
			"x": 0.003666,
			"y": 0.118623,
			"z": 1.594647
		},
		{
			"x": -0.059634,
			"y": 0.207906,
			"z": 1.127415
		},
		{
			"x": -0.08964,
			"y": 0.181764,
			"z": 1.127232
		},
		{
			"x": -0.137076,
			"y": -0.009006,
			"z": -1.071852
		},
		{
			"x": -0.136944,
			"y": 0.001752,
			"z": -1.320717
		},
		{
			"x": -0.113583,
			"y": -0.033393,
			"z": -1.320717
		},
		{
			"x": -0.118446,
			"y": -0.042105,
			"z": -1.071852
		},
		{
			"x": -0.205641,
			"y": 0.097053,
			"z": -1.168557
		},
		{
			"x": -0.148866,
			"y": 0.083139,
			"z": -1.32072
		},
		{
			"x": -0.20103,
			"y": 0.084417,
			"z": -1.3203
		},
		{
			"x": -0.034752,
			"y": 0.043875,
			"z": 1.593807
		},
		{
			"x": -0.040113,
			"y": 0.042075,
			"z": 1.543749
		},
		{
			"x": 0.003666,
			"y": 0.024849,
			"z": 1.543833
		},
		{
			"x": 0.003666,
			"y": 0.028785,
			"z": 1.594647
		},
		{
			"x": -0.014073,
			"y": 0.110622,
			"z": 1.595478
		},
		{
			"x": -0.109887,
			"y": 0.221895,
			"z": 0.535266
		},
		{
			"x": -0.133134,
			"y": 0.190797,
			"z": 0.535302
		},
		{
			"x": -0.149757,
			"y": 0.077277,
			"z": 1.013481
		},
		{
			"x": -0.15822,
			"y": 0.077862,
			"z": 0.915429
		},
		{
			"x": -0.162789,
			"y": 0.058251,
			"z": 0.91644
		},
		{
			"x": -0.153945,
			"y": 0.058251,
			"z": 1.013649
		},
		{
			"x": -0.009582,
			"y": 0.05712,
			"z": 1.710984
		},
		{
			"x": -0.009741,
			"y": 0.0507,
			"z": 1.710798
		},
		{
			"x": 0.003666,
			"y": 0.043185,
			"z": 1.713732
		},
		{
			"x": -0.030711,
			"y": 0.05394,
			"z": 1.644582
		},
		{
			"x": -0.025989,
			"y": 0.046269,
			"z": 1.644351
		},
		{
			"x": -0.170136,
			"y": 0.046773,
			"z": 0.450195
		},
		{
			"x": -0.079512,
			"y": 0.036747,
			"z": 1.126863
		},
		{
			"x": -0.087519,
			"y": 0.040251,
			"z": 1.013652
		},
		{
			"x": 0.003666,
			"y": 0.008886,
			"z": 1.013703
		},
		{
			"x": 0.003666,
			"y": 0.009999,
			"z": 1.126902
		},
		{
			"x": -0.017961,
			"y": 0.219765,
			"z": 1.126863
		},
		{
			"x": 0.003666,
			"y": 0.21747,
			"z": 1.232379
		},
		{
			"x": -0.009966,
			"y": 0.230328,
			"z": 1.126884
		},
		{
			"x": -0.2628,
			"y": 0.077469,
			"z": -1.477119
		},
		{
			"x": -0.20121,
			"y": 0.078513,
			"z": -1.484166
		},
		{
			"x": -0.20139,
			"y": 0.063972,
			"z": -1.618083
		},
		{
			"x": -0.26289,
			"y": 0.067485,
			"z": -1.621119
		},
		{
			"x": -0.167937,
			"y": 0.156591,
			"z": -0.864642
		},
		{
			"x": -0.161382,
			"y": 0.156501,
			"z": -0.596868
		},
		{
			"x": -0.129828,
			"y": 0.189627,
			"z": -0.597534
		},
		{
			"x": -0.131829,
			"y": 0.191466,
			"z": -0.864642
		},
		{
			"x": -0.110898,
			"y": 0.163419,
			"z": -1.322241
		},
		{
			"x": -0.141486,
			"y": 0.125229,
			"z": -1.321584
		},
		{
			"x": -0.157563,
			"y": 0.129639,
			"z": -1.16973
		},
		{
			"x": -0.122322,
			"y": 0.177918,
			"z": -1.171389
		},
		{
			"x": -0.131829,
			"y": 0.190929,
			"z": 0.348006
		},
		{
			"x": -0.131349,
			"y": 0.19134,
			"z": 0.445734
		},
		{
			"x": -0.134664,
			"y": 0.190113,
			"z": -0.123125
		},
		{
			"x": -0.135114,
			"y": 0.189507,
			"z": 0.037837
		},
		{
			"x": -0.021933,
			"y": 0.292635,
			"z": 0.399324
		},
		{
			"x": -0.009789,
			"y": 0.304608,
			"z": 0.397845
		},
		{
			"x": -0.251877,
			"y": 0.097107,
			"z": 0.190839
		},
		{
			"x": -0.271284,
			"y": 0.057261,
			"z": 0.346134
		},
		{
			"x": -0.244191,
			"y": 0.090765,
			"z": 0.346134
		},
		{
			"x": 0.003666,
			"y": -0.117951,
			"z": -0.82272
		},
		{
			"x": 0.003666,
			"y": -0.117948,
			"z": -0.612804
		},
		{
			"x": -0.053916,
			"y": -0.104748,
			"z": -0.612804
		},
		{
			"x": -0.048639,
			"y": -0.096843,
			"z": -0.822987
		},
		{
			"x": -0.133434,
			"y": -0.015039,
			"z": 0.231552
		},
		{
			"x": -0.13797,
			"y": -0.008595,
			"z": 0.775755
		},
		{
			"x": -0.201207,
			"y": 0.11925,
			"z": 0.446319
		},
		{
			"x": -0.191475,
			"y": 0.11724,
			"z": 0.536841
		},
		{
			"x": -0.162627,
			"y": 0.149232,
			"z": 0.535584
		},
		{
			"x": -0.167601,
			"y": 0.149802,
			"z": 0.446625
		},
		{
			"x": -0.25158,
			"y": 0.058266,
			"z": 0.446478
		},
		{
			"x": -0.234558,
			"y": 0.085005,
			"z": 0.445767
		},
		{
			"x": -0.10536,
			"y": 0.25617,
			"z": 0.844521
		},
		{
			"x": -0.092634,
			"y": 0.248325,
			"z": 0.919314
		},
		{
			"x": -0.044823,
			"y": 0.056148,
			"z": 1.594443
		},
		{
			"x": -0.057948,
			"y": 0.057933,
			"z": 1.543839
		},
		{
			"x": -0.133587,
			"y": 0.190485,
			"z": 0.190749
		},
		{
			"x": -0.065232,
			"y": 0.234399,
			"z": 1.013649
		},
		{
			"x": -0.135306,
			"y": 0.077661,
			"z": 1.126863
		},
		{
			"x": -0.134025,
			"y": 0.058248,
			"z": 1.126863
		},
		{
			"x": -0.071838,
			"y": 0.102522,
			"z": 1.473258
		},
		{
			"x": -0.075252,
			"y": 0.078573,
			"z": 1.473258
		},
		{
			"x": -0.058065,
			"y": 0.075192,
			"z": 1.543842
		},
		{
			"x": -0.053562,
			"y": 0.094704,
			"z": 1.544589
		},
		{
			"x": -0.094758,
			"y": 0.263499,
			"z": 0.616395
		},
		{
			"x": -0.076344,
			"y": 0.267591,
			"z": 0.535056
		},
		{
			"x": -0.215868,
			"y": 0.083187,
			"z": 0.535332
		},
		{
			"x": -0.196896,
			"y": 0.080382,
			"z": 0.616515
		},
		{
			"x": -0.178794,
			"y": 0.116994,
			"z": 0.616674
		},
		{
			"x": -0.147768,
			"y": -0.030432,
			"z": 0.76605
		},
		{
			"x": -0.147765,
			"y": -0.035571,
			"z": 0.231552
		},
		{
			"x": -0.158343,
			"y": 0.148704,
			"z": 0.616392
		},
		{
			"x": -0.074478,
			"y": 0.059481,
			"z": 1.473258
		},
		{
			"x": -0.047325,
			"y": 0.040104,
			"z": 1.473258
		},
		{
			"x": -0.07725,
			"y": 0.129534,
			"z": 1.408608
		},
		{
			"x": -0.088092,
			"y": 0.109122,
			"z": 1.408608
		},
		{
			"x": -0.061782,
			"y": 0.119982,
			"z": 1.473708
		},
		{
			"x": -0.212688,
			"y": 0.124311,
			"z": 0.190745
		},
		{
			"x": -0.21012,
			"y": 0.121401,
			"z": 0.345972
		},
		{
			"x": -0.13551,
			"y": 0.147777,
			"z": 0.914253
		},
		{
			"x": -0.129129,
			"y": 0.14622,
			"z": 1.013784
		},
		{
			"x": 0.003666,
			"y": 0.033516,
			"z": 1.645296
		},
		{
			"x": -0.149031,
			"y": 0.041673,
			"z": -1.32072
		},
		{
			"x": -0.13032,
			"y": 0.189732,
			"z": -0.415809
		},
		{
			"x": -0.027729,
			"y": 0.169734,
			"z": 1.408608
		},
		{
			"x": -0.03783,
			"y": 0.190485,
			"z": 1.31337
		},
		{
			"x": -0.070353,
			"y": 0.165693,
			"z": 1.31337
		},
		{
			"x": -0.055806,
			"y": 0.151665,
			"z": 1.408608
		},
		{
			"x": -0.163017,
			"y": 0.156489,
			"z": -0.415011
		},
		{
			"x": -0.206616,
			"y": 0.05826,
			"z": 0.616392
		},
		{
			"x": -0.230055,
			"y": 0.058263,
			"z": 0.535332
		},
		{
			"x": -0.129159,
			"y": 0.118869,
			"z": 1.126863
		},
		{
			"x": -0.140643,
			"y": 0.118992,
			"z": 1.013649
		},
		{
			"x": -0.163455,
			"y": 0.077679,
			"z": 0.844758
		},
		{
			"x": -0.029232,
			"y": 0.065838,
			"z": 1.64529
		},
		{
			"x": -0.088821,
			"y": 0.059958,
			"z": 1.408608
		},
		{
			"x": -0.090456,
			"y": 0.079662,
			"z": 1.408608
		},
		{
			"x": -0.107856,
			"y": 0.079494,
			"z": 1.31337
		},
		{
			"x": -0.104346,
			"y": 0.060249,
			"z": 1.31337
		},
		{
			"x": -0.094875,
			"y": 0.136554,
			"z": 1.31337
		},
		{
			"x": -0.104049,
			"y": 0.114447,
			"z": 1.31337
		},
		{
			"x": -0.043809,
			"y": 0.108735,
			"z": 1.545066
		},
		{
			"x": -0.117738,
			"y": 0.142887,
			"z": 1.127076
		},
		{
			"x": -0.115974,
			"y": 0.116691,
			"z": 1.232349
		},
		{
			"x": -0.10551,
			"y": 0.139491,
			"z": 1.232349
		},
		{
			"x": 0.003666,
			"y": 0.249198,
			"z": -0.570483
		},
		{
			"x": 0.003666,
			"y": 0.250665,
			"z": -0.418986
		},
		{
			"x": -0.063027,
			"y": 0.037755,
			"z": 1.31337
		},
		{
			"x": -0.119202,
			"y": 0.058245,
			"z": 1.232349
		},
		{
			"x": -0.070296,
			"y": 0.036891,
			"z": 1.232349
		},
		{
			"x": -0.121167,
			"y": 0.079269,
			"z": 1.232349
		},
		{
			"x": -0.107874,
			"y": 0.259182,
			"z": 0.771249
		},
		{
			"x": 0.003666,
			"y": 0.273657,
			"z": 0.190898
		},
		{
			"x": 0.003666,
			"y": 0.259569,
			"z": 0.038007
		},
		{
			"x": -0.172047,
			"y": 0.151068,
			"z": 0.346083
		},
		{
			"x": -0.211443,
			"y": 0.111966,
			"z": -0.997077
		},
		{
			"x": -0.266199,
			"y": 0.090297,
			"z": -1.162587
		},
		{
			"x": -0.257127,
			"y": 0.097236,
			"z": -0.996729
		},
		{
			"x": -0.018969,
			"y": 0.152157,
			"z": 1.473258
		},
		{
			"x": -0.044238,
			"y": 0.138534,
			"z": 1.4742
		},
		{
			"x": -0.028398,
			"y": 0.12294,
			"z": 1.544919
		},
		{
			"x": -0.028959,
			"y": 0.099165,
			"z": 1.596
		},
		{
			"x": -0.053718,
			"y": 0.038643,
			"z": 1.408608
		},
		{
			"x": -0.043836,
			"y": 0.070866,
			"z": 1.594698
		},
		{
			"x": -0.146754,
			"y": 0.118122,
			"z": 0.916464
		},
		{
			"x": -0.262713,
			"y": 0.082461,
			"z": -1.318143
		},
		{
			"x": -0.170922,
			"y": 0.077886,
			"z": 0.771243
		},
		{
			"x": -0.152373,
			"y": 0.117873,
			"z": 0.846009
		},
		{
			"x": -0.046707,
			"y": 0.200682,
			"z": 1.232349
		},
		{
			"x": 0.003666,
			"y": 0.20154,
			"z": 1.313388
		},
		{
			"x": -0.211473,
			"y": 0.125628,
			"z": -0.414093
		},
		{
			"x": -0.211968,
			"y": 0.125742,
			"z": -0.123575
		},
		{
			"x": -0.17187,
			"y": 0.154929,
			"z": -0.12346
		},
		{
			"x": -0.025233,
			"y": 0.302595,
			"z": 0.445611
		},
		{
			"x": -0.011745,
			"y": 0.318162,
			"z": 0.445995
		},
		{
			"x": -0.1692,
			"y": 0.144408,
			"z": -0.998133
		},
		{
			"x": -0.131817,
			"y": 0.191466,
			"z": -0.999435
		},
		{
			"x": -0.079164,
			"y": 0.17373,
			"z": 1.232349
		},
		{
			"x": 0.003666,
			"y": 0.158541,
			"z": 1.473258
		},
		{
			"x": 0.003666,
			"y": 0.249915,
			"z": -0.122881
		},
		{
			"x": 0.003666,
			"y": 0.177237,
			"z": 1.408617
		},
		{
			"x": -0.209835,
			"y": 0.123078,
			"z": -0.595824
		},
		{
			"x": -0.25662,
			"y": 0.097881,
			"z": -0.594813
		},
		{
			"x": -0.257019,
			"y": 0.097881,
			"z": -0.413109
		},
		{
			"x": -0.201039,
			"y": 0.037461,
			"z": -1.3203
		},
		{
			"x": -0.201216,
			"y": 0.048069,
			"z": -1.469193
		},
		{
			"x": -0.140586,
			"y": 0.148875,
			"z": 0.844872
		},
		{
			"x": -0.038757,
			"y": 0.086928,
			"z": 1.595736
		},
		{
			"x": 0.003666,
			"y": -0.117942,
			"z": 0.231697
		},
		{
			"x": 0.003666,
			"y": -0.115311,
			"z": 0.758904
		},
		{
			"x": -0.059202,
			"y": -0.107508,
			"z": 0.758823
		},
		{
			"x": -0.059196,
			"y": -0.11265,
			"z": 0.231553
		},
		{
			"x": -0.17595,
			"y": 0.152559,
			"z": 0.190746
		},
		{
			"x": -0.096549,
			"y": 0.042075,
			"z": 0.91746
		},
		{
			"x": -0.181596,
			"y": 0.078753,
			"z": 0.704952
		},
		{
			"x": 0.003666,
			"y": 0.309435,
			"z": 0.398649
		},
		{
			"x": -0.189837,
			"y": 0.058257,
			"z": 0.70497
		},
		{
			"x": -0.175053,
			"y": 0.153507,
			"z": 0.037837
		},
		{
			"x": -0.212412,
			"y": 0.124539,
			"z": 0.037837
		},
		{
			"x": -0.216633,
			"y": 0.046782,
			"z": -0.123063
		},
		{
			"x": -0.267552,
			"y": 0.051837,
			"z": 0.329262
		},
		{
			"x": -0.080841,
			"y": -0.060915,
			"z": -1.320717
		},
		{
			"x": -0.086004,
			"y": -0.070254,
			"z": -1.071852
		},
		{
			"x": -0.10566,
			"y": 0.261819,
			"z": 0.704496
		},
		{
			"x": -0.257175,
			"y": 0.097881,
			"z": -0.864642
		},
		{
			"x": -0.324411,
			"y": 0.078528,
			"z": -0.123071
		},
		{
			"x": -0.256674,
			"y": 0.097881,
			"z": -0.123071
		},
		{
			"x": -0.323781,
			"y": 0.085203,
			"z": -0.411783
		},
		{
			"x": 0.003666,
			"y": 0.008376,
			"z": 0.916503
		},
		{
			"x": 0.003666,
			"y": 0.324243,
			"z": 0.447411
		},
		{
			"x": 0.003666,
			"y": 0.022287,
			"z": 1.473258
		},
		{
			"x": -0.137208,
			"y": -0.019764,
			"z": -0.822987
		},
		{
			"x": -0.142482,
			"y": -0.027669,
			"z": -0.612804
		},
		{
			"x": -0.074208,
			"y": 0.175908,
			"z": -1.439934
		},
		{
			"x": -0.101766,
			"y": 0.152631,
			"z": -1.439337
		},
		{
			"x": -0.210405,
			"y": 0.123078,
			"z": -0.864642
		},
		{
			"x": -0.128799,
			"y": 0.006732,
			"z": -1.438758
		},
		{
			"x": -0.106719,
			"y": -0.025644,
			"z": -1.438758
		},
		{
			"x": -0.254724,
			"y": 0.099054,
			"z": 0.037836
		},
		{
			"x": -0.075816,
			"y": -0.051024,
			"z": -1.438758
		},
		{
			"x": 0.003666,
			"y": 0.00738,
			"z": 0.844833
		},
		{
			"x": -0.128571,
			"y": 0.11808,
			"z": -1.438761
		},
		{
			"x": 0.003666,
			"y": 0.019131,
			"z": 1.408614
		},
		{
			"x": -0.038919,
			"y": 0.186114,
			"z": -1.440528
		},
		{
			"x": 0.003666,
			"y": 0.012396,
			"z": 1.232376
		},
		{
			"x": 0.003666,
			"y": 0.015063,
			"z": 1.313388
		},
		{
			"x": -0.140265,
			"y": 0.043482,
			"z": -1.438758
		},
		{
			"x": -0.038586,
			"y": -0.06735,
			"z": -1.438758
		},
		{
			"x": 0.003666,
			"y": 0.201984,
			"z": -1.324026
		},
		{
			"x": 0.003666,
			"y": 0.191244,
			"z": -1.440894
		},
		{
			"x": -0.140181,
			"y": 0.08163,
			"z": -1.438509
		},
		{
			"x": -0.117405,
			"y": 0.011547,
			"z": -1.556802
		},
		{
			"x": -0.097239,
			"y": -0.017955,
			"z": -1.556802
		},
		{
			"x": -0.06687,
			"y": 0.164502,
			"z": -1.558026
		},
		{
			"x": -0.093846,
			"y": 0.143712,
			"z": -1.557438
		},
		{
			"x": -0.117222,
			"y": 0.113007,
			"z": -1.55703
		},
		{
			"x": -0.133863,
			"y": -0.066624,
			"z": 0.231552
		},
		{
			"x": -0.133866,
			"y": -0.061479,
			"z": 0.758823
		},
		{
			"x": -0.069015,
			"y": -0.041088,
			"z": -1.556802
		},
		{
			"x": -0.03675,
			"y": 0.174036,
			"z": -1.558566
		},
		{
			"x": -0.127881,
			"y": 0.045036,
			"z": -1.556802
		},
		{
			"x": -0.035019,
			"y": -0.055971,
			"z": -1.556802
		},
		{
			"x": 0.003666,
			"y": -0.073317,
			"z": -1.438425
		},
		{
			"x": 0.003666,
			"y": -0.061413,
			"z": -1.556457
		},
		{
			"x": -0.127815,
			"y": 0.079794,
			"z": -1.556802
		},
		{
			"x": 0.003666,
			"y": 0.179154,
			"z": -1.558881
		},
		{
			"x": -0.147759,
			"y": -0.035571,
			"z": -0.413109
		},
		{
			"x": -0.147762,
			"y": -0.035571,
			"z": -0.123062
		},
		{
			"x": -0.123309,
			"y": -0.050814,
			"z": -0.822987
		},
		{
			"x": -0.128583,
			"y": -0.058719,
			"z": -0.612804
		},
		{
			"x": -0.091164,
			"y": -0.079596,
			"z": -0.822987
		},
		{
			"x": -0.096441,
			"y": -0.087501,
			"z": -0.612804
		},
		{
			"x": -0.201393,
			"y": 0.058677,
			"z": -1.618083
		},
		{
			"x": -0.324393,
			"y": 0.05757,
			"z": -1.623429
		},
		{
			"x": -0.101727,
			"y": -0.090258,
			"z": 0.758823
		},
		{
			"x": -0.101721,
			"y": -0.095403,
			"z": 0.231553
		},
		{
			"x": 0.003666,
			"y": -0.117945,
			"z": -0.413109
		},
		{
			"x": 0.003666,
			"y": -0.117945,
			"z": -0.123062
		},
		{
			"x": -0.059193,
			"y": -0.11265,
			"z": -0.123062
		},
		{
			"x": -0.05919,
			"y": -0.112653,
			"z": -0.413109
		},
		{
			"x": -0.101715,
			"y": -0.095403,
			"z": -0.413109
		},
		{
			"x": -0.101718,
			"y": -0.095403,
			"z": -0.123062
		},
		{
			"x": -0.13386,
			"y": -0.066624,
			"z": -0.123062
		},
		{
			"x": -0.133857,
			"y": -0.066624,
			"z": -0.413109
		},
		{
			"x": 0.003666,
			"y": 0.240891,
			"z": 1.126905
		},
		{
			"x": -0.211899,
			"y": 0.046782,
			"z": 0.043309
		},
		{
			"x": -0.32442,
			"y": 0.036234,
			"z": -0.123064
		},
		{
			"x": -0.324378,
			"y": 0.032799,
			"z": -0.413025
		},
		{
			"x": -0.324414,
			"y": 0.036861,
			"z": -0.614991
		},
		{
			"x": -0.324378,
			"y": 0.053574,
			"z": -1.309359
		},
		{
			"x": -0.324261,
			"y": 0.074397,
			"z": -1.155636
		},
		{
			"x": -0.324396,
			"y": 0.073716,
			"z": -1.315986
		},
		{
			"x": -0.324393,
			"y": 0.070665,
			"z": -1.470072
		},
		{
			"x": -0.324393,
			"y": 0.065532,
			"z": -1.624158
		},
		{
			"x": -0.324387,
			"y": 0.055572,
			"z": -1.466394
		},
		{
			"x": 0.331743,
			"y": 0.062163,
			"z": 0.043308
		},
		{
			"x": 0.331746,
			"y": 0.060879,
			"z": 0.194449
		},
		{
			"x": 0.331746,
			"y": 0.059328,
			"z": 0.043308
		},
		{
			"x": 0.331734,
			"y": 0.04878,
			"z": -0.854355
		},
		{
			"x": 0.331731,
			"y": 0.079482,
			"z": -0.864639
		},
		{
			"x": 0.331233,
			"y": 0.089319,
			"z": -0.593358
		},
		{
			"x": 0.331638,
			"y": 0.056754,
			"z": -0.995289
		},
		{
			"x": 0.331458,
			"y": 0.079482,
			"z": -0.995286
		},
		{
			"x": 0.331737,
			"y": 0.044394,
			"z": -0.852888
		},
		{
			"x": 0.331692,
			"y": 0.049578,
			"z": -0.995292
		},
		{
			"x": 0.082563,
			"y": 0.008556,
			"z": 0.685005
		},
		{
			"x": 0.126438,
			"y": 0.005496,
			"z": 0.782934
		},
		{
			"x": 0.126432,
			"y": 0.005493,
			"z": 0.231552
		},
		{
			"x": 0.07767,
			"y": 0.008523,
			"z": 0.705825
		},
		{
			"x": 0.07422,
			"y": 0.008523,
			"z": 0.725547
		},
		{
			"x": 0.072633,
			"y": 0.008286,
			"z": 0.743607
		},
		{
			"x": 0.051861,
			"y": 0.005823,
			"z": 0.760269
		},
		{
			"x": 0.10281,
			"y": 0.023709,
			"z": 0.611949
		},
		{
			"x": 0.093351,
			"y": 0.023235,
			"z": 0.648279
		},
		{
			"x": 0.086763,
			"y": 0.022992,
			"z": 0.682713
		},
		{
			"x": 0.081237,
			"y": 0.022206,
			"z": 0.714003
		},
		{
			"x": 0.037263,
			"y": 0.013551,
			"z": 0.777252
		},
		{
			"x": 0.043218,
			"y": 0.275397,
			"z": 0.39621
		},
		{
			"x": 0.057294,
			"y": 0.273177,
			"z": 0.444381
		},
		{
			"x": 0.059748,
			"y": 0.262077,
			"z": 0.349071
		},
		{
			"x": 0.029139,
			"y": 0.27843,
			"z": 0.348039
		},
		{
			"x": 0.114111,
			"y": 0.220683,
			"z": 0.446676
		},
		{
			"x": 0.110913,
			"y": 0.219108,
			"z": 0.348129
		},
		{
			"x": 0.10725,
			"y": 0.216912,
			"z": 0.190853
		},
		{
			"x": 0.059376,
			"y": 0.249894,
			"z": 0.19053
		},
		{
			"x": 0.104808,
			"y": 0.210366,
			"z": -1.000176
		},
		{
			"x": 0.100065,
			"y": 0.20163,
			"z": -1.172028
		},
		{
			"x": 0.048375,
			"y": 0.210348,
			"z": -1.169736
		},
		{
			"x": 0.034557,
			"y": 0.219087,
			"z": -1.000926
		},
		{
			"x": 0.104922,
			"y": 0.210366,
			"z": -0.864642
		},
		{
			"x": 0.018966,
			"y": 0.221964,
			"z": -0.864645
		},
		{
			"x": 0.039261,
			"y": 0.234246,
			"z": -0.586857
		},
		{
			"x": 0.104394,
			"y": 0.210369,
			"z": -0.598257
		},
		{
			"x": 0.049392,
			"y": 0.233841,
			"z": -0.41781
		},
		{
			"x": 0.104673,
			"y": 0.210369,
			"z": -0.416553
		},
		{
			"x": 0.058992,
			"y": 0.233085,
			"z": -0.123472
		},
		{
			"x": 0.105681,
			"y": 0.212226,
			"z": -0.123868
		},
		{
			"x": 0.106428,
			"y": 0.214401,
			"z": 0.038205
		},
		{
			"x": 0.062148,
			"y": 0.239052,
			"z": 0.037823
		},
		{
			"x": 0.089928,
			"y": 0.187407,
			"z": -1.322853
		},
		{
			"x": 0.044808,
			"y": 0.197859,
			"z": -1.323618
		},
		{
			"x": 0.133059,
			"y": 0.046767,
			"z": 0.702294
		},
		{
			"x": 0.121446,
			"y": 0.04563,
			"z": 0.773961
		},
		{
			"x": 0.185355,
			"y": 0.058254,
			"z": 0.771243
		},
		{
			"x": 0.17745,
			"y": 0.058254,
			"z": 0.844758
		},
		{
			"x": 0.10983,
			"y": 0.044499,
			"z": 0.845628
		},
		{
			"x": 0.011856,
			"y": 0.064041,
			"z": 1.711047
		},
		{
			"x": 0.03132,
			"y": 0.0786,
			"z": 1.64646
		},
		{
			"x": 0.021408,
			"y": 0.08874,
			"z": 1.64658
		},
		{
			"x": 0.138549,
			"y": 0.19077,
			"z": 0.704502
		},
		{
			"x": 0.138186,
			"y": 0.190014,
			"z": 0.616392
		},
		{
			"x": 0.122538,
			"y": 0.221619,
			"z": 0.616395
		},
		{
			"x": 0.12504,
			"y": 0.223158,
			"z": 0.70449
		},
		{
			"x": 0.135573,
			"y": 0.191469,
			"z": 0.771243
		},
		{
			"x": 0.126036,
			"y": 0.223167,
			"z": 0.771249
		},
		{
			"x": 0.123105,
			"y": 0.222429,
			"z": 0.844842
		},
		{
			"x": 0.132153,
			"y": 0.192369,
			"z": 0.844989
		},
		{
			"x": 0.123891,
			"y": 0.191469,
			"z": 0.916443
		},
		{
			"x": 0.111927,
			"y": 0.219897,
			"z": 0.91788
		},
		{
			"x": 0.111924,
			"y": 0.187941,
			"z": 1.014168
		},
		{
			"x": 0.093318,
			"y": 0.214182,
			"z": 1.014645
		},
		{
			"x": 0.052332,
			"y": -0.087711,
			"z": -1.071852
		},
		{
			"x": 0.048696,
			"y": -0.078579,
			"z": -1.320717
		},
		{
			"x": 0.12642,
			"y": 0.00549,
			"z": -0.822987
		},
		{
			"x": 0.14139,
			"y": 0.023583,
			"z": -1.071852
		},
		{
			"x": 0.234702,
			"y": 0.046782,
			"z": -0.996729
		},
		{
			"x": 0.234294,
			"y": 0.046782,
			"z": -0.864723
		},
		{
			"x": 0.133548,
			"y": -0.004764,
			"z": -0.123062
		},
		{
			"x": 0.126336,
			"y": 0.005511,
			"z": -0.413109
		},
		{
			"x": 0.126384,
			"y": 0.005502,
			"z": -0.123062
		},
		{
			"x": 0.212544,
			"y": 0.046779,
			"z": 0.206643
		},
		{
			"x": 0.193644,
			"y": 0.046776,
			"z": 0.349881
		},
		{
			"x": 0.166434,
			"y": 0.047214,
			"z": 0.540126
		},
		{
			"x": 0.146856,
			"y": 0.04677,
			"z": 0.6234
		},
		{
			"x": 0.021978,
			"y": 0.28848,
			"z": 0.349029
		},
		{
			"x": 0.174003,
			"y": 0.117561,
			"z": 0.704412
		},
		{
			"x": 0.15648,
			"y": 0.1491,
			"z": 0.704244
		},
		{
			"x": 0.15135,
			"y": 0.149115,
			"z": 0.771243
		},
		{
			"x": 0.166092,
			"y": 0.117753,
			"z": 0.771165
		},
		{
			"x": 0.126378,
			"y": 0.005499,
			"z": -0.612786
		},
		{
			"x": 0.233364,
			"y": 0.049335,
			"z": -0.61284
		},
		{
			"x": 0.22371,
			"y": 0.046782,
			"z": -0.413109
		},
		{
			"x": 0.015429,
			"y": 0.133716,
			"z": 1.543839
		},
		{
			"x": 0.096969,
			"y": 0.181764,
			"z": 1.127232
		},
		{
			"x": 0.066963,
			"y": 0.207906,
			"z": 1.127415
		},
		{
			"x": 0.125775,
			"y": -0.042105,
			"z": -1.071852
		},
		{
			"x": 0.120912,
			"y": -0.033393,
			"z": -1.320717
		},
		{
			"x": 0.144273,
			"y": 0.001752,
			"z": -1.320717
		},
		{
			"x": 0.144405,
			"y": -0.009006,
			"z": -1.071852
		},
		{
			"x": 0.208359,
			"y": 0.084417,
			"z": -1.3203
		},
		{
			"x": 0.156195,
			"y": 0.083139,
			"z": -1.32072
		},
		{
			"x": 0.21297,
			"y": 0.097053,
			"z": -1.168557
		},
		{
			"x": 0.047442,
			"y": 0.042075,
			"z": 1.543749
		},
		{
			"x": 0.042081,
			"y": 0.043875,
			"z": 1.593807
		},
		{
			"x": 0.021402,
			"y": 0.110622,
			"z": 1.595478
		},
		{
			"x": 0.140463,
			"y": 0.190797,
			"z": 0.535302
		},
		{
			"x": 0.117216,
			"y": 0.221895,
			"z": 0.535266
		},
		{
			"x": 0.161274,
			"y": 0.058251,
			"z": 1.013649
		},
		{
			"x": 0.170118,
			"y": 0.058251,
			"z": 0.91644
		},
		{
			"x": 0.165549,
			"y": 0.077862,
			"z": 0.915429
		},
		{
			"x": 0.157086,
			"y": 0.077277,
			"z": 1.013481
		},
		{
			"x": 0.016911,
			"y": 0.05712,
			"z": 1.710984
		},
		{
			"x": 0.01707,
			"y": 0.0507,
			"z": 1.710798
		},
		{
			"x": 0.033318,
			"y": 0.046269,
			"z": 1.644351
		},
		{
			"x": 0.03804,
			"y": 0.05394,
			"z": 1.644582
		},
		{
			"x": 0.177465,
			"y": 0.046773,
			"z": 0.450195
		},
		{
			"x": 0.094848,
			"y": 0.040251,
			"z": 1.013652
		},
		{
			"x": 0.086841,
			"y": 0.036747,
			"z": 1.126863
		},
		{
			"x": 0.017295,
			"y": 0.230328,
			"z": 1.126884
		},
		{
			"x": 0.02529,
			"y": 0.219765,
			"z": 1.126863
		},
		{
			"x": 0.270219,
			"y": 0.067485,
			"z": -1.621119
		},
		{
			"x": 0.208719,
			"y": 0.063972,
			"z": -1.618083
		},
		{
			"x": 0.208539,
			"y": 0.078513,
			"z": -1.484166
		},
		{
			"x": 0.270129,
			"y": 0.077469,
			"z": -1.477119
		},
		{
			"x": 0.139158,
			"y": 0.191466,
			"z": -0.864642
		},
		{
			"x": 0.137157,
			"y": 0.189627,
			"z": -0.597534
		},
		{
			"x": 0.168711,
			"y": 0.156501,
			"z": -0.596868
		},
		{
			"x": 0.175266,
			"y": 0.156591,
			"z": -0.864642
		},
		{
			"x": 0.129651,
			"y": 0.177918,
			"z": -1.171389
		},
		{
			"x": 0.164895,
			"y": 0.129639,
			"z": -1.16973
		},
		{
			"x": 0.148815,
			"y": 0.125229,
			"z": -1.321584
		},
		{
			"x": 0.118227,
			"y": 0.163419,
			"z": -1.322241
		},
		{
			"x": 0.138678,
			"y": 0.19134,
			"z": 0.445734
		},
		{
			"x": 0.139158,
			"y": 0.190929,
			"z": 0.348006
		},
		{
			"x": 0.142443,
			"y": 0.189507,
			"z": 0.037837
		},
		{
			"x": 0.141993,
			"y": 0.190113,
			"z": -0.123125
		},
		{
			"x": 0.017118,
			"y": 0.304608,
			"z": 0.397845
		},
		{
			"x": 0.029262,
			"y": 0.292635,
			"z": 0.399324
		},
		{
			"x": 0.25152,
			"y": 0.090765,
			"z": 0.346134
		},
		{
			"x": 0.278613,
			"y": 0.057261,
			"z": 0.346134
		},
		{
			"x": 0.259206,
			"y": 0.097107,
			"z": 0.190839
		},
		{
			"x": 0.055968,
			"y": -0.096843,
			"z": -0.822987
		},
		{
			"x": 0.061245,
			"y": -0.104748,
			"z": -0.612804
		},
		{
			"x": 0.145299,
			"y": -0.008595,
			"z": 0.775755
		},
		{
			"x": 0.140763,
			"y": -0.015039,
			"z": 0.231552
		},
		{
			"x": 0.17493,
			"y": 0.149802,
			"z": 0.446625
		},
		{
			"x": 0.169956,
			"y": 0.149232,
			"z": 0.535584
		},
		{
			"x": 0.198804,
			"y": 0.11724,
			"z": 0.536841
		},
		{
			"x": 0.208536,
			"y": 0.11925,
			"z": 0.446319
		},
		{
			"x": 0.241887,
			"y": 0.085005,
			"z": 0.445767
		},
		{
			"x": 0.258909,
			"y": 0.058266,
			"z": 0.446478
		},
		{
			"x": 0.099963,
			"y": 0.248325,
			"z": 0.919314
		},
		{
			"x": 0.112689,
			"y": 0.25617,
			"z": 0.844521
		},
		{
			"x": 0.065277,
			"y": 0.057933,
			"z": 1.543839
		},
		{
			"x": 0.052152,
			"y": 0.056148,
			"z": 1.594443
		},
		{
			"x": 0.140916,
			"y": 0.190485,
			"z": 0.190749
		},
		{
			"x": 0.072561,
			"y": 0.234399,
			"z": 1.013649
		},
		{
			"x": 0.141354,
			"y": 0.058248,
			"z": 1.126863
		},
		{
			"x": 0.142635,
			"y": 0.077661,
			"z": 1.126863
		},
		{
			"x": 0.060891,
			"y": 0.094704,
			"z": 1.544589
		},
		{
			"x": 0.065394,
			"y": 0.075192,
			"z": 1.543842
		},
		{
			"x": 0.082581,
			"y": 0.078573,
			"z": 1.473258
		},
		{
			"x": 0.079167,
			"y": 0.102522,
			"z": 1.473258
		},
		{
			"x": 0.083673,
			"y": 0.267591,
			"z": 0.535056
		},
		{
			"x": 0.102087,
			"y": 0.263499,
			"z": 0.616395
		},
		{
			"x": 0.186123,
			"y": 0.116994,
			"z": 0.616674
		},
		{
			"x": 0.204228,
			"y": 0.080382,
			"z": 0.616515
		},
		{
			"x": 0.223197,
			"y": 0.083187,
			"z": 0.535332
		},
		{
			"x": 0.155094,
			"y": -0.035571,
			"z": 0.231552
		},
		{
			"x": 0.155097,
			"y": -0.030432,
			"z": 0.76605
		},
		{
			"x": 0.165672,
			"y": 0.148704,
			"z": 0.616392
		},
		{
			"x": 0.054654,
			"y": 0.040104,
			"z": 1.473258
		},
		{
			"x": 0.081807,
			"y": 0.059481,
			"z": 1.473258
		},
		{
			"x": 0.069111,
			"y": 0.119982,
			"z": 1.473708
		},
		{
			"x": 0.095421,
			"y": 0.109122,
			"z": 1.408608
		},
		{
			"x": 0.084579,
			"y": 0.129534,
			"z": 1.408608
		},
		{
			"x": 0.217449,
			"y": 0.121401,
			"z": 0.345972
		},
		{
			"x": 0.220017,
			"y": 0.124311,
			"z": 0.190745
		},
		{
			"x": 0.136458,
			"y": 0.14622,
			"z": 1.013784
		},
		{
			"x": 0.142839,
			"y": 0.147777,
			"z": 0.914253
		},
		{
			"x": 0.15636,
			"y": 0.041673,
			"z": -1.32072
		},
		{
			"x": 0.137649,
			"y": 0.189732,
			"z": -0.415809
		},
		{
			"x": 0.063135,
			"y": 0.151665,
			"z": 1.408608
		},
		{
			"x": 0.077682,
			"y": 0.165693,
			"z": 1.31337
		},
		{
			"x": 0.045159,
			"y": 0.190485,
			"z": 1.31337
		},
		{
			"x": 0.035058,
			"y": 0.169734,
			"z": 1.408608
		},
		{
			"x": 0.170346,
			"y": 0.156489,
			"z": -0.415011
		},
		{
			"x": 0.237384,
			"y": 0.058263,
			"z": 0.535332
		},
		{
			"x": 0.213945,
			"y": 0.05826,
			"z": 0.616392
		},
		{
			"x": 0.147972,
			"y": 0.118992,
			"z": 1.013649
		},
		{
			"x": 0.136488,
			"y": 0.118869,
			"z": 1.126863
		},
		{
			"x": 0.170784,
			"y": 0.077679,
			"z": 0.844758
		},
		{
			"x": 0.036561,
			"y": 0.065838,
			"z": 1.64529
		},
		{
			"x": 0.111675,
			"y": 0.060249,
			"z": 1.31337
		},
		{
			"x": 0.115185,
			"y": 0.079494,
			"z": 1.31337
		},
		{
			"x": 0.097785,
			"y": 0.079662,
			"z": 1.408608
		},
		{
			"x": 0.09615,
			"y": 0.059958,
			"z": 1.408608
		},
		{
			"x": 0.111378,
			"y": 0.114447,
			"z": 1.31337
		},
		{
			"x": 0.102204,
			"y": 0.136554,
			"z": 1.31337
		},
		{
			"x": 0.051138,
			"y": 0.108735,
			"z": 1.545066
		},
		{
			"x": 0.112839,
			"y": 0.139491,
			"z": 1.232349
		},
		{
			"x": 0.123303,
			"y": 0.116691,
			"z": 1.232349
		},
		{
			"x": 0.125067,
			"y": 0.142887,
			"z": 1.127076
		},
		{
			"x": 0.077625,
			"y": 0.036891,
			"z": 1.232349
		},
		{
			"x": 0.126531,
			"y": 0.058245,
			"z": 1.232349
		},
		{
			"x": 0.070356,
			"y": 0.037755,
			"z": 1.31337
		},
		{
			"x": 0.128496,
			"y": 0.079269,
			"z": 1.232349
		},
		{
			"x": 0.115203,
			"y": 0.259182,
			"z": 0.771249
		},
		{
			"x": 0.179376,
			"y": 0.151068,
			"z": 0.346083
		},
		{
			"x": 0.264456,
			"y": 0.097236,
			"z": -0.996729
		},
		{
			"x": 0.273528,
			"y": 0.090297,
			"z": -1.162587
		},
		{
			"x": 0.218772,
			"y": 0.111966,
			"z": -0.997077
		},
		{
			"x": 0.035727,
			"y": 0.12294,
			"z": 1.544919
		},
		{
			"x": 0.05157,
			"y": 0.138534,
			"z": 1.4742
		},
		{
			"x": 0.026298,
			"y": 0.152157,
			"z": 1.473258
		},
		{
			"x": 0.036288,
			"y": 0.099165,
			"z": 1.596
		},
		{
			"x": 0.061047,
			"y": 0.038643,
			"z": 1.408608
		},
		{
			"x": 0.051165,
			"y": 0.070866,
			"z": 1.594698
		},
		{
			"x": 0.154083,
			"y": 0.118122,
			"z": 0.916464
		},
		{
			"x": 0.270042,
			"y": 0.082461,
			"z": -1.318143
		},
		{
			"x": 0.159702,
			"y": 0.117873,
			"z": 0.846009
		},
		{
			"x": 0.178251,
			"y": 0.077886,
			"z": 0.771243
		},
		{
			"x": 0.054036,
			"y": 0.200682,
			"z": 1.232349
		},
		{
			"x": 0.179199,
			"y": 0.154929,
			"z": -0.12346
		},
		{
			"x": 0.219297,
			"y": 0.125742,
			"z": -0.123575
		},
		{
			"x": 0.218802,
			"y": 0.125628,
			"z": -0.414093
		},
		{
			"x": 0.019074,
			"y": 0.318162,
			"z": 0.445995
		},
		{
			"x": 0.032562,
			"y": 0.302595,
			"z": 0.445611
		},
		{
			"x": 0.139146,
			"y": 0.191466,
			"z": -0.999435
		},
		{
			"x": 0.176529,
			"y": 0.144408,
			"z": -0.998133
		},
		{
			"x": 0.086493,
			"y": 0.17373,
			"z": 1.232349
		},
		{
			"x": 0.264348,
			"y": 0.097881,
			"z": -0.413109
		},
		{
			"x": 0.263949,
			"y": 0.097881,
			"z": -0.594813
		},
		{
			"x": 0.217164,
			"y": 0.123078,
			"z": -0.595824
		},
		{
			"x": 0.208545,
			"y": 0.048069,
			"z": -1.469193
		},
		{
			"x": 0.208368,
			"y": 0.037461,
			"z": -1.3203
		},
		{
			"x": 0.147915,
			"y": 0.148875,
			"z": 0.844872
		},
		{
			"x": 0.046086,
			"y": 0.086928,
			"z": 1.595736
		},
		{
			"x": 0.066525,
			"y": -0.11265,
			"z": 0.231553
		},
		{
			"x": 0.066531,
			"y": -0.107508,
			"z": 0.758823
		},
		{
			"x": 0.183279,
			"y": 0.152559,
			"z": 0.190746
		},
		{
			"x": 0.103878,
			"y": 0.042075,
			"z": 0.91746
		},
		{
			"x": 0.188925,
			"y": 0.078753,
			"z": 0.704952
		},
		{
			"x": 0.197166,
			"y": 0.058257,
			"z": 0.70497
		},
		{
			"x": 0.219741,
			"y": 0.124539,
			"z": 0.037837
		},
		{
			"x": 0.182382,
			"y": 0.153507,
			"z": 0.037837
		},
		{
			"x": 0.223962,
			"y": 0.046782,
			"z": -0.123063
		},
		{
			"x": 0.274881,
			"y": 0.051837,
			"z": 0.329262
		},
		{
			"x": 0.093333,
			"y": -0.070254,
			"z": -1.071852
		},
		{
			"x": 0.08817,
			"y": -0.060915,
			"z": -1.320717
		},
		{
			"x": 0.112989,
			"y": 0.261819,
			"z": 0.704496
		},
		{
			"x": 0.264504,
			"y": 0.097881,
			"z": -0.864642
		},
		{
			"x": 0.33111,
			"y": 0.085203,
			"z": -0.411783
		},
		{
			"x": 0.264003,
			"y": 0.097881,
			"z": -0.123071
		},
		{
			"x": 0.33174,
			"y": 0.078528,
			"z": -0.123071
		},
		{
			"x": 0.149811,
			"y": -0.027669,
			"z": -0.612804
		},
		{
			"x": 0.144537,
			"y": -0.019764,
			"z": -0.822987
		},
		{
			"x": 0.109095,
			"y": 0.152631,
			"z": -1.439337
		},
		{
			"x": 0.081537,
			"y": 0.175908,
			"z": -1.439934
		},
		{
			"x": 0.217734,
			"y": 0.123078,
			"z": -0.864642
		},
		{
			"x": 0.114048,
			"y": -0.025644,
			"z": -1.438758
		},
		{
			"x": 0.136128,
			"y": 0.006732,
			"z": -1.438758
		},
		{
			"x": 0.262053,
			"y": 0.099054,
			"z": 0.037836
		},
		{
			"x": 0.083145,
			"y": -0.051024,
			"z": -1.438758
		},
		{
			"x": 0.1359,
			"y": 0.11808,
			"z": -1.438761
		},
		{
			"x": 0.046248,
			"y": 0.186114,
			"z": -1.440528
		},
		{
			"x": 0.147594,
			"y": 0.043482,
			"z": -1.438758
		},
		{
			"x": 0.045915,
			"y": -0.06735,
			"z": -1.438758
		},
		{
			"x": 0.14751,
			"y": 0.08163,
			"z": -1.438509
		},
		{
			"x": 0.104568,
			"y": -0.017955,
			"z": -1.556802
		},
		{
			"x": 0.124734,
			"y": 0.011547,
			"z": -1.556802
		},
		{
			"x": 0.101175,
			"y": 0.143712,
			"z": -1.557438
		},
		{
			"x": 0.074199,
			"y": 0.164502,
			"z": -1.558026
		},
		{
			"x": 0.124551,
			"y": 0.113007,
			"z": -1.55703
		},
		{
			"x": 0.141195,
			"y": -0.061479,
			"z": 0.758823
		},
		{
			"x": 0.141192,
			"y": -0.066624,
			"z": 0.231552
		},
		{
			"x": 0.076344,
			"y": -0.041088,
			"z": -1.556802
		},
		{
			"x": 0.044079,
			"y": 0.174036,
			"z": -1.558566
		},
		{
			"x": 0.13521,
			"y": 0.045036,
			"z": -1.556802
		},
		{
			"x": 0.042348,
			"y": -0.055971,
			"z": -1.556802
		},
		{
			"x": 0.135144,
			"y": 0.079794,
			"z": -1.556802
		},
		{
			"x": 0.155091,
			"y": -0.035571,
			"z": -0.123062
		},
		{
			"x": 0.155088,
			"y": -0.035571,
			"z": -0.413109
		},
		{
			"x": 0.135912,
			"y": -0.058719,
			"z": -0.612804
		},
		{
			"x": 0.130638,
			"y": -0.050814,
			"z": -0.822987
		},
		{
			"x": 0.10377,
			"y": -0.087501,
			"z": -0.612804
		},
		{
			"x": 0.098493,
			"y": -0.079596,
			"z": -0.822987
		},
		{
			"x": 0.331722,
			"y": 0.05757,
			"z": -1.623429
		},
		{
			"x": 0.208722,
			"y": 0.058677,
			"z": -1.618083
		},
		{
			"x": 0.10905,
			"y": -0.095403,
			"z": 0.231553
		},
		{
			"x": 0.109056,
			"y": -0.090258,
			"z": 0.758823
		},
		{
			"x": 0.066519,
			"y": -0.112653,
			"z": -0.413109
		},
		{
			"x": 0.066522,
			"y": -0.11265,
			"z": -0.123062
		},
		{
			"x": 0.141186,
			"y": -0.066624,
			"z": -0.413109
		},
		{
			"x": 0.141189,
			"y": -0.066624,
			"z": -0.123062
		},
		{
			"x": 0.109047,
			"y": -0.095403,
			"z": -0.123062
		},
		{
			"x": 0.109044,
			"y": -0.095403,
			"z": -0.413109
		},
		{
			"x": 0.219228,
			"y": 0.046782,
			"z": 0.043309
		},
		{
			"x": 0.331749,
			"y": 0.036234,
			"z": -0.123064
		},
		{
			"x": 0.331707,
			"y": 0.032799,
			"z": -0.413025
		},
		{
			"x": 0.331743,
			"y": 0.036861,
			"z": -0.614991
		},
		{
			"x": 0.331707,
			"y": 0.053574,
			"z": -1.309359
		},
		{
			"x": 0.33159,
			"y": 0.074397,
			"z": -1.155636
		},
		{
			"x": 0.331725,
			"y": 0.073716,
			"z": -1.315986
		},
		{
			"x": 0.331722,
			"y": 0.070665,
			"z": -1.470072
		},
		{
			"x": 0.331722,
			"y": 0.065532,
			"z": -1.624158
		},
		{
			"x": 0.331716,
			"y": 0.055572,
			"z": -1.466394
		},
		{
			"x": -0.128112,
			"y": -0.015939,
			"z": 0.780591
		},
		{
			"x": -0.115182,
			"y": -0.00669,
			"z": 0.786903
		},
		{
			"x": -0.109701,
			"y": 0.002775,
			"z": 0.821676
		},
		{
			"x": -0.106077,
			"y": -0.004347,
			"z": 0.821679
		},
		{
			"x": 0.003666,
			"y": -0.004347,
			"z": 0.821679
		},
		{
			"x": 0.003666,
			"y": 0.002775,
			"z": 0.821676
		},
		{
			"x": 0.113406,
			"y": -0.004347,
			"z": 0.821679
		},
		{
			"x": 0.11703,
			"y": 0.002775,
			"z": 0.821676
		},
		{
			"x": 0.122511,
			"y": -0.00669,
			"z": 0.786903
		},
		{
			"x": 0.135441,
			"y": -0.015939,
			"z": 0.780591
		},
		{
			"x": 0.142011,
			"y": -0.030288,
			"z": 0.772227
		},
		{
			"x": 0.131226,
			"y": -0.054333,
			"z": 0.766251
		},
		{
			"x": 0.102681,
			"y": -0.08004,
			"z": 0.7668
		},
		{
			"x": 0.063531,
			"y": -0.095964,
			"z": 0.767037
		},
		{
			"x": 0.003666,
			"y": -0.103407,
			"z": 0.767184
		},
		{
			"x": -0.056202,
			"y": -0.095964,
			"z": 0.767037
		},
		{
			"x": -0.095352,
			"y": -0.08004,
			"z": 0.7668
		},
		{
			"x": -0.123897,
			"y": -0.054333,
			"z": 0.766251
		},
		{
			"x": -0.134682,
			"y": -0.030288,
			"z": 0.772227
		},
		{
			"x": -0.123204,
			"y": -0.019638,
			"z": 0.773793
		},
		{
			"x": -0.113253,
			"y": -0.012834,
			"z": 0.779676
		},
		{
			"x": 0.003666,
			"y": -0.017058,
			"z": 0.766278
		},
		{
			"x": 0.003666,
			"y": -0.011106,
			"z": 0.773472
		},
		{
			"x": 0.120582,
			"y": -0.012834,
			"z": 0.779676
		},
		{
			"x": 0.130533,
			"y": -0.019638,
			"z": 0.773793
		},
		{
			"x": 0.135447,
			"y": -0.030174,
			"z": 0.766095
		},
		{
			"x": 0.126231,
			"y": -0.050757,
			"z": 0.760728
		},
		{
			"x": 0.099489,
			"y": -0.074931,
			"z": 0.761547
		},
		{
			"x": 0.062031,
			"y": -0.090192,
			"z": 0.761901
		},
		{
			"x": 0.003666,
			"y": -0.097452,
			"z": 0.762078
		},
		{
			"x": -0.054702,
			"y": -0.090192,
			"z": 0.761901
		},
		{
			"x": -0.09216,
			"y": -0.074931,
			"z": 0.761547
		},
		{
			"x": -0.118902,
			"y": -0.050757,
			"z": 0.760728
		},
		{
			"x": -0.128118,
			"y": -0.030174,
			"z": 0.766095
		},
		{
			"x": 1.130724,
			"y": 0.082218,
			"z": -0.486909
		},
		{
			"x": 1.17219,
			"y": 0.123687,
			"z": -0.486909
		},
		{
			"x": 1.17585,
			"y": 0.120027,
			"z": -0.486909
		},
		{
			"x": 1.134384,
			"y": 0.078558,
			"z": -0.486909
		},
		{
			"x": -1.116546,
			"y": 0.092787,
			"z": -0.449202
		},
		{
			"x": -1.116546,
			"y": 0.092787,
			"z": -1.007514
		},
		{
			"x": -1.122081,
			"y": 0.091911,
			"z": -1.007514
		},
		{
			"x": -1.122081,
			"y": 0.091911,
			"z": -0.449202
		},
		{
			"x": -1.105533,
			"y": 0.091044,
			"z": -1.007514
		},
		{
			"x": -1.110948,
			"y": 0.092493,
			"z": -1.007514
		},
		{
			"x": -1.110948,
			"y": 0.092493,
			"z": -0.449202
		},
		{
			"x": -1.105533,
			"y": 0.091044,
			"z": -0.449202
		},
		{
			"x": -1.090113,
			"y": 0.075621,
			"z": -1.007514
		},
		{
			"x": -1.092657,
			"y": 0.080616,
			"z": -1.007514
		},
		{
			"x": -1.092657,
			"y": 0.080616,
			"z": -0.449202
		},
		{
			"x": -1.090113,
			"y": 0.075621,
			"z": -0.449202
		},
		{
			"x": -1.137627,
			"y": 0.051411,
			"z": -0.449202
		},
		{
			"x": -1.140171,
			"y": 0.056406,
			"z": -0.449202
		},
		{
			"x": -1.140171,
			"y": 0.056406,
			"z": -1.007514
		},
		{
			"x": -1.137627,
			"y": 0.051411,
			"z": -1.007514
		},
		{
			"x": -1.100031,
			"y": 0.085185,
			"z": -0.865953
		},
		{
			"x": -1.100031,
			"y": 0.085185,
			"z": -0.945306
		},
		{
			"x": -1.095969,
			"y": 0.081123,
			"z": -0.945306
		},
		{
			"x": -1.095969,
			"y": 0.081123,
			"z": -0.865953
		},
		{
			"x": -1.141038,
			"y": 0.072951,
			"z": -0.449202
		},
		{
			"x": -1.141038,
			"y": 0.072951,
			"z": -1.007514
		},
		{
			"x": -1.141917,
			"y": 0.067416,
			"z": -1.007514
		},
		{
			"x": -1.141917,
			"y": 0.067416,
			"z": -0.449202
		},
		{
			"x": -1.095969,
			"y": 0.050889,
			"z": -0.865953
		},
		{
			"x": -1.100031,
			"y": 0.046827,
			"z": -0.865953
		},
		{
			"x": -1.047471,
			"y": -0.005736,
			"z": -0.879909
		},
		{
			"x": -1.043406,
			"y": -0.001671,
			"z": -0.879909
		},
		{
			"x": -1.131336,
			"y": 0.053532,
			"z": -0.486909
		},
		{
			"x": -1.127676,
			"y": 0.049872,
			"z": -0.486909
		},
		{
			"x": -1.169145,
			"y": 0.008406,
			"z": -0.486909
		},
		{
			"x": -1.172805,
			"y": 0.012066,
			"z": -0.486909
		},
		{
			"x": 1.105809,
			"y": 0.049758,
			"z": -0.486909
		},
		{
			"x": 1.06434,
			"y": 0.008292,
			"z": -0.486909
		},
		{
			"x": 1.06068,
			"y": 0.011952,
			"z": -0.486909
		},
		{
			"x": 1.102149,
			"y": 0.053418,
			"z": -0.486909
		},
		{
			"x": -1.127565,
			"y": 0.082218,
			"z": -0.486909
		},
		{
			"x": -1.131225,
			"y": 0.078558,
			"z": -0.486909
		},
		{
			"x": -1.172691,
			"y": 0.120027,
			"z": -0.486909
		},
		{
			"x": -1.169031,
			"y": 0.123687,
			"z": -0.486909
		},
		{
			"x": 1.17219,
			"y": 0.123687,
			"z": -0.480555
		},
		{
			"x": 1.152171,
			"y": 0.103668,
			"z": -0.462765
		},
		{
			"x": 1.155831,
			"y": 0.100008,
			"z": -0.462765
		},
		{
			"x": 1.17585,
			"y": 0.120027,
			"z": -0.480555
		},
		{
			"x": 1.134495,
			"y": 0.053532,
			"z": -0.486909
		},
		{
			"x": 1.175964,
			"y": 0.012066,
			"z": -0.486909
		},
		{
			"x": 1.172304,
			"y": 0.008406,
			"z": -0.486909
		},
		{
			"x": 1.130835,
			"y": 0.049872,
			"z": -0.486909
		},
		{
			"x": -0.629229,
			"y": 0.063897,
			"z": -0.739878
		},
		{
			"x": -0.639528,
			"y": 0.063897,
			"z": -0.739878
		},
		{
			"x": -0.639528,
			"y": 0.063897,
			"z": -0.511134
		},
		{
			"x": -0.629229,
			"y": 0.063897,
			"z": -0.511134
		},
		{
			"x": -0.629229,
			"y": -0.0276,
			"z": -0.739878
		},
		{
			"x": -0.639528,
			"y": -0.0276,
			"z": -0.739878
		},
		{
			"x": -0.634014,
			"y": -0.057477,
			"z": -0.218387
		},
		{
			"x": -0.641925,
			"y": -0.055206,
			"z": -0.218387
		},
		{
			"x": -0.641925,
			"y": -0.055206,
			"z": -0.329334
		},
		{
			"x": -0.634014,
			"y": -0.057477,
			"z": -0.329334
		},
		{
			"x": -0.629229,
			"y": -0.0276,
			"z": -0.351012
		},
		{
			"x": -0.639528,
			"y": -0.0276,
			"z": -0.351012
		},
		{
			"x": 0.672382,
			"y": 0.063897,
			"z": -0.511134
		},
		{
			"x": 0.662083,
			"y": 0.063897,
			"z": -0.511134
		},
		{
			"x": 0.662083,
			"y": 0.0291,
			"z": -0.409275
		},
		{
			"x": 0.672382,
			"y": 0.0291,
			"z": -0.409275
		},
		{
			"x": 0.672382,
			"y": 0.063897,
			"z": -0.739878
		},
		{
			"x": 0.662083,
			"y": 0.063897,
			"z": -0.739878
		},
		{
			"x": 0.672382,
			"y": -0.0276,
			"z": -0.739878
		},
		{
			"x": 0.662083,
			"y": -0.0276,
			"z": -0.739878
		},
		{
			"x": 0.672382,
			"y": -0.0276,
			"z": -0.351012
		},
		{
			"x": 0.662083,
			"y": -0.0276,
			"z": -0.351012
		},
		{
			"x": 1.105809,
			"y": 0.049758,
			"z": -0.440526
		},
		{
			"x": 1.102149,
			"y": 0.053418,
			"z": -0.440526
		},
		{
			"x": 1.06434,
			"y": 0.008292,
			"z": -0.480555
		},
		{
			"x": 1.06068,
			"y": 0.011952,
			"z": -0.480555
		},
		{
			"x": 1.102035,
			"y": 0.078447,
			"z": -0.440526
		},
		{
			"x": 1.102035,
			"y": 0.078447,
			"z": -0.486909
		},
		{
			"x": 1.105695,
			"y": 0.082107,
			"z": -0.486909
		},
		{
			"x": 1.105695,
			"y": 0.082107,
			"z": -0.440526
		},
		{
			"x": 1.095687,
			"y": 0.092115,
			"z": -0.442431
		},
		{
			"x": 1.092027,
			"y": 0.088455,
			"z": -0.442431
		},
		{
			"x": 1.130724,
			"y": 0.082218,
			"z": -0.440526
		},
		{
			"x": 1.134384,
			"y": 0.078558,
			"z": -0.440526
		},
		{
			"x": 1.144392,
			"y": 0.088569,
			"z": -0.442431
		},
		{
			"x": 1.140732,
			"y": 0.092229,
			"z": -0.442431
		},
		{
			"x": 1.091526,
			"y": 0.064611,
			"z": -1.007514
		},
		{
			"x": 1.091526,
			"y": 0.064611,
			"z": -0.449202
		},
		{
			"x": 1.09182,
			"y": 0.070206,
			"z": -0.449202
		},
		{
			"x": 1.09182,
			"y": 0.070206,
			"z": -1.007514
		},
		{
			"x": 1.097466,
			"y": 0.04914,
			"z": -0.449202
		},
		{
			"x": 1.094412,
			"y": 0.053841,
			"z": -0.449202
		},
		{
			"x": 1.094412,
			"y": 0.053841,
			"z": -1.007514
		},
		{
			"x": 1.097466,
			"y": 0.04914,
			"z": -1.007514
		},
		{
			"x": 1.111362,
			"y": 0.040116,
			"z": -0.449202
		},
		{
			"x": 1.10613,
			"y": 0.042126,
			"z": -0.449202
		},
		{
			"x": 1.10613,
			"y": 0.042126,
			"z": -1.007514
		},
		{
			"x": 1.111362,
			"y": 0.040116,
			"z": -1.007514
		},
		{
			"x": 1.144782,
			"y": 0.061818,
			"z": -0.449202
		},
		{
			"x": 1.144782,
			"y": 0.061818,
			"z": -1.007514
		},
		{
			"x": 1.145073,
			"y": 0.067416,
			"z": -1.007514
		},
		{
			"x": 1.145073,
			"y": 0.067416,
			"z": -0.449202
		},
		{
			"x": 1.14219,
			"y": 0.078186,
			"z": -0.449202
		},
		{
			"x": 1.144197,
			"y": 0.072951,
			"z": -0.449202
		},
		{
			"x": 1.144197,
			"y": 0.072951,
			"z": -1.007514
		},
		{
			"x": 1.14219,
			"y": 0.078186,
			"z": -1.007514
		},
		{
			"x": 1.12524,
			"y": 0.091911,
			"z": -0.449202
		},
		{
			"x": 1.130472,
			"y": 0.089901,
			"z": -0.449202
		},
		{
			"x": 1.130472,
			"y": 0.089901,
			"z": -1.007514
		},
		{
			"x": 1.12524,
			"y": 0.091911,
			"z": -1.007514
		},
		{
			"x": 1.185984,
			"y": -0.005736,
			"z": -0.93135
		},
		{
			"x": 1.133424,
			"y": 0.046827,
			"z": -0.945306
		},
		{
			"x": 1.137486,
			"y": 0.050889,
			"z": -0.945306
		},
		{
			"x": 1.190049,
			"y": -0.001671,
			"z": -0.93135
		},
		{
			"x": 1.133424,
			"y": 0.046827,
			"z": -0.865953
		},
		{
			"x": 1.185984,
			"y": -0.005736,
			"z": -0.879909
		},
		{
			"x": 1.190049,
			"y": -0.001671,
			"z": -0.879909
		},
		{
			"x": 1.137486,
			"y": 0.050889,
			"z": -0.865953
		},
		{
			"x": -1.10265,
			"y": 0.049758,
			"z": -0.440526
		},
		{
			"x": -1.09899,
			"y": 0.053418,
			"z": -0.440526
		},
		{
			"x": -1.09899,
			"y": 0.053418,
			"z": -0.486909
		},
		{
			"x": -1.10265,
			"y": 0.049758,
			"z": -0.486909
		},
		{
			"x": -1.057524,
			"y": 0.011952,
			"z": -0.486909
		},
		{
			"x": -1.061184,
			"y": 0.008292,
			"z": -0.486909
		},
		{
			"x": -1.057524,
			"y": 0.011952,
			"z": -0.480555
		},
		{
			"x": -1.061184,
			"y": 0.008292,
			"z": -0.480555
		},
		{
			"x": -1.131336,
			"y": 0.053532,
			"z": -0.440526
		},
		{
			"x": -1.127676,
			"y": 0.049872,
			"z": -0.440526
		},
		{
			"x": -1.127565,
			"y": 0.082218,
			"z": -0.440526
		},
		{
			"x": -1.131225,
			"y": 0.078558,
			"z": -0.440526
		},
		{
			"x": -1.169031,
			"y": 0.123687,
			"z": -0.480555
		},
		{
			"x": -1.172691,
			"y": 0.120027,
			"z": -0.480555
		},
		{
			"x": -1.152672,
			"y": 0.100008,
			"z": -0.462765
		},
		{
			"x": -1.149012,
			"y": 0.103668,
			"z": -0.462765
		},
		{
			"x": -1.089246,
			"y": 0.059073,
			"z": -0.449202
		},
		{
			"x": -1.089246,
			"y": 0.059073,
			"z": -1.007514
		},
		{
			"x": -1.088367,
			"y": 0.064611,
			"z": -1.007514
		},
		{
			"x": -1.088367,
			"y": 0.064611,
			"z": -0.449202
		},
		{
			"x": -1.091253,
			"y": 0.053841,
			"z": -0.449202
		},
		{
			"x": -1.091253,
			"y": 0.053841,
			"z": -1.007514
		},
		{
			"x": -1.09827,
			"y": 0.045177,
			"z": -0.449202
		},
		{
			"x": -1.09827,
			"y": 0.045177,
			"z": -1.007514
		},
		{
			"x": -1.094307,
			"y": 0.04914,
			"z": -1.007514
		},
		{
			"x": -1.094307,
			"y": 0.04914,
			"z": -0.449202
		},
		{
			"x": -1.108203,
			"y": 0.040116,
			"z": -0.449202
		},
		{
			"x": -1.108203,
			"y": 0.040116,
			"z": -1.007514
		},
		{
			"x": -1.102971,
			"y": 0.042126,
			"z": -1.007514
		},
		{
			"x": -1.102971,
			"y": 0.042126,
			"z": -0.449202
		},
		{
			"x": -1.129743,
			"y": 0.043527,
			"z": -0.449202
		},
		{
			"x": -1.134099,
			"y": 0.047055,
			"z": -0.449202
		},
		{
			"x": -1.134099,
			"y": 0.047055,
			"z": -1.007514
		},
		{
			"x": -1.129743,
			"y": 0.043527,
			"z": -1.007514
		},
		{
			"x": 0.653835,
			"y": -0.049176,
			"z": -0.218387
		},
		{
			"x": 0.651424,
			"y": -0.041205,
			"z": -0.218387
		},
		{
			"x": 0.651426,
			"y": -0.041208,
			"z": -0.329334
		},
		{
			"x": 0.653837,
			"y": -0.049179,
			"z": -0.329334
		},
		{
			"x": -1.141623,
			"y": 0.061818,
			"z": -0.449202
		},
		{
			"x": -1.141623,
			"y": 0.061818,
			"z": -1.007514
		},
		{
			"x": -1.139031,
			"y": 0.078186,
			"z": -0.449202
		},
		{
			"x": -1.139031,
			"y": 0.078186,
			"z": -1.007514
		},
		{
			"x": -0.620436,
			"y": -0.042321,
			"z": -0.838671
		},
		{
			"x": -0.620436,
			"y": -0.042315,
			"z": -0.751587
		},
		{
			"x": -0.621981,
			"y": -0.049305,
			"z": -0.751587
		},
		{
			"x": -0.621981,
			"y": -0.049311,
			"z": -0.838671
		},
		{
			"x": -1.135977,
			"y": 0.082887,
			"z": -0.449202
		},
		{
			"x": -1.135977,
			"y": 0.082887,
			"z": -1.007514
		},
		{
			"x": -1.132014,
			"y": 0.08685,
			"z": -0.449202
		},
		{
			"x": -1.132014,
			"y": 0.08685,
			"z": -1.007514
		},
		{
			"x": -1.127313,
			"y": 0.089901,
			"z": -0.449202
		},
		{
			"x": -1.127313,
			"y": 0.089901,
			"z": -1.007514
		},
		{
			"x": -1.18689,
			"y": -0.001671,
			"z": -0.879909
		},
		{
			"x": -1.18689,
			"y": -0.001671,
			"z": -0.93135
		},
		{
			"x": -1.182828,
			"y": -0.005736,
			"z": -0.93135
		},
		{
			"x": -1.182828,
			"y": -0.005736,
			"z": -0.879909
		},
		{
			"x": -1.18689,
			"y": 0.133686,
			"z": -0.93135
		},
		{
			"x": -1.182828,
			"y": 0.137748,
			"z": -0.93135
		},
		{
			"x": -1.130265,
			"y": 0.085185,
			"z": -0.945306
		},
		{
			"x": -1.134327,
			"y": 0.081123,
			"z": -0.945306
		},
		{
			"x": -1.134327,
			"y": 0.081123,
			"z": -0.865953
		},
		{
			"x": -1.130265,
			"y": 0.085185,
			"z": -0.865953
		},
		{
			"x": -1.182828,
			"y": 0.137748,
			"z": -0.879909
		},
		{
			"x": -1.18689,
			"y": 0.133686,
			"z": -0.879909
		},
		{
			"x": -0.639528,
			"y": 0.0291,
			"z": -0.409275
		},
		{
			"x": -0.629229,
			"y": 0.0291,
			"z": -0.409275
		},
		{
			"x": -0.648561,
			"y": -0.041163,
			"z": -0.838671
		},
		{
			"x": -0.648564,
			"y": -0.041157,
			"z": -0.751587
		},
		{
			"x": -0.647082,
			"y": -0.03417,
			"z": -0.751587
		},
		{
			"x": -0.647079,
			"y": -0.034176,
			"z": -0.838671
		},
		{
			"x": -1.098876,
			"y": 0.078447,
			"z": -0.486909
		},
		{
			"x": -1.102536,
			"y": 0.082107,
			"z": -0.486909
		},
		{
			"x": -1.06107,
			"y": 0.123573,
			"z": -0.486909
		},
		{
			"x": -1.05741,
			"y": 0.119913,
			"z": -0.486909
		},
		{
			"x": 1.060569,
			"y": 0.119913,
			"z": -0.486909
		},
		{
			"x": 1.064229,
			"y": 0.123573,
			"z": -0.486909
		},
		{
			"x": 1.05063,
			"y": -0.005736,
			"z": -0.879909
		},
		{
			"x": 1.046565,
			"y": -0.001671,
			"z": -0.879909
		},
		{
			"x": 1.046565,
			"y": -0.001671,
			"z": -0.93135
		},
		{
			"x": 1.05063,
			"y": -0.005736,
			"z": -0.93135
		},
		{
			"x": -1.141233,
			"y": 0.088569,
			"z": -0.442431
		},
		{
			"x": -1.137573,
			"y": 0.092229,
			"z": -0.442431
		},
		{
			"x": -1.141347,
			"y": 0.043521,
			"z": -0.442431
		},
		{
			"x": -1.137687,
			"y": 0.039861,
			"z": -0.442431
		},
		{
			"x": 1.101429,
			"y": 0.045177,
			"z": -0.449202
		},
		{
			"x": 1.101429,
			"y": 0.045177,
			"z": -1.007514
		},
		{
			"x": 1.046565,
			"y": 0.133686,
			"z": -0.879909
		},
		{
			"x": 1.05063,
			"y": 0.137748,
			"z": -0.879909
		},
		{
			"x": 1.05063,
			"y": 0.137748,
			"z": -0.93135
		},
		{
			"x": 1.046565,
			"y": 0.133686,
			"z": -0.93135
		},
		{
			"x": -1.07754,
			"y": 0.031971,
			"z": -0.462765
		},
		{
			"x": -1.0812,
			"y": 0.028311,
			"z": -0.462765
		},
		{
			"x": 1.137486,
			"y": 0.081123,
			"z": -0.865953
		},
		{
			"x": 1.133424,
			"y": 0.085185,
			"z": -0.865953
		},
		{
			"x": 1.133424,
			"y": 0.085185,
			"z": -0.945306
		},
		{
			"x": 1.137486,
			"y": 0.081123,
			"z": -0.945306
		},
		{
			"x": -0.626232,
			"y": -0.055653,
			"z": -0.218387
		},
		{
			"x": -0.626232,
			"y": -0.055653,
			"z": -0.329334
		},
		{
			"x": -1.124751,
			"y": 0.040983,
			"z": -0.449202
		},
		{
			"x": -1.124751,
			"y": 0.040983,
			"z": -1.007514
		},
		{
			"x": 1.135173,
			"y": 0.08685,
			"z": -0.449202
		},
		{
			"x": 1.135173,
			"y": 0.08685,
			"z": -1.007514
		},
		{
			"x": -1.088661,
			"y": 0.070206,
			"z": -1.007514
		},
		{
			"x": -1.088661,
			"y": 0.070206,
			"z": -0.449202
		},
		{
			"x": -1.096185,
			"y": 0.084972,
			"z": -1.007514
		},
		{
			"x": -1.096185,
			"y": 0.084972,
			"z": -0.449202
		},
		{
			"x": -1.098876,
			"y": 0.078447,
			"z": -0.440526
		},
		{
			"x": -1.088868,
			"y": 0.088455,
			"z": -0.442431
		},
		{
			"x": -1.092528,
			"y": 0.092115,
			"z": -0.442431
		},
		{
			"x": -1.102536,
			"y": 0.082107,
			"z": -0.440526
		},
		{
			"x": -1.12653,
			"y": 0.088365,
			"z": -0.413679
		},
		{
			"x": -1.130931,
			"y": 0.085509,
			"z": -0.413679
		},
		{
			"x": -1.092789,
			"y": 0.054624,
			"z": -0.413679
		},
		{
			"x": -1.090911,
			"y": 0.05952,
			"z": -0.413679
		},
		{
			"x": 1.124793,
			"y": 0.090246,
			"z": -0.413679
		},
		{
			"x": 1.129689,
			"y": 0.088365,
			"z": -0.413679
		},
		{
			"x": -1.099353,
			"y": 0.046518,
			"z": -0.413679
		},
		{
			"x": -1.095645,
			"y": 0.050226,
			"z": -0.413679
		},
		{
			"x": -1.134639,
			"y": 0.081801,
			"z": -0.413679
		},
		{
			"x": -1.101567,
			"y": 0.049251,
			"z": -0.387597
		},
		{
			"x": -1.098378,
			"y": 0.05244,
			"z": -0.387597
		},
		{
			"x": 1.104726,
			"y": 0.049251,
			"z": -0.387597
		},
		{
			"x": 1.101537,
			"y": 0.05244,
			"z": -0.387597
		},
		{
			"x": 1.098804,
			"y": 0.050226,
			"z": -0.413679
		},
		{
			"x": 1.102512,
			"y": 0.046518,
			"z": -0.413679
		},
		{
			"x": 0.660509,
			"y": -0.053727,
			"z": -0.838674
		},
		{
			"x": 0.667625,
			"y": -0.0558,
			"z": -0.838674
		},
		{
			"x": 0.667623,
			"y": -0.055794,
			"z": -0.751587
		},
		{
			"x": 0.660507,
			"y": -0.053721,
			"z": -0.751587
		},
		{
			"x": -0.62796,
			"y": -0.029766,
			"z": -0.838671
		},
		{
			"x": -0.635088,
			"y": -0.027657,
			"z": -0.838671
		},
		{
			"x": -0.635091,
			"y": -0.027651,
			"z": -0.751587
		},
		{
			"x": -0.627963,
			"y": -0.02976,
			"z": -0.751587
		},
		{
			"x": 1.099128,
			"y": 0.050889,
			"z": -0.865953
		},
		{
			"x": 1.10319,
			"y": 0.046827,
			"z": -0.865953
		},
		{
			"x": 1.099128,
			"y": 0.050889,
			"z": -0.945306
		},
		{
			"x": 1.10319,
			"y": 0.046827,
			"z": -0.945306
		},
		{
			"x": -1.172805,
			"y": 0.012066,
			"z": -0.480555
		},
		{
			"x": -1.169145,
			"y": 0.008406,
			"z": -0.480555
		},
		{
			"x": -1.149126,
			"y": 0.028422,
			"z": -0.462765
		},
		{
			"x": -1.152786,
			"y": 0.032082,
			"z": -0.462765
		},
		{
			"x": 1.084359,
			"y": 0.028311,
			"z": -0.462765
		},
		{
			"x": 1.080699,
			"y": 0.031971,
			"z": -0.462765
		},
		{
			"x": 0.681188,
			"y": -0.042315,
			"z": -0.454485
		},
		{
			"x": 0.679641,
			"y": -0.049314,
			"z": -0.454485
		},
		{
			"x": 0.679614,
			"y": -0.049299,
			"z": -0.549651
		},
		{
			"x": 0.681157,
			"y": -0.042315,
			"z": -0.549648
		},
		{
			"x": 1.134495,
			"y": 0.053532,
			"z": -0.440526
		},
		{
			"x": 1.130835,
			"y": 0.049872,
			"z": -0.440526
		},
		{
			"x": 1.140846,
			"y": 0.039861,
			"z": -0.442431
		},
		{
			"x": 1.144506,
			"y": 0.043521,
			"z": -0.442431
		},
		{
			"x": -1.09989,
			"y": 0.081264,
			"z": -0.387597
		},
		{
			"x": -1.103394,
			"y": 0.084102,
			"z": -0.387597
		},
		{
			"x": -1.106463,
			"y": 0.079377,
			"z": -0.356877
		},
		{
			"x": -1.103874,
			"y": 0.07728,
			"z": -0.356877
		},
		{
			"x": 1.093272,
			"y": 0.075621,
			"z": -0.449202
		},
		{
			"x": 1.093272,
			"y": 0.075621,
			"z": -1.007514
		},
		{
			"x": 1.14333,
			"y": 0.056406,
			"z": -0.449202
		},
		{
			"x": 1.14333,
			"y": 0.056406,
			"z": -1.007514
		},
		{
			"x": 1.060569,
			"y": 0.119913,
			"z": -0.480555
		},
		{
			"x": 1.080588,
			"y": 0.099894,
			"z": -0.462765
		},
		{
			"x": 1.084248,
			"y": 0.103554,
			"z": -0.462765
		},
		{
			"x": 1.064229,
			"y": 0.123573,
			"z": -0.480555
		},
		{
			"x": -1.127523,
			"y": 0.076041,
			"z": -0.356877
		},
		{
			"x": -1.131903,
			"y": 0.079587,
			"z": -0.387597
		},
		{
			"x": -1.13436,
			"y": 0.075807,
			"z": -0.387597
		},
		{
			"x": -1.129338,
			"y": 0.073248,
			"z": -0.356877
		},
		{
			"x": -1.043406,
			"y": -0.001671,
			"z": -0.93135
		},
		{
			"x": -1.047471,
			"y": -0.005736,
			"z": -0.93135
		},
		{
			"x": -1.100031,
			"y": 0.046827,
			"z": -0.945306
		},
		{
			"x": -1.095969,
			"y": 0.050889,
			"z": -0.945306
		},
		{
			"x": 1.10319,
			"y": 0.085185,
			"z": -0.865953
		},
		{
			"x": 1.099128,
			"y": 0.081123,
			"z": -0.865953
		},
		{
			"x": 1.099128,
			"y": 0.081123,
			"z": -0.945306
		},
		{
			"x": 1.10319,
			"y": 0.085185,
			"z": -0.945306
		},
		{
			"x": 1.095816,
			"y": 0.080616,
			"z": -1.007514
		},
		{
			"x": 1.095816,
			"y": 0.080616,
			"z": -0.449202
		},
		{
			"x": 1.099344,
			"y": 0.084972,
			"z": -0.449202
		},
		{
			"x": 1.099344,
			"y": 0.084972,
			"z": -1.007514
		},
		{
			"x": 1.132902,
			"y": 0.043527,
			"z": -0.449202
		},
		{
			"x": 1.132902,
			"y": 0.043527,
			"z": -1.007514
		},
		{
			"x": 1.137258,
			"y": 0.047055,
			"z": -1.007514
		},
		{
			"x": 1.137258,
			"y": 0.047055,
			"z": -0.449202
		},
		{
			"x": 1.140786,
			"y": 0.051411,
			"z": -1.007514
		},
		{
			"x": 1.140786,
			"y": 0.051411,
			"z": -0.449202
		},
		{
			"x": 1.175964,
			"y": 0.012066,
			"z": -0.480555
		},
		{
			"x": 1.155945,
			"y": 0.032082,
			"z": -0.462765
		},
		{
			"x": 1.152285,
			"y": 0.028422,
			"z": -0.462765
		},
		{
			"x": 1.172304,
			"y": 0.008406,
			"z": -0.480555
		},
		{
			"x": 1.092138,
			"y": 0.04341,
			"z": -0.442431
		},
		{
			"x": 1.095798,
			"y": 0.03975,
			"z": -0.442431
		},
		{
			"x": -1.05741,
			"y": 0.119913,
			"z": -0.480555
		},
		{
			"x": -1.06107,
			"y": 0.123573,
			"z": -0.480555
		},
		{
			"x": -1.081089,
			"y": 0.103554,
			"z": -0.462765
		},
		{
			"x": -1.077429,
			"y": 0.099894,
			"z": -0.462765
		},
		{
			"x": 0.667596,
			"y": -0.057477,
			"z": -0.218387
		},
		{
			"x": 0.659685,
			"y": -0.055206,
			"z": -0.218387
		},
		{
			"x": 0.659686,
			"y": -0.055206,
			"z": -0.329334
		},
		{
			"x": 0.667596,
			"y": -0.057477,
			"z": -0.329334
		},
		{
			"x": 0.675379,
			"y": -0.055653,
			"z": -0.218387
		},
		{
			"x": 0.675379,
			"y": -0.055653,
			"z": -0.329334
		},
		{
			"x": 0.678959,
			"y": -0.035172,
			"z": -0.549651
		},
		{
			"x": 0.678984,
			"y": -0.035154,
			"z": -0.454485
		},
		{
			"x": 0.666519,
			"y": -0.027651,
			"z": -0.751587
		},
		{
			"x": 0.666521,
			"y": -0.027657,
			"z": -0.838671
		},
		{
			"x": 0.659518,
			"y": -0.029259,
			"z": -0.838671
		},
		{
			"x": 0.659516,
			"y": -0.029253,
			"z": -0.751587
		},
		{
			"x": 1.103049,
			"y": 0.081264,
			"z": -0.387597
		},
		{
			"x": 1.107033,
			"y": 0.07728,
			"z": -0.356877
		},
		{
			"x": 1.109622,
			"y": 0.079377,
			"z": -0.356877
		},
		{
			"x": 1.106553,
			"y": 0.084102,
			"z": -0.387597
		},
		{
			"x": -1.043406,
			"y": 0.133686,
			"z": -0.879909
		},
		{
			"x": -1.043406,
			"y": 0.133686,
			"z": -0.93135
		},
		{
			"x": -1.047471,
			"y": 0.137748,
			"z": -0.93135
		},
		{
			"x": -1.047471,
			"y": 0.137748,
			"z": -0.879909
		},
		{
			"x": 1.139136,
			"y": 0.082887,
			"z": -0.449202
		},
		{
			"x": 1.139136,
			"y": 0.082887,
			"z": -1.007514
		},
		{
			"x": -1.119336,
			"y": 0.039534,
			"z": -0.449202
		},
		{
			"x": -1.119336,
			"y": 0.039534,
			"z": -1.007514
		},
		{
			"x": 1.114107,
			"y": 0.092493,
			"z": -1.007514
		},
		{
			"x": 1.114107,
			"y": 0.092493,
			"z": -0.449202
		},
		{
			"x": 1.119705,
			"y": 0.092787,
			"z": -0.449202
		},
		{
			"x": 1.119705,
			"y": 0.092787,
			"z": -1.007514
		},
		{
			"x": -1.113738,
			"y": 0.03924,
			"z": -0.449202
		},
		{
			"x": -1.113738,
			"y": 0.03924,
			"z": -1.007514
		},
		{
			"x": 1.116897,
			"y": 0.03924,
			"z": -0.449202
		},
		{
			"x": 1.116897,
			"y": 0.03924,
			"z": -1.007514
		},
		{
			"x": 1.122495,
			"y": 0.039534,
			"z": -1.007514
		},
		{
			"x": 1.122495,
			"y": 0.039534,
			"z": -0.449202
		},
		{
			"x": 1.108692,
			"y": 0.091044,
			"z": -1.007514
		},
		{
			"x": 1.108692,
			"y": 0.091044,
			"z": -0.449202
		},
		{
			"x": -1.092639,
			"y": 0.03975,
			"z": -0.442431
		},
		{
			"x": -1.088979,
			"y": 0.04341,
			"z": -0.442431
		},
		{
			"x": 0.666392,
			"y": -0.026196,
			"z": -0.218387
		},
		{
			"x": 0.65859,
			"y": -0.027978,
			"z": -0.218387
		},
		{
			"x": 0.659346,
			"y": -0.029217,
			"z": -0.206641
		},
		{
			"x": 0.666438,
			"y": -0.027597,
			"z": -0.206641
		},
		{
			"x": 0.674321,
			"y": -0.028518,
			"z": -0.218387
		},
		{
			"x": 0.674323,
			"y": -0.028521,
			"z": -0.329334
		},
		{
			"x": 0.666393,
			"y": -0.026199,
			"z": -0.329334
		},
		{
			"x": 0.678972,
			"y": -0.03516,
			"z": -0.751587
		},
		{
			"x": 0.681173,
			"y": -0.042315,
			"z": -0.751587
		},
		{
			"x": 0.681176,
			"y": -0.042321,
			"z": -0.838671
		},
		{
			"x": 0.678975,
			"y": -0.035166,
			"z": -0.838671
		},
		{
			"x": 0.673651,
			"y": -0.029766,
			"z": -0.838671
		},
		{
			"x": 0.673648,
			"y": -0.02976,
			"z": -0.751587
		},
		{
			"x": -0.642093,
			"y": -0.029259,
			"z": -0.838671
		},
		{
			"x": -0.642096,
			"y": -0.029253,
			"z": -0.751587
		},
		{
			"x": -0.642084,
			"y": -0.029271,
			"z": -0.549651
		},
		{
			"x": -0.635088,
			"y": -0.027672,
			"z": -0.549651
		},
		{
			"x": -0.635127,
			"y": -0.027237,
			"z": -0.717819
		},
		{
			"x": -0.64236,
			"y": -0.02889,
			"z": -0.717819
		},
		{
			"x": 0.659527,
			"y": -0.029271,
			"z": -0.549651
		},
		{
			"x": 0.666522,
			"y": -0.027672,
			"z": -0.549651
		},
		{
			"x": 0.666483,
			"y": -0.027237,
			"z": -0.717819
		},
		{
			"x": 0.659252,
			"y": -0.02889,
			"z": -0.717819
		},
		{
			"x": 0.679629,
			"y": -0.049305,
			"z": -0.751587
		},
		{
			"x": 0.679631,
			"y": -0.049311,
			"z": -0.838671
		},
		{
			"x": -0.620424,
			"y": -0.042315,
			"z": -0.454485
		},
		{
			"x": -0.621969,
			"y": -0.049314,
			"z": -0.454485
		},
		{
			"x": -0.621996,
			"y": -0.049299,
			"z": -0.549651
		},
		{
			"x": -0.620454,
			"y": -0.042315,
			"z": -0.549648
		},
		{
			"x": 0.653027,
			"y": -0.033429,
			"z": -0.218387
		},
		{
			"x": 0.653029,
			"y": -0.033432,
			"z": -0.329334
		},
		{
			"x": 0.65305,
			"y": -0.041163,
			"z": -0.838671
		},
		{
			"x": 0.653048,
			"y": -0.041157,
			"z": -0.751587
		},
		{
			"x": 0.654529,
			"y": -0.03417,
			"z": -0.751587
		},
		{
			"x": 0.654531,
			"y": -0.034176,
			"z": -0.838671
		},
		{
			"x": 1.185984,
			"y": 0.137748,
			"z": -0.879909
		},
		{
			"x": 1.190049,
			"y": 0.133686,
			"z": -0.879909
		},
		{
			"x": 1.190049,
			"y": 0.133686,
			"z": -0.93135
		},
		{
			"x": 1.185984,
			"y": 0.137748,
			"z": -0.93135
		},
		{
			"x": -1.090089,
			"y": 0.064701,
			"z": -0.413679
		},
		{
			"x": -1.10865,
			"y": 0.041781,
			"z": -0.413679
		},
		{
			"x": -1.103754,
			"y": 0.043662,
			"z": -0.413679
		},
		{
			"x": -1.094103,
			"y": 0.079677,
			"z": -0.413679
		},
		{
			"x": -1.097403,
			"y": 0.083751,
			"z": -0.413679
		},
		{
			"x": -1.097052,
			"y": 0.07776,
			"z": -0.387597
		},
		{
			"x": 1.097262,
			"y": 0.079677,
			"z": -0.413679
		},
		{
			"x": 1.100211,
			"y": 0.07776,
			"z": -0.387597
		},
		{
			"x": 1.100562,
			"y": 0.083751,
			"z": -0.413679
		},
		{
			"x": -0.62265,
			"y": -0.035172,
			"z": -0.549651
		},
		{
			"x": -0.620004,
			"y": -0.042372,
			"z": -0.717819
		},
		{
			"x": -0.622275,
			"y": -0.034986,
			"z": -0.717819
		},
		{
			"x": -0.622626,
			"y": -0.035154,
			"z": -0.454485
		},
		{
			"x": 1.108509,
			"y": 0.046794,
			"z": -0.387597
		},
		{
			"x": 1.10691,
			"y": 0.043662,
			"z": -0.413679
		},
		{
			"x": -1.114014,
			"y": 0.044475,
			"z": -0.387597
		},
		{
			"x": -1.113828,
			"y": 0.040962,
			"z": -0.413679
		},
		{
			"x": -1.109559,
			"y": 0.04518,
			"z": -0.387597
		},
		{
			"x": 1.117173,
			"y": 0.044475,
			"z": -0.387597
		},
		{
			"x": 1.112718,
			"y": 0.04518,
			"z": -0.387597
		},
		{
			"x": 1.111809,
			"y": 0.041781,
			"z": -0.413679
		},
		{
			"x": 1.116987,
			"y": 0.040962,
			"z": -0.413679
		},
		{
			"x": 1.139604,
			"y": 0.06264,
			"z": -0.387597
		},
		{
			"x": 1.143078,
			"y": 0.062088,
			"z": -0.413679
		},
		{
			"x": 1.143354,
			"y": 0.067326,
			"z": -0.413679
		},
		{
			"x": 1.139841,
			"y": 0.067143,
			"z": -0.387597
		},
		{
			"x": -1.135977,
			"y": 0.071595,
			"z": -0.387597
		},
		{
			"x": -1.130532,
			"y": 0.070137,
			"z": -0.356877
		},
		{
			"x": -1.130265,
			"y": 0.046827,
			"z": -0.865953
		},
		{
			"x": -1.134327,
			"y": 0.050889,
			"z": -0.865953
		},
		{
			"x": -1.134327,
			"y": 0.050889,
			"z": -0.945306
		},
		{
			"x": -1.130265,
			"y": 0.046827,
			"z": -0.945306
		},
		{
			"x": -0.63522,
			"y": -0.026196,
			"z": -0.218387
		},
		{
			"x": -0.64302,
			"y": -0.027978,
			"z": -0.218387
		},
		{
			"x": -0.642264,
			"y": -0.029217,
			"z": -0.206641
		},
		{
			"x": -0.635172,
			"y": -0.027597,
			"z": -0.206641
		},
		{
			"x": 1.123449,
			"y": 0.072372,
			"z": -0.326175
		},
		{
			"x": 1.124658,
			"y": 0.071163,
			"z": -0.326175
		},
		{
			"x": 1.130682,
			"y": 0.076041,
			"z": -0.356877
		},
		{
			"x": 1.128327,
			"y": 0.078396,
			"z": -0.356877
		},
		{
			"x": 1.104105,
			"y": 0.058779,
			"z": -0.356877
		},
		{
			"x": 1.102911,
			"y": 0.06189,
			"z": -0.356877
		},
		{
			"x": 1.097466,
			"y": 0.060432,
			"z": -0.387597
		},
		{
			"x": 1.099083,
			"y": 0.05622,
			"z": -0.387597
		},
		{
			"x": 1.108272,
			"y": 0.053631,
			"z": -0.356877
		},
		{
			"x": 1.105917,
			"y": 0.055986,
			"z": -0.356877
		},
		{
			"x": 1.126029,
			"y": 0.045876,
			"z": -0.387597
		},
		{
			"x": 1.130049,
			"y": 0.047925,
			"z": -0.387597
		},
		{
			"x": 1.126977,
			"y": 0.05265,
			"z": -0.356877
		},
		{
			"x": 1.12401,
			"y": 0.051138,
			"z": -0.356877
		},
		{
			"x": -1.12029,
			"y": 0.072372,
			"z": -0.326175
		},
		{
			"x": -1.125168,
			"y": 0.078396,
			"z": -0.356877
		},
		{
			"x": -1.121499,
			"y": 0.071163,
			"z": -0.326175
		},
		{
			"x": 0.655234,
			"y": -0.048309,
			"z": -0.549651
		},
		{
			"x": 0.653066,
			"y": -0.04116,
			"z": -0.549651
		},
		{
			"x": 0.652581,
			"y": -0.041175,
			"z": -0.717819
		},
		{
			"x": 0.654821,
			"y": -0.048564,
			"z": -0.717819
		},
		{
			"x": 1.122225,
			"y": 0.041235,
			"z": -0.413679
		},
		{
			"x": 1.127292,
			"y": 0.042594,
			"z": -0.413679
		},
		{
			"x": 1.121676,
			"y": 0.044709,
			"z": -0.387597
		},
		{
			"x": 1.132497,
			"y": 0.073248,
			"z": -0.356877
		},
		{
			"x": 1.133691,
			"y": 0.070137,
			"z": -0.356877
		},
		{
			"x": 1.139136,
			"y": 0.071595,
			"z": -0.387597
		},
		{
			"x": 1.137519,
			"y": 0.075807,
			"z": -0.387597
		},
		{
			"x": -1.121634,
			"y": 0.090246,
			"z": -0.413679
		},
		{
			"x": -1.139373,
			"y": 0.072507,
			"z": -0.413679
		},
		{
			"x": -1.140195,
			"y": 0.067326,
			"z": -0.413679
		},
		{
			"x": 0.680224,
			"y": -0.034539,
			"z": -0.218387
		},
		{
			"x": 0.68268,
			"y": -0.042504,
			"z": -0.218387
		},
		{
			"x": 0.68268,
			"y": -0.042504,
			"z": -0.329334
		},
		{
			"x": 0.680225,
			"y": -0.034539,
			"z": -0.329334
		},
		{
			"x": -0.627288,
			"y": -0.028518,
			"z": -0.218387
		},
		{
			"x": -0.627288,
			"y": -0.028521,
			"z": -0.329334
		},
		{
			"x": -0.635217,
			"y": -0.026199,
			"z": -0.329334
		},
		{
			"x": -0.61893,
			"y": -0.042504,
			"z": -0.218387
		},
		{
			"x": -0.620628,
			"y": -0.050286,
			"z": -0.218387
		},
		{
			"x": -0.620628,
			"y": -0.050289,
			"z": -0.329334
		},
		{
			"x": -0.61893,
			"y": -0.042504,
			"z": -0.329334
		},
		{
			"x": -1.130394,
			"y": 0.05076,
			"z": -0.387597
		},
		{
			"x": -1.133232,
			"y": 0.054267,
			"z": -0.387597
		},
		{
			"x": -1.136181,
			"y": 0.05235,
			"z": -0.413679
		},
		{
			"x": -1.132881,
			"y": 0.048273,
			"z": -0.413679
		},
		{
			"x": -1.136445,
			"y": 0.06264,
			"z": -0.387597
		},
		{
			"x": -1.136682,
			"y": 0.067143,
			"z": -0.387597
		},
		{
			"x": -1.139919,
			"y": 0.062088,
			"z": -0.413679
		},
		{
			"x": -1.11627,
			"y": 0.087552,
			"z": -0.387597
		},
		{
			"x": -1.116456,
			"y": 0.091065,
			"z": -0.413679
		},
		{
			"x": -1.120725,
			"y": 0.086847,
			"z": -0.387597
		},
		{
			"x": 1.133553,
			"y": 0.05076,
			"z": -0.387597
		},
		{
			"x": 1.13604,
			"y": 0.048273,
			"z": -0.413679
		},
		{
			"x": 1.13934,
			"y": 0.05235,
			"z": -0.413679
		},
		{
			"x": 1.136391,
			"y": 0.054267,
			"z": -0.387597
		},
		{
			"x": 0.653031,
			"y": -0.041157,
			"z": -0.454485
		},
		{
			"x": 0.655204,
			"y": -0.048321,
			"z": -0.454485
		},
		{
			"x": -0.635094,
			"y": -0.027636,
			"z": -0.454485
		},
		{
			"x": -0.627957,
			"y": -0.029748,
			"z": -0.454485
		},
		{
			"x": -0.627969,
			"y": -0.029778,
			"z": -0.549651
		},
		{
			"x": 0.680983,
			"y": -0.050286,
			"z": -0.218387
		},
		{
			"x": 0.680983,
			"y": -0.050289,
			"z": -0.329334
		},
		{
			"x": 1.138437,
			"y": 0.058284,
			"z": -0.387597
		},
		{
			"x": 1.141722,
			"y": 0.057024,
			"z": -0.413679
		},
		{
			"x": 0.667623,
			"y": -0.055779,
			"z": -0.549651
		},
		{
			"x": 0.674605,
			"y": -0.05415,
			"z": -0.549651
		},
		{
			"x": 0.67462,
			"y": -0.054177,
			"z": -0.454488
		},
		{
			"x": 0.667622,
			"y": -0.055809,
			"z": -0.454488
		},
		{
			"x": 0.655219,
			"y": -0.048312,
			"z": -0.751587
		},
		{
			"x": 0.655221,
			"y": -0.048321,
			"z": -0.838674
		},
		{
			"x": 1.128093,
			"y": 0.085233,
			"z": -0.387597
		},
		{
			"x": 1.131876,
			"y": 0.082776,
			"z": -0.387597
		},
		{
			"x": 1.134087,
			"y": 0.085509,
			"z": -0.413679
		},
		{
			"x": -1.135278,
			"y": 0.058284,
			"z": -0.387597
		},
		{
			"x": -1.138563,
			"y": 0.057024,
			"z": -0.413679
		},
		{
			"x": -1.090365,
			"y": 0.069939,
			"z": -0.413679
		},
		{
			"x": -1.093839,
			"y": 0.069387,
			"z": -0.387597
		},
		{
			"x": -1.093602,
			"y": 0.064884,
			"z": -0.387597
		},
		{
			"x": -1.100541,
			"y": 0.0885,
			"z": -0.449202
		},
		{
			"x": -1.10148,
			"y": 0.087054,
			"z": -0.413679
		},
		{
			"x": 1.095948,
			"y": 0.054624,
			"z": -0.413679
		},
		{
			"x": 1.135062,
			"y": 0.079587,
			"z": -0.387597
		},
		{
			"x": -0.646377,
			"y": -0.048309,
			"z": -0.549651
		},
		{
			"x": -0.648546,
			"y": -0.04116,
			"z": -0.549651
		},
		{
			"x": -0.649029,
			"y": -0.041175,
			"z": -0.717819
		},
		{
			"x": -0.646788,
			"y": -0.048564,
			"z": -0.717819
		},
		{
			"x": 0.666517,
			"y": -0.027636,
			"z": -0.454485
		},
		{
			"x": 0.673654,
			"y": -0.029748,
			"z": -0.454485
		},
		{
			"x": 0.673642,
			"y": -0.029778,
			"z": -0.549651
		},
		{
			"x": -0.641103,
			"y": -0.053727,
			"z": -0.838674
		},
		{
			"x": -0.633984,
			"y": -0.0558,
			"z": -0.838674
		},
		{
			"x": -0.633987,
			"y": -0.055794,
			"z": -0.751587
		},
		{
			"x": -0.641103,
			"y": -0.053721,
			"z": -0.751587
		},
		{
			"x": -0.646392,
			"y": -0.048312,
			"z": -0.751587
		},
		{
			"x": -0.646389,
			"y": -0.048321,
			"z": -0.838674
		},
		{
			"x": 1.127907,
			"y": 0.040983,
			"z": -1.007514
		},
		{
			"x": 1.12791,
			"y": 0.040983,
			"z": -0.449202
		},
		{
			"x": -0.633987,
			"y": -0.055779,
			"z": -0.549651
		},
		{
			"x": -0.627006,
			"y": -0.05415,
			"z": -0.549651
		},
		{
			"x": -0.626991,
			"y": -0.054177,
			"z": -0.454488
		},
		{
			"x": -0.63399,
			"y": -0.055809,
			"z": -0.454488
		},
		{
			"x": -1.111767,
			"y": 0.087318,
			"z": -0.387597
		},
		{
			"x": -1.111218,
			"y": 0.090792,
			"z": -0.413679
		},
		{
			"x": -1.095924,
			"y": 0.05622,
			"z": -0.387597
		},
		{
			"x": -1.099404,
			"y": 0.068505,
			"z": -0.356877
		},
		{
			"x": -1.100268,
			"y": 0.071724,
			"z": -0.356877
		},
		{
			"x": -1.107504,
			"y": 0.068946,
			"z": -0.326175
		},
		{
			"x": -1.10706,
			"y": 0.067293,
			"z": -0.326175
		},
		{
			"x": 1.122756,
			"y": 0.059151,
			"z": -0.326175
		},
		{
			"x": 1.121232,
			"y": 0.058374,
			"z": -0.326175
		},
		{
			"x": 1.111941,
			"y": 0.060864,
			"z": -0.326175
		},
		{
			"x": 1.111011,
			"y": 0.062298,
			"z": -0.326175
		},
		{
			"x": -1.100946,
			"y": 0.058779,
			"z": -0.356877
		},
		{
			"x": -1.094307,
			"y": 0.060432,
			"z": -0.387597
		},
		{
			"x": -1.099752,
			"y": 0.06189,
			"z": -0.356877
		},
		{
			"x": -1.095006,
			"y": 0.073743,
			"z": -0.387597
		},
		{
			"x": -1.10178,
			"y": 0.074691,
			"z": -0.356877
		},
		{
			"x": -1.109433,
			"y": 0.080889,
			"z": -0.356877
		},
		{
			"x": -1.107411,
			"y": 0.086151,
			"z": -0.387597
		},
		{
			"x": -1.112649,
			"y": 0.08175,
			"z": -0.356877
		},
		{
			"x": -1.118517,
			"y": 0.044709,
			"z": -0.387597
		},
		{
			"x": -1.117635,
			"y": 0.050277,
			"z": -0.356877
		},
		{
			"x": -1.120851,
			"y": 0.051138,
			"z": -0.356877
		},
		{
			"x": -1.122873,
			"y": 0.045876,
			"z": -0.387597
		},
		{
			"x": 1.125162,
			"y": 0.061557,
			"z": -0.326175
		},
		{
			"x": 1.131663,
			"y": 0.057336,
			"z": -0.356877
		},
		{
			"x": 1.133175,
			"y": 0.060303,
			"z": -0.356877
		},
		{
			"x": 1.125939,
			"y": 0.063081,
			"z": -0.326175
		},
		{
			"x": -1.108281,
			"y": 0.07047,
			"z": -0.326175
		},
		{
			"x": 1.11873,
			"y": 0.074184,
			"z": -0.326175
		},
		{
			"x": 1.120419,
			"y": 0.073917,
			"z": -0.326175
		},
		{
			"x": 1.122423,
			"y": 0.081405,
			"z": -0.356877
		},
		{
			"x": 1.119135,
			"y": 0.081924,
			"z": -0.356877
		},
		{
			"x": 1.104636,
			"y": 0.087054,
			"z": -0.413679
		},
		{
			"x": 1.103697,
			"y": 0.0885,
			"z": -0.449202
		},
		{
			"x": 0.681608,
			"y": -0.042372,
			"z": -0.717819
		},
		{
			"x": 0.679334,
			"y": -0.034986,
			"z": -0.717819
		},
		{
			"x": 1.140654,
			"y": 0.077403,
			"z": -0.413679
		},
		{
			"x": 1.142532,
			"y": 0.072507,
			"z": -0.413679
		},
		{
			"x": -0.648579,
			"y": -0.041157,
			"z": -0.454485
		},
		{
			"x": -0.646407,
			"y": -0.048321,
			"z": -0.454485
		},
		{
			"x": -1.091721,
			"y": 0.075003,
			"z": -0.413679
		},
		{
			"x": 1.114926,
			"y": 0.087318,
			"z": -0.387597
		},
		{
			"x": 1.119429,
			"y": 0.087552,
			"z": -0.387597
		},
		{
			"x": 1.119612,
			"y": 0.091065,
			"z": -0.413679
		},
		{
			"x": 1.114377,
			"y": 0.090792,
			"z": -0.413679
		},
		{
			"x": -1.119066,
			"y": 0.041235,
			"z": -0.413679
		},
		{
			"x": -0.641112,
			"y": -0.053733,
			"z": -0.454488
		},
		{
			"x": -0.641094,
			"y": -0.053706,
			"z": -0.549651
		},
		{
			"x": 1.131963,
			"y": 0.044973,
			"z": -0.413679
		},
		{
			"x": 1.093521,
			"y": 0.069939,
			"z": -0.413679
		},
		{
			"x": 1.09488,
			"y": 0.075003,
			"z": -0.413679
		},
		{
			"x": 1.112514,
			"y": 0.071799,
			"z": -0.326175
		},
		{
			"x": 1.113843,
			"y": 0.072876,
			"z": -0.326175
		},
		{
			"x": -1.110687,
			"y": 0.072876,
			"z": -0.326175
		},
		{
			"x": -1.109358,
			"y": 0.071799,
			"z": -0.326175
		},
		{
			"x": 1.129566,
			"y": 0.054747,
			"z": -0.356877
		},
		{
			"x": 1.124085,
			"y": 0.060228,
			"z": -0.326175
		},
		{
			"x": 1.137798,
			"y": 0.081801,
			"z": -0.413679
		},
		{
			"x": -1.137495,
			"y": 0.077403,
			"z": -0.413679
		},
		{
			"x": -1.106151,
			"y": 0.089433,
			"z": -0.413679
		},
		{
			"x": 1.123884,
			"y": 0.086847,
			"z": -0.387597
		},
		{
			"x": 1.10931,
			"y": 0.089433,
			"z": -0.413679
		},
		{
			"x": 1.098165,
			"y": 0.073743,
			"z": -0.387597
		},
		{
			"x": 0.654513,
			"y": -0.034161,
			"z": -0.454485
		},
		{
			"x": 0.654547,
			"y": -0.034182,
			"z": -0.549651
		},
		{
			"x": -0.633993,
			"y": -0.05628,
			"z": -0.717819
		},
		{
			"x": -0.626775,
			"y": -0.054594,
			"z": -0.717819
		},
		{
			"x": -1.124133,
			"y": 0.042594,
			"z": -0.413679
		},
		{
			"x": -1.128804,
			"y": 0.044973,
			"z": -0.413679
		},
		{
			"x": -1.122003,
			"y": 0.061557,
			"z": -0.326175
		},
		{
			"x": -1.12278,
			"y": 0.063081,
			"z": -0.326175
		},
		{
			"x": -1.130016,
			"y": 0.060303,
			"z": -0.356877
		},
		{
			"x": -1.128504,
			"y": 0.057336,
			"z": -0.356877
		},
		{
			"x": -1.120926,
			"y": 0.060228,
			"z": -0.326175
		},
		{
			"x": -1.126407,
			"y": 0.054747,
			"z": -0.356877
		},
		{
			"x": 1.094067,
			"y": 0.05952,
			"z": -0.413679
		},
		{
			"x": -1.12689,
			"y": 0.047925,
			"z": -0.387597
		},
		{
			"x": 1.111068,
			"y": 0.051816,
			"z": -0.356877
		},
		{
			"x": 1.125534,
			"y": 0.080211,
			"z": -0.356877
		},
		{
			"x": -0.647775,
			"y": -0.049176,
			"z": -0.218387
		},
		{
			"x": -0.647775,
			"y": -0.049179,
			"z": -0.329334
		},
		{
			"x": 1.134213,
			"y": 0.066846,
			"z": -0.356877
		},
		{
			"x": -1.131054,
			"y": 0.066846,
			"z": -0.356877
		},
		{
			"x": -1.107909,
			"y": 0.051816,
			"z": -0.356877
		},
		{
			"x": -1.10535,
			"y": 0.046794,
			"z": -0.387597
		},
		{
			"x": -1.105116,
			"y": 0.053631,
			"z": -0.356877
		},
		{
			"x": -1.122375,
			"y": 0.080211,
			"z": -0.356877
		},
		{
			"x": -1.124934,
			"y": 0.085233,
			"z": -0.387597
		},
		{
			"x": -1.128717,
			"y": 0.082776,
			"z": -0.387597
		},
		{
			"x": -0.622638,
			"y": -0.03516,
			"z": -0.751587
		},
		{
			"x": 0.667617,
			"y": -0.05628,
			"z": -0.717819
		},
		{
			"x": 0.674835,
			"y": -0.054594,
			"z": -0.717819
		},
		{
			"x": 1.11057,
			"y": 0.086151,
			"z": -0.387597
		},
		{
			"x": 1.096761,
			"y": 0.064884,
			"z": -0.387597
		},
		{
			"x": 1.093248,
			"y": 0.064701,
			"z": -0.413679
		},
		{
			"x": 0.660498,
			"y": -0.053733,
			"z": -0.454488
		},
		{
			"x": 0.660517,
			"y": -0.053706,
			"z": -0.549651
		},
		{
			"x": -0.648582,
			"y": -0.033429,
			"z": -0.218387
		},
		{
			"x": -0.64302,
			"y": -0.027978,
			"z": -0.329334
		},
		{
			"x": -0.648582,
			"y": -0.033432,
			"z": -0.329334
		},
		{
			"x": -1.114308,
			"y": 0.050103,
			"z": -0.356877
		},
		{
			"x": 1.115808,
			"y": 0.08175,
			"z": -0.356877
		},
		{
			"x": 1.134039,
			"y": 0.063522,
			"z": -0.356877
		},
		{
			"x": 0.658592,
			"y": -0.027978,
			"z": -0.329334
		},
		{
			"x": -1.115976,
			"y": 0.081924,
			"z": -0.356877
		},
		{
			"x": -1.102758,
			"y": 0.055986,
			"z": -0.356877
		},
		{
			"x": -1.114713,
			"y": 0.057843,
			"z": -0.326175
		},
		{
			"x": -1.116423,
			"y": 0.057933,
			"z": -0.326175
		},
		{
			"x": 1.11702,
			"y": 0.074094,
			"z": -0.326175
		},
		{
			"x": -1.123821,
			"y": 0.05265,
			"z": -0.356877
		},
		{
			"x": -1.119597,
			"y": 0.059151,
			"z": -0.326175
		},
		{
			"x": -0.620334,
			"y": -0.042444,
			"z": -0.206642
		},
		{
			"x": -0.622563,
			"y": -0.035199,
			"z": -0.206642
		},
		{
			"x": -0.624726,
			"y": -0.036408,
			"z": -0.194897
		},
		{
			"x": -0.622905,
			"y": -0.042333,
			"z": -0.194897
		},
		{
			"x": -1.115571,
			"y": 0.074184,
			"z": -0.326175
		},
		{
			"x": -1.119267,
			"y": 0.081405,
			"z": -0.356877
		},
		{
			"x": -1.11726,
			"y": 0.073917,
			"z": -0.326175
		},
		{
			"x": 0.659506,
			"y": -0.029241,
			"z": -0.454485
		},
		{
			"x": -0.621387,
			"y": -0.034539,
			"z": -0.218387
		},
		{
			"x": -0.621384,
			"y": -0.034539,
			"z": -0.329334
		},
		{
			"x": -0.650187,
			"y": -0.041205,
			"z": -0.218387
		},
		{
			"x": -0.650184,
			"y": -0.041208,
			"z": -0.329334
		},
		{
			"x": -0.622635,
			"y": -0.035166,
			"z": -0.838671
		},
		{
			"x": -1.09923,
			"y": 0.065178,
			"z": -0.356877
		},
		{
			"x": 1.102389,
			"y": 0.065178,
			"z": -0.356877
		},
		{
			"x": 1.102563,
			"y": 0.068505,
			"z": -0.356877
		},
		{
			"x": 1.096998,
			"y": 0.069387,
			"z": -0.387597
		},
		{
			"x": -1.13088,
			"y": 0.063522,
			"z": -0.356877
		},
		{
			"x": -1.123044,
			"y": 0.06813,
			"z": -0.326175
		},
		{
			"x": -1.123311,
			"y": 0.066441,
			"z": -0.326175
		},
		{
			"x": -1.113861,
			"y": 0.074094,
			"z": -0.326175
		},
		{
			"x": -1.123221,
			"y": 0.064734,
			"z": -0.326175
		},
		{
			"x": 1.12638,
			"y": 0.064734,
			"z": -0.326175
		},
		{
			"x": 1.12647,
			"y": 0.066441,
			"z": -0.326175
		},
		{
			"x": 1.120794,
			"y": 0.050277,
			"z": -0.356877
		},
		{
			"x": 0.681277,
			"y": -0.042444,
			"z": -0.206642
		},
		{
			"x": 0.679047,
			"y": -0.035199,
			"z": -0.206642
		},
		{
			"x": 0.676884,
			"y": -0.036408,
			"z": -0.194897
		},
		{
			"x": 0.678706,
			"y": -0.042333,
			"z": -0.194897
		},
		{
			"x": -0.648807,
			"y": -0.041271,
			"z": -0.206642
		},
		{
			"x": -0.646611,
			"y": -0.048516,
			"z": -0.206642
		},
		{
			"x": -0.644466,
			"y": -0.047313,
			"z": -0.194897
		},
		{
			"x": -0.646266,
			"y": -0.041382,
			"z": -0.194897
		},
		{
			"x": 0.674631,
			"y": -0.054432,
			"z": -0.206642
		},
		{
			"x": 0.667554,
			"y": -0.056088,
			"z": -0.206642
		},
		{
			"x": 1.117467,
			"y": 0.050103,
			"z": -0.356877
		},
		{
			"x": -0.626979,
			"y": -0.054432,
			"z": -0.206642
		},
		{
			"x": -0.634056,
			"y": -0.056088,
			"z": -0.206642
		},
		{
			"x": -0.642105,
			"y": -0.029241,
			"z": -0.454485
		},
		{
			"x": 1.112589,
			"y": 0.080889,
			"z": -0.356877
		},
		{
			"x": 1.103424,
			"y": 0.071724,
			"z": -0.356877
		},
		{
			"x": -1.111017,
			"y": 0.050622,
			"z": -0.356877
		},
		{
			"x": -1.113024,
			"y": 0.05811,
			"z": -0.326175
		},
		{
			"x": 1.110129,
			"y": 0.065586,
			"z": -0.326175
		},
		{
			"x": 1.110219,
			"y": 0.067293,
			"z": -0.326175
		},
		{
			"x": 1.119579,
			"y": 0.057933,
			"z": -0.326175
		},
		{
			"x": 1.117872,
			"y": 0.057843,
			"z": -0.326175
		},
		{
			"x": -1.100541,
			"y": 0.088497,
			"z": -1.007514
		},
		{
			"x": 1.103697,
			"y": 0.088497,
			"z": -1.007514
		},
		{
			"x": 0.674616,
			"y": -0.054168,
			"z": -0.838674
		},
		{
			"x": 0.674614,
			"y": -0.054165,
			"z": -0.751587
		},
		{
			"x": -0.626994,
			"y": -0.054168,
			"z": -0.838674
		},
		{
			"x": -0.626997,
			"y": -0.054165,
			"z": -0.751587
		},
		{
			"x": 1.116183,
			"y": 0.05811,
			"z": -0.326175
		},
		{
			"x": 1.114176,
			"y": 0.050622,
			"z": -0.356877
		},
		{
			"x": 1.126203,
			"y": 0.06813,
			"z": -0.326175
		},
		{
			"x": 1.114587,
			"y": 0.058725,
			"z": -0.326175
		},
		{
			"x": 1.113153,
			"y": 0.059655,
			"z": -0.326175
		},
		{
			"x": 1.104939,
			"y": 0.074691,
			"z": -0.356877
		},
		{
			"x": 1.11144,
			"y": 0.07047,
			"z": -0.326175
		},
		{
			"x": -1.118073,
			"y": 0.058374,
			"z": -0.326175
		},
		{
			"x": 1.092405,
			"y": 0.059073,
			"z": -0.449202
		},
		{
			"x": 1.092402,
			"y": 0.059073,
			"z": -1.007514
		},
		{
			"x": -1.122432,
			"y": 0.069729,
			"z": -0.326175
		},
		{
			"x": -0.647097,
			"y": -0.034161,
			"z": -0.454485
		},
		{
			"x": -0.647064,
			"y": -0.034182,
			"z": -0.549651
		},
		{
			"x": 0.673843,
			"y": -0.029409,
			"z": -0.717819
		},
		{
			"x": 1.125591,
			"y": 0.069729,
			"z": -0.326175
		},
		{
			"x": -0.627768,
			"y": -0.029409,
			"z": -0.717819
		},
		{
			"x": 1.110663,
			"y": 0.068946,
			"z": -0.326175
		},
		{
			"x": 0.655001,
			"y": -0.048516,
			"z": -0.206642
		},
		{
			"x": 0.652805,
			"y": -0.041271,
			"z": -0.206642
		},
		{
			"x": 0.657146,
			"y": -0.047313,
			"z": -0.194897
		},
		{
			"x": 0.655344,
			"y": -0.041382,
			"z": -0.194897
		},
		{
			"x": -1.109994,
			"y": 0.059655,
			"z": -0.326175
		},
		{
			"x": -1.108785,
			"y": 0.060864,
			"z": -0.326175
		},
		{
			"x": 0.680019,
			"y": -0.04959,
			"z": -0.717819
		},
		{
			"x": -1.10724,
			"y": 0.063897,
			"z": -0.326175
		},
		{
			"x": -1.106973,
			"y": 0.065586,
			"z": -0.326175
		},
		{
			"x": 1.122015,
			"y": 0.073302,
			"z": -0.326175
		},
		{
			"x": -1.118856,
			"y": 0.073302,
			"z": -0.326175
		},
		{
			"x": -0.621591,
			"y": -0.04959,
			"z": -0.717819
		},
		{
			"x": -1.112211,
			"y": 0.07365,
			"z": -0.326175
		},
		{
			"x": 0.660272,
			"y": -0.05415,
			"z": -0.717819
		},
		{
			"x": 1.110399,
			"y": 0.063897,
			"z": -0.326175
		},
		{
			"x": -0.647511,
			"y": -0.03396,
			"z": -0.717819
		},
		{
			"x": 0.6541,
			"y": -0.03396,
			"z": -0.717819
		},
		{
			"x": 1.115367,
			"y": 0.07365,
			"z": -0.326175
		},
		{
			"x": -1.107852,
			"y": 0.062298,
			"z": -0.326175
		},
		{
			"x": -0.641337,
			"y": -0.05415,
			"z": -0.717819
		},
		{
			"x": -1.111428,
			"y": 0.058725,
			"z": -0.326175
		},
		{
			"x": 0.74163,
			"y": 0.031755,
			"z": -0.541782
		},
		{
			"x": 0.741633,
			"y": 0.031758,
			"z": -0.549702
		},
		{
			"x": -0.55998,
			"y": 0.031755,
			"z": -0.541782
		},
		{
			"x": -0.559977,
			"y": 0.031758,
			"z": -0.549702
		},
		{
			"x": -0.701064,
			"y": 0.024078,
			"z": -0.838737
		},
		{
			"x": -0.701064,
			"y": 0.024078,
			"z": -0.831273
		},
		{
			"x": 0.600546,
			"y": 0.024078,
			"z": -0.831273
		},
		{
			"x": 0.600546,
			"y": 0.024078,
			"z": -0.838737
		},
		{
			"x": -0.621897,
			"y": -0.049521,
			"z": -0.206642
		},
		{
			"x": 0.679712,
			"y": -0.049521,
			"z": -0.206642
		},
		{
			"x": 0.673656,
			"y": -0.029733,
			"z": -0.206642
		},
		{
			"x": -0.627954,
			"y": -0.029733,
			"z": -0.206642
		},
		{
			"x": -0.647313,
			"y": -0.034194,
			"z": -0.206642
		},
		{
			"x": 0.654298,
			"y": -0.034194,
			"z": -0.206642
		},
		{
			"x": -0.629163,
			"y": -0.031938,
			"z": -0.194897
		},
		{
			"x": -0.635082,
			"y": -0.030165,
			"z": -0.194897
		},
		{
			"x": 0.672446,
			"y": -0.031938,
			"z": -0.194897
		},
		{
			"x": 0.66653,
			"y": -0.030165,
			"z": -0.194897
		},
		{
			"x": 0.66035,
			"y": -0.053991,
			"z": -0.206642
		},
		{
			"x": 0.677401,
			"y": -0.048129,
			"z": -0.194897
		},
		{
			"x": -0.641259,
			"y": -0.053991,
			"z": -0.206642
		},
		{
			"x": -0.62421,
			"y": -0.048129,
			"z": -0.194897
		},
		{
			"x": -0.64005,
			"y": -0.051786,
			"z": -0.194897
		},
		{
			"x": 0.66156,
			"y": -0.051786,
			"z": -0.194897
		},
		{
			"x": 0.667468,
			"y": -0.053538,
			"z": -0.194897
		},
		{
			"x": -0.634143,
			"y": -0.053538,
			"z": -0.194897
		},
		{
			"x": -0.645003,
			"y": -0.035589,
			"z": -0.194897
		},
		{
			"x": 0.656607,
			"y": -0.035589,
			"z": -0.194897
		},
		{
			"x": -1.115142,
			"y": 0.066012,
			"z": -1.007514
		},
		{
			"x": 1.118301,
			"y": 0.066012,
			"z": -1.007514
		},
		{
			"x": -0.561924,
			"y": -0.112656,
			"z": -0.548346
		},
		{
			"x": -0.563019,
			"y": -0.113745,
			"z": -0.533016
		},
		{
			"x": 0.739687,
			"y": -0.112656,
			"z": -0.548346
		},
		{
			"x": 0.73859,
			"y": -0.113745,
			"z": -0.533016
		},
		{
			"x": -0.699951,
			"y": 0.025407,
			"z": -0.53301
		},
		{
			"x": -0.700977,
			"y": 0.02424,
			"z": -0.548343
		},
		{
			"x": 0.60166,
			"y": 0.025407,
			"z": -0.53301
		},
		{
			"x": 0.600634,
			"y": 0.02424,
			"z": -0.548343
		},
		{
			"x": -0.561792,
			"y": -0.112629,
			"z": -0.824856
		},
		{
			"x": -0.563031,
			"y": -0.113751,
			"z": -0.838773
		},
		{
			"x": 0.73982,
			"y": -0.112629,
			"z": -0.824856
		},
		{
			"x": 0.738581,
			"y": -0.113751,
			"z": -0.838773
		},
		{
			"x": 0.663224,
			"y": -0.048753,
			"z": -0.183152
		},
		{
			"x": -0.638388,
			"y": -0.048753,
			"z": -0.183152
		},
		{
			"x": 0.595434,
			"y": -0.114483,
			"z": -0.541773
		},
		{
			"x": 0.594192,
			"y": -0.113244,
			"z": -0.549693
		},
		{
			"x": -0.706176,
			"y": -0.114483,
			"z": -0.541773
		},
		{
			"x": -0.707418,
			"y": -0.113244,
			"z": -0.549693
		},
		{
			"x": 0.740094,
			"y": 0.030381,
			"z": -0.831504
		},
		{
			"x": 0.738943,
			"y": 0.031527,
			"z": -0.838758
		},
		{
			"x": -0.561516,
			"y": 0.030381,
			"z": -0.831504
		},
		{
			"x": -0.562668,
			"y": 0.031527,
			"z": -0.838758
		},
		{
			"x": 0.596349,
			"y": -0.111177,
			"z": -0.831504
		},
		{
			"x": 0.597489,
			"y": -0.112335,
			"z": -0.838755
		},
		{
			"x": -0.705261,
			"y": -0.111177,
			"z": -0.831504
		},
		{
			"x": -0.704121,
			"y": -0.112335,
			"z": -0.838755
		},
		{
			"x": 1.118301,
			"y": 0.066012,
			"z": -0.305121
		},
		{
			"x": -1.115142,
			"y": 0.066012,
			"z": -0.305121
		},
		{
			"x": -0.023895,
			"y": -0.192499,
			"z": -0.184302
		},
		{
			"x": 0.000402,
			"y": -0.194287,
			"z": -0.184302
		},
		{
			"x": 0.000402,
			"y": -0.192793,
			"z": -0.135441
		},
		{
			"x": -0.023766,
			"y": -0.191014,
			"z": -0.135441
		},
		{
			"x": 0.024699,
			"y": -0.192499,
			"z": -0.184302
		},
		{
			"x": 0.02457,
			"y": -0.191014,
			"z": -0.135441
		},
		{
			"x": -0.005454,
			"y": -0.128662,
			"z": -0.775617
		},
		{
			"x": 0.000396,
			"y": -0.129187,
			"z": -0.775617
		},
		{
			"x": 0.000399,
			"y": -0.139618,
			"z": -0.758646
		},
		{
			"x": -0.007323,
			"y": -0.138925,
			"z": -0.758646
		},
		{
			"x": 0.000396,
			"y": -0.098326,
			"z": -0.775617
		},
		{
			"x": -0.005454,
			"y": -0.098851,
			"z": -0.775617
		},
		{
			"x": -0.007323,
			"y": -0.099628,
			"z": -0.758649
		},
		{
			"x": 0.000399,
			"y": -0.098935,
			"z": -0.758649
		},
		{
			"x": 0.081192,
			"y": -0.166996,
			"z": -0.234129
		},
		{
			"x": 0.090513,
			"y": -0.154117,
			"z": -0.234129
		},
		{
			"x": 0.09108,
			"y": -0.154618,
			"z": -0.184302
		},
		{
			"x": 0.081702,
			"y": -0.167575,
			"z": -0.184302
		},
		{
			"x": 0.006246,
			"y": -0.128662,
			"z": -0.775617
		},
		{
			"x": 0.008118,
			"y": -0.138925,
			"z": -0.758646
		},
		{
			"x": 0.006246,
			"y": -0.098851,
			"z": -0.775617
		},
		{
			"x": 0.008118,
			"y": -0.099628,
			"z": -0.758649
		},
		{
			"x": 0.000399,
			"y": -0.096889,
			"z": -0.737112
		},
		{
			"x": 0.009927,
			"y": -0.097744,
			"z": -0.737112
		},
		{
			"x": 0.029208,
			"y": -0.12454,
			"z": -0.758646
		},
		{
			"x": 0.030225,
			"y": -0.119275,
			"z": -0.758649
		},
		{
			"x": 0.037215,
			"y": -0.121948,
			"z": -0.737112
		},
		{
			"x": 0.035961,
			"y": -0.128431,
			"z": -0.737112
		},
		{
			"x": -0.009132,
			"y": -0.146152,
			"z": -0.737112
		},
		{
			"x": 0.000399,
			"y": -0.147004,
			"z": -0.737109
		},
		{
			"x": 0.000399,
			"y": -0.157708,
			"z": -0.711216
		},
		{
			"x": -0.010872,
			"y": -0.156703,
			"z": -0.711216
		},
		{
			"x": 0.052398,
			"y": -0.11401,
			"z": 0.07851
		},
		{
			"x": 0.03717,
			"y": -0.107902,
			"z": 0.078509
		},
		{
			"x": 0.033588,
			"y": -0.110587,
			"z": 0.112337
		},
		{
			"x": 0.047331,
			"y": -0.116098,
			"z": 0.112337
		},
		{
			"x": -0.036351,
			"y": -0.107902,
			"z": 0.078508
		},
		{
			"x": -0.051579,
			"y": -0.11401,
			"z": 0.078508
		},
		{
			"x": -0.046509,
			"y": -0.116098,
			"z": 0.112336
		},
		{
			"x": -0.032766,
			"y": -0.110587,
			"z": 0.112336
		},
		{
			"x": 0.009927,
			"y": -0.146152,
			"z": -0.737112
		},
		{
			"x": 0.01167,
			"y": -0.156703,
			"z": -0.711216
		},
		{
			"x": -0.073116,
			"y": -0.140263,
			"z": 0.078508
		},
		{
			"x": -0.070611,
			"y": -0.150382,
			"z": 0.078508
		},
		{
			"x": -0.063687,
			"y": -0.14902,
			"z": 0.112337
		},
		{
			"x": -0.065946,
			"y": -0.1399,
			"z": 0.112336
		},
		{
			"x": -0.015585,
			"y": -0.124669,
			"z": -0.775617
		},
		{
			"x": -0.010905,
			"y": -0.12712,
			"z": -0.775617
		},
		{
			"x": -0.014517,
			"y": -0.136894,
			"z": -0.758646
		},
		{
			"x": -0.020694,
			"y": -0.13366,
			"z": -0.758646
		},
		{
			"x": 0.071424,
			"y": -0.150382,
			"z": 0.078509
		},
		{
			"x": 0.073929,
			"y": -0.140263,
			"z": 0.078509
		},
		{
			"x": 0.066762,
			"y": -0.1399,
			"z": 0.112337
		},
		{
			"x": 0.064503,
			"y": -0.14902,
			"z": 0.112338
		},
		{
			"x": -0.089709,
			"y": -0.154117,
			"z": -0.234129
		},
		{
			"x": -0.080391,
			"y": -0.166996,
			"z": -0.234129
		},
		{
			"x": -0.080898,
			"y": -0.167575,
			"z": -0.184303
		},
		{
			"x": -0.090276,
			"y": -0.154618,
			"z": -0.184303
		},
		{
			"x": -0.018012,
			"y": -0.143647,
			"z": -0.737112
		},
		{
			"x": 0.015312,
			"y": -0.136894,
			"z": -0.758646
		},
		{
			"x": 0.018807,
			"y": -0.143647,
			"z": -0.737112
		},
		{
			"x": -0.091326,
			"y": -0.138961,
			"z": -0.088015
		},
		{
			"x": -0.0882,
			"y": -0.151918,
			"z": -0.088015
		},
		{
			"x": -0.085461,
			"y": -0.151918,
			"z": -0.042479
		},
		{
			"x": -0.088488,
			"y": -0.139384,
			"z": -0.042479
		},
		{
			"x": 0.089004,
			"y": -0.151918,
			"z": -0.088014
		},
		{
			"x": 0.09213,
			"y": -0.138961,
			"z": -0.088014
		},
		{
			"x": 0.089295,
			"y": -0.139384,
			"z": -0.042479
		},
		{
			"x": 0.086268,
			"y": -0.151918,
			"z": -0.042479
		},
		{
			"x": -0.009132,
			"y": -0.097741,
			"z": -0.737112
		},
		{
			"x": -0.010872,
			"y": -0.099649,
			"z": -0.711216
		},
		{
			"x": 0.000399,
			"y": -0.098644,
			"z": -0.711216
		},
		{
			"x": 0.029208,
			"y": -0.11401,
			"z": -0.758649
		},
		{
			"x": 0.035961,
			"y": -0.115462,
			"z": -0.737112
		},
		{
			"x": -0.014517,
			"y": -0.101659,
			"z": -0.758649
		},
		{
			"x": -0.018012,
			"y": -0.100246,
			"z": -0.737112
		},
		{
			"x": -0.028413,
			"y": -0.11401,
			"z": -0.758649
		},
		{
			"x": -0.02943,
			"y": -0.119275,
			"z": -0.758649
		},
		{
			"x": -0.03642,
			"y": -0.121948,
			"z": -0.737112
		},
		{
			"x": -0.035166,
			"y": -0.115462,
			"z": -0.737112
		},
		{
			"x": -0.028413,
			"y": -0.12454,
			"z": -0.758649
		},
		{
			"x": -0.035166,
			"y": -0.128431,
			"z": -0.737112
		},
		{
			"x": 0.01167,
			"y": -0.099652,
			"z": -0.711216
		},
		{
			"x": -0.080466,
			"y": -0.166057,
			"z": -0.135441
		},
		{
			"x": -0.089796,
			"y": -0.153157,
			"z": -0.135441
		},
		{
			"x": 0.0906,
			"y": -0.153157,
			"z": -0.135441
		},
		{
			"x": 0.08127,
			"y": -0.166057,
			"z": -0.135441
		},
		{
			"x": 0.013338,
			"y": -0.164425,
			"z": -0.68121
		},
		{
			"x": 0.000399,
			"y": -0.165574,
			"z": -0.68121
		},
		{
			"x": -0.012543,
			"y": -0.164425,
			"z": -0.68121
		},
		{
			"x": -0.012543,
			"y": -0.09928,
			"z": -0.68121
		},
		{
			"x": 0.000399,
			"y": -0.098131,
			"z": -0.68121
		},
		{
			"x": 0.019437,
			"y": -0.103948,
			"z": 0.078508
		},
		{
			"x": 0.000408,
			"y": -0.102574,
			"z": 0.078508
		},
		{
			"x": 0.000411,
			"y": -0.105796,
			"z": 0.112336
		},
		{
			"x": 0.017586,
			"y": -0.107029,
			"z": 0.112337
		},
		{
			"x": -0.018621,
			"y": -0.103948,
			"z": 0.078508
		},
		{
			"x": -0.016764,
			"y": -0.107029,
			"z": 0.112336
		},
		{
			"x": 0.042846,
			"y": -0.184756,
			"z": 0.000729
		},
		{
			"x": 0.060423,
			"y": -0.176182,
			"z": 0.000729
		},
		{
			"x": 0.056784,
			"y": -0.172507,
			"z": 0.041188
		},
		{
			"x": 0.040272,
			"y": -0.180571,
			"z": 0.041188
		},
		{
			"x": 0.011697,
			"y": -0.12712,
			"z": -0.775617
		},
		{
			"x": -0.059613,
			"y": -0.176182,
			"z": 0.000728
		},
		{
			"x": -0.042036,
			"y": -0.184756,
			"z": 0.000729
		},
		{
			"x": -0.039459,
			"y": -0.180571,
			"z": 0.041188
		},
		{
			"x": -0.055971,
			"y": -0.172507,
			"z": 0.041187
		},
		{
			"x": -0.0882,
			"y": -0.126838,
			"z": -0.088015
		},
		{
			"x": -0.085461,
			"y": -0.127672,
			"z": -0.042479
		},
		{
			"x": 0.089004,
			"y": -0.126838,
			"z": -0.088014
		},
		{
			"x": 0.086268,
			"y": -0.127672,
			"z": -0.042479
		},
		{
			"x": 0.015312,
			"y": -0.101659,
			"z": -0.758649
		},
		{
			"x": 0.018807,
			"y": -0.100246,
			"z": -0.737112
		},
		{
			"x": 0.043944,
			"y": -0.128176,
			"z": -0.711216
		},
		{
			"x": 0.042462,
			"y": -0.13582,
			"z": -0.711216
		},
		{
			"x": 0.079842,
			"y": -0.115906,
			"z": -0.088014
		},
		{
			"x": 0.077388,
			"y": -0.117064,
			"z": -0.042478
		},
		{
			"x": -0.079035,
			"y": -0.115906,
			"z": -0.088015
		},
		{
			"x": -0.076578,
			"y": -0.117064,
			"z": -0.042479
		},
		{
			"x": -0.041667,
			"y": -0.13582,
			"z": -0.711216
		},
		{
			"x": -0.043149,
			"y": -0.128176,
			"z": -0.711216
		},
		{
			"x": -0.025434,
			"y": -0.129448,
			"z": -0.758649
		},
		{
			"x": -0.025638,
			"y": -0.139666,
			"z": -0.737112
		},
		{
			"x": -0.031488,
			"y": -0.134476,
			"z": -0.737112
		},
		{
			"x": 0.000408,
			"y": -0.178552,
			"z": 0.112337
		},
		{
			"x": 0.01758,
			"y": -0.177106,
			"z": 0.112338
		},
		{
			"x": 0.01551,
			"y": -0.173599,
			"z": 0.142344
		},
		{
			"x": 0.000408,
			"y": -0.17488,
			"z": 0.142344
		},
		{
			"x": 0.021489,
			"y": -0.13366,
			"z": -0.758646
		},
		{
			"x": 0.026229,
			"y": -0.129448,
			"z": -0.758649
		},
		{
			"x": 0.032283,
			"y": -0.134476,
			"z": -0.737112
		},
		{
			"x": 0.026433,
			"y": -0.139666,
			"z": -0.737112
		},
		{
			"x": 0.013338,
			"y": -0.09928,
			"z": -0.68121
		},
		{
			"x": -0.016767,
			"y": -0.177106,
			"z": 0.112337
		},
		{
			"x": -0.014694,
			"y": -0.173599,
			"z": 0.142344
		},
		{
			"x": -0.010905,
			"y": -0.100393,
			"z": -0.775617
		},
		{
			"x": 0.011697,
			"y": -0.100393,
			"z": -0.775617
		},
		{
			"x": 0.000399,
			"y": -0.173221,
			"z": -0.647382
		},
		{
			"x": -0.014139,
			"y": -0.17194,
			"z": -0.647382
		},
		{
			"x": -0.014139,
			"y": -0.099328,
			"z": -0.647385
		},
		{
			"x": 0.000399,
			"y": -0.098047,
			"z": -0.647385
		},
		{
			"x": 0.014937,
			"y": -0.17194,
			"z": -0.647382
		},
		{
			"x": -0.046536,
			"y": -0.187216,
			"z": -0.184303
		},
		{
			"x": -0.046287,
			"y": -0.185743,
			"z": -0.135441
		},
		{
			"x": 0.04734,
			"y": -0.187216,
			"z": -0.184302
		},
		{
			"x": 0.047091,
			"y": -0.185743,
			"z": -0.135441
		},
		{
			"x": 0.024144,
			"y": -0.189424,
			"z": -0.088014
		},
		{
			"x": 0.000402,
			"y": -0.191188,
			"z": -0.088015
		},
		{
			"x": 0.014937,
			"y": -0.099328,
			"z": -0.647382
		},
		{
			"x": -0.02334,
			"y": -0.189424,
			"z": -0.088015
		},
		{
			"x": 0.047328,
			"y": -0.166333,
			"z": 0.112338
		},
		{
			"x": 0.057873,
			"y": -0.158071,
			"z": 0.112338
		},
		{
			"x": 0.050943,
			"y": -0.15679,
			"z": 0.142344
		},
		{
			"x": 0.04167,
			"y": -0.164065,
			"z": 0.142344
		},
		{
			"x": -0.057057,
			"y": -0.158071,
			"z": 0.112337
		},
		{
			"x": -0.046512,
			"y": -0.166333,
			"z": 0.112337
		},
		{
			"x": -0.040851,
			"y": -0.164065,
			"z": 0.142343
		},
		{
			"x": -0.050124,
			"y": -0.15679,
			"z": 0.142343
		},
		{
			"x": 0.042462,
			"y": -0.120532,
			"z": -0.711216
		},
		{
			"x": -0.041667,
			"y": -0.120532,
			"z": -0.711216
		},
		{
			"x": 0.022374,
			"y": -0.096664,
			"z": 0.000727
		},
		{
			"x": 0.000405,
			"y": -0.095014,
			"z": 0.000727
		},
		{
			"x": 0.000408,
			"y": -0.097072,
			"z": 0.041186
		},
		{
			"x": 0.021045,
			"y": -0.098605,
			"z": 0.041186
		},
		{
			"x": -0.021561,
			"y": -0.096664,
			"z": 0.000727
		},
		{
			"x": -0.020229,
			"y": -0.098605,
			"z": 0.041185
		},
		{
			"x": 0.000405,
			"y": -0.191956,
			"z": 0.000729
		},
		{
			"x": 0.022374,
			"y": -0.190129,
			"z": 0.000729
		},
		{
			"x": 0.021042,
			"y": -0.185659,
			"z": 0.041188
		},
		{
			"x": 0.000405,
			"y": -0.187393,
			"z": 0.041188
		},
		{
			"x": 0.000399,
			"y": -0.180469,
			"z": -0.610059
		},
		{
			"x": -0.01566,
			"y": -0.179068,
			"z": -0.610059
		},
		{
			"x": 0.016458,
			"y": -0.179068,
			"z": -0.610059
		},
		{
			"x": -0.021564,
			"y": -0.190129,
			"z": 0.000729
		},
		{
			"x": -0.020229,
			"y": -0.185659,
			"z": 0.041188
		},
		{
			"x": 0.000399,
			"y": -0.098287,
			"z": -0.610062
		},
		{
			"x": 0.016458,
			"y": -0.099688,
			"z": -0.610062
		},
		{
			"x": -0.01566,
			"y": -0.099688,
			"z": -0.610062
		},
		{
			"x": -0.065565,
			"y": -0.178054,
			"z": -0.234129
		},
		{
			"x": -0.065979,
			"y": -0.178723,
			"z": -0.184303
		},
		{
			"x": -0.021375,
			"y": -0.153751,
			"z": -0.711216
		},
		{
			"x": 0.066366,
			"y": -0.178054,
			"z": -0.234129
		},
		{
			"x": 0.066783,
			"y": -0.178723,
			"z": -0.184302
		},
		{
			"x": 0.022173,
			"y": -0.153751,
			"z": -0.711216
		},
		{
			"x": 0.021489,
			"y": -0.10489,
			"z": -0.758649
		},
		{
			"x": 0.026433,
			"y": -0.104227,
			"z": -0.737112
		},
		{
			"x": -0.020694,
			"y": -0.10489,
			"z": -0.758649
		},
		{
			"x": -0.025638,
			"y": -0.104227,
			"z": -0.737112
		},
		{
			"x": 0.026229,
			"y": -0.109105,
			"z": -0.758649
		},
		{
			"x": 0.032283,
			"y": -0.109417,
			"z": -0.737112
		},
		{
			"x": -0.025434,
			"y": -0.109105,
			"z": -0.758649
		},
		{
			"x": -0.031488,
			"y": -0.109417,
			"z": -0.737112
		},
		{
			"x": 0.022173,
			"y": -0.102601,
			"z": -0.711216
		},
		{
			"x": -0.046242,
			"y": -0.186517,
			"z": -0.234129
		},
		{
			"x": -0.021375,
			"y": -0.102601,
			"z": -0.711216
		},
		{
			"x": 0.047046,
			"y": -0.186517,
			"z": -0.234128
		},
		{
			"x": 0.000414,
			"y": -0.11059,
			"z": 0.142343
		},
		{
			"x": 0.015516,
			"y": -0.111658,
			"z": 0.142343
		},
		{
			"x": -0.014691,
			"y": -0.111658,
			"z": 0.142343
		},
		{
			"x": 0.01638,
			"y": -0.102847,
			"z": -0.775617
		},
		{
			"x": 0.000402,
			"y": -0.193624,
			"z": -0.234129
		},
		{
			"x": 0.024546,
			"y": -0.191821,
			"z": -0.234128
		},
		{
			"x": 0.019434,
			"y": -0.181534,
			"z": 0.07851
		},
		{
			"x": 0.000405,
			"y": -0.183112,
			"z": 0.07851
		},
		{
			"x": -0.018624,
			"y": -0.181534,
			"z": 0.078509
		},
		{
			"x": 0.000402,
			"y": -0.091132,
			"z": -0.135442
		},
		{
			"x": -0.023766,
			"y": -0.092857,
			"z": -0.135442
		},
		{
			"x": -0.023337,
			"y": -0.094294,
			"z": -0.088015
		},
		{
			"x": 0.000402,
			"y": -0.092626,
			"z": -0.088015
		},
		{
			"x": 0.02457,
			"y": -0.092857,
			"z": -0.135442
		},
		{
			"x": 0.024144,
			"y": -0.094294,
			"z": -0.088015
		},
		{
			"x": -0.070608,
			"y": -0.130606,
			"z": 0.078508
		},
		{
			"x": -0.063684,
			"y": -0.131149,
			"z": 0.112336
		},
		{
			"x": 0.071424,
			"y": -0.130606,
			"z": 0.078509
		},
		{
			"x": 0.064503,
			"y": -0.131149,
			"z": 0.112337
		},
		{
			"x": -0.017103,
			"y": -0.096685,
			"z": -0.569604
		},
		{
			"x": 0.000399,
			"y": -0.095179,
			"z": -0.569604
		},
		{
			"x": 0.017901,
			"y": -0.096685,
			"z": -0.569604
		},
		{
			"x": 0.017901,
			"y": -0.182071,
			"z": -0.569601
		},
		{
			"x": 0.000399,
			"y": -0.183577,
			"z": -0.569601
		},
		{
			"x": -0.017103,
			"y": -0.182071,
			"z": -0.569601
		},
		{
			"x": -0.023745,
			"y": -0.191818,
			"z": -0.234129
		},
		{
			"x": 0.000399,
			"y": -0.186259,
			"z": -0.526395
		},
		{
			"x": -0.018459,
			"y": -0.18466,
			"z": -0.526398
		},
		{
			"x": 0.019257,
			"y": -0.18466,
			"z": -0.526398
		},
		{
			"x": 0.031191,
			"y": -0.149059,
			"z": -0.711216
		},
		{
			"x": 0.050052,
			"y": -0.14158,
			"z": 0.168239
		},
		{
			"x": 0.04836,
			"y": -0.134575,
			"z": 0.168239
		},
		{
			"x": 0.039396,
			"y": -0.136549,
			"z": 0.189775
		},
		{
			"x": 0.04077,
			"y": -0.142204,
			"z": 0.189775
		},
		{
			"x": -0.049602,
			"y": -0.131854,
			"z": -0.68121
		},
		{
			"x": -0.047898,
			"y": -0.123124,
			"z": -0.68121
		},
		{
			"x": 0.048696,
			"y": -0.123124,
			"z": -0.68121
		},
		{
			"x": 0.0504,
			"y": -0.131854,
			"z": -0.68121
		},
		{
			"x": 0.025398,
			"y": -0.102649,
			"z": -0.68121
		},
		{
			"x": -0.047898,
			"y": -0.140581,
			"z": -0.68121
		},
		{
			"x": 0.048696,
			"y": -0.140581,
			"z": -0.68121
		},
		{
			"x": -0.079035,
			"y": -0.164626,
			"z": -0.088015
		},
		{
			"x": 0.029589,
			"y": -0.114754,
			"z": 0.142344
		},
		{
			"x": 0.041673,
			"y": -0.119581,
			"z": 0.142344
		},
		{
			"x": -0.040848,
			"y": -0.119581,
			"z": 0.142343
		},
		{
			"x": -0.028764,
			"y": -0.114754,
			"z": 0.142343
		},
		{
			"x": -0.030396,
			"y": -0.149059,
			"z": -0.711216
		},
		{
			"x": -0.018459,
			"y": -0.094096,
			"z": -0.526398
		},
		{
			"x": 0.000399,
			"y": -0.0925,
			"z": -0.526398
		},
		{
			"x": 0.019257,
			"y": -0.094096,
			"z": -0.526398
		},
		{
			"x": -0.053859,
			"y": -0.145363,
			"z": -0.647382
		},
		{
			"x": -0.055773,
			"y": -0.135634,
			"z": -0.647382
		},
		{
			"x": 0.056568,
			"y": -0.135634,
			"z": -0.647382
		},
		{
			"x": 0.054654,
			"y": -0.145363,
			"z": -0.647382
		},
		{
			"x": -0.022605,
			"y": -0.095851,
			"z": -0.04248
		},
		{
			"x": 0.000405,
			"y": -0.094201,
			"z": -0.04248
		},
		{
			"x": 0.052395,
			"y": -0.169675,
			"z": 0.078509
		},
		{
			"x": 0.064077,
			"y": -0.160495,
			"z": 0.078509
		},
		{
			"x": -0.063264,
			"y": -0.160495,
			"z": 0.078508
		},
		{
			"x": -0.051582,
			"y": -0.169675,
			"z": 0.078509
		},
		{
			"x": 0.023412,
			"y": -0.095851,
			"z": -0.042479
		},
		{
			"x": 0.000402,
			"y": -0.090022,
			"z": -0.184303
		},
		{
			"x": -0.023895,
			"y": -0.091792,
			"z": -0.184303
		},
		{
			"x": 0.024699,
			"y": -0.091792,
			"z": -0.184303
		},
		{
			"x": 0.020517,
			"y": -0.091942,
			"z": -0.480864
		},
		{
			"x": 0.000399,
			"y": -0.090271,
			"z": -0.480864
		},
		{
			"x": 0.000399,
			"y": -0.088513,
			"z": -0.433437
		},
		{
			"x": 0.02166,
			"y": -0.090247,
			"z": -0.433437
		},
		{
			"x": -0.019716,
			"y": -0.091942,
			"z": -0.480864
		},
		{
			"x": -0.020859,
			"y": -0.090247,
			"z": -0.433437
		},
		{
			"x": 0.079842,
			"y": -0.164626,
			"z": -0.088014
		},
		{
			"x": 0.031191,
			"y": -0.107293,
			"z": -0.711216
		},
		{
			"x": 0.054654,
			"y": -0.125905,
			"z": -0.647382
		},
		{
			"x": -0.053859,
			"y": -0.125905,
			"z": -0.647382
		},
		{
			"x": -0.023334,
			"y": -0.190729,
			"z": -0.284439
		},
		{
			"x": 0.000402,
			"y": -0.192541,
			"z": -0.284439
		},
		{
			"x": 0.000399,
			"y": -0.188491,
			"z": -0.480861
		},
		{
			"x": -0.019716,
			"y": -0.186817,
			"z": -0.480861
		},
		{
			"x": 0.056772,
			"y": -0.148807,
			"z": 0.142344
		},
		{
			"x": 0.020517,
			"y": -0.186817,
			"z": -0.480861
		},
		{
			"x": -0.055953,
			"y": -0.148807,
			"z": 0.142343
		},
		{
			"x": -0.037314,
			"y": -0.142942,
			"z": -0.711216
		},
		{
			"x": -0.024603,
			"y": -0.102649,
			"z": -0.68121
		},
		{
			"x": 0.000399,
			"y": -0.190249,
			"z": -0.433437
		},
		{
			"x": 0.02166,
			"y": -0.188515,
			"z": -0.433437
		},
		{
			"x": 0.022662,
			"y": -0.189739,
			"z": -0.384573
		},
		{
			"x": 0.000402,
			"y": -0.191518,
			"z": -0.384573
		},
		{
			"x": -0.020859,
			"y": -0.188515,
			"z": -0.433437
		},
		{
			"x": -0.021861,
			"y": -0.189739,
			"z": -0.384573
		},
		{
			"x": -0.030396,
			"y": -0.107293,
			"z": -0.711216
		},
		{
			"x": 0.000402,
			"y": -0.086227,
			"z": -0.28444
		},
		{
			"x": -0.023334,
			"y": -0.088036,
			"z": -0.28444
		},
		{
			"x": -0.023745,
			"y": -0.08962,
			"z": -0.23413
		},
		{
			"x": 0.000402,
			"y": -0.08782,
			"z": -0.23413
		},
		{
			"x": 0.024135,
			"y": -0.190729,
			"z": -0.284439
		},
		{
			"x": 0.038112,
			"y": -0.142942,
			"z": -0.711216
		},
		{
			"x": 0.024546,
			"y": -0.08962,
			"z": -0.23413
		},
		{
			"x": 0.057876,
			"y": -0.123097,
			"z": 0.112338
		},
		{
			"x": 0.050946,
			"y": -0.125758,
			"z": 0.142344
		},
		{
			"x": 0.000402,
			"y": -0.192283,
			"z": -0.334749
		},
		{
			"x": 0.023499,
			"y": -0.19048,
			"z": -0.334749
		},
		{
			"x": 0.000402,
			"y": -0.087247,
			"z": -0.384576
		},
		{
			"x": -0.021861,
			"y": -0.089023,
			"z": -0.384576
		},
		{
			"x": -0.022695,
			"y": -0.088285,
			"z": -0.334752
		},
		{
			"x": 0.000402,
			"y": -0.086482,
			"z": -0.334749
		},
		{
			"x": -0.024603,
			"y": -0.161059,
			"z": -0.68121
		},
		{
			"x": -0.027687,
			"y": -0.168184,
			"z": -0.647382
		},
		{
			"x": -0.057054,
			"y": -0.123097,
			"z": 0.112336
		},
		{
			"x": -0.050121,
			"y": -0.125758,
			"z": 0.142343
		},
		{
			"x": 0.023499,
			"y": -0.088285,
			"z": -0.334749
		},
		{
			"x": 0.024135,
			"y": -0.088039,
			"z": -0.28444
		},
		{
			"x": 0.037167,
			"y": -0.176923,
			"z": 0.07851
		},
		{
			"x": 0.033585,
			"y": -0.172903,
			"z": 0.112338
		},
		{
			"x": -0.036354,
			"y": -0.176923,
			"z": 0.078509
		},
		{
			"x": -0.032769,
			"y": -0.172903,
			"z": 0.112337
		},
		{
			"x": 0.025398,
			"y": -0.161059,
			"z": -0.68121
		},
		{
			"x": 0.028485,
			"y": -0.168184,
			"z": -0.647382
		},
		{
			"x": -0.047541,
			"y": -0.134575,
			"z": 0.168238
		},
		{
			"x": -0.049233,
			"y": -0.14158,
			"z": 0.168238
		},
		{
			"x": -0.039954,
			"y": -0.142204,
			"z": 0.189774
		},
		{
			"x": -0.038577,
			"y": -0.136549,
			"z": 0.189774
		},
		{
			"x": -0.022695,
			"y": -0.19048,
			"z": -0.334749
		},
		{
			"x": 0.022662,
			"y": -0.089023,
			"z": -0.384576
		},
		{
			"x": 0.06408,
			"y": -0.121735,
			"z": 0.07851
		},
		{
			"x": 0.029583,
			"y": -0.16987,
			"z": 0.142344
		},
		{
			"x": -0.063264,
			"y": -0.121735,
			"z": 0.078508
		},
		{
			"x": -0.034959,
			"y": -0.155698,
			"z": -0.68121
		},
		{
			"x": -0.037314,
			"y": -0.11341,
			"z": -0.711216
		},
		{
			"x": -0.028767,
			"y": -0.16987,
			"z": 0.142343
		},
		{
			"x": -0.057942,
			"y": -0.140707,
			"z": 0.142343
		},
		{
			"x": 0.058761,
			"y": -0.140707,
			"z": 0.142343
		},
		{
			"x": 0.035754,
			"y": -0.155698,
			"z": -0.68121
		},
		{
			"x": 0.038112,
			"y": -0.11341,
			"z": -0.711216
		},
		{
			"x": -0.059535,
			"y": -0.150013,
			"z": -0.610062
		},
		{
			"x": -0.06165,
			"y": -0.139378,
			"z": -0.610062
		},
		{
			"x": 0.062448,
			"y": -0.139378,
			"z": -0.610059
		},
		{
			"x": 0.060333,
			"y": -0.150013,
			"z": -0.610059
		},
		{
			"x": -0.042903,
			"y": -0.148714,
			"z": -0.68121
		},
		{
			"x": -0.059535,
			"y": -0.128743,
			"z": -0.610062
		},
		{
			"x": 0.060333,
			"y": -0.128743,
			"z": -0.610059
		},
		{
			"x": 0.000414,
			"y": -0.114712,
			"z": 0.168239
		},
		{
			"x": -0.012435,
			"y": -0.115648,
			"z": 0.168239
		},
		{
			"x": -0.010035,
			"y": -0.121372,
			"z": 0.189775
		},
		{
			"x": 0.000411,
			"y": -0.120634,
			"z": 0.189776
		},
		{
			"x": 0.01326,
			"y": -0.115648,
			"z": 0.168239
		},
		{
			"x": 0.01086,
			"y": -0.121372,
			"z": 0.189776
		},
		{
			"x": -0.027687,
			"y": -0.103081,
			"z": -0.647385
		},
		{
			"x": 0.028485,
			"y": -0.103081,
			"z": -0.647382
		},
		{
			"x": -0.042033,
			"y": -0.101404,
			"z": 0.000727
		},
		{
			"x": -0.039456,
			"y": -0.103012,
			"z": 0.041185
		},
		{
			"x": -0.034959,
			"y": -0.108007,
			"z": -0.68121
		},
		{
			"x": 0.042846,
			"y": -0.101404,
			"z": 0.000728
		},
		{
			"x": 0.040275,
			"y": -0.103012,
			"z": 0.041187
		},
		{
			"x": -0.042903,
			"y": -0.114991,
			"z": -0.68121
		},
		{
			"x": 0.035754,
			"y": -0.108007,
			"z": -0.68121
		},
		{
			"x": 0.043701,
			"y": -0.148714,
			"z": -0.68121
		},
		{
			"x": 0.065718,
			"y": -0.127939,
			"z": -0.569601
		},
		{
			"x": 0.068022,
			"y": -0.139378,
			"z": -0.569601
		},
		{
			"x": 0.065718,
			"y": -0.150817,
			"z": -0.569601
		},
		{
			"x": 0.043701,
			"y": -0.114991,
			"z": -0.68121
		},
		{
			"x": -0.030624,
			"y": -0.103792,
			"z": -0.610062
		},
		{
			"x": -0.065628,
			"y": -0.177235,
			"z": -0.135441
		},
		{
			"x": 0.04836,
			"y": -0.148831,
			"z": 0.168239
		},
		{
			"x": 0.039396,
			"y": -0.148021,
			"z": 0.189775
		},
		{
			"x": -0.067224,
			"y": -0.139378,
			"z": -0.569604
		},
		{
			"x": -0.064917,
			"y": -0.150817,
			"z": -0.569601
		},
		{
			"x": -0.069981,
			"y": -0.151513,
			"z": -0.526398
		},
		{
			"x": -0.072462,
			"y": -0.139378,
			"z": -0.526398
		},
		{
			"x": 0.066429,
			"y": -0.177235,
			"z": -0.135441
		},
		{
			"x": 0.031425,
			"y": -0.103792,
			"z": -0.610062
		},
		{
			"x": 0.056772,
			"y": -0.132913,
			"z": 0.142343
		},
		{
			"x": -0.064917,
			"y": -0.127939,
			"z": -0.569604
		},
		{
			"x": -0.069981,
			"y": -0.127246,
			"z": -0.526398
		},
		{
			"x": -0.045462,
			"y": -0.184183,
			"z": -0.088015
		},
		{
			"x": 0.046266,
			"y": -0.184183,
			"z": -0.088014
		},
		{
			"x": -0.030624,
			"y": -0.174964,
			"z": -0.610059
		},
		{
			"x": 0.085284,
			"y": -0.140278,
			"z": 0.000728
		},
		{
			"x": 0.082395,
			"y": -0.128581,
			"z": 0.000729
		},
		{
			"x": 0.077421,
			"y": -0.128335,
			"z": 0.041188
		},
		{
			"x": 0.080136,
			"y": -0.139198,
			"z": 0.041187
		},
		{
			"x": 0.031425,
			"y": -0.174964,
			"z": -0.610059
		},
		{
			"x": -0.081582,
			"y": -0.128581,
			"z": 0.000727
		},
		{
			"x": -0.084474,
			"y": -0.140278,
			"z": 0.000727
		},
		{
			"x": -0.079323,
			"y": -0.139198,
			"z": 0.041186
		},
		{
			"x": -0.076605,
			"y": -0.128335,
			"z": 0.041186
		},
		{
			"x": -0.092889,
			"y": -0.140365,
			"z": -0.234129
		},
		{
			"x": -0.093477,
			"y": -0.14095,
			"z": -0.184303
		},
		{
			"x": 0.09369,
			"y": -0.140365,
			"z": -0.234129
		},
		{
			"x": 0.094278,
			"y": -0.14095,
			"z": -0.184302
		},
		{
			"x": 0.073914,
			"y": -0.165127,
			"z": 0.000729
		},
		{
			"x": 0.069456,
			"y": -0.162184,
			"z": 0.041188
		},
		{
			"x": -0.073104,
			"y": -0.165127,
			"z": 0.000728
		},
		{
			"x": -0.068643,
			"y": -0.162184,
			"z": 0.041187
		},
		{
			"x": -0.047541,
			"y": -0.148831,
			"z": 0.168238
		},
		{
			"x": -0.038577,
			"y": -0.148021,
			"z": 0.189775
		},
		{
			"x": -0.055953,
			"y": -0.132913,
			"z": 0.142343
		},
		{
			"x": 0.000408,
			"y": -0.171877,
			"z": 0.168239
		},
		{
			"x": 0.013257,
			"y": -0.17074,
			"z": 0.168239
		},
		{
			"x": 0.010854,
			"y": -0.165277,
			"z": 0.189775
		},
		{
			"x": 0.000408,
			"y": -0.166168,
			"z": 0.189775
		},
		{
			"x": -0.012441,
			"y": -0.17074,
			"z": 0.168239
		},
		{
			"x": -0.010038,
			"y": -0.165277,
			"z": 0.189775
		},
		{
			"x": 0.040116,
			"y": -0.109054,
			"z": -0.647382
		},
		{
			"x": 0.09378,
			"y": -0.139795,
			"z": -0.135441
		},
		{
			"x": -0.092976,
			"y": -0.139795,
			"z": -0.135442
		},
		{
			"x": 0.073263,
			"y": -0.139378,
			"z": -0.526398
		},
		{
			"x": 0.070779,
			"y": -0.151513,
			"z": -0.526398
		},
		{
			"x": -0.042579,
			"y": -0.128152,
			"z": 0.168238
		},
		{
			"x": -0.034545,
			"y": -0.131365,
			"z": 0.189774
		},
		{
			"x": 0.034209,
			"y": -0.101101,
			"z": -0.569604
		},
		{
			"x": 0.034209,
			"y": -0.177655,
			"z": -0.569601
		},
		{
			"x": 0.070779,
			"y": -0.127246,
			"z": -0.526398
		},
		{
			"x": 0.040116,
			"y": -0.162211,
			"z": -0.647382
		},
		{
			"x": -0.039321,
			"y": -0.109054,
			"z": -0.647385
		},
		{
			"x": -0.033411,
			"y": -0.101101,
			"z": -0.569604
		},
		{
			"x": -0.033411,
			"y": -0.177655,
			"z": -0.569601
		},
		{
			"x": -0.039321,
			"y": -0.162211,
			"z": -0.647382
		},
		{
			"x": 0.060426,
			"y": -0.108709,
			"z": 0.000729
		},
		{
			"x": 0.056787,
			"y": -0.10981,
			"z": 0.041188
		},
		{
			"x": -0.05961,
			"y": -0.108709,
			"z": 0.000727
		},
		{
			"x": -0.055968,
			"y": -0.10981,
			"z": 0.041186
		},
		{
			"x": 0.043401,
			"y": -0.128152,
			"z": 0.168239
		},
		{
			"x": 0.035364,
			"y": -0.131365,
			"z": 0.189775
		},
		{
			"x": 0.049044,
			"y": -0.154426,
			"z": -0.647382
		},
		{
			"x": 0.049044,
			"y": -0.116839,
			"z": -0.647382
		},
		{
			"x": -0.073101,
			"y": -0.117943,
			"z": 0.000727
		},
		{
			"x": -0.06864,
			"y": -0.11842,
			"z": 0.041186
		},
		{
			"x": 0.073917,
			"y": -0.117943,
			"z": 0.000729
		},
		{
			"x": 0.069459,
			"y": -0.11842,
			"z": 0.041188
		},
		{
			"x": 0.075474,
			"y": -0.12667,
			"z": -0.480864
		},
		{
			"x": 0.078123,
			"y": -0.139381,
			"z": -0.480864
		},
		{
			"x": -0.077322,
			"y": -0.139381,
			"z": -0.480864
		},
		{
			"x": -0.074676,
			"y": -0.12667,
			"z": -0.480864
		},
		{
			"x": 0.082392,
			"y": -0.15271,
			"z": 0.000729
		},
		{
			"x": 0.077421,
			"y": -0.150685,
			"z": 0.041188
		},
		{
			"x": -0.081582,
			"y": -0.15271,
			"z": 0.000728
		},
		{
			"x": -0.076608,
			"y": -0.150685,
			"z": 0.041187
		},
		{
			"x": 0.000402,
			"y": -0.190996,
			"z": -0.042479
		},
		{
			"x": -0.022605,
			"y": -0.189205,
			"z": -0.042479
		},
		{
			"x": 0.023409,
			"y": -0.189205,
			"z": -0.042479
		},
		{
			"x": 0.075474,
			"y": -0.152089,
			"z": -0.480864
		},
		{
			"x": -0.074676,
			"y": -0.152089,
			"z": -0.480864
		},
		{
			"x": -0.048246,
			"y": -0.116839,
			"z": -0.647382
		},
		{
			"x": -0.048246,
			"y": -0.154426,
			"z": -0.647382
		},
		{
			"x": 0.065265,
			"y": -0.106495,
			"z": -0.088014
		},
		{
			"x": 0.063261,
			"y": -0.107869,
			"z": -0.042479
		},
		{
			"x": -0.064458,
			"y": -0.106495,
			"z": -0.088015
		},
		{
			"x": -0.062454,
			"y": -0.107869,
			"z": -0.04248
		},
		{
			"x": -0.091305,
			"y": -0.139384,
			"z": -0.28444
		},
		{
			"x": -0.088179,
			"y": -0.153142,
			"z": -0.284439
		},
		{
			"x": 0.088983,
			"y": -0.153142,
			"z": -0.284439
		},
		{
			"x": 0.092106,
			"y": -0.139384,
			"z": -0.284439
		},
		{
			"x": 0.079737,
			"y": -0.126214,
			"z": -0.433437
		},
		{
			"x": 0.082536,
			"y": -0.139381,
			"z": -0.433437
		},
		{
			"x": 0.079737,
			"y": -0.152545,
			"z": -0.433437
		},
		{
			"x": 0.036831,
			"y": -0.098779,
			"z": -0.526398
		},
		{
			"x": -0.036033,
			"y": -0.179977,
			"z": -0.526398
		},
		{
			"x": 0.036831,
			"y": -0.179977,
			"z": -0.526398
		},
		{
			"x": -0.036033,
			"y": -0.098779,
			"z": -0.526398
		},
		{
			"x": 0.046266,
			"y": -0.099088,
			"z": -0.088015
		},
		{
			"x": 0.04485,
			"y": -0.100588,
			"z": -0.042479
		},
		{
			"x": -0.043476,
			"y": -0.168433,
			"z": -0.610059
		},
		{
			"x": -0.045462,
			"y": -0.099088,
			"z": -0.088015
		},
		{
			"x": -0.044043,
			"y": -0.100588,
			"z": -0.04248
		},
		{
			"x": 0.044274,
			"y": -0.168433,
			"z": -0.610059
		},
		{
			"x": 0.046254,
			"y": -0.185419,
			"z": -0.284439
		},
		{
			"x": -0.043476,
			"y": -0.110323,
			"z": -0.610062
		},
		{
			"x": 0.044274,
			"y": -0.110323,
			"z": -0.610062
		},
		{
			"x": -0.045453,
			"y": -0.185419,
			"z": -0.284439
		},
		{
			"x": -0.078936,
			"y": -0.152545,
			"z": -0.433437
		},
		{
			"x": -0.081735,
			"y": -0.139381,
			"z": -0.433437
		},
		{
			"x": -0.078936,
			"y": -0.126214,
			"z": -0.433437
		},
		{
			"x": 0.000411,
			"y": -0.127549,
			"z": 0.206744
		},
		{
			"x": -0.007518,
			"y": -0.12805,
			"z": 0.206745
		},
		{
			"x": -0.004923,
			"y": -0.133384,
			"z": 0.218983
		},
		{
			"x": 0.000408,
			"y": -0.133072,
			"z": 0.218983
		},
		{
			"x": 0.00834,
			"y": -0.12805,
			"z": 0.206745
		},
		{
			"x": 0.005739,
			"y": -0.133384,
			"z": 0.218983
		},
		{
			"x": 0.039261,
			"y": -0.09685,
			"z": -0.480864
		},
		{
			"x": -0.03846,
			"y": -0.09685,
			"z": -0.480864
		},
		{
			"x": 0.086412,
			"y": -0.139381,
			"z": -0.384576
		},
		{
			"x": 0.083481,
			"y": -0.152875,
			"z": -0.384576
		},
		{
			"x": -0.08268,
			"y": -0.152875,
			"z": -0.384576
		},
		{
			"x": -0.085611,
			"y": -0.139381,
			"z": -0.384576
		},
		{
			"x": -0.053337,
			"y": -0.159922,
			"z": -0.610059
		},
		{
			"x": 0.083481,
			"y": -0.125887,
			"z": -0.384576
		},
		{
			"x": -0.08268,
			"y": -0.125887,
			"z": -0.384576
		},
		{
			"x": -0.03846,
			"y": -0.181912,
			"z": -0.480864
		},
		{
			"x": 0.039261,
			"y": -0.181912,
			"z": -0.480861
		},
		{
			"x": -0.053337,
			"y": -0.118831,
			"z": -0.610062
		},
		{
			"x": 0.08964,
			"y": -0.139381,
			"z": -0.334749
		},
		{
			"x": 0.086601,
			"y": -0.153073,
			"z": -0.334749
		},
		{
			"x": 0.086601,
			"y": -0.125689,
			"z": -0.334749
		},
		{
			"x": 0.047091,
			"y": -0.097846,
			"z": -0.135442
		},
		{
			"x": -0.046287,
			"y": -0.097846,
			"z": -0.135442
		},
		{
			"x": 0.054135,
			"y": -0.159922,
			"z": -0.610059
		},
		{
			"x": 0.065262,
			"y": -0.17572,
			"z": -0.088014
		},
		{
			"x": -0.064458,
			"y": -0.17572,
			"z": -0.088015
		},
		{
			"x": -0.085797,
			"y": -0.153073,
			"z": -0.334749
		},
		{
			"x": -0.088839,
			"y": -0.139381,
			"z": -0.334749
		},
		{
			"x": 0.054135,
			"y": -0.118831,
			"z": -0.610062
		},
		{
			"x": -0.085797,
			"y": -0.125689,
			"z": -0.334749
		},
		{
			"x": -0.088179,
			"y": -0.125626,
			"z": -0.28444
		},
		{
			"x": 0.088983,
			"y": -0.125626,
			"z": -0.284439
		},
		{
			"x": -0.040668,
			"y": -0.183433,
			"z": -0.433437
		},
		{
			"x": 0.041469,
			"y": -0.183433,
			"z": -0.433437
		},
		{
			"x": -0.04422,
			"y": -0.093568,
			"z": -0.334749
		},
		{
			"x": -0.045453,
			"y": -0.093349,
			"z": -0.28444
		},
		{
			"x": -0.040668,
			"y": -0.095329,
			"z": -0.433437
		},
		{
			"x": 0.041469,
			"y": -0.095329,
			"z": -0.433437
		},
		{
			"x": 0.045021,
			"y": -0.093568,
			"z": -0.334749
		},
		{
			"x": 0.046254,
			"y": -0.093349,
			"z": -0.28444
		},
		{
			"x": 0.043407,
			"y": -0.184531,
			"z": -0.384573
		},
		{
			"x": 0.045021,
			"y": -0.185194,
			"z": -0.334749
		},
		{
			"x": -0.042606,
			"y": -0.184531,
			"z": -0.384576
		},
		{
			"x": -0.04422,
			"y": -0.185194,
			"z": -0.334749
		},
		{
			"x": -0.042606,
			"y": -0.094231,
			"z": -0.384576
		},
		{
			"x": 0.043407,
			"y": -0.094231,
			"z": -0.384576
		},
		{
			"x": 0.035514,
			"y": -0.122641,
			"z": 0.168239
		},
		{
			"x": 0.02895,
			"y": -0.126934,
			"z": 0.189775
		},
		{
			"x": -0.047418,
			"y": -0.108127,
			"z": -0.569604
		},
		{
			"x": 0.025233,
			"y": -0.118366,
			"z": 0.168239
		},
		{
			"x": 0.020592,
			"y": -0.123526,
			"z": 0.189776
		},
		{
			"x": 0.048216,
			"y": -0.108127,
			"z": -0.569604
		},
		{
			"x": -0.046536,
			"y": -0.096934,
			"z": -0.184303
		},
		{
			"x": 0.04734,
			"y": -0.096934,
			"z": -0.184303
		},
		{
			"x": -0.024408,
			"y": -0.118366,
			"z": 0.168239
		},
		{
			"x": -0.01977,
			"y": -0.123526,
			"z": 0.189775
		},
		{
			"x": -0.034692,
			"y": -0.122641,
			"z": 0.168238
		},
		{
			"x": -0.028128,
			"y": -0.126934,
			"z": 0.189775
		},
		{
			"x": -0.047418,
			"y": -0.170632,
			"z": -0.569601
		},
		{
			"x": 0.048216,
			"y": -0.170632,
			"z": -0.569601
		},
		{
			"x": 0.090513,
			"y": -0.126724,
			"z": -0.234129
		},
		{
			"x": -0.089709,
			"y": -0.126724,
			"z": -0.23413
		},
		{
			"x": 0.065247,
			"y": -0.176971,
			"z": -0.284439
		},
		{
			"x": -0.064446,
			"y": -0.176971,
			"z": -0.284439
		},
		{
			"x": -0.058164,
			"y": -0.161476,
			"z": -0.569601
		},
		{
			"x": 0.047046,
			"y": -0.094885,
			"z": -0.23413
		},
		{
			"x": -0.046242,
			"y": -0.094885,
			"z": -0.23413
		},
		{
			"x": -0.058164,
			"y": -0.11728,
			"z": -0.569604
		},
		{
			"x": 0.058962,
			"y": -0.161476,
			"z": -0.569601
		},
		{
			"x": 0.079821,
			"y": -0.165961,
			"z": -0.284439
		},
		{
			"x": -0.07902,
			"y": -0.165961,
			"z": -0.284439
		},
		{
			"x": 0.058962,
			"y": -0.11728,
			"z": -0.569601
		},
		{
			"x": 0.077388,
			"y": -0.164395,
			"z": -0.042479
		},
		{
			"x": 0.051921,
			"y": -0.172528,
			"z": -0.526398
		},
		{
			"x": -0.051123,
			"y": -0.172528,
			"z": -0.526398
		},
		{
			"x": -0.051123,
			"y": -0.106231,
			"z": -0.526398
		},
		{
			"x": 0.051921,
			"y": -0.106231,
			"z": -0.526398
		},
		{
			"x": -0.076581,
			"y": -0.164395,
			"z": -0.042479
		},
		{
			"x": 0.063501,
			"y": -0.16282,
			"z": -0.526398
		},
		{
			"x": 0.063501,
			"y": -0.115939,
			"z": -0.526398
		},
		{
			"x": -0.054558,
			"y": -0.174106,
			"z": -0.480864
		},
		{
			"x": 0.055359,
			"y": -0.174106,
			"z": -0.480861
		},
		{
			"x": 0.0906,
			"y": -0.127087,
			"z": -0.135441
		},
		{
			"x": -0.089796,
			"y": -0.127087,
			"z": -0.135442
		},
		{
			"x": 0.09108,
			"y": -0.12766,
			"z": -0.184303
		},
		{
			"x": -0.090276,
			"y": -0.12766,
			"z": -0.184303
		},
		{
			"x": -0.0627,
			"y": -0.115939,
			"z": -0.526398
		},
		{
			"x": -0.0627,
			"y": -0.16282,
			"z": -0.526398
		},
		{
			"x": -0.054558,
			"y": -0.104653,
			"z": -0.480864
		},
		{
			"x": 0.055359,
			"y": -0.104653,
			"z": -0.480864
		},
		{
			"x": -0.007521,
			"y": -0.157849,
			"z": 0.206744
		},
		{
			"x": 0.000408,
			"y": -0.158434,
			"z": 0.206744
		},
		{
			"x": 0.000408,
			"y": -0.152122,
			"z": 0.218982
		},
		{
			"x": -0.004923,
			"y": -0.151774,
			"z": 0.218983
		},
		{
			"x": 0.008337,
			"y": -0.157849,
			"z": 0.206744
		},
		{
			"x": 0.005739,
			"y": -0.151774,
			"z": 0.218983
		},
		{
			"x": -0.057678,
			"y": -0.103411,
			"z": -0.433437
		},
		{
			"x": 0.058479,
			"y": -0.103411,
			"z": -0.433437
		},
		{
			"x": -0.057678,
			"y": -0.175351,
			"z": -0.433437
		},
		{
			"x": 0.058479,
			"y": -0.175351,
			"z": -0.433437
		},
		{
			"x": -0.060417,
			"y": -0.102517,
			"z": -0.384576
		},
		{
			"x": 0.061218,
			"y": -0.176245,
			"z": -0.384573
		},
		{
			"x": 0.061218,
			"y": -0.102517,
			"z": -0.384576
		},
		{
			"x": -0.066909,
			"y": -0.163936,
			"z": -0.480864
		},
		{
			"x": 0.06771,
			"y": -0.163936,
			"z": -0.480861
		},
		{
			"x": -0.060417,
			"y": -0.176248,
			"z": -0.384576
		},
		{
			"x": -0.066909,
			"y": -0.114826,
			"z": -0.480864
		},
		{
			"x": 0.06771,
			"y": -0.114826,
			"z": -0.480864
		},
		{
			"x": 0.063504,
			"y": -0.176788,
			"z": -0.334749
		},
		{
			"x": -0.0627,
			"y": -0.176788,
			"z": -0.334749
		},
		{
			"x": -0.0627,
			"y": -0.101977,
			"z": -0.334749
		},
		{
			"x": 0.063504,
			"y": -0.101977,
			"z": -0.334749
		},
		{
			"x": 0.065247,
			"y": -0.101794,
			"z": -0.28444
		},
		{
			"x": -0.064446,
			"y": -0.101794,
			"z": -0.28444
		},
		{
			"x": -0.070731,
			"y": -0.113947,
			"z": -0.433437
		},
		{
			"x": -0.070731,
			"y": -0.164815,
			"z": -0.433437
		},
		{
			"x": 0.04485,
			"y": -0.183916,
			"z": -0.042479
		},
		{
			"x": 0.071532,
			"y": -0.164815,
			"z": -0.433437
		},
		{
			"x": 0.071532,
			"y": -0.113947,
			"z": -0.433437
		},
		{
			"x": -0.044043,
			"y": -0.183916,
			"z": -0.042479
		},
		{
			"x": -0.024414,
			"y": -0.167443,
			"z": 0.168239
		},
		{
			"x": -0.019773,
			"y": -0.162697,
			"z": 0.189775
		},
		{
			"x": 0.02523,
			"y": -0.167443,
			"z": 0.168239
		},
		{
			"x": 0.020589,
			"y": -0.162697,
			"z": 0.189775
		},
		{
			"x": -0.065625,
			"y": -0.105607,
			"z": -0.135442
		},
		{
			"x": 0.066432,
			"y": -0.105607,
			"z": -0.135441
		},
		{
			"x": -0.074088,
			"y": -0.113314,
			"z": -0.384576
		},
		{
			"x": 0.043401,
			"y": -0.155914,
			"z": 0.168239
		},
		{
			"x": 0.035364,
			"y": -0.153652,
			"z": 0.189775
		},
		{
			"x": -0.074088,
			"y": -0.165448,
			"z": -0.384576
		},
		{
			"x": 0.074889,
			"y": -0.165448,
			"z": -0.384576
		},
		{
			"x": -0.042582,
			"y": -0.155914,
			"z": 0.168239
		},
		{
			"x": -0.034545,
			"y": -0.153652,
			"z": 0.189775
		},
		{
			"x": 0.074886,
			"y": -0.113314,
			"z": -0.384576
		},
		{
			"x": -0.076884,
			"y": -0.165832,
			"z": -0.334749
		},
		{
			"x": 0.077685,
			"y": -0.112933,
			"z": -0.334749
		},
		{
			"x": 0.079821,
			"y": -0.112804,
			"z": -0.28444
		},
		{
			"x": -0.076884,
			"y": -0.112933,
			"z": -0.334749
		},
		{
			"x": -0.07902,
			"y": -0.112804,
			"z": -0.28444
		},
		{
			"x": 0.077685,
			"y": -0.165832,
			"z": -0.334749
		},
		{
			"x": 0.066366,
			"y": -0.103231,
			"z": -0.234129
		},
		{
			"x": -0.065565,
			"y": -0.103231,
			"z": -0.23413
		},
		{
			"x": 0.063258,
			"y": -0.175426,
			"z": -0.042479
		},
		{
			"x": -0.062454,
			"y": -0.175426,
			"z": -0.042479
		},
		{
			"x": 0.015729,
			"y": -0.129514,
			"z": 0.206744
		},
		{
			"x": 0.010707,
			"y": -0.134299,
			"z": 0.218983
		},
		{
			"x": -0.065979,
			"y": -0.105028,
			"z": -0.184303
		},
		{
			"x": 0.066783,
			"y": -0.105028,
			"z": -0.184303
		},
		{
			"x": -0.034695,
			"y": -0.162322,
			"z": 0.168239
		},
		{
			"x": 0.035511,
			"y": -0.162322,
			"z": 0.168239
		},
		{
			"x": 0.028947,
			"y": -0.158686,
			"z": 0.189775
		},
		{
			"x": -0.028131,
			"y": -0.158686,
			"z": 0.189775
		},
		{
			"x": 0.081192,
			"y": -0.114082,
			"z": -0.234129
		},
		{
			"x": -0.080388,
			"y": -0.114082,
			"z": -0.23413
		},
		{
			"x": -0.080466,
			"y": -0.11554,
			"z": -0.135442
		},
		{
			"x": 0.08127,
			"y": -0.11554,
			"z": -0.135441
		},
		{
			"x": -0.01491,
			"y": -0.129514,
			"z": 0.206744
		},
		{
			"x": -0.080898,
			"y": -0.115477,
			"z": -0.184303
		},
		{
			"x": 0.081702,
			"y": -0.115477,
			"z": -0.184303
		},
		{
			"x": -0.009891,
			"y": -0.150763,
			"z": 0.218982
		},
		{
			"x": 0.000408,
			"y": -0.137734,
			"z": 0.226373
		},
		{
			"x": -0.014913,
			"y": -0.156148,
			"z": 0.206744
		},
		{
			"x": 0.015729,
			"y": -0.156148,
			"z": 0.206744
		},
		{
			"x": -0.021255,
			"y": -0.131845,
			"z": 0.206744
		},
		{
			"x": 0.022074,
			"y": -0.131845,
			"z": 0.206744
		},
		{
			"x": 0.026943,
			"y": -0.13489,
			"z": 0.206744
		},
		{
			"x": -0.021258,
			"y": -0.153499,
			"z": 0.206744
		},
		{
			"x": 0.022074,
			"y": -0.153499,
			"z": 0.206744
		},
		{
			"x": -0.026127,
			"y": -0.150133,
			"z": 0.206744
		},
		{
			"x": 0.000396,
			"y": -0.099319,
			"z": -0.787857
		}
	],
	"faces": [
		33,
		41,
		44,
		44,
		23,
		24,
		24,
		25,
		44,
		26,
		27,
		32,
		28,
		29,
		32,
		30,
		31,
		32,
		32,
		25,
		26,
		34,
		35,
		36,
		36,
		37,
		34,
		38,
		39,
		34,
		40,
		41,
		34,
		42,
		43,
		44,
		44,
		25,
		33,
		27,
		28,
		32,
		30,
		32,
		29,
		34,
		37,
		38,
		39,
		40,
		34,
		42,
		44,
		41,
		32,
		33,
		25,
		34,
		41,
		33,
		1,
		3,
		4,
		6,
		8,
		5,
		7,
		10,
		8,
		4,
		11,
		12,
		13,
		2,
		1,
		16,
		5,
		15,
		18,
		13,
		17,
		9,
		20,
		10,
		12,
		21,
		22,
		21,
		15,
		22,
		20,
		45,
		46,
		48,
		50,
		47,
		51,
		53,
		54,
		55,
		52,
		51,
		58,
		47,
		57,
		49,
		60,
		50,
		54,
		61,
		62,
		60,
		18,
		17,
		63,
		56,
		55,
		66,
		57,
		65,
		62,
		66,
		65,
		45,
		63,
		46,
		9,
		68,
		19,
		68,
		45,
		19,
		45,
		70,
		64,
		70,
		56,
		64,
		56,
		72,
		52,
		52,
		73,
		53,
		53,
		74,
		61,
		61,
		75,
		66,
		75,
		58,
		66,
		76,
		48,
		58,
		48,
		78,
		49,
		78,
		59,
		49,
		79,
		18,
		59,
		18,
		81,
		14,
		14,
		82,
		2,
		82,
		3,
		2,
		3,
		84,
		11,
		11,
		85,
		21,
		85,
		16,
		21,
		86,
		6,
		16,
		87,
		7,
		6,
		88,
		9,
		7,
		67,
		23,
		68,
		23,
		69,
		68,
		69,
		43,
		70,
		43,
		71,
		70,
		71,
		41,
		72,
		72,
		40,
		73,
		73,
		39,
		74,
		74,
		38,
		75,
		75,
		37,
		76,
		76,
		36,
		77,
		36,
		78,
		77,
		78,
		34,
		79,
		34,
		80,
		79,
		80,
		32,
		81,
		32,
		82,
		81,
		82,
		30,
		83,
		30,
		84,
		83,
		29,
		85,
		84,
		28,
		86,
		85,
		27,
		87,
		86,
		26,
		88,
		87,
		25,
		67,
		88,
		1,
		2,
		3,
		6,
		7,
		8,
		7,
		9,
		10,
		4,
		3,
		11,
		13,
		14,
		2,
		16,
		6,
		5,
		18,
		14,
		13,
		9,
		19,
		20,
		12,
		11,
		21,
		21,
		16,
		15,
		20,
		19,
		45,
		48,
		49,
		50,
		51,
		52,
		53,
		55,
		56,
		52,
		58,
		48,
		47,
		49,
		59,
		60,
		54,
		53,
		61,
		60,
		59,
		18,
		63,
		64,
		56,
		66,
		58,
		57,
		62,
		61,
		66,
		45,
		64,
		63,
		9,
		67,
		68,
		68,
		69,
		45,
		45,
		69,
		70,
		70,
		71,
		56,
		56,
		71,
		72,
		52,
		72,
		73,
		53,
		73,
		74,
		61,
		74,
		75,
		75,
		76,
		58,
		76,
		77,
		48,
		48,
		77,
		78,
		78,
		79,
		59,
		79,
		80,
		18,
		18,
		80,
		81,
		14,
		81,
		82,
		82,
		83,
		3,
		3,
		83,
		84,
		11,
		84,
		85,
		85,
		86,
		16,
		86,
		87,
		6,
		87,
		88,
		7,
		88,
		67,
		9,
		67,
		24,
		23,
		23,
		44,
		69,
		69,
		44,
		43,
		43,
		42,
		71,
		71,
		42,
		41,
		72,
		41,
		40,
		73,
		40,
		39,
		74,
		39,
		38,
		75,
		38,
		37,
		76,
		37,
		36,
		36,
		35,
		78,
		78,
		35,
		34,
		34,
		33,
		80,
		80,
		33,
		32,
		32,
		31,
		82,
		82,
		31,
		30,
		30,
		29,
		84,
		29,
		28,
		85,
		28,
		27,
		86,
		27,
		26,
		87,
		26,
		25,
		88,
		25,
		24,
		67,
		103,
		93,
		104,
		112,
		122,
		121,
		103,
		94,
		93,
		112,
		111,
		122,
		89,
		90,
		91,
		92,
		94,
		95,
		96,
		90,
		97,
		97,
		89,
		98,
		98,
		99,
		100,
		100,
		101,
		102,
		102,
		103,
		104,
		95,
		106,
		92,
		105,
		96,
		106,
		94,
		103,
		101,
		101,
		99,
		95,
		101,
		95,
		94,
		105,
		95,
		99,
		105,
		99,
		89,
		91,
		105,
		89,
		107,
		108,
		109,
		111,
		113,
		110,
		108,
		115,
		114,
		109,
		114,
		116,
		118,
		116,
		117,
		120,
		117,
		119,
		122,
		119,
		121,
		123,
		110,
		113,
		115,
		124,
		123,
		120,
		122,
		111,
		110,
		118,
		120,
		111,
		110,
		120,
		118,
		110,
		124,
		109,
		118,
		124,
		109,
		124,
		107,
		92,
		93,
		94,
		96,
		91,
		90,
		97,
		90,
		89,
		98,
		89,
		99,
		100,
		99,
		101,
		102,
		101,
		103,
		95,
		105,
		106,
		105,
		91,
		96,
		111,
		112,
		113,
		108,
		107,
		115,
		109,
		108,
		114,
		118,
		109,
		116,
		120,
		118,
		117,
		122,
		120,
		119,
		123,
		124,
		110,
		115,
		107,
		124,
		129,
		131,
		133,
		161,
		162,
		149,
		136,
		125,
		126,
		126,
		127,
		135,
		129,
		130,
		131,
		127,
		128,
		134,
		135,
		136,
		126,
		134,
		135,
		127,
		128,
		129,
		133,
		131,
		132,
		133,
		133,
		134,
		128,
		149,
		148,
		160,
		160,
		161,
		149,
		162,
		163,
		149,
		138,
		140,
		137,
		139,
		142,
		140,
		141,
		144,
		142,
		144,
		145,
		146,
		148,
		150,
		147,
		152,
		145,
		151,
		147,
		151,
		145,
		153,
		139,
		138,
		154,
		141,
		139,
		155,
		143,
		141,
		156,
		158,
		143,
		157,
		160,
		158,
		160,
		164,
		161,
		160,
		148,
		147,
		147,
		158,
		160,
		132,
		164,
		159,
		133,
		159,
		157,
		134,
		157,
		156,
		135,
		156,
		155,
		136,
		155,
		154,
		125,
		154,
		153,
		165,
		138,
		137,
		167,
		166,
		165,
		169,
		168,
		167,
		171,
		172,
		169,
		150,
		163,
		173,
		172,
		152,
		151,
		151,
		173,
		172,
		166,
		153,
		138,
		168,
		174,
		166,
		170,
		175,
		168,
		177,
		176,
		170,
		162,
		178,
		177,
		164,
		162,
		161,
		173,
		163,
		162,
		177,
		173,
		162,
		164,
		130,
		179,
		179,
		129,
		178,
		178,
		128,
		176,
		176,
		127,
		175,
		175,
		126,
		174,
		174,
		125,
		153,
		172,
		177,
		170,
		143,
		158,
		145,
		144,
		143,
		145,
		172,
		170,
		169,
		138,
		139,
		140,
		139,
		141,
		142,
		141,
		143,
		144,
		148,
		149,
		150,
		152,
		146,
		145,
		147,
		150,
		151,
		153,
		154,
		139,
		154,
		155,
		141,
		155,
		156,
		143,
		156,
		157,
		158,
		157,
		159,
		160,
		160,
		159,
		164,
		147,
		145,
		158,
		132,
		131,
		164,
		133,
		132,
		159,
		134,
		133,
		157,
		135,
		134,
		156,
		136,
		135,
		155,
		125,
		136,
		154,
		165,
		166,
		138,
		167,
		168,
		166,
		169,
		170,
		168,
		150,
		149,
		163,
		172,
		171,
		152,
		151,
		150,
		173,
		166,
		174,
		153,
		168,
		175,
		174,
		170,
		176,
		175,
		177,
		178,
		176,
		162,
		179,
		178,
		164,
		179,
		162,
		177,
		172,
		173,
		164,
		131,
		130,
		179,
		130,
		129,
		178,
		129,
		128,
		176,
		128,
		127,
		175,
		127,
		126,
		174,
		126,
		125,
		180,
		182,
		183,
		182,
		185,
		183,
		184,
		187,
		185,
		186,
		189,
		187,
		188,
		191,
		189,
		190,
		193,
		191,
		194,
		196,
		197,
		197,
		181,
		180,
		198,
		192,
		199,
		198,
		195,
		194,
		200,
		184,
		182,
		181,
		200,
		182,
		196,
		202,
		181,
		195,
		203,
		196,
		199,
		204,
		195,
		206,
		199,
		192,
		207,
		192,
		190,
		208,
		190,
		188,
		209,
		188,
		186,
		201,
		186,
		184,
		203,
		209,
		202,
		209,
		200,
		202,
		205,
		207,
		204,
		208,
		204,
		207,
		211,
		213,
		210,
		214,
		211,
		210,
		216,
		215,
		214,
		218,
		217,
		216,
		220,
		219,
		218,
		222,
		221,
		220,
		225,
		227,
		224,
		212,
		224,
		213,
		223,
		229,
		228,
		226,
		229,
		227,
		215,
		231,
		211,
		231,
		212,
		211,
		232,
		225,
		212,
		233,
		226,
		225,
		234,
		228,
		226,
		228,
		236,
		223,
		223,
		237,
		221,
		221,
		238,
		219,
		219,
		239,
		217,
		217,
		230,
		215,
		239,
		233,
		232,
		231,
		239,
		232,
		237,
		235,
		234,
		234,
		238,
		237,
		180,
		181,
		182,
		182,
		184,
		185,
		184,
		186,
		187,
		186,
		188,
		189,
		188,
		190,
		191,
		190,
		192,
		193,
		194,
		195,
		196,
		197,
		196,
		181,
		198,
		193,
		192,
		198,
		199,
		195,
		200,
		201,
		184,
		181,
		202,
		200,
		196,
		203,
		202,
		195,
		204,
		203,
		199,
		205,
		204,
		206,
		205,
		199,
		207,
		206,
		192,
		208,
		207,
		190,
		209,
		208,
		188,
		201,
		209,
		186,
		203,
		208,
		209,
		209,
		201,
		200,
		205,
		206,
		207,
		208,
		203,
		204,
		211,
		212,
		213,
		214,
		215,
		211,
		216,
		217,
		215,
		218,
		219,
		217,
		220,
		221,
		219,
		222,
		223,
		221,
		225,
		226,
		227,
		212,
		225,
		224,
		223,
		222,
		229,
		226,
		228,
		229,
		215,
		230,
		231,
		231,
		232,
		212,
		232,
		233,
		225,
		233,
		234,
		226,
		234,
		235,
		228,
		228,
		235,
		236,
		223,
		236,
		237,
		221,
		237,
		238,
		219,
		238,
		239,
		217,
		239,
		230,
		239,
		238,
		233,
		231,
		230,
		239,
		237,
		236,
		235,
		234,
		233,
		238,
		240,
		241,
		242,
		244,
		246,
		243,
		248,
		250,
		247,
		252,
		240,
		251,
		253,
		243,
		246,
		247,
		250,
		255,
		256,
		258,
		259,
		259,
		260,
		261,
		258,
		263,
		264,
		266,
		243,
		265,
		268,
		269,
		267,
		266,
		256,
		270,
		272,
		274,
		271,
		246,
		276,
		253,
		245,
		275,
		246,
		249,
		275,
		250,
		269,
		279,
		278,
		273,
		251,
		274,
		252,
		253,
		276,
		270,
		259,
		261,
		257,
		262,
		258,
		278,
		271,
		280,
		278,
		267,
		269,
		241,
		276,
		249,
		257,
		265,
		279,
		273,
		254,
		253,
		272,
		279,
		254,
		277,
		250,
		275,
		281,
		262,
		268,
		259,
		264,
		260,
		254,
		265,
		243,
		242,
		249,
		248,
		242,
		282,
		240,
		283,
		285,
		286,
		287,
		289,
		290,
		240,
		291,
		251,
		286,
		293,
		283,
		294,
		287,
		290,
		296,
		298,
		295,
		299,
		300,
		295,
		302,
		296,
		301,
		286,
		304,
		305,
		306,
		268,
		267,
		298,
		304,
		307,
		274,
		309,
		271,
		310,
		283,
		293,
		311,
		284,
		283,
		311,
		288,
		287,
		313,
		306,
		314,
		251,
		308,
		274,
		293,
		291,
		310,
		295,
		307,
		299,
		303,
		297,
		296,
		271,
		314,
		280,
		267,
		314,
		306,
		310,
		282,
		288,
		305,
		297,
		313,
		292,
		308,
		293,
		313,
		309,
		292,
		287,
		312,
		311,
		303,
		281,
		268,
		301,
		295,
		300,
		305,
		292,
		286,
		288,
		242,
		289,
		244,
		245,
		246,
		248,
		249,
		250,
		252,
		241,
		240,
		253,
		254,
		243,
		256,
		257,
		258,
		258,
		262,
		263,
		266,
		244,
		243,
		268,
		262,
		269,
		266,
		265,
		256,
		272,
		273,
		274,
		246,
		275,
		276,
		245,
		277,
		275,
		249,
		276,
		275,
		269,
		257,
		279,
		273,
		252,
		251,
		252,
		273,
		253,
		270,
		256,
		259,
		257,
		269,
		262,
		278,
		272,
		271,
		278,
		280,
		267,
		241,
		252,
		276,
		257,
		256,
		265,
		273,
		272,
		254,
		272,
		278,
		279,
		277,
		255,
		250,
		281,
		263,
		262,
		259,
		258,
		264,
		254,
		279,
		265,
		242,
		241,
		249,
		283,
		284,
		285,
		287,
		288,
		289,
		240,
		282,
		291,
		286,
		292,
		293,
		296,
		297,
		298,
		302,
		303,
		296,
		286,
		285,
		304,
		306,
		303,
		268,
		298,
		305,
		304,
		274,
		308,
		309,
		310,
		311,
		283,
		311,
		312,
		284,
		311,
		310,
		288,
		313,
		297,
		306,
		251,
		291,
		308,
		293,
		308,
		291,
		295,
		298,
		307,
		303,
		306,
		297,
		271,
		309,
		314,
		267,
		280,
		314,
		310,
		291,
		282,
		305,
		298,
		297,
		292,
		309,
		308,
		313,
		314,
		309,
		287,
		294,
		312,
		303,
		302,
		281,
		301,
		296,
		295,
		305,
		313,
		292,
		288,
		282,
		242,
		315,
		316,
		317,
		336,
		331,
		337,
		381,
		382,
		388,
		436,
		524,
		586,
		677,
		678,
		679,
		693,
		697,
		698,
		852,
		771,
		907,
		998,
		375,
		999,
		387,
		1003,
		1002,
		386,
		1004,
		1003,
		1012,
		376,
		998,
		980,
		981,
		326,
		986,
		987,
		688,
		336,
		330,
		331,
		388,
		375,
		379,
		376,
		377,
		378,
		378,
		379,
		375,
		380,
		381,
		388,
		382,
		383,
		388,
		384,
		385,
		386,
		386,
		387,
		384,
		375,
		376,
		378,
		379,
		380,
		388,
		383,
		384,
		387,
		387,
		388,
		383,
		436,
		435,
		524,
		693,
		692,
		697,
		852,
		772,
		771,
		998,
		376,
		375,
		387,
		386,
		1003,
		386,
		385,
		1004,
		1012,
		377,
		376,
		980,
		982,
		981,
		986,
		985,
		987,
		318,
		319,
		320,
		320,
		319,
		321,
		325,
		326,
		327,
		327,
		326,
		328,
		328,
		326,
		329,
		329,
		326,
		330,
		330,
		326,
		331,
		331,
		326,
		332,
		325,
		327,
		333,
		327,
		334,
		333,
		328,
		335,
		334,
		329,
		336,
		335,
		337,
		332,
		338,
		339,
		340,
		341,
		339,
		342,
		343,
		345,
		339,
		344,
		339,
		341,
		342,
		346,
		344,
		339,
		349,
		351,
		348,
		348,
		353,
		352,
		352,
		354,
		355,
		355,
		356,
		357,
		356,
		359,
		357,
		359,
		361,
		360,
		360,
		347,
		346,
		349,
		363,
		350,
		336,
		365,
		335,
		364,
		367,
		368,
		364,
		337,
		366,
		370,
		372,
		369,
		372,
		373,
		369,
		369,
		374,
		370,
		390,
		392,
		389,
		389,
		394,
		393,
		393,
		395,
		396,
		396,
		398,
		397,
		397,
		400,
		399,
		402,
		404,
		401,
		406,
		408,
		405,
		409,
		410,
		411,
		412,
		413,
		325,
		333,
		414,
		415,
		365,
		334,
		335,
		416,
		417,
		343,
		418,
		420,
		421,
		422,
		424,
		410,
		425,
		426,
		427,
		399,
		429,
		428,
		430,
		432,
		433,
		434,
		435,
		436,
		437,
		439,
		440,
		441,
		374,
		427,
		390,
		443,
		391,
		444,
		446,
		447,
		448,
		373,
		372,
		448,
		449,
		373,
		449,
		450,
		373,
		451,
		452,
		449,
		412,
		325,
		453,
		454,
		456,
		457,
		458,
		459,
		460,
		462,
		464,
		461,
		466,
		468,
		465,
		470,
		472,
		469,
		474,
		344,
		473,
		475,
		361,
		358,
		477,
		478,
		416,
		342,
		416,
		343,
		479,
		480,
		481,
		483,
		485,
		482,
		325,
		487,
		326,
		489,
		491,
		488,
		492,
		481,
		480,
		494,
		397,
		495,
		496,
		438,
		437,
		347,
		473,
		344,
		399,
		495,
		397,
		444,
		501,
		500,
		503,
		505,
		502,
		442,
		506,
		507,
		489,
		509,
		510,
		511,
		486,
		512,
		350,
		469,
		472,
		513,
		421,
		420,
		497,
		515,
		438,
		516,
		502,
		518,
		519,
		481,
		520,
		398,
		522,
		400,
		449,
		523,
		450,
		407,
		431,
		430,
		435,
		471,
		470,
		392,
		419,
		394,
		391,
		420,
		392,
		501,
		455,
		454,
		474,
		442,
		345,
		525,
		358,
		356,
		527,
		529,
		526,
		466,
		525,
		467,
		531,
		508,
		532,
		500,
		534,
		444,
		333,
		453,
		325,
		490,
		510,
		513,
		428,
		499,
		399,
		493,
		532,
		508,
		446,
		535,
		367,
		451,
		448,
		536,
		538,
		540,
		537,
		345,
		507,
		340,
		541,
		517,
		516,
		518,
		505,
		543,
		544,
		545,
		546,
		352,
		355,
		547,
		357,
		547,
		355,
		540,
		551,
		549,
		533,
		522,
		534,
		539,
		550,
		540,
		393,
		494,
		553,
		437,
		451,
		496,
		546,
		542,
		541,
		555,
		346,
		554,
		538,
		502,
		517,
		556,
		488,
		491,
		557,
		558,
		559,
		560,
		562,
		426,
		426,
		441,
		427,
		563,
		562,
		543,
		514,
		564,
		515,
		491,
		443,
		474,
		496,
		536,
		565,
		477,
		342,
		341,
		400,
		544,
		429,
		520,
		493,
		488,
		566,
		522,
		521,
		529,
		518,
		561,
		461,
		436,
		462,
		418,
		535,
		569,
		527,
		459,
		570,
		572,
		574,
		530,
		575,
		478,
		477,
		467,
		356,
		354,
		565,
		497,
		496,
		577,
		472,
		471,
		528,
		516,
		529,
		539,
		517,
		542,
		579,
		541,
		528,
		346,
		343,
		554,
		426,
		580,
		560,
		473,
		491,
		474,
		357,
		581,
		548,
		526,
		580,
		582,
		537,
		549,
		564,
		584,
		572,
		583,
		436,
		587,
		462,
		569,
		445,
		566,
		419,
		569,
		588,
		570,
		528,
		527,
		503,
		537,
		514,
		563,
		371,
		370,
		590,
		592,
		593,
		594,
		520,
		556,
		440,
		452,
		437,
		366,
		446,
		367,
		568,
		421,
		596,
		521,
		395,
		588,
		417,
		478,
		597,
		550,
		454,
		551,
		596,
		368,
		568,
		599,
		573,
		600,
		441,
		370,
		374,
		409,
		422,
		410,
		504,
		514,
		497,
		371,
		448,
		372,
		602,
		316,
		413,
		603,
		433,
		432,
		583,
		530,
		466,
		530,
		475,
		525,
		545,
		539,
		542,
		589,
		543,
		505,
		552,
		501,
		550,
		565,
		505,
		504,
		581,
		360,
		555,
		458,
		570,
		459,
		508,
		488,
		493,
		509,
		598,
		596,
		447,
		595,
		455,
		390,
		605,
		506,
		404,
		603,
		401,
		589,
		536,
		371,
		594,
		600,
		519,
		423,
		408,
		424,
		527,
		582,
		571,
		606,
		323,
		319,
		566,
		444,
		534,
		608,
		609,
		607,
		579,
		428,
		429,
		498,
		361,
		476,
		468,
		354,
		353,
		455,
		610,
		456,
		389,
		553,
		605,
		585,
		573,
		572,
		412,
		492,
		480,
		585,
		318,
		609,
		597,
		576,
		611,
		415,
		531,
		532,
		568,
		367,
		535,
		561,
		543,
		562,
		594,
		476,
		599,
		353,
		578,
		468,
		453,
		532,
		492,
		578,
		465,
		468,
		438,
		612,
		439,
		577,
		434,
		557,
		613,
		424,
		408,
		560,
		529,
		561,
		363,
		616,
		469,
		583,
		465,
		617,
		431,
		619,
		432,
		479,
		317,
		316,
		432,
		621,
		603,
		479,
		600,
		620,
		622,
		337,
		338,
		469,
		623,
		470,
		533,
		552,
		545,
		515,
		624,
		612,
		362,
		615,
		363,
		551,
		457,
		626,
		549,
		626,
		627,
		524,
		618,
		431,
		513,
		443,
		490,
		574,
		476,
		475,
		603,
		629,
		401,
		631,
		362,
		630,
		600,
		608,
		620,
		319,
		584,
		606,
		623,
		435,
		470,
		577,
		617,
		465,
		498,
		556,
		473,
		569,
		521,
		588,
		595,
		622,
		610,
		394,
		588,
		395,
		414,
		598,
		531,
		596,
		510,
		509,
		340,
		477,
		341,
		557,
		606,
		617,
		429,
		546,
		579,
		632,
		524,
		435,
		472,
		351,
		350,
		564,
		627,
		624,
		633,
		619,
		618,
		615,
		636,
		616,
		616,
		637,
		623,
		639,
		512,
		638,
		634,
		621,
		619,
		625,
		635,
		615,
		365,
		368,
		598,
		642,
		618,
		628,
		640,
		629,
		621,
		401,
		644,
		402,
		629,
		645,
		644,
		623,
		646,
		632,
		631,
		641,
		625,
		646,
		628,
		632,
		411,
		648,
		649,
		650,
		614,
		613,
		620,
		607,
		317,
		606,
		583,
		617,
		652,
		651,
		650,
		464,
		654,
		655,
		484,
		652,
		485,
		592,
		657,
		593,
		659,
		661,
		658,
		656,
		638,
		657,
		663,
		665,
		662,
		664,
		648,
		665,
		660,
		662,
		661,
		459,
		666,
		460,
		667,
		316,
		315,
		601,
		315,
		668,
		669,
		601,
		668,
		423,
		669,
		670,
		322,
		423,
		670,
		321,
		405,
		322,
		586,
		407,
		406,
		406,
		671,
		586,
		480,
		316,
		602,
		602,
		412,
		480,
		413,
		412,
		602,
		614,
		410,
		424,
		651,
		648,
		614,
		653,
		665,
		651,
		661,
		653,
		484,
		658,
		484,
		483,
		325,
		667,
		409,
		411,
		325,
		409,
		649,
		486,
		411,
		638,
		649,
		664,
		657,
		664,
		663,
		593,
		663,
		660,
		659,
		593,
		660,
		434,
		567,
		558,
		672,
		559,
		558,
		673,
		558,
		567,
		674,
		567,
		461,
		675,
		461,
		464,
		672,
		324,
		323,
		676,
		586,
		671,
		676,
		654,
		587,
		430,
		408,
		407,
		433,
		613,
		430,
		604,
		650,
		433,
		485,
		604,
		404,
		403,
		485,
		404,
		654,
		462,
		587,
		655,
		675,
		464,
		680,
		681,
		682,
		681,
		680,
		686,
		687,
		688,
		689,
		690,
		688,
		687,
		691,
		688,
		690,
		692,
		688,
		691,
		693,
		688,
		692,
		332,
		688,
		693,
		694,
		687,
		689,
		695,
		687,
		694,
		696,
		690,
		695,
		697,
		691,
		696,
		332,
		698,
		338,
		699,
		700,
		701,
		343,
		702,
		701,
		701,
		703,
		704,
		702,
		699,
		701,
		704,
		706,
		701,
		707,
		709,
		710,
		711,
		710,
		712,
		714,
		712,
		713,
		716,
		713,
		715,
		717,
		716,
		715,
		719,
		717,
		720,
		705,
		720,
		706,
		721,
		709,
		708,
		723,
		697,
		696,
		726,
		724,
		725,
		698,
		724,
		727,
		728,
		730,
		369,
		369,
		373,
		728,
		730,
		374,
		369,
		731,
		733,
		734,
		735,
		734,
		736,
		738,
		736,
		737,
		739,
		737,
		740,
		741,
		740,
		742,
		743,
		402,
		744,
		745,
		747,
		748,
		749,
		750,
		751,
		689,
		752,
		753,
		755,
		694,
		754,
		695,
		723,
		696,
		343,
		417,
		756,
		758,
		760,
		757,
		761,
		763,
		750,
		427,
		764,
		425,
		765,
		742,
		766,
		768,
		770,
		767,
		771,
		772,
		773,
		439,
		775,
		440,
		427,
		374,
		776,
		777,
		733,
		732,
		780,
		782,
		779,
		728,
		373,
		783,
		373,
		784,
		783,
		373,
		450,
		784,
		784,
		785,
		786,
		787,
		689,
		753,
		456,
		789,
		457,
		790,
		459,
		791,
		792,
		794,
		795,
		796,
		798,
		799,
		800,
		802,
		803,
		704,
		804,
		805,
		719,
		807,
		718,
		756,
		808,
		809,
		343,
		756,
		702,
		811,
		812,
		810,
		813,
		483,
		482,
		815,
		689,
		688,
		817,
		819,
		820,
		810,
		822,
		811,
		740,
		824,
		823,
		774,
		826,
		775,
		805,
		705,
		704,
		823,
		742,
		740,
		829,
		782,
		830,
		831,
		833,
		834,
		836,
		778,
		835,
		838,
		819,
		837,
		816,
		841,
		840,
		803,
		708,
		800,
		757,
		842,
		758,
		843,
		825,
		774,
		834,
		847,
		845,
		810,
		849,
		848,
		850,
		739,
		741,
		523,
		784,
		450,
		769,
		746,
		770,
		801,
		772,
		802,
		759,
		731,
		735,
		758,
		732,
		731,
		788,
		829,
		789,
		778,
		804,
		703,
		718,
		853,
		716,
		854,
		856,
		857,
		853,
		798,
		797,
		839,
		860,
		859,
		861,
		830,
		782,
		787,
		694,
		689,
		837,
		818,
		842,
		828,
		766,
		742,
		859,
		821,
		839,
		863,
		780,
		726,
		783,
		786,
		864,
		865,
		867,
		868,
		835,
		703,
		700,
		846,
		870,
		847,
		831,
		845,
		871,
		873,
		874,
		872,
		547,
		713,
		712,
		547,
		715,
		713,
		875,
		865,
		877,
		850,
		862,
		861,
		876,
		866,
		865,
		824,
		736,
		879,
		786,
		775,
		826,
		869,
		872,
		870,
		706,
		555,
		554,
		834,
		867,
		846,
		820,
		880,
		817,
		882,
		883,
		881,
		884,
		886,
		764,
		776,
		764,
		427,
		884,
		887,
		871,
		888,
		844,
		843,
		777,
		817,
		804,
		864,
		826,
		889,
		702,
		809,
		699,
		874,
		741,
		765,
		821,
		848,
		820,
		850,
		890,
		851,
		845,
		854,
		885,
		771,
		795,
		794,
		863,
		760,
		892,
		459,
		856,
		894,
		895,
		897,
		858,
		808,
		899,
		809,
		716,
		797,
		714,
		825,
		889,
		826,
		800,
		901,
		801,
		847,
		855,
		854,
		846,
		866,
		869,
		870,
		902,
		855,
		343,
		706,
		554,
		580,
		764,
		886,
		817,
		805,
		804,
		581,
		715,
		548,
		580,
		857,
		582,
		877,
		868,
		888,
		897,
		904,
		905,
		906,
		771,
		794,
		781,
		892,
		890,
		892,
		759,
		908,
		855,
		894,
		856,
		868,
		833,
		844,
		729,
		887,
		730,
		911,
		590,
		910,
		848,
		912,
		880,
		785,
		440,
		775,
		780,
		727,
		726,
		757,
		893,
		914,
		738,
		851,
		908,
		808,
		417,
		597,
		789,
		876,
		875,
		725,
		914,
		893,
		896,
		917,
		916,
		730,
		776,
		374,
		763,
		751,
		750,
		844,
		832,
		825,
		783,
		729,
		728,
		752,
		678,
		919,
		767,
		921,
		768,
		858,
		905,
		798,
		807,
		858,
		853,
		866,
		873,
		869,
		871,
		909,
		831,
		829,
		878,
		876,
		831,
		889,
		832,
		720,
		581,
		555,
		894,
		791,
		459,
		820,
		839,
		821,
		915,
		838,
		914,
		913,
		779,
		788,
		922,
		733,
		836,
		921,
		743,
		744,
		864,
		909,
		729,
		916,
		912,
		849,
		745,
		762,
		761,
		582,
		856,
		571,
		684,
		923,
		681,
		782,
		890,
		861,
		924,
		925,
		926,
		766,
		902,
		765,
		719,
		827,
		806,
		714,
		796,
		711,
		610,
		788,
		456,
		879,
		734,
		922,
		896,
		903,
		897,
		822,
		753,
		811,
		682,
		903,
		924,
		898,
		597,
		611,
		860,
		754,
		859,
		726,
		893,
		863,
		871,
		885,
		884,
		806,
		912,
		917,
		900,
		711,
		796,
		859,
		787,
		822,
		799,
		900,
		796,
		612,
		774,
		439,
		773,
		901,
		883,
		761,
		928,
		745,
		854,
		886,
		885,
		929,
		721,
		803,
		799,
		905,
		931,
		932,
		769,
		768,
		677,
		812,
		678,
		935,
		768,
		921,
		916,
		812,
		934,
		698,
		622,
		338,
		936,
		803,
		802,
		878,
		862,
		873,
		624,
		843,
		612,
		930,
		722,
		721,
		457,
		875,
		626,
		626,
		877,
		627,
		933,
		852,
		769,
		777,
		842,
		818,
		806,
		895,
		807,
		939,
		921,
		744,
		722,
		631,
		630,
		925,
		916,
		934,
		904,
		681,
		923,
		772,
		936,
		802,
		931,
		901,
		799,
		880,
		827,
		805,
		851,
		892,
		908,
		622,
		913,
		610,
		908,
		735,
		738,
		915,
		755,
		860,
		837,
		914,
		838,
		809,
		700,
		699,
		923,
		883,
		931,
		872,
		765,
		902,
		852,
		940,
		772,
		707,
		800,
		708,
		627,
		888,
		624,
		932,
		942,
		933,
		943,
		930,
		929,
		945,
		929,
		936,
		840,
		946,
		947,
		935,
		941,
		932,
		944,
		937,
		930,
		725,
		723,
		915,
		933,
		950,
		938,
		939,
		948,
		935,
		644,
		744,
		402,
		645,
		939,
		644,
		952,
		936,
		940,
		949,
		631,
		937,
		938,
		952,
		940,
		954,
		749,
		953,
		927,
		956,
		928,
		926,
		934,
		677,
		905,
		923,
		931,
		955,
		958,
		956,
		960,
		792,
		959,
		958,
		814,
		813,
		961,
		911,
		910,
		963,
		659,
		658,
		947,
		962,
		961,
		965,
		967,
		968,
		954,
		966,
		965,
		968,
		964,
		963,
		790,
		666,
		459,
		678,
		969,
		679,
		679,
		918,
		970,
		918,
		971,
		970,
		971,
		762,
		972,
		762,
		685,
		972,
		748,
		686,
		685,
		746,
		907,
		747,
		973,
		747,
		907,
		919,
		678,
		811,
		811,
		753,
		919,
		919,
		753,
		752,
		750,
		927,
		761,
		954,
		955,
		927,
		965,
		957,
		955,
		957,
		963,
		814,
		814,
		658,
		483,
		969,
		689,
		751,
		689,
		749,
		751,
		816,
		953,
		749,
		840,
		966,
		953,
		966,
		961,
		967,
		967,
		910,
		964,
		910,
		659,
		964,
		891,
		773,
		882,
		881,
		974,
		882,
		882,
		975,
		891,
		891,
		976,
		795,
		795,
		977,
		792,
		684,
		683,
		974,
		907,
		978,
		973,
		960,
		978,
		906,
		745,
		770,
		746,
		928,
		767,
		770,
		956,
		920,
		767,
		920,
		813,
		743,
		813,
		403,
		743,
		794,
		960,
		906,
		792,
		977,
		959,
		979,
		326,
		487,
		982,
		984,
		981,
		984,
		985,
		986,
		688,
		988,
		815,
		815,
		989,
		841,
		841,
		990,
		946,
		990,
		962,
		946,
		991,
		911,
		962,
		992,
		591,
		911,
		591,
		994,
		592,
		592,
		995,
		656,
		656,
		996,
		639,
		996,
		511,
		639,
		997,
		487,
		511,
		979,
		999,
		980,
		999,
		1001,
		980,
		1001,
		1002,
		987,
		1002,
		988,
		987,
		1003,
		989,
		988,
		1004,
		990,
		989,
		1005,
		991,
		990,
		1006,
		992,
		991,
		1007,
		993,
		992,
		993,
		1009,
		994,
		994,
		1010,
		995,
		995,
		1011,
		996,
		996,
		1012,
		997,
		997,
		998,
		979,
		375,
		1000,
		999,
		1000,
		387,
		1002,
		385,
		1005,
		1004,
		1005,
		383,
		1006,
		1006,
		382,
		1007,
		1007,
		381,
		1008,
		381,
		1009,
		1008,
		380,
		1010,
		1009,
		379,
		1011,
		1010,
		1011,
		377,
		1012,
		985,
		1001,
		987,
		1001,
		982,
		980,
		981,
		332,
		326,
		332,
		986,
		688,
		324,
		321,
		319,
		322,
		320,
		321,
		319,
		323,
		324,
		327,
		328,
		334,
		328,
		329,
		335,
		329,
		330,
		336,
		337,
		331,
		332,
		345,
		340,
		339,
		346,
		347,
		344,
		349,
		350,
		351,
		348,
		351,
		353,
		352,
		353,
		354,
		355,
		354,
		356,
		356,
		358,
		359,
		359,
		358,
		361,
		360,
		361,
		347,
		349,
		362,
		363,
		336,
		364,
		365,
		364,
		366,
		367,
		364,
		336,
		337,
		370,
		371,
		372,
		390,
		391,
		392,
		389,
		392,
		394,
		393,
		394,
		395,
		396,
		395,
		398,
		397,
		398,
		400,
		402,
		403,
		404,
		406,
		407,
		408,
		333,
		334,
		414,
		365,
		414,
		334,
		418,
		419,
		420,
		422,
		423,
		424,
		399,
		400,
		429,
		430,
		431,
		432,
		437,
		438,
		439,
		390,
		442,
		443,
		444,
		445,
		446,
		454,
		455,
		456,
		462,
		463,
		464,
		466,
		467,
		468,
		470,
		471,
		472,
		474,
		345,
		344,
		475,
		476,
		361,
		479,
		316,
		480,
		483,
		484,
		485,
		325,
		486,
		487,
		489,
		490,
		491,
		492,
		493,
		481,
		494,
		396,
		397,
		496,
		497,
		438,
		347,
		498,
		473,
		399,
		499,
		495,
		444,
		447,
		501,
		503,
		504,
		505,
		442,
		390,
		506,
		489,
		508,
		509,
		511,
		487,
		486,
		350,
		363,
		469,
		513,
		510,
		421,
		497,
		514,
		515,
		516,
		517,
		502,
		519,
		479,
		481,
		398,
		521,
		522,
		449,
		452,
		523,
		407,
		524,
		431,
		435,
		434,
		471,
		392,
		420,
		419,
		391,
		513,
		420,
		501,
		447,
		455,
		474,
		443,
		442,
		525,
		475,
		358,
		527,
		528,
		529,
		466,
		530,
		525,
		531,
		509,
		508,
		500,
		533,
		534,
		333,
		415,
		453,
		490,
		489,
		510,
		428,
		458,
		499,
		493,
		492,
		532,
		446,
		445,
		535,
		451,
		449,
		448,
		538,
		539,
		540,
		345,
		442,
		507,
		541,
		542,
		517,
		518,
		502,
		505,
		544,
		533,
		545,
		357,
		548,
		547,
		540,
		550,
		551,
		533,
		544,
		522,
		539,
		552,
		550,
		393,
		396,
		494,
		437,
		452,
		451,
		546,
		545,
		542,
		555,
		360,
		346,
		538,
		503,
		502,
		556,
		520,
		488,
		557,
		434,
		558,
		560,
		561,
		562,
		426,
		562,
		441,
		563,
		441,
		562,
		514,
		537,
		564,
		491,
		490,
		443,
		496,
		451,
		536,
		477,
		416,
		342,
		400,
		522,
		544,
		520,
		481,
		493,
		566,
		534,
		522,
		529,
		516,
		518,
		461,
		567,
		436,
		418,
		568,
		535,
		527,
		571,
		459,
		572,
		573,
		574,
		575,
		576,
		478,
		467,
		525,
		356,
		565,
		504,
		497,
		577,
		578,
		472,
		528,
		541,
		516,
		539,
		538,
		517,
		579,
		546,
		541,
		346,
		339,
		343,
		426,
		425,
		580,
		473,
		556,
		491,
		357,
		359,
		581,
		526,
		560,
		580,
		537,
		540,
		549,
		584,
		585,
		572,
		436,
		586,
		587,
		569,
		535,
		445,
		419,
		418,
		569,
		570,
		579,
		528,
		503,
		538,
		537,
		563,
		589,
		371,
		590,
		591,
		592,
		594,
		519,
		520,
		440,
		523,
		452,
		366,
		595,
		446,
		568,
		418,
		421,
		521,
		398,
		395,
		417,
		416,
		478,
		550,
		501,
		454,
		596,
		598,
		368,
		599,
		574,
		573,
		441,
		563,
		370,
		409,
		601,
		422,
		504,
		503,
		514,
		371,
		536,
		448,
		603,
		604,
		433,
		583,
		572,
		530,
		530,
		574,
		475,
		545,
		552,
		539,
		589,
		563,
		543,
		552,
		500,
		501,
		565,
		589,
		505,
		581,
		359,
		360,
		458,
		428,
		570,
		508,
		489,
		488,
		509,
		531,
		598,
		447,
		446,
		595,
		390,
		389,
		605,
		404,
		604,
		603,
		589,
		565,
		536,
		594,
		599,
		600,
		423,
		405,
		408,
		527,
		526,
		582,
		606,
		559,
		323,
		566,
		445,
		444,
		608,
		585,
		609,
		579,
		570,
		428,
		498,
		347,
		361,
		468,
		467,
		354,
		455,
		595,
		610,
		389,
		393,
		553,
		585,
		608,
		573,
		412,
		453,
		492,
		585,
		584,
		318,
		597,
		478,
		576,
		415,
		414,
		531,
		568,
		368,
		367,
		561,
		518,
		543,
		594,
		498,
		476,
		353,
		351,
		578,
		453,
		415,
		532,
		578,
		577,
		465,
		438,
		515,
		612,
		577,
		471,
		434,
		613,
		614,
		424,
		560,
		526,
		529,
		363,
		615,
		616,
		583,
		466,
		465,
		431,
		618,
		619,
		479,
		620,
		317,
		432,
		619,
		621,
		479,
		519,
		600,
		622,
		366,
		337,
		469,
		616,
		623,
		533,
		500,
		552,
		515,
		564,
		624,
		362,
		625,
		615,
		551,
		454,
		457,
		549,
		551,
		626,
		524,
		628,
		618,
		513,
		391,
		443,
		574,
		599,
		476,
		603,
		621,
		629,
		631,
		625,
		362,
		600,
		573,
		608,
		319,
		318,
		584,
		623,
		632,
		435,
		577,
		557,
		617,
		498,
		594,
		556,
		569,
		566,
		521,
		595,
		366,
		622,
		394,
		419,
		588,
		414,
		365,
		598,
		596,
		421,
		510,
		340,
		575,
		477,
		557,
		559,
		606,
		429,
		544,
		546,
		632,
		628,
		524,
		472,
		578,
		351,
		564,
		549,
		627,
		633,
		634,
		619,
		615,
		635,
		636,
		616,
		636,
		637,
		639,
		511,
		512,
		634,
		640,
		621,
		625,
		641,
		635,
		365,
		364,
		368,
		642,
		633,
		618,
		640,
		643,
		629,
		401,
		629,
		644,
		629,
		643,
		645,
		623,
		637,
		646,
		631,
		647,
		641,
		646,
		642,
		628,
		411,
		410,
		648,
		650,
		651,
		614,
		620,
		608,
		607,
		606,
		584,
		583,
		652,
		653,
		651,
		464,
		463,
		654,
		484,
		653,
		652,
		592,
		656,
		657,
		659,
		660,
		661,
		656,
		639,
		638,
		663,
		664,
		665,
		664,
		649,
		648,
		660,
		663,
		662,
		667,
		413,
		316,
		601,
		667,
		315,
		669,
		422,
		601,
		423,
		422,
		669,
		322,
		405,
		423,
		321,
		406,
		405,
		586,
		524,
		407,
		406,
		321,
		671,
		614,
		648,
		410,
		651,
		665,
		648,
		653,
		662,
		665,
		661,
		662,
		653,
		658,
		661,
		484,
		601,
		409,
		667,
		325,
		413,
		667,
		411,
		486,
		325,
		649,
		512,
		486,
		638,
		512,
		649,
		657,
		638,
		664,
		593,
		657,
		663,
		659,
		590,
		593,
		434,
		436,
		567,
		672,
		323,
		559,
		673,
		672,
		558,
		674,
		673,
		567,
		675,
		674,
		461,
		676,
		587,
		586,
		676,
		655,
		654,
		430,
		613,
		408,
		433,
		650,
		613,
		604,
		652,
		650,
		485,
		652,
		604,
		403,
		482,
		485,
		654,
		463,
		462,
		683,
		684,
		681,
		681,
		686,
		683,
		685,
		686,
		680,
		695,
		690,
		687,
		696,
		691,
		690,
		697,
		692,
		691,
		332,
		693,
		698,
		701,
		700,
		703,
		704,
		705,
		706,
		707,
		708,
		709,
		711,
		707,
		710,
		714,
		711,
		712,
		716,
		714,
		713,
		717,
		718,
		716,
		719,
		718,
		717,
		705,
		719,
		720,
		721,
		722,
		709,
		723,
		724,
		697,
		726,
		727,
		724,
		698,
		697,
		724,
		728,
		729,
		730,
		731,
		732,
		733,
		735,
		731,
		734,
		738,
		735,
		736,
		739,
		738,
		737,
		741,
		739,
		740,
		743,
		403,
		402,
		745,
		746,
		747,
		755,
		695,
		694,
		695,
		755,
		723,
		758,
		759,
		760,
		761,
		762,
		763,
		765,
		741,
		742,
		768,
		769,
		770,
		439,
		774,
		775,
		777,
		778,
		733,
		780,
		781,
		782,
		456,
		788,
		789,
		792,
		793,
		794,
		796,
		797,
		798,
		800,
		801,
		802,
		704,
		703,
		804,
		719,
		806,
		807,
		811,
		678,
		812,
		813,
		814,
		483,
		815,
		816,
		689,
		817,
		818,
		819,
		810,
		821,
		822,
		740,
		737,
		824,
		774,
		825,
		826,
		805,
		827,
		705,
		823,
		828,
		742,
		829,
		779,
		782,
		831,
		832,
		833,
		836,
		733,
		778,
		838,
		839,
		819,
		816,
		815,
		841,
		803,
		721,
		708,
		757,
		837,
		842,
		843,
		844,
		825,
		834,
		846,
		847,
		810,
		812,
		849,
		850,
		851,
		739,
		523,
		785,
		784,
		769,
		852,
		746,
		801,
		773,
		772,
		759,
		758,
		731,
		758,
		842,
		732,
		788,
		779,
		829,
		778,
		777,
		804,
		718,
		807,
		853,
		854,
		855,
		856,
		853,
		858,
		798,
		839,
		838,
		860,
		861,
		862,
		830,
		787,
		754,
		694,
		837,
		819,
		818,
		828,
		791,
		766,
		859,
		822,
		821,
		863,
		781,
		780,
		783,
		784,
		786,
		865,
		866,
		867,
		835,
		778,
		703,
		846,
		869,
		870,
		831,
		834,
		845,
		873,
		862,
		874,
		547,
		548,
		715,
		875,
		876,
		865,
		850,
		874,
		862,
		876,
		878,
		866,
		824,
		737,
		736,
		786,
		785,
		775,
		869,
		873,
		872,
		706,
		720,
		555,
		834,
		833,
		867,
		820,
		848,
		880,
		882,
		773,
		883,
		884,
		885,
		886,
		776,
		884,
		764,
		884,
		776,
		887,
		888,
		868,
		844,
		777,
		818,
		817,
		864,
		786,
		826,
		702,
		756,
		809,
		874,
		850,
		741,
		821,
		810,
		848,
		850,
		861,
		890,
		845,
		847,
		854,
		771,
		891,
		795,
		863,
		893,
		760,
		459,
		571,
		856,
		895,
		896,
		897,
		808,
		898,
		899,
		716,
		853,
		797,
		825,
		832,
		889,
		800,
		900,
		901,
		847,
		870,
		855,
		846,
		867,
		866,
		870,
		872,
		902,
		343,
		701,
		706,
		580,
		425,
		764,
		817,
		880,
		805,
		581,
		717,
		715,
		580,
		886,
		857,
		877,
		865,
		868,
		897,
		903,
		904,
		906,
		907,
		771,
		781,
		863,
		892,
		892,
		760,
		759,
		855,
		902,
		894,
		868,
		867,
		833,
		729,
		909,
		887,
		911,
		591,
		590,
		848,
		849,
		912,
		785,
		523,
		440,
		780,
		913,
		727,
		757,
		760,
		893,
		738,
		739,
		851,
		808,
		756,
		417,
		789,
		829,
		876,
		725,
		915,
		914,
		896,
		895,
		917,
		730,
		887,
		776,
		763,
		918,
		751,
		844,
		833,
		832,
		783,
		864,
		729,
		767,
		920,
		921,
		858,
		897,
		905,
		807,
		895,
		858,
		866,
		878,
		873,
		871,
		887,
		909,
		829,
		830,
		878,
		831,
		909,
		889,
		720,
		717,
		581,
		894,
		766,
		791,
		820,
		819,
		839,
		915,
		860,
		838,
		913,
		780,
		779,
		922,
		734,
		733,
		921,
		920,
		743,
		864,
		889,
		909,
		916,
		917,
		912,
		745,
		748,
		762,
		582,
		857,
		856,
		684,
		881,
		923,
		782,
		781,
		890,
		924,
		903,
		925,
		766,
		894,
		902,
		719,
		705,
		827,
		714,
		797,
		796,
		610,
		913,
		788,
		879,
		736,
		734,
		896,
		925,
		903,
		822,
		787,
		753,
		682,
		904,
		903,
		898,
		808,
		597,
		860,
		755,
		754,
		726,
		725,
		893,
		871,
		845,
		885,
		806,
		827,
		912,
		900,
		707,
		711,
		859,
		754,
		787,
		799,
		901,
		900,
		612,
		843,
		774,
		773,
		801,
		901,
		761,
		927,
		928,
		854,
		857,
		886,
		929,
		930,
		721,
		799,
		798,
		905,
		932,
		933,
		769,
		677,
		934,
		812,
		935,
		932,
		768,
		916,
		849,
		812,
		698,
		727,
		622,
		936,
		929,
		803,
		878,
		830,
		862,
		624,
		888,
		843,
		930,
		937,
		722,
		457,
		789,
		875,
		626,
		875,
		877,
		933,
		938,
		852,
		777,
		732,
		842,
		806,
		917,
		895,
		939,
		935,
		921,
		722,
		937,
		631,
		925,
		896,
		916,
		904,
		682,
		681,
		772,
		940,
		936,
		931,
		883,
		901,
		880,
		912,
		827,
		851,
		890,
		892,
		622,
		727,
		913,
		908,
		759,
		735,
		915,
		723,
		755,
		837,
		757,
		914,
		809,
		899,
		700,
		923,
		881,
		883,
		872,
		874,
		765,
		852,
		938,
		940,
		707,
		900,
		800,
		627,
		877,
		888,
		932,
		941,
		942,
		943,
		944,
		930,
		945,
		943,
		929,
		840,
		841,
		946,
		935,
		948,
		941,
		944,
		949,
		937,
		725,
		724,
		723,
		933,
		942,
		950,
		939,
		951,
		948,
		644,
		939,
		744,
		645,
		951,
		939,
		952,
		945,
		936,
		949,
		647,
		631,
		938,
		950,
		952,
		954,
		750,
		749,
		927,
		955,
		956,
		926,
		925,
		934,
		905,
		904,
		923,
		955,
		957,
		958,
		960,
		793,
		792,
		958,
		957,
		814,
		961,
		962,
		911,
		963,
		964,
		659,
		947,
		946,
		962,
		965,
		966,
		967,
		954,
		953,
		966,
		968,
		967,
		964,
		678,
		752,
		969,
		679,
		969,
		918,
		918,
		763,
		971,
		971,
		763,
		762,
		762,
		748,
		685,
		748,
		747,
		686,
		746,
		852,
		907,
		973,
		686,
		747,
		750,
		954,
		927,
		954,
		965,
		955,
		965,
		968,
		957,
		957,
		968,
		963,
		814,
		963,
		658,
		751,
		918,
		969,
		969,
		752,
		689,
		689,
		816,
		749,
		816,
		840,
		953,
		840,
		947,
		966,
		966,
		947,
		961,
		967,
		961,
		910,
		910,
		590,
		659,
		891,
		771,
		773,
		881,
		684,
		974,
		882,
		974,
		975,
		891,
		975,
		976,
		795,
		976,
		977,
		907,
		906,
		978,
		960,
		959,
		978,
		745,
		928,
		770,
		928,
		956,
		767,
		956,
		958,
		920,
		920,
		958,
		813,
		813,
		482,
		403,
		794,
		793,
		960,
		979,
		980,
		326,
		982,
		983,
		984,
		984,
		983,
		985,
		688,
		987,
		988,
		815,
		988,
		989,
		841,
		989,
		990,
		990,
		991,
		962,
		991,
		992,
		911,
		992,
		993,
		591,
		591,
		993,
		994,
		592,
		994,
		995,
		656,
		995,
		996,
		996,
		997,
		511,
		997,
		979,
		487,
		979,
		998,
		999,
		999,
		1000,
		1001,
		1001,
		1000,
		1002,
		1002,
		1003,
		988,
		1003,
		1004,
		989,
		1004,
		1005,
		990,
		1005,
		1006,
		991,
		1006,
		1007,
		992,
		1007,
		1008,
		993,
		993,
		1008,
		1009,
		994,
		1009,
		1010,
		995,
		1010,
		1011,
		996,
		1011,
		1012,
		997,
		1012,
		998,
		375,
		388,
		1000,
		1000,
		388,
		387,
		385,
		384,
		1005,
		1005,
		384,
		383,
		1006,
		383,
		382,
		1007,
		382,
		381,
		381,
		380,
		1009,
		380,
		379,
		1010,
		379,
		378,
		1011,
		1011,
		378,
		377,
		985,
		983,
		1001,
		1001,
		983,
		982,
		981,
		984,
		332,
		332,
		984,
		986,
		1013,
		1015,
		1016,
		1034,
		1036,
		1033,
		1041,
		1043,
		1044,
		1045,
		1047,
		1048,
		1050,
		1052,
		1049,
		1053,
		1055,
		1056,
		1061,
		1063,
		1064,
		1070,
		1065,
		1069,
		1076,
		1069,
		1075,
		1084,
		1081,
		1083,
		1086,
		1083,
		1085,
		1049,
		1088,
		1087,
		1089,
		1051,
		1050,
		1092,
		1094,
		1091,
		1094,
		1096,
		1091,
		1013,
		1098,
		1097,
		1097,
		1099,
		1100,
		1126,
		1128,
		1125,
		1130,
		1132,
		1129,
		1134,
		1136,
		1133,
		1135,
		1138,
		1136,
		1137,
		1140,
		1138,
		1142,
		1045,
		1141,
		1144,
		1053,
		1143,
		1186,
		1188,
		1185,
		1190,
		1192,
		1189,
		1194,
		1196,
		1193,
		1204,
		1206,
		1203,
		1207,
		1093,
		1092,
		1210,
		1212,
		1209,
		1055,
		1145,
		1056,
		1141,
		1216,
		1142,
		1220,
		1222,
		1219,
		1226,
		1228,
		1225,
		1192,
		1194,
		1193,
		1014,
		1060,
		1015,
		1240,
		1242,
		1239,
		1242,
		1203,
		1239,
		1210,
		1267,
		1266,
		1211,
		1269,
		1212,
		1281,
		1283,
		1280,
		1143,
		1213,
		1144,
		1301,
		1303,
		1300,
		1130,
		1128,
		1131,
		1305,
		1307,
		1304,
		1132,
		1126,
		1129,
		1292,
		1208,
		1207,
		1088,
		1323,
		1087,
		1318,
		1063,
		1062,
		1345,
		1347,
		1344,
		1267,
		1268,
		1266,
		1205,
		1324,
		1206,
		1061,
		1281,
		1280,
		1047,
		1270,
		1048,
		1364,
		1134,
		1133,
		1301,
		1044,
		1043,
		1402,
		1404,
		1401,
		1190,
		1196,
		1195,
		1036,
		1347,
		1033,
		1346,
		1035,
		1034,
		1225,
		1401,
		1226,
		1228,
		1404,
		1403,
		1433,
		1185,
		1188,
		1220,
		1305,
		1304,
		1186,
		1436,
		1187,
		1221,
		1306,
		1222,
		1190,
		1194,
		1191,
		1433,
		1187,
		1436,
		1193,
		1189,
		1192,
		1345,
		1036,
		1035,
		1347,
		1034,
		1033,
		1041,
		1300,
		1303,
		1301,
		1042,
		1302,
		1226,
		1404,
		1227,
		1129,
		1125,
		1130,
		1132,
		1128,
		1127,
		1225,
		1403,
		1402,
		1266,
		1211,
		1210,
		1267,
		1212,
		1269,
		1305,
		1222,
		1306,
		1304,
		1221,
		1220,
		1186,
		1434,
		1435,
		1203,
		1240,
		1239,
		1052,
		1322,
		1088,
		1745,
		1334,
		1746,
		1747,
		1414,
		1748,
		1530,
		1745,
		1746,
		1327,
		1206,
		1324,
		1501,
		1747,
		1748,
		1202,
		1750,
		1749,
		1750,
		1379,
		1749,
		1275,
		1051,
		1090,
		1751,
		1338,
		1752,
		1400,
		1751,
		1752,
		1540,
		1776,
		1541,
		1507,
		1778,
		1508,
		1393,
		1776,
		1775,
		1278,
		1778,
		1777,
		1779,
		1719,
		1718,
		1781,
		1607,
		1606,
		1381,
		1779,
		1692,
		1385,
		1781,
		1661,
		1783,
		1705,
		1784,
		1785,
		1703,
		1786,
		1178,
		1783,
		1784,
		1390,
		1785,
		1786,
		1789,
		1458,
		1790,
		1791,
		1524,
		1792,
		1639,
		1789,
		1790,
		1590,
		1791,
		1792,
		1793,
		1377,
		1378,
		1795,
		1262,
		1265,
		1797,
		1258,
		1261,
		1799,
		1531,
		1534,
		1793,
		1376,
		1794,
		1795,
		1666,
		1796,
		1799,
		1536,
		1800,
		1797,
		1511,
		1798,
		1787,
		1761,
		1762,
		1788,
		1759,
		1760,
		1787,
		1682,
		1681,
		1788,
		1657,
		1656,
		1787,
		1762,
		1772,
		1606,
		1661,
		1781,
		1529,
		1335,
		1745,
		1778,
		1277,
		1508,
		1638,
		1498,
		1789,
		1385,
		1607,
		1782,
		1334,
		1530,
		1746,
		1777,
		1507,
		1278,
		1458,
		1639,
		1790,
		1399,
		1339,
		1751,
		1793,
		1378,
		1373,
		1389,
		1704,
		1785,
		1797,
		1261,
		1510,
		1788,
		1760,
		1771,
		1718,
		1692,
		1779,
		1500,
		1417,
		1747,
		1776,
		1392,
		1541,
		1589,
		1582,
		1791,
		1381,
		1719,
		1780,
		1414,
		1501,
		1748,
		1775,
		1540,
		1393,
		1524,
		1590,
		1792,
		1201,
		1380,
		1750,
		1795,
		1265,
		1632,
		1177,
		1706,
		1783,
		1799,
		1534,
		1535,
		1435,
		1433,
		1436,
		1302,
		1041,
		1303,
		1013,
		1014,
		1015,
		1034,
		1035,
		1036,
		1041,
		1042,
		1043,
		1045,
		1046,
		1047,
		1050,
		1051,
		1052,
		1053,
		1054,
		1055,
		1061,
		1062,
		1063,
		1070,
		1066,
		1065,
		1076,
		1070,
		1069,
		1084,
		1082,
		1081,
		1086,
		1084,
		1083,
		1049,
		1052,
		1088,
		1089,
		1090,
		1051,
		1092,
		1093,
		1094,
		1094,
		1095,
		1096,
		1013,
		1016,
		1098,
		1097,
		1098,
		1099,
		1126,
		1127,
		1128,
		1130,
		1131,
		1132,
		1134,
		1135,
		1136,
		1135,
		1137,
		1138,
		1137,
		1139,
		1140,
		1142,
		1046,
		1045,
		1144,
		1054,
		1053,
		1186,
		1187,
		1188,
		1190,
		1191,
		1192,
		1194,
		1195,
		1196,
		1204,
		1205,
		1206,
		1207,
		1208,
		1093,
		1210,
		1211,
		1212,
		1055,
		1146,
		1145,
		1141,
		1215,
		1216,
		1220,
		1221,
		1222,
		1226,
		1227,
		1228,
		1192,
		1191,
		1194,
		1014,
		1057,
		1060,
		1240,
		1241,
		1242,
		1242,
		1204,
		1203,
		1210,
		1209,
		1267,
		1211,
		1268,
		1269,
		1281,
		1282,
		1283,
		1143,
		1214,
		1213,
		1301,
		1302,
		1303,
		1130,
		1125,
		1128,
		1305,
		1306,
		1307,
		1132,
		1127,
		1126,
		1292,
		1295,
		1208,
		1088,
		1322,
		1323,
		1318,
		1321,
		1063,
		1345,
		1346,
		1347,
		1267,
		1269,
		1268,
		1205,
		1325,
		1324,
		1061,
		1064,
		1281,
		1047,
		1271,
		1270,
		1364,
		1365,
		1134,
		1301,
		1300,
		1044,
		1402,
		1403,
		1404,
		1190,
		1189,
		1196,
		1036,
		1344,
		1347,
		1346,
		1345,
		1035,
		1225,
		1402,
		1401,
		1228,
		1227,
		1404,
		1433,
		1434,
		1185,
		1220,
		1219,
		1305,
		1186,
		1435,
		1436,
		1221,
		1307,
		1306,
		1190,
		1195,
		1194,
		1433,
		1188,
		1187,
		1193,
		1196,
		1189,
		1345,
		1344,
		1036,
		1347,
		1346,
		1034,
		1041,
		1044,
		1300,
		1301,
		1043,
		1042,
		1226,
		1401,
		1404,
		1129,
		1126,
		1125,
		1132,
		1131,
		1128,
		1225,
		1228,
		1403,
		1266,
		1268,
		1211,
		1267,
		1209,
		1212,
		1305,
		1219,
		1222,
		1304,
		1307,
		1221,
		1186,
		1185,
		1434,
		1203,
		1327,
		1240,
		1052,
		1275,
		1322,
		1745,
		1335,
		1334,
		1747,
		1417,
		1414,
		1530,
		1529,
		1745,
		1327,
		1203,
		1206,
		1501,
		1500,
		1747,
		1202,
		1201,
		1750,
		1750,
		1380,
		1379,
		1275,
		1052,
		1051,
		1751,
		1339,
		1338,
		1400,
		1399,
		1751,
		1540,
		1775,
		1776,
		1507,
		1777,
		1778,
		1393,
		1392,
		1776,
		1278,
		1277,
		1778,
		1779,
		1780,
		1719,
		1781,
		1782,
		1607,
		1381,
		1780,
		1779,
		1385,
		1782,
		1781,
		1783,
		1706,
		1705,
		1785,
		1704,
		1703,
		1178,
		1177,
		1783,
		1390,
		1389,
		1785,
		1789,
		1498,
		1458,
		1791,
		1582,
		1524,
		1639,
		1638,
		1789,
		1590,
		1589,
		1791,
		1793,
		1794,
		1377,
		1795,
		1796,
		1262,
		1797,
		1798,
		1258,
		1799,
		1800,
		1531,
		1793,
		1373,
		1376,
		1795,
		1632,
		1666,
		1799,
		1535,
		1536,
		1797,
		1510,
		1511,
		1787,
		1681,
		1761,
		1788,
		1656,
		1759,
		1787,
		1764,
		1682,
		1788,
		1766,
		1657,
		1435,
		1434,
		1433,
		1302,
		1042,
		1041,
		1018,
		1020,
		1017,
		1022,
		1024,
		1021,
		1026,
		1028,
		1025,
		1030,
		1032,
		1029,
		1038,
		1040,
		1037,
		1057,
		1059,
		1060,
		1066,
		1068,
		1065,
		1072,
		1074,
		1071,
		1078,
		1080,
		1077,
		1082,
		1077,
		1081,
		1102,
		1104,
		1101,
		1106,
		1108,
		1105,
		1110,
		1112,
		1109,
		1114,
		1116,
		1113,
		1118,
		1120,
		1117,
		1122,
		1124,
		1121,
		1145,
		1147,
		1148,
		1150,
		1152,
		1149,
		1154,
		1149,
		1153,
		1156,
		1158,
		1155,
		1160,
		1162,
		1159,
		1164,
		1166,
		1163,
		1167,
		1169,
		1170,
		1030,
		1172,
		1031,
		1174,
		1037,
		1173,
		1175,
		1177,
		1178,
		1180,
		1173,
		1179,
		1181,
		1180,
		1179,
		1184,
		1181,
		1183,
		1067,
		1198,
		1068,
		1200,
		1202,
		1199,
		1148,
		1213,
		1214,
		1105,
		1218,
		1217,
		1139,
		1224,
		1140,
		1217,
		1111,
		1110,
		1019,
		1183,
		1020,
		1040,
		1172,
		1171,
		1071,
		1230,
		1229,
		1163,
		1232,
		1231,
		1116,
		1119,
		1118,
		1233,
		1123,
		1122,
		1235,
		1152,
		1151,
		1237,
		1027,
		1026,
		1157,
		1153,
		1158,
		1243,
		1181,
		1244,
		1245,
		1149,
		1246,
		1248,
		1121,
		1247,
		1249,
		1158,
		1250,
		1244,
		1179,
		1251,
		1249,
		1253,
		1252,
		1254,
		1256,
		1257,
		1079,
		1085,
		1080,
		1258,
		1260,
		1261,
		1263,
		1265,
		1262,
		1197,
		1075,
		1198,
		1271,
		1273,
		1270,
		1089,
		1275,
		1090,
		1277,
		1279,
		1276,
		1284,
		1286,
		1287,
		1103,
		1289,
		1104,
		1291,
		1113,
		1290,
		1292,
		1294,
		1295,
		1297,
		1299,
		1296,
		1309,
		1311,
		1308,
		1313,
		1315,
		1312,
		1316,
		1315,
		1314,
		1316,
		1290,
		1317,
		1288,
		1308,
		1289,
		1319,
		1321,
		1318,
		1096,
		1294,
		1293,
		1324,
		1326,
		1327,
		1328,
		1330,
		1331,
		1328,
		1333,
		1332,
		1279,
		1335,
		1276,
		1336,
		1338,
		1339,
		1340,
		1342,
		1343,
		1117,
		1349,
		1348,
		1164,
		1032,
		1165,
		1231,
		1351,
		1350,
		1353,
		1355,
		1352,
		1350,
		1357,
		1356,
		1359,
		1361,
		1358,
		1018,
		1023,
		1022,
		1363,
		1352,
		1362,
		1109,
		1359,
		1358,
		1257,
		1105,
		1217,
		1319,
		1282,
		1320,
		1274,
		1322,
		1275,
		1327,
		1241,
		1240,
		1272,
		1215,
		1273,
		1100,
		1059,
		1058,
		1366,
		1368,
		1369,
		1370,
		1372,
		1366,
		1374,
		1376,
		1373,
		1337,
		1378,
		1377,
		1264,
		1379,
		1380,
		1381,
		1383,
		1384,
		1385,
		1387,
		1388,
		1375,
		1389,
		1390,
		1392,
		1394,
		1391,
		1168,
		1396,
		1169,
		1398,
		1400,
		1397,
		1025,
		1236,
		1235,
		1348,
		1234,
		1233,
		1161,
		1155,
		1162,
		1357,
		1159,
		1356,
		1121,
		1355,
		1354,
		1149,
		1405,
		1246,
		1159,
		1407,
		1406,
		1223,
		1364,
		1224,
		1408,
		1284,
		1410,
		1411,
		1340,
		1413,
		1394,
		1416,
		1414,
		1394,
		1417,
		1391,
		1254,
		1419,
		1418,
		1421,
		1422,
		1420,
		1424,
		1426,
		1423,
		1427,
		1429,
		1430,
		1298,
		1432,
		1299,
		1027,
		1409,
		1408,
		1309,
		1413,
		1310,
		1437,
		1439,
		1440,
		1442,
		1444,
		1441,
		1446,
		1448,
		1445,
		1449,
		1255,
		1254,
		1451,
		1453,
		1454,
		1455,
		1296,
		1457,
		1459,
		1461,
		1458,
		1462,
		1451,
		1464,
		1466,
		1468,
		1465,
		1020,
		1243,
		1469,
		1037,
		1471,
		1470,
		1356,
		1406,
		1421,
		1473,
		1475,
		1472,
		1476,
		1478,
		1437,
		1480,
		1482,
		1479,
		1407,
		1155,
		1249,
		1425,
		1358,
		1426,
		1483,
		1485,
		1486,
		1487,
		1471,
		1489,
		1491,
		1492,
		1490,
		1493,
		1495,
		1496,
		1459,
		1498,
		1497,
		1382,
		1500,
		1501,
		1502,
		1474,
		1473,
		1504,
		1428,
		1427,
		1507,
		1509,
		1506,
		1510,
		1397,
		1511,
		1512,
		1514,
		1248,
		1515,
		1489,
		1516,
		1405,
		1518,
		1519,
		1238,
		1521,
		1409,
		1255,
		1522,
		1256,
		1465,
		1523,
		1443,
		1525,
		1527,
		1524,
		1386,
		1529,
		1530,
		1531,
		1533,
		1534,
		1409,
		1285,
		1284,
		1535,
		1199,
		1536,
		1360,
		1538,
		1361,
		1017,
		1469,
		1491,
		1539,
		1541,
		1542,
		1383,
		1380,
		1384,
		1544,
		1490,
		1543,
		1253,
		1245,
		1545,
		1547,
		1549,
		1546,
		1453,
		1551,
		1454,
		1552,
		1445,
		1450,
		1329,
		1170,
		1330,
		1545,
		1556,
		1554,
		1410,
		1547,
		1557,
		1559,
		1543,
		1561,
		1562,
		1564,
		1565,
		1387,
		1339,
		1388,
		1567,
		1569,
		1566,
		1558,
		1548,
		1547,
		1572,
		1574,
		1571,
		1310,
		1575,
		1576,
		1279,
		1578,
		1334,
		1256,
		1106,
		1105,
		1580,
		1117,
		1579,
		1525,
		1582,
		1581,
		1517,
		1557,
		1518,
		1584,
		1586,
		1587,
		1462,
		1423,
		1426,
		1420,
		1588,
		1421,
		1542,
		1590,
		1539,
		1247,
		1354,
		1586,
		1236,
		1405,
		1152,
		1494,
		1452,
		1591,
		1592,
		1288,
		1103,
		1341,
		1595,
		1342,
		1496,
		1568,
		1567,
		1286,
		1597,
		1287,
		1598,
		1550,
		1453,
		1598,
		1566,
		1599,
		1425,
		1110,
		1109,
		1489,
		1040,
		1171,
		1600,
		1117,
		1348,
		1250,
		1153,
		1245,
		1173,
		1470,
		1601,
		1520,
		1602,
		1521,
		1583,
		1410,
		1557,
		1585,
		1247,
		1586,
		1472,
		1371,
		1370,
		1496,
		1505,
		1504,
		1575,
		1363,
		1576,
		1578,
		1374,
		1373,
		1593,
		1412,
		1411,
		1607,
		1497,
		1606,
		1540,
		1608,
		1609,
		1028,
		1408,
		1583,
		1610,
		1163,
		1231,
		1484,
		1516,
		1485,
		1613,
		1615,
		1612,
		1612,
		1617,
		1616,
		1447,
		1522,
		1448,
		1246,
		1519,
		1555,
		1619,
		1486,
		1611,
		1449,
		1418,
		1620,
		1621,
		1513,
		1512,
		1537,
		1312,
		1538,
		1614,
		1484,
		1615,
		1072,
		1623,
		1073,
		1466,
		1430,
		1467,
		1431,
		1625,
		1432,
		1626,
		1252,
		1628,
		1629,
		1631,
		1456,
		1288,
		1411,
		1309,
		1416,
		1176,
		1632,
		1495,
		1290,
		1505,
		1251,
		1173,
		1601,
		1514,
		1122,
		1248,
		1312,
		1463,
		1538,
		1602,
		1543,
		1560,
		1545,
		1246,
		1555,
		1468,
		1580,
		1579,
		1298,
		1470,
		1431,
		1507,
		1633,
		1634,
		1485,
		1030,
		1029,
		1562,
		1610,
		1588,
		1584,
		1604,
		1635,
		1447,
		1637,
		1618,
		1526,
		1535,
		1527,
		1509,
		1639,
		1506,
		1640,
		1641,
		1642,
		1229,
		1481,
		1480,
		1332,
		1503,
		1502,
		1460,
		1510,
		1461,
		1463,
		1452,
		1451,
		1420,
		1563,
		1562,
		1644,
		1585,
		1584,
		1427,
		1624,
		1645,
		1315,
		1591,
		1312,
		1419,
		1217,
		1110,
		1395,
		1646,
		1396,
		1430,
		1580,
		1467,
		1561,
		1490,
		1647,
		1621,
		1603,
		1573,
		1450,
		1448,
		1255,
		1648,
		1545,
		1554,
		1317,
		1494,
		1315,
		1164,
		1485,
		1029,
		1163,
		1486,
		1164,
		1649,
		1563,
		1643,
		1571,
		1644,
		1651,
		1653,
		1617,
		1652,
		1655,
		1657,
		1654,
		1647,
		1660,
		1658,
		1385,
		1528,
		1386,
		1479,
		1663,
		1662,
		1622,
		1665,
		1623,
		1531,
		1666,
		1532,
		1519,
		1546,
		1667,
		1636,
		1669,
		1670,
		1625,
		1487,
		1671,
		1377,
		1511,
		1337,
		1262,
		1536,
		1263,
		1432,
		1673,
		1672,
		1561,
		1658,
		1674,
		1673,
		1671,
		1675,
		1645,
		1677,
		1676,
		1451,
		1678,
		1464,
		1028,
		1517,
		1236,
		1366,
		1646,
		1367,
		1258,
		1376,
		1259,
		1680,
		1682,
		1679,
		1684,
		1686,
		1683,
		1328,
		1687,
		1688,
		1407,
		1252,
		1627,
		1470,
		1488,
		1431,
		1356,
		1588,
		1350,
		1573,
		1585,
		1574,
		1586,
		1353,
		1587,
		1176,
		1666,
		1632,
		1668,
		1447,
		1446,
		1243,
		1631,
		1630,
		1544,
		1017,
		1491,
		1429,
		1118,
		1580,
		1423,
		1678,
		1689,
		1664,
		1642,
		1665,
		1071,
		1690,
		1691,
		1381,
		1499,
		1382,
		1358,
		1462,
		1426,
		1693,
		1343,
		1342,
		1670,
		1694,
		1605,
		1670,
		1593,
		1592,
		1693,
		1584,
		1635,
		1555,
		1667,
		1556,
		1643,
		1696,
		1649,
		1697,
		1669,
		1668,
		1689,
		1699,
		1700,
		1701,
		1238,
		1237,
		1310,
		1702,
		1311,
		1514,
		1348,
		1233,
		1418,
		1425,
		1424,
		1244,
		1297,
		1631,
		1259,
		1704,
		1260,
		1532,
		1706,
		1533,
		1468,
		1600,
		1523,
		1598,
		1496,
		1567,
		1617,
		1484,
		1483,
		1557,
		1546,
		1518,
		1456,
		1297,
		1296,
		1637,
		1103,
		1102,
		1475,
		1276,
		1335,
		1437,
		1641,
		1438,
		1622,
		1683,
		1664,
		1504,
		1645,
		1568,
		1444,
		1523,
		1513,
		1576,
		1362,
		1702,
		1021,
		1520,
		1701,
		1472,
		1679,
		1473,
		1505,
		1113,
		1428,
		1251,
		1298,
		1297,
		1413,
		1343,
		1575,
		1608,
		1706,
		1609,
		1707,
		1689,
		1700,
		1677,
		1466,
		1709,
		1711,
		1620,
		1710,
		1712,
		1594,
		1341,
		1563,
		1714,
		1564,
		1420,
		1695,
		1643,
		1662,
		1477,
		1476,
		1715,
		1107,
		1106,
		1516,
		1171,
		1030,
		1671,
		1515,
		1614,
		1490,
		1659,
		1647,
		1296,
		1717,
		1457,
		1522,
		1715,
		1106,
		1637,
		1670,
		1592,
		1719,
		1581,
		1718,
		1102,
		1716,
		1715,
		1602,
		1023,
		1544,
		1663,
		1391,
		1417,
		1633,
		1704,
		1634,
		1452,
		1598,
		1453,
		1708,
		1423,
		1689,
		1620,
		1424,
		1708,
		1361,
		1463,
		1462,
		1386,
		1720,
		1387,
		1604,
		1353,
		1363,
		1721,
		1443,
		1442,
		1350,
		1610,
		1231,
		1565,
		1611,
		1610,
		1492,
		1629,
		1659,
		1722,
		1632,
		1265,
		1521,
		1560,
		1285,
		1723,
		1712,
		1694,
		1722,
		1414,
		1416,
		1167,
		1725,
		1168,
		1720,
		1334,
		1578,
		1382,
		1722,
		1383,
		1422,
		1407,
		1627,
		1492,
		1243,
		1630,
		1252,
		1648,
		1628,
		1724,
		1727,
		1725,
		1618,
		1102,
		1715,
		1603,
		1248,
		1247,
		1564,
		1653,
		1652,
		1720,
		1336,
		1387,
		1412,
		1341,
		1340,
		1422,
		1626,
		1695,
		1628,
		1729,
		1728,
		1722,
		1264,
		1383,
		1428,
		1116,
		1429,
		1720,
		1373,
		1378,
		1278,
		1577,
		1279,
		1410,
		1287,
		1558,
		1662,
		1654,
		1479,
		1577,
		1389,
		1374,
		1731,
		1667,
		1732,
		1565,
		1652,
		1619,
		1286,
		1560,
		1559,
		1169,
		1498,
		1170,
		1441,
		1621,
		1733,
		1629,
		1455,
		1734,
		1678,
		1551,
		1699,
		1372,
		1661,
		1646,
		1343,
		1604,
		1575,
		1513,
		1600,
		1514,
		1393,
		1415,
		1394,
		1665,
		1582,
		1623,
		1478,
		1692,
		1641,
		1596,
		1559,
		1736,
		1261,
		1461,
		1510,
		1553,
		1446,
		1445,
		1719,
		1384,
		1739,
		1384,
		1201,
		1739,
		1607,
		1388,
		1740,
		1651,
		1693,
		1741,
		1388,
		1399,
		1740,
		1742,
		1556,
		1731,
		1721,
		1466,
		1465,
		1717,
		1432,
		1672,
		1698,
		1694,
		1669,
		1287,
		1570,
		1558,
		1697,
		1446,
		1738,
		1707,
		1620,
		1708,
		1534,
		1527,
		1535,
		1694,
		1412,
		1605,
		1626,
		1728,
		1744,
		1660,
		1629,
		1734,
		1696,
		1626,
		1744,
		1415,
		1177,
		1176,
		1333,
		1509,
		1508,
		1652,
		1483,
		1619,
		1074,
		1541,
		1230,
		1743,
		1533,
		1608,
		1559,
		1674,
		1736,
		1737,
		1260,
		1633,
		1552,
		1449,
		1711,
		1648,
		1742,
		1729,
		1595,
		1693,
		1342,
		1667,
		1549,
		1732,
		1569,
		1645,
		1676,
		1613,
		1671,
		1614,
		1572,
		1621,
		1573,
		1460,
		1399,
		1398,
		1461,
		1639,
		1458,
		1539,
		1743,
		1608,
		1527,
		1590,
		1524,
		1506,
		1737,
		1633,
		1735,
		1540,
		1609,
		1730,
		1507,
		1634,
		1607,
		1460,
		1459,
		1526,
		1201,
		1200,
		1096,
		1092,
		1091,
		1093,
		1095,
		1094,
		1045,
		1215,
		1141,
		1241,
		1204,
		1242,
		1064,
		1282,
		1281,
		1283,
		1061,
		1280,
		1216,
		1046,
		1142,
		1100,
		1013,
		1097,
		1213,
		1054,
		1144,
		1016,
		1099,
		1098,
		1365,
		1135,
		1134,
		1136,
		1364,
		1133,
		1323,
		1049,
		1087,
		1053,
		1214,
		1143,
		1735,
		1706,
		1177,
		1719,
		1526,
		1525,
		1730,
		1704,
		1389,
		1294,
		1208,
		1295,
		1293,
		1207,
		1092,
		1326,
		1205,
		1204,
		1147,
		1055,
		1054,
		1058,
		1014,
		1013,
		1059,
		1015,
		1060,
		1274,
		1050,
		1049,
		1148,
		1056,
		1145,
		1273,
		1048,
		1270,
		1320,
		1063,
		1321,
		1272,
		1047,
		1046,
		1319,
		1062,
		1061,
		1224,
		1138,
		1140,
		1223,
		1137,
		1135,
		1606,
		1646,
		1661,
		1482,
		1392,
		1391,
		1479,
		1753,
		1480,
		1718,
		1641,
		1692,
		1477,
		1417,
		1500,
		1371,
		1335,
		1529,
		1474,
		1277,
		1276,
		1473,
		1754,
		1502,
		1370,
		1369,
		1755,
		1477,
		1499,
		1478,
		1371,
		1528,
		1372,
		1472,
		1755,
		1680,
		1476,
		1440,
		1756,
		1438,
		1757,
		1439,
		1367,
		1758,
		1368,
		1662,
		1756,
		1655,
		1655,
		1759,
		1656,
		1756,
		1760,
		1759,
		1680,
		1761,
		1681,
		1755,
		1762,
		1761,
		1167,
		1763,
		1724,
		1329,
		1688,
		1763,
		1679,
		1764,
		1754,
		1072,
		1691,
		1765,
		1622,
		1765,
		1684,
		1170,
		1638,
		1330,
		1623,
		1589,
		1073,
		1330,
		1509,
		1331,
		1654,
		1766,
		1753,
		1073,
		1542,
		1074,
		1229,
		1753,
		1690,
		1664,
		1757,
		1640,
		1332,
		1754,
		1687,
		1168,
		1758,
		1395,
		1684,
		1767,
		1685,
		1724,
		1768,
		1726,
		1763,
		1769,
		1768,
		1765,
		1770,
		1767,
		1259,
		1375,
		1703,
		1532,
		1175,
		1705,
		1263,
		1199,
		1379,
		1337,
		1397,
		1338,
		1169,
		1606,
		1497,
		1665,
		1718,
		1581,
		1541,
		1481,
		1230,
		1508,
		1503,
		1333,
		1683,
		1771,
		1757,
		1725,
		1772,
		1758,
		1069,
		1068,
		1198,
		1083,
		1077,
		1080,
		1078,
		1084,
		1079,
		1067,
		1070,
		1197,
		1021,
		1773,
		1022,
		1774,
		1114,
		1291,
		1774,
		1362,
		1352,
		1774,
		1120,
		1119,
		1174,
		1773,
		1038,
		1039,
		1773,
		1172,
		1774,
		1716,
		1101,
		1151,
		1773,
		1235,
		1154,
		1773,
		1150,
		1160,
		1773,
		1161,
		1774,
		1112,
		1111,
		1232,
		1773,
		1351,
		1774,
		1124,
		1123,
		1019,
		1773,
		1184,
		1774,
		1316,
		1314,
		1032,
		1773,
		1165,
		1774,
		1218,
		1108,
		1774,
		1313,
		1537,
		1774,
		1308,
		1311,
		1237,
		1773,
		1701,
		1774,
		1234,
		1349,
		1156,
		1773,
		1157,
		1182,
		1773,
		1180,
		1774,
		1104,
		1289,
		1774,
		1360,
		1359,
		1773,
		1025,
		1235,
		1769,
		1764,
		1787,
		1770,
		1766,
		1788,
		1738,
		1801,
		1697,
		1802,
		1736,
		1674,
		1802,
		1734,
		1455,
		1733,
		1801,
		1441,
		1710,
		1801,
		1711,
		1741,
		1801,
		1651,
		1802,
		1732,
		1549,
		1802,
		1744,
		1728,
		1676,
		1801,
		1569,
		1699,
		1801,
		1700,
		1802,
		1675,
		1613,
		1801,
		1713,
		1723,
		1802,
		1729,
		1742,
		1442,
		1801,
		1721,
		1802,
		1650,
		1649,
		1599,
		1801,
		1550,
		1709,
		1801,
		1677,
		1802,
		1597,
		1596,
		1802,
		1616,
		1653,
		1802,
		1457,
		1717,
		1802,
		1672,
		1673,
		1548,
		1802,
		1549,
		1802,
		1658,
		1660,
		1571,
		1801,
		1572,
		1698,
		1801,
		1723,
		1552,
		1801,
		1553,
		1368,
		1762,
		1369,
		1439,
		1760,
		1440,
		1788,
		1686,
		1685,
		1787,
		1727,
		1726,
		1767,
		1788,
		1685,
		1768,
		1787,
		1726,
		1083,
		1080,
		1085,
		1079,
		1084,
		1086,
		1069,
		1198,
		1075,
		1197,
		1070,
		1076,
		1022,
		1773,
		1018,
		1172,
		1773,
		1031,
		1613,
		1612,
		1802,
		1165,
		1773,
		1166,
		1653,
		1714,
		1802,
		1351,
		1773,
		1357,
		1649,
		1696,
		1802,
		1742,
		1731,
		1802,
		1801,
		1595,
		1594,
		1702,
		1774,
		1311,
		1355,
		1774,
		1352,
		1115,
		1774,
		1119,
		1801,
		1566,
		1569,
		1801,
		1551,
		1550,
		1801,
		1707,
		1700,
		1107,
		1774,
		1108,
		1338,
		1400,
		1752,
		1769,
		1688,
		1687,
		1764,
		1687,
		1754,
		1772,
		1368,
		1758,
		1703,
		1390,
		1786,
		1794,
		1376,
		1377,
		1798,
		1511,
		1258,
		1375,
		1390,
		1703,
		1338,
		1397,
		1400,
		1379,
		1202,
		1749,
		1770,
		1691,
		1690,
		1766,
		1690,
		1753,
		1771,
		1439,
		1757,
		1705,
		1178,
		1784,
		1796,
		1666,
		1262,
		1800,
		1536,
		1531,
		1175,
		1178,
		1705,
		1379,
		1199,
		1202,
		1018,
		1019,
		1020,
		1022,
		1023,
		1024,
		1026,
		1027,
		1028,
		1030,
		1031,
		1032,
		1038,
		1039,
		1040,
		1057,
		1058,
		1059,
		1066,
		1067,
		1068,
		1072,
		1073,
		1074,
		1078,
		1079,
		1080,
		1082,
		1078,
		1077,
		1102,
		1103,
		1104,
		1106,
		1107,
		1108,
		1110,
		1111,
		1112,
		1114,
		1115,
		1116,
		1118,
		1119,
		1120,
		1122,
		1123,
		1124,
		1145,
		1146,
		1147,
		1150,
		1151,
		1152,
		1154,
		1150,
		1149,
		1156,
		1157,
		1158,
		1160,
		1161,
		1162,
		1164,
		1165,
		1166,
		1167,
		1168,
		1169,
		1030,
		1171,
		1172,
		1174,
		1038,
		1037,
		1175,
		1176,
		1177,
		1180,
		1174,
		1173,
		1181,
		1182,
		1180,
		1184,
		1182,
		1181,
		1067,
		1197,
		1198,
		1200,
		1201,
		1202,
		1148,
		1147,
		1213,
		1105,
		1108,
		1218,
		1139,
		1223,
		1224,
		1217,
		1218,
		1111,
		1019,
		1184,
		1183,
		1040,
		1039,
		1172,
		1071,
		1074,
		1230,
		1163,
		1166,
		1232,
		1116,
		1115,
		1119,
		1233,
		1234,
		1123,
		1235,
		1236,
		1152,
		1237,
		1238,
		1027,
		1157,
		1154,
		1153,
		1243,
		1183,
		1181,
		1245,
		1153,
		1149,
		1248,
		1122,
		1121,
		1249,
		1155,
		1158,
		1244,
		1181,
		1179,
		1249,
		1250,
		1253,
		1254,
		1255,
		1256,
		1079,
		1086,
		1085,
		1258,
		1259,
		1260,
		1263,
		1264,
		1265,
		1197,
		1076,
		1075,
		1271,
		1272,
		1273,
		1089,
		1274,
		1275,
		1277,
		1278,
		1279,
		1284,
		1285,
		1286,
		1103,
		1288,
		1289,
		1291,
		1114,
		1113,
		1292,
		1293,
		1294,
		1297,
		1298,
		1299,
		1309,
		1310,
		1311,
		1313,
		1314,
		1315,
		1316,
		1317,
		1315,
		1316,
		1291,
		1290,
		1288,
		1309,
		1308,
		1319,
		1320,
		1321,
		1096,
		1095,
		1294,
		1324,
		1325,
		1326,
		1328,
		1329,
		1330,
		1328,
		1331,
		1333,
		1279,
		1334,
		1335,
		1336,
		1337,
		1338,
		1340,
		1341,
		1342,
		1117,
		1120,
		1349,
		1164,
		1029,
		1032,
		1231,
		1232,
		1351,
		1353,
		1354,
		1355,
		1350,
		1351,
		1357,
		1359,
		1360,
		1361,
		1018,
		1017,
		1023,
		1363,
		1353,
		1352,
		1109,
		1112,
		1359,
		1257,
		1256,
		1105,
		1319,
		1283,
		1282,
		1274,
		1323,
		1322,
		1327,
		1326,
		1241,
		1272,
		1216,
		1215,
		1100,
		1099,
		1059,
		1366,
		1367,
		1368,
		1370,
		1371,
		1372,
		1374,
		1375,
		1376,
		1337,
		1336,
		1378,
		1264,
		1263,
		1379,
		1381,
		1382,
		1383,
		1385,
		1386,
		1387,
		1375,
		1374,
		1389,
		1392,
		1393,
		1394,
		1168,
		1395,
		1396,
		1398,
		1399,
		1400,
		1025,
		1028,
		1236,
		1348,
		1349,
		1234,
		1161,
		1156,
		1155,
		1357,
		1160,
		1159,
		1121,
		1124,
		1355,
		1149,
		1152,
		1405,
		1159,
		1162,
		1407,
		1223,
		1365,
		1364,
		1408,
		1409,
		1284,
		1411,
		1412,
		1340,
		1394,
		1415,
		1416,
		1394,
		1414,
		1417,
		1254,
		1257,
		1419,
		1421,
		1406,
		1422,
		1424,
		1425,
		1426,
		1427,
		1428,
		1429,
		1298,
		1431,
		1432,
		1027,
		1238,
		1409,
		1309,
		1411,
		1413,
		1437,
		1438,
		1439,
		1442,
		1443,
		1444,
		1446,
		1447,
		1448,
		1449,
		1450,
		1255,
		1451,
		1452,
		1453,
		1455,
		1456,
		1296,
		1459,
		1460,
		1461,
		1462,
		1463,
		1451,
		1466,
		1467,
		1468,
		1020,
		1183,
		1243,
		1037,
		1040,
		1471,
		1356,
		1159,
		1406,
		1473,
		1474,
		1475,
		1476,
		1477,
		1478,
		1480,
		1481,
		1482,
		1407,
		1162,
		1155,
		1425,
		1109,
		1358,
		1483,
		1484,
		1485,
		1487,
		1488,
		1471,
		1491,
		1469,
		1492,
		1493,
		1494,
		1495,
		1459,
		1458,
		1498,
		1382,
		1499,
		1500,
		1502,
		1503,
		1474,
		1504,
		1505,
		1428,
		1507,
		1508,
		1509,
		1510,
		1398,
		1397,
		1512,
		1513,
		1514,
		1515,
		1487,
		1489,
		1405,
		1517,
		1518,
		1238,
		1520,
		1521,
		1255,
		1448,
		1522,
		1465,
		1468,
		1523,
		1525,
		1526,
		1527,
		1386,
		1528,
		1529,
		1531,
		1532,
		1533,
		1409,
		1521,
		1285,
		1535,
		1200,
		1199,
		1360,
		1537,
		1538,
		1017,
		1020,
		1469,
		1539,
		1540,
		1541,
		1383,
		1264,
		1380,
		1544,
		1491,
		1490,
		1253,
		1250,
		1245,
		1547,
		1548,
		1549,
		1453,
		1550,
		1551,
		1552,
		1553,
		1445,
		1329,
		1167,
		1170,
		1545,
		1555,
		1556,
		1410,
		1558,
		1547,
		1559,
		1560,
		1543,
		1562,
		1563,
		1564,
		1387,
		1336,
		1339,
		1567,
		1568,
		1569,
		1558,
		1570,
		1548,
		1572,
		1573,
		1574,
		1310,
		1413,
		1575,
		1279,
		1577,
		1578,
		1256,
		1522,
		1106,
		1580,
		1118,
		1117,
		1525,
		1524,
		1582,
		1517,
		1583,
		1557,
		1584,
		1585,
		1586,
		1462,
		1464,
		1423,
		1420,
		1562,
		1588,
		1542,
		1589,
		1590,
		1247,
		1121,
		1354,
		1236,
		1517,
		1405,
		1494,
		1493,
		1452,
		1592,
		1593,
		1288,
		1341,
		1594,
		1595,
		1496,
		1504,
		1568,
		1286,
		1596,
		1597,
		1598,
		1599,
		1550,
		1598,
		1567,
		1566,
		1425,
		1419,
		1110,
		1489,
		1471,
		1040,
		1600,
		1579,
		1117,
		1250,
		1158,
		1153,
		1173,
		1037,
		1470,
		1520,
		1024,
		1602,
		1583,
		1408,
		1410,
		1585,
		1603,
		1247,
		1472,
		1475,
		1371,
		1496,
		1495,
		1505,
		1575,
		1604,
		1363,
		1578,
		1577,
		1374,
		1593,
		1605,
		1412,
		1607,
		1459,
		1497,
		1540,
		1539,
		1608,
		1028,
		1027,
		1408,
		1610,
		1611,
		1163,
		1484,
		1515,
		1516,
		1613,
		1614,
		1615,
		1612,
		1615,
		1617,
		1447,
		1618,
		1522,
		1246,
		1405,
		1519,
		1619,
		1483,
		1486,
		1449,
		1254,
		1418,
		1621,
		1444,
		1513,
		1537,
		1313,
		1312,
		1614,
		1515,
		1484,
		1072,
		1622,
		1623,
		1466,
		1624,
		1430,
		1431,
		1488,
		1625,
		1626,
		1627,
		1252,
		1629,
		1630,
		1631,
		1288,
		1593,
		1411,
		1416,
		1415,
		1176,
		1495,
		1317,
		1290,
		1251,
		1179,
		1173,
		1514,
		1233,
		1122,
		1312,
		1591,
		1463,
		1602,
		1544,
		1543,
		1545,
		1245,
		1246,
		1468,
		1467,
		1580,
		1298,
		1601,
		1470,
		1507,
		1506,
		1633,
		1485,
		1516,
		1030,
		1562,
		1565,
		1610,
		1584,
		1587,
		1604,
		1447,
		1636,
		1637,
		1526,
		1200,
		1535,
		1509,
		1638,
		1639,
		1640,
		1438,
		1641,
		1229,
		1230,
		1481,
		1332,
		1333,
		1503,
		1460,
		1398,
		1510,
		1463,
		1591,
		1452,
		1420,
		1643,
		1563,
		1644,
		1574,
		1585,
		1427,
		1430,
		1624,
		1315,
		1494,
		1591,
		1419,
		1257,
		1217,
		1395,
		1367,
		1646,
		1430,
		1429,
		1580,
		1561,
		1543,
		1490,
		1621,
		1512,
		1603,
		1450,
		1445,
		1448,
		1648,
		1253,
		1545,
		1317,
		1495,
		1494,
		1164,
		1486,
		1485,
		1163,
		1611,
		1486,
		1649,
		1650,
		1563,
		1571,
		1574,
		1644,
		1653,
		1616,
		1617,
		1655,
		1656,
		1657,
		1647,
		1659,
		1660,
		1385,
		1661,
		1528,
		1479,
		1482,
		1663,
		1622,
		1664,
		1665,
		1531,
		1262,
		1666,
		1519,
		1518,
		1546,
		1636,
		1668,
		1669,
		1625,
		1488,
		1487,
		1377,
		1258,
		1511,
		1262,
		1531,
		1536,
		1432,
		1625,
		1673,
		1561,
		1647,
		1658,
		1673,
		1625,
		1671,
		1645,
		1624,
		1677,
		1451,
		1454,
		1678,
		1028,
		1583,
		1517,
		1366,
		1372,
		1646,
		1258,
		1377,
		1376,
		1680,
		1681,
		1682,
		1684,
		1685,
		1686,
		1328,
		1332,
		1687,
		1407,
		1249,
		1252,
		1470,
		1471,
		1488,
		1356,
		1421,
		1588,
		1573,
		1603,
		1585,
		1586,
		1354,
		1353,
		1176,
		1175,
		1666,
		1668,
		1636,
		1447,
		1243,
		1244,
		1631,
		1544,
		1023,
		1017,
		1429,
		1116,
		1118,
		1423,
		1464,
		1678,
		1664,
		1640,
		1642,
		1071,
		1229,
		1690,
		1381,
		1692,
		1499,
		1358,
		1361,
		1462,
		1693,
		1635,
		1343,
		1670,
		1669,
		1694,
		1670,
		1605,
		1593,
		1693,
		1644,
		1584,
		1555,
		1519,
		1667,
		1643,
		1695,
		1696,
		1697,
		1698,
		1669,
		1689,
		1678,
		1699,
		1701,
		1520,
		1238,
		1310,
		1576,
		1702,
		1514,
		1600,
		1348,
		1418,
		1419,
		1425,
		1244,
		1251,
		1297,
		1259,
		1703,
		1704,
		1532,
		1705,
		1706,
		1468,
		1579,
		1600,
		1598,
		1493,
		1496,
		1617,
		1615,
		1484,
		1557,
		1547,
		1546,
		1456,
		1631,
		1297,
		1637,
		1592,
		1103,
		1475,
		1474,
		1276,
		1437,
		1478,
		1641,
		1622,
		1684,
		1683,
		1504,
		1427,
		1645,
		1444,
		1443,
		1523,
		1576,
		1363,
		1362,
		1021,
		1024,
		1520,
		1472,
		1680,
		1679,
		1505,
		1290,
		1113,
		1251,
		1601,
		1298,
		1413,
		1340,
		1343,
		1608,
		1533,
		1706,
		1707,
		1708,
		1689,
		1677,
		1624,
		1466,
		1711,
		1449,
		1620,
		1712,
		1713,
		1594,
		1563,
		1650,
		1714,
		1420,
		1422,
		1695,
		1662,
		1663,
		1477,
		1715,
		1716,
		1107,
		1516,
		1489,
		1171,
		1671,
		1487,
		1515,
		1490,
		1492,
		1659,
		1296,
		1299,
		1717,
		1522,
		1618,
		1715,
		1637,
		1636,
		1670,
		1719,
		1525,
		1581,
		1102,
		1101,
		1716,
		1602,
		1024,
		1023,
		1663,
		1482,
		1391,
		1633,
		1260,
		1704,
		1452,
		1493,
		1598,
		1708,
		1424,
		1423,
		1620,
		1418,
		1424,
		1361,
		1538,
		1463,
		1386,
		1530,
		1720,
		1604,
		1587,
		1353,
		1721,
		1465,
		1443,
		1350,
		1588,
		1610,
		1565,
		1619,
		1611,
		1492,
		1630,
		1629,
		1722,
		1416,
		1632,
		1521,
		1602,
		1560,
		1723,
		1713,
		1712,
		1722,
		1501,
		1414,
		1167,
		1724,
		1725,
		1720,
		1530,
		1334,
		1382,
		1501,
		1722,
		1422,
		1406,
		1407,
		1492,
		1469,
		1243,
		1252,
		1253,
		1648,
		1724,
		1726,
		1727,
		1618,
		1637,
		1102,
		1603,
		1512,
		1248,
		1564,
		1714,
		1653,
		1720,
		1378,
		1336,
		1412,
		1712,
		1341,
		1422,
		1627,
		1626,
		1628,
		1648,
		1729,
		1722,
		1265,
		1264,
		1428,
		1113,
		1116,
		1720,
		1578,
		1373,
		1278,
		1730,
		1577,
		1410,
		1284,
		1287,
		1662,
		1655,
		1654,
		1577,
		1730,
		1389,
		1731,
		1556,
		1667,
		1565,
		1564,
		1652,
		1286,
		1285,
		1560,
		1169,
		1497,
		1498,
		1441,
		1444,
		1621,
		1629,
		1456,
		1455,
		1678,
		1454,
		1551,
		1372,
		1528,
		1661,
		1343,
		1635,
		1604,
		1513,
		1523,
		1600,
		1393,
		1735,
		1415,
		1665,
		1581,
		1582,
		1478,
		1499,
		1692,
		1596,
		1286,
		1559,
		1261,
		1737,
		1461,
		1553,
		1738,
		1446,
		1719,
		1381,
		1384,
		1384,
		1380,
		1201,
		1607,
		1385,
		1388,
		1651,
		1644,
		1693,
		1388,
		1339,
		1399,
		1742,
		1554,
		1556,
		1721,
		1709,
		1466,
		1717,
		1299,
		1432,
		1698,
		1723,
		1694,
		1287,
		1597,
		1570,
		1697,
		1668,
		1446,
		1707,
		1710,
		1620,
		1534,
		1743,
		1527,
		1694,
		1712,
		1412,
		1626,
		1628,
		1728,
		1660,
		1659,
		1629,
		1696,
		1695,
		1626,
		1415,
		1735,
		1177,
		1333,
		1331,
		1509,
		1652,
		1617,
		1483,
		1074,
		1542,
		1541,
		1743,
		1534,
		1533,
		1559,
		1561,
		1674,
		1737,
		1261,
		1260,
		1552,
		1450,
		1449,
		1648,
		1554,
		1742,
		1595,
		1741,
		1693,
		1667,
		1546,
		1549,
		1569,
		1568,
		1645,
		1613,
		1675,
		1671,
		1572,
		1733,
		1621,
		1460,
		1740,
		1399,
		1461,
		1737,
		1639,
		1539,
		1590,
		1743,
		1527,
		1743,
		1590,
		1506,
		1639,
		1737,
		1735,
		1393,
		1540,
		1730,
		1278,
		1507,
		1607,
		1740,
		1460,
		1526,
		1739,
		1201,
		1096,
		1293,
		1092,
		1093,
		1294,
		1095,
		1045,
		1273,
		1215,
		1241,
		1326,
		1204,
		1064,
		1320,
		1282,
		1283,
		1319,
		1061,
		1216,
		1272,
		1046,
		1100,
		1058,
		1013,
		1213,
		1147,
		1054,
		1016,
		1059,
		1099,
		1365,
		1223,
		1135,
		1136,
		1224,
		1364,
		1323,
		1274,
		1049,
		1053,
		1148,
		1214,
		1735,
		1609,
		1706,
		1719,
		1739,
		1526,
		1730,
		1634,
		1704,
		1294,
		1093,
		1208,
		1293,
		1292,
		1207,
		1326,
		1325,
		1205,
		1147,
		1146,
		1055,
		1058,
		1057,
		1014,
		1059,
		1016,
		1015,
		1274,
		1089,
		1050,
		1148,
		1053,
		1056,
		1273,
		1045,
		1048,
		1320,
		1064,
		1063,
		1272,
		1271,
		1047,
		1319,
		1318,
		1062,
		1224,
		1136,
		1138,
		1223,
		1139,
		1137,
		1606,
		1396,
		1646,
		1482,
		1481,
		1392,
		1479,
		1654,
		1753,
		1718,
		1642,
		1641,
		1477,
		1663,
		1417,
		1371,
		1475,
		1335,
		1474,
		1503,
		1277,
		1473,
		1679,
		1754,
		1370,
		1366,
		1369,
		1477,
		1500,
		1499,
		1371,
		1529,
		1528,
		1472,
		1370,
		1755,
		1476,
		1437,
		1440,
		1438,
		1640,
		1757,
		1367,
		1395,
		1758,
		1662,
		1476,
		1756,
		1655,
		1756,
		1759,
		1756,
		1440,
		1760,
		1680,
		1755,
		1761,
		1755,
		1369,
		1762,
		1167,
		1329,
		1763,
		1329,
		1328,
		1688,
		1679,
		1682,
		1764,
		1072,
		1071,
		1691,
		1622,
		1072,
		1765,
		1170,
		1498,
		1638,
		1623,
		1582,
		1589,
		1330,
		1638,
		1509,
		1654,
		1657,
		1766,
		1073,
		1589,
		1542,
		1229,
		1480,
		1753,
		1664,
		1683,
		1757,
		1332,
		1502,
		1754,
		1168,
		1725,
		1758,
		1684,
		1765,
		1767,
		1724,
		1763,
		1768,
		1763,
		1688,
		1769,
		1765,
		1691,
		1770,
		1259,
		1376,
		1375,
		1532,
		1666,
		1175,
		1263,
		1536,
		1199,
		1337,
		1511,
		1397,
		1169,
		1396,
		1606,
		1665,
		1642,
		1718,
		1541,
		1392,
		1481,
		1508,
		1277,
		1503,
		1683,
		1686,
		1771,
		1725,
		1727,
		1772,
		1069,
		1065,
		1068,
		1083,
		1081,
		1077,
		1078,
		1082,
		1084,
		1067,
		1066,
		1070,
		1021,
		1701,
		1773,
		1774,
		1115,
		1114,
		1774,
		1702,
		1362,
		1774,
		1349,
		1120,
		1174,
		1180,
		1773,
		1039,
		1038,
		1773,
		1774,
		1107,
		1716,
		1151,
		1150,
		1773,
		1154,
		1157,
		1773,
		1160,
		1357,
		1773,
		1774,
		1359,
		1112,
		1232,
		1166,
		1773,
		1774,
		1355,
		1124,
		1019,
		1018,
		1773,
		1774,
		1291,
		1316,
		1032,
		1031,
		1773,
		1774,
		1111,
		1218,
		1774,
		1314,
		1313,
		1774,
		1289,
		1308,
		1237,
		1026,
		1773,
		1774,
		1123,
		1234,
		1156,
		1161,
		1773,
		1182,
		1184,
		1773,
		1774,
		1101,
		1104,
		1774,
		1537,
		1360,
		1773,
		1026,
		1025,
		1769,
		1687,
		1764,
		1770,
		1690,
		1766,
		1738,
		1553,
		1801,
		1802,
		1596,
		1736,
		1802,
		1660,
		1734,
		1733,
		1572,
		1801,
		1710,
		1707,
		1801,
		1741,
		1595,
		1801,
		1802,
		1731,
		1732,
		1802,
		1696,
		1744,
		1676,
		1677,
		1801,
		1699,
		1551,
		1801,
		1802,
		1673,
		1675,
		1801,
		1594,
		1713,
		1802,
		1728,
		1729,
		1442,
		1441,
		1801,
		1802,
		1714,
		1650,
		1599,
		1566,
		1801,
		1709,
		1721,
		1801,
		1802,
		1570,
		1597,
		1802,
		1612,
		1616,
		1802,
		1455,
		1457,
		1802,
		1717,
		1672,
		1548,
		1570,
		1802,
		1802,
		1674,
		1658,
		1571,
		1651,
		1801,
		1698,
		1697,
		1801,
		1552,
		1711,
		1801,
		1368,
		1772,
		1762,
		1439,
		1771,
		1760,
		1788,
		1771,
		1686,
		1787,
		1772,
		1727,
		1767,
		1770,
		1788,
		1768,
		1769,
		1787,
		2430,
		2273,
		2427,
		2416,
		2366,
		2433,
		2430,
		2427,
		2434,
		2416,
		2433,
		2438,
		1877,
		1938,
		1849,
		1862,
		1905,
		2002,
		2440,
		1849,
		1938,
		2440,
		2002,
		1905,
		2430,
		2431,
		2273,
		2416,
		2431,
		2366,
		1803,
		1805,
		1806,
		1807,
		1805,
		1804,
		1809,
		1811,
		1812,
		1814,
		1816,
		1813,
		1817,
		1819,
		1820,
		1821,
		1811,
		1810,
		1823,
		1816,
		1824,
		1824,
		1825,
		1826,
		1827,
		1829,
		1830,
		1832,
		1834,
		1831,
		1836,
		1838,
		1835,
		1839,
		1841,
		1842,
		1832,
		1844,
		1833,
		1846,
		1848,
		1845,
		1850,
		1852,
		1849,
		1853,
		1855,
		1856,
		1858,
		1860,
		1857,
		1851,
		1831,
		1861,
		1862,
		1843,
		1822,
		1865,
		1867,
		1864,
		1868,
		1870,
		1871,
		1872,
		1874,
		1825,
		1828,
		1876,
		1829,
		1877,
		1872,
		1815,
		1880,
		1882,
		1879,
		1883,
		1881,
		1880,
		1826,
		1874,
		1885,
		1860,
		1886,
		1887,
		1819,
		1889,
		1820,
		1815,
		1825,
		1816,
		1844,
		1891,
		1833,
		1834,
		1891,
		1892,
		1873,
		1894,
		1874,
		1896,
		1898,
		1895,
		1896,
		1900,
		1897,
		1812,
		1832,
		1831,
		1822,
		1832,
		1811,
		1809,
		1851,
		1850,
		1901,
		1903,
		1904,
		1821,
		1862,
		1822,
		1907,
		1909,
		1906,
		1910,
		1867,
		1911,
		1912,
		1870,
		1869,
		1914,
		1826,
		1915,
		1830,
		1916,
		1917,
		1918,
		1913,
		1912,
		1920,
		1911,
		1921,
		1884,
		1923,
		1881,
		1924,
		1925,
		1926,
		1927,
		1929,
		1930,
		1932,
		1934,
		1931,
		1895,
		1837,
		1836,
		1885,
		1894,
		1935,
		1927,
		1937,
		1936,
		1899,
		1842,
		1900,
		1938,
		1815,
		1814,
		1939,
		1824,
		1914,
		1892,
		1940,
		1941,
		1893,
		1943,
		1894,
		1890,
		1940,
		1891,
		1945,
		1806,
		1946,
		1947,
		1808,
		1807,
		1805,
		1949,
		1950,
		1935,
		1943,
		1951,
		1805,
		1952,
		1806,
		1953,
		1955,
		1956,
		1958,
		1960,
		1957,
		1829,
		1961,
		1916,
		1881,
		1962,
		1882,
		1964,
		1966,
		1963,
		1964,
		1968,
		1965,
		1969,
		1971,
		1972,
		1941,
		1973,
		1974,
		1944,
		1973,
		1940,
		1969,
		1977,
		1976,
		1951,
		1978,
		1979,
		1942,
		1978,
		1943,
		1981,
		1859,
		1858,
		1831,
		1983,
		1861,
		1984,
		1820,
		1985,
		1843,
		1986,
		1844,
		1987,
		1915,
		1988,
		1989,
		1878,
		1877,
		1875,
		1992,
		1876,
		1879,
		1994,
		1993,
		1915,
		1885,
		1995,
		1981,
		1945,
		1982,
		1924,
		1884,
		1883,
		1878,
		1873,
		1872,
		1984,
		1947,
		1998,
		1897,
		2000,
		1898,
		1897,
		2001,
		1999,
		2002,
		1914,
		1987,
		2004,
		1804,
		2003,
		1972,
		2005,
		2006,
		1972,
		2007,
		1977,
		2008,
		2010,
		2011,
		2008,
		2013,
		2012,
		2014,
		1848,
		2015,
		1852,
		1861,
		1925,
		1931,
		1863,
		1862,
		2016,
		1855,
		1854,
		1980,
		2019,
		1978,
		1979,
		2019,
		2020,
		1975,
		2022,
		1973,
		1974,
		2022,
		2023,
		2024,
		1804,
		1803,
		1932,
		1830,
		1933,
		2023,
		2025,
		2026,
		2006,
		1936,
		2007,
		2021,
		2025,
		2022,
		1991,
		1988,
		1992,
		2006,
		1928,
		1927,
		1993,
		1990,
		1989,
		1863,
		2028,
		1986,
		2030,
		2032,
		2029,
		1923,
		2034,
		1962,
		1916,
		2035,
		2036,
		1995,
		1935,
		2037,
		1922,
		2033,
		1923,
		1917,
		2036,
		2039,
		1887,
		2040,
		1865,
		1837,
		2042,
		1838,
		1842,
		2043,
		2044,
		1861,
		2045,
		1925,
		2018,
		2047,
		2019,
		2020,
		2047,
		2048,
		2038,
		2050,
		2033,
		2039,
		2051,
		2052,
		2011,
		2053,
		2054,
		2055,
		1954,
		1953,
		2058,
		1957,
		2057,
		2011,
		2059,
		2013,
		2061,
		2008,
		2060,
		2062,
		2008,
		2012,
		2063,
		2065,
		2066,
		2067,
		2065,
		2064,
		1888,
		2069,
		1889,
		1988,
		1995,
		2070,
		2036,
		2071,
		2051,
		2033,
		2072,
		2034,
		2073,
		2003,
		2024,
		2026,
		2075,
		2076,
		1954,
		2077,
		1955,
		2046,
		2064,
		2047,
		2048,
		2064,
		2063,
		2027,
		2075,
		2025,
		1957,
		2079,
		1847,
		1925,
		2080,
		1926,
		1997,
		1893,
		1873,
		2083,
		2085,
		2082,
		2078,
		2082,
		2075,
		2076,
		2082,
		2086,
		2086,
		2085,
		2087,
		1990,
		1997,
		1878,
		2090,
		2092,
		2089,
		2093,
		2003,
		2074,
		2091,
		2060,
		2092,
		1933,
		1917,
		2094,
		2095,
		2060,
		2062,
		1838,
		2097,
		2096,
		2099,
		2074,
		2098,
		2101,
		2103,
		2100,
		2104,
		1941,
		2105,
		1841,
		2107,
		2043,
		2108,
		2089,
		2109,
		2110,
		1953,
		2111,
		2112,
		1958,
		2058,
		2114,
		1944,
		1890,
		2116,
		2118,
		2119,
		2120,
		2074,
		2073,
		2121,
		2103,
		2108,
		1835,
		2096,
		2122,
		1986,
		1890,
		1844,
		1934,
		2094,
		2028,
		2066,
		2100,
		2121,
		1983,
		1892,
		2104,
		2068,
		2100,
		2065,
		2109,
		2092,
		2095,
		2102,
		2089,
		2103,
		2087,
		2098,
		2120,
		2111,
		1956,
		2123,
		2084,
		2098,
		2085,
		1840,
		2106,
		1841,
		2045,
		2104,
		2125,
		1994,
		2088,
		1990,
		2113,
		1959,
		1958,
		1847,
		2128,
		1848,
		1926,
		1922,
		1884,
		1856,
		2129,
		2077,
		1970,
		1904,
		1971,
		1976,
		1908,
		1907,
		2028,
		2114,
		1986,
		1876,
		2131,
		1961,
		1965,
		1895,
		1966,
		2049,
		2133,
		2050,
		1965,
		1899,
		1896,
		2052,
		2134,
		2135,
		2080,
		2038,
		1922,
		2050,
		2137,
		2072,
		2051,
		2138,
		2134,
		2139,
		2141,
		2142,
		1999,
		2140,
		2139,
		1999,
		2143,
		2000,
		1992,
		2070,
		2131,
		2139,
		2144,
		2143,
		1996,
		1803,
		1945,
		1936,
		2127,
		2113,
		2081,
		1942,
		1893,
		2037,
		1951,
		2146,
		1967,
		2148,
		1968,
		2088,
		2081,
		1997,
		1928,
		2123,
		1929,
		1900,
		2044,
		2001,
		1898,
		2041,
		1837,
		1963,
		2151,
		2150,
		1962,
		2152,
		2126,
		1998,
		1807,
		2004,
		1882,
		2126,
		1994,
		2070,
		2037,
		2153,
		2094,
		2039,
		2154,
		2005,
		2111,
		1928,
		2007,
		2113,
		2112,
		2134,
		2155,
		2156,
		2134,
		2157,
		2135,
		1961,
		2158,
		2035,
		2145,
		1980,
		1942,
		1982,
		1946,
		2160,
		2161,
		2032,
		2162,
		2163,
		2165,
		2166,
		1985,
		1948,
		1947,
		2146,
		1979,
		2168,
		2124,
		2015,
		2106,
		2017,
		2129,
		1855,
		2133,
		2170,
		2137,
		2163,
		2171,
		2170,
		2133,
		2164,
		2163,
		1806,
		2172,
		1946,
		1808,
		2173,
		1949,
		2105,
		1974,
		2174,
		2028,
		2154,
		2130,
		2045,
		2136,
		2080,
		2176,
		2178,
		2175,
		2115,
		1975,
		1944,
		2180,
		2182,
		2183,
		1857,
		2185,
		2184,
		1818,
		2187,
		1819,
		1902,
		2189,
		1903,
		1906,
		2191,
		2190,
		2122,
		2017,
		2016,
		2131,
		2153,
		2158,
		2126,
		2149,
		2088,
		2192,
		2118,
		2117,
		2015,
		2128,
		2194,
		2195,
		2197,
		2198,
		2195,
		2200,
		2199,
		2153,
		2146,
		2201,
		2202,
		1868,
		1888,
		2203,
		1865,
		1864,
		2156,
		2205,
		2157,
		2206,
		2119,
		2207,
		2168,
		2020,
		2208,
		2179,
		2021,
		1975,
		2156,
		2210,
		2204,
		2130,
		2115,
		2114,
		2149,
		2145,
		2081,
		2159,
		2018,
		1980,
		2174,
		2023,
		2214,
		2125,
		2105,
		2215,
		2150,
		2217,
		2216,
		2147,
		2219,
		2148,
		2054,
		1963,
		2059,
		2054,
		1967,
		1964,
		2220,
		2031,
		2030,
		2154,
		2052,
		2222,
		2035,
		2223,
		2071,
		2218,
		2225,
		2219,
		2216,
		2227,
		2226,
		2204,
		2228,
		2229,
		2166,
		2231,
		2171,
		2175,
		2233,
		2232,
		2181,
		2235,
		2182,
		1950,
		2237,
		1952,
		1950,
		2238,
		2236,
		2204,
		2239,
		2205,
		2185,
		1887,
		2203,
		2166,
		2240,
		2230,
		1930,
		2196,
		2195,
		1930,
		2199,
		1937,
		2034,
		2241,
		2152,
		2136,
		2049,
		2038,
		2226,
		2177,
		2176,
		2243,
		1919,
		1918,
		2224,
		2183,
		2225,
		2130,
		2222,
		2211,
		2125,
		2242,
		2136,
		1820,
		2167,
		1985,
		2187,
		1888,
		1819,
		2245,
		1921,
		2246,
		2248,
		2184,
		2247,
		2249,
		2186,
		1818,
		2057,
		1847,
		1846,
		2056,
		1856,
		1954,
		1859,
		2160,
		1886,
		2158,
		2201,
		2223,
		2152,
		2212,
		2149,
		2229,
		2251,
		2252,
		2229,
		2253,
		2239,
		2208,
		2048,
		2254,
		2214,
		2026,
		2255,
		2209,
		2027,
		2021,
		2213,
		2046,
		2018,
		2013,
		2259,
		2258,
		2215,
		2174,
		2260,
		2010,
		2262,
		2053,
		2211,
		2179,
		2115,
		2264,
		2004,
		2093,
		2212,
		2159,
		2145,
		2201,
		2168,
		2266,
		2267,
		2024,
		1996,
		1977,
		2112,
		1908,
		2230,
		2268,
		2269,
		2230,
		2270,
		2231,
		1971,
		2110,
		2005,
		2271,
		2273,
		2274,
		2271,
		2276,
		2275,
		2254,
		2063,
		2277,
		2257,
		2067,
		2046,
		2252,
		2280,
		2253,
		2269,
		2281,
		2282,
		2242,
		2132,
		2049,
		2252,
		2284,
		2279,
		2269,
		2285,
		2270,
		2255,
		2076,
		2286,
		2256,
		2078,
		2027,
		2072,
		2288,
		2241,
		2279,
		2290,
		2280,
		2279,
		2291,
		2289,
		2012,
		2258,
		2292,
		2009,
		2261,
		2010,
		2222,
		2135,
		2294,
		1948,
		2295,
		2173,
		1946,
		2296,
		2160,
		2282,
		2297,
		2298,
		2071,
		2299,
		2138,
		2282,
		2300,
		2285,
		2298,
		2301,
		2300,
		2289,
		2302,
		2250,
		2261,
		2246,
		2262,
		2286,
		2086,
		2303,
		2287,
		2083,
		2078,
		2289,
		2249,
		2290,
		2298,
		2248,
		2247,
		2258,
		2244,
		2243,
		2106,
		2194,
		2107,
		2160,
		2040,
		1886,
		2167,
		2069,
		2295,
		2305,
		2090,
		2102,
		2278,
		2068,
		2067,
		2277,
		2066,
		2308,
		2211,
		2294,
		2263,
		2309,
		2109,
		2310,
		2311,
		2099,
		2084,
		2215,
		2283,
		2242,
		2313,
		2120,
		2314,
		2096,
		2169,
		2017,
		2307,
		2101,
		2068,
		2304,
		2084,
		2083,
		2308,
		2121,
		2316,
		2303,
		2087,
		2313,
		2317,
		2221,
		2220,
		2314,
		2073,
		2267,
		2265,
		2213,
		2159,
		2312,
		2093,
		2099,
		2143,
		2321,
		2320,
		2316,
		2108,
		2309,
		2236,
		1970,
		1969,
		2236,
		1976,
		2237,
		2315,
		2102,
		2101,
		2223,
		2266,
		2299,
		2266,
		2208,
		2322,
		2323,
		2009,
		2061,
		2324,
		2012,
		2292,
		2140,
		2326,
		2141,
		2327,
		2207,
		2328,
		2260,
		2214,
		2329,
		2241,
		2265,
		2212,
		2263,
		2209,
		2179,
		2250,
		2331,
		2186,
		2247,
		2332,
		2301,
		2333,
		1998,
		2264,
		2334,
		1996,
		1981,
		2132,
		2335,
		2164,
		2310,
		2095,
		2336,
		1968,
		1839,
		1899,
		1966,
		1836,
		2151,
		2306,
		2091,
		2090,
		2137,
		2338,
		2288,
		2135,
		2339,
		2294,
		2249,
		1817,
		2340,
		2248,
		1858,
		1857,
		2138,
		2342,
		2155,
		2069,
		1871,
		2343,
		2340,
		1984,
		2333,
		2341,
		1981,
		1858,
		2330,
		2256,
		2209,
		2329,
		2255,
		2345,
		2319,
		2257,
		2213,
		2322,
		2254,
		2347,
		2040,
		1866,
		1865,
		2299,
		2322,
		2342,
		2288,
		2319,
		2265,
		2283,
		2329,
		2335,
		2294,
		2330,
		2263,
		2336,
		2062,
		2324,
		2337,
		2061,
		2091,
		2001,
		2325,
		2140,
		2325,
		2328,
		2326,
		2000,
		2320,
		2041,
		2190,
		2235,
		2234,
		2188,
		2233,
		2189,
		2320,
		2318,
		2317,
		2142,
		2275,
		2144,
		2157,
		2349,
		2339,
		2155,
		2350,
		2210,
		2142,
		2272,
		2271,
		2345,
		2286,
		2351,
		2344,
		2287,
		2256,
		2353,
		1869,
		2202,
		2354,
		1864,
		1910,
		2186,
		2355,
		2187,
		2184,
		2356,
		2332,
		2170,
		2357,
		2338,
		2164,
		2358,
		2165,
		2346,
		2278,
		2257,
		2347,
		2277,
		2360,
		2362,
		2364,
		2361,
		2362,
		2366,
		2363,
		2338,
		2346,
		2319,
		2359,
		2307,
		2278,
		2360,
		2308,
		2368,
		2342,
		2347,
		2350,
		2335,
		2345,
		2358,
		2351,
		2303,
		2369,
		2352,
		2304,
		2287,
		2339,
		2344,
		2330,
		2367,
		2315,
		2307,
		2370,
		2311,
		2304,
		2368,
		2316,
		2373,
		2165,
		2374,
		2240,
		2205,
		2375,
		2349,
		2369,
		2313,
		2376,
		2171,
		2377,
		2357,
		2210,
		2378,
		2228,
		2379,
		2264,
		2312,
		1866,
		2181,
		1867,
		2380,
		2267,
		2334,
		1871,
		2175,
		2232,
		2376,
		2314,
		2380,
		2371,
		2305,
		2315,
		2373,
		2309,
		2382,
		2382,
		2310,
		2383,
		2372,
		2312,
		2311,
		2381,
		2306,
		2305,
		2350,
		2360,
		2378,
		2182,
		2014,
		2183,
		2178,
		2016,
		1854,
		2357,
		2359,
		2346,
		2349,
		2352,
		2344,
		2356,
		2203,
		2354,
		2358,
		2351,
		2374,
		2151,
		1835,
		2217,
		2148,
		1840,
		1839,
		2355,
		2202,
		2187,
		2231,
		2385,
		2377,
		2240,
		2386,
		2268,
		1949,
		2387,
		2238,
		2239,
		2388,
		2375,
		2228,
		2389,
		2251,
		1952,
		2390,
		2172,
		2199,
		2392,
		2391,
		2196,
		2394,
		2197,
		1937,
		2391,
		2127,
		1929,
		2393,
		2196,
		2374,
		2369,
		2386,
		2375,
		2370,
		2352,
		2293,
		2245,
		2261,
		2292,
		2243,
		2396,
		2377,
		2367,
		2359,
		2378,
		2368,
		2389,
		2270,
		2397,
		2385,
		1908,
		2058,
		1909,
		1904,
		2055,
		2110,
		2398,
		2162,
		2399,
		2268,
		2400,
		2281,
		2253,
		2401,
		2388,
		2059,
		2150,
		2259,
		2053,
		2147,
		1967,
		2402,
		2193,
		2192,
		2251,
		2404,
		2284,
		2281,
		2405,
		2297,
		2291,
		2407,
		2302,
		2284,
		2406,
		2291,
		2300,
		2409,
		2408,
		2285,
		2408,
		2397,
		2280,
		2410,
		2401,
		2198,
		2365,
		2362,
		2198,
		2361,
		2200,
		2235,
		1845,
		2182,
		2386,
		2376,
		2400,
		2233,
		1854,
		1853,
		1911,
		2181,
		2180,
		2389,
		2373,
		2404,
		2297,
		2341,
		2248,
		2290,
		2340,
		2410,
		2383,
		2336,
		2411,
		2385,
		2371,
		2367,
		2388,
		2372,
		2370,
		2401,
		2379,
		2372,
		2384,
		2337,
		2306,
		2405,
		2334,
		2341,
		2408,
		2384,
		2381,
		1913,
		2175,
		1870,
		2397,
		2381,
		2371,
		2404,
		2382,
		2406,
		2410,
		2333,
		2379,
		2406,
		2383,
		2407,
		2400,
		2380,
		2405,
		2077,
		2029,
		2161,
		2079,
		2117,
		2128,
		2169,
		2029,
		2129,
		2194,
		2117,
		2116,
		2295,
		2343,
		2413,
		2296,
		2348,
		2040,
		2217,
		2122,
		2227,
		2275,
		2416,
		2415,
		2219,
		2124,
		1840,
		2417,
		2293,
		2323,
		2418,
		2292,
		2396,
		2172,
		2414,
		2296,
		2173,
		2413,
		2387,
		2412,
		2323,
		2337,
		2411,
		2324,
		2418,
		2044,
		2327,
		2325,
		2041,
		2317,
		2042,
		2127,
		2419,
		1959,
		2393,
		2421,
		2394,
		2391,
		2422,
		2419,
		2123,
		2420,
		2393,
		2225,
		2014,
		2124,
		2227,
		2016,
		2177,
		2237,
		1907,
		2390,
		2238,
		1901,
		1970,
		2302,
		2423,
		2331,
		2301,
		2424,
		2409,
		2409,
		2412,
		2384,
		2407,
		2411,
		2423,
		2419,
		2403,
		2402,
		2420,
		2399,
		2421,
		2395,
		1920,
		2245,
		2396,
		1918,
		2426,
		1956,
		2398,
		2420,
		1959,
		2402,
		1960,
		2259,
		2216,
		2244,
		2262,
		2218,
		2147,
		1909,
		2057,
		2191,
		1903,
		2056,
		2055,
		2426,
		1912,
		2353,
		2425,
		1910,
		1920,
		1960,
		2192,
		2079,
		1955,
		2161,
		2398,
		2343,
		2232,
		2188,
		2348,
		2234,
		1866,
		2144,
		2415,
		2321,
		2141,
		2427,
		2272,
		2332,
		2428,
		2424,
		2331,
		2429,
		2355,
		2423,
		2418,
		2429,
		2424,
		2417,
		2412,
		2418,
		2426,
		2429,
		2417,
		2425,
		2395,
		2387,
		1902,
		1901,
		2043,
		2206,
		2327,
		2390,
		1906,
		2414,
		2042,
		2220,
		2097,
		2189,
		1853,
		2056,
		2191,
		1846,
		2235,
		2361,
		2430,
		2432,
		2246,
		2224,
		2218,
		2244,
		2226,
		1919,
		2414,
		2190,
		2348,
		2429,
		2353,
		2355,
		2428,
		2354,
		2425,
		2413,
		2188,
		1902,
		1921,
		2180,
		2224,
		1919,
		2176,
		1913,
		2097,
		2030,
		2169,
		2107,
		2116,
		2206,
		2200,
		2432,
		2392,
		2197,
		2433,
		2365,
		2326,
		2434,
		2427,
		2321,
		2435,
		2318,
		2318,
		2436,
		2221,
		2392,
		2437,
		2422,
		2394,
		2438,
		2433,
		2422,
		2439,
		2403,
		1810,
		2440,
		1821,
		1850,
		2440,
		1809,
		1931,
		2002,
		1932,
		1989,
		1849,
		1993,
		2440,
		1813,
		1823,
		2430,
		2437,
		2432,
		2416,
		2435,
		2415,
		1827,
		2002,
		1828,
		1879,
		1849,
		1880,
		1924,
		1849,
		1852,
		1939,
		2440,
		1823,
		2439,
		2434,
		2207,
		2436,
		2438,
		2399,
		2436,
		2162,
		2032,
		2439,
		2119,
		2118,
		1991,
		2002,
		1987,
		2439,
		2193,
		2403,
		2436,
		2031,
		2221,
		2431,
		2430,
		2364,
		2431,
		2416,
		2276,
		2273,
		2272,
		2427,
		2366,
		2365,
		2433,
		2434,
		2328,
		2207,
		2438,
		2421,
		2399,
		1849,
		1883,
		1880,
		2002,
		1875,
		1828,
		2440,
		1938,
		1814,
		2440,
		1905,
		1821,
		2276,
		2274,
		2431,
		2431,
		2363,
		2366,
		2274,
		2273,
		2431,
		2431,
		2364,
		2363,
		1803,
		1804,
		1805,
		1807,
		1808,
		1805,
		1809,
		1810,
		1811,
		1814,
		1815,
		1816,
		1817,
		1818,
		1819,
		1821,
		1822,
		1811,
		1823,
		1813,
		1816,
		1824,
		1816,
		1825,
		1827,
		1828,
		1829,
		1832,
		1833,
		1834,
		1836,
		1837,
		1838,
		1839,
		1840,
		1841,
		1832,
		1843,
		1844,
		1846,
		1847,
		1848,
		1850,
		1851,
		1852,
		1853,
		1854,
		1855,
		1858,
		1859,
		1860,
		1851,
		1812,
		1831,
		1862,
		1863,
		1843,
		1865,
		1866,
		1867,
		1868,
		1869,
		1870,
		1872,
		1873,
		1874,
		1828,
		1875,
		1876,
		1877,
		1878,
		1872,
		1880,
		1881,
		1882,
		1883,
		1884,
		1881,
		1826,
		1825,
		1874,
		1860,
		1859,
		1886,
		1819,
		1888,
		1889,
		1815,
		1872,
		1825,
		1844,
		1890,
		1891,
		1834,
		1833,
		1891,
		1873,
		1893,
		1894,
		1896,
		1897,
		1898,
		1896,
		1899,
		1900,
		1812,
		1811,
		1832,
		1822,
		1843,
		1832,
		1809,
		1812,
		1851,
		1901,
		1902,
		1903,
		1821,
		1905,
		1862,
		1907,
		1908,
		1909,
		1910,
		1864,
		1867,
		1912,
		1913,
		1870,
		1914,
		1824,
		1826,
		1830,
		1829,
		1916,
		1918,
		1919,
		1913,
		1920,
		1910,
		1911,
		1884,
		1922,
		1923,
		1924,
		1852,
		1925,
		1927,
		1928,
		1929,
		1932,
		1933,
		1934,
		1895,
		1898,
		1837,
		1885,
		1874,
		1894,
		1927,
		1930,
		1937,
		1899,
		1839,
		1842,
		1938,
		1877,
		1815,
		1939,
		1823,
		1824,
		1892,
		1891,
		1940,
		1893,
		1942,
		1943,
		1890,
		1944,
		1940,
		1945,
		1803,
		1806,
		1947,
		1948,
		1808,
		1805,
		1808,
		1949,
		1935,
		1894,
		1943,
		1805,
		1950,
		1952,
		1953,
		1954,
		1955,
		1958,
		1959,
		1960,
		1829,
		1876,
		1961,
		1881,
		1923,
		1962,
		1964,
		1965,
		1966,
		1964,
		1967,
		1968,
		1969,
		1970,
		1971,
		1941,
		1940,
		1973,
		1944,
		1975,
		1973,
		1969,
		1972,
		1977,
		1951,
		1943,
		1978,
		1942,
		1980,
		1978,
		1981,
		1982,
		1859,
		1831,
		1834,
		1983,
		1984,
		1817,
		1820,
		1843,
		1863,
		1986,
		1987,
		1914,
		1915,
		1989,
		1990,
		1878,
		1875,
		1991,
		1992,
		1879,
		1882,
		1994,
		1915,
		1826,
		1885,
		1981,
		1996,
		1945,
		1924,
		1926,
		1884,
		1878,
		1997,
		1873,
		1984,
		1985,
		1947,
		1897,
		1999,
		2000,
		1897,
		1900,
		2001,
		2002,
		1939,
		1914,
		2004,
		1807,
		1804,
		1972,
		1971,
		2005,
		1972,
		2006,
		2007,
		2008,
		2009,
		2010,
		2008,
		2011,
		2013,
		2014,
		1845,
		1848,
		1852,
		1851,
		1861,
		1931,
		1934,
		1863,
		2016,
		2017,
		1855,
		1980,
		2018,
		2019,
		1979,
		1978,
		2019,
		1975,
		2021,
		2022,
		1974,
		1973,
		2022,
		2024,
		2003,
		1804,
		1932,
		1827,
		1830,
		2023,
		2022,
		2025,
		2006,
		1927,
		1936,
		2021,
		2027,
		2025,
		1991,
		1987,
		1988,
		2006,
		2005,
		1928,
		1993,
		1994,
		1990,
		1863,
		1934,
		2028,
		2030,
		2031,
		2032,
		1923,
		2033,
		2034,
		1916,
		1961,
		2035,
		1995,
		1885,
		1935,
		1922,
		2038,
		2033,
		1917,
		1916,
		2036,
		1887,
		1886,
		2040,
		1837,
		2041,
		2042,
		1842,
		1841,
		2043,
		1861,
		1983,
		2045,
		2018,
		2046,
		2047,
		2020,
		2019,
		2047,
		2038,
		2049,
		2050,
		2039,
		2036,
		2051,
		2011,
		2010,
		2053,
		2055,
		2056,
		1954,
		2058,
		1958,
		1957,
		2011,
		2054,
		2059,
		2061,
		2009,
		2008,
		2062,
		2060,
		2008,
		2063,
		2064,
		2065,
		2067,
		2068,
		2065,
		1888,
		1868,
		2069,
		1988,
		1915,
		1995,
		2036,
		2035,
		2071,
		2033,
		2050,
		2072,
		2073,
		2074,
		2003,
		2026,
		2025,
		2075,
		1954,
		1856,
		2077,
		2046,
		2067,
		2064,
		2048,
		2047,
		2064,
		2027,
		2078,
		2075,
		1957,
		1960,
		2079,
		1925,
		2045,
		2080,
		1997,
		2081,
		1893,
		2083,
		2084,
		2085,
		2078,
		2083,
		2082,
		2076,
		2075,
		2082,
		2086,
		2082,
		2085,
		1990,
		2088,
		1997,
		2090,
		2091,
		2092,
		2093,
		2004,
		2003,
		2091,
		2061,
		2060,
		1933,
		1830,
		1917,
		2095,
		2092,
		2060,
		1838,
		2042,
		2097,
		2099,
		2093,
		2074,
		2101,
		2102,
		2103,
		2104,
		1892,
		1941,
		1841,
		2106,
		2107,
		2108,
		2103,
		2089,
		2110,
		2055,
		1953,
		2112,
		2113,
		1958,
		2114,
		2115,
		1944,
		2116,
		2117,
		2118,
		2120,
		2098,
		2074,
		2121,
		2100,
		2103,
		1835,
		1838,
		2096,
		1986,
		2114,
		1890,
		1934,
		1933,
		2094,
		2066,
		2065,
		2100,
		1983,
		1834,
		1892,
		2068,
		2101,
		2100,
		2109,
		2089,
		2092,
		2102,
		2090,
		2089,
		2087,
		2085,
		2098,
		2111,
		1953,
		1956,
		2084,
		2099,
		2098,
		1840,
		2124,
		2106,
		2045,
		1983,
		2104,
		1994,
		2126,
		2088,
		2113,
		2127,
		1959,
		1847,
		2079,
		2128,
		1926,
		2080,
		1922,
		1856,
		1855,
		2129,
		1970,
		1901,
		1904,
		1976,
		1977,
		1908,
		2028,
		2130,
		2114,
		1876,
		1992,
		2131,
		1965,
		1896,
		1895,
		2049,
		2132,
		2133,
		1965,
		1968,
		1899,
		2052,
		2051,
		2134,
		2080,
		2136,
		2038,
		2050,
		2133,
		2137,
		2051,
		2071,
		2138,
		2139,
		2140,
		2141,
		1999,
		2001,
		2140,
		1999,
		2139,
		2143,
		1992,
		1988,
		2070,
		2139,
		2142,
		2144,
		1996,
		2024,
		1803,
		1936,
		1937,
		2127,
		2081,
		2145,
		1942,
		2037,
		1935,
		1951,
		1967,
		2147,
		2148,
		2088,
		2149,
		2081,
		1928,
		2111,
		2123,
		1900,
		1842,
		2044,
		1898,
		2000,
		2041,
		1963,
		1966,
		2151,
		1962,
		2034,
		2152,
		1998,
		1947,
		1807,
		1882,
		1962,
		2126,
		2070,
		1995,
		2037,
		2094,
		1917,
		2039,
		2005,
		2110,
		2111,
		2007,
		1936,
		2113,
		2134,
		2138,
		2155,
		2134,
		2156,
		2157,
		1961,
		2131,
		2158,
		2145,
		2159,
		1980,
		1982,
		1945,
		1946,
		2161,
		2029,
		2032,
		2163,
		2164,
		2165,
		1985,
		2167,
		1948,
		2146,
		1951,
		1979,
		2124,
		2014,
		2015,
		2017,
		2169,
		2129,
		2133,
		2163,
		2170,
		2163,
		2166,
		2171,
		2133,
		2132,
		2164,
		1806,
		1952,
		2172,
		1808,
		1948,
		2173,
		2105,
		1941,
		1974,
		2028,
		2094,
		2154,
		2045,
		2125,
		2136,
		2176,
		2177,
		2178,
		2115,
		2179,
		1975,
		2180,
		2181,
		2182,
		1857,
		1860,
		2185,
		1818,
		2186,
		2187,
		1902,
		2188,
		2189,
		1906,
		1909,
		2191,
		2122,
		2096,
		2017,
		2131,
		2070,
		2153,
		2126,
		2152,
		2149,
		2192,
		2193,
		2118,
		2015,
		1848,
		2128,
		2195,
		2196,
		2197,
		2195,
		2198,
		2200,
		2153,
		2037,
		2146,
		2202,
		1869,
		1868,
		2203,
		1887,
		1865,
		2156,
		2204,
		2205,
		2206,
		2116,
		2119,
		2168,
		1979,
		2020,
		2179,
		2209,
		2021,
		2156,
		2155,
		2210,
		2130,
		2211,
		2115,
		2149,
		2212,
		2145,
		2159,
		2213,
		2018,
		2174,
		1974,
		2023,
		2125,
		2104,
		2105,
		2150,
		2151,
		2217,
		2147,
		2218,
		2219,
		2054,
		1964,
		1963,
		2054,
		2053,
		1967,
		2220,
		2221,
		2031,
		2154,
		2039,
		2052,
		2035,
		2158,
		2223,
		2218,
		2224,
		2225,
		2216,
		2217,
		2227,
		2204,
		2210,
		2228,
		2166,
		2230,
		2231,
		2175,
		2178,
		2233,
		2181,
		2234,
		2235,
		1950,
		2236,
		2237,
		1950,
		1949,
		2238,
		2204,
		2229,
		2239,
		2185,
		1860,
		1887,
		2166,
		2165,
		2240,
		1930,
		1929,
		2196,
		1930,
		2195,
		2199,
		2034,
		2072,
		2241,
		2136,
		2242,
		2049,
		2226,
		2227,
		2177,
		2243,
		2244,
		1919,
		2224,
		2180,
		2183,
		2130,
		2154,
		2222,
		2125,
		2215,
		2242,
		1820,
		1889,
		2167,
		2187,
		2202,
		1888,
		2245,
		1920,
		1921,
		2248,
		1857,
		2184,
		2249,
		2250,
		2186,
		2057,
		1957,
		1847,
		2056,
		1853,
		1856,
		1859,
		1982,
		2160,
		2158,
		2153,
		2201,
		2152,
		2241,
		2212,
		2229,
		2228,
		2251,
		2229,
		2252,
		2253,
		2208,
		2020,
		2048,
		2214,
		2023,
		2026,
		2209,
		2256,
		2027,
		2213,
		2257,
		2046,
		2013,
		2059,
		2259,
		2215,
		2105,
		2174,
		2010,
		2261,
		2262,
		2211,
		2263,
		2179,
		2264,
		1998,
		2004,
		2212,
		2265,
		2159,
		2201,
		2146,
		2168,
		2267,
		2073,
		2024,
		1977,
		2007,
		2112,
		2230,
		2240,
		2268,
		2230,
		2269,
		2270,
		1971,
		1904,
		2110,
		2271,
		2272,
		2273,
		2271,
		2274,
		2276,
		2254,
		2048,
		2063,
		2257,
		2278,
		2067,
		2252,
		2279,
		2280,
		2269,
		2268,
		2281,
		2242,
		2283,
		2132,
		2252,
		2251,
		2284,
		2269,
		2282,
		2285,
		2255,
		2026,
		2076,
		2256,
		2287,
		2078,
		2072,
		2137,
		2288,
		2279,
		2289,
		2290,
		2279,
		2284,
		2291,
		2012,
		2013,
		2258,
		2009,
		2293,
		2261,
		2222,
		2052,
		2135,
		1948,
		2167,
		2295,
		1946,
		2172,
		2296,
		2282,
		2281,
		2297,
		2071,
		2223,
		2299,
		2282,
		2298,
		2300,
		2298,
		2247,
		2301,
		2289,
		2291,
		2302,
		2261,
		2245,
		2246,
		2286,
		2076,
		2086,
		2287,
		2304,
		2083,
		2289,
		2250,
		2249,
		2298,
		2297,
		2248,
		2258,
		2259,
		2244,
		2106,
		2015,
		2194,
		2160,
		2296,
		2040,
		2167,
		1889,
		2069,
		2305,
		2306,
		2090,
		2278,
		2307,
		2068,
		2277,
		2063,
		2066,
		2211,
		2222,
		2294,
		2309,
		2108,
		2109,
		2311,
		2312,
		2099,
		2215,
		2260,
		2283,
		2313,
		2087,
		2120,
		2096,
		2097,
		2169,
		2307,
		2315,
		2101,
		2304,
		2311,
		2084,
		2308,
		2066,
		2121,
		2303,
		2086,
		2087,
		2317,
		2318,
		2221,
		2314,
		2120,
		2073,
		2265,
		2319,
		2213,
		2312,
		2264,
		2093,
		2143,
		2144,
		2321,
		2316,
		2121,
		2108,
		2236,
		2238,
		1970,
		2236,
		1969,
		1976,
		2315,
		2305,
		2102,
		2223,
		2201,
		2266,
		2266,
		2168,
		2208,
		2323,
		2293,
		2009,
		2324,
		2062,
		2012,
		2140,
		2325,
		2326,
		2327,
		2206,
		2207,
		2260,
		2174,
		2214,
		2241,
		2288,
		2265,
		2263,
		2330,
		2209,
		2250,
		2302,
		2331,
		2247,
		2184,
		2332,
		2333,
		1984,
		1998,
		2334,
		2267,
		1996,
		2132,
		2283,
		2335,
		2310,
		2109,
		2095,
		1968,
		2148,
		1839,
		1966,
		1895,
		1836,
		2306,
		2337,
		2091,
		2137,
		2170,
		2338,
		2135,
		2157,
		2339,
		2249,
		1818,
		1817,
		2248,
		2341,
		1858,
		2138,
		2299,
		2342,
		2069,
		1868,
		1871,
		2340,
		1817,
		1984,
		2341,
		2334,
		1981,
		2330,
		2344,
		2256,
		2329,
		2214,
		2255,
		2319,
		2346,
		2257,
		2322,
		2208,
		2254,
		2040,
		2348,
		1866,
		2299,
		2266,
		2322,
		2288,
		2338,
		2319,
		2283,
		2260,
		2329,
		2294,
		2339,
		2330,
		2336,
		2095,
		2062,
		2337,
		2323,
		2061,
		2001,
		2044,
		2325,
		2325,
		2327,
		2328,
		2000,
		2143,
		2320,
		2190,
		2191,
		2235,
		2188,
		2232,
		2233,
		2320,
		2321,
		2318,
		2142,
		2271,
		2275,
		2157,
		2205,
		2349,
		2155,
		2342,
		2350,
		2142,
		2141,
		2272,
		2345,
		2255,
		2286,
		2344,
		2352,
		2287,
		2353,
		1912,
		1869,
		2354,
		2203,
		1864,
		2186,
		2331,
		2355,
		2184,
		2185,
		2356,
		2170,
		2171,
		2357,
		2164,
		2335,
		2358,
		2346,
		2359,
		2278,
		2347,
		2254,
		2277,
		2362,
		2363,
		2364,
		2362,
		2365,
		2366,
		2338,
		2357,
		2346,
		2359,
		2367,
		2307,
		2360,
		2277,
		2308,
		2342,
		2322,
		2347,
		2335,
		2329,
		2345,
		2351,
		2286,
		2303,
		2352,
		2370,
		2304,
		2339,
		2349,
		2344,
		2367,
		2371,
		2315,
		2370,
		2372,
		2311,
		2368,
		2308,
		2316,
		2165,
		2358,
		2374,
		2205,
		2239,
		2375,
		2369,
		2303,
		2313,
		2171,
		2231,
		2377,
		2210,
		2350,
		2378,
		2379,
		2333,
		2264,
		1866,
		2234,
		2181,
		2380,
		2314,
		2267,
		1871,
		1870,
		2175,
		2376,
		2313,
		2314,
		2371,
		2381,
		2305,
		2373,
		2316,
		2309,
		2382,
		2309,
		2310,
		2372,
		2379,
		2312,
		2381,
		2384,
		2306,
		2350,
		2347,
		2360,
		2182,
		1845,
		2014,
		2178,
		2177,
		2016,
		2357,
		2377,
		2359,
		2349,
		2375,
		2352,
		2356,
		2185,
		2203,
		2358,
		2345,
		2351,
		2151,
		1836,
		1835,
		2148,
		2219,
		1840,
		2355,
		2353,
		2202,
		2231,
		2270,
		2385,
		2240,
		2374,
		2386,
		1949,
		2173,
		2387,
		2239,
		2253,
		2388,
		2228,
		2378,
		2389,
		1952,
		2237,
		2390,
		2199,
		2200,
		2392,
		2196,
		2393,
		2394,
		1937,
		2199,
		2391,
		1929,
		2123,
		2393,
		2374,
		2351,
		2369,
		2375,
		2388,
		2370,
		2293,
		2395,
		2245,
		2292,
		2258,
		2243,
		2377,
		2385,
		2367,
		2378,
		2360,
		2368,
		2270,
		2285,
		2397,
		1908,
		2112,
		2058,
		1904,
		1903,
		2055,
		2398,
		2161,
		2162,
		2268,
		2386,
		2400,
		2253,
		2280,
		2401,
		2059,
		1963,
		2150,
		2053,
		2262,
		2147,
		2402,
		2403,
		2193,
		2251,
		2389,
		2404,
		2281,
		2400,
		2405,
		2291,
		2406,
		2407,
		2284,
		2404,
		2406,
		2300,
		2301,
		2409,
		2285,
		2300,
		2408,
		2280,
		2290,
		2410,
		2198,
		2197,
		2365,
		2198,
		2362,
		2361,
		2235,
		1846,
		1845,
		2386,
		2369,
		2376,
		2233,
		2178,
		1854,
		1911,
		1867,
		2181,
		2389,
		2368,
		2373,
		2297,
		2405,
		2341,
		2290,
		2249,
		2340,
		2383,
		2310,
		2336,
		2385,
		2397,
		2371,
		2388,
		2401,
		2372,
		2401,
		2410,
		2379,
		2384,
		2412,
		2337,
		2405,
		2380,
		2334,
		2408,
		2409,
		2384,
		1913,
		2176,
		2175,
		2397,
		2408,
		2381,
		2404,
		2373,
		2382,
		2410,
		2340,
		2333,
		2406,
		2382,
		2383,
		2400,
		2376,
		2380,
		2077,
		2129,
		2029,
		2079,
		2192,
		2117,
		2169,
		2030,
		2029,
		2194,
		2128,
		2117,
		2295,
		2069,
		2343,
		2296,
		2414,
		2348,
		2217,
		1835,
		2122,
		2275,
		2276,
		2416,
		2219,
		2225,
		2124,
		2417,
		2395,
		2293,
		2418,
		2324,
		2292,
		2172,
		2390,
		2414,
		2173,
		2295,
		2413,
		2412,
		2417,
		2323,
		2411,
		2336,
		2324,
		2044,
		2043,
		2327,
		2041,
		2320,
		2317,
		2127,
		2391,
		2419,
		2393,
		2420,
		2421,
		2391,
		2392,
		2422,
		2123,
		1956,
		2420,
		2225,
		2183,
		2014,
		2227,
		2122,
		2016,
		2237,
		1976,
		1907,
		2238,
		2387,
		1901,
		2302,
		2407,
		2423,
		2301,
		2332,
		2424,
		2409,
		2424,
		2412,
		2407,
		2383,
		2411,
		2419,
		2422,
		2403,
		2420,
		2398,
		2399,
		2395,
		2425,
		1920,
		2396,
		2243,
		1918,
		1956,
		1955,
		2398,
		1959,
		2419,
		2402,
		2259,
		2150,
		2216,
		2262,
		2246,
		2218,
		1909,
		2058,
		2057,
		1903,
		2189,
		2056,
		2426,
		1918,
		1912,
		2425,
		2354,
		1910,
		1960,
		2402,
		2192,
		1955,
		2077,
		2161,
		2343,
		1871,
		2232,
		2348,
		2190,
		2234,
		2144,
		2275,
		2415,
		2141,
		2326,
		2427,
		2332,
		2356,
		2428,
		2331,
		2423,
		2429,
		2423,
		2411,
		2418,
		2424,
		2428,
		2417,
		2418,
		2396,
		2426,
		2417,
		2428,
		2425,
		2387,
		2413,
		1902,
		2043,
		2107,
		2206,
		2390,
		1907,
		1906,
		2042,
		2317,
		2220,
		2189,
		2233,
		1853,
		2191,
		2057,
		1846,
		2361,
		2364,
		2430,
		2246,
		1921,
		2224,
		2244,
		2216,
		2226,
		2414,
		1906,
		2190,
		2429,
		2426,
		2353,
		2428,
		2356,
		2354,
		2413,
		2343,
		2188,
		1921,
		1911,
		2180,
		1919,
		2226,
		2176,
		2097,
		2220,
		2030,
		2107,
		2194,
		2116,
		2200,
		2361,
		2432,
		2197,
		2394,
		2433,
		2326,
		2328,
		2434,
		2321,
		2415,
		2435,
		2318,
		2435,
		2436,
		2392,
		2432,
		2437,
		2394,
		2421,
		2438,
		2422,
		2437,
		2439,
		1810,
		1809,
		2440,
		1850,
		1849,
		2440,
		1931,
		1862,
		2002,
		1989,
		1877,
		1849,
		2440,
		1814,
		1813,
		2430,
		2439,
		2437,
		2416,
		2436,
		2435,
		1827,
		1932,
		2002,
		1879,
		1993,
		1849,
		1924,
		1883,
		1849,
		1939,
		2002,
		2440,
		2439,
		2430,
		2434,
		2436,
		2416,
		2438,
		2436,
		2399,
		2162,
		2439,
		2207,
		2119,
		1991,
		1875,
		2002,
		2439,
		2118,
		2193,
		2436,
		2032,
		2031
	]
};

/***/ })
/******/ ]);