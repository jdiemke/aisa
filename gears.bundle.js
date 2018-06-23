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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/examples/gears/Application.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(/*! ./Framebuffer */ "./src/Framebuffer.ts");
class Canvas {
    constructor(width, height, scene) {
        this.scene = scene;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' + // Opera
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
        this.framebuffer = new Framebuffer_1.Framebuffer(320, 200);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }
    //  Move parts
    init() {
        // FIXME: move fullsccreen handling into utils class
        let fullscreen = false;
        let toggleFullscreen = function () {
            if (!fullscreen) {
                fullscreen = true;
                if ('requestFullscreen' in this) {
                    this['requestFullscreen']();
                }
                else if ('webkitRequestFullScreen' in this) {
                    this['webkitRequestFullScreen']();
                }
                else if ('mozRequestFullScreen' in this) {
                    this['mozRequestFullScreen']();
                }
                else if ('msRequestFullscreen' in this) {
                    this['msRequestFullscreen']();
                }
                else {
                    fullscreen = false;
                }
            }
            else {
                fullscreen = false;
                if ('exitFullscreen' in document) {
                    document['exitFullscreen']();
                }
                else if ('mozCancelFullScreen' in document) {
                    document['mozCancelFullScreen']();
                }
                else if ('webkitExitFullscreen' in document) {
                    document['webkitExitFullscreen']();
                }
                else if ('msExitFullScreen' in document) {
                    document['msExitFullScreen']();
                }
                else {
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
    renderLoop(time) {
        this.scene.render(this.framebuffer);
        this.flipBackbuffer();
        requestAnimationFrame(this.boundRenderLoop);
    }
    flipBackbuffer() {
        this.context.putImageData(this.framebuffer.getImageData(), 0, 0);
    }
    appendTo(element) {
        element.appendChild(this.canvas);
    }
}
exports.Canvas = Canvas;


/***/ }),

/***/ "./src/CullFace.ts":
/*!*************************!*\
  !*** ./src/CullFace.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CullFace;
(function (CullFace) {
    CullFace[CullFace["FRONT"] = 0] = "FRONT";
    CullFace[CullFace["BACK"] = 1] = "BACK";
})(CullFace = exports.CullFace || (exports.CullFace = {}));


/***/ }),

/***/ "./src/Framebuffer.ts":
/*!****************************!*\
  !*** ./src/Framebuffer.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Geometry_1 = __webpack_require__(/*! ./math/Geometry */ "./src/math/Geometry.ts");
const CullFace_1 = __webpack_require__(/*! ./CullFace */ "./src/CullFace.ts");
const Vertex_1 = __webpack_require__(/*! ./Vertex */ "./src/Vertex.ts");
const texture_1 = __webpack_require__(/*! ./texture */ "./src/texture/index.ts");
const math_1 = __webpack_require__(/*! ./math */ "./src/math/index.ts");
const RandomNumberGenerator_1 = __webpack_require__(/*! ./RandomNumberGenerator */ "./src/RandomNumberGenerator.ts");
const Color_1 = __webpack_require__(/*! ./core/Color */ "./src/core/Color.ts");
const RightClipEdge_1 = __webpack_require__(/*! ./screen-space-clipping/RightClipEdge */ "./src/screen-space-clipping/RightClipEdge.ts");
const LeftClipEdge_1 = __webpack_require__(/*! ./screen-space-clipping/LeftClipEdge */ "./src/screen-space-clipping/LeftClipEdge.ts");
const TopClipEdge_1 = __webpack_require__(/*! ./screen-space-clipping/TopClipEdge */ "./src/screen-space-clipping/TopClipEdge.ts");
const BottomClipEdge_1 = __webpack_require__(/*! ./screen-space-clipping/BottomClipEdge */ "./src/screen-space-clipping/BottomClipEdge.ts");
const CohenSutherlandLineClipper_1 = __webpack_require__(/*! ./screen-space-clipping/CohenSutherlandLineClipper */ "./src/screen-space-clipping/CohenSutherlandLineClipper.ts");
const Torus_1 = __webpack_require__(/*! ./geometrical-objects/Torus */ "./src/geometrical-objects/Torus.ts");
const TriangleRasterizer_1 = __webpack_require__(/*! ./rasterizer/TriangleRasterizer */ "./src/rasterizer/TriangleRasterizer.ts");
const ScaleClipBlitter_1 = __webpack_require__(/*! ./blitter/ScaleClipBlitter */ "./src/blitter/ScaleClipBlitter.ts");
const TexturedTriangleRasterizer_1 = __webpack_require__(/*! ./rasterizer/TexturedTriangleRasterizer */ "./src/rasterizer/TexturedTriangleRasterizer.ts");
const FlatShadingRenderingPipeline_1 = __webpack_require__(/*! ./rendering-pipelines/FlatShadingRenderingPipeline */ "./src/rendering-pipelines/FlatShadingRenderingPipeline.ts");
const TexturingRenderingPipeline_1 = __webpack_require__(/*! ./rendering-pipelines/TexturingRenderingPipeline */ "./src/rendering-pipelines/TexturingRenderingPipeline.ts");
let bunnyJson = __webpack_require__(/*! ./assets/bunny.json */ "./src/assets/bunny.json");
let roomJson = __webpack_require__(/*! ./assets/room.json */ "./src/assets/room.json");
let hoodlumJson = __webpack_require__(/*! ./assets/hoodlum.json */ "./src/assets/hoodlum.json");
let labJson = __webpack_require__(/*! ./assets/lab.json */ "./src/assets/lab.json");
let labJson2 = __webpack_require__(/*! ./assets/lab2.json */ "./src/assets/lab2.json");
let bakedJson = __webpack_require__(/*! ./assets/abstract.json */ "./src/assets/abstract.json");
let hlm2018Json = __webpack_require__(/*! ./assets/hoodlum2018.json */ "./src/assets/hoodlum2018.json");
class Framebuffer {
    constructor(width, height) {
        this.cullMode = CullFace_1.CullFace.BACK;
        this.torus = new Torus_1.Torus();
        this.linerClipper = new CohenSutherlandLineClipper_1.CohenSutherlandLineClipper(this);
        this.triangleRasterizer = new TriangleRasterizer_1.TriangleRasterizer(this);
        this.texturedTriangleRasterizer = new TexturedTriangleRasterizer_1.TexturedTriangleRasterizer(this);
        this.scaleClipBlitter = new ScaleClipBlitter_1.ScaleClipBlitter(this);
        this.renderingPipeline = new FlatShadingRenderingPipeline_1.FlatShadingRenderingPipeline(this);
        this.texturedRenderingPipeline = new TexturingRenderingPipeline_1.TexturingRenderingPipeline(this);
        this.tmpGlitch = new Uint32Array(320 * 200);
        this.lensFlareVisible = false;
        this.lensFlareStart = 0;
        this.lensFlareEnd = 0;
        this.width = width;
        this.height = height;
        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float32Array(320 * 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
    }
    setCullFace(face) {
        this.cullMode = face;
    }
    setTexture(texture) {
        this.bob = texture;
    }
    precompute(texture, texture2) {
        this.bunnyObj = this.createBunny();
        this.blenderObj4 = this.getBlenderScene(roomJson, false);
        this.blenderObj5 = this.getBlenderScene(hoodlumJson, false);
        this.blenderObj6 = this.getBlenderScene(labJson, false);
        this.blenderObj7 = this.getBlenderScene(hlm2018Json, false);
        this.sphere = this.createSphere();
        this.plane = this.createPlane();
        this.cylinder = this.createCylinder();
        this.cylinder2 = this.createCylinder2(texture);
        this.sphereDisp = this.createSphereDistplaced(texture);
        this.sphereDisp2 = this.createSphereDistplaced(texture2);
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
    clearColorBuffer(color) {
        this.framebuffer.fill(color);
    }
    drawPixel(x, y, color) {
        this.framebuffer[x + y * this.width] = color;
    }
    readPixel(x, y, color) {
        return this.framebuffer[x + y * this.width];
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
    drawRect2(x, y, width, height, color) {
        let start = x + y * this.width;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                this.framebuffer[start++] = color;
            }
            start += 320 - width;
        }
    }
    drawText(x, y, text, texture) {
        let xpos = x;
        let firstIndex = ' '.charCodeAt(0);
        for (let i = 0; i < text.length; i++) {
            let index = text.charCodeAt(i) - firstIndex;
            let tx = Math.floor(index % 32) * 8;
            let ty = Math.floor(index / 32) * 8;
            this.drawTextureRectFastAlpha(xpos, y, tx, ty, 8, 8, texture);
            xpos += 8;
        }
    }
    addReflections() {
        let start = 150;
        for (let i = 0; i < 50; i++) {
            for (let x = 0; x < 320; x++) {
                this.framebuffer[(start + i) * 320 + x] = this.framebuffer[(start - i * 3 - 1) * 320 + x +
                    this.interpolate(0, 50, i) * (Math.sin(Date.now() * 0.002 + i * 0.2) * 10) | 0];
            }
        }
    }
    drawTextureRect2(xs, ys, xt, yt, width, height, texture, alpha2) {
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                let texIndex = (xt + w) + ((yt + h) * texture.width);
                let frIndex = (xs + w) + ((ys + h) * 320);
                let alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                let inverseAlpha = 1 - alpha;
                let r = (((this.framebuffer[frIndex] >> 0) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 0) & 0xff) * (alpha)) | 0;
                let g = (((this.framebuffer[frIndex] >> 8) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 8) & 0xff) * (alpha)) | 0;
                let b = (((this.framebuffer[frIndex] >> 16) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 16) & 0xff) * (alpha)) | 0;
                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
            }
        }
    }
    drawTextureRectFastAlpha(xs, ys, xt, yt, width, height, texture) {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * 320;
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                let color = texture.texture[texIndex];
                if (color & 0xff000000) {
                    this.framebuffer[frIndex] = color;
                }
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += 320 - width;
        }
    }
    drawTextureRectNoAlpha(xs, ys, xt, yt, width, height, texture) {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * 320;
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                this.framebuffer[frIndex] = texture.texture[texIndex];
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += 320 - width;
        }
    }
    drawTextureRect(xs, ys, xt, yt, width, height, texture, alpha2) {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * 320;
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                let alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                let inverseAlpha = 1 - alpha;
                let fbPixel = this.framebuffer[frIndex];
                let txPixel = texture.texture[texIndex];
                let r = (fbPixel >> 0 & 0xff) * inverseAlpha + (txPixel >> 0 & 0xff) * alpha;
                let g = (fbPixel >> 8 & 0xff) * inverseAlpha + (txPixel >> 8 & 0xff) * alpha;
                let b = (fbPixel >> 16 & 0xff) * inverseAlpha + (txPixel >> 16 & 0xff) * alpha;
                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += 320 - width;
        }
    }
    drawTextureRectAdd(xs, ys, xt, yt, width, height, texture, alpha2) {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * 320;
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                let alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                let inverseAlpha = 1 - alpha;
                let fbPixel = this.framebuffer[frIndex];
                let txPixel = texture.texture[texIndex];
                let r = Math.min(255, (fbPixel >> 0 & 0xff) + (txPixel >> 0 & 0xff) * alpha);
                let g = Math.min(255, (fbPixel >> 8 & 0xff) + (txPixel >> 8 & 0xff) * alpha);
                let b = Math.min(255, (fbPixel >> 16 & 0xff) + (txPixel >> 16 & 0xff) * alpha);
                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += 320 - width;
        }
    }
    pixelate() {
        let xoff = 20;
        let yoff = 50;
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                this.drawBox2(x * 10 + xoff, y * 10 + yoff, 10, 10, this.readPixel(x * 10 + xoff, y * 10 + yoff, 0));
            }
        }
        this.drawLineDDA(new math_1.Vector3f(xoff, yoff, -0.3), new math_1.Vector3f(xoff + 20 * 5, yoff, -0.3), 0xffffffff);
        this.drawLineDDA(new math_1.Vector3f(xoff, yoff + 20 * 5, -0.3), new math_1.Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
        this.drawLineDDA(new math_1.Vector3f(xoff, yoff, -0.3), new math_1.Vector3f(xoff, yoff + 20 * 5, -0.3), 0xffffffff);
        this.drawLineDDA(new math_1.Vector3f(xoff + 20 * 5, yoff, -0.3), new math_1.Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
    }
    interpolate(start, end, current) {
        if (current <= start) {
            return 0;
        }
        if (current >= end) {
            return 1;
        }
        return (current - start) / (end - start);
    }
    scrollingBackground(texture, time) {
        let offset = Math.round(-(1 - this.interpolate(250, 10250, time * 0.25)) * (texture.height - 200));
        this.fastFramebufferCopyOffset(this.framebuffer, texture.texture, offset);
    }
    blockFace(texture, time, startTime) {
        let fadeArray = new Array(16 * 10);
        let rng = new RandomNumberGenerator_1.default();
        rng.setSeed(366);
        // TODO: different fadeArray algorithms
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 16; x++) {
                fadeArray[x + y * 16] = 500 + Math.round(rng.getFloat() * 600000) % 10000;
            }
        }
        this.clear();
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 16; x++) {
                this.drawTextureRect(x * 20, y * 20, x * 20, y * 20, 20, 20, texture, this.interpolate(startTime + fadeArray[x + y * 16], startTime + fadeArray[x + y * 16] + 700, time));
            }
        }
    }
    fastFramebufferCopyOffset(src, dest, offset = 0) {
        let i = 320 * 200 / 32 + 1;
        let k = 320 * 200;
        let l = 320 * (200 - offset);
        while (--i) {
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
            src[--k] = dest[--l];
        }
    }
    // 6 times faster than the slow method that clips and does alpha blending
    fastFramebufferCopy(src, dest, offset = 0) {
        src.set(dest);
    }
    drawPolarDistotion(elapsedTime, texture) {
        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = Math.sqrt(xdist * xdist + ydist * ydist) * 1.355;
                let angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256;
                let color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];
                this.framebuffer[i++] = color1;
            }
        }
    }
    drawPolarDistotion2(elapsedTime, texture) {
        let i = 0;
        let distScale = 1.355 * (0.4 + 0.6 * 0.5 * (1 + Math.sin(elapsedTime * 0.00017)));
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = Math.sqrt(xdist * xdist + ydist * ydist) * distScale;
                let angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256;
                let color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];
                this.framebuffer[i++] = color1;
            }
        }
    }
    drawPolarDistotion3(elapsedTime, texture) {
        let i = 0;
        let distScale = 1.355 * (0.4 + 0.6 * 0.5 * (1 + Math.sin(elapsedTime * 0.00017)));
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = Math.sqrt(xdist * xdist + ydist * ydist) * 0.8 - (elapsedTime * 0.017);
                let angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256 + (elapsedTime * 0.017);
                let color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];
                this.framebuffer[i++] = color1;
            }
        }
    }
    noise(elapsedTime, texture, scale = 0.07) {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 10; y++) {
                this.drawTextureRect(x * 20, y * 20, 20 * (Math.round(elapsedTime / 100 + x + y) % 12), 0, 20, 20, texture, scale);
            }
        }
    }
    drawTexturedBillboard(xp, yp, width, height, texture, z) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {
                    this.wBuffer[index2] = z;
                    let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                    let r = (this.framebuffer[index2] >> 0 & 0xff) + (texture.texture[textureIndex] >> 0 & 0xff);
                    let g = (this.framebuffer[index2] >> 8 & 0xff) + (texture.texture[textureIndex] >> 8 & 0xff);
                    let b = (this.framebuffer[index2] >> 16 & 0xff) + (texture.texture[textureIndex] >> 16 & 0xff);
                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += yStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawParticle(xp, yp, width, height, texture, z, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {
                    let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                    let alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                    let inverseAlpha = 1 - alpha;
                    let framebufferPixel = this.framebuffer[index2];
                    let texturePixel = texture.texture[textureIndex];
                    let r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                    let g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                    let b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;
                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawParticleNoDepth(xp, yp, width, height, texture, z, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                let alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                let inverseAlpha = 1 - alpha;
                let framebufferPixel = this.framebuffer[index2];
                let texturePixel = texture.texture[textureIndex];
                let r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                let g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                let b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;
                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawSoftParticle(xp, yp, width, height, texture, z, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {
                    // float scale = 0.2f;
                    // float fade = clamp((depthMapDepth.x-depth)*scale, 0.0, 1.0);
                    let zDist = Math.min(Math.max(((1 / z - 1 / this.wBuffer[index2])), 0.0), 1.0);
                    // this.wBuffer[index2] = z;
                    let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                    let alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale * zDist;
                    let inverseAlpha = 1 - alpha;
                    let r = (this.framebuffer[index2] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                    let g = (this.framebuffer[index2] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                    let b = (this.framebuffer[index2] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;
                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawRadialBlur() {
        this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
        let texture = new texture_1.Texture();
        texture.texture = this.tmpGlitch;
        texture.width = 320;
        texture.height = 200;
        let width = 320;
        let height = 200;
        for (let i = 0; i < 16; i++) {
            width += 320 * 0.09;
            height += 200 * 0.09;
            this.scaleClipBlitter.drawScaledTextureClip(320 / 2 - width / 2, 200 / 2 - height / 2, width, height, texture, 0.19 * (15 - i) / 15);
            this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
        }
    }
    drawScaledTextureClipBi(xp, yp, width, height, texture, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                //let textureIndex = //Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                let color = texture.getBilinearFilteredPixel2(xx, yy);
                let alpha = 255 * alphaScale;
                let inverseAlpha = 1 - alpha;
                let framebufferPixel = this.framebuffer[index2];
                let texturePixel = color;
                let r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                let g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                let b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;
                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawScaledTextureClipBiAdd(xp, yp, width, height, texture, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                //let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                let color = texture.getBilinearFilteredPixel2(xx, yy);
                let framebufferPixel = this.framebuffer[index2];
                let texturePixel = color;
                let r = Math.min((framebufferPixel >> 0 & 0xff) + (texturePixel >> 0 & 0xff) * alphaBlend, 255);
                let g = Math.min((framebufferPixel >> 8 & 0xff) + (texturePixel >> 8 & 0xff) * alphaBlend, 255);
                let b = Math.min((framebufferPixel >> 16 & 0xff) + (texturePixel >> 16 & 0xff) * alphaBlend, 255);
                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawScaledTextureClipAdd(xp, yp, width, height, texture) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                let framebufferPixel = this.framebuffer[index2];
                let texturePixel = texture.texture[textureIndex];
                let r = Math.min((framebufferPixel >> 0 & 0xff) + (texturePixel >> 0 & 0xff), 255);
                let g = Math.min((framebufferPixel >> 8 & 0xff) + (texturePixel >> 8 & 0xff), 255);
                let b = Math.min((framebufferPixel >> 16 & 0xff) + (texturePixel >> 16 & 0xff), 255);
                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
    drawTexture(x, y, texture, alpha2) {
        const SCREEN_WIDTH = 320;
        const SCREEN_HEIGHT = 200;
        let framebufferIndex = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;
        const width = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        const height = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);
        const textureRowOffset = texture.width - width;
        const framebufferRowOffset = this.width - width;
        const div = 1 / 255 * alpha2;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let alpha = (texture.texture[textureIndex] >> 24 & 0xff) * div;
                let inverseAlpha = 1 - alpha;
                let r = (this.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                let g = (this.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                let b = (this.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;
                this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                framebufferIndex++;
                textureIndex++;
            }
            textureIndex += textureRowOffset;
            framebufferIndex += framebufferRowOffset;
        }
    }
    drawTextureNoClipAlpha(x, y, texture) {
        let framebufferIndex = x + y * this.width;
        let textureIndex = 0;
        let framebufferRowOffset = this.width - texture.width;
        for (let y = 0; y < texture.height; y++) {
            for (let x = 0; x < texture.width; x++) {
                let color = texture.texture[textureIndex];
                if (color & 0xff000000) {
                    this.framebuffer[framebufferIndex] = color;
                }
                framebufferIndex++;
                textureIndex++;
            }
            framebufferIndex += framebufferRowOffset;
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
            new math_1.Vector3f(1.0, 1.0, -1.0), new math_1.Vector3f(-1.0, 1.0, -1.0),
            new math_1.Vector3f(-1.0, 1.0, 1.0), new math_1.Vector3f(1.0, 1.0, 1.0),
            new math_1.Vector3f(1.0, -1.0, 1.0), new math_1.Vector3f(-1.0, -1.0, 1.0),
            new math_1.Vector3f(-1.0, -1.0, -1.0), new math_1.Vector3f(1.0, -1.0, -1.0)
        ];
        let scale = 0.8;
        let modelViewMartrix = math_1.Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix3f.constructXRotationMatrix(elapsedTime * 0.05));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 4 + Math.sin(elapsedTime * 0.09) * 2; // TODO: use translation matrix!
            points2.push(new math_1.Vector3f(x, y, z));
        });
        for (let i = 0; i < index.length; i += 2) {
            let color = 255 | 0 << 16 | 255 << 24;
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }
    project(t1) {
        return new math_1.Vector3f(Math.round((320 / 2) + (292 * t1.x / (-t1.z))), Math.round((200 / 2) - (t1.y * 292 / (-t1.z))), t1.z);
    }
    // https://math.stackexchange.com/questions/859454/maximum-number-of-vertices-in-intersection-of-triangle-with-box/
    nearPlaneClipping(t1, t2, color) {
        const NEAR_PLANE_Z = -1.7;
        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t2), color);
        }
        else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        }
        else if (t1.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            let t3 = new math_1.Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        }
        else if (t2.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            let t3 = new math_1.Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t2), this.project(t3), color);
        }
    }
    clearDepthBuffer() {
        this.wBuffer.fill(-1 / 900);
    }
    sphereFunction2(theta, phi) {
        let pos = new math_1.Vector4f(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta), 1.0);
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
    drawBox2(x1, y1, width, height, color) {
        let index = y1 * 320 + x1;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(color, index, index + width);
            index += 320;
        }
    }
    /*
        public wireFrameTerrain(elapsedTime: number, heightmap: Texture): void {
    
            this.clearDepthBuffer();
    
            let index: Array<number> = [
            ];
    
            let points: Array<Vector3f> = [];
            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    points.push(new Vector3f((x - 128) * 20.0, (heightmap.texture[x + y * 256] & 0x000000ff) * 128 / 256 - 70, (y - 128) * 20.0));
                }
            }
    
            for (let y = 0; y < 256; y += 1) {
                for (let x = 0; x < 256 - 1; x += 1) {
                    index.push(0 + x + (y * 256));
                    index.push(1 + x + (y * 256));
                }
            }
    
            for (let x = 0; x < 256; x += 1) {
                for (let y = 0; y < 256 - 1; y += 1) {
    
                    index.push(x + ((y + 0) * 256));
                    index.push(x + ((y + 1) * 256));
                }
            }
    
            let scale = 0.8;
    
            let modelViewMartrix = Matrix3f.constructYRotationMatrix(elapsedTime * 0.003);
    
    
            let points2: Array<Vector3f> = new Array<Vector3f>();
    
            let xOff = + Math.cos(elapsedTime * 0.000001) * 128 * 20;
            let zOff = Math.sin(elapsedTime * 0.000001) * 128 * 20;
            points.forEach(element => {
                let transformed = modelViewMartrix.multiply(element);
    
                let x = transformed.x + xOff;
                let y = transformed.y;
                let z = transformed.z + zOff; // TODO: use translation matrix!
    
                points2.push(new Vector3f(x, y, z));
            });
    
            for (let i = 0; i < index.length; i += 2) {
                let scale = (1 - Math.min(255, -points2[index[i]].z * 0.9) / 255);
                let color = (255 * scale) << 8 | 100 * scale | (200 * scale) << 16 | 255 << 24;
                this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
            }
        }
    */
    drawBoundingSphere(sphere, matrix, color) {
        let points = [];
        const STEPS = 8;
        const STEPS2 = 8;
        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                let pos = this.sphereFunction2(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2).mul(sphere.getRadius() + 0.01).add(sphere.getCenter());
                pos.w = 1;
                points.push(pos);
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
        let modelViewMartrix = matrix;
        let points2 = new Array();
        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);
            points2.push(new math_1.Vector3f(transformed.x, transformed.y, transformed.z));
        }
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];
            this.nearPlaneClipping(v1, v2, color);
            this.nearPlaneClipping(v1, v3, color);
            this.nearPlaneClipping(v3, v2, color);
        }
    }
    getBlenderScene(file, disp = true, flat = false) {
        let scene = [];
        file.forEach(object => {
            let points = new Array();
            let normals = new Array();
            let faces = new Array();
            let coords;
            if (object.uv) {
                coords = [];
                object.uv.forEach((v) => {
                    let uv = new Vertex_1.TextureCoordinate();
                    uv.u = v.u;
                    uv.v = 1.0 - v.v;
                    coords.push(uv);
                });
            }
            object.vertices.forEach((v) => {
                // some transformation in order for the vertices to be in worldspace
                if (disp)
                    points.push(new math_1.Vector4f(v.x, v.y, v.z).mul(2).add(new math_1.Vector4f(0, -2.7, 0, 0)));
                else
                    points.push(new math_1.Vector4f(v.x, v.y, v.z).mul(2));
            });
            object.normals.forEach((v) => {
                normals.push(new math_1.Vector4f(v.x, v.y, v.z));
            });
            let sphere = new Geometry_1.ComputationalGeometryUtils().computeBoundingSphere(points);
            sphere.getCenter().w = 1;
            // Create class for objects
            let obj = {
                points: points,
                normals: normals,
                uv: coords,
                faces: object.faces,
                points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
                normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0)),
                boundingSphere: sphere,
                name: object.name /// NO!
            };
            scene.push(obj);
        });
        return scene;
    }
    drawPlanedeformationTunnelAnim(elapsedTime, texture) {
        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = 256 * 0.2 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                let dist2 = dist + elapsedTime * 0.002;
                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 16 + elapsedTime * 0.00069;
                let color1 = texture.texture[(dist2 & 0x1f) + (angle & 0x1f) * 32];
                // darkening can be done with alpha blended texture
                let scale = 1 - this.cosineInterpolate(1.0, 6.0, dist);
                let r = ((color1 >> 0) & 0xff) * scale;
                let g = ((color1 >> 8) & 0xff) * scale;
                let b = ((color1 >> 16) & 0xff) * scale;
                let final = r | g << 8 | b << 16;
                this.framebuffer[i++] = final;
            }
        }
    }
    /**
     * This code is pretty slow. About 12 fps with 6 x slowdown int chrome!
     * FIXME:
     * - optimize
     * - precompute dist & angle
     * - maybe use 8 * 8 block interpolation
     */
    drawPlanedeformationTunnelV2(elapsedTime, texture, texture2) {
        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let scale = 1.2;
                let xdist = (x - 320 / 2) + Math.sin(elapsedTime * 0.0001) * 80 * scale;
                let ydist = (y - 200 / 2) + Math.cos(elapsedTime * 0.0001) * 80 * scale;
                let xdist2 = (x - 320 / 2) + Math.sin(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                let ydist2 = (y - 200 / 2) + Math.cos(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                let dist = 256 * 20 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                dist += Math.sin(Math.atan2(xdist, ydist) * 5) * 8;
                let dist2 = 256 * 20 / Math.max(1.0, Math.sqrt(xdist2 * xdist2 + ydist2 * ydist2));
                dist2 += Math.sin(Math.atan2(xdist2, ydist2) * 5) * 8;
                let finalDist = dist - dist2 + elapsedTime * 0.019;
                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;
                angle -= (Math.atan2(xdist2, ydist2) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;
                // FIXME: scale by 256
                let color1 = texture.texture[(finalDist & 0xff) + (angle & 0xff) * 255];
                let cScale = Math.min(60 / (dist * 2), 1.0) * Math.min(60 / (dist2 * 2), 1.0);
                let r = (color1 & 0xff) * cScale;
                let g = (color1 >> 8 & 0xff) * cScale;
                let b = (color1 >> 16 & 0xff) * cScale;
                this.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }
    drawLedTunnel(elapsedTime, texture) {
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                let distance = 160 / (Math.sqrt((x - 40 / 2.0) * (x - 40 / 2.0) + (y - 25 / 2.0) * (y - 25 / 2.0)) * 1.4);
                /*let power = 2.0;
                let distance = Math.pow(Math.pow((x - 40 / 2.0) * (x - 40 / 2.0),power) + Math.pow((y - 25 / 2.0) * (y - 25 / 2.0),power),1/(2*power));
                let waveSum: number =  (Math.sin(distance+elapsedTime*0.005)+1)*0.5*(1-Math.min(distance*0.03, 1.0));
                */
                let waveSum = (Math.sin(distance + elapsedTime * 0.005) + 1) * 0.5 * (1 - Math.min(distance * 0.003, 1.0));
                // FIXME: put this into a reusable method to remove
                // code duplications? ie. LedBuffer class wit arrayy and draw method :)
                let intensity = ((waveSum * 15) | 0) % 16;
                this.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * intensity, 8, 8, texture);
            }
        }
    }
    drawParticleWaves(elapsedTime, texture, noClear = false) {
        if (!noClear)
            this.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();
        let points = new Array();
        const num = 50;
        const scale = 2;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                let x = (j - num / 2) * scale;
                let y = 4 * (Math.sin(j * 0.09 * 2 + elapsedTime * 0.0008) + Math.cos(i * 0.08 * 2 + elapsedTime * 0.0009));
                let z = (i - num / 2) * scale;
                points.push(new math_1.Vector3f(x, y, z));
            }
        }
        let modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI * 0.1).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.00006)));
        let points2 = new Array(points.length);
        points.forEach(element => {
            let transformed = this.project(modelViewMartrix.multiply(element));
            points2.push(transformed);
        });
        points2.sort(function (a, b) {
            return a.z - b.z;
        });
        points2.forEach(element => {
            let size = -(1.3 * 192 / (element.z));
            this.drawParticle(Math.round(element.x - size / 2), Math.round(element.y - size / 2), Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-60, -25, element.z));
        });
    }
    drawScreenBounds(framebuffer) {
        const color = Color_1.Color.WHITE.toPackedFormat();
        const width = 320 / 2;
        const height = 200 / 2;
        framebuffer.drawLineDDANoZ(new math_1.Vector3f(width / 2, height / 2, 0), new math_1.Vector3f(width / 2 + width, height / 2, -100), color);
        framebuffer.drawLineDDANoZ(new math_1.Vector3f(width / 2, height / 2, 0), new math_1.Vector3f(width / 2, height / 2 + height, -100), color);
        framebuffer.drawLineDDANoZ(new math_1.Vector3f(width / 2 + width, height / 2, 0), new math_1.Vector3f(width / 2 + width, height / 2 + height, -100), color);
        framebuffer.drawLineDDANoZ(new math_1.Vector3f(width / 2, height / 2 + height, 0), new math_1.Vector3f(width / 2 + width, height / 2 + height, -100), color);
    }
    drawBlenderScene5(elapsedTime, texture3, texture, dirt) {
        this.clearDepthBuffer();
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -54 + (Math.sin(elapsedTime * 0.0006) * 0.5 + 0.5) * 9).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.8 - 0.1).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, -13, 0))));
        let mv = camera.multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(9, 9, 9));
        for (let j = 0; j < this.blenderObj4.length; j++) {
            let model = this.blenderObj4[j];
            if (j !== 0 && j !== 2)
                this.renderingPipeline.draw(model, mv, 200, 255, 216);
            if (j === 0)
                this.renderingPipeline.draw(model, mv, 244, 200, 216);
            if (j === 2)
                this.renderingPipeline.draw(model, mv, 244, 225, 216);
        }
        mv = camera.multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 14.2, -4).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(7, 7, 9).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI * 2 * this.cosineInterpolate(0, 1300, Math.floor(elapsedTime * 0.7) % 4000)))));
        let model2 = this.blenderObj5[0];
        this.renderingPipeline.draw(model2, mv, 200, 255, 216);
        const scale = 8;
        mv = camera.multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 19, 0).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale)));
        //   this.shadingSphereEnvDisp2(elapsedTime * 0.0003, mv);
        let lensflareScreenSpace = this.project(camera.multiply(new math_1.Vector3f(20, 19, -90)));
        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.15, texture, dirt);
    }
    drawBlenderScene6(elapsedTime, texture3, texture, dirt) {
        this.clearDepthBuffer();
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -34 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 7).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.5 - 0.2).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 1.9, 0))));
        let mv = camera.multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(13, 13, 13));
        let scal = Math.sin(elapsedTime * 0.003) * 0.5 + 0.5;
        for (let j = 0; j < this.blenderObj6.length; j++) {
            let model = this.blenderObj6[j];
            this.renderingPipeline.draw(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }
        mv = camera.multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, -5.5, 0).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(413, 413, 413).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI * 0.5))));
        let model = this.blenderObj7[0];
        this.renderingPipeline.draw(model, mv, 244, 100, 116);
        let points = new Array();
        const num = 10;
        const num2 = 6;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num2; j++) {
                let y = ((i + elapsedTime * 0.001) % 10) * 2.5 - 12;
                let scale2 = (1 + 4 * this.interpolate(-10, 10, y)) *
                    ((Math.sin(elapsedTime * 0.0012 + Math.PI * 2 / num * i * 2) * 0.5 + 0.5) * 0.5 + 0.5);
                let x = scale2 * Math.sin(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);
                let z = scale2 * Math.cos(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);
                points.push(new math_1.Vector3f(x, y, z));
            }
        }
        let modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, -0.0, 0));
        let points2 = new Array(points.length);
        points.forEach(element => {
            let transformed = this.project(modelViewMartrix.multiply(element));
            points2.push(transformed);
        });
        points2.sort(function (a, b) {
            return a.z - b.z;
        });
        points2.forEach(element => {
            let size = -(4.3 * 192 / (element.z));
            this.drawSoftParticle(Math.round(element.x - size / 2), Math.round(element.y - size / 2), Math.round(size), Math.round(size), texture3, 1 / element.z, 0.7);
        });
    }
    drawPlaneDeformation(elapsedTime, texture) {
        // optimize
        // power of two modulo with &
        // this.framebuffer.clearColor(new Color());
        // precompute LUD + render to half size backbuffer
        const IMG_WIDTH = texture.width;
        const IMG_HEIGHT = texture.height;
        let framebufferIndex = 0;
        for (let y = 0; y < 200; y++) {
            let yy = (-1.00 + 2.00 * y / 200);
            for (let x = 0; x < 320; x++) {
                let xx = (-1.00 + 2.00 * x / 320);
                let d = Math.sqrt(xx * xx + yy * yy);
                let a = Math.atan2(yy, xx);
                // magic formulas here
                let u = ((xx / Math.abs(yy)) * IMG_WIDTH * 0.05) | 0;
                let v = (1.0 / Math.abs(yy) * IMG_HEIGHT * 0.05 + elapsedTime * 0.008) | 0;
                let scale = 1 - Math.max(Math.min(1 / Math.abs(yy) * 0.2, 1), 0);
                let color = texture.texture[(u & 0xff) + (v & 0xff) * IMG_WIDTH];
                let r = ((color >> 0) & 0xff) * scale;
                let g = ((color >> 8) & 0xff) * scale;
                let b = ((color >> 16) & 0xff) * scale;
                color = (255 << 24) | (b << 16) | (g << 8) | (r << 0);
                this.framebuffer[framebufferIndex++] = color;
            }
        }
    }
    /**
     * this rountine is pretty slow:
     * - optimize scaled blittinh
     * - optimize geometry stage by reusing arrays
     * - dont us forEach!
     */
    scene7(elapsedTime, texture) {
        let points = new Array();
        for (let i = 0; i < 120; i++) {
            points.push(new math_1.Vector3f(Math.sin(i * 0.25) * 8, i * 0.3 - 18, Math.cos(i * 0.25) * 8));
        }
        points.push(new math_1.Vector3f(0, 0, 5));
        let rotMat = math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.0005);
        rotMat = rotMat.multiplyMatrix(math_1.Matrix3f.constructXRotationMatrix(elapsedTime * 0.0002));
        let points2 = new Array(points.length);
        points.forEach(element => {
            let alpha = -elapsedTime * 0.0013;
            let transformed = rotMat.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 10;
            let xx = 320 / 2 + (x / (z * 0.0058));
            let yy = 200 / 2 + (y / (z * 0.0058));
            points2.push(new math_1.Vector3f(xx, yy, z));
        });
        points2.sort(function (a, b) {
            return a.z - b.z;
        });
        points2.forEach(element => {
            let size = -(1.9 / (element.z * 0.0058)) | 0;
            this.drawSoftParticle((element.x - size / 2) | 0, (element.y - size / 2) | 0, size, size, texture, 1 / element.z, 1.0);
        });
    }
    shadingSphereClip(elapsedTime) {
        this.clearDepthBuffer();
        let scale = 1.6;
        let modelViewMartrix = math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.1).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = math_1.Matrix4f.constructZRotationMatrix(-elapsedTime * 0.02).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, -21)
            .multiplyMatrix(modelViewMartrix));
        this.renderingPipeline.draw(this.torus.getMesh(), modelViewMartrix, 215, 30, 120);
    }
    torusFunction(alpha) {
        return new math_1.Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }
    torusFunction2(alpha) {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new math_1.Vector3f(r * Math.cos(p * alpha), r * Math.cos(q * alpha), r * Math.sin(p * alpha));
    }
    cosineInterpolate(y1, y2, mu) {
        let mu2;
        if (mu <= y1)
            return 0;
        if (mu >= y2)
            return 1;
        mu2 = (mu - y1) / (y2 - y1);
        return (1 - Math.cos(mu2 * Math.PI)) / 2;
    }
    /*

    public shadingTorusENvironment(elapsedTime: number): void {

        this.wBuffer.fill(100);
        let points: Array<Vector4f> = [];
        let textCoords: Array<TextureCoordinate> = [];

        // compute normals
        let normals: Array<Vector4f> = new Array<Vector4f>();
        const STEPS = 15 * 2;
        const STEPS2 = 8 * 2;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new Vector4f(pos.x, pos.y, pos.z));
                let normal = frame.sub(pos).normalize();
                normals.push(new Vector4f(normal.x, normal.y, normal.z, 0));
                let t = new TextureCoordinate();
                t.u = 1 / (STEPS2) * r;
                t.v = 1 / (STEPS) * i;
                textCoords.push(t);
            }
        }

        let index: Array<number> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push((((STEPS2 + 1) * j) + (1 + i))); // 2
                index.push((((STEPS2 + 1) * j) + (0 + i))); // 1
                index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))); //3

                index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (0 + i))); //4
                index.push((((STEPS2 + 1) * j) + (STEPS2 + 1) + (1 + i))); //3
                index.push((((STEPS2 + 1) * j) + (0 + i))); // 5
            }
        }

        let scale = 2.1;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));

        let points2: Array<Vector4f> = new Array<Vector4f>();

        let normals2: Array<Vector4f> = new Array<Vector4f>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiplyHom(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10
            , -45)
            .multiplyMatrix(modelViewMartrix);

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));

            points2.push(new Vector4f(Math.round(xx), Math.round(yy), z));
        }

      
        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let n1 = normals2[index[i]].normalize();

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]].normalize();

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]].normalize();

            if (this.isTriangleCCW(v1, v2, v3)) {

                let normal = n3;
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector4f(0.1, 0.1, -1).normalize())) * 205 + 50), 255);
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;

                //let color = 255 << 24 | 255 << 16 | 150 << 8 | 255;

                vertexArray[0].position = v1;
                this.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2]);
                }
            }
        }
    }
*/
    divideSphere(points, index, steps) {
        let points2 = [];
        let normals2 = [];
        let index2 = [];
        let c = 0;
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
            let vn1 = v2.sub(v1).mul(0.5).add(v1).normalize();
            let vn2 = v3.sub(v2).mul(0.5).add(v2).normalize();
            let vn3 = v1.sub(v3).mul(0.5).add(v3).normalize();
            points2.push(v1);
            points2.push(vn1);
            points2.push(vn3);
            normals2.push(v1);
            normals2.push(vn1);
            normals2.push(vn3);
            index2.push(c++);
            index2.push(c++);
            index2.push(c++);
            points2.push(vn1);
            points2.push(v2);
            points2.push(vn2);
            normals2.push(vn1);
            normals2.push(v2);
            normals2.push(vn2);
            index2.push(c++);
            index2.push(c++);
            index2.push(c++);
            points2.push(vn1);
            points2.push(vn2);
            points2.push(vn3);
            normals2.push(vn1);
            normals2.push(vn2);
            normals2.push(vn3);
            index2.push(c++);
            index2.push(c++);
            index2.push(c++);
            points2.push(vn3);
            points2.push(vn2);
            points2.push(v3);
            normals2.push(vn3);
            normals2.push(vn2);
            normals2.push(v3);
            index2.push(c++);
            index2.push(c++);
            index2.push(c++);
        }
        if (steps > 0) {
            return this.divideSphere(points2, index2, --steps);
        }
        else {
            return {
                points: points2,
                normals: normals2,
                index: index2
            };
        }
    }
    createSphere() {
        let pointsA = [
            new math_1.Vector3f(0.0, -1.0, 0.0),
            new math_1.Vector3f(1.0, 0.0, 0.0),
            new math_1.Vector3f(0.0, 0.0, 1.0),
            new math_1.Vector3f(-1.0, 0.0, 0.0),
            new math_1.Vector3f(0.0, 0.0, -1.0),
            new math_1.Vector3f(0.0, 1.0, 0.0)
        ];
        let indexA = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 1,
            1, 5, 2,
            2, 5, 3,
            3, 5, 4,
            4, 5, 1
        ];
        let k = this.divideSphere(pointsA, indexA, 4);
        // optimize
        let points = [];
        let points2 = [];
        let normals = [];
        let normals2 = [];
        let index = [];
        k.index.forEach(i => {
            let p = k.points[i];
            let point = points.find(point => point.sub(p).length() < 0.001);
            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            }
            else {
                index.push(points.push(p) - 1);
            }
        });
        points.forEach(p => {
            normals.push(new math_1.Vector3f(0, 0, 0));
            normals2.push(new math_1.Vector3f(0, 0, 0));
            points2.push(new math_1.Vector3f(0, 0, 0));
        });
        return {
            points,
            points2,
            normals,
            normals2,
            index
        };
    }
    createPlane() {
        let k = {
            points: []
        };
        for (let y = 0; y < 60; y++) {
            for (let x = 0; x < 100; x++) {
                k.points.push(new math_1.Vector3f(0 + x, 0 + y, 0));
                k.points.push(new math_1.Vector3f(0 + x, 1 + y, 0));
                k.points.push(new math_1.Vector3f(1 + x, 0 + y, 0));
                k.points.push(new math_1.Vector3f(1 + x, 0 + y, 0));
                k.points.push(new math_1.Vector3f(0 + x, 1 + y, 0));
                k.points.push(new math_1.Vector3f(1 + x, 1 + y, 0));
            }
        }
        // optimize
        let points = [];
        let points2 = [];
        let normals = [];
        let normals2 = [];
        let index = [];
        k.points.forEach(i => {
            let p = i;
            let point = points.find(point => point.sub(p).length() < 0.001);
            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            }
            else {
                index.push(points.push(p) - 1);
            }
        });
        points.forEach(p => {
            normals.push(new math_1.Vector3f(0, 0, 0));
            normals2.push(new math_1.Vector3f(0, 0, 0));
            points2.push(new math_1.Vector3f(0, 0, 0));
        });
        return {
            points,
            points2,
            normals,
            normals2,
            index
        };
    }
    createCylinder() {
        let k = {
            points: []
        };
        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                let xx = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                let xx2 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                let yy = Math.cos(2 * Math.PI / LOOPX * x) * 30;
                let yy2 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;
                k.points.push(new math_1.Vector3f(xx, 0 + y, yy));
                k.points.push(new math_1.Vector3f(xx, 1 + y, yy));
                k.points.push(new math_1.Vector3f(xx2, 0 + y, yy2));
                k.points.push(new math_1.Vector3f(xx2, 0 + y, yy2));
                k.points.push(new math_1.Vector3f(xx, 1 + y, yy));
                k.points.push(new math_1.Vector3f(xx2, 1 + y, yy2));
            }
        }
        // optimize
        let points = [];
        let points2 = [];
        let normals = [];
        let normals2 = [];
        let texture = [];
        let index = [];
        k.points.forEach(i => {
            let p = i;
            let point = points.find(point => point.sub(p).length() < 0.001);
            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            }
            else {
                index.push(points.push(p) - 1);
            }
        });
        points.forEach(p => {
            normals.push(new math_1.Vector3f(0, 0, 0));
            normals2.push(new math_1.Vector3f(0, 0, 0));
            points2.push(new math_1.Vector3f(0, 0, 0));
            texture.push(new Vertex_1.TextureCoordinate());
        });
        return {
            points,
            points2,
            normals,
            normals2,
            index,
            texture
        };
    }
    createSphereDistplaced(texture) {
        let sphere = this.createSphere();
        let newPoints = new Array();
        sphere.points.forEach((point) => {
            let x = point.x;
            let y = point.y;
            let z = point.z;
            const radius = 1.0;
            let u = Math.floor((0.5 + Math.atan2(z, x) / (2 * Math.PI)) * 255);
            let v = Math.floor((0.5 - Math.asin(y) / Math.PI) * 255);
            let disp = 1 + 1.4 * ((texture.texture[u + v * 256] & 0xff) / 255);
            newPoints.push(point.mul(disp));
        });
        sphere.points = newPoints;
        return sphere;
    }
    createCylinder2(texture) {
        let k = {
            points: []
        };
        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                let xpos = (x / LOOPX * 256) & 0xff;
                let xpos2 = ((x + 1) / LOOPX * 256) & 0xff;
                let ypos = (y * 0.9 / LOOPY * 256) & 0xff;
                let ypos2 = ((y + 1) * 0.9 / LOOPY * 256) & 0xff;
                let disp_x0y0 = 1 + 0.9 * ((texture.texture[xpos + ypos * 256] & 0xff) / 255);
                let disp_x1y0 = 1 + 0.9 * ((texture.texture[xpos2 + ypos * 256] & 0xff) / 255);
                let disp_x0y1 = 1 + 0.9 * ((texture.texture[xpos + ypos2 * 256] & 0xff) / 255);
                let disp_x1y1 = 1 + 0.9 * ((texture.texture[xpos2 + ypos2 * 256] & 0xff) / 255);
                let x0 = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                let z0 = Math.cos(2 * Math.PI / LOOPX * x) * 30;
                let x1 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                let z1 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;
                let scale = 1;
                k.points.push(new math_1.Vector3f(x0 * disp_x0y0, 0 + y, z0 * disp_x0y0));
                k.points.push(new math_1.Vector3f(x0 * disp_x0y1, 1 + y, z0 * disp_x0y1));
                k.points.push(new math_1.Vector3f(x1 * disp_x1y0, 0 + y, z1 * disp_x1y0));
                k.points.push(new math_1.Vector3f(x1 * disp_x1y0, 0 + y, z1 * disp_x1y0));
                k.points.push(new math_1.Vector3f(x0 * disp_x0y1, 1 + y, z0 * disp_x0y1));
                k.points.push(new math_1.Vector3f(x1 * disp_x1y1, 1 + y, z1 * disp_x1y1));
            }
        }
        // optimize
        let points = [];
        let points2 = [];
        let normals = [];
        let normals2 = [];
        let index = [];
        k.points.forEach(i => {
            let p = i;
            let point = points.find(point => point.sub(p).length() < 0.001);
            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            }
            else {
                index.push(points.push(p) - 1);
            }
        });
        points.forEach(p => {
            normals.push(new math_1.Vector3f(0, 0, 0));
            normals2.push(new math_1.Vector3f(0, 0, 0));
            points2.push(new math_1.Vector3f(0, 0, 0));
        });
        return {
            points,
            points2,
            normals,
            normals2,
            index
        };
    }
    /*
    public shadingSphereEnv(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let result = this.sphere;

        for (let i = 0; i < result.points.length; i++) {
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x + Math.sin(result.points[i].y * 5.2 + elapsedTime * 5.83) * 0.3;
            result.points2[i].z = result.points[i].z + Math.sin(result.points[i].x * 10.2 + elapsedTime * 3.83) * 0.15;
            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector3f = new Vector3f(0, 0, 0);
        let norm2: Vector3f = new Vector3f(0, 0, 0);
        let cross: Vector3f = new Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector3f = points[index[i]];
            let v2: Vector3f = points[index[i + 1]];
            let v3: Vector3f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 37.1;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 3.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 2.3));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 1.0) * 46, Math.sin(elapsedTime * 1.2) * 20
            , -85)
            .multiplyMatrix(modelViewMartrix);


        let points2: Array<Vector3f> = result.points2;
        let normals2: Array<Vector3f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let n1 = normals2[index[i]];

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                this.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    */
    /*
    public shadingPlaneEnv(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let result = this.plane;

        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].y - 30;
            let x = result.points[i].x - 50;
            let length = Math.sqrt(x * x + y * y);
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x;
            result.points2[i].z = result.points[i].z + (
                Math.sin(result.points[i].y * 0.2 + elapsedTime * 2.83) * 5.3
                + Math.sin(result.points[i].x * 0.5 + elapsedTime * 2.83) * 4.3) * scale2
                + Math.sin(length * 0.4 - elapsedTime * 3.83) * 4.3;

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector3f = new Vector3f(0, 0, 0);
        let norm2: Vector3f = new Vector3f(0, 0, 0);
        let cross: Vector3f = new Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector3f = points[index[i]];
            let v2: Vector3f = points[index[i + 1]];
            let v3: Vector3f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(Math.PI + Math.sin(elapsedTime * 2.75) * 0.25)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI / 5 + Math.sin(elapsedTime * 2.25) * 0.35).multiplyMatrix(Matrix4f.constructTranslationMatrix(-50, -25
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0,
            -205 + Math.sin(elapsedTime * 1.9) * 50)
            .multiplyMatrix(modelViewMartrix);


        let points2: Array<Vector3f> = result.points2;
        let normals2: Array<Vector3f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }



        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let n1 = normals2[index[i]];

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                this.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    */
    /*
    public shadingCylinderEnv(elapsedTime: number): void {
        this.wBuffer.fill(100);
        let result = this.cylinder;

        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].y - 30;
            let x = result.points[i].x - 50;
            let length = Math.sqrt(x * x + y * y);
            let myScale = (1 + 0.2 * Math.sin(result.points[i].y * 0.01 + elapsedTime * 1.83));
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x * myScale + Math.sin(result.points[i].y * 0.1 + elapsedTime * 3.83) * 8.3
                + Math.sin(result.points[i].y * 0.55 + elapsedTime * 2.83) * 2;
            result.points2[i].z = result.points[i].z * myScale + Math.cos(result.points[i].y * 0.1 + elapsedTime * 3.83) * 8.3
                + Math.cos(result.points[i].y + result.points[i].x * 0.55 + elapsedTime * 2.83) * 2;

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector3f = new Vector3f(0, 0, 0);
        let norm2: Vector3f = new Vector3f(0, 0, 0);
        let cross: Vector3f = new Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector3f = points[index[i]];
            let v2: Vector3f = points[index[i + 1]];
            let v3: Vector3f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        let textureCoords: Array<TextureCoordinate> = result.texture;

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(0)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(0).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-80, -210,
            -290)
            .multiplyMatrix(modelViewMartrix);

        let points2: Array<Vector3f> = result.points2;
        let normals2: Array<Vector3f> = result.normals2;


        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyArr(normals[n], normals2[n]);
            this.fakeSphere2(normals2[n], textureCoords[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            // Only render triangles with CCW-ordered vertices
            //
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = points2[index[i]];
            let t1 = textureCoords[index[i]];

            let v2 = points2[index[i + 1]];
            let t2 = textureCoords[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let t3 = textureCoords[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = t1;

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = t2;

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = t3;

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    */
    /*
    public shadingCylinderEnvDisp(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let result = this.cylinder2;

        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].z;
            let x = result.points[i].x;
            let length = Math.sqrt(x * x + y * y);
            let rot = Math.sin(result.points[i].y * 0.039 + (10 - length) * 0.02 + elapsedTime * 0.6) * 4;
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x * Math.cos(rot) - result.points[i].z * Math.sin(rot);
            result.points2[i].z = result.points[i].x * Math.sin(rot) + result.points[i].z * Math.cos(rot);

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector3f = new Vector3f(0, 0, 0);
        let norm2: Vector3f = new Vector3f(0, 0, 0);
        let cross: Vector3f = new Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector3f = points[index[i]];
            let v2: Vector3f = points[index[i + 1]];
            let v3: Vector3f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(0)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(0.2 * Math.sin(elapsedTime * 1.2)).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-80, -210,
            -290)
            .multiplyMatrix(modelViewMartrix);

        let points2: Array<Vector3f> = result.points2;
        let normals2: Array<Vector3f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            let v1 = points2[index[i]];
            let n1 = normals2[index[i]];

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                this.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    */
    /*
    public shadingSphereEnvDisp(elapsedTime: number): void {
        this.wBuffer.fill(100);

        let result = this.sphereDisp;

        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].z;
            let x = result.points[i].x;
            let length = Math.sqrt(x * x + y * y);
            let rot = Math.sin(result.points[i].y * 0.539 + (10 - length) * 0.05 + elapsedTime * 0.9) * 4.5;
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x * Math.cos(rot) - result.points[i].z * Math.sin(rot);
            result.points2[i].z = result.points[i].x * Math.sin(rot) + result.points[i].z * Math.cos(rot);

            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }

        let points = result.points2;
        let index = result.index;
        let normals = result.normals;

        let norm: Vector3f = new Vector3f(0, 0, 0);
        let norm2: Vector3f = new Vector3f(0, 0, 0);
        let cross: Vector3f = new Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1: Vector3f = points[index[i]];
            let v2: Vector3f = points[index[i + 1]];
            let v3: Vector3f = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        let scale = 3.7;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0
                , 0))));

        modelViewMartrix = Matrix4f.constructTranslationMatrix(-0, -0,
            -10)
            .multiplyMatrix(modelViewMartrix);

            let points2: Array<Vector3f> = result.points2;
        let normals2: Array<Vector3f> = result.normals2;

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < normals.length; n++) {
            normalMatrix.multiplyArr(normals[n], normals2[n]);
        }

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);

            points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
            points2[p].z = transformed.z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
        for (let i = 0; i < index.length; i += 3) {

            let v1 = points2[index[i]];
            let n1 = normals2[index[i]];

            let v2 = points2[index[i + 1]];
            let n2 = normals2[index[i + 1]];

            let v3 = points2[index[i + 2]];
            let n3 = normals2[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {

                let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;

                vertexArray[0].position = v1;
                this.fakeSphere(n1, vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(n2, vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(n3, vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {


                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
*/
    /*
        public shadingSphereEnvDisp2(elapsedTime: number, modelViewMartrix: Matrix4f): void {
            let result = this.sphereDisp2;
    
            let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
            for (let i = 0; i < result.points.length; i++) {
                let y = result.points[i].z;
                let x = result.points[i].x;
                let length = Math.sqrt(x * x + y * y);
                let rot = Math.sin(result.points[i].y * 0.539 + (10 - length) * 0.05 + elapsedTime * 0.9) * 4.5;
                rot *= Math.sin(elapsedTime * 0.25) * 0.5 + 0.5;
                result.points2[i].y = result.points[i].y;
                result.points2[i].x = result.points[i].x * Math.cos(rot) - result.points[i].z * Math.sin(rot);
                result.points2[i].z = result.points[i].x * Math.sin(rot) + result.points[i].z * Math.cos(rot);
    
                result.normals[i].x = 0;
                result.normals[i].y = 0;
                result.normals[i].z = 0;
            }
    
            let points = result.points2;
            let index = result.index;
            let normals = result.normals;
    
            let norm: Vector3f = new Vector3f(0, 0, 0);
            let norm2: Vector3f = new Vector3f(0, 0, 0);
            let cross: Vector3f = new Vector3f(0, 0, 0);
            for (let i = 0; i < index.length; i += 3) {
                let v1: Vector3f = points[index[i]];
                let v2: Vector3f = points[index[i + 1]];
                let v3: Vector3f = points[index[i + 2]];
                norm.sub2(v2, v1);
                norm2.sub2(v3, v1);
                cross.cross2(norm, norm2);
                let normal = cross;
                normals[index[i]].add2(normals[index[i]], normal);
                normals[index[i + 1]].add2(normals[index[i + 1]], normal);
                normals[index[i + 2]].add2(normals[index[i + 2]], normal);
            }
    
            for (let i = 0; i < normals.length; i++) {
                normals[i].normalize2();
            }
    
            let points2: Array<Vector3f> = result.points2;
            let normals2: Array<Vector3f> = result.normals2;
    
            let normalMatrix = modelViewMartrix.computeNormalMatrix();
    
            for (let n = 0; n < normals.length; n++) {
                normalMatrix.multiplyArr(normals[n], normals2[n]);
            }
    
            for (let p = 0; p < points.length; p++) {
                let transformed = modelViewMartrix.multiply(points[p]);
    
                points2[p].x = Math.round((320 * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
                points2[p].y = Math.round((200 * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
                points2[p].z = transformed.z;
            }
    
            let vertex1 = new Vertex();
            vertex1.textureCoordinate = new TextureCoordinate();
            let vertex2 = new Vertex();
            vertex2.textureCoordinate = new TextureCoordinate();
            let vertex3 = new Vertex();
            vertex3.textureCoordinate = new TextureCoordinate();
            let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);
            for (let i = 0; i < index.length; i += 3) {
    
                let v1 = points2[index[i]];
                let n1 = normals2[index[i]];
    
                let v2 = points2[index[i + 1]];
                let n2 = normals2[index[i + 1]];
    
                let v3 = points2[index[i + 2]];
                let n3 = normals2[index[i + 2]];
    
                if (this.isTriangleCCW(v1, v2, v3)) {
    
                    let color = 255 << 24 | 255 << 16 | 255 << 8 | 255;
    
                    vertexArray[0].position = v1;
                    this.fakeSphere(n1, vertex1);
    
                    vertexArray[1].position = v2;
                    this.fakeSphere(n2, vertex2);
    
                    vertexArray[2].position = v3;
                    this.fakeSphere(n3, vertex3);
    
                    if (v1.x < Framebuffer.minWindow.x ||
                        v2.x < Framebuffer.minWindow.x ||
                        v3.x < Framebuffer.minWindow.x ||
                        v1.x > Framebuffer.maxWindow.x ||
                        v2.x > Framebuffer.maxWindow.x ||
                        v3.x > Framebuffer.maxWindow.x ||
                        v1.y < Framebuffer.minWindow.y ||
                        v2.y < Framebuffer.minWindow.y ||
                        v3.y < Framebuffer.minWindow.y ||
                        v1.y > Framebuffer.maxWindow.y ||
                        v2.y > Framebuffer.maxWindow.y ||
                        v3.y > Framebuffer.maxWindow.y) {
    
    
                        this.clipConvexPolygon2(vertexArray, color);
                    } else {
                        this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                    }
                }
            }
        }
    */
    createBunny() {
        let points = new Array();
        bunnyJson.vertices.forEach(x => {
            points.push(new math_1.Vector3f(x.x, x.y, x.z));
        });
        let normals = new Array();
        bunnyJson.normals.forEach(x => {
            normals.push(new math_1.Vector3f(x.x, x.y, x.z).normalize());
        });
        let index = bunnyJson.faces;
        let points2 = new Array();
        let normals2 = new Array();
        for (let i = 0; i < points.length; i++) {
            points2.push(new math_1.Vector3f(0, 0, 0));
        }
        for (let i = 0; i < normals.length; i++) {
            normals2.push(new math_1.Vector3f(0, 0, 0));
        }
        let object = {
            index: index,
            points: points,
            normals: normals,
            points2: points2,
            normals2: normals2
        };
        return object;
    }
    /*
    public reflectionBunny(elapsedTime: number): void {
        this.clearDepthBuffer();

        let obj = this.bunnyObj;

        let scale = 64.1;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.30));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -8).multiplyMatrix(modelViewMartrix);

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let n = 0; n < obj.normals.length; n++) {
            normalMatrix.multiplyArr(obj.normals[n], obj.normals2[n]);
        }

        for (let p = 0; p < obj.points.length; p++) {
            let transformed = modelViewMartrix.multiply(obj.points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));

            obj.points2[p].x = Math.round(xx);
            obj.points2[p].y = Math.round(yy);
            obj.points2[p].z = z;
        }

        let vertex1 = new Vertex();
        vertex1.textureCoordinate = new TextureCoordinate();
        let vertex2 = new Vertex();
        vertex2.textureCoordinate = new TextureCoordinate();
        let vertex3 = new Vertex();
        vertex3.textureCoordinate = new TextureCoordinate();
        let vertexArray = new Array<Vertex>(vertex1, vertex2, vertex3);

        for (let i = 0; i < obj.index.length; i += 6) {
            let v1 = obj.points2[obj.index[i]];
            let v2 = obj.points2[obj.index[i + 1]];
            let v3 = obj.points2[obj.index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {
                vertexArray[0].position = v1;
                this.fakeSphere(obj.normals2[obj.index[i + 3]], vertex1);

                vertexArray[1].position = v2;
                this.fakeSphere(obj.normals2[obj.index[i + 4]], vertex2);

                vertexArray[2].position = v3;
                this.fakeSphere(obj.normals2[obj.index[i + 5]], vertex3);

                if (v1.x < Framebuffer.minWindow.x ||
                    v2.x < Framebuffer.minWindow.x ||
                    v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x ||
                    v2.x > Framebuffer.maxWindow.x ||
                    v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y ||
                    v2.y < Framebuffer.minWindow.y ||
                    v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y ||
                    v2.y > Framebuffer.maxWindow.y ||
                    v3.y > Framebuffer.maxWindow.y) {
                    this.clipConvexPolygon2(vertexArray, 0);
                } else {
                    this.texturedTriangleRasterizer.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], 0);
                }
            }
        }
    }
*/
    fakeSphere(normal, vertex) {
        // https://www.mvps.org/directx/articles/spheremap.htm
        //vertex.textureCoordinate.u = 0.5 + normal.x * 0.5;
        //vertex.textureCoordinate.v = 0.5 - normal.y * 0.5;
        vertex.textureCoordinate.u = 0.5 + Math.asin(normal.x) / Math.PI;
        vertex.textureCoordinate.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }
    fakeSphere2(normal, tex) {
        tex.u = 0.5 + Math.asin(normal.x) / Math.PI;
        tex.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }
    clipConvexPolygon2(subject) {
        let output = subject;
        for (let j = 0; j < Framebuffer.clipRegion.length; j++) {
            let edge = Framebuffer.clipRegion[j];
            let input = output;
            output = new Array();
            let S = input[input.length - 1];
            for (let i = 0; i < input.length; i++) {
                let point = input[i];
                if (edge.isInside2(point)) {
                    if (!edge.isInside2(S)) {
                        output.push(edge.computeIntersection2(S, point));
                    }
                    output.push(point);
                }
                else if (edge.isInside2(S)) {
                    output.push(edge.computeIntersection2(S, point));
                }
                S = point;
            }
        }
        ;
        if (output.length < 3) {
            return;
        }
        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
            this.texturedTriangleRasterizer.drawTriangleDDA2(output[0], output[1 + i], output[2 + i]);
        }
    }
    drawLensFlare(screenPos, elapsedTime, texture, dirt) {
        let pos = screenPos;
        if (pos.z < 0 &&
            pos.x > 0 && pos.x < 320 &&
            pos.y > 0 && pos.y < 200 &&
            this.wBuffer[pos.x + (pos.y * 320)] > (1 / pos.z)) {
            if (!this.lensFlareVisible) {
                this.lensFlareVisible = true;
                this.lensFlareStart = elapsedTime;
            }
        }
        else {
            if (this.lensFlareVisible) {
                this.lensFlareVisible = false;
                this.lensFlareEnd = elapsedTime;
            }
        }
        let scale = this.interpolate(this.lensFlareStart, this.lensFlareStart + 100, elapsedTime);
        if (this.lensFlareVisible != true) {
            scale *= (1 - this.interpolate(this.lensFlareEnd, this.lensFlareEnd + 100, elapsedTime));
        }
        let dir = new math_1.Vector3f(320 / 2, 200 / 2, 0).sub(pos);
        if (scale > 0) {
            for (let i = 0; i < texture.length; i++) {
                let temp = pos.add(dir.mul(texture[i].scale));
                this.drawTexture(Math.round(temp.x) - texture[i].tex.width / 2, Math.round(temp.y) - texture[i].tex.height / 2, texture[i].tex, texture[i].alpha * scale);
            }
        }
        this.drawTextureRectAdd(0, 0, 0, 0, 320, 200, dirt, 0.03 + 0.15 * scale);
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
        let wStart = 1 / (start.z);
        let wDelta = (1 / end.z - 1 / start.z) / length;
        for (let i = 0; i <= length; i++) {
            if (wStart < this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320]) {
                this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320] = wStart;
                this.drawPixel(Math.round(xPosition), Math.round(yPosition), color);
            }
            xPosition += dx;
            yPosition += dy;
            wStart += wDelta;
        }
    }
    drawLineDDANoZ(start, end, color) {
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
        for (let i = 0; i <= length; i++) {
            this.drawPixel(Math.round(xPosition), Math.round(yPosition), color);
            xPosition += dx;
            yPosition += dy;
        }
    }
    drawVoxelLandscape3(texture, time) {
        this.clearColorBuffer(255 << 24);
        const MIN_DIST = 10;
        const MAX_DIST = 100;
        let camX = time * 0.006;
        let camY = 0;
        const focus = 28.7;
        const center = 220;
        const eye = 120;
        for (let x = 0; x < 320; x++) {
            let dirX = Math.cos(time * 0.0005 + x * 0.005) * 0.4;
            let dirY = Math.sin(time * 0.0005 + x * 0.005) * 0.4;
            dirX = Math.cos(time * 0.0001 + Math.PI * 2 / 320 * x) * 0.4;
            dirY = Math.sin(time * 0.0001 + Math.PI * 2 / 320 * x) * 0.4;
            let highestPoint = 0;
            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;
            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {
                let height = //this.getBilinearFilteredPixel(texture, rayX, rayY)*0.6;
                 (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * 0.6;
                let projHeight = Math.round((height - eye) * focus / dist + center) - 50;
                let color = (Math.round(height) * 200 / 255 + 55) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)));
                let packedRGB = 255 << 24 | (color * 0.7) << 16 | (color) << 8 | (color * 0.8);
                if (projHeight > highestPoint) {
                    let index = x + (199 - highestPoint) * 320;
                    let max = Math.min(projHeight, 200);
                    for (let i = highestPoint; i < max; i++) {
                        this.framebuffer[index] = packedRGB;
                        index -= 320;
                    }
                    if (max == 200) {
                        break;
                    }
                    highestPoint = projHeight;
                }
                rayX += dirX;
                rayY += dirY;
            }
        }
    }
    drawVoxelLandscape4(texture, time) {
        this.clearColorBuffer(255 << 24);
        const MIN_DIST = 14;
        const MAX_DIST = 80;
        let camX = time * 0.02;
        let camY = 0;
        const focus = 29.7;
        const center = 90;
        const eye = 10;
        for (let x = 0; x < 320; x++) {
            let dirX;
            let dirY;
            dirX = Math.cos(time * 0.0001 + Math.PI * 2 / 320 * x) * 1.99;
            dirY = Math.sin(time * 0.0001 + Math.PI * 2 / 320 * x) * 1.99;
            let highestPoint = 0;
            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;
            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {
                let height = //this.getBilinearFilteredPixel(texture, rayX, rayY)*0.6;
                 (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * Math.sin(Math.abs((dist - MIN_DIST) * 0.5 / (MAX_DIST - MIN_DIST))) * 3.5;
                let projHeight = Math.round((height - eye) * focus / dist + center) - 50;
                let color = (Math.round(height) * 200 / 255 + 55) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)));
                let packedRGB = 255 << 24 | (color * 0.7) << 16 | (color) << 8 | (color * 0.8);
                if (projHeight > highestPoint) {
                    let index = x + (199 - highestPoint) * 320;
                    let max = Math.min(projHeight, 200);
                    for (let i = highestPoint; i < max; i++) {
                        this.framebuffer[index] = packedRGB;
                        index -= 320;
                    }
                    if (max == 200) {
                        break;
                    }
                    highestPoint = projHeight;
                }
                rayX += dirX;
                rayY += dirY;
            }
        }
    }
}
Framebuffer.PIXEL_SIZE_IN_BYTES = 4;
/*
    public wireFrameSphereClipping(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector4f> = [];

        const STEPS = 16;
        const STEPS2 = 16;

        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                points.push(this.sphereFunction2(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2));
            }
        }

        let index: Array<number> = [];

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
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0 + 20 * Math.sin(elapsedTime * 0.04), 5 * Math.sin(elapsedTime * 0.06), -36).multiplyMatrix(modelViewMartrix);

        let points2: Array<Vector3f> = new Array<Vector3f>();

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z;

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) + (y / (-z * 0.0078));

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        // draw clip region
        let colred = 255 << 24 | 230 << 16 | 200 << 16 | 200;
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), new Vector3f(Framebuffer.maxWindow.x + 2, Framebuffer.maxWindow.y + 1, 0), colred);

        this.drawBox();

        for (let i = 0; i < index.length; i += 3) {
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];

            let colLine = 255 << 24 | 255 << 16 | 255 << 8 | 255;
            if (this.isTriangleCCW(v1, v2, v3)) {
                this.linerClipper.cohenSutherlandLineClipper(v1, v2, colLine);
                this.linerClipper.cohenSutherlandLineClipper(v1, v3, colLine);
                this.linerClipper.cohenSutherlandLineClipper(v3, v2, colLine);
            }
        }
    }
*/
Framebuffer.minWindow = new math_1.Vector3f(0, 0, 0);
Framebuffer.maxWindow = new math_1.Vector3f(319, 199, 0);
Framebuffer.clipRegion = new Array(new RightClipEdge_1.RightClipEdge(), new LeftClipEdge_1.LeftClipEdge(), new BottomClipEdge_1.BottomClipEdge(), new TopClipEdge_1.TopClipEdge());
exports.Framebuffer = Framebuffer;


/***/ }),

/***/ "./src/RandomNumberGenerator.ts":
/*!**************************************!*\
  !*** ./src/RandomNumberGenerator.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class RandomNumberGenerator {
    constructor() {
        this.seed = 6;
    }
    getFloat() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    setSeed(seed) {
        this.seed = seed;
    }
}
exports.default = RandomNumberGenerator;


/***/ }),

/***/ "./src/Vertex.ts":
/*!***********************!*\
  !*** ./src/Vertex.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TextureCoordinate {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
}
exports.TextureCoordinate = TextureCoordinate;
class Vertex {
}
exports.Vertex = Vertex;


/***/ }),

/***/ "./src/assets/abstract.json":
/*!**********************************!*\
  !*** ./src/assets/abstract.json ***!
  \**********************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Cube","normals":[{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1}],"vertices":[{"x":1,"y":-1,"z":-1},{"x":1,"y":-1,"z":1},{"x":-1,"y":-1,"z":1},{"x":-1,"y":-1,"z":-1},{"x":1,"y":1,"z":-0.999999},{"x":0.999999,"y":1,"z":1.000001},{"x":-1,"y":1,"z":1},{"x":-1,"y":1,"z":-1},{"x":1,"y":-0.362223,"z":-0.362223},{"x":1,"y":-0.362223,"z":0.362224},{"x":1,"y":0.362223,"z":-0.362223},{"x":1,"y":0.362223,"z":0.362224},{"x":2.274368,"y":-0.362223,"z":-0.362223},{"x":2.274368,"y":-0.362223,"z":0.362224},{"x":2.274368,"y":0.362223,"z":-0.362223},{"x":2.274367,"y":0.362223,"z":0.362224},{"x":1.633902,"y":-0.362223,"z":-0.362223},{"x":1.633902,"y":-0.362223,"z":0.362224},{"x":1.633902,"y":0.362223,"z":0.362224},{"x":1.633902,"y":0.362223,"z":-0.362223},{"x":2.274368,"y":2.615227,"z":-0.362223},{"x":2.274367,"y":2.615227,"z":0.362224},{"x":1.633902,"y":2.615227,"z":0.362224},{"x":1.633902,"y":2.615227,"z":-0.362223},{"x":2.274368,"y":3.044697,"z":-0.362223},{"x":2.274367,"y":3.044697,"z":0.362224},{"x":1.633902,"y":3.044697,"z":0.362224},{"x":1.633902,"y":3.044697,"z":-0.362223},{"x":-0.980751,"y":2.615227,"z":0.362222},{"x":-0.98075,"y":2.615227,"z":-0.362224},{"x":-0.980751,"y":3.044697,"z":0.362222},{"x":-0.98075,"y":3.044697,"z":-0.362224}],"faces":[{"vertices":[1,3,0],"normals":[0,0,0],"uv":[0,1,2]},{"vertices":[7,5,4],"normals":[1,1,1],"uv":[3,4,5]},{"vertices":[4,11,10],"normals":[2,2,2],"uv":[6,7,8]},{"vertices":[5,2,1],"normals":[3,3,3],"uv":[9,10,11]},{"vertices":[2,7,3],"normals":[4,4,4],"uv":[12,13,14]},{"vertices":[0,7,4],"normals":[5,5,5],"uv":[15,16,17]},{"vertices":[17,12,13],"normals":[0,0,0],"uv":[18,19,20]},{"vertices":[1,11,5],"normals":[2,2,2],"uv":[21,7,22]},{"vertices":[4,8,0],"normals":[2,2,2],"uv":[6,23,24]},{"vertices":[1,8,9],"normals":[2,2,2],"uv":[21,23,25]},{"vertices":[14,13,12],"normals":[2,2,2],"uv":[26,27,28]},{"vertices":[14,21,15],"normals":[2,2,2],"uv":[26,29,30]},{"vertices":[19,12,16],"normals":[5,5,5],"uv":[31,32,33]},{"vertices":[17,15,18],"normals":[3,3,3],"uv":[34,35,36]},{"vertices":[9,18,11],"normals":[3,3,3],"uv":[37,36,38]},{"vertices":[10,16,8],"normals":[5,5,5],"uv":[39,33,40]},{"vertices":[10,18,19],"normals":[1,1,1],"uv":[41,42,43]},{"vertices":[9,16,17],"normals":[0,0,0],"uv":[44,45,18]},{"vertices":[22,29,23],"normals":[0,0,0],"uv":[46,47,48]},{"vertices":[18,23,19],"normals":[4,4,4],"uv":[49,50,51]},{"vertices":[15,22,18],"normals":[3,3,3],"uv":[35,52,36]},{"vertices":[19,20,14],"normals":[5,5,5],"uv":[31,53,54]},{"vertices":[26,24,27],"normals":[1,1,1],"uv":[55,56,57]},{"vertices":[21,26,22],"normals":[3,3,3],"uv":[58,59,52]},{"vertices":[23,24,20],"normals":[5,5,5],"uv":[60,61,53]},{"vertices":[20,25,21],"normals":[2,2,2],"uv":[62,63,29]},{"vertices":[28,31,29],"normals":[4,4,4],"uv":[64,65,66]},{"vertices":[26,28,22],"normals":[3,3,3],"uv":[59,67,52]},{"vertices":[23,31,27],"normals":[5,5,5],"uv":[60,68,69]},{"vertices":[27,30,26],"normals":[1,1,1],"uv":[57,70,55]},{"vertices":[1,2,3],"normals":[0,0,0],"uv":[0,71,1]},{"vertices":[7,6,5],"normals":[1,1,1],"uv":[3,72,4]},{"vertices":[4,5,11],"normals":[2,2,2],"uv":[6,22,7]},{"vertices":[5,6,2],"normals":[3,3,3],"uv":[9,73,10]},{"vertices":[2,6,7],"normals":[4,4,4],"uv":[12,74,13]},{"vertices":[0,3,7],"normals":[5,5,5],"uv":[15,75,16]},{"vertices":[17,16,12],"normals":[0,0,0],"uv":[18,45,19]},{"vertices":[1,9,11],"normals":[2,2,2],"uv":[21,25,7]},{"vertices":[4,10,8],"normals":[2,2,2],"uv":[6,8,23]},{"vertices":[1,0,8],"normals":[2,2,2],"uv":[21,24,23]},{"vertices":[14,15,13],"normals":[2,2,2],"uv":[26,30,27]},{"vertices":[14,20,21],"normals":[2,2,2],"uv":[26,62,29]},{"vertices":[19,14,12],"normals":[5,5,5],"uv":[31,54,32]},{"vertices":[17,13,15],"normals":[3,3,3],"uv":[34,76,35]},{"vertices":[9,17,18],"normals":[3,3,3],"uv":[37,34,36]},{"vertices":[10,19,16],"normals":[5,5,5],"uv":[39,31,33]},{"vertices":[10,11,18],"normals":[1,1,1],"uv":[41,77,42]},{"vertices":[9,8,16],"normals":[0,0,0],"uv":[44,78,45]},{"vertices":[22,28,29],"normals":[0,0,0],"uv":[46,79,47]},{"vertices":[18,22,23],"normals":[4,4,4],"uv":[49,80,50]},{"vertices":[15,21,22],"normals":[3,3,3],"uv":[35,58,52]},{"vertices":[19,23,20],"normals":[5,5,5],"uv":[31,60,53]},{"vertices":[26,25,24],"normals":[1,1,1],"uv":[55,81,56]},{"vertices":[21,25,26],"normals":[3,3,3],"uv":[58,82,59]},{"vertices":[23,27,24],"normals":[5,5,5],"uv":[60,69,61]},{"vertices":[20,24,25],"normals":[2,2,2],"uv":[62,83,63]},{"vertices":[28,30,31],"normals":[4,4,4],"uv":[64,84,65]},{"vertices":[26,30,28],"normals":[3,3,3],"uv":[59,85,67]},{"vertices":[23,29,31],"normals":[5,5,5],"uv":[60,86,68]},{"vertices":[27,31,30],"normals":[1,1,1],"uv":[57,87,70]}],"uv":[{"u":0.244101,"v":0.722552},{"u":0.00711,"v":0.975771},{"u":0.00711,"v":0.722552},{"u":0.509531,"v":0.722552},{"u":0.746522,"v":0.975771},{"u":0.509531,"v":0.975771},{"u":0.25832,"v":0.975771},{"u":0.333894,"v":0.803301},{"u":0.333894,"v":0.895023},{"u":0.00711,"v":0.454139},{"u":0.244101,"v":0.707359},{"u":0.00711,"v":0.707359},{"u":0.495312,"v":0.707359},{"u":0.25832,"v":0.454139},{"u":0.495312,"v":0.454139},{"u":0.746522,"v":0.454139},{"u":0.509531,"v":0.707359},{"u":0.509531,"v":0.454139},{"u":0.946649,"v":0.881462},{"u":0.860805,"v":0.800373},{"u":0.946649,"v":0.800373},{"u":0.495312,"v":0.722552},{"u":0.25832,"v":0.722552},{"u":0.419738,"v":0.895023},{"u":0.495312,"v":0.975771},{"u":0.419738,"v":0.803301},{"u":0.846586,"v":0.545861},{"u":0.760742,"v":0.454139},{"u":0.846586,"v":0.454139},{"u":0.760742,"v":0.831113},{"u":0.760742,"v":0.545861},{"u":0.716871,"v":0.347224},{"u":0.792764,"v":0.438946},{"u":0.716871,"v":0.438946},{"u":0.083002,"v":0.438946},{"u":0.00711,"v":0.347224},{"u":0.083002,"v":0.347224},{"u":0.158117,"v":0.438946},{"u":0.158117,"v":0.347224},{"u":0.641757,"v":0.347224},{"u":0.641757,"v":0.438946},{"u":0.760742,"v":0.992403},{"u":0.835856,"v":0.900681},{"u":0.835856,"v":0.992403},{"u":0.946649,"v":0.96172},{"u":0.860805,"v":0.881462},{"u":0.946649,"v":0.454139},{"u":0.860805,"v":0.78518},{"u":0.860805,"v":0.454139},{"u":0.907046,"v":0.292849},{"u":0.99289,"v":0.007597},{"u":0.99289,"v":0.292849},{"u":0.083002,"v":0.061972},{"u":0.792764,"v":0.061972},{"u":0.792764,"v":0.347224},{"u":0.892827,"v":0.338637},{"u":0.806983,"v":0.419726},{"u":0.806983,"v":0.338637},{"u":0.00711,"v":0.061972},{"u":0.083002,"v":0.007597},{"u":0.716871,"v":0.061972},{"u":0.792764,"v":0.007597},{"u":0.846586,"v":0.831113},{"u":0.760742,"v":0.885488},{"u":0.957937,"v":0.399764},{"u":0.907046,"v":0.308042},{"u":0.957937,"v":0.308042},{"u":0.392827,"v":0.061972},{"u":0.407046,"v":0.007597},{"u":0.716871,"v":0.007597},{"u":0.892827,"v":0.007597},{"u":0.244101,"v":0.975771},{"u":0.746522,"v":0.722552},{"u":0.244101,"v":0.454139},{"u":0.25832,"v":0.707359},{"u":0.746522,"v":0.707359},{"u":0.00711,"v":0.438946},{"u":0.760742,"v":0.900681},{"u":0.860805,"v":0.96172},{"u":0.946649,"v":0.785179},{"u":0.907046,"v":0.007597},{"u":0.892827,"v":0.419726},{"u":0.00711,"v":0.007597},{"u":0.846586,"v":0.885488},{"u":0.907046,"v":0.399764},{"u":0.392827,"v":0.007597},{"u":0.407046,"v":0.061972},{"u":0.806983,"v":0.007597}]}];

/***/ }),

/***/ "./src/assets/blurredBackground.png":
/*!******************************************!*\
  !*** ./src/assets/blurredBackground.png ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bbaba2795420534ca9f0184e07fb74f8.png";

/***/ }),

/***/ "./src/assets/bunny.json":
/*!*******************************!*\
  !*** ./src/assets/bunny.json ***!
  \*******************************/
/*! exports provided: vertices, normals, faces, default */
/***/ (function(module) {

module.exports = {"vertices":[{"x":-0.068299,"y":-0.012056,"z":-0.004591},{"x":-0.068525,"y":-0.005406,"z":-0.012251},{"x":-0.064052,"y":-0.012598,"z":-0.014347},{"x":-0.055768,"y":0.031529,"z":0.044722},{"x":-0.06163,"y":0.027832,"z":0.042526},{"x":-0.055096,"y":0.026321,"z":0.039957},{"x":-0.034954,"y":0.031979,"z":-0.022985},{"x":-0.038456,"y":0.023834,"z":-0.027304},{"x":-0.047605,"y":0.027236,"z":-0.022685},{"x":0.043439,"y":-0.029232,"z":-0.027578},{"x":0.04182,"y":-0.036145,"z":-0.028203},{"x":0.036717,"y":-0.033639,"z":-0.033982},{"x":-0.029491,"y":0.082052,"z":-0.006989},{"x":-0.040923,"y":0.071875,"z":-0.00086},{"x":-0.036353,"y":0.069932,"z":0.001201},{"x":0.047787,"y":0.028857,"z":0.011455},{"x":0.052105,"y":0.020373,"z":0.015567},{"x":0.052554,"y":0.022809,"z":0.004829},{"x":0.012459,"y":-0.03476,"z":0.045393},{"x":0.00148,"y":-0.036985,"z":0.04092},{"x":0.013537,"y":-0.038718,"z":0.041531},{"x":-0.068511,"y":-0.008897,"z":0.01445},{"x":-0.071733,"y":-0.007283,"z":0.009196},{"x":-0.067756,"y":-0.012199,"z":0.006393},{"x":-0.048113,"y":0.042054,"z":0.032571},{"x":-0.051938,"y":0.044347,"z":0.035792},{"x":-0.05728,"y":0.045946,"z":0.041329},{"x":0.032814,"y":0.016992,"z":0.035653},{"x":0.041297,"y":0.007613,"z":0.035627},{"x":0.045251,"y":0.01467,"z":0.028694},{"x":-0.006282,"y":0.095143,"z":-0.023457},{"x":-0.014288,"y":0.09306,"z":-0.01598},{"x":-0.021231,"y":0.084522,"z":-0.008864},{"x":-0.040539,"y":0.073995,"z":-0.009652},{"x":-0.031844,"y":0.082575,"z":-0.011494},{"x":-0.022646,"y":0.087572,"z":-0.020009},{"x":-0.057361,"y":0.059078,"z":-0.031633},{"x":-0.056608,"y":0.063283,"z":-0.051612},{"x":-0.052282,"y":0.058994,"z":-0.031321},{"x":-0.061184,"y":0.062333,"z":-0.028856},{"x":-0.060236,"y":0.065194,"z":-0.038989},{"x":-0.0596,"y":0.06216,"z":-0.042884},{"x":-0.074392,"y":0.061931,"z":0.000609},{"x":-0.068437,"y":0.064993,"z":-0.004231},{"x":-0.066706,"y":0.06185,"z":-0.008431},{"x":-0.045195,"y":0.069829,"z":-0.003487},{"x":-0.040002,"y":0.067335,"z":0.005669},{"x":-0.078877,"y":0.030961,"z":0.025766},{"x":-0.075097,"y":0.025319,"z":0.025756},{"x":-0.07537,"y":0.025438,"z":0.03066},{"x":-0.063121,"y":0.069105,"z":0.008183},{"x":-0.059652,"y":0.068601,"z":-0.006008},{"x":-0.07173,"y":0.06666,"z":0.010611},{"x":0.054136,"y":-0.048148,"z":-0.004613},{"x":0.047022,"y":-0.051749,"z":0.000658},{"x":0.045949,"y":-0.048888,"z":-0.009585},{"x":-0.022703,"y":0.027846,"z":-0.024948},{"x":-0.032912,"y":0.020588,"z":-0.028258},{"x":0.067325,"y":-0.01318,"z":0.003167},{"x":0.071962,"y":-0.015382,"z":0.000515},{"x":0.064412,"y":-0.015793,"z":-0.004548},{"x":0.057201,"y":-0.038627,"z":0.023187},{"x":0.045106,"y":-0.046609,"z":0.018727},{"x":0.05683,"y":-0.042893,"z":0.018598},{"x":-0.01004,"y":-0.015643,"z":-0.046429},{"x":-0.014777,"y":-0.020069,"z":-0.039251},{"x":-0.016582,"y":-0.011982,"z":-0.04167},{"x":0.024651,"y":-0.052599,"z":-0.028854},{"x":-0.027993,"y":-0.053236,"z":-0.035286},{"x":-0.014737,"y":-0.05353,"z":-0.036597},{"x":-0.05378,"y":0.080307,"z":-0.06374},{"x":-0.051636,"y":0.092173,"z":-0.069224},{"x":-0.052477,"y":0.073855,"z":-0.066444},{"x":-0.062126,"y":0.077708,"z":-0.028973},{"x":-0.058365,"y":0.076564,"z":-0.022692},{"x":-0.059785,"y":0.087383,"z":-0.048566},{"x":-0.036536,"y":0.066177,"z":-0.01386},{"x":-0.024823,"y":0.065537,"z":-0.016374},{"x":-0.036782,"y":0.059573,"z":-0.010844},{"x":-0.04212,"y":0.066569,"z":0.019057},{"x":-0.046059,"y":0.068883,"z":0.005612},{"x":-0.054775,"y":0.073187,"z":-0.017546},{"x":-0.055017,"y":0.068598,"z":-0.006602},{"x":-0.051995,"y":0.068526,"z":-0.013592},{"x":-0.049618,"y":0.067769,"z":-0.004404},{"x":-0.049036,"y":0.064876,"z":-0.01418},{"x":-0.048196,"y":0.061693,"z":-0.020433},{"x":-0.047151,"y":0.070796,"z":-0.035258},{"x":-0.015347,"y":0.038093,"z":-0.006408},{"x":-0.024578,"y":0.038497,"z":-0.015053},{"x":-0.023389,"y":0.040779,"z":-0.007993},{"x":-0.01151,"y":0.039013,"z":0.004765},{"x":0.001378,"y":0.042061,"z":-0.004365},{"x":-0.047733,"y":0.082257,"z":-0.070291},{"x":-0.066324,"y":0.041561,"z":-0.014494},{"x":-0.061433,"y":0.033191,"z":-0.016451},{"x":-0.07136,"y":0.033871,"z":-0.011472},{"x":-0.064857,"y":0.037778,"z":0.043865},{"x":-0.073466,"y":0.056941,"z":0.027695},{"x":-0.075194,"y":0.05454,"z":0.023181},{"x":-0.075631,"y":0.047502,"z":0.030002},{"x":0.003579,"y":0.089405,"z":-0.038325},{"x":-0.006598,"y":0.087876,"z":-0.030875},{"x":0.001582,"y":0.09395,"z":-0.037987},{"x":-0.02271,"y":0.06404,"z":-0.012823},{"x":-0.004653,"y":0.07368,"z":-0.022516},{"x":-0.00352,"y":0.072368,"z":-0.019306},{"x":0.027087,"y":0.015217,"z":-0.030848},{"x":0.034903,"y":0.014152,"z":-0.030349},{"x":0.028913,"y":0.009703,"z":-0.032177},{"x":0.030622,"y":0.040601,"z":-0.007736},{"x":0.038154,"y":0.037876,"z":0.000469},{"x":0.045075,"y":0.031722,"z":-0.003503},{"x":-0.074506,"y":0.043058,"z":-0.006078},{"x":-0.070845,"y":0.054615,"z":-0.00489},{"x":-0.067763,"y":0.051957,"z":-0.010496},{"x":0.008655,"y":0.043147,"z":0.013942},{"x":0.021987,"y":0.043917,"z":0.011068},{"x":0.012138,"y":0.044548,"z":0.005021},{"x":0.014472,"y":0.032096,"z":0.029637},{"x":0.027975,"y":0.029079,"z":0.028192},{"x":0.022583,"y":0.036428,"z":0.025476},{"x":-0.074608,"y":0.064918,"z":0.004506},{"x":0.039324,"y":-0.048792,"z":0.020825},{"x":0.05183,"y":-0.047555,"z":0.014145},{"x":-0.00126,"y":-0.052265,"z":0.037701},{"x":-0.017555,"y":-0.052435,"z":0.031134},{"x":0.004182,"y":-0.050151,"z":0.020044},{"x":0.05184,"y":0.011576,"z":0.023282},{"x":0.044296,"y":0.02715,"z":0.022099},{"x":-0.034263,"y":0.010953,"z":0.035024},{"x":-0.039917,"y":0.013106,"z":0.033622},{"x":-0.039888,"y":0.00344,"z":0.036063},{"x":-0.021637,"y":0.027804,"z":0.024531},{"x":-0.025101,"y":0.034291,"z":0.019591},{"x":-0.037402,"y":0.026134,"z":0.026633},{"x":-0.046622,"y":0.052534,"z":0.025696},{"x":-0.050205,"y":0.056875,"z":0.030719},{"x":-0.04878,"y":0.04876,"z":0.028782},{"x":-0.074081,"y":0.011308,"z":0.014773},{"x":-0.075852,"y":0.005094,"z":0.010905},{"x":-0.070807,"y":0.001318,"z":0.019712},{"x":-0.051753,"y":-0.047753,"z":-0.015554},{"x":-0.034095,"y":-0.053253,"z":-0.023193},{"x":-0.051264,"y":-0.053376,"z":-0.01564},{"x":0.000146,"y":0.094667,"z":-0.031627},{"x":-0.005681,"y":0.09937,"z":-0.025245},{"x":0.00341,"y":-0.025736,"z":-0.044729},{"x":0.015308,"y":-0.019191,"z":-0.042649},{"x":0.016433,"y":-0.023698,"z":-0.042772},{"x":0.000817,"y":0.004174,"z":-0.045663},{"x":0.011462,"y":0.009285,"z":-0.04028},{"x":0.017851,"y":0.005801,"z":-0.041709},{"x":-0.005626,"y":0.099043,"z":-0.029463},{"x":-0.017387,"y":0.092348,"z":-0.018555},{"x":-0.000918,"y":0.099113,"z":-0.033263},{"x":0.03818,"y":0.037656,"z":0.00957},{"x":0.072204,"y":-0.026729,"z":-0.006309},{"x":0.072876,"y":-0.032901,"z":0.000908},{"x":0.069735,"y":-0.036142,"z":-0.005495},{"x":0.072681,"y":-0.020739,"z":0.013898},{"x":0.074434,"y":-0.017526,"z":0.004082},{"x":0.071038,"y":-0.01459,"z":0.009628},{"x":-0.066255,"y":-0.007019,"z":0.023506},{"x":-0.07231,"y":-0.002146,"z":0.013802},{"x":0.016291,"y":0.005526,"z":0.046559},{"x":0.003707,"y":0.002891,"z":0.048054},{"x":0.004498,"y":-0.007902,"z":0.048949},{"x":-0.056155,"y":0.093525,"z":-0.06617},{"x":-0.054374,"y":0.094447,"z":-0.064419},{"x":-0.077139,"y":0.045089,"z":-0.00024},{"x":-0.001823,"y":0.042014,"z":0.005236},{"x":-0.052508,"y":-0.022885,"z":-0.012587},{"x":-0.050323,"y":-0.01222,"z":-0.025577},{"x":-0.040323,"y":-0.045677,"z":-0.018586},{"x":-0.04419,"y":-0.040201,"z":-0.011991},{"x":-0.052745,"y":0.064227,"z":-0.050539},{"x":-0.044302,"y":0.059043,"z":-0.010861},{"x":-0.044155,"y":0.067779,"z":-0.008717},{"x":-0.042545,"y":-0.041922,"z":0.0357},{"x":-0.048006,"y":-0.049432,"z":0.035381},{"x":-0.040805,"y":-0.047314,"z":0.038484},{"x":-0.047899,"y":-0.052634,"z":0.01072},{"x":-0.050796,"y":-0.05201,"z":0.030921},{"x":-0.052992,"y":-0.051417,"z":0.023026},{"x":-0.024778,"y":-0.052099,"z":0.033533},{"x":-0.041591,"y":-0.05067,"z":0.037949},{"x":0.014099,"y":0.043819,"z":-0.006311},{"x":-0.000778,"y":0.038824,"z":-0.012633},{"x":-0.005859,"y":0.0775,"z":-0.025955},{"x":0.004094,"y":0.093093,"z":-0.037523},{"x":0.00488,"y":0.079567,"z":-0.028961},{"x":0.004365,"y":0.083002,"z":-0.034314},{"x":0.00701,"y":0.041169,"z":0.019101},{"x":0.018653,"y":0.041047,"z":0.019935},{"x":-0.003708,"y":0.033752,"z":0.024537},{"x":-0.009722,"y":0.017914,"z":0.033731},{"x":0.002005,"y":0.032379,"z":0.028144},{"x":-0.028667,"y":0.037392,"z":-0.0185},{"x":-0.007414,"y":0.028341,"z":-0.024645},{"x":-0.002428,"y":0.033953,"z":-0.018575},{"x":-0.003129,"y":0.027008,"z":-0.026996},{"x":-0.067509,"y":0.013129,"z":-0.015272},{"x":-0.069021,"y":0.019404,"z":-0.010122},{"x":-0.060063,"y":0.017284,"z":-0.02022},{"x":-0.031293,"y":0.05886,"z":-0.007464},{"x":-0.037877,"y":0.055811,"z":-0.008746},{"x":0.07257,"y":-0.027406,"z":0.014364},{"x":0.067947,"y":-0.029127,"z":0.019315},{"x":0.071197,"y":-0.034855,"z":0.011939},{"x":0.050144,"y":-0.039117,"z":0.022545},{"x":0.05769,"y":-0.027672,"z":0.022569},{"x":0.067824,"y":-0.021136,"z":0.018813},{"x":0.059905,"y":-0.020468,"z":0.017991},{"x":-0.048101,"y":0.079135,"z":-0.058192},{"x":-0.046857,"y":0.080702,"z":-0.068448},{"x":-0.048569,"y":0.088553,"z":-0.06458},{"x":-0.053032,"y":0.086713,"z":-0.054017},{"x":-0.048965,"y":0.080137,"z":-0.052331},{"x":-0.048248,"y":0.073409,"z":-0.03062},{"x":0.040721,"y":0.032047,"z":-0.01295},{"x":-0.071386,"y":0.041204,"z":-0.011749},{"x":-0.07849,"y":0.030914,"z":0.032641},{"x":-0.07268,"y":0.027732,"z":0.038178},{"x":-0.050528,"y":0.009379,"z":0.034165},{"x":-0.052569,"y":0.015268,"z":0.032144},{"x":-0.05855,"y":0.007165,"z":0.032278},{"x":-0.061499,"y":0.024231,"z":0.037347},{"x":-0.050924,"y":0.03073,"z":0.040318},{"x":-0.069,"y":0.054038,"z":0.035572},{"x":-0.063703,"y":0.058489,"z":0.035123},{"x":-0.06966,"y":0.06195,"z":0.026043},{"x":-0.04954,"y":0.092254,"z":-0.067516},{"x":-0.030108,"y":-0.052351,"z":0.00999},{"x":-0.025238,"y":-0.052933,"z":0.019297},{"x":-0.035574,"y":-0.052722,"z":0.020143},{"x":-0.019319,"y":-0.053334,"z":0.006224},{"x":-0.015164,"y":-0.053084,"z":0.005069},{"x":-0.003003,"y":-0.031635,"z":-0.042475},{"x":-0.007414,"y":-0.023894,"z":-0.044133},{"x":-0.002131,"y":-0.023807,"z":-0.045925},{"x":-0.033204,"y":-0.033102,"z":-0.019066},{"x":-0.026865,"y":-0.037249,"z":-0.019965},{"x":-0.039598,"y":-0.039064,"z":-0.015094},{"x":-0.02115,"y":-0.04638,"z":0.039128},{"x":-0.014267,"y":-0.04946,"z":0.044859},{"x":-0.015375,"y":0.002317,"z":0.03546},{"x":-0.014478,"y":-0.004247,"z":0.037609},{"x":-0.010154,"y":0.004552,"z":0.04174},{"x":-0.055791,"y":0.06812,"z":-0.059064},{"x":-0.052508,"y":0.067468,"z":-0.060048},{"x":-0.049397,"y":0.073904,"z":-0.066051},{"x":0.061332,"y":-0.045226,"z":0.004301},{"x":0.066864,"y":-0.037378,"z":0.01566},{"x":0.063885,"y":-0.042821,"z":0.010221},{"x":0.06448,"y":-0.041812,"z":-0.004822},{"x":0.069198,"y":-0.039204,"z":0.005496},{"x":-0.062919,"y":0.007058,"z":-0.021788},{"x":-0.014853,"y":-0.007017,"z":-0.044419},{"x":-0.01142,"y":-0.001975,"z":-0.046198},{"x":0.001387,"y":0.076559,"z":-0.021199},{"x":-0.057577,"y":-0.052669,"z":-0.002681},{"x":-0.045665,"y":-0.053246,"z":0.009373},{"x":0.011329,"y":-0.027838,"z":0.045507},{"x":0.010562,"y":-0.023562,"z":0.047753},{"x":0.007382,"y":-0.03057,"z":0.045063},{"x":0.055904,"y":0.004213,"z":-0.016589},{"x":0.055679,"y":0.011812,"z":-0.011626},{"x":0.05905,"y":0.000024,"z":-0.009421},{"x":-0.022116,"y":-0.049133,"z":-0.039031},{"x":-0.029377,"y":-0.051128,"z":-0.034996},{"x":-0.064382,"y":0.001107,"z":0.028256},{"x":-0.067668,"y":0.00866,"z":0.023963},{"x":-0.063636,"y":0.068036,"z":0.017269},{"x":-0.074466,"y":0.064374,"z":0.013966},{"x":-0.06313,"y":0.065894,"z":0.024394},{"x":0.026237,"y":-0.050651,"z":-0.030958},{"x":0.003567,"y":-0.051543,"z":-0.034364},{"x":0.021671,"y":-0.048122,"z":-0.032718},{"x":-0.013421,"y":-0.052765,"z":-0.029997},{"x":-0.072597,"y":0.045082,"z":0.038411},{"x":-0.067646,"y":0.045557,"z":0.042271},{"x":-0.036785,"y":-0.053537,"z":-0.01441},{"x":-0.07173,"y":0.026307,"z":-0.006406},{"x":-0.078312,"y":0.030732,"z":0.000235},{"x":-0.074641,"y":0.035692,"z":-0.007851},{"x":-0.034736,"y":0.063346,"z":0.00219},{"x":-0.032039,"y":0.07013,"z":-0.000774},{"x":0.075146,"y":-0.02413,"z":0.001133},{"x":0.074768,"y":-0.024648,"z":0.007866},{"x":0.069607,"y":-0.018572,"z":-0.00663},{"x":0.058706,"y":0.006357,"z":0.010687},{"x":0.057018,"y":0.013933,"z":0.003505},{"x":0.048874,"y":-0.007075,"z":0.031341},{"x":0.053388,"y":-0.002905,"z":0.025281},{"x":0.048014,"y":0.003356,"z":0.032331},{"x":0.059965,"y":-0.031736,"z":0.023275},{"x":0.021481,"y":0.04487,"z":0.001111},{"x":0.030003,"y":0.042194,"z":0.000919},{"x":0.023948,"y":0.036325,"z":-0.01955},{"x":0.01701,"y":0.038651,"z":-0.016759},{"x":0.018941,"y":0.043062,"z":-0.008787},{"x":0.010096,"y":0.037087,"z":0.025514},{"x":-0.0125,"y":0.024282,"z":0.028748},{"x":-0.01656,"y":0.032685,"z":0.01993},{"x":0.026012,"y":-0.004752,"z":0.04511},{"x":0.031992,"y":-0.009457,"z":0.044076},{"x":0.031121,"y":-0.001221,"z":0.042138},{"x":0.026092,"y":-0.012755,"z":0.045684},{"x":-0.018759,"y":0.078731,"z":-0.024581},{"x":-0.024752,"y":0.081078,"z":-0.021427},{"x":-0.021138,"y":0.072494,"z":-0.021755},{"x":-0.013652,"y":0.036131,"z":0.012669},{"x":-0.015459,"y":0.038803,"z":0.005676},{"x":-0.002884,"y":0.04009,"z":0.013755},{"x":0.054639,"y":-0.043489,"z":-0.011639},{"x":0.065321,"y":-0.035514,"z":-0.011514},{"x":0.055757,"y":-0.008206,"z":-0.015787},{"x":0.053433,"y":-0.003192,"z":-0.022567},{"x":0.072183,"y":-0.020473,"z":-0.005033},{"x":0.064611,"y":-0.027845,"z":-0.013513},{"x":0.030808,"y":-0.04446,"z":0.035436},{"x":0.037031,"y":-0.046485,"z":0.031115},{"x":0.041112,"y":-0.038125,"z":0.028869},{"x":0.033664,"y":-0.051896,"z":0.018402},{"x":0.043456,"y":-0.051665,"z":0.008823},{"x":0.022227,"y":-0.051553,"z":-0.00343},{"x":0.031135,"y":-0.052772,"z":-0.008189},{"x":0.030425,"y":-0.051008,"z":-0.004715},{"x":0.018575,"y":0.032351,"z":-0.024214},{"x":0.003762,"y":0.026657,"z":-0.026652},{"x":0.008952,"y":0.038831,"z":-0.017139},{"x":-0.063802,"y":0.044683,"z":0.043887},{"x":-0.056482,"y":0.060708,"z":0.032603},{"x":-0.076422,"y":0.037813,"z":0.035625},{"x":-0.074696,"y":0.032939,"z":0.038389},{"x":-0.079003,"y":0.036984,"z":0.029905},{"x":-0.07863,"y":0.036061,"z":0.022538},{"x":-0.053453,"y":0.068587,"z":0.018769},{"x":0.007933,"y":0.009085,"z":0.045461},{"x":-0.00878,"y":-0.046641,"z":0.04525},{"x":-0.008248,"y":-0.042405,"z":0.044225},{"x":-0.00566,"y":-0.051268,"z":0.043731},{"x":0.006779,"y":-0.04563,"z":0.039957},{"x":-0.008604,"y":-0.012502,"z":0.043066},{"x":-0.004254,"y":-0.006024,"z":0.048555},{"x":-0.010047,"y":-0.00669,"z":0.045428},{"x":-0.033929,"y":-0.043454,"z":0.034932},{"x":-0.025329,"y":-0.039617,"z":0.031134},{"x":-0.04533,"y":-0.039482,"z":0.028282},{"x":-0.047182,"y":-0.042863,"z":0.03305},{"x":-0.050537,"y":-0.043274,"z":0.026281},{"x":-0.051776,"y":-0.04879,"z":0.029492},{"x":-0.062665,"y":0.091713,"z":-0.058728},{"x":-0.064928,"y":0.082446,"z":-0.045547},{"x":-0.062463,"y":0.067576,"z":-0.011369},{"x":-0.062223,"y":0.065357,"z":-0.01741},{"x":-0.063142,"y":0.062015,"z":-0.015037},{"x":-0.055283,"y":0.054949,"z":-0.018942},{"x":-0.06154,"y":0.057406,"z":-0.015186},{"x":0.032394,"y":-0.05127,"z":0.03098},{"x":0.025271,"y":-0.052354,"z":0.029657},{"x":0.018813,"y":-0.043683,"z":0.03672},{"x":0.026467,"y":-0.050546,"z":0.035552},{"x":-0.051769,"y":0.079616,"z":-0.034408},{"x":-0.056145,"y":0.083479,"z":-0.039367},{"x":-0.066077,"y":0.0307,"z":0.040346},{"x":-0.069798,"y":0.034569,"z":0.040415},{"x":-0.076401,"y":0.025966,"z":0.001043},{"x":0.031933,"y":0.005045,"z":0.039293},{"x":0.028875,"y":0.006011,"z":0.042116},{"x":-0.009672,"y":-0.001041,"z":0.045701},{"x":-0.013987,"y":0.035534,"z":-0.01478},{"x":0.017219,"y":-0.052991,"z":-0.026635},{"x":-0.002704,"y":-0.003098,"z":-0.048355},{"x":0.009149,"y":-0.002734,"z":-0.046389},{"x":-0.075161,"y":0.001719,"z":0.002096},{"x":-0.076709,"y":0.025695,"z":0.007455},{"x":-0.076363,"y":0.049199,"z":0.005513},{"x":0.025993,"y":-0.052786,"z":-0.020018},{"x":0.019083,"y":-0.052944,"z":-0.006753},{"x":0.005519,"y":-0.01385,"z":-0.046404},{"x":-0.005781,"y":-0.015699,"z":-0.04784},{"x":-0.054552,"y":0.0146,"z":-0.023899},{"x":-0.05553,"y":0.007102,"z":-0.025263},{"x":-0.058265,"y":0.038747,"z":-0.017795},{"x":-0.042134,"y":0.03782,"z":-0.016308},{"x":-0.047358,"y":0.033042,"z":-0.018239},{"x":-0.059282,"y":-0.006956,"z":0.029577},{"x":-0.056687,"y":-0.014336,"z":0.026816},{"x":-0.053168,"y":-0.003283,"z":0.034589},{"x":-0.057712,"y":0.038095,"z":0.044364},{"x":-0.0519,"y":0.036435,"z":0.042161},{"x":-0.043556,"y":-0.014221,"z":0.031761},{"x":-0.046809,"y":-0.008824,"z":0.033927},{"x":-0.047942,"y":-0.050105,"z":0.010556},{"x":-0.058106,"y":-0.050843,"z":-0.00064},{"x":-0.054865,"y":-0.052115,"z":-0.014393},{"x":-0.058265,"y":-0.051275,"z":-0.00774},{"x":-0.055207,"y":-0.045703,"z":-0.009443},{"x":-0.063233,"y":0.068612,"z":-0.026927},{"x":-0.064073,"y":0.072022,"z":-0.027967},{"x":-0.004489,"y":0.072643,"z":-0.015079},{"x":0.002268,"y":0.087537,"z":-0.030538},{"x":-0.045019,"y":-0.052227,"z":0.035376},{"x":-0.069501,"y":0.00532,"z":-0.014562},{"x":-0.073383,"y":-0.000231,"z":-0.006326},{"x":-0.07453,"y":0.013816,"z":0.000554},{"x":-0.009608,"y":0.004423,"z":-0.043695},{"x":-0.015618,"y":0.001098,"z":-0.040579},{"x":-0.013317,"y":-0.051835,"z":0.043245},{"x":-0.062653,"y":0.02623,"z":-0.014091},{"x":-0.055013,"y":0.029245,"z":-0.017852},{"x":0.059193,"y":0.007665,"z":-0.002381},{"x":0.0183,"y":-0.003633,"z":-0.043014},{"x":0.024734,"y":0.001465,"z":-0.040465},{"x":0.039289,"y":-0.005422,"z":-0.033535},{"x":-0.04835,"y":0.065208,"z":-0.03674},{"x":0.030447,"y":0.003688,"z":-0.036168},{"x":0.042421,"y":0.00501,"z":-0.029674},{"x":0.025337,"y":-0.051669,"z":0.022774},{"x":0.026339,"y":-0.051868,"z":0.003908},{"x":0.034165,"y":-0.051947,"z":-0.011389},{"x":-0.04717,"y":0.087666,"z":-0.070172},{"x":0.048482,"y":0.025833,"z":-0.01032},{"x":0.053851,"y":0.020002,"z":-0.003947},{"x":-0.020889,"y":-0.052384,"z":-0.03979},{"x":-0.015907,"y":-0.045726,"z":-0.038996},{"x":-0.080456,"y":0.032075,"z":0.009702},{"x":-0.077685,"y":0.030389,"z":0.017916},{"x":-0.080259,"y":0.040919,"z":0.009394},{"x":0.056427,"y":0.007352,"z":0.017238},{"x":-0.077433,"y":0.061121,"z":0.007024},{"x":0.044904,"y":-0.031605,"z":0.029931},{"x":0.043814,"y":-0.040409,"z":0.025503},{"x":0.022987,"y":-0.023088,"z":0.045969},{"x":0.018326,"y":-0.011809,"z":0.047341},{"x":0.012957,"y":-0.019384,"z":0.047652},{"x":-0.05799,"y":0.052621,"z":-0.016348},{"x":0.032216,"y":-0.049705,"z":-0.026318},{"x":-0.038967,"y":0.063276,"z":0.014142},{"x":-0.045677,"y":0.061829,"z":0.027004},{"x":-0.044293,"y":0.05912,"z":0.024783},{"x":-0.047263,"y":0.064972,"z":0.026041},{"x":-0.031963,"y":0.012676,"z":-0.030839},{"x":-0.041092,"y":0.015696,"z":-0.028605},{"x":-0.04221,"y":0.008947,"z":-0.030206},{"x":-0.04722,"y":0.009757,"z":-0.027387},{"x":-0.000721,"y":0.016763,"z":-0.032198},{"x":-0.013255,"y":0.01847,"z":-0.031664},{"x":0.01324,"y":-0.009086,"z":0.049899},{"x":0.008681,"y":-0.014558,"z":0.049675},{"x":-0.052854,"y":0.044459,"z":-0.01779},{"x":-0.048837,"y":0.053905,"z":-0.015794},{"x":-0.029477,"y":0.067258,"z":-0.001834},{"x":-0.025925,"y":0.063694,"z":-0.004972},{"x":0.066299,"y":-0.014915,"z":0.012882},{"x":-0.039342,"y":-0.053671,"z":0.00594},{"x":-0.038269,"y":-0.053568,"z":-0.002509},{"x":0.027659,"y":0.037502,"z":0.022584},{"x":0.032831,"y":0.034128,"z":0.023682},{"x":0.027379,"y":0.041117,"z":0.016764},{"x":-0.007832,"y":0.09384,"z":-0.030118},{"x":-0.040002,"y":0.051325,"z":0.021087},{"x":-0.03594,"y":0.043494,"z":0.022241},{"x":-0.033898,"y":0.046318,"z":0.015127},{"x":-0.042706,"y":0.045398,"z":0.027539},{"x":-0.038084,"y":0.036533,"z":0.026629},{"x":-0.044193,"y":0.038495,"z":0.031816},{"x":-0.046888,"y":0.033411,"z":0.033474},{"x":0.03086,"y":0.035755,"z":-0.016436},{"x":0.041836,"y":0.021471,"z":0.028049},{"x":-0.061718,"y":0.021104,"z":0.028871},{"x":-0.044535,"y":-0.0382,"z":-0.003637},{"x":-0.05162,"y":-0.040972,"z":-0.003386},{"x":-0.051653,"y":-0.043253,"z":0.001319},{"x":-0.077688,"y":0.059085,"z":0.014114},{"x":-0.049984,"y":0.056028,"z":-0.018019},{"x":0.045343,"y":0.023288,"z":-0.018514},{"x":0.033823,"y":0.029861,"z":-0.021267},{"x":0.039358,"y":0.025891,"z":-0.020319},{"x":0.038565,"y":0.017636,"z":-0.02603},{"x":0.049078,"y":0.016011,"z":-0.020031},{"x":0.026387,"y":0.022683,"z":-0.027868},{"x":0.021073,"y":0.026851,"z":-0.027879},{"x":-0.063572,"y":0.089966,"z":-0.059412},{"x":-0.064242,"y":0.082227,"z":-0.050062},{"x":-0.049514,"y":-0.002863,"z":-0.028049},{"x":-0.039933,"y":-0.006251,"z":-0.030103},{"x":-0.06502,"y":-0.002223,"z":-0.018989},{"x":-0.05869,"y":-0.002846,"z":-0.02477},{"x":-0.05076,"y":-0.047804,"z":0.017377},{"x":-0.043117,"y":-0.044668,"z":0.012548},{"x":-0.04098,"y":-0.038907,"z":0.020091},{"x":-0.039691,"y":-0.038158,"z":0.028854},{"x":0.034462,"y":-0.019833,"z":-0.037048},{"x":0.026163,"y":-0.016542,"z":-0.04041},{"x":-0.024379,"y":0.015537,"z":0.031772},{"x":-0.034204,"y":0.019511,"z":0.031069},{"x":-0.026853,"y":0.007335,"z":0.033661},{"x":0.017877,"y":-0.032329,"z":-0.039416},{"x":0.013038,"y":-0.038445,"z":-0.039224},{"x":0.005946,"y":-0.030659,"z":-0.042505},{"x":-0.058558,"y":-0.000128,"z":0.03223},{"x":-0.066144,"y":-0.016185,"z":0.004889},{"x":-0.021375,"y":-0.042791,"z":-0.036645},{"x":-0.030925,"y":-0.046464,"z":-0.028907},{"x":-0.024868,"y":-0.040934,"z":-0.030642},{"x":-0.034517,"y":-0.014761,"z":-0.024926},{"x":-0.044183,"y":-0.016939,"z":-0.024299},{"x":-0.056779,"y":-0.046088,"z":-0.001469},{"x":-0.06324,"y":-0.0181,"z":-0.002001},{"x":-0.049559,"y":-0.041406,"z":-0.008095},{"x":0.048102,"y":0.009089,"z":-0.022648},{"x":-0.034681,"y":0.056182,"z":-0.003393},{"x":-0.015527,"y":0.072599,"z":-0.007602},{"x":0.050059,"y":0.000379,"z":-0.026112},{"x":-0.035657,"y":-0.036493,"z":0.027477},{"x":-0.071324,"y":-0.007624,"z":-0.001489},{"x":-0.016218,"y":-0.045376,"z":0.042897},{"x":0.016574,"y":-0.001179,"z":0.048463},{"x":0.023217,"y":0.000337,"z":0.046928},{"x":0.049337,"y":-0.035715,"z":0.022884},{"x":-0.003174,"y":0.007279,"z":0.044641},{"x":-0.002765,"y":0.000862,"z":0.047918},{"x":0.037613,"y":-0.042263,"z":-0.024487},{"x":0.034293,"y":-0.039626,"z":-0.030694},{"x":0.058839,"y":-0.005529,"z":0.015833},{"x":-0.079765,"y":0.039718,"z":0.016409},{"x":-0.074988,"y":0.049886,"z":0.018248},{"x":-0.07338,"y":0.026396,"z":0.01823},{"x":-0.067604,"y":0.022982,"z":0.021338},{"x":-0.058296,"y":-0.010641,"z":-0.021771},{"x":-0.059104,"y":-0.019875,"z":-0.008367},{"x":-0.018291,"y":-0.005894,"z":-0.038716},{"x":-0.038815,"y":-0.020942,"z":-0.02024},{"x":0.041556,"y":0.033558,"z":0.016398},{"x":0.059563,"y":-0.036637,"z":-0.014701},{"x":0.037316,"y":0.031176,"z":0.023776},{"x":0.035309,"y":0.020268,"z":0.031042},{"x":-0.020141,"y":0.032365,"z":-0.019701},{"x":-0.020502,"y":0.018339,"z":-0.029828},{"x":-0.073022,"y":-0.002372,"z":0.006852},{"x":-0.048538,"y":0.016761,"z":-0.026613},{"x":0.032978,"y":-0.051961,"z":0.012135},{"x":0.037598,"y":-0.00258,"z":0.040368},{"x":0.03142,"y":0.01156,"z":0.038426},{"x":0.047034,"y":-0.017815,"z":-0.026763},{"x":0.041523,"y":-0.021299,"z":-0.030547},{"x":0.042836,"y":-0.011552,"z":-0.031286},{"x":0.024314,"y":-0.033144,"z":-0.038835},{"x":0.034775,"y":-0.027637,"z":-0.035845},{"x":-0.04797,"y":0.004099,"z":0.03641},{"x":0.039923,"y":-0.052475,"z":0.005326},{"x":0.014477,"y":0.011653,"z":0.042767},{"x":0.021771,"y":-0.028244,"z":0.044287},{"x":0.033358,"y":-0.023126,"z":0.039566},{"x":0.016609,"y":-0.031999,"z":0.044907},{"x":-0.037566,"y":0.05362,"z":0.011956},{"x":-0.035771,"y":0.057408,"z":0.001441},{"x":-0.076724,"y":0.048431,"z":0.011717},{"x":-0.0348,"y":0.048403,"z":-0.003712},{"x":-0.048398,"y":0.027596,"z":0.02976},{"x":-0.045845,"y":0.05018,"z":-0.015418},{"x":0.039802,"y":-0.025666,"z":0.035852},{"x":0.050807,"y":-0.023772,"z":0.028115},{"x":0.046041,"y":-0.015389,"z":0.031909},{"x":-0.02317,"y":0.039261,"z":0.011563},{"x":-0.029833,"y":0.042946,"z":-0.000209},{"x":-0.010551,"y":0.034417,"z":0.01918},{"x":-0.074577,"y":0.01578,"z":0.008187},{"x":0.01163,"y":0.026489,"z":-0.028163},{"x":0.014275,"y":0.022141,"z":-0.029676},{"x":-0.002238,"y":0.007716,"z":-0.042591},{"x":-0.010074,"y":0.007917,"z":-0.037149},{"x":0.003712,"y":0.024747,"z":0.03283},{"x":-0.000733,"y":-0.024856,"z":0.044524},{"x":-0.00391,"y":-0.028784,"z":0.04145},{"x":0.001428,"y":-0.016846,"z":0.046046},{"x":-0.061504,"y":-0.016379,"z":0.018939},{"x":-0.052455,"y":-0.027275,"z":0.004489},{"x":-0.056492,"y":-0.023976,"z":0.00959},{"x":-0.056665,"y":-0.024756,"z":-0.000473},{"x":-0.060673,"y":-0.019917,"z":0.009249},{"x":0.031318,"y":0.018811,"z":-0.027149},{"x":-0.018804,"y":0.010079,"z":0.035253},{"x":-0.010954,"y":0.008225,"z":0.035585},{"x":-0.032848,"y":-0.047431,"z":-0.021236},{"x":-0.010997,"y":-0.030956,"z":-0.038213},{"x":0.060651,"y":-0.008871,"z":0.002428},{"x":0.062192,"y":-0.01332,"z":0.003222},{"x":0.059976,"y":-0.014312,"z":-0.005829},{"x":0.05136,"y":-0.024557,"z":-0.020704},{"x":0.056619,"y":-0.032611,"z":-0.015849},{"x":0.045778,"y":-0.037118,"z":-0.01675},{"x":-0.044893,"y":-0.028401,"z":-0.004136},{"x":-0.03957,"y":-0.030587,"z":0.004097},{"x":0.022538,"y":0.008363,"z":-0.037346},{"x":0.048705,"y":-0.037308,"z":-0.015572},{"x":-0.05521,"y":0.089067,"z":-0.065699},{"x":-0.009105,"y":-0.039519,"z":-0.0367},{"x":0.041373,"y":-0.044675,"z":-0.014045},{"x":0.025019,"y":0.017363,"z":0.036344},{"x":0.021196,"y":0.011249,"z":0.040151},{"x":0.041722,"y":-0.009182,"z":0.036905},{"x":-0.04126,"y":0.00071,"z":-0.031037},{"x":-0.023479,"y":-0.053379,"z":-0.00548},{"x":-0.023508,"y":-0.053087,"z":0.000365},{"x":-0.022783,"y":-0.051144,"z":0.004216},{"x":-0.023182,"y":-0.051667,"z":0.014538},{"x":0.060834,"y":-0.013934,"z":0.00963},{"x":0.023098,"y":-0.051027,"z":-0.017271},{"x":0.008252,"y":0.020233,"z":0.035005},{"x":0.017039,"y":0.02471,"z":0.033457},{"x":0.013793,"y":0.014762,"z":0.035374},{"x":-0.060355,"y":0.076253,"z":-0.044461},{"x":-0.068777,"y":0.020095,"z":0.018316},{"x":-0.000052,"y":-0.043066,"z":-0.035966},{"x":0.02434,"y":-0.039951,"z":-0.035513},{"x":-0.033955,"y":0.041949,"z":-0.010355},{"x":-0.039717,"y":0.04402,"z":-0.0139},{"x":-0.037986,"y":0.049781,"z":-0.009755},{"x":-0.040866,"y":-0.005499,"z":0.036102},{"x":-0.071521,"y":0.022687,"z":-0.00256},{"x":0.053428,"y":-0.017514,"z":-0.019985},{"x":-0.006728,"y":0.010355,"z":-0.033894},{"x":-0.021459,"y":0.072961,"z":-0.007844},{"x":-0.003119,"y":0.077776,"z":-0.01958},{"x":-0.034323,"y":0.05047,"z":0.00687},{"x":-0.074971,"y":0.057188,"z":0.002841},{"x":-0.053968,"y":0.022771,"z":0.028843},{"x":0.037639,"y":-0.035979,"z":0.031873},{"x":0.024371,"y":-0.031437,"z":0.043823},{"x":0.019767,"y":-0.036359,"z":0.043651},{"x":0.0293,"y":-0.032579,"z":0.04006},{"x":0.026638,"y":-0.041058,"z":0.035904},{"x":0.059965,"y":-0.020891,"z":-0.009253},{"x":-0.035595,"y":-0.003818,"z":0.036074},{"x":0.040844,"y":-0.016367,"z":0.03475},{"x":0.035343,"y":-0.031138,"z":0.038541},{"x":-0.053412,"y":-0.021162,"z":0.020056},{"x":0.031506,"y":-0.04305,"z":-0.031983},{"x":0.018283,"y":-0.04386,"z":-0.033325},{"x":0.021097,"y":-0.012115,"z":-0.043233},{"x":-0.061295,"y":0.06603,"z":-0.025515},{"x":-0.028544,"y":0.040937,"z":0.007483},{"x":-0.030424,"y":0.034338,"z":0.018171},{"x":-0.031008,"y":0.038275,"z":0.014532},{"x":-0.048108,"y":0.065427,"z":-0.008627},{"x":0.019226,"y":-0.053295,"z":0.003169},{"x":-0.027202,"y":-0.05226,"z":-0.015127},{"x":-0.01968,"y":-0.051041,"z":-0.004541},{"x":-0.071384,"y":-0.0041,"z":-0.005025},{"x":0.035744,"y":-0.047235,"z":-0.016592},{"x":-0.018901,"y":-0.039886,"z":0.035295},{"x":-0.034028,"y":0.003919,"z":0.035429},{"x":0.016338,"y":-0.053014,"z":0.006399},{"x":-0.01618,"y":0.005867,"z":-0.033595},{"x":0.013686,"y":-0.052125,"z":0.000183},{"x":-0.035085,"y":0.002891,"z":-0.030677},{"x":-0.024448,"y":0.002786,"z":-0.032517},{"x":0.000929,"y":0.013884,"z":0.035095},{"x":-0.077844,"y":0.056067,"z":0.008227},{"x":-0.022684,"y":-0.052748,"z":-0.02724},{"x":0.022127,"y":-0.026596,"z":-0.039499},{"x":0.008123,"y":0.0235,"z":-0.030716},{"x":0.021118,"y":0.014435,"z":-0.030332},{"x":0.026142,"y":0.022183,"z":0.031348},{"x":0.006986,"y":0.013024,"z":-0.032894},{"x":0.046903,"y":-0.032221,"z":-0.021054},{"x":0.051597,"y":-0.031285,"z":-0.015195},{"x":-0.032756,"y":-0.051263,"z":-0.00046},{"x":-0.028413,"y":0.000127,"z":-0.030541},{"x":0.001404,"y":-0.040808,"z":-0.038184},{"x":0.057823,"y":-0.017336,"z":0.016607},{"x":0.054572,"y":-0.024767,"z":0.021135},{"x":-0.057586,"y":0.070964,"z":-0.04878},{"x":-0.032535,"y":-0.013703,"z":0.033087},{"x":-0.044689,"y":-0.027042,"z":0.013581},{"x":-0.045993,"y":-0.021218,"z":0.025087},{"x":-0.02961,"y":-0.016335,"z":0.033019},{"x":-0.037364,"y":-0.021134,"z":0.027334},{"x":-0.022026,"y":0.00235,"z":0.034708},{"x":-0.028774,"y":-0.000436,"z":0.033938},{"x":-0.009167,"y":-0.038365,"z":0.04112},{"x":-0.024073,"y":-0.044323,"z":0.032872},{"x":-0.029873,"y":-0.037541,"z":0.030572},{"x":-0.027435,"y":-0.007932,"z":0.034041},{"x":0.002081,"y":-0.040009,"z":0.039156},{"x":-0.025139,"y":-0.022817,"z":0.032872},{"x":-0.018125,"y":-0.00567,"z":0.032687},{"x":-0.032217,"y":-0.033118,"z":0.028867},{"x":-0.023318,"y":-0.002886,"z":0.03488},{"x":-0.021029,"y":-0.003264,"z":-0.032858},{"x":0.036416,"y":-0.050868,"z":0.003121},{"x":-0.043476,"y":0.016882,"z":0.032823},{"x":-0.03579,"y":0.032484,"z":0.023081},{"x":-0.007657,"y":0.009979,"z":0.036271},{"x":-0.058603,"y":0.080954,"z":-0.054893},{"x":-0.060331,"y":0.01737,"z":0.027706},{"x":-0.014298,"y":-0.035939,"z":-0.03219},{"x":-0.048619,"y":-0.041966,"z":0.021705},{"x":-0.036486,"y":-0.031381,"z":0.023899},{"x":-0.013887,"y":-0.027969,"z":-0.034914},{"x":-0.022762,"y":-0.032994,"z":0.029868},{"x":-0.027758,"y":-0.006702,"z":-0.028863},{"x":-0.020817,"y":-0.013883,"z":-0.0283},{"x":-0.018013,"y":-0.027548,"z":-0.022967},{"x":-0.021727,"y":-0.008465,"z":-0.029201},{"x":-0.030794,"y":-0.023644,"z":-0.022918},{"x":-0.015276,"y":-0.038368,"z":-0.032524},{"x":-0.038737,"y":-0.033349,"z":-0.015738},{"x":-0.042723,"y":-0.028462,"z":-0.010558},{"x":-0.04042,"y":-0.025615,"z":-0.01659},{"x":-0.028263,"y":-0.040878,"z":-0.022463},{"x":-0.03901,"y":-0.026752,"z":0.018745},{"x":-0.037792,"y":-0.030953,"z":0.010499},{"x":-0.038193,"y":-0.035035,"z":0.017337},{"x":-0.072331,"y":0.021935,"z":0.009562},{"x":0.017692,"y":-0.051165,"z":-0.023717},{"x":-0.043352,"y":-0.035203,"z":-0.007723},{"x":-0.04485,"y":-0.026173,"z":-0.011514},{"x":-0.041795,"y":-0.033022,"z":-0.00058},{"x":-0.035731,"y":-0.033959,"z":0.006993},{"x":-0.041241,"y":0.028009,"z":0.026472},{"x":0.015925,"y":-0.049838,"z":-0.00846},{"x":0.004552,"y":-0.049353,"z":-0.000737},{"x":-0.022995,"y":0.076711,"z":-0.010102},{"x":-0.012899,"y":0.080027,"z":-0.017848},{"x":-0.006721,"y":0.088656,"z":-0.024205},{"x":-0.024336,"y":-0.015284,"z":-0.025977},{"x":-0.025642,"y":-0.026217,"z":-0.021381},{"x":-0.020162,"y":-0.02908,"z":-0.019991},{"x":-0.018149,"y":-0.035386,"z":-0.020145},{"x":-0.037813,"y":-0.038767,"z":0.005322},{"x":-0.042908,"y":-0.044626,"z":0.008909},{"x":-0.037072,"y":-0.040689,"z":0.01045},{"x":0.054822,"y":-0.025167,"z":-0.013054},{"x":-0.006287,"y":-0.036245,"z":0.037008},{"x":-0.017121,"y":-0.03497,"z":0.028456},{"x":-0.012586,"y":-0.034059,"z":0.029657},{"x":-0.014658,"y":-0.031292,"z":0.027401},{"x":-0.012059,"y":-0.020589,"z":0.031519},{"x":-0.018533,"y":-0.017696,"z":0.031673},{"x":-0.023235,"y":-0.048727,"z":-0.017676},{"x":-0.01543,"y":-0.048519,"z":-0.025588},{"x":0.005512,"y":-0.048568,"z":-0.024222},{"x":0.010277,"y":-0.047889,"z":-0.02035},{"x":0.019679,"y":-0.0484,"z":-0.020321},{"x":0.017041,"y":-0.047797,"z":-0.014696},{"x":-0.019751,"y":-0.048711,"z":-0.009667},{"x":0.011526,"y":-0.049075,"z":0.000612}],"normals":[{"x":-0.812052,"y":-0.555941,"z":-0.177485},{"x":-0.836664,"y":-0.298683,"z":-0.459109},{"x":-0.64037,"y":-0.604072,"z":-0.474365},{"x":0.260865,"y":-0.248509,"z":0.932841},{"x":-0.276322,"y":-0.578377,"z":0.767546},{"x":0.349008,"y":-0.795773,"z":0.494913},{"x":-0.081159,"y":0.562624,"z":-0.82272},{"x":-0.146359,"y":0.3514,"z":-0.924715},{"x":-0.343681,"y":0.462334,"z":-0.817392},{"x":0.729021,"y":-0.177065,"z":-0.661193},{"x":0.710451,"y":-0.459865,"z":-0.532714},{"x":0.556702,"y":-0.262896,"z":-0.788015},{"x":-0.219307,"y":0.727418,"z":0.650206},{"x":-0.357062,"y":0.764123,"z":0.537236},{"x":0.265014,"y":0.478761,"z":0.836992},{"x":0.750256,"y":0.647347,"z":0.134381},{"x":0.844992,"y":0.447326,"z":0.293065},{"x":0.848611,"y":0.527781,"z":0.036142},{"x":0.007087,"y":-0.349682,"z":0.936842},{"x":-0.276583,"y":-0.489122,"z":0.827201},{"x":0.004615,"y":-0.646954,"z":0.762515},{"x":-0.849292,"y":-0.455004,"z":0.267721},{"x":-0.888098,"y":-0.41811,"z":0.190962},{"x":-0.836659,"y":-0.542918,"z":0.072408},{"x":0.631494,"y":0.355198,"z":0.689239},{"x":0.779888,"y":0.252136,"z":0.572889},{"x":0.529898,"y":0.375569,"z":0.760366},{"x":0.321019,"y":0.534919,"z":0.781542},{"x":0.513259,"y":0.271502,"z":0.814157},{"x":0.573794,"y":0.405971,"z":0.7113},{"x":0.745815,"y":-0.053477,"z":0.664003},{"x":-0.108363,"y":0.821003,"z":0.560546},{"x":0.413255,"y":0.281447,"z":0.86603},{"x":-0.740437,"y":0.499154,"z":-0.450109},{"x":-0.592007,"y":0.800897,"z":0.089949},{"x":-0.666506,"y":0.552953,"z":-0.500013},{"x":-0.467399,"y":-0.857624,"z":-0.214519},{"x":-0.156192,"y":-0.923903,"z":-0.349294},{"x":0.347258,"y":-0.900385,"z":-0.262143},{"x":-0.947249,"y":-0.300449,"z":-0.111574},{"x":-0.986438,"y":0.086531,"z":-0.13947},{"x":-0.855655,"y":-0.471386,"z":-0.213657},{"x":-0.818522,"y":0.227565,"z":-0.52748},{"x":-0.63289,"y":0.660648,"z":-0.403725},{"x":-0.805764,"y":0.161505,"z":-0.569789},{"x":-0.521516,"y":0.852659,"z":0.031523},{"x":0.468946,"y":0.720567,"z":0.510758},{"x":-0.928411,"y":-0.365564,"z":-0.066458},{"x":-0.558562,"y":-0.822428,"z":-0.107798},{"x":-0.577343,"y":-0.789764,"z":0.20724},{"x":-0.099966,"y":0.994917,"z":0.012097},{"x":-0.253742,"y":0.964424,"z":0.074177},{"x":-0.376788,"y":0.925276,"z":0.043541},{"x":0.413267,"y":-0.862165,"z":-0.293056},{"x":0.278823,"y":-0.959452,"z":-0.041355},{"x":0.284658,"y":-0.787286,"z":-0.546946},{"x":0.041492,"y":0.593253,"z":-0.803946},{"x":-0.033795,"y":0.348703,"z":-0.936624},{"x":0.130083,"y":0.988365,"z":-0.078822},{"x":0.549538,"y":0.778629,"z":-0.302893},{"x":0.175014,"y":0.813944,"z":-0.553955},{"x":0.30858,"y":-0.430448,"z":0.84823},{"x":0.254561,"y":-0.575975,"z":0.776821},{"x":0.399652,"y":-0.789662,"z":0.465523},{"x":-0.485635,"y":-0.243524,"z":-0.839556},{"x":-0.801697,"y":-0.326122,"z":-0.500925},{"x":-0.843836,"y":-0.19115,"z":-0.5014},{"x":0.157788,"y":-0.960241,"z":-0.230303},{"x":-0.263777,"y":-0.916456,"z":-0.300882},{"x":0.071814,"y":-0.918984,"z":-0.387701},{"x":-0.874684,"y":-0.138066,"z":-0.464614},{"x":-0.349232,"y":0.318081,"z":-0.881397},{"x":-0.486874,"y":-0.393114,"z":-0.780009},{"x":-0.683136,"y":0.652081,"z":0.328809},{"x":-0.197779,"y":0.890233,"z":0.410329},{"x":-0.096427,"y":0.905283,"z":0.41372},{"x":-0.345338,"y":-0.218237,"z":-0.912751},{"x":0.033883,"y":-0.718245,"z":-0.694965},{"x":0.092641,"y":-0.564149,"z":-0.82046},{"x":0.549529,"y":0.7666,"z":0.332179},{"x":0.070754,"y":0.997032,"z":0.030334},{"x":0.369849,"y":0.842519,"z":0.391629},{"x":0.327962,"y":0.944233,"z":0.029404},{"x":0.712342,"y":0.618927,"z":0.330905},{"x":-0.145951,"y":0.936517,"z":-0.318802},{"x":0.924184,"y":0.365397,"z":0.111217},{"x":0.969379,"y":-0.206282,"z":-0.133235},{"x":0.995959,"y":0.081287,"z":0.03819},{"x":0.038547,"y":0.967267,"z":-0.250818},{"x":0.299801,"y":0.841415,"z":-0.4496},{"x":0.261407,"y":0.947617,"z":-0.183541},{"x":-0.206131,"y":0.967851,"z":0.144135},{"x":-0.203494,"y":0.968012,"z":-0.146776},{"x":0.220862,"y":-0.260575,"z":-0.939852},{"x":-0.44703,"y":0.069714,"z":-0.891798},{"x":-0.380968,"y":-0.122071,"z":-0.916494},{"x":-0.599005,"y":-0.187093,"z":-0.778582},{"x":-0.367386,"y":-0.101366,"z":0.924528},{"x":-0.809613,"y":0.423185,"z":0.406744},{"x":-0.985828,"y":0.04271,"z":0.162233},{"x":-0.9411,"y":0.25018,"z":0.227467},{"x":-1.063484,"y":-0.586479,"z":-1.573127},{"x":-0.438605,"y":-0.201109,"z":-0.875888},{"x":-0.561834,"y":-0.186932,"z":-0.805853},{"x":0.20946,"y":-0.854812,"z":-0.474788},{"x":0.092922,"y":-0.79033,"z":-0.605594},{"x":0.45924,"y":-0.882445,"z":-0.101927},{"x":-0.00875,"y":0.49648,"z":-0.868004},{"x":0.341798,"y":0.406113,"z":-0.847494},{"x":0.194288,"y":0.542648,"z":-0.817181},{"x":0.386619,"y":0.87361,"z":-0.295518},{"x":0.545433,"y":0.833635,"z":-0.086924},{"x":0.694339,"y":0.709792,"z":-0.118692},{"x":-0.849785,"y":0.208333,"z":-0.484214},{"x":-0.844019,"y":0.253182,"z":-0.472791},{"x":-0.714065,"y":0.249776,"z":-0.654006},{"x":-0.119746,"y":0.966188,"z":0.228346},{"x":0.166872,"y":0.969967,"z":0.176969},{"x":-0.09933,"y":0.994896,"z":0.017741},{"x":0.0372,"y":0.533934,"z":0.844707},{"x":0.225365,"y":0.429051,"z":0.874715},{"x":0.123761,"y":0.695182,"z":0.7081},{"x":-0.642847,"y":0.739726,"z":-0.198877},{"x":0.545453,"y":-0.714381,"z":0.438338},{"x":0.374088,"y":-0.845084,"z":0.381957},{"x":0.01529,"y":-0.998638,"z":0.049892},{"x":0.026355,"y":-0.998499,"z":0.048008},{"x":-0.030703,"y":-0.997807,"z":-0.058632},{"x":0.787706,"y":0.305638,"z":0.534887},{"x":0.657308,"y":0.507203,"z":0.557398},{"x":0.092701,"y":0.24238,"z":0.965742},{"x":-0.040908,"y":0.285165,"z":0.957605},{"x":-0.031181,"y":0.068763,"z":0.997146},{"x":0.013672,"y":0.596638,"z":0.802394},{"x":-0.023412,"y":0.774412,"z":0.632248},{"x":0.037721,"y":0.569862,"z":0.820874},{"x":0.688946,"y":0.011542,"z":0.724721},{"x":0.676321,"y":0.137294,"z":0.723699},{"x":0.67835,"y":0.309791,"z":0.666236},{"x":-0.882333,"y":0.151855,"z":0.445453},{"x":-0.981622,"y":-0.073965,"z":0.175921},{"x":-0.849602,"y":-0.13063,"z":0.510991},{"x":-0.457891,"y":0.360687,"z":-0.812552},{"x":-0.681578,"y":-0.253135,"z":-0.686567},{"x":-0.295673,"y":-0.876166,"z":-0.380672},{"x":0.783222,"y":0.231263,"z":0.577131},{"x":0.448628,"y":0.743001,"z":0.496671},{"x":0.126549,"y":-0.226164,"z":-0.965834},{"x":0.231096,"y":-0.137283,"z":-0.963197},{"x":0.258531,"y":-0.185393,"z":-0.948046},{"x":0.036692,"y":0.48454,"z":-0.873999},{"x":0.085064,"y":0.816523,"z":-0.571012},{"x":0.278071,"y":0.409259,"z":-0.869013},{"x":-0.569757,"y":0.730991,"z":-0.37554},{"x":-0.528384,"y":0.848979,"z":0.006681},{"x":0.142036,"y":1.732641,"z":-0.330083},{"x":0.531298,"y":0.841098,"z":0.101376},{"x":0.845566,"y":-0.110625,"z":-0.522283},{"x":0.930134,"y":-0.355547,"z":-0.091854},{"x":0.794799,"y":-0.495891,"z":-0.349839},{"x":0.837267,"y":0.222349,"z":0.499544},{"x":0.929455,"y":0.368762,"z":-0.011276},{"x":0.532225,"y":0.790529,"z":0.302986},{"x":-0.742036,"y":-0.418156,"z":0.523955},{"x":-0.89409,"y":-0.382612,"z":0.232834},{"x":0.151264,"y":0.403715,"z":0.902293},{"x":-0.042811,"y":0.293687,"z":0.954943},{"x":-0.144712,"y":0.052181,"z":0.988097},{"x":-0.578987,"y":0.492268,"z":-0.649959},{"x":0.257925,"y":0.952499,"z":0.161929},{"x":-0.912849,"y":0.25967,"z":-0.315084},{"x":-0.241969,"y":0.968456,"z":0.059537},{"x":-0.406011,"y":-0.771265,"z":-0.49021},{"x":-0.313945,"y":-0.482694,"z":-0.817585},{"x":-0.327751,"y":0.449934,"z":-0.830746},{"x":-0.56775,"y":0.655735,"z":-0.497665},{"x":0.7187,"y":-0.664558,"z":-0.20453},{"x":0.110797,"y":0.113891,"z":-0.987296},{"x":-0.543259,"y":0.429491,"z":-0.721392},{"x":-0.234717,"y":0.697704,"z":0.676844},{"x":-0.609696,"y":-0.022421,"z":0.792318},{"x":0.035807,"y":0.234152,"z":0.97154},{"x":-0.69237,"y":-0.691068,"z":0.207483},{"x":-0.646364,"y":-0.672951,"z":0.359653},{"x":-0.988696,"y":-0.140869,"z":-0.051346},{"x":-0.222967,"y":-0.710584,"z":0.66735},{"x":-0.142205,"y":-0.444335,"z":0.884502},{"x":-0.094242,"y":0.966371,"z":-0.239261},{"x":-0.17886,"y":0.890554,"z":-0.418238},{"x":-0.234062,"y":-0.557609,"z":-0.796422},{"x":0.995103,"y":-0.004675,"z":-0.098736},{"x":0.900227,"y":-0.434743,"z":-0.024297},{"x":0.433455,"y":-0.594828,"z":-0.676976},{"x":-0.140224,"y":0.861805,"z":0.487473},{"x":0.068915,"y":0.882764,"z":0.464735},{"x":-0.29536,"y":0.71766,"z":0.630656},{"x":-0.177138,"y":0.386918,"z":0.90494},{"x":-0.187184,"y":0.583796,"z":0.790028},{"x":0.065105,"y":0.73151,"z":-0.678716},{"x":-0.07993,"y":0.66393,"z":-0.743511},{"x":-0.114279,"y":0.785176,"z":-0.608637},{"x":-0.086373,"y":0.63201,"z":-0.770132},{"x":-0.734457,"y":0.248158,"z":-0.631657},{"x":-0.814627,"y":0.272206,"z":-0.512139},{"x":-0.547526,"y":0.304416,"z":-0.779452},{"x":0.410042,"y":-0.855418,"z":-0.316427},{"x":0.612397,"y":-0.196294,"z":-0.765793},{"x":0.872154,"y":-0.137118,"z":0.469624},{"x":0.650569,"y":-0.166187,"z":0.741041},{"x":0.83301,"y":-0.456499,"z":0.312574},{"x":-0.120427,"y":-0.117208,"z":0.985779},{"x":-0.001978,"y":0.275241,"z":0.961373},{"x":0.340928,"y":0.445019,"z":0.828086},{"x":0.090422,"y":0.630959,"z":0.770529},{"x":0.996038,"y":-0.088094,"z":0.01215},{"x":0.977094,"y":-0.139439,"z":-0.160763},{"x":0.875943,"y":0.379094,"z":0.298347},{"x":0.628495,"y":0.711485,"z":0.314299},{"x":0.90928,"y":0.381521,"z":0.166288},{"x":0.862062,"y":0.467504,"z":0.195678},{"x":0.545949,"y":0.701796,"z":-0.457627},{"x":-0.689243,"y":0.136663,"z":-0.711524},{"x":-0.89976,"y":-0.234797,"z":0.367834},{"x":-0.42853,"y":-0.482146,"z":0.764132},{"x":-0.217057,"y":0.214712,"z":0.952253},{"x":-0.234526,"y":0.277743,"z":0.931588},{"x":-0.473921,"y":0.150948,"z":0.867533},{"x":-0.179796,"y":-0.832979,"z":0.523277},{"x":0.74795,"y":-0.374151,"z":0.548254},{"x":-0.550227,"y":0.54647,"z":0.631364},{"x":-0.238575,"y":0.666408,"z":0.706387},{"x":-0.506615,"y":0.714921,"z":0.481902},{"x":0.66404,"y":0.744482,"z":-0.069255},{"x":0.118919,"y":-0.989313,"z":-0.084369},{"x":0.26619,"y":-4.955281,"z":-0.072044},{"x":0.011282,"y":-0.999491,"z":0.029833},{"x":-1.147655,"y":-4.467609,"z":0.472531},{"x":0.164109,"y":-0.982604,"z":-0.086937},{"x":-0.16226,"y":-0.398635,"z":-0.902642},{"x":-0.470739,"y":-0.366479,"z":-0.802557},{"x":-0.037294,"y":-0.27966,"z":-0.959375},{"x":-0.311983,"y":-0.232391,"z":-0.921228},{"x":-0.27746,"y":0.152851,"z":-0.9485},{"x":-0.572013,"y":0.203342,"z":-0.79464},{"x":-0.732587,"y":0.222187,"z":0.643389},{"x":-0.354447,"y":-0.16755,"z":0.919943},{"x":-0.578931,"y":0.109755,"z":0.807956},{"x":-0.847196,"y":-0.012333,"z":0.531137},{"x":-0.70502,"y":0.43138,"z":0.562902},{"x":-0.870756,"y":-0.258032,"z":-0.418574},{"x":0.131584,"y":-0.82745,"z":-0.545905},{"x":0.69728,"y":-0.551577,"z":-0.45778},{"x":0.485447,"y":-0.871428,"z":0.070389},{"x":0.620605,"y":-0.573604,"z":0.534629},{"x":0.568076,"y":-0.77813,"z":0.267961},{"x":0.582137,"y":-0.744419,"z":-0.327043},{"x":0.734295,"y":-0.678829,"z":0.001509},{"x":-0.666619,"y":0.081999,"z":-0.740874},{"x":-0.716797,"y":0.045206,"z":-0.695815},{"x":-0.427837,"y":0.184436,"z":-0.884838},{"x":0.808313,"y":0.000099,"z":0.588753},{"x":-0.506956,"y":-0.855843,"z":0.102607},{"x":-0.082887,"y":-0.995899,"z":0.036268},{"x":-0.017642,"y":-0.246933,"z":0.968872},{"x":-0.062347,"y":-0.217827,"z":0.973994},{"x":-0.149116,"y":-0.273811,"z":0.950154},{"x":0.831806,"y":0.248598,"z":-0.496285},{"x":0.867516,"y":0.3244,"z":-0.377068},{"x":0.958516,"y":0.061318,"z":-0.278366},{"x":-0.375015,"y":0.153057,"z":-0.914296},{"x":-0.739932,"y":0.168602,"z":-0.65121},{"x":-0.692454,"y":-0.070271,"z":0.718031},{"x":-0.733165,"y":0.145272,"z":0.664353},{"x":-0.239333,"y":0.94584,"z":0.219333},{"x":-0.634595,"y":0.734463,"z":0.240526},{"x":-0.213039,"y":0.877836,"z":0.428974},{"x":0.321537,"y":-0.574674,"z":-0.752571},{"x":0.164153,"y":-0.496073,"z":-0.852623},{"x":0.121786,"y":-0.247909,"z":-0.961098},{"x":-0.002618,"y":-0.899351,"z":0.437219},{"x":-0.747586,"y":0.315114,"z":0.584652},{"x":-0.481219,"y":0.268682,"z":0.834409},{"x":0.013289,"y":-0.999682,"z":-0.021429},{"x":-0.694378,"y":-0.449045,"z":-0.562315},{"x":-0.927879,"y":-0.172385,"z":-0.330642},{"x":-0.837323,"y":-0.089154,"z":-0.53939},{"x":0.638442,"y":-0.044543,"z":0.76838},{"x":0.606895,"y":0.051332,"z":0.793123},{"x":0.982817,"y":-0.018005,"z":-0.183703},{"x":0.982399,"y":-0.092085,"z":0.162517},{"x":0.37054,"y":0.608061,"z":-0.702112},{"x":0.959145,"y":0.221553,"z":0.17594},{"x":0.921263,"y":0.384649,"z":0.05762},{"x":0.681246,"y":-0.062803,"z":0.729356},{"x":0.845639,"y":0.049357,"z":0.531468},{"x":0.68976,"y":0.165948,"z":0.704764},{"x":0.180709,"y":0.049935,"z":0.982268},{"x":0.137174,"y":0.987186,"z":-0.081533},{"x":0.381471,"y":0.924322,"z":-0.010389},{"x":0.203904,"y":0.762701,"z":-0.613767},{"x":0.000865,"y":0.778323,"z":-0.627864},{"x":0.096367,"y":0.920048,"z":-0.379769},{"x":-0.091675,"y":0.733451,"z":0.673532},{"x":-0.198261,"y":0.595331,"z":0.778636},{"x":0.010826,"y":0.792178,"z":0.610194},{"x":0.34213,"y":0.050594,"z":0.93829},{"x":0.420509,"y":0.011027,"z":0.907221},{"x":0.462542,"y":0.207592,"z":0.861951},{"x":0.315451,"y":-0.056588,"z":0.947253},{"x":-0.386416,"y":-0.166761,"z":-0.907124},{"x":-0.569845,"y":0.140834,"z":-0.809594},{"x":-0.147032,"y":-0.484099,"z":-0.862571},{"x":0.035524,"y":0.931212,"z":0.362743},{"x":0.179095,"y":0.976955,"z":0.116116},{"x":-0.311049,"y":0.897253,"z":0.313344},{"x":0.338303,"y":-0.632885,"z":-0.696425},{"x":0.613046,"y":-0.42421,"z":-0.666498},{"x":0.849201,"y":-0.064391,"z":-0.52413},{"x":0.839008,"y":-0.072137,"z":-0.539317},{"x":0.808209,"y":0.283603,"z":-0.516108},{"x":0.441063,"y":0.169212,"z":-0.88138},{"x":0.333247,"y":-0.022666,"z":0.942567},{"x":0.649501,"y":-0.401757,"z":0.645554},{"x":0.53758,"y":-0.18949,"z":0.821645},{"x":0.137728,"y":-0.9857,"z":0.09709},{"x":0.180014,"y":-0.974449,"z":0.134328},{"x":0.185661,"y":-0.976084,"z":0.113092},{"x":-0.068406,"y":-0.975183,"z":0.210569},{"x":-0.038128,"y":-0.982747,"z":0.180981},{"x":-0.017955,"y":0.672827,"z":-0.739582},{"x":-0.077377,"y":0.629074,"z":-0.773484},{"x":-0.083754,"y":0.802854,"z":-0.590264},{"x":-0.003379,"y":0.341297,"z":0.939949},{"x":0.187582,"y":0.654789,"z":0.732164},{"x":-0.749732,"y":0.132602,"z":0.648319},{"x":-0.628753,"y":-0.039286,"z":0.776612},{"x":-0.984986,"y":0.109751,"z":0.133254},{"x":-0.98807,"y":-0.149416,"z":0.037309},{"x":0.025515,"y":0.961593,"z":0.273292},{"x":-0.061109,"y":0.645768,"z":0.761084},{"x":0.131783,"y":0.021951,"z":0.991036},{"x":0.011119,"y":0.405977,"z":0.913816},{"x":0.14422,"y":-0.641458,"z":0.75348},{"x":0.278371,"y":0.171031,"z":0.945123},{"x":-0.701232,"y":-0.308648,"z":0.642659},{"x":-0.240606,"y":-0.136953,"z":0.960912},{"x":-0.694204,"y":-0.206562,"z":0.689502},{"x":0.075285,"y":0.608912,"z":0.789657},{"x":0.158507,"y":0.322206,"z":0.933305},{"x":-0.432081,"y":0.889246,"z":0.150158},{"x":-0.669273,"y":0.544707,"z":0.50534},{"x":-0.843981,"y":0.532898,"z":0.060959},{"x":-0.913854,"y":0.159619,"z":0.373353},{"x":-0.566058,"y":0.818848,"z":0.095215},{"x":-0.952854,"y":0.274855,"z":0.128547},{"x":-0.874875,"y":0.483777,"z":-0.02353},{"x":-0.987328,"y":-0.147044,"z":-0.059685},{"x":-0.965655,"y":-0.067067,"z":-0.251021},{"x":-0.072975,"y":-0.837019,"z":-0.542286},{"x":-0.721404,"y":-0.202603,"z":-0.662215},{"x":0.399809,"y":-0.862099,"z":0.31135},{"x":0.029458,"y":-0.997063,"z":0.070693},{"x":0.116369,"y":-0.316866,"z":0.941305},{"x":0.294356,"y":-0.435912,"z":0.850491},{"x":0.600912,"y":0.735283,"z":0.313472},{"x":0.270864,"y":0.897557,"z":0.347884},{"x":-0.38939,"y":-0.417855,"z":0.820837},{"x":-0.401941,"y":-0.086955,"z":0.911527},{"x":-0.781848,"y":-0.554287,"z":-0.285447},{"x":0.450364,"y":0.227212,"z":0.863451},{"x":0.399525,"y":0.387785,"z":0.830664},{"x":-0.606246,"y":0.228009,"z":0.761891},{"x":-0.137327,"y":0.886344,"z":-0.442195},{"x":-0.106874,"y":-0.964493,"z":0.241519},{"x":-0.020338,"y":0.169926,"z":-0.985247},{"x":0.242285,"y":0.119076,"z":-0.96287},{"x":-0.955888,"y":-0.290981,"z":-0.040106},{"x":-0.766664,"y":-0.640165,"z":0.04914},{"x":-0.952234,"y":0.187533,"z":-0.241001},{"x":-0.245879,"y":-0.96496,"z":0.091634},{"x":-0.24558,"y":-0.960479,"z":-0.131041},{"x":0.206673,"y":-0.114539,"z":-0.971683},{"x":-0.116457,"y":-0.11955,"z":-0.985974},{"x":-0.42557,"y":0.245348,"z":-0.871031},{"x":-0.372237,"y":0.155195,"z":-0.91507},{"x":-0.139565,"y":0.044109,"z":-0.98923},{"x":0.183867,"y":0.304853,"z":-0.934483},{"x":-0.143404,"y":0.468725,"z":-0.871626},{"x":-0.538482,"y":-0.348715,"z":0.767095},{"x":-0.446616,"y":-0.587527,"z":0.674793},{"x":-0.353002,"y":-0.32277,"z":0.878185},{"x":0.196933,"y":0.175248,"z":0.964627},{"x":0.689105,"y":0.167482,"z":0.705042},{"x":-0.16103,"y":-0.519049,"z":0.839439},{"x":-0.18492,"y":-0.268644,"z":0.945323},{"x":-0.679192,"y":0.399196,"z":0.615906},{"x":-0.87411,"y":0.007275,"z":0.485674},{"x":-0.742609,"y":-0.083306,"z":-0.664523},{"x":-0.955599,"y":-0.237737,"z":-0.1741},{"x":-0.696372,"y":0.611649,"z":-0.375434},{"x":-0.84096,"y":-0.50082,"z":-0.204853},{"x":-0.996713,"y":-0.0026,"z":0.080975},{"x":0.678954,"y":-0.249084,"z":0.690636},{"x":0.633113,"y":0.403241,"z":0.66073},{"x":-0.156529,"y":-0.937049,"z":0.312151},{"x":-0.849988,"y":0.02867,"z":-0.526022},{"x":-0.930106,"y":-0.218923,"z":-0.294917},{"x":-0.965534,"y":0.13067,"z":-0.225099},{"x":-0.344463,"y":0.588416,"z":-0.731514},{"x":-0.725123,"y":0.436552,"z":-0.532559},{"x":-0.129743,"y":-0.874803,"z":0.466783},{"x":-0.615871,"y":-0.071956,"z":-0.784554},{"x":-0.356477,"y":0.193827,"z":-0.913978},{"x":0.973306,"y":0.220304,"z":-0.064354},{"x":0.330824,"y":0.062576,"z":-0.941615},{"x":0.416424,"y":0.269787,"z":-0.86822},{"x":0.48759,"y":0.091923,"z":-0.86822},{"x":0.894695,"y":-0.415797,"z":-0.163196},{"x":0.436341,"y":0.422958,"z":-0.794174},{"x":0.481523,"y":0.278446,"z":-0.831025},{"x":-0.026104,"y":-0.999621,"z":-0.008766},{"x":0.086214,"y":-0.996198,"z":-0.012479},{"x":0.348576,"y":-0.899733,"z":-0.262633},{"x":0.838862,"y":0.285407,"z":-0.463524},{"x":0.759258,"y":0.559003,"z":-0.33323},{"x":0.866873,"y":0.48233,"z":-0.126051},{"x":-0.022847,"y":-0.343354,"z":-0.938928},{"x":-0.015803,"y":0.243581,"z":-0.969752},{"x":-0.970233,"y":-0.237294,"z":0.048362},{"x":-0.860277,"y":-0.500517,"z":0.096984},{"x":-0.97231,"y":0.221373,"z":-0.074882},{"x":0.890258,"y":0.219257,"z":0.399209},{"x":-0.943409,"y":0.264582,"z":-0.199939},{"x":0.563548,"y":-0.37887,"z":0.734079},{"x":0.649748,"y":-0.454936,"z":0.608983},{"x":0.294895,"y":-0.182357,"z":0.937967},{"x":0.283565,"y":-0.063202,"z":0.956868},{"x":0.08618,"y":-0.17311,"z":0.981125},{"x":-0.205573,"y":-0.110423,"z":-0.972392},{"x":0.686675,"y":-0.603603,"z":-0.405142},{"x":0.922714,"y":0.221976,"z":0.31516},{"x":0.727934,"y":0.200855,"z":0.655568},{"x":0.766905,"y":-0.027057,"z":0.641191},{"x":0.318056,"y":0.662144,"z":0.678532},{"x":-0.112873,"y":0.175208,"z":-0.97804},{"x":-0.212209,"y":0.215887,"z":-0.953079},{"x":-0.249274,"y":0.139641,"z":-0.958313},{"x":-0.362221,"y":0.133999,"z":-0.92241},{"x":-0.0309,"y":0.371668,"z":-0.927851},{"x":-0.110625,"y":0.356539,"z":-0.927708},{"x":0.170087,"y":-0.039772,"z":0.984626},{"x":-0.13881,"y":-0.228718,"z":0.963546},{"x":0.095439,"y":0.091509,"z":-0.99122},{"x":0.578458,"y":-0.110361,"z":-0.808212},{"x":0.443341,"y":0.247325,"z":0.861556},{"x":0.594976,"y":-0.570483,"z":0.566175},{"x":0.051742,"y":0.903424,"z":0.425615},{"x":0.122201,"y":-0.992483,"z":-0.006601},{"x":0.020226,"y":-0.984296,"z":0.175361},{"x":0.258375,"y":0.720176,"z":0.643886},{"x":0.353988,"y":0.655492,"z":0.6671},{"x":0.333735,"y":0.867841,"z":0.368067},{"x":-0.604484,"y":0.211158,"z":-0.768122},{"x":0.736874,"y":0.328562,"z":0.590816},{"x":0.778771,"y":0.307088,"z":0.547004},{"x":0.836235,"y":0.437963,"z":0.329998},{"x":0.557695,"y":0.400089,"z":0.727259},{"x":0.730855,"y":0.007018,"z":0.682497},{"x":0.542542,"y":0.185151,"z":0.81937},{"x":0.705428,"y":-0.160195,"z":0.690441},{"x":0.38436,"y":0.759247,"z":-0.525178},{"x":0.45353,"y":0.429025,"z":0.781183},{"x":-0.195273,"y":-0.892987,"z":0.405514},{"x":-0.657022,"y":0.725239,"z":0.205792},{"x":-0.537125,"y":0.843204,"z":0.02243},{"x":-0.505908,"y":0.655006,"z":0.56127},{"x":-0.973794,"y":0.13425,"z":0.183583},{"x":0.584578,"y":-0.673,"z":-0.453144},{"x":0.573561,"y":0.538902,"z":-0.616938},{"x":0.397584,"y":0.541386,"z":-0.740829},{"x":0.416103,"y":0.531803,"z":-0.737593},{"x":0.378321,"y":0.510369,"z":-0.772267},{"x":0.673913,"y":0.360141,"z":-0.645089},{"x":0.254714,"y":0.261746,"z":-0.930919},{"x":0.164284,"y":0.459275,"z":-0.872971},{"x":-0.867976,"y":-0.107619,"z":-0.484806},{"x":-0.772997,"y":-0.527061,"z":-0.353103},{"x":-0.335322,"y":-0.039217,"z":-0.941287},{"x":-0.050467,"y":-0.269223,"z":-0.961755},{"x":-0.762028,"y":-0.177007,"z":-0.622882},{"x":-0.494902,"y":-0.132163,"z":-0.858839},{"x":-0.822096,"y":0.402505,"z":-0.402677},{"x":-0.672782,"y":0.712539,"z":-0.19913},{"x":-0.547004,"y":0.816252,"z":-0.185795},{"x":-0.280344,"y":0.942685,"z":0.180974},{"x":0.441099,"y":-0.098844,"z":-0.891999},{"x":0.35637,"y":-0.128776,"z":-0.925428},{"x":-0.084975,"y":0.403379,"z":0.911079},{"x":0.084176,"y":0.425951,"z":0.900822},{"x":0.002027,"y":0.124173,"z":0.992259},{"x":0.195357,"y":-0.265436,"z":-0.944129},{"x":0.131333,"y":-0.44285,"z":-0.886925},{"x":0.136359,"y":-0.322899,"z":-0.936559},{"x":-0.487767,"y":-0.085888,"z":0.868739},{"x":-0.780674,"y":-0.614765,"z":0.112303},{"x":-0.359176,"y":0.591815,"z":-0.721628},{"x":-0.835604,"y":0.446752,"z":-0.319653},{"x":-0.539904,"y":0.734443,"z":-0.411215},{"x":-0.083365,"y":-0.443245,"z":-0.892515},{"x":-0.129273,"y":-0.632585,"z":-0.763626},{"x":-0.82485,"y":0.53305,"z":0.18836},{"x":-0.67942,"y":-0.724732,"z":-0.114687},{"x":-0.438621,"y":0.846062,"z":-0.30297},{"x":0.663252,"y":0.330762,"z":-0.671337},{"x":0.918907,"y":-0.394469,"z":0.002058},{"x":0.374792,"y":0.359311,"z":0.85465},{"x":0.665518,"y":0.206806,"z":-0.71716},{"x":-0.50826,"y":0.652772,"z":0.561748},{"x":-0.910531,"y":-0.394257,"z":-0.124473},{"x":-0.467734,"y":0.436718,"z":0.768441},{"x":0.147199,"y":0.225808,"z":0.962987},{"x":0.361594,"y":0.124299,"z":0.924013},{"x":0.394455,"y":-0.266708,"z":0.879359},{"x":-0.329563,"y":0.624139,"z":0.708405},{"x":-0.154652,"y":0.160258,"z":0.974885},{"x":0.701058,"y":-0.606766,"z":-0.374636},{"x":0.532498,"y":-0.444419,"z":-0.720373},{"x":0.926126,"y":0.050883,"z":0.373767},{"x":-0.982712,"y":0.148646,"z":0.110367},{"x":-0.988034,"y":0.098167,"z":0.118962},{"x":-0.669608,"y":-0.741014,"z":0.050234},{"x":-0.714342,"y":-0.636193,"z":0.291503},{"x":-0.612989,"y":-0.426917,"z":-0.66482},{"x":-0.635176,"y":-0.71536,"z":-0.291223},{"x":-0.892418,"y":0.104316,"z":-0.438986},{"x":-0.410393,"y":-0.486512,"z":-0.771287},{"x":0.586161,"y":0.718923,"z":0.373584},{"x":0.30769,"y":-0.317585,"z":-0.896921},{"x":0.418043,"y":0.595876,"z":0.685691},{"x":0.264699,"y":0.535376,"z":0.802064},{"x":0.141595,"y":0.808819,"z":-0.570757},{"x":-0.115328,"y":0.434109,"z":-0.893448},{"x":-0.949617,"y":-0.298411,"z":0.095803},{"x":-0.343141,"y":0.204889,"z":-0.916665},{"x":-0.024448,"y":-0.999322,"z":-0.027538},{"x":0.39447,"y":0.180602,"z":0.900986},{"x":0.265909,"y":0.342168,"z":0.901229},{"x":0.697133,"y":-0.071169,"z":-0.7134},{"x":0.652835,"y":-0.105744,"z":-0.750083},{"x":0.653822,"y":-0.065372,"z":-0.753819},{"x":0.246837,"y":-0.281756,"z":-0.927192},{"x":0.449059,"y":-0.088684,"z":-0.88909},{"x":-0.149223,"y":0.075898,"z":0.985886},{"x":-0.070673,"y":-0.996505,"z":0.044534},{"x":0.093094,"y":0.798669,"z":0.594526},{"x":0.299854,"y":-0.171548,"z":0.938434},{"x":0.493178,"y":-0.154166,"z":0.856159},{"x":0.126525,"y":-0.32231,"z":0.938141},{"x":0.90233,"y":0.334431,"z":0.27195},{"x":0.952496,"y":0.095833,"z":0.289079},{"x":-0.972777,"y":0.21052,"z":0.096888},{"x":0.931767,"y":0.297604,"z":-0.207949},{"x":0.594348,"y":-0.6197,"z":0.512564},{"x":0.390366,"y":0.232421,"z":-0.89084},{"x":0.572074,"y":-0.166079,"z":0.803212},{"x":0.732773,"y":-0.158649,"z":0.66172},{"x":0.541604,"y":-0.114442,"z":0.832807},{"x":0.142137,"y":0.913871,"z":0.380312},{"x":0.502117,"y":0.86354,"z":-0.046665},{"x":-0.27122,"y":0.839217,"z":0.471332},{"x":-0.956122,"y":0.262454,"z":0.130185},{"x":0.003767,"y":0.55579,"z":-0.831314},{"x":0.151775,"y":0.289613,"z":-0.945034},{"x":-0.145901,"y":0.812636,"z":-0.564212},{"x":-0.42741,"y":0.806715,"z":-0.408083},{"x":-0.102831,"y":0.387184,"z":0.91625},{"x":-0.327142,"y":-0.250798,"z":0.911086},{"x":-0.651989,"y":-0.236383,"z":0.72044},{"x":-0.137103,"y":-0.165986,"z":0.976551},{"x":-0.632657,"y":-0.688256,"z":0.355033},{"x":-0.35687,"y":-0.931604,"z":0.068971},{"x":-0.536073,"y":-0.810111,"z":0.237371},{"x":-0.547121,"y":-0.825873,"z":-0.136352},{"x":-0.644168,"y":-0.748083,"z":0.159437},{"x":0.21798,"y":0.518402,"z":-0.826888},{"x":-0.161177,"y":0.241557,"z":0.956908},{"x":-2.067222,"y":2.5079,"z":5.219454},{"x":-0.636259,"y":0.468631,"z":-0.612829},{"x":-0.671629,"y":-0.294569,"z":-0.679811},{"x":0.984798,"y":0.169815,"z":-0.036552},{"x":0.44887,"y":0.892319,"z":-0.047778},{"x":0.878372,"y":0.219851,"z":-0.424415},{"x":0.783026,"y":-0.277627,"z":-0.55659},{"x":0.056441,"y":0.177139,"z":-0.982566},{"x":0.623362,"y":-0.534675,"z":-0.570563},{"x":-0.5892,"y":-0.802678,"z":-0.092473},{"x":-0.606744,"y":-0.74969,"z":0.264248},{"x":0.350507,"y":0.635417,"z":-0.688033},{"x":0.165073,"y":-0.266,"z":-0.949734},{"x":-0.64217,"y":-0.312314,"z":-0.700056},{"x":-0.337121,"y":0.020371,"z":-0.941241},{"x":0.347255,"y":-0.557381,"z":-0.754149},{"x":-0.010866,"y":0.644175,"z":0.764801},{"x":0.049205,"y":0.671484,"z":0.739384},{"x":0.609477,"y":-0.111476,"z":0.784927},{"x":-0.12992,"y":-0.03503,"z":-0.990906},{"x":0.178821,"y":-0.976565,"z":-0.119762},{"x":-0.25161,"y":-0.868877,"z":0.426317},{"x":-0.258348,"y":-0.954318,"z":0.15011},{"x":-0.173937,"y":-2.814677,"z":-0.27619},{"x":0.820656,"y":0.464849,"z":0.332324},{"x":-0.589167,"y":-0.763829,"z":-0.263529},{"x":-0.045565,"y":0.215886,"z":0.975355},{"x":0.130922,"y":0.320085,"z":0.938299},{"x":0.082831,"y":0.507577,"z":0.857616},{"x":-0.739423,"y":-0.569843,"z":-0.358514},{"x":-0.844623,"y":0.137517,"z":0.517398},{"x":0.107732,"y":-0.219903,"z":-0.969555},{"x":0.207912,"y":-0.358648,"z":-0.910024},{"x":0.44695,"y":0.722484,"z":-0.527497},{"x":0.602239,"y":0.2052,"z":-0.771492},{"x":0.833567,"y":0.194625,"z":-0.516998},{"x":-0.078635,"y":-0.223489,"z":0.971529},{"x":-0.916203,"y":-0.228189,"z":-0.329395},{"x":0.846382,"y":-0.092363,"z":-0.524507},{"x":-0.155611,"y":0.687672,"z":-0.709149},{"x":0.182791,"y":0.702424,"z":0.687886},{"x":0.323522,"y":0.652615,"z":0.685148},{"x":0.881271,"y":0.465066,"z":0.084119},{"x":-0.862018,"y":-0.022075,"z":-0.506397},{"x":0.126468,"y":-0.171683,"z":0.977001},{"x":0.538253,"y":-0.435286,"z":0.721672},{"x":0.372209,"y":-0.164884,"z":0.913386},{"x":0.205824,"y":-0.444834,"z":0.871641},{"x":0.427722,"y":-0.353983,"z":0.831715},{"x":0.389925,"y":-0.360765,"z":0.847235},{"x":0.116765,"y":0.508496,"z":-0.853111},{"x":0.1417,"y":-0.15004,"z":0.978473},{"x":0.541757,"y":-0.094585,"z":0.835196},{"x":0.504479,"y":-0.257757,"z":0.824053},{"x":-0.45439,"y":-0.791365,"z":0.408988},{"x":0.467325,"y":-0.326717,"z":-0.821501},{"x":0.058086,"y":-0.502062,"z":-0.862879},{"x":0.320166,"y":-0.064659,"z":-0.945152},{"x":-0.970691,"y":-0.158291,"z":-0.18084},{"x":0.528745,"y":0.755779,"z":0.386299},{"x":0.349275,"y":0.599974,"z":0.719749},{"x":0.798208,"y":0.324223,"z":0.507684},{"x":0.297096,"y":0.700809,"z":-0.648538},{"x":0.094546,"y":-0.995433,"z":-0.013166},{"x":0.445534,"y":-0.891971,"z":-0.07673},{"x":0.442569,"y":-0.829886,"z":-0.339739},{"x":-0.90551,"y":-0.394225,"z":-0.156965},{"x":0.705963,"y":-0.612521,"z":-0.355574},{"x":-0.576328,"y":0.643685,"z":0.503503},{"x":0.19188,"y":0.036,"z":0.980758},{"x":-0.216798,"y":-0.974251,"z":0.061913},{"x":-0.427999,"y":0.373607,"z":-0.822942},{"x":-0.541647,"y":-0.832405,"z":-0.117132},{"x":-0.04699,"y":-0.077538,"z":-0.995881},{"x":-0.195936,"y":-0.101772,"z":-0.975321},{"x":-0.607542,"y":1.121699,"z":2.356527},{"x":-0.991336,"y":-0.068449,"z":-0.112105},{"x":0.283791,"y":-0.916778,"z":0.281034},{"x":0.270629,"y":-0.164835,"z":-0.948467},{"x":0.036861,"y":0.418505,"z":-0.907466},{"x":0.08894,"y":0.342092,"z":-0.935448},{"x":-0.077959,"y":0.594177,"z":0.800548},{"x":0.058195,"y":0.52677,"z":-0.848013},{"x":0.774817,"y":-0.403774,"z":-0.486441},{"x":0.534563,"y":-0.142995,"z":-0.832944},{"x":0.063837,"y":-0.962827,"z":0.262469},{"x":-0.169557,"y":-0.23037,"z":-0.958217},{"x":-0.043377,"y":-0.6013,"z":-0.797845},{"x":0.77891,"y":0.160428,"z":0.606269},{"x":0.415281,"y":0.203799,"z":0.886571},{"x":-0.967088,"y":-0.076649,"z":-0.242623},{"x":-0.068535,"y":-0.278745,"z":0.957917},{"x":-0.330599,"y":-0.891424,"z":0.309949},{"x":-0.268964,"y":-0.769958,"z":0.578639},{"x":-0.220097,"y":-0.189947,"z":0.956806},{"x":-0.385628,"y":-0.540323,"z":0.747892},{"x":-0.043628,"y":-0.04356,"z":0.998098},{"x":0.162193,"y":-0.033248,"z":0.986199},{"x":-0.165382,"y":0.761456,"z":0.626765},{"x":-0.339954,"y":0.439203,"z":0.831584},{"x":-0.165158,"y":0.243448,"z":0.955749},{"x":-0.101108,"y":-0.03277,"z":0.994336},{"x":0.114956,"y":0.226628,"z":0.967174},{"x":0.007982,"y":-0.117864,"z":0.992998},{"x":-0.169611,"y":-0.172031,"z":0.97038},{"x":-0.551138,"y":0.057324,"z":0.832443},{"x":0.032972,"y":-0.063827,"z":0.997416},{"x":-0.518974,"y":-0.137474,"z":-0.843663},{"x":-0.23785,"y":-0.968058,"z":0.079319},{"x":-0.027807,"y":0.388174,"z":0.921167},{"x":0.71886,"y":0.018803,"z":0.6949},{"x":-0.307911,"y":0.216433,"z":0.92647},{"x":-0.738708,"y":-0.481594,"z":-0.47157},{"x":-0.568415,"y":0.01455,"z":0.822613},{"x":-0.853317,"y":0.021934,"z":-0.520931},{"x":-0.59308,"y":0.750641,"z":-0.291195},{"x":-0.837084,"y":-0.054535,"z":0.544349},{"x":-0.886793,"y":-0.207048,"z":-0.413194},{"x":0.231025,"y":-0.070759,"z":0.970371},{"x":-0.11909,"y":-0.365333,"z":-0.923228},{"x":-0.740399,"y":-0.333841,"z":-0.583403},{"x":-0.869419,"y":-0.229694,"z":-0.437438},{"x":-0.67433,"y":-0.292872,"z":-0.677868},{"x":-0.145143,"y":-0.345781,"z":-0.927022},{"x":-0.46697,"y":0.756764,"z":-0.457435},{"x":-0.698377,"y":-0.153837,"z":-0.699002},{"x":-0.862516,"y":-0.348219,"z":-0.367165},{"x":-0.730315,"y":-0.366244,"z":-0.576633},{"x":-0.566987,"y":0.74663,"z":-0.34795},{"x":-0.721172,"y":-0.584949,"z":0.371142},{"x":-0.766218,"y":-0.639555,"z":0.06228},{"x":-0.996067,"y":0.085459,"z":-0.023378},{"x":-0.917728,"y":-0.317228,"z":0.239043},{"x":-0.24587,"y":-0.692817,"z":0.677903},{"x":-0.936176,"y":0.294674,"z":-0.191681},{"x":-0.4999,"y":-0.741987,"z":-0.446716},{"x":-0.927563,"y":-0.071353,"z":0.36679},{"x":-0.962292,"y":-0.168707,"z":0.213382},{"x":0.494531,"y":-0.192382,"z":0.847601},{"x":-0.650243,"y":-0.677212,"z":-0.344338},{"x":0.08254,"y":-0.987418,"z":-0.134885},{"x":0.582106,"y":0.20829,"z":0.785982},{"x":0.4249,"y":0.467852,"z":0.774967},{"x":0.651922,"y":0.082503,"z":0.753785},{"x":-0.15485,"y":-0.369871,"z":-0.916088},{"x":0.030525,"y":-0.289755,"z":-0.956614},{"x":-0.282855,"y":-0.289397,"z":-0.914463},{"x":-0.647577,"y":0.323679,"z":-0.689838},{"x":-0.768051,"y":0.415927,"z":0.486931},{"x":-0.548634,"y":0.771177,"z":0.322935},{"x":-0.829716,"y":0.552779,"z":-0.0775},{"x":0.709124,"y":0.066945,"z":-0.701899},{"x":-0.435249,"y":0.354551,"z":0.827558},{"x":-0.248407,"y":0.66651,"z":0.702893},{"x":-0.658518,"y":0.230467,"z":0.716407},{"x":-0.010131,"y":0.008267,"z":0.999915},{"x":-0.746206,"y":-0.205905,"z":0.633072},{"x":0.372335,"y":-0.145246,"z":0.916663},{"x":0.522755,"y":-0.852308,"z":0.017275},{"x":0.107607,"y":-0.930207,"z":0.350907},{"x":-0.09263,"y":-0.825132,"z":0.557294},{"x":-0.00591,"y":-0.998033,"z":0.062409},{"x":-0.330467,"y":-0.903304,"z":0.273557},{"x":-0.320316,"y":-0.934448,"z":-0.155576},{"x":0.186118,"y":-0.967608,"z":-0.170574},{"x":-0.503973,"y":-0.852581,"z":-0.138262}],"faces":[0,1,2,0,1,2,3,4,5,3,4,5,6,7,8,6,7,8,9,10,11,9,10,11,12,13,14,12,13,14,15,16,17,15,16,17,18,19,20,18,19,20,21,22,23,21,22,23,24,25,26,24,25,26,27,28,29,27,28,29,30,31,32,30,31,32,33,34,35,33,34,35,36,37,38,36,37,38,39,40,41,39,40,41,42,43,44,42,43,44,45,46,13,45,46,13,47,48,49,47,48,49,50,51,52,50,51,52,53,54,55,53,54,55,6,56,57,6,56,57,58,59,60,58,59,60,61,62,63,61,62,63,64,65,66,64,65,66,67,68,69,67,68,69,70,71,72,70,71,72,73,74,75,73,74,75,76,77,78,76,77,78,79,46,80,79,46,80,81,82,83,81,82,83,82,80,84,82,80,84,85,86,87,85,86,87,88,89,90,88,89,90,88,91,92,88,91,92,93,72,71,93,72,71,94,95,96,94,95,96,97,4,3,97,4,3,98,99,100,98,99,100,101,102,103,101,102,103,104,105,106,104,105,106,107,108,109,107,108,109,110,111,112,110,111,112,113,114,115,113,114,115,116,117,118,116,117,118,119,120,121,119,120,121,51,43,122,51,43,122,62,123,124,62,123,124,125,126,127,125,126,127,128,129,29,128,129,29,130,131,132,130,131,132,133,134,135,133,134,135,136,137,138,136,137,138,139,140,141,139,140,141,142,143,144,142,143,144,145,146,30,145,146,30,147,148,149,147,148,149,150,151,152,150,151,152,146,31,30,146,31,30,153,154,31,153,154,31,155,146,145,155,146,145,153,31,146,153,31,146,15,112,156,15,112,156,157,158,159,157,158,159,160,161,162,160,161,162,21,163,164,21,163,164,165,166,167,165,166,167,71,168,169,71,168,169,113,170,114,113,170,114,118,92,171,118,92,171,172,2,173,172,2,173,174,142,175,174,142,175,176,38,37,176,38,37,177,76,78,177,76,78,178,45,33,178,45,33,179,180,181,179,180,181,182,183,184,182,183,184,185,181,186,185,181,186,187,188,92,187,188,92,101,189,102,101,189,102,190,191,192,190,191,192,193,121,194,193,121,194,195,196,197,195,196,197,198,56,6,198,56,6,199,200,201,199,200,201,202,203,204,202,203,204,205,206,78,205,206,78,207,208,209,207,208,209,210,62,61,210,62,61,211,212,213,211,212,213,214,215,216,214,215,216,217,218,216,217,218,216,217,219,218,217,219,218,112,220,110,112,220,110,115,94,221,115,94,221,39,41,36,39,41,36,222,49,223,222,49,223,224,225,226,224,225,226,5,4,227,5,4,227,3,5,228,3,5,228,229,230,231,229,230,231,194,117,116,194,117,116,216,169,217,216,169,217,232,71,169,232,71,169,233,234,235,233,234,235,236,237,234,236,237,234,238,239,240,238,239,240,241,242,243,241,242,243,244,185,245,244,185,245,246,247,248,246,247,248,249,250,37,249,250,37,72,251,250,72,251,250,53,252,54,53,252,54,209,253,254,209,253,254,255,256,252,255,256,252,257,202,204,257,202,204,64,258,259,64,258,259,191,106,105,191,106,105,191,260,106,191,260,106,190,101,103,190,101,103,190,192,101,190,192,101,182,261,262,182,261,262,112,15,17,112,15,17,263,264,265,263,264,265,266,267,268,266,267,268,269,68,270,269,68,270,271,272,141,271,272,141,153,146,155,153,146,155,273,274,275,273,274,275,45,34,33,45,34,33,13,12,34,13,12,34,276,277,278,276,277,278,279,68,67,279,68,67,280,98,100,280,98,100,281,230,229,281,230,229,262,144,282,262,144,282,283,284,285,283,284,285,286,287,14,286,287,14,288,161,289,288,161,289,290,60,59,290,60,59,291,292,16,291,292,16,293,294,295,293,294,295,296,212,211,296,212,211,110,297,298,110,297,298,299,300,301,299,300,301,171,116,118,171,116,118,195,302,193,195,302,193,303,304,133,303,304,133,52,51,122,52,51,122,305,306,307,305,306,307,305,308,306,305,308,306,309,76,310,309,76,310,309,311,76,309,311,76,312,91,313,312,91,313,195,193,314,195,193,314,53,255,252,53,255,252,315,316,255,315,316,255,316,157,159,316,157,159,268,317,318,268,317,318,290,319,320,290,319,320,321,322,323,321,322,323,324,325,124,324,325,124,326,327,328,326,327,328,318,266,268,318,266,268,329,300,299,329,300,299,330,201,331,330,201,331,332,230,281,332,230,281,26,137,333,26,137,333,334,222,335,334,222,335,336,337,47,336,337,47,215,214,251,215,214,251,160,162,212,160,162,212,275,338,273,275,338,273,275,230,333,275,230,333,16,129,128,16,129,128,166,165,339,166,165,339,245,340,341,245,340,341,340,342,343,340,342,343,344,345,346,344,345,346,347,179,181,347,179,181,181,348,347,181,348,347,349,350,179,349,350,179,351,352,350,351,352,350,104,205,77,104,205,77,105,104,77,105,104,77,353,354,75,353,354,75,355,356,357,355,356,357,357,39,36,357,39,36,358,36,38,358,36,38,358,359,36,358,359,36,360,361,324,360,361,324,362,343,363,362,343,363,81,364,365,81,364,365,51,82,81,51,82,81,223,366,367,223,366,367,368,284,283,368,284,283,307,369,370,307,369,370,105,192,191,105,192,191,371,346,345,371,346,345,252,124,54,252,124,54,254,253,63,254,253,63,372,88,188,372,88,188,279,67,373,279,67,373,97,281,334,97,281,334,281,229,280,281,229,280,374,150,375,374,150,375,353,169,168,353,169,168,164,140,376,164,140,376,164,141,140,164,141,140,249,41,40,249,41,40,37,36,41,37,36,41,377,284,368,377,284,368,378,114,170,378,114,170,298,297,117,298,297,117,379,327,380,379,327,380,381,382,374,381,382,374,240,239,64,240,239,64,204,383,384,204,383,384,385,386,387,385,386,387,388,389,390,388,389,390,3,391,97,3,391,97,3,228,392,3,228,392,80,82,50,80,82,50,274,52,122,274,52,122,98,231,274,98,231,274,288,319,161,288,319,161,390,393,394,390,393,394,72,250,249,72,250,249,182,395,396,182,395,396,397,398,399,397,398,399,400,401,354,400,401,354,277,67,69,277,67,69,277,276,67,277,276,67,238,240,147,238,240,147,260,402,106,260,402,106,403,260,191,403,260,191,103,153,155,103,153,155,83,364,81,83,364,81,219,217,364,219,217,364,45,13,34,45,13,34,217,365,364,217,365,364,217,75,365,217,75,365,404,183,182,404,183,182,405,406,407,405,406,407,160,208,207,160,208,207,374,408,150,374,408,150,259,409,408,259,409,408,342,245,410,342,245,410,245,185,410,245,185,410,411,95,412,411,95,412,157,316,320,157,316,320,396,261,182,396,261,182,332,281,97,332,281,97,360,363,361,360,363,361,413,292,291,413,292,291,414,415,416,414,415,416,375,150,152,375,150,152,230,332,333,230,332,333,38,176,417,38,176,417,105,77,311,105,77,311,144,398,397,144,398,397,144,397,142,144,397,142,297,118,117,297,118,117,187,92,118,187,92,118,77,76,311,77,76,311,256,209,254,256,209,254,158,289,209,158,289,209,418,109,419,418,109,419,414,375,152,414,375,152,352,183,180,352,183,180,352,184,183,352,184,183,420,421,324,420,421,324,404,180,183,404,180,183,404,186,180,404,186,180,55,54,422,55,54,422,93,215,251,93,215,251,93,423,215,93,423,215,423,93,71,423,93,71,14,32,12,14,32,12,214,216,218,214,216,218,33,310,178,33,310,178,33,35,310,33,35,310,154,34,31,154,34,31,53,315,255,53,315,255,53,55,315,53,55,315,216,232,169,216,232,169,112,424,220,112,424,220,112,17,425,112,17,425,426,269,427,426,269,427,277,69,426,277,69,426,28,295,29,28,295,29,255,159,256,255,159,256,255,316,159,255,316,159,417,87,86,417,87,86,83,219,364,83,219,364,85,87,219,85,87,219,337,428,429,337,428,429,430,284,428,430,284,428,16,431,291,16,431,291,42,122,43,42,122,43,432,274,122,432,274,122,212,208,160,212,208,160,212,296,208,212,296,208,253,61,63,253,61,63,208,296,61,208,296,61,181,180,186,181,180,186,433,323,434,433,323,434,435,436,437,435,436,437,438,359,358,438,359,358,276,439,67,276,439,67,365,74,81,365,74,81,365,75,74,365,75,74,440,441,442,440,441,442,79,338,443,79,338,443,46,14,13,46,14,13,46,286,14,46,286,14,80,338,79,80,338,79,80,50,338,80,50,338,444,445,57,444,445,57,446,447,445,446,447,445,201,448,449,201,448,449,450,451,437,450,451,437,450,167,451,450,167,451,42,432,122,42,432,122,231,275,274,231,275,274,231,230,275,231,230,275,391,3,392,391,3,392,85,83,82,85,83,82,452,438,453,452,438,453,438,452,385,438,452,385,286,454,287,286,454,287,286,455,454,286,455,454,141,163,271,141,163,271,141,164,163,141,164,163,335,223,367,335,223,367,335,222,223,335,222,223,363,360,322,363,360,322,58,162,59,58,162,59,456,212,162,456,212,162,160,289,161,160,289,161,160,207,289,160,207,289,423,216,215,423,216,215,423,232,216,423,232,216,103,155,190,103,155,190,76,178,310,76,178,310,207,209,289,207,209,289,284,113,285,284,113,285,161,59,162,161,59,162,161,319,59,161,319,59,457,262,458,457,262,458,457,235,262,457,235,262,459,460,461,459,460,461,116,193,194,116,193,194,116,314,193,116,314,193,71,232,423,71,232,423,103,462,153,103,462,153,103,102,462,103,102,462,463,464,465,463,464,465,466,467,464,466,467,464,467,468,469,467,468,469,250,176,37,250,176,37,110,299,301,110,299,301,110,220,470,110,220,470,129,471,29,129,471,29,472,49,48,472,49,48,472,227,49,472,227,49,473,474,475,473,474,475,186,404,185,186,404,185,124,63,62,124,63,62,124,252,63,124,252,63,324,124,123,324,124,123,98,229,231,98,229,231,98,280,229,98,280,229,274,432,476,274,432,476,477,86,453,477,86,453,83,85,219,83,85,219,374,382,259,374,382,259,355,73,401,355,73,401,355,74,73,355,74,73,302,197,119,302,197,119,302,195,197,302,195,197,478,220,424,478,220,424,479,470,220,479,470,220,478,480,220,478,480,220,478,481,480,478,481,480,481,478,482,481,478,482,483,484,479,483,484,479,73,354,401,73,354,401,73,75,354,73,75,354,354,485,486,354,485,486,354,353,485,354,353,485,280,334,281,280,334,281,154,35,34,154,35,34,26,333,332,26,333,332,301,297,110,301,297,110,187,118,297,187,118,297,214,87,417,214,87,417,173,487,488,173,487,488,489,257,490,489,257,490,182,491,492,182,491,492,182,184,491,182,184,491,493,349,494,493,349,494,351,350,349,351,350,349,416,495,496,416,495,496,158,256,159,158,256,159,158,209,256,158,209,256,252,254,63,252,254,63,252,256,254,252,256,254,497,498,499,497,498,499,500,501,502,500,501,502,503,388,390,503,388,390,503,163,388,503,163,388,504,21,23,504,21,23,389,388,163,389,388,163,505,427,269,505,427,269,446,445,444,446,445,444,143,270,68,143,270,68,506,507,270,506,507,270,508,509,173,508,509,173,510,399,398,510,399,398,474,510,475,474,510,475,474,399,510,474,399,510,511,504,0,511,504,0,512,474,473,512,474,473,512,399,474,512,399,474,208,253,209,208,253,209,208,61,253,208,61,253,441,79,443,441,79,443,37,41,249,37,41,249,513,267,266,513,267,266,51,74,355,51,74,355,51,81,74,51,81,74,514,206,205,514,206,205,402,455,106,402,455,106,402,515,455,402,515,455,52,274,273,52,274,273,194,461,117,194,461,117,194,459,461,194,459,461,516,266,318,516,266,318,517,179,347,517,179,347,494,349,179,494,349,179,180,350,352,180,350,352,180,179,350,180,179,350,518,1,0,518,1,0,38,477,358,38,477,358,38,417,477,38,417,477,417,86,477,417,86,477,341,519,245,341,519,245,503,271,163,503,271,163,370,520,521,370,520,521,221,96,285,221,96,285,221,94,96,221,94,96,273,50,52,273,50,52,273,338,50,273,338,50,522,433,434,522,433,434,261,398,144,261,398,144,153,35,154,153,35,154,153,462,35,153,462,35,310,462,102,310,462,102,310,35,462,310,35,462,102,309,310,102,309,310,309,102,311,309,102,311,338,333,443,338,333,443,338,275,333,338,275,333,166,523,524,166,523,524,166,339,523,166,339,523,525,526,10,525,526,10,378,170,430,378,170,430,294,527,431,294,527,431,401,356,355,401,356,355,401,400,356,401,400,356,334,336,222,334,336,222,334,100,336,334,100,336,222,47,49,222,47,49,222,336,47,222,336,47,337,528,428,337,528,428,336,100,529,336,100,529,530,48,47,530,48,47,531,472,48,531,472,48,64,382,240,64,382,240,64,259,382,64,259,382,173,532,490,173,532,490,173,2,532,173,2,532,511,0,533,511,0,533,66,258,64,66,258,64,66,534,258,66,534,258,535,509,508,535,509,508,111,156,112,111,156,112,15,156,536,15,156,536,31,12,32,31,12,32,31,34,12,31,34,12,185,404,126,185,404,126,374,259,408,374,259,408,316,537,320,316,537,320,316,315,537,316,315,537,538,460,539,538,460,539,460,459,120,460,459,120,440,79,441,440,79,441,440,46,79,440,46,79,218,87,214,218,87,214,218,219,87,218,219,87,25,137,26,25,137,26,136,442,137,136,442,137,466,464,463,466,464,463,540,200,56,540,200,56,313,88,90,313,88,90,313,91,88,313,91,88,214,176,251,214,176,251,214,417,176,214,417,176,158,288,289,158,288,289,157,319,288,157,319,288,479,299,470,479,299,470,199,56,200,199,56,200,199,541,56,199,541,56,384,257,204,384,257,204,384,490,257,384,490,257,21,504,163,21,504,163,21,542,22,21,542,22,158,157,288,158,157,288,84,45,178,84,45,178,72,93,251,72,93,251,357,44,355,357,44,355,357,359,44,357,359,44,82,51,50,82,51,50,355,43,51,355,43,51,355,44,43,355,44,43,169,75,217,169,75,217,169,353,75,169,353,75,387,198,6,387,198,6,8,7,543,8,7,543,544,325,324,544,325,324,536,16,15,536,16,15,536,129,16,536,129,16,545,28,546,545,28,546,547,548,549,547,548,549,11,550,551,11,550,551,224,552,131,224,552,131,111,298,156,111,298,156,111,110,298,111,110,298,459,121,120,459,121,120,459,194,121,459,194,121,106,205,104,106,205,104,106,455,205,106,455,205,137,441,443,137,441,443,137,442,441,137,442,441,157,320,319,157,320,319,439,422,67,439,422,67,274,476,98,274,476,98,424,112,425,424,112,425,128,431,16,128,431,16,187,297,301,187,297,301,299,110,470,299,110,470,553,54,325,553,54,325,553,422,54,553,422,54,554,339,165,554,339,165,490,487,173,490,487,173,189,311,102,189,311,102,189,105,311,189,105,311,435,555,556,435,555,556,435,557,555,435,557,555,267,413,268,267,413,268,425,292,413,425,292,413,503,390,552,503,390,552,78,77,205,78,77,205,465,558,463,465,558,463,559,46,440,559,46,440,430,528,560,430,528,560,430,428,528,430,428,528,514,559,561,514,559,561,562,228,5,562,228,5,562,469,228,562,469,228,7,445,543,7,445,543,563,452,453,563,452,453,564,565,566,564,565,566,433,522,565,433,522,565,426,68,269,426,68,269,301,331,187,301,331,187,331,188,187,331,188,187,312,567,304,312,567,304,313,90,568,313,90,568,569,195,314,569,195,314,134,304,567,134,304,567,407,140,570,407,140,570,407,376,140,407,376,140,272,139,141,272,139,141,570,140,139,570,140,139,360,123,322,360,123,322,360,324,123,360,324,123,359,438,94,359,438,94,571,484,572,571,484,572,330,300,329,330,300,329,399,142,397,399,142,397,399,175,142,399,175,142,455,514,205,455,514,205,455,286,514,455,286,514,267,425,413,267,425,413,17,292,425,17,292,425,17,16,292,17,16,292,363,343,342,363,343,342,573,408,574,573,408,574,573,150,408,573,150,408,549,548,495,549,548,495,505,269,270,505,269,270,333,137,443,333,137,443,450,437,436,450,437,436,371,524,523,371,524,523,371,345,524,371,345,524,575,197,196,575,197,196,576,344,577,576,344,577,576,345,344,576,345,344,576,578,345,576,578,345,91,171,92,91,171,92,314,116,171,314,116,171,92,188,88,92,188,88,325,54,124,325,54,124,434,123,62,434,123,62,433,565,564,433,565,564,389,163,579,389,163,579,580,581,582,580,581,582,511,583,504,511,583,504,579,163,504,579,163,504,284,430,170,284,430,170,94,385,95,94,385,95,94,438,385,94,438,385,319,290,59,319,290,59,156,117,461,156,117,461,156,298,117,156,298,117,422,327,379,422,327,379,481,108,584,481,108,584,196,585,586,196,585,586,303,497,585,303,497,585,489,532,1,489,532,1,489,490,532,489,490,532,143,506,270,143,506,270,587,506,143,587,506,143,405,202,257,405,202,257,518,22,542,518,22,542,334,335,367,334,335,367,334,280,100,334,280,100,261,144,262,261,144,262,428,377,429,428,377,429,428,284,377,428,284,377,588,239,238,588,239,238,385,412,95,385,412,95,461,536,156,461,536,156,461,460,536,461,460,536,283,285,96,283,285,96,329,484,571,329,484,571,587,143,174,587,143,174,589,590,591,589,590,591,526,550,11,526,550,11,9,548,547,9,548,547,592,9,547,592,9,547,320,537,593,320,537,593,594,525,10,594,525,10,391,392,26,391,392,26,392,24,26,392,24,26,392,228,469,392,228,469,223,227,366,223,227,366,223,49,227,223,49,227,515,454,455,515,454,455,321,363,322,321,363,322,363,321,362,363,321,362,342,340,245,342,340,245,396,398,261,396,398,261,396,510,398,396,510,398,595,596,580,595,596,580,267,424,425,267,424,425,267,482,424,267,482,424,597,152,151,597,152,151,597,415,152,597,415,152,315,598,537,315,598,537,557,435,264,557,435,264,282,144,143,282,144,143,168,485,353,168,485,353,168,599,485,168,599,485,600,588,238,600,588,238,147,502,238,147,502,238,538,536,460,538,536,460,601,55,422,601,55,422,27,546,28,27,546,28,27,602,546,27,602,546,546,370,369,546,370,369,546,603,370,546,603,370,565,294,293,565,294,293,293,604,566,293,604,566,446,605,487,446,605,487,606,607,458,606,607,458,608,609,233,608,609,233,244,245,519,244,245,519,133,135,498,133,135,498,589,413,610,589,413,610,337,336,528,337,336,528,67,379,373,67,379,373,379,380,611,379,380,611,539,29,471,539,29,471,575,612,613,575,612,613,613,614,120,613,614,120,540,89,88,540,89,88,198,540,56,198,540,56,198,89,540,198,89,540,192,189,101,192,189,101,192,105,189,192,105,189,486,400,354,486,400,354,615,400,486,615,400,486,351,184,352,351,184,352,570,139,616,570,139,616,240,382,381,240,382,381,617,427,600,617,427,600,550,526,618,550,526,618,516,549,419,516,549,419,394,552,390,394,552,390,619,561,568,619,561,568,619,620,621,619,620,621,306,604,545,306,604,545,306,556,604,306,556,604,307,370,521,307,370,521,479,220,480,479,220,480,91,314,171,91,314,171,91,569,314,91,569,314,175,399,512,175,399,512,393,622,394,393,622,394,516,513,266,516,513,266,516,419,513,516,419,513,623,411,203,623,411,203,357,36,359,357,36,359,11,548,9,11,548,9,11,551,548,11,551,548,418,416,415,418,416,415,71,599,168,71,599,168,556,306,308,556,306,308,129,536,538,129,536,538,538,471,129,538,471,129,538,539,471,538,539,471,547,317,624,547,317,624,128,294,431,128,294,431,128,295,294,128,295,294,240,148,147,240,148,147,148,240,381,148,240,381,597,418,415,597,418,415,573,151,150,573,151,150,625,573,574,625,573,574,572,484,483,572,484,483,584,479,480,584,479,480,584,483,479,584,483,479,484,299,479,484,299,479,302,121,193,302,121,193,302,119,121,302,119,121,482,108,481,482,108,481,482,513,108,482,513,108,436,308,305,436,308,305,524,345,578,524,345,578,578,451,167,578,451,167,520,450,436,520,450,436,626,515,627,626,515,627,402,627,515,402,627,515,402,260,627,402,260,627,620,206,621,620,206,621,620,563,206,620,563,206,206,514,621,206,514,621,559,628,561,559,628,561,561,621,514,561,621,514,561,619,621,561,619,621,155,145,190,155,145,190,387,6,8,387,6,8,629,432,42,629,432,42,560,378,430,560,378,430,99,98,476,99,98,476,24,392,469,24,392,469,630,5,472,630,5,472,630,562,5,630,562,5,304,303,569,304,303,569,26,332,391,26,332,391,317,549,318,317,549,318,182,262,404,182,262,404,604,293,295,604,293,295,631,433,564,631,433,564,555,632,556,555,632,556,632,633,634,632,633,634,635,633,362,635,633,362,635,634,633,635,634,633,526,11,10,526,11,10,434,322,123,434,322,123,434,323,322,434,323,322,125,342,410,125,342,410,497,133,498,497,133,498,60,290,636,60,290,636,132,552,394,132,552,394,132,131,552,132,131,552,542,164,376,542,164,376,403,191,190,403,191,190,422,553,327,422,553,327,533,0,2,533,0,2,132,622,637,132,622,637,557,18,20,557,18,20,482,478,424,482,478,424,638,639,564,638,639,564,174,143,142,174,143,142,303,585,196,303,585,196,303,195,569,303,195,569,303,196,195,303,196,195,29,295,128,29,295,128,312,569,91,312,569,91,583,579,504,583,579,504,583,640,579,583,640,579,396,475,510,396,475,510,313,567,312,313,567,312,200,372,188,200,372,188,359,115,44,359,115,44,359,94,115,359,94,115,419,416,418,419,416,418,641,276,278,641,276,278,641,439,276,641,439,276,501,618,642,501,618,642,381,414,643,381,414,643,381,375,414,381,375,414,148,643,496,148,643,496,148,381,643,148,381,643,509,172,173,509,172,173,221,113,115,221,113,115,221,285,113,221,285,113,251,176,250,251,176,250,644,356,400,644,356,400,374,375,381,374,375,381,568,567,313,568,567,313,645,134,567,645,134,567,603,554,165,603,554,165,646,645,647,646,645,647,376,407,406,376,407,406,575,119,197,575,119,197,575,613,119,575,613,119,379,67,422,379,67,422,571,330,329,571,330,329,420,324,361,420,324,361,539,27,29,539,27,29,177,178,76,177,178,76,648,84,178,648,84,178,436,521,520,436,521,520,436,305,521,436,305,521,305,307,521,305,307,521,447,487,384,447,487,384,238,502,501,238,502,501,200,331,201,200,331,201,200,188,331,200,188,331,23,0,504,23,0,504,513,419,108,513,419,108,482,267,513,482,267,513,326,421,649,326,421,649,165,370,603,165,370,603,265,264,576,265,264,576,68,426,69,68,426,69,606,650,651,606,650,651,282,458,262,282,458,262,490,384,487,490,384,487,466,468,467,466,468,467,138,466,463,138,466,463,24,468,466,24,468,466,113,284,170,113,284,170,652,406,1,652,406,1,652,376,406,652,376,406,542,376,652,542,376,652,422,439,653,422,439,653,405,1,406,405,1,406,405,257,1,405,257,1,654,244,519,654,244,519,606,237,236,606,237,236,167,450,520,167,450,520,541,201,449,541,201,449,544,553,325,544,553,325,426,427,617,426,427,617,367,97,334,367,97,334,404,262,235,404,262,235,126,234,237,126,234,237,126,235,234,126,235,234,556,308,435,556,308,435,57,541,444,57,541,444,57,56,541,57,56,541,97,391,332,97,391,332,213,212,456,213,212,456,609,234,233,609,234,233,655,132,637,655,132,637,416,549,495,416,549,495,629,42,44,629,42,44,421,420,656,421,420,656,608,236,609,608,236,609,127,656,420,127,656,420,541,449,657,541,449,657,435,308,436,435,308,436,511,582,583,511,582,583,511,533,582,511,533,582,658,649,656,658,649,656,488,487,605,488,487,605,149,500,502,149,500,502,409,259,258,409,259,258,659,605,446,659,605,446,659,446,444,659,446,444,657,444,541,657,444,541,657,660,444,657,660,444,282,606,458,282,606,458,282,650,606,282,650,606,68,282,143,68,282,143,612,661,614,612,661,614,612,575,661,612,575,661,235,126,404,235,126,404,415,414,152,415,414,152,383,447,384,383,447,384,299,484,329,299,484,329,300,330,331,300,330,331,603,546,602,603,546,602,560,662,378,560,662,378,518,23,22,518,23,22,68,663,282,68,663,282,68,279,663,68,279,663,185,125,410,185,125,410,185,126,125,185,126,125,664,551,550,664,551,550,551,664,495,551,664,495,551,495,548,551,495,548,638,566,604,638,566,604,545,604,28,545,604,28,604,295,28,604,295,28,318,549,516,318,549,516,317,547,549,317,547,549,268,591,317,268,591,317,589,268,413,589,268,413,589,591,268,589,591,268,644,39,357,644,39,357,641,278,618,641,278,618,199,201,541,199,201,541,236,607,606,236,607,606,520,165,167,520,165,167,520,370,165,520,370,165,371,248,247,371,248,247,371,523,248,371,523,248,452,386,385,452,386,385,383,8,543,383,8,543,412,387,8,412,387,8,386,452,563,386,452,563,502,147,149,502,147,149,448,330,665,448,330,665,120,539,460,120,539,460,659,488,605,659,488,605,508,173,488,508,173,488,133,304,134,133,304,134,534,409,258,534,409,258,574,408,409,574,408,409,206,177,78,206,177,78,652,518,542,652,518,542,652,1,518,652,1,518,57,7,6,57,7,6,624,592,547,624,592,547,501,500,618,501,500,618,463,440,442,463,440,442,453,358,477,453,358,477,453,438,358,453,438,358,666,572,483,666,572,483,270,507,505,270,507,505,643,416,496,643,416,496,120,119,613,120,119,613,539,602,27,539,602,27,539,667,602,539,667,602,648,178,177,648,178,177,84,648,82,84,648,82,85,82,648,85,82,648,453,86,85,453,86,85,85,648,453,85,648,453,556,634,639,556,634,639,419,109,108,419,109,108,145,403,190,145,403,190,421,544,324,421,544,324,498,130,499,498,130,499,498,131,130,498,131,130,566,565,293,566,565,293,201,330,448,201,330,448,625,448,668,625,448,668,625,449,448,625,449,448,634,556,632,634,556,632,556,639,638,556,639,638,421,656,649,421,656,649,315,601,598,315,601,598,315,55,601,315,55,601,669,9,592,669,9,592,669,592,670,669,592,670,664,149,495,664,149,495,518,0,23,518,0,23,263,557,264,263,557,264,557,633,555,557,633,555,557,20,633,557,20,633,555,633,632,555,633,632,578,437,451,578,437,451,639,631,564,639,631,564,233,235,457,233,235,457,671,457,458,671,457,458,378,662,629,378,662,629,623,368,283,623,368,283,623,377,368,623,377,368,643,414,416,643,414,416,411,96,95,411,96,95,203,405,407,203,405,407,203,202,405,203,202,405,204,411,412,204,411,412,204,203,411,204,203,411,672,659,660,672,659,660,672,488,659,672,488,659,659,444,660,659,444,660,2,1,532,2,1,532,437,264,435,437,264,435,673,238,501,673,238,501,89,198,619,89,198,619,529,476,662,529,476,662,662,432,629,662,432,629,662,476,432,662,476,432,366,4,97,366,4,97,366,227,4,366,227,4,558,628,559,558,628,559,673,600,238,673,600,238,636,320,593,636,320,593,636,290,320,636,290,320,623,407,570,623,407,570,533,2,172,533,2,172,545,307,306,545,307,306,545,369,307,545,369,307,545,546,369,545,546,369,416,419,549,416,419,549,445,7,57,445,7,57,655,130,132,655,130,132,224,503,552,224,503,552,622,132,394,622,132,394,584,480,481,584,480,481,108,107,584,108,107,584,10,9,669,10,9,669,164,542,21,164,542,21,291,431,527,291,431,527,674,565,675,674,565,675,456,58,590,456,58,590,456,162,58,456,162,58,294,674,527,294,674,527,294,565,674,294,565,674,456,590,610,456,590,610,676,249,40,676,249,40,497,303,133,497,303,133,637,393,677,637,393,677,583,582,581,583,582,581,678,581,580,678,581,580,389,579,640,389,579,640,679,389,640,679,389,640,680,677,681,680,677,681,586,523,661,586,523,661,586,248,523,586,248,523,585,499,682,585,499,682,683,655,637,683,655,637,412,383,204,412,383,204,412,8,383,412,8,383,642,673,501,642,673,501,148,495,149,148,495,149,440,558,559,440,558,559,440,463,558,440,463,558,224,226,503,224,226,503,224,131,225,224,131,225,372,200,540,372,200,540,19,265,576,19,265,576,19,18,265,19,18,265,684,519,341,684,519,341,685,185,244,685,185,244,181,685,348,181,685,348,517,347,686,517,347,686,494,179,517,494,179,517,497,499,585,497,499,585,677,680,687,677,680,687,343,341,340,343,341,340,688,684,341,688,684,341,682,586,585,682,586,585,680,689,690,680,689,690,688,341,343,688,341,343,685,181,185,685,181,185,684,654,519,684,654,519,244,654,685,244,654,685,686,689,691,686,689,691,246,586,682,246,586,682,246,690,247,246,690,247,499,692,682,499,692,682,663,650,282,663,650,282,571,665,330,571,665,330,571,572,665,571,572,665,387,412,385,387,412,385,239,65,64,239,65,64,136,463,442,136,463,442,664,500,149,664,500,149,657,574,409,657,574,409,625,657,449,625,657,449,657,534,693,657,534,693,657,409,534,657,409,534,683,677,687,683,677,687,637,677,683,637,677,683,499,655,683,499,655,683,499,130,655,499,130,655,328,327,694,328,327,694,326,380,327,326,380,327,439,526,525,439,526,525,439,641,526,439,641,526,641,618,526,641,618,526,645,567,568,645,567,568,498,695,131,498,695,131,628,465,645,628,465,645,628,558,465,628,558,465,498,135,695,498,135,695,646,647,696,646,647,696,646,135,134,646,135,134,372,540,88,372,540,88,597,109,418,597,109,418,151,573,625,151,573,625,151,109,597,151,109,597,668,665,666,668,665,666,668,448,665,668,448,665,665,572,666,665,572,666,247,346,371,247,346,371,586,697,196,586,697,196,246,248,586,246,248,586,563,453,177,563,453,177,395,182,492,395,182,492,524,167,166,524,167,166,642,278,617,642,278,617,300,331,301,300,331,301,127,361,125,127,361,125,80,45,84,80,45,84,80,46,45,80,46,45,429,47,337,429,47,337,429,530,47,429,530,47,286,559,514,286,559,514,286,46,559,286,46,559,489,1,257,489,1,257,599,71,70,599,71,70,698,486,485,698,486,485,698,615,486,698,615,486,599,698,485,599,698,485,697,586,661,697,586,661,575,196,661,575,196,661,697,661,196,697,661,196,661,339,554,661,339,554,661,523,339,661,523,339,528,529,560,528,529,560,528,336,529,528,336,529,629,114,378,629,114,378,629,44,114,629,44,114,114,44,115,114,44,115,653,439,525,653,439,525,594,10,669,594,10,669,667,614,603,667,614,603,380,326,649,380,326,649,653,525,594,653,525,594,653,601,422,653,601,422,619,90,89,619,90,89,619,568,90,619,568,90,386,563,620,386,563,620,25,138,137,25,138,137,136,138,463,136,138,463,138,24,466,138,24,466,271,226,272,271,226,272,271,503,226,271,503,226,695,225,131,695,225,131,695,135,630,695,135,630,699,272,226,699,272,226,699,226,225,699,226,225,472,5,227,472,5,227,531,699,472,531,699,472,557,263,18,557,263,18,120,667,539,120,667,539,614,554,603,614,554,603,614,661,554,614,661,554,500,550,618,500,550,618,500,664,550,500,664,550,312,304,569,312,304,569,688,362,19,688,362,19,635,639,634,635,639,634,635,323,631,635,323,631,20,362,633,20,362,633,700,588,600,700,588,600,491,351,701,491,351,701,491,184,351,491,184,351,287,32,14,287,32,14,32,287,30,32,287,30,198,386,619,198,386,619,198,387,386,198,387,386,386,620,619,386,620,619,627,260,403,627,260,403,686,691,517,686,691,517,691,680,702,691,680,702,691,689,680,691,689,680,582,595,580,582,595,580,389,393,390,389,393,390,349,701,351,349,701,351,588,65,239,588,65,239,588,703,65,588,703,65,505,600,427,505,600,427,617,277,426,617,277,426,617,278,277,617,278,277,578,264,437,578,264,437,578,576,264,578,576,264,348,686,347,348,686,347,348,704,686,348,704,686,693,660,657,693,660,657,693,672,660,693,672,660,488,672,705,488,672,705,706,65,707,706,65,707,708,534,66,708,534,66,706,708,66,706,708,66,693,534,708,693,534,708,395,475,396,395,475,396,591,624,317,591,624,317,638,564,566,638,564,566,679,393,389,679,393,389,323,433,631,323,433,631,631,639,635,631,639,635,283,96,411,283,96,411,172,509,535,172,509,535,508,709,535,508,709,535,693,705,672,693,705,672,508,488,705,508,488,705,705,709,508,705,709,508,637,622,393,637,622,393,446,487,447,446,487,447,499,687,692,499,687,692,499,683,687,499,683,687,529,662,560,529,662,560,529,99,476,529,99,476,529,100,99,529,100,99,249,70,72,249,70,72,507,710,505,507,710,505,247,344,346,247,344,346,18,263,265,18,263,265,568,628,645,568,628,645,568,561,628,568,561,628,447,543,445,447,543,445,447,383,543,447,383,543,676,70,249,676,70,249,698,599,70,698,599,70,698,70,676,698,70,676,711,535,241,711,535,241,711,712,713,711,712,713,713,535,711,713,535,711,243,711,241,243,711,241,714,507,506,714,507,506,587,714,506,587,714,506,587,243,242,587,243,242,587,174,243,587,174,243,468,24,469,468,24,469,138,25,24,138,25,24,421,328,694,421,328,694,421,326,328,421,326,328,553,694,327,553,694,327,640,581,678,640,581,678,640,583,581,640,583,581,681,677,393,681,677,393,533,172,582,533,172,582,175,243,174,175,243,174,712,711,243,712,711,243,678,679,640,678,679,640,715,679,678,715,679,678,716,678,596,716,678,596,715,678,716,715,678,716,492,491,701,492,491,701,493,701,349,493,701,349,517,702,717,517,702,717,517,691,702,517,691,702,679,681,393,679,681,393,679,715,681,679,715,681,367,366,97,367,366,97,233,671,608,233,671,608,556,638,604,556,638,604,614,613,612,614,613,612,616,531,718,616,531,718,531,48,530,531,48,530,377,530,429,377,530,429,272,616,139,272,616,139,272,699,616,272,699,616,616,718,570,616,718,570,623,203,407,623,203,407,718,623,570,718,623,570,109,668,666,109,668,666,668,151,625,668,151,625,668,109,151,668,109,151,625,574,657,625,574,657,719,373,379,719,373,379,473,175,512,473,175,512,720,243,175,720,243,175,535,721,172,535,721,172,582,721,595,582,721,595,582,172,721,582,172,721,720,712,243,720,712,243,678,580,596,678,580,596,596,722,723,596,722,723,696,724,646,696,724,646,647,464,467,647,464,467,647,465,464,647,465,464,467,696,647,467,696,647,724,467,469,724,467,469,696,467,724,696,467,724,135,724,630,135,724,630,135,646,724,135,646,724,148,496,495,148,496,495,380,658,725,380,658,725,380,649,658,380,649,658,726,237,651,726,237,651,127,126,237,127,126,237,19,576,577,19,576,577,595,712,722,595,712,722,595,721,712,595,721,712,601,653,594,601,653,594,727,728,729,727,728,729,727,626,728,727,626,728,454,515,626,454,515,626,729,403,145,729,403,145,729,145,30,729,145,30,728,403,729,728,403,729,727,729,30,727,729,30,287,727,30,287,727,30,65,706,66,65,706,66,708,705,693,708,705,693,702,681,715,702,681,715,702,680,681,702,680,681,644,40,39,644,40,39,667,120,614,667,120,614,642,618,278,642,618,278,673,642,617,673,642,617,617,600,673,617,600,673,730,705,708,730,705,708,709,730,731,709,730,731,709,705,730,709,705,730,709,241,535,709,241,535,709,731,241,709,731,241,703,588,700,703,588,700,505,710,600,505,710,600,587,242,714,587,242,714,710,700,600,710,700,600,242,241,731,242,241,731,703,707,65,703,707,65,730,708,706,730,708,706,730,732,731,730,732,731,706,732,730,706,732,730,733,707,700,733,707,700,703,700,707,703,700,707,732,706,707,732,706,707,733,732,707,733,732,707,507,714,710,507,714,710,732,242,731,732,242,731,732,733,242,732,733,242,733,710,714,733,710,714,242,733,714,242,733,714,177,206,563,177,206,563,453,648,177,453,648,177,602,667,603,602,667,603,695,630,225,695,630,225,562,724,469,562,724,469,225,630,699,225,630,699,472,699,630,472,699,630,630,724,562,630,724,562,647,645,465,647,645,465,646,134,645,646,134,645,710,733,700,710,733,700,167,524,578,167,524,578,644,400,615,644,400,615,676,644,615,676,644,615,676,40,644,676,40,644,698,676,615,698,676,615,721,713,712,721,713,712,721,535,713,721,535,713,596,595,722,596,595,722,720,175,473,720,175,473,722,712,720,722,712,720,473,722,720,473,722,720,734,723,722,734,723,722,734,722,473,734,722,473,717,702,715,717,702,715,395,735,475,395,735,475,395,492,735,395,492,735,735,473,475,735,473,475,735,734,473,735,734,473,517,493,494,517,493,494,517,717,493,517,717,493,736,493,717,736,493,717,717,715,716,717,715,716,723,734,736,723,734,736,723,736,717,723,736,717,493,492,701,493,492,701,736,735,492,736,735,492,736,734,735,736,734,735,736,492,493,736,492,493,716,723,717,716,723,717,716,596,723,716,596,723,610,527,674,610,527,674,291,610,413,291,610,413,291,527,610,291,527,610,522,675,565,522,675,565,456,610,213,456,610,213,598,593,537,598,593,537,598,670,593,598,670,593,592,737,670,592,737,670,592,624,737,592,624,737,594,669,670,594,669,670,594,598,601,594,598,601,594,670,598,594,670,598,60,590,58,60,590,58,591,737,624,591,737,624,670,636,593,670,636,593,60,636,737,60,636,737,210,296,211,210,296,211,210,61,296,210,61,296,591,60,737,591,60,737,591,590,60,591,590,60,522,210,211,522,210,211,522,62,210,522,62,210,737,636,670,737,636,670,610,590,589,610,590,589,522,434,62,522,434,62,211,675,522,211,675,522,211,213,675,211,213,675,674,213,610,674,213,610,674,675,213,674,675,213,531,616,699,531,616,699,283,411,623,283,411,623,531,530,718,531,530,718,718,377,623,718,377,623,718,530,377,718,530,377,644,357,356,644,357,356,109,666,107,109,666,107,584,666,483,584,666,483,584,107,666,584,107,666,728,627,403,728,627,403,728,626,627,728,626,627,727,454,626,727,454,626,727,287,454,727,287,454,544,694,553,544,694,553,544,421,694,544,421,694,738,684,688,738,684,688,348,685,739,348,685,739,740,738,577,740,738,577,704,689,686,704,689,686,739,684,738,739,684,738,739,654,684,739,654,684,739,738,740,739,738,740,739,740,741,739,740,741,577,742,740,577,742,740,738,19,577,738,19,577,323,635,321,323,635,321,692,687,680,692,687,680,689,743,690,689,743,690,742,577,344,742,577,344,692,680,690,692,680,690,690,682,692,690,682,692,690,246,682,690,246,682,690,344,247,690,344,247,742,344,690,742,344,690,743,689,704,743,689,704,741,743,704,741,743,704,362,321,635,362,321,635,362,688,343,362,688,343,362,20,19,362,20,19,688,19,738,688,19,738,348,741,704,348,741,704,348,739,741,348,739,741,654,739,685,654,739,685,740,742,741,740,742,741,741,690,743,741,690,743,742,690,741,742,690,741,342,361,363,342,361,363,342,125,361,342,125,361,719,279,373,719,279,373,651,650,744,651,650,744,663,744,650,663,744,650,663,745,744,663,745,744,611,380,725,611,380,725,745,279,746,745,279,746,745,663,279,745,663,279,747,745,746,747,745,746,608,671,607,608,671,607,746,279,719,746,279,719,747,748,749,747,748,749,750,744,745,750,744,745,750,651,744,750,651,744,608,607,236,608,607,236,234,609,236,234,609,236,233,457,671,233,457,671,671,458,607,671,458,607,606,651,237,606,651,237,726,651,750,726,651,750,746,748,747,746,748,747,747,750,745,747,750,745,747,726,750,747,726,750,751,749,725,751,749,725,747,749,726,747,749,726,379,748,719,379,748,719,379,611,748,379,611,748,746,719,748,746,719,748,611,749,748,611,749,748,611,725,749,611,725,749,725,658,751,725,658,751,127,420,361,127,420,361,656,751,658,656,751,658,127,237,726,127,237,726,127,751,656,127,751,656,726,751,127,726,751,127,726,749,751,726,749,751]};

/***/ }),

/***/ "./src/assets/gear.json":
/*!******************************!*\
  !*** ./src/assets/gear.json ***!
  \******************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Torus","vertices":[{"x":0.875,"y":0.109724,"z":0},{"x":0.875,"y":-0.109724,"z":0},{"x":0.788348,"y":0.109724,"z":-0.379648},{"x":0.788348,"y":-0.109724,"z":-0.379648},{"x":0.545553,"y":0.109724,"z":-0.684103},{"x":0.545553,"y":-0.109724,"z":-0.684103},{"x":0.194706,"y":0.109724,"z":-0.853062},{"x":0.194706,"y":-0.109724,"z":-0.853062},{"x":-0.194706,"y":0.109724,"z":-0.853062},{"x":-0.194706,"y":-0.109724,"z":-0.853062},{"x":-0.545554,"y":0.109724,"z":-0.684102},{"x":-0.545554,"y":-0.109724,"z":-0.684102},{"x":-0.788348,"y":0.109724,"z":-0.379648},{"x":-0.788348,"y":-0.109724,"z":-0.379648},{"x":-0.875,"y":0.109724,"z":0},{"x":-0.875,"y":-0.109724,"z":0},{"x":-0.788348,"y":0.109724,"z":0.379648},{"x":-0.788348,"y":-0.109724,"z":0.379648},{"x":-0.545554,"y":0.109724,"z":0.684102},{"x":-0.545554,"y":-0.109724,"z":0.684102},{"x":-0.194706,"y":0.109724,"z":0.853062},{"x":-0.194706,"y":-0.109724,"z":0.853062},{"x":0.194706,"y":0.109724,"z":0.853062},{"x":0.194706,"y":-0.109724,"z":0.853062},{"x":0.545553,"y":0.109724,"z":0.684103},{"x":0.545553,"y":-0.109724,"z":0.684103},{"x":0.788348,"y":0.109724,"z":0.379649},{"x":0.788348,"y":-0.109724,"z":0.379649},{"x":1.058178,"y":0.132694,"z":0},{"x":1.058178,"y":-0.132694,"z":0},{"x":0.953386,"y":0.132694,"z":-0.459126},{"x":0.953386,"y":-0.132694,"z":-0.459126},{"x":0.659763,"y":0.132694,"z":-0.827317},{"x":0.659763,"y":-0.132694,"z":-0.827317},{"x":0.235467,"y":0.132694,"z":-1.031648},{"x":0.235467,"y":-0.132694,"z":-1.031648},{"x":-0.235467,"y":0.132694,"z":-1.031648},{"x":-0.235467,"y":-0.132694,"z":-1.031648},{"x":-0.659764,"y":0.132694,"z":-0.827317},{"x":-0.659764,"y":-0.132694,"z":-0.827317},{"x":-0.953386,"y":0.132694,"z":-0.459127},{"x":-0.953386,"y":-0.132694,"z":-0.459127},{"x":-1.058178,"y":0.132694,"z":0},{"x":-1.058178,"y":-0.132694,"z":0},{"x":-0.953386,"y":0.132694,"z":0.459126},{"x":-0.953386,"y":-0.132694,"z":0.459126},{"x":-0.659764,"y":0.132694,"z":0.827317},{"x":-0.659764,"y":-0.132694,"z":0.827317},{"x":-0.235467,"y":0.132694,"z":1.031648},{"x":-0.235467,"y":-0.132694,"z":1.031648},{"x":0.235467,"y":0.132694,"z":1.031648},{"x":0.235467,"y":-0.132694,"z":1.031648},{"x":0.659763,"y":0.132694,"z":0.827318},{"x":0.659763,"y":-0.132694,"z":0.827318},{"x":0.953386,"y":0.132694,"z":0.459127},{"x":0.953386,"y":-0.132694,"z":0.459127},{"x":-1.319376,"y":0.07224,"z":-0.169652},{"x":-1.319376,"y":-0.07224,"z":-0.169652},{"x":-1.082066,"y":0.042375,"z":0.766739},{"x":-1.082066,"y":-0.042375,"z":0.766739},{"x":0.972525,"y":0.056632,"z":0.9041},{"x":1.097839,"y":0.056632,"z":0.746961},{"x":0.972525,"y":-0.056632,"z":0.9041},{"x":1.097839,"y":-0.056632,"z":0.746961},{"x":1.270045,"y":0.05269,"z":-0.385783},{"x":1.270045,"y":-0.05269,"z":-0.385783},{"x":-0.988298,"y":0.042375,"z":0.88432},{"x":-0.988298,"y":-0.042375,"z":0.88432},{"x":0.667196,"y":-0.05799,"z":-1.148277},{"x":0.481769,"y":-0.05799,"z":-1.237574},{"x":0.078068,"y":0.043994,"z":1.324047},{"x":0.078068,"y":-0.043994,"z":1.324047},{"x":-0.672469,"y":0.061288,"z":-1.145738},{"x":-0.672469,"y":-0.061288,"z":-1.145738},{"x":-0.078067,"y":0.043994,"z":1.324047},{"x":-0.078067,"y":-0.043994,"z":1.324047},{"x":-1.262326,"y":-0.07224,"z":-0.419605},{"x":-0.476497,"y":-0.061288,"z":-1.240113},{"x":1.311656,"y":0.05269,"z":-0.203473},{"x":1.311656,"y":-0.05269,"z":-0.203473},{"x":0.667196,"y":0.05799,"z":-1.148277},{"x":0.481769,"y":0.05799,"z":-1.237574},{"x":-1.262326,"y":0.07224,"z":-0.419605},{"x":-0.476497,"y":0.061288,"z":-1.240113}],"normals":[{"x":0.9749,"y":0,"z":-0.2225},{"x":0.7818,"y":0,"z":-0.6235},{"x":0.4339,"y":0,"z":-0.901},{"x":0,"y":0,"z":-1},{"x":-0.4339,"y":0,"z":-0.901},{"x":-0.7818,"y":0,"z":-0.6235},{"x":-0.9749,"y":0,"z":-0.2225},{"x":-0.9749,"y":0,"z":0.2225},{"x":-0.7818,"y":0,"z":0.6235},{"x":-0.4339,"y":0,"z":0.901},{"x":0,"y":0,"z":1},{"x":0.4339,"y":0,"z":0.901},{"x":0.7818,"y":0,"z":0.6235},{"x":0.9749,"y":0,"z":0.2225},{"x":-0.171,"y":0,"z":-0.9853},{"x":-0.8805,"y":0,"z":-0.474},{"x":-0.2573,"y":0.9645,"z":0.0587},{"x":0.5447,"y":0,"z":-0.8386},{"x":0,"y":-0.9569,"z":-0.2903},{"x":0.1269,"y":0,"z":0.9919},{"x":0.1029,"y":-0.9715,"z":0.2137},{"x":-0.1244,"y":0.9918,"z":0.0284},{"x":-0.0554,"y":0.9918,"z":0.1149},{"x":-0.0997,"y":-0.9918,"z":-0.0795},{"x":-0.1244,"y":-0.9918,"z":-0.0284},{"x":-0.1244,"y":0.9918,"z":-0.0284},{"x":0,"y":0.9918,"z":-0.1276},{"x":-0.0554,"y":0.9918,"z":-0.1149},{"x":0.0997,"y":0.9918,"z":-0.0795},{"x":0.1244,"y":-0.9918,"z":0.0284},{"x":-0.1244,"y":-0.9918,"z":0.0284},{"x":0.0997,"y":-0.9918,"z":0.0795},{"x":0,"y":0.9918,"z":0.1276},{"x":0,"y":-0.9918,"z":-0.1276},{"x":0.0997,"y":0.9918,"z":0.0795},{"x":0.1244,"y":0.9918,"z":0.0284},{"x":-0.0997,"y":0.9918,"z":-0.0795},{"x":0.0554,"y":-0.9918,"z":-0.1149},{"x":-0.0997,"y":-0.9918,"z":0.0795},{"x":0.0554,"y":-0.9918,"z":0.1149},{"x":-0.0554,"y":-0.9918,"z":0.1149},{"x":-0.0997,"y":0.9918,"z":0.0795},{"x":0.0997,"y":-0.9918,"z":-0.0795},{"x":0.1244,"y":-0.9918,"z":-0.0284},{"x":0.0554,"y":0.9918,"z":-0.1149},{"x":-0.0554,"y":-0.9918,"z":-0.1149},{"x":0.0554,"y":0.9918,"z":0.1149},{"x":0,"y":-0.9918,"z":0.1276},{"x":0.1244,"y":0.9918,"z":-0.0284},{"x":-0.6542,"y":0,"z":0.7564},{"x":0.9992,"y":0,"z":-0.0399},{"x":0.9225,"y":0,"z":0.3859},{"x":0.8805,"y":0,"z":-0.474},{"x":0.1974,"y":-0.9793,"z":0.0451},{"x":0.1974,"y":0.9793,"z":0.0451},{"x":0.6414,"y":0,"z":0.7672},{"x":0.1029,"y":0.9715,"z":0.2137},{"x":-0.1968,"y":-0.9678,"z":-0.157},{"x":0,"y":0.9569,"z":-0.2903},{"x":-0.1968,"y":0.9678,"z":-0.157},{"x":-0.626,"y":0,"z":-0.7798},{"x":0.2384,"y":0,"z":-0.9712},{"x":-0.1074,"y":-0.9689,"z":0.223},{"x":-0.2256,"y":0,"z":0.9742},{"x":-0.8938,"y":0,"z":0.4485},{"x":-0.9997,"y":0,"z":-0.0232},{"x":0.2307,"y":-0.9555,"z":-0.184},{"x":0.2307,"y":0.9555,"z":-0.184},{"x":-0.2573,"y":-0.9645,"z":0.0587},{"x":-0.1074,"y":0.9689,"z":0.223}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,4,2],"normals":[1,1,1]},{"vertices":[5,6,4],"normals":[2,2,2]},{"vertices":[7,8,6],"normals":[3,3,3]},{"vertices":[9,10,8],"normals":[4,4,4]},{"vertices":[11,12,10],"normals":[5,5,5]},{"vertices":[13,14,12],"normals":[6,6,6]},{"vertices":[15,16,14],"normals":[7,7,7]},{"vertices":[17,18,16],"normals":[8,8,8]},{"vertices":[19,20,18],"normals":[9,9,9]},{"vertices":[21,22,20],"normals":[10,10,10]},{"vertices":[23,24,22],"normals":[11,11,11]},{"vertices":[25,26,24],"normals":[12,12,12]},{"vertices":[27,0,26],"normals":[13,13,13]},{"vertices":[47,66,46],"normals":[14,14,14]},{"vertices":[32,31,30],"normals":[8,8,8]},{"vertices":[51,70,50],"normals":[15,15,15]},{"vertices":[36,35,34],"normals":[10,10,10]},{"vertices":[29,65,31],"normals":[16,16,16]},{"vertices":[40,39,38],"normals":[12,12,12]},{"vertices":[43,56,42],"normals":[17,17,17]},{"vertices":[44,43,42],"normals":[0,0,0]},{"vertices":[50,74,48],"normals":[18,18,18]},{"vertices":[48,47,46],"normals":[2,2,2]},{"vertices":[40,76,41],"normals":[19,19,19]},{"vertices":[52,51,50],"normals":[4,4,4]},{"vertices":[38,83,36],"normals":[20,20,20]},{"vertices":[28,55,54],"normals":[6,6,6]},{"vertices":[17,43,45],"normals":[21,21,21]},{"vertices":[19,49,21],"normals":[22,22,22]},{"vertices":[12,38,10],"normals":[23,23,23]},{"vertices":[12,42,40],"normals":[24,24,24]},{"vertices":[13,43,15],"normals":[25,25,25]},{"vertices":[7,37,9],"normals":[26,26,26]},{"vertices":[9,39,11],"normals":[27,27,27]},{"vertices":[3,33,5],"normals":[28,28,28]},{"vertices":[26,28,54],"normals":[29,29,29]},{"vertices":[16,42,14],"normals":[30,30,30]},{"vertices":[26,52,24],"normals":[31,31,31]},{"vertices":[21,51,23],"normals":[32,32,32]},{"vertices":[8,34,6],"normals":[33,33,33]},{"vertices":[27,53,55],"normals":[34,34,34]},{"vertices":[27,29,1],"normals":[35,35,35]},{"vertices":[11,41,13],"normals":[36,36,36]},{"vertices":[6,32,4],"normals":[37,37,37]},{"vertices":[18,44,16],"normals":[38,38,38]},{"vertices":[24,50,22],"normals":[39,39,39]},{"vertices":[18,48,46],"normals":[40,40,40]},{"vertices":[19,45,47],"normals":[41,41,41]},{"vertices":[2,32,30],"normals":[42,42,42]},{"vertices":[2,28,0],"normals":[43,43,43]},{"vertices":[7,33,35],"normals":[44,44,44]},{"vertices":[10,36,8],"normals":[45,45,45]},{"vertices":[25,51,53],"normals":[46,46,46]},{"vertices":[22,48,20],"normals":[47,47,47]},{"vertices":[1,31,3],"normals":[48,48,48]},{"vertices":[64,79,78],"normals":[7,7,7]},{"vertices":[81,68,80],"normals":[9,9,9]},{"vertices":[72,77,83],"normals":[11,11,11]},{"vertices":[56,76,82],"normals":[13,13,13]},{"vertices":[66,59,58],"normals":[1,1,1]},{"vertices":[70,75,74],"normals":[3,3,3]},{"vertices":[61,62,60],"normals":[5,5,5]},{"vertices":[36,77,37],"normals":[49,49,49]},{"vertices":[39,72,38],"normals":[50,50,50]},{"vertices":[44,59,45],"normals":[51,51,51]},{"vertices":[48,75,49],"normals":[52,52,52]},{"vertices":[42,82,40],"normals":[53,53,53]},{"vertices":[43,76,57],"normals":[54,54,54]},{"vertices":[35,81,34],"normals":[55,55,55]},{"vertices":[37,73,39],"normals":[56,56,56]},{"vertices":[54,60,52],"normals":[57,57,57]},{"vertices":[49,71,51],"normals":[58,58,58]},{"vertices":[55,62,63],"normals":[59,59,59]},{"vertices":[28,79,29],"normals":[60,60,60]},{"vertices":[52,62,53],"normals":[61,61,61]},{"vertices":[34,80,32],"normals":[62,62,62]},{"vertices":[31,64,30],"normals":[63,63,63]},{"vertices":[55,61,54],"normals":[64,64,64]},{"vertices":[32,68,33],"normals":[65,65,65]},{"vertices":[46,58,44],"normals":[66,66,66]},{"vertices":[47,59,67],"normals":[67,67,67]},{"vertices":[28,64,78],"normals":[68,68,68]},{"vertices":[35,68,69],"normals":[69,69,69]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,5,4],"normals":[1,1,1]},{"vertices":[5,7,6],"normals":[2,2,2]},{"vertices":[7,9,8],"normals":[3,3,3]},{"vertices":[9,11,10],"normals":[4,4,4]},{"vertices":[11,13,12],"normals":[5,5,5]},{"vertices":[13,15,14],"normals":[6,6,6]},{"vertices":[15,17,16],"normals":[7,7,7]},{"vertices":[17,19,18],"normals":[8,8,8]},{"vertices":[19,21,20],"normals":[9,9,9]},{"vertices":[21,23,22],"normals":[10,10,10]},{"vertices":[23,25,24],"normals":[11,11,11]},{"vertices":[25,27,26],"normals":[12,12,12]},{"vertices":[27,1,0],"normals":[13,13,13]},{"vertices":[47,67,66],"normals":[14,14,14]},{"vertices":[32,33,31],"normals":[8,8,8]},{"vertices":[51,71,70],"normals":[15,15,15]},{"vertices":[36,37,35],"normals":[10,10,10]},{"vertices":[29,79,65],"normals":[16,16,16]},{"vertices":[40,41,39],"normals":[12,12,12]},{"vertices":[43,57,56],"normals":[17,17,17]},{"vertices":[44,45,43],"normals":[0,0,0]},{"vertices":[50,70,74],"normals":[18,18,18]},{"vertices":[48,49,47],"normals":[2,2,2]},{"vertices":[40,82,76],"normals":[19,19,19]},{"vertices":[52,53,51],"normals":[4,4,4]},{"vertices":[38,72,83],"normals":[20,20,20]},{"vertices":[28,29,55],"normals":[6,6,6]},{"vertices":[17,15,43],"normals":[21,21,21]},{"vertices":[19,47,49],"normals":[22,22,22]},{"vertices":[12,40,38],"normals":[23,23,23]},{"vertices":[12,14,42],"normals":[24,24,24]},{"vertices":[13,41,43],"normals":[25,25,25]},{"vertices":[7,35,37],"normals":[26,26,26]},{"vertices":[9,37,39],"normals":[27,27,27]},{"vertices":[3,31,33],"normals":[28,28,28]},{"vertices":[26,0,28],"normals":[29,29,29]},{"vertices":[16,44,42],"normals":[30,30,30]},{"vertices":[26,54,52],"normals":[31,31,31]},{"vertices":[21,49,51],"normals":[32,32,32]},{"vertices":[8,36,34],"normals":[33,33,33]},{"vertices":[27,25,53],"normals":[34,34,34]},{"vertices":[27,55,29],"normals":[35,35,35]},{"vertices":[11,39,41],"normals":[36,36,36]},{"vertices":[6,34,32],"normals":[37,37,37]},{"vertices":[18,46,44],"normals":[38,38,38]},{"vertices":[24,52,50],"normals":[39,39,39]},{"vertices":[18,20,48],"normals":[40,40,40]},{"vertices":[19,17,45],"normals":[41,41,41]},{"vertices":[2,4,32],"normals":[42,42,42]},{"vertices":[2,30,28],"normals":[43,43,43]},{"vertices":[7,5,33],"normals":[44,44,44]},{"vertices":[10,38,36],"normals":[45,45,45]},{"vertices":[25,23,51],"normals":[46,46,46]},{"vertices":[22,50,48],"normals":[47,47,47]},{"vertices":[1,29,31],"normals":[48,48,48]},{"vertices":[64,65,79],"normals":[7,7,7]},{"vertices":[81,69,68],"normals":[9,9,9]},{"vertices":[72,73,77],"normals":[11,11,11]},{"vertices":[56,57,76],"normals":[13,13,13]},{"vertices":[66,67,59],"normals":[1,1,1]},{"vertices":[70,71,75],"normals":[3,3,3]},{"vertices":[61,63,62],"normals":[5,5,5]},{"vertices":[36,83,77],"normals":[49,49,49]},{"vertices":[39,73,72],"normals":[50,50,50]},{"vertices":[44,58,59],"normals":[51,51,51]},{"vertices":[48,74,75],"normals":[52,52,52]},{"vertices":[42,56,82],"normals":[53,53,53]},{"vertices":[43,41,76],"normals":[54,54,54]},{"vertices":[35,69,81],"normals":[55,55,55]},{"vertices":[37,77,73],"normals":[56,56,56]},{"vertices":[54,61,60],"normals":[57,57,57]},{"vertices":[49,75,71],"normals":[58,58,58]},{"vertices":[55,53,62],"normals":[59,59,59]},{"vertices":[28,78,79],"normals":[60,60,60]},{"vertices":[52,60,62],"normals":[61,61,61]},{"vertices":[34,81,80],"normals":[62,62,62]},{"vertices":[31,65,64],"normals":[63,63,63]},{"vertices":[55,63,61],"normals":[64,64,64]},{"vertices":[32,80,68],"normals":[65,65,65]},{"vertices":[46,66,58],"normals":[66,66,66]},{"vertices":[47,45,59],"normals":[67,67,67]},{"vertices":[28,30,64],"normals":[68,68,68]},{"vertices":[35,33,68],"normals":[69,69,69]}]}];

/***/ }),

/***/ "./src/assets/hoodlum.json":
/*!*********************************!*\
  !*** ./src/assets/hoodlum.json ***!
  \*********************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Text_CUText","vertices":[{"x":2.379562,"y":0.199803,"z":0.468327},{"x":2.160305,"y":-0.066819,"z":0.469153},{"x":1.941047,"y":0.199803,"z":0.468327},{"x":1.842304,"y":-0.331291,"z":0.468409},{"x":1.934304,"y":0.350709,"z":0.468409},{"x":2.160304,"y":0.070709,"z":0.468409},{"x":2.478304,"y":0.350709,"z":0.468409},{"x":2.478304,"y":-0.331291,"z":0.468409},{"x":1.705098,"y":-0.132115,"z":0.468414},{"x":1.648478,"y":-0.254743,"z":0.46843},{"x":1.519027,"y":-0.329801,"z":0.468429},{"x":1.31118,"y":-0.332771,"z":0.46846},{"x":1.182986,"y":-0.253239,"z":0.468416},{"x":1.127668,"y":-0.145947,"z":0.468417},{"x":1.220304,"y":0.350709,"z":0.468409},{"x":1.224472,"y":-0.132392,"z":0.468388},{"x":1.283041,"y":-0.215763,"z":0.468362},{"x":1.40158,"y":-0.252778,"z":0.468391},{"x":1.527746,"y":-0.226989,"z":0.46839},{"x":1.603614,"y":-0.147365,"z":0.468335},{"x":1.709304,"y":0.350709,"z":0.468409},{"x":1.051304,"y":-0.243291,"z":0.468409},{"x":0.645304,"y":-0.331291,"z":0.468409},{"x":0.743304,"y":0.350709,"z":0.468409},{"x":0.743304,"y":-0.243291,"z":0.468409},{"x":0.260435,"y":0.343887,"z":0.468435},{"x":0.424134,"y":0.261343,"z":0.468443},{"x":0.528255,"y":0.064811,"z":0.468487},{"x":0.493928,"y":-0.138829,"z":0.468426},{"x":0.396174,"y":-0.258458,"z":0.468421},{"x":0.251968,"y":-0.32509,"z":0.468434},{"x":-0.102696,"y":-0.331291,"z":0.468409},{"x":-0.102696,"y":0.350709,"z":0.468409},{"x":0.252504,"y":-0.235124,"z":0.46834},{"x":0.37754,"y":-0.144072,"z":0.468385},{"x":0.428847,"y":0.00481,"z":0.468355},{"x":0.370972,"y":0.180934,"z":0.468312},{"x":0.224049,"y":0.25852,"z":0.468389},{"x":-0.004696,"y":0.262709,"z":0.468409},{"x":-0.004696,"y":-0.243291,"z":0.468409},{"x":-0.466217,"y":0.345649,"z":0.468441},{"x":-0.338754,"y":0.272213,"z":0.468411},{"x":-0.24193,"y":0.141181,"z":0.468458},{"x":-0.227318,"y":-0.059081,"z":0.468427},{"x":-0.287819,"y":-0.197284,"z":0.468417},{"x":-0.434461,"y":-0.318001,"z":0.468484},{"x":-0.673848,"y":-0.335952,"z":0.46844},{"x":-0.862137,"y":-0.240279,"z":0.468465},{"x":-0.953064,"y":-0.059001,"z":0.468427},{"x":-0.938306,"y":0.140228,"z":0.468458},{"x":-0.805785,"y":0.302646,"z":0.468439},{"x":-0.645328,"y":0.357935,"z":0.46842},{"x":-0.512912,"y":-0.241549,"z":0.468399},{"x":-0.410962,"y":-0.188935,"z":0.468389},{"x":-0.329004,"y":-0.062972,"z":0.468346},{"x":-0.337848,"y":0.103378,"z":0.468385},{"x":-0.449131,"y":0.241937,"z":0.468253},{"x":-0.646909,"y":0.267728,"z":0.468382},{"x":-0.769613,"y":0.20867,"z":0.468388},{"x":-0.842557,"y":0.103354,"z":0.468385},{"x":-0.851396,"y":-0.06293,"z":0.468346},{"x":-0.76957,"y":-0.188941,"z":0.468389},{"x":-0.646812,"y":-0.248302,"z":0.468379},{"x":-1.289217,"y":0.345649,"z":0.468441},{"x":-1.161754,"y":0.272214,"z":0.468411},{"x":-1.06493,"y":0.141181,"z":0.468458},{"x":-1.050318,"y":-0.059081,"z":0.468427},{"x":-1.110818,"y":-0.197284,"z":0.468417},{"x":-1.257462,"y":-0.318001,"z":0.468484},{"x":-1.496848,"y":-0.335952,"z":0.46844},{"x":-1.685137,"y":-0.24028,"z":0.468465},{"x":-1.776064,"y":-0.059001,"z":0.468427},{"x":-1.761306,"y":0.140228,"z":0.468458},{"x":-1.628785,"y":0.302646,"z":0.468439},{"x":-1.468328,"y":0.357935,"z":0.46842},{"x":-1.272316,"y":-0.222406,"z":0.468253},{"x":-1.152004,"y":-0.062973,"z":0.468346},{"x":-1.160848,"y":0.103379,"z":0.468385},{"x":-1.27213,"y":0.241937,"z":0.468254},{"x":-1.469909,"y":0.267728,"z":0.468382},{"x":-1.592613,"y":0.20867,"z":0.468388},{"x":-1.665557,"y":0.103354,"z":0.468385},{"x":-1.674396,"y":-0.06293,"z":0.468346},{"x":-1.59257,"y":-0.188942,"z":0.468389},{"x":-1.469812,"y":-0.248302,"z":0.468379},{"x":-1.998696,"y":-0.034291,"z":0.468409},{"x":-2.380696,"y":-0.034291,"z":0.468409},{"x":-2.478696,"y":-0.331291,"z":0.468409},{"x":-2.380696,"y":0.350709,"z":0.468409},{"x":-2.380696,"y":0.053709,"z":0.468409},{"x":-1.998696,"y":0.053709,"z":0.468409},{"x":-1.900696,"y":0.350709,"z":0.468409},{"x":-1.900696,"y":-0.331291,"z":0.468409},{"x":2.356363,"y":-0.35321,"z":0.173606},{"x":2.379562,"y":0.199803,"z":0.15649},{"x":2.160305,"y":-0.06682,"z":0.155664},{"x":1.941047,"y":0.199803,"z":0.15649},{"x":1.962223,"y":-0.355233,"z":0.173606},{"x":1.842304,"y":-0.331291,"z":0.156409},{"x":1.820386,"y":0.374651,"z":0.173606},{"x":1.934304,"y":0.350709,"z":0.156409},{"x":2.160304,"y":0.070709,"z":0.156409},{"x":2.378498,"y":0.374651,"z":0.173606},{"x":2.478304,"y":0.350709,"z":0.156409},{"x":2.478304,"y":-0.331291,"z":0.156409},{"x":1.705098,"y":-0.132115,"z":0.156403},{"x":1.648478,"y":-0.254743,"z":0.156388},{"x":1.519027,"y":-0.329801,"z":0.156388},{"x":1.31118,"y":-0.332771,"z":0.156357},{"x":1.182986,"y":-0.253239,"z":0.156401},{"x":1.127667,"y":-0.145946,"z":0.1564},{"x":1.100386,"y":0.374651,"z":0.173606},{"x":1.220304,"y":0.350709,"z":0.156409},{"x":1.224472,"y":-0.132393,"z":0.156429},{"x":1.283041,"y":-0.215763,"z":0.156456},{"x":1.40158,"y":-0.252779,"z":0.156426},{"x":1.527746,"y":-0.226989,"z":0.156427},{"x":1.603614,"y":-0.147365,"z":0.156482},{"x":1.589386,"y":0.374651,"z":0.173606},{"x":1.709304,"y":0.350709,"z":0.156409},{"x":1.051304,"y":-0.243291,"z":0.156409},{"x":1.073223,"y":-0.355233,"z":0.173606},{"x":0.645304,"y":-0.331291,"z":0.156409},{"x":0.623385,"y":0.374651,"z":0.173606},{"x":0.743304,"y":0.350709,"z":0.156409},{"x":0.743304,"y":-0.243291,"z":0.156409},{"x":0.260434,"y":0.343887,"z":0.156382},{"x":0.424134,"y":0.261343,"z":0.156374},{"x":0.528255,"y":0.064811,"z":0.15633},{"x":0.493928,"y":-0.138828,"z":0.156392},{"x":0.396174,"y":-0.258458,"z":0.156397},{"x":0.251968,"y":-0.32509,"z":0.156383},{"x":-0.102696,"y":-0.331291,"z":0.156409},{"x":-0.102696,"y":0.350709,"z":0.156409},{"x":0.252504,"y":-0.235124,"z":0.156477},{"x":0.37754,"y":-0.144072,"z":0.156432},{"x":0.428847,"y":0.00481,"z":0.156462},{"x":0.370972,"y":0.180934,"z":0.156505},{"x":0.224049,"y":0.25852,"z":0.156428},{"x":-0.004696,"y":0.262709,"z":0.156409},{"x":-0.004696,"y":-0.243291,"z":0.156409},{"x":-0.466217,"y":0.345649,"z":0.156376},{"x":-0.338754,"y":0.272213,"z":0.156406},{"x":-0.24193,"y":0.141181,"z":0.156359},{"x":-0.227318,"y":-0.059081,"z":0.156391},{"x":-0.287818,"y":-0.197284,"z":0.1564},{"x":-0.434461,"y":-0.318001,"z":0.156333},{"x":-0.673848,"y":-0.335952,"z":0.156377},{"x":-0.862137,"y":-0.24028,"z":0.156352},{"x":-0.953064,"y":-0.059001,"z":0.15639},{"x":-0.938306,"y":0.140228,"z":0.156359},{"x":-0.805785,"y":0.302646,"z":0.156378},{"x":-0.645328,"y":0.357935,"z":0.156397},{"x":-0.512912,"y":-0.241549,"z":0.156419},{"x":-0.410962,"y":-0.188935,"z":0.156429},{"x":-0.329004,"y":-0.062972,"z":0.156471},{"x":-0.337848,"y":0.103378,"z":0.156432},{"x":-0.449131,"y":0.241937,"z":0.156564},{"x":-0.646909,"y":0.267728,"z":0.156435},{"x":-0.769613,"y":0.20867,"z":0.156429},{"x":-0.842557,"y":0.103354,"z":0.156432},{"x":-0.851396,"y":-0.06293,"z":0.156471},{"x":-0.76957,"y":-0.188941,"z":0.156429},{"x":-0.646812,"y":-0.248302,"z":0.156439},{"x":-1.289217,"y":0.345649,"z":0.156376},{"x":-1.161754,"y":0.272214,"z":0.156406},{"x":-1.06493,"y":0.141181,"z":0.156359},{"x":-1.050318,"y":-0.059081,"z":0.156391},{"x":-1.110818,"y":-0.197284,"z":0.1564},{"x":-1.257462,"y":-0.318001,"z":0.156333},{"x":-1.496848,"y":-0.335952,"z":0.156377},{"x":-1.685137,"y":-0.24028,"z":0.156352},{"x":-1.776064,"y":-0.059001,"z":0.15639},{"x":-1.761306,"y":0.140228,"z":0.156359},{"x":-1.628785,"y":0.302646,"z":0.156378},{"x":-1.468328,"y":0.357935,"z":0.156397},{"x":-1.335912,"y":-0.241549,"z":0.156419},{"x":-1.233962,"y":-0.188935,"z":0.156429},{"x":-1.152004,"y":-0.062973,"z":0.156471},{"x":-1.160848,"y":0.103378,"z":0.156432},{"x":-1.27213,"y":0.241936,"z":0.156564},{"x":-1.469909,"y":0.267728,"z":0.156435},{"x":-1.592613,"y":0.20867,"z":0.156429},{"x":-1.665557,"y":0.103354,"z":0.156432},{"x":-1.674396,"y":-0.06293,"z":0.156471},{"x":-1.59257,"y":-0.188942,"z":0.156429},{"x":-1.469812,"y":-0.248302,"z":0.156439},{"x":-2.022637,"y":-0.35321,"z":0.173606},{"x":-1.998696,"y":-0.034291,"z":0.156409},{"x":-2.380696,"y":-0.034291,"z":0.156409},{"x":-2.358777,"y":-0.355233,"z":0.173606},{"x":-2.478696,"y":-0.331291,"z":0.156409},{"x":-2.500614,"y":0.374651,"z":0.173606},{"x":-2.380696,"y":0.350709,"z":0.156409},{"x":-2.380696,"y":0.053709,"z":0.156409},{"x":-1.998696,"y":0.053709,"z":0.156409},{"x":-2.020614,"y":0.374651,"z":0.173606},{"x":-1.900696,"y":0.350709,"z":0.156409},{"x":-1.900696,"y":-0.331291,"z":0.156409},{"x":-2.027696,"y":-0.063291,"z":0.185409},{"x":-2.351696,"y":-0.063291,"z":0.185409},{"x":-2.507696,"y":-0.360291,"z":0.185409},{"x":-2.351696,"y":0.379709,"z":0.185409},{"x":-2.351696,"y":0.082709,"z":0.185409},{"x":-2.027696,"y":0.082709,"z":0.185409},{"x":-1.871696,"y":0.379709,"z":0.185409},{"x":-1.871696,"y":-0.360291,"z":0.185409},{"x":-2.020614,"y":-0.355233,"z":0.451211},{"x":-2.027696,"y":-0.063291,"z":0.439409},{"x":-2.351696,"y":-0.063291,"z":0.439409},{"x":-2.356754,"y":-0.35321,"z":0.451211},{"x":-2.507696,"y":-0.360291,"z":0.439409},{"x":-2.502638,"y":0.372628,"z":0.451211},{"x":-2.351696,"y":0.379709,"z":0.439409},{"x":-2.351696,"y":0.082709,"z":0.439409},{"x":-2.027696,"y":0.082709,"z":0.439409},{"x":-2.022637,"y":0.372628,"z":0.451211},{"x":-1.871696,"y":0.379709,"z":0.439409},{"x":-1.871696,"y":-0.360291,"z":0.439409},{"x":-1.266047,"y":0.368941,"z":0.185313},{"x":-1.120828,"y":0.275017,"z":0.185825},{"x":-1.032865,"y":0.132157,"z":0.18522},{"x":-1.019276,"y":-0.043655,"z":0.184882},{"x":-1.079395,"y":-0.206564,"z":0.185318},{"x":-1.18373,"y":-0.304808,"z":0.185668},{"x":-1.301847,"y":-0.357936,"z":0.185282},{"x":-1.507577,"y":-0.364415,"z":0.184505},{"x":-1.669816,"y":-0.286946,"z":0.185829},{"x":-1.775575,"y":-0.15611,"z":0.185219},{"x":-1.80886,"y":-0.012522,"z":0.185119},{"x":-1.796318,"y":0.115321,"z":0.185375},{"x":-1.716112,"y":0.265021,"z":0.185954},{"x":-1.597602,"y":0.349478,"z":0.185332},{"x":-1.467914,"y":0.387897,"z":0.184818},{"x":-1.32895,"y":0.382062,"z":0.439477},{"x":-1.184852,"y":0.329622,"z":0.43884},{"x":-1.068098,"y":0.205966,"z":0.439444},{"x":-1.024891,"y":0.089439,"z":0.439418},{"x":-1.01833,"y":-0.036203,"z":0.439933},{"x":-1.053398,"y":-0.154826,"z":0.439477},{"x":-1.119616,"y":-0.253347,"z":0.438991},{"x":-1.265391,"y":-0.348958,"z":0.439509},{"x":-1.470402,"y":-0.368448,"z":0.440013},{"x":-1.642545,"y":-0.309043,"z":0.438843},{"x":-1.771444,"y":-0.164477,"z":0.439494},{"x":-1.808532,"y":-0.017689,"z":0.439699},{"x":-1.798532,"y":0.107295,"z":0.439532},{"x":-1.722766,"y":0.25742,"z":0.438865},{"x":-1.603054,"y":0.346764,"z":0.439419},{"x":-1.476381,"y":0.386811,"z":0.440012},{"x":-1.392901,"y":-0.223009,"z":0.185055},{"x":-1.261197,"y":-0.175633,"z":0.186099},{"x":-1.192002,"y":-0.079632,"z":0.185431},{"x":-1.174965,"y":0.029984,"z":0.185055},{"x":-1.222824,"y":0.157853,"z":0.186105},{"x":-1.336026,"y":0.231884,"z":0.185462},{"x":-1.483753,"y":0.235473,"z":0.185017},{"x":-1.585401,"y":0.174434,"z":0.185745},{"x":-1.640745,"y":0.085075,"z":0.185466},{"x":-1.644404,"y":-0.058265,"z":0.185019},{"x":-1.582161,"y":-0.157818,"z":0.185744},{"x":-1.505441,"y":-0.206155,"z":0.18543},{"x":-1.336159,"y":-0.212421,"z":0.439355},{"x":-1.244325,"y":-0.15779,"z":0.439073},{"x":-1.181995,"y":-0.058291,"z":0.439798},{"x":-1.185655,"y":0.085089,"z":0.439351},{"x":-1.241077,"y":0.174406,"z":0.439071},{"x":-1.330276,"y":0.230079,"z":0.43928},{"x":-1.477106,"y":0.237191,"z":0.439814},{"x":-1.603619,"y":0.15787,"z":0.438714},{"x":-1.651425,"y":0.029972,"z":0.439762},{"x":-1.634402,"y":-0.079631,"z":0.439386},{"x":-1.585358,"y":-0.154677,"z":0.439073},{"x":-1.48359,"y":-0.216037,"z":0.439801},{"x":-0.443047,"y":0.368941,"z":0.185313},{"x":-0.297828,"y":0.275017,"z":0.185825},{"x":-0.209865,"y":0.132157,"z":0.18522},{"x":-0.196276,"y":-0.043654,"z":0.184882},{"x":-0.256395,"y":-0.206564,"z":0.185318},{"x":-0.36073,"y":-0.304808,"z":0.185668},{"x":-0.478847,"y":-0.357936,"z":0.185282},{"x":-0.684576,"y":-0.364415,"z":0.184505},{"x":-0.846817,"y":-0.286946,"z":0.185829},{"x":-0.952575,"y":-0.15611,"z":0.185219},{"x":-0.98586,"y":-0.012523,"z":0.185119},{"x":-0.973319,"y":0.115321,"z":0.185375},{"x":-0.893112,"y":0.265021,"z":0.185954},{"x":-0.774602,"y":0.349478,"z":0.185332},{"x":-0.644914,"y":0.387897,"z":0.184818},{"x":-0.505949,"y":0.382062,"z":0.439477},{"x":-0.361852,"y":0.329623,"z":0.43884},{"x":-0.245098,"y":0.205965,"z":0.439444},{"x":-0.20189,"y":0.089437,"z":0.439418},{"x":-0.19533,"y":-0.036203,"z":0.439933},{"x":-0.230398,"y":-0.154826,"z":0.439477},{"x":-0.296616,"y":-0.253348,"z":0.438991},{"x":-0.442391,"y":-0.348958,"z":0.439509},{"x":-0.647402,"y":-0.368448,"z":0.440013},{"x":-0.819545,"y":-0.309043,"z":0.438843},{"x":-0.948444,"y":-0.164478,"z":0.439494},{"x":-0.985532,"y":-0.017689,"z":0.439699},{"x":-0.975532,"y":0.107295,"z":0.439532},{"x":-0.899766,"y":0.25742,"z":0.438865},{"x":-0.780055,"y":0.346764,"z":0.439419},{"x":-0.653381,"y":0.386811,"z":0.440012},{"x":-0.5699,"y":-0.223009,"z":0.185055},{"x":-0.438197,"y":-0.175633,"z":0.186099},{"x":-0.369001,"y":-0.079631,"z":0.185431},{"x":-0.351965,"y":0.029984,"z":0.185055},{"x":-0.399824,"y":0.157853,"z":0.186105},{"x":-0.513025,"y":0.231883,"z":0.185462},{"x":-0.660753,"y":0.235473,"z":0.185017},{"x":-0.762402,"y":0.174434,"z":0.185745},{"x":-0.817745,"y":0.085075,"z":0.185466},{"x":-0.821404,"y":-0.058265,"z":0.185019},{"x":-0.759161,"y":-0.157818,"z":0.185744},{"x":-0.682442,"y":-0.206155,"z":0.18543},{"x":-0.513159,"y":-0.212421,"z":0.439355},{"x":-0.421325,"y":-0.157789,"z":0.439073},{"x":-0.358995,"y":-0.05829,"z":0.439798},{"x":-0.362655,"y":0.08509,"z":0.439351},{"x":-0.418077,"y":0.174406,"z":0.439071},{"x":-0.507275,"y":0.230079,"z":0.43928},{"x":-0.654106,"y":0.237191,"z":0.439814},{"x":-0.780619,"y":0.15787,"z":0.438714},{"x":-0.828425,"y":0.029972,"z":0.439762},{"x":-0.811402,"y":-0.079631,"z":0.439386},{"x":-0.762358,"y":-0.154676,"z":0.439073},{"x":-0.66059,"y":-0.216037,"z":0.439801},{"x":0.272742,"y":0.37189,"z":0.184735},{"x":0.447568,"y":0.278689,"z":0.185965},{"x":0.542054,"y":0.118561,"z":0.184732},{"x":0.552235,"y":-0.044381,"z":0.185379},{"x":0.49324,"y":-0.199466,"z":0.185323},{"x":0.39043,"y":-0.296255,"z":0.185659},{"x":0.2563,"y":-0.354603,"z":0.184721},{"x":-0.131696,"y":-0.360291,"z":0.185409},{"x":-0.131696,"y":0.379709,"z":0.185409},{"x":0.236936,"y":0.376343,"z":0.439851},{"x":0.358041,"y":0.337968,"z":0.439122},{"x":0.47209,"y":0.25203,"z":0.439505},{"x":0.55106,"y":0.080436,"z":0.440078},{"x":0.539683,"y":-0.10533,"z":0.439593},{"x":0.437388,"y":-0.263772,"z":0.438869},{"x":0.263664,"y":-0.353169,"z":0.440018},{"x":-0.131696,"y":-0.360291,"z":0.439409},{"x":-0.131696,"y":0.379709,"z":0.439409},{"x":0.25227,"y":-0.204238,"z":0.185584},{"x":0.358344,"y":-0.120029,"z":0.185465},{"x":0.394471,"y":-0.020103,"z":0.18521},{"x":0.386061,"y":0.087435,"z":0.185524},{"x":0.325451,"y":0.180562,"z":0.185949},{"x":0.213939,"y":0.230178,"z":0.18512},{"x":0.024304,"y":0.233709,"z":0.185409},{"x":0.024304,"y":-0.214291,"z":0.185409},{"x":0.246546,"y":-0.205993,"z":0.439082},{"x":0.355287,"y":-0.124642,"z":0.439292},{"x":0.393773,"y":-0.024981,"z":0.439621},{"x":0.387635,"y":0.082114,"z":0.439362},{"x":0.329261,"y":0.177233,"z":0.43886},{"x":0.219825,"y":0.229161,"z":0.439727},{"x":0.024304,"y":0.233709,"z":0.439409},{"x":0.024304,"y":-0.214291,"z":0.439409},{"x":1.080304,"y":-0.214291,"z":0.185409},{"x":0.616304,"y":-0.360291,"z":0.185409},{"x":0.772304,"y":0.379709,"z":0.185409},{"x":0.772304,"y":-0.214291,"z":0.185409},{"x":1.080304,"y":-0.214291,"z":0.439409},{"x":1.075246,"y":-0.35321,"z":0.451211},{"x":0.616304,"y":-0.360291,"z":0.439409},{"x":0.621362,"y":0.372628,"z":0.451211},{"x":0.772304,"y":0.379709,"z":0.439409},{"x":0.772304,"y":-0.214291,"z":0.439409},{"x":1.733366,"y":-0.142288,"z":0.184991},{"x":1.667387,"y":-0.276949,"z":0.185881},{"x":1.531119,"y":-0.356936,"z":0.185276},{"x":1.341831,"y":-0.366569,"z":0.184933},{"x":1.198,"y":-0.307913,"z":0.185329},{"x":1.127227,"y":-0.221792,"z":0.185643},{"x":1.096019,"y":-0.130052,"z":0.185049},{"x":1.249304,"y":0.379709,"z":0.185409},{"x":1.253805,"y":-0.130605,"z":0.185613},{"x":1.304435,"y":-0.193288,"z":0.185444},{"x":1.396936,"y":-0.223655,"z":0.185242},{"x":1.513151,"y":-0.201465,"z":0.185466},{"x":1.560397,"y":-0.160582,"z":0.185538},{"x":1.580434,"y":-0.102758,"z":0.185418},{"x":1.738304,"y":0.379709,"z":0.185409},{"x":1.731562,"y":-0.157907,"z":0.440142},{"x":1.669837,"y":-0.269879,"z":0.439183},{"x":1.595345,"y":-0.329924,"z":0.439445},{"x":1.48795,"y":-0.363602,"z":0.439414},{"x":1.348612,"y":-0.367601,"z":0.439884},{"x":1.203797,"y":-0.312189,"z":0.439574},{"x":1.129832,"y":-0.226504,"z":0.439176},{"x":1.096802,"y":-0.135193,"z":0.439777},{"x":1.098362,"y":0.372628,"z":0.451211},{"x":1.249304,"y":0.379709,"z":0.439409},{"x":1.253454,"y":-0.12921,"z":0.439181},{"x":1.302434,"y":-0.191892,"z":0.439363},{"x":1.393695,"y":-0.223433,"z":0.439554},{"x":1.510924,"y":-0.20256,"z":0.439373},{"x":1.559481,"y":-0.161947,"z":0.439278},{"x":1.580168,"y":-0.105006,"z":0.43942},{"x":1.587363,"y":0.372628,"z":0.451211},{"x":1.738304,"y":0.379709,"z":0.439409},{"x":2.351305,"y":0.170709,"z":0.185409},{"x":2.392292,"y":0.170709,"z":0.185409},{"x":2.182292,"y":-0.093291,"z":0.185409},{"x":2.138317,"y":-0.093291,"z":0.185409},{"x":1.928317,"y":0.170709,"z":0.185409},{"x":1.969304,"y":0.170709,"z":0.185409},{"x":1.813304,"y":-0.360291,"z":0.185409},{"x":1.948165,"y":0.379709,"z":0.185409},{"x":2.160354,"y":0.11682,"z":0.185409},{"x":2.507304,"y":0.379709,"z":0.185409},{"x":2.507304,"y":-0.360291,"z":0.185409},{"x":2.358386,"y":-0.355233,"z":0.451211},{"x":2.351305,"y":0.170709,"z":0.439409},{"x":2.392292,"y":0.170709,"z":0.439409},{"x":2.182292,"y":-0.093291,"z":0.439409},{"x":2.138317,"y":-0.093291,"z":0.439409},{"x":1.928317,"y":0.170709,"z":0.439409},{"x":1.969304,"y":0.170709,"z":0.439409},{"x":1.964246,"y":-0.35321,"z":0.451211},{"x":1.813304,"y":-0.360291,"z":0.439409},{"x":1.818363,"y":0.372628,"z":0.451211},{"x":1.948165,"y":0.379709,"z":0.439409},{"x":2.160354,"y":0.11682,"z":0.439409},{"x":2.374253,"y":0.372628,"z":0.451211},{"x":2.507304,"y":0.379709,"z":0.439409},{"x":2.507304,"y":-0.360291,"z":0.439409}],"normals":[{"x":-0.2684,"y":-0.2774,"z":0.9225},{"x":0.1579,"y":0.3761,"z":0.913},{"x":-0.617,"y":0.5773,"z":0.5347},{"x":0.0004,"y":0.0126,"z":0.9999},{"x":0.0002,"y":0.1256,"z":0.9921},{"x":0.2867,"y":0.2866,"z":0.9141},{"x":-0.3825,"y":0.7418,"z":0.5509},{"x":0.0008,"y":0.012,"z":0.9999},{"x":0.2734,"y":-0.2712,"z":0.9228},{"x":0.614,"y":-0.5806,"z":0.5347},{"x":0,"y":-0.426,"z":0.9047},{"x":-0.606,"y":-0.5887,"z":0.535},{"x":-0.4121,"y":-0.1042,"z":0.9051},{"x":0.269,"y":0.2777,"z":0.9222},{"x":-0.6156,"y":0.5791,"z":0.5344},{"x":0.3072,"y":0.0909,"z":0.9473},{"x":-0.2774,"y":0.1087,"z":0.9546},{"x":0.2756,"y":0.274,"z":0.9214},{"x":-0.6124,"y":0.5827,"z":0.5342},{"x":0.4045,"y":-0.0626,"z":0.9124},{"x":0.1809,"y":0.2485,"z":0.9516},{"x":0.3363,"y":-0.295,"z":0.8943},{"x":-0.3316,"y":-0.2911,"z":0.8974},{"x":-0.1508,"y":0.2869,"z":0.946},{"x":0.0099,"y":0.3417,"z":0.9398},{"x":-0.1431,"y":-0.4526,"z":0.8802},{"x":0.1172,"y":-0.4249,"z":0.8976},{"x":-0.2981,"y":-0.2984,"z":0.9067},{"x":0.2703,"y":0.2746,"z":0.9228},{"x":-0.6149,"y":0.5787,"z":0.5357},{"x":0.11,"y":0.11,"z":0.9878},{"x":0.27,"y":0.2715,"z":0.9238},{"x":0.591,"y":-0.6075,"z":0.5307},{"x":-0.2963,"y":-0.3055,"z":0.9049},{"x":0.108,"y":-0.1096,"z":0.9881},{"x":-0.2982,"y":0.3027,"z":0.9052},{"x":0.1057,"y":0.4193,"z":0.9017},{"x":0.3021,"y":0.3406,"z":0.8903},{"x":-0.0748,"y":-0.3279,"z":0.9417},{"x":0.1067,"y":0.109,"z":0.9883},{"x":-0.2257,"y":-0.1894,"z":0.9556},{"x":0.4613,"y":0.0598,"z":0.8852},{"x":-0.3059,"y":0.0081,"z":0.952},{"x":0.4069,"y":-0.2251,"z":0.8853},{"x":-0.2527,"y":0.1883,"z":0.949},{"x":-0.0989,"y":0.3009,"z":0.9485},{"x":0.2459,"y":-0.3656,"z":0.8977},{"x":0.0843,"y":-0.4029,"z":0.9113},{"x":-0.2656,"y":0.3877,"z":0.8827},{"x":0.1403,"y":0.4411,"z":0.8864},{"x":-0.0481,"y":0.4099,"z":0.9109},{"x":0.3085,"y":0.3186,"z":0.8962},{"x":0.049,"y":-0.3225,"z":0.9453},{"x":-0.1408,"y":-0.2496,"z":0.958},{"x":0.4429,"y":0.1635,"z":0.8815},{"x":-0.4462,"y":0.192,"z":0.8741},{"x":0.1915,"y":-0.2515,"z":0.9487},{"x":-0.3043,"y":-0.1114,"z":0.946},{"x":0.2894,"y":-0.1017,"z":0.9518},{"x":0.421,"y":-0.0845,"z":0.9031},{"x":-0.4433,"y":-0.0915,"z":0.8916},{"x":-0.2984,"y":0.0771,"z":0.9513},{"x":0.2932,"y":0.0779,"z":0.9528},{"x":0.3497,"y":-0.2524,"z":0.9022},{"x":-0.3894,"y":-0.3653,"z":0.8455},{"x":-0.2137,"y":0.2464,"z":0.9453},{"x":0.2086,"y":0.2469,"z":0.9463},{"x":-0.0821,"y":0.3324,"z":0.9395},{"x":0.049,"y":0.3207,"z":0.9459},{"x":0.191,"y":-0.424,"z":0.8853},{"x":-0.1057,"y":-0.436,"z":0.8937},{"x":-0.2969,"y":0.079,"z":0.9516},{"x":0.3494,"y":-0.2524,"z":0.9023},{"x":-0.1416,"y":0.2458,"z":0.9589},{"x":0.0462,"y":0.3204,"z":0.9461},{"x":0.1909,"y":-0.4235,"z":0.8855},{"x":-0.2722,"y":-0.2811,"z":0.9202},{"x":-0.1091,"y":0.1105,"z":0.9879},{"x":0.2751,"y":0.2796,"z":0.9198},{"x":-0.6118,"y":0.5859,"z":0.5314},{"x":0.2773,"y":-0.275,"z":0.9206},{"x":0.1091,"y":-0.1105,"z":0.9879},{"x":-0.1093,"y":-0.1112,"z":0.9877},{"x":0.6118,"y":-0.5859,"z":0.5314},{"x":-0.6033,"y":-0.5946,"z":0.5315},{"x":0.1601,"y":0.3728,"z":-0.914},{"x":-0.2714,"y":-0.2721,"z":-0.9232},{"x":-0.6087,"y":0.5859,"z":-0.535},{"x":0.0005,"y":0.0122,"z":-0.9999},{"x":0.0004,"y":0.1261,"z":-0.992},{"x":0.2892,"y":0.2811,"z":-0.915},{"x":-0.3723,"y":0.7475,"z":-0.5501},{"x":0.0009,"y":0.0124,"z":-0.9999},{"x":0.2714,"y":-0.2759,"z":-0.9221},{"x":0.606,"y":-0.5887,"z":-0.535},{"x":0,"y":-0.426,"z":-0.9047},{"x":-0.614,"y":-0.5806,"z":-0.5347},{"x":0.2709,"y":0.2732,"z":-0.923},{"x":-0.4137,"y":-0.105,"z":-0.9043},{"x":-0.6075,"y":0.5874,"z":-0.5347},{"x":0.3077,"y":0.0892,"z":-0.9473},{"x":0.2769,"y":0.2699,"z":-0.9222},{"x":-0.2772,"y":0.1094,"z":-0.9545},{"x":-0.6044,"y":0.5908,"z":-0.5344},{"x":0.406,"y":-0.085,"z":-0.9099},{"x":0.1806,"y":0.2485,"z":-0.9516},{"x":0.3311,"y":-0.2954,"z":-0.8961},{"x":-0.3312,"y":-0.2875,"z":-0.8987},{"x":-0.1492,"y":0.2864,"z":-0.9464},{"x":0.0117,"y":0.3412,"z":-0.9399},{"x":-0.1436,"y":-0.4478,"z":-0.8825},{"x":0.1135,"y":-0.4099,"z":-0.905},{"x":0.2723,"y":0.2699,"z":-0.9236},{"x":-0.2999,"y":-0.2963,"z":-0.9067},{"x":-0.607,"y":0.5867,"z":-0.536},{"x":0.11,"y":0.11,"z":-0.9878},{"x":0.275,"y":0.2694,"z":-0.9229},{"x":0.5825,"y":-0.6158,"z":-0.5305},{"x":0.108,"y":-0.1096,"z":-0.9881},{"x":-0.2971,"y":-0.3043,"z":-0.905},{"x":-0.2961,"y":0.3059,"z":-0.9048},{"x":0.0909,"y":0.4029,"z":-0.9107},{"x":0.2989,"y":0.3271,"z":-0.8965},{"x":-0.0767,"y":-0.3273,"z":-0.9418},{"x":0.1067,"y":0.109,"z":-0.9883},{"x":-0.2256,"y":-0.1887,"z":-0.9557},{"x":0.4914,"y":0.0581,"z":-0.869},{"x":-0.307,"y":0.0075,"z":-0.9517},{"x":0.4207,"y":-0.1792,"z":-0.8893},{"x":-0.2509,"y":0.1908,"z":-0.949},{"x":-0.0931,"y":0.3022,"z":-0.9487},{"x":0.2718,"y":-0.3455,"z":-0.8981},{"x":0.0956,"y":-0.4011,"z":-0.911},{"x":0.1076,"y":0.4162,"z":-0.9028},{"x":-0.2614,"y":0.3888,"z":-0.8834},{"x":-0.0605,"y":0.4087,"z":-0.9106},{"x":0.2696,"y":0.3359,"z":-0.9024},{"x":0.0458,"y":-0.3202,"z":-0.9462},{"x":-0.1365,"y":-0.2412,"z":-0.9608},{"x":0.4177,"y":0.1765,"z":-0.8913},{"x":-0.4404,"y":0.1922,"z":-0.877},{"x":0.2078,"y":-0.2527,"z":-0.9449},{"x":-0.2866,"y":-0.1045,"z":-0.9523},{"x":0.3065,"y":-0.1092,"z":-0.9456},{"x":0.4272,"y":-0.0942,"z":-0.8992},{"x":-0.4422,"y":-0.0881,"z":-0.8925},{"x":-0.2905,"y":0.0801,"z":-0.9535},{"x":0.2986,"y":0.0771,"z":-0.9512},{"x":0.3223,"y":-0.2682,"z":-0.9078},{"x":-0.3624,"y":-0.3414,"z":-0.8672},{"x":-0.2336,"y":0.2398,"z":-0.9423},{"x":0.2167,"y":0.2475,"z":-0.9443},{"x":-0.0915,"y":0.3068,"z":-0.9473},{"x":0.0597,"y":0.3132,"z":-0.9478},{"x":0.1901,"y":-0.4482,"z":-0.8735},{"x":-0.0724,"y":-0.4152,"z":-0.9068},{"x":-0.2753,"y":-0.2759,"z":-0.9209},{"x":0.2773,"y":0.275,"z":-0.9206},{"x":-0.1093,"y":0.1112,"z":-0.9877},{"x":-0.6033,"y":0.5946,"z":-0.5315},{"x":0.2751,"y":-0.2796,"z":-0.9198},{"x":0.1093,"y":-0.1112,"z":-0.9877},{"x":-0.1091,"y":-0.1105,"z":-0.9879},{"x":0.6033,"y":-0.5946,"z":-0.5315},{"x":-0.6118,"y":-0.5859,"z":-0.5314},{"x":0.5831,"y":-0.5812,"z":-0.5676},{"x":-0.5856,"y":-0.5792,"z":-0.5671},{"x":-0.6502,"y":-0.6573,"z":-0.3809},{"x":0.5789,"y":0.5789,"z":-0.5742},{"x":0.6485,"y":0.6581,"z":-0.3824},{"x":-0.5831,"y":0.5812,"z":-0.5676},{"x":0.6451,"y":-0.6608,"z":-0.3837},{"x":-0.5831,"y":-0.5812,"z":0.5676},{"x":0.5856,"y":-0.5792,"z":0.5671},{"x":-0.6465,"y":-0.6604,"z":0.3818},{"x":0.6451,"y":0.6608,"z":0.3837},{"x":0.5789,"y":0.5789,"z":0.5742},{"x":-0.5856,"y":0.5792,"z":0.5671},{"x":0.6485,"y":-0.6581,"z":0.3824},{"x":0.309,"y":0.8739,"z":-0.3753},{"x":0.8909,"y":0.2644,"z":-0.3692},{"x":0.668,"y":0.6377,"z":-0.3834},{"x":0.9195,"y":-0.1062,"z":-0.3786},{"x":0.765,"y":-0.514,"z":-0.388},{"x":0.1718,"y":-0.8976,"z":-0.4059},{"x":0.5301,"y":-0.7359,"z":-0.4212},{"x":-0.1912,"y":-0.9006,"z":-0.3902},{"x":-0.8183,"y":-0.398,"z":-0.4147},{"x":-0.5506,"y":-0.7434,"z":-0.3797},{"x":-0.917,"y":-0.0366,"z":-0.3972},{"x":-0.6864,"y":0.5989,"z":-0.4126},{"x":-0.3777,"y":0.8381,"z":-0.3936},{"x":-0.0995,"y":0.9181,"z":-0.3836},{"x":0.5012,"y":0.7715,"z":0.3917},{"x":0.1426,"y":0.9084,"z":0.3929},{"x":0.7763,"y":0.4957,"z":0.3893},{"x":0.9042,"y":0.1484,"z":0.4004},{"x":0.9193,"y":-0.0804,"z":0.3853},{"x":0.8349,"y":-0.3842,"z":0.394},{"x":0.638,"y":-0.6584,"z":0.3992},{"x":0.2887,"y":-0.8868,"z":0.3608},{"x":-0.0842,"y":-0.917,"z":0.3899},{"x":-0.4911,"y":-0.7723,"z":0.4028},{"x":-0.8083,"y":-0.4194,"z":0.4131},{"x":-0.9177,"y":-0.0504,"z":0.3941},{"x":-0.8986,"y":0.2188,"z":0.3804},{"x":-0.6985,"y":0.5838,"z":0.4137},{"x":-0.8977,"y":0.2425,"z":-0.3677},{"x":-0.3966,"y":0.8343,"z":0.3829},{"x":-0.1288,"y":0.9134,"z":0.386},{"x":-0.5643,"y":0.7238,"z":-0.397},{"x":-0.0799,"y":0.922,"z":-0.3789},{"x":-0.7403,"y":-0.5948,"z":-0.3133},{"x":-0.9348,"y":-0.0809,"z":-0.3457},{"x":-0.2324,"y":-0.9037,"z":-0.3595},{"x":0.649,"y":-0.6448,"z":-0.4037},{"x":0.2553,"y":-0.8774,"z":-0.406},{"x":0.8827,"y":-0.2504,"z":-0.3976},{"x":0.6597,"y":0.6355,"z":-0.4011},{"x":0.8731,"y":0.2503,"z":-0.4183},{"x":0.3453,"y":0.8581,"z":-0.38},{"x":-0.6966,"y":0.6389,"z":0.3263},{"x":-0.2228,"y":0.9119,"z":0.3447},{"x":-0.8705,"y":0.2534,"z":0.4218},{"x":-0.8826,"y":-0.2507,"z":0.3976},{"x":-0.6823,"y":-0.6465,"z":0.3412},{"x":-0.2391,"y":-0.899,"z":0.367},{"x":0.2355,"y":-0.8793,"z":0.414},{"x":0.7212,"y":-0.5796,"z":0.3794},{"x":0.9348,"y":-0.0808,"z":0.3458},{"x":0.8408,"y":0.3691,"z":0.3959},{"x":0.6594,"y":0.6394,"z":0.3953},{"x":0.2577,"y":0.8806,"z":0.3977},{"x":-0.7403,"y":-0.5948,"z":-0.3134},{"x":-0.659,"y":0.6362,"z":0.401},{"x":-0.2616,"y":0.8797,"z":0.397},{"x":0.2305,"y":0.8942,"z":-0.3837},{"x":0.8685,"y":0.2974,"z":-0.3966},{"x":0.649,"y":0.6671,"z":-0.3658},{"x":0.7559,"y":-0.5215,"z":-0.3956},{"x":0.1953,"y":-0.9043,"z":-0.3796},{"x":0.4897,"y":-0.7869,"z":-0.3755},{"x":-0.6462,"y":0.6547,"z":-0.3921},{"x":-0.6466,"y":-0.6551,"z":-0.3908},{"x":0.4173,"y":0.8136,"z":0.4048},{"x":0.1236,"y":0.9163,"z":0.3807},{"x":0.7284,"y":0.5582,"z":0.3971},{"x":0.917,"y":0.1867,"z":0.3525},{"x":0.8747,"y":-0.2668,"z":0.4045},{"x":0.8987,"y":-0.1376,"z":-0.4163},{"x":0.6258,"y":-0.6812,"z":0.3799},{"x":0.2213,"y":-0.8991,"z":0.3775},{"x":-0.6459,"y":-0.6556,"z":0.3912},{"x":-0.6481,"y":0.6535,"z":0.391},{"x":-0.3331,"y":0.8486,"z":-0.411},{"x":-0.7544,"y":0.5159,"z":-0.4059},{"x":-0.9016,"y":-0.3018,"z":-0.3099},{"x":-0.905,"y":0.1609,"z":-0.3938},{"x":-0.5659,"y":-0.7268,"z":-0.3892},{"x":0.5705,"y":-0.5856,"z":-0.5758},{"x":-0.1906,"y":-0.8917,"z":-0.4104},{"x":0.5621,"y":0.591,"z":-0.5786},{"x":-0.7363,"y":0.5417,"z":0.4053},{"x":-0.3083,"y":0.8573,"z":0.4123},{"x":-0.9066,"y":0.187,"z":0.3782},{"x":-0.906,"y":-0.2866,"z":0.3114},{"x":-0.5821,"y":-0.7091,"z":0.3979},{"x":-0.2132,"y":-0.8873,"z":0.409},{"x":0.5698,"y":-0.5858,"z":0.5763},{"x":0.563,"y":0.5907,"z":0.578},{"x":0.6615,"y":0.6446,"z":-0.3831},{"x":-0.6518,"y":-0.6522,"z":-0.3869},{"x":0.5789,"y":0.5789,"z":-0.5743},{"x":0.6587,"y":0.6483,"z":0.3818},{"x":-0.6507,"y":-0.6532,"z":0.3871},{"x":0.5789,"y":0.5789,"z":0.5743},{"x":0.903,"y":-0.2094,"z":-0.375},{"x":0.2648,"y":-0.8884,"z":-0.3749},{"x":0.6814,"y":-0.6347,"z":-0.3644},{"x":-0.1308,"y":-0.9167,"z":-0.3775},{"x":-0.5425,"y":-0.7443,"z":-0.3894},{"x":-0.9178,"y":-0.1368,"z":-0.3728},{"x":-0.8103,"y":-0.4456,"z":-0.3806},{"x":0.8555,"y":0.3136,"z":-0.4121},{"x":0.6459,"y":0.6605,"z":-0.3826},{"x":0.0679,"y":0.9116,"z":-0.4053},{"x":-0.3961,"y":0.8214,"z":-0.4103},{"x":-0.7445,"y":0.5406,"z":-0.3917},{"x":-0.9196,"y":0.1207,"z":-0.3739},{"x":0.6521,"y":0.6551,"z":-0.3816},{"x":0.7208,"y":-0.6004,"z":0.3464},{"x":0.89,"y":-0.2428,"z":0.3858},{"x":0.4384,"y":-0.8036,"z":0.4025},{"x":0.1245,"y":-0.9167,"z":0.3795},{"x":-0.1214,"y":-0.9153,"z":0.384},{"x":-0.5255,"y":-0.7551,"z":0.3921},{"x":-0.8023,"y":-0.4604,"z":0.3798},{"x":-0.9167,"y":-0.1511,"z":0.3697},{"x":0.6425,"y":0.663,"z":0.384},{"x":0.8586,"y":0.3055,"z":0.4116},{"x":0.5224,"y":0.7402,"z":0.4232},{"x":0.084,"y":0.9106,"z":0.4045},{"x":0.5059,"y":0.7524,"z":-0.4218},{"x":-0.3813,"y":0.8282,"z":0.4106},{"x":-0.7379,"y":0.5509,"z":0.3898},{"x":-0.9178,"y":0.1259,"z":0.3765},{"x":0.6489,"y":0.6572,"z":0.3832},{"x":0.9479,"y":0.2577,"z":-0.1869},{"x":-0.7958,"y":0.569,"z":-0.2072},{"x":-0.4145,"y":-0.8297,"z":-0.3738},{"x":0.4145,"y":-0.8297,"z":-0.3738},{"x":-0.9479,"y":0.2577,"z":-0.1869},{"x":0.796,"y":0.5681,"z":-0.2088},{"x":-0.0013,"y":0.783,"z":-0.622},{"x":0.3976,"y":0.8442,"z":-0.3594},{"x":0.6481,"y":0.6593,"z":-0.3811},{"x":-0.796,"y":0.5681,"z":0.2088},{"x":0.9479,"y":0.2577,"z":0.1869},{"x":0.4145,"y":-0.8297,"z":0.3738},{"x":-0.4145,"y":-0.8297,"z":0.3738},{"x":-0.9479,"y":0.2577,"z":0.1869},{"x":0.7958,"y":0.569,"z":0.2072},{"x":0.3924,"y":0.8462,"z":0.3605},{"x":-0.0044,"y":0.7834,"z":0.6214},{"x":0.6441,"y":0.6624,"z":0.3825},{"x":-0.8322,"y":0.3954,"z":-0.3887}],"faces":[{"vertices":[3,4,426],"normals":[0,1,2]},{"vertices":[3,2,4],"normals":[0,3,1]},{"vertices":[2,5,4],"normals":[3,4,1]},{"vertices":[5,6,429],"normals":[4,5,6]},{"vertices":[5,0,6],"normals":[4,7,5]},{"vertices":[0,7,6],"normals":[7,8,5]},{"vertices":[3,424,2],"normals":[0,9,3]},{"vertices":[1,5,2],"normals":[10,4,3]},{"vertices":[5,1,0],"normals":[4,10,7]},{"vertices":[417,7,0],"normals":[11,8,7]},{"vertices":[13,14,396],"normals":[12,13,14]},{"vertices":[13,15,14],"normals":[12,15,13]},{"vertices":[19,20,404],"normals":[16,17,18]},{"vertices":[19,8,20],"normals":[16,19,17]},{"vertices":[13,16,15],"normals":[12,20,15]},{"vertices":[19,9,8],"normals":[16,21,19]},{"vertices":[12,16,13],"normals":[22,20,12]},{"vertices":[18,9,19],"normals":[23,21,16]},{"vertices":[12,17,16],"normals":[22,24,20]},{"vertices":[17,9,18],"normals":[24,21,23]},{"vertices":[12,9,17],"normals":[22,21,24]},{"vertices":[11,9,12],"normals":[25,21,22]},{"vertices":[11,10,9],"normals":[25,26,21]},{"vertices":[22,23,370],"normals":[27,28,29]},{"vertices":[22,24,23],"normals":[27,30,28]},{"vertices":[22,21,24],"normals":[27,31,30]},{"vertices":[22,368,21],"normals":[27,32,31]},{"vertices":[31,38,32],"normals":[33,34,35]},{"vertices":[38,25,32],"normals":[34,36,35]},{"vertices":[38,26,25],"normals":[34,37,36]},{"vertices":[38,37,26],"normals":[34,38,37]},{"vertices":[31,39,38],"normals":[33,39,34]},{"vertices":[36,26,37],"normals":[40,37,38]},{"vertices":[36,27,26],"normals":[40,41,37]},{"vertices":[35,27,36],"normals":[42,41,40]},{"vertices":[35,28,27],"normals":[42,43,41]},{"vertices":[34,28,35],"normals":[44,43,42]},{"vertices":[33,28,34],"normals":[45,43,44]},{"vertices":[33,29,28],"normals":[45,46,43]},{"vertices":[31,33,39],"normals":[33,45,39]},{"vertices":[31,29,33],"normals":[33,46,45]},{"vertices":[31,30,29],"normals":[33,47,46]},{"vertices":[50,40,51],"normals":[48,49,50]},{"vertices":[50,41,40],"normals":[48,51,49]},{"vertices":[57,41,50],"normals":[52,51,48]},{"vertices":[56,41,57],"normals":[53,51,52]},{"vertices":[56,42,41],"normals":[53,54,51]},{"vertices":[49,57,50],"normals":[55,52,48]},{"vertices":[49,58,57],"normals":[55,56,52]},{"vertices":[55,42,56],"normals":[57,54,53]},{"vertices":[49,59,58],"normals":[55,58,56]},{"vertices":[55,43,42],"normals":[57,59,54]},{"vertices":[48,59,49],"normals":[60,58,55]},{"vertices":[54,43,55],"normals":[61,59,57]},{"vertices":[48,60,59],"normals":[60,62,58]},{"vertices":[54,44,43],"normals":[61,63,59]},{"vertices":[47,60,48],"normals":[64,62,60]},{"vertices":[53,44,54],"normals":[65,63,61]},{"vertices":[47,61,60],"normals":[64,66,62]},{"vertices":[52,44,53],"normals":[67,63,65]},{"vertices":[47,62,61],"normals":[64,68,66]},{"vertices":[52,45,44],"normals":[67,69,63]},{"vertices":[62,45,52],"normals":[68,69,67]},{"vertices":[47,45,62],"normals":[64,69,68]},{"vertices":[46,45,47],"normals":[70,69,64]},{"vertices":[73,63,74],"normals":[48,49,50]},{"vertices":[73,64,63],"normals":[48,51,49]},{"vertices":[79,64,73],"normals":[52,51,48]},{"vertices":[78,64,79],"normals":[53,51,52]},{"vertices":[78,65,64],"normals":[53,54,51]},{"vertices":[72,79,73],"normals":[55,52,48]},{"vertices":[72,80,79],"normals":[55,56,52]},{"vertices":[77,65,78],"normals":[57,54,53]},{"vertices":[72,81,80],"normals":[55,58,56]},{"vertices":[77,66,65],"normals":[57,59,54]},{"vertices":[71,81,72],"normals":[60,58,55]},{"vertices":[76,66,77],"normals":[71,59,57]},{"vertices":[71,82,81],"normals":[60,62,58]},{"vertices":[76,67,66],"normals":[71,72,59]},{"vertices":[70,82,71],"normals":[64,62,60]},{"vertices":[75,67,76],"normals":[73,72,71]},{"vertices":[70,83,82],"normals":[64,66,62]},{"vertices":[70,84,83],"normals":[64,74,66]},{"vertices":[75,68,67],"normals":[73,75,72]},{"vertices":[84,68,75],"normals":[74,75,73]},{"vertices":[70,68,84],"normals":[64,75,74]},{"vertices":[69,68,70],"normals":[70,75,64]},{"vertices":[87,88,212],"normals":[76,28,29]},{"vertices":[87,89,88],"normals":[76,30,28]},{"vertices":[90,91,216],"normals":[77,78,79]},{"vertices":[90,92,91],"normals":[77,80,78]},{"vertices":[87,86,89],"normals":[76,81,30]},{"vertices":[86,90,89],"normals":[81,77,30]},{"vertices":[86,85,90],"normals":[81,82,77]},{"vertices":[85,92,90],"normals":[82,80,77]},{"vertices":[87,210,86],"normals":[76,83,81]},{"vertices":[207,92,85],"normals":[84,80,82]},{"vertices":[100,98,99],"normals":[85,86,87]},{"vertices":[96,98,100],"normals":[88,86,85]},{"vertices":[101,96,100],"normals":[89,88,85]},{"vertices":[103,101,102],"normals":[90,89,91]},{"vertices":[94,101,103],"normals":[92,89,90]},{"vertices":[104,94,103],"normals":[93,92,90]},{"vertices":[97,98,96],"normals":[94,86,88]},{"vertices":[101,95,96],"normals":[89,95,88]},{"vertices":[95,101,94],"normals":[95,89,92]},{"vertices":[104,93,94],"normals":[93,96,92]},{"vertices":[112,110,111],"normals":[97,98,99]},{"vertices":[113,110,112],"normals":[100,98,97]},{"vertices":[119,117,118],"normals":[101,102,103]},{"vertices":[105,117,119],"normals":[104,102,101]},{"vertices":[114,110,113],"normals":[105,98,100]},{"vertices":[106,117,105],"normals":[106,102,104]},{"vertices":[114,109,110],"normals":[105,107,98]},{"vertices":[106,116,117],"normals":[106,108,102]},{"vertices":[115,109,114],"normals":[109,107,105]},{"vertices":[106,115,116],"normals":[106,109,108]},{"vertices":[106,109,115],"normals":[106,107,109]},{"vertices":[106,108,109],"normals":[106,110,107]},{"vertices":[107,108,106],"normals":[111,110,106]},{"vertices":[124,122,123],"normals":[112,113,114]},{"vertices":[125,122,124],"normals":[115,113,112]},{"vertices":[120,122,125],"normals":[116,113,115]},{"vertices":[121,122,120],"normals":[117,113,116]},{"vertices":[139,132,133],"normals":[118,119,120]},{"vertices":[126,139,133],"normals":[121,118,120]},{"vertices":[127,139,126],"normals":[122,118,121]},{"vertices":[138,139,127],"normals":[123,118,122]},{"vertices":[140,132,139],"normals":[124,119,118]},{"vertices":[127,137,138],"normals":[122,125,123]},{"vertices":[128,137,127],"normals":[126,125,122]},{"vertices":[128,136,137],"normals":[126,127,125]},{"vertices":[129,136,128],"normals":[128,127,126]},{"vertices":[129,135,136],"normals":[128,129,127]},{"vertices":[129,134,135],"normals":[128,130,129]},{"vertices":[130,134,129],"normals":[131,130,128]},{"vertices":[134,132,140],"normals":[130,119,124]},{"vertices":[130,132,134],"normals":[131,119,130]},{"vertices":[131,132,130],"normals":[132,119,131]},{"vertices":[141,151,152],"normals":[133,134,135]},{"vertices":[142,151,141],"normals":[136,134,133]},{"vertices":[142,158,151],"normals":[136,137,134]},{"vertices":[142,157,158],"normals":[136,138,137]},{"vertices":[143,157,142],"normals":[139,138,136]},{"vertices":[158,150,151],"normals":[137,140,134]},{"vertices":[159,150,158],"normals":[141,140,137]},{"vertices":[143,156,157],"normals":[139,142,138]},{"vertices":[160,150,159],"normals":[143,140,141]},{"vertices":[144,156,143],"normals":[144,142,139]},{"vertices":[160,149,150],"normals":[143,145,140]},{"vertices":[144,155,156],"normals":[144,146,142]},{"vertices":[161,149,160],"normals":[147,145,143]},{"vertices":[145,155,144],"normals":[148,146,144]},{"vertices":[161,148,149],"normals":[147,149,145]},{"vertices":[145,154,155],"normals":[148,150,146]},{"vertices":[162,148,161],"normals":[151,149,147]},{"vertices":[145,153,154],"normals":[148,152,150]},{"vertices":[163,148,162],"normals":[153,149,151]},{"vertices":[146,153,145],"normals":[154,152,148]},{"vertices":[146,163,153],"normals":[154,153,152]},{"vertices":[146,148,163],"normals":[154,149,153]},{"vertices":[146,147,148],"normals":[154,155,149]},{"vertices":[164,174,175],"normals":[133,134,135]},{"vertices":[165,174,164],"normals":[136,134,133]},{"vertices":[165,181,174],"normals":[136,137,134]},{"vertices":[165,180,181],"normals":[136,138,137]},{"vertices":[166,180,165],"normals":[139,138,136]},{"vertices":[181,173,174],"normals":[137,140,134]},{"vertices":[182,173,181],"normals":[141,140,137]},{"vertices":[166,179,180],"normals":[139,142,138]},{"vertices":[183,173,182],"normals":[143,140,141]},{"vertices":[167,179,166],"normals":[144,142,139]},{"vertices":[183,172,173],"normals":[143,145,140]},{"vertices":[167,178,179],"normals":[144,146,142]},{"vertices":[184,172,183],"normals":[147,145,143]},{"vertices":[168,178,167],"normals":[148,146,144]},{"vertices":[184,171,172],"normals":[147,149,145]},{"vertices":[168,177,178],"normals":[148,150,146]},{"vertices":[185,171,184],"normals":[151,149,147]},{"vertices":[168,176,177],"normals":[148,152,150]},{"vertices":[186,171,185],"normals":[153,149,151]},{"vertices":[169,176,168],"normals":[154,152,148]},{"vertices":[169,186,176],"normals":[154,153,152]},{"vertices":[169,171,186],"normals":[154,149,153]},{"vertices":[169,170,171],"normals":[154,155,149]},{"vertices":[193,191,192],"normals":[112,156,114]},{"vertices":[194,191,193],"normals":[115,156,112]},{"vertices":[197,195,196],"normals":[157,158,159]},{"vertices":[198,195,197],"normals":[160,158,157]},{"vertices":[189,191,194],"normals":[161,156,115]},{"vertices":[195,189,194],"normals":[158,161,115]},{"vertices":[188,189,195],"normals":[162,161,158]},{"vertices":[198,188,195],"normals":[160,162,158]},{"vertices":[190,191,189],"normals":[163,156,161]},{"vertices":[198,187,188],"normals":[160,164,162]},{"vertices":[200,188,199],"normals":[165,162,166]},{"vertices":[200,190,189],"normals":[165,163,161]},{"vertices":[192,191,201],"normals":[114,156,167]},{"vertices":[203,193,202],"normals":[168,112,169]},{"vertices":[203,195,194],"normals":[168,158,115]},{"vertices":[204,196,195],"normals":[170,159,158]},{"vertices":[206,197,205],"normals":[171,157,169]},{"vertices":[187,198,206],"normals":[164,160,171]},{"vertices":[208,187,207],"normals":[172,164,84]},{"vertices":[209,199,208],"normals":[173,166,172]},{"vertices":[210,200,209],"normals":[83,165,173]},{"vertices":[211,190,210],"normals":[174,163,83]},{"vertices":[212,201,211],"normals":[29,167,174]},{"vertices":[213,192,212],"normals":[175,114,29]},{"vertices":[214,202,213],"normals":[176,169,175]},{"vertices":[215,203,214],"normals":[177,168,176]},{"vertices":[216,204,215],"normals":[79,170,177]},{"vertices":[217,196,216],"normals":[175,159,79]},{"vertices":[218,205,217],"normals":[178,169,175]},{"vertices":[207,206,218],"normals":[84,171,178]},{"vertices":[85,209,208],"normals":[82,173,172]},{"vertices":[210,209,86],"normals":[83,173,81]},{"vertices":[212,211,87],"normals":[29,174,76]},{"vertices":[88,214,213],"normals":[28,176,175]},{"vertices":[90,214,89],"normals":[77,176,30]},{"vertices":[216,215,90],"normals":[79,177,77]},{"vertices":[92,217,91],"normals":[80,175,78]},{"vertices":[207,218,92],"normals":[84,178,80]},{"vertices":[219,165,164],"normals":[179,136,133]},{"vertices":[221,166,220],"normals":[180,139,181]},{"vertices":[222,166,221],"normals":[182,139,180]},{"vertices":[223,168,167],"normals":[183,148,144]},{"vertices":[223,169,168],"normals":[183,154,148]},{"vertices":[225,169,224],"normals":[184,154,185]},{"vertices":[226,169,225],"normals":[186,154,184]},{"vertices":[226,171,170],"normals":[186,149,155]},{"vertices":[228,171,227],"normals":[187,149,188]},{"vertices":[229,172,228],"normals":[189,145,187]},{"vertices":[229,173,172],"normals":[189,140,145]},{"vertices":[231,174,173],"normals":[190,134,140]},{"vertices":[232,174,231],"normals":[191,134,190]},{"vertices":[233,174,232],"normals":[192,134,191]},{"vertices":[233,164,175],"normals":[192,133,135]},{"vertices":[235,219,234],"normals":[193,179,194]},{"vertices":[236,220,235],"normals":[195,181,193]},{"vertices":[237,221,236],"normals":[196,180,195]},{"vertices":[238,221,237],"normals":[197,180,196]},{"vertices":[239,222,238],"normals":[198,182,197]},{"vertices":[240,223,239],"normals":[199,183,198]},{"vertices":[241,224,240],"normals":[200,185,199]},{"vertices":[242,225,241],"normals":[201,184,200]},{"vertices":[243,226,242],"normals":[202,186,201]},{"vertices":[244,227,243],"normals":[203,188,202]},{"vertices":[245,228,244],"normals":[204,187,203]},{"vertices":[246,229,245],"normals":[205,189,204]},{"vertices":[247,230,246],"normals":[206,207,205]},{"vertices":[248,231,247],"normals":[208,190,206]},{"vertices":[249,232,248],"normals":[209,191,208]},{"vertices":[234,233,249],"normals":[194,192,209]},{"vertices":[64,235,63],"normals":[51,193,49]},{"vertices":[64,236,235],"normals":[51,195,193]},{"vertices":[65,237,236],"normals":[54,196,195]},{"vertices":[65,238,237],"normals":[54,197,196]},{"vertices":[67,239,66],"normals":[72,198,59]},{"vertices":[68,240,67],"normals":[75,199,72]},{"vertices":[68,241,240],"normals":[75,200,199]},{"vertices":[68,242,241],"normals":[75,201,200]},{"vertices":[70,243,69],"normals":[64,202,70]},{"vertices":[70,244,243],"normals":[64,203,202]},{"vertices":[71,245,244],"normals":[60,204,203]},{"vertices":[72,245,71],"normals":[55,204,60]},{"vertices":[73,247,72],"normals":[48,206,55]},{"vertices":[73,248,247],"normals":[48,208,206]},{"vertices":[73,249,248],"normals":[48,209,208]},{"vertices":[63,249,74],"normals":[49,209,50]},{"vertices":[251,176,250],"normals":[210,152,211]},{"vertices":[251,178,177],"normals":[210,146,150]},{"vertices":[254,179,253],"normals":[212,142,213]},{"vertices":[255,181,180],"normals":[214,137,138]},{"vertices":[257,182,256],"normals":[215,141,216]},{"vertices":[257,183,182],"normals":[215,143,141]},{"vertices":[258,184,183],"normals":[217,147,143]},{"vertices":[260,184,259],"normals":[218,147,219]},{"vertices":[261,186,185],"normals":[220,153,151]},{"vertices":[263,251,262],"normals":[221,210,222]},{"vertices":[264,251,263],"normals":[223,210,221]},{"vertices":[265,253,264],"normals":[224,213,223]},{"vertices":[266,254,265],"normals":[225,212,224]},{"vertices":[267,254,266],"normals":[226,212,225]},{"vertices":[268,255,267],"normals":[227,214,226]},{"vertices":[269,256,268],"normals":[228,216,227]},{"vertices":[270,258,269],"normals":[229,217,228]},{"vertices":[271,259,270],"normals":[230,219,229]},{"vertices":[272,259,271],"normals":[231,219,230]},{"vertices":[273,260,272],"normals":[232,218,231]},{"vertices":[262,250,273],"normals":[222,211,232]},{"vertices":[75,263,262],"normals":[73,221,222]},{"vertices":[76,263,75],"normals":[71,221,73]},{"vertices":[76,265,264],"normals":[71,224,223]},{"vertices":[77,266,265],"normals":[57,225,224]},{"vertices":[79,267,78],"normals":[52,226,53]},{"vertices":[80,269,268],"normals":[56,228,227]},{"vertices":[81,269,80],"normals":[58,228,56]},{"vertices":[82,270,81],"normals":[62,229,58]},{"vertices":[82,271,270],"normals":[62,230,229]},{"vertices":[82,272,271],"normals":[62,231,230]},{"vertices":[84,273,83],"normals":[74,232,66]},{"vertices":[84,262,273],"normals":[74,222,232]},{"vertices":[274,142,141],"normals":[179,136,133]},{"vertices":[276,143,275],"normals":[180,139,181]},{"vertices":[277,143,276],"normals":[182,139,180]},{"vertices":[278,145,144],"normals":[183,148,144]},{"vertices":[278,146,145],"normals":[183,154,148]},{"vertices":[280,146,279],"normals":[184,154,185]},{"vertices":[281,146,280],"normals":[186,154,184]},{"vertices":[281,148,147],"normals":[186,149,155]},{"vertices":[283,148,282],"normals":[187,149,188]},{"vertices":[284,149,283],"normals":[189,145,187]},{"vertices":[284,150,149],"normals":[189,140,145]},{"vertices":[286,151,150],"normals":[190,134,140]},{"vertices":[287,151,286],"normals":[191,134,190]},{"vertices":[288,151,287],"normals":[192,134,191]},{"vertices":[288,141,152],"normals":[192,133,135]},{"vertices":[290,274,289],"normals":[193,179,194]},{"vertices":[291,275,290],"normals":[195,181,193]},{"vertices":[292,276,291],"normals":[196,180,195]},{"vertices":[293,276,292],"normals":[197,180,196]},{"vertices":[294,277,293],"normals":[198,182,197]},{"vertices":[295,278,294],"normals":[199,183,198]},{"vertices":[296,279,295],"normals":[200,185,199]},{"vertices":[297,280,296],"normals":[201,184,200]},{"vertices":[298,281,297],"normals":[202,186,201]},{"vertices":[299,282,298],"normals":[203,188,202]},{"vertices":[300,283,299],"normals":[204,187,203]},{"vertices":[301,284,300],"normals":[205,189,204]},{"vertices":[302,285,301],"normals":[206,207,205]},{"vertices":[303,286,302],"normals":[208,190,206]},{"vertices":[304,287,303],"normals":[209,191,208]},{"vertices":[289,288,304],"normals":[194,192,209]},{"vertices":[41,290,40],"normals":[51,193,49]},{"vertices":[41,291,290],"normals":[51,195,193]},{"vertices":[42,292,291],"normals":[54,196,195]},{"vertices":[42,293,292],"normals":[54,197,196]},{"vertices":[44,294,43],"normals":[63,198,59]},{"vertices":[45,295,44],"normals":[69,199,63]},{"vertices":[45,296,295],"normals":[69,200,199]},{"vertices":[45,297,296],"normals":[69,201,200]},{"vertices":[47,298,46],"normals":[64,202,70]},{"vertices":[47,299,298],"normals":[64,203,202]},{"vertices":[48,300,299],"normals":[60,204,203]},{"vertices":[49,300,48],"normals":[55,204,60]},{"vertices":[50,302,49],"normals":[48,206,55]},{"vertices":[50,303,302],"normals":[48,208,206]},{"vertices":[50,304,303],"normals":[48,209,208]},{"vertices":[40,304,51],"normals":[49,209,50]},{"vertices":[306,153,305],"normals":[210,152,211]},{"vertices":[306,155,154],"normals":[210,146,150]},{"vertices":[309,156,308],"normals":[233,142,213]},{"vertices":[310,158,157],"normals":[214,137,138]},{"vertices":[312,159,311],"normals":[215,141,216]},{"vertices":[312,160,159],"normals":[215,143,141]},{"vertices":[313,161,160],"normals":[217,147,143]},{"vertices":[315,161,314],"normals":[218,147,219]},{"vertices":[316,163,162],"normals":[220,153,151]},{"vertices":[318,306,317],"normals":[234,210,235]},{"vertices":[319,306,318],"normals":[223,210,234]},{"vertices":[320,308,319],"normals":[224,213,223]},{"vertices":[321,309,320],"normals":[225,233,224]},{"vertices":[322,309,321],"normals":[226,233,225]},{"vertices":[323,310,322],"normals":[227,214,226]},{"vertices":[324,311,323],"normals":[228,216,227]},{"vertices":[325,313,324],"normals":[229,217,228]},{"vertices":[326,314,325],"normals":[230,219,229]},{"vertices":[327,314,326],"normals":[231,219,230]},{"vertices":[328,315,327],"normals":[232,218,231]},{"vertices":[317,305,328],"normals":[235,211,232]},{"vertices":[53,318,317],"normals":[65,234,235]},{"vertices":[54,318,53],"normals":[61,234,65]},{"vertices":[54,320,319],"normals":[61,224,223]},{"vertices":[55,321,320],"normals":[57,225,224]},{"vertices":[57,322,56],"normals":[52,226,53]},{"vertices":[58,324,323],"normals":[56,228,227]},{"vertices":[59,324,58],"normals":[58,228,56]},{"vertices":[60,325,59],"normals":[62,229,58]},{"vertices":[60,326,325],"normals":[62,230,229]},{"vertices":[60,327,326],"normals":[62,231,230]},{"vertices":[62,328,61],"normals":[68,232,66]},{"vertices":[62,317,328],"normals":[68,235,232]},{"vertices":[329,127,126],"normals":[236,122,121]},{"vertices":[331,127,330],"normals":[237,122,238]},{"vertices":[333,130,129],"normals":[239,131,128]},{"vertices":[335,130,334],"normals":[240,131,241]},{"vertices":[335,132,131],"normals":[240,119,132]},{"vertices":[337,132,336],"normals":[242,119,243]},{"vertices":[329,133,337],"normals":[236,120,242]},{"vertices":[339,329,338],"normals":[244,236,245]},{"vertices":[340,330,339],"normals":[246,238,244]},{"vertices":[341,331,340],"normals":[247,237,246]},{"vertices":[342,332,341],"normals":[248,249,247]},{"vertices":[343,333,342],"normals":[250,239,248]},{"vertices":[344,334,343],"normals":[251,241,250]},{"vertices":[345,335,344],"normals":[252,240,251]},{"vertices":[346,336,345],"normals":[253,243,252]},{"vertices":[338,337,346],"normals":[245,242,253]},{"vertices":[26,339,25],"normals":[37,244,36]},{"vertices":[26,340,339],"normals":[37,246,244]},{"vertices":[27,341,340],"normals":[41,247,246]},{"vertices":[29,343,28],"normals":[46,250,43]},{"vertices":[29,344,343],"normals":[46,251,250]},{"vertices":[31,344,30],"normals":[33,251,47]},{"vertices":[32,345,31],"normals":[35,252,33]},{"vertices":[32,338,346],"normals":[35,245,253]},{"vertices":[347,135,134],"normals":[254,129,130]},{"vertices":[348,136,135],"normals":[255,127,129]},{"vertices":[350,136,349],"normals":[256,127,257]},{"vertices":[351,137,350],"normals":[258,125,256]},{"vertices":[351,138,137],"normals":[258,123,125]},{"vertices":[353,138,352],"normals":[259,123,260]},{"vertices":[354,139,353],"normals":[261,118,259]},{"vertices":[354,134,140],"normals":[261,130,124]},{"vertices":[356,347,355],"normals":[262,254,263]},{"vertices":[357,348,356],"normals":[264,255,262]},{"vertices":[358,349,357],"normals":[265,257,264]},{"vertices":[359,350,358],"normals":[266,256,265]},{"vertices":[360,351,359],"normals":[267,258,266]},{"vertices":[361,352,360],"normals":[268,260,267]},{"vertices":[362,353,361],"normals":[269,259,268]},{"vertices":[355,354,362],"normals":[263,261,269]},{"vertices":[34,355,33],"normals":[44,263,45]},{"vertices":[35,356,34],"normals":[42,262,44]},{"vertices":[35,358,357],"normals":[42,265,264]},{"vertices":[36,359,358],"normals":[40,266,265]},{"vertices":[37,359,36],"normals":[38,266,40]},{"vertices":[37,361,360],"normals":[38,268,267]},{"vertices":[38,362,361],"normals":[34,269,268]},{"vertices":[33,362,39],"normals":[45,269,39]},{"vertices":[121,120,363],"normals":[117,116,270]},{"vertices":[123,122,364],"normals":[114,113,271]},{"vertices":[366,124,365],"normals":[272,112,169]},{"vertices":[366,120,125],"normals":[272,116,115]},{"vertices":[368,363,367],"normals":[32,270,273]},{"vertices":[369,121,368],"normals":[274,117,32]},{"vertices":[370,364,369],"normals":[29,271,274]},{"vertices":[371,123,370],"normals":[175,114,29]},{"vertices":[372,365,371],"normals":[275,169,175]},{"vertices":[367,366,372],"normals":[273,272,275]},{"vertices":[368,367,21],"normals":[32,273,31]},{"vertices":[370,369,22],"normals":[29,274,27]},{"vertices":[23,372,371],"normals":[28,275,175]},{"vertices":[21,372,24],"normals":[31,275,30]},{"vertices":[373,106,105],"normals":[276,106,104]},{"vertices":[375,106,374],"normals":[277,106,278]},{"vertices":[376,107,375],"normals":[279,111,277]},{"vertices":[377,109,108],"normals":[280,107,110]},{"vertices":[379,110,378],"normals":[281,98,282]},{"vertices":[379,111,110],"normals":[281,99,98]},{"vertices":[381,112,380],"normals":[283,97,284]},{"vertices":[381,114,113],"normals":[283,105,100]},{"vertices":[383,115,114],"normals":[285,109,105]},{"vertices":[384,115,383],"normals":[286,109,285]},{"vertices":[385,116,384],"normals":[287,108,286]},{"vertices":[386,118,117],"normals":[288,103,102]},{"vertices":[373,119,387],"normals":[276,101,289]},{"vertices":[389,374,388],"normals":[290,278,291]},{"vertices":[390,374,389],"normals":[292,278,290]},{"vertices":[391,375,390],"normals":[293,277,292]},{"vertices":[392,375,391],"normals":[294,277,293]},{"vertices":[393,376,392],"normals":[295,279,294]},{"vertices":[394,377,393],"normals":[296,280,295]},{"vertices":[395,378,394],"normals":[297,282,296]},{"vertices":[396,379,395],"normals":[14,281,297]},{"vertices":[397,111,396],"normals":[298,99,14]},{"vertices":[398,380,397],"normals":[299,284,298]},{"vertices":[399,381,398],"normals":[300,283,299]},{"vertices":[400,382,399],"normals":[301,302,300]},{"vertices":[401,383,400],"normals":[303,285,301]},{"vertices":[402,384,401],"normals":[304,286,303]},{"vertices":[403,385,402],"normals":[305,287,304]},{"vertices":[404,386,403],"normals":[18,288,305]},{"vertices":[405,118,404],"normals":[306,103,18]},{"vertices":[388,387,405],"normals":[291,289,306]},{"vertices":[9,388,8],"normals":[21,291,19]},{"vertices":[9,390,389],"normals":[21,292,290]},{"vertices":[10,391,390],"normals":[26,293,292]},{"vertices":[10,392,391],"normals":[26,294,293]},{"vertices":[12,393,11],"normals":[22,295,25]},{"vertices":[13,395,394],"normals":[12,297,296]},{"vertices":[396,395,13],"normals":[14,297,12]},{"vertices":[14,398,397],"normals":[13,299,298]},{"vertices":[16,398,15],"normals":[20,299,15]},{"vertices":[17,400,16],"normals":[24,301,20]},{"vertices":[17,401,400],"normals":[24,303,301]},{"vertices":[18,402,401],"normals":[23,304,303]},{"vertices":[404,403,19],"normals":[18,305,16]},{"vertices":[20,388,405],"normals":[17,291,306]},{"vertices":[407,94,406],"normals":[307,92,308]},{"vertices":[407,95,94],"normals":[307,95,92]},{"vertices":[409,95,408],"normals":[309,95,310]},{"vertices":[410,95,409],"normals":[311,95,309]},{"vertices":[411,97,96],"normals":[312,94,88]},{"vertices":[99,98,412],"normals":[87,86,167]},{"vertices":[414,100,413],"normals":[313,85,314]},{"vertices":[414,102,101],"normals":[313,91,89]},{"vertices":[416,103,415],"normals":[171,90,315]},{"vertices":[93,104,416],"normals":[96,93,171]},{"vertices":[418,93,417],"normals":[316,96,11]},{"vertices":[419,406,418],"normals":[317,308,316]},{"vertices":[420,407,419],"normals":[318,307,317]},{"vertices":[421,408,420],"normals":[319,310,318]},{"vertices":[422,409,421],"normals":[320,309,319]},{"vertices":[423,410,422],"normals":[321,311,320]},{"vertices":[424,411,423],"normals":[9,312,321]},{"vertices":[425,97,424],"normals":[174,94,9]},{"vertices":[426,412,425],"normals":[2,167,174]},{"vertices":[427,99,426],"normals":[322,87,2]},{"vertices":[428,413,427],"normals":[323,314,322]},{"vertices":[429,414,428],"normals":[6,313,323]},{"vertices":[430,102,429],"normals":[324,91,6]},{"vertices":[431,415,430],"normals":[178,315,324]},{"vertices":[417,416,431],"normals":[11,171,178]},{"vertices":[0,419,418],"normals":[7,317,316]},{"vertices":[1,419,0],"normals":[10,317,7]},{"vertices":[1,422,421],"normals":[10,320,319]},{"vertices":[424,423,2],"normals":[9,321,3]},{"vertices":[426,425,3],"normals":[2,174,0]},{"vertices":[4,428,427],"normals":[1,323,322]},{"vertices":[429,428,5],"normals":[6,323,4]},{"vertices":[7,430,6],"normals":[8,324,5]},{"vertices":[417,431,7],"normals":[11,178,8]},{"vertices":[199,188,187],"normals":[166,162,164]},{"vertices":[200,189,188],"normals":[165,161,162]},{"vertices":[201,191,190],"normals":[167,156,163]},{"vertices":[202,193,192],"normals":[169,112,114]},{"vertices":[203,194,193],"normals":[168,115,112]},{"vertices":[203,204,195],"normals":[168,170,158]},{"vertices":[205,197,196],"normals":[169,157,159]},{"vertices":[206,198,197],"normals":[171,160,157]},{"vertices":[208,199,187],"normals":[172,166,164]},{"vertices":[209,200,199],"normals":[173,165,166]},{"vertices":[210,190,200],"normals":[83,163,165]},{"vertices":[211,201,190],"normals":[174,167,163]},{"vertices":[212,192,201],"normals":[29,114,167]},{"vertices":[213,202,192],"normals":[175,169,114]},{"vertices":[214,203,202],"normals":[176,168,169]},{"vertices":[215,204,203],"normals":[177,170,168]},{"vertices":[216,196,204],"normals":[79,159,170]},{"vertices":[217,205,196],"normals":[175,169,159]},{"vertices":[218,206,205],"normals":[178,171,169]},{"vertices":[207,187,206],"normals":[84,164,171]},{"vertices":[207,85,208],"normals":[84,82,172]},{"vertices":[85,86,209],"normals":[82,81,173]},{"vertices":[87,211,210],"normals":[76,174,83]},{"vertices":[88,213,212],"normals":[28,175,29]},{"vertices":[88,89,214],"normals":[28,30,176]},{"vertices":[90,215,214],"normals":[77,177,176]},{"vertices":[91,217,216],"normals":[78,175,79]},{"vertices":[92,218,217],"normals":[80,178,175]},{"vertices":[219,220,165],"normals":[179,181,136]},{"vertices":[220,166,165],"normals":[181,139,136]},{"vertices":[222,167,166],"normals":[182,144,139]},{"vertices":[222,223,167],"normals":[182,183,144]},{"vertices":[223,224,169],"normals":[183,185,154]},{"vertices":[226,170,169],"normals":[186,155,154]},{"vertices":[226,227,171],"normals":[186,188,149]},{"vertices":[228,172,171],"normals":[187,145,149]},{"vertices":[229,230,173],"normals":[189,207,140]},{"vertices":[230,231,173],"normals":[207,190,140]},{"vertices":[233,175,174],"normals":[192,135,134]},{"vertices":[233,219,164],"normals":[192,179,133]},{"vertices":[235,220,219],"normals":[193,181,179]},{"vertices":[236,221,220],"normals":[195,180,181]},{"vertices":[238,222,221],"normals":[197,182,180]},{"vertices":[239,223,222],"normals":[198,183,182]},{"vertices":[240,224,223],"normals":[199,185,183]},{"vertices":[241,225,224],"normals":[200,184,185]},{"vertices":[242,226,225],"normals":[201,186,184]},{"vertices":[243,227,226],"normals":[202,188,186]},{"vertices":[244,228,227],"normals":[203,187,188]},{"vertices":[245,229,228],"normals":[204,189,187]},{"vertices":[246,230,229],"normals":[205,207,189]},{"vertices":[247,231,230],"normals":[206,190,207]},{"vertices":[248,232,231],"normals":[208,191,190]},{"vertices":[249,233,232],"normals":[209,192,191]},{"vertices":[234,219,233],"normals":[194,179,192]},{"vertices":[63,235,234],"normals":[49,193,194]},{"vertices":[64,65,236],"normals":[51,54,195]},{"vertices":[65,66,238],"normals":[54,59,197]},{"vertices":[66,239,238],"normals":[59,198,197]},{"vertices":[67,240,239],"normals":[72,199,198]},{"vertices":[68,69,242],"normals":[75,70,201]},{"vertices":[69,243,242],"normals":[70,202,201]},{"vertices":[70,71,244],"normals":[64,60,203]},{"vertices":[72,246,245],"normals":[55,205,204]},{"vertices":[72,247,246],"normals":[55,206,205]},{"vertices":[73,74,249],"normals":[48,50,209]},{"vertices":[63,234,249],"normals":[49,194,209]},{"vertices":[251,177,176],"normals":[210,150,152]},{"vertices":[251,252,178],"normals":[210,325,146]},{"vertices":[252,253,178],"normals":[325,213,146]},{"vertices":[253,179,178],"normals":[213,142,146]},{"vertices":[254,180,179],"normals":[212,138,142]},{"vertices":[254,255,180],"normals":[212,214,138]},{"vertices":[255,256,181],"normals":[214,216,137]},{"vertices":[256,182,181],"normals":[216,141,137]},{"vertices":[257,258,183],"normals":[215,217,143]},{"vertices":[258,259,184],"normals":[217,219,147]},{"vertices":[260,185,184],"normals":[218,151,147]},{"vertices":[260,261,185],"normals":[218,220,151]},{"vertices":[261,250,186],"normals":[220,211,153]},{"vertices":[250,176,186],"normals":[211,152,153]},{"vertices":[262,251,250],"normals":[222,210,211]},{"vertices":[264,252,251],"normals":[223,325,210]},{"vertices":[264,253,252],"normals":[223,213,325]},{"vertices":[265,254,253],"normals":[224,212,213]},{"vertices":[267,255,254],"normals":[226,214,212]},{"vertices":[268,256,255],"normals":[227,216,214]},{"vertices":[269,257,256],"normals":[228,215,216]},{"vertices":[269,258,257],"normals":[228,217,215]},{"vertices":[270,259,258],"normals":[229,219,217]},{"vertices":[272,260,259],"normals":[231,218,219]},{"vertices":[273,261,260],"normals":[232,220,218]},{"vertices":[273,250,261],"normals":[232,211,220]},{"vertices":[76,264,263],"normals":[71,223,221]},{"vertices":[76,77,265],"normals":[71,57,224]},{"vertices":[77,78,266],"normals":[57,53,225]},{"vertices":[78,267,266],"normals":[53,226,225]},{"vertices":[79,268,267],"normals":[52,227,226]},{"vertices":[79,80,268],"normals":[52,56,227]},{"vertices":[81,270,269],"normals":[58,229,228]},{"vertices":[82,83,272],"normals":[62,66,231]},{"vertices":[83,273,272],"normals":[66,232,231]},{"vertices":[84,75,262],"normals":[74,73,222]},{"vertices":[274,275,142],"normals":[179,181,136]},{"vertices":[275,143,142],"normals":[181,139,136]},{"vertices":[277,144,143],"normals":[182,144,139]},{"vertices":[277,278,144],"normals":[182,183,144]},{"vertices":[278,279,146],"normals":[183,185,154]},{"vertices":[281,147,146],"normals":[186,155,154]},{"vertices":[281,282,148],"normals":[186,188,149]},{"vertices":[283,149,148],"normals":[187,145,149]},{"vertices":[284,285,150],"normals":[189,207,140]},{"vertices":[285,286,150],"normals":[207,190,140]},{"vertices":[288,152,151],"normals":[192,135,134]},{"vertices":[288,274,141],"normals":[192,179,133]},{"vertices":[290,275,274],"normals":[193,181,179]},{"vertices":[291,276,275],"normals":[195,180,181]},{"vertices":[293,277,276],"normals":[197,182,180]},{"vertices":[294,278,277],"normals":[198,183,182]},{"vertices":[295,279,278],"normals":[199,185,183]},{"vertices":[296,280,279],"normals":[200,184,185]},{"vertices":[297,281,280],"normals":[201,186,184]},{"vertices":[298,282,281],"normals":[202,188,186]},{"vertices":[299,283,282],"normals":[203,187,188]},{"vertices":[300,284,283],"normals":[204,189,187]},{"vertices":[301,285,284],"normals":[205,207,189]},{"vertices":[302,286,285],"normals":[206,190,207]},{"vertices":[303,287,286],"normals":[208,191,190]},{"vertices":[304,288,287],"normals":[209,192,191]},{"vertices":[289,274,288],"normals":[194,179,192]},{"vertices":[40,290,289],"normals":[49,193,194]},{"vertices":[41,42,291],"normals":[51,54,195]},{"vertices":[42,43,293],"normals":[54,59,197]},{"vertices":[43,294,293],"normals":[59,198,197]},{"vertices":[44,295,294],"normals":[63,199,198]},{"vertices":[45,46,297],"normals":[69,70,201]},{"vertices":[46,298,297],"normals":[70,202,201]},{"vertices":[47,48,299],"normals":[64,60,203]},{"vertices":[49,301,300],"normals":[55,205,204]},{"vertices":[49,302,301],"normals":[55,206,205]},{"vertices":[50,51,304],"normals":[48,50,209]},{"vertices":[40,289,304],"normals":[49,194,209]},{"vertices":[306,154,153],"normals":[210,150,152]},{"vertices":[306,307,155],"normals":[210,325,146]},{"vertices":[307,308,155],"normals":[325,213,146]},{"vertices":[308,156,155],"normals":[213,142,146]},{"vertices":[309,157,156],"normals":[233,138,142]},{"vertices":[309,310,157],"normals":[233,214,138]},{"vertices":[310,311,158],"normals":[214,216,137]},{"vertices":[311,159,158],"normals":[216,141,137]},{"vertices":[312,313,160],"normals":[215,217,143]},{"vertices":[313,314,161],"normals":[217,219,147]},{"vertices":[315,162,161],"normals":[218,151,147]},{"vertices":[315,316,162],"normals":[218,220,151]},{"vertices":[316,305,163],"normals":[220,211,153]},{"vertices":[305,153,163],"normals":[211,152,153]},{"vertices":[317,306,305],"normals":[235,210,211]},{"vertices":[319,307,306],"normals":[223,325,210]},{"vertices":[319,308,307],"normals":[223,213,325]},{"vertices":[320,309,308],"normals":[224,233,213]},{"vertices":[322,310,309],"normals":[226,214,233]},{"vertices":[323,311,310],"normals":[227,216,214]},{"vertices":[324,312,311],"normals":[228,215,216]},{"vertices":[324,313,312],"normals":[228,217,215]},{"vertices":[325,314,313],"normals":[229,219,217]},{"vertices":[327,315,314],"normals":[231,218,219]},{"vertices":[328,316,315],"normals":[232,220,218]},{"vertices":[328,305,316],"normals":[232,211,220]},{"vertices":[52,53,317],"normals":[67,65,235]},{"vertices":[54,319,318],"normals":[61,223,234]},{"vertices":[54,55,320],"normals":[61,57,224]},{"vertices":[55,56,321],"normals":[57,53,225]},{"vertices":[56,322,321],"normals":[53,226,225]},{"vertices":[57,323,322],"normals":[52,227,226]},{"vertices":[57,58,323],"normals":[52,56,227]},{"vertices":[59,325,324],"normals":[58,229,228]},{"vertices":[60,61,327],"normals":[62,66,231]},{"vertices":[61,328,327],"normals":[66,232,231]},{"vertices":[62,52,317],"normals":[68,67,235]},{"vertices":[329,330,127],"normals":[236,238,122]},{"vertices":[331,128,127],"normals":[237,126,122]},{"vertices":[331,332,128],"normals":[237,249,126]},{"vertices":[332,129,128],"normals":[249,128,126]},{"vertices":[332,333,129],"normals":[249,239,128]},{"vertices":[333,334,130],"normals":[239,241,131]},{"vertices":[335,131,130],"normals":[240,132,131]},{"vertices":[335,336,132],"normals":[240,243,119]},{"vertices":[337,133,132],"normals":[242,120,119]},{"vertices":[329,126,133],"normals":[236,121,120]},{"vertices":[339,330,329],"normals":[244,238,236]},{"vertices":[340,331,330],"normals":[246,237,238]},{"vertices":[341,332,331],"normals":[247,249,237]},{"vertices":[342,333,332],"normals":[248,239,249]},{"vertices":[343,334,333],"normals":[250,241,239]},{"vertices":[344,335,334],"normals":[251,240,241]},{"vertices":[345,336,335],"normals":[252,243,240]},{"vertices":[346,337,336],"normals":[253,242,243]},{"vertices":[338,329,337],"normals":[245,236,242]},{"vertices":[25,339,338],"normals":[36,244,245]},{"vertices":[26,27,340],"normals":[37,41,246]},{"vertices":[27,342,341],"normals":[41,248,247]},{"vertices":[27,28,342],"normals":[41,43,248]},{"vertices":[28,343,342],"normals":[43,250,248]},{"vertices":[29,30,344],"normals":[46,47,251]},{"vertices":[31,345,344],"normals":[33,252,251]},{"vertices":[32,346,345],"normals":[35,253,252]},{"vertices":[32,25,338],"normals":[35,36,245]},{"vertices":[347,348,135],"normals":[254,255,129]},{"vertices":[348,349,136],"normals":[255,257,127]},{"vertices":[350,137,136],"normals":[256,125,127]},{"vertices":[351,352,138],"normals":[258,260,123]},{"vertices":[353,139,138],"normals":[259,118,123]},{"vertices":[354,140,139],"normals":[261,124,118]},{"vertices":[354,347,134],"normals":[261,254,130]},{"vertices":[356,348,347],"normals":[262,255,254]},{"vertices":[357,349,348],"normals":[264,257,255]},{"vertices":[358,350,349],"normals":[265,256,257]},{"vertices":[359,351,350],"normals":[266,258,256]},{"vertices":[360,352,351],"normals":[267,260,258]},{"vertices":[361,353,352],"normals":[268,259,260]},{"vertices":[362,354,353],"normals":[269,261,259]},{"vertices":[355,347,354],"normals":[263,254,261]},{"vertices":[34,356,355],"normals":[44,262,263]},{"vertices":[35,357,356],"normals":[42,264,262]},{"vertices":[35,36,358],"normals":[42,40,265]},{"vertices":[37,360,359],"normals":[38,267,266]},{"vertices":[37,38,361],"normals":[38,34,268]},{"vertices":[38,39,362],"normals":[34,39,269]},{"vertices":[33,355,362],"normals":[45,263,269]},{"vertices":[364,122,121],"normals":[271,113,117]},{"vertices":[365,124,123],"normals":[169,112,114]},{"vertices":[366,125,124],"normals":[272,115,112]},{"vertices":[366,363,120],"normals":[272,270,116]},{"vertices":[368,121,363],"normals":[32,117,270]},{"vertices":[369,364,121],"normals":[274,271,117]},{"vertices":[370,123,364],"normals":[29,114,271]},{"vertices":[371,365,123],"normals":[175,169,114]},{"vertices":[372,366,365],"normals":[275,272,169]},{"vertices":[367,363,366],"normals":[273,270,272]},{"vertices":[22,369,368],"normals":[27,274,32]},{"vertices":[23,371,370],"normals":[28,175,29]},{"vertices":[23,24,372],"normals":[28,30,275]},{"vertices":[21,367,372],"normals":[31,273,275]},{"vertices":[373,374,106],"normals":[276,278,106]},{"vertices":[375,107,106],"normals":[277,111,106]},{"vertices":[376,108,107],"normals":[279,110,111]},{"vertices":[376,377,108],"normals":[279,280,110]},{"vertices":[377,378,109],"normals":[280,282,107]},{"vertices":[378,110,109],"normals":[282,98,107]},{"vertices":[380,112,111],"normals":[284,97,99]},{"vertices":[381,113,112],"normals":[283,100,97]},{"vertices":[381,382,114],"normals":[283,302,105]},{"vertices":[382,383,114],"normals":[302,285,105]},{"vertices":[384,116,115],"normals":[286,108,109]},{"vertices":[385,117,116],"normals":[287,102,108]},{"vertices":[385,386,117],"normals":[287,288,102]},{"vertices":[387,119,118],"normals":[289,101,103]},{"vertices":[373,105,119],"normals":[276,104,101]},{"vertices":[388,374,373],"normals":[291,278,276]},{"vertices":[390,375,374],"normals":[292,277,278]},{"vertices":[392,376,375],"normals":[294,279,277]},{"vertices":[393,377,376],"normals":[295,280,279]},{"vertices":[394,378,377],"normals":[296,282,280]},{"vertices":[395,379,378],"normals":[297,281,282]},{"vertices":[396,111,379],"normals":[14,99,281]},{"vertices":[397,380,111],"normals":[298,284,99]},{"vertices":[398,381,380],"normals":[299,283,284]},{"vertices":[399,382,381],"normals":[300,302,283]},{"vertices":[400,383,382],"normals":[301,285,302]},{"vertices":[401,384,383],"normals":[303,286,285]},{"vertices":[402,385,384],"normals":[304,287,286]},{"vertices":[403,386,385],"normals":[305,288,287]},{"vertices":[404,118,386],"normals":[18,103,288]},{"vertices":[405,387,118],"normals":[306,289,103]},{"vertices":[388,373,387],"normals":[291,276,289]},{"vertices":[9,389,388],"normals":[21,290,291]},{"vertices":[9,10,390],"normals":[21,26,292]},{"vertices":[10,11,392],"normals":[26,25,294]},{"vertices":[11,393,392],"normals":[25,295,294]},{"vertices":[12,394,393],"normals":[22,296,295]},{"vertices":[12,13,394],"normals":[22,12,296]},{"vertices":[14,397,396],"normals":[13,298,14]},{"vertices":[14,15,398],"normals":[13,15,299]},{"vertices":[16,399,398],"normals":[20,300,299]},{"vertices":[16,400,399],"normals":[20,301,300]},{"vertices":[17,18,401],"normals":[24,23,303]},{"vertices":[18,19,402],"normals":[23,16,304]},{"vertices":[19,403,402],"normals":[16,305,304]},{"vertices":[20,405,404],"normals":[17,306,18]},{"vertices":[20,8,388],"normals":[17,19,291]},{"vertices":[406,94,93],"normals":[308,92,96]},{"vertices":[407,408,95],"normals":[307,310,95]},{"vertices":[410,96,95],"normals":[311,88,95]},{"vertices":[410,411,96],"normals":[311,312,88]},{"vertices":[412,98,97],"normals":[167,86,94]},{"vertices":[413,100,99],"normals":[314,85,87]},{"vertices":[414,101,100],"normals":[313,89,85]},{"vertices":[102,415,103],"normals":[91,315,90]},{"vertices":[416,104,103],"normals":[171,93,90]},{"vertices":[418,406,93],"normals":[316,308,96]},{"vertices":[419,407,406],"normals":[317,307,308]},{"vertices":[420,408,407],"normals":[318,310,307]},{"vertices":[421,409,408],"normals":[319,309,310]},{"vertices":[422,410,409],"normals":[320,311,309]},{"vertices":[423,411,410],"normals":[321,312,311]},{"vertices":[424,97,411],"normals":[9,94,312]},{"vertices":[425,412,97],"normals":[174,167,94]},{"vertices":[426,99,412],"normals":[2,87,167]},{"vertices":[427,413,99],"normals":[322,314,87]},{"vertices":[428,414,413],"normals":[323,313,314]},{"vertices":[429,102,414],"normals":[6,91,313]},{"vertices":[430,415,102],"normals":[324,315,91]},{"vertices":[431,416,415],"normals":[178,171,315]},{"vertices":[417,93,416],"normals":[11,96,171]},{"vertices":[417,0,418],"normals":[11,7,316]},{"vertices":[1,420,419],"normals":[10,318,317]},{"vertices":[1,421,420],"normals":[10,319,318]},{"vertices":[1,2,422],"normals":[10,3,320]},{"vertices":[2,423,422],"normals":[3,321,320]},{"vertices":[3,425,424],"normals":[0,174,9]},{"vertices":[426,4,427],"normals":[2,1,322]},{"vertices":[4,5,428],"normals":[1,4,323]},{"vertices":[6,430,429],"normals":[5,324,6]},{"vertices":[7,431,430],"normals":[8,178,324]}]}];

/***/ }),

/***/ "./src/assets/hoodlum2018.json":
/*!*************************************!*\
  !*** ./src/assets/hoodlum2018.json ***!
  \*************************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Curve_CUpath3026","vertices":[{"x":-0.014343,"y":0,"z":-0.002665},{"x":-0.014169,"y":0,"z":-0.002665},{"x":-0.014169,"y":0,"z":0.002865},{"x":-0.014343,"y":0,"z":0.002865},{"x":-0.014896,"y":0,"z":0.002865},{"x":-0.015039,"y":0,"z":0.002865},{"x":-0.015039,"y":0,"z":0.0001},{"x":-0.015805,"y":0,"z":0.0001},{"x":-0.015805,"y":0,"z":0.002865},{"x":-0.016121,"y":0,"z":0.002865},{"x":-0.016674,"y":0,"z":0.002865},{"x":-0.016674,"y":0,"z":-0.002665},{"x":-0.016121,"y":0,"z":-0.002665},{"x":-0.015805,"y":0,"z":-0.002665},{"x":-0.015805,"y":0,"z":-0.000769},{"x":-0.015039,"y":0,"z":-0.000769},{"x":-0.015039,"y":0,"z":-0.002665},{"x":-0.014896,"y":0,"z":-0.002665},{"x":0.016688,"y":0,"z":-0.000442},{"x":0.016586,"y":0,"z":-0.000369},{"x":0.016422,"y":0,"z":-0.000303},{"x":0.016544,"y":0,"z":-0.000256},{"x":0.016647,"y":0,"z":-0.000187},{"x":0.016744,"y":0,"z":-0.000053},{"x":0.016747,"y":0,"z":0.000053},{"x":0.016747,"y":0,"z":0.000164},{"x":0.016747,"y":0,"z":0.000292},{"x":0.016747,"y":0,"z":0.000458},{"x":0.016747,"y":0,"z":0.000654},{"x":0.016747,"y":0,"z":0.000873},{"x":0.016747,"y":0,"z":0.001108},{"x":0.016747,"y":0,"z":0.001349},{"x":0.016747,"y":0,"z":0.001591},{"x":0.016747,"y":0,"z":0.001826},{"x":0.016747,"y":0,"z":0.002045},{"x":0.016742,"y":0,"z":0.002326},{"x":0.016715,"y":0,"z":0.002445},{"x":0.016666,"y":0,"z":0.002554},{"x":0.016594,"y":0,"z":0.002653},{"x":0.016502,"y":0,"z":0.002739},{"x":0.0164,"y":0,"z":0.002803},{"x":0.016287,"y":0,"z":0.002845},{"x":0.016165,"y":0,"z":0.002864},{"x":0.016057,"y":0,"z":0.002865},{"x":0.015885,"y":0,"z":0.002865},{"x":0.01577,"y":0,"z":0.002865},{"x":0.015642,"y":0,"z":0.002865},{"x":0.015505,"y":0,"z":0.002865},{"x":0.015363,"y":0,"z":0.002865},{"x":0.015222,"y":0,"z":0.002865},{"x":0.015085,"y":0,"z":0.002865},{"x":0.014957,"y":0,"z":0.002865},{"x":0.014842,"y":0,"z":0.002865},{"x":0.014716,"y":0,"z":0.002854},{"x":0.0146,"y":0,"z":0.00282},{"x":0.014493,"y":0,"z":0.002763},{"x":0.014395,"y":0,"z":0.002684},{"x":0.014314,"y":0,"z":0.002588},{"x":0.014256,"y":0,"z":0.002482},{"x":0.014221,"y":0,"z":0.002366},{"x":0.01421,"y":0,"z":0.002241},{"x":0.01421,"y":0,"z":0.002129},{"x":0.01421,"y":0,"z":0.002002},{"x":0.01421,"y":0,"z":0.001836},{"x":0.01421,"y":0,"z":0.001639},{"x":0.01421,"y":0,"z":0.00142},{"x":0.01421,"y":0,"z":0.001186},{"x":0.01421,"y":0,"z":0.000944},{"x":0.01421,"y":0,"z":0.000702},{"x":0.01421,"y":0,"z":0.000468},{"x":0.01421,"y":0,"z":0.000249},{"x":0.01421,"y":0,"z":0.000053},{"x":0.014218,"y":0,"z":-0.000053},{"x":0.01427,"y":0,"z":-0.000145},{"x":0.014368,"y":0,"z":-0.000224},{"x":0.01448,"y":0,"z":-0.000282},{"x":0.014352,"y":0,"z":-0.000386},{"x":0.014252,"y":0,"z":-0.000463},{"x":0.01421,"y":0,"z":-0.000586},{"x":0.01421,"y":0,"z":-0.000791},{"x":0.01421,"y":0,"z":-0.000928},{"x":0.01421,"y":0,"z":-0.00108},{"x":0.01421,"y":0,"z":-0.001243},{"x":0.01421,"y":0,"z":-0.001412},{"x":0.01421,"y":0,"z":-0.001581},{"x":0.01421,"y":0,"z":-0.001744},{"x":0.01421,"y":0,"z":-0.001896},{"x":0.01421,"y":0,"z":-0.002033},{"x":0.014221,"y":0,"z":-0.002159},{"x":0.014256,"y":0,"z":-0.002275},{"x":0.014314,"y":0,"z":-0.002382},{"x":0.014395,"y":0,"z":-0.00248},{"x":0.014493,"y":0,"z":-0.002561},{"x":0.0146,"y":0,"z":-0.002619},{"x":0.014716,"y":0,"z":-0.002654},{"x":0.014842,"y":0,"z":-0.002665},{"x":0.014982,"y":0,"z":-0.002665},{"x":0.015194,"y":0,"z":-0.002665},{"x":0.015322,"y":0,"z":-0.002665},{"x":0.015459,"y":0,"z":-0.002665},{"x":0.015601,"y":0,"z":-0.002665},{"x":0.015742,"y":0,"z":-0.002665},{"x":0.015879,"y":0,"z":-0.002665},{"x":0.016007,"y":0,"z":-0.002665},{"x":0.016122,"y":0,"z":-0.002665},{"x":0.016248,"y":0,"z":-0.002654},{"x":0.016363,"y":0,"z":-0.002619},{"x":0.016469,"y":0,"z":-0.002561},{"x":0.016565,"y":0,"z":-0.00248},{"x":0.016644,"y":0,"z":-0.002382},{"x":0.016701,"y":0,"z":-0.002275},{"x":0.016735,"y":0,"z":-0.002159},{"x":0.016747,"y":0,"z":-0.002033},{"x":0.016747,"y":0,"z":-0.00192},{"x":0.016747,"y":0,"z":-0.001795},{"x":0.016747,"y":0,"z":-0.001638},{"x":0.016747,"y":0,"z":-0.00146},{"x":0.016747,"y":0,"z":-0.001271},{"x":0.016747,"y":0,"z":-0.001082},{"x":0.016747,"y":0,"z":-0.000904},{"x":0.016747,"y":0,"z":-0.000747},{"x":0.016747,"y":0,"z":-0.000538},{"x":0.015877,"y":0,"z":0.0001},{"x":0.015079,"y":0,"z":0.0001},{"x":0.015079,"y":0,"z":0.001996},{"x":0.015877,"y":0,"z":0.001996},{"x":0.015877,"y":0,"z":-0.001788},{"x":0.015079,"y":0,"z":-0.001788},{"x":0.015079,"y":0,"z":-0.000769},{"x":0.015877,"y":0,"z":-0.000769},{"x":0.013696,"y":0,"z":-0.002665},{"x":0.013696,"y":0,"z":0.002865},{"x":0.012826,"y":0,"z":0.002865},{"x":0.012826,"y":0,"z":-0.001788},{"x":0.012463,"y":0,"z":-0.00152},{"x":0.012463,"y":0,"z":-0.002389},{"x":0.012826,"y":0,"z":-0.002657},{"x":0.01154,"y":0,"z":-0.002665},{"x":0.01165,"y":0,"z":-0.002637},{"x":0.011749,"y":0,"z":-0.002592},{"x":0.011839,"y":0,"z":-0.002531},{"x":0.011943,"y":0,"z":-0.002423},{"x":0.012003,"y":0,"z":-0.002329},{"x":0.012043,"y":0,"z":-0.002228},{"x":0.012065,"y":0,"z":-0.002118},{"x":0.012069,"y":0,"z":-0.001984},{"x":0.012069,"y":0,"z":-0.001823},{"x":0.012069,"y":0,"z":-0.001573},{"x":0.012069,"y":0,"z":-0.001248},{"x":0.012069,"y":0,"z":-0.000864},{"x":0.012069,"y":0,"z":-0.000435},{"x":0.012069,"y":0,"z":0.000023},{"x":0.012069,"y":0,"z":0.000496},{"x":0.012069,"y":0,"z":0.00097},{"x":0.012069,"y":0,"z":0.001428},{"x":0.012069,"y":0,"z":0.001857},{"x":0.012069,"y":0,"z":0.002241},{"x":0.01206,"y":0,"z":0.002355},{"x":0.012032,"y":0,"z":0.002462},{"x":0.011985,"y":0,"z":0.002561},{"x":0.011919,"y":0,"z":0.002652},{"x":0.011839,"y":0,"z":0.00273},{"x":0.011749,"y":0,"z":0.002792},{"x":0.01165,"y":0,"z":0.002837},{"x":0.011521,"y":0,"z":0.002865},{"x":0.01138,"y":0,"z":0.002865},{"x":0.011269,"y":0,"z":0.002865},{"x":0.011138,"y":0,"z":0.002865},{"x":0.010992,"y":0,"z":0.002865},{"x":0.010835,"y":0,"z":0.002865},{"x":0.010674,"y":0,"z":0.002865},{"x":0.010512,"y":0,"z":0.002865},{"x":0.010356,"y":0,"z":0.002865},{"x":0.010209,"y":0,"z":0.002865},{"x":0.010006,"y":0,"z":0.002848},{"x":0.009906,"y":0,"z":0.002809},{"x":0.009815,"y":0,"z":0.002753},{"x":0.009732,"y":0,"z":0.00268},{"x":0.009661,"y":0,"z":0.002592},{"x":0.009608,"y":0,"z":0.002496},{"x":0.009573,"y":0,"z":0.002392},{"x":0.009558,"y":0,"z":0.00228},{"x":0.009557,"y":0,"z":0.002023},{"x":0.009557,"y":0,"z":0.001773},{"x":0.009557,"y":0,"z":0.001448},{"x":0.009557,"y":0,"z":0.001064},{"x":0.009557,"y":0,"z":0.000635},{"x":0.009557,"y":0,"z":0.000177},{"x":0.009557,"y":0,"z":-0.000297},{"x":0.009557,"y":0,"z":-0.00077},{"x":0.009557,"y":0,"z":-0.001228},{"x":0.009557,"y":0,"z":-0.001657},{"x":0.009557,"y":0,"z":-0.002041},{"x":0.009566,"y":0,"z":-0.002156},{"x":0.009594,"y":0,"z":-0.002262},{"x":0.009641,"y":0,"z":-0.002361},{"x":0.009707,"y":0,"z":-0.002452},{"x":0.009786,"y":0,"z":-0.002531},{"x":0.009875,"y":0,"z":-0.002592},{"x":0.009972,"y":0,"z":-0.002637},{"x":0.010078,"y":0,"z":-0.002665},{"x":0.010186,"y":0,"z":-0.002665},{"x":0.010306,"y":0,"z":-0.002665},{"x":0.010457,"y":0,"z":-0.002665},{"x":0.010628,"y":0,"z":-0.002665},{"x":0.010809,"y":0,"z":-0.002665},{"x":0.01099,"y":0,"z":-0.002665},{"x":0.011161,"y":0,"z":-0.002665},{"x":0.011312,"y":0,"z":-0.002665},{"x":0.011432,"y":0,"z":-0.002665},{"x":0.0112,"y":0,"z":-0.000098},{"x":0.010426,"y":0,"z":0.002004},{"x":0.0112,"y":0,"z":0.002004},{"x":0.0112,"y":0,"z":0.001656},{"x":0.0112,"y":0,"z":-0.001804},{"x":0.010426,"y":0,"z":-0.001804},{"x":0.010426,"y":0,"z":0.000368},{"x":0.0112,"y":0,"z":-0.001646},{"x":0.00887,"y":0,"z":-0.00236},{"x":0.008945,"y":0,"z":-0.002245},{"x":0.008996,"y":0,"z":-0.002118},{"x":0.009024,"y":0,"z":-0.001981},{"x":0.009029,"y":0,"z":-0.001865},{"x":0.009029,"y":0,"z":-0.001731},{"x":0.009029,"y":0,"z":-0.001626},{"x":0.009029,"y":0,"z":-0.001501},{"x":0.009029,"y":0,"z":-0.001362},{"x":0.009029,"y":0,"z":-0.001213},{"x":0.009029,"y":0,"z":-0.001059},{"x":0.009029,"y":0,"z":-0.000905},{"x":0.009029,"y":0,"z":-0.000757},{"x":0.009029,"y":0,"z":-0.000617},{"x":0.009029,"y":0,"z":-0.000493},{"x":0.008997,"y":0,"z":-0.00039},{"x":0.007377,"y":0,"z":0.001159},{"x":0.007377,"y":0,"z":0.001996},{"x":0.00816,"y":0,"z":0.001996},{"x":0.00816,"y":0,"z":0.001569},{"x":0.00816,"y":0,"z":0.001412},{"x":0.008318,"y":0,"z":0.001412},{"x":0.008871,"y":0,"z":0.001412},{"x":0.009029,"y":0,"z":0.001412},{"x":0.009029,"y":0,"z":0.001569},{"x":0.009029,"y":0,"z":0.002707},{"x":0.009029,"y":0,"z":0.002865},{"x":0.008871,"y":0,"z":0.002865},{"x":0.006666,"y":0,"z":0.002865},{"x":0.006508,"y":0,"z":0.002865},{"x":0.006508,"y":0,"z":0.002707},{"x":0.006508,"y":0,"z":0.000898},{"x":0.006548,"y":0,"z":0.000795},{"x":0.00816,"y":0,"z":-0.000737},{"x":0.00816,"y":0,"z":-0.001804},{"x":0.007377,"y":0,"z":-0.001804},{"x":0.007377,"y":0,"z":-0.001307},{"x":0.006508,"y":0,"z":-0.001307},{"x":0.006508,"y":0,"z":-0.001883},{"x":0.00652,"y":0,"z":-0.002022},{"x":0.006555,"y":0,"z":-0.002154},{"x":0.006615,"y":0,"z":-0.002279},{"x":0.006698,"y":0,"z":-0.002397},{"x":0.006795,"y":0,"z":-0.002496},{"x":0.006907,"y":0,"z":-0.002574},{"x":0.007033,"y":0,"z":-0.002631},{"x":0.007172,"y":0,"z":-0.002665},{"x":0.008341,"y":0,"z":-0.002665},{"x":0.008465,"y":0,"z":-0.002645},{"x":0.008592,"y":0,"z":-0.002596},{"x":0.008707,"y":0,"z":-0.002525},{"x":0.003339,"y":0,"z":-0.002665},{"x":0.004691,"y":0,"z":-0.002665},{"x":0.004691,"y":0,"z":0.002865},{"x":0.003822,"y":0,"z":0.002865},{"x":0.003822,"y":0,"z":-0.000106},{"x":0.003339,"y":0,"z":0.002454},{"x":0.002581,"y":0,"z":0.002454},{"x":0.002099,"y":0,"z":-0.000106},{"x":0.002099,"y":0,"z":0.002865},{"x":0.00123,"y":0,"z":0.002865},{"x":0.00123,"y":0,"z":-0.002665},{"x":0.002581,"y":0,"z":-0.002665},{"x":0.00296,"y":0,"z":-0.000461},{"x":0.000717,"y":0,"z":-0.002681},{"x":0.000716,"y":0,"z":0.002132},{"x":0.000696,"y":0,"z":0.002273},{"x":0.000653,"y":0,"z":0.002404},{"x":0.000586,"y":0,"z":0.002523},{"x":0.000495,"y":0,"z":0.002632},{"x":0.000392,"y":0,"z":0.002724},{"x":0.000277,"y":0,"z":0.002793},{"x":0.000151,"y":0,"z":0.002839},{"x":0.00003,"y":0,"z":0.002865},{"x":-0.001124,"y":0,"z":0.002865},{"x":-0.001229,"y":0,"z":0.002839},{"x":-0.001355,"y":0,"z":0.002793},{"x":-0.00147,"y":0,"z":0.002724},{"x":-0.001574,"y":0,"z":0.002632},{"x":-0.001664,"y":0,"z":0.002523},{"x":-0.001731,"y":0,"z":0.002404},{"x":-0.001775,"y":0,"z":0.002273},{"x":-0.001794,"y":0,"z":0.002132},{"x":-0.001796,"y":0,"z":0.00202},{"x":-0.001796,"y":0,"z":0.00184},{"x":-0.001796,"y":0,"z":0.001562},{"x":-0.001796,"y":0,"z":0.001201},{"x":-0.001796,"y":0,"z":0.000773},{"x":-0.001796,"y":0,"z":0.000296},{"x":-0.001796,"y":0,"z":-0.000214},{"x":-0.001796,"y":0,"z":-0.00074},{"x":-0.001796,"y":0,"z":-0.001267},{"x":-0.001796,"y":0,"z":-0.001777},{"x":-0.001796,"y":0,"z":-0.002254},{"x":-0.001796,"y":0,"z":-0.002681},{"x":-0.000926,"y":0,"z":-0.002681},{"x":-0.000926,"y":0,"z":0.002004},{"x":-0.000152,"y":0,"z":0.002004},{"x":-0.000152,"y":0,"z":-0.002681},{"x":-0.003705,"y":0,"z":0.001996},{"x":-0.00233,"y":0,"z":0.001996},{"x":-0.00233,"y":0,"z":0.002865},{"x":-0.003705,"y":0,"z":0.002865},{"x":-0.004574,"y":0,"z":0.002865},{"x":-0.004574,"y":0,"z":0.001996},{"x":-0.004574,"y":0,"z":-0.002665},{"x":-0.003705,"y":0,"z":-0.002665},{"x":-0.005633,"y":0,"z":-0.00266},{"x":-0.005514,"y":0,"z":-0.002632},{"x":-0.005404,"y":0,"z":-0.002581},{"x":-0.005242,"y":0,"z":-0.002444},{"x":-0.005169,"y":0,"z":-0.002341},{"x":-0.005118,"y":0,"z":-0.00223},{"x":-0.005091,"y":0,"z":-0.00211},{"x":-0.005086,"y":0,"z":-0.001969},{"x":-0.005086,"y":0,"z":-0.001808},{"x":-0.005086,"y":0,"z":-0.001559},{"x":-0.005086,"y":0,"z":-0.001237},{"x":-0.005086,"y":0,"z":-0.000855},{"x":-0.005086,"y":0,"z":-0.000428},{"x":-0.005086,"y":0,"z":0.000028},{"x":-0.005086,"y":0,"z":0.000498},{"x":-0.005086,"y":0,"z":0.000969},{"x":-0.005086,"y":0,"z":0.001425},{"x":-0.005086,"y":0,"z":0.001851},{"x":-0.005087,"y":0,"z":0.002276},{"x":-0.005107,"y":0,"z":0.002399},{"x":-0.005149,"y":0,"z":0.002512},{"x":-0.005215,"y":0,"z":0.002616},{"x":-0.005303,"y":0,"z":0.002709},{"x":-0.005404,"y":0,"z":0.002783},{"x":-0.005514,"y":0,"z":0.002833},{"x":-0.005633,"y":0,"z":0.00286},{"x":-0.005736,"y":0,"z":0.002865},{"x":-0.005866,"y":0,"z":0.002865},{"x":-0.005968,"y":0,"z":0.002865},{"x":-0.00609,"y":0,"z":0.002865},{"x":-0.006225,"y":0,"z":0.002865},{"x":-0.00637,"y":0,"z":0.002865},{"x":-0.006519,"y":0,"z":0.002865},{"x":-0.006668,"y":0,"z":0.002865},{"x":-0.006813,"y":0,"z":0.002865},{"x":-0.006948,"y":0,"z":0.002865},{"x":-0.00707,"y":0,"z":0.002865},{"x":-0.007599,"y":0,"z":0.002865},{"x":-0.007599,"y":0,"z":-0.002665},{"x":-0.007046,"y":0,"z":-0.002665},{"x":-0.006927,"y":0,"z":-0.002665},{"x":-0.006794,"y":0,"z":-0.002665},{"x":-0.006652,"y":0,"z":-0.002665},{"x":-0.006505,"y":0,"z":-0.002665},{"x":-0.006358,"y":0,"z":-0.002665},{"x":-0.006216,"y":0,"z":-0.002665},{"x":-0.006083,"y":0,"z":-0.002665},{"x":-0.005964,"y":0,"z":-0.002665},{"x":-0.005863,"y":0,"z":-0.002665},{"x":-0.005736,"y":0,"z":-0.002665},{"x":-0.005955,"y":0,"z":-0.001796},{"x":-0.00673,"y":0,"z":-0.001796},{"x":-0.00673,"y":0,"z":0.001988},{"x":-0.005955,"y":0,"z":0.001988},{"x":-0.008641,"y":0,"z":-0.002665},{"x":-0.008534,"y":0,"z":-0.002637},{"x":-0.008437,"y":0,"z":-0.002591},{"x":-0.008349,"y":0,"z":-0.002528},{"x":-0.008269,"y":0,"z":-0.002448},{"x":-0.008204,"y":0,"z":-0.002356},{"x":-0.008157,"y":0,"z":-0.002257},{"x":-0.008129,"y":0,"z":-0.002153},{"x":-0.008119,"y":0,"z":-0.002033},{"x":-0.008119,"y":0,"z":-0.001931},{"x":-0.008119,"y":0,"z":-0.001819},{"x":-0.008119,"y":0,"z":-0.00169},{"x":-0.008119,"y":0,"z":-0.001561},{"x":-0.008119,"y":0,"z":-0.001449},{"x":-0.008119,"y":0,"z":-0.001196},{"x":-0.008119,"y":0,"z":0.001656},{"x":-0.008119,"y":0,"z":0.002249},{"x":-0.008129,"y":0,"z":0.00236},{"x":-0.008157,"y":0,"z":0.002464},{"x":-0.008204,"y":0,"z":0.002561},{"x":-0.008269,"y":0,"z":0.002652},{"x":-0.008349,"y":0,"z":0.00273},{"x":-0.008437,"y":0,"z":0.002792},{"x":-0.008534,"y":0,"z":0.002837},{"x":-0.00866,"y":0,"z":0.002865},{"x":-0.0088,"y":0,"z":0.002865},{"x":-0.008911,"y":0,"z":0.002865},{"x":-0.009042,"y":0,"z":0.002865},{"x":-0.009189,"y":0,"z":0.002865},{"x":-0.009345,"y":0,"z":0.002865},{"x":-0.009507,"y":0,"z":0.002865},{"x":-0.009668,"y":0,"z":0.002865},{"x":-0.009825,"y":0,"z":0.002865},{"x":-0.009971,"y":0,"z":0.002865},{"x":-0.010174,"y":0,"z":0.002848},{"x":-0.010275,"y":0,"z":0.002809},{"x":-0.010366,"y":0,"z":0.002753},{"x":-0.010448,"y":0,"z":0.00268},{"x":-0.01052,"y":0,"z":0.002592},{"x":-0.010573,"y":0,"z":0.002497},{"x":-0.010607,"y":0,"z":0.002395},{"x":-0.010623,"y":0,"z":0.002287},{"x":-0.010624,"y":0,"z":0.00203},{"x":-0.010624,"y":0,"z":0.00178},{"x":-0.010624,"y":0,"z":0.001454},{"x":-0.010624,"y":0,"z":0.00107},{"x":-0.010624,"y":0,"z":0.00064},{"x":-0.010624,"y":0,"z":0.000181},{"x":-0.010624,"y":0,"z":-0.000293},{"x":-0.010624,"y":0,"z":-0.000768},{"x":-0.010624,"y":0,"z":-0.001227},{"x":-0.010624,"y":0,"z":-0.001656},{"x":-0.010624,"y":0,"z":-0.002041},{"x":-0.010615,"y":0,"z":-0.002153},{"x":-0.010587,"y":0,"z":-0.002257},{"x":-0.01054,"y":0,"z":-0.002356},{"x":-0.010474,"y":0,"z":-0.002448},{"x":-0.010394,"y":0,"z":-0.002528},{"x":-0.010306,"y":0,"z":-0.002591},{"x":-0.010209,"y":0,"z":-0.002637},{"x":-0.010102,"y":0,"z":-0.002665},{"x":-0.009994,"y":0,"z":-0.002665},{"x":-0.009874,"y":0,"z":-0.002665},{"x":-0.009723,"y":0,"z":-0.002665},{"x":-0.009553,"y":0,"z":-0.002665},{"x":-0.009371,"y":0,"z":-0.002665},{"x":-0.00919,"y":0,"z":-0.002665},{"x":-0.00902,"y":0,"z":-0.002665},{"x":-0.008869,"y":0,"z":-0.002665},{"x":-0.008749,"y":0,"z":-0.002665},{"x":-0.008988,"y":0,"z":-0.001449},{"x":-0.008988,"y":0,"z":-0.001796},{"x":-0.009755,"y":0,"z":-0.001796},{"x":-0.009755,"y":0,"z":0.002004},{"x":-0.008988,"y":0,"z":0.002004},{"x":-0.008988,"y":0,"z":0.001656},{"x":-0.008988,"y":0,"z":-0.001196},{"x":-0.011666,"y":0,"z":-0.002665},{"x":-0.01156,"y":0,"z":-0.002637},{"x":-0.011462,"y":0,"z":-0.002591},{"x":-0.011374,"y":0,"z":-0.002528},{"x":-0.011294,"y":0,"z":-0.002448},{"x":-0.011229,"y":0,"z":-0.002356},{"x":-0.011182,"y":0,"z":-0.002257},{"x":-0.011154,"y":0,"z":-0.002153},{"x":-0.011144,"y":0,"z":-0.002033},{"x":-0.011144,"y":0,"z":-0.001931},{"x":-0.011144,"y":0,"z":-0.001819},{"x":-0.011144,"y":0,"z":-0.00169},{"x":-0.011144,"y":0,"z":-0.001561},{"x":-0.011144,"y":0,"z":-0.001449},{"x":-0.011144,"y":0,"z":-0.001196},{"x":-0.011144,"y":0,"z":0.001656},{"x":-0.011144,"y":0,"z":0.002249},{"x":-0.011154,"y":0,"z":0.00236},{"x":-0.011182,"y":0,"z":0.002464},{"x":-0.011229,"y":0,"z":0.002561},{"x":-0.011294,"y":0,"z":0.002652},{"x":-0.011374,"y":0,"z":0.00273},{"x":-0.011462,"y":0,"z":0.002792},{"x":-0.01156,"y":0,"z":0.002837},{"x":-0.011685,"y":0,"z":0.002865},{"x":-0.011826,"y":0,"z":0.002865},{"x":-0.011936,"y":0,"z":0.002865},{"x":-0.012068,"y":0,"z":0.002865},{"x":-0.012214,"y":0,"z":0.002865},{"x":-0.01237,"y":0,"z":0.002865},{"x":-0.012532,"y":0,"z":0.002865},{"x":-0.012694,"y":0,"z":0.002865},{"x":-0.01285,"y":0,"z":0.002865},{"x":-0.012996,"y":0,"z":0.002865},{"x":-0.013199,"y":0,"z":0.002848},{"x":-0.0133,"y":0,"z":0.002809},{"x":-0.013391,"y":0,"z":0.002753},{"x":-0.013474,"y":0,"z":0.00268},{"x":-0.013545,"y":0,"z":0.002592},{"x":-0.013598,"y":0,"z":0.002497},{"x":-0.013633,"y":0,"z":0.002395},{"x":-0.013648,"y":0,"z":0.002287},{"x":-0.013649,"y":0,"z":0.00203},{"x":-0.013649,"y":0,"z":0.00178},{"x":-0.013649,"y":0,"z":0.001454},{"x":-0.013649,"y":0,"z":0.00107},{"x":-0.013649,"y":0,"z":0.00064},{"x":-0.013649,"y":0,"z":0.000181},{"x":-0.013649,"y":0,"z":-0.000293},{"x":-0.013649,"y":0,"z":-0.000768},{"x":-0.013649,"y":0,"z":-0.001227},{"x":-0.013649,"y":0,"z":-0.001656},{"x":-0.013649,"y":0,"z":-0.002041},{"x":-0.01364,"y":0,"z":-0.002153},{"x":-0.013612,"y":0,"z":-0.002257},{"x":-0.013565,"y":0,"z":-0.002356},{"x":-0.013499,"y":0,"z":-0.002448},{"x":-0.01342,"y":0,"z":-0.002528},{"x":-0.013331,"y":0,"z":-0.002591},{"x":-0.013234,"y":0,"z":-0.002637},{"x":-0.013128,"y":0,"z":-0.002665},{"x":-0.013019,"y":0,"z":-0.002665},{"x":-0.012899,"y":0,"z":-0.002665},{"x":-0.012749,"y":0,"z":-0.002665},{"x":-0.012578,"y":0,"z":-0.002665},{"x":-0.012397,"y":0,"z":-0.002665},{"x":-0.012216,"y":0,"z":-0.002665},{"x":-0.012045,"y":0,"z":-0.002665},{"x":-0.011894,"y":0,"z":-0.002665},{"x":-0.011774,"y":0,"z":-0.002665},{"x":-0.012013,"y":0,"z":-0.001449},{"x":-0.012013,"y":0,"z":-0.001796},{"x":-0.01278,"y":0,"z":-0.001796},{"x":-0.01278,"y":0,"z":0.002004},{"x":-0.012013,"y":0,"z":0.002004},{"x":-0.012013,"y":0,"z":0.001656},{"x":-0.012013,"y":0,"z":-0.001196}],"normals":[{"x":0,"y":1,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0}],"faces":[{"vertices":[10,12,11],"normals":[0,0,0]},{"vertices":[10,13,12],"normals":[0,0,0]},{"vertices":[10,14,13],"normals":[0,0,0]},{"vertices":[15,17,16],"normals":[0,0,0]},{"vertices":[15,0,17],"normals":[0,0,0]},{"vertices":[15,1,0],"normals":[0,0,0]},{"vertices":[15,2,1],"normals":[0,0,0]},{"vertices":[10,7,14],"normals":[0,0,0]},{"vertices":[7,15,14],"normals":[0,0,0]},{"vertices":[7,6,15],"normals":[0,0,0]},{"vertices":[6,2,15],"normals":[0,0,0]},{"vertices":[10,8,7],"normals":[0,0,0]},{"vertices":[5,2,6],"normals":[0,0,0]},{"vertices":[9,8,10],"normals":[1,1,1]},{"vertices":[4,2,5],"normals":[1,1,1]},{"vertices":[3,2,4],"normals":[1,1,1]},{"vertices":[94,96,95],"normals":[0,0,0]},{"vertices":[94,97,96],"normals":[0,0,0]},{"vertices":[94,98,97],"normals":[0,0,0]},{"vertices":[94,99,98],"normals":[0,0,0]},{"vertices":[94,100,99],"normals":[0,0,0]},{"vertices":[94,101,100],"normals":[0,0,0]},{"vertices":[94,102,101],"normals":[0,0,0]},{"vertices":[94,103,102],"normals":[0,0,0]},{"vertices":[94,104,103],"normals":[0,0,0]},{"vertices":[94,105,104],"normals":[0,0,0]},{"vertices":[93,105,94],"normals":[0,0,0]},{"vertices":[93,106,105],"normals":[0,0,0]},{"vertices":[92,106,93],"normals":[0,0,0]},{"vertices":[92,107,106],"normals":[0,0,0]},{"vertices":[91,107,92],"normals":[0,0,0]},{"vertices":[91,108,107],"normals":[0,0,0]},{"vertices":[90,108,91],"normals":[0,0,0]},{"vertices":[90,109,108],"normals":[0,0,0]},{"vertices":[89,109,90],"normals":[0,0,0]},{"vertices":[89,110,109],"normals":[0,0,0]},{"vertices":[88,110,89],"normals":[0,0,0]},{"vertices":[88,111,110],"normals":[0,0,0]},{"vertices":[87,111,88],"normals":[0,0,0]},{"vertices":[87,112,111],"normals":[0,0,0]},{"vertices":[86,112,87],"normals":[0,0,0]},{"vertices":[86,113,112],"normals":[0,0,0]},{"vertices":[86,114,113],"normals":[0,0,0]},{"vertices":[85,127,86],"normals":[0,0,0]},{"vertices":[127,114,86],"normals":[0,0,0]},{"vertices":[127,126,114],"normals":[0,0,0]},{"vertices":[126,115,114],"normals":[0,0,0]},{"vertices":[85,128,127],"normals":[0,0,0]},{"vertices":[129,115,126],"normals":[0,0,0]},{"vertices":[84,128,85],"normals":[0,0,0]},{"vertices":[129,116,115],"normals":[0,0,0]},{"vertices":[83,128,84],"normals":[0,0,0]},{"vertices":[129,117,116],"normals":[0,0,0]},{"vertices":[82,128,83],"normals":[0,0,0]},{"vertices":[129,118,117],"normals":[0,0,0]},{"vertices":[81,128,82],"normals":[0,0,0]},{"vertices":[129,119,118],"normals":[0,0,0]},{"vertices":[80,128,81],"normals":[0,0,0]},{"vertices":[79,128,80],"normals":[0,0,0]},{"vertices":[129,120,119],"normals":[0,0,0]},{"vertices":[78,128,79],"normals":[0,0,0]},{"vertices":[78,129,128],"normals":[0,0,0]},{"vertices":[78,120,129],"normals":[0,0,0]},{"vertices":[78,121,120],"normals":[0,0,0]},{"vertices":[77,121,78],"normals":[0,0,0]},{"vertices":[77,18,121],"normals":[0,0,0]},{"vertices":[77,19,18],"normals":[0,0,0]},{"vertices":[76,19,77],"normals":[0,0,0]},{"vertices":[76,21,19],"normals":[0,0,0]},{"vertices":[75,21,76],"normals":[0,0,0]},{"vertices":[75,20,21],"normals":[2,2,2]},{"vertices":[74,20,75],"normals":[0,0,0]},{"vertices":[74,21,20],"normals":[0,0,0]},{"vertices":[73,21,74],"normals":[0,0,0]},{"vertices":[73,22,21],"normals":[0,0,0]},{"vertices":[73,23,22],"normals":[0,0,0]},{"vertices":[72,23,73],"normals":[0,0,0]},{"vertices":[72,24,23],"normals":[0,0,0]},{"vertices":[71,24,72],"normals":[0,0,0]},{"vertices":[70,123,71],"normals":[0,0,0]},{"vertices":[123,24,71],"normals":[0,0,0]},{"vertices":[123,25,24],"normals":[0,0,0]},{"vertices":[123,122,25],"normals":[2,2,2]},{"vertices":[70,124,123],"normals":[0,0,0]},{"vertices":[125,25,122],"normals":[0,0,0]},{"vertices":[125,26,25],"normals":[0,0,0]},{"vertices":[69,124,70],"normals":[0,0,0]},{"vertices":[125,27,26],"normals":[0,0,0]},{"vertices":[125,28,27],"normals":[0,0,0]},{"vertices":[68,124,69],"normals":[0,0,0]},{"vertices":[125,29,28],"normals":[0,0,0]},{"vertices":[67,124,68],"normals":[0,0,0]},{"vertices":[125,30,29],"normals":[0,0,0]},{"vertices":[66,124,67],"normals":[0,0,0]},{"vertices":[125,31,30],"normals":[0,0,0]},{"vertices":[65,124,66],"normals":[0,0,0]},{"vertices":[125,32,31],"normals":[0,0,0]},{"vertices":[64,124,65],"normals":[0,0,0]},{"vertices":[125,33,32],"normals":[0,0,0]},{"vertices":[63,124,64],"normals":[0,0,0]},{"vertices":[125,34,33],"normals":[0,0,0]},{"vertices":[62,124,63],"normals":[0,0,0]},{"vertices":[62,125,124],"normals":[0,0,0]},{"vertices":[62,34,125],"normals":[0,0,0]},{"vertices":[61,34,62],"normals":[0,0,0]},{"vertices":[61,35,34],"normals":[0,0,0]},{"vertices":[60,35,61],"normals":[0,0,0]},{"vertices":[59,35,60],"normals":[0,0,0]},{"vertices":[59,36,35],"normals":[0,0,0]},{"vertices":[58,36,59],"normals":[0,0,0]},{"vertices":[58,37,36],"normals":[0,0,0]},{"vertices":[57,37,58],"normals":[0,0,0]},{"vertices":[57,38,37],"normals":[0,0,0]},{"vertices":[56,38,57],"normals":[0,0,0]},{"vertices":[56,39,38],"normals":[0,0,0]},{"vertices":[55,39,56],"normals":[0,0,0]},{"vertices":[55,40,39],"normals":[0,0,0]},{"vertices":[54,40,55],"normals":[0,0,0]},{"vertices":[54,41,40],"normals":[0,0,0]},{"vertices":[53,41,54],"normals":[0,0,0]},{"vertices":[53,42,41],"normals":[0,0,0]},{"vertices":[52,42,53],"normals":[0,0,0]},{"vertices":[52,43,42],"normals":[0,0,0]},{"vertices":[51,43,52],"normals":[1,1,1]},{"vertices":[50,43,51],"normals":[1,1,1]},{"vertices":[49,43,50],"normals":[1,1,1]},{"vertices":[48,43,49],"normals":[1,1,1]},{"vertices":[47,43,48],"normals":[1,1,1]},{"vertices":[46,43,47],"normals":[1,1,1]},{"vertices":[45,43,46],"normals":[1,1,1]},{"vertices":[44,43,45],"normals":[1,1,1]},{"vertices":[136,131,130],"normals":[0,0,0]},{"vertices":[135,133,136],"normals":[0,0,0]},{"vertices":[133,131,136],"normals":[0,0,0]},{"vertices":[134,133,135],"normals":[0,0,0]},{"vertices":[132,131,133],"normals":[0,0,0]},{"vertices":[199,201,200],"normals":[0,0,0]},{"vertices":[199,202,201],"normals":[0,0,0]},{"vertices":[199,203,202],"normals":[0,0,0]},{"vertices":[199,204,203],"normals":[0,0,0]},{"vertices":[199,205,204],"normals":[0,0,0]},{"vertices":[199,206,205],"normals":[0,0,0]},{"vertices":[199,207,206],"normals":[0,0,0]},{"vertices":[199,208,207],"normals":[0,0,0]},{"vertices":[199,209,208],"normals":[0,0,0]},{"vertices":[199,137,209],"normals":[0,0,0]},{"vertices":[199,138,137],"normals":[0,0,0]},{"vertices":[198,138,199],"normals":[0,0,0]},{"vertices":[198,139,138],"normals":[0,0,0]},{"vertices":[197,139,198],"normals":[0,0,0]},{"vertices":[197,140,139],"normals":[0,0,0]},{"vertices":[196,140,197],"normals":[0,0,0]},{"vertices":[196,141,140],"normals":[0,0,0]},{"vertices":[195,141,196],"normals":[0,0,0]},{"vertices":[195,142,141],"normals":[0,0,0]},{"vertices":[194,142,195],"normals":[0,0,0]},{"vertices":[194,143,142],"normals":[0,0,0]},{"vertices":[193,143,194],"normals":[0,0,0]},{"vertices":[193,144,143],"normals":[0,0,0]},{"vertices":[192,144,193],"normals":[0,0,0]},{"vertices":[192,145,144],"normals":[0,0,0]},{"vertices":[191,215,192],"normals":[0,0,0]},{"vertices":[215,145,192],"normals":[0,0,0]},{"vertices":[215,146,145],"normals":[0,0,0]},{"vertices":[215,214,146],"normals":[0,0,0]},{"vertices":[214,147,146],"normals":[0,0,0]},{"vertices":[191,216,215],"normals":[0,0,0]},{"vertices":[217,147,214],"normals":[0,0,0]},{"vertices":[190,216,191],"normals":[0,0,0]},{"vertices":[216,147,217],"normals":[0,0,0]},{"vertices":[216,148,147],"normals":[0,0,0]},{"vertices":[216,149,148],"normals":[0,0,0]},{"vertices":[189,216,190],"normals":[0,0,0]},{"vertices":[216,210,149],"normals":[0,0,0]},{"vertices":[210,150,149],"normals":[0,0,0]},{"vertices":[188,216,189],"normals":[0,0,0]},{"vertices":[210,151,150],"normals":[0,0,0]},{"vertices":[187,216,188],"normals":[0,0,0]},{"vertices":[216,211,210],"normals":[0,0,0]},{"vertices":[213,151,210],"normals":[0,0,0]},{"vertices":[213,152,151],"normals":[0,0,0]},{"vertices":[186,216,187],"normals":[0,0,0]},{"vertices":[186,211,216],"normals":[0,0,0]},{"vertices":[213,153,152],"normals":[0,0,0]},{"vertices":[185,211,186],"normals":[0,0,0]},{"vertices":[213,154,153],"normals":[0,0,0]},{"vertices":[184,211,185],"normals":[0,0,0]},{"vertices":[213,155,154],"normals":[0,0,0]},{"vertices":[183,211,184],"normals":[0,0,0]},{"vertices":[212,155,213],"normals":[0,0,0]},{"vertices":[182,211,183],"normals":[0,0,0]},{"vertices":[212,156,155],"normals":[0,0,0]},{"vertices":[182,212,211],"normals":[0,0,0]},{"vertices":[182,156,212],"normals":[0,0,0]},{"vertices":[181,156,182],"normals":[0,0,0]},{"vertices":[181,157,156],"normals":[0,0,0]},{"vertices":[180,157,181],"normals":[0,0,0]},{"vertices":[180,158,157],"normals":[0,0,0]},{"vertices":[179,158,180],"normals":[0,0,0]},{"vertices":[179,159,158],"normals":[0,0,0]},{"vertices":[178,159,179],"normals":[0,0,0]},{"vertices":[178,160,159],"normals":[0,0,0]},{"vertices":[177,160,178],"normals":[0,0,0]},{"vertices":[177,161,160],"normals":[0,0,0]},{"vertices":[176,161,177],"normals":[0,0,0]},{"vertices":[176,162,161],"normals":[0,0,0]},{"vertices":[175,162,176],"normals":[0,0,0]},{"vertices":[175,163,162],"normals":[0,0,0]},{"vertices":[174,163,175],"normals":[0,0,0]},{"vertices":[174,164,163],"normals":[0,0,0]},{"vertices":[173,164,174],"normals":[0,0,0]},{"vertices":[172,164,173],"normals":[1,1,1]},{"vertices":[171,164,172],"normals":[1,1,1]},{"vertices":[170,164,171],"normals":[1,1,1]},{"vertices":[169,164,170],"normals":[1,1,1]},{"vertices":[168,164,169],"normals":[1,1,1]},{"vertices":[167,164,168],"normals":[1,1,1]},{"vertices":[166,164,167],"normals":[1,1,1]},{"vertices":[165,164,166],"normals":[1,1,1]},{"vertices":[263,265,264],"normals":[0,0,0]},{"vertices":[263,266,265],"normals":[0,0,0]},{"vertices":[262,266,263],"normals":[0,0,0]},{"vertices":[262,267,266],"normals":[0,0,0]},{"vertices":[261,267,262],"normals":[0,0,0]},{"vertices":[261,268,267],"normals":[0,0,0]},{"vertices":[260,268,261],"normals":[0,0,0]},{"vertices":[260,218,268],"normals":[0,0,0]},{"vertices":[259,218,260],"normals":[0,0,0]},{"vertices":[259,219,218],"normals":[0,0,0]},{"vertices":[258,219,259],"normals":[0,0,0]},{"vertices":[258,220,219],"normals":[0,0,0]},{"vertices":[257,220,258],"normals":[0,0,0]},{"vertices":[257,221,220],"normals":[0,0,0]},{"vertices":[256,221,257],"normals":[0,0,0]},{"vertices":[256,222,221],"normals":[0,0,0]},{"vertices":[255,253,256],"normals":[0,0,0]},{"vertices":[253,222,256],"normals":[0,0,0]},{"vertices":[253,223,222],"normals":[0,0,0]},{"vertices":[253,252,223],"normals":[2,2,2]},{"vertices":[255,254,253],"normals":[0,0,0]},{"vertices":[251,223,252],"normals":[0,0,0]},{"vertices":[251,224,223],"normals":[0,0,0]},{"vertices":[251,225,224],"normals":[0,0,0]},{"vertices":[251,226,225],"normals":[0,0,0]},{"vertices":[251,227,226],"normals":[0,0,0]},{"vertices":[251,228,227],"normals":[0,0,0]},{"vertices":[251,229,228],"normals":[0,0,0]},{"vertices":[251,230,229],"normals":[0,0,0]},{"vertices":[251,231,230],"normals":[0,0,0]},{"vertices":[250,231,251],"normals":[0,0,0]},{"vertices":[250,232,231],"normals":[0,0,0]},{"vertices":[250,233,232],"normals":[0,0,0]},{"vertices":[250,234,233],"normals":[0,0,0]},{"vertices":[249,234,250],"normals":[0,0,0]},{"vertices":[248,234,249],"normals":[0,0,0]},{"vertices":[248,235,234],"normals":[0,0,0]},{"vertices":[237,239,238],"normals":[0,0,0]},{"vertices":[237,240,239],"normals":[0,0,0]},{"vertices":[237,241,240],"normals":[0,0,0]},{"vertices":[237,242,241],"normals":[0,0,0]},{"vertices":[236,242,237],"normals":[0,0,0]},{"vertices":[236,243,242],"normals":[0,0,0]},{"vertices":[248,236,235],"normals":[0,0,0]},{"vertices":[248,243,236],"normals":[0,0,0]},{"vertices":[247,243,248],"normals":[0,0,0]},{"vertices":[247,244,243],"normals":[0,0,0]},{"vertices":[246,244,247],"normals":[1,1,1]},{"vertices":[245,244,246],"normals":[1,1,1]},{"vertices":[278,280,279],"normals":[0,0,0]},{"vertices":[278,276,280],"normals":[0,0,0]},{"vertices":[276,281,280],"normals":[0,0,0]},{"vertices":[281,270,269],"normals":[0,0,0]},{"vertices":[281,273,270],"normals":[0,0,0]},{"vertices":[273,271,270],"normals":[0,0,0]},{"vertices":[276,273,281],"normals":[0,0,0]},{"vertices":[278,277,276],"normals":[0,0,0]},{"vertices":[275,273,276],"normals":[0,0,0]},{"vertices":[275,274,273],"normals":[0,0,0]},{"vertices":[272,271,273],"normals":[0,0,0]},{"vertices":[311,313,312],"normals":[0,0,0]},{"vertices":[311,314,313],"normals":[0,0,0]},{"vertices":[315,282,316],"normals":[0,0,0]},{"vertices":[315,283,282],"normals":[0,0,0]},{"vertices":[310,314,311],"normals":[0,0,0]},{"vertices":[309,314,310],"normals":[0,0,0]},{"vertices":[308,314,309],"normals":[0,0,0]},{"vertices":[307,314,308],"normals":[0,0,0]},{"vertices":[306,314,307],"normals":[0,0,0]},{"vertices":[305,314,306],"normals":[0,0,0]},{"vertices":[304,314,305],"normals":[0,0,0]},{"vertices":[303,314,304],"normals":[0,0,0]},{"vertices":[302,314,303],"normals":[0,0,0]},{"vertices":[301,314,302],"normals":[0,0,0]},{"vertices":[301,315,314],"normals":[0,0,0]},{"vertices":[301,283,315],"normals":[0,0,0]},{"vertices":[300,283,301],"normals":[0,0,0]},{"vertices":[300,284,283],"normals":[0,0,0]},{"vertices":[299,284,300],"normals":[0,0,0]},{"vertices":[299,285,284],"normals":[0,0,0]},{"vertices":[298,285,299],"normals":[0,0,0]},{"vertices":[298,286,285],"normals":[0,0,0]},{"vertices":[297,286,298],"normals":[0,0,0]},{"vertices":[297,287,286],"normals":[0,0,0]},{"vertices":[296,287,297],"normals":[0,0,0]},{"vertices":[296,288,287],"normals":[0,0,0]},{"vertices":[295,288,296],"normals":[0,0,0]},{"vertices":[295,289,288],"normals":[0,0,0]},{"vertices":[294,289,295],"normals":[0,0,0]},{"vertices":[294,290,289],"normals":[0,0,0]},{"vertices":[293,290,294],"normals":[0,0,0]},{"vertices":[293,291,290],"normals":[0,0,0]},{"vertices":[292,291,293],"normals":[0,0,0]},{"vertices":[322,324,323],"normals":[0,0,0]},{"vertices":[322,317,324],"normals":[0,0,0]},{"vertices":[321,317,322],"normals":[0,0,0]},{"vertices":[321,318,317],"normals":[0,0,0]},{"vertices":[321,319,318],"normals":[0,0,0]},{"vertices":[320,319,321],"normals":[1,1,1]},{"vertices":[362,364,363],"normals":[0,0,0]},{"vertices":[362,365,364],"normals":[0,0,0]},{"vertices":[362,366,365],"normals":[0,0,0]},{"vertices":[362,367,366],"normals":[0,0,0]},{"vertices":[362,376,367],"normals":[0,0,0]},{"vertices":[376,368,367],"normals":[0,0,0]},{"vertices":[376,369,368],"normals":[0,0,0]},{"vertices":[376,370,369],"normals":[0,0,0]},{"vertices":[376,371,370],"normals":[0,0,0]},{"vertices":[376,372,371],"normals":[0,0,0]},{"vertices":[376,373,372],"normals":[0,0,0]},{"vertices":[376,374,373],"normals":[0,0,0]},{"vertices":[376,325,374],"normals":[0,0,0]},{"vertices":[376,326,325],"normals":[0,0,0]},{"vertices":[376,327,326],"normals":[0,0,0]},{"vertices":[376,328,327],"normals":[0,0,0]},{"vertices":[376,329,328],"normals":[0,0,0]},{"vertices":[376,330,329],"normals":[0,0,0]},{"vertices":[376,331,330],"normals":[0,0,0]},{"vertices":[376,332,331],"normals":[0,0,0]},{"vertices":[376,333,332],"normals":[0,0,0]},{"vertices":[376,375,333],"normals":[0,0,0]},{"vertices":[375,334,333],"normals":[0,0,0]},{"vertices":[362,377,376],"normals":[0,0,0]},{"vertices":[378,334,375],"normals":[0,0,0]},{"vertices":[378,335,334],"normals":[0,0,0]},{"vertices":[378,336,335],"normals":[0,0,0]},{"vertices":[378,337,336],"normals":[0,0,0]},{"vertices":[378,338,337],"normals":[0,0,0]},{"vertices":[378,339,338],"normals":[0,0,0]},{"vertices":[378,340,339],"normals":[0,0,0]},{"vertices":[378,341,340],"normals":[0,0,0]},{"vertices":[378,342,341],"normals":[0,0,0]},{"vertices":[378,343,342],"normals":[0,0,0]},{"vertices":[362,378,377],"normals":[0,0,0]},{"vertices":[362,343,378],"normals":[0,0,0]},{"vertices":[362,344,343],"normals":[0,0,0]},{"vertices":[362,345,344],"normals":[0,0,0]},{"vertices":[362,346,345],"normals":[0,0,0]},{"vertices":[362,347,346],"normals":[0,0,0]},{"vertices":[362,348,347],"normals":[0,0,0]},{"vertices":[362,349,348],"normals":[0,0,0]},{"vertices":[362,350,349],"normals":[0,0,0]},{"vertices":[362,351,350],"normals":[0,0,0]},{"vertices":[361,351,362],"normals":[1,1,1]},{"vertices":[360,351,361],"normals":[1,1,1]},{"vertices":[359,351,360],"normals":[1,1,1]},{"vertices":[358,351,359],"normals":[1,1,1]},{"vertices":[357,351,358],"normals":[1,1,1]},{"vertices":[356,351,357],"normals":[1,1,1]},{"vertices":[355,351,356],"normals":[1,1,1]},{"vertices":[354,351,355],"normals":[1,1,1]},{"vertices":[353,351,354],"normals":[1,1,1]},{"vertices":[352,351,353],"normals":[1,1,1]},{"vertices":[438,440,439],"normals":[0,0,0]},{"vertices":[438,441,440],"normals":[0,0,0]},{"vertices":[438,442,441],"normals":[0,0,0]},{"vertices":[438,443,442],"normals":[0,0,0]},{"vertices":[438,444,443],"normals":[0,0,0]},{"vertices":[438,445,444],"normals":[0,0,0]},{"vertices":[438,446,445],"normals":[0,0,0]},{"vertices":[438,447,446],"normals":[0,0,0]},{"vertices":[438,448,447],"normals":[0,0,0]},{"vertices":[438,379,448],"normals":[0,0,0]},{"vertices":[438,380,379],"normals":[0,0,0]},{"vertices":[437,380,438],"normals":[0,0,0]},{"vertices":[437,381,380],"normals":[0,0,0]},{"vertices":[436,381,437],"normals":[0,0,0]},{"vertices":[436,382,381],"normals":[0,0,0]},{"vertices":[435,382,436],"normals":[0,0,0]},{"vertices":[435,383,382],"normals":[0,0,0]},{"vertices":[434,383,435],"normals":[0,0,0]},{"vertices":[434,384,383],"normals":[0,0,0]},{"vertices":[433,384,434],"normals":[0,0,0]},{"vertices":[433,385,384],"normals":[0,0,0]},{"vertices":[432,385,433],"normals":[0,0,0]},{"vertices":[432,386,385],"normals":[0,0,0]},{"vertices":[431,386,432],"normals":[0,0,0]},{"vertices":[431,387,386],"normals":[0,0,0]},{"vertices":[430,451,431],"normals":[0,0,0]},{"vertices":[451,387,431],"normals":[0,0,0]},{"vertices":[451,388,387],"normals":[0,0,0]},{"vertices":[451,389,388],"normals":[0,0,0]},{"vertices":[451,450,389],"normals":[0,0,0]},{"vertices":[450,390,389],"normals":[0,0,0]},{"vertices":[430,452,451],"normals":[0,0,0]},{"vertices":[449,390,450],"normals":[0,0,0]},{"vertices":[449,391,390],"normals":[0,0,0]},{"vertices":[429,452,430],"normals":[0,0,0]},{"vertices":[449,392,391],"normals":[0,0,0]},{"vertices":[455,392,449],"normals":[0,0,0]},{"vertices":[455,393,392],"normals":[0,0,0]},{"vertices":[428,452,429],"normals":[0,0,0]},{"vertices":[454,393,455],"normals":[0,0,0]},{"vertices":[454,394,393],"normals":[0,0,0]},{"vertices":[427,452,428],"normals":[0,0,0]},{"vertices":[426,452,427],"normals":[0,0,0]},{"vertices":[425,452,426],"normals":[0,0,0]},{"vertices":[424,452,425],"normals":[0,0,0]},{"vertices":[423,452,424],"normals":[0,0,0]},{"vertices":[422,452,423],"normals":[0,0,0]},{"vertices":[453,394,454],"normals":[0,0,0]},{"vertices":[453,395,394],"normals":[0,0,0]},{"vertices":[421,452,422],"normals":[0,0,0]},{"vertices":[421,453,452],"normals":[0,0,0]},{"vertices":[421,395,453],"normals":[0,0,0]},{"vertices":[420,395,421],"normals":[0,0,0]},{"vertices":[420,396,395],"normals":[0,0,0]},{"vertices":[419,396,420],"normals":[0,0,0]},{"vertices":[419,397,396],"normals":[0,0,0]},{"vertices":[418,397,419],"normals":[0,0,0]},{"vertices":[418,398,397],"normals":[0,0,0]},{"vertices":[417,398,418],"normals":[0,0,0]},{"vertices":[417,399,398],"normals":[0,0,0]},{"vertices":[416,399,417],"normals":[0,0,0]},{"vertices":[416,400,399],"normals":[0,0,0]},{"vertices":[416,401,400],"normals":[0,0,0]},{"vertices":[415,401,416],"normals":[0,0,0]},{"vertices":[415,402,401],"normals":[0,0,0]},{"vertices":[414,402,415],"normals":[0,0,0]},{"vertices":[414,403,402],"normals":[0,0,0]},{"vertices":[413,403,414],"normals":[0,0,0]},{"vertices":[412,403,413],"normals":[0,0,0]},{"vertices":[411,403,412],"normals":[1,1,1]},{"vertices":[410,403,411],"normals":[1,1,1]},{"vertices":[409,403,410],"normals":[1,1,1]},{"vertices":[408,403,409],"normals":[1,1,1]},{"vertices":[407,403,408],"normals":[1,1,1]},{"vertices":[406,403,407],"normals":[1,1,1]},{"vertices":[405,403,406],"normals":[1,1,1]},{"vertices":[404,403,405],"normals":[1,1,1]},{"vertices":[515,517,516],"normals":[0,0,0]},{"vertices":[515,518,517],"normals":[0,0,0]},{"vertices":[515,519,518],"normals":[0,0,0]},{"vertices":[515,520,519],"normals":[0,0,0]},{"vertices":[515,521,520],"normals":[0,0,0]},{"vertices":[515,522,521],"normals":[0,0,0]},{"vertices":[515,523,522],"normals":[0,0,0]},{"vertices":[515,524,523],"normals":[0,0,0]},{"vertices":[515,525,524],"normals":[0,0,0]},{"vertices":[515,456,525],"normals":[0,0,0]},{"vertices":[515,457,456],"normals":[0,0,0]},{"vertices":[514,457,515],"normals":[0,0,0]},{"vertices":[514,458,457],"normals":[0,0,0]},{"vertices":[513,458,514],"normals":[0,0,0]},{"vertices":[513,459,458],"normals":[0,0,0]},{"vertices":[512,459,513],"normals":[0,0,0]},{"vertices":[512,460,459],"normals":[0,0,0]},{"vertices":[511,460,512],"normals":[0,0,0]},{"vertices":[511,461,460],"normals":[0,0,0]},{"vertices":[510,461,511],"normals":[0,0,0]},{"vertices":[510,462,461],"normals":[0,0,0]},{"vertices":[509,462,510],"normals":[0,0,0]},{"vertices":[509,463,462],"normals":[0,0,0]},{"vertices":[508,463,509],"normals":[0,0,0]},{"vertices":[508,464,463],"normals":[0,0,0]},{"vertices":[507,528,508],"normals":[0,0,0]},{"vertices":[528,464,508],"normals":[0,0,0]},{"vertices":[528,465,464],"normals":[0,0,0]},{"vertices":[528,466,465],"normals":[0,0,0]},{"vertices":[528,527,466],"normals":[0,0,0]},{"vertices":[527,467,466],"normals":[0,0,0]},{"vertices":[507,529,528],"normals":[0,0,0]},{"vertices":[526,467,527],"normals":[0,0,0]},{"vertices":[526,468,467],"normals":[0,0,0]},{"vertices":[506,529,507],"normals":[0,0,0]},{"vertices":[526,469,468],"normals":[0,0,0]},{"vertices":[532,469,526],"normals":[0,0,0]},{"vertices":[532,470,469],"normals":[0,0,0]},{"vertices":[505,529,506],"normals":[0,0,0]},{"vertices":[531,470,532],"normals":[0,0,0]},{"vertices":[531,471,470],"normals":[0,0,0]},{"vertices":[504,529,505],"normals":[0,0,0]},{"vertices":[503,529,504],"normals":[0,0,0]},{"vertices":[502,529,503],"normals":[0,0,0]},{"vertices":[501,529,502],"normals":[0,0,0]},{"vertices":[500,529,501],"normals":[0,0,0]},{"vertices":[499,529,500],"normals":[0,0,0]},{"vertices":[530,471,531],"normals":[0,0,0]},{"vertices":[530,472,471],"normals":[0,0,0]},{"vertices":[498,529,499],"normals":[0,0,0]},{"vertices":[498,530,529],"normals":[0,0,0]},{"vertices":[498,472,530],"normals":[0,0,0]},{"vertices":[497,472,498],"normals":[0,0,0]},{"vertices":[497,473,472],"normals":[0,0,0]},{"vertices":[496,473,497],"normals":[0,0,0]},{"vertices":[496,474,473],"normals":[0,0,0]},{"vertices":[495,474,496],"normals":[0,0,0]},{"vertices":[495,475,474],"normals":[0,0,0]},{"vertices":[494,475,495],"normals":[0,0,0]},{"vertices":[494,476,475],"normals":[0,0,0]},{"vertices":[493,476,494],"normals":[0,0,0]},{"vertices":[493,477,476],"normals":[0,0,0]},{"vertices":[493,478,477],"normals":[0,0,0]},{"vertices":[492,478,493],"normals":[0,0,0]},{"vertices":[492,479,478],"normals":[0,0,0]},{"vertices":[491,479,492],"normals":[0,0,0]},{"vertices":[491,480,479],"normals":[0,0,0]},{"vertices":[490,480,491],"normals":[0,0,0]},{"vertices":[489,480,490],"normals":[0,0,0]},{"vertices":[488,480,489],"normals":[1,1,1]},{"vertices":[487,480,488],"normals":[1,1,1]},{"vertices":[486,480,487],"normals":[1,1,1]},{"vertices":[485,480,486],"normals":[1,1,1]},{"vertices":[484,480,485],"normals":[1,1,1]},{"vertices":[483,480,484],"normals":[1,1,1]},{"vertices":[482,480,483],"normals":[1,1,1]},{"vertices":[481,480,482],"normals":[1,1,1]}]}];

/***/ }),

/***/ "./src/assets/lab.json":
/*!*****************************!*\
  !*** ./src/assets/lab.json ***!
  \*****************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Torus","vertices":[{"x":1.34,"y":0,"z":0},{"x":1.196482,"y":0.346482,"z":0},{"x":0.85,"y":0.49,"z":0},{"x":0.503518,"y":0.346482,"z":0},{"x":0.503518,"y":-0.481314,"z":0},{"x":0.85,"y":-0.49,"z":0},{"x":1.196482,"y":-0.346482,"z":0},{"x":1.224151,"y":0,"z":-0.545027},{"x":1.093041,"y":0.346482,"z":-0.486653},{"x":0.776514,"y":0.49,"z":-0.345726},{"x":0.459986,"y":0.346482,"z":-0.204799},{"x":0.459986,"y":-0.481314,"z":-0.204799},{"x":0.776514,"y":-0.49,"z":-0.345726},{"x":1.093041,"y":-0.346482,"z":-0.486653},{"x":0.896635,"y":0,"z":-0.995814},{"x":0.800603,"y":0.346482,"z":-0.88916},{"x":0.568761,"y":0.49,"z":-0.631673},{"x":0.336919,"y":0.346482,"z":-0.374187},{"x":0.336919,"y":-0.481314,"z":-0.374187},{"x":0.568761,"y":-0.49,"z":-0.631673},{"x":0.800603,"y":-0.346482,"z":-0.88916},{"x":0.414083,"y":0,"z":-1.274416},{"x":0.369734,"y":0.346482,"z":-1.137922},{"x":0.262665,"y":0.49,"z":-0.808398},{"x":0.155596,"y":0.346482,"z":-0.478874},{"x":0.155596,"y":-0.481314,"z":-0.478874},{"x":0.262665,"y":-0.49,"z":-0.808398},{"x":0.369734,"y":-0.346482,"z":-1.137922},{"x":-0.140069,"y":0,"z":-1.332659},{"x":-0.125067,"y":0.346482,"z":-1.189928},{"x":-0.088849,"y":0.49,"z":-0.845344},{"x":-0.052632,"y":0.346482,"z":-0.500759},{"x":-0.052632,"y":-0.481314,"z":-0.500759},{"x":-0.088849,"y":-0.49,"z":-0.845344},{"x":-0.125067,"y":-0.346482,"z":-1.189928},{"x":-0.67,"y":0,"z":-1.160474},{"x":-0.598241,"y":0.346482,"z":-1.036184},{"x":-0.425,"y":0.49,"z":-0.736122},{"x":-0.251759,"y":0.346482,"z":-0.436059},{"x":-0.251759,"y":-0.481314,"z":-0.436059},{"x":-0.425,"y":-0.49,"z":-0.736122},{"x":-0.598241,"y":-0.346482,"z":-1.036184},{"x":-1.084083,"y":0,"z":-0.787632},{"x":-0.967975,"y":0.346482,"z":-0.703274},{"x":-0.687665,"y":0.49,"z":-0.499617},{"x":-0.407354,"y":0.346482,"z":-0.29596},{"x":-0.407354,"y":-0.481314,"z":-0.29596},{"x":-0.687665,"y":-0.49,"z":-0.499617},{"x":-0.967975,"y":-0.346482,"z":-0.703274},{"x":-1.310718,"y":0,"z":-0.278602},{"x":-1.170336,"y":0.346482,"z":-0.248763},{"x":-0.831425,"y":0.49,"z":-0.176725},{"x":-0.492515,"y":0.346482,"z":-0.104687},{"x":-0.492515,"y":-0.481314,"z":-0.104687},{"x":-0.831425,"y":-0.49,"z":-0.176725},{"x":-1.170336,"y":-0.346482,"z":-0.248763},{"x":-1.310718,"y":0,"z":0.278602},{"x":-1.170336,"y":0.346482,"z":0.248763},{"x":-0.831425,"y":0.49,"z":0.176725},{"x":-0.492515,"y":0.346482,"z":0.104687},{"x":-0.492515,"y":-0.481314,"z":0.104687},{"x":-0.831425,"y":-0.49,"z":0.176725},{"x":-1.170336,"y":-0.346482,"z":0.248763},{"x":-1.084083,"y":0,"z":0.787632},{"x":-0.967975,"y":0.346482,"z":0.703274},{"x":-0.687665,"y":0.49,"z":0.499617},{"x":-0.407354,"y":0.346482,"z":0.29596},{"x":-0.407354,"y":-0.481314,"z":0.29596},{"x":-0.687665,"y":-0.49,"z":0.499617},{"x":-0.967975,"y":-0.346482,"z":0.703274},{"x":-0.67,"y":0,"z":1.160474},{"x":-0.598241,"y":0.346482,"z":1.036184},{"x":-0.425,"y":0.49,"z":0.736122},{"x":-0.251759,"y":0.346482,"z":0.436059},{"x":-0.251759,"y":-0.481314,"z":0.436059},{"x":-0.425,"y":-0.49,"z":0.736122},{"x":-0.598241,"y":-0.346482,"z":1.036184},{"x":-0.140069,"y":0,"z":1.332659},{"x":-0.125067,"y":0.346482,"z":1.189928},{"x":-0.088849,"y":0.49,"z":0.845344},{"x":-0.052632,"y":0.346482,"z":0.500759},{"x":-0.052632,"y":-0.481314,"z":0.500759},{"x":-0.088849,"y":-0.49,"z":0.845344},{"x":-0.125067,"y":-0.346482,"z":1.189928},{"x":0.414083,"y":0,"z":1.274416},{"x":0.369734,"y":0.346482,"z":1.137922},{"x":0.262665,"y":0.49,"z":0.808398},{"x":0.155596,"y":0.346482,"z":0.478874},{"x":0.155596,"y":-0.481314,"z":0.478874},{"x":0.262665,"y":-0.49,"z":0.808398},{"x":0.369734,"y":-0.346482,"z":1.137922},{"x":0.896635,"y":0,"z":0.995814},{"x":0.800603,"y":0.346482,"z":0.88916},{"x":0.568761,"y":0.49,"z":0.631673},{"x":0.336919,"y":0.346482,"z":0.374187},{"x":0.336919,"y":-0.481314,"z":0.374187},{"x":0.568761,"y":-0.49,"z":0.631673},{"x":0.800603,"y":-0.346482,"z":0.88916},{"x":1.224151,"y":0,"z":0.545027},{"x":1.093041,"y":0.346482,"z":0.486653},{"x":0.776514,"y":0.49,"z":0.345726},{"x":0.459986,"y":0.346482,"z":0.204799},{"x":0.459986,"y":-0.481314,"z":0.204799},{"x":0.776514,"y":-0.49,"z":0.345726},{"x":1.093041,"y":-0.346482,"z":0.486653},{"x":0.340738,"y":-0.425033,"z":0},{"x":0.31128,"y":-0.425033,"z":-0.138591},{"x":0.227998,"y":-0.425033,"z":-0.253218},{"x":0.105294,"y":-0.425033,"z":-0.324061},{"x":-0.035617,"y":-0.425033,"z":-0.338871},{"x":-0.170369,"y":-0.425033,"z":-0.295088},{"x":-0.275663,"y":-0.425033,"z":-0.200281},{"x":-0.333292,"y":-0.425033,"z":-0.070843},{"x":-0.333292,"y":-0.425033,"z":0.070843},{"x":-0.275663,"y":-0.425033,"z":0.200281},{"x":-0.170369,"y":-0.425033,"z":0.295088},{"x":-0.035617,"y":-0.425033,"z":0.338871},{"x":0.105294,"y":-0.425033,"z":0.324061},{"x":0.227998,"y":-0.425033,"z":0.253218},{"x":0.31128,"y":-0.425033,"z":0.138591},{"x":-0.492515,"y":-0.481314,"z":-0.104687},{"x":-0.492515,"y":-0.481314,"z":0.104687},{"x":-0.333292,"y":-0.377387,"z":-0.070843},{"x":-0.333292,"y":-0.377387,"z":0.070843},{"x":0.155596,"y":-0.481314,"z":-0.478874},{"x":-0.052632,"y":-0.481314,"z":-0.500759},{"x":0.105294,"y":-0.377163,"z":-0.324061},{"x":-0.035617,"y":-0.377387,"z":-0.338871},{"x":0.503518,"y":-0.481314,"z":0},{"x":0.459986,"y":-0.481314,"z":0.204799},{"x":0.340738,"y":-0.377387,"z":0},{"x":0.31128,"y":-0.377387,"z":0.138591},{"x":-0.052632,"y":-0.481314,"z":0.500759},{"x":0.155596,"y":-0.481314,"z":0.478874},{"x":-0.035617,"y":-0.377387,"z":0.338871},{"x":0.105294,"y":-0.377387,"z":0.324061},{"x":0.291364,"y":0.22909,"z":-0.129724},{"x":0.213411,"y":0.22909,"z":-0.237017},{"x":-0.033338,"y":0.22909,"z":-0.317191},{"x":-0.159469,"y":0.22909,"z":-0.276208},{"x":-0.311969,"y":0.22909,"z":0.066311},{"x":-0.258026,"y":0.22909,"z":0.187467},{"x":0.318938,"y":0.22909,"z":0},{"x":-0.258026,"y":0.22909,"z":-0.187467},{"x":-0.311969,"y":0.22909,"z":-0.066311},{"x":-0.033338,"y":0.22909,"z":0.317191},{"x":0.098557,"y":0.22909,"z":0.303328},{"x":0.213411,"y":0.22909,"z":0.237017},{"x":0.291364,"y":0.22909,"z":0.129724},{"x":0.098557,"y":0.22909,"z":-0.303328},{"x":-0.159469,"y":0.22909,"z":0.276208},{"x":-0.054273,"y":0.194721,"z":-0.511883},{"x":-0.257675,"y":0.194721,"z":-0.445794},{"x":0.51382,"y":0.194721,"z":-0.000371},{"x":0.469354,"y":0.194721,"z":-0.209568},{"x":-0.054273,"y":0.194721,"z":0.511142},{"x":0.158427,"y":0.194721,"z":0.488786},{"x":-0.503601,"y":0.194721,"z":-0.107306},{"x":-0.503601,"y":0.194721,"z":0.106565},{"x":0.343644,"y":0.194721,"z":0.381851},{"x":0.469354,"y":0.194721,"z":0.208826},{"x":0.343644,"y":0.194721,"z":-0.382592},{"x":0.158427,"y":0.194721,"z":-0.489528},{"x":-0.416612,"y":0.194721,"z":0.301945},{"x":-0.257675,"y":0.194721,"z":0.445052},{"x":-0.034564,"y":0.074808,"z":-0.324373},{"x":-0.163404,"y":0.074808,"z":-0.282511},{"x":0.325276,"y":0.074808,"z":-0.000371},{"x":0.297111,"y":0.074808,"z":-0.13288},{"x":-0.034564,"y":0.074808,"z":0.323631},{"x":0.100163,"y":0.074808,"z":0.309471},{"x":-0.319178,"y":0.074808,"z":-0.068106},{"x":-0.319178,"y":0.074808,"z":0.067364},{"x":0.217484,"y":0.074808,"z":0.241736},{"x":0.297111,"y":0.074808,"z":0.132139},{"x":0.217484,"y":0.074808,"z":-0.242478},{"x":0.100163,"y":0.074808,"z":-0.310212},{"x":-0.264078,"y":0.074808,"z":0.191122},{"x":-0.163404,"y":0.074808,"z":0.281769},{"x":-0.027516,"y":0.040453,"z":-0.330449},{"x":-0.161176,"y":0.040453,"z":-0.28702},{"x":0.34579,"y":0.040453,"z":0.005676},{"x":0.31657,"y":0.040453,"z":-0.131791},{"x":-0.027516,"y":0.040453,"z":0.341802},{"x":0.112253,"y":0.040453,"z":0.327111},{"x":-0.322779,"y":0.040453,"z":-0.064593},{"x":-0.322779,"y":0.040453,"z":0.075946},{"x":0.233963,"y":0.040453,"z":0.256842},{"x":0.31657,"y":0.040453,"z":0.143144},{"x":0.233963,"y":0.040453,"z":-0.245489},{"x":0.112253,"y":0.040453,"z":-0.315759},{"x":-0.265616,"y":0.040453,"z":0.204334},{"x":-0.161176,"y":0.040453,"z":0.298373},{"x":-0.014565,"y":-0.038344,"z":-0.207232},{"x":-0.099228,"y":-0.038344,"z":-0.179724},{"x":0.221894,"y":-0.038344,"z":0.005676},{"x":0.203386,"y":-0.038344,"z":-0.081398},{"x":-0.014565,"y":-0.038344,"z":0.218585},{"x":0.073967,"y":-0.038344,"z":0.20928},{"x":-0.20159,"y":-0.038344,"z":-0.038834},{"x":-0.20159,"y":-0.038344,"z":0.050186},{"x":0.151061,"y":-0.038344,"z":0.16477},{"x":0.203386,"y":-0.038344,"z":0.092751},{"x":0.151061,"y":-0.038344,"z":-0.153417},{"x":0.073967,"y":-0.038344,"z":-0.197927},{"x":-0.165383,"y":-0.038344,"z":0.13151},{"x":-0.099228,"y":-0.038344,"z":0.191076},{"x":0.227998,"y":-0.377163,"z":0.253218},{"x":-0.170369,"y":-0.377163,"z":0.295088},{"x":0.227998,"y":-0.377163,"z":-0.253218},{"x":-0.275663,"y":-0.377163,"z":0.200281},{"x":-0.170369,"y":-0.377163,"z":-0.295088},{"x":-0.275663,"y":-0.377163,"z":-0.200281},{"x":0.31128,"y":-0.377163,"z":-0.138591},{"x":0.43016,"y":0,"z":-1.316058},{"x":0.384225,"y":0.358869,"z":-1.174685},{"x":-1.121566,"y":0,"z":0.819709},{"x":-1.001307,"y":0.358869,"z":0.732336},{"x":-0.692679,"y":0,"z":-1.198043},{"x":-0.618355,"y":0.358869,"z":-1.069309},{"x":1.269188,"y":0,"z":-0.560593},{"x":1.133391,"y":0.358869,"z":-0.500132},{"x":-0.128265,"y":-0.358869,"z":-1.228549},{"x":-0.618355,"y":-0.358869,"z":-1.069309},{"x":0.929963,"y":0,"z":1.035334},{"x":0.830498,"y":-0.358869,"z":0.924866},{"x":-1.356303,"y":0,"z":0.292481},{"x":-1.210903,"y":0.358869,"z":0.261575},{"x":1.24053,"y":-0.358869,"z":0.003919},{"x":1.133391,"y":-0.358869,"z":-0.500132},{"x":1.133391,"y":0.358869,"z":0.50797},{"x":-1.001307,"y":-0.358869,"z":-0.724498},{"x":-1.210903,"y":-0.358869,"z":-0.253737},{"x":-0.143803,"y":0,"z":-1.376384},{"x":-0.128265,"y":0.358869,"z":-1.228549},{"x":1.389179,"y":0,"z":0.003919},{"x":1.24053,"y":0.358869,"z":0.003919},{"x":-0.618355,"y":0.358869,"z":1.077147},{"x":-0.128265,"y":0.358869,"z":1.236387},{"x":-0.692679,"y":0,"z":1.205881},{"x":-0.618355,"y":-0.358869,"z":1.077147},{"x":-1.121566,"y":0,"z":-0.811871},{"x":-1.001307,"y":0.358869,"z":-0.724498},{"x":-0.143803,"y":0,"z":1.384221},{"x":-0.128265,"y":-0.358869,"z":1.236387},{"x":-1.356303,"y":0,"z":-0.284643},{"x":-1.210903,"y":0.358869,"z":-0.253737},{"x":0.830498,"y":0.358869,"z":-0.917029},{"x":1.133391,"y":-0.358869,"z":0.50797},{"x":1.269188,"y":0,"z":0.568431},{"x":0.929963,"y":0,"z":-1.027496},{"x":0.830498,"y":-0.358869,"z":-0.917029},{"x":-1.001307,"y":-0.358869,"z":0.732336},{"x":0.384225,"y":-0.358869,"z":-1.174685},{"x":-1.210903,"y":-0.358869,"z":0.261575},{"x":0.830498,"y":0.358869,"z":0.924866},{"x":0.454178,"y":0,"z":-1.380782},{"x":0.405831,"y":0.377716,"z":-1.231985},{"x":-1.179042,"y":0,"z":0.867151},{"x":-1.052467,"y":0.377716,"z":0.775189},{"x":-0.72763,"y":0,"z":-1.25657},{"x":-0.649403,"y":0.377716,"z":-1.121075},{"x":1.337271,"y":0,"z":-0.585642},{"x":1.194342,"y":0.377716,"z":-0.522006},{"x":-0.133574,"y":-0.377716,"z":-1.288678},{"x":-0.649403,"y":-0.377716,"z":-1.121075},{"x":0.98023,"y":0,"z":1.0941},{"x":0.875541,"y":-0.377716,"z":0.977831},{"x":-1.426107,"y":0,"z":0.312234},{"x":-1.27307,"y":0.377716,"z":0.279705},{"x":1.307108,"y":-0.377716,"z":0.008517},{"x":1.194342,"y":-0.377716,"z":-0.522006},{"x":-1.052467,"y":-0.377716,"z":-0.758155},{"x":-1.27307,"y":-0.377716,"z":-0.262671},{"x":-0.149928,"y":0,"z":-1.444277},{"x":-0.133574,"y":0.377716,"z":-1.288678},{"x":1.463563,"y":0,"z":0.008517},{"x":1.307108,"y":0.377716,"z":0.008517},{"x":-0.649403,"y":0.377716,"z":1.138109},{"x":-0.133574,"y":0.377716,"z":1.305712},{"x":-0.72763,"y":0,"z":1.273604},{"x":-0.649403,"y":-0.377716,"z":1.138109},{"x":-1.179042,"y":0,"z":-0.850117},{"x":-1.052467,"y":0.377716,"z":-0.758155},{"x":-0.149928,"y":0,"z":1.461311},{"x":-0.133574,"y":-0.377716,"z":1.305712},{"x":-1.426107,"y":0,"z":-0.2952},{"x":-1.27307,"y":0.377716,"z":-0.262671},{"x":0.875542,"y":0.377716,"z":-0.960797},{"x":1.337271,"y":0,"z":0.602676},{"x":1.194342,"y":-0.377716,"z":0.53904},{"x":0.980231,"y":0,"z":-1.077066},{"x":0.875542,"y":-0.377716,"z":-0.960797},{"x":-1.052467,"y":-0.377716,"z":0.775189},{"x":0.405831,"y":-0.377716,"z":-1.231985},{"x":-1.27307,"y":-0.377716,"z":0.279705},{"x":0.875541,"y":0.377716,"z":0.977831},{"x":1.194342,"y":0.377716,"z":0.53904},{"x":-0.118966,"y":-0.411034,"z":-0.025287},{"x":-0.118966,"y":-0.411034,"z":0.025287},{"x":0.037584,"y":-0.410954,"z":-0.115671},{"x":-0.012713,"y":-0.411034,"z":-0.120958},{"x":0.121624,"y":-0.411034,"z":0},{"x":0.111109,"y":-0.411034,"z":0.049469},{"x":-0.012713,"y":-0.411034,"z":0.120958},{"x":0.037584,"y":-0.411034,"z":0.115671},{"x":-0.098396,"y":-0.410954,"z":0.071489},{"x":-0.060812,"y":-0.410954,"z":0.105329},{"x":-0.060812,"y":-0.410954,"z":-0.105329},{"x":-0.098396,"y":-0.410954,"z":-0.071489},{"x":0.111109,"y":-0.410954,"z":-0.049469},{"x":0.081382,"y":-0.410954,"z":-0.090384},{"x":0.081382,"y":-0.410954,"z":0.090384},{"x":-0.118966,"y":-0.392669,"z":-0.025287},{"x":-0.118966,"y":-0.392669,"z":0.025287},{"x":0.037584,"y":-0.392589,"z":-0.115671},{"x":-0.012713,"y":-0.392669,"z":-0.120958},{"x":0.121624,"y":-0.392669,"z":0},{"x":0.111109,"y":-0.392669,"z":0.049469},{"x":-0.012713,"y":-0.392669,"z":0.120958},{"x":0.037584,"y":-0.392669,"z":0.115671},{"x":-0.098396,"y":-0.392589,"z":0.071489},{"x":-0.060812,"y":-0.392589,"z":0.105329},{"x":-0.060812,"y":-0.392589,"z":-0.105329},{"x":-0.098396,"y":-0.392589,"z":-0.071489},{"x":0.111109,"y":-0.392589,"z":-0.049469},{"x":0.081382,"y":-0.392589,"z":-0.090384},{"x":0.081382,"y":-0.392589,"z":0.090384},{"x":0.24107,"y":0.22909,"z":-0.107331},{"x":0.176573,"y":0.22909,"z":-0.196104},{"x":-0.027584,"y":0.22909,"z":-0.262439},{"x":-0.131942,"y":0.22909,"z":-0.228531},{"x":-0.258118,"y":0.22909,"z":0.054865},{"x":-0.213487,"y":0.22909,"z":0.155107},{"x":0.263884,"y":0.22909,"z":0},{"x":-0.213487,"y":0.22909,"z":-0.155107},{"x":-0.258118,"y":0.22909,"z":-0.054865},{"x":-0.027584,"y":0.22909,"z":0.262439},{"x":0.081545,"y":0.22909,"z":0.250969},{"x":0.176573,"y":0.22909,"z":0.196104},{"x":0.24107,"y":0.22909,"z":0.107331},{"x":0.081545,"y":0.22909,"z":-0.250969},{"x":-0.131942,"y":0.22909,"z":0.228531},{"x":0.24107,"y":0.277878,"z":-0.107331},{"x":0.176573,"y":0.277878,"z":-0.196104},{"x":-0.027584,"y":0.277878,"z":-0.262439},{"x":-0.131942,"y":0.277878,"z":-0.228531},{"x":-0.258118,"y":0.277878,"z":0.054865},{"x":-0.213487,"y":0.277878,"z":0.155107},{"x":0.263884,"y":0.277878,"z":0},{"x":-0.213487,"y":0.277878,"z":-0.155107},{"x":-0.258118,"y":0.277878,"z":-0.054865},{"x":-0.027584,"y":0.277878,"z":0.262439},{"x":0.081545,"y":0.277878,"z":0.250969},{"x":0.176573,"y":0.277878,"z":0.196104},{"x":0.24107,"y":0.277878,"z":0.107331},{"x":0.081545,"y":0.277878,"z":-0.250969},{"x":-0.131942,"y":0.277878,"z":0.228531},{"x":0.100267,"y":0.451819,"z":-0.044642},{"x":0.073441,"y":0.451819,"z":-0.081565},{"x":-0.011473,"y":0.451819,"z":-0.109155},{"x":-0.054878,"y":0.451819,"z":-0.095052},{"x":-0.107358,"y":0.451819,"z":0.02282},{"x":-0.088795,"y":0.451819,"z":0.064513},{"x":0.109756,"y":0.451819,"z":0},{"x":-0.088795,"y":0.451819,"z":-0.064513},{"x":-0.107358,"y":0.451819,"z":-0.02282},{"x":-0.011473,"y":0.451819,"z":0.109155},{"x":0.033917,"y":0.451819,"z":0.104384},{"x":0.073441,"y":0.451819,"z":0.081565},{"x":0.100267,"y":0.451819,"z":0.044642},{"x":0.033917,"y":0.451819,"z":-0.104384},{"x":-0.054878,"y":0.451819,"z":0.095052},{"x":-0.094448,"y":-0.377053,"z":-0.020076},{"x":-0.094448,"y":-0.377053,"z":0.020076},{"x":0.029838,"y":-0.37699,"z":-0.091832},{"x":-0.010093,"y":-0.377053,"z":-0.096029},{"x":0.096558,"y":-0.377053,"z":0},{"x":0.08821,"y":-0.377053,"z":0.039274},{"x":-0.010093,"y":-0.377053,"z":0.096029},{"x":0.029838,"y":-0.377053,"z":0.091832},{"x":-0.078117,"y":-0.37699,"z":0.056755},{"x":-0.048279,"y":-0.37699,"z":0.083622},{"x":-0.048279,"y":-0.37699,"z":-0.083622},{"x":-0.078117,"y":-0.37699,"z":-0.056755},{"x":0.08821,"y":-0.37699,"z":-0.039274},{"x":0.06461,"y":-0.37699,"z":-0.071757},{"x":0.06461,"y":-0.37699,"z":0.071757},{"x":-0.073298,"y":-0.390084,"z":-0.01558},{"x":-0.073298,"y":-0.390084,"z":0.01558},{"x":0.023156,"y":-0.390034,"z":-0.071268},{"x":-0.007833,"y":-0.390084,"z":-0.074525},{"x":0.074936,"y":-0.390084,"z":0},{"x":0.068457,"y":-0.390084,"z":0.030479},{"x":-0.007833,"y":-0.390084,"z":0.074525},{"x":0.023156,"y":-0.390084,"z":0.071268},{"x":-0.060624,"y":-0.390034,"z":0.044046},{"x":-0.037468,"y":-0.390034,"z":0.064896},{"x":-0.037468,"y":-0.390034,"z":-0.064896},{"x":-0.060624,"y":-0.390034,"z":-0.044046},{"x":0.068457,"y":-0.390034,"z":-0.030479},{"x":0.050142,"y":-0.390034,"z":-0.055688},{"x":0.050142,"y":-0.390034,"z":0.055688},{"x":-0.073298,"y":-0.567103,"z":-0.01558},{"x":-0.073298,"y":-0.567103,"z":0.01558},{"x":0.023156,"y":-0.567054,"z":-0.071268},{"x":-0.007833,"y":-0.567103,"z":-0.074525},{"x":0.074936,"y":-0.567103,"z":0},{"x":0.068457,"y":-0.567103,"z":0.030479},{"x":-0.007833,"y":-0.567103,"z":0.074525},{"x":0.023156,"y":-0.567103,"z":0.071268},{"x":-0.060624,"y":-0.567054,"z":0.044046},{"x":-0.037468,"y":-0.567054,"z":0.064896},{"x":-0.037468,"y":-0.567054,"z":-0.064896},{"x":-0.060624,"y":-0.567054,"z":-0.044046},{"x":0.068457,"y":-0.567054,"z":-0.030479},{"x":0.050142,"y":-0.567054,"z":-0.055688},{"x":0.050142,"y":-0.567054,"z":0.055688}],"normals":[{"x":0.2911,"y":-0.0356,"z":0.956},{"x":0.3814,"y":-0.9208,"z":-0.0811},{"x":0.0251,"y":0.9997,"z":-0.0053},{"x":-0.7498,"y":-0.3755,"z":0.5448},{"x":-0.3155,"y":-0.9208,"z":0.2292},{"x":0.3155,"y":-0.9208,"z":-0.2292},{"x":0.0207,"y":0.9997,"z":-0.0151},{"x":-0.3155,"y":0.9208,"z":0.2292},{"x":-0.7498,"y":0.3755,"z":0.5448},{"x":0.1571,"y":0.1209,"z":-0.9801},{"x":-0.9952,"y":-0.0528,"z":-0.0826},{"x":0.195,"y":-0.9208,"z":-0.3377},{"x":0.0128,"y":0.9997,"z":-0.0222},{"x":0.2911,"y":0.0356,"z":0.956},{"x":-0.5429,"y":-0.0225,"z":0.8395},{"x":-0.0969,"y":-0.3755,"z":0.9217},{"x":-0.0408,"y":-0.9208,"z":0.3878},{"x":0.0408,"y":-0.9208,"z":-0.3878},{"x":0.0027,"y":0.9997,"z":-0.0255},{"x":-0.0408,"y":0.9208,"z":0.3878},{"x":-0.0969,"y":0.3755,"z":0.9217},{"x":-0.9973,"y":0.0134,"z":-0.0722},{"x":0.7644,"y":-0.0134,"z":-0.6446},{"x":-0.1205,"y":-0.9208,"z":-0.3709},{"x":-0.0079,"y":0.9997,"z":-0.0244},{"x":0.6202,"y":-0.3755,"z":0.6888},{"x":0.2609,"y":-0.9208,"z":0.2898},{"x":-0.2609,"y":-0.9208,"z":-0.2898},{"x":-0.0171,"y":0.9997,"z":-0.019},{"x":0.2609,"y":0.9208,"z":0.2898},{"x":0.6202,"y":0.3755,"z":0.6888},{"x":-0.461,"y":-0.025,"z":0.8871},{"x":0.9364,"y":0.084,"z":0.3408},{"x":-0.3562,"y":-0.9208,"z":-0.1586},{"x":-0.0234,"y":0.9997,"z":-0.0104},{"x":-0.6247,"y":0.1267,"z":-0.7705},{"x":0.8593,"y":0.0301,"z":-0.5105},{"x":0.9268,"y":-0.3755,"z":0},{"x":0.3899,"y":-0.9208,"z":0},{"x":-0.3899,"y":-0.9208,"z":0},{"x":-0.0256,"y":0.9997,"z":0},{"x":0.3899,"y":0.9208,"z":0},{"x":0.9268,"y":0.3755,"z":0},{"x":0.9327,"y":0.0225,"z":0.3601},{"x":0.0794,"y":-0.0329,"z":-0.9963},{"x":-0.3562,"y":-0.9208,"z":0.1586},{"x":-0.0234,"y":0.9997,"z":0.0104},{"x":0.8943,"y":0.025,"z":0.4467},{"x":0.6202,"y":-0.3755,"z":-0.6888},{"x":0.2609,"y":-0.9208,"z":-0.2898},{"x":-0.2609,"y":-0.9208,"z":0.2898},{"x":-0.0171,"y":0.9997,"z":0.019},{"x":0.2609,"y":0.9208,"z":-0.2898},{"x":0.6202,"y":0.3755,"z":-0.6888},{"x":0.2605,"y":-0.1355,"z":0.9559},{"x":-0.9953,"y":0.0301,"z":0.0921},{"x":-0.1205,"y":-0.9208,"z":0.3709},{"x":-0.0079,"y":0.9997,"z":0.0244},{"x":-0.6498,"y":-0.0329,"z":-0.7594},{"x":-0.6247,"y":-0.1267,"z":-0.7705},{"x":-0.0969,"y":-0.3755,"z":-0.9217},{"x":-0.0408,"y":-0.9208,"z":-0.3878},{"x":0.0408,"y":-0.9208,"z":0.3878},{"x":0.0027,"y":0.9997,"z":0.0255},{"x":-0.0408,"y":0.9208,"z":-0.3878},{"x":-0.0969,"y":0.3755,"z":-0.9217},{"x":-0.4634,"y":-0.3755,"z":-0.8026},{"x":-0.195,"y":-0.9208,"z":-0.3377},{"x":0.195,"y":-0.9208,"z":0.3377},{"x":0.0128,"y":0.9997,"z":0.0222},{"x":-0.195,"y":0.9208,"z":-0.3377},{"x":-0.4634,"y":0.3755,"z":-0.8026},{"x":-0.7032,"y":-0.1209,"z":-0.7006},{"x":0.3155,"y":-0.9208,"z":0.2292},{"x":0.2696,"y":0.9428,"z":-0.1959},{"x":0.0207,"y":0.9997,"z":0.0151},{"x":-0.9953,"y":-0.0301,"z":0.0921},{"x":-0.9066,"y":-0.3755,"z":-0.1927},{"x":-0.3814,"y":-0.9208,"z":-0.0811},{"x":0.3814,"y":-0.9208,"z":0.0811},{"x":0.0251,"y":0.9997,"z":0.0053},{"x":-0.3814,"y":0.9208,"z":-0.0811},{"x":-0.9066,"y":0.3755,"z":-0.1927},{"x":-0.6691,"y":0,"z":0.7431},{"x":-0.3045,"y":0.9428,"z":0.1356},{"x":-0.103,"y":0.9428,"z":-0.317},{"x":0.2696,"y":0.9428,"z":0.1959},{"x":0.1666,"y":0.9428,"z":-0.2886},{"x":-0.223,"y":0.9428,"z":-0.2477},{"x":-0.103,"y":0.9428,"z":0.317},{"x":0,"y":0,"z":1},{"x":0.1666,"y":0.9428,"z":0.2886},{"x":-0.223,"y":0.9428,"z":0.2477},{"x":0.326,"y":0.9428,"z":-0.0693},{"x":-0.3045,"y":0.9428,"z":-0.1356},{"x":-0.4067,"y":0,"z":0.9135},{"x":-0.5466,"y":0.8374,"z":0},{"x":0.2079,"y":0,"z":-0.9781},{"x":0.0571,"y":0.8374,"z":-0.5436},{"x":0.9511,"y":0,"z":0.309},{"x":0.5346,"y":0.8374,"z":0.1136},{"x":0.0571,"y":0.8374,"z":0.5436},{"x":-0.9945,"y":0,"z":-0.1045},{"x":0.057,"y":-0.8384,"z":-0.5421},{"x":0,"y":-1,"z":0},{"x":-0.7435,"y":0.0008,"z":0.6687},{"x":0.4063,"y":0.0008,"z":-0.9138},{"x":-0.9773,"y":-0.0407,"z":0.2077},{"x":-0.9518,"y":0.0038,"z":-0.3067},{"x":0.441,"y":-0.8384,"z":-0.3204},{"x":0.2726,"y":-0.8384,"z":0.4721},{"x":0.5332,"y":-0.8384,"z":0.1133},{"x":-0.498,"y":-0.8384,"z":0.2217},{"x":0.1043,"y":0.0668,"z":0.9923},{"x":-0.1684,"y":-0.8384,"z":0.5184},{"x":-0.498,"y":-0.8384,"z":-0.2217},{"x":-0.8655,"y":0.0016,"z":0.5009},{"x":0.9943,"y":-0.0029,"z":-0.1064},{"x":-0.3647,"y":-0.8384,"z":-0.4051},{"x":0.9801,"y":0.197,"z":0.023},{"x":-0.8945,"y":-0.1147,"z":0.4322},{"x":-0.2006,"y":-0.7608,"z":-0.6173},{"x":0.4791,"y":0.6982,"z":-0.5321},{"x":0.1346,"y":-0.1147,"z":-0.9842},{"x":-0.358,"y":0.6982,"z":0.62},{"x":0.3247,"y":0.197,"z":0.9251},{"x":-0.1044,"y":-0.0407,"z":-0.9937},{"x":-0.9973,"y":0.0729,"z":0},{"x":-0.3082,"y":0.0729,"z":-0.9485},{"x":0.9515,"y":-0.0023,"z":-0.3076},{"x":0.9989,"y":-0.0467,"z":0},{"x":-0.9943,"y":0.0034,"z":-0.1067},{"x":-0.8084,"y":-0.0393,"z":-0.5873},{"x":0.7448,"y":-0.004,"z":0.6673},{"x":0.8648,"y":-0.004,"z":0.5022},{"x":0.8073,"y":0.0654,"z":0.5865},{"x":-0.5858,"y":0.0038,"z":-0.8104},{"x":0.4988,"y":0.07,"z":-0.8639},{"x":-0.4087,"y":0.0034,"z":-0.9126},{"x":0.0015,"y":-0.0023,"z":1},{"x":-0.6675,"y":0.07,"z":0.7413},{"x":-0.4995,"y":-0.0438,"z":0.8652},{"x":0.2061,"y":-0.0029,"z":0.9785},{"x":0.6685,"y":-0.0438,"z":-0.7424},{"x":0.976,"y":0.0668,"z":-0.2074},{"x":0.2089,"y":0.0016,"z":-0.9779},{"x":0.3087,"y":-0.0467,"z":0.95},{"x":0.441,"y":-0.8384,"z":0.3204},{"x":0.057,"y":-0.8384,"z":0.5421},{"x":0.2726,"y":-0.8384,"z":-0.4721},{"x":-0.3647,"y":-0.8384,"z":0.4051},{"x":-0.5451,"y":-0.8384,"z":0},{"x":-0.1684,"y":-0.8384,"z":-0.5184},{"x":0.5332,"y":-0.8384,"z":-0.1133},{"x":0.6667,"y":-0.7317,"z":-0.1417},{"x":-0.8675,"y":-0.2345,"z":-0.4387},{"x":0.0712,"y":-0.7317,"z":0.6779},{"x":0.4318,"y":-0.044,"z":-0.9009},{"x":-0.649,"y":-0.7608,"z":0},{"x":-0.7234,"y":-0.044,"z":0.689},{"x":0.5575,"y":-0.7246,"z":0.4051},{"x":0.9156,"y":0.1261,"z":-0.3818},{"x":0.3322,"y":-0.7475,"z":-0.5753},{"x":-0.9814,"y":-0.1912,"z":0.0191},{"x":-0.4445,"y":-0.7475,"z":0.4937},{"x":0.6171,"y":0.23,"z":0.7525},{"x":0.2143,"y":0.7206,"z":0.6595},{"x":0.9064,"y":0.23,"z":0.3544},{"x":-0.7253,"y":0.6709,"z":0.1542},{"x":-0.6853,"y":-0.2345,"z":-0.6895},{"x":-0.0775,"y":0.6709,"z":-0.7375},{"x":-0.2851,"y":-0.1912,"z":-0.9392},{"x":0.6934,"y":0.7206,"z":0},{"x":-0.0802,"y":0.1261,"z":0.9888},{"x":-0.6089,"y":0.6584,"z":-0.4424},{"x":0.1042,"y":0.9878,"z":-0.1157},{"x":-0.6691,"y":0,"z":-0.7431},{"x":0.809,"y":0,"z":0.5878},{"x":0.809,"y":0,"z":-0.5878},{"x":-0.9135,"y":0,"z":0.4067},{"x":-0.309,"y":0,"z":-0.9511},{"x":0.5,"y":0,"z":0.866},{"x":0.9781,"y":0,"z":-0.2079},{"x":-0.309,"y":0,"z":0.9511},{"x":-0.9135,"y":0,"z":-0.4067},{"x":0.5,"y":0,"z":-0.866},{"x":-0.6364,"y":-0.0255,"z":-0.771},{"x":-0.3182,"y":-0.9456,"z":0.0676},{"x":-0.3182,"y":0.9456,"z":0.0676},{"x":-0.9959,"y":-0.0061,"z":0.0899},{"x":0.2757,"y":0.9595,"z":-0.0586},{"x":-0.1639,"y":-0.9448,"z":0.2838},{"x":-0.1639,"y":0.9448,"z":0.2838},{"x":-0.083,"y":0.9632,"z":0.2555},{"x":0.2757,"y":-0.9595,"z":-0.0586},{"x":0.1016,"y":-0.9444,"z":0.3127},{"x":0.1016,"y":0.9444,"z":0.3127},{"x":0.2722,"y":-0.0274,"z":0.9619},{"x":-0.7019,"y":-0.0246,"z":-0.7118},{"x":0.2994,"y":-0.9448,"z":0.1333},{"x":0.2994,"y":0.9448,"z":0.1333},{"x":-0.0943,"y":-0.9523,"z":-0.2902},{"x":0.7599,"y":-0.0105,"z":-0.65},{"x":0.2972,"y":-0.9456,"z":-0.1323},{"x":0.2972,"y":0.9456,"z":-0.1323},{"x":-0.4493,"y":0.0195,"z":0.8932},{"x":-0.0943,"y":0.9523,"z":-0.2902},{"x":0.0998,"y":-0.9464,"z":-0.3073},{"x":0.0998,"y":0.9464,"z":-0.3073},{"x":0.1495,"y":-0.0246,"z":-0.9885},{"x":0.2174,"y":-0.9632,"z":0.1579},{"x":-0.2614,"y":-0.9464,"z":-0.1899},{"x":-0.2614,"y":0.9464,"z":-0.1899},{"x":0.2722,"y":0.0274,"z":0.9619},{"x":0.8814,"y":0.0975,"z":0.4623},{"x":0.7566,"y":0.0528,"z":-0.6518},{"x":0.9327,"y":-0.0225,"z":0.3601},{"x":0.0525,"y":-0.1267,"z":-0.9905},{"x":0.2605,"y":0.1355,"z":0.9559},{"x":-0.9973,"y":-0.0134,"z":-0.0722},{"x":-0.4413,"y":-0.0975,"z":0.892},{"x":-0.9952,"y":0.0528,"z":-0.0826},{"x":-0.6498,"y":0.0329,"z":-0.7594},{"x":0.8593,"y":-0.0301,"z":-0.5105},{"x":-0.6886,"y":0.0321,"z":-0.7244},{"x":0.3511,"y":-0.1355,"z":0.9265},{"x":-0.9963,"y":0.0081,"z":0.0851},{"x":0.7644,"y":0.0134,"z":-0.6446},{"x":0.1313,"y":0.0321,"z":-0.9908},{"x":0.7566,"y":-0.0528,"z":-0.6518},{"x":-0.7032,"y":0.1209,"z":-0.7006},{"x":0.0525,"y":0.1267,"z":-0.9905},{"x":-0.4413,"y":0.0975,"z":0.892},{"x":-0.9963,"y":-0.0081,"z":0.0851},{"x":0.8561,"y":-0.0081,"z":-0.5168},{"x":0.1571,"y":-0.1209,"z":-0.9801},{"x":-0.5429,"y":0.0225,"z":0.8395},{"x":0.8561,"y":0.0081,"z":-0.5168},{"x":-0.461,"y":0.025,"z":0.8871},{"x":0.0794,"y":0.0329,"z":-0.9963},{"x":-0.5572,"y":0.084,"z":0.8261},{"x":0.3511,"y":0.1355,"z":0.9265},{"x":0.8943,"y":-0.025,"z":0.4467},{"x":0.9364,"y":-0.084,"z":0.3408},{"x":-0.5572,"y":-0.084,"z":0.8261},{"x":0.8814,"y":-0.0974,"z":0.4623},{"x":0.3265,"y":0.0356,"z":0.9445},{"x":-0.6886,"y":-0.0321,"z":-0.7244},{"x":0.1313,"y":-0.0321,"z":-0.9908},{"x":0.3265,"y":-0.0356,"z":0.9445},{"x":-0.9066,"y":-0.3755,"z":0.1927},{"x":-0.9066,"y":0.3755,"z":0.1927},{"x":-0.4634,"y":-0.3755,"z":0.8026},{"x":-0.4634,"y":0.3755,"z":0.8026},{"x":0.2864,"y":-0.3755,"z":0.8815},{"x":0.2864,"y":0.3755,"z":0.8815},{"x":0.8467,"y":-0.3755,"z":0.377},{"x":0.8467,"y":0.3755,"z":0.377},{"x":0.8467,"y":-0.3755,"z":-0.377},{"x":0.8467,"y":0.3755,"z":-0.377},{"x":0.2864,"y":-0.3755,"z":-0.8815},{"x":0.2864,"y":0.3755,"z":-0.8815},{"x":-0.7498,"y":-0.3755,"z":-0.5448},{"x":-0.7498,"y":0.3755,"z":-0.5448},{"x":-0.272,"y":0.9546,"z":-0.1211},{"x":0.9374,"y":0.017,"z":0.3479},{"x":0.8885,"y":-0.0195,"z":0.4585},{"x":-0.9959,"y":0.0061,"z":0.0899},{"x":0.1489,"y":0.9546,"z":-0.2579},{"x":0.0617,"y":0.0255,"z":-0.9978},{"x":0.8585,"y":-0.0061,"z":-0.5127},{"x":-0.083,"y":-0.9632,"z":0.2555},{"x":0.0617,"y":-0.0255,"z":-0.9978},{"x":-0.2575,"y":0.9595,"z":0.1146},{"x":0.8885,"y":0.0195,"z":0.4585},{"x":0.3452,"y":0.0274,"z":0.9381},{"x":-0.5539,"y":-0.017,"z":0.8324},{"x":-0.272,"y":-0.9546,"z":-0.1211},{"x":0.9374,"y":-0.017,"z":0.3479},{"x":-0.4493,"y":-0.0195,"z":0.8932},{"x":-0.9968,"y":-0.0105,"z":-0.0792},{"x":0.7599,"y":0.0105,"z":-0.65},{"x":-0.6364,"y":0.0255,"z":-0.771},{"x":-0.9968,"y":0.0105,"z":-0.0792},{"x":0.1495,"y":0.0246,"z":-0.9885},{"x":0.2174,"y":0.9632,"z":0.1579},{"x":0.8585,"y":0.0061,"z":-0.5127},{"x":-0.2575,"y":-0.9595,"z":0.1146},{"x":-0.7019,"y":0.0246,"z":-0.7118},{"x":0.1489,"y":-0.9546,"z":-0.2579},{"x":-0.5539,"y":0.017,"z":0.8324},{"x":0.3452,"y":-0.0274,"z":0.9381},{"x":0.1413,"y":0.9878,"z":-0.0646},{"x":-0.0779,"y":0.9878,"z":0.1349},{"x":0.1042,"y":0.9878,"z":0.1157},{"x":-0.1517,"y":0.9878,"z":0.0338},{"x":-0.126,"y":0.9878,"z":0.0915},{"x":0.1551,"y":0.9879,"z":0},{"x":0.0495,"y":0.9878,"z":-0.1473},{"x":-0.0791,"y":0.9878,"z":-0.1338},{"x":-0.0178,"y":0.9878,"z":0.1544},{"x":0.0495,"y":0.9878,"z":0.1473},{"x":-0.1517,"y":0.9879,"z":-0.0322},{"x":-0.0162,"y":0.9879,"z":-0.1542},{"x":-0.1248,"y":0.9878,"z":-0.0926},{"x":0.1413,"y":0.9878,"z":0.0646},{"x":0.5255,"y":0.8436,"z":-0.1103},{"x":-1,"y":0,"z":0},{"x":0.1045,"y":0,"z":-0.9945},{"x":0.9781,"y":0,"z":0.2079},{"x":0.1045,"y":0,"z":0.9945},{"x":-0.1045,"y":0,"z":-0.9945},{"x":-0.3778,"y":-0.655,"z":0.6544},{"x":0.6691,"y":0,"z":-0.7431},{"x":1,"y":0,"z":0},{"x":0.6691,"y":0,"z":0.7431},{"x":-0.809,"y":0,"z":-0.5878},{"x":-0.809,"y":0,"z":0.5878},{"x":-0.1045,"y":0,"z":0.9945},{"x":0.309,"y":0,"z":0.9511},{"x":-0.5,"y":0,"z":-0.866},{"x":0.9135,"y":0,"z":-0.4067},{"x":-0.9781,"y":0,"z":-0.2079},{"x":-0.9781,"y":0,"z":0.2079},{"x":0.309,"y":0,"z":-0.9511},{"x":0.9135,"y":0,"z":0.4067},{"x":-0.5,"y":0,"z":0.866},{"x":-0.079,"y":-0.655,"z":-0.7515},{"x":0.5056,"y":-0.655,"z":-0.5616},{"x":0.7557,"y":-0.655,"z":0},{"x":0.5056,"y":-0.655,"z":0.5616},{"x":-0.6113,"y":-0.655,"z":-0.4442},{"x":-0.6113,"y":-0.655,"z":0.4442},{"x":-0.079,"y":-0.655,"z":0.7515},{"x":0.2335,"y":-0.655,"z":0.7187},{"x":-0.3778,"y":-0.655,"z":-0.6544},{"x":0.6903,"y":-0.655,"z":-0.3074},{"x":-0.7392,"y":-0.655,"z":-0.1571},{"x":-0.7392,"y":-0.655,"z":0.1571},{"x":0.2335,"y":-0.655,"z":-0.7187},{"x":0.6903,"y":-0.655,"z":0.3074},{"x":-0.2625,"y":0.8511,"z":0.4546},{"x":0.0548,"y":0.8436,"z":-0.5342},{"x":-0.1647,"y":0.8436,"z":0.5111},{"x":0.5255,"y":0.8435,"z":0.1117},{"x":-0.1647,"y":0.8436,"z":-0.5111},{"x":0.0562,"y":0.8435,"z":0.5343},{"x":0.4352,"y":0.8436,"z":0.3146},{"x":-0.3592,"y":0.8437,"z":0.3989},{"x":-0.4911,"y":0.8436,"z":0.2172},{"x":-0.3592,"y":0.8437,"z":-0.3989},{"x":-0.4911,"y":0.8436,"z":-0.2172},{"x":0.4343,"y":0.8437,"z":-0.3155},{"x":0.2684,"y":0.8437,"z":-0.4649},{"x":0.2673,"y":0.8436,"z":0.4657},{"x":-0.5372,"y":0.8435,"z":0},{"x":-0.2635,"y":0.8513,"z":-0.4538},{"x":0.5245,"y":0.8514,"z":0},{"x":-0.513,"y":0.8513,"z":0.1104},{"x":-0.0562,"y":0.8513,"z":0.5217},{"x":0.1634,"y":0.8513,"z":-0.4986},{"x":-0.5131,"y":0.8514,"z":-0.1091},{"x":0.1634,"y":0.8513,"z":0.4986},{"x":-0.0548,"y":0.8514,"z":-0.5217},{"x":-0.4237,"y":0.8513,"z":-0.3095},{"x":0.3513,"y":0.8511,"z":-0.3901},{"x":0.4788,"y":0.8513,"z":-0.2147},{"x":0.3513,"y":0.8511,"z":0.3901},{"x":0.4788,"y":0.8513,"z":0.2147},{"x":-0.4247,"y":0.8511,"z":0.3086},{"x":-0.0006,"y":-1,"z":0.0006},{"x":0.9511,"y":0,"z":-0.309},{"x":0.2079,"y":0,"z":0.9781},{"x":0.0559,"y":0.8367,"z":-0.5447},{"x":-0.9945,"y":0,"z":0.1045},{"x":0,"y":0,"z":-1},{"x":-0.0004,"y":-1,"z":-0.0039},{"x":-0.0026,"y":-1,"z":0.0029},{"x":0.0014,"y":-1,"z":0},{"x":0.0019,"y":-1,"z":-0.0034},{"x":0.0032,"y":-1,"z":-0.0023},{"x":-0.0038,"y":-1,"z":-0.0008},{"x":0.0026,"y":-1,"z":-0.0006},{"x":-0.0004,"y":-1,"z":0.0039},{"x":-0.0001,"y":-1,"z":-0.0008}],"faces":[{"vertices":[227,56,57],"normals":[0,0,0]},{"vertices":[3,9,2],"normals":[1,1,1]},{"vertices":[5,11,4],"normals":[2,2,2]},{"vertices":[8,14,7],"normals":[3,3,3]},{"vertices":[9,15,8],"normals":[4,4,4]},{"vertices":[10,16,9],"normals":[5,5,5]},{"vertices":[12,18,11],"normals":[6,6,6]},{"vertices":[12,20,19],"normals":[7,7,7]},{"vertices":[7,20,13],"normals":[8,8,8]},{"vertices":[50,246,51],"normals":[9,9,9]},{"vertices":[82,244,83],"normals":[10,10,10]},{"vertices":[16,24,23],"normals":[11,11,11]},{"vertices":[19,25,18],"normals":[12,12,12]},{"vertices":[56,254,62],"normals":[13,13,13]},{"vertices":[242,42,43],"normals":[14,14,14]},{"vertices":[22,28,21],"normals":[15,15,15]},{"vertices":[23,29,22],"normals":[16,16,16]},{"vertices":[24,30,23],"normals":[17,17,17]},{"vertices":[26,32,25],"normals":[18,18,18]},{"vertices":[27,33,26],"normals":[19,19,19]},{"vertices":[21,34,27],"normals":[20,20,20]},{"vertices":[77,238,78],"normals":[21,21,21]},{"vertices":[91,225,97],"normals":[22,22,22]},{"vertices":[31,37,30],"normals":[23,23,23]},{"vertices":[33,39,32],"normals":[24,24,24]},{"vertices":[36,42,35],"normals":[25,25,25]},{"vertices":[37,43,36],"normals":[26,26,26]},{"vertices":[38,44,37],"normals":[27,27,27]},{"vertices":[40,46,39],"normals":[28,28,28]},{"vertices":[41,47,40],"normals":[29,29,29]},{"vertices":[35,48,41],"normals":[30,30,30]},{"vertices":[98,230,99],"normals":[31,31,31]},{"vertices":[26,253,27],"normals":[32,32,32]},{"vertices":[45,51,44],"normals":[33,33,33]},{"vertices":[47,53,46],"normals":[34,34,34]},{"vertices":[64,217,65],"normals":[35,35,35]},{"vertices":[36,219,37],"normals":[36,36,36]},{"vertices":[50,56,49],"normals":[37,37,37]},{"vertices":[50,58,57],"normals":[38,38,38]},{"vertices":[52,58,51],"normals":[39,39,39]},{"vertices":[54,60,53],"normals":[40,40,40]},{"vertices":[55,61,54],"normals":[41,41,41]},{"vertices":[49,62,55],"normals":[42,42,42]},{"vertices":[253,21,27],"normals":[43,43,43]},{"vertices":[0,228,6],"normals":[44,44,44]},{"vertices":[58,66,65],"normals":[45,45,45]},{"vertices":[61,67,60],"normals":[46,46,46]},{"vertices":[70,240,76],"normals":[47,47,47]},{"vertices":[64,70,63],"normals":[48,48,48]},{"vertices":[64,72,71],"normals":[49,49,49]},{"vertices":[66,72,65],"normals":[50,50,50]},{"vertices":[68,74,67],"normals":[51,51,51]},{"vertices":[69,75,68],"normals":[52,52,52]},{"vertices":[63,76,69],"normals":[53,53,53]},{"vertices":[58,227,57],"normals":[54,54,54]},{"vertices":[30,234,29],"normals":[55,55,55]},{"vertices":[73,79,72],"normals":[56,56,56]},{"vertices":[74,82,81],"normals":[57,57,57]},{"vertices":[252,63,69],"normals":[58,58,58]},{"vertices":[68,252,69],"normals":[59,59,59]},{"vertices":[77,85,84],"normals":[60,60,60]},{"vertices":[79,85,78],"normals":[61,61,61]},{"vertices":[79,87,86],"normals":[62,62,62]},{"vertices":[82,88,81],"normals":[63,63,63]},{"vertices":[83,89,82],"normals":[64,64,64]},{"vertices":[77,90,83],"normals":[65,65,65]},{"vertices":[85,91,84],"normals":[66,66,66]},{"vertices":[86,92,85],"normals":[67,67,67]},{"vertices":[87,93,86],"normals":[68,68,68]},{"vertices":[89,95,88],"normals":[69,69,69]},{"vertices":[90,96,89],"normals":[70,70,70]},{"vertices":[90,91,97],"normals":[71,71,71]},{"vertices":[20,251,19],"normals":[72,72,72]},{"vertices":[93,101,100],"normals":[73,73,73]},{"vertices":[107,11,18],"normals":[74,74,74]},{"vertices":[95,103,102],"normals":[75,75,75]},{"vertices":[34,222,33],"normals":[76,76,76]},{"vertices":[99,0,98],"normals":[77,77,77]},{"vertices":[99,2,1],"normals":[78,78,78]},{"vertices":[101,2,100],"normals":[79,79,79]},{"vertices":[102,5,4],"normals":[80,80,80]},{"vertices":[104,5,103],"normals":[81,81,81]},{"vertices":[98,6,104],"normals":[82,82,82]},{"vertices":[208,114,115],"normals":[83,83,83]},{"vertices":[67,113,60],"normals":[84,84,84]},{"vertices":[110,32,39],"normals":[85,85,85]},{"vertices":[119,95,102],"normals":[86,86,86]},{"vertices":[108,18,25],"normals":[87,87,87]},{"vertices":[111,39,46],"normals":[88,88,88]},{"vertices":[116,74,81],"normals":[89,89,89]},{"vertices":[117,133,88],"normals":[90,90,90]},{"vertices":[118,88,95],"normals":[91,91,91]},{"vertices":[74,114,67],"normals":[92,92,92]},{"vertices":[106,4,11],"normals":[93,93,93]},{"vertices":[112,46,53],"normals":[94,94,94]},{"vertices":[102,131,119],"normals":[95,95,95]},{"vertices":[123,120,121],"normals":[96,96,96]},{"vertices":[113,121,60],"normals":[90,90,90]},{"vertices":[53,122,112],"normals":[97,97,97]},{"vertices":[60,120,53],"normals":[90,90,90]},{"vertices":[127,124,125],"normals":[98,98,98]},{"vertices":[32,124,25],"normals":[90,90,90]},{"vertices":[25,126,108],"normals":[99,99,99]},{"vertices":[109,125,32],"normals":[90,90,90]},{"vertices":[130,129,128],"normals":[100,100,100]},{"vertices":[105,128,4],"normals":[90,90,90]},{"vertices":[4,129,102],"normals":[90,90,90]},{"vertices":[135,132,133],"normals":[101,101,101]},{"vertices":[88,132,81],"normals":[90,90,90]},{"vertices":[81,134,116],"normals":[102,102,102]},{"vertices":[149,31,24],"normals":[103,103,103]},{"vertices":[338,147,146],"normals":[104,104,104]},{"vertices":[147,159,94],"normals":[105,105,105]},{"vertices":[160,148,101],"normals":[106,106,106]},{"vertices":[136,167,142],"normals":[107,107,107]},{"vertices":[162,149,24],"normals":[108,108,108]},{"vertices":[10,137,17],"normals":[109,109,109]},{"vertices":[146,94,87],"normals":[110,110,110]},{"vertices":[148,3,101],"normals":[111,111,111]},{"vertices":[140,66,59],"normals":[112,112,112]},{"vertices":[80,156,87],"normals":[113,113,113]},{"vertices":[73,145,80],"normals":[114,114,114]},{"vertices":[45,144,52],"normals":[115,115,115]},{"vertices":[152,139,38],"normals":[116,116,116]},{"vertices":[138,151,31],"normals":[117,117,117]},{"vertices":[38,143,45],"normals":[118,118,118]},{"vertices":[165,179,151],"normals":[119,119,119]},{"vertices":[180,166,152],"normals":[120,120,120]},{"vertices":[151,180,152],"normals":[121,121,121]},{"vertices":[178,205,177],"normals":[122,122,122]},{"vertices":[171,185,157],"normals":[123,123,123]},{"vertices":[204,175,176],"normals":[124,124,124]},{"vertices":[186,172,158],"normals":[125,125,125]},{"vertices":[170,145,146],"normals":[126,126,126]},{"vertices":[52,158,59],"normals":[127,127,127]},{"vertices":[151,38,31],"normals":[128,128,128]},{"vertices":[156,146,87],"normals":[129,129,129]},{"vertices":[172,144,140],"normals":[130,130,130]},{"vertices":[145,155,80],"normals":[131,131,131]},{"vertices":[174,147,148],"normals":[132,132,132]},{"vertices":[137,161,17],"normals":[133,133,133]},{"vertices":[164,150,73],"normals":[134,134,134]},{"vertices":[159,101,94],"normals":[135,135,135]},{"vertices":[141,163,66],"normals":[136,136,136]},{"vertices":[161,24,17],"normals":[137,137,137]},{"vertices":[154,136,10],"normals":[138,138,138]},{"vertices":[142,153,3],"normals":[139,139,139]},{"vertices":[66,164,73],"normals":[140,140,140]},{"vertices":[149,175,137],"normals":[141,141,141]},{"vertices":[158,140,59],"normals":[142,142,142]},{"vertices":[178,141,150],"normals":[143,143,143]},{"vertices":[153,10,3],"normals":[144,144,144]},{"vertices":[144,157,52],"normals":[145,145,145]},{"vertices":[139,165,138],"normals":[146,146,146]},{"vertices":[187,202,188],"normals":[147,147,147]},{"vertices":[197,184,183],"normals":[148,148,148]},{"vertices":[203,190,189],"normals":[149,149,149]},{"vertices":[205,192,191],"normals":[150,150,150]},{"vertices":[185,200,186],"normals":[151,151,151]},{"vertices":[179,194,180],"normals":[152,152,152]},{"vertices":[195,182,181],"normals":[153,153,153]},{"vertices":[153,182,154],"normals":[154,154,154]},{"vertices":[190,176,162],"normals":[155,155,155]},{"vertices":[183,156,155],"normals":[156,156,156]},{"vertices":[188,174,160],"normals":[157,157,157]},{"vertices":[185,158,157],"normals":[158,158,158]},{"vertices":[173,187,159],"normals":[159,159,159]},{"vertices":[187,160,159],"normals":[160,160,160]},{"vertices":[184,170,156],"normals":[161,161,161]},{"vertices":[161,190,162],"normals":[162,162,162]},{"vertices":[169,183,155],"normals":[163,163,163]},{"vertices":[191,164,163],"normals":[164,164,164]},{"vertices":[175,189,161],"normals":[165,165,165]},{"vertices":[194,165,166],"normals":[166,166,166]},{"vertices":[192,178,164],"normals":[167,167,167]},{"vertices":[196,167,168],"normals":[168,168,168]},{"vertices":[177,191,163],"normals":[169,169,169]},{"vertices":[170,197,169],"normals":[170,170,170]},{"vertices":[182,168,154],"normals":[171,171,171]},{"vertices":[172,199,171],"normals":[172,172,172]},{"vertices":[167,181,153],"normals":[173,173,173]},{"vertices":[202,173,174],"normals":[174,174,174]},{"vertices":[208,306,210],"normals":[175,175,175]},{"vertices":[212,110,111],"normals":[176,176,176]},{"vertices":[131,118,119],"normals":[177,177,177]},{"vertices":[209,106,107],"normals":[178,178,178]},{"vertices":[114,123,113],"normals":[179,179,179]},{"vertices":[110,127,109],"normals":[180,180,180]},{"vertices":[118,135,117],"normals":[181,181,181]},{"vertices":[106,130,105],"normals":[182,182,182]},{"vertices":[134,115,116],"normals":[183,183,183]},{"vertices":[122,111,112],"normals":[184,184,184]},{"vertices":[126,107,108],"normals":[185,185,185]},{"vertices":[293,216,252],"normals":[186,186,186]},{"vertices":[2,221,236],"normals":[187,187,187]},{"vertices":[5,229,12],"normals":[188,188,188]},{"vertices":[233,264,222],"normals":[189,189,189]},{"vertices":[228,271,229],"normals":[190,190,190]},{"vertices":[16,215,247],"normals":[191,191,191]},{"vertices":[19,253,26],"normals":[192,192,192]},{"vertices":[281,244,240],"normals":[193,193,193]},{"vertices":[263,236,221],"normals":[194,194,194]},{"vertices":[30,219,234],"normals":[195,195,195]},{"vertices":[222,40,33],"normals":[196,196,196]},{"vertices":[269,226,227],"normals":[197,197,197]},{"vertices":[250,292,251],"normals":[198,198,198]},{"vertices":[242,51,246],"normals":[199,199,199]},{"vertices":[231,54,47],"normals":[200,200,200]},{"vertices":[219,275,234],"normals":[201,201,201]},{"vertices":[224,267,225],"normals":[202,202,202]},{"vertices":[227,65,217],"normals":[203,203,203]},{"vertices":[254,68,61],"normals":[204,204,204]},{"vertices":[290,249,248],"normals":[205,205,205]},{"vertices":[264,223,222],"normals":[206,206,206]},{"vertices":[237,79,238],"normals":[207,207,207]},{"vertices":[240,82,75],"normals":[208,208,208]},{"vertices":[273,245,232],"normals":[209,209,209]},{"vertices":[297,255,230],"normals":[210,210,210]},{"vertices":[93,230,255],"normals":[211,211,211]},{"vertices":[96,248,103],"normals":[212,212,212]},{"vertices":[226,295,254],"normals":[213,213,213]},{"vertices":[76,240,75],"normals":[214,214,214]},{"vertices":[93,255,92],"normals":[215,215,215]},{"vertices":[21,215,22],"normals":[216,216,216]},{"vertices":[6,228,5],"normals":[217,217,217]},{"vertices":[62,254,61],"normals":[218,218,218]},{"vertices":[244,77,83],"normals":[219,219,219]},{"vertices":[99,230,100],"normals":[220,220,220]},{"vertices":[78,238,79],"normals":[221,221,221]},{"vertices":[63,217,64],"normals":[222,222,222]},{"vertices":[40,223,41],"normals":[223,223,223]},{"vertices":[247,14,15],"normals":[224,224,224]},{"vertices":[8,221,9],"normals":[225,225,225]},{"vertices":[234,28,29],"normals":[226,226,226]},{"vertices":[255,91,92],"normals":[227,227,227]},{"vertices":[49,246,50],"normals":[228,228,228]},{"vertices":[97,225,96],"normals":[229,229,229]},{"vertices":[16,247,15],"normals":[230,230,230]},{"vertices":[2,236,1],"normals":[231,231,231]},{"vertices":[103,248,104],"normals":[232,232,232]},{"vertices":[28,222,34],"normals":[233,233,233]},{"vertices":[223,35,41],"normals":[234,234,234]},{"vertices":[54,232,55],"normals":[235,235,235]},{"vertices":[42,231,48],"normals":[236,236,236]},{"vertices":[35,219,36],"normals":[237,237,237]},{"vertices":[248,98,104],"normals":[238,238,238]},{"vertices":[236,0,1],"normals":[239,239,239]},{"vertices":[48,231,47],"normals":[240,240,240]},{"vertices":[12,229,13],"normals":[241,241,241]},{"vertices":[237,70,71],"normals":[242,242,242]},{"vertices":[22,215,23],"normals":[243,243,243]},{"vertices":[44,242,43],"normals":[244,244,244]},{"vertices":[72,237,71],"normals":[245,245,245]},{"vertices":[229,7,13],"normals":[246,246,246]},{"vertices":[14,251,20],"normals":[247,247,247]},{"vertices":[232,49,55],"normals":[248,248,248]},{"vertices":[7,221,8],"normals":[249,249,249]},{"vertices":[277,262,276],"normals":[250,250,250]},{"vertices":[276,271,270],"normals":[251,251,251]},{"vertices":[288,256,291],"normals":[252,252,252]},{"vertices":[291,294,292],"normals":[253,253,253]},{"vertices":[274,261,260],"normals":[254,254,254]},{"vertices":[274,265,264],"normals":[255,255,255]},{"vertices":[283,286,282],"normals":[256,256,256]},{"vertices":[282,273,272],"normals":[257,257,257]},{"vertices":[268,259,258],"normals":[258,258,258]},{"vertices":[268,293,295],"normals":[259,259,259]},{"vertices":[278,284,280],"normals":[260,260,260]},{"vertices":[280,285,281],"normals":[261,261,261]},{"vertices":[296,289,266],"normals":[262,262,262]},{"vertices":[267,289,290],"normals":[263,263,263]},{"vertices":[272,232,231],"normals":[264,264,264]},{"vertices":[294,214,253],"normals":[265,265,265]},{"vertices":[278,239,237],"normals":[266,266,266]},{"vertices":[275,233,234],"normals":[267,267,267]},{"vertices":[251,294,253],"normals":[268,268,268]},{"vertices":[277,235,236],"normals":[269,269,269]},{"vertices":[265,218,223],"normals":[270,270,270]},{"vertices":[238,278,237],"normals":[271,271,271]},{"vertices":[235,270,228],"normals":[272,272,272]},{"vertices":[295,252,254],"normals":[273,273,273]},{"vertices":[239,281,240],"normals":[274,274,274]},{"vertices":[271,220,229],"normals":[275,275,275]},{"vertices":[283,241,242],"normals":[276,276,276]},{"vertices":[246,283,242],"normals":[277,277,277]},{"vertices":[214,257,215],"normals":[278,278,278]},{"vertices":[249,297,230],"normals":[279,279,279]},{"vertices":[285,243,244],"normals":[280,280,280]},{"vertices":[296,224,255],"normals":[281,281,281]},{"vertices":[216,259,217],"normals":[282,282,282]},{"vertices":[243,279,238],"normals":[283,283,283]},{"vertices":[245,287,246],"normals":[284,284,284]},{"vertices":[225,290,248],"normals":[285,285,285]},{"vertices":[218,261,219],"normals":[286,286,286]},{"vertices":[217,269,227],"normals":[287,287,287]},{"vertices":[288,250,247],"normals":[288,288,288]},{"vertices":[257,247,215],"normals":[289,289,289]},{"vertices":[241,272,231],"normals":[290,290,290]},{"vertices":[220,263,221],"normals":[291,291,291]},{"vertices":[313,309,298],"normals":[184,184,184]},{"vertices":[306,123,210],"normals":[292,292,292]},{"vertices":[300,209,126],"normals":[293,293,293]},{"vertices":[309,211,212],"normals":[294,294,294]},{"vertices":[310,130,213],"normals":[295,295,295]},{"vertices":[311,213,209],"normals":[296,296,296]},{"vertices":[299,122,123],"normals":[297,297,297]},{"vertices":[134,307,208],"normals":[298,298,298]},{"vertices":[312,135,207],"normals":[299,299,299]},{"vertices":[127,300,126],"normals":[300,300,300]},{"vertices":[308,127,211],"normals":[301,301,301]},{"vertices":[302,131,130],"normals":[302,302,302]},{"vertices":[135,304,134],"normals":[303,303,303]},{"vertices":[131,312,207],"normals":[304,304,304]},{"vertices":[122,309,212],"normals":[305,305,305]},{"vertices":[325,377,317],"normals":[306,306,306]},{"vertices":[326,310,311],"normals":[178,178,178]},{"vertices":[315,311,300],"normals":[185,185,185]},{"vertices":[312,320,305],"normals":[181,181,181]},{"vertices":[314,298,299],"normals":[307,307,307]},{"vertices":[310,317,302],"normals":[182,182,182]},{"vertices":[316,300,301],"normals":[308,308,308]},{"vertices":[319,307,304],"normals":[183,183,183]},{"vertices":[317,303,302],"normals":[309,309,309]},{"vertices":[308,316,301],"normals":[180,180,180]},{"vertices":[320,304,305],"normals":[310,310,310]},{"vertices":[318,312,303],"normals":[177,177,177]},{"vertices":[322,306,307],"normals":[83,83,83]},{"vertices":[306,314,299],"normals":[179,179,179]},{"vertices":[324,308,309],"normals":[176,176,176]},{"vertices":[352,338,337],"normals":[311,311,311]},{"vertices":[332,141,140],"normals":[104,104,104]},{"vertices":[340,142,148],"normals":[104,104,104]},{"vertices":[334,136,142],"normals":[104,104,104]},{"vertices":[150,337,145],"normals":[104,104,104]},{"vertices":[335,144,143],"normals":[104,104,104]},{"vertices":[329,149,137],"normals":[104,104,104]},{"vertices":[337,146,145],"normals":[104,104,104]},{"vertices":[333,150,141],"normals":[104,104,104]},{"vertices":[336,140,144],"normals":[104,104,104]},{"vertices":[139,335,143],"normals":[104,104,104]},{"vertices":[339,148,147],"normals":[104,104,104]},{"vertices":[328,137,136],"normals":[104,104,104]},{"vertices":[149,330,138],"normals":[104,104,104]},{"vertices":[330,139,138],"normals":[104,104,104]},{"vertices":[359,356,344],"normals":[312,312,312]},{"vertices":[348,342,333],"normals":[313,313,313]},{"vertices":[351,332,336],"normals":[314,314,314]},{"vertices":[346,335,331],"normals":[315,315,315]},{"vertices":[354,340,339],"normals":[316,316,316]},{"vertices":[343,329,328],"normals":[317,317,317]},{"vertices":[356,330,341],"normals":[318,318,318]},{"vertices":[345,331,330],"normals":[319,319,319]},{"vertices":[353,339,338],"normals":[320,320,320]},{"vertices":[347,333,332],"normals":[321,321,321]},{"vertices":[355,334,340],"normals":[322,322,322]},{"vertices":[349,328,334],"normals":[323,323,323]},{"vertices":[357,337,342],"normals":[324,324,324]},{"vertices":[350,336,335],"normals":[325,325,325]},{"vertices":[344,341,329],"normals":[326,326,326]},{"vertices":[363,366,371],"normals":[104,104,104]},{"vertices":[352,368,353],"normals":[327,327,327]},{"vertices":[363,357,348],"normals":[328,328,328]},{"vertices":[366,347,351],"normals":[329,329,329]},{"vertices":[361,350,346],"normals":[330,330,330]},{"vertices":[369,355,354],"normals":[331,331,331]},{"vertices":[358,344,343],"normals":[332,332,332]},{"vertices":[356,360,345],"normals":[333,333,333]},{"vertices":[360,346,345],"normals":[334,334,334]},{"vertices":[368,354,353],"normals":[335,335,335]},{"vertices":[347,363,348],"normals":[336,336,336]},{"vertices":[370,349,355],"normals":[337,337,337]},{"vertices":[349,358,343],"normals":[338,338,338]},{"vertices":[372,352,357],"normals":[339,339,339]},{"vertices":[365,351,350],"normals":[340,340,340]},{"vertices":[390,386,375],"normals":[341,341,341]},{"vertices":[376,315,316],"normals":[342,342,342]},{"vertices":[379,322,319],"normals":[343,343,343]},{"vertices":[377,318,317],"normals":[344,344,344]},{"vertices":[323,376,316],"normals":[345,345,345]},{"vertices":[320,379,319],"normals":[346,346,346]},{"vertices":[378,327,318],"normals":[347,347,347]},{"vertices":[382,321,322],"normals":[348,348,348]},{"vertices":[321,374,314],"normals":[349,349,349]},{"vertices":[384,323,324],"normals":[350,350,350]},{"vertices":[373,324,313],"normals":[351,351,351]},{"vertices":[326,385,325],"normals":[352,352,352]},{"vertices":[375,326,315],"normals":[353,353,353]},{"vertices":[327,380,320],"normals":[354,354,354]},{"vertices":[374,313,314],"normals":[355,355,355]},{"vertices":[413,391,398],"normals":[319,319,319]},{"vertices":[402,380,387],"normals":[356,356,356]},{"vertices":[389,373,374],"normals":[357,357,357]},{"vertices":[400,377,385],"normals":[358,358,358]},{"vertices":[376,390,375],"normals":[359,359,359]},{"vertices":[379,397,382],"normals":[360,360,360]},{"vertices":[392,378,377],"normals":[361,361,361]},{"vertices":[398,376,383],"normals":[362,362,362]},{"vertices":[395,379,380],"normals":[363,363,363]},{"vertices":[378,402,387],"normals":[364,364,364]},{"vertices":[382,396,381],"normals":[365,365,365]},{"vertices":[396,374,381],"normals":[366,366,366]},{"vertices":[399,383,384],"normals":[367,367,367]},{"vertices":[373,399,384],"normals":[368,368,368]},{"vertices":[386,400,385],"normals":[369,369,369]},{"vertices":[414,407,417],"normals":[370,370,370]},{"vertices":[410,394,395],"normals":[311,311,311]},{"vertices":[393,417,402],"normals":[316,316,316]},{"vertices":[412,396,397],"normals":[313,313,313]},{"vertices":[411,389,396],"normals":[321,321,321]},{"vertices":[414,398,399],"normals":[315,315,315]},{"vertices":[388,414,399],"normals":[325,325,325]},{"vertices":[416,400,401],"normals":[317,317,317]},{"vertices":[405,401,390],"normals":[326,326,326]},{"vertices":[417,395,402],"normals":[320,320,320]},{"vertices":[404,388,389],"normals":[314,314,314]},{"vertices":[415,392,400],"normals":[323,323,323]},{"vertices":[391,405,390],"normals":[318,318,318]},{"vertices":[394,412,397],"normals":[324,324,324]},{"vertices":[407,393,392],"normals":[322,322,322]},{"vertices":[227,226,56],"normals":[0,0,0]},{"vertices":[3,10,9],"normals":[1,1,1]},{"vertices":[5,12,11],"normals":[2,2,2]},{"vertices":[8,15,14],"normals":[3,3,3]},{"vertices":[9,16,15],"normals":[4,4,4]},{"vertices":[10,17,16],"normals":[5,5,5]},{"vertices":[12,19,18],"normals":[6,6,6]},{"vertices":[12,13,20],"normals":[7,7,7]},{"vertices":[7,14,20],"normals":[8,8,8]},{"vertices":[16,17,24],"normals":[11,11,11]},{"vertices":[19,26,25],"normals":[12,12,12]},{"vertices":[56,226,254],"normals":[13,13,13]},{"vertices":[242,241,42],"normals":[14,14,14]},{"vertices":[22,29,28],"normals":[15,15,15]},{"vertices":[23,30,29],"normals":[16,16,16]},{"vertices":[24,31,30],"normals":[17,17,17]},{"vertices":[26,33,32],"normals":[18,18,18]},{"vertices":[27,34,33],"normals":[19,19,19]},{"vertices":[21,28,34],"normals":[20,20,20]},{"vertices":[77,243,238],"normals":[21,21,21]},{"vertices":[91,224,225],"normals":[22,22,22]},{"vertices":[31,38,37],"normals":[23,23,23]},{"vertices":[33,40,39],"normals":[24,24,24]},{"vertices":[36,43,42],"normals":[25,25,25]},{"vertices":[37,44,43],"normals":[26,26,26]},{"vertices":[38,45,44],"normals":[27,27,27]},{"vertices":[40,47,46],"normals":[28,28,28]},{"vertices":[41,48,47],"normals":[29,29,29]},{"vertices":[35,42,48],"normals":[30,30,30]},{"vertices":[98,249,230],"normals":[31,31,31]},{"vertices":[45,52,51],"normals":[33,33,33]},{"vertices":[47,54,53],"normals":[34,34,34]},{"vertices":[50,57,56],"normals":[37,37,37]},{"vertices":[50,51,58],"normals":[38,38,38]},{"vertices":[52,59,58],"normals":[39,39,39]},{"vertices":[54,61,60],"normals":[40,40,40]},{"vertices":[55,62,61],"normals":[41,41,41]},{"vertices":[49,56,62],"normals":[42,42,42]},{"vertices":[253,214,21],"normals":[43,43,43]},{"vertices":[0,235,228],"normals":[44,44,44]},{"vertices":[58,59,66],"normals":[45,45,45]},{"vertices":[61,68,67],"normals":[46,46,46]},{"vertices":[70,239,240],"normals":[47,47,47]},{"vertices":[64,71,70],"normals":[48,48,48]},{"vertices":[64,65,72],"normals":[49,49,49]},{"vertices":[66,73,72],"normals":[50,50,50]},{"vertices":[68,75,74],"normals":[51,51,51]},{"vertices":[69,76,75],"normals":[52,52,52]},{"vertices":[63,70,76],"normals":[53,53,53]},{"vertices":[73,80,79],"normals":[56,56,56]},{"vertices":[74,75,82],"normals":[57,57,57]},{"vertices":[252,216,63],"normals":[58,58,58]},{"vertices":[77,78,85],"normals":[60,60,60]},{"vertices":[79,86,85],"normals":[61,61,61]},{"vertices":[79,80,87],"normals":[62,62,62]},{"vertices":[82,89,88],"normals":[63,63,63]},{"vertices":[83,90,89],"normals":[64,64,64]},{"vertices":[77,84,90],"normals":[65,65,65]},{"vertices":[85,92,91],"normals":[66,66,66]},{"vertices":[86,93,92],"normals":[67,67,67]},{"vertices":[87,94,93],"normals":[68,68,68]},{"vertices":[89,96,95],"normals":[69,69,69]},{"vertices":[90,97,96],"normals":[70,70,70]},{"vertices":[90,84,91],"normals":[71,71,71]},{"vertices":[93,94,101],"normals":[73,73,73]},{"vertices":[107,106,11],"normals":[74,74,74]},{"vertices":[95,96,103],"normals":[75,75,75]},{"vertices":[99,1,0],"normals":[77,77,77]},{"vertices":[99,100,2],"normals":[78,78,78]},{"vertices":[101,3,2],"normals":[79,79,79]},{"vertices":[102,103,5],"normals":[80,80,80]},{"vertices":[104,6,5],"normals":[81,81,81]},{"vertices":[98,0,6],"normals":[82,82,82]},{"vertices":[208,210,114],"normals":[83,83,83]},{"vertices":[67,114,113],"normals":[84,84,84]},{"vertices":[110,109,32],"normals":[85,85,85]},{"vertices":[119,118,95],"normals":[86,86,86]},{"vertices":[108,107,18],"normals":[87,87,87]},{"vertices":[111,110,39],"normals":[88,88,88]},{"vertices":[116,115,74],"normals":[89,89,89]},{"vertices":[117,135,133],"normals":[371,371,371]},{"vertices":[118,117,88],"normals":[91,91,91]},{"vertices":[74,115,114],"normals":[92,92,92]},{"vertices":[106,105,4],"normals":[93,93,93]},{"vertices":[112,111,46],"normals":[94,94,94]},{"vertices":[102,129,131],"normals":[90,90,90]},{"vertices":[123,122,120],"normals":[96,96,96]},{"vertices":[113,123,121],"normals":[372,372,372]},{"vertices":[53,120,122],"normals":[90,90,90]},{"vertices":[60,121,120],"normals":[90,90,90]},{"vertices":[127,126,124],"normals":[373,373,373]},{"vertices":[32,125,124],"normals":[90,90,90]},{"vertices":[25,124,126],"normals":[90,90,90]},{"vertices":[109,127,125],"normals":[374,374,374]},{"vertices":[130,131,129],"normals":[100,100,100]},{"vertices":[105,130,128],"normals":[375,375,375]},{"vertices":[4,128,129],"normals":[90,90,90]},{"vertices":[135,134,132],"normals":[101,101,101]},{"vertices":[88,133,132],"normals":[90,90,90]},{"vertices":[81,132,134],"normals":[90,90,90]},{"vertices":[149,138,31],"normals":[103,103,103]},{"vertices":[338,339,147],"normals":[104,104,104]},{"vertices":[147,173,159],"normals":[105,105,105]},{"vertices":[160,174,148],"normals":[106,106,106]},{"vertices":[136,168,167],"normals":[107,107,107]},{"vertices":[162,176,149],"normals":[108,108,108]},{"vertices":[10,136,137],"normals":[109,109,109]},{"vertices":[146,147,94],"normals":[110,110,110]},{"vertices":[148,142,3],"normals":[111,111,111]},{"vertices":[140,141,66],"normals":[112,112,112]},{"vertices":[80,155,156],"normals":[113,113,113]},{"vertices":[73,150,145],"normals":[114,114,114]},{"vertices":[45,143,144],"normals":[115,115,115]},{"vertices":[152,166,139],"normals":[116,116,116]},{"vertices":[138,165,151],"normals":[117,117,117]},{"vertices":[38,139,143],"normals":[118,118,118]},{"vertices":[165,193,179],"normals":[119,119,119]},{"vertices":[180,194,166],"normals":[120,120,120]},{"vertices":[151,179,180],"normals":[121,121,121]},{"vertices":[178,206,205],"normals":[122,122,122]},{"vertices":[171,199,185],"normals":[123,123,123]},{"vertices":[204,203,175],"normals":[124,124,124]},{"vertices":[186,200,172],"normals":[125,125,125]},{"vertices":[170,169,145],"normals":[126,126,126]},{"vertices":[52,157,158],"normals":[127,127,127]},{"vertices":[151,152,38],"normals":[128,128,128]},{"vertices":[156,170,146],"normals":[129,129,129]},{"vertices":[172,171,144],"normals":[130,130,130]},{"vertices":[145,169,155],"normals":[131,131,131]},{"vertices":[174,173,147],"normals":[132,132,132]},{"vertices":[137,175,161],"normals":[133,133,133]},{"vertices":[164,178,150],"normals":[134,134,134]},{"vertices":[159,160,101],"normals":[135,135,135]},{"vertices":[141,177,163],"normals":[136,136,136]},{"vertices":[161,162,24],"normals":[137,137,137]},{"vertices":[154,168,136],"normals":[138,138,138]},{"vertices":[142,167,153],"normals":[139,139,139]},{"vertices":[66,163,164],"normals":[140,140,140]},{"vertices":[149,176,175],"normals":[141,141,141]},{"vertices":[158,172,140],"normals":[142,142,142]},{"vertices":[178,177,141],"normals":[143,143,143]},{"vertices":[153,154,10],"normals":[144,144,144]},{"vertices":[144,171,157],"normals":[145,145,145]},{"vertices":[139,166,165],"normals":[146,146,146]},{"vertices":[187,201,202],"normals":[147,147,147]},{"vertices":[197,198,184],"normals":[148,148,148]},{"vertices":[203,204,190],"normals":[149,149,149]},{"vertices":[205,206,192],"normals":[150,150,150]},{"vertices":[185,199,200],"normals":[151,151,151]},{"vertices":[179,193,194],"normals":[152,152,152]},{"vertices":[195,196,182],"normals":[153,153,153]},{"vertices":[153,181,182],"normals":[154,154,154]},{"vertices":[190,204,176],"normals":[155,155,155]},{"vertices":[183,184,156],"normals":[156,156,156]},{"vertices":[188,202,174],"normals":[157,157,157]},{"vertices":[185,186,158],"normals":[158,158,158]},{"vertices":[173,201,187],"normals":[159,159,159]},{"vertices":[187,188,160],"normals":[160,160,160]},{"vertices":[184,198,170],"normals":[161,161,161]},{"vertices":[161,189,190],"normals":[162,162,162]},{"vertices":[169,197,183],"normals":[163,163,163]},{"vertices":[191,192,164],"normals":[164,164,164]},{"vertices":[175,203,189],"normals":[165,165,165]},{"vertices":[194,193,165],"normals":[166,166,166]},{"vertices":[192,206,178],"normals":[167,167,167]},{"vertices":[196,195,167],"normals":[168,168,168]},{"vertices":[177,205,191],"normals":[169,169,169]},{"vertices":[170,198,197],"normals":[170,170,170]},{"vertices":[182,196,168],"normals":[171,171,171]},{"vertices":[172,200,199],"normals":[172,172,172]},{"vertices":[167,195,181],"normals":[173,173,173]},{"vertices":[202,201,173],"normals":[174,174,174]},{"vertices":[208,307,306],"normals":[175,175,175]},{"vertices":[212,211,110],"normals":[176,176,176]},{"vertices":[131,207,118],"normals":[177,177,177]},{"vertices":[209,213,106],"normals":[178,178,178]},{"vertices":[114,210,123],"normals":[179,179,179]},{"vertices":[110,211,127],"normals":[180,180,180]},{"vertices":[118,207,135],"normals":[181,181,181]},{"vertices":[106,213,130],"normals":[182,182,182]},{"vertices":[134,208,115],"normals":[183,183,183]},{"vertices":[122,212,111],"normals":[184,184,184]},{"vertices":[126,209,107],"normals":[185,185,185]},{"vertices":[293,258,216],"normals":[186,186,186]},{"vertices":[2,9,221],"normals":[187,187,187]},{"vertices":[5,228,229],"normals":[188,188,188]},{"vertices":[233,274,264],"normals":[189,189,189]},{"vertices":[228,270,271],"normals":[190,190,190]},{"vertices":[16,23,215],"normals":[191,191,191]},{"vertices":[19,251,253],"normals":[192,192,192]},{"vertices":[281,285,244],"normals":[193,193,193]},{"vertices":[263,277,236],"normals":[194,194,194]},{"vertices":[30,37,219],"normals":[195,195,195]},{"vertices":[222,223,40],"normals":[196,196,196]},{"vertices":[269,268,226],"normals":[197,197,197]},{"vertices":[250,291,292],"normals":[198,198,198]},{"vertices":[242,44,51],"normals":[199,199,199]},{"vertices":[231,232,54],"normals":[200,200,200]},{"vertices":[219,261,275],"normals":[201,201,201]},{"vertices":[224,266,267],"normals":[202,202,202]},{"vertices":[227,58,65],"normals":[203,203,203]},{"vertices":[254,252,68],"normals":[204,204,204]},{"vertices":[290,289,249],"normals":[205,205,205]},{"vertices":[264,265,223],"normals":[206,206,206]},{"vertices":[237,72,79],"normals":[207,207,207]},{"vertices":[240,244,82],"normals":[208,208,208]},{"vertices":[273,286,245],"normals":[209,209,209]},{"vertices":[297,296,255],"normals":[210,210,210]},{"vertices":[93,100,230],"normals":[211,211,211]},{"vertices":[96,225,248],"normals":[212,212,212]},{"vertices":[226,268,295],"normals":[213,213,213]},{"vertices":[21,214,215],"normals":[216,216,216]},{"vertices":[244,243,77],"normals":[219,219,219]},{"vertices":[63,216,217],"normals":[222,222,222]},{"vertices":[247,250,14],"normals":[224,224,224]},{"vertices":[234,233,28],"normals":[226,226,226]},{"vertices":[255,224,91],"normals":[227,227,227]},{"vertices":[49,245,246],"normals":[228,228,228]},{"vertices":[28,233,222],"normals":[233,233,233]},{"vertices":[223,218,35],"normals":[234,234,234]},{"vertices":[42,241,231],"normals":[236,236,236]},{"vertices":[35,218,219],"normals":[237,237,237]},{"vertices":[248,249,98],"normals":[238,238,238]},{"vertices":[236,235,0],"normals":[239,239,239]},{"vertices":[237,239,70],"normals":[242,242,242]},{"vertices":[229,220,7],"normals":[246,246,246]},{"vertices":[14,250,251],"normals":[247,247,247]},{"vertices":[232,245,49],"normals":[248,248,248]},{"vertices":[7,220,221],"normals":[249,249,249]},{"vertices":[277,263,262],"normals":[250,250,250]},{"vertices":[276,262,271],"normals":[251,251,251]},{"vertices":[288,257,256],"normals":[252,252,252]},{"vertices":[291,256,294],"normals":[253,253,253]},{"vertices":[274,275,261],"normals":[254,254,254]},{"vertices":[274,260,265],"normals":[255,255,255]},{"vertices":[283,287,286],"normals":[256,256,256]},{"vertices":[282,286,273],"normals":[257,257,257]},{"vertices":[268,269,259],"normals":[258,258,258]},{"vertices":[268,258,293],"normals":[259,259,259]},{"vertices":[278,279,284],"normals":[260,260,260]},{"vertices":[280,284,285],"normals":[261,261,261]},{"vertices":[296,297,289],"normals":[262,262,262]},{"vertices":[267,266,289],"normals":[263,263,263]},{"vertices":[272,273,232],"normals":[264,264,264]},{"vertices":[294,256,214],"normals":[265,265,265]},{"vertices":[278,280,239],"normals":[266,266,266]},{"vertices":[275,274,233],"normals":[267,267,267]},{"vertices":[251,292,294],"normals":[268,268,268]},{"vertices":[277,276,235],"normals":[269,269,269]},{"vertices":[265,260,218],"normals":[270,270,270]},{"vertices":[238,279,278],"normals":[271,271,271]},{"vertices":[235,276,270],"normals":[272,272,272]},{"vertices":[295,293,252],"normals":[273,273,273]},{"vertices":[239,280,281],"normals":[274,274,274]},{"vertices":[271,262,220],"normals":[275,275,275]},{"vertices":[283,282,241],"normals":[276,276,276]},{"vertices":[246,287,283],"normals":[277,277,277]},{"vertices":[214,256,257],"normals":[278,278,278]},{"vertices":[249,289,297],"normals":[279,279,279]},{"vertices":[285,284,243],"normals":[280,280,280]},{"vertices":[296,266,224],"normals":[281,281,281]},{"vertices":[216,258,259],"normals":[282,282,282]},{"vertices":[243,284,279],"normals":[283,283,283]},{"vertices":[245,286,287],"normals":[284,284,284]},{"vertices":[225,267,290],"normals":[285,285,285]},{"vertices":[218,260,261],"normals":[286,286,286]},{"vertices":[217,259,269],"normals":[287,287,287]},{"vertices":[288,291,250],"normals":[288,288,288]},{"vertices":[257,288,247],"normals":[289,289,289]},{"vertices":[241,282,272],"normals":[290,290,290]},{"vertices":[220,262,263],"normals":[291,291,291]},{"vertices":[313,324,309],"normals":[184,184,184]},{"vertices":[306,299,123],"normals":[292,292,292]},{"vertices":[300,311,209],"normals":[293,293,293]},{"vertices":[309,308,211],"normals":[294,294,294]},{"vertices":[310,302,130],"normals":[295,295,295]},{"vertices":[311,310,213],"normals":[296,296,296]},{"vertices":[299,298,122],"normals":[297,297,297]},{"vertices":[134,304,307],"normals":[298,298,298]},{"vertices":[312,305,135],"normals":[299,299,299]},{"vertices":[127,301,300],"normals":[300,300,300]},{"vertices":[308,301,127],"normals":[301,301,301]},{"vertices":[302,303,131],"normals":[302,302,302]},{"vertices":[135,305,304],"normals":[303,303,303]},{"vertices":[131,303,312],"normals":[304,304,304]},{"vertices":[122,298,309],"normals":[305,305,305]},{"vertices":[325,385,377],"normals":[306,306,306]},{"vertices":[326,325,310],"normals":[178,178,178]},{"vertices":[315,326,311],"normals":[185,185,185]},{"vertices":[312,327,320],"normals":[181,181,181]},{"vertices":[314,313,298],"normals":[307,307,307]},{"vertices":[310,325,317],"normals":[182,182,182]},{"vertices":[316,315,300],"normals":[308,308,308]},{"vertices":[319,322,307],"normals":[183,183,183]},{"vertices":[317,318,303],"normals":[309,309,309]},{"vertices":[308,323,316],"normals":[180,180,180]},{"vertices":[320,319,304],"normals":[310,310,310]},{"vertices":[318,327,312],"normals":[177,177,177]},{"vertices":[322,321,306],"normals":[83,83,83]},{"vertices":[306,321,314],"normals":[179,179,179]},{"vertices":[324,323,308],"normals":[176,176,176]},{"vertices":[352,353,338],"normals":[311,311,311]},{"vertices":[332,333,141],"normals":[104,104,104]},{"vertices":[340,334,142],"normals":[104,104,104]},{"vertices":[334,328,136],"normals":[104,104,104]},{"vertices":[150,342,337],"normals":[104,104,104]},{"vertices":[335,336,144],"normals":[104,104,104]},{"vertices":[329,341,149],"normals":[104,104,104]},{"vertices":[337,338,146],"normals":[104,104,104]},{"vertices":[333,342,150],"normals":[104,104,104]},{"vertices":[336,332,140],"normals":[104,104,104]},{"vertices":[139,331,335],"normals":[104,104,104]},{"vertices":[339,340,148],"normals":[104,104,104]},{"vertices":[328,329,137],"normals":[104,104,104]},{"vertices":[149,341,330],"normals":[104,104,104]},{"vertices":[330,331,139],"normals":[104,104,104]},{"vertices":[359,371,356],"normals":[312,312,312]},{"vertices":[348,357,342],"normals":[313,313,313]},{"vertices":[351,347,332],"normals":[314,314,314]},{"vertices":[346,350,335],"normals":[315,315,315]},{"vertices":[354,355,340],"normals":[316,316,316]},{"vertices":[343,344,329],"normals":[317,317,317]},{"vertices":[356,345,330],"normals":[318,318,318]},{"vertices":[345,346,331],"normals":[319,319,319]},{"vertices":[353,354,339],"normals":[320,320,320]},{"vertices":[347,348,333],"normals":[321,321,321]},{"vertices":[355,349,334],"normals":[322,322,322]},{"vertices":[349,343,328],"normals":[323,323,323]},{"vertices":[357,352,337],"normals":[324,324,324]},{"vertices":[350,351,336],"normals":[325,325,325]},{"vertices":[344,356,341],"normals":[326,326,326]},{"vertices":[359,358,364],"normals":[104,104,104]},{"vertices":[364,370,369],"normals":[104,104,104]},{"vertices":[369,368,367],"normals":[104,104,104]},{"vertices":[367,372,363],"normals":[104,104,104]},{"vertices":[363,362,366],"normals":[104,104,104]},{"vertices":[366,365,361],"normals":[104,104,104]},{"vertices":[361,360,371],"normals":[104,104,104]},{"vertices":[371,359,364],"normals":[104,104,104]},{"vertices":[364,369,371],"normals":[104,104,104]},{"vertices":[367,363,371],"normals":[104,104,104]},{"vertices":[366,361,371],"normals":[104,104,104]},{"vertices":[371,369,367],"normals":[104,104,104]},{"vertices":[352,367,368],"normals":[327,327,327]},{"vertices":[363,372,357],"normals":[328,328,328]},{"vertices":[366,362,347],"normals":[329,329,329]},{"vertices":[361,365,350],"normals":[330,330,330]},{"vertices":[369,370,355],"normals":[331,331,331]},{"vertices":[358,359,344],"normals":[332,332,332]},{"vertices":[356,371,360],"normals":[333,333,333]},{"vertices":[360,361,346],"normals":[334,334,334]},{"vertices":[368,369,354],"normals":[335,335,335]},{"vertices":[347,362,363],"normals":[336,336,336]},{"vertices":[370,364,349],"normals":[337,337,337]},{"vertices":[349,364,358],"normals":[338,338,338]},{"vertices":[372,367,352],"normals":[339,339,339]},{"vertices":[365,366,351],"normals":[340,340,340]},{"vertices":[390,401,386],"normals":[341,341,341]},{"vertices":[376,375,315],"normals":[342,342,342]},{"vertices":[379,382,322],"normals":[343,343,343]},{"vertices":[377,378,318],"normals":[344,344,344]},{"vertices":[323,383,376],"normals":[345,345,345]},{"vertices":[320,380,379],"normals":[346,346,346]},{"vertices":[378,387,327],"normals":[347,347,347]},{"vertices":[382,381,321],"normals":[348,348,348]},{"vertices":[321,381,374],"normals":[349,349,349]},{"vertices":[384,383,323],"normals":[350,350,350]},{"vertices":[373,384,324],"normals":[351,351,351]},{"vertices":[326,386,385],"normals":[352,352,352]},{"vertices":[375,386,326],"normals":[353,353,353]},{"vertices":[327,387,380],"normals":[354,354,354]},{"vertices":[374,373,313],"normals":[355,355,355]},{"vertices":[413,406,391],"normals":[319,319,319]},{"vertices":[402,395,380],"normals":[356,356,356]},{"vertices":[389,388,373],"normals":[357,357,357]},{"vertices":[400,392,377],"normals":[358,358,358]},{"vertices":[376,391,390],"normals":[359,359,359]},{"vertices":[379,394,397],"normals":[360,360,360]},{"vertices":[392,393,378],"normals":[361,361,361]},{"vertices":[398,391,376],"normals":[362,362,362]},{"vertices":[395,394,379],"normals":[363,363,363]},{"vertices":[378,393,402],"normals":[364,364,364]},{"vertices":[382,397,396],"normals":[365,365,365]},{"vertices":[396,389,374],"normals":[366,366,366]},{"vertices":[399,398,383],"normals":[367,367,367]},{"vertices":[373,388,399],"normals":[368,368,368]},{"vertices":[386,401,400],"normals":[369,369,369]},{"vertices":[410,409,412],"normals":[376,376,376]},{"vertices":[412,411,404],"normals":[377,377,377]},{"vertices":[404,403,412],"normals":[378,378,378]},{"vertices":[414,413,416],"normals":[104,104,104]},{"vertices":[406,405,416],"normals":[379,379,379]},{"vertices":[416,415,407],"normals":[380,380,380]},{"vertices":[407,408,417],"normals":[381,381,381]},{"vertices":[417,410,412],"normals":[376,376,376]},{"vertices":[412,403,414],"normals":[382,382,382]},{"vertices":[413,406,416],"normals":[383,383,383]},{"vertices":[416,407,414],"normals":[384,384,384]},{"vertices":[417,412,414],"normals":[104,104,104]},{"vertices":[410,409,394],"normals":[311,311,311]},{"vertices":[393,408,417],"normals":[316,316,316]},{"vertices":[412,411,396],"normals":[313,313,313]},{"vertices":[411,404,389],"normals":[321,321,321]},{"vertices":[414,413,398],"normals":[315,315,315]},{"vertices":[388,403,414],"normals":[325,325,325]},{"vertices":[416,415,400],"normals":[317,317,317]},{"vertices":[405,416,401],"normals":[326,326,326]},{"vertices":[417,410,395],"normals":[320,320,320]},{"vertices":[404,403,388],"normals":[314,314,314]},{"vertices":[415,407,392],"normals":[323,323,323]},{"vertices":[391,406,405],"normals":[318,318,318]},{"vertices":[394,409,412],"normals":[324,324,324]},{"vertices":[407,408,393],"normals":[322,322,322]}]}];

/***/ }),

/***/ "./src/assets/lab2.json":
/*!******************************!*\
  !*** ./src/assets/lab2.json ***!
  \******************************/
/*! exports provided: 0, default */
/***/ (function(module) {

module.exports = [{"name":"Torus","normals":[],"vertices":[{"x":1.34,"y":0,"z":0},{"x":1.196482,"y":0.346482,"z":0},{"x":0.85,"y":0.49,"z":0},{"x":0.503518,"y":0.346482,"z":0},{"x":0.503518,"y":-0.481314,"z":0},{"x":0.85,"y":-0.49,"z":0},{"x":1.196482,"y":-0.346482,"z":0},{"x":1.224151,"y":0,"z":-0.545027},{"x":1.093041,"y":0.346482,"z":-0.486653},{"x":0.776514,"y":0.49,"z":-0.345726},{"x":0.459986,"y":0.346482,"z":-0.204799},{"x":0.459986,"y":-0.481314,"z":-0.204799},{"x":0.776514,"y":-0.49,"z":-0.345726},{"x":1.093041,"y":-0.346482,"z":-0.486653},{"x":0.896635,"y":0,"z":-0.995814},{"x":0.800603,"y":0.346482,"z":-0.88916},{"x":0.568761,"y":0.49,"z":-0.631673},{"x":0.336919,"y":0.346482,"z":-0.374187},{"x":0.336919,"y":-0.481314,"z":-0.374187},{"x":0.568761,"y":-0.49,"z":-0.631673},{"x":0.800603,"y":-0.346482,"z":-0.88916},{"x":0.414083,"y":0,"z":-1.274416},{"x":0.369734,"y":0.346482,"z":-1.137922},{"x":0.262665,"y":0.49,"z":-0.808398},{"x":0.155596,"y":0.346482,"z":-0.478874},{"x":0.155596,"y":-0.481314,"z":-0.478874},{"x":0.262665,"y":-0.49,"z":-0.808398},{"x":0.369734,"y":-0.346482,"z":-1.137922},{"x":-0.140069,"y":0,"z":-1.332659},{"x":-0.125067,"y":0.346482,"z":-1.189928},{"x":-0.088849,"y":0.49,"z":-0.845344},{"x":-0.052632,"y":0.346482,"z":-0.500759},{"x":-0.052632,"y":-0.481314,"z":-0.500759},{"x":-0.088849,"y":-0.49,"z":-0.845344},{"x":-0.125067,"y":-0.346482,"z":-1.189928},{"x":-0.67,"y":0,"z":-1.160474},{"x":-0.598241,"y":0.346482,"z":-1.036184},{"x":-0.425,"y":0.49,"z":-0.736122},{"x":-0.251759,"y":0.346482,"z":-0.436059},{"x":-0.251759,"y":-0.481314,"z":-0.436059},{"x":-0.425,"y":-0.49,"z":-0.736122},{"x":-0.598241,"y":-0.346482,"z":-1.036184},{"x":-1.084083,"y":0,"z":-0.787632},{"x":-0.967975,"y":0.346482,"z":-0.703274},{"x":-0.687665,"y":0.49,"z":-0.499617},{"x":-0.407354,"y":0.346482,"z":-0.29596},{"x":-0.407354,"y":-0.481314,"z":-0.29596},{"x":-0.687665,"y":-0.49,"z":-0.499617},{"x":-0.967975,"y":-0.346482,"z":-0.703274},{"x":-1.310718,"y":0,"z":-0.278602},{"x":-1.170336,"y":0.346482,"z":-0.248763},{"x":-0.831425,"y":0.49,"z":-0.176725},{"x":-0.492515,"y":0.346482,"z":-0.104687},{"x":-0.492515,"y":-0.481314,"z":-0.104687},{"x":-0.831425,"y":-0.49,"z":-0.176725},{"x":-1.170336,"y":-0.346482,"z":-0.248763},{"x":-1.310718,"y":0,"z":0.278602},{"x":-1.170336,"y":0.346482,"z":0.248763},{"x":-0.831425,"y":0.49,"z":0.176725},{"x":-0.492515,"y":0.346482,"z":0.104687},{"x":-0.492515,"y":-0.481314,"z":0.104687},{"x":-0.831425,"y":-0.49,"z":0.176725},{"x":-1.170336,"y":-0.346482,"z":0.248763},{"x":-1.084083,"y":0,"z":0.787632},{"x":-0.967975,"y":0.346482,"z":0.703274},{"x":-0.687665,"y":0.49,"z":0.499617},{"x":-0.407354,"y":0.346482,"z":0.29596},{"x":-0.407354,"y":-0.481314,"z":0.29596},{"x":-0.687665,"y":-0.49,"z":0.499617},{"x":-0.967975,"y":-0.346482,"z":0.703274},{"x":-0.67,"y":0,"z":1.160474},{"x":-0.598241,"y":0.346482,"z":1.036184},{"x":-0.425,"y":0.49,"z":0.736122},{"x":-0.251759,"y":0.346482,"z":0.436059},{"x":-0.251759,"y":-0.481314,"z":0.436059},{"x":-0.425,"y":-0.49,"z":0.774122},{"x":-0.598241,"y":-0.346482,"z":1.036184},{"x":-0.140069,"y":0,"z":1.332659},{"x":-0.125067,"y":0.346482,"z":1.189928},{"x":-0.088849,"y":0.49,"z":0.845344},{"x":-0.052632,"y":0.346482,"z":0.500759},{"x":-0.052632,"y":-0.481314,"z":0.500759},{"x":-0.088849,"y":-0.49,"z":0.883344},{"x":-0.125067,"y":-0.346482,"z":1.189928},{"x":0.414083,"y":0,"z":1.274416},{"x":0.369734,"y":0.346482,"z":1.137922},{"x":0.262665,"y":0.49,"z":0.808398},{"x":0.155596,"y":0.346482,"z":0.478874},{"x":0.155596,"y":-0.481314,"z":0.478874},{"x":0.262665,"y":-0.49,"z":0.808398},{"x":0.369734,"y":-0.346482,"z":1.137922},{"x":0.896635,"y":0,"z":0.995814},{"x":0.800603,"y":0.346482,"z":0.88916},{"x":0.568761,"y":0.49,"z":0.631673},{"x":0.336919,"y":0.346482,"z":0.374187},{"x":0.336919,"y":-0.481314,"z":0.374187},{"x":0.568761,"y":-0.49,"z":0.631673},{"x":0.800603,"y":-0.346482,"z":0.88916},{"x":1.224151,"y":0,"z":0.545027},{"x":1.093041,"y":0.346482,"z":0.486653},{"x":0.776514,"y":0.49,"z":0.345726},{"x":0.459986,"y":0.346482,"z":0.204799},{"x":0.459986,"y":-0.481314,"z":0.204799},{"x":0.776514,"y":-0.49,"z":0.345726},{"x":1.093041,"y":-0.346482,"z":0.486653},{"x":0.340738,"y":-0.425033,"z":0},{"x":0.31128,"y":-0.425033,"z":-0.138591},{"x":0.227998,"y":-0.425033,"z":-0.253218},{"x":0.105294,"y":-0.425033,"z":-0.324061},{"x":-0.035617,"y":-0.425033,"z":-0.338871},{"x":-0.170369,"y":-0.425033,"z":-0.295088},{"x":-0.275663,"y":-0.425033,"z":-0.200281},{"x":-0.333292,"y":-0.425033,"z":-0.070843},{"x":-0.333292,"y":-0.425033,"z":0.070843},{"x":-0.275663,"y":-0.425033,"z":0.200281},{"x":-0.170369,"y":-0.425033,"z":0.295088},{"x":-0.035617,"y":-0.425033,"z":0.338871},{"x":0.105294,"y":-0.425033,"z":0.324061},{"x":0.227998,"y":-0.425033,"z":0.253218},{"x":0.31128,"y":-0.425033,"z":0.138591},{"x":-0.492515,"y":-0.481314,"z":-0.104687},{"x":-0.492515,"y":-0.481314,"z":0.104687},{"x":-0.333292,"y":-0.377387,"z":-0.070843},{"x":-0.333292,"y":-0.377387,"z":0.070843},{"x":0.155596,"y":-0.481314,"z":-0.478874},{"x":-0.052632,"y":-0.481314,"z":-0.500759},{"x":0.105294,"y":-0.377163,"z":-0.324061},{"x":-0.035617,"y":-0.377387,"z":-0.338871},{"x":0.503518,"y":-0.481314,"z":0},{"x":0.459986,"y":-0.481314,"z":0.204799},{"x":0.340738,"y":-0.377387,"z":0},{"x":0.31128,"y":-0.377387,"z":0.138591},{"x":-0.052632,"y":-0.481314,"z":0.500759},{"x":0.155596,"y":-0.481314,"z":0.478874},{"x":-0.035617,"y":-0.377387,"z":0.338871},{"x":0.105294,"y":-0.377387,"z":0.324061},{"x":0.291364,"y":0.22909,"z":-0.129724},{"x":0.213411,"y":0.22909,"z":-0.237017},{"x":-0.033338,"y":0.22909,"z":-0.317191},{"x":-0.159469,"y":0.22909,"z":-0.276208},{"x":-0.311969,"y":0.22909,"z":0.066311},{"x":-0.258026,"y":0.22909,"z":0.187467},{"x":0.318938,"y":0.22909,"z":0},{"x":-0.258026,"y":0.22909,"z":-0.187467},{"x":-0.311969,"y":0.22909,"z":-0.066311},{"x":-0.033338,"y":0.22909,"z":0.317191},{"x":0.098557,"y":0.22909,"z":0.303328},{"x":0.213411,"y":0.22909,"z":0.237017},{"x":0.291364,"y":0.22909,"z":0.129724},{"x":0.098557,"y":0.22909,"z":-0.303328},{"x":-0.159469,"y":0.22909,"z":0.276208},{"x":-0.054273,"y":0.194721,"z":-0.511883},{"x":-0.257675,"y":0.194721,"z":-0.445794},{"x":0.51382,"y":0.194721,"z":-0.000371},{"x":0.469354,"y":0.194721,"z":-0.209568},{"x":-0.054273,"y":0.194721,"z":0.511142},{"x":0.158427,"y":0.194721,"z":0.488786},{"x":-0.503601,"y":0.194721,"z":-0.107306},{"x":-0.503601,"y":0.194721,"z":0.106565},{"x":0.343644,"y":0.194721,"z":0.381851},{"x":0.469354,"y":0.194721,"z":0.208826},{"x":0.343644,"y":0.194721,"z":-0.382592},{"x":0.158427,"y":0.194721,"z":-0.489528},{"x":-0.416612,"y":0.194721,"z":0.301945},{"x":-0.257675,"y":0.194721,"z":0.445052},{"x":-0.034564,"y":0.074808,"z":-0.324373},{"x":-0.163404,"y":0.074808,"z":-0.282511},{"x":0.325276,"y":0.074808,"z":-0.000371},{"x":0.297111,"y":0.074808,"z":-0.13288},{"x":-0.034564,"y":0.074808,"z":0.323631},{"x":0.100163,"y":0.074808,"z":0.309471},{"x":-0.319178,"y":0.074808,"z":-0.068106},{"x":-0.319178,"y":0.074808,"z":0.067364},{"x":0.217484,"y":0.074808,"z":0.241736},{"x":0.297111,"y":0.074808,"z":0.132139},{"x":0.217484,"y":0.074808,"z":-0.242478},{"x":0.100163,"y":0.074808,"z":-0.310212},{"x":-0.264078,"y":0.074808,"z":0.191122},{"x":-0.163404,"y":0.074808,"z":0.281769},{"x":-0.027516,"y":0.040453,"z":-0.330449},{"x":-0.161176,"y":0.040453,"z":-0.28702},{"x":0.34579,"y":0.040453,"z":0.005676},{"x":0.31657,"y":0.040453,"z":-0.131791},{"x":-0.027516,"y":0.040453,"z":0.341802},{"x":0.112253,"y":0.040453,"z":0.327111},{"x":-0.322779,"y":0.040453,"z":-0.064593},{"x":-0.322779,"y":0.040453,"z":0.075946},{"x":0.233963,"y":0.040453,"z":0.256842},{"x":0.31657,"y":0.040453,"z":0.143144},{"x":0.233963,"y":0.040453,"z":-0.245489},{"x":0.112253,"y":0.040453,"z":-0.315759},{"x":-0.265616,"y":0.040453,"z":0.204334},{"x":-0.161176,"y":0.040453,"z":0.298373},{"x":-0.014565,"y":-0.038344,"z":-0.207232},{"x":-0.099228,"y":-0.038344,"z":-0.179724},{"x":0.221894,"y":-0.038344,"z":0.005676},{"x":0.203386,"y":-0.038344,"z":-0.081398},{"x":-0.014565,"y":-0.038344,"z":0.218585},{"x":0.073967,"y":-0.038344,"z":0.20928},{"x":-0.20159,"y":-0.038344,"z":-0.038834},{"x":-0.20159,"y":-0.038344,"z":0.050186},{"x":0.151061,"y":-0.038344,"z":0.16477},{"x":0.203386,"y":-0.038344,"z":0.092751},{"x":0.151061,"y":-0.038344,"z":-0.153417},{"x":0.073967,"y":-0.038344,"z":-0.197927},{"x":-0.165383,"y":-0.038344,"z":0.13151},{"x":-0.099228,"y":-0.038344,"z":0.191076},{"x":0.227998,"y":-0.377163,"z":0.253218},{"x":-0.170369,"y":-0.377163,"z":0.295088},{"x":0.227998,"y":-0.377163,"z":-0.253218},{"x":-0.275663,"y":-0.377163,"z":0.200281},{"x":-0.170369,"y":-0.377163,"z":-0.295088},{"x":-0.275663,"y":-0.377163,"z":-0.200281},{"x":0.31128,"y":-0.377163,"z":-0.138591},{"x":0.43016,"y":0,"z":-1.316058},{"x":0.384225,"y":0.358869,"z":-1.174685},{"x":-1.121566,"y":0,"z":0.819709},{"x":-1.001307,"y":0.358869,"z":0.732336},{"x":-0.692679,"y":0,"z":-1.198043},{"x":-0.618355,"y":0.358869,"z":-1.069309},{"x":1.269188,"y":0,"z":-0.560593},{"x":1.133391,"y":0.358869,"z":-0.500132},{"x":-0.128265,"y":-0.358869,"z":-1.228549},{"x":-0.618355,"y":-0.358869,"z":-1.069309},{"x":0.929963,"y":0,"z":1.035334},{"x":0.830498,"y":-0.358869,"z":0.924866},{"x":-1.356303,"y":0,"z":0.292481},{"x":-1.210903,"y":0.358869,"z":0.261575},{"x":1.24053,"y":-0.358869,"z":0.003919},{"x":1.133391,"y":-0.358869,"z":-0.500132},{"x":1.133391,"y":0.358869,"z":0.50797},{"x":-1.001307,"y":-0.358869,"z":-0.724498},{"x":-1.210903,"y":-0.358869,"z":-0.253737},{"x":-0.143803,"y":0,"z":-1.376384},{"x":-0.128265,"y":0.358869,"z":-1.228549},{"x":1.389179,"y":0,"z":0.003919},{"x":1.24053,"y":0.358869,"z":0.003919},{"x":-0.618355,"y":0.358869,"z":1.077147},{"x":-0.128265,"y":0.358869,"z":1.236387},{"x":-0.692679,"y":0,"z":1.205881},{"x":-0.618355,"y":-0.358869,"z":1.115148},{"x":-1.121566,"y":0,"z":-0.811871},{"x":-1.001307,"y":0.358869,"z":-0.724498},{"x":-0.143803,"y":0,"z":1.384221},{"x":-0.128265,"y":-0.358869,"z":1.274388},{"x":-1.356303,"y":0,"z":-0.284643},{"x":-1.210903,"y":0.358869,"z":-0.253737},{"x":0.830498,"y":0.358869,"z":-0.917029},{"x":1.133391,"y":-0.358869,"z":0.50797},{"x":1.269188,"y":0,"z":0.568431},{"x":0.929963,"y":0,"z":-1.027496},{"x":0.830498,"y":-0.358869,"z":-0.917029},{"x":-1.001307,"y":-0.358869,"z":0.732336},{"x":0.384225,"y":-0.358869,"z":-1.174685},{"x":-1.210903,"y":-0.358869,"z":0.261575},{"x":0.830498,"y":0.358869,"z":0.924866},{"x":0.454178,"y":0,"z":-1.380782},{"x":0.405831,"y":0.377716,"z":-1.231985},{"x":-1.179042,"y":0,"z":0.867151},{"x":-1.052467,"y":0.377716,"z":0.775189},{"x":-0.72763,"y":0,"z":-1.25657},{"x":-0.649403,"y":0.377716,"z":-1.121075},{"x":1.337271,"y":0,"z":-0.585642},{"x":1.194342,"y":0.377716,"z":-0.522006},{"x":-0.133574,"y":-0.377716,"z":-1.288678},{"x":-0.649403,"y":-0.377716,"z":-1.121075},{"x":0.98023,"y":0,"z":1.0941},{"x":0.875541,"y":-0.377716,"z":0.977831},{"x":-1.426107,"y":0,"z":0.312234},{"x":-1.27307,"y":0.377716,"z":0.279705},{"x":1.307108,"y":-0.377716,"z":0.008517},{"x":1.194342,"y":-0.377716,"z":-0.522006},{"x":-1.052467,"y":-0.377716,"z":-0.758155},{"x":-1.27307,"y":-0.377716,"z":-0.262671},{"x":-0.149928,"y":0,"z":-1.444277},{"x":-0.133574,"y":0.377716,"z":-1.288678},{"x":1.463563,"y":0,"z":0.008517},{"x":1.307108,"y":0.377716,"z":0.008517},{"x":-0.649403,"y":0.377716,"z":1.138109},{"x":-0.133574,"y":0.377716,"z":1.305712},{"x":-0.72763,"y":0,"z":1.273604},{"x":-0.649403,"y":-0.377716,"z":1.138109},{"x":-1.179042,"y":0,"z":-0.850117},{"x":-1.052467,"y":0.377716,"z":-0.758155},{"x":-0.149928,"y":0,"z":1.461311},{"x":-0.133574,"y":-0.377716,"z":1.305712},{"x":-1.426107,"y":0,"z":-0.2952},{"x":-1.27307,"y":0.377716,"z":-0.262671},{"x":0.875542,"y":0.377716,"z":-0.960797},{"x":1.337271,"y":0,"z":0.602676},{"x":1.194342,"y":-0.377716,"z":0.53904},{"x":0.980231,"y":0,"z":-1.077066},{"x":0.875542,"y":-0.377716,"z":-0.960797},{"x":-1.052467,"y":-0.377716,"z":0.775189},{"x":0.405831,"y":-0.377716,"z":-1.231985},{"x":-1.27307,"y":-0.377716,"z":0.279705},{"x":0.875541,"y":0.377716,"z":0.977831},{"x":1.194342,"y":0.377716,"z":0.53904},{"x":-0.118966,"y":-0.411034,"z":-0.025287},{"x":-0.118966,"y":-0.411034,"z":0.025287},{"x":0.037584,"y":-0.410954,"z":-0.115671},{"x":-0.012713,"y":-0.411034,"z":-0.120958},{"x":0.121624,"y":-0.411034,"z":0},{"x":0.111109,"y":-0.411034,"z":0.049469},{"x":-0.012713,"y":-0.411034,"z":0.120958},{"x":0.037584,"y":-0.411034,"z":0.115671},{"x":-0.098396,"y":-0.410954,"z":0.071489},{"x":-0.060812,"y":-0.410954,"z":0.105329},{"x":-0.060812,"y":-0.410954,"z":-0.105329},{"x":-0.098396,"y":-0.410954,"z":-0.071489},{"x":0.111109,"y":-0.410954,"z":-0.049469},{"x":0.081382,"y":-0.410954,"z":-0.090384},{"x":0.081382,"y":-0.410954,"z":0.090384},{"x":-0.118966,"y":-0.392669,"z":-0.025287},{"x":-0.118966,"y":-0.392669,"z":0.025287},{"x":0.037584,"y":-0.392589,"z":-0.115671},{"x":-0.012713,"y":-0.392669,"z":-0.120958},{"x":0.121624,"y":-0.392669,"z":0},{"x":0.111109,"y":-0.392669,"z":0.049469},{"x":-0.012713,"y":-0.392669,"z":0.120958},{"x":0.037584,"y":-0.392669,"z":0.115671},{"x":-0.098396,"y":-0.392589,"z":0.071489},{"x":-0.060812,"y":-0.392589,"z":0.105329},{"x":-0.060812,"y":-0.392589,"z":-0.105329},{"x":-0.098396,"y":-0.392589,"z":-0.071489},{"x":0.111109,"y":-0.392589,"z":-0.049469},{"x":0.081382,"y":-0.392589,"z":-0.090384},{"x":0.081382,"y":-0.392589,"z":0.090384},{"x":0.24107,"y":0.22909,"z":-0.107331},{"x":0.176573,"y":0.22909,"z":-0.196104},{"x":-0.027584,"y":0.22909,"z":-0.262439},{"x":-0.131942,"y":0.22909,"z":-0.228531},{"x":-0.258118,"y":0.22909,"z":0.054865},{"x":-0.213487,"y":0.22909,"z":0.155107},{"x":0.263884,"y":0.22909,"z":0},{"x":-0.213487,"y":0.22909,"z":-0.155107},{"x":-0.258118,"y":0.22909,"z":-0.054865},{"x":-0.027584,"y":0.22909,"z":0.262439},{"x":0.081545,"y":0.22909,"z":0.250969},{"x":0.176573,"y":0.22909,"z":0.196104},{"x":0.24107,"y":0.22909,"z":0.107331},{"x":0.081545,"y":0.22909,"z":-0.250969},{"x":-0.131942,"y":0.22909,"z":0.228531},{"x":0.24107,"y":0.277878,"z":-0.107331},{"x":0.176573,"y":0.277878,"z":-0.196104},{"x":-0.027584,"y":0.277878,"z":-0.262439},{"x":-0.131942,"y":0.277878,"z":-0.228531},{"x":-0.258118,"y":0.277878,"z":0.054865},{"x":-0.213487,"y":0.277878,"z":0.155107},{"x":0.263884,"y":0.277878,"z":0},{"x":-0.213487,"y":0.277878,"z":-0.155107},{"x":-0.258118,"y":0.277878,"z":-0.054865},{"x":-0.027584,"y":0.277878,"z":0.262439},{"x":0.081545,"y":0.277878,"z":0.250969},{"x":0.176573,"y":0.277878,"z":0.196104},{"x":0.24107,"y":0.277878,"z":0.107331},{"x":0.081545,"y":0.277878,"z":-0.250969},{"x":-0.131942,"y":0.277878,"z":0.228531},{"x":0.100267,"y":0.451819,"z":-0.044642},{"x":0.073441,"y":0.451819,"z":-0.081565},{"x":-0.011473,"y":0.451819,"z":-0.109155},{"x":-0.054878,"y":0.451819,"z":-0.095052},{"x":-0.107358,"y":0.451819,"z":0.02282},{"x":-0.088795,"y":0.451819,"z":0.064513},{"x":0.109756,"y":0.451819,"z":0},{"x":-0.088795,"y":0.451819,"z":-0.064513},{"x":-0.107358,"y":0.451819,"z":-0.02282},{"x":-0.011473,"y":0.451819,"z":0.109155},{"x":0.033917,"y":0.451819,"z":0.104384},{"x":0.073441,"y":0.451819,"z":0.081565},{"x":0.100267,"y":0.451819,"z":0.044642},{"x":0.033917,"y":0.451819,"z":-0.104384},{"x":-0.054878,"y":0.451819,"z":0.095052},{"x":-0.094448,"y":-0.377053,"z":-0.020076},{"x":-0.094448,"y":-0.377053,"z":0.020076},{"x":0.029838,"y":-0.37699,"z":-0.091832},{"x":-0.010093,"y":-0.377053,"z":-0.096029},{"x":0.096558,"y":-0.377053,"z":0},{"x":0.08821,"y":-0.377053,"z":0.039274},{"x":-0.010093,"y":-0.377053,"z":0.096029},{"x":0.029838,"y":-0.377053,"z":0.091832},{"x":-0.078117,"y":-0.37699,"z":0.056755},{"x":-0.048279,"y":-0.37699,"z":0.083622},{"x":-0.048279,"y":-0.37699,"z":-0.083622},{"x":-0.078117,"y":-0.37699,"z":-0.056755},{"x":0.08821,"y":-0.37699,"z":-0.039274},{"x":0.06461,"y":-0.37699,"z":-0.071757},{"x":0.06461,"y":-0.37699,"z":0.071757},{"x":-0.073298,"y":-0.390084,"z":-0.01558},{"x":-0.073298,"y":-0.390084,"z":0.01558},{"x":0.023156,"y":-0.390034,"z":-0.071268},{"x":-0.007833,"y":-0.390084,"z":-0.074525},{"x":0.074936,"y":-0.390084,"z":0},{"x":0.068457,"y":-0.390084,"z":0.030479},{"x":-0.007833,"y":-0.390084,"z":0.074525},{"x":0.023156,"y":-0.390084,"z":0.071268},{"x":-0.060624,"y":-0.390034,"z":0.044046},{"x":-0.037468,"y":-0.390034,"z":0.064896},{"x":-0.037468,"y":-0.390034,"z":-0.064896},{"x":-0.060624,"y":-0.390034,"z":-0.044046},{"x":0.068457,"y":-0.390034,"z":-0.030479},{"x":0.050142,"y":-0.390034,"z":-0.055688},{"x":0.050142,"y":-0.390034,"z":0.055688},{"x":-0.073298,"y":-0.567103,"z":-0.01558},{"x":-0.073298,"y":-0.567103,"z":0.01558},{"x":0.023156,"y":-0.567054,"z":-0.071268},{"x":-0.007833,"y":-0.567103,"z":-0.074525},{"x":0.074936,"y":-0.567103,"z":0},{"x":0.068457,"y":-0.567103,"z":0.030479},{"x":-0.007833,"y":-0.567103,"z":0.074525},{"x":0.023156,"y":-0.567103,"z":0.071268},{"x":-0.060624,"y":-0.567054,"z":0.044046},{"x":-0.037468,"y":-0.567054,"z":0.064896},{"x":-0.037468,"y":-0.567054,"z":-0.064896},{"x":-0.060624,"y":-0.567054,"z":-0.044046},{"x":0.068457,"y":-0.567054,"z":-0.030479},{"x":0.050142,"y":-0.567054,"z":-0.055688},{"x":0.050142,"y":-0.567054,"z":0.055688}],"faces":[{"vertices":[227,56,57],"normals":[null,null,null],"uv":[0,1,2]},{"vertices":[3,9,2],"normals":[null,null,null],"uv":[3,4,5]},{"vertices":[5,11,4],"normals":[null,null,null],"uv":[6,7,8]},{"vertices":[8,14,7],"normals":[null,null,null],"uv":[9,10,11]},{"vertices":[9,15,8],"normals":[null,null,null],"uv":[12,13,14]},{"vertices":[10,16,9],"normals":[null,null,null],"uv":[15,16,17]},{"vertices":[12,18,11],"normals":[null,null,null],"uv":[18,19,7]},{"vertices":[12,20,19],"normals":[null,null,null],"uv":[20,21,22]},{"vertices":[7,20,13],"normals":[null,null,null],"uv":[23,24,25]},{"vertices":[50,246,51],"normals":[null,null,null],"uv":[26,27,28]},{"vertices":[82,244,83],"normals":[null,null,null],"uv":[29,30,31]},{"vertices":[16,24,23],"normals":[null,null,null],"uv":[16,32,33]},{"vertices":[19,25,18],"normals":[null,null,null],"uv":[34,35,19]},{"vertices":[56,254,62],"normals":[null,null,null],"uv":[1,36,37]},{"vertices":[242,42,43],"normals":[null,null,null],"uv":[38,39,40]},{"vertices":[22,28,21],"normals":[null,null,null],"uv":[41,42,43]},{"vertices":[23,29,22],"normals":[null,null,null],"uv":[44,45,46]},{"vertices":[24,30,23],"normals":[null,null,null],"uv":[47,48,49]},{"vertices":[26,32,25],"normals":[null,null,null],"uv":[50,51,35]},{"vertices":[27,33,26],"normals":[null,null,null],"uv":[52,53,54]},{"vertices":[21,34,27],"normals":[null,null,null],"uv":[55,56,57]},{"vertices":[77,238,78],"normals":[null,null,null],"uv":[58,59,60]},{"vertices":[91,225,97],"normals":[null,null,null],"uv":[61,62,63]},{"vertices":[31,37,30],"normals":[null,null,null],"uv":[64,65,48]},{"vertices":[33,39,32],"normals":[null,null,null],"uv":[66,67,51]},{"vertices":[36,42,35],"normals":[null,null,null],"uv":[68,69,70]},{"vertices":[37,43,36],"normals":[null,null,null],"uv":[71,72,73]},{"vertices":[38,44,37],"normals":[null,null,null],"uv":[74,75,76]},{"vertices":[40,46,39],"normals":[null,null,null],"uv":[77,78,79]},{"vertices":[41,47,40],"normals":[null,null,null],"uv":[80,81,82]},{"vertices":[35,48,41],"normals":[null,null,null],"uv":[83,84,85]},{"vertices":[98,230,99],"normals":[null,null,null],"uv":[86,87,88]},{"vertices":[26,253,27],"normals":[null,null,null],"uv":[89,90,91]},{"vertices":[45,51,44],"normals":[null,null,null],"uv":[92,93,75]},{"vertices":[47,53,46],"normals":[null,null,null],"uv":[94,95,78]},{"vertices":[64,217,65],"normals":[null,null,null],"uv":[96,97,98]},{"vertices":[36,219,37],"normals":[null,null,null],"uv":[99,100,101]},{"vertices":[50,56,49],"normals":[null,null,null],"uv":[102,103,104]},{"vertices":[50,58,57],"normals":[null,null,null],"uv":[105,106,107]},{"vertices":[52,58,51],"normals":[null,null,null],"uv":[108,109,110]},{"vertices":[54,60,53],"normals":[null,null,null],"uv":[111,112,95]},{"vertices":[55,61,54],"normals":[null,null,null],"uv":[113,114,115]},{"vertices":[49,62,55],"normals":[null,null,null],"uv":[116,117,118]},{"vertices":[253,21,27],"normals":[null,null,null],"uv":[90,119,91]},{"vertices":[0,228,6],"normals":[null,null,null],"uv":[120,121,122]},{"vertices":[58,66,65],"normals":[null,null,null],"uv":[109,123,124]},{"vertices":[61,67,60],"normals":[null,null,null],"uv":[125,126,112]},{"vertices":[70,240,76],"normals":[null,null,null],"uv":[127,128,129]},{"vertices":[64,70,63],"normals":[null,null,null],"uv":[130,131,132]},{"vertices":[64,72,71],"normals":[null,null,null],"uv":[133,134,135]},{"vertices":[66,72,65],"normals":[null,null,null],"uv":[136,137,138]},{"vertices":[68,74,67],"normals":[null,null,null],"uv":[139,140,126]},{"vertices":[69,75,68],"normals":[null,null,null],"uv":[141,142,143]},{"vertices":[63,76,69],"normals":[null,null,null],"uv":[144,145,146]},{"vertices":[58,227,57],"normals":[null,null,null],"uv":[147,0,2]},{"vertices":[30,234,29],"normals":[null,null,null],"uv":[148,149,150]},{"vertices":[73,79,72],"normals":[null,null,null],"uv":[151,152,137]},{"vertices":[75,81,74],"normals":[null,null,null],"uv":[153,154,140]},{"vertices":[252,63,69],"normals":[null,null,null],"uv":[155,156,157]},{"vertices":[68,252,69],"normals":[null,null,null],"uv":[158,155,157]},{"vertices":[77,85,84],"normals":[null,null,null],"uv":[159,160,161]},{"vertices":[79,85,78],"normals":[null,null,null],"uv":[162,163,164]},{"vertices":[79,87,86],"normals":[null,null,null],"uv":[152,165,166]},{"vertices":[81,89,88],"normals":[null,null,null],"uv":[167,168,169]},{"vertices":[82,90,89],"normals":[null,null,null],"uv":[170,171,172]},{"vertices":[77,90,83],"normals":[null,null,null],"uv":[173,174,175]},{"vertices":[85,91,84],"normals":[null,null,null],"uv":[176,177,178]},{"vertices":[86,92,85],"normals":[null,null,null],"uv":[179,180,163]},{"vertices":[87,93,86],"normals":[null,null,null],"uv":[181,182,183]},{"vertices":[89,95,88],"normals":[null,null,null],"uv":[168,184,169]},{"vertices":[90,96,89],"normals":[null,null,null],"uv":[185,186,187]},{"vertices":[90,91,97],"normals":[null,null,null],"uv":[188,189,190]},{"vertices":[20,251,19],"normals":[null,null,null],"uv":[191,192,193]},{"vertices":[93,101,100],"normals":[null,null,null],"uv":[182,194,195]},{"vertices":[107,11,18],"normals":[null,null,null],"uv":[196,197,198]},{"vertices":[95,103,102],"normals":[null,null,null],"uv":[184,199,200]},{"vertices":[34,222,33],"normals":[null,null,null],"uv":[201,202,203]},{"vertices":[99,0,98],"normals":[null,null,null],"uv":[204,205,206]},{"vertices":[99,2,1],"normals":[null,null,null],"uv":[207,208,209]},{"vertices":[101,2,100],"normals":[null,null,null],"uv":[210,5,211]},{"vertices":[102,5,4],"normals":[null,null,null],"uv":[200,212,213]},{"vertices":[104,5,103],"normals":[null,null,null],"uv":[214,215,216]},{"vertices":[98,6,104],"normals":[null,null,null],"uv":[217,218,219]},{"vertices":[208,114,115],"normals":[null,null,null],"uv":[220,221,222]},{"vertices":[67,113,60],"normals":[null,null,null],"uv":[223,224,225]},{"vertices":[110,32,39],"normals":[null,null,null],"uv":[226,227,228]},{"vertices":[119,95,102],"normals":[null,null,null],"uv":[229,230,231]},{"vertices":[108,18,25],"normals":[null,null,null],"uv":[232,198,233]},{"vertices":[111,39,46],"normals":[null,null,null],"uv":[234,228,235]},{"vertices":[116,74,81],"normals":[null,null,null],"uv":[236,237,238]},{"vertices":[117,133,88],"normals":[null,null,null],"uv":[239,240,241]},{"vertices":[118,88,95],"normals":[null,null,null],"uv":[242,243,244]},{"vertices":[74,114,67],"normals":[null,null,null],"uv":[237,245,223]},{"vertices":[106,4,11],"normals":[null,null,null],"uv":[246,247,197]},{"vertices":[112,46,53],"normals":[null,null,null],"uv":[248,235,249]},{"vertices":[102,131,119],"normals":[null,null,null],"uv":[250,251,252]},{"vertices":[123,120,121],"normals":[null,null,null],"uv":[253,254,255]},{"vertices":[113,121,60],"normals":[null,null,null],"uv":[256,257,258]},{"vertices":[53,122,112],"normals":[null,null,null],"uv":[259,260,261]},{"vertices":[60,120,53],"normals":[null,null,null],"uv":[262,263,264]},{"vertices":[127,124,125],"normals":[null,null,null],"uv":[265,266,267]},{"vertices":[32,124,25],"normals":[null,null,null],"uv":[268,269,270]},{"vertices":[25,126,108],"normals":[null,null,null],"uv":[271,272,273]},{"vertices":[109,125,32],"normals":[null,null,null],"uv":[274,275,276]},{"vertices":[130,129,128],"normals":[null,null,null],"uv":[277,278,279]},{"vertices":[105,128,4],"normals":[null,null,null],"uv":[280,281,282]},{"vertices":[4,129,102],"normals":[null,null,null],"uv":[283,284,285]},{"vertices":[135,132,133],"normals":[null,null,null],"uv":[286,287,288]},{"vertices":[88,132,81],"normals":[null,null,null],"uv":[289,290,291]},{"vertices":[81,134,116],"normals":[null,null,null],"uv":[292,293,294]},{"vertices":[149,31,24],"normals":[null,null,null],"uv":[295,296,297]},{"vertices":[338,147,146],"normals":[null,null,null],"uv":[298,299,300]},{"vertices":[147,159,94],"normals":[null,null,null],"uv":[301,302,303]},{"vertices":[160,148,101],"normals":[null,null,null],"uv":[304,305,306]},{"vertices":[136,167,142],"normals":[null,null,null],"uv":[307,308,309]},{"vertices":[162,149,24],"normals":[null,null,null],"uv":[310,311,312]},{"vertices":[10,137,17],"normals":[null,null,null],"uv":[313,314,315]},{"vertices":[146,94,87],"normals":[null,null,null],"uv":[316,317,318]},{"vertices":[148,3,101],"normals":[null,null,null],"uv":[319,320,321]},{"vertices":[140,66,59],"normals":[null,null,null],"uv":[322,323,324]},{"vertices":[80,156,87],"normals":[null,null,null],"uv":[325,326,327]},{"vertices":[73,145,80],"normals":[null,null,null],"uv":[328,329,330]},{"vertices":[45,144,52],"normals":[null,null,null],"uv":[331,332,333]},{"vertices":[152,139,38],"normals":[null,null,null],"uv":[334,335,336]},{"vertices":[138,151,31],"normals":[null,null,null],"uv":[337,338,339]},{"vertices":[38,143,45],"normals":[null,null,null],"uv":[340,341,342]},{"vertices":[165,179,151],"normals":[null,null,null],"uv":[343,344,345]},{"vertices":[180,166,152],"normals":[null,null,null],"uv":[346,347,334]},{"vertices":[151,180,152],"normals":[null,null,null],"uv":[348,349,350]},{"vertices":[178,205,177],"normals":[null,null,null],"uv":[351,352,353]},{"vertices":[171,185,157],"normals":[null,null,null],"uv":[354,355,356]},{"vertices":[204,175,176],"normals":[null,null,null],"uv":[357,358,359]},{"vertices":[186,172,158],"normals":[null,null,null],"uv":[360,361,362]},{"vertices":[170,145,146],"normals":[null,null,null],"uv":[363,364,365]},{"vertices":[52,158,59],"normals":[null,null,null],"uv":[366,367,368]},{"vertices":[151,38,31],"normals":[null,null,null],"uv":[369,370,371]},{"vertices":[156,146,87],"normals":[null,null,null],"uv":[372,373,374]},{"vertices":[172,144,140],"normals":[null,null,null],"uv":[375,376,377]},{"vertices":[145,155,80],"normals":[null,null,null],"uv":[378,379,380]},{"vertices":[174,147,148],"normals":[null,null,null],"uv":[381,382,383]},{"vertices":[137,161,17],"normals":[null,null,null],"uv":[384,385,386]},{"vertices":[164,150,73],"normals":[null,null,null],"uv":[387,388,389]},{"vertices":[159,101,94],"normals":[null,null,null],"uv":[390,391,392]},{"vertices":[141,163,66],"normals":[null,null,null],"uv":[393,394,395]},{"vertices":[161,24,17],"normals":[null,null,null],"uv":[396,397,398]},{"vertices":[154,136,10],"normals":[null,null,null],"uv":[399,400,401]},{"vertices":[142,153,3],"normals":[null,null,null],"uv":[402,403,404]},{"vertices":[66,164,73],"normals":[null,null,null],"uv":[405,406,407]},{"vertices":[149,175,137],"normals":[null,null,null],"uv":[408,409,410]},{"vertices":[158,140,59],"normals":[null,null,null],"uv":[411,412,413]},{"vertices":[178,141,150],"normals":[null,null,null],"uv":[414,415,416]},{"vertices":[153,10,3],"normals":[null,null,null],"uv":[417,418,419]},{"vertices":[144,157,52],"normals":[null,null,null],"uv":[420,356,421]},{"vertices":[139,165,138],"normals":[null,null,null],"uv":[422,423,424]},{"vertices":[187,202,188],"normals":[null,null,null],"uv":[425,426,427]},{"vertices":[197,184,183],"normals":[null,null,null],"uv":[428,429,430]},{"vertices":[203,190,189],"normals":[null,null,null],"uv":[431,432,433]},{"vertices":[205,192,191],"normals":[null,null,null],"uv":[434,435,436]},{"vertices":[185,200,186],"normals":[null,null,null],"uv":[437,438,439]},{"vertices":[179,194,180],"normals":[null,null,null],"uv":[440,441,349]},{"vertices":[195,182,181],"normals":[null,null,null],"uv":[442,443,444]},{"vertices":[153,182,154],"normals":[null,null,null],"uv":[445,443,446]},{"vertices":[190,176,162],"normals":[null,null,null],"uv":[447,448,449]},{"vertices":[183,156,155],"normals":[null,null,null],"uv":[430,450,451]},{"vertices":[188,174,160],"normals":[null,null,null],"uv":[452,453,304]},{"vertices":[185,158,157],"normals":[null,null,null],"uv":[437,454,455]},{"vertices":[173,187,159],"normals":[null,null,null],"uv":[456,457,302]},{"vertices":[187,160,159],"normals":[null,null,null],"uv":[458,459,460]},{"vertices":[184,170,156],"normals":[null,null,null],"uv":[461,462,372]},{"vertices":[161,190,162],"normals":[null,null,null],"uv":[463,432,464]},{"vertices":[169,183,155],"normals":[null,null,null],"uv":[465,466,467]},{"vertices":[191,164,163],"normals":[null,null,null],"uv":[436,468,469]},{"vertices":[175,189,161],"normals":[null,null,null],"uv":[470,471,472]},{"vertices":[194,165,166],"normals":[null,null,null],"uv":[473,474,475]},{"vertices":[192,178,164],"normals":[null,null,null],"uv":[476,477,478]},{"vertices":[196,167,168],"normals":[null,null,null],"uv":[479,480,481]},{"vertices":[177,191,163],"normals":[null,null,null],"uv":[482,483,484]},{"vertices":[170,197,169],"normals":[null,null,null],"uv":[485,486,487]},{"vertices":[182,168,154],"normals":[null,null,null],"uv":[488,489,490]},{"vertices":[172,199,171],"normals":[null,null,null],"uv":[491,492,493]},{"vertices":[167,181,153],"normals":[null,null,null],"uv":[494,495,403]},{"vertices":[202,173,174],"normals":[null,null,null],"uv":[496,497,498]},{"vertices":[208,306,210],"normals":[null,null,null],"uv":[499,500,501]},{"vertices":[212,110,111],"normals":[null,null,null],"uv":[502,503,504]},{"vertices":[131,118,119],"normals":[null,null,null],"uv":[505,506,507]},{"vertices":[209,106,107],"normals":[null,null,null],"uv":[508,509,510]},{"vertices":[114,123,113],"normals":[null,null,null],"uv":[511,512,513]},{"vertices":[110,127,109],"normals":[null,null,null],"uv":[514,515,516]},{"vertices":[118,135,117],"normals":[null,null,null],"uv":[517,518,519]},{"vertices":[106,130,105],"normals":[null,null,null],"uv":[520,521,522]},{"vertices":[134,115,116],"normals":[null,null,null],"uv":[523,524,525]},{"vertices":[122,111,112],"normals":[null,null,null],"uv":[526,527,528]},{"vertices":[126,107,108],"normals":[null,null,null],"uv":[529,530,531]},{"vertices":[293,216,252],"normals":[null,null,null],"uv":[532,533,155]},{"vertices":[2,221,236],"normals":[null,null,null],"uv":[534,535,536]},{"vertices":[5,229,12],"normals":[null,null,null],"uv":[537,538,539]},{"vertices":[233,264,222],"normals":[null,null,null],"uv":[540,541,202]},{"vertices":[228,271,229],"normals":[null,null,null],"uv":[542,543,544]},{"vertices":[16,215,247],"normals":[null,null,null],"uv":[545,546,547]},{"vertices":[19,253,26],"normals":[null,null,null],"uv":[548,549,550]},{"vertices":[240,285,244],"normals":[null,null,null],"uv":[551,552,553]},{"vertices":[263,236,221],"normals":[null,null,null],"uv":[554,555,556]},{"vertices":[30,219,234],"normals":[null,null,null],"uv":[557,558,559]},{"vertices":[222,40,33],"normals":[null,null,null],"uv":[560,561,562]},{"vertices":[269,226,227],"normals":[null,null,null],"uv":[563,564,0]},{"vertices":[250,292,251],"normals":[null,null,null],"uv":[565,566,192]},{"vertices":[242,51,246],"normals":[null,null,null],"uv":[567,568,569]},{"vertices":[231,54,47],"normals":[null,null,null],"uv":[570,571,572]},{"vertices":[219,275,234],"normals":[null,null,null],"uv":[573,574,575]},{"vertices":[224,267,225],"normals":[null,null,null],"uv":[576,577,62]},{"vertices":[227,65,217],"normals":[null,null,null],"uv":[578,579,580]},{"vertices":[254,68,61],"normals":[null,null,null],"uv":[581,582,583]},{"vertices":[290,249,248],"normals":[null,null,null],"uv":[584,585,586]},{"vertices":[264,223,222],"normals":[null,null,null],"uv":[587,588,589]},{"vertices":[237,79,238],"normals":[null,null,null],"uv":[590,591,592]},{"vertices":[240,82,75],"normals":[null,null,null],"uv":[593,594,595]},{"vertices":[273,245,232],"normals":[null,null,null],"uv":[596,597,598]},{"vertices":[297,255,230],"normals":[null,null,null],"uv":[599,600,601]},{"vertices":[93,230,255],"normals":[null,null,null],"uv":[602,603,604]},{"vertices":[96,248,103],"normals":[null,null,null],"uv":[605,606,607]},{"vertices":[226,295,254],"normals":[null,null,null],"uv":[564,608,36]},{"vertices":[76,240,75],"normals":[null,null,null],"uv":[609,610,611]},{"vertices":[93,255,92],"normals":[null,null,null],"uv":[612,613,614]},{"vertices":[21,215,22],"normals":[null,null,null],"uv":[119,615,616]},{"vertices":[6,228,5],"normals":[null,null,null],"uv":[122,121,617]},{"vertices":[62,254,61],"normals":[null,null,null],"uv":[37,36,618]},{"vertices":[244,77,83],"normals":[null,null,null],"uv":[619,58,620]},{"vertices":[99,230,100],"normals":[null,null,null],"uv":[88,87,621]},{"vertices":[78,238,79],"normals":[null,null,null],"uv":[60,59,622]},{"vertices":[63,217,64],"normals":[null,null,null],"uv":[623,97,96]},{"vertices":[40,223,41],"normals":[null,null,null],"uv":[624,625,626]},{"vertices":[247,14,15],"normals":[null,null,null],"uv":[627,628,629]},{"vertices":[8,221,9],"normals":[null,null,null],"uv":[630,631,632]},{"vertices":[234,28,29],"normals":[null,null,null],"uv":[149,633,150]},{"vertices":[255,91,92],"normals":[null,null,null],"uv":[634,635,636]},{"vertices":[49,246,50],"normals":[null,null,null],"uv":[637,27,26]},{"vertices":[97,225,96],"normals":[null,null,null],"uv":[63,62,638]},{"vertices":[16,247,15],"normals":[null,null,null],"uv":[639,627,629]},{"vertices":[2,236,1],"normals":[null,null,null],"uv":[640,641,642]},{"vertices":[103,248,104],"normals":[null,null,null],"uv":[643,586,644]},{"vertices":[28,222,34],"normals":[null,null,null],"uv":[633,202,201]},{"vertices":[223,35,41],"normals":[null,null,null],"uv":[625,645,626]},{"vertices":[54,232,55],"normals":[null,null,null],"uv":[646,598,647]},{"vertices":[42,231,48],"normals":[null,null,null],"uv":[39,648,649]},{"vertices":[35,219,36],"normals":[null,null,null],"uv":[645,100,99]},{"vertices":[248,98,104],"normals":[null,null,null],"uv":[586,86,644]},{"vertices":[236,0,1],"normals":[null,null,null],"uv":[641,120,642]},{"vertices":[48,231,47],"normals":[null,null,null],"uv":[649,648,650]},{"vertices":[12,229,13],"normals":[null,null,null],"uv":[651,652,653]},{"vertices":[237,70,71],"normals":[null,null,null],"uv":[654,127,655]},{"vertices":[22,215,23],"normals":[null,null,null],"uv":[616,615,656]},{"vertices":[44,242,43],"normals":[null,null,null],"uv":[657,38,40]},{"vertices":[72,237,71],"normals":[null,null,null],"uv":[658,654,655]},{"vertices":[229,7,13],"normals":[null,null,null],"uv":[652,659,653]},{"vertices":[14,251,20],"normals":[null,null,null],"uv":[660,192,191]},{"vertices":[232,49,55],"normals":[null,null,null],"uv":[598,637,647]},{"vertices":[7,221,8],"normals":[null,null,null],"uv":[659,631,630]},{"vertices":[277,262,276],"normals":[null,null,null],"uv":[661,662,663]},{"vertices":[276,271,270],"normals":[null,null,null],"uv":[664,665,666]},{"vertices":[288,256,291],"normals":[null,null,null],"uv":[667,668,669]},{"vertices":[291,294,292],"normals":[null,null,null],"uv":[670,671,672]},{"vertices":[274,261,260],"normals":[null,null,null],"uv":[673,674,675]},{"vertices":[274,265,264],"normals":[null,null,null],"uv":[676,677,678]},{"vertices":[283,286,282],"normals":[null,null,null],"uv":[679,680,681]},{"vertices":[282,273,272],"normals":[null,null,null],"uv":[682,683,684]},{"vertices":[268,259,258],"normals":[null,null,null],"uv":[685,686,687]},{"vertices":[268,293,295],"normals":[null,null,null],"uv":[688,689,690]},{"vertices":[278,284,280],"normals":[null,null,null],"uv":[691,692,693]},{"vertices":[280,285,281],"normals":[null,null,null],"uv":[694,695,696]},{"vertices":[296,289,266],"normals":[null,null,null],"uv":[697,698,699]},{"vertices":[267,289,290],"normals":[null,null,null],"uv":[700,701,702]},{"vertices":[272,232,231],"normals":[null,null,null],"uv":[703,704,705]},{"vertices":[294,214,253],"normals":[null,null,null],"uv":[706,707,90]},{"vertices":[278,239,237],"normals":[null,null,null],"uv":[708,709,654]},{"vertices":[275,233,234],"normals":[null,null,null],"uv":[710,540,149]},{"vertices":[251,294,253],"normals":[null,null,null],"uv":[711,712,713]},{"vertices":[277,235,236],"normals":[null,null,null],"uv":[714,715,641]},{"vertices":[265,218,223],"normals":[null,null,null],"uv":[716,717,625]},{"vertices":[238,278,237],"normals":[null,null,null],"uv":[718,719,720]},{"vertices":[235,270,228],"normals":[null,null,null],"uv":[715,721,121]},{"vertices":[295,252,254],"normals":[null,null,null],"uv":[722,723,724]},{"vertices":[239,281,240],"normals":[null,null,null],"uv":[725,726,727]},{"vertices":[271,220,229],"normals":[null,null,null],"uv":[728,729,652]},{"vertices":[283,241,242],"normals":[null,null,null],"uv":[730,731,38]},{"vertices":[246,283,242],"normals":[null,null,null],"uv":[732,733,734]},{"vertices":[214,257,215],"normals":[null,null,null],"uv":[707,735,615]},{"vertices":[249,297,230],"normals":[null,null,null],"uv":[585,736,87]},{"vertices":[285,243,244],"normals":[null,null,null],"uv":[737,738,619]},{"vertices":[296,224,255],"normals":[null,null,null],"uv":[739,576,740]},{"vertices":[216,259,217],"normals":[null,null,null],"uv":[741,742,97]},{"vertices":[243,279,238],"normals":[null,null,null],"uv":[738,743,59]},{"vertices":[245,287,246],"normals":[null,null,null],"uv":[597,744,27]},{"vertices":[225,290,248],"normals":[null,null,null],"uv":[745,746,747]},{"vertices":[218,261,219],"normals":[null,null,null],"uv":[717,748,100]},{"vertices":[217,269,227],"normals":[null,null,null],"uv":[749,750,751]},{"vertices":[288,250,247],"normals":[null,null,null],"uv":[752,565,753]},{"vertices":[257,247,215],"normals":[null,null,null],"uv":[754,755,756]},{"vertices":[241,272,231],"normals":[null,null,null],"uv":[731,757,648]},{"vertices":[220,263,221],"normals":[null,null,null],"uv":[729,758,631]},{"vertices":[313,309,298],"normals":[null,null,null],"uv":[759,760,761]},{"vertices":[306,123,210],"normals":[null,null,null],"uv":[500,762,501]},{"vertices":[300,209,126],"normals":[null,null,null],"uv":[763,764,765]},{"vertices":[309,211,212],"normals":[null,null,null],"uv":[766,767,768]},{"vertices":[310,130,213],"normals":[null,null,null],"uv":[769,770,771]},{"vertices":[311,213,209],"normals":[null,null,null],"uv":[772,771,764]},{"vertices":[299,122,123],"normals":[null,null,null],"uv":[773,774,775]},{"vertices":[134,307,208],"normals":[null,null,null],"uv":[776,777,499]},{"vertices":[312,135,207],"normals":[null,null,null],"uv":[778,779,780]},{"vertices":[127,300,126],"normals":[null,null,null],"uv":[781,782,783]},{"vertices":[308,127,211],"normals":[null,null,null],"uv":[784,781,767]},{"vertices":[302,131,130],"normals":[null,null,null],"uv":[785,786,770]},{"vertices":[135,304,134],"normals":[null,null,null],"uv":[779,787,776]},{"vertices":[131,312,207],"normals":[null,null,null],"uv":[786,788,789]},{"vertices":[122,309,212],"normals":[null,null,null],"uv":[774,766,768]},{"vertices":[325,377,317],"normals":[null,null,null],"uv":[790,791,792]},{"vertices":[326,310,311],"normals":[null,null,null],"uv":[793,794,795]},{"vertices":[315,311,300],"normals":[null,null,null],"uv":[796,797,798]},{"vertices":[312,320,305],"normals":[null,null,null],"uv":[799,800,801]},{"vertices":[314,298,299],"normals":[null,null,null],"uv":[802,803,804]},{"vertices":[310,317,302],"normals":[null,null,null],"uv":[805,806,807]},{"vertices":[316,300,301],"normals":[null,null,null],"uv":[808,809,810]},{"vertices":[319,307,304],"normals":[null,null,null],"uv":[811,812,813]},{"vertices":[317,303,302],"normals":[null,null,null],"uv":[814,815,816]},{"vertices":[308,316,301],"normals":[null,null,null],"uv":[817,818,819]},{"vertices":[320,304,305],"normals":[null,null,null],"uv":[820,821,822]},{"vertices":[318,312,303],"normals":[null,null,null],"uv":[823,824,825]},{"vertices":[322,306,307],"normals":[null,null,null],"uv":[826,827,828]},{"vertices":[306,314,299],"normals":[null,null,null],"uv":[829,830,831]},{"vertices":[324,308,309],"normals":[null,null,null],"uv":[832,833,834]},{"vertices":[352,338,337],"normals":[null,null,null],"uv":[835,836,837]},{"vertices":[332,141,140],"normals":[null,null,null],"uv":[838,839,840]},{"vertices":[340,142,148],"normals":[null,null,null],"uv":[841,842,843]},{"vertices":[334,136,142],"normals":[null,null,null],"uv":[844,845,842]},{"vertices":[150,337,145],"normals":[null,null,null],"uv":[846,847,848]},{"vertices":[335,144,143],"normals":[null,null,null],"uv":[849,850,851]},{"vertices":[329,149,137],"normals":[null,null,null],"uv":[852,853,854]},{"vertices":[337,146,145],"normals":[null,null,null],"uv":[847,300,848]},{"vertices":[333,150,141],"normals":[null,null,null],"uv":[855,846,839]},{"vertices":[336,140,144],"normals":[null,null,null],"uv":[856,840,850]},{"vertices":[139,335,143],"normals":[null,null,null],"uv":[857,849,851]},{"vertices":[339,148,147],"normals":[null,null,null],"uv":[858,843,299]},{"vertices":[328,137,136],"normals":[null,null,null],"uv":[859,854,845]},{"vertices":[149,330,138],"normals":[null,null,null],"uv":[853,860,861]},{"vertices":[330,139,138],"normals":[null,null,null],"uv":[860,857,861]},{"vertices":[348,342,333],"normals":[null,null,null],"uv":[862,863,864]},{"vertices":[351,332,336],"normals":[null,null,null],"uv":[865,866,867]},{"vertices":[346,335,331],"normals":[null,null,null],"uv":[868,869,870]},{"vertices":[354,340,339],"normals":[null,null,null],"uv":[871,872,873]},{"vertices":[343,329,328],"normals":[null,null,null],"uv":[874,875,876]},{"vertices":[356,330,341],"normals":[null,null,null],"uv":[877,878,879]},{"vertices":[345,331,330],"normals":[null,null,null],"uv":[880,881,882]},{"vertices":[353,339,338],"normals":[null,null,null],"uv":[883,884,885]},{"vertices":[347,333,332],"normals":[null,null,null],"uv":[886,887,888]},{"vertices":[355,334,340],"normals":[null,null,null],"uv":[889,890,891]},{"vertices":[349,328,334],"normals":[null,null,null],"uv":[892,893,894]},{"vertices":[357,337,342],"normals":[null,null,null],"uv":[895,896,897]},{"vertices":[350,336,335],"normals":[null,null,null],"uv":[898,899,900]},{"vertices":[344,341,329],"normals":[null,null,null],"uv":[901,902,903]},{"vertices":[390,386,375],"normals":[null,null,null],"uv":[904,905,906]},{"vertices":[376,315,316],"normals":[null,null,null],"uv":[907,908,909]},{"vertices":[379,322,319],"normals":[null,null,null],"uv":[910,911,912]},{"vertices":[377,318,317],"normals":[null,null,null],"uv":[791,913,792]},{"vertices":[323,376,316],"normals":[null,null,null],"uv":[914,915,916]},{"vertices":[320,379,319],"normals":[null,null,null],"uv":[917,918,919]},{"vertices":[378,327,318],"normals":[null,null,null],"uv":[920,921,922]},{"vertices":[382,321,322],"normals":[null,null,null],"uv":[923,924,925]},{"vertices":[321,374,314],"normals":[null,null,null],"uv":[926,927,928]},{"vertices":[384,323,324],"normals":[null,null,null],"uv":[929,930,931]},{"vertices":[373,324,313],"normals":[null,null,null],"uv":[932,933,934]},{"vertices":[326,385,325],"normals":[null,null,null],"uv":[935,936,937]},{"vertices":[375,326,315],"normals":[null,null,null],"uv":[938,939,940]},{"vertices":[327,380,320],"normals":[null,null,null],"uv":[941,942,917]},{"vertices":[374,313,314],"normals":[null,null,null],"uv":[943,934,944]},{"vertices":[413,391,398],"normals":[null,null,null],"uv":[945,946,947]},{"vertices":[402,380,387],"normals":[null,null,null],"uv":[948,949,950]},{"vertices":[389,373,374],"normals":[null,null,null],"uv":[951,952,953]},{"vertices":[400,377,385],"normals":[null,null,null],"uv":[954,955,956]},{"vertices":[376,390,375],"normals":[null,null,null],"uv":[957,958,959]},{"vertices":[379,397,382],"normals":[null,null,null],"uv":[960,961,962]},{"vertices":[392,378,377],"normals":[null,null,null],"uv":[963,964,965]},{"vertices":[398,376,383],"normals":[null,null,null],"uv":[966,967,968]},{"vertices":[395,379,380],"normals":[null,null,null],"uv":[969,970,949]},{"vertices":[378,402,387],"normals":[null,null,null],"uv":[971,972,973]},{"vertices":[382,396,381],"normals":[null,null,null],"uv":[962,974,975]},{"vertices":[396,374,381],"normals":[null,null,null],"uv":[976,977,978]},{"vertices":[399,383,384],"normals":[null,null,null],"uv":[979,980,981]},{"vertices":[373,399,384],"normals":[null,null,null],"uv":[982,983,984]},{"vertices":[386,400,385],"normals":[null,null,null],"uv":[985,954,956]},{"vertices":[414,407,417],"normals":[null,null,null],"uv":[986,987,988]},{"vertices":[410,394,395],"normals":[null,null,null],"uv":[989,990,991]},{"vertices":[393,417,402],"normals":[null,null,null],"uv":[992,993,994]},{"vertices":[412,396,397],"normals":[null,null,null],"uv":[995,996,997]},{"vertices":[411,389,396],"normals":[null,null,null],"uv":[998,999,1000]},{"vertices":[414,398,399],"normals":[null,null,null],"uv":[1001,1002,1003]},{"vertices":[388,414,399],"normals":[null,null,null],"uv":[1004,1005,1006]},{"vertices":[416,400,401],"normals":[null,null,null],"uv":[1007,1008,1009]},{"vertices":[405,401,390],"normals":[null,null,null],"uv":[1010,1011,1012]},{"vertices":[417,395,402],"normals":[null,null,null],"uv":[1013,1014,1015]},{"vertices":[404,388,389],"normals":[null,null,null],"uv":[1016,1017,1018]},{"vertices":[415,392,400],"normals":[null,null,null],"uv":[1019,1020,1021]},{"vertices":[391,405,390],"normals":[null,null,null],"uv":[1022,1023,1024]},{"vertices":[394,412,397],"normals":[null,null,null],"uv":[1025,1026,1027]},{"vertices":[407,393,392],"normals":[null,null,null],"uv":[1028,1029,1030]},{"vertices":[227,226,56],"normals":[null,null,null],"uv":[0,564,1]},{"vertices":[3,10,9],"normals":[null,null,null],"uv":[3,1031,4]},{"vertices":[5,12,11],"normals":[null,null,null],"uv":[6,18,7]},{"vertices":[8,15,14],"normals":[null,null,null],"uv":[9,1032,10]},{"vertices":[9,16,15],"normals":[null,null,null],"uv":[12,1033,13]},{"vertices":[10,17,16],"normals":[null,null,null],"uv":[15,1034,16]},{"vertices":[12,19,18],"normals":[null,null,null],"uv":[18,34,19]},{"vertices":[12,13,20],"normals":[null,null,null],"uv":[20,1035,21]},{"vertices":[7,14,20],"normals":[null,null,null],"uv":[23,1036,24]},{"vertices":[16,17,24],"normals":[null,null,null],"uv":[16,1034,32]},{"vertices":[19,26,25],"normals":[null,null,null],"uv":[34,50,35]},{"vertices":[56,226,254],"normals":[null,null,null],"uv":[1,564,36]},{"vertices":[242,241,42],"normals":[null,null,null],"uv":[38,731,39]},{"vertices":[22,29,28],"normals":[null,null,null],"uv":[41,1037,42]},{"vertices":[23,30,29],"normals":[null,null,null],"uv":[44,1038,45]},{"vertices":[24,31,30],"normals":[null,null,null],"uv":[47,64,48]},{"vertices":[26,33,32],"normals":[null,null,null],"uv":[50,66,51]},{"vertices":[27,34,33],"normals":[null,null,null],"uv":[52,1039,53]},{"vertices":[21,28,34],"normals":[null,null,null],"uv":[55,1040,56]},{"vertices":[77,243,238],"normals":[null,null,null],"uv":[58,738,59]},{"vertices":[91,224,225],"normals":[null,null,null],"uv":[61,576,62]},{"vertices":[31,38,37],"normals":[null,null,null],"uv":[64,1041,65]},{"vertices":[33,40,39],"normals":[null,null,null],"uv":[66,1042,67]},{"vertices":[36,43,42],"normals":[null,null,null],"uv":[68,1043,69]},{"vertices":[37,44,43],"normals":[null,null,null],"uv":[71,1044,72]},{"vertices":[38,45,44],"normals":[null,null,null],"uv":[74,92,75]},{"vertices":[40,47,46],"normals":[null,null,null],"uv":[77,94,78]},{"vertices":[41,48,47],"normals":[null,null,null],"uv":[80,1045,81]},{"vertices":[35,42,48],"normals":[null,null,null],"uv":[83,1046,84]},{"vertices":[98,249,230],"normals":[null,null,null],"uv":[86,585,87]},{"vertices":[45,52,51],"normals":[null,null,null],"uv":[92,1047,93]},{"vertices":[47,54,53],"normals":[null,null,null],"uv":[94,111,95]},{"vertices":[50,57,56],"normals":[null,null,null],"uv":[102,1048,103]},{"vertices":[50,51,58],"normals":[null,null,null],"uv":[105,1049,106]},{"vertices":[52,59,58],"normals":[null,null,null],"uv":[108,1050,109]},{"vertices":[54,61,60],"normals":[null,null,null],"uv":[111,125,112]},{"vertices":[55,62,61],"normals":[null,null,null],"uv":[113,1051,114]},{"vertices":[49,56,62],"normals":[null,null,null],"uv":[116,1052,117]},{"vertices":[253,214,21],"normals":[null,null,null],"uv":[90,707,119]},{"vertices":[0,235,228],"normals":[null,null,null],"uv":[120,715,121]},{"vertices":[58,59,66],"normals":[null,null,null],"uv":[109,1050,123]},{"vertices":[61,68,67],"normals":[null,null,null],"uv":[125,139,126]},{"vertices":[70,239,240],"normals":[null,null,null],"uv":[127,709,128]},{"vertices":[64,71,70],"normals":[null,null,null],"uv":[130,1053,131]},{"vertices":[64,65,72],"normals":[null,null,null],"uv":[133,1054,134]},{"vertices":[66,73,72],"normals":[null,null,null],"uv":[136,151,137]},{"vertices":[68,75,74],"normals":[null,null,null],"uv":[139,153,140]},{"vertices":[69,76,75],"normals":[null,null,null],"uv":[141,1055,142]},{"vertices":[63,70,76],"normals":[null,null,null],"uv":[144,1056,145]},{"vertices":[73,80,79],"normals":[null,null,null],"uv":[151,1057,152]},{"vertices":[75,82,81],"normals":[null,null,null],"uv":[153,1058,154]},{"vertices":[252,216,63],"normals":[null,null,null],"uv":[155,533,156]},{"vertices":[77,78,85],"normals":[null,null,null],"uv":[159,1059,160]},{"vertices":[79,86,85],"normals":[null,null,null],"uv":[162,179,163]},{"vertices":[79,80,87],"normals":[null,null,null],"uv":[152,1057,165]},{"vertices":[81,82,89],"normals":[null,null,null],"uv":[167,1060,168]},{"vertices":[82,83,90],"normals":[null,null,null],"uv":[170,1061,171]},{"vertices":[77,84,90],"normals":[null,null,null],"uv":[173,1062,174]},{"vertices":[85,92,91],"normals":[null,null,null],"uv":[176,1063,177]},{"vertices":[86,93,92],"normals":[null,null,null],"uv":[179,1064,180]},{"vertices":[87,94,93],"normals":[null,null,null],"uv":[181,1065,182]},{"vertices":[89,96,95],"normals":[null,null,null],"uv":[168,1066,184]},{"vertices":[90,97,96],"normals":[null,null,null],"uv":[185,1067,186]},{"vertices":[90,84,91],"normals":[null,null,null],"uv":[188,1068,189]},{"vertices":[93,94,101],"normals":[null,null,null],"uv":[182,1065,194]},{"vertices":[107,106,11],"normals":[null,null,null],"uv":[196,246,197]},{"vertices":[95,96,103],"normals":[null,null,null],"uv":[184,1066,199]},{"vertices":[99,1,0],"normals":[null,null,null],"uv":[204,1069,205]},{"vertices":[99,100,2],"normals":[null,null,null],"uv":[207,1070,208]},{"vertices":[101,3,2],"normals":[null,null,null],"uv":[210,3,5]},{"vertices":[102,103,5],"normals":[null,null,null],"uv":[200,199,212]},{"vertices":[104,6,5],"normals":[null,null,null],"uv":[214,1071,215]},{"vertices":[98,0,6],"normals":[null,null,null],"uv":[217,1072,218]},{"vertices":[208,210,114],"normals":[null,null,null],"uv":[220,1073,221]},{"vertices":[67,114,113],"normals":[null,null,null],"uv":[223,245,224]},{"vertices":[110,109,32],"normals":[null,null,null],"uv":[226,1074,227]},{"vertices":[119,118,95],"normals":[null,null,null],"uv":[229,1075,230]},{"vertices":[108,107,18],"normals":[null,null,null],"uv":[232,196,198]},{"vertices":[111,110,39],"normals":[null,null,null],"uv":[234,226,228]},{"vertices":[116,115,74],"normals":[null,null,null],"uv":[236,1076,237]},{"vertices":[117,135,133],"normals":[null,null,null],"uv":[239,1077,240]},{"vertices":[118,117,88],"normals":[null,null,null],"uv":[242,1078,243]},{"vertices":[74,115,114],"normals":[null,null,null],"uv":[237,1076,245]},{"vertices":[106,105,4],"normals":[null,null,null],"uv":[246,1079,247]},{"vertices":[112,111,46],"normals":[null,null,null],"uv":[248,234,235]},{"vertices":[102,129,131],"normals":[null,null,null],"uv":[250,1080,251]},{"vertices":[123,122,120],"normals":[null,null,null],"uv":[253,1081,254]},{"vertices":[113,123,121],"normals":[null,null,null],"uv":[256,1082,257]},{"vertices":[53,120,122],"normals":[null,null,null],"uv":[259,1083,260]},{"vertices":[60,121,120],"normals":[null,null,null],"uv":[262,1084,263]},{"vertices":[127,126,124],"normals":[null,null,null],"uv":[265,1085,266]},{"vertices":[32,125,124],"normals":[null,null,null],"uv":[268,1086,269]},{"vertices":[25,124,126],"normals":[null,null,null],"uv":[271,1087,272]},{"vertices":[109,127,125],"normals":[null,null,null],"uv":[274,1088,275]},{"vertices":[130,131,129],"normals":[null,null,null],"uv":[277,1089,278]},{"vertices":[105,130,128],"normals":[null,null,null],"uv":[280,1090,281]},{"vertices":[4,128,129],"normals":[null,null,null],"uv":[283,1091,284]},{"vertices":[135,134,132],"normals":[null,null,null],"uv":[286,1092,287]},{"vertices":[88,133,132],"normals":[null,null,null],"uv":[289,1093,290]},{"vertices":[81,132,134],"normals":[null,null,null],"uv":[292,1094,293]},{"vertices":[149,138,31],"normals":[null,null,null],"uv":[295,1095,296]},{"vertices":[338,339,147],"normals":[null,null,null],"uv":[298,858,299]},{"vertices":[147,173,159],"normals":[null,null,null],"uv":[301,456,302]},{"vertices":[160,174,148],"normals":[null,null,null],"uv":[304,453,305]},{"vertices":[136,168,167],"normals":[null,null,null],"uv":[307,1096,308]},{"vertices":[162,176,149],"normals":[null,null,null],"uv":[310,1097,311]},{"vertices":[10,136,137],"normals":[null,null,null],"uv":[313,1098,314]},{"vertices":[146,147,94],"normals":[null,null,null],"uv":[316,1099,317]},{"vertices":[148,142,3],"normals":[null,null,null],"uv":[319,1100,320]},{"vertices":[140,141,66],"normals":[null,null,null],"uv":[322,1101,323]},{"vertices":[80,155,156],"normals":[null,null,null],"uv":[325,1102,326]},{"vertices":[73,150,145],"normals":[null,null,null],"uv":[328,1103,329]},{"vertices":[45,143,144],"normals":[null,null,null],"uv":[331,1104,332]},{"vertices":[152,166,139],"normals":[null,null,null],"uv":[334,347,335]},{"vertices":[138,165,151],"normals":[null,null,null],"uv":[337,1105,338]},{"vertices":[38,139,143],"normals":[null,null,null],"uv":[340,1106,341]},{"vertices":[165,193,179],"normals":[null,null,null],"uv":[343,1107,344]},{"vertices":[180,194,166],"normals":[null,null,null],"uv":[346,1108,347]},{"vertices":[151,179,180],"normals":[null,null,null],"uv":[348,440,349]},{"vertices":[178,206,205],"normals":[null,null,null],"uv":[351,1109,352]},{"vertices":[171,199,185],"normals":[null,null,null],"uv":[354,1110,355]},{"vertices":[204,203,175],"normals":[null,null,null],"uv":[357,1111,358]},{"vertices":[186,200,172],"normals":[null,null,null],"uv":[360,1112,361]},{"vertices":[170,169,145],"normals":[null,null,null],"uv":[363,1113,364]},{"vertices":[52,157,158],"normals":[null,null,null],"uv":[366,1114,367]},{"vertices":[151,152,38],"normals":[null,null,null],"uv":[369,1115,370]},{"vertices":[156,170,146],"normals":[null,null,null],"uv":[372,462,373]},{"vertices":[172,171,144],"normals":[null,null,null],"uv":[375,1116,376]},{"vertices":[145,169,155],"normals":[null,null,null],"uv":[378,1117,379]},{"vertices":[174,173,147],"normals":[null,null,null],"uv":[381,1118,382]},{"vertices":[137,175,161],"normals":[null,null,null],"uv":[384,1119,385]},{"vertices":[164,178,150],"normals":[null,null,null],"uv":[387,1120,388]},{"vertices":[159,160,101],"normals":[null,null,null],"uv":[390,1121,391]},{"vertices":[141,177,163],"normals":[null,null,null],"uv":[393,1122,394]},{"vertices":[161,162,24],"normals":[null,null,null],"uv":[396,1123,397]},{"vertices":[154,168,136],"normals":[null,null,null],"uv":[399,1124,400]},{"vertices":[142,167,153],"normals":[null,null,null],"uv":[402,494,403]},{"vertices":[66,163,164],"normals":[null,null,null],"uv":[405,1125,406]},{"vertices":[149,176,175],"normals":[null,null,null],"uv":[408,1126,409]},{"vertices":[158,172,140],"normals":[null,null,null],"uv":[411,1127,412]},{"vertices":[178,177,141],"normals":[null,null,null],"uv":[414,1128,415]},{"vertices":[153,154,10],"normals":[null,null,null],"uv":[417,1129,418]},{"vertices":[144,171,157],"normals":[null,null,null],"uv":[420,354,356]},{"vertices":[139,166,165],"normals":[null,null,null],"uv":[422,1130,423]},{"vertices":[187,201,202],"normals":[null,null,null],"uv":[425,1131,426]},{"vertices":[197,198,184],"normals":[null,null,null],"uv":[428,1132,429]},{"vertices":[203,204,190],"normals":[null,null,null],"uv":[431,1133,432]},{"vertices":[205,206,192],"normals":[null,null,null],"uv":[434,1134,435]},{"vertices":[185,199,200],"normals":[null,null,null],"uv":[437,1135,438]},{"vertices":[179,193,194],"normals":[null,null,null],"uv":[440,1136,441]},{"vertices":[195,196,182],"normals":[null,null,null],"uv":[442,1137,443]},{"vertices":[153,181,182],"normals":[null,null,null],"uv":[445,444,443]},{"vertices":[190,204,176],"normals":[null,null,null],"uv":[447,1138,448]},{"vertices":[183,184,156],"normals":[null,null,null],"uv":[430,429,450]},{"vertices":[188,202,174],"normals":[null,null,null],"uv":[452,1139,453]},{"vertices":[185,186,158],"normals":[null,null,null],"uv":[437,439,454]},{"vertices":[173,201,187],"normals":[null,null,null],"uv":[456,1140,457]},{"vertices":[187,188,160],"normals":[null,null,null],"uv":[458,1141,459]},{"vertices":[184,198,170],"normals":[null,null,null],"uv":[461,1142,462]},{"vertices":[161,189,190],"normals":[null,null,null],"uv":[463,433,432]},{"vertices":[169,197,183],"normals":[null,null,null],"uv":[465,1143,466]},{"vertices":[191,192,164],"normals":[null,null,null],"uv":[436,435,468]},{"vertices":[175,203,189],"normals":[null,null,null],"uv":[470,1144,471]},{"vertices":[194,193,165],"normals":[null,null,null],"uv":[473,1145,474]},{"vertices":[192,206,178],"normals":[null,null,null],"uv":[476,1146,477]},{"vertices":[196,195,167],"normals":[null,null,null],"uv":[479,1147,480]},{"vertices":[177,205,191],"normals":[null,null,null],"uv":[482,1148,483]},{"vertices":[170,198,197],"normals":[null,null,null],"uv":[485,1149,486]},{"vertices":[182,196,168],"normals":[null,null,null],"uv":[488,1150,489]},{"vertices":[172,200,199],"normals":[null,null,null],"uv":[491,1151,492]},{"vertices":[167,195,181],"normals":[null,null,null],"uv":[494,1152,495]},{"vertices":[202,201,173],"normals":[null,null,null],"uv":[496,1153,497]},{"vertices":[208,307,306],"normals":[null,null,null],"uv":[499,777,500]},{"vertices":[212,211,110],"normals":[null,null,null],"uv":[502,1154,503]},{"vertices":[131,207,118],"normals":[null,null,null],"uv":[505,1155,506]},{"vertices":[209,213,106],"normals":[null,null,null],"uv":[508,1156,509]},{"vertices":[114,210,123],"normals":[null,null,null],"uv":[511,1157,512]},{"vertices":[110,211,127],"normals":[null,null,null],"uv":[514,1158,515]},{"vertices":[118,207,135],"normals":[null,null,null],"uv":[517,1159,518]},{"vertices":[106,213,130],"normals":[null,null,null],"uv":[520,1160,521]},{"vertices":[134,208,115],"normals":[null,null,null],"uv":[523,1161,524]},{"vertices":[122,212,111],"normals":[null,null,null],"uv":[526,1162,527]},{"vertices":[126,209,107],"normals":[null,null,null],"uv":[529,1163,530]},{"vertices":[293,258,216],"normals":[null,null,null],"uv":[532,1164,533]},{"vertices":[2,9,221],"normals":[null,null,null],"uv":[534,1165,535]},{"vertices":[5,228,229],"normals":[null,null,null],"uv":[537,1166,538]},{"vertices":[233,274,264],"normals":[null,null,null],"uv":[540,1167,541]},{"vertices":[228,270,271],"normals":[null,null,null],"uv":[542,1168,543]},{"vertices":[16,23,215],"normals":[null,null,null],"uv":[545,1169,546]},{"vertices":[19,251,253],"normals":[null,null,null],"uv":[548,1170,549]},{"vertices":[240,281,285],"normals":[null,null,null],"uv":[551,1171,552]},{"vertices":[263,277,236],"normals":[null,null,null],"uv":[554,1172,555]},{"vertices":[30,37,219],"normals":[null,null,null],"uv":[557,1173,558]},{"vertices":[222,223,40],"normals":[null,null,null],"uv":[560,1174,561]},{"vertices":[269,268,226],"normals":[null,null,null],"uv":[563,1175,564]},{"vertices":[250,291,292],"normals":[null,null,null],"uv":[565,1176,566]},{"vertices":[242,44,51],"normals":[null,null,null],"uv":[567,1177,568]},{"vertices":[231,232,54],"normals":[null,null,null],"uv":[570,1178,571]},{"vertices":[219,261,275],"normals":[null,null,null],"uv":[573,1179,574]},{"vertices":[224,266,267],"normals":[null,null,null],"uv":[576,1180,577]},{"vertices":[227,58,65],"normals":[null,null,null],"uv":[578,1181,579]},{"vertices":[254,252,68],"normals":[null,null,null],"uv":[581,1182,582]},{"vertices":[290,289,249],"normals":[null,null,null],"uv":[584,1183,585]},{"vertices":[264,265,223],"normals":[null,null,null],"uv":[587,1184,588]},{"vertices":[237,72,79],"normals":[null,null,null],"uv":[590,1185,591]},{"vertices":[240,244,82],"normals":[null,null,null],"uv":[593,1186,594]},{"vertices":[273,286,245],"normals":[null,null,null],"uv":[596,1187,597]},{"vertices":[297,296,255],"normals":[null,null,null],"uv":[599,1188,600]},{"vertices":[93,100,230],"normals":[null,null,null],"uv":[602,1189,603]},{"vertices":[96,225,248],"normals":[null,null,null],"uv":[605,1190,606]},{"vertices":[226,268,295],"normals":[null,null,null],"uv":[564,1175,608]},{"vertices":[21,214,215],"normals":[null,null,null],"uv":[119,707,615]},{"vertices":[244,243,77],"normals":[null,null,null],"uv":[619,738,58]},{"vertices":[63,216,217],"normals":[null,null,null],"uv":[623,741,97]},{"vertices":[247,250,14],"normals":[null,null,null],"uv":[627,1191,628]},{"vertices":[234,233,28],"normals":[null,null,null],"uv":[149,540,633]},{"vertices":[255,224,91],"normals":[null,null,null],"uv":[634,1192,635]},{"vertices":[49,245,246],"normals":[null,null,null],"uv":[637,597,27]},{"vertices":[28,233,222],"normals":[null,null,null],"uv":[633,540,202]},{"vertices":[223,218,35],"normals":[null,null,null],"uv":[625,717,645]},{"vertices":[42,241,231],"normals":[null,null,null],"uv":[39,731,648]},{"vertices":[35,218,219],"normals":[null,null,null],"uv":[645,717,100]},{"vertices":[248,249,98],"normals":[null,null,null],"uv":[586,585,86]},{"vertices":[236,235,0],"normals":[null,null,null],"uv":[641,715,120]},{"vertices":[237,239,70],"normals":[null,null,null],"uv":[654,709,127]},{"vertices":[229,220,7],"normals":[null,null,null],"uv":[652,729,659]},{"vertices":[14,250,251],"normals":[null,null,null],"uv":[660,565,192]},{"vertices":[232,245,49],"normals":[null,null,null],"uv":[598,597,637]},{"vertices":[7,220,221],"normals":[null,null,null],"uv":[659,729,631]},{"vertices":[277,263,262],"normals":[null,null,null],"uv":[661,1193,662]},{"vertices":[276,262,271],"normals":[null,null,null],"uv":[664,1194,665]},{"vertices":[288,257,256],"normals":[null,null,null],"uv":[667,1195,668]},{"vertices":[291,256,294],"normals":[null,null,null],"uv":[670,1196,671]},{"vertices":[274,275,261],"normals":[null,null,null],"uv":[673,1197,674]},{"vertices":[274,260,265],"normals":[null,null,null],"uv":[676,1198,677]},{"vertices":[283,287,286],"normals":[null,null,null],"uv":[679,1199,680]},{"vertices":[282,286,273],"normals":[null,null,null],"uv":[682,1200,683]},{"vertices":[268,269,259],"normals":[null,null,null],"uv":[685,1201,686]},{"vertices":[268,258,293],"normals":[null,null,null],"uv":[688,1202,689]},{"vertices":[278,279,284],"normals":[null,null,null],"uv":[691,1203,692]},{"vertices":[280,284,285],"normals":[null,null,null],"uv":[694,1204,695]},{"vertices":[296,297,289],"normals":[null,null,null],"uv":[697,1205,698]},{"vertices":[267,266,289],"normals":[null,null,null],"uv":[700,1206,701]},{"vertices":[272,273,232],"normals":[null,null,null],"uv":[703,1207,704]},{"vertices":[294,256,214],"normals":[null,null,null],"uv":[706,1208,707]},{"vertices":[278,280,239],"normals":[null,null,null],"uv":[708,1209,709]},{"vertices":[275,274,233],"normals":[null,null,null],"uv":[710,1167,540]},{"vertices":[251,292,294],"normals":[null,null,null],"uv":[711,1210,712]},{"vertices":[277,276,235],"normals":[null,null,null],"uv":[714,1211,715]},{"vertices":[265,260,218],"normals":[null,null,null],"uv":[716,1212,717]},{"vertices":[238,279,278],"normals":[null,null,null],"uv":[718,1213,719]},{"vertices":[235,276,270],"normals":[null,null,null],"uv":[715,1211,721]},{"vertices":[295,293,252],"normals":[null,null,null],"uv":[722,1214,723]},{"vertices":[239,280,281],"normals":[null,null,null],"uv":[725,1215,726]},{"vertices":[271,262,220],"normals":[null,null,null],"uv":[728,1216,729]},{"vertices":[283,282,241],"normals":[null,null,null],"uv":[730,1217,731]},{"vertices":[246,287,283],"normals":[null,null,null],"uv":[732,1218,733]},{"vertices":[214,256,257],"normals":[null,null,null],"uv":[707,1208,735]},{"vertices":[249,289,297],"normals":[null,null,null],"uv":[585,1183,736]},{"vertices":[285,284,243],"normals":[null,null,null],"uv":[737,1219,738]},{"vertices":[296,266,224],"normals":[null,null,null],"uv":[739,1180,576]},{"vertices":[216,258,259],"normals":[null,null,null],"uv":[741,1220,742]},{"vertices":[243,284,279],"normals":[null,null,null],"uv":[738,1219,743]},{"vertices":[245,286,287],"normals":[null,null,null],"uv":[597,1187,744]},{"vertices":[225,267,290],"normals":[null,null,null],"uv":[745,1221,746]},{"vertices":[218,260,261],"normals":[null,null,null],"uv":[717,1212,748]},{"vertices":[217,259,269],"normals":[null,null,null],"uv":[749,1222,750]},{"vertices":[288,291,250],"normals":[null,null,null],"uv":[752,1176,565]},{"vertices":[257,288,247],"normals":[null,null,null],"uv":[754,1223,755]},{"vertices":[241,282,272],"normals":[null,null,null],"uv":[731,1217,757]},{"vertices":[220,262,263],"normals":[null,null,null],"uv":[729,1216,758]},{"vertices":[313,324,309],"normals":[null,null,null],"uv":[759,1224,760]},{"vertices":[306,299,123],"normals":[null,null,null],"uv":[500,1225,762]},{"vertices":[300,311,209],"normals":[null,null,null],"uv":[763,772,764]},{"vertices":[309,308,211],"normals":[null,null,null],"uv":[766,784,767]},{"vertices":[310,302,130],"normals":[null,null,null],"uv":[769,785,770]},{"vertices":[311,310,213],"normals":[null,null,null],"uv":[772,769,771]},{"vertices":[299,298,122],"normals":[null,null,null],"uv":[773,1226,774]},{"vertices":[134,304,307],"normals":[null,null,null],"uv":[776,787,777]},{"vertices":[312,305,135],"normals":[null,null,null],"uv":[778,1227,779]},{"vertices":[127,301,300],"normals":[null,null,null],"uv":[781,1228,782]},{"vertices":[308,301,127],"normals":[null,null,null],"uv":[784,1228,781]},{"vertices":[302,303,131],"normals":[null,null,null],"uv":[785,1229,786]},{"vertices":[135,305,304],"normals":[null,null,null],"uv":[779,1227,787]},{"vertices":[131,303,312],"normals":[null,null,null],"uv":[786,1229,788]},{"vertices":[122,298,309],"normals":[null,null,null],"uv":[774,1226,766]},{"vertices":[325,385,377],"normals":[null,null,null],"uv":[790,1230,791]},{"vertices":[326,325,310],"normals":[null,null,null],"uv":[793,1231,794]},{"vertices":[315,326,311],"normals":[null,null,null],"uv":[796,1232,797]},{"vertices":[312,327,320],"normals":[null,null,null],"uv":[799,1233,800]},{"vertices":[314,313,298],"normals":[null,null,null],"uv":[802,1234,803]},{"vertices":[310,325,317],"normals":[null,null,null],"uv":[805,1235,806]},{"vertices":[316,315,300],"normals":[null,null,null],"uv":[808,1236,809]},{"vertices":[319,322,307],"normals":[null,null,null],"uv":[811,1237,812]},{"vertices":[317,318,303],"normals":[null,null,null],"uv":[814,1238,815]},{"vertices":[308,323,316],"normals":[null,null,null],"uv":[817,1239,818]},{"vertices":[320,319,304],"normals":[null,null,null],"uv":[820,1240,821]},{"vertices":[318,327,312],"normals":[null,null,null],"uv":[823,1241,824]},{"vertices":[322,321,306],"normals":[null,null,null],"uv":[826,1242,827]},{"vertices":[306,321,314],"normals":[null,null,null],"uv":[829,1243,830]},{"vertices":[324,323,308],"normals":[null,null,null],"uv":[832,1244,833]},{"vertices":[352,353,338],"normals":[null,null,null],"uv":[835,1245,836]},{"vertices":[332,333,141],"normals":[null,null,null],"uv":[838,855,839]},{"vertices":[340,334,142],"normals":[null,null,null],"uv":[841,844,842]},{"vertices":[334,328,136],"normals":[null,null,null],"uv":[844,859,845]},{"vertices":[150,342,337],"normals":[null,null,null],"uv":[846,1246,847]},{"vertices":[335,336,144],"normals":[null,null,null],"uv":[849,856,850]},{"vertices":[329,341,149],"normals":[null,null,null],"uv":[852,1247,853]},{"vertices":[337,338,146],"normals":[null,null,null],"uv":[847,298,300]},{"vertices":[333,342,150],"normals":[null,null,null],"uv":[855,1246,846]},{"vertices":[336,332,140],"normals":[null,null,null],"uv":[856,838,840]},{"vertices":[139,331,335],"normals":[null,null,null],"uv":[857,1248,849]},{"vertices":[339,340,148],"normals":[null,null,null],"uv":[858,841,843]},{"vertices":[328,329,137],"normals":[null,null,null],"uv":[859,852,854]},{"vertices":[149,341,330],"normals":[null,null,null],"uv":[853,1247,860]},{"vertices":[330,331,139],"normals":[null,null,null],"uv":[860,1248,857]},{"vertices":[348,357,342],"normals":[null,null,null],"uv":[862,1249,863]},{"vertices":[351,347,332],"normals":[null,null,null],"uv":[865,1250,866]},{"vertices":[346,350,335],"normals":[null,null,null],"uv":[868,1251,869]},{"vertices":[354,355,340],"normals":[null,null,null],"uv":[871,1252,872]},{"vertices":[343,344,329],"normals":[null,null,null],"uv":[874,1253,875]},{"vertices":[356,345,330],"normals":[null,null,null],"uv":[877,1254,878]},{"vertices":[345,346,331],"normals":[null,null,null],"uv":[880,1255,881]},{"vertices":[353,354,339],"normals":[null,null,null],"uv":[883,1256,884]},{"vertices":[347,348,333],"normals":[null,null,null],"uv":[886,1257,887]},{"vertices":[355,349,334],"normals":[null,null,null],"uv":[889,1258,890]},{"vertices":[349,343,328],"normals":[null,null,null],"uv":[892,1259,893]},{"vertices":[357,352,337],"normals":[null,null,null],"uv":[895,1260,896]},{"vertices":[350,351,336],"normals":[null,null,null],"uv":[898,1261,899]},{"vertices":[344,356,341],"normals":[null,null,null],"uv":[901,1262,902]},{"vertices":[390,401,386],"normals":[null,null,null],"uv":[904,1263,905]},{"vertices":[376,375,315],"normals":[null,null,null],"uv":[907,1264,908]},{"vertices":[379,382,322],"normals":[null,null,null],"uv":[910,1265,911]},{"vertices":[377,378,318],"normals":[null,null,null],"uv":[791,1266,913]},{"vertices":[323,383,376],"normals":[null,null,null],"uv":[914,1267,915]},{"vertices":[320,380,379],"normals":[null,null,null],"uv":[917,942,918]},{"vertices":[378,387,327],"normals":[null,null,null],"uv":[920,1268,921]},{"vertices":[382,381,321],"normals":[null,null,null],"uv":[923,1269,924]},{"vertices":[321,381,374],"normals":[null,null,null],"uv":[926,1270,927]},{"vertices":[384,383,323],"normals":[null,null,null],"uv":[929,1271,930]},{"vertices":[373,384,324],"normals":[null,null,null],"uv":[932,1272,933]},{"vertices":[326,386,385],"normals":[null,null,null],"uv":[935,1273,936]},{"vertices":[375,386,326],"normals":[null,null,null],"uv":[938,1274,939]},{"vertices":[327,387,380],"normals":[null,null,null],"uv":[941,1275,942]},{"vertices":[374,373,313],"normals":[null,null,null],"uv":[943,932,934]},{"vertices":[413,406,391],"normals":[null,null,null],"uv":[945,1276,946]},{"vertices":[402,395,380],"normals":[null,null,null],"uv":[948,969,949]},{"vertices":[389,388,373],"normals":[null,null,null],"uv":[951,1277,952]},{"vertices":[400,392,377],"normals":[null,null,null],"uv":[954,1278,955]},{"vertices":[376,391,390],"normals":[null,null,null],"uv":[957,1279,958]},{"vertices":[379,394,397],"normals":[null,null,null],"uv":[960,1280,961]},{"vertices":[392,393,378],"normals":[null,null,null],"uv":[963,1281,964]},{"vertices":[398,391,376],"normals":[null,null,null],"uv":[966,1282,967]},{"vertices":[395,394,379],"normals":[null,null,null],"uv":[969,1283,970]},{"vertices":[378,393,402],"normals":[null,null,null],"uv":[971,1284,972]},{"vertices":[382,397,396],"normals":[null,null,null],"uv":[962,961,974]},{"vertices":[396,389,374],"normals":[null,null,null],"uv":[976,1285,977]},{"vertices":[399,398,383],"normals":[null,null,null],"uv":[979,1286,980]},{"vertices":[373,388,399],"normals":[null,null,null],"uv":[982,1287,983]},{"vertices":[386,401,400],"normals":[null,null,null],"uv":[985,1288,954]},{"vertices":[410,409,412],"normals":[null,null,null],"uv":[1289,1290,1291]},{"vertices":[412,411,404],"normals":[null,null,null],"uv":[1291,1292,1293]},{"vertices":[404,403,412],"normals":[null,null,null],"uv":[1293,1294,1291]},{"vertices":[414,413,416],"normals":[null,null,null],"uv":[986,1295,1296]},{"vertices":[406,405,416],"normals":[null,null,null],"uv":[1297,1298,1296]},{"vertices":[416,415,407],"normals":[null,null,null],"uv":[1296,1299,987]},{"vertices":[407,408,417],"normals":[null,null,null],"uv":[987,1300,988]},{"vertices":[417,410,412],"normals":[null,null,null],"uv":[988,1289,1291]},{"vertices":[412,403,414],"normals":[null,null,null],"uv":[1291,1294,986]},{"vertices":[413,406,416],"normals":[null,null,null],"uv":[1295,1297,1296]},{"vertices":[416,407,414],"normals":[null,null,null],"uv":[1296,987,986]},{"vertices":[417,412,414],"normals":[null,null,null],"uv":[988,1291,986]},{"vertices":[410,409,394],"normals":[null,null,null],"uv":[989,1301,990]},{"vertices":[393,408,417],"normals":[null,null,null],"uv":[992,1302,993]},{"vertices":[412,411,396],"normals":[null,null,null],"uv":[995,1303,996]},{"vertices":[411,404,389],"normals":[null,null,null],"uv":[998,1304,999]},{"vertices":[414,413,398],"normals":[null,null,null],"uv":[1001,1305,1002]},{"vertices":[388,403,414],"normals":[null,null,null],"uv":[1004,1306,1005]},{"vertices":[416,415,400],"normals":[null,null,null],"uv":[1007,1307,1008]},{"vertices":[405,416,401],"normals":[null,null,null],"uv":[1010,1308,1011]},{"vertices":[417,410,395],"normals":[null,null,null],"uv":[1013,1309,1014]},{"vertices":[404,403,388],"normals":[null,null,null],"uv":[1016,1310,1017]},{"vertices":[415,407,392],"normals":[null,null,null],"uv":[1019,1311,1020]},{"vertices":[391,406,405],"normals":[null,null,null],"uv":[1022,1312,1023]},{"vertices":[394,409,412],"normals":[null,null,null],"uv":[1025,1313,1026]},{"vertices":[407,408,393],"normals":[null,null,null],"uv":[1028,1314,1029]},{"vertices":[359,356,344],"normals":[null,null,null],"uv":[1315,1316,1317]},{"vertices":[363,366,371],"normals":[null,null,null],"uv":[1318,1319,1320]},{"vertices":[352,368,353],"normals":[null,null,null],"uv":[1321,1322,1323]},{"vertices":[363,357,348],"normals":[null,null,null],"uv":[1324,1325,1326]},{"vertices":[366,347,351],"normals":[null,null,null],"uv":[1327,1328,1329]},{"vertices":[361,350,346],"normals":[null,null,null],"uv":[1330,1331,1332]},{"vertices":[369,355,354],"normals":[null,null,null],"uv":[1333,1334,1335]},{"vertices":[358,344,343],"normals":[null,null,null],"uv":[1336,1337,1338]},{"vertices":[356,360,345],"normals":[null,null,null],"uv":[1339,1340,1341]},{"vertices":[360,346,345],"normals":[null,null,null],"uv":[1340,1342,1341]},{"vertices":[368,354,353],"normals":[null,null,null],"uv":[1343,1344,1345]},{"vertices":[347,363,348],"normals":[null,null,null],"uv":[1346,1347,1348]},{"vertices":[370,349,355],"normals":[null,null,null],"uv":[1349,1350,1351]},{"vertices":[349,358,343],"normals":[null,null,null],"uv":[1352,1353,1354]},{"vertices":[372,352,357],"normals":[null,null,null],"uv":[1355,1356,1357]},{"vertices":[365,351,350],"normals":[null,null,null],"uv":[1358,1359,1360]},{"vertices":[359,371,356],"normals":[null,null,null],"uv":[1315,1361,1316]},{"vertices":[359,358,364],"normals":[null,null,null],"uv":[1362,1363,1364]},{"vertices":[364,370,369],"normals":[null,null,null],"uv":[1364,1365,1366]},{"vertices":[369,368,367],"normals":[null,null,null],"uv":[1366,1367,1368]},{"vertices":[367,372,363],"normals":[null,null,null],"uv":[1368,1369,1318]},{"vertices":[363,362,366],"normals":[null,null,null],"uv":[1318,1370,1319]},{"vertices":[366,365,361],"normals":[null,null,null],"uv":[1319,1371,1372]},{"vertices":[361,360,371],"normals":[null,null,null],"uv":[1372,1373,1320]},{"vertices":[371,359,364],"normals":[null,null,null],"uv":[1320,1362,1364]},{"vertices":[364,369,371],"normals":[null,null,null],"uv":[1364,1366,1320]},{"vertices":[367,363,371],"normals":[null,null,null],"uv":[1368,1318,1320]},{"vertices":[366,361,371],"normals":[null,null,null],"uv":[1319,1372,1320]},{"vertices":[371,369,367],"normals":[null,null,null],"uv":[1320,1366,1368]},{"vertices":[352,367,368],"normals":[null,null,null],"uv":[1321,1374,1322]},{"vertices":[363,372,357],"normals":[null,null,null],"uv":[1324,1375,1325]},{"vertices":[366,362,347],"normals":[null,null,null],"uv":[1327,1376,1328]},{"vertices":[361,365,350],"normals":[null,null,null],"uv":[1330,1377,1331]},{"vertices":[369,370,355],"normals":[null,null,null],"uv":[1333,1378,1334]},{"vertices":[358,359,344],"normals":[null,null,null],"uv":[1336,1379,1337]},{"vertices":[356,371,360],"normals":[null,null,null],"uv":[1339,1380,1340]},{"vertices":[360,361,346],"normals":[null,null,null],"uv":[1340,1381,1342]},{"vertices":[368,369,354],"normals":[null,null,null],"uv":[1343,1382,1344]},{"vertices":[347,362,363],"normals":[null,null,null],"uv":[1346,1383,1347]},{"vertices":[370,364,349],"normals":[null,null,null],"uv":[1349,1384,1350]},{"vertices":[349,364,358],"normals":[null,null,null],"uv":[1352,1385,1353]},{"vertices":[372,367,352],"normals":[null,null,null],"uv":[1355,1386,1356]},{"vertices":[365,366,351],"normals":[null,null,null],"uv":[1358,1387,1359]}],"uv":[{"u":0.31996,"v":0.120525},{"u":0.306588,"v":0.072935},{"u":0.325595,"v":0.118883},{"u":0.132379,"v":0.535189},{"u":0.09176,"v":0.580576},{"u":0.082664,"v":0.535097},{"u":0.168462,"v":0.203106},{"u":0.170943,"v":0.144785},{"u":0.191362,"v":0.163267},{"u":0.545425,"v":0.694504},{"u":0.495851,"v":0.764439},{"u":0.495851,"v":0.690547},{"u":0.889584,"v":0.496488},{"u":0.841066,"v":0.552149},{"u":0.841066,"v":0.486474},{"u":0.262334,"v":0.505208},{"u":0.207275,"v":0.532367},{"u":0.216268,"v":0.486519},{"u":0.133992,"v":0.171906},{"u":0.159767,"v":0.11948},{"u":0.836549,"v":0.772587},{"u":0.885285,"v":0.829059},{"u":0.836549,"v":0.819351},{"u":0.706734,"v":0.65017},{"u":0.756308,"v":0.580236},{"u":0.756308,"v":0.646213},{"u":0.138793,"v":0.262237},{"u":0.133378,"v":0.260595},{"u":0.184691,"v":0.243205},{"u":0.942597,"v":0.844973},{"u":0.942597,"v":0.899899},{"u":0.937455,"v":0.889816},{"u":0.262334,"v":0.559525},{"u":0.216268,"v":0.578214},{"u":0.115126,"v":0.129188},{"u":0.159767,"v":0.091727},{"u":0.31996,"v":0.025345},{"u":0.325595,"v":0.026988},{"u":0.429416,"v":0.453219},{"u":0.415858,"v":0.405628},{"u":0.434627,"v":0.451576},{"u":0.663463,"v":0.10838},{"u":0.613889,"v":0.178314},{"u":0.613889,"v":0.104423},{"u":0.818681,"v":0.064119},{"u":0.867459,"v":0.007957},{"u":0.867459,"v":0.073765},{"u":0.616037,"v":0.359076},{"u":0.560933,"v":0.386098},{"u":0.570031,"v":0.340649},{"u":0.115126,"v":0.082337},{"u":0.170943,"v":0.066325},{"u":0.767752,"v":0.913419},{"u":0.815996,"v":0.857005},{"u":0.815996,"v":0.903876},{"u":0.679376,"v":0.178314},{"u":0.72895,"v":0.10838},{"u":0.72895,"v":0.174357},{"u":0.498904,"v":0.09285},{"u":0.49257,"v":0.043962},{"u":0.498904,"v":0.043118},{"u":0.513468,"v":0.426609},{"u":0.505204,"v":0.378043},{"u":0.51145,"v":0.376988},{"u":0.610648,"v":0.386},{"u":0.570031,"v":0.432078},{"u":0.133992,"v":0.039455},{"u":0.191362,"v":0.047666},{"u":0.616397,"v":0.683363},{"u":0.566823,"v":0.753297},{"u":0.566823,"v":0.679406},{"u":0.082664,"v":0.839184},{"u":0.131469,"v":0.78276},{"u":0.131468,"v":0.848738},{"u":0.455958,"v":0.50504},{"u":0.400893,"v":0.532254},{"u":0.410166,"v":0.486521},{"u":0.084999,"v":0.227291},{"u":0.075428,"v":0.169712},{"u":0.099213,"v":0.183592},{"u":0.88574,"v":0.340649},{"u":0.837091,"v":0.397178},{"u":0.837091,"v":0.350549},{"u":0.75148,"v":0.340649},{"u":0.701906,"v":0.410583},{"u":0.701906,"v":0.344606},{"u":0.22411,"v":0.259756},{"u":0.237074,"v":0.212166},{"u":0.243124,"v":0.213808},{"u":0.287056,"v":0.470606},{"u":0.236053,"v":0.45324},{"u":0.241291,"v":0.451597},{"u":0.450465,"v":0.532131},{"u":0.410166,"v":0.578172},{"u":0.044847,"v":0.203859},{"u":0.059285,"v":0.14725},{"u":0.167027,"v":0.535082},{"u":0.16171,"v":0.538051},{"u":0.185957,"v":0.489117},{"u":0.421269,"v":0.026989},{"u":0.416131,"v":0.025346},{"u":0.467182,"v":0.007957},{"u":0.756308,"v":0.490431},{"u":0.706734,"v":0.560365},{"u":0.706734,"v":0.486474},{"u":0.056734,"v":0.870358},{"u":0.007956,"v":0.813961},{"u":0.056734,"v":0.80455},{"u":0.380726,"v":0.50759},{"u":0.325678,"v":0.534813},{"u":0.334971,"v":0.489071},{"u":0.017596,"v":0.165942},{"u":0.053575,"v":0.120092},{"u":0.841186,"v":0.64801},{"u":0.889432,"v":0.591585},{"u":0.889432,"v":0.638457},{"u":0.702265,"v":0.753297},{"u":0.751839,"v":0.683362},{"u":0.751839,"v":0.74934},{"u":0.222335,"v":0.40566},{"u":0.024306,"v":0.308181},{"u":0.037235,"v":0.260592},{"u":0.043083,"v":0.262235},{"u":0.380726,"v":0.561884},{"u":0.334971,"v":0.580726},{"u":0.007956,"v":0.120095},{"u":0.059285,"v":0.092933},{"u":0.51171,"v":0.235647},{"u":0.537395,"v":0.194776},{"u":0.54665,"v":0.200347},{"u":0.752048,"v":0.198733},{"u":0.702474,"v":0.268668},{"u":0.702474,"v":0.194776},{"u":0.374483,"v":0.848888},{"u":0.325678,"v":0.792463},{"u":0.374483,"v":0.78291},{"u":0.325678,"v":0.446168},{"u":0.38498,"v":0.430369},{"u":0.367231,"v":0.473158},{"u":0.017596,"v":0.074247},{"u":0.075428,"v":0.070469},{"u":0.863377,"v":0.104423},{"u":0.818074,"v":0.164278},{"u":0.814589,"v":0.11402},{"u":0.733419,"v":0.007957},{"u":0.683845,"v":0.077891},{"u":0.683845,"v":0.011914},{"u":0.371483,"v":0.137916},{"u":0.480264,"v":0.324723},{"u":0.429472,"v":0.307262},{"u":0.43457,"v":0.305628},{"u":0.336192,"v":0.420821},{"u":0.38498,"v":0.383498},{"u":0.043811,"v":0.031396},{"u":0.099213,"v":0.056584},{"u":0.285244,"v":0.64874},{"u":0.309384,"v":0.605657},{"u":0.290555,"v":0.651688},{"u":0.309384,"v":0.697379},{"u":0.636778,"v":0.679405},{"u":0.686352,"v":0.74934},{"u":0.636778,"v":0.753297},{"u":0.066751,"v":0.407766},{"u":0.007956,"v":0.453613},{"u":0.020725,"v":0.389077},{"u":0.325678,"v":0.367674},{"u":0.367231,"v":0.340649},{"u":0.274742,"v":0.141345},{"u":0.216914,"v":0.137571},{"u":0.2586,"v":0.118882},{"u":0.571076,"v":0.862759},{"u":0.615031,"v":0.918815},{"u":0.566823,"v":0.91016},{"u":0.007956,"v":0.70442},{"u":0.05753,"v":0.634485},{"u":0.05753,"v":0.700463},{"u":0.207275,"v":0.760527},{"u":0.256849,"v":0.690593},{"u":0.256849,"v":0.764484},{"u":0.057679,"v":0.453613},{"u":0.020725,"v":0.518149},{"u":0.55091,"v":0.505162},{"u":0.495851,"v":0.532321},{"u":0.504844,"v":0.486474},{"u":0.25289,"v":0.091724},{"u":0.885647,"v":0.194776},{"u":0.836915,"v":0.250893},{"u":0.836915,"v":0.204127},{"u":0.375252,"v":0.76304},{"u":0.325678,"v":0.693105},{"u":0.375252,"v":0.697062},{"u":0.564195,"v":0.044414},{"u":0.558582,"v":0.045161},{"u":0.597976,"v":0.007957},{"u":0.55091,"v":0.55948},{"u":0.504844,"v":0.578168},{"u":0.299611,"v":0.85525},{"u":0.277231,"v":0.878541},{"u":0.277231,"v":0.850793},{"u":0.216914,"v":0.045876},{"u":0.2586,"v":0.064565},{"u":0.43457,"v":0.213741},{"u":0.429472,"v":0.21209},{"u":0.480264,"v":0.194776},{"u":0.400893,"v":0.760486},{"u":0.450467,"v":0.690551},{"u":0.450467,"v":0.764443},{"u":0.837097,"v":0.679405},{"u":0.885652,"v":0.736043},{"u":0.837097,"v":0.745074},{"u":0.137767,"v":0.507951},{"u":0.09176,"v":0.489117},{"u":0.244163,"v":0.007957},{"u":0.274742,"v":0.042102},{"u":0.836549,"v":0.91095},{"u":0.884795,"v":0.854526},{"u":0.884795,"v":0.901397},{"u":0.132238,"v":0.692955},{"u":0.082664,"v":0.76289},{"u":0.082664,"v":0.696912},{"u":0.944705,"v":0.241214},{"u":0.938357,"v":0.260001},{"u":0.938357,"v":0.241215},{"u":0.15368,"v":0.849976},{"u":0.183243,"v":0.862665},{"u":0.164276,"v":0.875357},{"u":0.300639,"v":0.535144},{"u":0.288849,"v":0.565014},{"u":0.278247,"v":0.539631},{"u":0.106767,"v":0.942894},{"u":0.129153,"v":0.919636},{"u":0.129153,"v":0.947394},{"u":0.306723,"v":0.837996},{"u":0.287739,"v":0.825297},{"u":0.300639,"v":0.516355},{"u":0.278247,"v":0.511866},{"u":0.183243,"v":0.809546},{"u":0.15368,"v":0.82221},{"u":0.164276,"v":0.796862},{"u":0.30444,"v":0.431468},{"u":0.309765,"v":0.453679},{"u":0.309765,"v":0.453679},{"u":0.277231,"v":0.942924},{"u":0.299625,"v":0.919655},{"u":0.299625,"v":0.947405},{"u":0.176072,"v":0.845489},{"u":0.299611,"v":0.874027},{"u":0.287739,"v":0.903742},{"u":0.307814,"v":0.499203},{"u":0.288849,"v":0.486519},{"u":0.686376,"v":0.941038},{"u":0.686376,"v":0.966632},{"u":0.681052,"v":0.96323},{"u":0.178877,"v":0.895633},{"u":0.15368,"v":0.91887},{"u":0.15368,"v":0.891271},{"u":0.969293,"v":0.1493},{"u":0.974617,"v":0.171485},{"u":0.974617,"v":0.171485},{"u":0.968138,"v":0.366241},{"u":0.968138,"v":0.340649},{"u":0.973462,"v":0.344051},{"u":0,"v":0},{"u":0,"v":0},{"u":0,"v":0},{"u":0.007973,"v":0.909549},{"u":0.033186,"v":0.886272},{"u":0.033186,"v":0.914037},{"u":0,"v":0},{"u":0,"v":0},{"u":0,"v":0},{"u":0.974633,"v":0.104423},{"u":0.974633,"v":0.129983},{"u":0.969293,"v":0.126551},{"u":0.251549,"v":0.95483},{"u":0.256862,"v":0.976938},{"u":0.256862,"v":0.976938},{"u":0.893699,"v":0.303611},{"u":0.918897,"v":0.280572},{"u":0.918897,"v":0.308171},{"u":0.970846,"v":0.28399},{"u":0.976159,"v":0.306099},{"u":0.976159,"v":0.306099},{"u":0,"v":0},{"u":0,"v":0},{"u":0,"v":0},{"u":0.917866,"v":0.449459},{"u":0.943063,"v":0.426424},{"u":0.943063,"v":0.45402},{"u":0,"v":0},{"u":0,"v":0},{"u":0,"v":0},{"u":0.87791,"v":0.926864},{"u":0.87791,"v":0.952469},{"u":0.872586,"v":0.949067},{"u":0.717998,"v":0.319801},{"u":0.695323,"v":0.291242},{"u":0.723087,"v":0.291242},{"u":0.114144,"v":0.464422},{"u":0.129378,"v":0.473204},{"u":0.111888,"v":0.471365},{"u":0.901559,"v":0.22815},{"u":0.922444,"v":0.243864},{"u":0.906801,"v":0.256597},{"u":0.922087,"v":0.775956},{"u":0.901198,"v":0.791735},{"u":0.906439,"v":0.763233},{"u":0.578647,"v":0.447992},{"u":0.560933,"v":0.468461},{"u":0.56106,"v":0.447992},{"u":0.901953,"v":0.436051},{"u":0.884221,"v":0.45532},{"u":0.884221,"v":0.426424},{"u":0.675872,"v":0.465673},{"u":0.698547,"v":0.437115},{"u":0.703636,"v":0.465673},{"u":0.785902,"v":0.465673},{"u":0.763227,"v":0.437115},{"u":0.790991,"v":0.437115},{"u":0.724638,"v":0.437115},{"u":0.747314,"v":0.465673},{"u":0.719549,"v":0.465673},{"u":0.744089,"v":0.291242},{"u":0.766765,"v":0.319801},{"u":0.739,"v":0.319801},{"u":0.856673,"v":0.954319},{"u":0.836549,"v":0.926864},{"u":0.856673,"v":0.926887},{"u":0.782677,"v":0.319801},{"u":0.805353,"v":0.291242},{"u":0.810442,"v":0.319801},{"u":0.834668,"v":0.437115},{"u":0.811993,"v":0.465673},{"u":0.806904,"v":0.437115},{"u":0.925426,"v":0.593801},{"u":0.905344,"v":0.610691},{"u":0.909032,"v":0.582032},{"u":0.106767,"v":0.87485},{"u":0.124528,"v":0.894144},{"u":0.106767,"v":0.903723},{"u":0.67941,"v":0.291242},{"u":0.656734,"v":0.319801},{"u":0.651645,"v":0.291242},{"u":0.968821,"v":0.216259},{"u":0.972836,"v":0.213926},{"u":0.972836,"v":0.245402},{"u":0.925426,"v":0.625673},{"u":0.921659,"v":0.623076},{"u":0.665139,"v":0.85324},{"u":0.642442,"v":0.884761},{"u":0.636778,"v":0.85324},{"u":0.411943,"v":0.153829},{"u":0.398415,"v":0.174788},{"u":0.393979,"v":0.153829},{"u":0.918007,"v":0.362559},{"u":0.921762,"v":0.359949},{"u":0.921762,"v":0.39193},{"u":0.441384,"v":0.174788},{"u":0.427856,"v":0.153829},{"u":0.44582,"v":0.153829},{"u":0.97262,"v":0.710881},{"u":0.968605,"v":0.708548},{"u":0.97262,"v":0.679405},{"u":0.547452,"v":0.174298},{"u":0.529738,"v":0.153829},{"u":0.547325,"v":0.153829},{"u":0.900708,"v":0.923154},{"u":0.920842,"v":0.95119},{"u":0.900708,"v":0.95084},{"u":0.656933,"v":0.919682},{"u":0.636778,"v":0.947696},{"u":0.636778,"v":0.919931},{"u":0.921542,"v":0.857576},{"u":0.900708,"v":0.873532},{"u":0.905793,"v":0.844973},{"u":0.479697,"v":0.174301},{"u":0.461971,"v":0.153829},{"u":0.479558,"v":0.153829},{"u":0.868308,"v":0.455421},{"u":0.850581,"v":0.436053},{"u":0.868308,"v":0.426424},{"u":0.618414,"v":0.9552},{"u":0.600957,"v":0.934729},{"u":0.618299,"v":0.934729},{"u":0.826355,"v":0.290792},{"u":0.844101,"v":0.310203},{"u":0.826355,"v":0.319801},{"u":0.359305,"v":0.89427},{"u":0.377014,"v":0.875086},{"u":0.377014,"v":0.903936},{"u":0.479938,"v":0.923064},{"u":0.459819,"v":0.950838},{"u":0.459819,"v":0.923218},{"u":0.479938,"v":0.897057},{"u":0.46218,"v":0.877664},{"u":0.479938,"v":0.86819},{"u":0.359305,"v":0.948182},{"u":0.379413,"v":0.920156},{"u":0.379413,"v":0.947893},{"u":0.343392,"v":0.874449},{"u":0.325678,"v":0.89366},{"u":0.325678,"v":0.864801},{"u":0.901565,"v":0.712878},{"u":0.922228,"v":0.728829},{"u":0.906707,"v":0.741427},{"u":0.323259,"v":0.920198},{"u":0.343392,"v":0.948198},{"u":0.323259,"v":0.947958},{"u":0.612525,"v":0.447992},{"u":0.594811,"v":0.468451},{"u":0.594971,"v":0.447992},{"u":0.860014,"v":0.310176},{"u":0.877787,"v":0.290751},{"u":0.877787,"v":0.319733},{"u":0.513574,"v":0.1743},{"u":0.495882,"v":0.153829},{"u":0.513469,"v":0.153829},{"u":0.954933,"v":0.280572},{"u":0.93481,"v":0.308564},{"u":0.93481,"v":0.280949},{"u":0.901653,"v":0.374892},{"u":0.905329,"v":0.403645},{"u":0.563653,"v":0.174289},{"u":0.581302,"v":0.153829},{"u":0.581214,"v":0.174289},{"u":0.530347,"v":0.969573},{"u":0.545568,"v":0.950404},{"u":0.548984,"v":0.969573},{"u":0.505143,"v":0.863758},{"u":0.520363,"v":0.88264},{"u":0.501727,"v":0.88264},{"u":0.72716,"v":0.913006},{"u":0.711939,"v":0.893837},{"u":0.730576,"v":0.893837},{"u":0.893007,"v":0.007957},{"u":0.908228,"v":0.027126},{"u":0.889591,"v":0.027126},{"u":0.884954,"v":0.123592},{"u":0.900175,"v":0.104423},{"u":0.903591,"v":0.123592},{"u":0.661079,"v":0.884761},{"u":0.645858,"v":0.903769},{"u":0.214539,"v":0.863804},{"u":0.22976,"v":0.882973},{"u":0.211123,"v":0.882973},{"u":0.207275,"v":0.912538},{"u":0.235636,"v":0.912538},{"u":0.972323,"v":0.947229},{"u":0.967919,"v":0.945114},{"u":0.972323,"v":0.915812},{"u":0.524212,"v":0.912655},{"u":0.495851,"v":0.912655},{"u":0.922087,"v":0.806006},{"u":0.916733,"v":0.80507},{"u":0.907651,"v":0.154847},{"u":0.87929,"v":0.154847},{"u":0.91709,"v":0.214806},{"u":0.922444,"v":0.21387},{"u":0.63715,"v":0.437115},{"u":0.659959,"v":0.466692},{"u":0.63195,"v":0.466692},{"u":0.921542,"v":0.887826},{"u":0.916348,"v":0.886749},{"u":0.734081,"v":0.863388},{"u":0.70572,"v":0.863388},{"u":0.951734,"v":0.02853},{"u":0.956778,"v":0.027142},{"u":0.956778,"v":0.057725},{"u":0.911733,"v":0.057575},{"u":0.883372,"v":0.057575},{"u":0.95851,"v":0.865729},{"u":0.963251,"v":0.864051},{"u":0.963251,"v":0.894762},{"u":0.328413,"v":0.153829},{"u":0.342496,"v":0.17547},{"u":0.324532,"v":0.17547},{"u":0.963717,"v":0.434942},{"u":0.958976,"v":0.433264},{"u":0.963717,"v":0.404231},{"u":0.570916,"v":0.934729},{"u":0.584787,"v":0.954965},{"u":0.566823,"v":0.954965},{"u":0.968464,"v":0.784443},{"u":0.972826,"v":0.78241},{"u":0.972826,"v":0.813626},{"u":0.007956,"v":0.950186},{"u":0.021827,"v":0.929951},{"u":0.025921,"v":0.950186},{"u":0.95338,"v":0.135007},{"u":0.948329,"v":0.13362},{"u":0.95338,"v":0.104423},{"u":0.290655,"v":0.17547},{"u":0.304737,"v":0.153829},{"u":0.308619,"v":0.17547},{"u":0.916975,"v":0.699667},{"u":0.922228,"v":0.698568},{"u":0.15676,"v":0.934784},{"u":0.171644,"v":0.95472},{"u":0.15368,"v":0.95472},{"u":0.15368,"v":0.657031},{"u":0.185149,"v":0.657119},{"u":0.161238,"v":0.674197},{"u":0.277231,"v":0.982107},{"u":0.283567,"v":0.963318},{"u":0.283567,"v":0.982091},{"u":0.636808,"v":0.982648},{"u":0.643126,"v":0.96396},{"u":0.643126,"v":0.982651},{"u":0.29948,"v":0.982065},{"u":0.305828,"v":0.963318},{"u":0.305828,"v":0.982065},{"u":0.944489,"v":0.744633},{"u":0.93817,"v":0.725844},{"u":0.944489,"v":0.725844},{"u":0.113113,"v":0.982097},{"u":0.106797,"v":0.963308},{"u":0.113113,"v":0.963308},{"u":0.471871,"v":0.557221},{"u":0.478189,"v":0.576011},{"u":0.471871,"v":0.576011},{"u":0.365653,"v":0.982783},{"u":0.359335,"v":0.964096},{"u":0.365653,"v":0.964095},{"u":0.323289,"v":0.982696},{"u":0.329607,"v":0.964111},{"u":0.329607,"v":0.982696},{"u":0.93803,"v":0.828461},{"u":0.944348,"v":0.809671},{"u":0.944348,"v":0.828461},{"u":0.129026,"v":0.982081},{"u":0.135373,"v":0.963308},{"u":0.135373,"v":0.982077},{"u":0.277231,"v":0.644307},{"u":0.304746,"v":0.601064},{"u":0.749331,"v":0.065033},{"u":0.802769,"v":0.007957},{"u":0.802769,"v":0.076264},{"u":0.453444,"v":0.837422},{"u":0.400893,"v":0.780356},{"u":0.453444,"v":0.790551},{"u":0.409868,"v":0.259648},{"u":0.421526,"v":0.209578},{"u":0.548984,"v":0.932025},{"u":0.540125,"v":0.863758},{"u":0.548984,"v":0.864823},{"u":0.636778,"v":0.826092},{"u":0.689808,"v":0.76921},{"u":0.689808,"v":0.837327},{"u":0.825273,"v":0.63911},{"u":0.772221,"v":0.582032},{"u":0.825273,"v":0.592374},{"u":0.309765,"v":0.409196},{"u":0.304905,"v":0.340649},{"u":0.309765,"v":0.341258},{"u":0.923564,"v":0.175593},{"u":0.932417,"v":0.106753},{"u":0.932417,"v":0.174372},{"u":0.260137,"v":0.791239},{"u":0.207275,"v":0.84789},{"u":0.207275,"v":0.780398},{"u":0.767752,"v":0.831528},{"u":0.820637,"v":0.773961},{"u":0.820637,"v":0.820804},{"u":0.311375,"v":0.123025},{"u":0.300273,"v":0.072935},{"u":0.560407,"v":0.096616},{"u":0.549967,"v":0.046342},{"u":0.619852,"v":0.837327},{"u":0.566823,"v":0.78018},{"u":0.619852,"v":0.76921},{"u":0.767961,"v":0.263053},{"u":0.821002,"v":0.205854},{"u":0.821002,"v":0.252685},{"u":0.927646,"v":0.009751},{"u":0.935821,"v":0.079882},{"u":0.927646,"v":0.078087},{"u":0.507294,"v":0.429438},{"u":0.495851,"v":0.37958},{"u":0.495851,"v":0.780352},{"u":0.549277,"v":0.836984},{"u":0.495851,"v":0.847845},{"u":0.821184,"v":0.679405},{"u":0.767752,"v":0.736286},{"u":0.767752,"v":0.689704},{"u":0.228003,"v":0.309845},{"u":0.217381,"v":0.259756},{"u":0.237074,"v":0.307346},{"u":0.090854,"v":0.864651},{"u":0.082664,"v":0.934148},{"u":0.082664,"v":0.866446},{"u":0.821178,"v":0.408141},{"u":0.767393,"v":0.351863},{"u":0.821178,"v":0.340649},{"u":0.772221,"v":0.55481},{"u":0.825153,"v":0.497521},{"u":0.825153,"v":0.544393},{"u":0.125051,"v":0.358274},{"u":0.113686,"v":0.308185},{"u":0.133378,"v":0.355775},{"u":0.905497,"v":0.558168},{"u":0.914738,"v":0.488552},{"u":0.914738,"v":0.556669},{"u":0.007956,"v":0.777616},{"u":0.061768,"v":0.720333},{"u":0.061768,"v":0.788637},{"u":0.744863,"v":0.115384},{"u":0.798676,"v":0.172561},{"u":0.744863,"v":0.16212},{"u":0.311375,"v":0.022846},{"u":0.471871,"v":0.495856},{"u":0.477455,"v":0.486521},{"u":0.477455,"v":0.541308},{"u":0.959123,"v":0.486474},{"u":0.959123,"v":0.54115},{"u":0.955625,"v":0.535877},{"u":0.236053,"v":0.358061},{"u":0.241291,"v":0.359703},{"u":0.088413,"v":0.243205},{"u":0.371483,"v":0.007957},{"u":0.524334,"v":0.133821},{"u":0.534055,"v":0.128022},{"u":0.289028,"v":0.194776},{"u":0.534055,"v":0.007957},{"u":0.185957,"v":0.581008},{"u":0.467182,"v":0.137916},{"u":0.416131,"v":0.120526},{"u":0.421269,"v":0.118884},{"u":0.277231,"v":0.760972},{"u":0.301017,"v":0.717577},{"u":0.282222,"v":0.763612},{"u":0.339613,"v":0.213812},{"u":0.333983,"v":0.212169},{"u":0.38498,"v":0.194776},{"u":0.415643,"v":0.259658},{"u":0.049099,"v":0.937673},{"u":0.055385,"v":0.888837},{"u":0.055385,"v":0.938464},{"u":0.119781,"v":0.308185},{"u":0.545021,"v":0.340649},{"u":0.301017,"v":0.809383},{"u":0.088413,"v":0.373164},{"u":0.037235,"v":0.355772},{"u":0.043083,"v":0.35413},{"u":0.289028,"v":0.324735},{"u":0.243124,"v":0.305703},{"u":0.402251,"v":0.072936},{"u":0.184691,"v":0.373164},{"u":0.138793,"v":0.354132},{"u":0.429416,"v":0.358038},{"u":0.434627,"v":0.359681},{"u":0.479938,"v":0.340649},{"u":0.38498,"v":0.324735},{"u":0.333983,"v":0.30735},{"u":0.339613,"v":0.305707},{"u":0.505497,"v":0.284559},{"u":0.51171,"v":0.285339},{"u":0.287056,"v":0.340649},{"u":0.479938,"v":0.470608},{"u":0.54665,"v":0.320314},{"u":0.320822,"v":0.259761},{"u":0.565957,"v":0.094093},{"u":0.620865,"v":0.490787},{"u":0.566823,"v":0.567026},{"u":0.566823,"v":0.486474},{"u":0.620865,"v":0.58294},{"u":0.566823,"v":0.659178},{"u":0.566823,"v":0.587253},{"u":0.082664,"v":0.672728},{"u":0.136706,"v":0.596489},{"u":0.136706,"v":0.677042},{"u":0.667932,"v":0.007957},{"u":0.613889,"v":0.084196},{"u":0.613889,"v":0.01227},{"u":0.686561,"v":0.275329},{"u":0.632518,"v":0.19909},{"u":0.686561,"v":0.194776},{"u":0.636778,"v":0.663492},{"u":0.690821,"v":0.587253},{"u":0.690821,"v":0.659178},{"u":0.636778,"v":0.562712},{"u":0.690821,"v":0.486474},{"u":0.690821,"v":0.567026},{"u":0.63195,"v":0.421201},{"u":0.685993,"v":0.344962},{"u":0.685993,"v":0.416888},{"u":0.379721,"v":0.677192},{"u":0.325678,"v":0.600953},{"u":0.379721,"v":0.596639},{"u":0.207275,"v":0.67468},{"u":0.261318,"v":0.598441},{"u":0.261318,"v":0.670366},{"u":0.495851,"v":0.67032},{"u":0.549894,"v":0.594081},{"u":0.549894,"v":0.674634},{"u":0.454936,"v":0.594085},{"u":0.400893,"v":0.670324},{"u":0.400893,"v":0.598399},{"u":0.616605,"v":0.19909},{"u":0.562562,"v":0.275329},{"u":0.562562,"v":0.194776},{"u":0.007956,"v":0.538376},{"u":0.061999,"v":0.614615},{"u":0.007956,"v":0.610301},{"u":0.433578,"v":0.864605},{"u":0.425186,"v":0.933507},{"u":0.425186,"v":0.865886},{"u":0.22794,"v":0.455742},{"u":0.216419,"v":0.405661},{"u":0.496177,"v":0.283426},{"u":0.505497,"v":0.233091},{"u":0.421526,"v":0.309748},{"u":0.409273,"v":0.933843},{"u":0.400893,"v":0.864605},{"u":0.409273,"v":0.86597},{"u":0.028425,"v":0.358271},{"u":0.017788,"v":0.308181},{"u":0.408128,"v":0.123026},{"u":0.396433,"v":0.072936},{"u":0.470683,"v":0.782519},{"u":0.479938,"v":0.852277},{"u":0.470683,"v":0.850855},{"u":0.028425,"v":0.258092},{"u":0.47971,"v":0.594085},{"u":0.470849,"v":0.662975},{"u":0.470849,"v":0.595281},{"u":0.930651,"v":0.490157},{"u":0.939713,"v":0.540538},{"u":0.934124,"v":0.540101},{"u":0.325426,"v":0.309849},{"u":0.314519,"v":0.259761},{"u":0.421353,"v":0.455718},{"u":0.409976,"v":0.405628},{"u":0.689445,"v":0.922852},{"u":0.681052,"v":0.85324},{"u":0.689445,"v":0.854555},{"u":0.22794,"v":0.355564},{"u":0.228003,"v":0.209666},{"u":0.521415,"v":0.137738},{"u":0.49257,"v":0.095472},{"u":0.537758,"v":0.47056},{"u":0.545021,"v":0.464483},{"u":0.181317,"v":0.585618},{"u":0.15368,"v":0.542528},{"u":0.483095,"v":0.04518},{"u":0.125051,"v":0.258095},{"u":0.46638,"v":0.69273},{"u":0.475675,"v":0.762458},{"u":0.46638,"v":0.761049},{"u":0.408128,"v":0.022847},{"u":0.191106,"v":0.458525},{"u":0.182239,"v":0.389077},{"u":0.191106,"v":0.390228},{"u":0.591431,"v":0.137344},{"u":0.597976,"v":0.131622},{"u":0.251549,"v":0.935498},{"u":0.259912,"v":0.86601},{"u":0.259912,"v":0.934127},{"u":0.421353,"v":0.355539},{"u":0.325426,"v":0.20967},{"u":0.189992,"v":0.934788},{"u":0.187557,"v":0.94149},{"u":0.187557,"v":0.934784},{"u":0.175054,"v":0.686772},{"u":0.74212,"v":0.794376},{"u":0.71328,"v":0.781784},{"u":0.727092,"v":0.76921},{"u":0.182451,"v":0.738463},{"u":0.153681,"v":0.751213},{"u":0.15368,"v":0.732424},{"u":0.734492,"v":0.804991},{"u":0.705725,"v":0.817739},{"u":0.70572,"v":0.79895},{"u":0.73719,"v":0.798864},{"u":0.19008,"v":0.727848},{"u":0.161242,"v":0.715258},{"u":0.175052,"v":0.702685},{"u":0.153685,"v":0.638242},{"u":0.182451,"v":0.650991},{"u":0.190081,"v":0.633671},{"u":0.161246,"v":0.621078},{"u":0.175054,"v":0.608508},{"u":0.161245,"v":0.768377},{"u":0.19008,"v":0.755784},{"u":0.175052,"v":0.780949},{"u":0.182452,"v":0.74517},{"u":0.734493,"v":0.811698},{"u":0.713284,"v":0.834903},{"u":0.182453,"v":0.644285},{"u":0.74212,"v":0.822312},{"u":0.727092,"v":0.847474},{"u":0.906944,"v":0.073489},{"u":0.90967,"v":0.080048},{"u":0.905754,"v":0.080049},{"u":0.988236,"v":0.945116},{"u":0.990671,"v":0.938424},{"u":0.990671,"v":0.945116},{"u":0.681052,"v":0.989247},{"u":0.683487,"v":0.982546},{"u":0.683487,"v":0.989245},{"u":0.032774,"v":0.972807},{"u":0.030338,"v":0.966104},{"u":0.032774,"v":0.9661},{"u":0.990968,"v":0.679405},{"u":0.988533,"v":0.686094},{"u":0.988533,"v":0.679407},{"u":0.990968,"v":0.731268},{"u":0.988533,"v":0.724602},{"u":0.990968,"v":0.724597},{"u":0.988236,"v":0.922507},{"u":0.990671,"v":0.915816},{"u":0.990671,"v":0.922511},{"u":0.991175,"v":0.763237},{"u":0.988739,"v":0.769867},{"u":0.988739,"v":0.763233},{"u":0.991175,"v":0.808326},{"u":0.988739,"v":0.814905},{"u":0.988739,"v":0.808324},{"u":0.810156,"v":0.982477},{"u":0.807722,"v":0.975775},{"u":0.810156,"v":0.975771},{"u":0.988739,"v":0.79241},{"u":0.991175,"v":0.785784},{"u":0.991175,"v":0.79241},{"u":0.988533,"v":0.708679},{"u":0.990968,"v":0.702012},{"u":0.990968,"v":0.708684},{"u":0.970354,"v":0.982398},{"u":0.967919,"v":0.989103},{"u":0.967919,"v":0.982398},{"u":0.384001,"v":0.970802},{"u":0.381566,"v":0.964099},{"u":0.384001,"v":0.964095},{"u":0.988698,"v":0.982398},{"u":0.986267,"v":0.989104},{"u":0.986267,"v":0.982404},{"u":0.883372,"v":0.08804},{"u":0.889841,"v":0.073489},{"u":0.889841,"v":0.08804},{"u":0.092989,"v":0.416907},{"u":0.082664,"v":0.43114},{"u":0.08632,"v":0.413938},{"u":0.142454,"v":0.461446},{"u":0.159173,"v":0.456001},{"u":0.146104,"v":0.467769},{"u":0.153267,"v":0.451709},{"u":0.166326,"v":0.439934},{"u":0.08632,"v":0.448343},{"u":0.101542,"v":0.457146},{"u":0.096657,"v":0.462572},{"u":0.114144,"v":0.397859},{"u":0.096657,"v":0.399709},{"u":0.111888,"v":0.390916},{"u":0.159185,"v":0.423865},{"u":0.159173,"v":0.40628},{"u":0.166326,"v":0.422347},{"u":0.089964,"v":0.43114},{"u":0.101542,"v":0.405135},{"u":0.129378,"v":0.389077},{"u":0.128615,"v":0.465943},{"u":0.159185,"v":0.438416},{"u":0.142454,"v":0.400835},{"u":0.146104,"v":0.394512},{"u":0.900708,"v":0.981654},{"u":0.907177,"v":0.967103},{"u":0.907177,"v":0.981654},{"u":0.466288,"v":0.967191},{"u":0.459819,"v":0.981742},{"u":0.459819,"v":0.967191},{"u":0.607169,"v":0.971113},{"u":0.6007,"v":0.985584},{"u":0.6007,"v":0.971116},{"u":0.502309,"v":0.975071},{"u":0.495851,"v":0.989355},{"u":0.495851,"v":0.975006},{"u":0.728103,"v":0.989647},{"u":0.734573,"v":0.975366},{"u":0.734573,"v":0.989655},{"u":0.836549,"v":0.985345},{"u":0.842967,"v":0.970817},{"u":0.842967,"v":0.985364},{"u":0.15368,"v":0.985163},{"u":0.16015,"v":0.970633},{"u":0.16015,"v":0.985163},{"u":0.207275,"v":0.98923},{"u":0.213723,"v":0.974978},{"u":0.213723,"v":0.989319},{"u":0.573292,"v":0.970879},{"u":0.566823,"v":0.985349},{"u":0.566823,"v":0.970878},{"u":0.979164,"v":0.898789},{"u":0.985634,"v":0.884373},{"u":0.985634,"v":0.898794},{"u":0.014425,"v":0.9661},{"u":0.007956,"v":0.980651},{"u":0.007956,"v":0.9661},{"u":0.70572,"v":0.989745},{"u":0.71219,"v":0.975358},{"u":0.71219,"v":0.989746},{"u":0.879056,"v":0.968382},{"u":0.872586,"v":0.982932},{"u":0.872586,"v":0.968383},{"u":0.182532,"v":0.970633},{"u":0.176062,"v":0.985157},{"u":0.176062,"v":0.970633},{"u":0.990641,"v":0.38275},{"u":0.987346,"v":0.387479},{"u":0.987346,"v":0.382154},{"u":0.15466,"v":0.225031},{"u":0.158514,"v":0.219019},{"u":0.158514,"v":0.225726},{"u":0.899056,"v":0.176729},{"u":0.902909,"v":0.17076},{"u":0.902909,"v":0.177429},{"u":0.906944,"v":0.086609},{"u":0.11898,"v":0.225726},{"u":0.115126,"v":0.219713},{"u":0.11898,"v":0.219019},{"u":0.659039,"v":0.970519},{"u":0.6639,"v":0.975724},{"u":0.660229,"v":0.977077},{"u":0.87929,"v":0.176729},{"u":0.883143,"v":0.17076},{"u":0.883143,"v":0.177429},{"u":0.952037,"v":0.565422},{"u":0.95589,"v":0.559452},{"u":0.95589,"v":0.566119},{"u":0.138747,"v":0.225726},{"u":0.134893,"v":0.219713},{"u":0.138747,"v":0.219019},{"u":0.934503,"v":0.557148},{"u":0.930651,"v":0.563119},{"u":0.930651,"v":0.556451},{"u":0.95565,"v":0.0802},{"u":0.952923,"v":0.086759},{"u":0.951734,"v":0.080198},{"u":0.952182,"v":0.176774},{"u":0.948329,"v":0.170804},{"u":0.952182,"v":0.170107},{"u":0.17828,"v":0.21971},{"u":0.174427,"v":0.225726},{"u":0.174427,"v":0.219019},{"u":0.660229,"v":0.963957},{"u":0.662955,"v":0.970517},{"u":0.956594,"v":0.074992},{"u":0.952923,"v":0.073639},{"u":0.972691,"v":0.007963},{"u":0.976817,"v":0.031432},{"u":0.972691,"v":0.031438},{"u":0.791809,"v":0.976938},{"u":0.787739,"v":0.980978},{"u":0.788671,"v":0.975771},{"u":0.988749,"v":0.24198},{"u":0.992043,"v":0.237252},{"u":0.992043,"v":0.242576},{"u":0.7711,"v":0.980979},{"u":0.768688,"v":0.986187},{"u":0.767752,"v":0.980978},{"u":0.99153,"v":0.966354},{"u":0.988236,"v":0.961628},{"u":0.99153,"v":0.961029},{"u":0.230572,"v":0.974889},{"u":0.232984,"v":0.980096},{"u":0.229636,"v":0.980098},{"u":0.988749,"v":0.263218},{"u":0.992043,"v":0.25849},{"u":0.992043,"v":0.263814},{"u":0.988749,"v":0.22074},{"u":0.992044,"v":0.216014},{"u":0.992044,"v":0.221339},{"u":0.791086,"v":0.980979},{"u":0.788671,"v":0.986187},{"u":0.530347,"v":0.985486},{"u":0.533642,"v":0.990212},{"u":0.530347,"v":0.990811},{"u":0.23371,"v":0.984138},{"u":0.230572,"v":0.985305},{"u":0.384861,"v":0.987318},{"u":0.381566,"v":0.992043},{"u":0.381566,"v":0.986719},{"u":0.968138,"v":0.386883},{"u":0.971433,"v":0.382154},{"u":0.971433,"v":0.387479},{"u":0.992044,"v":0.200101},{"u":0.988749,"v":0.195375},{"u":0.992044,"v":0.194776},{"u":0.768688,"v":0.975771},{"u":0.361697,"v":0.156327},{"u":0.378066,"v":0.165778},{"u":0.373314,"v":0.172318},{"u":0.405025,"v":0.975429},{"u":0.400893,"v":0.951956},{"u":0.405025,"v":0.951956},{"u":0.97963,"v":0.427698},{"u":0.983704,"v":0.404231},{"u":0.983704,"v":0.427664},{"u":0.971802,"v":0.582032},{"u":0.975935,"v":0.605505},{"u":0.971802,"v":0.605505},{"u":0.049099,"v":0.954385},{"u":0.053208,"v":0.977852},{"u":0.049099,"v":0.977859},{"u":0.975036,"v":0.486474},{"u":0.979145,"v":0.50995},{"u":0.975036,"v":0.509948},{"u":0.425186,"v":0.975166},{"u":0.429318,"v":0.951698},{"u":0.429318,"v":0.975173},{"u":0.937455,"v":0.962255},{"u":0.941513,"v":0.985725},{"u":0.937455,"v":0.98573},{"u":0.972691,"v":0.047352},{"u":0.976816,"v":0.070826},{"u":0.972691,"v":0.070826},{"u":0.97963,"v":0.443674},{"u":0.983702,"v":0.467012},{"u":0.97963,"v":0.467074},{"u":0.971802,"v":0.62847},{"u":0.975935,"v":0.651942},{"u":0.971802,"v":0.651942},{"u":0.082664,"v":0.951829},{"u":0.086796,"v":0.975296},{"u":0.082664,"v":0.975302},{"u":0.937674,"v":0.41038},{"u":0.941805,"v":0.387087},{"u":0.941805,"v":0.410374},{"u":0.98325,"v":0.844979},{"u":0.979164,"v":0.868447},{"u":0.979164,"v":0.844973},{"u":0.975036,"v":0.525867},{"u":0.979131,"v":0.549338},{"u":0.975036,"v":0.549341},{"u":0.137767,"v":0.562129},{"u":0.545425,"v":0.760482},{"u":0.889584,"v":0.543145},{"u":0.257006,"v":0.532367},{"u":0.885285,"v":0.763233},{"u":0.706734,"v":0.576279},{"u":0.663463,"v":0.174357},{"u":0.818681,"v":0.017367},{"u":0.767752,"v":0.847442},{"u":0.679376,"v":0.104423},{"u":0.616037,"v":0.413237},{"u":0.168462,"v":0.007957},{"u":0.616397,"v":0.74934},{"u":0.082664,"v":0.792313},{"u":0.88574,"v":0.406285},{"u":0.75148,"v":0.41454},{"u":0.455958,"v":0.559331},{"u":0.756308,"v":0.556408},{"u":0.007956,"v":0.860712},{"u":0.375221,"v":0.534686},{"u":0.841186,"v":0.582032},{"u":0.702265,"v":0.679405},{"u":0.752048,"v":0.264711},{"u":0.325678,"v":0.839335},{"u":0.863377,"v":0.170344},{"u":0.733419,"v":0.081848},{"u":0.336192,"v":0.393056},{"u":0.083963,"v":0.007957},{"u":0.686352,"v":0.683362},{"u":0.240459,"v":0.178863},{"u":0.615031,"v":0.853241},{"u":0.007956,"v":0.630528},{"u":0.207275,"v":0.69455},{"u":0.066751,"v":0.49946},{"u":0.545582,"v":0.532321},{"u":0.207275,"v":0.091724},{"u":0.885647,"v":0.260605},{"u":0.325678,"v":0.766997},{"u":0.400893,"v":0.694508},{"u":0.885652,"v":0.689391},{"u":0.836549,"v":0.844973},{"u":0.132238,"v":0.766847},{"u":0.944705,"v":0.26},{"u":0.307814,"v":0.552321},{"u":0.106767,"v":0.924109},{"u":0.176072,"v":0.8267},{"u":0.309765,"v":0.428068},{"u":0.277231,"v":0.924145},{"u":0.306723,"v":0.891082},{"u":0.686376,"v":0.941038},{"u":0.178877,"v":0.91431},{"u":0.974617,"v":0.145897},{"u":0.968138,"v":0.366241},{"u":0,"v":0},{"u":0.007956,"v":0.89076},{"u":0,"v":0},{"u":0.974633,"v":0.104423},{"u":0.256862,"v":0.951411},{"u":0.893699,"v":0.284934},{"u":0.976159,"v":0.280572},{"u":0,"v":0},{"u":0.917866,"v":0.430785},{"u":0,"v":0},{"u":0.87791,"v":0.926864},{"u":0.700411,"v":0.319801},{"u":0.578898,"v":0.468461},{"u":0.901953,"v":0.465567},{"u":0.680961,"v":0.437115},{"u":0.768315,"v":0.465673},{"u":0.742225,"v":0.437115},{"u":0.761676,"v":0.291242},{"u":0.836549,"v":0.954884},{"u":0.787766,"v":0.291242},{"u":0.829579,"v":0.465673},{"u":0.124528,"v":0.864651},{"u":0.674321,"v":0.319801},{"u":0.970197,"v":0.194776},{"u":0.922951,"v":0.64491},{"u":0.41022,"v":0.174788},{"u":0.919294,"v":0.340649},{"u":0.429579,"v":0.174788},{"u":0.969981,"v":0.730031},{"u":0.529487,"v":0.174298},{"u":0.920842,"v":0.922909},{"u":0.656933,"v":0.948044},{"u":0.461733,"v":0.174301},{"u":0.850581,"v":0.465673},{"u":0.6007,"v":0.9552},{"u":0.844101,"v":0.280572},{"u":0.359305,"v":0.864801},{"u":0.479938,"v":0.951278},{"u":0.46218,"v":0.907151},{"u":0.359305,"v":0.919849},{"u":0.343392,"v":0.903928},{"u":0.343392,"v":0.919841},{"u":0.612741,"v":0.468451},{"u":0.860014,"v":0.280572},{"u":0.49561,"v":0.1743},{"u":0.954933,"v":0.30878},{"u":0.563365,"v":0.153829},{"u":0.533763,"v":0.950404},{"u":0.516947,"v":0.863758},{"u":0.715355,"v":0.913006},{"u":0.904812,"v":0.007957},{"u":0.88837,"v":0.104423},{"u":0.657663,"v":0.903769},{"u":0.226344,"v":0.863804},{"u":0.969429,"v":0.966484},{"u":0.918569,"v":0.825138},{"u":0.918926,"v":0.194776},{"u":0.655555,"v":0.437115},{"u":0.918129,"v":0.906996},{"u":0.953463,"v":0.007957},{"u":0.960136,"v":0.844973},{"u":0.340218,"v":0.153829},{"u":0.960602,"v":0.45402},{"u":0.582721,"v":0.934729},{"u":0.96996,"v":0.763233},{"u":0.010022,"v":0.929951},{"u":0.950061,"v":0.154193},{"u":0.292933,"v":0.153829},{"u":0.918776,"v":0.679405},{"u":0.168564,"v":0.934784},{"u":0.277231,"v":0.963334},{"u":0.636778,"v":0.963957},{"u":0.29948,"v":0.963318},{"u":0.938141,"v":0.744633},{"u":0.106767,"v":0.982097},{"u":0.478219,"v":0.557221},{"u":0.359305,"v":0.982783},{"u":0.323259,"v":0.964111},{"u":0.938,"v":0.809671},{"u":0.129026,"v":0.963311},{"u":0.297757,"v":0.594127},{"u":0.749331,"v":0.018182},{"u":0.400893,"v":0.848692},{"u":0.400893,"v":0.259633},{"u":0.540125,"v":0.93449},{"u":0.636778,"v":0.779371},{"u":0.772221,"v":0.65017},{"u":0.304905,"v":0.412155},{"u":0.923564,"v":0.104423},{"u":0.260137,"v":0.837532},{"u":0.767752,"v":0.763233},{"u":0.290655,"v":0.072935},{"u":0.551888,"v":0.100499},{"u":0.566823,"v":0.826901},{"u":0.767961,"v":0.194776},{"u":0.935821,"v":0.007957},{"u":0.498051,"v":0.433675},{"u":0.549277,"v":0.790691},{"u":0.821184,"v":0.74732},{"u":0.207275,"v":0.259756},{"u":0.090854,"v":0.93591},{"u":0.767393,"v":0.398156},{"u":0.772221,"v":0.486474},{"u":0.104326,"v":0.308185},{"u":0.905497,"v":0.486474},{"u":0.007956,"v":0.730767},{"u":0.798676,"v":0.104423},{"u":0.296697,"v":0.713292},{"u":0.049099,"v":0.886272},{"u":0.620865,"v":0.562712},{"u":0.620865,"v":0.663492},{"u":0.082664,"v":0.600803},{"u":0.667932,"v":0.088509},{"u":0.632518,"v":0.271015},{"u":0.636778,"v":0.58294},{"u":0.636778,"v":0.490787},{"u":0.63195,"v":0.340649},{"u":0.325678,"v":0.672878},{"u":0.207275,"v":0.594127},{"u":0.495851,"v":0.598395},{"u":0.454936,"v":0.674638},{"u":0.616605,"v":0.271015},{"u":0.061999,"v":0.534062},{"u":0.433578,"v":0.935778},{"u":0.207275,"v":0.405663},{"u":0.496177,"v":0.229254},{"u":0.400893,"v":0.936043},{"u":0.007956,"v":0.308181},{"u":0.387396,"v":0.072936},{"u":0.479938,"v":0.780352},{"u":0.47971,"v":0.665335},{"u":0.939713,"v":0.486474},{"u":0.304941,"v":0.259762},{"u":0.400893,"v":0.405628},{"u":0.681052,"v":0.925125},{"u":0.483095,"v":0.099395},{"u":0.174316,"v":0.592594},{"u":0.475675,"v":0.690551},{"u":0.182239,"v":0.460961},{"u":0.251549,"v":0.863804},{"u":0.189992,"v":0.941494},{"u":0.190081,"v":0.661607},{"u":0.185151,"v":0.732336},{"u":0.185152,"v":0.638158},{"u":0.185152,"v":0.751297},{"u":0.737191,"v":0.817824},{"u":0.910615,"v":0.074839},{"u":0.988236,"v":0.938424},{"u":0.681052,"v":0.982547},{"u":0.030338,"v":0.97281},{"u":0.990968,"v":0.686093},{"u":0.988533,"v":0.731272},{"u":0.988236,"v":0.915812},{"u":0.991175,"v":0.769871},{"u":0.991175,"v":0.814908},{"u":0.807722,"v":0.982481},{"u":0.988739,"v":0.785784},{"u":0.988533,"v":0.702007},{"u":0.970354,"v":0.989103},{"u":0.381566,"v":0.970805},{"u":0.988698,"v":0.989098},{"u":0.883372,"v":0.073489},{"u":0.092989,"v":0.445374},{"u":0.153267,"v":0.410571},{"u":0.128615,"v":0.396338},{"u":0.900708,"v":0.967103},{"u":0.466288,"v":0.981742},{"u":0.607169,"v":0.985581},{"u":0.502309,"v":0.98942},{"u":0.728103,"v":0.975358},{"u":0.836549,"v":0.970798},{"u":0.15368,"v":0.970633},{"u":0.207275,"v":0.974889},{"u":0.573292,"v":0.985349},{"u":0.979164,"v":0.884367},{"u":0.014425,"v":0.980651},{"u":0.705721,"v":0.975358},{"u":0.879056,"v":0.982932},{"u":0.182532,"v":0.985157},{"u":0.990641,"v":0.386883},{"u":0.15466,"v":0.219707},{"u":0.899056,"v":0.171434},{"u":0.910615,"v":0.085255},{"u":0.115126,"v":0.225038},{"u":0.87929,"v":0.171434},{"u":0.952037,"v":0.560129},{"u":0.134893,"v":0.225038},{"u":0.934503,"v":0.562441},{"u":0.956594,"v":0.085408},{"u":0.948329,"v":0.176097},{"u":0.17828,"v":0.225035},{"u":0.6639,"v":0.965308},{"u":0.976817,"v":0.007957},{"u":0.988749,"v":0.237848},{"u":0.771826,"v":0.985022},{"u":0.988236,"v":0.965761},{"u":0.23371,"v":0.976054},{"u":0.988749,"v":0.259086},{"u":0.988749,"v":0.216607},{"u":0.791809,"v":0.985022},{"u":0.533642,"v":0.98608},{"u":0.384861,"v":0.99145},{"u":0.968138,"v":0.38275},{"u":0.988749,"v":0.199507},{"u":0.771826,"v":0.976938},{"u":0.369385,"v":0.173595},{"u":0.365275,"v":0.173163},{"u":0.361697,"v":0.171097},{"u":0.359268,"v":0.167754},{"u":0.358409,"v":0.163712},{"u":0.359268,"v":0.15967},{"u":0.365275,"v":0.154261},{"u":0.376385,"v":0.157871},{"u":0.369385,"v":0.153829},{"u":0.373314,"v":0.155106},{"u":0.378066,"v":0.161646},{"u":0.376385,"v":0.169553},{"u":0.400893,"v":0.975429},{"u":0.97963,"v":0.404265},{"u":0.975935,"v":0.582032},{"u":0.053208,"v":0.954378},{"u":0.979145,"v":0.486475},{"u":0.425186,"v":0.951691},{"u":0.941513,"v":0.96225},{"u":0.976816,"v":0.047352},{"u":0.983702,"v":0.443612},{"u":0.975935,"v":0.62847},{"u":0.086796,"v":0.951823},{"u":0.937674,"v":0.387093},{"u":0.98325,"v":0.868454},{"u":0.979131,"v":0.525863},{"u":0.5001,"v":0.928568},{"u":0.510402,"v":0.959093},{"u":0.495851,"v":0.959093},{"u":0.628773,"v":0.318322},{"u":0.616998,"v":0.31956},{"u":0.608199,"v":0.299797},{"u":0.952692,"v":0.679405},{"u":0.94239,"v":0.70993},{"u":0.938141,"v":0.679405},{"u":0.941705,"v":0.915812},{"u":0.952006,"v":0.946337},{"u":0.937455,"v":0.946337},{"u":0.941924,"v":0.340649},{"u":0.952225,"v":0.371174},{"u":0.937674,"v":0.371174},{"u":0.942606,"v":0.194776},{"u":0.952908,"v":0.225301},{"u":0.938357,"v":0.225301},{"u":0.942249,"v":0.763233},{"u":0.952551,"v":0.793758},{"u":0.938,"v":0.793758},{"u":0.945588,"v":0.62847},{"u":0.95589,"v":0.658995},{"u":0.941339,"v":0.658995},{"u":0.591028,"v":0.293456},{"u":0.576795,"v":0.32192},{"u":0.576795,"v":0.291242},{"u":0.562562,"v":0.293456},{"u":0.70997,"v":0.92892},{"u":0.720271,"v":0.959444},{"u":0.70572,"v":0.959444},{"u":0.736184,"v":0.959444},{"u":0.746486,"v":0.92892},{"u":0.750735,"v":0.959444},{"u":0.211524,"v":0.928451},{"u":0.221826,"v":0.958976},{"u":0.207275,"v":0.958976},{"u":0.941339,"v":0.612557},{"u":0.95164,"v":0.582032},{"u":0.95589,"v":0.612557},{"u":0.778054,"v":0.959857},{"u":0.767752,"v":0.929333},{"u":0.782303,"v":0.929333},{"u":0.802465,"v":0.929333},{"u":0.812767,"v":0.959857},{"u":0.798216,"v":0.959857},{"u":0.506152,"v":0.928568},{"u":0.611757,"v":0.294901},{"u":0.616998,"v":0.291875},{"u":0.623017,"v":0.291242},{"u":0.628773,"v":0.293112},{"u":0.633271,"v":0.297162},{"u":0.635732,"v":0.302691},{"u":0.635732,"v":0.308744},{"u":0.633271,"v":0.314273},{"u":0.623017,"v":0.320193},{"u":0.611757,"v":0.316534},{"u":0.608199,"v":0.311637},{"u":0.606941,"v":0.305717},{"u":0.948442,"v":0.70993},{"u":0.947757,"v":0.915812},{"u":0.947976,"v":0.340649},{"u":0.948658,"v":0.194776},{"u":0.948302,"v":0.763233},{"u":0.95164,"v":0.62847},{"u":0.582715,"v":0.322841},{"u":0.570876,"v":0.322841},{"u":0.716022,"v":0.92892},{"u":0.740434,"v":0.92892},{"u":0.217576,"v":0.928451},{"u":0.945588,"v":0.582032},{"u":0.772001,"v":0.959857},{"u":0.808517,"v":0.929333}]}];

/***/ }),

/***/ "./src/assets/room.json":
/*!******************************!*\
  !*** ./src/assets/room.json ***!
  \******************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, default */
/***/ (function(module) {

module.exports = [{"name":"Cylinder","vertices":[{"x":0.00398,"y":0.003283,"z":-1.026473},{"x":0.00398,"y":0.223807,"z":-0.787877},{"x":0.544621,"y":0.003283,"z":-0.867726},{"x":0.415626,"y":0.223807,"z":-0.667007},{"x":0.913612,"y":0.003283,"z":-0.441888},{"x":0.696578,"y":0.223807,"z":-0.342772},{"x":0.993801,"y":0.003283,"z":0.115842},{"x":0.757634,"y":0.223807,"z":0.081886},{"x":0.759729,"y":0.003283,"z":0.628388},{"x":0.579411,"y":0.223807,"z":0.472141},{"x":0.285712,"y":0.003283,"z":0.93302},{"x":0.218492,"y":0.223807,"z":0.704089},{"x":-0.277753,"y":0.003283,"z":0.93302},{"x":-0.210533,"y":0.223807,"z":0.704089},{"x":-0.75177,"y":0.003283,"z":0.628388},{"x":-0.571451,"y":0.223807,"z":0.472141},{"x":-0.985842,"y":0.003283,"z":0.115842},{"x":-0.749674,"y":0.223807,"z":0.081886},{"x":-0.905652,"y":0.003283,"z":-0.441888},{"x":-0.688618,"y":0.223807,"z":-0.342772},{"x":-0.536661,"y":0.003283,"z":-0.867726},{"x":-0.407666,"y":0.223807,"z":-0.667007}],"normals":[{"x":0.1955,"y":0.7202,"z":-0.6657},{"x":0.5243,"y":0.7202,"z":-0.4543},{"x":0.6867,"y":0.7202,"z":-0.0987},{"x":0.6311,"y":0.7202,"z":0.2882},{"x":0.3751,"y":0.7202,"z":0.5836},{"x":0,"y":0.7202,"z":0.6938},{"x":-0.3751,"y":0.7202,"z":0.5836},{"x":-0.6311,"y":0.7202,"z":0.2882},{"x":-0.6867,"y":0.7202,"z":-0.0987},{"x":0,"y":1,"z":0},{"x":-0.5243,"y":0.7202,"z":-0.4543},{"x":-0.1955,"y":0.7202,"z":-0.6657},{"x":0,"y":-1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[2,5,4],"normals":[1,1,1]},{"vertices":[5,6,4],"normals":[2,2,2]},{"vertices":[7,8,6],"normals":[3,3,3]},{"vertices":[9,10,8],"normals":[4,4,4]},{"vertices":[11,12,10],"normals":[5,5,5]},{"vertices":[13,14,12],"normals":[6,6,6]},{"vertices":[15,16,14],"normals":[7,7,7]},{"vertices":[17,18,16],"normals":[8,8,8]},{"vertices":[1,15,7],"normals":[9,9,9]},{"vertices":[18,21,20],"normals":[10,10,10]},{"vertices":[21,0,20],"normals":[11,11,11]},{"vertices":[2,10,18],"normals":[12,12,12]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[2,3,5],"normals":[1,1,1]},{"vertices":[5,7,6],"normals":[2,2,2]},{"vertices":[7,9,8],"normals":[3,3,3]},{"vertices":[9,11,10],"normals":[4,4,4]},{"vertices":[11,13,12],"normals":[5,5,5]},{"vertices":[13,15,14],"normals":[6,6,6]},{"vertices":[15,17,16],"normals":[7,7,7]},{"vertices":[17,19,18],"normals":[8,8,8]},{"vertices":[5,3,1],"normals":[9,9,9]},{"vertices":[1,21,19],"normals":[9,9,9]},{"vertices":[19,17,15],"normals":[9,9,9]},{"vertices":[15,13,7],"normals":[9,9,9]},{"vertices":[11,9,7],"normals":[9,9,9]},{"vertices":[7,5,1],"normals":[9,9,9]},{"vertices":[1,19,15],"normals":[9,9,9]},{"vertices":[13,11,7],"normals":[9,9,9]},{"vertices":[18,19,21],"normals":[10,10,10]},{"vertices":[21,1,0],"normals":[11,11,11]},{"vertices":[20,0,2],"normals":[12,12,12]},{"vertices":[2,4,6],"normals":[12,12,12]},{"vertices":[6,8,10],"normals":[12,12,12]},{"vertices":[10,12,14],"normals":[12,12,12]},{"vertices":[14,16,10],"normals":[12,12,12]},{"vertices":[18,20,2],"normals":[12,12,12]},{"vertices":[2,6,10],"normals":[12,12,12]},{"vertices":[10,16,18],"normals":[12,12,12]}]},{"name":"Cube_Cube.001","vertices":[{"x":2.192064,"y":0.006022,"z":2.993151},{"x":2.192064,"y":2.006022,"z":2.993151},{"x":2.192064,"y":0.006022,"z":2.653527},{"x":2.192064,"y":2.006022,"z":2.653527},{"x":2.52233,"y":0.006022,"z":2.993151},{"x":2.52233,"y":2.006022,"z":2.993151},{"x":2.52233,"y":0.006022,"z":2.653527},{"x":2.52233,"y":2.006022,"z":2.653527}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Plane","vertices":[{"x":-4,"y":0,"z":6},{"x":4,"y":0,"z":6},{"x":-4,"y":0,"z":-6},{"x":4,"y":0,"z":-6},{"x":4,"y":0,"z":-6},{"x":-4,"y":0,"z":-6},{"x":4,"y":0,"z":6},{"x":-4,"y":0,"z":6},{"x":-4,"y":2,"z":6},{"x":4,"y":2,"z":6},{"x":-4,"y":2,"z":-6},{"x":4,"y":2,"z":-6},{"x":-2,"y":2,"z":3},{"x":2,"y":2,"z":3},{"x":-2,"y":2,"z":-3},{"x":2,"y":2,"z":-3},{"x":-1.8,"y":2.170119,"z":2.699999},{"x":1.8,"y":2.170119,"z":2.699999},{"x":-1.8,"y":2.170119,"z":-2.699999},{"x":1.8,"y":2.170119,"z":-2.699999}],"normals":[{"x":0,"y":0,"z":1},{"x":0,"y":1,"z":0},{"x":0,"y":-1,"z":0},{"x":1,"y":0,"z":0},{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":0.6479,"y":-0.7617,"z":0},{"x":-0.6479,"y":-0.7617,"z":0},{"x":0,"y":-0.8699,"z":0.4933},{"x":0,"y":-0.8699,"z":-0.4933}],"faces":[{"vertices":[7,1,6],"normals":[0,0,0]},{"vertices":[4,2,5],"normals":[0,0,0]},{"vertices":[6,5,7],"normals":[1,1,1]},{"vertices":[11,2,3],"normals":[0,0,0]},{"vertices":[6,3,4],"normals":[0,0,0]},{"vertices":[5,0,7],"normals":[0,0,0]},{"vertices":[12,9,8],"normals":[2,2,2]},{"vertices":[10,0,2],"normals":[3,3,3]},{"vertices":[9,3,1],"normals":[4,4,4]},{"vertices":[8,1,0],"normals":[5,5,5]},{"vertices":[18,12,14],"normals":[6,6,6]},{"vertices":[14,8,10],"normals":[2,2,2]},{"vertices":[13,11,9],"normals":[2,2,2]},{"vertices":[15,10,11],"normals":[2,2,2]},{"vertices":[18,17,16],"normals":[2,2,2]},{"vertices":[17,15,13],"normals":[7,7,7]},{"vertices":[15,18,14],"normals":[8,8,8]},{"vertices":[12,17,13],"normals":[9,9,9]},{"vertices":[7,0,1],"normals":[0,0,0]},{"vertices":[4,3,2],"normals":[0,0,0]},{"vertices":[6,4,5],"normals":[1,1,1]},{"vertices":[11,10,2],"normals":[0,0,0]},{"vertices":[6,1,3],"normals":[0,0,0]},{"vertices":[5,2,0],"normals":[0,0,0]},{"vertices":[12,13,9],"normals":[2,2,2]},{"vertices":[10,8,0],"normals":[3,3,3]},{"vertices":[9,11,3],"normals":[4,4,4]},{"vertices":[8,9,1],"normals":[5,5,5]},{"vertices":[18,16,12],"normals":[6,6,6]},{"vertices":[14,12,8],"normals":[2,2,2]},{"vertices":[13,15,11],"normals":[2,2,2]},{"vertices":[15,14,10],"normals":[2,2,2]},{"vertices":[18,19,17],"normals":[2,2,2]},{"vertices":[17,19,15],"normals":[7,7,7]},{"vertices":[15,19,18],"normals":[8,8,8]},{"vertices":[12,16,17],"normals":[9,9,9]}]},{"name":"Cube.001_Cube.002","vertices":[{"x":2.192064,"y":0.006022,"z":-2.652668},{"x":2.192064,"y":2.006022,"z":-2.652668},{"x":2.192064,"y":0.006022,"z":-2.992291},{"x":2.192064,"y":2.006022,"z":-2.992291},{"x":2.52233,"y":0.006022,"z":-2.652668},{"x":2.52233,"y":2.006022,"z":-2.652668},{"x":2.52233,"y":0.006022,"z":-2.992291},{"x":2.52233,"y":2.006022,"z":-2.992291}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.002_Cube.003","vertices":[{"x":2.192064,"y":0.006022,"z":-0.832916},{"x":2.192064,"y":2.006022,"z":-0.832916},{"x":2.192064,"y":0.006022,"z":-1.172539},{"x":2.192064,"y":2.006022,"z":-1.172539},{"x":2.52233,"y":0.006022,"z":-0.832916},{"x":2.52233,"y":2.006022,"z":-0.832916},{"x":2.52233,"y":0.006022,"z":-1.172539},{"x":2.52233,"y":2.006022,"z":-1.172539}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.003_Cube.004","vertices":[{"x":2.192064,"y":0.006022,"z":1.157481},{"x":2.192064,"y":2.006022,"z":1.157481},{"x":2.192064,"y":0.006022,"z":0.817857},{"x":2.192064,"y":2.006022,"z":0.817857},{"x":2.52233,"y":0.006022,"z":1.157481},{"x":2.52233,"y":2.006022,"z":1.157481},{"x":2.52233,"y":0.006022,"z":0.817857},{"x":2.52233,"y":2.006022,"z":0.817857}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.007_Cube.008","vertices":[{"x":-2.580252,"y":0.006022,"z":2.993151},{"x":-2.580252,"y":2.006022,"z":2.993151},{"x":-2.580252,"y":0.006022,"z":2.653527},{"x":-2.580252,"y":2.006022,"z":2.653527},{"x":-2.249986,"y":0.006022,"z":2.993151},{"x":-2.249986,"y":2.006022,"z":2.993151},{"x":-2.249986,"y":0.006022,"z":2.653527},{"x":-2.249986,"y":2.006022,"z":2.653527}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.006_Cube.007","vertices":[{"x":-2.580252,"y":0.006022,"z":-2.652668},{"x":-2.580252,"y":2.006022,"z":-2.652668},{"x":-2.580252,"y":0.006022,"z":-2.992291},{"x":-2.580252,"y":2.006022,"z":-2.992291},{"x":-2.249986,"y":0.006022,"z":-2.652668},{"x":-2.249986,"y":2.006022,"z":-2.652668},{"x":-2.249986,"y":0.006022,"z":-2.992291},{"x":-2.249986,"y":2.006022,"z":-2.992291}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.005_Cube.006","vertices":[{"x":-2.580252,"y":0.006022,"z":-0.832916},{"x":-2.580252,"y":2.006022,"z":-0.832916},{"x":-2.580252,"y":0.006022,"z":-1.172539},{"x":-2.580252,"y":2.006022,"z":-1.172539},{"x":-2.249986,"y":0.006022,"z":-0.832916},{"x":-2.249986,"y":2.006022,"z":-0.832916},{"x":-2.249986,"y":0.006022,"z":-1.172539},{"x":-2.249986,"y":2.006022,"z":-1.172539}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]},{"name":"Cube.004_Cube.005","vertices":[{"x":-2.580252,"y":0.006022,"z":1.157481},{"x":-2.580252,"y":2.006022,"z":1.157481},{"x":-2.580252,"y":0.006022,"z":0.817857},{"x":-2.580252,"y":2.006022,"z":0.817857},{"x":-2.249986,"y":0.006022,"z":1.157481},{"x":-2.249986,"y":2.006022,"z":1.157481},{"x":-2.249986,"y":0.006022,"z":0.817857},{"x":-2.249986,"y":2.006022,"z":0.817857}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]}];

/***/ }),

/***/ "./src/blender/BlenderJsonParser.ts":
/*!******************************************!*\
  !*** ./src/blender/BlenderJsonParser.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
class BlenderJsonParser {
    static parse(file, disp = true, flat = false) {
        const scene = [];
        file.forEach((object) => {
            const points = new Array();
            const normals = new Array();
            object.vertices.forEach((v) => {
                points.push(new math_1.Vector4f(v.x, v.y, v.z).mul(2));
            });
            object.normals.forEach((v) => {
                normals.push(new math_1.Vector4f(v.x, v.y, v.z));
            });
            const faces = [];
            object.faces.forEach((f) => {
                faces.push({
                    normal: f.normals[0],
                    v1: f.vertices[0],
                    v2: f.vertices[1],
                    v3: f.vertices[2],
                });
            });
            const obj = {
                faces,
                normals,
                points,
                transformedNormals: normals.map(() => new math_1.Vector4f(0, 0, 0, 0)),
                transformedPoints: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            };
            scene.push(obj);
        });
        return scene;
    }
}
exports.BlenderJsonParser = BlenderJsonParser;


/***/ }),

/***/ "./src/blitter/ScaleClipBlitter.ts":
/*!*****************************************!*\
  !*** ./src/blitter/ScaleClipBlitter.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ScaleClipBlitter {
    constructor(framebuffer) {
        this.framebuffer = framebuffer;
    }
    drawScaledTextureClip(xp, yp, width, height, texture, alphaBlend) {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;
        let newHeight;
        let newWidth;
        let yStart;
        let xStart;
        if (yp + height < 0 ||
            yp > 199 ||
            xp + width < 0 ||
            xp > 319) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - 200, 0);
            yStart = 0;
        }
        else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }
        let xTextureStart;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        }
        else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - 320, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * 320;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                let alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                let inverseAlpha = 1 - alpha;
                let framebufferPixel = this.framebuffer.framebuffer[index2];
                let texturePixel = texture.texture[textureIndex];
                let r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                let g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                let b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;
                this.framebuffer.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + 320;
        }
    }
}
exports.ScaleClipBlitter = ScaleClipBlitter;


/***/ }),

/***/ "./src/core/Color.ts":
/*!***************************!*\
  !*** ./src/core/Color.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Color
 *
 * @export
 * @class Color
 * @see https://www.rapidtables.com/web/color/RGB_Color.html
 * @author Johannes Diemke
 */
class Color {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toPackedFormat() {
        return this.r | this.g << 8 | this.b << 16 | this.a << 24;
    }
}
Color.BLACK = new Color(0, 0, 0, 255);
Color.WHITE = new Color(255, 255, 255, 255);
Color.RED = new Color(255, 0, 0, 255);
Color.LIME = new Color(0, 255, 0, 255);
Color.BLUE = new Color(0, 0, 255, 255);
Color.YELLOW = new Color(255, 255, 0, 255);
Color.CYAN = new Color(0, 255, 255, 255);
Color.MAGENTA = new Color(255, 0, 255, 255);
Color.SLATE_GRAY = new Color(112, 128, 144, 255);
exports.Color = Color;


/***/ }),

/***/ "./src/examples/gears/Application.ts":
/*!*******************************************!*\
  !*** ./src/examples/gears/Application.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Canvas_1 = __webpack_require__(/*! ../../Canvas */ "./src/Canvas.ts");
const GearsScene_1 = __webpack_require__(/*! ./GearsScene */ "./src/examples/gears/GearsScene.ts");
class Application {
    static main() {
        const canvas = new Canvas_1.Canvas(320, 200, new GearsScene_1.GearsScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }
}
Application.main();


/***/ }),

/***/ "./src/examples/gears/GearsScene.ts":
/*!******************************************!*\
  !*** ./src/examples/gears/GearsScene.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BlenderJsonParser_1 = __webpack_require__(/*! ../../blender/BlenderJsonParser */ "./src/blender/BlenderJsonParser.ts");
const CullFace_1 = __webpack_require__(/*! ../../CullFace */ "./src/CullFace.ts");
const math_1 = __webpack_require__(/*! ../../math */ "./src/math/index.ts");
const FlatShadingRenderingPipeline_1 = __webpack_require__(/*! ../../rendering-pipelines/FlatShadingRenderingPipeline */ "./src/rendering-pipelines/FlatShadingRenderingPipeline.ts");
const AbstractScene_1 = __webpack_require__(/*! ../../scenes/AbstractScene */ "./src/scenes/AbstractScene.ts");
const texture_1 = __webpack_require__(/*! ../../texture */ "./src/texture/index.ts");
class GearsScene extends AbstractScene_1.AbstractScene {
    constructor() {
        super(...arguments);
        this.accumulationBuffer = new Uint32Array(320 * 200);
    }
    init(framebuffer) {
        this.renderingPipeline = new FlatShadingRenderingPipeline_1.FlatShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace_1.CullFace.FRONT);
        this.gearsMesh = BlenderJsonParser_1.BlenderJsonParser.parse(__webpack_require__(/*! ../../assets/gear.json */ "./src/assets/gear.json"), false)[0];
        return Promise.all([
            texture_1.TextureUtils.load(__webpack_require__(/*! ../../assets/blurredBackground.png */ "./src/assets/blurredBackground.png"), false).then((texture) => this.blurred = texture),
            texture_1.TextureUtils.generateProceduralNoise().then((texture) => this.noise = texture)
        ]);
    }
    render(framebuffer) {
        const time = Date.now();
        framebuffer.fastFramebufferCopy(framebuffer.framebuffer, this.blurred.texture);
        this.drawBlenderScene4(framebuffer, time, null, null);
        /*  [
              { tex: this.texture10, scale: 0.0, alpha: 1.0 },
              { tex: this.texture11, scale: 2.3, alpha: 0.5 },
              { tex: this.texture13, scale: 1.6, alpha: 0.25 },
              { tex: this.texture13, scale: 0.7, alpha: 0.22 },
              { tex: this.texture13, scale: -0.4, alpha: 0.22 },
          ], this.dirt);*/
        const texture3 = new texture_1.Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
        framebuffer.noise(time, this.noise);
    }
    drawBlenderScene4(framebuffer, elapsedTime, texture, dirt) {
        framebuffer.clearDepthBuffer();
        const camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -21).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)));
        let scale = 0.1 * 2.1 * 2.1;
        let factor = 2.1 - 0.09 - 0.09;
        const fade = 0.09;
        const dampFactor = Math.sin(elapsedTime * 0.00001) * 0.5 + 0.5;
        for (let i = 1; i < 6; i++) {
            scale *= factor;
            factor -= fade;
            const mv = this.getModelViewMatrix(camera, dampFactor, scale, i, elapsedTime);
            this.renderingPipeline.draw(this.gearsMesh, mv, 246, 165, 177);
        }
        // let lensflareScreenSpace = framebuffer.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));
        // framebuffer.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }
    getModelViewMatrix(camera, dampFactor, scale, i, elapsedTime) {
        const modelViewMartrix = math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0006 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0005 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale)));
        return camera.multiplyMatrix(modelViewMartrix);
    }
}
exports.GearsScene = GearsScene;


/***/ }),

/***/ "./src/geometrical-objects/AbstractGeometricObject.ts":
/*!************************************************************!*\
  !*** ./src/geometrical-objects/AbstractGeometricObject.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
class AbstractGeometricObject {
    buildMesh(points, index) {
        const normals = new Array();
        // todo use index array for normals to have less normal objects
        // compute normal and check wheter the normal already exists. then reuse inded
        // maybe have a similarity faktor to reuse similar normals
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(this.inverse ? normal.normalize().mul(-1) : normal.normalize()); // normalize?
        }
        let faces = new Array();
        for (let i = 0; i < index.length; i += 3) {
            faces.push({
                v1: index[0 + i],
                v2: index[1 + i],
                v3: index[2 + i],
                normal: i / 3
            });
        }
        // Create class for objects
        this.mesh = {
            points: points,
            normals: normals,
            faces: faces,
            transformedPoints: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            transformedNormals: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
    }
    getMesh() {
        return this.mesh;
    }
}
exports.AbstractGeometricObject = AbstractGeometricObject;


/***/ }),

/***/ "./src/geometrical-objects/Torus.ts":
/*!******************************************!*\
  !*** ./src/geometrical-objects/Torus.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector4f_1 = __webpack_require__(/*! ../math/Vector4f */ "./src/math/Vector4f.ts");
const AbstractGeometricObject_1 = __webpack_require__(/*! ./AbstractGeometricObject */ "./src/geometrical-objects/AbstractGeometricObject.ts");
const Vector3f_1 = __webpack_require__(/*! ../math/Vector3f */ "./src/math/Vector3f.ts");
class Torus extends AbstractGeometricObject_1.AbstractGeometricObject {
    constructor(invert = false) {
        super();
        const points = [];
        const STEPS = 15;
        const STEPS2 = 12;
        // find a better solution for inversion
        // maybe configuration by constructor of base class and construction of geometry
        // in template method pattern method
        this.inverse = invert;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f_1.Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new Vector4f_1.Vector4f(pos.x, pos.y, pos.z, 1.0));
            }
        }
        const index = [];
        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2) % points.length);
                index.push(((STEPS2 * j) + (0 + i) % STEPS2) % points.length);
            }
        }
        this.buildMesh(points, index);
    }
    torusFunction(alpha) {
        return new Vector3f_1.Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }
}
exports.Torus = Torus;


/***/ }),

/***/ "./src/math/Geometry.ts":
/*!******************************!*\
  !*** ./src/math/Geometry.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(/*! ./index */ "./src/math/index.ts");
const Sphere_1 = __webpack_require__(/*! ./Sphere */ "./src/math/Sphere.ts");
class ComputationalGeometryUtils {
    computeBoundingSphere(vertices) {
        if (vertices.length === 0) {
            throw new Error('More than one vertex required.');
        }
        if (vertices.length === 1) {
            return new Sphere_1.Sphere(vertices[0], 0);
        }
        let center = new index_1.Vector4f(0, 0, 0, 0);
        let radius = 0;
        vertices.forEach(point => {
            center = center.add(new index_1.Vector4f(point.x, point.y, point.z, 0.0));
        });
        center = center.mul(1.0 / vertices.length);
        vertices.forEach(point => {
            radius = Math.max(radius, center.sub(point).length());
        });
        return new Sphere_1.Sphere(center, radius);
    }
}
exports.ComputationalGeometryUtils = ComputationalGeometryUtils;


/***/ }),

/***/ "./src/math/Matrix3.ts":
/*!*****************************!*\
  !*** ./src/math/Matrix3.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(/*! ./Vector3f */ "./src/math/Vector3f.ts");
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
        return new Vector3f_1.Vector3f(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z);
    }
}
exports.Matrix3f = Matrix3f;


/***/ }),

/***/ "./src/math/Matrix4f.ts":
/*!******************************!*\
  !*** ./src/math/Matrix4f.ts ***!
  \******************************/
/*! no static exports found */
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
const Vector3f_1 = __webpack_require__(/*! ./Vector3f */ "./src/math/Vector3f.ts");
const Vector4f_1 = __webpack_require__(/*! ./Vector4f */ "./src/math/Vector4f.ts");
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
    transpose() {
        let transpose = new Matrix4f();
        transpose.m11 = this.m11;
        transpose.m12 = this.m21;
        transpose.m13 = this.m31;
        transpose.m14 = this.m41;
        transpose.m21 = this.m12;
        transpose.m22 = this.m22;
        transpose.m23 = this.m32;
        transpose.m24 = this.m42;
        transpose.m31 = this.m13;
        transpose.m32 = this.m23;
        transpose.m33 = this.m33;
        transpose.m34 = this.m43;
        transpose.m41 = this.m14;
        transpose.m42 = this.m24;
        transpose.m43 = this.m34;
        transpose.m44 = this.m44;
        return transpose;
    }
    computeNormalMatrix() {
        // http://www.lighthouse3d.com/tutorials/glsl-12-tutorial/the-normal-matrix/
        // https://www.gamedev.net/forums/topic/443040-inverse-of-modelview-matrix/
        // https://computergraphics.stackexchange.com/questions/1502/why-is-the-transposed-inverse-of-the-model-view-matrix-used-to-transform-the-nor
        return this.inverse().transpose();
    }
    inverse() {
        // Inverse hack
        // - only works when the MV matrix only contains
        // translation and rotation and scaling that is the same in all directions
        let inverseTranslation = Matrix4f.constructIdentityMatrix();
        inverseTranslation.m14 = -this.m14;
        inverseTranslation.m24 = -this.m24;
        inverseTranslation.m34 = -this.m34;
        let scale = 1.0 / Math.sqrt(this.m11 * this.m11 + this.m12 * this.m12 + this.m13 * this.m13);
        let inverseRotation = Matrix4f.constructIdentityMatrix();
        inverseRotation.m11 = this.m11 * scale;
        inverseRotation.m21 = this.m12 * scale;
        inverseRotation.m31 = this.m13 * scale;
        inverseRotation.m12 = this.m21 * scale;
        inverseRotation.m22 = this.m22 * scale;
        inverseRotation.m32 = this.m23 * scale;
        inverseRotation.m13 = this.m31 * scale;
        inverseRotation.m23 = this.m32 * scale;
        inverseRotation.m33 = this.m33 * scale;
        return inverseRotation.multiplyMatrix(inverseTranslation);
    }
    getInverseRotation() {
        let scale = 1.0;
        let inverseRotation = Matrix4f.constructIdentityMatrix();
        inverseRotation.m11 = this.m11 * scale;
        inverseRotation.m21 = this.m12 * scale;
        inverseRotation.m31 = this.m13 * scale;
        inverseRotation.m12 = this.m21 * scale;
        inverseRotation.m22 = this.m22 * scale;
        inverseRotation.m32 = this.m23 * scale;
        inverseRotation.m13 = this.m31 * scale;
        inverseRotation.m23 = this.m32 * scale;
        inverseRotation.m33 = this.m33 * scale;
        return inverseRotation;
    }
    getRotation() {
        let inverseRotation = Matrix4f.constructIdentityMatrix();
        inverseRotation.m11 = this.m11;
        inverseRotation.m21 = this.m21;
        inverseRotation.m31 = this.m31;
        inverseRotation.m12 = this.m12;
        inverseRotation.m22 = this.m22;
        inverseRotation.m32 = this.m32;
        inverseRotation.m13 = this.m13;
        inverseRotation.m23 = this.m23;
        inverseRotation.m33 = this.m33;
        return inverseRotation;
    }
    static constructShadowMatrix(modelView) {
        let planePoint = new Vector3f_1.Vector3f(0, -1.5, 0);
        let planeNormal = new Vector3f_1.Vector3f(0, 1, 0);
        let lightPosition = new Vector3f_1.Vector3f(0, 11, 0);
        //modelView.multiplyArr(new Vector3f(20, 8, 20),lightPosition);
        let d = -planePoint.dot(planeNormal);
        let NdotL = planeNormal.x * lightPosition.x +
            planeNormal.y * lightPosition.y +
            planeNormal.z * lightPosition.z;
        let shadowMatrix = new Matrix4f();
        shadowMatrix.m11 = NdotL + d - lightPosition.x * planeNormal.x;
        shadowMatrix.m12 = -lightPosition.x * planeNormal.y;
        shadowMatrix.m13 = -lightPosition.x * planeNormal.z;
        shadowMatrix.m14 = -lightPosition.x * d;
        shadowMatrix.m21 = -lightPosition.y * planeNormal.x;
        shadowMatrix.m22 = NdotL + d - lightPosition.y * planeNormal.y;
        shadowMatrix.m23 = -lightPosition.y * planeNormal.z;
        shadowMatrix.m24 = -lightPosition.y * d;
        shadowMatrix.m31 = -lightPosition.z * planeNormal.x;
        shadowMatrix.m32 = -lightPosition.z * planeNormal.y;
        shadowMatrix.m33 = NdotL + d - lightPosition.z * planeNormal.z;
        shadowMatrix.m34 = -lightPosition.z * d;
        shadowMatrix.m41 = -planeNormal.x;
        shadowMatrix.m42 = -planeNormal.y;
        shadowMatrix.m43 = -planeNormal.z;
        shadowMatrix.m44 = NdotL;
        return shadowMatrix;
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
    static constructScaleMatrix(sx, sy = sx, sz = sy) {
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
        return new Vector3f_1.Vector3f(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34);
    }
    multiplyHom(vector) {
        return new Vector4f_1.Vector4f(this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w, this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w, this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w, this.m41 * vector.x + this.m42 * vector.y + this.m43 * vector.z + this.m44 * vector.w);
    }
    multiplyHomArr(vector, result) {
        result.x = this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w;
        result.y = this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w;
        result.z = this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w;
    }
    multiplyHomArr2(vector, result) {
        result.x = this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14 * vector.w;
        result.y = this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24 * vector.w;
        result.z = this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34 * vector.w;
        result.w = this.m41 * vector.x + this.m42 * vector.y + this.m43 * vector.z + this.m44 * vector.w;
        result.x /= result.w;
        result.y /= result.w;
        result.z /= result.w;
    }
    multiplyArr(vector, result) {
        result.x = this.m11 * vector.x + this.m12 * vector.y + this.m13 * vector.z + this.m14;
        result.y = this.m21 * vector.x + this.m22 * vector.y + this.m23 * vector.z + this.m24;
        result.z = this.m31 * vector.x + this.m32 * vector.y + this.m33 * vector.z + this.m34;
    }
}
exports.Matrix4f = Matrix4f;


/***/ }),

/***/ "./src/math/Sphere.ts":
/*!****************************!*\
  !*** ./src/math/Sphere.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Sphere {
    constructor(position, radius) {
        this.center = position;
        this.radius = radius;
    }
    /**
     *
     * @param {Plane} plane
     * @returns {boolean}
     * @memberof Sphere
     */
    isInsidePositiveHalfSpace(plane) {
        return plane.getNormal().dot(this.center) - plane.getDistance() > -this.radius;
    }
    getTran(mat) {
        return mat.multiplyHom(this.center);
    }
    getRadius() {
        return this.radius;
    }
    getCenter() {
        return this.center;
    }
}
exports.Sphere = Sphere;


/***/ }),

/***/ "./src/math/Vector3f.ts":
/*!******************************!*\
  !*** ./src/math/Vector3f.ts ***!
  \******************************/
/*! no static exports found */
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
    sub2(vec1, vec2) {
        this.x = vec1.x - vec2.x;
        this.y = vec1.y - vec2.y;
        this.z = vec1.z - vec2.z;
    }
    mul(scal) {
        return new Vector3f(this.x * scal, this.y * scal, this.z * scal);
    }
    add(vec) {
        return new Vector3f(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    add2(vec, vec2) {
        this.x = vec.x + vec2.x;
        this.y = vec.y + vec2.y;
        this.z = vec.z + vec2.z;
    }
    cross(vec) {
        return new Vector3f(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
    }
    cross2(vec1, vec2) {
        this.x = vec1.y * vec2.z - vec1.z * vec2.y;
        this.y = vec1.z * vec2.x - vec1.x * vec2.z;
        this.z = vec1.x * vec2.y - vec1.y * vec2.x;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        let reci = 1.0 / this.length();
        return this.mul(reci);
    }
    normalize2() {
        let reci = 1.0 / this.length();
        this.x *= reci;
        this.y *= reci;
        this.z *= reci;
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
}
exports.Vector3f = Vector3f;


/***/ }),

/***/ "./src/math/Vector4f.ts":
/*!******************************!*\
  !*** ./src/math/Vector4f.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector4f {
    constructor(x, y, z, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    sub(vec) {
        return new Vector4f(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }
    add(vec) {
        return new Vector4f(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w);
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
exports.Vector4f = Vector4f;


/***/ }),

/***/ "./src/math/index.ts":
/*!***************************!*\
  !*** ./src/math/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector4f_1 = __webpack_require__(/*! ./Vector4f */ "./src/math/Vector4f.ts");
exports.Vector4f = Vector4f_1.Vector4f;
var Vector3f_1 = __webpack_require__(/*! ./Vector3f */ "./src/math/Vector3f.ts");
exports.Vector3f = Vector3f_1.Vector3f;
var Matrix3_1 = __webpack_require__(/*! ./Matrix3 */ "./src/math/Matrix3.ts");
exports.Matrix3f = Matrix3_1.Matrix3f;
var Matrix4f_1 = __webpack_require__(/*! ./Matrix4f */ "./src/math/Matrix4f.ts");
exports.Matrix4f = Matrix4f_1.Matrix4f;


/***/ }),

/***/ "./src/rasterizer/TexturedTriangleRasterizer.ts":
/*!******************************************************!*\
  !*** ./src/rasterizer/TexturedTriangleRasterizer.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(/*! ../math/Vector3f */ "./src/math/Vector3f.ts");
class TexturedTriangleRasterizer {
    // requires
    // bob und wbuffer
    constructor(framebuffer) {
        this.framebuffer = framebuffer;
    }
    drawTriangleDDA2(p1, p2, p3) {
        let temp;
        if (p1.position.y > p3.position.y) {
            temp = p1;
            p1 = p3;
            p3 = temp;
        }
        if (p1.position.y > p2.position.y) {
            temp = p1;
            p1 = p2;
            p2 = temp;
        }
        if (p2.position.y > p3.position.y) {
            temp = p2;
            p2 = p3;
            p3 = temp;
        }
        if (p1.position.y === p3.position.y) {
            return;
        } /*else if (p2.y == p3.y) {
            if (p2.x > p3.x) {
                let temp: Vector3f = p2;
                p2 = p3;
                p3 = temp;
            }
            this.fillBottomFlatTriangle(p1, p2, p3, color);
        } else if (p1.y == p2.y) {
            if (p1.x > p2.x) {
                let temp: Vector3f = p1;
                p1 = p2;
                p2 = temp;
            }
            this.fillTopFlatTriangle(p1, p2, p3, color);
        } */
        else {
            let x = (p3.position.x - p1.position.x) * (p2.position.y - p1.position.y) / (p3.position.y - p1.position.y) + p1.position.x;
            if (x > p2.position.x) {
                this.fillLongRightTriangle2(p1, p2, p3);
            }
            else {
                let tex = p1.textureCoordinate;
                let tex2 = p2.textureCoordinate;
                let tex3 = p3.textureCoordinate;
                this.fillLongLeftTriangle2(p1.position, p2.position, p3.position, new Vector3f_1.Vector3f(tex.u, tex.v, 0), new Vector3f_1.Vector3f(tex2.u, tex2.v, 0), new Vector3f_1.Vector3f(tex3.u, tex3.v, 0));
            }
        }
    }
    fillLongRightTriangle2(v1, v2, v3) {
        let yDistanceLeft = v2.position.y - v1.position.y;
        let yDistanceRight = v3.position.y - v1.position.y;
        let slope1 = (v2.position.x - v1.position.x) / yDistanceLeft;
        let slope2 = (v3.position.x - v1.position.x) / yDistanceRight;
        let tslope1u = (v2.textureCoordinate.u / v2.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceLeft;
        let tslope2u = (v3.textureCoordinate.u / v3.position.z - v1.textureCoordinate.u / v1.position.z) / yDistanceRight;
        let tslope1v = (v2.textureCoordinate.v / v2.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceLeft;
        let tslope2v = (v3.textureCoordinate.v / v3.position.z - v1.textureCoordinate.v / v1.position.z) / yDistanceRight;
        let zslope1 = (1 / v2.position.z - 1 / v1.position.z) / yDistanceLeft;
        let zslope2 = (1 / v3.position.z - 1 / v1.position.z) / yDistanceRight;
        let curx1 = v1.position.x;
        let curx2 = v1.position.x;
        let curz1 = 1.0 / v1.position.z;
        let curz2 = 1.0 / v1.position.z;
        let curu1 = v1.textureCoordinate.u / v1.position.z;
        let curv1 = v1.textureCoordinate.v / v1.position.z;
        let curu2 = v1.textureCoordinate.u / v1.position.z;
        let curv2 = v1.textureCoordinate.v / v1.position.z;
        let xPosition = v1.position.x;
        let xPosition2 = v1.position.x;
        let yPosition = v1.position.y;
        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;
            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    /** shading code */
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
            curu1 += tslope1u;
            curu2 += tslope2u;
            curv1 += tslope1v;
            curv2 += tslope2v;
        }
        yDistanceLeft = v3.position.y - v2.position.y;
        slope1 = (v3.position.x - v2.position.x) / yDistanceLeft;
        zslope1 = (1 / v3.position.z - 1 / v2.position.z) / yDistanceLeft;
        tslope1u = (v3.textureCoordinate.u / v3.position.z - v2.textureCoordinate.u / v2.position.z) / yDistanceLeft;
        tslope1v = (v3.textureCoordinate.v / v3.position.z - v2.textureCoordinate.v / v2.position.z) / yDistanceLeft;
        curx1 = v2.position.x;
        curz1 = 1.0 / v2.position.z;
        curu1 = v2.textureCoordinate.u / v2.position.z;
        curv1 = v2.textureCoordinate.v / v2.position.z;
        xPosition = v2.position.x;
        yPosition = v2.position.y;
        for (let i = 0; i < yDistanceLeft; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;
            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
            curu1 += tslope1u;
            curu2 += tslope2u;
            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }
    fillLongLeftTriangle2(v1, v2, v3, t1, t2, t3) {
        let yDistanceRight = v2.y - v1.y;
        let yDistanceLeft = v3.y - v1.y;
        let slope2 = (v2.x - v1.x) / yDistanceRight;
        let slope1 = (v3.x - v1.x) / yDistanceLeft;
        let tslope1u = (t3.x / v3.z - t1.x / v1.z) / yDistanceLeft;
        let tslope2u = (t2.x / v2.z - t1.x / v1.z) / yDistanceRight;
        let tslope1v = (t3.y / v3.z - t1.y / v1.z) / yDistanceLeft;
        let tslope2v = (t2.y / v2.z - t1.y / v1.z) / yDistanceRight;
        let zslope2 = (1 / v2.z - 1 / v1.z) / yDistanceRight;
        let zslope1 = (1 / v3.z - 1 / v1.z) / yDistanceLeft;
        let curx1 = v1.x;
        let curx2 = v1.x;
        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;
        let curu1 = t1.x / v1.z;
        let curv1 = t1.y / v1.z;
        let curu2 = t1.x / v1.z;
        let curv2 = t1.y / v1.z;
        let xPosition = v1.x;
        let xPosition2 = v1.x;
        let yPosition = v1.y;
        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;
            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
            curu1 += tslope1u;
            curu2 += tslope2u;
            curv1 += tslope1v;
            curv2 += tslope2v;
        }
        yDistanceRight = v3.y - v2.y;
        slope2 = (v3.x - v2.x) / yDistanceRight;
        zslope2 = (1 / v3.z - 1 / v2.z) / yDistanceRight;
        tslope2u = (t3.x / v3.z - t2.x / v2.z) / yDistanceRight;
        tslope2v = (t3.y / v3.z - t2.y / v2.z) / yDistanceRight;
        curx2 = v2.x;
        curz2 = 1.0 / v2.z;
        curu2 = t2.x / v2.z;
        curv2 = t2.y / v2.z;
        xPosition2 = v2.x;
        yPosition = v2.y;
        for (let i = 0; i < yDistanceRight; i++) {
            let length = Math.round(xPosition2) - Math.round(xPosition);
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition);
            let spanzStep = (curz2 - curz1) / length;
            let spanuStep = (curu2 - curu1) / length;
            let spanvStep = (curv2 - curv1) / length;
            let wStart = curz1;
            let uStart = curu1;
            let vStart = curv1;
            for (let j = 0; j < length; j++) {
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.framebuffer.bob.width), this.framebuffer.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.framebuffer.bob.height), this.framebuffer.bob.height - 1), 0) | 0;
                    let color2 = this.framebuffer.bob.texture[u + v * this.framebuffer.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer.framebuffer[framebufferIndex] = color2;
                }
                framebufferIndex++;
                wStart += spanzStep;
                uStart += spanuStep;
                vStart += spanvStep;
            }
            xPosition += slope1;
            xPosition2 += slope2;
            yPosition++;
            curx1 += slope1;
            curx2 += slope2;
            curz1 += zslope1;
            curz2 += zslope2;
            curu1 += tslope1u;
            curu2 += tslope2u;
            curv1 += tslope1v;
            curv2 += tslope2v;
        }
    }
}
exports.TexturedTriangleRasterizer = TexturedTriangleRasterizer;


/***/ }),

/***/ "./src/rasterizer/TriangleRasterizer.ts":
/*!**********************************************!*\
  !*** ./src/rasterizer/TriangleRasterizer.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TriangleRasterizer {
    constructor(framebuffer) {
        this.framebuffer = framebuffer;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
                if (wStart < this.framebuffer.wBuffer[framebufferIndex]) {
                    this.framebuffer.wBuffer[framebufferIndex] = wStart;
                    this.framebuffer.framebuffer[framebufferIndex] = color;
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
}
exports.TriangleRasterizer = TriangleRasterizer;


/***/ }),

/***/ "./src/rendering-pipelines/AbstractRenderingPipeline.ts":
/*!**************************************************************!*\
  !*** ./src/rendering-pipelines/AbstractRenderingPipeline.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CullFace_1 = __webpack_require__(/*! ../CullFace */ "./src/CullFace.ts");
class AbstractRenderingPipeline {
    constructor(framebuffer) {
        this.framebuffer = framebuffer;
        this.NEAR_PLANE_Z = -1.7;
        this.cullMode = CullFace_1.CullFace.BACK;
    }
    setCullFace(face) {
        this.cullMode = face;
    }
    isInFrontOfNearPlane(p) {
        return p.z < this.NEAR_PLANE_Z;
    }
    /**
     * based on signed polygon area computation:
     * http://www.faqs.org/faqs/graphics/algorithms-faq/
     * https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
     * http://csharphelper.com/blog/2014/07/calculate-the-area-of-a-polygon-in-c/
     * http://mathworld.wolfram.com/PolygonArea.html
     *
     * @private
     * @param {{ x: number, y: number, z: number }} v1
     * @param {{ x: number, y: number, z: number }} v2
     * @param {{ x: number, y: number, z: number }} v3
     * @returns {boolean}
     * @memberof Framebuffer
     *
     */
    isTriangleCCW(v1, v2, v3) {
        const det = v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v1.y - v1.x * v3.y;
        if (this.cullMode === CullFace_1.CullFace.BACK) {
            return det < 0.0;
        }
        else {
            return det > 0.0;
        }
    }
    isTriangleCCW2(v1, v2, v3, v4) {
        const det = v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v4.y - v4.x * v3.y +
            v4.x * v1.y - v1.x * v4.y;
        if (this.cullMode === CullFace_1.CullFace.BACK) {
            return det < 0.0;
        }
        else {
            return det > 0.0;
        }
    }
}
exports.AbstractRenderingPipeline = AbstractRenderingPipeline;


/***/ }),

/***/ "./src/rendering-pipelines/FlatShadingRenderingPipeline.ts":
/*!*****************************************************************!*\
  !*** ./src/rendering-pipelines/FlatShadingRenderingPipeline.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(/*! ../core/Color */ "./src/core/Color.ts");
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
const SutherlandHodgman2DClipper_1 = __webpack_require__(/*! ../screen-space-clipping/SutherlandHodgman2DClipper */ "./src/screen-space-clipping/SutherlandHodgman2DClipper.ts");
const AbstractRenderingPipeline_1 = __webpack_require__(/*! ./AbstractRenderingPipeline */ "./src/rendering-pipelines/AbstractRenderingPipeline.ts");
/**
 * TODO:
 * - object with position, rotation, material, color
 * - remove tempp matrix objects: instead store one global MV  matrix and manipulate
 *   it directly without generating temp amtrices every frame
 * - no lighting for culled triangles
 * - only z clip if necessary (no clip, fully visible)
 * Optimization:
 * - no shading / only texture mapping (use function pointers to set correct rasterization function)
 * - use delta step method from black art of 3d programming
 * - generate object only once
 * - dont use temp arrays / instead use always the same array preallocated
 */
class FlatShadingRenderingPipeline extends AbstractRenderingPipeline_1.AbstractRenderingPipeline {
    constructor() {
        super(...arguments);
        this.flatShading = false;
        this.lightDirection = new math_1.Vector4f(0.5, 0.5, 0.3, 0.0).normalize();
    }
    draw(mesh, modelViewMartrix, red, green, blue) {
        const normalMatrix = modelViewMartrix.computeNormalMatrix();
        for (let i = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }
        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }
        for (let i = 0; i < mesh.faces.length; i++) {
            const v1 = mesh.transformedPoints[mesh.faces[i].v1];
            const v2 = mesh.transformedPoints[mesh.faces[i].v2];
            const v3 = mesh.transformedPoints[mesh.faces[i].v3];
            const normal = mesh.transformedNormals[mesh.faces[i].normal];
            if (this.isInFrontOfNearPlane(v1) && this.isInFrontOfNearPlane(v2) && this.isInFrontOfNearPlane(v3)) {
                const projected = [
                    this.framebuffer.project(v1),
                    this.framebuffer.project(v2),
                    this.framebuffer.project(v3)
                ];
                this.renderConvexPolygon(projected, normal, red, green, blue);
            }
            else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            }
            else {
                const output = this.zClipTriangle(new Array(v1, v2, v3));
                if (output.length < 3) {
                    return;
                }
                const projected = output.map((v) => {
                    return this.framebuffer.project(v);
                });
                this.renderConvexPolygon(projected, normal, red, green, blue);
            }
        }
    }
    computeNearPlaneIntersection(p1, p2) {
        const ratio = (this.NEAR_PLANE_Z - p1.z) / (p2.z - p1.z);
        return new math_1.Vector4f(ratio * (p2.x - p1.x) + p1.x, ratio * (p2.y - p1.y) + p1.y, this.NEAR_PLANE_Z);
    }
    zClipTriangle(subject) {
        const input = subject;
        const output = new Array();
        let S = input[input.length - 1];
        for (let i = 0; i < input.length; i++) {
            const point = input[i];
            if (this.isInFrontOfNearPlane(point)) {
                if (!this.isInFrontOfNearPlane(S)) {
                    output.push(this.computeNearPlaneIntersection(S, point));
                }
                output.push(point);
            }
            else if (this.isInFrontOfNearPlane(S)) {
                output.push(this.computeNearPlaneIntersection(S, point));
            }
            S = point;
        }
        return output;
    }
    renderConvexPolygon(projected, normal, red, green, blue) {
        if (projected.length === 3 &&
            !this.isTriangleCCW(projected[0], projected[1], projected[2])) {
            return;
        }
        if (projected.length === 4 &&
            !this.isTriangleCCW2(projected[0], projected[1], projected[2], projected[3])) {
            return;
        }
        const clippedPolygon = SutherlandHodgman2DClipper_1.SutherlandHodgman2DClipper.clipConvexPolygon(projected);
        if (clippedPolygon.length < 3) {
            return;
        }
        const color = this.computeColor(normal, this.lightDirection, red, green, blue);
        this.triangulateConvexPolygon(clippedPolygon, color);
    }
    triangulateConvexPolygon(clippedPolygon, color) {
        for (let j = 0; j < clippedPolygon.length - 2; j++) {
            this.framebuffer.triangleRasterizer.drawTriangleDDA(clippedPolygon[0], clippedPolygon[1 + j], clippedPolygon[2 + j], color);
        }
    }
    computeColor(normal, lightDirection, red, green, blue) {
        if (this.flatShading) {
            return 255 << 24 | blue << 16 | green << 8 | red;
        }
        // TODO: do lighting only if triangle is visible
        let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
        scalar = scalar * 0.85 + 0.15;
        return new Color_1.Color(scalar * red, scalar * green, scalar * blue, 255).toPackedFormat();
    }
}
exports.FlatShadingRenderingPipeline = FlatShadingRenderingPipeline;


/***/ }),

/***/ "./src/rendering-pipelines/TexturingRenderingPipeline.ts":
/*!***************************************************************!*\
  !*** ./src/rendering-pipelines/TexturingRenderingPipeline.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
const Vertex_1 = __webpack_require__(/*! ../Vertex */ "./src/Vertex.ts");
const AbstractRenderingPipeline_1 = __webpack_require__(/*! ./AbstractRenderingPipeline */ "./src/rendering-pipelines/AbstractRenderingPipeline.ts");
class TexturingRenderingPipeline extends AbstractRenderingPipeline_1.AbstractRenderingPipeline {
    draw(mesh, modelViewMartrix) {
        for (let i = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.points2[i]);
        }
        const vertexArray = new Array(new Vertex_1.Vertex(), new Vertex_1.Vertex(), new Vertex_1.Vertex());
        for (let i = 0; i < mesh.faces.length; i++) {
            const v1 = mesh.points2[mesh.faces[i].vertices[0]];
            const v2 = mesh.points2[mesh.faces[i].vertices[1]];
            const v3 = mesh.points2[mesh.faces[i].vertices[2]];
            if (this.isInFrontOfNearPlane(v1) &&
                this.isInFrontOfNearPlane(v2) &&
                this.isInFrontOfNearPlane(v3)) {
                const p1 = this.project(v1);
                const p2 = this.project(v2);
                const p3 = this.project(v3);
                if (this.isTriangleCCW(p1, p2, p3)) {
                    vertexArray[0].position = p1; // p1 is Vector3f
                    vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];
                    vertexArray[1].position = p2;
                    vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];
                    vertexArray[2].position = p3;
                    vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];
                    this.framebuffer.clipConvexPolygon2(vertexArray);
                }
            }
            else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            }
            else {
                vertexArray[0].position = v1; // v1 is Vector4f
                vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];
                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];
                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];
                this.zClipTriangle2(vertexArray);
            }
        }
    }
    project(t1) {
        return new math_1.Vector4f(Math.round((320 / 2) + (292 * t1.x / (-t1.z))), Math.round((200 / 2) - (t1.y * 292 / (-t1.z))), t1.z);
    }
    computeNearPlaneIntersection2(p1, p2) {
        const ratio = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        const vertex = new Vertex_1.Vertex();
        vertex.position = new math_1.Vector4f(ratio * (p2.position.x - p1.position.x) + p1.position.x, ratio * (p2.position.y - p1.position.y) + p1.position.y, this.NEAR_PLANE_Z);
        vertex.textureCoordinate = new Vertex_1.TextureCoordinate(ratio * (p2.textureCoordinate.u - p1.textureCoordinate.u) + p1.textureCoordinate.u, ratio * (p2.textureCoordinate.v - p1.textureCoordinate.v) + p1.textureCoordinate.v);
        return vertex;
    }
    zClipTriangle2(subject) {
        const input = subject;
        const output = new Array();
        let S = input[input.length - 1];
        for (let i = 0; i < input.length; i++) {
            const point = input[i];
            if (this.isInFrontOfNearPlane(point.position)) {
                if (!this.isInFrontOfNearPlane(S.position)) {
                    output.push(this.computeNearPlaneIntersection2(S, point));
                }
                output.push(point);
            }
            else if (this.isInFrontOfNearPlane(S.position)) {
                output.push(this.computeNearPlaneIntersection2(S, point));
            }
            S = point;
        }
        if (output.length < 3) {
            return;
        }
        const projected = output.map((v) => {
            v.position = this.project(v.position);
            return v;
        });
        if (output.length === 3 &&
            !this.isTriangleCCW(projected[0].position, projected[1].position, projected[2].position)) {
            return;
        }
        if (output.length === 4 &&
            !this.isTriangleCCW2(projected[0].position, projected[1].position, projected[2].position, projected[3].position)) {
            return;
        }
        this.framebuffer.clipConvexPolygon2(projected);
    }
}
exports.TexturingRenderingPipeline = TexturingRenderingPipeline;


/***/ }),

/***/ "./src/scenes/AbstractScene.ts":
/*!*************************************!*\
  !*** ./src/scenes/AbstractScene.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AbstractScene {
    init(framebuffer) {
        return Promise.all([]);
    }
}
exports.AbstractScene = AbstractScene;


/***/ }),

/***/ "./src/screen-space-clipping/AbstractClipEdge.ts":
/*!*******************************************************!*\
  !*** ./src/screen-space-clipping/AbstractClipEdge.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO:
// - use polymorphism in order to have different intersection methods
// - one for plain clipping / one for tex coords / one for multitexturing / gouraud shading etc
class AbstractClipEdge {
}
exports.AbstractClipEdge = AbstractClipEdge;


/***/ }),

/***/ "./src/screen-space-clipping/BottomClipEdge.ts":
/*!*****************************************************!*\
  !*** ./src/screen-space-clipping/BottomClipEdge.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(/*! ../Framebuffer */ "./src/Framebuffer.ts");
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
const Vertex_1 = __webpack_require__(/*! ../Vertex */ "./src/Vertex.ts");
const AbstractClipEdge_1 = __webpack_require__(/*! ./AbstractClipEdge */ "./src/screen-space-clipping/AbstractClipEdge.ts");
class BottomClipEdge extends AbstractClipEdge_1.AbstractClipEdge {
    isInside(p) {
        return p.y >= Framebuffer_1.Framebuffer.minWindow.y;
    }
    isInside2(p) {
        return p.position.y >= Framebuffer_1.Framebuffer.minWindow.y;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Math.round(p1.x + (p2.x - p1.x) * (Framebuffer_1.Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)), Framebuffer_1.Framebuffer.minWindow.y, 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer_1.Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)));
    }
    computeIntersection2(p1, p2) {
        const vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector4f(Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer_1.Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)), Framebuffer_1.Framebuffer.minWindow.y, 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)));
        const textCoord = new Vertex_1.TextureCoordinate();
        const z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
exports.BottomClipEdge = BottomClipEdge;


/***/ }),

/***/ "./src/screen-space-clipping/CohenSutherlandLineClipper.ts":
/*!*****************************************************************!*\
  !*** ./src/screen-space-clipping/CohenSutherlandLineClipper.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(/*! ../Framebuffer */ "./src/Framebuffer.ts");
const Vector3f_1 = __webpack_require__(/*! ../math/Vector3f */ "./src/math/Vector3f.ts");
class CohenSutherlandLineClipper {
    constructor(framebuffer) {
        this.framebuffer = framebuffer;
    }
    cohenSutherlandLineClipper(start, end, col) {
        let p1 = new Vector3f_1.Vector3f(start.x, start.y, start.z);
        let p2 = new Vector3f_1.Vector3f(end.x, end.y, end.z);
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
                if (code1 == CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    let tempCode = code1;
                    code1 = code2;
                    code2 = tempCode;
                    let tempPoint = p1;
                    p1 = p2;
                    p2 = tempPoint;
                }
                if ((code1 & CohenSutherlandLineClipper.REGION_CODE_TOP) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer_1.Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer_1.Framebuffer.maxWindow.y;
                }
                else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_BOTTOM) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer_1.Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer_1.Framebuffer.minWindow.y;
                }
                else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_RIGHT) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.y = Math.round(p1.y + (p2.y - p1.y) * (Framebuffer_1.Framebuffer.maxWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer_1.Framebuffer.maxWindow.x;
                }
                else if ((code1 & CohenSutherlandLineClipper.REGION_CODE_LEFT) != CohenSutherlandLineClipper.REGION_CODE_CENTER) {
                    p1.y = Math.round(p1.y + (p2.y - p1.y) * (Framebuffer_1.Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer_1.Framebuffer.minWindow.x;
                }
                code1 = this.computeRegionCode(p1);
            }
        }
        if (accept) {
            this.framebuffer.drawLineDDA(p1, p2, col);
        }
    }
    isTrivialAccept(code1, code2) {
        return (code1 | code2) === CohenSutherlandLineClipper.REGION_CODE_CENTER;
    }
    isTrivialReject(code1, code2) {
        return (code1 & code2) !== CohenSutherlandLineClipper.REGION_CODE_CENTER;
    }
    computeRegionCode(point) {
        let regionCode = CohenSutherlandLineClipper.REGION_CODE_CENTER;
        if (point.x < Framebuffer_1.Framebuffer.minWindow.x) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_LEFT;
        }
        else if (point.x > Framebuffer_1.Framebuffer.maxWindow.x) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_RIGHT;
        }
        if (point.y < Framebuffer_1.Framebuffer.minWindow.y) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_BOTTOM;
        }
        else if (point.y > Framebuffer_1.Framebuffer.maxWindow.y) {
            regionCode |= CohenSutherlandLineClipper.REGION_CODE_TOP;
        }
        return regionCode;
    }
}
CohenSutherlandLineClipper.REGION_CODE_CENTER = 0b0000;
CohenSutherlandLineClipper.REGION_CODE_LEFT = 0b0001;
CohenSutherlandLineClipper.REGION_CODE_RIGHT = 0b0010;
CohenSutherlandLineClipper.REGION_CODE_BOTTOM = 0b0100;
CohenSutherlandLineClipper.REGION_CODE_TOP = 0b1000;
exports.CohenSutherlandLineClipper = CohenSutherlandLineClipper;


/***/ }),

/***/ "./src/screen-space-clipping/LeftClipEdge.ts":
/*!***************************************************!*\
  !*** ./src/screen-space-clipping/LeftClipEdge.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractClipEdge_1 = __webpack_require__(/*! ./AbstractClipEdge */ "./src/screen-space-clipping/AbstractClipEdge.ts");
const Vector3f_1 = __webpack_require__(/*! ../math/Vector3f */ "./src/math/Vector3f.ts");
const Vertex_1 = __webpack_require__(/*! ../Vertex */ "./src/Vertex.ts");
const Framebuffer_1 = __webpack_require__(/*! ../Framebuffer */ "./src/Framebuffer.ts");
const Vector4f_1 = __webpack_require__(/*! ../math/Vector4f */ "./src/math/Vector4f.ts");
class LeftClipEdge extends AbstractClipEdge_1.AbstractClipEdge {
    isInside(p) {
        return p.x >= 0;
    }
    isInside2(p) {
        return p.position.x >= 0;
    }
    computeIntersection(p1, p2) {
        return new Vector3f_1.Vector3f(Framebuffer_1.Framebuffer.minWindow.x, Math.round(p1.y + (p2.y - p1.y) * (Framebuffer_1.Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)), 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer_1.Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new Vector4f_1.Vector4f(Framebuffer_1.Framebuffer.minWindow.x, Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer_1.Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)), 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer_1.Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
exports.LeftClipEdge = LeftClipEdge;


/***/ }),

/***/ "./src/screen-space-clipping/RightClipEdge.ts":
/*!****************************************************!*\
  !*** ./src/screen-space-clipping/RightClipEdge.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(/*! ../Framebuffer */ "./src/Framebuffer.ts");
const Vector3f_1 = __webpack_require__(/*! ../math/Vector3f */ "./src/math/Vector3f.ts");
const Vertex_1 = __webpack_require__(/*! ../Vertex */ "./src/Vertex.ts");
const AbstractClipEdge_1 = __webpack_require__(/*! ./AbstractClipEdge */ "./src/screen-space-clipping/AbstractClipEdge.ts");
const Vector4f_1 = __webpack_require__(/*! ../math/Vector4f */ "./src/math/Vector4f.ts");
class RightClipEdge extends AbstractClipEdge_1.AbstractClipEdge {
    isInside(p) {
        return p.x < 320;
    }
    isInside2(p) {
        return p.position.x < 320;
    }
    computeIntersection(p1, p2) {
        return new Vector3f_1.Vector3f(Framebuffer_1.Framebuffer.maxWindow.x + 1, Math.round(p1.y + (p2.y - p1.y) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x)), 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new Vector4f_1.Vector4f(Framebuffer_1.Framebuffer.maxWindow.x + 1, Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)), 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
exports.RightClipEdge = RightClipEdge;


/***/ }),

/***/ "./src/screen-space-clipping/SutherlandHodgman2DClipper.ts":
/*!*****************************************************************!*\
  !*** ./src/screen-space-clipping/SutherlandHodgman2DClipper.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RightClipEdge_1 = __webpack_require__(/*! ./RightClipEdge */ "./src/screen-space-clipping/RightClipEdge.ts");
const LeftClipEdge_1 = __webpack_require__(/*! ./LeftClipEdge */ "./src/screen-space-clipping/LeftClipEdge.ts");
const BottomClipEdge_1 = __webpack_require__(/*! ./BottomClipEdge */ "./src/screen-space-clipping/BottomClipEdge.ts");
const TopClipEdge_1 = __webpack_require__(/*! ./TopClipEdge */ "./src/screen-space-clipping/TopClipEdge.ts");
class SutherlandHodgman2DClipper {
    /**
     * FIXME: optimize by minimizing creation of new arrays
     *
     * @param {Vector3f} v1
     * @param {Vector3f} v2
     * @param {Vector3f} v3
     * @param {number} color
     * @returns {void}
     * @memberof Framebuffer
     */
    static clipConvexPolygon(subject) {
        let output = subject;
        for (let j = 0; j < SutherlandHodgman2DClipper.clipRegion.length; j++) {
            const edge = SutherlandHodgman2DClipper.clipRegion[j];
            const input = output;
            output = new Array();
            let S = input[input.length - 1];
            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                if (edge.isInside(point)) {
                    if (!edge.isInside(S)) {
                        output.push(edge.computeIntersection(S, point));
                    }
                    output.push(point);
                }
                else if (edge.isInside(S)) {
                    output.push(edge.computeIntersection(S, point));
                }
                S = point;
            }
        }
        return output;
    }
}
SutherlandHodgman2DClipper.clipRegion = new Array(new RightClipEdge_1.RightClipEdge(), new LeftClipEdge_1.LeftClipEdge(), new BottomClipEdge_1.BottomClipEdge(), new TopClipEdge_1.TopClipEdge());
exports.SutherlandHodgman2DClipper = SutherlandHodgman2DClipper;


/***/ }),

/***/ "./src/screen-space-clipping/TopClipEdge.ts":
/*!**************************************************!*\
  !*** ./src/screen-space-clipping/TopClipEdge.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Framebuffer_1 = __webpack_require__(/*! ../Framebuffer */ "./src/Framebuffer.ts");
const math_1 = __webpack_require__(/*! ../math */ "./src/math/index.ts");
const Vertex_1 = __webpack_require__(/*! ../Vertex */ "./src/Vertex.ts");
const AbstractClipEdge_1 = __webpack_require__(/*! ./AbstractClipEdge */ "./src/screen-space-clipping/AbstractClipEdge.ts");
class TopClipEdge extends AbstractClipEdge_1.AbstractClipEdge {
    isInside(p) {
        return p.y < Framebuffer_1.Framebuffer.maxWindow.y + 1;
    }
    isInside2(p) {
        return p.position.y < Framebuffer_1.Framebuffer.maxWindow.y + 1;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Math.round(p1.x + (p2.x - p1.x) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.y) / (p2.y - p1.y)), Framebuffer_1.Framebuffer.maxWindow.y + 1, 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.y) / (p2.y - p1.y)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector4f(Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)), Framebuffer_1.Framebuffer.maxWindow.y + 1, 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer_1.Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
exports.TopClipEdge = TopClipEdge;


/***/ }),

/***/ "./src/texture/Texture.ts":
/*!********************************!*\
  !*** ./src/texture/Texture.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Texture {
    constructor(texture, width, height) {
        this.texture = texture;
        this.width = width;
        this.height = height;
    }
    getPixel(texture, x, y) {
        return texture.texture[(x & 0xff) + (y & 0xff) * 256];
    }
    getBilinearFilteredPixel(x, y) {
        let x0 = (((x | 0) % 256) + 256) % 256;
        let x1 = ((((x + 1) | 0) % 256) + 256) % 256;
        let y0 = (((y | 0) % 256) + 256) % 256;
        let y1 = ((((y + 1) | 0) % 256) + 256) % 256;
        let x0y0 = this.getPixel(this, x0, y0) & 0xff;
        let x1y0 = this.getPixel(this, x1, y0) & 0xff;
        let x0y1 = this.getPixel(this, x0, y1) & 0xff;
        let x1y1 = this.getPixel(this, x1, y1) & 0xff;
        let col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        let col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        let col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));
        return col;
    }
    getBilinearFilteredPixel2(x, y) {
        let x0 = Math.min(x | 0, this.width - 1);
        let x1 = Math.min((x | 0) + 1, this.width - 1);
        let y0 = Math.min(y | 0, this.height - 1);
        let y1 = Math.min((y | 0) + 1, this.height - 1);
        let x0y0 = this.getPixel2(this, x0, y0);
        let x1y0 = this.getPixel2(this, x1, y0);
        let x0y1 = this.getPixel2(this, x0, y1);
        let x1y1 = this.getPixel2(this, x1, y1);
        return this.interpolateComp(x, y, x0y0 & 0xff, x1y0 & 0xff, x0y1 & 0xff, x1y1 & 0xff) |
            this.interpolateComp(x, y, x0y0 >> 8 & 0xff, x1y0 >> 8 & 0xff, x0y1 >> 8 & 0xff, x1y1 >> 8 & 0xff) << 8 |
            this.interpolateComp(x, y, x0y0 >> 16 & 0xff, x1y0 >> 16 & 0xff, x0y1 >> 16 & 0xff, x1y1 >> 16 & 0xff) << 16;
    }
    getPixel2(texture, x, y) {
        return this.texture[x + y * this.width];
    }
    interpolateComp(x, y, x0y0, x1y0, x0y1, x1y1) {
        let col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        let col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        let col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));
        return col;
    }
}
exports.Texture = Texture;


/***/ }),

/***/ "./src/texture/TextureUtils.ts":
/*!*************************************!*\
  !*** ./src/texture/TextureUtils.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RandomNumberGenerator_1 = __webpack_require__(/*! ../RandomNumberGenerator */ "./src/RandomNumberGenerator.ts");
const Texture_1 = __webpack_require__(/*! ./Texture */ "./src/texture/Texture.ts");
class TextureUtils {
    static generateProceduralNoise() {
        return new Promise((resolve) => {
            const texture = new Texture_1.Texture();
            texture.texture = new Uint32Array(256 * 256);
            const rng = new RandomNumberGenerator_1.default();
            rng.setSeed(100);
            for (let i = 0; i < 256 * 256; i++) {
                const scale = rng.getFloat();
                texture.texture[i] = 200 * scale | 255 * scale << 8 | 205 * scale << 16 | 255 << 24;
            }
            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }
    static generateProceduralParticleTexture() {
        return new Promise((resolve) => {
            const texture = new Texture_1.Texture();
            texture.texture = new Uint32Array(256 * 256);
            let rng = new RandomNumberGenerator_1.default();
            rng.setSeed(100);
            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x;
                    let dy = 127 - y;
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c * c;
                    if (r > 1)
                        c = 0;
                    c = Math.min(1, c * 2.9);
                    texture.texture[x + y * 256] = 235 | 255 << 8 | 235 << 16 | (c * 255) << 24;
                }
            }
            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }
    static generateProceduralParticleTexture2() {
        return new Promise((resolve) => {
            const texture = new Texture_1.Texture();
            texture.texture = new Uint32Array(256 * 256);
            let rng = new RandomNumberGenerator_1.default();
            rng.setSeed(100);
            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    let dx = 127 - x;
                    let dy = 127 - y;
                    let r = Math.sqrt(dx * dx + dy * dy) / 127;
                    let c = 1 - r;
                    c = c * c;
                    if (r > 1)
                        c = 0;
                    c = Math.min(1, c * 40);
                    texture.texture[x + y * 256] = 255 | 205 << 8 | 255 << 16 | (c * 255) << 24;
                }
            }
            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }
    static load(filename, transparency) {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const texture = new Texture_1.Texture();
                texture.texture = this.getImageData(image, transparency);
                texture.width = image.width;
                texture.height = image.height;
                resolve(texture);
            };
            image.onerror = () => resolve();
            image.src = filename;
        });
    }
    static getImageData(image, withAlpha = false) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, image.width, image.height).data;
        const conv = new Uint32Array(data.length / 4);
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
}
exports.TextureUtils = TextureUtils;


/***/ }),

/***/ "./src/texture/index.ts":
/*!******************************!*\
  !*** ./src/texture/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Texture_1 = __webpack_require__(/*! ./Texture */ "./src/texture/Texture.ts");
exports.Texture = Texture_1.Texture;
var TextureUtils_1 = __webpack_require__(/*! ./TextureUtils */ "./src/texture/TextureUtils.ts");
exports.TextureUtils = TextureUtils_1.TextureUtils;


/***/ })

/******/ });
//# sourceMappingURL=gears.bundle.js.map