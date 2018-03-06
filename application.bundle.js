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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector4f_1 = __webpack_require__(3);
exports.Vector4f = Vector4f_1.Vector4f;
var Vector3f_1 = __webpack_require__(1);
exports.Vector3f = Vector3f_1.Vector3f;
var Matrix3_1 = __webpack_require__(12);
exports.Matrix3f = Matrix3_1.Matrix3f;
var Matrix4f_1 = __webpack_require__(13);
exports.Matrix4f = Matrix4f_1.Matrix4f;


/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CullFace;
(function (CullFace) {
    CullFace[CullFace["FRONT"] = 0] = "FRONT";
    CullFace[CullFace["BACK"] = 1] = "BACK";
})(CullFace = exports.CullFace || (exports.CullFace = {}));


/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BasicCamera_1 = __webpack_require__(5);
exports.BasicCamera = BasicCamera_1.BasicCamera;
var ControllableCamera_1 = __webpack_require__(19);
exports.ControllableCamera = ControllableCamera_1.ControllableCamera;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(0);
class BasicCamera {
    constructor(position, yaw, pitch, roll) {
        this.position = position;
        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
    }
    getViewMatrix() {
        let roll = math_1.Matrix4f.constructZRotationMatrix(-this.roll);
        let pitch = math_1.Matrix4f.constructXRotationMatrix(-this.pitch);
        let yaw = math_1.Matrix4f.constructYRotationMatrix(-this.yaw);
        let translation = math_1.Matrix4f.constructTranslationMatrix(-this.position.x, -this.position.y, -this.position.z);
        return roll.multiplyMatrix(pitch).multiplyMatrix(yaw).multiplyMatrix(translation);
    }
}
exports.BasicCamera = BasicCamera;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Texture {
    constructor(texture, width, height) {
        this.texture = texture;
        this.width = width;
        this.height = height;
    }
}
exports.default = Texture;


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AISA = __webpack_require__(9);
class Application {
    main() {
        const canvas = new AISA.Canvas(320, 200);
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }
}
new Application().main();


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CullFace_1 = __webpack_require__(2);
const Framebuffer_1 = __webpack_require__(10);
const RandomNumberGenerator_1 = __webpack_require__(7);
const Texture_1 = __webpack_require__(6);
class Canvas {
    constructor(width, height) {
        this.fpsStartTime = Date.now();
        this.fpsCount = 0;
        this.fps = 0;
        this.accumulationBuffer = new Uint32Array(320 * 200);
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
        this.framebuffer = new Framebuffer_1.default(320, 200);
        this.boundRenderLoop = this.renderLoop.bind(this);
    }
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
    render() {
        const currentTime = Date.now();
        if (currentTime > this.fpsStartTime + 1000) {
            this.fpsStartTime = currentTime;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;
        let time = (Date.now() - this.start);
        time = time * 3 + 550000;
        time = time % (850000);
        this.framebuffer.setCullFace(CullFace_1.CullFace.FRONT);
        /*
                if (time < 5000) {
                    this.framebuffer.drawTitanEffect();
                    this.framebuffer.shadingTorus(time * 0.02);
                    this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
                } else if (time < 15000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.draw(this.texture, time);
                } else if (time < 25000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.drawLens(this.texture5, this.texture6, time);
                } else if (time < 30000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.shadingDemo(time * 0.02);
                } else if (time < 35000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.shadingSphere(time * 0.01);
                } else if (time < 40000) {
                    this.framebuffer.drawRotoZoomer(this.texture);
                    this.framebuffer.wireFrameSphereClipping(time * 0.01);
                } else if (time < 45000) {
                    this.framebuffer.drawVoxelLandscape2(this.heightmap, time);
                    this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
                } else if (time < 50000) {
                    this.framebuffer.drawOldSchoolPlasma(time);
                } else if (time < 55000) {
                    // https://www.youtube.com/watch?v=ccYLb7cLB1I&t=773s
                    this.framebuffer.drawMetaballs();
                } else if (time < 60000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.shadingTorus2(time * 0.02);
                } else if (time < 70000) {
                    this.framebuffer.floodFill(this.texture5, time - 60000);
                } else if (time < 80000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.drawBobs(this.texture7, time);
                } else if (time < 95000) {
                    this.framebuffer.blockFace(this.texture5, time, 80000);
                } else if (time < 140000) {
                    this.framebuffer.scrollingBackground(this.texture8, time - 95000);
                } else if (time < 160000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture9.texture);
                    this.framebuffer.cinematicScroller(this.texture4, time - 140000);
                } else if (time < 185000) {
                    this.framebuffer.shadingSphereClip((time - 170000) * 0.003);
                    this.framebuffer.cinematicScroller(this.texture4, time - 160000);
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
                } else if (time < 250000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.reproduceRazorScene(time * 0.003);
                    this.framebuffer.drawLensFlare(time - 185000, [
                        { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                        { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                        { tex: this.texture13, scale: 1.6, alpha: 0.25 }
                    ]);
                } else if (time < 260000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.led(time, this.texture14);
                    this.framebuffer.reflectionBunny(time * 0.002);
                } else if (time < 270000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.drawBlenderScene(time - 260000, this.texture4);
                } else if (time < 280000) {
                    this.framebuffer.drawStarField(time * 0.9);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.reflectionBunny(time * 0.002);
                    this.framebuffer.scene7(time * 0.2, this.texture7);
                } else if (time < 290000) {
                    this.framebuffer.drawPlaneDeformation(time, this.metal);
                    this.framebuffer.drawTexture(32, 69, this.texture2, 1.0);
                } else if (time < 330000) {
                    this.framebuffer.drawLedTunnel(time, this.texture14);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 360000) {
                    this.framebuffer.drawParticleTorus(time, this.particleTexture);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 380000) {
                    this.framebuffer.drawPlanedeformationTunnel(time, this.heightmap, this.metal);
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 15, smashTime) -
                        this.framebuffer.cosineInterpolate(15, 200, smashTime) +
                        0.4 * this.framebuffer.cosineInterpolate(200, 300, smashTime) -
                        0.4 * this.framebuffer.cosineInterpolate(300, 400, smashTime)) * 35;
                    this.framebuffer.drawScaledTextureClipBi((320 / 2 - (this.hoodlumLogo.width + smash) / 2) | 0,
                        (200 / 2 - (this.hoodlumLogo.height - smash) / 2) | 0, this.hoodlumLogo.width + smash, (this.hoodlumLogo.height - smash) | 0, this.hoodlumLogo, 1.0);
                } else if (time < 400000) {
                    // THE NEXT LINE IS THE BOTTLENECK NOT THE SPHERE!
                    this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 420000) {
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.texture5.texture);
                    this.framebuffer.shadingSphereEnv(time * 0.0002);
                } else if (time < 440000) {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
                    this.framebuffer.glitchScreen(time, this.noise);
                    this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
                } else if (time < 450000) {
                    this.framebuffer.drawVoxelLandscape3(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion(time, tempTexture);
                } else if (time < 490000) {
                    this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = 199 - Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion2(time, tempTexture);
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 520000) {
                    this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
                    this.framebuffer.noise(time, this.noise);
        
                    let scale = 1 / (99 - ((time * 0.02) % 100));
                    let width = (this.hoodlumLogo.width * scale * 10) | 0;
                    let height = (this.hoodlumLogo.height * scale * 10) | 0;
        
                    this.framebuffer.drawScaledTextureClipBi(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, this.hoodlumLogo, 1.0);
                } else if (time < 550000) {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.glitchScreen(time, this.noise);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingPlaneEnv(time * 0.0002);
                } else if (time < 570000) {
                    this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
                    let tempTexture = new Texture();
                    tempTexture.texture = new Uint32Array(256 * 256);
                    for (let y = 0; y < 256; y++) {
                        for (let x = 0; x < 256; x++) {
                            let ypos = 199 - Math.round(200 / 256 * x);
                            let xpos = Math.round(320 / 256 * y);
                            tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                        }
                    }
                    this.framebuffer.drawPolarDistotion2(time, tempTexture);
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 15, smashTime) -
                        this.framebuffer.cosineInterpolate(15, 200, smashTime) +
                        0.4 * this.framebuffer.cosineInterpolate(200, 300, smashTime) -
                        0.4 * this.framebuffer.cosineInterpolate(300, 400, smashTime)) * 35;
        
        
                    let size = Math.round(1 * smash);
                    let size2 = Math.round(2 * smash);
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20 + size,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)) + size2,
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
                    this.framebuffer.glitchScreen(time, this.noise);
                } else if (time < 590000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.drawParticleTorus(time, this.particleTexture2, true);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture(tmpGlitch, 320, 200);
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = 320 + smash * 320 / 100;
                    let height = 200 + smash * 200 / 100;
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 650000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
        
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    // slow
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 670000) {
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);
        
                    let source: number = 0;
                    let dest: number = 319;
                    for (let y: number = 0; y < 200; y++) {
                        for (let x: number = 0; x < 160; x++) {
                            this.framebuffer.framebuffer[dest--] = this.framebuffer.framebuffer[source++];
                        }
                        source += 160;
                        dest += 320 + 160;
                    }
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
        
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.45);
                        }
                    }
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 690000) {
        
                    this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
        
                    this.framebuffer.shadingSphereEnv(time * 0.0002);
        
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.09) | 0) % (this.micro.width * 2 + 320)),
                        200 / 2 - 20,
                        this.micro.width * 2, this.micro.height * 2, this.micro);
        
                    this.framebuffer.drawScaledTextureClipAdd(
                        320 - (((time * 0.05) | 0) % (this.micro.width + 320)),
                        200 / 2 - 60,
                        this.micro.width, this.micro.height, this.micro);
        
        
                    let source: number = 0;
                    let dest: number = 319;
                    for (let y: number = 0; y < 100; y++) {
                        for (let x: number = 0; x < 160; x++) {
                            this.framebuffer.framebuffer[dest--] = this.framebuffer.framebuffer[source++];
                        }
                        source += 160;
                        dest += 320 + 160;
                    }
        
                    source = 0;
                    dest = 199 * 320;
                    for (let y: number = 0; y < 100; y++) {
                        for (let x: number = 0; x < 320; x++) {
                            this.framebuffer.framebuffer[dest++] = this.framebuffer.framebuffer[source++];
                        }
                        dest -= 320 * 2;
                    }
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 50);
                    let height = Math.round(200 + smash * 200 / 50);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
        
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.45);
                        }
                    }
        
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 720000) {
                    // Rave video & Wobblin Cylinder
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.FRONT);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingCylinderEnv(time * 0.0002);
        
                    // Crosses
                    for (let y = 0; y < 3; y++) {
                        for (let x = 0; x < 4; x++) {
                            let xx = Math.round(320 / 4 * x + 320 / 4 * 0.5 - this.cross.width / 2);
                            let yy = Math.round(200 / 3 * y + 200 / 3 * 0.5 - this.cross.height / 2);
                            this.framebuffer.drawTexture(xx, yy, this.cross, 0.2);
                        }
                    }
        
                    // Motion Blur
                    let texture = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture, 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.0003)));
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                    this.framebuffer.noise(time, this.noise);
                } else if (time < 750000) {
                    let rng = new RandomNumberGenerator();
                    rng.setSeed(666);
                    let texture = new Texture(new Uint32Array(32 * 32), 32, 32);
                    // FIXME:
                    // - remove realtime glow and put it pre baked into the texture insteadt!
                    for (let k = 0; k < 100; k++) {
                        let x = Math.round(rng.getFloat() * 32);
                        let y = Math.round(rng.getFloat() * 32);
                        if (k < 50)
                            texture.texture[x + y * 32] = 47 | 181 << 8 | 243 << 16;
                        else
                            texture.texture[x + y * 32] = 252 | 130 << 8 | 195 << 16;
                    }
        
                    this.framebuffer.drawPlanedeformationTunnelAnim(time, texture);
        
        
                    // GLOW
                    let glowBuffer = new Uint32Array(16 * 2 * 10 * 2);
                    let glowBuffer2 = new Uint32Array(16 * 2 * 10 * 2);
        
                    // todo filer onlyy brigh parts
                    // blur if too blocky
                    // clamp to border when filterting bilinear
                    // add and dont blend with alpha
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let xx = Math.round(10 * x);
                            let yy = Math.round(10 * y);
                            let r = this.framebuffer.framebuffer[xx + yy * 320] & 0xff;
                            let g = this.framebuffer.framebuffer[xx + yy * 320] >> 8 & 0xff;
                            let b = this.framebuffer.framebuffer[xx + yy * 320] >> 16 & 0xff;
                            let intensity = (r + g + b) / 3;
                            let scale = this.framebuffer.cosineInterpolate(200, 130, intensity);
                            let color = r * scale | g * scale << 8 | b * scale << 16 | 255 << 24;
                            //  if (intensity > 138) {
                            glowBuffer[x + y * 32] = this.framebuffer.framebuffer[xx + yy * 320];//color ;
                            // }
                        }
                    }
        
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let col1 = glowBuffer[Math.max(x - 1, 0) + y * 32];
                            let col2 = glowBuffer[(x) % 32 + y * 32];
                            let col3 = glowBuffer[Math.min(x + 1, 31) + y * 32];
                            let r = (col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4;
                            let g = (col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4;
                            let b = (col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4;
                            glowBuffer2[x + y * 32] = r | g << 8 | b << 16;
                        }
                    }
        
                    for (let y = 0; y < 20; y++) {
                        for (let x = 0; x < 32; x++) {
                            let col1 = glowBuffer2[(x) + Math.max(y - 1, 0) * 32];
                            let col2 = glowBuffer2[(x) + y % 20 * 32];
                            let col3 = glowBuffer2[(x) + Math.min(y + 1, 19) * 32];
                            let r = ((col1 & 0xff) * 1 / 4 + (col2 & 0xff) * 2 / 4 + (col3 & 0xff) * 1 / 4);
                            let g = ((col1 >> 8 & 0xff) * 1 / 4 + (col2 >> 8 & 0xff) * 2 / 4 + (col3 >> 8 & 0xff) * 1 / 4);
                            let b = ((col1 >> 16 & 0xff) * 1 / 4 + (col2 >> 16 & 0xff) * 2 / 4 + (col3 >> 16 & 0xff) * 1 / 4);
                            glowBuffer[x + y * 32] = r | g << 8 | b << 16;
                        }
                    }
        
                    let texture2 = new Texture();
                    texture2.texture = glowBuffer;
                    texture2.width = 32;
                    texture2.height = 20;
        
        
                    this.framebuffer.drawScaledTextureClipBiAdd(
                        0, 0,
                        320, 200, texture2, 0.75);
        
                    this.framebuffer.setCullFace(CullFace.BACK);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.reflectionBunny(time * 0.002);
                    // Motion Blur
                    let texture3 = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture3, 0.8);
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                    this.framebuffer.noise(time, this.noise);
                } else {
                    this.framebuffer.raveMoview(time, this.rave);
                    this.framebuffer.setCullFace(CullFace.FRONT);
                    this.framebuffer.setBob(this.spheremap);
                    this.framebuffer.shadingCylinderEnvDisp(time * 0.0002);
                    this.framebuffer.drawTexture((320 / 2 - 256 / 2) | 0, (200 / 2 - 122 / 2) | 0, this.meth, Math.max(0, Math.sin(time * 0.0002)));
                    // Motion Blur
                    let texture3 = new Texture(this.accumulationBuffer, 320, 200);
                    this.framebuffer.drawTexture(0, 0, texture3, 0.8);
                    this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
        
        
                    let tmpGlitch = new Uint32Array(320 * 200);
                    this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
        
                    let texture = new Texture();
                    texture.texture = tmpGlitch;
                    texture.width = 320;
                    texture.height = 200;
        
                    const ukBasslineBpm = 140;
                    const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
                    const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
                    const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                        this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
                    let width = Math.round(320 + smash * 320 / 100);
                    let height = Math.round(200 + smash * 200 / 100);
        
                    this.framebuffer.drawScaledTextureClip(
                        Math.round(320 / 2 - width / 2),
                        Math.round(200 / 2 - height / 2),
                        width, height, texture, 1.0);
        
                    this.framebuffer.noise(time, this.noise);
                }
        */
        // music: https://youtu.be/XNUaoQeTu9U
        if (time < 50000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingSphereEnvDisp(time * 0.0002);
            // Motion Blur
            const tmpGlitch = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
            const texture = new Texture_1.default();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;
            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 100);
            const height = Math.round(200 + smash * 200 / 100);
            this.framebuffer.drawScaledTextureClip(Math.round(320 / 2 - width / 2), Math.round(200 / 2 - height / 2), width, height, texture, 1.0);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 100000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            // this.framebuffer.setBob(this.spheremap);
            this.framebuffer.setBob(this.envmap);
            this.framebuffer.shadingSphereEnvDisp2((time - 50000) * 0.0002);
            // Motion Blur
            const tmpGlitch = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
            const texture = new Texture_1.default();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;
            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 100);
            const height = Math.round(200 + smash * 200 / 100);
            this.framebuffer.drawScaledTextureClipBi(Math.round(320 / 2 - width / 2), Math.round(200 / 2 - height / 2), width, height, texture, 1.0);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 150000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleTorus(time, this.particleTexture2, true);
            const tmpGlitch = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
            const texture = new Texture_1.default();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;
            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 100);
            const height = Math.round(200 + smash * 200 / 100);
            this.framebuffer.drawScaledTextureClipBi(Math.round(320 / 2 - width / 2), Math.round(200 / 2 - height / 2), width, height, texture, 1.0);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 200000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingTorusDamp(time * 0.02, time * 0.00000002);
            const tmpGlitch = new Uint32Array(320 * 200);
            this.framebuffer.fastFramebufferCopy(tmpGlitch, this.framebuffer.framebuffer);
            const texture = new Texture_1.default();
            texture.texture = tmpGlitch;
            texture.width = 320;
            texture.height = 200;
            const ukBasslineBpm = 140;
            const ukBasslineClapMs = 60000 / ukBasslineBpm * 2;
            const smashTime = (Date.now() - this.start) % ukBasslineClapMs;
            const smash = (this.framebuffer.cosineInterpolate(0, 20, smashTime) -
                this.framebuffer.cosineInterpolate(20, 300, smashTime)) * 35;
            const width = Math.round(320 + smash * 320 / 100);
            const height = Math.round(200 + smash * 200 / 100);
            this.framebuffer.drawScaledTextureClipBi(Math.round(320 / 2 - width / 2), Math.round(200 / 2 - height / 2), width, height, texture, 1.0);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 250000) {
            this.framebuffer.raveMoview(time, this.rave);
            this.framebuffer.glitchScreen(time, this.noise, false);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingPlaneEnv(time * 0.0002);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 300000) {
            this.framebuffer.drawVoxelLandscape4(this.heightmap, time);
            const tempTexture = new Texture_1.default();
            tempTexture.texture = new Uint32Array(256 * 256);
            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    const ypos = 199 - Math.round(200 / 256 * x);
                    const xpos = Math.round(320 / 256 * y);
                    tempTexture.texture[x + y * 256] = this.framebuffer.framebuffer[xpos + ypos * 320];
                }
            }
            this.framebuffer.drawPolarDistotion2(time, tempTexture);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.65);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 350000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.FRONT);
            this.framebuffer.setBob(this.spheremap);
            this.framebuffer.shadingCylinderEnvDisp(time * 0.0002);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 400000) {
            this.framebuffer.raveMoview(time, this.rave);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.shadingTorus5(time * 0.007, (Date.now() - this.start));
            this.framebuffer.glitchScreen(time, this.noise);
        }
        else if (time < 450000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleWaves(time, this.particleTexture2, true);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.85);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 500000) {
            this.framebuffer.drawMetaballs();
            this.framebuffer.noise(time, this.noise, 0.1);
        }
        else if (time < 550000) {
            this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 600000) {
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.reproduceRazorScene(time * 0.0018, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise, 0.04);
        }
        else if (time < 650000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.drawParticleStreams(time, this.particleTexture2, true);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.55);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 700000) {
            this.framebuffer.setCullFace(CullFace_1.CullFace.FRONT);
            this.framebuffer.torusTunnel(time * 0.007, (Date.now() - this.start), this.particleTexture);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 750000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.BACK);
            this.framebuffer.drawBlenderScene2(time, this.texture4, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else if (time < 800000) {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.FRONT);
            this.framebuffer.drawBlenderScene3(time, this.texture4, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, 0.6);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        else {
            this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
            this.framebuffer.setCullFace(CullFace_1.CullFace.FRONT);
            this.framebuffer.drawBlenderScene4(time, this.texture4, [
                { tex: this.texture10, scale: 0.0, alpha: 1.0 },
                { tex: this.texture11, scale: 2.3, alpha: 0.5 },
                { tex: this.texture13, scale: 1.6, alpha: 0.25 },
                { tex: this.texture13, scale: 0.7, alpha: 0.22 },
                { tex: this.texture13, scale: -0.4, alpha: 0.22 },
            ], this.dirt);
            //this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, 0.6);
            const texture3 = new Texture_1.default(this.accumulationBuffer, 320, 200);
            this.framebuffer.drawTexture(0, 0, texture3, 0.75);
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            this.framebuffer.noise(time, this.noise);
        }
        // this.framebuffer.drawTexture(0, 0, this.mask, 1.0);
        // this.framebuffer.glitchScreen(time, this.noise);
        // this.framebuffer.fastFramebufferCopy(this.framebuffer.framebuffer, this.blurred.texture);
        // this.framebuffer.drawWormhole(time, this.particleTexture2, true);
        /**
         * TODO:
         * - lens flare in razor scene
         * - transition effects with alpha layer
         * - wormhole particle tunnel
         * - rubiks cube animation :-)
         * - cube with animated texture
         * - Oldskool amiga screen with disk loading and decrunching
         * - screen exploding intro cubes
         * - Split red green and blue channels and displace them in x direction
         */
        /**
         * TODO:
         * - Stripe landscape: http://farm3.static.flickr.com/2653/5710494901_2ca6ddbfb2_b.jpg
         *   maybe with sync to bass and fft
         * - Blender modells (Flat, textured, GI baked)
         * - particle tunnel
         * - ribbons on curves
         * - dof
         */
        // this.framebuffer.drawRadialBlur();
        //this.framebuffer.noise(time, this.noise);
        // this.framebuffer.drawText(8, 18, 'FPS: ' + this.fps.toString(), this.texture4);
        /*
        let bufferLength = this.analyzer.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyzer.getByteFrequencyData(dataArray);

        let pos1 = new Vector3f(0,0,0);
        let pos2 = new Vector3f(0,0,0);
        const STEPS = 100;
        for (let i = 0; i < STEPS; i++) {
            
            let x = Math.sin(Math.PI * 2 / STEPS * i+time*0.0003);
            let y = Math.cos(Math.PI * 2 / STEPS * i+time*0.0003);
            pos1.x = x*60 +320/2;
            pos1.y = y*60 + 200/2;
            pos2.y=  y*(60+dataArray[Math.floor(bufferLength/ STEPS * (i))]/255*40)+200/2;
            pos2.x = x*(60+dataArray[Math.floor(bufferLength/ STEPS * (i))]/255*40)+ 320/2;
            this.framebuffer.drawLineDDANoZ(pos1, pos2, 255);
        }
        */
        // TS SoftSynth Project
        // http://natureofcode.com/book/
        // https://noisehack.com/generate-noise-web-audio-api/
        // https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
        // https://noisehack.com/how-to-build-supersaw-synth-web-audio-api/
        // https://noisehack.com/build-music-visualizer-web-audio-api/
        // https://noisehack.com/how-to-build-monotron-synth-web-audio-api/
        // https://davidwalsh.name/web-audio-api
        // https://codepen.io/gregh/post/recreating-legendary-8-bit-games-music-with-web-audio-api
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
        // https://www.html5rocks.com/en/tutorials/webaudio/intro/
        //this.framebuffer.drawTexture(0, 0, this.displacementMap, 0.8);
        /*
        this.framebuffer.drawPolarDistotion3(time, this.revision);
        this.framebuffer.setCullFace(CullFace.FRONT);
        this.framebuffer.shadingSphere(time * 0.004);
        // Motion Blur
        let texture = new Texture(this.accumulationBuffer, 320, 200);
        //this.framebuffer.drawTexture(0, 0, texture, 0.75);
        this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
        this.framebuffer.glitchScreen(time, this.noise);
        */
        // TODO:
        // - Progress Bar for Loading
        // - Web Audio API
        // - blasphemy line sphere with particles and blur
        // - fractal landscape fade in / out
        // - particle emitter
        // - plane deformation on rendererd scenes
        // - alpha blend between different or same scene
        // - fade to white
        // - spike ball / particle and 3d mesh with normals
        // - glow
        // - kewlers cube torus
        // - kewlsers recht billboard spikeball
        // - kewslers rect billboard cylinder
        // seminars:
        // - https://www.youtube.com/playlist?list=PLwbFJIXXSsXvbpDxOaaBrxSBdLUW1hdax
        // - https://www.youtube.com/watch?v=XZLqwXdXjqY
        // - https://www.youtube.com/watch?v=nt-BpAYMeJs&list=PLNqQO7lFY6dmH5kMSWtuRP6ZhBiQdQIU1&index=5
        // - https://www.youtube.com/watch?v=WgUkCRvti3Y&list=PLNqQO7lFY6dlPOg7cA1SczEU0Y7UW6iMW
        // - https://www.youtube.com/watch?v=7wYq6O-g2U8&list=PLNqQO7lFY6dm_GROVFIZ6C6mUINMnlpyC
        // - https://www.youtube.com/watch?v=hszyYAT5R1Q&list=PLNqQO7lFY6dm_GROVFIZ6C6mUINMnlpyC&index=5
        // - https://www.youtube.com/watch?v=4Q5sgNCN2Jw&list=PL2EEF025A89BAA0FC
        // - https://www.youtube.com/watch?v=TbcZyAO6K7c
        // - https://www.youtube.com/watch?v=2p2JcHzRlJU
        // - https://www.youtube.com/watch?v=QT2ftidLTn4
        // - https://www.youtube.com/watch?v=Oo-jlpvhTcY
        /*
              // SCALE
              let texture = new Texture();
              texture.texture = this.accumulationBuffer;
              texture.width = 320;
              texture.height = 200;
      
              let scale = 1 + (1+Math.sin(time*0.00006))*0.5*20;
              let width = 320 *  scale;
              let height = 200 * scale;
      
              // looks crappy with linear interpolation!
              // probably  bilinear is required here
         
              
                  this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
                  this.framebuffer.drawScaledTextureClipBi(
                      Math.round(320/2-width/2),
                      Math.round(200/2-height/2),
                      width, height, texture, 1.0);
                  */
        /*
            // RADIAL BLUR
    let texture = new Texture();
    texture.texture = this.accumulationBuffer;
    texture.width = 320;
    texture.height = 200;

    let scale = 1.05;
    let width = 320 *  scale;
    let height = 200 * scale;

    // looks crappy with linear interpolation!
    // probably  bilinear is required here
 
    
        this.framebuffer.drawScaledTextureClipBi(
            Math.round(320/2-width/2),
            Math.round(200/2-height/2),
            width, height, texture, 0.95);
 
            this.framebuffer.fastFramebufferCopy(this.accumulationBuffer, this.framebuffer.framebuffer);
            */
        //this.framebuffer.noise(time, this.noise);
        // https://github.com/ninjadev/nin/blob/38e80381415934136c7bd97233a2792df2bffa8d/nin/dasBoot/shims.js
        /*****/
        /*

        let scale =  (99-((time * 0.04) % 100))/99;
        let width = (this.micro.width * scale * 2) | 0;
        let height = (this.micro.height * scale * 2) | 0;
        let rng = new RandomNumberGenerator();
        rng.setSeed(22);
        let pos = [];
        for(let i=0; i < 100; i++) {
            pos.push({x:rng.getFloat(), y: rng.getFloat()});
        }

        let xpos = 20+(320-40) * pos[((time*0.04/99)%100)|0].x;
        let ypos = 20+(200-40) * pos[((time*0.04/99)%100)|0].y;
        this.framebuffer.drawScaledTextureClipAdd(
            Math.round(xpos - width / 2),
            Math.round(ypos - height / 2),
            width, height, this.micro, 1.0);
            */
        // this.framebuffer.drawRadialBlur();
        // NEW EFFECTS:
        // * https://www.youtube.com/watch?v=bg-MTl_nRiU
        // * SPIKEBALL KYLE
        // plane deformation with texture to LED
        // 16 / 9 --> 320 x 180
        /*
        this.framebuffer.setCullFace(CullFace.BACK);
        //this.framebuffer.drawBlenderScene(time, this.texture4, this.particleTexture2);
        this.framebuffer.setBob(this.spheremap);
        this.framebuffer.drawPlanedeformationTunnelV2(time, this.abstract, this.metal);
        this.framebuffer.shadingSphereEnv(time*0.0002);
         this.framebuffer.drawTexture(0, 75, this.hoodlumLogo, (Math.sin(time * 0.0003) + 1) * 0.5);
        */
        /**
         * Inspiration:
         * - https://www.youtube.com/watch?v=7kLNXg4BmM8
         * - https://www.youtube.com/watch?v=PLrio-uwvwk
         * - https://www.youtube.com/watch?v=XJKDb4ByZ7Y
         */
        /**
         * TODO:
         * - http://sol.gfxile.net/gp/ch18.html
         * - http://insolitdust.sourceforge.net/code.html
         * - http://sol.gfxile.net/sphere/index.html
         * - http://4matprojects.blogspot.de/
         * - http://sol.gfxile.net/particle/index.html
         * - http://sol.gfxile.net/gp/ch19.html
         * - http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_07_Bump_Mapping.shtml
         * - http://sol.gfxile.net/interpolation/index.html
         * - http://adrianboeing.blogspot.de/2011/06/deform-textured-interference-effect-in.html
         * - particle ball pulsating (https://www.youtube.com/watch?v=NPZEkhtXhgE)
         * - metaballs
         * - particle stream
         * - scene with baked lighting & wobbling ball & camera animation
         * - DOF flares
         * - demo tool http://peisik.untergrund.net/engines/
         * - https://www.youtube.com/watch?v=ghX1-EUx-fQ&index=7&list=PLPnuj18PSHazbti_tw1zoQ23fqx8-ZZP7 (min 15)
         */
        //  this.framebuffer.cinematicScroller(this.texture4, time);
        //  this.framebuffer.drawTextureScaledLame(0,0, 16,16, this.texture7);
        // http://doc.babylonjs.com/tutorials/discover_basic_elements
        // implement modells with baked shaods and lighting :)
        // http://iquilezles.org/www/index.htm
        // http://iquilezles.org/www/articles/normals/normals.htm
        // http://iquilezles.org/www/articles/areas/areas.htm
        // http://iquilezles.org/www/articles/frustum/frustum.htm
        // http://iquilezles.org/www/articles/frustumcorrect/frustumcorrect.htm
        // http://iquilezles.org/www/articles/deform/deform.htm
        // http://www.gamers.org/dEngine/quake/papers/ddjzsort.html
        // http://fabiensanglard.net/quakeSource/quakeSourceRendition.php
        //  this.framebuffer.shadingSphereClip((time ) * 0.003);
        // this.framebuffer.cinematicScroller(this.texture4, time );
        //   this.framebuffer.drawText(8, 192 - 18, 'TRIANGLE NEAR PLANE CLIPPING', this.texture4);
        // TODO:
        // - textured cube / dynamic textures
        // - skybox
        // - specular highlights
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
        // wormhole
        // glitch logo
    }
    getImageData(image, withAlpha = false) {
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
    createTexture(path, hasAlpha) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const texture = new Texture_1.default();
                texture.texture = this.getImageData(img, hasAlpha);
                texture.width = img.width;
                texture.height = img.height;
                resolve(texture);
            };
            img.onerror = () => resolve();
            img.src = path;
        });
    }
    createProceduralTexture() {
        return new Promise((resolve) => {
            const texture = new Texture_1.default();
            texture.texture = new Uint32Array(256 * 256);
            let rng = new RandomNumberGenerator_1.default();
            rng.setSeed(100);
            for (let y = 0; y < 256; y++) {
                for (let x = 0; x < 256; x++) {
                    texture.texture[x + y * 256] = (rng.getFloat() * 256) | 0 | 255 << 24;
                }
            }
            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }
    createProceduralTexture2() {
        return new Promise((resolve) => {
            const texture = new Texture_1.default();
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
    createProceduralTexture3() {
        return new Promise((resolve) => {
            const texture = new Texture_1.default();
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
    createProceduralDisplacementMap() {
        return new Promise((resolve) => {
            const texture = new Texture_1.default();
            texture.texture = new Uint32Array(256 * 256);
            let rng = new RandomNumberGenerator_1.default();
            rng.setSeed(100);
            texture.texture.fill(128 | 255 << 24);
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
                    texture.texture[x + y * 256] = (texture.texture[x + y * 256] & 0xffffff00) | texture.texture[x + y * 256] & 0xff + (c * 255);
                }
            }
            texture.width = 256;
            texture.height = 256;
            resolve(texture);
        });
    }
    createProceduralTexture4() {
        return new Promise((resolve) => {
            const texture = new Texture_1.default();
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
    init() {
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
        Promise.all([
            this.createTexture(__webpack_require__(26), false).then(texture => this.spheremap = texture),
            this.createTexture(__webpack_require__(27), false).then(texture => this.metal = texture),
            this.createTexture(__webpack_require__(28), false).then(texture => this.texture = texture),
            this.createTexture(__webpack_require__(29), true).then(texture => this.texture2 = texture),
            this.createTexture(__webpack_require__(30), false).then(texture => this.heightmap = texture),
            this.createTexture(__webpack_require__(31), true).then(texture => this.texture4 = texture),
            this.createTexture(__webpack_require__(32), false).then(texture => this.texture5 = texture),
            this.createTexture(__webpack_require__(33), true).then(texture => this.texture6 = texture),
            this.createTexture(__webpack_require__(34), true).then(texture => this.texture7 = texture),
            this.createTexture(__webpack_require__(35), false).then(texture => this.texture8 = texture),
            this.createTexture(__webpack_require__(36), false).then(texture => this.texture9 = texture),
            this.createTexture(__webpack_require__(37), true).then(texture => this.texture10 = texture),
            this.createTexture(__webpack_require__(38), true).then(texture => this.texture11 = texture),
            this.createTexture(__webpack_require__(39), true).then(texture => this.texture12 = texture),
            this.createTexture(__webpack_require__(40), true).then(texture => this.texture13 = texture),
            this.createTexture(__webpack_require__(41), false).then(texture => this.texture14 = texture),
            this.createTexture(__webpack_require__(42), false).then(texture => this.revision = texture),
            this.createTexture(__webpack_require__(43), true).then(texture => this.meth = texture),
            this.createProceduralTexture().then(texture => this.texture15 = texture),
            this.createProceduralTexture2().then(texture => this.particleTexture = texture),
            this.createProceduralTexture3().then(texture => this.particleTexture2 = texture),
            this.createProceduralTexture4().then(texture => this.noise = texture),
            this.createProceduralDisplacementMap().then(texture => this.displacementMap = texture),
            this.createTexture(__webpack_require__(44), true).then(texture => this.hoodlumLogo = texture),
            this.createTexture(__webpack_require__(45), false).then(texture => this.abstract = texture),
            this.createTexture(__webpack_require__(46), false).then(texture => this.rave = texture),
            this.createTexture(__webpack_require__(47), false).then(texture => this.micro = texture),
            this.createTexture(__webpack_require__(48), false).then(texture => this.blurred = texture),
            this.createTexture(__webpack_require__(49), true).then(texture => this.hlm = texture),
            this.createTexture(__webpack_require__(50), true).then(texture => this.cross = texture),
            this.createTexture(__webpack_require__(51), false).then(texture => this.envmap = texture),
            this.createTexture(__webpack_require__(52), false).then(texture => this.heightmapSphere = texture),
            this.createTexture(__webpack_require__(53), true).then(texture => this.mask = texture),
            this.createTexture(__webpack_require__(54), true).then(texture => this.dirt = texture),
        ]).then(() => {
            // Web Audio API
            // FIXME: put this into a Player Class
            this.framebuffer.precompute(this.heightmap, this.heightmapSphere);
            let audioContext = new AudioContext();
            let request = new XMLHttpRequest();
            request.open('GET', __webpack_require__(55), true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                let undecodedAudio = request.response;
                audioContext.decodeAudioData(undecodedAudio, (buffer) => {
                    const sourceBuffer = audioContext.createBufferSource();
                    sourceBuffer.buffer = buffer;
                    sourceBuffer.connect(audioContext.destination);
                    sourceBuffer.loop = true;
                    sourceBuffer.start(audioContext.currentTime);
                    this.start = Date.now();
                    this.renderLoop(0);
                });
            };
            request.send();
        });
    }
    renderLoop(time) {
        this.render();
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FrustumCuller_1 = __webpack_require__(11);
const Geometry_1 = __webpack_require__(15);
const CameraKeyFrame_1 = __webpack_require__(17);
const CameraAnimator_1 = __webpack_require__(18);
const CullFace_1 = __webpack_require__(2);
const Vertex_1 = __webpack_require__(20);
/**
 * 3d polygon clipping:
 * http://www.gamers.org/dEngine/quake/papers/ddjclip.html
 * http://www.jagregory.com/abrash-black-book/#chapter-65-3-d-clipping-and-other-thoughts
 * http://downloads.gamedev.net/pdf/gpbb/gpbb65.pdf
 * http://www.cubic.org/docs/3dclip.htm
 * http://fabiensanglard.net/polygon_codec/
 *
 * http://fabiensanglard.net/quake2/quake2_software_renderer.php
 *
 * http://www.xbdev.net/maths_of_3d/rasterization/clipping/index.php
 * http://www.gamasutra.com/view/news/168577/Indepth_Software_rasterizer_and_triangle_clipping.php
 * https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-GPU-rendering-pipeline-clipping
 * http://www.songho.ca/opengl/gl_pipeline.html
 * http://www.songho.ca/opengl/gl_transform.html
 * http://www.songho.ca/opengl/gl_camera.html
 * http://www.songho.ca/opengl/gl_matrix.html
 * http://www.songho.ca/math/homogeneous/homogeneous.html
 */
const Texture_1 = __webpack_require__(6);
const math_1 = __webpack_require__(0);
const camera_1 = __webpack_require__(4);
const RandomNumberGenerator_1 = __webpack_require__(7);
let json = __webpack_require__(21);
let bunnyJson = __webpack_require__(22);
let worldJson = __webpack_require__(23);
//let torusJson = <any>require('./assets/torus.json');
let torusJson = __webpack_require__(24);
let gearJson = __webpack_require__(25);
//let torusJson = <any>require('./assets/platonian2.json');
// TODO:
// - use polymorphism in order to have different intersection methods
// - one for plain clipping / one for tex coords / one for multitexturing / gouraud shading etc
class AbstractClipEdge {
}
class RightEdge extends AbstractClipEdge {
    isInside(p) {
        return p.x < 320;
    }
    isInside2(p) {
        return p.position.x < 320;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Framebuffer.maxWindow.x + 1, Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x)), 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector3f(Framebuffer.maxWindow.x + 1, Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)), 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.maxWindow.x + 1 - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
class LeftEdge extends AbstractClipEdge {
    isInside(p) {
        return p.x >= 0;
    }
    isInside2(p) {
        return p.position.x >= 0;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Framebuffer.minWindow.x, Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)), 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector3f(Framebuffer.minWindow.x, Math.round(p1.position.y + (p2.position.y - p1.position.y) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)), 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.x - p1.position.x) / (p2.position.x - p1.position.x)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
class TopEdge extends AbstractClipEdge {
    isInside(p) {
        return p.y < Framebuffer.maxWindow.y + 1;
    }
    isInside2(p) {
        return p.position.y < Framebuffer.maxWindow.y + 1;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.maxWindow.y + 1 - p1.y) / (p2.y - p1.y)), Framebuffer.maxWindow.y + 1, 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.maxWindow.y + 1 - p1.y) / (p2.y - p1.y)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector3f(Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)), Framebuffer.maxWindow.y + 1, 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.maxWindow.y + 1 - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
class BottomEdge extends AbstractClipEdge {
    isInside(p) {
        return p.y >= Framebuffer.minWindow.y;
    }
    isInside2(p) {
        return p.position.y >= Framebuffer.minWindow.y;
    }
    computeIntersection(p1, p2) {
        return new math_1.Vector3f(Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)), Framebuffer.minWindow.y, 1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)));
    }
    computeIntersection2(p1, p2) {
        let vertex = new Vertex_1.Vertex();
        vertex.position =
            new math_1.Vector3f(Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)), Framebuffer.minWindow.y, 1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)));
        let textCoord = new Vertex_1.TextureCoordinate();
        let z = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;
        return vertex;
    }
}
class Framebuffer {
    constructor(width, height) {
        this.x = 0;
        this.cullMode = CullFace_1.CullFace.BACK;
        // optimization:
        // - downscale image to half the size before bluring
        // render result to texture in order to not blur the logo
        this.tmp = new Uint32Array(320 * 200);
        this.tmp2 = new Uint32Array(320 * 200);
        this.tmpGlitch = new Uint32Array(320 * 200);
        this.NEAR_PLANE_Z = -1.7;
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
        this.camera = new camera_1.ControllableCamera();
    }
    setCullFace(face) {
        this.cullMode = face;
    }
    setBob(texture) {
        this.bob = texture;
    }
    precompute(texture, texture2) {
        this.obj = this.createObject();
        this.bunnyObj = this.createBunny();
        this.blenderObj = this.getBlenderScene(worldJson);
        this.blenderObj2 = this.getBlenderScene(torusJson, false);
        this.blenderObj3 = this.getBlenderScene(gearJson, false);
        this.sphere = this.createSphere();
        this.plane = this.createPlane();
        this.cylinder = this.createCylinder();
        this.cylinder2 = this.createCylinder2(texture);
        this.sphereDisp = this.createSphereDistplaced(texture);
        this.sphereDisp2 = this.createSphereDistplaced(texture2);
        /*
        document.addEventListener("keydown", (e) => {
            console.log('key pressed');
            if (e.which == 38) this.camera.moveForward(0.2, 1.0);
            if (e.which == 40) this.camera.moveBackward(0.2, 1.0);
            if (e.which == 37) this.camera.turnLeft(0.05, 1.0);
            if (e.which == 39) this.camera.turnRight(0.05, 1.0);
        });*/
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
    clearH(col, h) {
        let color = col;
        let count = this.width * h;
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
    readPixel(x, y, color) {
        return this.framebuffer[x + y * this.width];
    }
    readPixel2(fb, x, y, color) {
        return fb[x + y * this.width];
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
    drawLens(texture, tex, time) {
        const radius = 47;
        let xoff = 320 / 2 + Math.cos(6 * time * 0.0002) * (320 / 2 - 50);
        let yoff = 200 / 2 + Math.sin(4 * time * 0.0002) * (200 / 2 - 50);
        // TODO: precalculate displacement in an array
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    let xx = Math.round(x + xoff);
                    let yy = Math.round(y + yoff);
                    let z = 1 + Math.sqrt(radius * radius - x * x - y * y) * 0.03;
                    let xx2 = Math.round(x / z + xoff);
                    let yy2 = Math.round(y / z + yoff);
                    let col = texture.texture[xx2 + yy2 * 320];
                    let index = xx + yy * 320;
                    this.framebuffer[index] = col;
                }
            }
        }
        this.drawTexture(Math.round(xoff - 50), Math.round(yoff - 50), tex, 1.0);
    }
    cinematicScroller(texture, time) {
        let scrollText = [
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '',
            'YOU HAVE BEEN WATCHING',
            '',
            'D A R K   M A T T E R',
            '',
            'A JAVASCRIPT DEMO MADE FOR',
            'NORDLICHT 2018',
            '',
            'CREDITS',
            '',
            'CODE BY',
            'TRIGGER',
            '',
            'GRAFICS BY',
            'PREMIUM',
            '',
            'MUSIC BY',
            'VIRGILL'
        ];
        time = time * 0.6;
        let scrollerOffset = Math.round(this.interpolate(0, 250, time % 255) * 8);
        for (let i = 1; i < 200 / 8; i++) {
            let text = scrollText[(i + (time / 255) | 0) % scrollText.length];
            let x = (320 / 2 - text.length * 8 / 2) | 0;
            let y = 8 * i - scrollerOffset;
            // TODO: proper text clipping to rect
            // maybe just for first and last row
            this.drawText(x, y, text, texture);
        }
    }
    starField() {
        // plus razor logo
    }
    // Crossfade 2 effects
    crossFade() {
    }
    blur() {
        let scale = 1 / (3.1);
        let r = 0;
        let g = 0;
        let b = 0;
        let index = 1 + 320;
        let sumIndex = 320;
        let color;
        for (let y = 0; y < 198; y++) {
            for (let x = 0; x < 318; x++) {
                color = this.framebuffer[sumIndex];
                r = color & 0xff;
                g = color >> 8 & 0xff;
                b = color >> 16 & 0xff;
                sumIndex++;
                color = this.framebuffer[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex++;
                color = this.framebuffer[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex++;
                sumIndex -= 2;
                r *= scale;
                g *= scale;
                b *= scale;
                this.tmp[index] = r | g << 8 | b << 16 | 255 << 24;
                index++;
            }
            sumIndex += 2;
            index += 2;
        }
        index = 320 + 1;
        sumIndex = 1;
        for (let x = 1; x < 320 - 1; x++) {
            //   index = x + 320;
            sumIndex = x;
            for (let y = 0; y < 198; y++) {
                color = this.tmp[sumIndex];
                r = color & 0xff;
                g = color >> 8 & 0xff;
                b = color >> 16 & 0xff;
                sumIndex += 320;
                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += 320;
                color = this.tmp[sumIndex];
                r += color & 0xff;
                g += color >> 8 & 0xff;
                b += color >> 16 & 0xff;
                sumIndex += 320;
                sumIndex -= 320 * 2;
                r *= scale;
                g *= scale;
                b *= scale;
                this.tmp2[index] = r | g << 8 | b << 16 | 255 << 24;
                index += 320;
            }
            index += -198 * 320 + 1;
        }
        /*
                for (let y = 1; y < 200 - 1; y++) {
                    for (let x = 1; x < 320 - 1; x++) {
                        r = g = b = 0;
                        for (let i = -1; i <= 1; i++) {
                            let color = this.readPixel2(this.tmp, x, y + i, 0);
                            r += color & 0xff;
                            g += color >> 8 & 0xff;
                            b += color >> 16 & 0xff;
                        }
                        r *= scale;
                        g *= scale;
                        b *= scale;
                        this.tmp2[x + y * 320] = r | g << 8 | b << 16 | 255 << 24;
                    }
                }*/
        this.fastFramebufferCopy(this.framebuffer, this.tmp2);
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
    drawRaster() {
        let colorLUT = new Array();
        for (let i = 0; i < 16; i++) {
            let shade = (Math.sin(Math.PI * i / 15) * 255) | 0;
            let color = shade << 16 | shade << 8 | shade | 255 << 24;
            colorLUT.push(color);
        }
        let pos = ((Math.sin(Date.now() * 0.002) + 1) / 2 * (200 - 16)) | 0;
        for (let i = 0; i < 16; i++) {
            this.framebuffer.fill(colorLUT[i], 320 * (pos + i), 320 * (pos + i) + 320);
        }
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
    draw3dBobs() {
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
        /*
        let i = 320 * 200 / 32 + 1;
        let k = 320 * 200;
        while (--i) {
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];

            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];

            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];

            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
            src[--k] = dest[k]; src[--k] = dest[k];
        }
        */
    }
    drawBobs(texture, time) {
        let scaledTime = time * 0.2;
        const BALL_SIZE = 16;
        for (let i = 0; i < 30; i++) {
            let x = (Math.cos(3 * scaledTime * 0.002 + i * 0.11) * (320 / 2 - BALL_SIZE / 2)) | 0;
            let y = (Math.sin(4 * scaledTime * 0.002 + i * 0.11) * (200 / 2 - BALL_SIZE / 2)) | 0;
            //this.drawTexture(320 / 2 - BALL_SIZE / 2 + x, 200 / 2 - BALL_SIZE / 2 + y, texture, 1.0);
            this.drawTextureNoClipAlpha(320 / 2 - BALL_SIZE / 2 + x, 200 / 2 - BALL_SIZE / 2 + y, texture);
        }
    }
    raveMoview(elapsedTime, texture) {
        this.fastFramebufferCopyOffset(this.framebuffer, texture.texture, -(((elapsedTime / 200) | 0) % 11) * 200);
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
    glitchScreen(elapsedTime, texture, noise = true) {
        const glitchFactor = (Math.sin(elapsedTime * 0.0003) * 0.5 + 0.5);
        let rng = new RandomNumberGenerator_1.default();
        rng.setSeed((elapsedTime / 250) | 0);
        let texture2 = new Texture_1.default();
        texture2.height = 200;
        texture2.width = 320;
        texture2.texture = this.framebuffer;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 10; y++) {
                if (rng.getFloat() > 0.25) {
                    continue;
                }
                this.drawTextureRect(20 * (16 - x), 20 * ((16 * rng.getFloat()) | 0), 20 * x, 20 * y, 20, 20, texture2, 0.1 + 0.35 * glitchFactor);
            }
        }
        if (noise) {
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 10; y++) {
                    this.drawTextureRect(x * 20, y * 20, 20 * (Math.round(elapsedTime / 100 + x + y) % 12), 0, 20, 20, texture, 0.1 + 0.3 * glitchFactor);
                }
            }
        }
        this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
        // now distort the tmpGlitch buffer and render to framebuffer again
        let rng2 = new RandomNumberGenerator_1.default();
        for (let k = 0; k < 8; k++) {
            let yStart = Math.round(rng.getFloat() * 180);
            const size = 3 + Math.round(rng.getFloat() * 20);
            rng2.setSeed((elapsedTime / 250) | 0);
            let scale = rng2.getFloat() * glitchFactor;
            let off = rng.getFloat() * glitchFactor;
            for (let y = 0; y < size; y++) {
                const offset = Math.abs(Math.round(off * 25) + Math.round(rng2.getFloat() * 3)
                    + Math.round(Math.cos(y * 0.01 + elapsedTime * 0.002 + off) * scale * 5));
                let index = yStart * 320;
                let glIndex = yStart * 320 + 320 - offset;
                for (let i = 0; i < Math.max(0, offset); i++) {
                    this.framebuffer[index++] = this.tmpGlitch[glIndex++];
                }
                glIndex = yStart * 320;
                let count = 320 - offset;
                for (let i = 0; i < count; i++) {
                    this.framebuffer[index++] = this.tmpGlitch[glIndex++];
                }
                yStart++;
            }
        }
    }
    floodFill(texture, time) {
        let pos = ((time * 0.02) | 0) % 200;
        let index = 320 * 200;
        for (let y = 0; y < pos; y++) {
            for (let x = 0; x < 320; x++) {
                this.framebuffer[index] = texture.texture[index];
                index--;
            }
        }
        let index2 = index;
        for (let y = 0; y < 200 - pos; y++) {
            for (let x = 0; x < 320; x++) {
                this.framebuffer[index] = texture.texture[index2];
                index--;
                index2--;
            }
            index2 += 320;
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
        let texture = new Texture_1.default();
        texture.texture = this.tmpGlitch;
        texture.width = 320;
        texture.height = 200;
        let width = 320;
        let height = 200;
        for (let i = 0; i < 16; i++) {
            width += 320 * 0.09;
            height += 200 * 0.09;
            this.drawScaledTextureClip(320 / 2 - width / 2, 200 / 2 - height / 2, width, height, texture, 0.19 * (15 - i) / 15);
            this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
        }
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
                let color = this.getBilinearFilteredPixel2(texture, xx, yy);
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
                let color = this.getBilinearFilteredPixel2(texture, xx, yy);
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
        /* return new Vector3f(Math.round((320 / 2) + (t1.x * 1.5 / (-t1.z * 0.0078))),
             // negation breaks winding and cull mode!!
             Math.round((200 / 2) - (t1.y * 1.5 / (-t1.z * 0.0078))), t1.z);*/
        return new math_1.Vector3f(Math.round((320 / 2) + (192 * t1.x / (-t1.z))), Math.round((200 / 2) - (t1.y * 1.5 / (-t1.z * 0.0078))), t1.z);
    }
    // https://math.stackexchange.com/questions/859454/maximum-number-of-vertices-in-intersection-of-triangle-with-box/
    nearPlaneClipping(t1, t2, color) {
        const NEAR_PLANE_Z = -1.7;
        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.cohenSutherlandLineClipper(this.project(t1), this.project(t2), color);
        }
        else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        }
        else if (t1.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            let t3 = new math_1.Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        }
        else if (t2.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            let t3 = new math_1.Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.cohenSutherlandLineClipper(this.project(t2), this.project(t3), color);
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
    clearDepthBuffer() {
        this.wBuffer.fill(-1 / 100);
    }
    debug(elapsedTime) {
        this.clearDepthBuffer();
        let index = [
            1, 2, 3, 3, 4, 1,
            1 + 8, 2 + 8, 3 + 8, 3 + 8, 4 + 8, 1 + 8,
        ];
        let points = [
            new math_1.Vector3f(-1.0, -1.0, 1.0), new math_1.Vector3f(1.0, -1.0, 1.0),
            new math_1.Vector3f(1.0, 1.0, 1.0), new math_1.Vector3f(-1.0, 1.0, 1.0),
            new math_1.Vector3f(-1.0, -1.0, -1.0), new math_1.Vector3f(1.0, -1.0, -1.0),
            new math_1.Vector3f(1.0, 1.0, -1.0), new math_1.Vector3f(-1.0, 1.0, -1.0),
            new math_1.Vector3f(-1.0, -1.0, 1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)), new math_1.Vector3f(1.0, -1.0, 1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)),
            new math_1.Vector3f(1.0, 1.0, 1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)), new math_1.Vector3f(-1.0, 1.0, 1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)),
            new math_1.Vector3f(-1.0, -1.0, -1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)), new math_1.Vector3f(1.0, -1.0, -1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)),
            new math_1.Vector3f(1.0, 1.0, -1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)), new math_1.Vector3f(-1.0, 1.0, -1.0).add(new math_1.Vector3f(2.0, 0.0, 0.0)),
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
        let modelViewMartrix = math_1.Matrix3f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix3f.constructZRotationMatrix(elapsedTime * 0.08));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        });
        for (let i = 0; i < index.length; i += 3) {
            // TODO: use eye space triangles for backface culling
            let col = 255 << 24 | 255 << 16;
            let col2 = 255 << 24 | 255;
            this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], colorAr[(((i) / 3) | 0) % 6]);
        }
    }
    sphereFunction(theta, phi) {
        let pos = new math_1.Vector4f(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), Math.sin(theta), 1.0);
        let radius = (Math.sin(pos.z * 11 + Date.now() * 0.001) + 1) / 2 +
            (Math.sin(pos.x * 11 + Date.now() * 0.001) + 1) / 3;
        pos.x = pos.x + pos.x * radius;
        pos.y = pos.y + pos.y * radius;
        pos.z = pos.z + pos.z * radius;
        return pos;
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
    drawOldSchoolPlasma(elapsedTime) {
        let time = elapsedTime * 0.0007 * 1.0;
        let lineDirection = new math_1.Vector3f(Math.sin(time), Math.cos(time), 0);
        let radialWaveCenter = new math_1.Vector3f(470.0 / 2.0, 230.0 / 2.0, 0).add(new math_1.Vector3f(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));
        let difference = new math_1.Vector3f(0, 0, 0);
        // TODO: implement sin/cos lookup tables plus starfield ;)
        let index = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let directionalWave = Math.sin(((x * lineDirection.x + y * lineDirection.y) * 0.02 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                let radialWave = (Math.cos(difference.length() * 0.03) + 1.0) * 0.5;
                let waveSum = (radialWave + directionalWave) * 0.5;
                let red = (Math.cos(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let green = (Math.sin(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let blue = (Math.sin(time) + 1.0) * 0.5 * 255;
                this.framebuffer[index++] = 255 << 24 | blue << 16 | green << 8 | red;
            }
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0 + 20 * Math.sin(elapsedTime * 0.04), 5 * Math.sin(elapsedTime * 0.06), -36).multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        }
        // draw clip region
        let colred = 255 << 24 | 230 << 16 | 200 << 16 | 200;
        this.drawLineDDA(new math_1.Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new math_1.Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new math_1.Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), new math_1.Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new math_1.Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new math_1.Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), colred);
        this.drawLineDDA(new math_1.Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), new math_1.Vector3f(Framebuffer.maxWindow.x + 2, Framebuffer.maxWindow.y + 1, 0), colred);
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
        let p1 = new math_1.Vector3f(start.x, start.y, start.z);
        let p2 = new math_1.Vector3f(end.x, end.y, end.z);
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -26 + 4 * Math.sin(elapsedTime * 0.7)).multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector4f(0.5, 0.5, 0.5, 0.0).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
                this.drawTriangleDDA(v1, v2, v3, color);
                //this.drawLineDDA(v1, v2, colLine);
                //this.drawLineDDA(v1, v3, colLine);
                //this.drawLineDDA(v3, v2, colLine);
            }
        }
    }
    clearColorBuffer() {
        this.clear();
    }
    createObject() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new math_1.Vector4f(pos.x, pos.y, pos.z, 1.0));
            }
        }
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
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.mul(-1).normalize()); // normalize?
        }
        // Create class for objects
        return {
            points: points, normals: normals, index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
    }
    wireFrameTerrain(elapsedTime, heightmap) {
        this.clearDepthBuffer();
        let index = [];
        let points = [];
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                points.push(new math_1.Vector3f((x - 128) * 20.0, (heightmap.texture[x + y * 256] & 0x000000ff) * 128 / 256 - 70, (y - 128) * 20.0));
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
        let modelViewMartrix = math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.003);
        let points2 = new Array();
        let xOff = +Math.cos(elapsedTime * 0.000001) * 128 * 20;
        let zOff = Math.sin(elapsedTime * 0.000001) * 128 * 20;
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x + xOff;
            let y = transformed.y;
            let z = transformed.z + zOff; // TODO: use translation matrix!
            points2.push(new math_1.Vector3f(x, y, z));
        });
        for (let i = 0; i < index.length; i += 2) {
            let scale = (1 - Math.min(255, -points2[index[i]].z * 0.9) / 255);
            let color = (255 * scale) << 8 | 100 * scale | (200 * scale) << 16 | 255 << 24;
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }
    getDodecahedronMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let phi = (1 + Math.sqrt(5)) * 0.5;
        let a = 1;
        let b = 1 / phi;
        let c = 2 - phi;
        points = [
            new math_1.Vector4f(c, 0, a), new math_1.Vector4f(-c, 0, a), new math_1.Vector4f(-b, b, b), new math_1.Vector4f(0, a, c),
            new math_1.Vector4f(b, b, b), new math_1.Vector4f(b, -b, b), new math_1.Vector4f(0, -a, c), new math_1.Vector4f(-b, -b, b),
            new math_1.Vector4f(c, 0, -a), new math_1.Vector4f(-c, 0, -a), new math_1.Vector4f(-b, -b, -b), new math_1.Vector4f(0, -a, -c),
            new math_1.Vector4f(b, -b, -b), new math_1.Vector4f(b, b, -b), new math_1.Vector4f(0, a, -c), new math_1.Vector4f(-b, b, -b),
            new math_1.Vector4f(1, c, 0), new math_1.Vector4f(-a, c, 0), new math_1.Vector4f(-1, -c, 0), new math_1.Vector4f(a, -c, 0)
        ];
        index = [
            0, 4, 1, 1, 3, 2, 1, 4, 3, 1, 7, 0,
            0, 6, 5, 0, 7, 6, 8, 12, 9, 9, 11, 10,
            9, 12, 11, 9, 15, 8, 8, 14, 13, 8, 15, 14,
            14, 3, 13, 13, 4, 16, 13, 3, 4, 3, 14, 2,
            2, 15, 17, 2, 14, 15, 11, 6, 10, 10, 7, 18,
            10, 6, 7, 6, 11, 5, 5, 12, 19, 5, 11, 12,
            16, 4, 19, 19, 0, 5, 19, 4, 0, 19, 12, 16,
            16, 8, 13, 16, 12, 8, 17, 15, 18, 18, 9, 10,
            18, 15, 9, 18, 7, 17, 17, 1, 2, 17, 7, 1
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
    getIcosahedronMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let phi = (1 + Math.sqrt(5)) * 0.5;
        let a = 0.5;
        let b = a * 2 / (2 * phi);
        points = [
            new math_1.Vector4f(-b, 0, a), new math_1.Vector4f(b, 0, a), new math_1.Vector4f(-b, 0, -a), new math_1.Vector4f(b, 0, -a),
            new math_1.Vector4f(0, a, b), new math_1.Vector4f(0, a, -b), new math_1.Vector4f(0, -a, b), new math_1.Vector4f(0, -a, -b),
            new math_1.Vector4f(a, b, 0), new math_1.Vector4f(-a, b, 0), new math_1.Vector4f(a, -b, 0), new math_1.Vector4f(-a, -b, 0)
        ];
        index = [
            1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4,
            1, 8, 4, 1, 10, 8, 10, 3, 8, 8, 3, 5,
            3, 2, 5, 3, 7, 2, 3, 10, 7, 10, 6, 7,
            6, 11, 7, 6, 0, 11, 6, 1, 0, 10, 1, 6,
            11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
    getTrapezoidMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let a = 0.5;
        let b = 0.05;
        points = [
            new math_1.Vector4f(-b, a, -b),
            new math_1.Vector4f(b, a, -b),
            new math_1.Vector4f(a, -a, -a),
            new math_1.Vector4f(-a, -a, -a),
            new math_1.Vector4f(-b, a, b),
            new math_1.Vector4f(b, a, b),
            new math_1.Vector4f(a, -a, a),
            new math_1.Vector4f(-a, -a, a)
        ];
        index = [
            0, 1, 2,
            0, 2, 3,
            5, 4, 7,
            5, 7, 6,
            1, 5, 6,
            1, 6, 2,
            4, 0, 3,
            4, 3, 7,
            4, 5, 1,
            4, 1, 0
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
    getCubeMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let a = 0.5;
        points = [
            new math_1.Vector4f(-a, -a, -a),
            new math_1.Vector4f(a, -a, -a),
            new math_1.Vector4f(a, a, -a),
            new math_1.Vector4f(-a, a, -a),
            new math_1.Vector4f(-a, -a, a),
            new math_1.Vector4f(a, -a, a),
            new math_1.Vector4f(a, a, a),
            new math_1.Vector4f(-a, a, a)
        ];
        index = [
            0, 2, 1, 0, 3, 2, 5, 7, 4, 5, 6, 7, 1, 6, 5, 1, 2, 6, 4, 3, 0, 4, 7, 3, 4, 1, 5, 4, 0, 1, 3, 6, 2, 3, 7, 6
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
    getPyramidMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let phi = (1 + Math.sqrt(5)) * 0.5;
        let a = 0.5;
        let b = a * 2 / (2 * phi);
        points = [
            new math_1.Vector4f(0, a, 0),
            new math_1.Vector4f(a, -a, -a),
            new math_1.Vector4f(-a, -a, -a),
            new math_1.Vector4f(a, -a, a),
            new math_1.Vector4f(-a, -a, a)
        ];
        index = [
            0, 1, 2,
            0, 3, 1,
            0, 4, 3,
            0, 2, 4
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
    getPlaneMesh() {
        let points = new Array();
        let normals = new Array();
        let index = new Array();
        // https://github.com/chiptune/lol3d/blob/master/index.html
        let a = 0.5;
        points = [
            new math_1.Vector4f(-a, 0, a),
            new math_1.Vector4f(a, 0, a),
            new math_1.Vector4f(a, 0, -a),
            new math_1.Vector4f(-a, 0, -a),
        ];
        index = [
            0, 1, 2, 2, 3, 0
        ];
        // todo use index array for normals to have less normal objects
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.normalize()); // normalize?
        }
        // Create class for objects
        let obj = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        return obj;
    }
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
    reproduceRazorScene(elapsedTime, texture, dirt) {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        this.clearCol(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();
        let modelViewMartrix;
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -6.4 - 5 * (Math.sin(elapsedTime * 0.06) * 0.5 + 0.5)).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.08) * 0.5 + 0.5) * 0.5).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.1)));
        let scale = 2.0;
        modelViewMartrix = math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);
        let colLine = 255 << 24 | 255 << 8;
        let model = this.getDodecahedronMesh();
        this.drawObject(model, modelViewMartrix, 221, 96, 48);
        let yDisplacement = -1.5;
        let distance = 2.8;
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);
        model = this.getIcosahedronMesh();
        this.drawObject(model, modelViewMartrix, 239, 187, 115);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);
        model = this.getCubeMesh();
        this.drawObject(model, modelViewMartrix, 144, 165, 116);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);
        model = this.getCubeMesh();
        this.drawObject(model, modelViewMartrix, 191, 166, 154);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(modelViewMartrix);
        model = this.getPyramidMesh();
        this.drawObject(model, modelViewMartrix, 125, 128, 146);
        /**
         * SHADOWS
         */
        scale = 2.0;
        modelViewMartrix = math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.2).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 1.0, 0).multiplyMatrix(modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2)));
        modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));
        this.drawObject(this.getDodecahedronMesh(), modelViewMartrix, 48, 32, 24, true);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));
        this.drawObject(this.getPyramidMesh(), modelViewMartrix, 48, 32, 24, true, true);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(distance, yDisplacement + 0.5, -distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));
        this.drawObject(this.getCubeMesh(), modelViewMartrix, 48, 32, 24, true);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale * 0.5, scale * 2, scale * 0.5);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-distance, yDisplacement + 1, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));
        this.drawObject(this.getCubeMesh(), modelViewMartrix, 48, 32, 24, true);
        scale = 1.0;
        modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(distance, yDisplacement + 1.0, distance).multiplyMatrix(modelViewMartrix);
        modelViewMartrix = camera.multiplyMatrix(math_1.Matrix4f.constructShadowMatrix(modelViewMartrix).multiplyMatrix(modelViewMartrix));
        this.drawObject(this.getIcosahedronMesh(), modelViewMartrix, 48, 32, 24, true);
        let lensflareScreenSpace = this.project(camera.multiply(new math_1.Vector3f(12.0, 4.0, 0)));
        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 100, texture, dirt);
    }
    getBlenderScene(file, disp = true) {
        let scene = [];
        file.forEach(object => {
            let points = new Array();
            let normals = new Array();
            let index = new Array();
            let faces = new Array();
            object.vertices.forEach((v) => {
                // some transformation in order for the vertices to be in worldspace
                if (disp)
                    points.push(new math_1.Vector4f(v.x, v.y, v.z).mul(2).add(new math_1.Vector4f(0, -2.7, 0, 0)));
                else
                    points.push(new math_1.Vector4f(v.x, v.y, v.z).mul(2));
                //points.push(new Vector4f(v.x, v.y, v.z).mul(0.5).add(new Vector4f(0,3.7,0,0)));
            });
            for (let x = 0; x < object.faces.length; x++) {
                index.push(object.faces[x].vertices[0]);
                index.push(object.faces[x].vertices[1]);
                index.push(object.faces[x].vertices[2]);
            }
            object.normals.forEach((v) => {
                normals.push(new math_1.Vector4f(v.x, v.y, v.z));
            });
            let sphere = new Geometry_1.ComputationalGeometryUtils().computeBoundingSphere(points);
            sphere.getCenter().w = 1;
            // Create class for objects
            let obj = {
                points: points,
                normals: normals,
                faces: object.faces,
                points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
                normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0)),
                boundingSphere: sphere,
                name: object.name
            };
            scene.push(obj);
        });
        return scene;
    }
    /**
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    drawPlanedeformationTunnel(elapsedTime, texture, texture2) {
        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 320 / 2);
                let ydist = (y - 200 / 2);
                let dist = 256 * 20 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                let dist2 = dist;
                dist += elapsedTime * 0.02;
                dist2 += elapsedTime * 0.039;
                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 128 + elapsedTime * 0.0069;
                let color1 = texture.texture[(dist2 & 0xff) + (angle & 0xff) * 255];
                let color2 = texture2.texture[(dist & 0xff) + (angle & 0xff) * 255];
                let alpha = 0.4;
                let inverseAlpha = 1 - alpha;
                let r = (((color1 >> 0) & 0xff) * (inverseAlpha) + (((color2) >> 0) & 0xff) * (alpha)) | 0;
                let g = (((color1 >> 8) & 0xff) * (inverseAlpha) + (((color2) >> 8) & 0xff) * (alpha)) | 0;
                let b = (((color1 >> 16) & 0xff) * (inverseAlpha) + ((color2 >> 16) & 0xff) * (alpha)) | 0;
                this.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
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
            this.clearCol(72 | 56 << 8 | 48 << 16 | 255 << 24);
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
    drawParticleStreams(elapsedTime, texture, noClear = false) {
        let points = new Array();
        const num = 50;
        const num2 = 10;
        const scale = 2.1;
        for (let i = 0; i < num; i++) {
            let radius = 2.8;
            let radius2 = 2.9 + 3 * Math.sin(Math.PI * 2 * i / num - elapsedTime * 0.002);
            for (let j = 0; j < num2; j++) {
                let x = ((i - num / 2) * scale - elapsedTime * 0.008) % (num * scale) + (num * scale * 0.5);
                let y = Math.cos(Math.PI * 2 / num2 * j + i * 0.02 + elapsedTime * 0.0005) * radius + 8 + radius2;
                let z = Math.sin(Math.PI * 2 / num2 * j + i * 0.02 + elapsedTime * 0.0005) * radius;
                points.push(math_1.Matrix3f.constructXRotationMatrix(Math.PI * 2 * i / num - Math.sin(elapsedTime * 0.0003 + Math.PI * 2 * i / num)).multiply(new math_1.Vector3f(x, y, z)));
            }
        }
        for (let i = 0; i < 3; i++) {
            let modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(math_1.Matrix4f.constructZRotationMatrix(Math.PI * 0.17).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.00015).multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI * 2 / 3 * i + elapsedTime * 0.0006))));
            let points2 = new Array(points.length);
            points.forEach(element => {
                let transformed = this.project(modelViewMartrix.multiply(element));
                points2.push(transformed);
            });
            points2.sort(function (a, b) {
                return a.z - b.z;
            });
            points2.forEach(element => {
                //let size = -(2.0 * 192 / (element.z));
                let size = -(1.3 * 192 / (element.z));
                if (element.z < -4)
                    this.drawParticleNoDepth(Math.round(element.x - size / 2), Math.round(element.y - size / 2), Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-90, -55, element.z));
            });
        }
    }
    drawWormhole(elapsedTime, texture, noClear = false) {
        let points = new Array();
        const num = 50;
        const num2 = 10;
        const scale = 2.1;
        for (let i = 0; i < num; i++) {
            let radius = 5.8;
            for (let j = 0; j < num2; j++) {
                let x = ((i - num / 2) * scale - elapsedTime * 0.008) % (num * scale) + (num * scale * 0.5);
                let y = Math.cos(Math.PI * 2 / num2 * j) * radius + Math.cos(Math.PI * 2 / num * i) * 10;
                let z = Math.sin(Math.PI * 2 / num2 * j) * radius + Math.sin(Math.PI * 2 / num * i) * 10;
                points.push(new math_1.Vector3f(x, y, z));
            }
        }
        let modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(-Math.PI * 0.5 + Math.PI * 2 / num * (elapsedTime * 0.004 * scale)) * 10, Math.cos(-Math.PI * 0.5 + Math.PI * 2 / num * (elapsedTime * 0.004 * scale)) * 10, -49).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(Math.PI * 0.5));
        let points2 = new Array(points.length);
        points.forEach(element => {
            let transformed = this.project(modelViewMartrix.multiply(element));
            points2.push(transformed);
        });
        points2.sort(function (a, b) {
            return a.z - b.z;
        });
        points2.forEach(element => {
            //let size = -(2.0 * 192 / (element.z));
            let size = -(1.3 * 192 / (element.z));
            if (element.z < -4)
                this.drawParticleNoDepth(Math.round(element.x - size / 2), Math.round(element.y - size / 2), Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-90, -55, element.z));
        });
    }
    drawParticleTorus(elapsedTime, texture, noClear = false) {
        if (!noClear)
            this.clearCol(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();
        let points = new Array();
        const num = 300;
        for (let i = 0; i < num; i++) {
            let radi = 3.4 * (2 + Math.sin((i * Math.PI / (num / 2)) * 2 + elapsedTime * 0.0004)); //*sinf(Time*0.0008f)));
            let move = elapsedTime * 0.0015;
            let x = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 7);
            let y = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 4);
            let z = radi * Math.sin(((move + i) * Math.PI / (num / 2)) * 7);
            points.push(new math_1.Vector3f(x, y, z));
        }
        let modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -20)
            .multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0003)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0003)));
        let points2 = new Array(points.length);
        points.forEach(element => {
            let transformed = this.project(modelViewMartrix.multiply(element));
            points2.push(transformed);
        });
        points2.sort(function (a, b) {
            return a.z - b.z;
        });
        points2.forEach(element => {
            let size = -(2.2 * 192 / (element.z));
            this.drawParticle(Math.round(element.x) - Math.round(size / 2), Math.round(element.y) - Math.round(size / 2), Math.round(size), Math.round(size), texture, 1 / element.z, 1.0);
        });
    }
    /**
     * todo:
     * - better wavefront format that uses precomputed normals
     * - maybe use groups for material and culling
     * - use normal matrix instead of normalization during shading
     * - do not create the scene every frame
     * - create material class
     * - use camera path :-)!!!!!
     * - fix strange artefacts where geometry hits the plane
     *
     * @param {number} elapsedTime
     * @memberof Framebuffer
    
     *
     */
    drawBlenderScene(elapsedTime, texture, texture2) {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        this.clearCol(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();
        let keyFrames = [
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(-5, 3, 10), new math_1.Vector3f(0, 0, 0)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(5, 10, 10), new math_1.Vector3f(0, 0, 0.1)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(5, 10, 0), new math_1.Vector3f(1.5, -1, -0.2)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(5, 3, -10), new math_1.Vector3f(2.5, 0, -0.09)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(-5, 7, -10), new math_1.Vector3f(3.5, 0, 1)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(-5, 3, 10), new math_1.Vector3f(4, 0, 0.)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(5, 3, -2), new math_1.Vector3f(3, -0.2, 0.)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(18, 2, -0), new math_1.Vector3f(2, -0.4, 0.)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(15, 4, -0), new math_1.Vector3f(2, -0.5, 0.)),
            new CameraKeyFrame_1.CameraKeyFrame(new math_1.Vector3f(5, 7, -10), new math_1.Vector3f(2.5, 0, -0.09)),
        ];
        let cameraAnimator = new CameraAnimator_1.CameraAnimator();
        cameraAnimator.setKeyFrames(keyFrames);
        let modelViewMartrix = cameraAnimator.getViewMatrix(elapsedTime);
        let pos = new math_1.Vector4f(-modelViewMartrix.m14, -modelViewMartrix.m24, -modelViewMartrix.m34);
        let count = 0;
        let frustumCuller = new FrustumCuller_1.FrustumCuller();
        frustumCuller.updateFrustum(modelViewMartrix, cameraAnimator.pos);
        let i = 0;
        for (let j = 0; j < this.blenderObj.length; j++) {
            let model = this.blenderObj[j];
            if (frustumCuller.isPotentiallyVisible(model.boundingSphere)) {
                this.drawObject2(model, modelViewMartrix, 144, 165, 116);
                let colLine = 255 << 24 | 255 << 8;
                // this.drawBoundingSphere(model.boundingSphere, modelViewMartrix, colLine);
                // element.vis = true;
                count++;
            }
            else {
                let colLine = 255 << 24 | 255;
                // this.drawBoundingSphere(model.boundingSphere, modelViewMartrix, colLine);
                //   element.vis = false;
            }
        }
        if (texture2) {
            let points = new Array();
            let rng = new RandomNumberGenerator_1.default();
            rng.setSeed(66);
            for (let i = 0; i < 640; i++) {
                //points.push(new Vector3f(rng.getFloat() * 30 - 15, rng.getFloat() * 10 - 1, rng.getFloat() * 30 - 15));
                let x = rng.getFloat() * 30 - 15;
                x += Math.sin(elapsedTime * 0.0008 + x) * 2;
                let y = rng.getFloat() * 30 - 15;
                y += Math.sin(elapsedTime * 0.0009 + y) * 2;
                let z = rng.getFloat() * 30 - 15;
                z += Math.sin(elapsedTime * 0.0011 + z) * 2;
                points.push(new math_1.Vector3f(x, y, z));
            }
            let points2 = new Array(points.length);
            points.forEach(element => {
                let transformed = this.project(modelViewMartrix.multiply(element));
                points2.push(transformed);
            });
            points2.sort(function (a, b) {
                return a.z - b.z;
            });
            points2.forEach(element => {
                let size = -(3.1 * 192 / (element.z));
                this.drawSoftParticle(Math.round(element.x - size * 0.5), Math.round(element.y - size * 0.5), Math.round(size), Math.round(size), texture2, 1 / element.z, 1.0);
            });
        }
        this.drawText(8, 18 + 8, 'RENDERED OBJECTS: ' + count + '/' + this.blenderObj.length, texture);
        let colred = 255 << 24 | 255 | 255 << 8 | 255 << 16;
        let width = 320 / 2;
        let height = 200 / 2;
        //this.drawLineDDANoZ(new Vector3f(width / 2, height / 2, 0), new Vector3f(width / 2 + width, height / 2, -100), colred);
        //this.drawLineDDANoZ(new Vector3f(width / 2, height / 2, 0), new Vector3f(width / 2, height / 2 + height, -100), colred);
        //this.drawLineDDANoZ(new Vector3f(width / 2 + width, height / 2, 0), new Vector3f(width / 2 + width, height / 2 + height, -100), colred);
        //this.drawLineDDANoZ(new Vector3f(width / 2, height / 2 + height, 0), new Vector3f(width / 2 + width, height / 2 + height, -100), colred);
    }
    /**
     * Requirements for blender export:
     * - Wavefront OBJ
     * -
     */
    drawBlenderScene2(elapsedTime, texture3, texture, dirt) {
        this.clearDepthBuffer();
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -12).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)));
        let mv = camera.multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(5, 16, 5));
        let model = this.blenderObj2[0];
        this.drawObject2(model, mv, 246, 165, 177);
        mv = camera.multiplyMatrix(math_1.Matrix4f.constructZRotationMatrix(Math.PI * 0.5 * this.cosineInterpolate(0, 600, Math.floor(elapsedTime * 0.7) % 4000))
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI * 0.5 * this.cosineInterpolate(2000, 2600, Math.floor(elapsedTime * 0.7) % 4000))));
        model = this.blenderObj2[1];
        this.drawObject2(model, mv, 186, 165, 197);
        let lensflareScreenSpace = this.project(camera.multiply(new math_1.Vector3f(16.0 * 20, 16.0 * 20, 0)));
        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }
    drawBlenderScene3(elapsedTime, texture3, texture, dirt) {
        this.clearDepthBuffer();
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -5).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)));
        for (let i = 0; i < 10; i++) {
            const scale = Math.sin(Math.PI * 2 / 10 * i + elapsedTime * 0.002) * 0.2 + 0.2 + 0.3;
            let mv = camera.multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, ((i + elapsedTime * 0.0008) % 10) - 5, 0).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix((i * 0.36 + elapsedTime * 0.0016)).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, 1, scale))));
            let model = this.blenderObj3[0];
            this.drawObject2(model, mv, 246, 165, 177);
        }
        let lensflareScreenSpace = this.project(camera.multiply(new math_1.Vector3f(16.0 * 20, 16.0 * 20, 0)));
        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }
    drawBlenderScene4(elapsedTime, texture3, texture, dirt) {
        this.clearDepthBuffer();
        let camera = math_1.Matrix4f.constructTranslationMatrix(0, 0, -21).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)));
        let scale = 0.1 * 2.1 * 2.1;
        let factor = 2.1 - 0.09 - 0.09;
        let fade = 0.09;
        let dampFactor = Math.sin(elapsedTime * 0.00001) * 0.5 + 0.5;
        for (let i = 1; i < 6; i++) {
            scale *= factor;
            factor -= fade;
            let modelViewMartrix = math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.0005 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale));
            modelViewMartrix = math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.0006 + dampFactor * 0.7 * (4 - i)).multiplyMatrix(modelViewMartrix);
            let mv = camera.multiplyMatrix(modelViewMartrix);
            let model = this.blenderObj3[0];
            this.drawObject2(model, mv, 246, 165, 177);
        }
        let lensflareScreenSpace = this.project(camera.multiply(new math_1.Vector3f(16.0 * 20, 16.0 * 20, 0)));
        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
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
    drawStarField(elapsedTime) {
        let darkStarColor = 255 << 24 | 128 << 16 | 128 << 8 | 128;
        let lightStarColor = 255 << 24 | 255 << 16 | 255 << 8 | 255;
        let backgroundColor = 255 << 24 | 87 << 16 | 62 << 8 | 47;
        let rng = new RandomNumberGenerator_1.default();
        rng.setSeed(666);
        let stars = new Array();
        let stars2 = new Array();
        for (let i = 0; i < 100; i++) {
            stars.push(new math_1.Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }
        for (let i = 0; i < 60; i++) {
            stars2.push(new math_1.Vector3f(rng.getFloat() * 320, Math.round(rng.getFloat() * 200), 0));
        }
        this.clearCol(backgroundColor);
        for (let i = 0; i < 100; i++) {
            this.drawPixel(((stars[i].x + elapsedTime * 0.02) | 0) % 320, stars[i].y, darkStarColor);
        }
        for (let i = 0; i < 60; i++) {
            this.drawPixel(((stars2[i].x + elapsedTime * 0.04) | 0) % 320, stars2[i].y, lightStarColor);
        }
    }
    // TODO: implement fursutm culling here!
    isVisible(element) {
        return true;
    }
    shadingSphereClip(elapsedTime) {
        // this.clearColorBuffer();
        this.clearDepthBuffer();
        // one line is missing due to polygon clipping in viewport!
        let modelViewMartrix;
        let scale = 1.6;
        // viewMatrix = this.camera.getViewMatrix();
        modelViewMartrix = math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.1).multiplyMatrix(math_1.Matrix4f.constructScaleMatrix(scale, scale, scale));
        //modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2));
        modelViewMartrix = math_1.Matrix4f.constructZRotationMatrix(-elapsedTime * 0.02).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, -21)
            .multiplyMatrix(modelViewMartrix));
        /**
         * TODO:
         * - optimization
         * - object with position, rotation, material, color
         * - do not generate the object every frame!
         * - no temp arrays per frame!
         * - remove tempp matrix objects: instead store one global MV  matrix and manipulate it directly without generating temp amtrices every frame
         * - backface culling
         * - no lighting for culled triangles
         * - only z clip if necessary (no clip, fully visible)
         * - find the right time to compute the projection ( after transformation or after clipping to z plane? maybe hybrid?)
         */
        this.drawObject(this.obj, modelViewMartrix, 215, 30, 120);
    }
    drawObject2(obj, modelViewMartrix, red, green, blue, noLighting = false) {
        let normalMatrix = modelViewMartrix.computeNormalMatrix();
        for (let i = 0; i < obj.normals.length; i++) {
            normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        }
        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr(obj.points[i], obj.points2[i]);
        }
        let lightDirection = new math_1.Vector4f(0.5, 0.5, 0.3, 0.0).normalize();
        for (let i = 0; i < obj.faces.length; i++) {
            let v1 = obj.points2[obj.faces[i].vertices[0]];
            let v2 = obj.points2[obj.faces[i].vertices[1]];
            let v3 = obj.points2[obj.faces[i].vertices[2]];
            let normal = obj.normals2[obj.faces[i].normals[0]];
            // if (this.isTriangleCCW(v1,v2,v3)) {
            // 2d Backface culling is here not allowed because we did not project here!
            // FIXME: find a robust way to cull without cracks!
            if (this.isInFrontOfNearPlane(v1) && this.isInFrontOfNearPlane(v2) && this.isInFrontOfNearPlane(v3)) {
                let p1 = this.project(v1);
                let p2 = this.project(v2);
                let p3 = this.project(v3);
                if (this.isTriangleCCW(p1, p2, p3)) {
                    // TODO: do lighting only if triangle is visible
                    let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                    scalar = scalar * 0.85 + 0.15;
                    let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                    if (noLighting) {
                        color = 255 << 24 | red | green << 8 | blue << 16;
                    }
                    this.clipConvexPolygon(new Array(p1, p2, p3), color, true);
                }
            }
            else if (!this.isInFrontOfNearPlane(v1) && !this.isInFrontOfNearPlane(v2) && !this.isInFrontOfNearPlane(v3)) {
                continue;
            }
            else {
                let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                scalar = scalar * 0.85 + 0.15;
                let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                if (noLighting) {
                    color = 255 << 24 | red | green << 8 | blue << 16;
                }
                this.zClipTriangle(new Array(v1, v2, v3), color);
            }
        }
    }
    drawObject(obj, modelViewMartrix, red, green, blue, noLighting = false, oldLDir = true) {
        let normalMatrix = modelViewMartrix.computeNormalMatrix();
        for (let i = 0; i < obj.normals.length; i++) {
            normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        }
        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr2(obj.points[i], obj.points2[i]);
        }
        let lightDirection = oldLDir ? new math_1.Vector4f(0.5, 0.5, 0.3, 0.0).normalize() : new math_1.Vector4f(0.1, 0.1, -0.5, 0.0).normalize();
        for (let i = 0; i < obj.index.length; i += 3) {
            let v1 = obj.points2[obj.index[i]];
            let v2 = obj.points2[obj.index[i + 1]];
            let v3 = obj.points2[obj.index[i + 2]];
            let normal = obj.normals2[i / 3];
            // if (this.isTriangleCCW(v1,v2,v3)) {
            // 2d Backface culling is here not allowed because we did not project here!
            // FIXME: find a robust way to cull without cracks!
            if (this.isInFrontOfNearPlane(v1) && this.isInFrontOfNearPlane(v2) && this.isInFrontOfNearPlane(v3)) {
                let p1 = this.project(v1);
                let p2 = this.project(v2);
                let p3 = this.project(v3);
                if (this.isTriangleCCW(p1, p2, p3)) {
                    // TODO: do lighting only if triangle is visible
                    let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                    scalar = scalar * 0.85 + 0.15;
                    let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                    if (noLighting) {
                        color = 255 << 24 | red | green << 8 | blue << 16;
                    }
                    this.clipConvexPolygon(new Array(p1, p2, p3), color, true);
                }
            }
            else if (!this.isInFrontOfNearPlane(v1) && !this.isInFrontOfNearPlane(v2) && !this.isInFrontOfNearPlane(v3)) {
                continue;
            }
            else {
                let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                scalar = scalar * 0.85 + 0.15;
                let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                if (noLighting) {
                    color = 255 << 24 | red | green << 8 | blue << 16;
                }
                this.zClipTriangle(new Array(v1, v2, v3), color);
            }
        }
    }
    isInFrontOfNearPlane(p) {
        return p.z < this.NEAR_PLANE_Z;
    }
    computeNearPlaneIntersection(p1, p2) {
        let ratio = (this.NEAR_PLANE_Z - p1.z) / (p2.z - p1.z);
        return new math_1.Vector3f(ratio * (p2.x - p1.x) + p1.x, ratio * (p2.y - p1.y) + p1.y, this.NEAR_PLANE_Z);
    }
    zClipTriangle(subject, color) {
        let output = subject;
        let input = output;
        output = new Array();
        let S = input[input.length - 1];
        for (let i = 0; i < input.length; i++) {
            let point = input[i];
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
        if (output.length < 3) {
            return;
        }
        let projected = output.map((v) => {
            return this.project(v);
        });
        if (output.length === 3 && !this.isTriangleCCW(projected[0], projected[1], projected[2])) {
            return;
        }
        if (output.length === 4 && !this.isTriangleCCW2(projected[0], projected[1], projected[2], projected[3])) {
            return;
        }
        //if (this.isTriangleCCW(projected[0], projected[1], projected[2])) {
        this.clipConvexPolygon(projected, color, true);
        // }
    }
    torusFunction(alpha) {
        return new math_1.Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }
    torusFunction2(alpha) {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new math_1.Vector3f(r * Math.cos(p * alpha), r * Math.cos(q * alpha), r * Math.sin(p * alpha));
    }
    torusFunction3(alpha) {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new math_1.Vector4f(r * Math.cos(p * alpha), r * Math.cos(q * alpha), r * Math.sin(p * alpha)).mul(70);
    }
    /**
     * https://www.youtube.com/watch?v=VMD7fsCYO9o
     * http://www.cs.jhu.edu/~misha/Fall16/13.pdf
     * http://www.cubic.org/docs/3dclip.htm
     *
     * @param {number} elapsedTime
     * @memberof Framebuffer
     */
    shadingTorus2(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25, Math.sin(elapsedTime * 0.05) * 9, -24).multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
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
                    this.clipConvexPolygon(new Array(v1, v2, v3), color, false);
                }
                else {
                    this.drawTriangleDDA(v1, v2, v3, color);
                    //this.drawTriangleDDA2(v1, v2, v3, new Vector3f(0, 0, 0), new Vector3f(0, 16, 0), new Vector3f(16, 16, 0), color);
                }
            }
        }
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
    shadingTorusDamp(elapsedTime, sync) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 80;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(1.0);
            up = right.cross(tangent).normalize().mul(1.0);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(10));
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
        for (let i = 0; i < 7; i++) {
            let scale = 0.1 + 0.1 * i;
            let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.035 + 0.3 * (4 - i)));
            modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.04 + 0.3 * (4 - i)));
            /**
             * Vertex Shader Stage
             */
            let points2 = new Array();
            let normals2 = new Array();
            for (let n = 0; n < normals.length; n++) {
                normals2.push(modelViewMartrix.multiply(normals[n]));
            }
            let ukBasslineBpm = 130 / 2;
            let ukBasslineClapMs = 60000 / ukBasslineBpm;
            let smashTime = sync % ukBasslineClapMs;
            let smash = (this.cosineInterpolate(0, 15, smashTime) - this.cosineInterpolate(15, 200, smashTime) +
                0.4 * this.cosineInterpolate(200, 300, smashTime) - 0.4 * this.cosineInterpolate(300, 400, smashTime))
                * 12;
            modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -88).multiplyMatrix(modelViewMartrix);
            for (let p = 0; p < points.length; p++) {
                let transformed = modelViewMartrix.multiply(points[p]);
                let x = transformed.x;
                let y = transformed.y;
                let z = transformed.z; // TODO: use translation matrix!
                let xx = (320 * 0.5) + (x / (-z * 0.0078));
                let yy = (200 * 0.5) - (y / (-z * 0.0078));
                // commented out because it breaks the winding. inversion
                // of y has to be done after back-face culling in the
                // viewport transform
                // yy =(200 * 0.5) - (y / (-z * 0.0078));
                points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                    let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.5, 0.5, 0.5).normalize()))) + 0.2, 1.0);
                    let color = 255 << 24 | (scalar * 136) << 16 | (scalar * 215) << 8 | (scalar * 244);
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
                        this.clipConvexPolygon(new Array(v1, v2, v3), color, false);
                    }
                    else {
                        this.drawTriangleDDA(v1, v2, v3, color);
                        //this.drawTriangleDDA2(v1, v2, v3, new Vector3f(0, 0, 0), new Vector3f(0, 16, 0), new Vector3f(16, 16, 0), color);
                    }
                }
            }
        }
    }
    shadingTorus5(elapsedTime, sync) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 80;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction2(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction2(i * 2 * Math.PI / STEPS + 0.1);
            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(0.4);
            up = right.cross(tangent).normalize().mul(0.4);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(10));
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.04));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        let ukBasslineBpm = 130 / 2;
        let ukBasslineClapMs = 60000 / ukBasslineBpm;
        let smashTime = sync % ukBasslineClapMs;
        let smash = (this.cosineInterpolate(0, 15, smashTime) - this.cosineInterpolate(15, 200, smashTime) +
            0.4 * this.cosineInterpolate(200, 300, smashTime) - 0.4 * this.cosineInterpolate(300, 400, smashTime))
            * 12;
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 20, Math.sin(elapsedTime * 0.05) * 8 - smash, -28).multiplyMatrix(modelViewMartrix);
        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiply(points[p]);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
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
                    this.clipConvexPolygon(new Array(v1, v2, v3), color, false);
                }
                else {
                    this.drawTriangleDDA(v1, v2, v3, color);
                    //this.drawTriangleDDA2(v1, v2, v3, new Vector3f(0, 0, 0), new Vector3f(0, 16, 0), new Vector3f(16, 16, 0), color);
                }
            }
        }
    }
    torusTunnel(elapsedTime, sync, texture) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 80;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction3(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction3(i * 2 * Math.PI / STEPS + 0.1);
            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(26.4);
            up = right.cross(tangent).normalize().mul(26.4);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(1));
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
            normals.push(normal.normalize());
        }
        let scale = 1.0;
        let frame = this.torusFunction3(elapsedTime * 0.02);
        let frame2 = this.torusFunction3(elapsedTime * 0.02 + 0.01);
        let tangent = frame2.sub(frame).normalize();
        let up = frame.add(frame2).normalize();
        let right = tangent.cross(up).normalize();
        up = right.cross(tangent).normalize();
        let translation = math_1.Matrix4f.constructIdentityMatrix();
        // translation vector
        translation.m14 = -frame.x;
        translation.m24 = -frame.y;
        translation.m34 = -frame.z;
        let rotation = math_1.Matrix4f.constructIdentityMatrix();
        // x vector
        rotation.m11 = right.x;
        rotation.m21 = right.y;
        rotation.m31 = right.z;
        // y vector
        rotation.m12 = up.x;
        rotation.m22 = up.y;
        rotation.m32 = up.z;
        // z vector
        rotation.m13 = -tangent.x;
        rotation.m23 = -tangent.y;
        rotation.m33 = -tangent.z;
        let finalMatrix = rotation.transpose().multiplyMatrix(translation);
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -10).multiplyMatrix(modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.04)));
        modelViewMartrix = math_1.Matrix4f.constructZRotationMatrix(elapsedTime * 0.01).multiplyMatrix(finalMatrix);
        let model = {
            points: points,
            normals: normals,
            index: index,
            points2: points.map(() => new math_1.Vector4f(0, 0, 0, 0)),
            normals2: normals.map(() => new math_1.Vector4f(0, 0, 0, 0))
        };
        // model = this.getDodecahedronMesh();
        this.drawObject(model, modelViewMartrix, 221, 96, 48, false, false);
        let ppoints = new Array();
        const num = 40;
        const STEPS22 = 8 * 2;
        for (let j = 0; j < num; j++) {
            let frame = this.torusFunction3(j * 2 * Math.PI / num);
            let frame2 = this.torusFunction3(j * 2 * Math.PI / num + 0.1);
            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize();
            let right = tangent.cross(up).normalize().mul(10.4);
            up = right.cross(tangent).normalize().mul(10.4);
            for (let r = 0; r < STEPS22; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS22)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS22))).add(frame);
                ppoints.push(new math_1.Vector3f(pos.x, pos.y, pos.z));
            }
        }
        let ppoints2 = new Array(ppoints.length);
        ppoints.forEach(element => {
            let transformed = this.project(modelViewMartrix.multiply(element));
            ppoints2.push(transformed);
        });
        ppoints2.sort(function (a, b) {
            return a.z - b.z;
        });
        ppoints2.forEach(element => {
            //let size = -(2.0 * 192 / (element.z));
            let size = -(2.3 * 192 / (element.z));
            if (element.z < -4)
                this.drawParticle(Math.round(element.x - size / 2), Math.round(element.y - size / 2), Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-90, -55, element.z));
        });
    }
    shadingTorus4(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        let textCoords = [];
        const STEPS = 15;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
                let t = new Vertex_1.TextureCoordinate();
                t.u = 1 / (STEPS2) * r;
                t.v = 1 / (STEPS) * i;
                textCoords.push(t);
            }
        }
        let index = [];
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
        // compute normals
        let normals = new Array();
        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }
        let scale = 2.1;
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10, -45)
            .multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        }
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertexArray = new Array(new Vertex_1.Vertex(), new Vertex_1.Vertex(), new Vertex_1.Vertex());
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.2, 0.2, 1).normalize())) * 255), 255);
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;
                //let color = 255 << 24 | 255 << 16 | 150 << 8 | 255;
                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = textCoords[index[i]];
                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = textCoords[index[i + 1]];
                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = textCoords[index[i + 2]];
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingTorusENvironment(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        let textCoords = [];
        // compute normals
        let normals = new Array();
        const STEPS = 15 * 2;
        const STEPS2 = 8 * 2;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
                normals.push(frame.sub(pos).normalize());
                let t = new Vertex_1.TextureCoordinate();
                t.u = 1 / (STEPS2) * r;
                t.v = 1 / (STEPS) * i;
                textCoords.push(t);
            }
        }
        let index = [];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10, -45)
            .multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        }
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.1, 0.1, -1).normalize())) * 205 + 50), 255);
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
                    this.clipConvexPolygon2(vertexArray, color);
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
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
    shadingSphereEnv(elapsedTime) {
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
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 3.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 2.3));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 1.0) * 46, Math.sin(elapsedTime * 1.2) * 20, -85)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingPlaneEnv(elapsedTime) {
        this.wBuffer.fill(100);
        let result = this.plane;
        let scale2 = (Math.sin(elapsedTime * 1.8) + 1) * 0.5;
        for (let i = 0; i < result.points.length; i++) {
            let y = result.points[i].y - 30;
            let x = result.points[i].x - 50;
            let length = Math.sqrt(x * x + y * y);
            result.points2[i].y = result.points[i].y;
            result.points2[i].x = result.points[i].x;
            result.points2[i].z = result.points[i].z + (Math.sin(result.points[i].y * 0.2 + elapsedTime * 2.83) * 5.3
                + Math.sin(result.points[i].x * 0.5 + elapsedTime * 2.83) * 4.3) * scale2
                + Math.sin(length * 0.4 - elapsedTime * 3.83) * 4.3;
            result.normals[i].x = 0;
            result.normals[i].y = 0;
            result.normals[i].z = 0;
        }
        let points = result.points2;
        let index = result.index;
        let normals = result.normals;
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(Math.PI + Math.sin(elapsedTime * 2.75) * 0.25)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(Math.PI / 5 + Math.sin(elapsedTime * 2.25) * 0.35).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(-50, -25, 0))));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -205 + Math.sin(elapsedTime * 1.9) * 50)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingCylinderEnv(elapsedTime) {
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
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
            norm.sub2(v2, v1);
            norm2.sub2(v3, v1);
            cross.cross2(norm, norm2);
            let normal = cross;
            normals[index[i]].add2(normals[index[i]], normal);
            normals[index[i + 1]].add2(normals[index[i + 1]], normal);
            normals[index[i + 2]].add2(normals[index[i + 2]], normal);
        }
        let textureCoords = result.texture;
        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }
        let scale = 3.7;
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(0)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(0).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, 0))));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-80, -210, -290)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingCylinderEnvDisp(elapsedTime) {
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
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(0)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(0.2 * Math.sin(elapsedTime * 1.2)).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, 0))));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-80, -210, -290)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingSphereEnvDisp(elapsedTime) {
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
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.3).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, 0))));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-0, -0, -10)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    shadingSphereEnvDisp2(elapsedTime) {
        this.wBuffer.fill(100);
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
        let norm = new math_1.Vector3f(0, 0, 0);
        let norm2 = new math_1.Vector3f(0, 0, 0);
        let cross = new math_1.Vector3f(0, 0, 0);
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.35)
            .multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.3).multiplyMatrix(math_1.Matrix4f.constructTranslationMatrix(0, 0, 0))));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(-0, -0, -10 - (Math.sin(elapsedTime * 0.3) * 0.5 + 0.5) * 6)
            .multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
        let points2 = result.points2;
        let normals2 = result.normals2;
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }
    /**
     * Optimization:
     * - no shading / only texture mapping (use function pointers to set correct rasterization function)
     * - use delta step method from black art of 3d programming
     * - generate object only once
     * - dont use temp arrays / instead use always the same array preallocated
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
    reflectionBunny(elapsedTime) {
        this.clearDepthBuffer();
        let obj = this.bunnyObj;
        let scale = 64.1;
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.30));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -8).multiplyMatrix(modelViewMartrix);
        /**
         * Vertex Shader Stage
         */
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
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        let vertex1 = new Vertex_1.Vertex();
        vertex1.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex2 = new Vertex_1.Vertex();
        vertex2.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertex3 = new Vertex_1.Vertex();
        vertex3.textureCoordinate = new Vertex_1.TextureCoordinate();
        let vertexArray = new Array(vertex1, vertex2, vertex3);
        for (let i = 0; i < obj.index.length; i += 6) {
            // Only render triangles with CCW-ordered vertices
            // 
            // Reference:
            // David H. Eberly (2006).
            // 3D Game Engine Design: A Practical Approach to Real-Time Computer Graphics,
            // p. 69. Morgan Kaufmann Publishers, United States.
            //
            let v1 = obj.points2[obj.index[i]];
            let v2 = obj.points2[obj.index[i + 1]];
            let v3 = obj.points2[obj.index[i + 2]];
            // this is the bottleneck: 20 -> 48 fps speedup
            // when normalization is removed!
            // solution: dont use MV for normal transformation
            // use normal matrix instead
            // normalMatrix : transpose(inverse(MV))
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
                }
                else {
                    // this.drawTriangleDDA(v1, v2, v3, color);
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], 0);
                }
            }
        }
    }
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
    shadingTorus3(elapsedTime) {
        let points = [];
        const STEPS = 15 * 2;
        const STEPS2 = 12 * 2;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);
            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }
        let scale = 1.2;
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25, Math.sin(elapsedTime * 0.05) * 9, -34).multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        }
        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */
        for (let i = 0; i < points2.length; i++) {
            let v1 = points2[i];
            let color = 0xffbbffbb;
            if (v1.x > Framebuffer.minWindow.x && v1.x < Framebuffer.maxWindow.x &&
                v1.y > Framebuffer.minWindow.y && v1.y < Framebuffer.maxWindow.y) {
                this.drawPixel(v1.x, v1.y, color);
            }
        }
    }
    /**
     * FIXME: optimize by minimizing creation of new arrays
     * https://www.npmjs.com/package/npm-check-updates
     *
     * @param {Vector3f} v1
     * @param {Vector3f} v2
     * @param {Vector3f} v3
     * @param {number} color
     * @returns {void}
     * @memberof Framebuffer
     */
    clipConvexPolygon(subject, color, clipping = true) {
        let output = subject;
        for (let j = 0; j < Framebuffer.clipRegion.length; j++) {
            let edge = Framebuffer.clipRegion[j];
            let input = output;
            output = new Array();
            let S = input[input.length - 1];
            for (let i = 0; i < input.length; i++) {
                let point = input[i];
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
        ;
        if (output.length < 3) {
            return;
        }
        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
            this.drawTriangleDDA(output[0], output[1 + i], output[2 + i], color);
        }
    }
    clipConvexPolygon2(subject, color) {
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
            this.drawTriangleDDA2(output[0], output[1 + i], output[2 + i], color);
        }
    }
    drawLensFlare(screenPos, elapsedTime, texture, dirt) {
        let pos = screenPos;
        if (pos.z < 0 &&
            pos.x > 0 && pos.x < 320 &&
            pos.y > 0 && pos.y < 200 &&
            this.wBuffer[pos.x + (pos.y * 320)] > (-1 / 100)) {
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
    // TODO: create interesting pattern!
    led(elapsedTime, texture) {
        let time = elapsedTime * 0.0007 * 1.0;
        let lineDirection = new math_1.Vector3f(Math.sin(time), Math.cos(time), 0);
        let radialWaveCenter = new math_1.Vector3f(40.0 / 2.0, 35.0 / 2.0, 0).add(new math_1.Vector3f(40.0 / 2.0 *
            Math.sin(-time * 1.2), 35.0 / 2.0 * Math.cos(-time * 1.2), 0));
        let difference = new math_1.Vector3f(0, 0, 0);
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                let directionalWave = (Math.sin((x * lineDirection.x + y * lineDirection.y) * 0.8 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                let radialWave = (Math.cos(difference.length() * 0.7) + 1.0) * 0.5;
                let waveSum = (radialWave + directionalWave) * 0.5;
                let intensity = ((waveSum * 15) | 0) % 16;
                this.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * intensity, 8, 8, texture);
            }
        }
    }
    shadingTorus(elapsedTime) {
        this.wBuffer.fill(100);
        let points = [];
        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new math_1.Vector3f(0.0, 4.0, 0);
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
        let modelViewMartrix = math_1.Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix4f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        /**
         * Vertex Shader Stage
         */
        let points2 = new Array();
        let normals2 = new Array();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }
        modelViewMartrix = math_1.Matrix4f.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
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
            new math_1.Vector3f(-1.0, -1.0, 1.0), new math_1.Vector3f(1.0, -1.0, 1.0),
            new math_1.Vector3f(1.0, 1.0, 1.0), new math_1.Vector3f(-1.0, 1.0, 1.0),
            new math_1.Vector3f(-1.0, -1.0, -1.0), new math_1.Vector3f(1.0, -1.0, -1.0),
            new math_1.Vector3f(1.0, 1.0, -1.0), new math_1.Vector3f(-1.0, 1.0, -1.0),
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
        let modelViewMartrix = math_1.Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix3f.constructXRotationMatrix(elapsedTime * 0.08));
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
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
                let light = new math_1.Vector3f(0.5, 0.5, 0.5);
                let ambient = new math_1.Vector3f(50, 100, 50);
                let diffuse = new math_1.Vector3f(90, 90, 90).mul(Math.max(0.0, normal.normalize().dot(light.normalize())));
                let reflection = new math_1.Vector3f(0, 0, 1).sub(light.mul(-1).normalize());
                // http://www.lighthouse3d.com/tutorials/glsl-tutorial/directional-lights-per-vertex-ii/
                let specular = new math_1.Vector3f(0, 0, 0);
                let phong = ambient.add(diffuse).add(specular);
                let color = 255 << 24 | (phong.z & 0xff) << 16 | (phong.y & 0xff) << 8 | (phong.x & 0xff);
                this.drawTriangleDDA(v1, v2, v3, color);
            }
        }
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
        let det = v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v1.y - v1.x * v3.y;
        if (this.cullMode == CullFace_1.CullFace.BACK) {
            return det < 0.0;
        }
        else {
            return det > 0.0;
        }
    }
    isTriangleCCW2(v1, v2, v3, v4) {
        let det = v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v4.y - v4.x * v3.y +
            v4.x * v1.y - v1.x * v4.y;
        if (this.cullMode == CullFace_1.CullFace.BACK) {
            return det < 0.0;
        }
        else {
            return det > 0.0;
        }
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
            new math_1.Vector3f(-1.0, -1.0, 1.0), new math_1.Vector3f(1.0, -1.0, 1.0),
            new math_1.Vector3f(1.0, 1.0, 1.0), new math_1.Vector3f(-1.0, 1.0, 1.0),
            new math_1.Vector3f(-1.0, -1.0, -1.0), new math_1.Vector3f(1.0, -1.0, -1.0),
            new math_1.Vector3f(1.0, 1.0, -1.0), new math_1.Vector3f(-1.0, 1.0, -1.0),
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
        let modelViewMartrix = math_1.Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix3f.constructXRotationMatrix(elapsedTime * 0.08));
        for (let i = 0; i < 2; i++) {
            let points2 = new Array();
            points.forEach(element => {
                let transformed = modelViewMartrix.multiply(element);
                let x = transformed.x + i * 4 - 2;
                let y = transformed.y;
                let z = transformed.z - 9; // TODO: use translation matrix!
                let xx = (320 * 0.5) + (x / (-z * 0.0078));
                let yy = (200 * 0.5) - (y / (-z * 0.0078));
                points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
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
            points.push(new math_1.Vector3f(x.x, x.y, x.z));
        });
        let scale = 4.0;
        let modelViewMartrix = math_1.Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(math_1.Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(math_1.Matrix3f.constructXRotationMatrix(elapsedTime * 0.05));
        let points2 = new Array();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);
            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!
            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new math_1.Vector3f(Math.round(xx), Math.round(yy), z));
        });
        let color = 255 | 255 << 16 | 255 << 24;
        for (let i = 0; i < index.length; i += 3) {
            // backface culling
            if (points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1])).z < 0) {
                let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1])).mul(-1);
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new math_1.Vector3f(1, -1, 0).normalize())) * 155), 255) + 100;
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
    fillLongRightTriangle2(v1, v2, v3, color) {
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
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.bob.width), this.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.bob.height), this.bob.height - 1), 0) | 0;
                    let color2 = this.bob.texture[u + v * this.bob.width];
                    /** shading code */
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer[framebufferIndex] = color2;
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
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.bob.width), this.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.bob.height), this.bob.height - 1), 0) | 0;
                    let color2 = this.bob.texture[u + v * this.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer[framebufferIndex] = color2;
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
    fillLongLeftTriangle2(v1, v2, v3, t1, t2, t3, color) {
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
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.bob.width), this.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.bob.height), this.bob.height - 1), 0) | 0;
                    let color2 = this.bob.texture[u + v * this.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer[framebufferIndex] = color2;
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
                if (wStart < this.wBuffer[framebufferIndex]) {
                    this.wBuffer[framebufferIndex] = wStart;
                    let z = 1 / wStart;
                    let u = Math.max(Math.min((uStart * z * this.bob.width), this.bob.width - 1), 0) | 0;
                    let v = Math.max(Math.min((vStart * z * this.bob.height), this.bob.height - 1), 0) | 0;
                    let color2 = this.bob.texture[u + v * this.bob.width];
                    //let scale = ((color >> 8) & 0xff) / 255;
                    //let r = (color2 & 0xff) * scale;
                    //let g = ((color2 >> 8) & 0xff) * scale;
                    //let b = ((color2 >> 16) & 0xff) * scale;
                    //this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | 255 << 24;
                    this.framebuffer[framebufferIndex] = color2;
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
    drawTriangleDDA2(p1, p2, p3, color) {
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
        if (p1.position.y == p3.position.y) {
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
                this.fillLongRightTriangle2(p1, p2, p3, color);
            }
            else {
                let tex = p1.textureCoordinate;
                let tex2 = p2.textureCoordinate;
                let tex3 = p3.textureCoordinate;
                this.fillLongLeftTriangle2(p1.position, p2.position, p3.position, new math_1.Vector3f(tex.u, tex.v, 0), new math_1.Vector3f(tex2.u, tex2.v, 0), new math_1.Vector3f(tex3.u, tex3.v, 0), color);
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
    /**
     * Generates a voxel landscape.
     *
     * TODO:
     * - y-span color interpolation
     * - texturing
     *
     * http://simulationcorner.net/index.php?page=comanche
     * http://www.flipcode.com/archives/Realtime_Voxel_Landscape_Engines-Part_2_Rendering_the_Landscapes_Structure.shtml
     * http://www.massal.net/article/voxel/
     *
     * @param {Texture} texture The heightmap
     * @param {number} time Elapsed time in milliseconds
     *
     * @memberof Framebuffer
     */
    drawVoxelLandscape2(texture, time) {
        this.clearCol(255 << 24);
        const MIN_DIST = 45;
        const MAX_DIST = 200;
        let camX = time * 0.008;
        let camY = 0;
        const focus = 125.7;
        const center = 300;
        const eye = 250;
        for (let x = 0; x < 320; x++) {
            let dirX = Math.cos(time * 0.0005 + x * 0.005) * 0.4;
            let dirY = Math.sin(time * 0.0005 + x * 0.005) * 0.4;
            let highestPoint = 0;
            let rayX = camX + dirX * MIN_DIST;
            let rayY = camY + dirY * MIN_DIST;
            for (let dist = MIN_DIST; dist < MAX_DIST; dist++) {
                let height = this.getBilinearFilteredPixel(texture, rayX, rayY);
                let projHeight = Math.round((height - eye) * focus / dist + center);
                let color = Math.round(height) * Math.min(1.0, (1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST)) * 10);
                let packedRGB = 255 << 24 | (color + 10) << 16 | (color + 20) << 8 | (color + 13);
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
    drawVoxelLandscape3(texture, time) {
        this.clearCol(255 << 24);
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
                let height = (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * 0.6;
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
        this.clearCol(255 << 24);
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
                let height = (texture.texture[(rayX & 0xff) + (rayY & 0xff) * 256] & 0xff) * Math.sin(Math.abs((dist - MIN_DIST) * 0.5 / (MAX_DIST - MIN_DIST))) * 3.5;
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
    getPixel(texture, x, y) {
        return texture.texture[(x & 0xff) + (y & 0xff) * 256];
    }
    getPixel2(texture, x, y) {
        return texture.texture[x + y * texture.width];
    }
    getBilinearFilteredPixel(texture, x, y) {
        let x0 = (((x | 0) % 256) + 256) % 256;
        let x1 = ((((x + 1) | 0) % 256) + 256) % 256;
        let y0 = (((y | 0) % 256) + 256) % 256;
        let y1 = ((((y + 1) | 0) % 256) + 256) % 256;
        let x0y0 = this.getPixel(texture, x0, y0) & 0xff;
        let x1y0 = this.getPixel(texture, x1, y0) & 0xff;
        let x0y1 = this.getPixel(texture, x0, y1) & 0xff;
        let x1y1 = this.getPixel(texture, x1, y1) & 0xff;
        let col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        let col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        let col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));
        return col;
    }
    getBilinearFilteredPixel2(texture, x, y) {
        let x0 = Math.min(x | 0, texture.width - 1);
        let x1 = Math.min((x | 0) + 1, texture.width - 1);
        let y0 = Math.min(y | 0, texture.height - 1);
        let y1 = Math.min((y | 0) + 1, texture.height - 1);
        let x0y0 = this.getPixel2(texture, x0, y0);
        let x1y0 = this.getPixel2(texture, x1, y0);
        let x0y1 = this.getPixel2(texture, x0, y1);
        let x1y1 = this.getPixel2(texture, x1, y1);
        return this.interpolateComp(x, y, x0y0 & 0xff, x1y0 & 0xff, x0y1 & 0xff, x1y1 & 0xff) |
            this.interpolateComp(x, y, x0y0 >> 8 & 0xff, x1y0 >> 8 & 0xff, x0y1 >> 8 & 0xff, x1y1 >> 8 & 0xff) << 8 |
            this.interpolateComp(x, y, x0y0 >> 16 & 0xff, x1y0 >> 16 & 0xff, x0y1 >> 16 & 0xff, x1y1 >> 16 & 0xff) << 16;
    }
    interpolateComp(x, y, x0y0, x1y0, x0y1, x1y1) {
        let col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        let col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        let col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));
        return col;
    }
    drawTitanEffect() {
        this.clear();
        const horizontalNum = 320 / 20;
        const verticalNum = 200 / 20;
        for (let x = 0; x < horizontalNum; x++) {
            for (let y = 0; y < verticalNum; y++) {
                let scale = ((Math.sin(Date.now() * 0.004 + x * 0.7 + y * 0.4) + 1) / 2);
                let size = Math.round(scale * 8 + 1) * 2;
                let offset = (20 / 2 - size / 2) | 0;
                let color = 255 << 24 | (85 * scale) << 16 | (55 * scale) << 8 | (55 * scale);
                this.drawBox2(x * 20 + offset, y * 20 + offset, size, size, color);
            }
        }
    }
    drawMetaballs() {
        let balls = [
            new math_1.Vector3f(Math.sin(Date.now() * 0.002) * 100 + 150, Math.cos(Date.now() * 0.0035) * 70 + 100, 0),
            new math_1.Vector3f(Math.sin(Date.now() * 0.0015) * 100 + 150, Math.cos(Date.now() * 0.002) * 70 + 100, 0),
            new math_1.Vector3f(Math.sin(Date.now() * 0.003) * 100 + 150, Math.cos(Date.now() * 0.0045) * 70 + 100, 0)
        ];
        let index = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let intensity = 0;
                for (let b = 0; b < 3; b++) {
                    let xx = (balls[b].x - x);
                    let yy = (balls[b].y - y);
                    let length = Math.sqrt(xx * xx + yy * yy);
                    intensity += 5500 / length;
                }
                this.framebuffer[index++] = 255 << 24 | this.mapColor(intensity);
            }
        }
    }
    interpolateColor(start, end, value, color1, color2) {
        let scale = this.interpolate(start, end, value);
        let red = (color1 >> 0 & 0xff) * (1 - scale) + scale * (color2 >> 0 & 0xff);
        let green = (color1 >> 8 & 0xff) * (1 - scale) + scale * (color2 >> 8 & 0xff);
        let blue = (color1 >> 16 & 0xff) * (1 - scale) + scale * (color2 >> 16 & 0xff);
        return red | green << 8 | blue << 16;
    }
    mapColor(intensity) {
        if (intensity >= 235) {
            return 255;
        }
        else if (intensity >= 230) {
            return this.interpolateColor(230, 235, intensity, 255 << 8 | 255, 255);
        }
        else if (intensity >= 100) {
            return this.interpolateColor(100, 230, intensity, 255 << 8, 255 << 8 | 255);
        }
        return 255 << 8;
    }
    draw(texture, time) {
        // this.clearCol(80 << 16 | 80 << 8 | 99 << 0 | 255 << 24)
        let a = time * 0.001;
        for (let i = 10; i < 190; i++) {
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
Framebuffer.minWindow = new math_1.Vector3f(0, 0, 0);
Framebuffer.maxWindow = new math_1.Vector3f(319, 199, 0);
Framebuffer.REGION_CODE_CENTER = 0b0000;
Framebuffer.REGION_CODE_LEFT = 0b0001;
Framebuffer.REGION_CODE_RIGHT = 0b0010;
Framebuffer.REGION_CODE_BOTTOM = 0b0100;
Framebuffer.REGION_CODE_TOP = 0b1000;
// Sutherland-Hodgman
// http://www.sunshine2k.de/coding/java/SutherlandHodgman/SutherlandHodgman.html
// http://www.cubic.org/docs/3dclip.htm
Framebuffer.clipRegion = new Array(new RightEdge(), new LeftEdge(), new BottomEdge(), new TopEdge());
exports.default = Framebuffer;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(0);
const Plane_1 = __webpack_require__(14);
class FrustumCuller {
    constructor() {
        this.planes = new Array();
        for (let i = 0; i < 6; i++) {
            this.planes.push(new Plane_1.default(new index_1.Vector4f(0, 0, 0, 0), 0));
        }
        this.pos = new index_1.Vector4f(0, 0, 0, 0);
        const DISTANCE = 192;
        let SCREEN_HEIGHT = 320 / 2;
        let SCREEN_WIDTH = 200 / 2;
        let HORIZONTAL_FIELD_OF_VIEW = 2.0 * Math.atan(SCREEN_HEIGHT / (2.0 * DISTANCE));
        let VERTICAL_FIELD_OF_VIEW = 2.0 * Math.atan(SCREEN_WIDTH / (2.0 * DISTANCE));
        let HALF_HORIZONTAL_FOV = HORIZONTAL_FIELD_OF_VIEW * 1.0;
        let HALF_VERTICAL_FOV = VERTICAL_FIELD_OF_VIEW * 1.0;
        const NEAR_DISTANCE = 1.7;
        const FAR_DISTANCE = 30.0;
        this.near = NEAR_DISTANCE;
        this.far = FAR_DISTANCE;
        this.normals = [
            new index_1.Vector4f(Math.cos(-HALF_HORIZONTAL_FOV), 0, Math.sin(-HALF_HORIZONTAL_FOV), 0.0),
            new index_1.Vector4f(-Math.cos(HALF_HORIZONTAL_FOV), 0, -Math.sin(HALF_HORIZONTAL_FOV), 0.0),
            new index_1.Vector4f(0, -Math.cos(HALF_VERTICAL_FOV), -Math.sin(HALF_VERTICAL_FOV), 0.0),
            new index_1.Vector4f(0, Math.cos(-HALF_VERTICAL_FOV), Math.sin(-HALF_VERTICAL_FOV), 0.0),
            new index_1.Vector4f(0.0, 0.0, -1.0, 0.0),
            new index_1.Vector4f(0.0, 0.0, 1.0, 0.0)
        ];
    }
    // precompute normal vectors in constructor
    // dont create temp objects
    updateFrustum(modelViewMatrix, position) {
        const inverseRotation = modelViewMatrix.getInverseRotation();
        inverseRotation.multiplyHomArr(this.normals[0], this.planes[0].normal); // left
        inverseRotation.multiplyHomArr(this.normals[1], this.planes[1].normal); // right
        inverseRotation.multiplyHomArr(this.normals[2], this.planes[2].normal); // bottom
        inverseRotation.multiplyHomArr(this.normals[3], this.planes[3].normal); // top
        inverseRotation.multiplyHomArr(this.normals[4], this.planes[4].normal); // near
        inverseRotation.multiplyHomArr(this.normals[5], this.planes[5].normal); // far
        this.pos.x = -position.x;
        this.pos.y = -position.y;
        this.pos.z = -position.z;
        this.planes[0].distance = -this.planes[0].normal.dot(this.pos);
        this.planes[1].distance = -this.planes[1].normal.dot(this.pos);
        this.planes[2].distance = -this.planes[2].normal.dot(this.pos);
        this.planes[3].distance = -this.planes[3].normal.dot(this.pos);
        this.planes[4].distance = -this.planes[4].normal.dot(this.pos) + this.near;
        this.planes[5].distance = -this.planes[3].normal.dot(this.pos) - this.far;
    }
    isPotentiallyVisible(boundingVolume) {
        for (let i = 0; i < this.planes.length; i++) {
            if (!boundingVolume.isInsidePositiveHalfSpace(this.planes[i])) {
                return false;
            }
        }
        return true;
    }
}
exports.FrustumCuller = FrustumCuller;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(1);
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
/* 13 */
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
const Vector3f_1 = __webpack_require__(1);
const Vector4f_1 = __webpack_require__(3);
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Plane {
    constructor(normal, distance) {
        this.normal = normal;
        this.distance = distance;
    }
    getNormal() {
        return this.normal;
    }
    getDistance() {
        return this.distance;
    }
}
exports.default = Plane;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __webpack_require__(0);
const Sphere_1 = __webpack_require__(16);
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CameraKeyFrame {
    constructor(position, rotation) {
        this.position = position;
        this.rotation = rotation;
    }
}
exports.CameraKeyFrame = CameraKeyFrame;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3f_1 = __webpack_require__(1);
const camera_1 = __webpack_require__(4);
class CameraAnimator {
    // TODO:
    // - should we really loop or better restart??
    // - dont use linear interpolation see bourke
    // - maybe quaternions and slerp for rotation
    // temp solution: no linear for 
    setKeyFrames(keyFrames) {
        this.keyFrames = keyFrames;
    }
    getViewMatrix(elapsedTime) {
        let keyFrameDuration = 5000;
        let first = ((elapsedTime / keyFrameDuration) | 0) % this.keyFrames.length;
        let zero = ((first - 1) + this.keyFrames.length) % this.keyFrames.length;
        let second = (first + 1) % this.keyFrames.length;
        let third = (first + 2) % this.keyFrames.length;
        let fraction = ((elapsedTime / keyFrameDuration) % this.keyFrames.length) - first;
        let mu2 = (1 - Math.cos(fraction * Math.PI)) / 2;
        let position = new Vector3f_1.Vector3f(CosineInterpolate(this.keyFrames[first].position.x, this.keyFrames[second].position.x, fraction), CosineInterpolate(this.keyFrames[first].position.y, this.keyFrames[second].position.y, fraction), CosineInterpolate(this.keyFrames[first].position.z, this.keyFrames[second].position.z, fraction));
        position = new Vector3f_1.Vector3f(CubicInterpolate(this.keyFrames[zero].position.x, this.keyFrames[first].position.x, this.keyFrames[second].position.x, this.keyFrames[third].position.x, fraction), CubicInterpolate(this.keyFrames[zero].position.y, this.keyFrames[first].position.y, this.keyFrames[second].position.y, this.keyFrames[third].position.y, fraction), CubicInterpolate(this.keyFrames[zero].position.z, this.keyFrames[first].position.z, this.keyFrames[second].position.z, this.keyFrames[third].position.z, fraction));
        let look = this.keyFrames[first].rotation.mul(1 - mu2).add(this.keyFrames[second].rotation.mul(mu2));
        look = new Vector3f_1.Vector3f(CubicInterpolate(this.keyFrames[zero].rotation.x, this.keyFrames[first].rotation.x, this.keyFrames[second].rotation.x, this.keyFrames[third].rotation.x, fraction), CubicInterpolate(this.keyFrames[zero].rotation.y, this.keyFrames[first].rotation.y, this.keyFrames[second].rotation.y, this.keyFrames[third].rotation.y, fraction), CubicInterpolate(this.keyFrames[zero].rotation.z, this.keyFrames[first].rotation.z, this.keyFrames[second].rotation.z, this.keyFrames[third].rotation.z, fraction));
        this.pos = position;
        return new camera_1.BasicCamera(position, look.x, look.y, look.z).getViewMatrix();
    }
}
exports.CameraAnimator = CameraAnimator;
function CosineInterpolate(y1, y2, mu) {
    let mu2;
    mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
    return (y1 * (1 - mu2) + y2 * mu2);
}
function CubicInterpolate(y0, y1, y2, y3, mu) {
    let a0;
    let a1;
    let a2;
    let a3;
    let mu2;
    mu2 = mu * mu;
    a0 = y3 - y2 - y0 + y1;
    a1 = y0 - y1 - a0;
    a2 = y2 - y0;
    a3 = y1;
    return (a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3);
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(0);
const BasicCamera_1 = __webpack_require__(5);
class ControllableCamera extends BasicCamera_1.BasicCamera {
    constructor() {
        super(new math_1.Vector3f(0, 0, 0), 0, 0, 0);
    }
    moveForward(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.position.x += distance * -Math.sin(this.yaw);
        this.position.z += distance * -Math.cos(this.yaw);
    }
    moveBackward(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.position.x -= distance * -Math.sin(this.yaw);
        this.position.z -= distance * -Math.cos(this.yaw);
    }
    turnLeft(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.yaw += distance;
    }
    turnRight(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.yaw -= distance;
    }
    turnUp(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.pitch += distance;
    }
    turnDown(speed, deltaTime) {
        let distance = speed * deltaTime;
        this.pitch -= distance;
    }
}
exports.ControllableCamera = ControllableCamera;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TextureCoordinate {
}
exports.TextureCoordinate = TextureCoordinate;
class Vertex {
}
exports.Vertex = Vertex;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {"vertices":[{"x":-0.06687,"y":0.164502,"z":-1.558026},{"x":-0.053139,"y":0.143871,"z":-1.792698},{"x":-0.075402,"y":0.12585,"z":-1.792698},{"x":-0.093846,"y":0.143712,"z":-1.557438},{"x":-0.117405,"y":0.011547,"z":-1.556802},{"x":-0.091668,"y":0.021099,"z":-1.792698},{"x":-0.075873,"y":-0.002562,"z":-1.792698},{"x":-0.097239,"y":-0.017955,"z":-1.556802},{"x":-0.053745,"y":-0.021087,"z":-1.792698},{"x":-0.069015,"y":-0.041088,"z":-1.556802},{"x":-0.091365,"y":0.102555,"z":-1.792698},{"x":-0.117222,"y":0.113007,"z":-1.55703},{"x":-0.03675,"y":0.174036,"z":-1.558566},{"x":-0.027318,"y":0.151965,"z":-1.794801},{"x":-0.127881,"y":0.045036,"z":-1.556802},{"x":-0.099843,"y":0.04797,"z":-1.792698},{"x":0.003666,"y":0.179154,"z":-1.558881},{"x":0.003666,"y":0.153759,"z":-1.792698},{"x":-0.04209,"y":-0.029466,"z":-1.795719},{"x":-0.035019,"y":-0.055971,"z":-1.556802},{"x":-0.099741,"y":0.075876,"z":-1.792698},{"x":-0.127815,"y":0.079794,"z":-1.556802},{"x":-0.035793,"y":-0.015873,"z":-1.592484},{"x":-0.044634,"y":-0.009231,"z":-1.589646},{"x":-0.063315,"y":0.007872,"z":-1.589646},{"x":-0.076488,"y":0.027606,"z":-1.589652},{"x":-0.083274,"y":0.049914,"z":-1.589655},{"x":-0.08319,"y":0.07302,"z":-1.589661},{"x":-0.076248,"y":0.09513,"z":-1.589667},{"x":-0.06297,"y":0.114507,"z":-1.58967},{"x":-0.044742,"y":0.129249,"z":-1.589676},{"x":-0.023574,"y":0.135867,"z":-1.591653},{"x":0.003666,"y":0.137445,"z":-1.589676},{"x":0.030903,"y":0.135867,"z":-1.591653},{"x":0.052071,"y":0.129249,"z":-1.589676},{"x":0.070299,"y":0.114507,"z":-1.58967},{"x":0.083577,"y":0.09513,"z":-1.589667},{"x":0.090519,"y":0.07302,"z":-1.589661},{"x":0.090603,"y":0.049914,"z":-1.589655},{"x":0.083817,"y":0.027606,"z":-1.589652},{"x":0.070644,"y":0.007872,"z":-1.589646},{"x":0.051963,"y":-0.009231,"z":-1.589646},{"x":0.043122,"y":-0.015873,"z":-1.592484},{"x":0.003666,"y":-0.021249,"z":-1.58964},{"x":0.003666,"y":-0.037311,"z":-1.792698},{"x":0.003666,"y":-0.061413,"z":-1.556457},{"x":0.101175,"y":0.143712,"z":-1.557438},{"x":0.082731,"y":0.12585,"z":-1.792698},{"x":0.060468,"y":0.143871,"z":-1.792698},{"x":0.074199,"y":0.164502,"z":-1.558026},{"x":0.104568,"y":-0.017955,"z":-1.556802},{"x":0.083202,"y":-0.002562,"z":-1.792698},{"x":0.098997,"y":0.021099,"z":-1.792698},{"x":0.124734,"y":0.011547,"z":-1.556802},{"x":0.076344,"y":-0.041088,"z":-1.556802},{"x":0.061074,"y":-0.021087,"z":-1.792698},{"x":0.124551,"y":0.113007,"z":-1.55703},{"x":0.098694,"y":0.102555,"z":-1.792698},{"x":0.034647,"y":0.151965,"z":-1.794801},{"x":0.044079,"y":0.174036,"z":-1.558566},{"x":0.107172,"y":0.04797,"z":-1.792698},{"x":0.13521,"y":0.045036,"z":-1.556802},{"x":0.042348,"y":-0.055971,"z":-1.556802},{"x":0.049419,"y":-0.029466,"z":-1.795719},{"x":0.135144,"y":0.079794,"z":-1.556802},{"x":0.10707,"y":0.075876,"z":-1.792698},{"x":-0.047745,"y":-0.013368,"z":-1.792683},{"x":-0.038334,"y":-0.020439,"z":-1.795704},{"x":0.003666,"y":-0.02616,"z":-1.792677},{"x":0.045663,"y":-0.020439,"z":-1.795704},{"x":0.055074,"y":-0.013368,"z":-1.792683},{"x":0.074955,"y":0.004836,"z":-1.792683},{"x":0.088977,"y":0.025839,"z":-1.792689},{"x":0.096198,"y":0.049581,"z":-1.792695},{"x":0.096111,"y":0.074175,"z":-1.792701},{"x":0.088722,"y":0.097707,"z":-1.792704},{"x":0.074589,"y":0.118332,"z":-1.79271},{"x":0.055185,"y":0.134025,"z":-1.792713},{"x":0.032655,"y":0.141066,"z":-1.794819},{"x":0.003666,"y":0.142749,"z":-1.792716},{"x":-0.025326,"y":0.141066,"z":-1.794819},{"x":-0.047856,"y":0.134025,"z":-1.792713},{"x":-0.06726,"y":0.118332,"z":-1.79271},{"x":-0.081393,"y":0.097707,"z":-1.792704},{"x":-0.088782,"y":0.074175,"z":-1.792701},{"x":-0.088869,"y":0.049581,"z":-1.792695},{"x":-0.081648,"y":0.025839,"z":-1.792689},{"x":-0.067626,"y":0.004836,"z":-1.792683},{"x":-0.678606,"y":0.028212,"z":-1.604802},{"x":-0.678606,"y":0.023367,"z":-1.654662},{"x":-0.678606,"y":0.021198,"z":-1.65462},{"x":-0.324378,"y":0.053574,"z":-1.309359},{"x":-0.324363,"y":0.049578,"z":-0.995292},{"x":-0.678513,"y":0.020964,"z":-1.450872},{"x":-0.678558,"y":0.021081,"z":-1.552746},{"x":-0.324393,"y":0.05757,"z":-1.623429},{"x":-0.324393,"y":0.065532,"z":-1.624158},{"x":-0.324393,"y":0.070665,"z":-1.470072},{"x":-0.678609,"y":0.028212,"z":-1.554846},{"x":-0.324396,"y":0.073716,"z":-1.315986},{"x":-0.678474,"y":0.028212,"z":-1.502859},{"x":-0.324261,"y":0.074397,"z":-1.155636},{"x":-0.67845,"y":0.023601,"z":-1.450872},{"x":-0.324309,"y":0.056754,"z":-0.995289},{"x":-0.678582,"y":0.021141,"z":-1.603683},{"x":-0.324387,"y":0.055572,"z":-1.466394},{"x":0.685935,"y":0.021198,"z":-1.65462},{"x":0.685935,"y":0.023367,"z":-1.654662},{"x":0.685935,"y":0.028212,"z":-1.604802},{"x":0.685887,"y":0.021081,"z":-1.552746},{"x":0.685842,"y":0.020964,"z":-1.450872},{"x":0.331692,"y":0.049578,"z":-0.995292},{"x":0.331707,"y":0.053574,"z":-1.309359},{"x":0.331722,"y":0.065532,"z":-1.624158},{"x":0.331722,"y":0.05757,"z":-1.623429},{"x":0.331722,"y":0.070665,"z":-1.470072},{"x":0.331725,"y":0.073716,"z":-1.315986},{"x":0.685938,"y":0.028212,"z":-1.554846},{"x":0.33159,"y":0.074397,"z":-1.155636},{"x":0.685803,"y":0.028212,"z":-1.502859},{"x":0.331638,"y":0.056754,"z":-0.995289},{"x":0.685779,"y":0.023601,"z":-1.450872},{"x":0.331716,"y":0.055572,"z":-1.466394},{"x":0.685911,"y":0.021141,"z":-1.603683},{"x":0.003666,"y":0.905907,"z":-1.483485},{"x":0.006609,"y":0.905907,"z":-1.548126},{"x":0.00699,"y":0.905907,"z":-1.603344},{"x":0.007452,"y":0.905907,"z":-1.673838},{"x":0.007872,"y":0.905907,"z":-1.737897},{"x":0.008214,"y":0.905907,"z":-1.787904},{"x":0.003666,"y":0.905907,"z":-1.78794},{"x":-0.000885,"y":0.905907,"z":-1.787904},{"x":-0.000543,"y":0.905907,"z":-1.737897},{"x":-0.000123,"y":0.905907,"z":-1.673838},{"x":0.000339,"y":0.905907,"z":-1.603344},{"x":0.00072,"y":0.905907,"z":-1.548126},{"x":0.003666,"y":0.249198,"z":-0.570483},{"x":0.003666,"y":0.368028,"z":-0.948078},{"x":0.00018,"y":0.350166,"z":-1.05282},{"x":-0.011637,"y":0.221964,"z":-0.864645},{"x":-0.002367,"y":0.341442,"z":-1.180371},{"x":-0.027228,"y":0.219087,"z":-1.000926},{"x":-0.003927,"y":0.339852,"z":-1.302927},{"x":-0.041046,"y":0.210348,"z":-1.169736},{"x":-0.025374,"y":0.243348,"z":-1.320333},{"x":-0.037479,"y":0.197859,"z":-1.323618},{"x":-0.006741,"y":0.247455,"z":-1.557042},{"x":-0.006774,"y":0.339609,"z":-1.557666},{"x":0.003666,"y":0.339609,"z":-1.557822},{"x":0.003666,"y":0.248208,"z":-1.557123},{"x":0.003666,"y":0.245514,"z":-1.320564},{"x":0.003666,"y":0.201984,"z":-1.324026},{"x":0.003666,"y":0.636969,"z":-1.21578},{"x":0.00045,"y":0.628038,"z":-1.300473},{"x":-0.001014,"y":0.623676,"z":-1.391859},{"x":-0.002025,"y":0.622881,"z":-1.488381},{"x":-0.002931,"y":0.622758,"z":-1.581888},{"x":-0.005319,"y":0.339609,"z":-1.425876},{"x":-0.003648,"y":0.622758,"z":-1.656429},{"x":-0.006414,"y":0.339609,"z":-1.524954},{"x":0.003666,"y":0.339615,"z":-1.524732},{"x":0.013743,"y":0.339609,"z":-1.524954},{"x":0.014103,"y":0.339609,"z":-1.557666},{"x":0.003666,"y":0.622761,"z":-1.656336},{"x":0.018966,"y":0.221964,"z":-0.864645},{"x":0.007149,"y":0.350166,"z":-1.05282},{"x":0.034557,"y":0.219087,"z":-1.000926},{"x":0.009696,"y":0.341442,"z":-1.180371},{"x":0.048375,"y":0.210348,"z":-1.169736},{"x":0.011256,"y":0.339852,"z":-1.302927},{"x":0.044808,"y":0.197859,"z":-1.323618},{"x":0.032703,"y":0.243348,"z":-1.320333},{"x":0.01407,"y":0.247455,"z":-1.557042},{"x":0.006879,"y":0.628038,"z":-1.300473},{"x":0.008343,"y":0.623676,"z":-1.391859},{"x":0.009354,"y":0.622881,"z":-1.488381},{"x":0.012648,"y":0.339609,"z":-1.425876},{"x":0.01026,"y":0.622758,"z":-1.581888},{"x":0.010977,"y":0.622758,"z":-1.656429},{"x":-0.324411,"y":0.078528,"z":-0.123071},{"x":-0.7149,"y":0.070176,"z":-0.386874},{"x":-0.714999,"y":0.061017,"z":-0.261247},{"x":-0.324414,"y":0.062163,"z":0.043308},{"x":-0.715002,"y":0.058455,"z":-0.261247},{"x":-0.324417,"y":0.059328,"z":0.043308},{"x":-0.714996,"y":0.044712,"z":-0.386568},{"x":-0.32442,"y":0.036234,"z":-0.123064},{"x":-0.714963,"y":0.042732,"z":-0.565731},{"x":-0.324378,"y":0.032799,"z":-0.413025},{"x":-0.714996,"y":0.045201,"z":-0.700491},{"x":-0.324414,"y":0.036861,"z":-0.614991},{"x":-0.714993,"y":0.049788,"z":-0.859224},{"x":-0.324408,"y":0.044394,"z":-0.852888},{"x":-0.323904,"y":0.089319,"z":-0.593358},{"x":-0.714528,"y":0.072327,"z":-0.699957},{"x":-0.714366,"y":0.072642,"z":-0.564903},{"x":-0.323781,"y":0.085203,"z":-0.411783},{"x":-0.324405,"y":0.04878,"z":-0.854355},{"x":-0.71499,"y":0.052773,"z":-0.860274},{"x":-1.105584,"y":0.059871,"z":-0.565803},{"x":-1.105584,"y":0.057579,"z":-0.565803},{"x":-1.105389,"y":0.061824,"z":-0.650676},{"x":-1.10499,"y":0.059799,"z":-0.730524},{"x":-1.105224,"y":0.058149,"z":-0.804579},{"x":-1.105578,"y":0.056766,"z":-0.866193},{"x":-1.105578,"y":0.055179,"z":-0.865563},{"x":-1.105716,"y":0.053013,"z":-0.809643},{"x":-1.105587,"y":0.052389,"z":-0.730854},{"x":-1.105575,"y":0.05319,"z":-0.650073},{"x":0.331743,"y":0.062163,"z":0.043308},{"x":0.722328,"y":0.061017,"z":-0.261247},{"x":0.722229,"y":0.070176,"z":-0.386874},{"x":0.33174,"y":0.078528,"z":-0.123071},{"x":0.331746,"y":0.059328,"z":0.043308},{"x":0.722331,"y":0.058455,"z":-0.261247},{"x":0.331749,"y":0.036234,"z":-0.123064},{"x":0.722325,"y":0.044712,"z":-0.386568},{"x":0.331707,"y":0.032799,"z":-0.413025},{"x":0.722292,"y":0.042732,"z":-0.565731},{"x":0.331743,"y":0.036861,"z":-0.614991},{"x":0.722325,"y":0.045201,"z":-0.700491},{"x":0.331737,"y":0.044394,"z":-0.852888},{"x":0.722322,"y":0.049788,"z":-0.859224},{"x":0.33111,"y":0.085203,"z":-0.411783},{"x":0.721695,"y":0.072642,"z":-0.564903},{"x":0.721857,"y":0.072327,"z":-0.699957},{"x":0.331233,"y":0.089319,"z":-0.593358},{"x":0.722319,"y":0.052773,"z":-0.860274},{"x":0.331734,"y":0.04878,"z":-0.854355},{"x":1.112913,"y":0.057579,"z":-0.565803},{"x":1.112913,"y":0.059871,"z":-0.565803},{"x":1.112718,"y":0.061824,"z":-0.650676},{"x":1.112319,"y":0.059799,"z":-0.730524},{"x":1.112553,"y":0.058149,"z":-0.804579},{"x":1.112907,"y":0.056766,"z":-0.866193},{"x":1.112907,"y":0.055179,"z":-0.865563},{"x":1.113048,"y":0.053013,"z":-0.809643},{"x":1.112916,"y":0.052389,"z":-0.730854},{"x":1.112904,"y":0.05319,"z":-0.650073},{"x":0.003666,"y":0.31539,"z":1.013703},{"x":-0.013974,"y":0.312537,"z":1.013652},{"x":0.003666,"y":0.240891,"z":1.126905},{"x":-0.075615,"y":0.329226,"z":0.771249},{"x":-0.107874,"y":0.259182,"z":0.771249},{"x":-0.10536,"y":0.25617,"z":0.844521},{"x":-0.073863,"y":0.323358,"z":0.844866},{"x":-0.017961,"y":0.219765,"z":1.126863},{"x":-0.009966,"y":0.230328,"z":1.126884},{"x":-0.030243,"y":0.302526,"z":1.013649},{"x":-0.048714,"y":0.281553,"z":1.013649},{"x":0.003666,"y":0.359562,"z":0.916179},{"x":-0.019485,"y":0.353214,"z":0.916461},{"x":-0.045411,"y":0.357291,"z":0.844851},{"x":-0.047871,"y":0.364449,"z":0.771249},{"x":-0.065232,"y":0.234399,"z":1.013649},{"x":-0.066909,"y":0.320121,"z":0.617301},{"x":-0.041367,"y":0.353814,"z":0.617466},{"x":-0.034884,"y":0.331812,"z":0.538794},{"x":-0.059925,"y":0.303351,"z":0.536403},{"x":-0.049965,"y":0.273177,"z":0.444381},{"x":-0.076344,"y":0.267591,"z":0.535056},{"x":-0.016512,"y":0.348144,"z":0.540225},{"x":-0.011745,"y":0.318162,"z":0.445995},{"x":-0.025233,"y":0.302595,"z":0.445611},{"x":-0.076263,"y":0.331488,"z":0.704496},{"x":-0.10566,"y":0.261819,"z":0.704496},{"x":0.003666,"y":0.379836,"z":0.616497},{"x":0.003666,"y":0.356319,"z":0.54177},{"x":-0.019752,"y":0.370905,"z":0.616929},{"x":-0.094758,"y":0.263499,"z":0.616395},{"x":0.003666,"y":0.387915,"z":0.771252},{"x":-0.023874,"y":0.381117,"z":0.771249},{"x":-0.023508,"y":0.371592,"z":0.844809},{"x":0.003666,"y":0.38022,"z":0.844836},{"x":-0.064215,"y":0.310257,"z":0.917283},{"x":-0.040827,"y":0.338712,"z":0.916812},{"x":-0.092634,"y":0.248325,"z":0.919314},{"x":-0.022362,"y":0.383712,"z":0.704496},{"x":-0.046584,"y":0.366933,"z":0.704496},{"x":0.003666,"y":0.391431,"z":0.704499},{"x":0.003666,"y":0.324243,"z":0.447411},{"x":0.021303,"y":0.312537,"z":1.013652},{"x":0.081192,"y":0.323358,"z":0.844866},{"x":0.112689,"y":0.25617,"z":0.844521},{"x":0.115203,"y":0.259182,"z":0.771249},{"x":0.082944,"y":0.329226,"z":0.771249},{"x":0.056043,"y":0.281553,"z":1.013649},{"x":0.037572,"y":0.302526,"z":1.013649},{"x":0.017295,"y":0.230328,"z":1.126884},{"x":0.02529,"y":0.219765,"z":1.126863},{"x":0.026814,"y":0.353214,"z":0.916461},{"x":0.0552,"y":0.364449,"z":0.771249},{"x":0.05274,"y":0.357291,"z":0.844851},{"x":0.072561,"y":0.234399,"z":1.013649},{"x":0.067254,"y":0.303351,"z":0.536403},{"x":0.042213,"y":0.331812,"z":0.538794},{"x":0.048696,"y":0.353814,"z":0.617466},{"x":0.074238,"y":0.320121,"z":0.617301},{"x":0.083673,"y":0.267591,"z":0.535056},{"x":0.057294,"y":0.273177,"z":0.444381},{"x":0.032562,"y":0.302595,"z":0.445611},{"x":0.019074,"y":0.318162,"z":0.445995},{"x":0.023841,"y":0.348144,"z":0.540225},{"x":0.112989,"y":0.261819,"z":0.704496},{"x":0.083592,"y":0.331488,"z":0.704496},{"x":0.027081,"y":0.370905,"z":0.616929},{"x":0.102087,"y":0.263499,"z":0.616395},{"x":0.030837,"y":0.371592,"z":0.844809},{"x":0.031203,"y":0.381117,"z":0.771249},{"x":0.048156,"y":0.338712,"z":0.916812},{"x":0.071544,"y":0.310257,"z":0.917283},{"x":0.099963,"y":0.248325,"z":0.919314},{"x":0.053913,"y":0.366933,"z":0.704496},{"x":0.029691,"y":0.383712,"z":0.704496},{"x":-0.324417,"y":0.059328,"z":0.043308},{"x":-0.324417,"y":0.060879,"z":0.194449},{"x":-0.324414,"y":0.062163,"z":0.043308},{"x":-0.323904,"y":0.089319,"z":-0.593358},{"x":-0.324402,"y":0.079482,"z":-0.864639},{"x":-0.324405,"y":0.04878,"z":-0.854355},{"x":-0.324363,"y":0.049578,"z":-0.995292},{"x":-0.324408,"y":0.044394,"z":-0.852888},{"x":-0.324129,"y":0.079482,"z":-0.995286},{"x":-0.324309,"y":0.056754,"z":-0.995289},{"x":-0.119103,"y":0.005493,"z":0.231552},{"x":-0.119109,"y":0.005496,"z":0.782934},{"x":-0.075234,"y":0.008556,"z":0.685005},{"x":-0.070341,"y":0.008523,"z":0.705825},{"x":-0.066891,"y":0.008523,"z":0.725547},{"x":-0.065304,"y":0.008286,"z":0.743607},{"x":-0.044532,"y":0.005823,"z":0.760269},{"x":0.003666,"y":0.000786,"z":0.769449},{"x":-0.095481,"y":0.023709,"z":0.611949},{"x":-0.086022,"y":0.023235,"z":0.648279},{"x":-0.079434,"y":0.022992,"z":0.682713},{"x":-0.073908,"y":0.022206,"z":0.714003},{"x":-0.029934,"y":0.013551,"z":0.777252},{"x":0.003666,"y":0.005352,"z":0.771327},{"x":-0.052419,"y":0.262077,"z":0.349071},{"x":-0.049965,"y":0.273177,"z":0.444381},{"x":-0.035889,"y":0.275397,"z":0.39621},{"x":-0.02181,"y":0.27843,"z":0.348039},{"x":0.003666,"y":0.283692,"z":0.265017},{"x":-0.103584,"y":0.219108,"z":0.348129},{"x":-0.106782,"y":0.220683,"z":0.446676},{"x":-0.052047,"y":0.249894,"z":0.19053},{"x":-0.099921,"y":0.216912,"z":0.190853},{"x":-0.027228,"y":0.219087,"z":-1.000926},{"x":-0.041046,"y":0.210348,"z":-1.169736},{"x":-0.092736,"y":0.20163,"z":-1.172028},{"x":-0.097479,"y":0.210366,"z":-1.000176},{"x":-0.011637,"y":0.221964,"z":-0.864645},{"x":-0.097593,"y":0.210366,"z":-0.864642},{"x":-0.097065,"y":0.210369,"z":-0.598257},{"x":-0.031932,"y":0.234246,"z":-0.586857},{"x":-0.097344,"y":0.210369,"z":-0.416553},{"x":-0.042063,"y":0.233841,"z":-0.41781},{"x":-0.098352,"y":0.212226,"z":-0.123868},{"x":-0.051663,"y":0.233085,"z":-0.123472},{"x":-0.054819,"y":0.239052,"z":0.037823},{"x":-0.099099,"y":0.214401,"z":0.038205},{"x":-0.037479,"y":0.197859,"z":-1.323618},{"x":-0.082599,"y":0.187407,"z":-1.322853},{"x":-0.114117,"y":0.04563,"z":0.773961},{"x":-0.12573,"y":0.046767,"z":0.702294},{"x":-0.102501,"y":0.044499,"z":0.845628},{"x":-0.170121,"y":0.058254,"z":0.844758},{"x":-0.178026,"y":0.058254,"z":0.771243},{"x":0.003666,"y":0.068781,"z":1.711194},{"x":-0.014079,"y":0.08874,"z":1.64658},{"x":-0.023991,"y":0.0786,"z":1.64646},{"x":-0.004527,"y":0.064041,"z":1.711047},{"x":0.003666,"y":0.053046,"z":1.731126},{"x":0.003666,"y":0.09876,"z":1.645296},{"x":-0.113253,"y":-0.009579,"z":0.497484},{"x":-0.123204,"y":-0.016383,"z":0.491601},{"x":-0.128118,"y":-0.026919,"z":0.483906},{"x":-0.118902,"y":-0.047502,"z":0.478539},{"x":-0.09216,"y":-0.071676,"z":0.479358},{"x":-0.054702,"y":-0.086934,"z":0.479712},{"x":0.003666,"y":-0.094197,"z":0.479889},{"x":0.062031,"y":-0.086934,"z":0.479712},{"x":0.099489,"y":-0.071676,"z":0.479358},{"x":0.126231,"y":-0.047502,"z":0.478539},{"x":0.135447,"y":-0.026919,"z":0.483906},{"x":0.130533,"y":-0.016383,"z":0.491601},{"x":0.120582,"y":-0.009579,"z":0.497484},{"x":0.003666,"y":-0.013803,"z":0.484086},{"x":-0.117711,"y":0.223158,"z":0.70449},{"x":-0.115209,"y":0.221619,"z":0.616395},{"x":-0.130857,"y":0.190014,"z":0.616392},{"x":-0.13122,"y":0.19077,"z":0.704502},{"x":-0.118707,"y":0.223167,"z":0.771249},{"x":-0.128244,"y":0.191469,"z":0.771243},{"x":-0.124824,"y":0.192369,"z":0.844989},{"x":-0.115776,"y":0.222429,"z":0.844842},{"x":-0.104598,"y":0.219897,"z":0.91788},{"x":-0.116562,"y":0.191469,"z":0.916443},{"x":-0.085989,"y":0.214182,"z":1.014645},{"x":-0.104595,"y":0.187941,"z":1.014168},{"x":-0.041367,"y":-0.078579,"z":-1.320717},{"x":0.003666,"y":-0.084978,"z":-1.320396},{"x":0.003666,"y":-0.101466,"z":-1.071558},{"x":-0.045003,"y":-0.087711,"z":-1.071852},{"x":-0.226965,"y":0.046782,"z":-0.864723},{"x":-0.227373,"y":0.046782,"z":-0.996729},{"x":-0.134061,"y":0.023583,"z":-1.071852},{"x":-0.119091,"y":0.00549,"z":-0.822987},{"x":-0.119055,"y":0.005502,"z":-0.123062},{"x":-0.119007,"y":0.005511,"z":-0.413109},{"x":-0.126219,"y":-0.004764,"z":-0.123062},{"x":-0.186315,"y":0.046776,"z":0.349881},{"x":-0.205215,"y":0.046779,"z":0.206643},{"x":-0.139527,"y":0.04677,"z":0.6234},{"x":-0.159105,"y":0.047214,"z":0.540126},{"x":-0.014649,"y":0.28848,"z":0.349029},{"x":0.003666,"y":0.295659,"z":0.348669},{"x":-0.158763,"y":0.117753,"z":0.771165},{"x":-0.144021,"y":0.149115,"z":0.771243},{"x":-0.149151,"y":0.1491,"z":0.704244},{"x":-0.166674,"y":0.117561,"z":0.704412},{"x":-0.216381,"y":0.046782,"z":-0.413109},{"x":-0.226035,"y":0.049335,"z":-0.61284},{"x":-0.119049,"y":0.005499,"z":-0.612786},{"x":0.003666,"y":0.136248,"z":1.543827},{"x":-0.0081,"y":0.133716,"z":1.543839},{"x":0.003666,"y":0.118623,"z":1.594647},{"x":-0.059634,"y":0.207906,"z":1.127415},{"x":-0.08964,"y":0.181764,"z":1.127232},{"x":-0.137076,"y":-0.009006,"z":-1.071852},{"x":-0.136944,"y":0.001752,"z":-1.320717},{"x":-0.113583,"y":-0.033393,"z":-1.320717},{"x":-0.118446,"y":-0.042105,"z":-1.071852},{"x":-0.205641,"y":0.097053,"z":-1.168557},{"x":-0.148866,"y":0.083139,"z":-1.32072},{"x":-0.20103,"y":0.084417,"z":-1.3203},{"x":-0.034752,"y":0.043875,"z":1.593807},{"x":-0.040113,"y":0.042075,"z":1.543749},{"x":0.003666,"y":0.024849,"z":1.543833},{"x":0.003666,"y":0.028785,"z":1.594647},{"x":-0.014073,"y":0.110622,"z":1.595478},{"x":-0.109887,"y":0.221895,"z":0.535266},{"x":-0.133134,"y":0.190797,"z":0.535302},{"x":-0.149757,"y":0.077277,"z":1.013481},{"x":-0.15822,"y":0.077862,"z":0.915429},{"x":-0.162789,"y":0.058251,"z":0.91644},{"x":-0.153945,"y":0.058251,"z":1.013649},{"x":-0.009582,"y":0.05712,"z":1.710984},{"x":-0.009741,"y":0.0507,"z":1.710798},{"x":0.003666,"y":0.043185,"z":1.713732},{"x":-0.030711,"y":0.05394,"z":1.644582},{"x":-0.025989,"y":0.046269,"z":1.644351},{"x":-0.170136,"y":0.046773,"z":0.450195},{"x":-0.079512,"y":0.036747,"z":1.126863},{"x":-0.087519,"y":0.040251,"z":1.013652},{"x":0.003666,"y":0.008886,"z":1.013703},{"x":0.003666,"y":0.009999,"z":1.126902},{"x":-0.017961,"y":0.219765,"z":1.126863},{"x":0.003666,"y":0.21747,"z":1.232379},{"x":-0.009966,"y":0.230328,"z":1.126884},{"x":-0.2628,"y":0.077469,"z":-1.477119},{"x":-0.20121,"y":0.078513,"z":-1.484166},{"x":-0.20139,"y":0.063972,"z":-1.618083},{"x":-0.26289,"y":0.067485,"z":-1.621119},{"x":-0.167937,"y":0.156591,"z":-0.864642},{"x":-0.161382,"y":0.156501,"z":-0.596868},{"x":-0.129828,"y":0.189627,"z":-0.597534},{"x":-0.131829,"y":0.191466,"z":-0.864642},{"x":-0.110898,"y":0.163419,"z":-1.322241},{"x":-0.141486,"y":0.125229,"z":-1.321584},{"x":-0.157563,"y":0.129639,"z":-1.16973},{"x":-0.122322,"y":0.177918,"z":-1.171389},{"x":-0.131829,"y":0.190929,"z":0.348006},{"x":-0.131349,"y":0.19134,"z":0.445734},{"x":-0.134664,"y":0.190113,"z":-0.123125},{"x":-0.135114,"y":0.189507,"z":0.037837},{"x":-0.021933,"y":0.292635,"z":0.399324},{"x":-0.009789,"y":0.304608,"z":0.397845},{"x":-0.251877,"y":0.097107,"z":0.190839},{"x":-0.271284,"y":0.057261,"z":0.346134},{"x":-0.244191,"y":0.090765,"z":0.346134},{"x":0.003666,"y":-0.117951,"z":-0.82272},{"x":0.003666,"y":-0.117948,"z":-0.612804},{"x":-0.053916,"y":-0.104748,"z":-0.612804},{"x":-0.048639,"y":-0.096843,"z":-0.822987},{"x":-0.133434,"y":-0.015039,"z":0.231552},{"x":-0.13797,"y":-0.008595,"z":0.775755},{"x":-0.201207,"y":0.11925,"z":0.446319},{"x":-0.191475,"y":0.11724,"z":0.536841},{"x":-0.162627,"y":0.149232,"z":0.535584},{"x":-0.167601,"y":0.149802,"z":0.446625},{"x":-0.25158,"y":0.058266,"z":0.446478},{"x":-0.234558,"y":0.085005,"z":0.445767},{"x":-0.10536,"y":0.25617,"z":0.844521},{"x":-0.092634,"y":0.248325,"z":0.919314},{"x":-0.044823,"y":0.056148,"z":1.594443},{"x":-0.057948,"y":0.057933,"z":1.543839},{"x":-0.133587,"y":0.190485,"z":0.190749},{"x":-0.065232,"y":0.234399,"z":1.013649},{"x":-0.135306,"y":0.077661,"z":1.126863},{"x":-0.134025,"y":0.058248,"z":1.126863},{"x":-0.071838,"y":0.102522,"z":1.473258},{"x":-0.075252,"y":0.078573,"z":1.473258},{"x":-0.058065,"y":0.075192,"z":1.543842},{"x":-0.053562,"y":0.094704,"z":1.544589},{"x":-0.094758,"y":0.263499,"z":0.616395},{"x":-0.076344,"y":0.267591,"z":0.535056},{"x":-0.215868,"y":0.083187,"z":0.535332},{"x":-0.196896,"y":0.080382,"z":0.616515},{"x":-0.178794,"y":0.116994,"z":0.616674},{"x":-0.147768,"y":-0.030432,"z":0.76605},{"x":-0.147765,"y":-0.035571,"z":0.231552},{"x":-0.158343,"y":0.148704,"z":0.616392},{"x":-0.074478,"y":0.059481,"z":1.473258},{"x":-0.047325,"y":0.040104,"z":1.473258},{"x":-0.07725,"y":0.129534,"z":1.408608},{"x":-0.088092,"y":0.109122,"z":1.408608},{"x":-0.061782,"y":0.119982,"z":1.473708},{"x":-0.212688,"y":0.124311,"z":0.190745},{"x":-0.21012,"y":0.121401,"z":0.345972},{"x":-0.13551,"y":0.147777,"z":0.914253},{"x":-0.129129,"y":0.14622,"z":1.013784},{"x":0.003666,"y":0.033516,"z":1.645296},{"x":-0.149031,"y":0.041673,"z":-1.32072},{"x":-0.13032,"y":0.189732,"z":-0.415809},{"x":-0.027729,"y":0.169734,"z":1.408608},{"x":-0.03783,"y":0.190485,"z":1.31337},{"x":-0.070353,"y":0.165693,"z":1.31337},{"x":-0.055806,"y":0.151665,"z":1.408608},{"x":-0.163017,"y":0.156489,"z":-0.415011},{"x":-0.206616,"y":0.05826,"z":0.616392},{"x":-0.230055,"y":0.058263,"z":0.535332},{"x":-0.129159,"y":0.118869,"z":1.126863},{"x":-0.140643,"y":0.118992,"z":1.013649},{"x":-0.163455,"y":0.077679,"z":0.844758},{"x":-0.029232,"y":0.065838,"z":1.64529},{"x":-0.088821,"y":0.059958,"z":1.408608},{"x":-0.090456,"y":0.079662,"z":1.408608},{"x":-0.107856,"y":0.079494,"z":1.31337},{"x":-0.104346,"y":0.060249,"z":1.31337},{"x":-0.094875,"y":0.136554,"z":1.31337},{"x":-0.104049,"y":0.114447,"z":1.31337},{"x":-0.043809,"y":0.108735,"z":1.545066},{"x":-0.117738,"y":0.142887,"z":1.127076},{"x":-0.115974,"y":0.116691,"z":1.232349},{"x":-0.10551,"y":0.139491,"z":1.232349},{"x":0.003666,"y":0.249198,"z":-0.570483},{"x":0.003666,"y":0.250665,"z":-0.418986},{"x":-0.063027,"y":0.037755,"z":1.31337},{"x":-0.119202,"y":0.058245,"z":1.232349},{"x":-0.070296,"y":0.036891,"z":1.232349},{"x":-0.121167,"y":0.079269,"z":1.232349},{"x":-0.107874,"y":0.259182,"z":0.771249},{"x":0.003666,"y":0.273657,"z":0.190898},{"x":0.003666,"y":0.259569,"z":0.038007},{"x":-0.172047,"y":0.151068,"z":0.346083},{"x":-0.211443,"y":0.111966,"z":-0.997077},{"x":-0.266199,"y":0.090297,"z":-1.162587},{"x":-0.257127,"y":0.097236,"z":-0.996729},{"x":-0.018969,"y":0.152157,"z":1.473258},{"x":-0.044238,"y":0.138534,"z":1.4742},{"x":-0.028398,"y":0.12294,"z":1.544919},{"x":-0.028959,"y":0.099165,"z":1.596},{"x":-0.053718,"y":0.038643,"z":1.408608},{"x":-0.043836,"y":0.070866,"z":1.594698},{"x":-0.146754,"y":0.118122,"z":0.916464},{"x":-0.262713,"y":0.082461,"z":-1.318143},{"x":-0.170922,"y":0.077886,"z":0.771243},{"x":-0.152373,"y":0.117873,"z":0.846009},{"x":-0.046707,"y":0.200682,"z":1.232349},{"x":0.003666,"y":0.20154,"z":1.313388},{"x":-0.211473,"y":0.125628,"z":-0.414093},{"x":-0.211968,"y":0.125742,"z":-0.123575},{"x":-0.17187,"y":0.154929,"z":-0.12346},{"x":-0.025233,"y":0.302595,"z":0.445611},{"x":-0.011745,"y":0.318162,"z":0.445995},{"x":-0.1692,"y":0.144408,"z":-0.998133},{"x":-0.131817,"y":0.191466,"z":-0.999435},{"x":-0.079164,"y":0.17373,"z":1.232349},{"x":0.003666,"y":0.158541,"z":1.473258},{"x":0.003666,"y":0.249915,"z":-0.122881},{"x":0.003666,"y":0.177237,"z":1.408617},{"x":-0.209835,"y":0.123078,"z":-0.595824},{"x":-0.25662,"y":0.097881,"z":-0.594813},{"x":-0.257019,"y":0.097881,"z":-0.413109},{"x":-0.201039,"y":0.037461,"z":-1.3203},{"x":-0.201216,"y":0.048069,"z":-1.469193},{"x":-0.140586,"y":0.148875,"z":0.844872},{"x":-0.038757,"y":0.086928,"z":1.595736},{"x":0.003666,"y":-0.117942,"z":0.231697},{"x":0.003666,"y":-0.115311,"z":0.758904},{"x":-0.059202,"y":-0.107508,"z":0.758823},{"x":-0.059196,"y":-0.11265,"z":0.231553},{"x":-0.17595,"y":0.152559,"z":0.190746},{"x":-0.096549,"y":0.042075,"z":0.91746},{"x":-0.181596,"y":0.078753,"z":0.704952},{"x":0.003666,"y":0.309435,"z":0.398649},{"x":-0.189837,"y":0.058257,"z":0.70497},{"x":-0.175053,"y":0.153507,"z":0.037837},{"x":-0.212412,"y":0.124539,"z":0.037837},{"x":-0.216633,"y":0.046782,"z":-0.123063},{"x":-0.267552,"y":0.051837,"z":0.329262},{"x":-0.080841,"y":-0.060915,"z":-1.320717},{"x":-0.086004,"y":-0.070254,"z":-1.071852},{"x":-0.10566,"y":0.261819,"z":0.704496},{"x":-0.257175,"y":0.097881,"z":-0.864642},{"x":-0.324411,"y":0.078528,"z":-0.123071},{"x":-0.256674,"y":0.097881,"z":-0.123071},{"x":-0.323781,"y":0.085203,"z":-0.411783},{"x":0.003666,"y":0.008376,"z":0.916503},{"x":0.003666,"y":0.324243,"z":0.447411},{"x":0.003666,"y":0.022287,"z":1.473258},{"x":-0.137208,"y":-0.019764,"z":-0.822987},{"x":-0.142482,"y":-0.027669,"z":-0.612804},{"x":-0.074208,"y":0.175908,"z":-1.439934},{"x":-0.101766,"y":0.152631,"z":-1.439337},{"x":-0.210405,"y":0.123078,"z":-0.864642},{"x":-0.128799,"y":0.006732,"z":-1.438758},{"x":-0.106719,"y":-0.025644,"z":-1.438758},{"x":-0.254724,"y":0.099054,"z":0.037836},{"x":-0.075816,"y":-0.051024,"z":-1.438758},{"x":0.003666,"y":0.00738,"z":0.844833},{"x":-0.128571,"y":0.11808,"z":-1.438761},{"x":0.003666,"y":0.019131,"z":1.408614},{"x":-0.038919,"y":0.186114,"z":-1.440528},{"x":0.003666,"y":0.012396,"z":1.232376},{"x":0.003666,"y":0.015063,"z":1.313388},{"x":-0.140265,"y":0.043482,"z":-1.438758},{"x":-0.038586,"y":-0.06735,"z":-1.438758},{"x":0.003666,"y":0.201984,"z":-1.324026},{"x":0.003666,"y":0.191244,"z":-1.440894},{"x":-0.140181,"y":0.08163,"z":-1.438509},{"x":-0.117405,"y":0.011547,"z":-1.556802},{"x":-0.097239,"y":-0.017955,"z":-1.556802},{"x":-0.06687,"y":0.164502,"z":-1.558026},{"x":-0.093846,"y":0.143712,"z":-1.557438},{"x":-0.117222,"y":0.113007,"z":-1.55703},{"x":-0.133863,"y":-0.066624,"z":0.231552},{"x":-0.133866,"y":-0.061479,"z":0.758823},{"x":-0.069015,"y":-0.041088,"z":-1.556802},{"x":-0.03675,"y":0.174036,"z":-1.558566},{"x":-0.127881,"y":0.045036,"z":-1.556802},{"x":-0.035019,"y":-0.055971,"z":-1.556802},{"x":0.003666,"y":-0.073317,"z":-1.438425},{"x":0.003666,"y":-0.061413,"z":-1.556457},{"x":-0.127815,"y":0.079794,"z":-1.556802},{"x":0.003666,"y":0.179154,"z":-1.558881},{"x":-0.147759,"y":-0.035571,"z":-0.413109},{"x":-0.147762,"y":-0.035571,"z":-0.123062},{"x":-0.123309,"y":-0.050814,"z":-0.822987},{"x":-0.128583,"y":-0.058719,"z":-0.612804},{"x":-0.091164,"y":-0.079596,"z":-0.822987},{"x":-0.096441,"y":-0.087501,"z":-0.612804},{"x":-0.201393,"y":0.058677,"z":-1.618083},{"x":-0.324393,"y":0.05757,"z":-1.623429},{"x":-0.101727,"y":-0.090258,"z":0.758823},{"x":-0.101721,"y":-0.095403,"z":0.231553},{"x":0.003666,"y":-0.117945,"z":-0.413109},{"x":0.003666,"y":-0.117945,"z":-0.123062},{"x":-0.059193,"y":-0.11265,"z":-0.123062},{"x":-0.05919,"y":-0.112653,"z":-0.413109},{"x":-0.101715,"y":-0.095403,"z":-0.413109},{"x":-0.101718,"y":-0.095403,"z":-0.123062},{"x":-0.13386,"y":-0.066624,"z":-0.123062},{"x":-0.133857,"y":-0.066624,"z":-0.413109},{"x":0.003666,"y":0.240891,"z":1.126905},{"x":-0.211899,"y":0.046782,"z":0.043309},{"x":-0.32442,"y":0.036234,"z":-0.123064},{"x":-0.324378,"y":0.032799,"z":-0.413025},{"x":-0.324414,"y":0.036861,"z":-0.614991},{"x":-0.324378,"y":0.053574,"z":-1.309359},{"x":-0.324261,"y":0.074397,"z":-1.155636},{"x":-0.324396,"y":0.073716,"z":-1.315986},{"x":-0.324393,"y":0.070665,"z":-1.470072},{"x":-0.324393,"y":0.065532,"z":-1.624158},{"x":-0.324387,"y":0.055572,"z":-1.466394},{"x":0.331743,"y":0.062163,"z":0.043308},{"x":0.331746,"y":0.060879,"z":0.194449},{"x":0.331746,"y":0.059328,"z":0.043308},{"x":0.331734,"y":0.04878,"z":-0.854355},{"x":0.331731,"y":0.079482,"z":-0.864639},{"x":0.331233,"y":0.089319,"z":-0.593358},{"x":0.331638,"y":0.056754,"z":-0.995289},{"x":0.331458,"y":0.079482,"z":-0.995286},{"x":0.331737,"y":0.044394,"z":-0.852888},{"x":0.331692,"y":0.049578,"z":-0.995292},{"x":0.082563,"y":0.008556,"z":0.685005},{"x":0.126438,"y":0.005496,"z":0.782934},{"x":0.126432,"y":0.005493,"z":0.231552},{"x":0.07767,"y":0.008523,"z":0.705825},{"x":0.07422,"y":0.008523,"z":0.725547},{"x":0.072633,"y":0.008286,"z":0.743607},{"x":0.051861,"y":0.005823,"z":0.760269},{"x":0.10281,"y":0.023709,"z":0.611949},{"x":0.093351,"y":0.023235,"z":0.648279},{"x":0.086763,"y":0.022992,"z":0.682713},{"x":0.081237,"y":0.022206,"z":0.714003},{"x":0.037263,"y":0.013551,"z":0.777252},{"x":0.043218,"y":0.275397,"z":0.39621},{"x":0.057294,"y":0.273177,"z":0.444381},{"x":0.059748,"y":0.262077,"z":0.349071},{"x":0.029139,"y":0.27843,"z":0.348039},{"x":0.114111,"y":0.220683,"z":0.446676},{"x":0.110913,"y":0.219108,"z":0.348129},{"x":0.10725,"y":0.216912,"z":0.190853},{"x":0.059376,"y":0.249894,"z":0.19053},{"x":0.104808,"y":0.210366,"z":-1.000176},{"x":0.100065,"y":0.20163,"z":-1.172028},{"x":0.048375,"y":0.210348,"z":-1.169736},{"x":0.034557,"y":0.219087,"z":-1.000926},{"x":0.104922,"y":0.210366,"z":-0.864642},{"x":0.018966,"y":0.221964,"z":-0.864645},{"x":0.039261,"y":0.234246,"z":-0.586857},{"x":0.104394,"y":0.210369,"z":-0.598257},{"x":0.049392,"y":0.233841,"z":-0.41781},{"x":0.104673,"y":0.210369,"z":-0.416553},{"x":0.058992,"y":0.233085,"z":-0.123472},{"x":0.105681,"y":0.212226,"z":-0.123868},{"x":0.106428,"y":0.214401,"z":0.038205},{"x":0.062148,"y":0.239052,"z":0.037823},{"x":0.089928,"y":0.187407,"z":-1.322853},{"x":0.044808,"y":0.197859,"z":-1.323618},{"x":0.133059,"y":0.046767,"z":0.702294},{"x":0.121446,"y":0.04563,"z":0.773961},{"x":0.185355,"y":0.058254,"z":0.771243},{"x":0.17745,"y":0.058254,"z":0.844758},{"x":0.10983,"y":0.044499,"z":0.845628},{"x":0.011856,"y":0.064041,"z":1.711047},{"x":0.03132,"y":0.0786,"z":1.64646},{"x":0.021408,"y":0.08874,"z":1.64658},{"x":0.138549,"y":0.19077,"z":0.704502},{"x":0.138186,"y":0.190014,"z":0.616392},{"x":0.122538,"y":0.221619,"z":0.616395},{"x":0.12504,"y":0.223158,"z":0.70449},{"x":0.135573,"y":0.191469,"z":0.771243},{"x":0.126036,"y":0.223167,"z":0.771249},{"x":0.123105,"y":0.222429,"z":0.844842},{"x":0.132153,"y":0.192369,"z":0.844989},{"x":0.123891,"y":0.191469,"z":0.916443},{"x":0.111927,"y":0.219897,"z":0.91788},{"x":0.111924,"y":0.187941,"z":1.014168},{"x":0.093318,"y":0.214182,"z":1.014645},{"x":0.052332,"y":-0.087711,"z":-1.071852},{"x":0.048696,"y":-0.078579,"z":-1.320717},{"x":0.12642,"y":0.00549,"z":-0.822987},{"x":0.14139,"y":0.023583,"z":-1.071852},{"x":0.234702,"y":0.046782,"z":-0.996729},{"x":0.234294,"y":0.046782,"z":-0.864723},{"x":0.133548,"y":-0.004764,"z":-0.123062},{"x":0.126336,"y":0.005511,"z":-0.413109},{"x":0.126384,"y":0.005502,"z":-0.123062},{"x":0.212544,"y":0.046779,"z":0.206643},{"x":0.193644,"y":0.046776,"z":0.349881},{"x":0.166434,"y":0.047214,"z":0.540126},{"x":0.146856,"y":0.04677,"z":0.6234},{"x":0.021978,"y":0.28848,"z":0.349029},{"x":0.174003,"y":0.117561,"z":0.704412},{"x":0.15648,"y":0.1491,"z":0.704244},{"x":0.15135,"y":0.149115,"z":0.771243},{"x":0.166092,"y":0.117753,"z":0.771165},{"x":0.126378,"y":0.005499,"z":-0.612786},{"x":0.233364,"y":0.049335,"z":-0.61284},{"x":0.22371,"y":0.046782,"z":-0.413109},{"x":0.015429,"y":0.133716,"z":1.543839},{"x":0.096969,"y":0.181764,"z":1.127232},{"x":0.066963,"y":0.207906,"z":1.127415},{"x":0.125775,"y":-0.042105,"z":-1.071852},{"x":0.120912,"y":-0.033393,"z":-1.320717},{"x":0.144273,"y":0.001752,"z":-1.320717},{"x":0.144405,"y":-0.009006,"z":-1.071852},{"x":0.208359,"y":0.084417,"z":-1.3203},{"x":0.156195,"y":0.083139,"z":-1.32072},{"x":0.21297,"y":0.097053,"z":-1.168557},{"x":0.047442,"y":0.042075,"z":1.543749},{"x":0.042081,"y":0.043875,"z":1.593807},{"x":0.021402,"y":0.110622,"z":1.595478},{"x":0.140463,"y":0.190797,"z":0.535302},{"x":0.117216,"y":0.221895,"z":0.535266},{"x":0.161274,"y":0.058251,"z":1.013649},{"x":0.170118,"y":0.058251,"z":0.91644},{"x":0.165549,"y":0.077862,"z":0.915429},{"x":0.157086,"y":0.077277,"z":1.013481},{"x":0.016911,"y":0.05712,"z":1.710984},{"x":0.01707,"y":0.0507,"z":1.710798},{"x":0.033318,"y":0.046269,"z":1.644351},{"x":0.03804,"y":0.05394,"z":1.644582},{"x":0.177465,"y":0.046773,"z":0.450195},{"x":0.094848,"y":0.040251,"z":1.013652},{"x":0.086841,"y":0.036747,"z":1.126863},{"x":0.017295,"y":0.230328,"z":1.126884},{"x":0.02529,"y":0.219765,"z":1.126863},{"x":0.270219,"y":0.067485,"z":-1.621119},{"x":0.208719,"y":0.063972,"z":-1.618083},{"x":0.208539,"y":0.078513,"z":-1.484166},{"x":0.270129,"y":0.077469,"z":-1.477119},{"x":0.139158,"y":0.191466,"z":-0.864642},{"x":0.137157,"y":0.189627,"z":-0.597534},{"x":0.168711,"y":0.156501,"z":-0.596868},{"x":0.175266,"y":0.156591,"z":-0.864642},{"x":0.129651,"y":0.177918,"z":-1.171389},{"x":0.164895,"y":0.129639,"z":-1.16973},{"x":0.148815,"y":0.125229,"z":-1.321584},{"x":0.118227,"y":0.163419,"z":-1.322241},{"x":0.138678,"y":0.19134,"z":0.445734},{"x":0.139158,"y":0.190929,"z":0.348006},{"x":0.142443,"y":0.189507,"z":0.037837},{"x":0.141993,"y":0.190113,"z":-0.123125},{"x":0.017118,"y":0.304608,"z":0.397845},{"x":0.029262,"y":0.292635,"z":0.399324},{"x":0.25152,"y":0.090765,"z":0.346134},{"x":0.278613,"y":0.057261,"z":0.346134},{"x":0.259206,"y":0.097107,"z":0.190839},{"x":0.055968,"y":-0.096843,"z":-0.822987},{"x":0.061245,"y":-0.104748,"z":-0.612804},{"x":0.145299,"y":-0.008595,"z":0.775755},{"x":0.140763,"y":-0.015039,"z":0.231552},{"x":0.17493,"y":0.149802,"z":0.446625},{"x":0.169956,"y":0.149232,"z":0.535584},{"x":0.198804,"y":0.11724,"z":0.536841},{"x":0.208536,"y":0.11925,"z":0.446319},{"x":0.241887,"y":0.085005,"z":0.445767},{"x":0.258909,"y":0.058266,"z":0.446478},{"x":0.099963,"y":0.248325,"z":0.919314},{"x":0.112689,"y":0.25617,"z":0.844521},{"x":0.065277,"y":0.057933,"z":1.543839},{"x":0.052152,"y":0.056148,"z":1.594443},{"x":0.140916,"y":0.190485,"z":0.190749},{"x":0.072561,"y":0.234399,"z":1.013649},{"x":0.141354,"y":0.058248,"z":1.126863},{"x":0.142635,"y":0.077661,"z":1.126863},{"x":0.060891,"y":0.094704,"z":1.544589},{"x":0.065394,"y":0.075192,"z":1.543842},{"x":0.082581,"y":0.078573,"z":1.473258},{"x":0.079167,"y":0.102522,"z":1.473258},{"x":0.083673,"y":0.267591,"z":0.535056},{"x":0.102087,"y":0.263499,"z":0.616395},{"x":0.186123,"y":0.116994,"z":0.616674},{"x":0.204228,"y":0.080382,"z":0.616515},{"x":0.223197,"y":0.083187,"z":0.535332},{"x":0.155094,"y":-0.035571,"z":0.231552},{"x":0.155097,"y":-0.030432,"z":0.76605},{"x":0.165672,"y":0.148704,"z":0.616392},{"x":0.054654,"y":0.040104,"z":1.473258},{"x":0.081807,"y":0.059481,"z":1.473258},{"x":0.069111,"y":0.119982,"z":1.473708},{"x":0.095421,"y":0.109122,"z":1.408608},{"x":0.084579,"y":0.129534,"z":1.408608},{"x":0.217449,"y":0.121401,"z":0.345972},{"x":0.220017,"y":0.124311,"z":0.190745},{"x":0.136458,"y":0.14622,"z":1.013784},{"x":0.142839,"y":0.147777,"z":0.914253},{"x":0.15636,"y":0.041673,"z":-1.32072},{"x":0.137649,"y":0.189732,"z":-0.415809},{"x":0.063135,"y":0.151665,"z":1.408608},{"x":0.077682,"y":0.165693,"z":1.31337},{"x":0.045159,"y":0.190485,"z":1.31337},{"x":0.035058,"y":0.169734,"z":1.408608},{"x":0.170346,"y":0.156489,"z":-0.415011},{"x":0.237384,"y":0.058263,"z":0.535332},{"x":0.213945,"y":0.05826,"z":0.616392},{"x":0.147972,"y":0.118992,"z":1.013649},{"x":0.136488,"y":0.118869,"z":1.126863},{"x":0.170784,"y":0.077679,"z":0.844758},{"x":0.036561,"y":0.065838,"z":1.64529},{"x":0.111675,"y":0.060249,"z":1.31337},{"x":0.115185,"y":0.079494,"z":1.31337},{"x":0.097785,"y":0.079662,"z":1.408608},{"x":0.09615,"y":0.059958,"z":1.408608},{"x":0.111378,"y":0.114447,"z":1.31337},{"x":0.102204,"y":0.136554,"z":1.31337},{"x":0.051138,"y":0.108735,"z":1.545066},{"x":0.112839,"y":0.139491,"z":1.232349},{"x":0.123303,"y":0.116691,"z":1.232349},{"x":0.125067,"y":0.142887,"z":1.127076},{"x":0.077625,"y":0.036891,"z":1.232349},{"x":0.126531,"y":0.058245,"z":1.232349},{"x":0.070356,"y":0.037755,"z":1.31337},{"x":0.128496,"y":0.079269,"z":1.232349},{"x":0.115203,"y":0.259182,"z":0.771249},{"x":0.179376,"y":0.151068,"z":0.346083},{"x":0.264456,"y":0.097236,"z":-0.996729},{"x":0.273528,"y":0.090297,"z":-1.162587},{"x":0.218772,"y":0.111966,"z":-0.997077},{"x":0.035727,"y":0.12294,"z":1.544919},{"x":0.05157,"y":0.138534,"z":1.4742},{"x":0.026298,"y":0.152157,"z":1.473258},{"x":0.036288,"y":0.099165,"z":1.596},{"x":0.061047,"y":0.038643,"z":1.408608},{"x":0.051165,"y":0.070866,"z":1.594698},{"x":0.154083,"y":0.118122,"z":0.916464},{"x":0.270042,"y":0.082461,"z":-1.318143},{"x":0.159702,"y":0.117873,"z":0.846009},{"x":0.178251,"y":0.077886,"z":0.771243},{"x":0.054036,"y":0.200682,"z":1.232349},{"x":0.179199,"y":0.154929,"z":-0.12346},{"x":0.219297,"y":0.125742,"z":-0.123575},{"x":0.218802,"y":0.125628,"z":-0.414093},{"x":0.019074,"y":0.318162,"z":0.445995},{"x":0.032562,"y":0.302595,"z":0.445611},{"x":0.139146,"y":0.191466,"z":-0.999435},{"x":0.176529,"y":0.144408,"z":-0.998133},{"x":0.086493,"y":0.17373,"z":1.232349},{"x":0.264348,"y":0.097881,"z":-0.413109},{"x":0.263949,"y":0.097881,"z":-0.594813},{"x":0.217164,"y":0.123078,"z":-0.595824},{"x":0.208545,"y":0.048069,"z":-1.469193},{"x":0.208368,"y":0.037461,"z":-1.3203},{"x":0.147915,"y":0.148875,"z":0.844872},{"x":0.046086,"y":0.086928,"z":1.595736},{"x":0.066525,"y":-0.11265,"z":0.231553},{"x":0.066531,"y":-0.107508,"z":0.758823},{"x":0.183279,"y":0.152559,"z":0.190746},{"x":0.103878,"y":0.042075,"z":0.91746},{"x":0.188925,"y":0.078753,"z":0.704952},{"x":0.197166,"y":0.058257,"z":0.70497},{"x":0.219741,"y":0.124539,"z":0.037837},{"x":0.182382,"y":0.153507,"z":0.037837},{"x":0.223962,"y":0.046782,"z":-0.123063},{"x":0.274881,"y":0.051837,"z":0.329262},{"x":0.093333,"y":-0.070254,"z":-1.071852},{"x":0.08817,"y":-0.060915,"z":-1.320717},{"x":0.112989,"y":0.261819,"z":0.704496},{"x":0.264504,"y":0.097881,"z":-0.864642},{"x":0.33111,"y":0.085203,"z":-0.411783},{"x":0.264003,"y":0.097881,"z":-0.123071},{"x":0.33174,"y":0.078528,"z":-0.123071},{"x":0.149811,"y":-0.027669,"z":-0.612804},{"x":0.144537,"y":-0.019764,"z":-0.822987},{"x":0.109095,"y":0.152631,"z":-1.439337},{"x":0.081537,"y":0.175908,"z":-1.439934},{"x":0.217734,"y":0.123078,"z":-0.864642},{"x":0.114048,"y":-0.025644,"z":-1.438758},{"x":0.136128,"y":0.006732,"z":-1.438758},{"x":0.262053,"y":0.099054,"z":0.037836},{"x":0.083145,"y":-0.051024,"z":-1.438758},{"x":0.1359,"y":0.11808,"z":-1.438761},{"x":0.046248,"y":0.186114,"z":-1.440528},{"x":0.147594,"y":0.043482,"z":-1.438758},{"x":0.045915,"y":-0.06735,"z":-1.438758},{"x":0.14751,"y":0.08163,"z":-1.438509},{"x":0.104568,"y":-0.017955,"z":-1.556802},{"x":0.124734,"y":0.011547,"z":-1.556802},{"x":0.101175,"y":0.143712,"z":-1.557438},{"x":0.074199,"y":0.164502,"z":-1.558026},{"x":0.124551,"y":0.113007,"z":-1.55703},{"x":0.141195,"y":-0.061479,"z":0.758823},{"x":0.141192,"y":-0.066624,"z":0.231552},{"x":0.076344,"y":-0.041088,"z":-1.556802},{"x":0.044079,"y":0.174036,"z":-1.558566},{"x":0.13521,"y":0.045036,"z":-1.556802},{"x":0.042348,"y":-0.055971,"z":-1.556802},{"x":0.135144,"y":0.079794,"z":-1.556802},{"x":0.155091,"y":-0.035571,"z":-0.123062},{"x":0.155088,"y":-0.035571,"z":-0.413109},{"x":0.135912,"y":-0.058719,"z":-0.612804},{"x":0.130638,"y":-0.050814,"z":-0.822987},{"x":0.10377,"y":-0.087501,"z":-0.612804},{"x":0.098493,"y":-0.079596,"z":-0.822987},{"x":0.331722,"y":0.05757,"z":-1.623429},{"x":0.208722,"y":0.058677,"z":-1.618083},{"x":0.10905,"y":-0.095403,"z":0.231553},{"x":0.109056,"y":-0.090258,"z":0.758823},{"x":0.066519,"y":-0.112653,"z":-0.413109},{"x":0.066522,"y":-0.11265,"z":-0.123062},{"x":0.141186,"y":-0.066624,"z":-0.413109},{"x":0.141189,"y":-0.066624,"z":-0.123062},{"x":0.109047,"y":-0.095403,"z":-0.123062},{"x":0.109044,"y":-0.095403,"z":-0.413109},{"x":0.219228,"y":0.046782,"z":0.043309},{"x":0.331749,"y":0.036234,"z":-0.123064},{"x":0.331707,"y":0.032799,"z":-0.413025},{"x":0.331743,"y":0.036861,"z":-0.614991},{"x":0.331707,"y":0.053574,"z":-1.309359},{"x":0.33159,"y":0.074397,"z":-1.155636},{"x":0.331725,"y":0.073716,"z":-1.315986},{"x":0.331722,"y":0.070665,"z":-1.470072},{"x":0.331722,"y":0.065532,"z":-1.624158},{"x":0.331716,"y":0.055572,"z":-1.466394},{"x":-0.128112,"y":-0.015939,"z":0.780591},{"x":-0.115182,"y":-0.00669,"z":0.786903},{"x":-0.109701,"y":0.002775,"z":0.821676},{"x":-0.106077,"y":-0.004347,"z":0.821679},{"x":0.003666,"y":-0.004347,"z":0.821679},{"x":0.003666,"y":0.002775,"z":0.821676},{"x":0.113406,"y":-0.004347,"z":0.821679},{"x":0.11703,"y":0.002775,"z":0.821676},{"x":0.122511,"y":-0.00669,"z":0.786903},{"x":0.135441,"y":-0.015939,"z":0.780591},{"x":0.142011,"y":-0.030288,"z":0.772227},{"x":0.131226,"y":-0.054333,"z":0.766251},{"x":0.102681,"y":-0.08004,"z":0.7668},{"x":0.063531,"y":-0.095964,"z":0.767037},{"x":0.003666,"y":-0.103407,"z":0.767184},{"x":-0.056202,"y":-0.095964,"z":0.767037},{"x":-0.095352,"y":-0.08004,"z":0.7668},{"x":-0.123897,"y":-0.054333,"z":0.766251},{"x":-0.134682,"y":-0.030288,"z":0.772227},{"x":-0.123204,"y":-0.019638,"z":0.773793},{"x":-0.113253,"y":-0.012834,"z":0.779676},{"x":0.003666,"y":-0.017058,"z":0.766278},{"x":0.003666,"y":-0.011106,"z":0.773472},{"x":0.120582,"y":-0.012834,"z":0.779676},{"x":0.130533,"y":-0.019638,"z":0.773793},{"x":0.135447,"y":-0.030174,"z":0.766095},{"x":0.126231,"y":-0.050757,"z":0.760728},{"x":0.099489,"y":-0.074931,"z":0.761547},{"x":0.062031,"y":-0.090192,"z":0.761901},{"x":0.003666,"y":-0.097452,"z":0.762078},{"x":-0.054702,"y":-0.090192,"z":0.761901},{"x":-0.09216,"y":-0.074931,"z":0.761547},{"x":-0.118902,"y":-0.050757,"z":0.760728},{"x":-0.128118,"y":-0.030174,"z":0.766095},{"x":1.130724,"y":0.082218,"z":-0.486909},{"x":1.17219,"y":0.123687,"z":-0.486909},{"x":1.17585,"y":0.120027,"z":-0.486909},{"x":1.134384,"y":0.078558,"z":-0.486909},{"x":-1.116546,"y":0.092787,"z":-0.449202},{"x":-1.116546,"y":0.092787,"z":-1.007514},{"x":-1.122081,"y":0.091911,"z":-1.007514},{"x":-1.122081,"y":0.091911,"z":-0.449202},{"x":-1.105533,"y":0.091044,"z":-1.007514},{"x":-1.110948,"y":0.092493,"z":-1.007514},{"x":-1.110948,"y":0.092493,"z":-0.449202},{"x":-1.105533,"y":0.091044,"z":-0.449202},{"x":-1.090113,"y":0.075621,"z":-1.007514},{"x":-1.092657,"y":0.080616,"z":-1.007514},{"x":-1.092657,"y":0.080616,"z":-0.449202},{"x":-1.090113,"y":0.075621,"z":-0.449202},{"x":-1.137627,"y":0.051411,"z":-0.449202},{"x":-1.140171,"y":0.056406,"z":-0.449202},{"x":-1.140171,"y":0.056406,"z":-1.007514},{"x":-1.137627,"y":0.051411,"z":-1.007514},{"x":-1.100031,"y":0.085185,"z":-0.865953},{"x":-1.100031,"y":0.085185,"z":-0.945306},{"x":-1.095969,"y":0.081123,"z":-0.945306},{"x":-1.095969,"y":0.081123,"z":-0.865953},{"x":-1.141038,"y":0.072951,"z":-0.449202},{"x":-1.141038,"y":0.072951,"z":-1.007514},{"x":-1.141917,"y":0.067416,"z":-1.007514},{"x":-1.141917,"y":0.067416,"z":-0.449202},{"x":-1.095969,"y":0.050889,"z":-0.865953},{"x":-1.100031,"y":0.046827,"z":-0.865953},{"x":-1.047471,"y":-0.005736,"z":-0.879909},{"x":-1.043406,"y":-0.001671,"z":-0.879909},{"x":-1.131336,"y":0.053532,"z":-0.486909},{"x":-1.127676,"y":0.049872,"z":-0.486909},{"x":-1.169145,"y":0.008406,"z":-0.486909},{"x":-1.172805,"y":0.012066,"z":-0.486909},{"x":1.105809,"y":0.049758,"z":-0.486909},{"x":1.06434,"y":0.008292,"z":-0.486909},{"x":1.06068,"y":0.011952,"z":-0.486909},{"x":1.102149,"y":0.053418,"z":-0.486909},{"x":-1.127565,"y":0.082218,"z":-0.486909},{"x":-1.131225,"y":0.078558,"z":-0.486909},{"x":-1.172691,"y":0.120027,"z":-0.486909},{"x":-1.169031,"y":0.123687,"z":-0.486909},{"x":1.17219,"y":0.123687,"z":-0.480555},{"x":1.152171,"y":0.103668,"z":-0.462765},{"x":1.155831,"y":0.100008,"z":-0.462765},{"x":1.17585,"y":0.120027,"z":-0.480555},{"x":1.134495,"y":0.053532,"z":-0.486909},{"x":1.175964,"y":0.012066,"z":-0.486909},{"x":1.172304,"y":0.008406,"z":-0.486909},{"x":1.130835,"y":0.049872,"z":-0.486909},{"x":-0.629229,"y":0.063897,"z":-0.739878},{"x":-0.639528,"y":0.063897,"z":-0.739878},{"x":-0.639528,"y":0.063897,"z":-0.511134},{"x":-0.629229,"y":0.063897,"z":-0.511134},{"x":-0.629229,"y":-0.0276,"z":-0.739878},{"x":-0.639528,"y":-0.0276,"z":-0.739878},{"x":-0.634014,"y":-0.057477,"z":-0.218387},{"x":-0.641925,"y":-0.055206,"z":-0.218387},{"x":-0.641925,"y":-0.055206,"z":-0.329334},{"x":-0.634014,"y":-0.057477,"z":-0.329334},{"x":-0.629229,"y":-0.0276,"z":-0.351012},{"x":-0.639528,"y":-0.0276,"z":-0.351012},{"x":0.672382,"y":0.063897,"z":-0.511134},{"x":0.662083,"y":0.063897,"z":-0.511134},{"x":0.662083,"y":0.0291,"z":-0.409275},{"x":0.672382,"y":0.0291,"z":-0.409275},{"x":0.672382,"y":0.063897,"z":-0.739878},{"x":0.662083,"y":0.063897,"z":-0.739878},{"x":0.672382,"y":-0.0276,"z":-0.739878},{"x":0.662083,"y":-0.0276,"z":-0.739878},{"x":0.672382,"y":-0.0276,"z":-0.351012},{"x":0.662083,"y":-0.0276,"z":-0.351012},{"x":1.105809,"y":0.049758,"z":-0.440526},{"x":1.102149,"y":0.053418,"z":-0.440526},{"x":1.06434,"y":0.008292,"z":-0.480555},{"x":1.06068,"y":0.011952,"z":-0.480555},{"x":1.102035,"y":0.078447,"z":-0.440526},{"x":1.102035,"y":0.078447,"z":-0.486909},{"x":1.105695,"y":0.082107,"z":-0.486909},{"x":1.105695,"y":0.082107,"z":-0.440526},{"x":1.095687,"y":0.092115,"z":-0.442431},{"x":1.092027,"y":0.088455,"z":-0.442431},{"x":1.130724,"y":0.082218,"z":-0.440526},{"x":1.134384,"y":0.078558,"z":-0.440526},{"x":1.144392,"y":0.088569,"z":-0.442431},{"x":1.140732,"y":0.092229,"z":-0.442431},{"x":1.091526,"y":0.064611,"z":-1.007514},{"x":1.091526,"y":0.064611,"z":-0.449202},{"x":1.09182,"y":0.070206,"z":-0.449202},{"x":1.09182,"y":0.070206,"z":-1.007514},{"x":1.097466,"y":0.04914,"z":-0.449202},{"x":1.094412,"y":0.053841,"z":-0.449202},{"x":1.094412,"y":0.053841,"z":-1.007514},{"x":1.097466,"y":0.04914,"z":-1.007514},{"x":1.111362,"y":0.040116,"z":-0.449202},{"x":1.10613,"y":0.042126,"z":-0.449202},{"x":1.10613,"y":0.042126,"z":-1.007514},{"x":1.111362,"y":0.040116,"z":-1.007514},{"x":1.144782,"y":0.061818,"z":-0.449202},{"x":1.144782,"y":0.061818,"z":-1.007514},{"x":1.145073,"y":0.067416,"z":-1.007514},{"x":1.145073,"y":0.067416,"z":-0.449202},{"x":1.14219,"y":0.078186,"z":-0.449202},{"x":1.144197,"y":0.072951,"z":-0.449202},{"x":1.144197,"y":0.072951,"z":-1.007514},{"x":1.14219,"y":0.078186,"z":-1.007514},{"x":1.12524,"y":0.091911,"z":-0.449202},{"x":1.130472,"y":0.089901,"z":-0.449202},{"x":1.130472,"y":0.089901,"z":-1.007514},{"x":1.12524,"y":0.091911,"z":-1.007514},{"x":1.185984,"y":-0.005736,"z":-0.93135},{"x":1.133424,"y":0.046827,"z":-0.945306},{"x":1.137486,"y":0.050889,"z":-0.945306},{"x":1.190049,"y":-0.001671,"z":-0.93135},{"x":1.133424,"y":0.046827,"z":-0.865953},{"x":1.185984,"y":-0.005736,"z":-0.879909},{"x":1.190049,"y":-0.001671,"z":-0.879909},{"x":1.137486,"y":0.050889,"z":-0.865953},{"x":-1.10265,"y":0.049758,"z":-0.440526},{"x":-1.09899,"y":0.053418,"z":-0.440526},{"x":-1.09899,"y":0.053418,"z":-0.486909},{"x":-1.10265,"y":0.049758,"z":-0.486909},{"x":-1.057524,"y":0.011952,"z":-0.486909},{"x":-1.061184,"y":0.008292,"z":-0.486909},{"x":-1.057524,"y":0.011952,"z":-0.480555},{"x":-1.061184,"y":0.008292,"z":-0.480555},{"x":-1.131336,"y":0.053532,"z":-0.440526},{"x":-1.127676,"y":0.049872,"z":-0.440526},{"x":-1.127565,"y":0.082218,"z":-0.440526},{"x":-1.131225,"y":0.078558,"z":-0.440526},{"x":-1.169031,"y":0.123687,"z":-0.480555},{"x":-1.172691,"y":0.120027,"z":-0.480555},{"x":-1.152672,"y":0.100008,"z":-0.462765},{"x":-1.149012,"y":0.103668,"z":-0.462765},{"x":-1.089246,"y":0.059073,"z":-0.449202},{"x":-1.089246,"y":0.059073,"z":-1.007514},{"x":-1.088367,"y":0.064611,"z":-1.007514},{"x":-1.088367,"y":0.064611,"z":-0.449202},{"x":-1.091253,"y":0.053841,"z":-0.449202},{"x":-1.091253,"y":0.053841,"z":-1.007514},{"x":-1.09827,"y":0.045177,"z":-0.449202},{"x":-1.09827,"y":0.045177,"z":-1.007514},{"x":-1.094307,"y":0.04914,"z":-1.007514},{"x":-1.094307,"y":0.04914,"z":-0.449202},{"x":-1.108203,"y":0.040116,"z":-0.449202},{"x":-1.108203,"y":0.040116,"z":-1.007514},{"x":-1.102971,"y":0.042126,"z":-1.007514},{"x":-1.102971,"y":0.042126,"z":-0.449202},{"x":-1.129743,"y":0.043527,"z":-0.449202},{"x":-1.134099,"y":0.047055,"z":-0.449202},{"x":-1.134099,"y":0.047055,"z":-1.007514},{"x":-1.129743,"y":0.043527,"z":-1.007514},{"x":0.653835,"y":-0.049176,"z":-0.218387},{"x":0.651424,"y":-0.041205,"z":-0.218387},{"x":0.651426,"y":-0.041208,"z":-0.329334},{"x":0.653837,"y":-0.049179,"z":-0.329334},{"x":-1.141623,"y":0.061818,"z":-0.449202},{"x":-1.141623,"y":0.061818,"z":-1.007514},{"x":-1.139031,"y":0.078186,"z":-0.449202},{"x":-1.139031,"y":0.078186,"z":-1.007514},{"x":-0.620436,"y":-0.042321,"z":-0.838671},{"x":-0.620436,"y":-0.042315,"z":-0.751587},{"x":-0.621981,"y":-0.049305,"z":-0.751587},{"x":-0.621981,"y":-0.049311,"z":-0.838671},{"x":-1.135977,"y":0.082887,"z":-0.449202},{"x":-1.135977,"y":0.082887,"z":-1.007514},{"x":-1.132014,"y":0.08685,"z":-0.449202},{"x":-1.132014,"y":0.08685,"z":-1.007514},{"x":-1.127313,"y":0.089901,"z":-0.449202},{"x":-1.127313,"y":0.089901,"z":-1.007514},{"x":-1.18689,"y":-0.001671,"z":-0.879909},{"x":-1.18689,"y":-0.001671,"z":-0.93135},{"x":-1.182828,"y":-0.005736,"z":-0.93135},{"x":-1.182828,"y":-0.005736,"z":-0.879909},{"x":-1.18689,"y":0.133686,"z":-0.93135},{"x":-1.182828,"y":0.137748,"z":-0.93135},{"x":-1.130265,"y":0.085185,"z":-0.945306},{"x":-1.134327,"y":0.081123,"z":-0.945306},{"x":-1.134327,"y":0.081123,"z":-0.865953},{"x":-1.130265,"y":0.085185,"z":-0.865953},{"x":-1.182828,"y":0.137748,"z":-0.879909},{"x":-1.18689,"y":0.133686,"z":-0.879909},{"x":-0.639528,"y":0.0291,"z":-0.409275},{"x":-0.629229,"y":0.0291,"z":-0.409275},{"x":-0.648561,"y":-0.041163,"z":-0.838671},{"x":-0.648564,"y":-0.041157,"z":-0.751587},{"x":-0.647082,"y":-0.03417,"z":-0.751587},{"x":-0.647079,"y":-0.034176,"z":-0.838671},{"x":-1.098876,"y":0.078447,"z":-0.486909},{"x":-1.102536,"y":0.082107,"z":-0.486909},{"x":-1.06107,"y":0.123573,"z":-0.486909},{"x":-1.05741,"y":0.119913,"z":-0.486909},{"x":1.060569,"y":0.119913,"z":-0.486909},{"x":1.064229,"y":0.123573,"z":-0.486909},{"x":1.05063,"y":-0.005736,"z":-0.879909},{"x":1.046565,"y":-0.001671,"z":-0.879909},{"x":1.046565,"y":-0.001671,"z":-0.93135},{"x":1.05063,"y":-0.005736,"z":-0.93135},{"x":-1.141233,"y":0.088569,"z":-0.442431},{"x":-1.137573,"y":0.092229,"z":-0.442431},{"x":-1.141347,"y":0.043521,"z":-0.442431},{"x":-1.137687,"y":0.039861,"z":-0.442431},{"x":1.101429,"y":0.045177,"z":-0.449202},{"x":1.101429,"y":0.045177,"z":-1.007514},{"x":1.046565,"y":0.133686,"z":-0.879909},{"x":1.05063,"y":0.137748,"z":-0.879909},{"x":1.05063,"y":0.137748,"z":-0.93135},{"x":1.046565,"y":0.133686,"z":-0.93135},{"x":-1.07754,"y":0.031971,"z":-0.462765},{"x":-1.0812,"y":0.028311,"z":-0.462765},{"x":1.137486,"y":0.081123,"z":-0.865953},{"x":1.133424,"y":0.085185,"z":-0.865953},{"x":1.133424,"y":0.085185,"z":-0.945306},{"x":1.137486,"y":0.081123,"z":-0.945306},{"x":-0.626232,"y":-0.055653,"z":-0.218387},{"x":-0.626232,"y":-0.055653,"z":-0.329334},{"x":-1.124751,"y":0.040983,"z":-0.449202},{"x":-1.124751,"y":0.040983,"z":-1.007514},{"x":1.135173,"y":0.08685,"z":-0.449202},{"x":1.135173,"y":0.08685,"z":-1.007514},{"x":-1.088661,"y":0.070206,"z":-1.007514},{"x":-1.088661,"y":0.070206,"z":-0.449202},{"x":-1.096185,"y":0.084972,"z":-1.007514},{"x":-1.096185,"y":0.084972,"z":-0.449202},{"x":-1.098876,"y":0.078447,"z":-0.440526},{"x":-1.088868,"y":0.088455,"z":-0.442431},{"x":-1.092528,"y":0.092115,"z":-0.442431},{"x":-1.102536,"y":0.082107,"z":-0.440526},{"x":-1.12653,"y":0.088365,"z":-0.413679},{"x":-1.130931,"y":0.085509,"z":-0.413679},{"x":-1.092789,"y":0.054624,"z":-0.413679},{"x":-1.090911,"y":0.05952,"z":-0.413679},{"x":1.124793,"y":0.090246,"z":-0.413679},{"x":1.129689,"y":0.088365,"z":-0.413679},{"x":-1.099353,"y":0.046518,"z":-0.413679},{"x":-1.095645,"y":0.050226,"z":-0.413679},{"x":-1.134639,"y":0.081801,"z":-0.413679},{"x":-1.101567,"y":0.049251,"z":-0.387597},{"x":-1.098378,"y":0.05244,"z":-0.387597},{"x":1.104726,"y":0.049251,"z":-0.387597},{"x":1.101537,"y":0.05244,"z":-0.387597},{"x":1.098804,"y":0.050226,"z":-0.413679},{"x":1.102512,"y":0.046518,"z":-0.413679},{"x":0.660509,"y":-0.053727,"z":-0.838674},{"x":0.667625,"y":-0.0558,"z":-0.838674},{"x":0.667623,"y":-0.055794,"z":-0.751587},{"x":0.660507,"y":-0.053721,"z":-0.751587},{"x":-0.62796,"y":-0.029766,"z":-0.838671},{"x":-0.635088,"y":-0.027657,"z":-0.838671},{"x":-0.635091,"y":-0.027651,"z":-0.751587},{"x":-0.627963,"y":-0.02976,"z":-0.751587},{"x":1.099128,"y":0.050889,"z":-0.865953},{"x":1.10319,"y":0.046827,"z":-0.865953},{"x":1.099128,"y":0.050889,"z":-0.945306},{"x":1.10319,"y":0.046827,"z":-0.945306},{"x":-1.172805,"y":0.012066,"z":-0.480555},{"x":-1.169145,"y":0.008406,"z":-0.480555},{"x":-1.149126,"y":0.028422,"z":-0.462765},{"x":-1.152786,"y":0.032082,"z":-0.462765},{"x":1.084359,"y":0.028311,"z":-0.462765},{"x":1.080699,"y":0.031971,"z":-0.462765},{"x":0.681188,"y":-0.042315,"z":-0.454485},{"x":0.679641,"y":-0.049314,"z":-0.454485},{"x":0.679614,"y":-0.049299,"z":-0.549651},{"x":0.681157,"y":-0.042315,"z":-0.549648},{"x":1.134495,"y":0.053532,"z":-0.440526},{"x":1.130835,"y":0.049872,"z":-0.440526},{"x":1.140846,"y":0.039861,"z":-0.442431},{"x":1.144506,"y":0.043521,"z":-0.442431},{"x":-1.09989,"y":0.081264,"z":-0.387597},{"x":-1.103394,"y":0.084102,"z":-0.387597},{"x":-1.106463,"y":0.079377,"z":-0.356877},{"x":-1.103874,"y":0.07728,"z":-0.356877},{"x":1.093272,"y":0.075621,"z":-0.449202},{"x":1.093272,"y":0.075621,"z":-1.007514},{"x":1.14333,"y":0.056406,"z":-0.449202},{"x":1.14333,"y":0.056406,"z":-1.007514},{"x":1.060569,"y":0.119913,"z":-0.480555},{"x":1.080588,"y":0.099894,"z":-0.462765},{"x":1.084248,"y":0.103554,"z":-0.462765},{"x":1.064229,"y":0.123573,"z":-0.480555},{"x":-1.127523,"y":0.076041,"z":-0.356877},{"x":-1.131903,"y":0.079587,"z":-0.387597},{"x":-1.13436,"y":0.075807,"z":-0.387597},{"x":-1.129338,"y":0.073248,"z":-0.356877},{"x":-1.043406,"y":-0.001671,"z":-0.93135},{"x":-1.047471,"y":-0.005736,"z":-0.93135},{"x":-1.100031,"y":0.046827,"z":-0.945306},{"x":-1.095969,"y":0.050889,"z":-0.945306},{"x":1.10319,"y":0.085185,"z":-0.865953},{"x":1.099128,"y":0.081123,"z":-0.865953},{"x":1.099128,"y":0.081123,"z":-0.945306},{"x":1.10319,"y":0.085185,"z":-0.945306},{"x":1.095816,"y":0.080616,"z":-1.007514},{"x":1.095816,"y":0.080616,"z":-0.449202},{"x":1.099344,"y":0.084972,"z":-0.449202},{"x":1.099344,"y":0.084972,"z":-1.007514},{"x":1.132902,"y":0.043527,"z":-0.449202},{"x":1.132902,"y":0.043527,"z":-1.007514},{"x":1.137258,"y":0.047055,"z":-1.007514},{"x":1.137258,"y":0.047055,"z":-0.449202},{"x":1.140786,"y":0.051411,"z":-1.007514},{"x":1.140786,"y":0.051411,"z":-0.449202},{"x":1.175964,"y":0.012066,"z":-0.480555},{"x":1.155945,"y":0.032082,"z":-0.462765},{"x":1.152285,"y":0.028422,"z":-0.462765},{"x":1.172304,"y":0.008406,"z":-0.480555},{"x":1.092138,"y":0.04341,"z":-0.442431},{"x":1.095798,"y":0.03975,"z":-0.442431},{"x":-1.05741,"y":0.119913,"z":-0.480555},{"x":-1.06107,"y":0.123573,"z":-0.480555},{"x":-1.081089,"y":0.103554,"z":-0.462765},{"x":-1.077429,"y":0.099894,"z":-0.462765},{"x":0.667596,"y":-0.057477,"z":-0.218387},{"x":0.659685,"y":-0.055206,"z":-0.218387},{"x":0.659686,"y":-0.055206,"z":-0.329334},{"x":0.667596,"y":-0.057477,"z":-0.329334},{"x":0.675379,"y":-0.055653,"z":-0.218387},{"x":0.675379,"y":-0.055653,"z":-0.329334},{"x":0.678959,"y":-0.035172,"z":-0.549651},{"x":0.678984,"y":-0.035154,"z":-0.454485},{"x":0.666519,"y":-0.027651,"z":-0.751587},{"x":0.666521,"y":-0.027657,"z":-0.838671},{"x":0.659518,"y":-0.029259,"z":-0.838671},{"x":0.659516,"y":-0.029253,"z":-0.751587},{"x":1.103049,"y":0.081264,"z":-0.387597},{"x":1.107033,"y":0.07728,"z":-0.356877},{"x":1.109622,"y":0.079377,"z":-0.356877},{"x":1.106553,"y":0.084102,"z":-0.387597},{"x":-1.043406,"y":0.133686,"z":-0.879909},{"x":-1.043406,"y":0.133686,"z":-0.93135},{"x":-1.047471,"y":0.137748,"z":-0.93135},{"x":-1.047471,"y":0.137748,"z":-0.879909},{"x":1.139136,"y":0.082887,"z":-0.449202},{"x":1.139136,"y":0.082887,"z":-1.007514},{"x":-1.119336,"y":0.039534,"z":-0.449202},{"x":-1.119336,"y":0.039534,"z":-1.007514},{"x":1.114107,"y":0.092493,"z":-1.007514},{"x":1.114107,"y":0.092493,"z":-0.449202},{"x":1.119705,"y":0.092787,"z":-0.449202},{"x":1.119705,"y":0.092787,"z":-1.007514},{"x":-1.113738,"y":0.03924,"z":-0.449202},{"x":-1.113738,"y":0.03924,"z":-1.007514},{"x":1.116897,"y":0.03924,"z":-0.449202},{"x":1.116897,"y":0.03924,"z":-1.007514},{"x":1.122495,"y":0.039534,"z":-1.007514},{"x":1.122495,"y":0.039534,"z":-0.449202},{"x":1.108692,"y":0.091044,"z":-1.007514},{"x":1.108692,"y":0.091044,"z":-0.449202},{"x":-1.092639,"y":0.03975,"z":-0.442431},{"x":-1.088979,"y":0.04341,"z":-0.442431},{"x":0.666392,"y":-0.026196,"z":-0.218387},{"x":0.65859,"y":-0.027978,"z":-0.218387},{"x":0.659346,"y":-0.029217,"z":-0.206641},{"x":0.666438,"y":-0.027597,"z":-0.206641},{"x":0.674321,"y":-0.028518,"z":-0.218387},{"x":0.674323,"y":-0.028521,"z":-0.329334},{"x":0.666393,"y":-0.026199,"z":-0.329334},{"x":0.678972,"y":-0.03516,"z":-0.751587},{"x":0.681173,"y":-0.042315,"z":-0.751587},{"x":0.681176,"y":-0.042321,"z":-0.838671},{"x":0.678975,"y":-0.035166,"z":-0.838671},{"x":0.673651,"y":-0.029766,"z":-0.838671},{"x":0.673648,"y":-0.02976,"z":-0.751587},{"x":-0.642093,"y":-0.029259,"z":-0.838671},{"x":-0.642096,"y":-0.029253,"z":-0.751587},{"x":-0.642084,"y":-0.029271,"z":-0.549651},{"x":-0.635088,"y":-0.027672,"z":-0.549651},{"x":-0.635127,"y":-0.027237,"z":-0.717819},{"x":-0.64236,"y":-0.02889,"z":-0.717819},{"x":0.659527,"y":-0.029271,"z":-0.549651},{"x":0.666522,"y":-0.027672,"z":-0.549651},{"x":0.666483,"y":-0.027237,"z":-0.717819},{"x":0.659252,"y":-0.02889,"z":-0.717819},{"x":0.679629,"y":-0.049305,"z":-0.751587},{"x":0.679631,"y":-0.049311,"z":-0.838671},{"x":-0.620424,"y":-0.042315,"z":-0.454485},{"x":-0.621969,"y":-0.049314,"z":-0.454485},{"x":-0.621996,"y":-0.049299,"z":-0.549651},{"x":-0.620454,"y":-0.042315,"z":-0.549648},{"x":0.653027,"y":-0.033429,"z":-0.218387},{"x":0.653029,"y":-0.033432,"z":-0.329334},{"x":0.65305,"y":-0.041163,"z":-0.838671},{"x":0.653048,"y":-0.041157,"z":-0.751587},{"x":0.654529,"y":-0.03417,"z":-0.751587},{"x":0.654531,"y":-0.034176,"z":-0.838671},{"x":1.185984,"y":0.137748,"z":-0.879909},{"x":1.190049,"y":0.133686,"z":-0.879909},{"x":1.190049,"y":0.133686,"z":-0.93135},{"x":1.185984,"y":0.137748,"z":-0.93135},{"x":-1.090089,"y":0.064701,"z":-0.413679},{"x":-1.10865,"y":0.041781,"z":-0.413679},{"x":-1.103754,"y":0.043662,"z":-0.413679},{"x":-1.094103,"y":0.079677,"z":-0.413679},{"x":-1.097403,"y":0.083751,"z":-0.413679},{"x":-1.097052,"y":0.07776,"z":-0.387597},{"x":1.097262,"y":0.079677,"z":-0.413679},{"x":1.100211,"y":0.07776,"z":-0.387597},{"x":1.100562,"y":0.083751,"z":-0.413679},{"x":-0.62265,"y":-0.035172,"z":-0.549651},{"x":-0.620004,"y":-0.042372,"z":-0.717819},{"x":-0.622275,"y":-0.034986,"z":-0.717819},{"x":-0.622626,"y":-0.035154,"z":-0.454485},{"x":1.108509,"y":0.046794,"z":-0.387597},{"x":1.10691,"y":0.043662,"z":-0.413679},{"x":-1.114014,"y":0.044475,"z":-0.387597},{"x":-1.113828,"y":0.040962,"z":-0.413679},{"x":-1.109559,"y":0.04518,"z":-0.387597},{"x":1.117173,"y":0.044475,"z":-0.387597},{"x":1.112718,"y":0.04518,"z":-0.387597},{"x":1.111809,"y":0.041781,"z":-0.413679},{"x":1.116987,"y":0.040962,"z":-0.413679},{"x":1.139604,"y":0.06264,"z":-0.387597},{"x":1.143078,"y":0.062088,"z":-0.413679},{"x":1.143354,"y":0.067326,"z":-0.413679},{"x":1.139841,"y":0.067143,"z":-0.387597},{"x":-1.135977,"y":0.071595,"z":-0.387597},{"x":-1.130532,"y":0.070137,"z":-0.356877},{"x":-1.130265,"y":0.046827,"z":-0.865953},{"x":-1.134327,"y":0.050889,"z":-0.865953},{"x":-1.134327,"y":0.050889,"z":-0.945306},{"x":-1.130265,"y":0.046827,"z":-0.945306},{"x":-0.63522,"y":-0.026196,"z":-0.218387},{"x":-0.64302,"y":-0.027978,"z":-0.218387},{"x":-0.642264,"y":-0.029217,"z":-0.206641},{"x":-0.635172,"y":-0.027597,"z":-0.206641},{"x":1.123449,"y":0.072372,"z":-0.326175},{"x":1.124658,"y":0.071163,"z":-0.326175},{"x":1.130682,"y":0.076041,"z":-0.356877},{"x":1.128327,"y":0.078396,"z":-0.356877},{"x":1.104105,"y":0.058779,"z":-0.356877},{"x":1.102911,"y":0.06189,"z":-0.356877},{"x":1.097466,"y":0.060432,"z":-0.387597},{"x":1.099083,"y":0.05622,"z":-0.387597},{"x":1.108272,"y":0.053631,"z":-0.356877},{"x":1.105917,"y":0.055986,"z":-0.356877},{"x":1.126029,"y":0.045876,"z":-0.387597},{"x":1.130049,"y":0.047925,"z":-0.387597},{"x":1.126977,"y":0.05265,"z":-0.356877},{"x":1.12401,"y":0.051138,"z":-0.356877},{"x":-1.12029,"y":0.072372,"z":-0.326175},{"x":-1.125168,"y":0.078396,"z":-0.356877},{"x":-1.121499,"y":0.071163,"z":-0.326175},{"x":0.655234,"y":-0.048309,"z":-0.549651},{"x":0.653066,"y":-0.04116,"z":-0.549651},{"x":0.652581,"y":-0.041175,"z":-0.717819},{"x":0.654821,"y":-0.048564,"z":-0.717819},{"x":1.122225,"y":0.041235,"z":-0.413679},{"x":1.127292,"y":0.042594,"z":-0.413679},{"x":1.121676,"y":0.044709,"z":-0.387597},{"x":1.132497,"y":0.073248,"z":-0.356877},{"x":1.133691,"y":0.070137,"z":-0.356877},{"x":1.139136,"y":0.071595,"z":-0.387597},{"x":1.137519,"y":0.075807,"z":-0.387597},{"x":-1.121634,"y":0.090246,"z":-0.413679},{"x":-1.139373,"y":0.072507,"z":-0.413679},{"x":-1.140195,"y":0.067326,"z":-0.413679},{"x":0.680224,"y":-0.034539,"z":-0.218387},{"x":0.68268,"y":-0.042504,"z":-0.218387},{"x":0.68268,"y":-0.042504,"z":-0.329334},{"x":0.680225,"y":-0.034539,"z":-0.329334},{"x":-0.627288,"y":-0.028518,"z":-0.218387},{"x":-0.627288,"y":-0.028521,"z":-0.329334},{"x":-0.635217,"y":-0.026199,"z":-0.329334},{"x":-0.61893,"y":-0.042504,"z":-0.218387},{"x":-0.620628,"y":-0.050286,"z":-0.218387},{"x":-0.620628,"y":-0.050289,"z":-0.329334},{"x":-0.61893,"y":-0.042504,"z":-0.329334},{"x":-1.130394,"y":0.05076,"z":-0.387597},{"x":-1.133232,"y":0.054267,"z":-0.387597},{"x":-1.136181,"y":0.05235,"z":-0.413679},{"x":-1.132881,"y":0.048273,"z":-0.413679},{"x":-1.136445,"y":0.06264,"z":-0.387597},{"x":-1.136682,"y":0.067143,"z":-0.387597},{"x":-1.139919,"y":0.062088,"z":-0.413679},{"x":-1.11627,"y":0.087552,"z":-0.387597},{"x":-1.116456,"y":0.091065,"z":-0.413679},{"x":-1.120725,"y":0.086847,"z":-0.387597},{"x":1.133553,"y":0.05076,"z":-0.387597},{"x":1.13604,"y":0.048273,"z":-0.413679},{"x":1.13934,"y":0.05235,"z":-0.413679},{"x":1.136391,"y":0.054267,"z":-0.387597},{"x":0.653031,"y":-0.041157,"z":-0.454485},{"x":0.655204,"y":-0.048321,"z":-0.454485},{"x":-0.635094,"y":-0.027636,"z":-0.454485},{"x":-0.627957,"y":-0.029748,"z":-0.454485},{"x":-0.627969,"y":-0.029778,"z":-0.549651},{"x":0.680983,"y":-0.050286,"z":-0.218387},{"x":0.680983,"y":-0.050289,"z":-0.329334},{"x":1.138437,"y":0.058284,"z":-0.387597},{"x":1.141722,"y":0.057024,"z":-0.413679},{"x":0.667623,"y":-0.055779,"z":-0.549651},{"x":0.674605,"y":-0.05415,"z":-0.549651},{"x":0.67462,"y":-0.054177,"z":-0.454488},{"x":0.667622,"y":-0.055809,"z":-0.454488},{"x":0.655219,"y":-0.048312,"z":-0.751587},{"x":0.655221,"y":-0.048321,"z":-0.838674},{"x":1.128093,"y":0.085233,"z":-0.387597},{"x":1.131876,"y":0.082776,"z":-0.387597},{"x":1.134087,"y":0.085509,"z":-0.413679},{"x":-1.135278,"y":0.058284,"z":-0.387597},{"x":-1.138563,"y":0.057024,"z":-0.413679},{"x":-1.090365,"y":0.069939,"z":-0.413679},{"x":-1.093839,"y":0.069387,"z":-0.387597},{"x":-1.093602,"y":0.064884,"z":-0.387597},{"x":-1.100541,"y":0.0885,"z":-0.449202},{"x":-1.10148,"y":0.087054,"z":-0.413679},{"x":1.095948,"y":0.054624,"z":-0.413679},{"x":1.135062,"y":0.079587,"z":-0.387597},{"x":-0.646377,"y":-0.048309,"z":-0.549651},{"x":-0.648546,"y":-0.04116,"z":-0.549651},{"x":-0.649029,"y":-0.041175,"z":-0.717819},{"x":-0.646788,"y":-0.048564,"z":-0.717819},{"x":0.666517,"y":-0.027636,"z":-0.454485},{"x":0.673654,"y":-0.029748,"z":-0.454485},{"x":0.673642,"y":-0.029778,"z":-0.549651},{"x":-0.641103,"y":-0.053727,"z":-0.838674},{"x":-0.633984,"y":-0.0558,"z":-0.838674},{"x":-0.633987,"y":-0.055794,"z":-0.751587},{"x":-0.641103,"y":-0.053721,"z":-0.751587},{"x":-0.646392,"y":-0.048312,"z":-0.751587},{"x":-0.646389,"y":-0.048321,"z":-0.838674},{"x":1.127907,"y":0.040983,"z":-1.007514},{"x":1.12791,"y":0.040983,"z":-0.449202},{"x":-0.633987,"y":-0.055779,"z":-0.549651},{"x":-0.627006,"y":-0.05415,"z":-0.549651},{"x":-0.626991,"y":-0.054177,"z":-0.454488},{"x":-0.63399,"y":-0.055809,"z":-0.454488},{"x":-1.111767,"y":0.087318,"z":-0.387597},{"x":-1.111218,"y":0.090792,"z":-0.413679},{"x":-1.095924,"y":0.05622,"z":-0.387597},{"x":-1.099404,"y":0.068505,"z":-0.356877},{"x":-1.100268,"y":0.071724,"z":-0.356877},{"x":-1.107504,"y":0.068946,"z":-0.326175},{"x":-1.10706,"y":0.067293,"z":-0.326175},{"x":1.122756,"y":0.059151,"z":-0.326175},{"x":1.121232,"y":0.058374,"z":-0.326175},{"x":1.111941,"y":0.060864,"z":-0.326175},{"x":1.111011,"y":0.062298,"z":-0.326175},{"x":-1.100946,"y":0.058779,"z":-0.356877},{"x":-1.094307,"y":0.060432,"z":-0.387597},{"x":-1.099752,"y":0.06189,"z":-0.356877},{"x":-1.095006,"y":0.073743,"z":-0.387597},{"x":-1.10178,"y":0.074691,"z":-0.356877},{"x":-1.109433,"y":0.080889,"z":-0.356877},{"x":-1.107411,"y":0.086151,"z":-0.387597},{"x":-1.112649,"y":0.08175,"z":-0.356877},{"x":-1.118517,"y":0.044709,"z":-0.387597},{"x":-1.117635,"y":0.050277,"z":-0.356877},{"x":-1.120851,"y":0.051138,"z":-0.356877},{"x":-1.122873,"y":0.045876,"z":-0.387597},{"x":1.125162,"y":0.061557,"z":-0.326175},{"x":1.131663,"y":0.057336,"z":-0.356877},{"x":1.133175,"y":0.060303,"z":-0.356877},{"x":1.125939,"y":0.063081,"z":-0.326175},{"x":-1.108281,"y":0.07047,"z":-0.326175},{"x":1.11873,"y":0.074184,"z":-0.326175},{"x":1.120419,"y":0.073917,"z":-0.326175},{"x":1.122423,"y":0.081405,"z":-0.356877},{"x":1.119135,"y":0.081924,"z":-0.356877},{"x":1.104636,"y":0.087054,"z":-0.413679},{"x":1.103697,"y":0.0885,"z":-0.449202},{"x":0.681608,"y":-0.042372,"z":-0.717819},{"x":0.679334,"y":-0.034986,"z":-0.717819},{"x":1.140654,"y":0.077403,"z":-0.413679},{"x":1.142532,"y":0.072507,"z":-0.413679},{"x":-0.648579,"y":-0.041157,"z":-0.454485},{"x":-0.646407,"y":-0.048321,"z":-0.454485},{"x":-1.091721,"y":0.075003,"z":-0.413679},{"x":1.114926,"y":0.087318,"z":-0.387597},{"x":1.119429,"y":0.087552,"z":-0.387597},{"x":1.119612,"y":0.091065,"z":-0.413679},{"x":1.114377,"y":0.090792,"z":-0.413679},{"x":-1.119066,"y":0.041235,"z":-0.413679},{"x":-0.641112,"y":-0.053733,"z":-0.454488},{"x":-0.641094,"y":-0.053706,"z":-0.549651},{"x":1.131963,"y":0.044973,"z":-0.413679},{"x":1.093521,"y":0.069939,"z":-0.413679},{"x":1.09488,"y":0.075003,"z":-0.413679},{"x":1.112514,"y":0.071799,"z":-0.326175},{"x":1.113843,"y":0.072876,"z":-0.326175},{"x":-1.110687,"y":0.072876,"z":-0.326175},{"x":-1.109358,"y":0.071799,"z":-0.326175},{"x":1.129566,"y":0.054747,"z":-0.356877},{"x":1.124085,"y":0.060228,"z":-0.326175},{"x":1.137798,"y":0.081801,"z":-0.413679},{"x":-1.137495,"y":0.077403,"z":-0.413679},{"x":-1.106151,"y":0.089433,"z":-0.413679},{"x":1.123884,"y":0.086847,"z":-0.387597},{"x":1.10931,"y":0.089433,"z":-0.413679},{"x":1.098165,"y":0.073743,"z":-0.387597},{"x":0.654513,"y":-0.034161,"z":-0.454485},{"x":0.654547,"y":-0.034182,"z":-0.549651},{"x":-0.633993,"y":-0.05628,"z":-0.717819},{"x":-0.626775,"y":-0.054594,"z":-0.717819},{"x":-1.124133,"y":0.042594,"z":-0.413679},{"x":-1.128804,"y":0.044973,"z":-0.413679},{"x":-1.122003,"y":0.061557,"z":-0.326175},{"x":-1.12278,"y":0.063081,"z":-0.326175},{"x":-1.130016,"y":0.060303,"z":-0.356877},{"x":-1.128504,"y":0.057336,"z":-0.356877},{"x":-1.120926,"y":0.060228,"z":-0.326175},{"x":-1.126407,"y":0.054747,"z":-0.356877},{"x":1.094067,"y":0.05952,"z":-0.413679},{"x":-1.12689,"y":0.047925,"z":-0.387597},{"x":1.111068,"y":0.051816,"z":-0.356877},{"x":1.125534,"y":0.080211,"z":-0.356877},{"x":-0.647775,"y":-0.049176,"z":-0.218387},{"x":-0.647775,"y":-0.049179,"z":-0.329334},{"x":1.134213,"y":0.066846,"z":-0.356877},{"x":-1.131054,"y":0.066846,"z":-0.356877},{"x":-1.107909,"y":0.051816,"z":-0.356877},{"x":-1.10535,"y":0.046794,"z":-0.387597},{"x":-1.105116,"y":0.053631,"z":-0.356877},{"x":-1.122375,"y":0.080211,"z":-0.356877},{"x":-1.124934,"y":0.085233,"z":-0.387597},{"x":-1.128717,"y":0.082776,"z":-0.387597},{"x":-0.622638,"y":-0.03516,"z":-0.751587},{"x":0.667617,"y":-0.05628,"z":-0.717819},{"x":0.674835,"y":-0.054594,"z":-0.717819},{"x":1.11057,"y":0.086151,"z":-0.387597},{"x":1.096761,"y":0.064884,"z":-0.387597},{"x":1.093248,"y":0.064701,"z":-0.413679},{"x":0.660498,"y":-0.053733,"z":-0.454488},{"x":0.660517,"y":-0.053706,"z":-0.549651},{"x":-0.648582,"y":-0.033429,"z":-0.218387},{"x":-0.64302,"y":-0.027978,"z":-0.329334},{"x":-0.648582,"y":-0.033432,"z":-0.329334},{"x":-1.114308,"y":0.050103,"z":-0.356877},{"x":1.115808,"y":0.08175,"z":-0.356877},{"x":1.134039,"y":0.063522,"z":-0.356877},{"x":0.658592,"y":-0.027978,"z":-0.329334},{"x":-1.115976,"y":0.081924,"z":-0.356877},{"x":-1.102758,"y":0.055986,"z":-0.356877},{"x":-1.114713,"y":0.057843,"z":-0.326175},{"x":-1.116423,"y":0.057933,"z":-0.326175},{"x":1.11702,"y":0.074094,"z":-0.326175},{"x":-1.123821,"y":0.05265,"z":-0.356877},{"x":-1.119597,"y":0.059151,"z":-0.326175},{"x":-0.620334,"y":-0.042444,"z":-0.206642},{"x":-0.622563,"y":-0.035199,"z":-0.206642},{"x":-0.624726,"y":-0.036408,"z":-0.194897},{"x":-0.622905,"y":-0.042333,"z":-0.194897},{"x":-1.115571,"y":0.074184,"z":-0.326175},{"x":-1.119267,"y":0.081405,"z":-0.356877},{"x":-1.11726,"y":0.073917,"z":-0.326175},{"x":0.659506,"y":-0.029241,"z":-0.454485},{"x":-0.621387,"y":-0.034539,"z":-0.218387},{"x":-0.621384,"y":-0.034539,"z":-0.329334},{"x":-0.650187,"y":-0.041205,"z":-0.218387},{"x":-0.650184,"y":-0.041208,"z":-0.329334},{"x":-0.622635,"y":-0.035166,"z":-0.838671},{"x":-1.09923,"y":0.065178,"z":-0.356877},{"x":1.102389,"y":0.065178,"z":-0.356877},{"x":1.102563,"y":0.068505,"z":-0.356877},{"x":1.096998,"y":0.069387,"z":-0.387597},{"x":-1.13088,"y":0.063522,"z":-0.356877},{"x":-1.123044,"y":0.06813,"z":-0.326175},{"x":-1.123311,"y":0.066441,"z":-0.326175},{"x":-1.113861,"y":0.074094,"z":-0.326175},{"x":-1.123221,"y":0.064734,"z":-0.326175},{"x":1.12638,"y":0.064734,"z":-0.326175},{"x":1.12647,"y":0.066441,"z":-0.326175},{"x":1.120794,"y":0.050277,"z":-0.356877},{"x":0.681277,"y":-0.042444,"z":-0.206642},{"x":0.679047,"y":-0.035199,"z":-0.206642},{"x":0.676884,"y":-0.036408,"z":-0.194897},{"x":0.678706,"y":-0.042333,"z":-0.194897},{"x":-0.648807,"y":-0.041271,"z":-0.206642},{"x":-0.646611,"y":-0.048516,"z":-0.206642},{"x":-0.644466,"y":-0.047313,"z":-0.194897},{"x":-0.646266,"y":-0.041382,"z":-0.194897},{"x":0.674631,"y":-0.054432,"z":-0.206642},{"x":0.667554,"y":-0.056088,"z":-0.206642},{"x":1.117467,"y":0.050103,"z":-0.356877},{"x":-0.626979,"y":-0.054432,"z":-0.206642},{"x":-0.634056,"y":-0.056088,"z":-0.206642},{"x":-0.642105,"y":-0.029241,"z":-0.454485},{"x":1.112589,"y":0.080889,"z":-0.356877},{"x":1.103424,"y":0.071724,"z":-0.356877},{"x":-1.111017,"y":0.050622,"z":-0.356877},{"x":-1.113024,"y":0.05811,"z":-0.326175},{"x":1.110129,"y":0.065586,"z":-0.326175},{"x":1.110219,"y":0.067293,"z":-0.326175},{"x":1.119579,"y":0.057933,"z":-0.326175},{"x":1.117872,"y":0.057843,"z":-0.326175},{"x":-1.100541,"y":0.088497,"z":-1.007514},{"x":1.103697,"y":0.088497,"z":-1.007514},{"x":0.674616,"y":-0.054168,"z":-0.838674},{"x":0.674614,"y":-0.054165,"z":-0.751587},{"x":-0.626994,"y":-0.054168,"z":-0.838674},{"x":-0.626997,"y":-0.054165,"z":-0.751587},{"x":1.116183,"y":0.05811,"z":-0.326175},{"x":1.114176,"y":0.050622,"z":-0.356877},{"x":1.126203,"y":0.06813,"z":-0.326175},{"x":1.114587,"y":0.058725,"z":-0.326175},{"x":1.113153,"y":0.059655,"z":-0.326175},{"x":1.104939,"y":0.074691,"z":-0.356877},{"x":1.11144,"y":0.07047,"z":-0.326175},{"x":-1.118073,"y":0.058374,"z":-0.326175},{"x":1.092405,"y":0.059073,"z":-0.449202},{"x":1.092402,"y":0.059073,"z":-1.007514},{"x":-1.122432,"y":0.069729,"z":-0.326175},{"x":-0.647097,"y":-0.034161,"z":-0.454485},{"x":-0.647064,"y":-0.034182,"z":-0.549651},{"x":0.673843,"y":-0.029409,"z":-0.717819},{"x":1.125591,"y":0.069729,"z":-0.326175},{"x":-0.627768,"y":-0.029409,"z":-0.717819},{"x":1.110663,"y":0.068946,"z":-0.326175},{"x":0.655001,"y":-0.048516,"z":-0.206642},{"x":0.652805,"y":-0.041271,"z":-0.206642},{"x":0.657146,"y":-0.047313,"z":-0.194897},{"x":0.655344,"y":-0.041382,"z":-0.194897},{"x":-1.109994,"y":0.059655,"z":-0.326175},{"x":-1.108785,"y":0.060864,"z":-0.326175},{"x":0.680019,"y":-0.04959,"z":-0.717819},{"x":-1.10724,"y":0.063897,"z":-0.326175},{"x":-1.106973,"y":0.065586,"z":-0.326175},{"x":1.122015,"y":0.073302,"z":-0.326175},{"x":-1.118856,"y":0.073302,"z":-0.326175},{"x":-0.621591,"y":-0.04959,"z":-0.717819},{"x":-1.112211,"y":0.07365,"z":-0.326175},{"x":0.660272,"y":-0.05415,"z":-0.717819},{"x":1.110399,"y":0.063897,"z":-0.326175},{"x":-0.647511,"y":-0.03396,"z":-0.717819},{"x":0.6541,"y":-0.03396,"z":-0.717819},{"x":1.115367,"y":0.07365,"z":-0.326175},{"x":-1.107852,"y":0.062298,"z":-0.326175},{"x":-0.641337,"y":-0.05415,"z":-0.717819},{"x":-1.111428,"y":0.058725,"z":-0.326175},{"x":0.74163,"y":0.031755,"z":-0.541782},{"x":0.741633,"y":0.031758,"z":-0.549702},{"x":-0.55998,"y":0.031755,"z":-0.541782},{"x":-0.559977,"y":0.031758,"z":-0.549702},{"x":-0.701064,"y":0.024078,"z":-0.838737},{"x":-0.701064,"y":0.024078,"z":-0.831273},{"x":0.600546,"y":0.024078,"z":-0.831273},{"x":0.600546,"y":0.024078,"z":-0.838737},{"x":-0.621897,"y":-0.049521,"z":-0.206642},{"x":0.679712,"y":-0.049521,"z":-0.206642},{"x":0.673656,"y":-0.029733,"z":-0.206642},{"x":-0.627954,"y":-0.029733,"z":-0.206642},{"x":-0.647313,"y":-0.034194,"z":-0.206642},{"x":0.654298,"y":-0.034194,"z":-0.206642},{"x":-0.629163,"y":-0.031938,"z":-0.194897},{"x":-0.635082,"y":-0.030165,"z":-0.194897},{"x":0.672446,"y":-0.031938,"z":-0.194897},{"x":0.66653,"y":-0.030165,"z":-0.194897},{"x":0.66035,"y":-0.053991,"z":-0.206642},{"x":0.677401,"y":-0.048129,"z":-0.194897},{"x":-0.641259,"y":-0.053991,"z":-0.206642},{"x":-0.62421,"y":-0.048129,"z":-0.194897},{"x":-0.64005,"y":-0.051786,"z":-0.194897},{"x":0.66156,"y":-0.051786,"z":-0.194897},{"x":0.667468,"y":-0.053538,"z":-0.194897},{"x":-0.634143,"y":-0.053538,"z":-0.194897},{"x":-0.645003,"y":-0.035589,"z":-0.194897},{"x":0.656607,"y":-0.035589,"z":-0.194897},{"x":-1.115142,"y":0.066012,"z":-1.007514},{"x":1.118301,"y":0.066012,"z":-1.007514},{"x":-0.561924,"y":-0.112656,"z":-0.548346},{"x":-0.563019,"y":-0.113745,"z":-0.533016},{"x":0.739687,"y":-0.112656,"z":-0.548346},{"x":0.73859,"y":-0.113745,"z":-0.533016},{"x":-0.699951,"y":0.025407,"z":-0.53301},{"x":-0.700977,"y":0.02424,"z":-0.548343},{"x":0.60166,"y":0.025407,"z":-0.53301},{"x":0.600634,"y":0.02424,"z":-0.548343},{"x":-0.561792,"y":-0.112629,"z":-0.824856},{"x":-0.563031,"y":-0.113751,"z":-0.838773},{"x":0.73982,"y":-0.112629,"z":-0.824856},{"x":0.738581,"y":-0.113751,"z":-0.838773},{"x":0.663224,"y":-0.048753,"z":-0.183152},{"x":-0.638388,"y":-0.048753,"z":-0.183152},{"x":0.595434,"y":-0.114483,"z":-0.541773},{"x":0.594192,"y":-0.113244,"z":-0.549693},{"x":-0.706176,"y":-0.114483,"z":-0.541773},{"x":-0.707418,"y":-0.113244,"z":-0.549693},{"x":0.740094,"y":0.030381,"z":-0.831504},{"x":0.738943,"y":0.031527,"z":-0.838758},{"x":-0.561516,"y":0.030381,"z":-0.831504},{"x":-0.562668,"y":0.031527,"z":-0.838758},{"x":0.596349,"y":-0.111177,"z":-0.831504},{"x":0.597489,"y":-0.112335,"z":-0.838755},{"x":-0.705261,"y":-0.111177,"z":-0.831504},{"x":-0.704121,"y":-0.112335,"z":-0.838755},{"x":1.118301,"y":0.066012,"z":-0.305121},{"x":-1.115142,"y":0.066012,"z":-0.305121},{"x":-0.023895,"y":-0.192499,"z":-0.184302},{"x":0.000402,"y":-0.194287,"z":-0.184302},{"x":0.000402,"y":-0.192793,"z":-0.135441},{"x":-0.023766,"y":-0.191014,"z":-0.135441},{"x":0.024699,"y":-0.192499,"z":-0.184302},{"x":0.02457,"y":-0.191014,"z":-0.135441},{"x":-0.005454,"y":-0.128662,"z":-0.775617},{"x":0.000396,"y":-0.129187,"z":-0.775617},{"x":0.000399,"y":-0.139618,"z":-0.758646},{"x":-0.007323,"y":-0.138925,"z":-0.758646},{"x":0.000396,"y":-0.098326,"z":-0.775617},{"x":-0.005454,"y":-0.098851,"z":-0.775617},{"x":-0.007323,"y":-0.099628,"z":-0.758649},{"x":0.000399,"y":-0.098935,"z":-0.758649},{"x":0.081192,"y":-0.166996,"z":-0.234129},{"x":0.090513,"y":-0.154117,"z":-0.234129},{"x":0.09108,"y":-0.154618,"z":-0.184302},{"x":0.081702,"y":-0.167575,"z":-0.184302},{"x":0.006246,"y":-0.128662,"z":-0.775617},{"x":0.008118,"y":-0.138925,"z":-0.758646},{"x":0.006246,"y":-0.098851,"z":-0.775617},{"x":0.008118,"y":-0.099628,"z":-0.758649},{"x":0.000399,"y":-0.096889,"z":-0.737112},{"x":0.009927,"y":-0.097744,"z":-0.737112},{"x":0.029208,"y":-0.12454,"z":-0.758646},{"x":0.030225,"y":-0.119275,"z":-0.758649},{"x":0.037215,"y":-0.121948,"z":-0.737112},{"x":0.035961,"y":-0.128431,"z":-0.737112},{"x":-0.009132,"y":-0.146152,"z":-0.737112},{"x":0.000399,"y":-0.147004,"z":-0.737109},{"x":0.000399,"y":-0.157708,"z":-0.711216},{"x":-0.010872,"y":-0.156703,"z":-0.711216},{"x":0.052398,"y":-0.11401,"z":0.07851},{"x":0.03717,"y":-0.107902,"z":0.078509},{"x":0.033588,"y":-0.110587,"z":0.112337},{"x":0.047331,"y":-0.116098,"z":0.112337},{"x":-0.036351,"y":-0.107902,"z":0.078508},{"x":-0.051579,"y":-0.11401,"z":0.078508},{"x":-0.046509,"y":-0.116098,"z":0.112336},{"x":-0.032766,"y":-0.110587,"z":0.112336},{"x":0.009927,"y":-0.146152,"z":-0.737112},{"x":0.01167,"y":-0.156703,"z":-0.711216},{"x":-0.073116,"y":-0.140263,"z":0.078508},{"x":-0.070611,"y":-0.150382,"z":0.078508},{"x":-0.063687,"y":-0.14902,"z":0.112337},{"x":-0.065946,"y":-0.1399,"z":0.112336},{"x":-0.015585,"y":-0.124669,"z":-0.775617},{"x":-0.010905,"y":-0.12712,"z":-0.775617},{"x":-0.014517,"y":-0.136894,"z":-0.758646},{"x":-0.020694,"y":-0.13366,"z":-0.758646},{"x":0.071424,"y":-0.150382,"z":0.078509},{"x":0.073929,"y":-0.140263,"z":0.078509},{"x":0.066762,"y":-0.1399,"z":0.112337},{"x":0.064503,"y":-0.14902,"z":0.112338},{"x":-0.089709,"y":-0.154117,"z":-0.234129},{"x":-0.080391,"y":-0.166996,"z":-0.234129},{"x":-0.080898,"y":-0.167575,"z":-0.184303},{"x":-0.090276,"y":-0.154618,"z":-0.184303},{"x":-0.018012,"y":-0.143647,"z":-0.737112},{"x":0.015312,"y":-0.136894,"z":-0.758646},{"x":0.018807,"y":-0.143647,"z":-0.737112},{"x":-0.091326,"y":-0.138961,"z":-0.088015},{"x":-0.0882,"y":-0.151918,"z":-0.088015},{"x":-0.085461,"y":-0.151918,"z":-0.042479},{"x":-0.088488,"y":-0.139384,"z":-0.042479},{"x":0.089004,"y":-0.151918,"z":-0.088014},{"x":0.09213,"y":-0.138961,"z":-0.088014},{"x":0.089295,"y":-0.139384,"z":-0.042479},{"x":0.086268,"y":-0.151918,"z":-0.042479},{"x":-0.009132,"y":-0.097741,"z":-0.737112},{"x":-0.010872,"y":-0.099649,"z":-0.711216},{"x":0.000399,"y":-0.098644,"z":-0.711216},{"x":0.029208,"y":-0.11401,"z":-0.758649},{"x":0.035961,"y":-0.115462,"z":-0.737112},{"x":-0.014517,"y":-0.101659,"z":-0.758649},{"x":-0.018012,"y":-0.100246,"z":-0.737112},{"x":-0.028413,"y":-0.11401,"z":-0.758649},{"x":-0.02943,"y":-0.119275,"z":-0.758649},{"x":-0.03642,"y":-0.121948,"z":-0.737112},{"x":-0.035166,"y":-0.115462,"z":-0.737112},{"x":-0.028413,"y":-0.12454,"z":-0.758649},{"x":-0.035166,"y":-0.128431,"z":-0.737112},{"x":0.01167,"y":-0.099652,"z":-0.711216},{"x":-0.080466,"y":-0.166057,"z":-0.135441},{"x":-0.089796,"y":-0.153157,"z":-0.135441},{"x":0.0906,"y":-0.153157,"z":-0.135441},{"x":0.08127,"y":-0.166057,"z":-0.135441},{"x":0.013338,"y":-0.164425,"z":-0.68121},{"x":0.000399,"y":-0.165574,"z":-0.68121},{"x":-0.012543,"y":-0.164425,"z":-0.68121},{"x":-0.012543,"y":-0.09928,"z":-0.68121},{"x":0.000399,"y":-0.098131,"z":-0.68121},{"x":0.019437,"y":-0.103948,"z":0.078508},{"x":0.000408,"y":-0.102574,"z":0.078508},{"x":0.000411,"y":-0.105796,"z":0.112336},{"x":0.017586,"y":-0.107029,"z":0.112337},{"x":-0.018621,"y":-0.103948,"z":0.078508},{"x":-0.016764,"y":-0.107029,"z":0.112336},{"x":0.042846,"y":-0.184756,"z":0.000729},{"x":0.060423,"y":-0.176182,"z":0.000729},{"x":0.056784,"y":-0.172507,"z":0.041188},{"x":0.040272,"y":-0.180571,"z":0.041188},{"x":0.011697,"y":-0.12712,"z":-0.775617},{"x":-0.059613,"y":-0.176182,"z":0.000728},{"x":-0.042036,"y":-0.184756,"z":0.000729},{"x":-0.039459,"y":-0.180571,"z":0.041188},{"x":-0.055971,"y":-0.172507,"z":0.041187},{"x":-0.0882,"y":-0.126838,"z":-0.088015},{"x":-0.085461,"y":-0.127672,"z":-0.042479},{"x":0.089004,"y":-0.126838,"z":-0.088014},{"x":0.086268,"y":-0.127672,"z":-0.042479},{"x":0.015312,"y":-0.101659,"z":-0.758649},{"x":0.018807,"y":-0.100246,"z":-0.737112},{"x":0.043944,"y":-0.128176,"z":-0.711216},{"x":0.042462,"y":-0.13582,"z":-0.711216},{"x":0.079842,"y":-0.115906,"z":-0.088014},{"x":0.077388,"y":-0.117064,"z":-0.042478},{"x":-0.079035,"y":-0.115906,"z":-0.088015},{"x":-0.076578,"y":-0.117064,"z":-0.042479},{"x":-0.041667,"y":-0.13582,"z":-0.711216},{"x":-0.043149,"y":-0.128176,"z":-0.711216},{"x":-0.025434,"y":-0.129448,"z":-0.758649},{"x":-0.025638,"y":-0.139666,"z":-0.737112},{"x":-0.031488,"y":-0.134476,"z":-0.737112},{"x":0.000408,"y":-0.178552,"z":0.112337},{"x":0.01758,"y":-0.177106,"z":0.112338},{"x":0.01551,"y":-0.173599,"z":0.142344},{"x":0.000408,"y":-0.17488,"z":0.142344},{"x":0.021489,"y":-0.13366,"z":-0.758646},{"x":0.026229,"y":-0.129448,"z":-0.758649},{"x":0.032283,"y":-0.134476,"z":-0.737112},{"x":0.026433,"y":-0.139666,"z":-0.737112},{"x":0.013338,"y":-0.09928,"z":-0.68121},{"x":-0.016767,"y":-0.177106,"z":0.112337},{"x":-0.014694,"y":-0.173599,"z":0.142344},{"x":-0.010905,"y":-0.100393,"z":-0.775617},{"x":0.011697,"y":-0.100393,"z":-0.775617},{"x":0.000399,"y":-0.173221,"z":-0.647382},{"x":-0.014139,"y":-0.17194,"z":-0.647382},{"x":-0.014139,"y":-0.099328,"z":-0.647385},{"x":0.000399,"y":-0.098047,"z":-0.647385},{"x":0.014937,"y":-0.17194,"z":-0.647382},{"x":-0.046536,"y":-0.187216,"z":-0.184303},{"x":-0.046287,"y":-0.185743,"z":-0.135441},{"x":0.04734,"y":-0.187216,"z":-0.184302},{"x":0.047091,"y":-0.185743,"z":-0.135441},{"x":0.024144,"y":-0.189424,"z":-0.088014},{"x":0.000402,"y":-0.191188,"z":-0.088015},{"x":0.014937,"y":-0.099328,"z":-0.647382},{"x":-0.02334,"y":-0.189424,"z":-0.088015},{"x":0.047328,"y":-0.166333,"z":0.112338},{"x":0.057873,"y":-0.158071,"z":0.112338},{"x":0.050943,"y":-0.15679,"z":0.142344},{"x":0.04167,"y":-0.164065,"z":0.142344},{"x":-0.057057,"y":-0.158071,"z":0.112337},{"x":-0.046512,"y":-0.166333,"z":0.112337},{"x":-0.040851,"y":-0.164065,"z":0.142343},{"x":-0.050124,"y":-0.15679,"z":0.142343},{"x":0.042462,"y":-0.120532,"z":-0.711216},{"x":-0.041667,"y":-0.120532,"z":-0.711216},{"x":0.022374,"y":-0.096664,"z":0.000727},{"x":0.000405,"y":-0.095014,"z":0.000727},{"x":0.000408,"y":-0.097072,"z":0.041186},{"x":0.021045,"y":-0.098605,"z":0.041186},{"x":-0.021561,"y":-0.096664,"z":0.000727},{"x":-0.020229,"y":-0.098605,"z":0.041185},{"x":0.000405,"y":-0.191956,"z":0.000729},{"x":0.022374,"y":-0.190129,"z":0.000729},{"x":0.021042,"y":-0.185659,"z":0.041188},{"x":0.000405,"y":-0.187393,"z":0.041188},{"x":0.000399,"y":-0.180469,"z":-0.610059},{"x":-0.01566,"y":-0.179068,"z":-0.610059},{"x":0.016458,"y":-0.179068,"z":-0.610059},{"x":-0.021564,"y":-0.190129,"z":0.000729},{"x":-0.020229,"y":-0.185659,"z":0.041188},{"x":0.000399,"y":-0.098287,"z":-0.610062},{"x":0.016458,"y":-0.099688,"z":-0.610062},{"x":-0.01566,"y":-0.099688,"z":-0.610062},{"x":-0.065565,"y":-0.178054,"z":-0.234129},{"x":-0.065979,"y":-0.178723,"z":-0.184303},{"x":-0.021375,"y":-0.153751,"z":-0.711216},{"x":0.066366,"y":-0.178054,"z":-0.234129},{"x":0.066783,"y":-0.178723,"z":-0.184302},{"x":0.022173,"y":-0.153751,"z":-0.711216},{"x":0.021489,"y":-0.10489,"z":-0.758649},{"x":0.026433,"y":-0.104227,"z":-0.737112},{"x":-0.020694,"y":-0.10489,"z":-0.758649},{"x":-0.025638,"y":-0.104227,"z":-0.737112},{"x":0.026229,"y":-0.109105,"z":-0.758649},{"x":0.032283,"y":-0.109417,"z":-0.737112},{"x":-0.025434,"y":-0.109105,"z":-0.758649},{"x":-0.031488,"y":-0.109417,"z":-0.737112},{"x":0.022173,"y":-0.102601,"z":-0.711216},{"x":-0.046242,"y":-0.186517,"z":-0.234129},{"x":-0.021375,"y":-0.102601,"z":-0.711216},{"x":0.047046,"y":-0.186517,"z":-0.234128},{"x":0.000414,"y":-0.11059,"z":0.142343},{"x":0.015516,"y":-0.111658,"z":0.142343},{"x":-0.014691,"y":-0.111658,"z":0.142343},{"x":0.01638,"y":-0.102847,"z":-0.775617},{"x":0.000402,"y":-0.193624,"z":-0.234129},{"x":0.024546,"y":-0.191821,"z":-0.234128},{"x":0.019434,"y":-0.181534,"z":0.07851},{"x":0.000405,"y":-0.183112,"z":0.07851},{"x":-0.018624,"y":-0.181534,"z":0.078509},{"x":0.000402,"y":-0.091132,"z":-0.135442},{"x":-0.023766,"y":-0.092857,"z":-0.135442},{"x":-0.023337,"y":-0.094294,"z":-0.088015},{"x":0.000402,"y":-0.092626,"z":-0.088015},{"x":0.02457,"y":-0.092857,"z":-0.135442},{"x":0.024144,"y":-0.094294,"z":-0.088015},{"x":-0.070608,"y":-0.130606,"z":0.078508},{"x":-0.063684,"y":-0.131149,"z":0.112336},{"x":0.071424,"y":-0.130606,"z":0.078509},{"x":0.064503,"y":-0.131149,"z":0.112337},{"x":-0.017103,"y":-0.096685,"z":-0.569604},{"x":0.000399,"y":-0.095179,"z":-0.569604},{"x":0.017901,"y":-0.096685,"z":-0.569604},{"x":0.017901,"y":-0.182071,"z":-0.569601},{"x":0.000399,"y":-0.183577,"z":-0.569601},{"x":-0.017103,"y":-0.182071,"z":-0.569601},{"x":-0.023745,"y":-0.191818,"z":-0.234129},{"x":0.000399,"y":-0.186259,"z":-0.526395},{"x":-0.018459,"y":-0.18466,"z":-0.526398},{"x":0.019257,"y":-0.18466,"z":-0.526398},{"x":0.031191,"y":-0.149059,"z":-0.711216},{"x":0.050052,"y":-0.14158,"z":0.168239},{"x":0.04836,"y":-0.134575,"z":0.168239},{"x":0.039396,"y":-0.136549,"z":0.189775},{"x":0.04077,"y":-0.142204,"z":0.189775},{"x":-0.049602,"y":-0.131854,"z":-0.68121},{"x":-0.047898,"y":-0.123124,"z":-0.68121},{"x":0.048696,"y":-0.123124,"z":-0.68121},{"x":0.0504,"y":-0.131854,"z":-0.68121},{"x":0.025398,"y":-0.102649,"z":-0.68121},{"x":-0.047898,"y":-0.140581,"z":-0.68121},{"x":0.048696,"y":-0.140581,"z":-0.68121},{"x":-0.079035,"y":-0.164626,"z":-0.088015},{"x":0.029589,"y":-0.114754,"z":0.142344},{"x":0.041673,"y":-0.119581,"z":0.142344},{"x":-0.040848,"y":-0.119581,"z":0.142343},{"x":-0.028764,"y":-0.114754,"z":0.142343},{"x":-0.030396,"y":-0.149059,"z":-0.711216},{"x":-0.018459,"y":-0.094096,"z":-0.526398},{"x":0.000399,"y":-0.0925,"z":-0.526398},{"x":0.019257,"y":-0.094096,"z":-0.526398},{"x":-0.053859,"y":-0.145363,"z":-0.647382},{"x":-0.055773,"y":-0.135634,"z":-0.647382},{"x":0.056568,"y":-0.135634,"z":-0.647382},{"x":0.054654,"y":-0.145363,"z":-0.647382},{"x":-0.022605,"y":-0.095851,"z":-0.04248},{"x":0.000405,"y":-0.094201,"z":-0.04248},{"x":0.052395,"y":-0.169675,"z":0.078509},{"x":0.064077,"y":-0.160495,"z":0.078509},{"x":-0.063264,"y":-0.160495,"z":0.078508},{"x":-0.051582,"y":-0.169675,"z":0.078509},{"x":0.023412,"y":-0.095851,"z":-0.042479},{"x":0.000402,"y":-0.090022,"z":-0.184303},{"x":-0.023895,"y":-0.091792,"z":-0.184303},{"x":0.024699,"y":-0.091792,"z":-0.184303},{"x":0.020517,"y":-0.091942,"z":-0.480864},{"x":0.000399,"y":-0.090271,"z":-0.480864},{"x":0.000399,"y":-0.088513,"z":-0.433437},{"x":0.02166,"y":-0.090247,"z":-0.433437},{"x":-0.019716,"y":-0.091942,"z":-0.480864},{"x":-0.020859,"y":-0.090247,"z":-0.433437},{"x":0.079842,"y":-0.164626,"z":-0.088014},{"x":0.031191,"y":-0.107293,"z":-0.711216},{"x":0.054654,"y":-0.125905,"z":-0.647382},{"x":-0.053859,"y":-0.125905,"z":-0.647382},{"x":-0.023334,"y":-0.190729,"z":-0.284439},{"x":0.000402,"y":-0.192541,"z":-0.284439},{"x":0.000399,"y":-0.188491,"z":-0.480861},{"x":-0.019716,"y":-0.186817,"z":-0.480861},{"x":0.056772,"y":-0.148807,"z":0.142344},{"x":0.020517,"y":-0.186817,"z":-0.480861},{"x":-0.055953,"y":-0.148807,"z":0.142343},{"x":-0.037314,"y":-0.142942,"z":-0.711216},{"x":-0.024603,"y":-0.102649,"z":-0.68121},{"x":0.000399,"y":-0.190249,"z":-0.433437},{"x":0.02166,"y":-0.188515,"z":-0.433437},{"x":0.022662,"y":-0.189739,"z":-0.384573},{"x":0.000402,"y":-0.191518,"z":-0.384573},{"x":-0.020859,"y":-0.188515,"z":-0.433437},{"x":-0.021861,"y":-0.189739,"z":-0.384573},{"x":-0.030396,"y":-0.107293,"z":-0.711216},{"x":0.000402,"y":-0.086227,"z":-0.28444},{"x":-0.023334,"y":-0.088036,"z":-0.28444},{"x":-0.023745,"y":-0.08962,"z":-0.23413},{"x":0.000402,"y":-0.08782,"z":-0.23413},{"x":0.024135,"y":-0.190729,"z":-0.284439},{"x":0.038112,"y":-0.142942,"z":-0.711216},{"x":0.024546,"y":-0.08962,"z":-0.23413},{"x":0.057876,"y":-0.123097,"z":0.112338},{"x":0.050946,"y":-0.125758,"z":0.142344},{"x":0.000402,"y":-0.192283,"z":-0.334749},{"x":0.023499,"y":-0.19048,"z":-0.334749},{"x":0.000402,"y":-0.087247,"z":-0.384576},{"x":-0.021861,"y":-0.089023,"z":-0.384576},{"x":-0.022695,"y":-0.088285,"z":-0.334752},{"x":0.000402,"y":-0.086482,"z":-0.334749},{"x":-0.024603,"y":-0.161059,"z":-0.68121},{"x":-0.027687,"y":-0.168184,"z":-0.647382},{"x":-0.057054,"y":-0.123097,"z":0.112336},{"x":-0.050121,"y":-0.125758,"z":0.142343},{"x":0.023499,"y":-0.088285,"z":-0.334749},{"x":0.024135,"y":-0.088039,"z":-0.28444},{"x":0.037167,"y":-0.176923,"z":0.07851},{"x":0.033585,"y":-0.172903,"z":0.112338},{"x":-0.036354,"y":-0.176923,"z":0.078509},{"x":-0.032769,"y":-0.172903,"z":0.112337},{"x":0.025398,"y":-0.161059,"z":-0.68121},{"x":0.028485,"y":-0.168184,"z":-0.647382},{"x":-0.047541,"y":-0.134575,"z":0.168238},{"x":-0.049233,"y":-0.14158,"z":0.168238},{"x":-0.039954,"y":-0.142204,"z":0.189774},{"x":-0.038577,"y":-0.136549,"z":0.189774},{"x":-0.022695,"y":-0.19048,"z":-0.334749},{"x":0.022662,"y":-0.089023,"z":-0.384576},{"x":0.06408,"y":-0.121735,"z":0.07851},{"x":0.029583,"y":-0.16987,"z":0.142344},{"x":-0.063264,"y":-0.121735,"z":0.078508},{"x":-0.034959,"y":-0.155698,"z":-0.68121},{"x":-0.037314,"y":-0.11341,"z":-0.711216},{"x":-0.028767,"y":-0.16987,"z":0.142343},{"x":-0.057942,"y":-0.140707,"z":0.142343},{"x":0.058761,"y":-0.140707,"z":0.142343},{"x":0.035754,"y":-0.155698,"z":-0.68121},{"x":0.038112,"y":-0.11341,"z":-0.711216},{"x":-0.059535,"y":-0.150013,"z":-0.610062},{"x":-0.06165,"y":-0.139378,"z":-0.610062},{"x":0.062448,"y":-0.139378,"z":-0.610059},{"x":0.060333,"y":-0.150013,"z":-0.610059},{"x":-0.042903,"y":-0.148714,"z":-0.68121},{"x":-0.059535,"y":-0.128743,"z":-0.610062},{"x":0.060333,"y":-0.128743,"z":-0.610059},{"x":0.000414,"y":-0.114712,"z":0.168239},{"x":-0.012435,"y":-0.115648,"z":0.168239},{"x":-0.010035,"y":-0.121372,"z":0.189775},{"x":0.000411,"y":-0.120634,"z":0.189776},{"x":0.01326,"y":-0.115648,"z":0.168239},{"x":0.01086,"y":-0.121372,"z":0.189776},{"x":-0.027687,"y":-0.103081,"z":-0.647385},{"x":0.028485,"y":-0.103081,"z":-0.647382},{"x":-0.042033,"y":-0.101404,"z":0.000727},{"x":-0.039456,"y":-0.103012,"z":0.041185},{"x":-0.034959,"y":-0.108007,"z":-0.68121},{"x":0.042846,"y":-0.101404,"z":0.000728},{"x":0.040275,"y":-0.103012,"z":0.041187},{"x":-0.042903,"y":-0.114991,"z":-0.68121},{"x":0.035754,"y":-0.108007,"z":-0.68121},{"x":0.043701,"y":-0.148714,"z":-0.68121},{"x":0.065718,"y":-0.127939,"z":-0.569601},{"x":0.068022,"y":-0.139378,"z":-0.569601},{"x":0.065718,"y":-0.150817,"z":-0.569601},{"x":0.043701,"y":-0.114991,"z":-0.68121},{"x":-0.030624,"y":-0.103792,"z":-0.610062},{"x":-0.065628,"y":-0.177235,"z":-0.135441},{"x":0.04836,"y":-0.148831,"z":0.168239},{"x":0.039396,"y":-0.148021,"z":0.189775},{"x":-0.067224,"y":-0.139378,"z":-0.569604},{"x":-0.064917,"y":-0.150817,"z":-0.569601},{"x":-0.069981,"y":-0.151513,"z":-0.526398},{"x":-0.072462,"y":-0.139378,"z":-0.526398},{"x":0.066429,"y":-0.177235,"z":-0.135441},{"x":0.031425,"y":-0.103792,"z":-0.610062},{"x":0.056772,"y":-0.132913,"z":0.142343},{"x":-0.064917,"y":-0.127939,"z":-0.569604},{"x":-0.069981,"y":-0.127246,"z":-0.526398},{"x":-0.045462,"y":-0.184183,"z":-0.088015},{"x":0.046266,"y":-0.184183,"z":-0.088014},{"x":-0.030624,"y":-0.174964,"z":-0.610059},{"x":0.085284,"y":-0.140278,"z":0.000728},{"x":0.082395,"y":-0.128581,"z":0.000729},{"x":0.077421,"y":-0.128335,"z":0.041188},{"x":0.080136,"y":-0.139198,"z":0.041187},{"x":0.031425,"y":-0.174964,"z":-0.610059},{"x":-0.081582,"y":-0.128581,"z":0.000727},{"x":-0.084474,"y":-0.140278,"z":0.000727},{"x":-0.079323,"y":-0.139198,"z":0.041186},{"x":-0.076605,"y":-0.128335,"z":0.041186},{"x":-0.092889,"y":-0.140365,"z":-0.234129},{"x":-0.093477,"y":-0.14095,"z":-0.184303},{"x":0.09369,"y":-0.140365,"z":-0.234129},{"x":0.094278,"y":-0.14095,"z":-0.184302},{"x":0.073914,"y":-0.165127,"z":0.000729},{"x":0.069456,"y":-0.162184,"z":0.041188},{"x":-0.073104,"y":-0.165127,"z":0.000728},{"x":-0.068643,"y":-0.162184,"z":0.041187},{"x":-0.047541,"y":-0.148831,"z":0.168238},{"x":-0.038577,"y":-0.148021,"z":0.189775},{"x":-0.055953,"y":-0.132913,"z":0.142343},{"x":0.000408,"y":-0.171877,"z":0.168239},{"x":0.013257,"y":-0.17074,"z":0.168239},{"x":0.010854,"y":-0.165277,"z":0.189775},{"x":0.000408,"y":-0.166168,"z":0.189775},{"x":-0.012441,"y":-0.17074,"z":0.168239},{"x":-0.010038,"y":-0.165277,"z":0.189775},{"x":0.040116,"y":-0.109054,"z":-0.647382},{"x":0.09378,"y":-0.139795,"z":-0.135441},{"x":-0.092976,"y":-0.139795,"z":-0.135442},{"x":0.073263,"y":-0.139378,"z":-0.526398},{"x":0.070779,"y":-0.151513,"z":-0.526398},{"x":-0.042579,"y":-0.128152,"z":0.168238},{"x":-0.034545,"y":-0.131365,"z":0.189774},{"x":0.034209,"y":-0.101101,"z":-0.569604},{"x":0.034209,"y":-0.177655,"z":-0.569601},{"x":0.070779,"y":-0.127246,"z":-0.526398},{"x":0.040116,"y":-0.162211,"z":-0.647382},{"x":-0.039321,"y":-0.109054,"z":-0.647385},{"x":-0.033411,"y":-0.101101,"z":-0.569604},{"x":-0.033411,"y":-0.177655,"z":-0.569601},{"x":-0.039321,"y":-0.162211,"z":-0.647382},{"x":0.060426,"y":-0.108709,"z":0.000729},{"x":0.056787,"y":-0.10981,"z":0.041188},{"x":-0.05961,"y":-0.108709,"z":0.000727},{"x":-0.055968,"y":-0.10981,"z":0.041186},{"x":0.043401,"y":-0.128152,"z":0.168239},{"x":0.035364,"y":-0.131365,"z":0.189775},{"x":0.049044,"y":-0.154426,"z":-0.647382},{"x":0.049044,"y":-0.116839,"z":-0.647382},{"x":-0.073101,"y":-0.117943,"z":0.000727},{"x":-0.06864,"y":-0.11842,"z":0.041186},{"x":0.073917,"y":-0.117943,"z":0.000729},{"x":0.069459,"y":-0.11842,"z":0.041188},{"x":0.075474,"y":-0.12667,"z":-0.480864},{"x":0.078123,"y":-0.139381,"z":-0.480864},{"x":-0.077322,"y":-0.139381,"z":-0.480864},{"x":-0.074676,"y":-0.12667,"z":-0.480864},{"x":0.082392,"y":-0.15271,"z":0.000729},{"x":0.077421,"y":-0.150685,"z":0.041188},{"x":-0.081582,"y":-0.15271,"z":0.000728},{"x":-0.076608,"y":-0.150685,"z":0.041187},{"x":0.000402,"y":-0.190996,"z":-0.042479},{"x":-0.022605,"y":-0.189205,"z":-0.042479},{"x":0.023409,"y":-0.189205,"z":-0.042479},{"x":0.075474,"y":-0.152089,"z":-0.480864},{"x":-0.074676,"y":-0.152089,"z":-0.480864},{"x":-0.048246,"y":-0.116839,"z":-0.647382},{"x":-0.048246,"y":-0.154426,"z":-0.647382},{"x":0.065265,"y":-0.106495,"z":-0.088014},{"x":0.063261,"y":-0.107869,"z":-0.042479},{"x":-0.064458,"y":-0.106495,"z":-0.088015},{"x":-0.062454,"y":-0.107869,"z":-0.04248},{"x":-0.091305,"y":-0.139384,"z":-0.28444},{"x":-0.088179,"y":-0.153142,"z":-0.284439},{"x":0.088983,"y":-0.153142,"z":-0.284439},{"x":0.092106,"y":-0.139384,"z":-0.284439},{"x":0.079737,"y":-0.126214,"z":-0.433437},{"x":0.082536,"y":-0.139381,"z":-0.433437},{"x":0.079737,"y":-0.152545,"z":-0.433437},{"x":0.036831,"y":-0.098779,"z":-0.526398},{"x":-0.036033,"y":-0.179977,"z":-0.526398},{"x":0.036831,"y":-0.179977,"z":-0.526398},{"x":-0.036033,"y":-0.098779,"z":-0.526398},{"x":0.046266,"y":-0.099088,"z":-0.088015},{"x":0.04485,"y":-0.100588,"z":-0.042479},{"x":-0.043476,"y":-0.168433,"z":-0.610059},{"x":-0.045462,"y":-0.099088,"z":-0.088015},{"x":-0.044043,"y":-0.100588,"z":-0.04248},{"x":0.044274,"y":-0.168433,"z":-0.610059},{"x":0.046254,"y":-0.185419,"z":-0.284439},{"x":-0.043476,"y":-0.110323,"z":-0.610062},{"x":0.044274,"y":-0.110323,"z":-0.610062},{"x":-0.045453,"y":-0.185419,"z":-0.284439},{"x":-0.078936,"y":-0.152545,"z":-0.433437},{"x":-0.081735,"y":-0.139381,"z":-0.433437},{"x":-0.078936,"y":-0.126214,"z":-0.433437},{"x":0.000411,"y":-0.127549,"z":0.206744},{"x":-0.007518,"y":-0.12805,"z":0.206745},{"x":-0.004923,"y":-0.133384,"z":0.218983},{"x":0.000408,"y":-0.133072,"z":0.218983},{"x":0.00834,"y":-0.12805,"z":0.206745},{"x":0.005739,"y":-0.133384,"z":0.218983},{"x":0.039261,"y":-0.09685,"z":-0.480864},{"x":-0.03846,"y":-0.09685,"z":-0.480864},{"x":0.086412,"y":-0.139381,"z":-0.384576},{"x":0.083481,"y":-0.152875,"z":-0.384576},{"x":-0.08268,"y":-0.152875,"z":-0.384576},{"x":-0.085611,"y":-0.139381,"z":-0.384576},{"x":-0.053337,"y":-0.159922,"z":-0.610059},{"x":0.083481,"y":-0.125887,"z":-0.384576},{"x":-0.08268,"y":-0.125887,"z":-0.384576},{"x":-0.03846,"y":-0.181912,"z":-0.480864},{"x":0.039261,"y":-0.181912,"z":-0.480861},{"x":-0.053337,"y":-0.118831,"z":-0.610062},{"x":0.08964,"y":-0.139381,"z":-0.334749},{"x":0.086601,"y":-0.153073,"z":-0.334749},{"x":0.086601,"y":-0.125689,"z":-0.334749},{"x":0.047091,"y":-0.097846,"z":-0.135442},{"x":-0.046287,"y":-0.097846,"z":-0.135442},{"x":0.054135,"y":-0.159922,"z":-0.610059},{"x":0.065262,"y":-0.17572,"z":-0.088014},{"x":-0.064458,"y":-0.17572,"z":-0.088015},{"x":-0.085797,"y":-0.153073,"z":-0.334749},{"x":-0.088839,"y":-0.139381,"z":-0.334749},{"x":0.054135,"y":-0.118831,"z":-0.610062},{"x":-0.085797,"y":-0.125689,"z":-0.334749},{"x":-0.088179,"y":-0.125626,"z":-0.28444},{"x":0.088983,"y":-0.125626,"z":-0.284439},{"x":-0.040668,"y":-0.183433,"z":-0.433437},{"x":0.041469,"y":-0.183433,"z":-0.433437},{"x":-0.04422,"y":-0.093568,"z":-0.334749},{"x":-0.045453,"y":-0.093349,"z":-0.28444},{"x":-0.040668,"y":-0.095329,"z":-0.433437},{"x":0.041469,"y":-0.095329,"z":-0.433437},{"x":0.045021,"y":-0.093568,"z":-0.334749},{"x":0.046254,"y":-0.093349,"z":-0.28444},{"x":0.043407,"y":-0.184531,"z":-0.384573},{"x":0.045021,"y":-0.185194,"z":-0.334749},{"x":-0.042606,"y":-0.184531,"z":-0.384576},{"x":-0.04422,"y":-0.185194,"z":-0.334749},{"x":-0.042606,"y":-0.094231,"z":-0.384576},{"x":0.043407,"y":-0.094231,"z":-0.384576},{"x":0.035514,"y":-0.122641,"z":0.168239},{"x":0.02895,"y":-0.126934,"z":0.189775},{"x":-0.047418,"y":-0.108127,"z":-0.569604},{"x":0.025233,"y":-0.118366,"z":0.168239},{"x":0.020592,"y":-0.123526,"z":0.189776},{"x":0.048216,"y":-0.108127,"z":-0.569604},{"x":-0.046536,"y":-0.096934,"z":-0.184303},{"x":0.04734,"y":-0.096934,"z":-0.184303},{"x":-0.024408,"y":-0.118366,"z":0.168239},{"x":-0.01977,"y":-0.123526,"z":0.189775},{"x":-0.034692,"y":-0.122641,"z":0.168238},{"x":-0.028128,"y":-0.126934,"z":0.189775},{"x":-0.047418,"y":-0.170632,"z":-0.569601},{"x":0.048216,"y":-0.170632,"z":-0.569601},{"x":0.090513,"y":-0.126724,"z":-0.234129},{"x":-0.089709,"y":-0.126724,"z":-0.23413},{"x":0.065247,"y":-0.176971,"z":-0.284439},{"x":-0.064446,"y":-0.176971,"z":-0.284439},{"x":-0.058164,"y":-0.161476,"z":-0.569601},{"x":0.047046,"y":-0.094885,"z":-0.23413},{"x":-0.046242,"y":-0.094885,"z":-0.23413},{"x":-0.058164,"y":-0.11728,"z":-0.569604},{"x":0.058962,"y":-0.161476,"z":-0.569601},{"x":0.079821,"y":-0.165961,"z":-0.284439},{"x":-0.07902,"y":-0.165961,"z":-0.284439},{"x":0.058962,"y":-0.11728,"z":-0.569601},{"x":0.077388,"y":-0.164395,"z":-0.042479},{"x":0.051921,"y":-0.172528,"z":-0.526398},{"x":-0.051123,"y":-0.172528,"z":-0.526398},{"x":-0.051123,"y":-0.106231,"z":-0.526398},{"x":0.051921,"y":-0.106231,"z":-0.526398},{"x":-0.076581,"y":-0.164395,"z":-0.042479},{"x":0.063501,"y":-0.16282,"z":-0.526398},{"x":0.063501,"y":-0.115939,"z":-0.526398},{"x":-0.054558,"y":-0.174106,"z":-0.480864},{"x":0.055359,"y":-0.174106,"z":-0.480861},{"x":0.0906,"y":-0.127087,"z":-0.135441},{"x":-0.089796,"y":-0.127087,"z":-0.135442},{"x":0.09108,"y":-0.12766,"z":-0.184303},{"x":-0.090276,"y":-0.12766,"z":-0.184303},{"x":-0.0627,"y":-0.115939,"z":-0.526398},{"x":-0.0627,"y":-0.16282,"z":-0.526398},{"x":-0.054558,"y":-0.104653,"z":-0.480864},{"x":0.055359,"y":-0.104653,"z":-0.480864},{"x":-0.007521,"y":-0.157849,"z":0.206744},{"x":0.000408,"y":-0.158434,"z":0.206744},{"x":0.000408,"y":-0.152122,"z":0.218982},{"x":-0.004923,"y":-0.151774,"z":0.218983},{"x":0.008337,"y":-0.157849,"z":0.206744},{"x":0.005739,"y":-0.151774,"z":0.218983},{"x":-0.057678,"y":-0.103411,"z":-0.433437},{"x":0.058479,"y":-0.103411,"z":-0.433437},{"x":-0.057678,"y":-0.175351,"z":-0.433437},{"x":0.058479,"y":-0.175351,"z":-0.433437},{"x":-0.060417,"y":-0.102517,"z":-0.384576},{"x":0.061218,"y":-0.176245,"z":-0.384573},{"x":0.061218,"y":-0.102517,"z":-0.384576},{"x":-0.066909,"y":-0.163936,"z":-0.480864},{"x":0.06771,"y":-0.163936,"z":-0.480861},{"x":-0.060417,"y":-0.176248,"z":-0.384576},{"x":-0.066909,"y":-0.114826,"z":-0.480864},{"x":0.06771,"y":-0.114826,"z":-0.480864},{"x":0.063504,"y":-0.176788,"z":-0.334749},{"x":-0.0627,"y":-0.176788,"z":-0.334749},{"x":-0.0627,"y":-0.101977,"z":-0.334749},{"x":0.063504,"y":-0.101977,"z":-0.334749},{"x":0.065247,"y":-0.101794,"z":-0.28444},{"x":-0.064446,"y":-0.101794,"z":-0.28444},{"x":-0.070731,"y":-0.113947,"z":-0.433437},{"x":-0.070731,"y":-0.164815,"z":-0.433437},{"x":0.04485,"y":-0.183916,"z":-0.042479},{"x":0.071532,"y":-0.164815,"z":-0.433437},{"x":0.071532,"y":-0.113947,"z":-0.433437},{"x":-0.044043,"y":-0.183916,"z":-0.042479},{"x":-0.024414,"y":-0.167443,"z":0.168239},{"x":-0.019773,"y":-0.162697,"z":0.189775},{"x":0.02523,"y":-0.167443,"z":0.168239},{"x":0.020589,"y":-0.162697,"z":0.189775},{"x":-0.065625,"y":-0.105607,"z":-0.135442},{"x":0.066432,"y":-0.105607,"z":-0.135441},{"x":-0.074088,"y":-0.113314,"z":-0.384576},{"x":0.043401,"y":-0.155914,"z":0.168239},{"x":0.035364,"y":-0.153652,"z":0.189775},{"x":-0.074088,"y":-0.165448,"z":-0.384576},{"x":0.074889,"y":-0.165448,"z":-0.384576},{"x":-0.042582,"y":-0.155914,"z":0.168239},{"x":-0.034545,"y":-0.153652,"z":0.189775},{"x":0.074886,"y":-0.113314,"z":-0.384576},{"x":-0.076884,"y":-0.165832,"z":-0.334749},{"x":0.077685,"y":-0.112933,"z":-0.334749},{"x":0.079821,"y":-0.112804,"z":-0.28444},{"x":-0.076884,"y":-0.112933,"z":-0.334749},{"x":-0.07902,"y":-0.112804,"z":-0.28444},{"x":0.077685,"y":-0.165832,"z":-0.334749},{"x":0.066366,"y":-0.103231,"z":-0.234129},{"x":-0.065565,"y":-0.103231,"z":-0.23413},{"x":0.063258,"y":-0.175426,"z":-0.042479},{"x":-0.062454,"y":-0.175426,"z":-0.042479},{"x":0.015729,"y":-0.129514,"z":0.206744},{"x":0.010707,"y":-0.134299,"z":0.218983},{"x":-0.065979,"y":-0.105028,"z":-0.184303},{"x":0.066783,"y":-0.105028,"z":-0.184303},{"x":-0.034695,"y":-0.162322,"z":0.168239},{"x":0.035511,"y":-0.162322,"z":0.168239},{"x":0.028947,"y":-0.158686,"z":0.189775},{"x":-0.028131,"y":-0.158686,"z":0.189775},{"x":0.081192,"y":-0.114082,"z":-0.234129},{"x":-0.080388,"y":-0.114082,"z":-0.23413},{"x":-0.080466,"y":-0.11554,"z":-0.135442},{"x":0.08127,"y":-0.11554,"z":-0.135441},{"x":-0.01491,"y":-0.129514,"z":0.206744},{"x":-0.080898,"y":-0.115477,"z":-0.184303},{"x":0.081702,"y":-0.115477,"z":-0.184303},{"x":-0.009891,"y":-0.150763,"z":0.218982},{"x":0.000408,"y":-0.137734,"z":0.226373},{"x":-0.014913,"y":-0.156148,"z":0.206744},{"x":0.015729,"y":-0.156148,"z":0.206744},{"x":-0.021255,"y":-0.131845,"z":0.206744},{"x":0.022074,"y":-0.131845,"z":0.206744},{"x":0.026943,"y":-0.13489,"z":0.206744},{"x":-0.021258,"y":-0.153499,"z":0.206744},{"x":0.022074,"y":-0.153499,"z":0.206744},{"x":-0.026127,"y":-0.150133,"z":0.206744},{"x":0.000396,"y":-0.099319,"z":-0.787857}],"faces":[33,41,44,44,23,24,24,25,44,26,27,32,28,29,32,30,31,32,32,25,26,34,35,36,36,37,34,38,39,34,40,41,34,42,43,44,44,25,33,27,28,32,30,32,29,34,37,38,39,40,34,42,44,41,32,33,25,34,41,33,1,3,4,6,8,5,7,10,8,4,11,12,13,2,1,16,5,15,18,13,17,9,20,10,12,21,22,21,15,22,20,45,46,48,50,47,51,53,54,55,52,51,58,47,57,49,60,50,54,61,62,60,18,17,63,56,55,66,57,65,62,66,65,45,63,46,9,68,19,68,45,19,45,70,64,70,56,64,56,72,52,52,73,53,53,74,61,61,75,66,75,58,66,76,48,58,48,78,49,78,59,49,79,18,59,18,81,14,14,82,2,82,3,2,3,84,11,11,85,21,85,16,21,86,6,16,87,7,6,88,9,7,67,23,68,23,69,68,69,43,70,43,71,70,71,41,72,72,40,73,73,39,74,74,38,75,75,37,76,76,36,77,36,78,77,78,34,79,34,80,79,80,32,81,32,82,81,82,30,83,30,84,83,29,85,84,28,86,85,27,87,86,26,88,87,25,67,88,1,2,3,6,7,8,7,9,10,4,3,11,13,14,2,16,6,5,18,14,13,9,19,20,12,11,21,21,16,15,20,19,45,48,49,50,51,52,53,55,56,52,58,48,47,49,59,60,54,53,61,60,59,18,63,64,56,66,58,57,62,61,66,45,64,63,9,67,68,68,69,45,45,69,70,70,71,56,56,71,72,52,72,73,53,73,74,61,74,75,75,76,58,76,77,48,48,77,78,78,79,59,79,80,18,18,80,81,14,81,82,82,83,3,3,83,84,11,84,85,85,86,16,86,87,6,87,88,7,88,67,9,67,24,23,23,44,69,69,44,43,43,42,71,71,42,41,72,41,40,73,40,39,74,39,38,75,38,37,76,37,36,36,35,78,78,35,34,34,33,80,80,33,32,32,31,82,82,31,30,30,29,84,29,28,85,28,27,86,27,26,87,26,25,88,25,24,67,103,93,104,112,122,121,103,94,93,112,111,122,89,90,91,92,94,95,96,90,97,97,89,98,98,99,100,100,101,102,102,103,104,95,106,92,105,96,106,94,103,101,101,99,95,101,95,94,105,95,99,105,99,89,91,105,89,107,108,109,111,113,110,108,115,114,109,114,116,118,116,117,120,117,119,122,119,121,123,110,113,115,124,123,120,122,111,110,118,120,111,110,120,118,110,124,109,118,124,109,124,107,92,93,94,96,91,90,97,90,89,98,89,99,100,99,101,102,101,103,95,105,106,105,91,96,111,112,113,108,107,115,109,108,114,118,109,116,120,118,117,122,120,119,123,124,110,115,107,124,129,131,133,161,162,149,136,125,126,126,127,135,129,130,131,127,128,134,135,136,126,134,135,127,128,129,133,131,132,133,133,134,128,149,148,160,160,161,149,162,163,149,138,140,137,139,142,140,141,144,142,144,145,146,148,150,147,152,145,151,147,151,145,153,139,138,154,141,139,155,143,141,156,158,143,157,160,158,160,164,161,160,148,147,147,158,160,132,164,159,133,159,157,134,157,156,135,156,155,136,155,154,125,154,153,165,138,137,167,166,165,169,168,167,171,172,169,150,163,173,172,152,151,151,173,172,166,153,138,168,174,166,170,175,168,177,176,170,162,178,177,164,162,161,173,163,162,177,173,162,164,130,179,179,129,178,178,128,176,176,127,175,175,126,174,174,125,153,172,177,170,143,158,145,144,143,145,172,170,169,138,139,140,139,141,142,141,143,144,148,149,150,152,146,145,147,150,151,153,154,139,154,155,141,155,156,143,156,157,158,157,159,160,160,159,164,147,145,158,132,131,164,133,132,159,134,133,157,135,134,156,136,135,155,125,136,154,165,166,138,167,168,166,169,170,168,150,149,163,172,171,152,151,150,173,166,174,153,168,175,174,170,176,175,177,178,176,162,179,178,164,179,162,177,172,173,164,131,130,179,130,129,178,129,128,176,128,127,175,127,126,174,126,125,180,182,183,182,185,183,184,187,185,186,189,187,188,191,189,190,193,191,194,196,197,197,181,180,198,192,199,198,195,194,200,184,182,181,200,182,196,202,181,195,203,196,199,204,195,206,199,192,207,192,190,208,190,188,209,188,186,201,186,184,203,209,202,209,200,202,205,207,204,208,204,207,211,213,210,214,211,210,216,215,214,218,217,216,220,219,218,222,221,220,225,227,224,212,224,213,223,229,228,226,229,227,215,231,211,231,212,211,232,225,212,233,226,225,234,228,226,228,236,223,223,237,221,221,238,219,219,239,217,217,230,215,239,233,232,231,239,232,237,235,234,234,238,237,180,181,182,182,184,185,184,186,187,186,188,189,188,190,191,190,192,193,194,195,196,197,196,181,198,193,192,198,199,195,200,201,184,181,202,200,196,203,202,195,204,203,199,205,204,206,205,199,207,206,192,208,207,190,209,208,188,201,209,186,203,208,209,209,201,200,205,206,207,208,203,204,211,212,213,214,215,211,216,217,215,218,219,217,220,221,219,222,223,221,225,226,227,212,225,224,223,222,229,226,228,229,215,230,231,231,232,212,232,233,225,233,234,226,234,235,228,228,235,236,223,236,237,221,237,238,219,238,239,217,239,230,239,238,233,231,230,239,237,236,235,234,233,238,240,241,242,244,246,243,248,250,247,252,240,251,253,243,246,247,250,255,256,258,259,259,260,261,258,263,264,266,243,265,268,269,267,266,256,270,272,274,271,246,276,253,245,275,246,249,275,250,269,279,278,273,251,274,252,253,276,270,259,261,257,262,258,278,271,280,278,267,269,241,276,249,257,265,279,273,254,253,272,279,254,277,250,275,281,262,268,259,264,260,254,265,243,242,249,248,242,282,240,283,285,286,287,289,290,240,291,251,286,293,283,294,287,290,296,298,295,299,300,295,302,296,301,286,304,305,306,268,267,298,304,307,274,309,271,310,283,293,311,284,283,311,288,287,313,306,314,251,308,274,293,291,310,295,307,299,303,297,296,271,314,280,267,314,306,310,282,288,305,297,313,292,308,293,313,309,292,287,312,311,303,281,268,301,295,300,305,292,286,288,242,289,244,245,246,248,249,250,252,241,240,253,254,243,256,257,258,258,262,263,266,244,243,268,262,269,266,265,256,272,273,274,246,275,276,245,277,275,249,276,275,269,257,279,273,252,251,252,273,253,270,256,259,257,269,262,278,272,271,278,280,267,241,252,276,257,256,265,273,272,254,272,278,279,277,255,250,281,263,262,259,258,264,254,279,265,242,241,249,283,284,285,287,288,289,240,282,291,286,292,293,296,297,298,302,303,296,286,285,304,306,303,268,298,305,304,274,308,309,310,311,283,311,312,284,311,310,288,313,297,306,251,291,308,293,308,291,295,298,307,303,306,297,271,309,314,267,280,314,310,291,282,305,298,297,292,309,308,313,314,309,287,294,312,303,302,281,301,296,295,305,313,292,288,282,242,315,316,317,336,331,337,381,382,388,436,524,586,677,678,679,693,697,698,852,771,907,998,375,999,387,1003,1002,386,1004,1003,1012,376,998,980,981,326,986,987,688,336,330,331,388,375,379,376,377,378,378,379,375,380,381,388,382,383,388,384,385,386,386,387,384,375,376,378,379,380,388,383,384,387,387,388,383,436,435,524,693,692,697,852,772,771,998,376,375,387,386,1003,386,385,1004,1012,377,376,980,982,981,986,985,987,318,319,320,320,319,321,325,326,327,327,326,328,328,326,329,329,326,330,330,326,331,331,326,332,325,327,333,327,334,333,328,335,334,329,336,335,337,332,338,339,340,341,339,342,343,345,339,344,339,341,342,346,344,339,349,351,348,348,353,352,352,354,355,355,356,357,356,359,357,359,361,360,360,347,346,349,363,350,336,365,335,364,367,368,364,337,366,370,372,369,372,373,369,369,374,370,390,392,389,389,394,393,393,395,396,396,398,397,397,400,399,402,404,401,406,408,405,409,410,411,412,413,325,333,414,415,365,334,335,416,417,343,418,420,421,422,424,410,425,426,427,399,429,428,430,432,433,434,435,436,437,439,440,441,374,427,390,443,391,444,446,447,448,373,372,448,449,373,449,450,373,451,452,449,412,325,453,454,456,457,458,459,460,462,464,461,466,468,465,470,472,469,474,344,473,475,361,358,477,478,416,342,416,343,479,480,481,483,485,482,325,487,326,489,491,488,492,481,480,494,397,495,496,438,437,347,473,344,399,495,397,444,501,500,503,505,502,442,506,507,489,509,510,511,486,512,350,469,472,513,421,420,497,515,438,516,502,518,519,481,520,398,522,400,449,523,450,407,431,430,435,471,470,392,419,394,391,420,392,501,455,454,474,442,345,525,358,356,527,529,526,466,525,467,531,508,532,500,534,444,333,453,325,490,510,513,428,499,399,493,532,508,446,535,367,451,448,536,538,540,537,345,507,340,541,517,516,518,505,543,544,545,546,352,355,547,357,547,355,540,551,549,533,522,534,539,550,540,393,494,553,437,451,496,546,542,541,555,346,554,538,502,517,556,488,491,557,558,559,560,562,426,426,441,427,563,562,543,514,564,515,491,443,474,496,536,565,477,342,341,400,544,429,520,493,488,566,522,521,529,518,561,461,436,462,418,535,569,527,459,570,572,574,530,575,478,477,467,356,354,565,497,496,577,472,471,528,516,529,539,517,542,579,541,528,346,343,554,426,580,560,473,491,474,357,581,548,526,580,582,537,549,564,584,572,583,436,587,462,569,445,566,419,569,588,570,528,527,503,537,514,563,371,370,590,592,593,594,520,556,440,452,437,366,446,367,568,421,596,521,395,588,417,478,597,550,454,551,596,368,568,599,573,600,441,370,374,409,422,410,504,514,497,371,448,372,602,316,413,603,433,432,583,530,466,530,475,525,545,539,542,589,543,505,552,501,550,565,505,504,581,360,555,458,570,459,508,488,493,509,598,596,447,595,455,390,605,506,404,603,401,589,536,371,594,600,519,423,408,424,527,582,571,606,323,319,566,444,534,608,609,607,579,428,429,498,361,476,468,354,353,455,610,456,389,553,605,585,573,572,412,492,480,585,318,609,597,576,611,415,531,532,568,367,535,561,543,562,594,476,599,353,578,468,453,532,492,578,465,468,438,612,439,577,434,557,613,424,408,560,529,561,363,616,469,583,465,617,431,619,432,479,317,316,432,621,603,479,600,620,622,337,338,469,623,470,533,552,545,515,624,612,362,615,363,551,457,626,549,626,627,524,618,431,513,443,490,574,476,475,603,629,401,631,362,630,600,608,620,319,584,606,623,435,470,577,617,465,498,556,473,569,521,588,595,622,610,394,588,395,414,598,531,596,510,509,340,477,341,557,606,617,429,546,579,632,524,435,472,351,350,564,627,624,633,619,618,615,636,616,616,637,623,639,512,638,634,621,619,625,635,615,365,368,598,642,618,628,640,629,621,401,644,402,629,645,644,623,646,632,631,641,625,646,628,632,411,648,649,650,614,613,620,607,317,606,583,617,652,651,650,464,654,655,484,652,485,592,657,593,659,661,658,656,638,657,663,665,662,664,648,665,660,662,661,459,666,460,667,316,315,601,315,668,669,601,668,423,669,670,322,423,670,321,405,322,586,407,406,406,671,586,480,316,602,602,412,480,413,412,602,614,410,424,651,648,614,653,665,651,661,653,484,658,484,483,325,667,409,411,325,409,649,486,411,638,649,664,657,664,663,593,663,660,659,593,660,434,567,558,672,559,558,673,558,567,674,567,461,675,461,464,672,324,323,676,586,671,676,654,587,430,408,407,433,613,430,604,650,433,485,604,404,403,485,404,654,462,587,655,675,464,680,681,682,681,680,686,687,688,689,690,688,687,691,688,690,692,688,691,693,688,692,332,688,693,694,687,689,695,687,694,696,690,695,697,691,696,332,698,338,699,700,701,343,702,701,701,703,704,702,699,701,704,706,701,707,709,710,711,710,712,714,712,713,716,713,715,717,716,715,719,717,720,705,720,706,721,709,708,723,697,696,726,724,725,698,724,727,728,730,369,369,373,728,730,374,369,731,733,734,735,734,736,738,736,737,739,737,740,741,740,742,743,402,744,745,747,748,749,750,751,689,752,753,755,694,754,695,723,696,343,417,756,758,760,757,761,763,750,427,764,425,765,742,766,768,770,767,771,772,773,439,775,440,427,374,776,777,733,732,780,782,779,728,373,783,373,784,783,373,450,784,784,785,786,787,689,753,456,789,457,790,459,791,792,794,795,796,798,799,800,802,803,704,804,805,719,807,718,756,808,809,343,756,702,811,812,810,813,483,482,815,689,688,817,819,820,810,822,811,740,824,823,774,826,775,805,705,704,823,742,740,829,782,830,831,833,834,836,778,835,838,819,837,816,841,840,803,708,800,757,842,758,843,825,774,834,847,845,810,849,848,850,739,741,523,784,450,769,746,770,801,772,802,759,731,735,758,732,731,788,829,789,778,804,703,718,853,716,854,856,857,853,798,797,839,860,859,861,830,782,787,694,689,837,818,842,828,766,742,859,821,839,863,780,726,783,786,864,865,867,868,835,703,700,846,870,847,831,845,871,873,874,872,547,713,712,547,715,713,875,865,877,850,862,861,876,866,865,824,736,879,786,775,826,869,872,870,706,555,554,834,867,846,820,880,817,882,883,881,884,886,764,776,764,427,884,887,871,888,844,843,777,817,804,864,826,889,702,809,699,874,741,765,821,848,820,850,890,851,845,854,885,771,795,794,863,760,892,459,856,894,895,897,858,808,899,809,716,797,714,825,889,826,800,901,801,847,855,854,846,866,869,870,902,855,343,706,554,580,764,886,817,805,804,581,715,548,580,857,582,877,868,888,897,904,905,906,771,794,781,892,890,892,759,908,855,894,856,868,833,844,729,887,730,911,590,910,848,912,880,785,440,775,780,727,726,757,893,914,738,851,908,808,417,597,789,876,875,725,914,893,896,917,916,730,776,374,763,751,750,844,832,825,783,729,728,752,678,919,767,921,768,858,905,798,807,858,853,866,873,869,871,909,831,829,878,876,831,889,832,720,581,555,894,791,459,820,839,821,915,838,914,913,779,788,922,733,836,921,743,744,864,909,729,916,912,849,745,762,761,582,856,571,684,923,681,782,890,861,924,925,926,766,902,765,719,827,806,714,796,711,610,788,456,879,734,922,896,903,897,822,753,811,682,903,924,898,597,611,860,754,859,726,893,863,871,885,884,806,912,917,900,711,796,859,787,822,799,900,796,612,774,439,773,901,883,761,928,745,854,886,885,929,721,803,799,905,931,932,769,768,677,812,678,935,768,921,916,812,934,698,622,338,936,803,802,878,862,873,624,843,612,930,722,721,457,875,626,626,877,627,933,852,769,777,842,818,806,895,807,939,921,744,722,631,630,925,916,934,904,681,923,772,936,802,931,901,799,880,827,805,851,892,908,622,913,610,908,735,738,915,755,860,837,914,838,809,700,699,923,883,931,872,765,902,852,940,772,707,800,708,627,888,624,932,942,933,943,930,929,945,929,936,840,946,947,935,941,932,944,937,930,725,723,915,933,950,938,939,948,935,644,744,402,645,939,644,952,936,940,949,631,937,938,952,940,954,749,953,927,956,928,926,934,677,905,923,931,955,958,956,960,792,959,958,814,813,961,911,910,963,659,658,947,962,961,965,967,968,954,966,965,968,964,963,790,666,459,678,969,679,679,918,970,918,971,970,971,762,972,762,685,972,748,686,685,746,907,747,973,747,907,919,678,811,811,753,919,919,753,752,750,927,761,954,955,927,965,957,955,957,963,814,814,658,483,969,689,751,689,749,751,816,953,749,840,966,953,966,961,967,967,910,964,910,659,964,891,773,882,881,974,882,882,975,891,891,976,795,795,977,792,684,683,974,907,978,973,960,978,906,745,770,746,928,767,770,956,920,767,920,813,743,813,403,743,794,960,906,792,977,959,979,326,487,982,984,981,984,985,986,688,988,815,815,989,841,841,990,946,990,962,946,991,911,962,992,591,911,591,994,592,592,995,656,656,996,639,996,511,639,997,487,511,979,999,980,999,1001,980,1001,1002,987,1002,988,987,1003,989,988,1004,990,989,1005,991,990,1006,992,991,1007,993,992,993,1009,994,994,1010,995,995,1011,996,996,1012,997,997,998,979,375,1000,999,1000,387,1002,385,1005,1004,1005,383,1006,1006,382,1007,1007,381,1008,381,1009,1008,380,1010,1009,379,1011,1010,1011,377,1012,985,1001,987,1001,982,980,981,332,326,332,986,688,324,321,319,322,320,321,319,323,324,327,328,334,328,329,335,329,330,336,337,331,332,345,340,339,346,347,344,349,350,351,348,351,353,352,353,354,355,354,356,356,358,359,359,358,361,360,361,347,349,362,363,336,364,365,364,366,367,364,336,337,370,371,372,390,391,392,389,392,394,393,394,395,396,395,398,397,398,400,402,403,404,406,407,408,333,334,414,365,414,334,418,419,420,422,423,424,399,400,429,430,431,432,437,438,439,390,442,443,444,445,446,454,455,456,462,463,464,466,467,468,470,471,472,474,345,344,475,476,361,479,316,480,483,484,485,325,486,487,489,490,491,492,493,481,494,396,397,496,497,438,347,498,473,399,499,495,444,447,501,503,504,505,442,390,506,489,508,509,511,487,486,350,363,469,513,510,421,497,514,515,516,517,502,519,479,481,398,521,522,449,452,523,407,524,431,435,434,471,392,420,419,391,513,420,501,447,455,474,443,442,525,475,358,527,528,529,466,530,525,531,509,508,500,533,534,333,415,453,490,489,510,428,458,499,493,492,532,446,445,535,451,449,448,538,539,540,345,442,507,541,542,517,518,502,505,544,533,545,357,548,547,540,550,551,533,544,522,539,552,550,393,396,494,437,452,451,546,545,542,555,360,346,538,503,502,556,520,488,557,434,558,560,561,562,426,562,441,563,441,562,514,537,564,491,490,443,496,451,536,477,416,342,400,522,544,520,481,493,566,534,522,529,516,518,461,567,436,418,568,535,527,571,459,572,573,574,575,576,478,467,525,356,565,504,497,577,578,472,528,541,516,539,538,517,579,546,541,346,339,343,426,425,580,473,556,491,357,359,581,526,560,580,537,540,549,584,585,572,436,586,587,569,535,445,419,418,569,570,579,528,503,538,537,563,589,371,590,591,592,594,519,520,440,523,452,366,595,446,568,418,421,521,398,395,417,416,478,550,501,454,596,598,368,599,574,573,441,563,370,409,601,422,504,503,514,371,536,448,603,604,433,583,572,530,530,574,475,545,552,539,589,563,543,552,500,501,565,589,505,581,359,360,458,428,570,508,489,488,509,531,598,447,446,595,390,389,605,404,604,603,589,565,536,594,599,600,423,405,408,527,526,582,606,559,323,566,445,444,608,585,609,579,570,428,498,347,361,468,467,354,455,595,610,389,393,553,585,608,573,412,453,492,585,584,318,597,478,576,415,414,531,568,368,367,561,518,543,594,498,476,353,351,578,453,415,532,578,577,465,438,515,612,577,471,434,613,614,424,560,526,529,363,615,616,583,466,465,431,618,619,479,620,317,432,619,621,479,519,600,622,366,337,469,616,623,533,500,552,515,564,624,362,625,615,551,454,457,549,551,626,524,628,618,513,391,443,574,599,476,603,621,629,631,625,362,600,573,608,319,318,584,623,632,435,577,557,617,498,594,556,569,566,521,595,366,622,394,419,588,414,365,598,596,421,510,340,575,477,557,559,606,429,544,546,632,628,524,472,578,351,564,549,627,633,634,619,615,635,636,616,636,637,639,511,512,634,640,621,625,641,635,365,364,368,642,633,618,640,643,629,401,629,644,629,643,645,623,637,646,631,647,641,646,642,628,411,410,648,650,651,614,620,608,607,606,584,583,652,653,651,464,463,654,484,653,652,592,656,657,659,660,661,656,639,638,663,664,665,664,649,648,660,663,662,667,413,316,601,667,315,669,422,601,423,422,669,322,405,423,321,406,405,586,524,407,406,321,671,614,648,410,651,665,648,653,662,665,661,662,653,658,661,484,601,409,667,325,413,667,411,486,325,649,512,486,638,512,649,657,638,664,593,657,663,659,590,593,434,436,567,672,323,559,673,672,558,674,673,567,675,674,461,676,587,586,676,655,654,430,613,408,433,650,613,604,652,650,485,652,604,403,482,485,654,463,462,683,684,681,681,686,683,685,686,680,695,690,687,696,691,690,697,692,691,332,693,698,701,700,703,704,705,706,707,708,709,711,707,710,714,711,712,716,714,713,717,718,716,719,718,717,705,719,720,721,722,709,723,724,697,726,727,724,698,697,724,728,729,730,731,732,733,735,731,734,738,735,736,739,738,737,741,739,740,743,403,402,745,746,747,755,695,694,695,755,723,758,759,760,761,762,763,765,741,742,768,769,770,439,774,775,777,778,733,780,781,782,456,788,789,792,793,794,796,797,798,800,801,802,704,703,804,719,806,807,811,678,812,813,814,483,815,816,689,817,818,819,810,821,822,740,737,824,774,825,826,805,827,705,823,828,742,829,779,782,831,832,833,836,733,778,838,839,819,816,815,841,803,721,708,757,837,842,843,844,825,834,846,847,810,812,849,850,851,739,523,785,784,769,852,746,801,773,772,759,758,731,758,842,732,788,779,829,778,777,804,718,807,853,854,855,856,853,858,798,839,838,860,861,862,830,787,754,694,837,819,818,828,791,766,859,822,821,863,781,780,783,784,786,865,866,867,835,778,703,846,869,870,831,834,845,873,862,874,547,548,715,875,876,865,850,874,862,876,878,866,824,737,736,786,785,775,869,873,872,706,720,555,834,833,867,820,848,880,882,773,883,884,885,886,776,884,764,884,776,887,888,868,844,777,818,817,864,786,826,702,756,809,874,850,741,821,810,848,850,861,890,845,847,854,771,891,795,863,893,760,459,571,856,895,896,897,808,898,899,716,853,797,825,832,889,800,900,901,847,870,855,846,867,866,870,872,902,343,701,706,580,425,764,817,880,805,581,717,715,580,886,857,877,865,868,897,903,904,906,907,771,781,863,892,892,760,759,855,902,894,868,867,833,729,909,887,911,591,590,848,849,912,785,523,440,780,913,727,757,760,893,738,739,851,808,756,417,789,829,876,725,915,914,896,895,917,730,887,776,763,918,751,844,833,832,783,864,729,767,920,921,858,897,905,807,895,858,866,878,873,871,887,909,829,830,878,831,909,889,720,717,581,894,766,791,820,819,839,915,860,838,913,780,779,922,734,733,921,920,743,864,889,909,916,917,912,745,748,762,582,857,856,684,881,923,782,781,890,924,903,925,766,894,902,719,705,827,714,797,796,610,913,788,879,736,734,896,925,903,822,787,753,682,904,903,898,808,597,860,755,754,726,725,893,871,845,885,806,827,912,900,707,711,859,754,787,799,901,900,612,843,774,773,801,901,761,927,928,854,857,886,929,930,721,799,798,905,932,933,769,677,934,812,935,932,768,916,849,812,698,727,622,936,929,803,878,830,862,624,888,843,930,937,722,457,789,875,626,875,877,933,938,852,777,732,842,806,917,895,939,935,921,722,937,631,925,896,916,904,682,681,772,940,936,931,883,901,880,912,827,851,890,892,622,727,913,908,759,735,915,723,755,837,757,914,809,899,700,923,881,883,872,874,765,852,938,940,707,900,800,627,877,888,932,941,942,943,944,930,945,943,929,840,841,946,935,948,941,944,949,937,725,724,723,933,942,950,939,951,948,644,939,744,645,951,939,952,945,936,949,647,631,938,950,952,954,750,749,927,955,956,926,925,934,905,904,923,955,957,958,960,793,792,958,957,814,961,962,911,963,964,659,947,946,962,965,966,967,954,953,966,968,967,964,678,752,969,679,969,918,918,763,971,971,763,762,762,748,685,748,747,686,746,852,907,973,686,747,750,954,927,954,965,955,965,968,957,957,968,963,814,963,658,751,918,969,969,752,689,689,816,749,816,840,953,840,947,966,966,947,961,967,961,910,910,590,659,891,771,773,881,684,974,882,974,975,891,975,976,795,976,977,907,906,978,960,959,978,745,928,770,928,956,767,956,958,920,920,958,813,813,482,403,794,793,960,979,980,326,982,983,984,984,983,985,688,987,988,815,988,989,841,989,990,990,991,962,991,992,911,992,993,591,591,993,994,592,994,995,656,995,996,996,997,511,997,979,487,979,998,999,999,1000,1001,1001,1000,1002,1002,1003,988,1003,1004,989,1004,1005,990,1005,1006,991,1006,1007,992,1007,1008,993,993,1008,1009,994,1009,1010,995,1010,1011,996,1011,1012,997,1012,998,375,388,1000,1000,388,387,385,384,1005,1005,384,383,1006,383,382,1007,382,381,381,380,1009,380,379,1010,379,378,1011,1011,378,377,985,983,1001,1001,983,982,981,984,332,332,984,986,1013,1015,1016,1034,1036,1033,1041,1043,1044,1045,1047,1048,1050,1052,1049,1053,1055,1056,1061,1063,1064,1070,1065,1069,1076,1069,1075,1084,1081,1083,1086,1083,1085,1049,1088,1087,1089,1051,1050,1092,1094,1091,1094,1096,1091,1013,1098,1097,1097,1099,1100,1126,1128,1125,1130,1132,1129,1134,1136,1133,1135,1138,1136,1137,1140,1138,1142,1045,1141,1144,1053,1143,1186,1188,1185,1190,1192,1189,1194,1196,1193,1204,1206,1203,1207,1093,1092,1210,1212,1209,1055,1145,1056,1141,1216,1142,1220,1222,1219,1226,1228,1225,1192,1194,1193,1014,1060,1015,1240,1242,1239,1242,1203,1239,1210,1267,1266,1211,1269,1212,1281,1283,1280,1143,1213,1144,1301,1303,1300,1130,1128,1131,1305,1307,1304,1132,1126,1129,1292,1208,1207,1088,1323,1087,1318,1063,1062,1345,1347,1344,1267,1268,1266,1205,1324,1206,1061,1281,1280,1047,1270,1048,1364,1134,1133,1301,1044,1043,1402,1404,1401,1190,1196,1195,1036,1347,1033,1346,1035,1034,1225,1401,1226,1228,1404,1403,1433,1185,1188,1220,1305,1304,1186,1436,1187,1221,1306,1222,1190,1194,1191,1433,1187,1436,1193,1189,1192,1345,1036,1035,1347,1034,1033,1041,1300,1303,1301,1042,1302,1226,1404,1227,1129,1125,1130,1132,1128,1127,1225,1403,1402,1266,1211,1210,1267,1212,1269,1305,1222,1306,1304,1221,1220,1186,1434,1435,1203,1240,1239,1052,1322,1088,1745,1334,1746,1747,1414,1748,1530,1745,1746,1327,1206,1324,1501,1747,1748,1202,1750,1749,1750,1379,1749,1275,1051,1090,1751,1338,1752,1400,1751,1752,1540,1776,1541,1507,1778,1508,1393,1776,1775,1278,1778,1777,1779,1719,1718,1781,1607,1606,1381,1779,1692,1385,1781,1661,1783,1705,1784,1785,1703,1786,1178,1783,1784,1390,1785,1786,1789,1458,1790,1791,1524,1792,1639,1789,1790,1590,1791,1792,1793,1377,1378,1795,1262,1265,1797,1258,1261,1799,1531,1534,1793,1376,1794,1795,1666,1796,1799,1536,1800,1797,1511,1798,1787,1761,1762,1788,1759,1760,1787,1682,1681,1788,1657,1656,1787,1762,1772,1606,1661,1781,1529,1335,1745,1778,1277,1508,1638,1498,1789,1385,1607,1782,1334,1530,1746,1777,1507,1278,1458,1639,1790,1399,1339,1751,1793,1378,1373,1389,1704,1785,1797,1261,1510,1788,1760,1771,1718,1692,1779,1500,1417,1747,1776,1392,1541,1589,1582,1791,1381,1719,1780,1414,1501,1748,1775,1540,1393,1524,1590,1792,1201,1380,1750,1795,1265,1632,1177,1706,1783,1799,1534,1535,1435,1433,1436,1302,1041,1303,1013,1014,1015,1034,1035,1036,1041,1042,1043,1045,1046,1047,1050,1051,1052,1053,1054,1055,1061,1062,1063,1070,1066,1065,1076,1070,1069,1084,1082,1081,1086,1084,1083,1049,1052,1088,1089,1090,1051,1092,1093,1094,1094,1095,1096,1013,1016,1098,1097,1098,1099,1126,1127,1128,1130,1131,1132,1134,1135,1136,1135,1137,1138,1137,1139,1140,1142,1046,1045,1144,1054,1053,1186,1187,1188,1190,1191,1192,1194,1195,1196,1204,1205,1206,1207,1208,1093,1210,1211,1212,1055,1146,1145,1141,1215,1216,1220,1221,1222,1226,1227,1228,1192,1191,1194,1014,1057,1060,1240,1241,1242,1242,1204,1203,1210,1209,1267,1211,1268,1269,1281,1282,1283,1143,1214,1213,1301,1302,1303,1130,1125,1128,1305,1306,1307,1132,1127,1126,1292,1295,1208,1088,1322,1323,1318,1321,1063,1345,1346,1347,1267,1269,1268,1205,1325,1324,1061,1064,1281,1047,1271,1270,1364,1365,1134,1301,1300,1044,1402,1403,1404,1190,1189,1196,1036,1344,1347,1346,1345,1035,1225,1402,1401,1228,1227,1404,1433,1434,1185,1220,1219,1305,1186,1435,1436,1221,1307,1306,1190,1195,1194,1433,1188,1187,1193,1196,1189,1345,1344,1036,1347,1346,1034,1041,1044,1300,1301,1043,1042,1226,1401,1404,1129,1126,1125,1132,1131,1128,1225,1228,1403,1266,1268,1211,1267,1209,1212,1305,1219,1222,1304,1307,1221,1186,1185,1434,1203,1327,1240,1052,1275,1322,1745,1335,1334,1747,1417,1414,1530,1529,1745,1327,1203,1206,1501,1500,1747,1202,1201,1750,1750,1380,1379,1275,1052,1051,1751,1339,1338,1400,1399,1751,1540,1775,1776,1507,1777,1778,1393,1392,1776,1278,1277,1778,1779,1780,1719,1781,1782,1607,1381,1780,1779,1385,1782,1781,1783,1706,1705,1785,1704,1703,1178,1177,1783,1390,1389,1785,1789,1498,1458,1791,1582,1524,1639,1638,1789,1590,1589,1791,1793,1794,1377,1795,1796,1262,1797,1798,1258,1799,1800,1531,1793,1373,1376,1795,1632,1666,1799,1535,1536,1797,1510,1511,1787,1681,1761,1788,1656,1759,1787,1764,1682,1788,1766,1657,1435,1434,1433,1302,1042,1041,1018,1020,1017,1022,1024,1021,1026,1028,1025,1030,1032,1029,1038,1040,1037,1057,1059,1060,1066,1068,1065,1072,1074,1071,1078,1080,1077,1082,1077,1081,1102,1104,1101,1106,1108,1105,1110,1112,1109,1114,1116,1113,1118,1120,1117,1122,1124,1121,1145,1147,1148,1150,1152,1149,1154,1149,1153,1156,1158,1155,1160,1162,1159,1164,1166,1163,1167,1169,1170,1030,1172,1031,1174,1037,1173,1175,1177,1178,1180,1173,1179,1181,1180,1179,1184,1181,1183,1067,1198,1068,1200,1202,1199,1148,1213,1214,1105,1218,1217,1139,1224,1140,1217,1111,1110,1019,1183,1020,1040,1172,1171,1071,1230,1229,1163,1232,1231,1116,1119,1118,1233,1123,1122,1235,1152,1151,1237,1027,1026,1157,1153,1158,1243,1181,1244,1245,1149,1246,1248,1121,1247,1249,1158,1250,1244,1179,1251,1249,1253,1252,1254,1256,1257,1079,1085,1080,1258,1260,1261,1263,1265,1262,1197,1075,1198,1271,1273,1270,1089,1275,1090,1277,1279,1276,1284,1286,1287,1103,1289,1104,1291,1113,1290,1292,1294,1295,1297,1299,1296,1309,1311,1308,1313,1315,1312,1316,1315,1314,1316,1290,1317,1288,1308,1289,1319,1321,1318,1096,1294,1293,1324,1326,1327,1328,1330,1331,1328,1333,1332,1279,1335,1276,1336,1338,1339,1340,1342,1343,1117,1349,1348,1164,1032,1165,1231,1351,1350,1353,1355,1352,1350,1357,1356,1359,1361,1358,1018,1023,1022,1363,1352,1362,1109,1359,1358,1257,1105,1217,1319,1282,1320,1274,1322,1275,1327,1241,1240,1272,1215,1273,1100,1059,1058,1366,1368,1369,1370,1372,1366,1374,1376,1373,1337,1378,1377,1264,1379,1380,1381,1383,1384,1385,1387,1388,1375,1389,1390,1392,1394,1391,1168,1396,1169,1398,1400,1397,1025,1236,1235,1348,1234,1233,1161,1155,1162,1357,1159,1356,1121,1355,1354,1149,1405,1246,1159,1407,1406,1223,1364,1224,1408,1284,1410,1411,1340,1413,1394,1416,1414,1394,1417,1391,1254,1419,1418,1421,1422,1420,1424,1426,1423,1427,1429,1430,1298,1432,1299,1027,1409,1408,1309,1413,1310,1437,1439,1440,1442,1444,1441,1446,1448,1445,1449,1255,1254,1451,1453,1454,1455,1296,1457,1459,1461,1458,1462,1451,1464,1466,1468,1465,1020,1243,1469,1037,1471,1470,1356,1406,1421,1473,1475,1472,1476,1478,1437,1480,1482,1479,1407,1155,1249,1425,1358,1426,1483,1485,1486,1487,1471,1489,1491,1492,1490,1493,1495,1496,1459,1498,1497,1382,1500,1501,1502,1474,1473,1504,1428,1427,1507,1509,1506,1510,1397,1511,1512,1514,1248,1515,1489,1516,1405,1518,1519,1238,1521,1409,1255,1522,1256,1465,1523,1443,1525,1527,1524,1386,1529,1530,1531,1533,1534,1409,1285,1284,1535,1199,1536,1360,1538,1361,1017,1469,1491,1539,1541,1542,1383,1380,1384,1544,1490,1543,1253,1245,1545,1547,1549,1546,1453,1551,1454,1552,1445,1450,1329,1170,1330,1545,1556,1554,1410,1547,1557,1559,1543,1561,1562,1564,1565,1387,1339,1388,1567,1569,1566,1558,1548,1547,1572,1574,1571,1310,1575,1576,1279,1578,1334,1256,1106,1105,1580,1117,1579,1525,1582,1581,1517,1557,1518,1584,1586,1587,1462,1423,1426,1420,1588,1421,1542,1590,1539,1247,1354,1586,1236,1405,1152,1494,1452,1591,1592,1288,1103,1341,1595,1342,1496,1568,1567,1286,1597,1287,1598,1550,1453,1598,1566,1599,1425,1110,1109,1489,1040,1171,1600,1117,1348,1250,1153,1245,1173,1470,1601,1520,1602,1521,1583,1410,1557,1585,1247,1586,1472,1371,1370,1496,1505,1504,1575,1363,1576,1578,1374,1373,1593,1412,1411,1607,1497,1606,1540,1608,1609,1028,1408,1583,1610,1163,1231,1484,1516,1485,1613,1615,1612,1612,1617,1616,1447,1522,1448,1246,1519,1555,1619,1486,1611,1449,1418,1620,1621,1513,1512,1537,1312,1538,1614,1484,1615,1072,1623,1073,1466,1430,1467,1431,1625,1432,1626,1252,1628,1629,1631,1456,1288,1411,1309,1416,1176,1632,1495,1290,1505,1251,1173,1601,1514,1122,1248,1312,1463,1538,1602,1543,1560,1545,1246,1555,1468,1580,1579,1298,1470,1431,1507,1633,1634,1485,1030,1029,1562,1610,1588,1584,1604,1635,1447,1637,1618,1526,1535,1527,1509,1639,1506,1640,1641,1642,1229,1481,1480,1332,1503,1502,1460,1510,1461,1463,1452,1451,1420,1563,1562,1644,1585,1584,1427,1624,1645,1315,1591,1312,1419,1217,1110,1395,1646,1396,1430,1580,1467,1561,1490,1647,1621,1603,1573,1450,1448,1255,1648,1545,1554,1317,1494,1315,1164,1485,1029,1163,1486,1164,1649,1563,1643,1571,1644,1651,1653,1617,1652,1655,1657,1654,1647,1660,1658,1385,1528,1386,1479,1663,1662,1622,1665,1623,1531,1666,1532,1519,1546,1667,1636,1669,1670,1625,1487,1671,1377,1511,1337,1262,1536,1263,1432,1673,1672,1561,1658,1674,1673,1671,1675,1645,1677,1676,1451,1678,1464,1028,1517,1236,1366,1646,1367,1258,1376,1259,1680,1682,1679,1684,1686,1683,1328,1687,1688,1407,1252,1627,1470,1488,1431,1356,1588,1350,1573,1585,1574,1586,1353,1587,1176,1666,1632,1668,1447,1446,1243,1631,1630,1544,1017,1491,1429,1118,1580,1423,1678,1689,1664,1642,1665,1071,1690,1691,1381,1499,1382,1358,1462,1426,1693,1343,1342,1670,1694,1605,1670,1593,1592,1693,1584,1635,1555,1667,1556,1643,1696,1649,1697,1669,1668,1689,1699,1700,1701,1238,1237,1310,1702,1311,1514,1348,1233,1418,1425,1424,1244,1297,1631,1259,1704,1260,1532,1706,1533,1468,1600,1523,1598,1496,1567,1617,1484,1483,1557,1546,1518,1456,1297,1296,1637,1103,1102,1475,1276,1335,1437,1641,1438,1622,1683,1664,1504,1645,1568,1444,1523,1513,1576,1362,1702,1021,1520,1701,1472,1679,1473,1505,1113,1428,1251,1298,1297,1413,1343,1575,1608,1706,1609,1707,1689,1700,1677,1466,1709,1711,1620,1710,1712,1594,1341,1563,1714,1564,1420,1695,1643,1662,1477,1476,1715,1107,1106,1516,1171,1030,1671,1515,1614,1490,1659,1647,1296,1717,1457,1522,1715,1106,1637,1670,1592,1719,1581,1718,1102,1716,1715,1602,1023,1544,1663,1391,1417,1633,1704,1634,1452,1598,1453,1708,1423,1689,1620,1424,1708,1361,1463,1462,1386,1720,1387,1604,1353,1363,1721,1443,1442,1350,1610,1231,1565,1611,1610,1492,1629,1659,1722,1632,1265,1521,1560,1285,1723,1712,1694,1722,1414,1416,1167,1725,1168,1720,1334,1578,1382,1722,1383,1422,1407,1627,1492,1243,1630,1252,1648,1628,1724,1727,1725,1618,1102,1715,1603,1248,1247,1564,1653,1652,1720,1336,1387,1412,1341,1340,1422,1626,1695,1628,1729,1728,1722,1264,1383,1428,1116,1429,1720,1373,1378,1278,1577,1279,1410,1287,1558,1662,1654,1479,1577,1389,1374,1731,1667,1732,1565,1652,1619,1286,1560,1559,1169,1498,1170,1441,1621,1733,1629,1455,1734,1678,1551,1699,1372,1661,1646,1343,1604,1575,1513,1600,1514,1393,1415,1394,1665,1582,1623,1478,1692,1641,1596,1559,1736,1261,1461,1510,1553,1446,1445,1719,1384,1739,1384,1201,1739,1607,1388,1740,1651,1693,1741,1388,1399,1740,1742,1556,1731,1721,1466,1465,1717,1432,1672,1698,1694,1669,1287,1570,1558,1697,1446,1738,1707,1620,1708,1534,1527,1535,1694,1412,1605,1626,1728,1744,1660,1629,1734,1696,1626,1744,1415,1177,1176,1333,1509,1508,1652,1483,1619,1074,1541,1230,1743,1533,1608,1559,1674,1736,1737,1260,1633,1552,1449,1711,1648,1742,1729,1595,1693,1342,1667,1549,1732,1569,1645,1676,1613,1671,1614,1572,1621,1573,1460,1399,1398,1461,1639,1458,1539,1743,1608,1527,1590,1524,1506,1737,1633,1735,1540,1609,1730,1507,1634,1607,1460,1459,1526,1201,1200,1096,1092,1091,1093,1095,1094,1045,1215,1141,1241,1204,1242,1064,1282,1281,1283,1061,1280,1216,1046,1142,1100,1013,1097,1213,1054,1144,1016,1099,1098,1365,1135,1134,1136,1364,1133,1323,1049,1087,1053,1214,1143,1735,1706,1177,1719,1526,1525,1730,1704,1389,1294,1208,1295,1293,1207,1092,1326,1205,1204,1147,1055,1054,1058,1014,1013,1059,1015,1060,1274,1050,1049,1148,1056,1145,1273,1048,1270,1320,1063,1321,1272,1047,1046,1319,1062,1061,1224,1138,1140,1223,1137,1135,1606,1646,1661,1482,1392,1391,1479,1753,1480,1718,1641,1692,1477,1417,1500,1371,1335,1529,1474,1277,1276,1473,1754,1502,1370,1369,1755,1477,1499,1478,1371,1528,1372,1472,1755,1680,1476,1440,1756,1438,1757,1439,1367,1758,1368,1662,1756,1655,1655,1759,1656,1756,1760,1759,1680,1761,1681,1755,1762,1761,1167,1763,1724,1329,1688,1763,1679,1764,1754,1072,1691,1765,1622,1765,1684,1170,1638,1330,1623,1589,1073,1330,1509,1331,1654,1766,1753,1073,1542,1074,1229,1753,1690,1664,1757,1640,1332,1754,1687,1168,1758,1395,1684,1767,1685,1724,1768,1726,1763,1769,1768,1765,1770,1767,1259,1375,1703,1532,1175,1705,1263,1199,1379,1337,1397,1338,1169,1606,1497,1665,1718,1581,1541,1481,1230,1508,1503,1333,1683,1771,1757,1725,1772,1758,1069,1068,1198,1083,1077,1080,1078,1084,1079,1067,1070,1197,1021,1773,1022,1774,1114,1291,1774,1362,1352,1774,1120,1119,1174,1773,1038,1039,1773,1172,1774,1716,1101,1151,1773,1235,1154,1773,1150,1160,1773,1161,1774,1112,1111,1232,1773,1351,1774,1124,1123,1019,1773,1184,1774,1316,1314,1032,1773,1165,1774,1218,1108,1774,1313,1537,1774,1308,1311,1237,1773,1701,1774,1234,1349,1156,1773,1157,1182,1773,1180,1774,1104,1289,1774,1360,1359,1773,1025,1235,1769,1764,1787,1770,1766,1788,1738,1801,1697,1802,1736,1674,1802,1734,1455,1733,1801,1441,1710,1801,1711,1741,1801,1651,1802,1732,1549,1802,1744,1728,1676,1801,1569,1699,1801,1700,1802,1675,1613,1801,1713,1723,1802,1729,1742,1442,1801,1721,1802,1650,1649,1599,1801,1550,1709,1801,1677,1802,1597,1596,1802,1616,1653,1802,1457,1717,1802,1672,1673,1548,1802,1549,1802,1658,1660,1571,1801,1572,1698,1801,1723,1552,1801,1553,1368,1762,1369,1439,1760,1440,1788,1686,1685,1787,1727,1726,1767,1788,1685,1768,1787,1726,1083,1080,1085,1079,1084,1086,1069,1198,1075,1197,1070,1076,1022,1773,1018,1172,1773,1031,1613,1612,1802,1165,1773,1166,1653,1714,1802,1351,1773,1357,1649,1696,1802,1742,1731,1802,1801,1595,1594,1702,1774,1311,1355,1774,1352,1115,1774,1119,1801,1566,1569,1801,1551,1550,1801,1707,1700,1107,1774,1108,1338,1400,1752,1769,1688,1687,1764,1687,1754,1772,1368,1758,1703,1390,1786,1794,1376,1377,1798,1511,1258,1375,1390,1703,1338,1397,1400,1379,1202,1749,1770,1691,1690,1766,1690,1753,1771,1439,1757,1705,1178,1784,1796,1666,1262,1800,1536,1531,1175,1178,1705,1379,1199,1202,1018,1019,1020,1022,1023,1024,1026,1027,1028,1030,1031,1032,1038,1039,1040,1057,1058,1059,1066,1067,1068,1072,1073,1074,1078,1079,1080,1082,1078,1077,1102,1103,1104,1106,1107,1108,1110,1111,1112,1114,1115,1116,1118,1119,1120,1122,1123,1124,1145,1146,1147,1150,1151,1152,1154,1150,1149,1156,1157,1158,1160,1161,1162,1164,1165,1166,1167,1168,1169,1030,1171,1172,1174,1038,1037,1175,1176,1177,1180,1174,1173,1181,1182,1180,1184,1182,1181,1067,1197,1198,1200,1201,1202,1148,1147,1213,1105,1108,1218,1139,1223,1224,1217,1218,1111,1019,1184,1183,1040,1039,1172,1071,1074,1230,1163,1166,1232,1116,1115,1119,1233,1234,1123,1235,1236,1152,1237,1238,1027,1157,1154,1153,1243,1183,1181,1245,1153,1149,1248,1122,1121,1249,1155,1158,1244,1181,1179,1249,1250,1253,1254,1255,1256,1079,1086,1085,1258,1259,1260,1263,1264,1265,1197,1076,1075,1271,1272,1273,1089,1274,1275,1277,1278,1279,1284,1285,1286,1103,1288,1289,1291,1114,1113,1292,1293,1294,1297,1298,1299,1309,1310,1311,1313,1314,1315,1316,1317,1315,1316,1291,1290,1288,1309,1308,1319,1320,1321,1096,1095,1294,1324,1325,1326,1328,1329,1330,1328,1331,1333,1279,1334,1335,1336,1337,1338,1340,1341,1342,1117,1120,1349,1164,1029,1032,1231,1232,1351,1353,1354,1355,1350,1351,1357,1359,1360,1361,1018,1017,1023,1363,1353,1352,1109,1112,1359,1257,1256,1105,1319,1283,1282,1274,1323,1322,1327,1326,1241,1272,1216,1215,1100,1099,1059,1366,1367,1368,1370,1371,1372,1374,1375,1376,1337,1336,1378,1264,1263,1379,1381,1382,1383,1385,1386,1387,1375,1374,1389,1392,1393,1394,1168,1395,1396,1398,1399,1400,1025,1028,1236,1348,1349,1234,1161,1156,1155,1357,1160,1159,1121,1124,1355,1149,1152,1405,1159,1162,1407,1223,1365,1364,1408,1409,1284,1411,1412,1340,1394,1415,1416,1394,1414,1417,1254,1257,1419,1421,1406,1422,1424,1425,1426,1427,1428,1429,1298,1431,1432,1027,1238,1409,1309,1411,1413,1437,1438,1439,1442,1443,1444,1446,1447,1448,1449,1450,1255,1451,1452,1453,1455,1456,1296,1459,1460,1461,1462,1463,1451,1466,1467,1468,1020,1183,1243,1037,1040,1471,1356,1159,1406,1473,1474,1475,1476,1477,1478,1480,1481,1482,1407,1162,1155,1425,1109,1358,1483,1484,1485,1487,1488,1471,1491,1469,1492,1493,1494,1495,1459,1458,1498,1382,1499,1500,1502,1503,1474,1504,1505,1428,1507,1508,1509,1510,1398,1397,1512,1513,1514,1515,1487,1489,1405,1517,1518,1238,1520,1521,1255,1448,1522,1465,1468,1523,1525,1526,1527,1386,1528,1529,1531,1532,1533,1409,1521,1285,1535,1200,1199,1360,1537,1538,1017,1020,1469,1539,1540,1541,1383,1264,1380,1544,1491,1490,1253,1250,1245,1547,1548,1549,1453,1550,1551,1552,1553,1445,1329,1167,1170,1545,1555,1556,1410,1558,1547,1559,1560,1543,1562,1563,1564,1387,1336,1339,1567,1568,1569,1558,1570,1548,1572,1573,1574,1310,1413,1575,1279,1577,1578,1256,1522,1106,1580,1118,1117,1525,1524,1582,1517,1583,1557,1584,1585,1586,1462,1464,1423,1420,1562,1588,1542,1589,1590,1247,1121,1354,1236,1517,1405,1494,1493,1452,1592,1593,1288,1341,1594,1595,1496,1504,1568,1286,1596,1597,1598,1599,1550,1598,1567,1566,1425,1419,1110,1489,1471,1040,1600,1579,1117,1250,1158,1153,1173,1037,1470,1520,1024,1602,1583,1408,1410,1585,1603,1247,1472,1475,1371,1496,1495,1505,1575,1604,1363,1578,1577,1374,1593,1605,1412,1607,1459,1497,1540,1539,1608,1028,1027,1408,1610,1611,1163,1484,1515,1516,1613,1614,1615,1612,1615,1617,1447,1618,1522,1246,1405,1519,1619,1483,1486,1449,1254,1418,1621,1444,1513,1537,1313,1312,1614,1515,1484,1072,1622,1623,1466,1624,1430,1431,1488,1625,1626,1627,1252,1629,1630,1631,1288,1593,1411,1416,1415,1176,1495,1317,1290,1251,1179,1173,1514,1233,1122,1312,1591,1463,1602,1544,1543,1545,1245,1246,1468,1467,1580,1298,1601,1470,1507,1506,1633,1485,1516,1030,1562,1565,1610,1584,1587,1604,1447,1636,1637,1526,1200,1535,1509,1638,1639,1640,1438,1641,1229,1230,1481,1332,1333,1503,1460,1398,1510,1463,1591,1452,1420,1643,1563,1644,1574,1585,1427,1430,1624,1315,1494,1591,1419,1257,1217,1395,1367,1646,1430,1429,1580,1561,1543,1490,1621,1512,1603,1450,1445,1448,1648,1253,1545,1317,1495,1494,1164,1486,1485,1163,1611,1486,1649,1650,1563,1571,1574,1644,1653,1616,1617,1655,1656,1657,1647,1659,1660,1385,1661,1528,1479,1482,1663,1622,1664,1665,1531,1262,1666,1519,1518,1546,1636,1668,1669,1625,1488,1487,1377,1258,1511,1262,1531,1536,1432,1625,1673,1561,1647,1658,1673,1625,1671,1645,1624,1677,1451,1454,1678,1028,1583,1517,1366,1372,1646,1258,1377,1376,1680,1681,1682,1684,1685,1686,1328,1332,1687,1407,1249,1252,1470,1471,1488,1356,1421,1588,1573,1603,1585,1586,1354,1353,1176,1175,1666,1668,1636,1447,1243,1244,1631,1544,1023,1017,1429,1116,1118,1423,1464,1678,1664,1640,1642,1071,1229,1690,1381,1692,1499,1358,1361,1462,1693,1635,1343,1670,1669,1694,1670,1605,1593,1693,1644,1584,1555,1519,1667,1643,1695,1696,1697,1698,1669,1689,1678,1699,1701,1520,1238,1310,1576,1702,1514,1600,1348,1418,1419,1425,1244,1251,1297,1259,1703,1704,1532,1705,1706,1468,1579,1600,1598,1493,1496,1617,1615,1484,1557,1547,1546,1456,1631,1297,1637,1592,1103,1475,1474,1276,1437,1478,1641,1622,1684,1683,1504,1427,1645,1444,1443,1523,1576,1363,1362,1021,1024,1520,1472,1680,1679,1505,1290,1113,1251,1601,1298,1413,1340,1343,1608,1533,1706,1707,1708,1689,1677,1624,1466,1711,1449,1620,1712,1713,1594,1563,1650,1714,1420,1422,1695,1662,1663,1477,1715,1716,1107,1516,1489,1171,1671,1487,1515,1490,1492,1659,1296,1299,1717,1522,1618,1715,1637,1636,1670,1719,1525,1581,1102,1101,1716,1602,1024,1023,1663,1482,1391,1633,1260,1704,1452,1493,1598,1708,1424,1423,1620,1418,1424,1361,1538,1463,1386,1530,1720,1604,1587,1353,1721,1465,1443,1350,1588,1610,1565,1619,1611,1492,1630,1629,1722,1416,1632,1521,1602,1560,1723,1713,1712,1722,1501,1414,1167,1724,1725,1720,1530,1334,1382,1501,1722,1422,1406,1407,1492,1469,1243,1252,1253,1648,1724,1726,1727,1618,1637,1102,1603,1512,1248,1564,1714,1653,1720,1378,1336,1412,1712,1341,1422,1627,1626,1628,1648,1729,1722,1265,1264,1428,1113,1116,1720,1578,1373,1278,1730,1577,1410,1284,1287,1662,1655,1654,1577,1730,1389,1731,1556,1667,1565,1564,1652,1286,1285,1560,1169,1497,1498,1441,1444,1621,1629,1456,1455,1678,1454,1551,1372,1528,1661,1343,1635,1604,1513,1523,1600,1393,1735,1415,1665,1581,1582,1478,1499,1692,1596,1286,1559,1261,1737,1461,1553,1738,1446,1719,1381,1384,1384,1380,1201,1607,1385,1388,1651,1644,1693,1388,1339,1399,1742,1554,1556,1721,1709,1466,1717,1299,1432,1698,1723,1694,1287,1597,1570,1697,1668,1446,1707,1710,1620,1534,1743,1527,1694,1712,1412,1626,1628,1728,1660,1659,1629,1696,1695,1626,1415,1735,1177,1333,1331,1509,1652,1617,1483,1074,1542,1541,1743,1534,1533,1559,1561,1674,1737,1261,1260,1552,1450,1449,1648,1554,1742,1595,1741,1693,1667,1546,1549,1569,1568,1645,1613,1675,1671,1572,1733,1621,1460,1740,1399,1461,1737,1639,1539,1590,1743,1527,1743,1590,1506,1639,1737,1735,1393,1540,1730,1278,1507,1607,1740,1460,1526,1739,1201,1096,1293,1092,1093,1294,1095,1045,1273,1215,1241,1326,1204,1064,1320,1282,1283,1319,1061,1216,1272,1046,1100,1058,1013,1213,1147,1054,1016,1059,1099,1365,1223,1135,1136,1224,1364,1323,1274,1049,1053,1148,1214,1735,1609,1706,1719,1739,1526,1730,1634,1704,1294,1093,1208,1293,1292,1207,1326,1325,1205,1147,1146,1055,1058,1057,1014,1059,1016,1015,1274,1089,1050,1148,1053,1056,1273,1045,1048,1320,1064,1063,1272,1271,1047,1319,1318,1062,1224,1136,1138,1223,1139,1137,1606,1396,1646,1482,1481,1392,1479,1654,1753,1718,1642,1641,1477,1663,1417,1371,1475,1335,1474,1503,1277,1473,1679,1754,1370,1366,1369,1477,1500,1499,1371,1529,1528,1472,1370,1755,1476,1437,1440,1438,1640,1757,1367,1395,1758,1662,1476,1756,1655,1756,1759,1756,1440,1760,1680,1755,1761,1755,1369,1762,1167,1329,1763,1329,1328,1688,1679,1682,1764,1072,1071,1691,1622,1072,1765,1170,1498,1638,1623,1582,1589,1330,1638,1509,1654,1657,1766,1073,1589,1542,1229,1480,1753,1664,1683,1757,1332,1502,1754,1168,1725,1758,1684,1765,1767,1724,1763,1768,1763,1688,1769,1765,1691,1770,1259,1376,1375,1532,1666,1175,1263,1536,1199,1337,1511,1397,1169,1396,1606,1665,1642,1718,1541,1392,1481,1508,1277,1503,1683,1686,1771,1725,1727,1772,1069,1065,1068,1083,1081,1077,1078,1082,1084,1067,1066,1070,1021,1701,1773,1774,1115,1114,1774,1702,1362,1774,1349,1120,1174,1180,1773,1039,1038,1773,1774,1107,1716,1151,1150,1773,1154,1157,1773,1160,1357,1773,1774,1359,1112,1232,1166,1773,1774,1355,1124,1019,1018,1773,1774,1291,1316,1032,1031,1773,1774,1111,1218,1774,1314,1313,1774,1289,1308,1237,1026,1773,1774,1123,1234,1156,1161,1773,1182,1184,1773,1774,1101,1104,1774,1537,1360,1773,1026,1025,1769,1687,1764,1770,1690,1766,1738,1553,1801,1802,1596,1736,1802,1660,1734,1733,1572,1801,1710,1707,1801,1741,1595,1801,1802,1731,1732,1802,1696,1744,1676,1677,1801,1699,1551,1801,1802,1673,1675,1801,1594,1713,1802,1728,1729,1442,1441,1801,1802,1714,1650,1599,1566,1801,1709,1721,1801,1802,1570,1597,1802,1612,1616,1802,1455,1457,1802,1717,1672,1548,1570,1802,1802,1674,1658,1571,1651,1801,1698,1697,1801,1552,1711,1801,1368,1772,1762,1439,1771,1760,1788,1771,1686,1787,1772,1727,1767,1770,1788,1768,1769,1787,2430,2273,2427,2416,2366,2433,2430,2427,2434,2416,2433,2438,1877,1938,1849,1862,1905,2002,2440,1849,1938,2440,2002,1905,2430,2431,2273,2416,2431,2366,1803,1805,1806,1807,1805,1804,1809,1811,1812,1814,1816,1813,1817,1819,1820,1821,1811,1810,1823,1816,1824,1824,1825,1826,1827,1829,1830,1832,1834,1831,1836,1838,1835,1839,1841,1842,1832,1844,1833,1846,1848,1845,1850,1852,1849,1853,1855,1856,1858,1860,1857,1851,1831,1861,1862,1843,1822,1865,1867,1864,1868,1870,1871,1872,1874,1825,1828,1876,1829,1877,1872,1815,1880,1882,1879,1883,1881,1880,1826,1874,1885,1860,1886,1887,1819,1889,1820,1815,1825,1816,1844,1891,1833,1834,1891,1892,1873,1894,1874,1896,1898,1895,1896,1900,1897,1812,1832,1831,1822,1832,1811,1809,1851,1850,1901,1903,1904,1821,1862,1822,1907,1909,1906,1910,1867,1911,1912,1870,1869,1914,1826,1915,1830,1916,1917,1918,1913,1912,1920,1911,1921,1884,1923,1881,1924,1925,1926,1927,1929,1930,1932,1934,1931,1895,1837,1836,1885,1894,1935,1927,1937,1936,1899,1842,1900,1938,1815,1814,1939,1824,1914,1892,1940,1941,1893,1943,1894,1890,1940,1891,1945,1806,1946,1947,1808,1807,1805,1949,1950,1935,1943,1951,1805,1952,1806,1953,1955,1956,1958,1960,1957,1829,1961,1916,1881,1962,1882,1964,1966,1963,1964,1968,1965,1969,1971,1972,1941,1973,1974,1944,1973,1940,1969,1977,1976,1951,1978,1979,1942,1978,1943,1981,1859,1858,1831,1983,1861,1984,1820,1985,1843,1986,1844,1987,1915,1988,1989,1878,1877,1875,1992,1876,1879,1994,1993,1915,1885,1995,1981,1945,1982,1924,1884,1883,1878,1873,1872,1984,1947,1998,1897,2000,1898,1897,2001,1999,2002,1914,1987,2004,1804,2003,1972,2005,2006,1972,2007,1977,2008,2010,2011,2008,2013,2012,2014,1848,2015,1852,1861,1925,1931,1863,1862,2016,1855,1854,1980,2019,1978,1979,2019,2020,1975,2022,1973,1974,2022,2023,2024,1804,1803,1932,1830,1933,2023,2025,2026,2006,1936,2007,2021,2025,2022,1991,1988,1992,2006,1928,1927,1993,1990,1989,1863,2028,1986,2030,2032,2029,1923,2034,1962,1916,2035,2036,1995,1935,2037,1922,2033,1923,1917,2036,2039,1887,2040,1865,1837,2042,1838,1842,2043,2044,1861,2045,1925,2018,2047,2019,2020,2047,2048,2038,2050,2033,2039,2051,2052,2011,2053,2054,2055,1954,1953,2058,1957,2057,2011,2059,2013,2061,2008,2060,2062,2008,2012,2063,2065,2066,2067,2065,2064,1888,2069,1889,1988,1995,2070,2036,2071,2051,2033,2072,2034,2073,2003,2024,2026,2075,2076,1954,2077,1955,2046,2064,2047,2048,2064,2063,2027,2075,2025,1957,2079,1847,1925,2080,1926,1997,1893,1873,2083,2085,2082,2078,2082,2075,2076,2082,2086,2086,2085,2087,1990,1997,1878,2090,2092,2089,2093,2003,2074,2091,2060,2092,1933,1917,2094,2095,2060,2062,1838,2097,2096,2099,2074,2098,2101,2103,2100,2104,1941,2105,1841,2107,2043,2108,2089,2109,2110,1953,2111,2112,1958,2058,2114,1944,1890,2116,2118,2119,2120,2074,2073,2121,2103,2108,1835,2096,2122,1986,1890,1844,1934,2094,2028,2066,2100,2121,1983,1892,2104,2068,2100,2065,2109,2092,2095,2102,2089,2103,2087,2098,2120,2111,1956,2123,2084,2098,2085,1840,2106,1841,2045,2104,2125,1994,2088,1990,2113,1959,1958,1847,2128,1848,1926,1922,1884,1856,2129,2077,1970,1904,1971,1976,1908,1907,2028,2114,1986,1876,2131,1961,1965,1895,1966,2049,2133,2050,1965,1899,1896,2052,2134,2135,2080,2038,1922,2050,2137,2072,2051,2138,2134,2139,2141,2142,1999,2140,2139,1999,2143,2000,1992,2070,2131,2139,2144,2143,1996,1803,1945,1936,2127,2113,2081,1942,1893,2037,1951,2146,1967,2148,1968,2088,2081,1997,1928,2123,1929,1900,2044,2001,1898,2041,1837,1963,2151,2150,1962,2152,2126,1998,1807,2004,1882,2126,1994,2070,2037,2153,2094,2039,2154,2005,2111,1928,2007,2113,2112,2134,2155,2156,2134,2157,2135,1961,2158,2035,2145,1980,1942,1982,1946,2160,2161,2032,2162,2163,2165,2166,1985,1948,1947,2146,1979,2168,2124,2015,2106,2017,2129,1855,2133,2170,2137,2163,2171,2170,2133,2164,2163,1806,2172,1946,1808,2173,1949,2105,1974,2174,2028,2154,2130,2045,2136,2080,2176,2178,2175,2115,1975,1944,2180,2182,2183,1857,2185,2184,1818,2187,1819,1902,2189,1903,1906,2191,2190,2122,2017,2016,2131,2153,2158,2126,2149,2088,2192,2118,2117,2015,2128,2194,2195,2197,2198,2195,2200,2199,2153,2146,2201,2202,1868,1888,2203,1865,1864,2156,2205,2157,2206,2119,2207,2168,2020,2208,2179,2021,1975,2156,2210,2204,2130,2115,2114,2149,2145,2081,2159,2018,1980,2174,2023,2214,2125,2105,2215,2150,2217,2216,2147,2219,2148,2054,1963,2059,2054,1967,1964,2220,2031,2030,2154,2052,2222,2035,2223,2071,2218,2225,2219,2216,2227,2226,2204,2228,2229,2166,2231,2171,2175,2233,2232,2181,2235,2182,1950,2237,1952,1950,2238,2236,2204,2239,2205,2185,1887,2203,2166,2240,2230,1930,2196,2195,1930,2199,1937,2034,2241,2152,2136,2049,2038,2226,2177,2176,2243,1919,1918,2224,2183,2225,2130,2222,2211,2125,2242,2136,1820,2167,1985,2187,1888,1819,2245,1921,2246,2248,2184,2247,2249,2186,1818,2057,1847,1846,2056,1856,1954,1859,2160,1886,2158,2201,2223,2152,2212,2149,2229,2251,2252,2229,2253,2239,2208,2048,2254,2214,2026,2255,2209,2027,2021,2213,2046,2018,2013,2259,2258,2215,2174,2260,2010,2262,2053,2211,2179,2115,2264,2004,2093,2212,2159,2145,2201,2168,2266,2267,2024,1996,1977,2112,1908,2230,2268,2269,2230,2270,2231,1971,2110,2005,2271,2273,2274,2271,2276,2275,2254,2063,2277,2257,2067,2046,2252,2280,2253,2269,2281,2282,2242,2132,2049,2252,2284,2279,2269,2285,2270,2255,2076,2286,2256,2078,2027,2072,2288,2241,2279,2290,2280,2279,2291,2289,2012,2258,2292,2009,2261,2010,2222,2135,2294,1948,2295,2173,1946,2296,2160,2282,2297,2298,2071,2299,2138,2282,2300,2285,2298,2301,2300,2289,2302,2250,2261,2246,2262,2286,2086,2303,2287,2083,2078,2289,2249,2290,2298,2248,2247,2258,2244,2243,2106,2194,2107,2160,2040,1886,2167,2069,2295,2305,2090,2102,2278,2068,2067,2277,2066,2308,2211,2294,2263,2309,2109,2310,2311,2099,2084,2215,2283,2242,2313,2120,2314,2096,2169,2017,2307,2101,2068,2304,2084,2083,2308,2121,2316,2303,2087,2313,2317,2221,2220,2314,2073,2267,2265,2213,2159,2312,2093,2099,2143,2321,2320,2316,2108,2309,2236,1970,1969,2236,1976,2237,2315,2102,2101,2223,2266,2299,2266,2208,2322,2323,2009,2061,2324,2012,2292,2140,2326,2141,2327,2207,2328,2260,2214,2329,2241,2265,2212,2263,2209,2179,2250,2331,2186,2247,2332,2301,2333,1998,2264,2334,1996,1981,2132,2335,2164,2310,2095,2336,1968,1839,1899,1966,1836,2151,2306,2091,2090,2137,2338,2288,2135,2339,2294,2249,1817,2340,2248,1858,1857,2138,2342,2155,2069,1871,2343,2340,1984,2333,2341,1981,1858,2330,2256,2209,2329,2255,2345,2319,2257,2213,2322,2254,2347,2040,1866,1865,2299,2322,2342,2288,2319,2265,2283,2329,2335,2294,2330,2263,2336,2062,2324,2337,2061,2091,2001,2325,2140,2325,2328,2326,2000,2320,2041,2190,2235,2234,2188,2233,2189,2320,2318,2317,2142,2275,2144,2157,2349,2339,2155,2350,2210,2142,2272,2271,2345,2286,2351,2344,2287,2256,2353,1869,2202,2354,1864,1910,2186,2355,2187,2184,2356,2332,2170,2357,2338,2164,2358,2165,2346,2278,2257,2347,2277,2360,2362,2364,2361,2362,2366,2363,2338,2346,2319,2359,2307,2278,2360,2308,2368,2342,2347,2350,2335,2345,2358,2351,2303,2369,2352,2304,2287,2339,2344,2330,2367,2315,2307,2370,2311,2304,2368,2316,2373,2165,2374,2240,2205,2375,2349,2369,2313,2376,2171,2377,2357,2210,2378,2228,2379,2264,2312,1866,2181,1867,2380,2267,2334,1871,2175,2232,2376,2314,2380,2371,2305,2315,2373,2309,2382,2382,2310,2383,2372,2312,2311,2381,2306,2305,2350,2360,2378,2182,2014,2183,2178,2016,1854,2357,2359,2346,2349,2352,2344,2356,2203,2354,2358,2351,2374,2151,1835,2217,2148,1840,1839,2355,2202,2187,2231,2385,2377,2240,2386,2268,1949,2387,2238,2239,2388,2375,2228,2389,2251,1952,2390,2172,2199,2392,2391,2196,2394,2197,1937,2391,2127,1929,2393,2196,2374,2369,2386,2375,2370,2352,2293,2245,2261,2292,2243,2396,2377,2367,2359,2378,2368,2389,2270,2397,2385,1908,2058,1909,1904,2055,2110,2398,2162,2399,2268,2400,2281,2253,2401,2388,2059,2150,2259,2053,2147,1967,2402,2193,2192,2251,2404,2284,2281,2405,2297,2291,2407,2302,2284,2406,2291,2300,2409,2408,2285,2408,2397,2280,2410,2401,2198,2365,2362,2198,2361,2200,2235,1845,2182,2386,2376,2400,2233,1854,1853,1911,2181,2180,2389,2373,2404,2297,2341,2248,2290,2340,2410,2383,2336,2411,2385,2371,2367,2388,2372,2370,2401,2379,2372,2384,2337,2306,2405,2334,2341,2408,2384,2381,1913,2175,1870,2397,2381,2371,2404,2382,2406,2410,2333,2379,2406,2383,2407,2400,2380,2405,2077,2029,2161,2079,2117,2128,2169,2029,2129,2194,2117,2116,2295,2343,2413,2296,2348,2040,2217,2122,2227,2275,2416,2415,2219,2124,1840,2417,2293,2323,2418,2292,2396,2172,2414,2296,2173,2413,2387,2412,2323,2337,2411,2324,2418,2044,2327,2325,2041,2317,2042,2127,2419,1959,2393,2421,2394,2391,2422,2419,2123,2420,2393,2225,2014,2124,2227,2016,2177,2237,1907,2390,2238,1901,1970,2302,2423,2331,2301,2424,2409,2409,2412,2384,2407,2411,2423,2419,2403,2402,2420,2399,2421,2395,1920,2245,2396,1918,2426,1956,2398,2420,1959,2402,1960,2259,2216,2244,2262,2218,2147,1909,2057,2191,1903,2056,2055,2426,1912,2353,2425,1910,1920,1960,2192,2079,1955,2161,2398,2343,2232,2188,2348,2234,1866,2144,2415,2321,2141,2427,2272,2332,2428,2424,2331,2429,2355,2423,2418,2429,2424,2417,2412,2418,2426,2429,2417,2425,2395,2387,1902,1901,2043,2206,2327,2390,1906,2414,2042,2220,2097,2189,1853,2056,2191,1846,2235,2361,2430,2432,2246,2224,2218,2244,2226,1919,2414,2190,2348,2429,2353,2355,2428,2354,2425,2413,2188,1902,1921,2180,2224,1919,2176,1913,2097,2030,2169,2107,2116,2206,2200,2432,2392,2197,2433,2365,2326,2434,2427,2321,2435,2318,2318,2436,2221,2392,2437,2422,2394,2438,2433,2422,2439,2403,1810,2440,1821,1850,2440,1809,1931,2002,1932,1989,1849,1993,2440,1813,1823,2430,2437,2432,2416,2435,2415,1827,2002,1828,1879,1849,1880,1924,1849,1852,1939,2440,1823,2439,2434,2207,2436,2438,2399,2436,2162,2032,2439,2119,2118,1991,2002,1987,2439,2193,2403,2436,2031,2221,2431,2430,2364,2431,2416,2276,2273,2272,2427,2366,2365,2433,2434,2328,2207,2438,2421,2399,1849,1883,1880,2002,1875,1828,2440,1938,1814,2440,1905,1821,2276,2274,2431,2431,2363,2366,2274,2273,2431,2431,2364,2363,1803,1804,1805,1807,1808,1805,1809,1810,1811,1814,1815,1816,1817,1818,1819,1821,1822,1811,1823,1813,1816,1824,1816,1825,1827,1828,1829,1832,1833,1834,1836,1837,1838,1839,1840,1841,1832,1843,1844,1846,1847,1848,1850,1851,1852,1853,1854,1855,1858,1859,1860,1851,1812,1831,1862,1863,1843,1865,1866,1867,1868,1869,1870,1872,1873,1874,1828,1875,1876,1877,1878,1872,1880,1881,1882,1883,1884,1881,1826,1825,1874,1860,1859,1886,1819,1888,1889,1815,1872,1825,1844,1890,1891,1834,1833,1891,1873,1893,1894,1896,1897,1898,1896,1899,1900,1812,1811,1832,1822,1843,1832,1809,1812,1851,1901,1902,1903,1821,1905,1862,1907,1908,1909,1910,1864,1867,1912,1913,1870,1914,1824,1826,1830,1829,1916,1918,1919,1913,1920,1910,1911,1884,1922,1923,1924,1852,1925,1927,1928,1929,1932,1933,1934,1895,1898,1837,1885,1874,1894,1927,1930,1937,1899,1839,1842,1938,1877,1815,1939,1823,1824,1892,1891,1940,1893,1942,1943,1890,1944,1940,1945,1803,1806,1947,1948,1808,1805,1808,1949,1935,1894,1943,1805,1950,1952,1953,1954,1955,1958,1959,1960,1829,1876,1961,1881,1923,1962,1964,1965,1966,1964,1967,1968,1969,1970,1971,1941,1940,1973,1944,1975,1973,1969,1972,1977,1951,1943,1978,1942,1980,1978,1981,1982,1859,1831,1834,1983,1984,1817,1820,1843,1863,1986,1987,1914,1915,1989,1990,1878,1875,1991,1992,1879,1882,1994,1915,1826,1885,1981,1996,1945,1924,1926,1884,1878,1997,1873,1984,1985,1947,1897,1999,2000,1897,1900,2001,2002,1939,1914,2004,1807,1804,1972,1971,2005,1972,2006,2007,2008,2009,2010,2008,2011,2013,2014,1845,1848,1852,1851,1861,1931,1934,1863,2016,2017,1855,1980,2018,2019,1979,1978,2019,1975,2021,2022,1974,1973,2022,2024,2003,1804,1932,1827,1830,2023,2022,2025,2006,1927,1936,2021,2027,2025,1991,1987,1988,2006,2005,1928,1993,1994,1990,1863,1934,2028,2030,2031,2032,1923,2033,2034,1916,1961,2035,1995,1885,1935,1922,2038,2033,1917,1916,2036,1887,1886,2040,1837,2041,2042,1842,1841,2043,1861,1983,2045,2018,2046,2047,2020,2019,2047,2038,2049,2050,2039,2036,2051,2011,2010,2053,2055,2056,1954,2058,1958,1957,2011,2054,2059,2061,2009,2008,2062,2060,2008,2063,2064,2065,2067,2068,2065,1888,1868,2069,1988,1915,1995,2036,2035,2071,2033,2050,2072,2073,2074,2003,2026,2025,2075,1954,1856,2077,2046,2067,2064,2048,2047,2064,2027,2078,2075,1957,1960,2079,1925,2045,2080,1997,2081,1893,2083,2084,2085,2078,2083,2082,2076,2075,2082,2086,2082,2085,1990,2088,1997,2090,2091,2092,2093,2004,2003,2091,2061,2060,1933,1830,1917,2095,2092,2060,1838,2042,2097,2099,2093,2074,2101,2102,2103,2104,1892,1941,1841,2106,2107,2108,2103,2089,2110,2055,1953,2112,2113,1958,2114,2115,1944,2116,2117,2118,2120,2098,2074,2121,2100,2103,1835,1838,2096,1986,2114,1890,1934,1933,2094,2066,2065,2100,1983,1834,1892,2068,2101,2100,2109,2089,2092,2102,2090,2089,2087,2085,2098,2111,1953,1956,2084,2099,2098,1840,2124,2106,2045,1983,2104,1994,2126,2088,2113,2127,1959,1847,2079,2128,1926,2080,1922,1856,1855,2129,1970,1901,1904,1976,1977,1908,2028,2130,2114,1876,1992,2131,1965,1896,1895,2049,2132,2133,1965,1968,1899,2052,2051,2134,2080,2136,2038,2050,2133,2137,2051,2071,2138,2139,2140,2141,1999,2001,2140,1999,2139,2143,1992,1988,2070,2139,2142,2144,1996,2024,1803,1936,1937,2127,2081,2145,1942,2037,1935,1951,1967,2147,2148,2088,2149,2081,1928,2111,2123,1900,1842,2044,1898,2000,2041,1963,1966,2151,1962,2034,2152,1998,1947,1807,1882,1962,2126,2070,1995,2037,2094,1917,2039,2005,2110,2111,2007,1936,2113,2134,2138,2155,2134,2156,2157,1961,2131,2158,2145,2159,1980,1982,1945,1946,2161,2029,2032,2163,2164,2165,1985,2167,1948,2146,1951,1979,2124,2014,2015,2017,2169,2129,2133,2163,2170,2163,2166,2171,2133,2132,2164,1806,1952,2172,1808,1948,2173,2105,1941,1974,2028,2094,2154,2045,2125,2136,2176,2177,2178,2115,2179,1975,2180,2181,2182,1857,1860,2185,1818,2186,2187,1902,2188,2189,1906,1909,2191,2122,2096,2017,2131,2070,2153,2126,2152,2149,2192,2193,2118,2015,1848,2128,2195,2196,2197,2195,2198,2200,2153,2037,2146,2202,1869,1868,2203,1887,1865,2156,2204,2205,2206,2116,2119,2168,1979,2020,2179,2209,2021,2156,2155,2210,2130,2211,2115,2149,2212,2145,2159,2213,2018,2174,1974,2023,2125,2104,2105,2150,2151,2217,2147,2218,2219,2054,1964,1963,2054,2053,1967,2220,2221,2031,2154,2039,2052,2035,2158,2223,2218,2224,2225,2216,2217,2227,2204,2210,2228,2166,2230,2231,2175,2178,2233,2181,2234,2235,1950,2236,2237,1950,1949,2238,2204,2229,2239,2185,1860,1887,2166,2165,2240,1930,1929,2196,1930,2195,2199,2034,2072,2241,2136,2242,2049,2226,2227,2177,2243,2244,1919,2224,2180,2183,2130,2154,2222,2125,2215,2242,1820,1889,2167,2187,2202,1888,2245,1920,1921,2248,1857,2184,2249,2250,2186,2057,1957,1847,2056,1853,1856,1859,1982,2160,2158,2153,2201,2152,2241,2212,2229,2228,2251,2229,2252,2253,2208,2020,2048,2214,2023,2026,2209,2256,2027,2213,2257,2046,2013,2059,2259,2215,2105,2174,2010,2261,2262,2211,2263,2179,2264,1998,2004,2212,2265,2159,2201,2146,2168,2267,2073,2024,1977,2007,2112,2230,2240,2268,2230,2269,2270,1971,1904,2110,2271,2272,2273,2271,2274,2276,2254,2048,2063,2257,2278,2067,2252,2279,2280,2269,2268,2281,2242,2283,2132,2252,2251,2284,2269,2282,2285,2255,2026,2076,2256,2287,2078,2072,2137,2288,2279,2289,2290,2279,2284,2291,2012,2013,2258,2009,2293,2261,2222,2052,2135,1948,2167,2295,1946,2172,2296,2282,2281,2297,2071,2223,2299,2282,2298,2300,2298,2247,2301,2289,2291,2302,2261,2245,2246,2286,2076,2086,2287,2304,2083,2289,2250,2249,2298,2297,2248,2258,2259,2244,2106,2015,2194,2160,2296,2040,2167,1889,2069,2305,2306,2090,2278,2307,2068,2277,2063,2066,2211,2222,2294,2309,2108,2109,2311,2312,2099,2215,2260,2283,2313,2087,2120,2096,2097,2169,2307,2315,2101,2304,2311,2084,2308,2066,2121,2303,2086,2087,2317,2318,2221,2314,2120,2073,2265,2319,2213,2312,2264,2093,2143,2144,2321,2316,2121,2108,2236,2238,1970,2236,1969,1976,2315,2305,2102,2223,2201,2266,2266,2168,2208,2323,2293,2009,2324,2062,2012,2140,2325,2326,2327,2206,2207,2260,2174,2214,2241,2288,2265,2263,2330,2209,2250,2302,2331,2247,2184,2332,2333,1984,1998,2334,2267,1996,2132,2283,2335,2310,2109,2095,1968,2148,1839,1966,1895,1836,2306,2337,2091,2137,2170,2338,2135,2157,2339,2249,1818,1817,2248,2341,1858,2138,2299,2342,2069,1868,1871,2340,1817,1984,2341,2334,1981,2330,2344,2256,2329,2214,2255,2319,2346,2257,2322,2208,2254,2040,2348,1866,2299,2266,2322,2288,2338,2319,2283,2260,2329,2294,2339,2330,2336,2095,2062,2337,2323,2061,2001,2044,2325,2325,2327,2328,2000,2143,2320,2190,2191,2235,2188,2232,2233,2320,2321,2318,2142,2271,2275,2157,2205,2349,2155,2342,2350,2142,2141,2272,2345,2255,2286,2344,2352,2287,2353,1912,1869,2354,2203,1864,2186,2331,2355,2184,2185,2356,2170,2171,2357,2164,2335,2358,2346,2359,2278,2347,2254,2277,2362,2363,2364,2362,2365,2366,2338,2357,2346,2359,2367,2307,2360,2277,2308,2342,2322,2347,2335,2329,2345,2351,2286,2303,2352,2370,2304,2339,2349,2344,2367,2371,2315,2370,2372,2311,2368,2308,2316,2165,2358,2374,2205,2239,2375,2369,2303,2313,2171,2231,2377,2210,2350,2378,2379,2333,2264,1866,2234,2181,2380,2314,2267,1871,1870,2175,2376,2313,2314,2371,2381,2305,2373,2316,2309,2382,2309,2310,2372,2379,2312,2381,2384,2306,2350,2347,2360,2182,1845,2014,2178,2177,2016,2357,2377,2359,2349,2375,2352,2356,2185,2203,2358,2345,2351,2151,1836,1835,2148,2219,1840,2355,2353,2202,2231,2270,2385,2240,2374,2386,1949,2173,2387,2239,2253,2388,2228,2378,2389,1952,2237,2390,2199,2200,2392,2196,2393,2394,1937,2199,2391,1929,2123,2393,2374,2351,2369,2375,2388,2370,2293,2395,2245,2292,2258,2243,2377,2385,2367,2378,2360,2368,2270,2285,2397,1908,2112,2058,1904,1903,2055,2398,2161,2162,2268,2386,2400,2253,2280,2401,2059,1963,2150,2053,2262,2147,2402,2403,2193,2251,2389,2404,2281,2400,2405,2291,2406,2407,2284,2404,2406,2300,2301,2409,2285,2300,2408,2280,2290,2410,2198,2197,2365,2198,2362,2361,2235,1846,1845,2386,2369,2376,2233,2178,1854,1911,1867,2181,2389,2368,2373,2297,2405,2341,2290,2249,2340,2383,2310,2336,2385,2397,2371,2388,2401,2372,2401,2410,2379,2384,2412,2337,2405,2380,2334,2408,2409,2384,1913,2176,2175,2397,2408,2381,2404,2373,2382,2410,2340,2333,2406,2382,2383,2400,2376,2380,2077,2129,2029,2079,2192,2117,2169,2030,2029,2194,2128,2117,2295,2069,2343,2296,2414,2348,2217,1835,2122,2275,2276,2416,2219,2225,2124,2417,2395,2293,2418,2324,2292,2172,2390,2414,2173,2295,2413,2412,2417,2323,2411,2336,2324,2044,2043,2327,2041,2320,2317,2127,2391,2419,2393,2420,2421,2391,2392,2422,2123,1956,2420,2225,2183,2014,2227,2122,2016,2237,1976,1907,2238,2387,1901,2302,2407,2423,2301,2332,2424,2409,2424,2412,2407,2383,2411,2419,2422,2403,2420,2398,2399,2395,2425,1920,2396,2243,1918,1956,1955,2398,1959,2419,2402,2259,2150,2216,2262,2246,2218,1909,2058,2057,1903,2189,2056,2426,1918,1912,2425,2354,1910,1960,2402,2192,1955,2077,2161,2343,1871,2232,2348,2190,2234,2144,2275,2415,2141,2326,2427,2332,2356,2428,2331,2423,2429,2423,2411,2418,2424,2428,2417,2418,2396,2426,2417,2428,2425,2387,2413,1902,2043,2107,2206,2390,1907,1906,2042,2317,2220,2189,2233,1853,2191,2057,1846,2361,2364,2430,2246,1921,2224,2244,2216,2226,2414,1906,2190,2429,2426,2353,2428,2356,2354,2413,2343,2188,1921,1911,2180,1919,2226,2176,2097,2220,2030,2107,2194,2116,2200,2361,2432,2197,2394,2433,2326,2328,2434,2321,2415,2435,2318,2435,2436,2392,2432,2437,2394,2421,2438,2422,2437,2439,1810,1809,2440,1850,1849,2440,1931,1862,2002,1989,1877,1849,2440,1814,1813,2430,2439,2437,2416,2436,2435,1827,1932,2002,1879,1993,1849,1924,1883,1849,1939,2002,2440,2439,2430,2434,2436,2416,2438,2436,2399,2162,2439,2207,2119,1991,1875,2002,2439,2118,2193,2436,2032,2031]}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {"vertices":[{"x":-0.068299,"y":-0.012056,"z":-0.004591},{"x":-0.068525,"y":-0.005406,"z":-0.012251},{"x":-0.064052,"y":-0.012598,"z":-0.014347},{"x":-0.055768,"y":0.031529,"z":0.044722},{"x":-0.06163,"y":0.027832,"z":0.042526},{"x":-0.055096,"y":0.026321,"z":0.039957},{"x":-0.034954,"y":0.031979,"z":-0.022985},{"x":-0.038456,"y":0.023834,"z":-0.027304},{"x":-0.047605,"y":0.027236,"z":-0.022685},{"x":0.043439,"y":-0.029232,"z":-0.027578},{"x":0.04182,"y":-0.036145,"z":-0.028203},{"x":0.036717,"y":-0.033639,"z":-0.033982},{"x":-0.029491,"y":0.082052,"z":-0.006989},{"x":-0.040923,"y":0.071875,"z":-0.00086},{"x":-0.036353,"y":0.069932,"z":0.001201},{"x":0.047787,"y":0.028857,"z":0.011455},{"x":0.052105,"y":0.020373,"z":0.015567},{"x":0.052554,"y":0.022809,"z":0.004829},{"x":0.012459,"y":-0.03476,"z":0.045393},{"x":0.00148,"y":-0.036985,"z":0.04092},{"x":0.013537,"y":-0.038718,"z":0.041531},{"x":-0.068511,"y":-0.008897,"z":0.01445},{"x":-0.071733,"y":-0.007283,"z":0.009196},{"x":-0.067756,"y":-0.012199,"z":0.006393},{"x":-0.048113,"y":0.042054,"z":0.032571},{"x":-0.051938,"y":0.044347,"z":0.035792},{"x":-0.05728,"y":0.045946,"z":0.041329},{"x":0.032814,"y":0.016992,"z":0.035653},{"x":0.041297,"y":0.007613,"z":0.035627},{"x":0.045251,"y":0.01467,"z":0.028694},{"x":-0.006282,"y":0.095143,"z":-0.023457},{"x":-0.014288,"y":0.09306,"z":-0.01598},{"x":-0.021231,"y":0.084522,"z":-0.008864},{"x":-0.040539,"y":0.073995,"z":-0.009652},{"x":-0.031844,"y":0.082575,"z":-0.011494},{"x":-0.022646,"y":0.087572,"z":-0.020009},{"x":-0.057361,"y":0.059078,"z":-0.031633},{"x":-0.056608,"y":0.063283,"z":-0.051612},{"x":-0.052282,"y":0.058994,"z":-0.031321},{"x":-0.061184,"y":0.062333,"z":-0.028856},{"x":-0.060236,"y":0.065194,"z":-0.038989},{"x":-0.0596,"y":0.06216,"z":-0.042884},{"x":-0.074392,"y":0.061931,"z":0.000609},{"x":-0.068437,"y":0.064993,"z":-0.004231},{"x":-0.066706,"y":0.06185,"z":-0.008431},{"x":-0.045195,"y":0.069829,"z":-0.003487},{"x":-0.040002,"y":0.067335,"z":0.005669},{"x":-0.078877,"y":0.030961,"z":0.025766},{"x":-0.075097,"y":0.025319,"z":0.025756},{"x":-0.07537,"y":0.025438,"z":0.03066},{"x":-0.063121,"y":0.069105,"z":0.008183},{"x":-0.059652,"y":0.068601,"z":-0.006008},{"x":-0.07173,"y":0.06666,"z":0.010611},{"x":0.054136,"y":-0.048148,"z":-0.004613},{"x":0.047022,"y":-0.051749,"z":0.000658},{"x":0.045949,"y":-0.048888,"z":-0.009585},{"x":-0.022703,"y":0.027846,"z":-0.024948},{"x":-0.032912,"y":0.020588,"z":-0.028258},{"x":0.067325,"y":-0.01318,"z":0.003167},{"x":0.071962,"y":-0.015382,"z":0.000515},{"x":0.064412,"y":-0.015793,"z":-0.004548},{"x":0.057201,"y":-0.038627,"z":0.023187},{"x":0.045106,"y":-0.046609,"z":0.018727},{"x":0.05683,"y":-0.042893,"z":0.018598},{"x":-0.01004,"y":-0.015643,"z":-0.046429},{"x":-0.014777,"y":-0.020069,"z":-0.039251},{"x":-0.016582,"y":-0.011982,"z":-0.04167},{"x":0.024651,"y":-0.052599,"z":-0.028854},{"x":-0.027993,"y":-0.053236,"z":-0.035286},{"x":-0.014737,"y":-0.05353,"z":-0.036597},{"x":-0.05378,"y":0.080307,"z":-0.06374},{"x":-0.051636,"y":0.092173,"z":-0.069224},{"x":-0.052477,"y":0.073855,"z":-0.066444},{"x":-0.062126,"y":0.077708,"z":-0.028973},{"x":-0.058365,"y":0.076564,"z":-0.022692},{"x":-0.059785,"y":0.087383,"z":-0.048566},{"x":-0.036536,"y":0.066177,"z":-0.01386},{"x":-0.024823,"y":0.065537,"z":-0.016374},{"x":-0.036782,"y":0.059573,"z":-0.010844},{"x":-0.04212,"y":0.066569,"z":0.019057},{"x":-0.046059,"y":0.068883,"z":0.005612},{"x":-0.054775,"y":0.073187,"z":-0.017546},{"x":-0.055017,"y":0.068598,"z":-0.006602},{"x":-0.051995,"y":0.068526,"z":-0.013592},{"x":-0.049618,"y":0.067769,"z":-0.004404},{"x":-0.049036,"y":0.064876,"z":-0.01418},{"x":-0.048196,"y":0.061693,"z":-0.020433},{"x":-0.047151,"y":0.070796,"z":-0.035258},{"x":-0.015347,"y":0.038093,"z":-0.006408},{"x":-0.024578,"y":0.038497,"z":-0.015053},{"x":-0.023389,"y":0.040779,"z":-0.007993},{"x":-0.01151,"y":0.039013,"z":0.004765},{"x":0.001378,"y":0.042061,"z":-0.004365},{"x":-0.047733,"y":0.082257,"z":-0.070291},{"x":-0.066324,"y":0.041561,"z":-0.014494},{"x":-0.061433,"y":0.033191,"z":-0.016451},{"x":-0.07136,"y":0.033871,"z":-0.011472},{"x":-0.064857,"y":0.037778,"z":0.043865},{"x":-0.073466,"y":0.056941,"z":0.027695},{"x":-0.075194,"y":0.05454,"z":0.023181},{"x":-0.075631,"y":0.047502,"z":0.030002},{"x":0.003579,"y":0.089405,"z":-0.038325},{"x":-0.006598,"y":0.087876,"z":-0.030875},{"x":0.001582,"y":0.09395,"z":-0.037987},{"x":-0.02271,"y":0.06404,"z":-0.012823},{"x":-0.004653,"y":0.07368,"z":-0.022516},{"x":-0.00352,"y":0.072368,"z":-0.019306},{"x":0.027087,"y":0.015217,"z":-0.030848},{"x":0.034903,"y":0.014152,"z":-0.030349},{"x":0.028913,"y":0.009703,"z":-0.032177},{"x":0.030622,"y":0.040601,"z":-0.007736},{"x":0.038154,"y":0.037876,"z":0.000469},{"x":0.045075,"y":0.031722,"z":-0.003503},{"x":-0.074506,"y":0.043058,"z":-0.006078},{"x":-0.070845,"y":0.054615,"z":-0.00489},{"x":-0.067763,"y":0.051957,"z":-0.010496},{"x":0.008655,"y":0.043147,"z":0.013942},{"x":0.021987,"y":0.043917,"z":0.011068},{"x":0.012138,"y":0.044548,"z":0.005021},{"x":0.014472,"y":0.032096,"z":0.029637},{"x":0.027975,"y":0.029079,"z":0.028192},{"x":0.022583,"y":0.036428,"z":0.025476},{"x":-0.074608,"y":0.064918,"z":0.004506},{"x":0.039324,"y":-0.048792,"z":0.020825},{"x":0.05183,"y":-0.047555,"z":0.014145},{"x":-0.00126,"y":-0.052265,"z":0.037701},{"x":-0.017555,"y":-0.052435,"z":0.031134},{"x":0.004182,"y":-0.050151,"z":0.020044},{"x":0.05184,"y":0.011576,"z":0.023282},{"x":0.044296,"y":0.02715,"z":0.022099},{"x":-0.034263,"y":0.010953,"z":0.035024},{"x":-0.039917,"y":0.013106,"z":0.033622},{"x":-0.039888,"y":0.00344,"z":0.036063},{"x":-0.021637,"y":0.027804,"z":0.024531},{"x":-0.025101,"y":0.034291,"z":0.019591},{"x":-0.037402,"y":0.026134,"z":0.026633},{"x":-0.046622,"y":0.052534,"z":0.025696},{"x":-0.050205,"y":0.056875,"z":0.030719},{"x":-0.04878,"y":0.04876,"z":0.028782},{"x":-0.074081,"y":0.011308,"z":0.014773},{"x":-0.075852,"y":0.005094,"z":0.010905},{"x":-0.070807,"y":0.001318,"z":0.019712},{"x":-0.051753,"y":-0.047753,"z":-0.015554},{"x":-0.034095,"y":-0.053253,"z":-0.023193},{"x":-0.051264,"y":-0.053376,"z":-0.01564},{"x":0.000146,"y":0.094667,"z":-0.031627},{"x":-0.005681,"y":0.09937,"z":-0.025245},{"x":0.00341,"y":-0.025736,"z":-0.044729},{"x":0.015308,"y":-0.019191,"z":-0.042649},{"x":0.016433,"y":-0.023698,"z":-0.042772},{"x":0.000817,"y":0.004174,"z":-0.045663},{"x":0.011462,"y":0.009285,"z":-0.04028},{"x":0.017851,"y":0.005801,"z":-0.041709},{"x":-0.005626,"y":0.099043,"z":-0.029463},{"x":-0.017387,"y":0.092348,"z":-0.018555},{"x":-0.000918,"y":0.099113,"z":-0.033263},{"x":0.03818,"y":0.037656,"z":0.00957},{"x":0.072204,"y":-0.026729,"z":-0.006309},{"x":0.072876,"y":-0.032901,"z":0.000908},{"x":0.069735,"y":-0.036142,"z":-0.005495},{"x":0.072681,"y":-0.020739,"z":0.013898},{"x":0.074434,"y":-0.017526,"z":0.004082},{"x":0.071038,"y":-0.01459,"z":0.009628},{"x":-0.066255,"y":-0.007019,"z":0.023506},{"x":-0.07231,"y":-0.002146,"z":0.013802},{"x":0.016291,"y":0.005526,"z":0.046559},{"x":0.003707,"y":0.002891,"z":0.048054},{"x":0.004498,"y":-0.007902,"z":0.048949},{"x":-0.056155,"y":0.093525,"z":-0.06617},{"x":-0.054374,"y":0.094447,"z":-0.064419},{"x":-0.077139,"y":0.045089,"z":-0.00024},{"x":-0.001823,"y":0.042014,"z":0.005236},{"x":-0.052508,"y":-0.022885,"z":-0.012587},{"x":-0.050323,"y":-0.01222,"z":-0.025577},{"x":-0.040323,"y":-0.045677,"z":-0.018586},{"x":-0.04419,"y":-0.040201,"z":-0.011991},{"x":-0.052745,"y":0.064227,"z":-0.050539},{"x":-0.044302,"y":0.059043,"z":-0.010861},{"x":-0.044155,"y":0.067779,"z":-0.008717},{"x":-0.042545,"y":-0.041922,"z":0.0357},{"x":-0.048006,"y":-0.049432,"z":0.035381},{"x":-0.040805,"y":-0.047314,"z":0.038484},{"x":-0.047899,"y":-0.052634,"z":0.01072},{"x":-0.050796,"y":-0.05201,"z":0.030921},{"x":-0.052992,"y":-0.051417,"z":0.023026},{"x":-0.024778,"y":-0.052099,"z":0.033533},{"x":-0.041591,"y":-0.05067,"z":0.037949},{"x":0.014099,"y":0.043819,"z":-0.006311},{"x":-0.000778,"y":0.038824,"z":-0.012633},{"x":-0.005859,"y":0.0775,"z":-0.025955},{"x":0.004094,"y":0.093093,"z":-0.037523},{"x":0.00488,"y":0.079567,"z":-0.028961},{"x":0.004365,"y":0.083002,"z":-0.034314},{"x":0.00701,"y":0.041169,"z":0.019101},{"x":0.018653,"y":0.041047,"z":0.019935},{"x":-0.003708,"y":0.033752,"z":0.024537},{"x":-0.009722,"y":0.017914,"z":0.033731},{"x":0.002005,"y":0.032379,"z":0.028144},{"x":-0.028667,"y":0.037392,"z":-0.0185},{"x":-0.007414,"y":0.028341,"z":-0.024645},{"x":-0.002428,"y":0.033953,"z":-0.018575},{"x":-0.003129,"y":0.027008,"z":-0.026996},{"x":-0.067509,"y":0.013129,"z":-0.015272},{"x":-0.069021,"y":0.019404,"z":-0.010122},{"x":-0.060063,"y":0.017284,"z":-0.02022},{"x":-0.031293,"y":0.05886,"z":-0.007464},{"x":-0.037877,"y":0.055811,"z":-0.008746},{"x":0.07257,"y":-0.027406,"z":0.014364},{"x":0.067947,"y":-0.029127,"z":0.019315},{"x":0.071197,"y":-0.034855,"z":0.011939},{"x":0.050144,"y":-0.039117,"z":0.022545},{"x":0.05769,"y":-0.027672,"z":0.022569},{"x":0.067824,"y":-0.021136,"z":0.018813},{"x":0.059905,"y":-0.020468,"z":0.017991},{"x":-0.048101,"y":0.079135,"z":-0.058192},{"x":-0.046857,"y":0.080702,"z":-0.068448},{"x":-0.048569,"y":0.088553,"z":-0.06458},{"x":-0.053032,"y":0.086713,"z":-0.054017},{"x":-0.048965,"y":0.080137,"z":-0.052331},{"x":-0.048248,"y":0.073409,"z":-0.03062},{"x":0.040721,"y":0.032047,"z":-0.01295},{"x":-0.071386,"y":0.041204,"z":-0.011749},{"x":-0.07849,"y":0.030914,"z":0.032641},{"x":-0.07268,"y":0.027732,"z":0.038178},{"x":-0.050528,"y":0.009379,"z":0.034165},{"x":-0.052569,"y":0.015268,"z":0.032144},{"x":-0.05855,"y":0.007165,"z":0.032278},{"x":-0.061499,"y":0.024231,"z":0.037347},{"x":-0.050924,"y":0.03073,"z":0.040318},{"x":-0.069,"y":0.054038,"z":0.035572},{"x":-0.063703,"y":0.058489,"z":0.035123},{"x":-0.06966,"y":0.06195,"z":0.026043},{"x":-0.04954,"y":0.092254,"z":-0.067516},{"x":-0.030108,"y":-0.052351,"z":0.00999},{"x":-0.025238,"y":-0.052933,"z":0.019297},{"x":-0.035574,"y":-0.052722,"z":0.020143},{"x":-0.019319,"y":-0.053334,"z":0.006224},{"x":-0.015164,"y":-0.053084,"z":0.005069},{"x":-0.003003,"y":-0.031635,"z":-0.042475},{"x":-0.007414,"y":-0.023894,"z":-0.044133},{"x":-0.002131,"y":-0.023807,"z":-0.045925},{"x":-0.033204,"y":-0.033102,"z":-0.019066},{"x":-0.026865,"y":-0.037249,"z":-0.019965},{"x":-0.039598,"y":-0.039064,"z":-0.015094},{"x":-0.02115,"y":-0.04638,"z":0.039128},{"x":-0.014267,"y":-0.04946,"z":0.044859},{"x":-0.015375,"y":0.002317,"z":0.03546},{"x":-0.014478,"y":-0.004247,"z":0.037609},{"x":-0.010154,"y":0.004552,"z":0.04174},{"x":-0.055791,"y":0.06812,"z":-0.059064},{"x":-0.052508,"y":0.067468,"z":-0.060048},{"x":-0.049397,"y":0.073904,"z":-0.066051},{"x":0.061332,"y":-0.045226,"z":0.004301},{"x":0.066864,"y":-0.037378,"z":0.01566},{"x":0.063885,"y":-0.042821,"z":0.010221},{"x":0.06448,"y":-0.041812,"z":-0.004822},{"x":0.069198,"y":-0.039204,"z":0.005496},{"x":-0.062919,"y":0.007058,"z":-0.021788},{"x":-0.014853,"y":-0.007017,"z":-0.044419},{"x":-0.01142,"y":-0.001975,"z":-0.046198},{"x":0.001387,"y":0.076559,"z":-0.021199},{"x":-0.057577,"y":-0.052669,"z":-0.002681},{"x":-0.045665,"y":-0.053246,"z":0.009373},{"x":0.011329,"y":-0.027838,"z":0.045507},{"x":0.010562,"y":-0.023562,"z":0.047753},{"x":0.007382,"y":-0.03057,"z":0.045063},{"x":0.055904,"y":0.004213,"z":-0.016589},{"x":0.055679,"y":0.011812,"z":-0.011626},{"x":0.05905,"y":0.000024,"z":-0.009421},{"x":-0.022116,"y":-0.049133,"z":-0.039031},{"x":-0.029377,"y":-0.051128,"z":-0.034996},{"x":-0.064382,"y":0.001107,"z":0.028256},{"x":-0.067668,"y":0.00866,"z":0.023963},{"x":-0.063636,"y":0.068036,"z":0.017269},{"x":-0.074466,"y":0.064374,"z":0.013966},{"x":-0.06313,"y":0.065894,"z":0.024394},{"x":0.026237,"y":-0.050651,"z":-0.030958},{"x":0.003567,"y":-0.051543,"z":-0.034364},{"x":0.021671,"y":-0.048122,"z":-0.032718},{"x":-0.013421,"y":-0.052765,"z":-0.029997},{"x":-0.072597,"y":0.045082,"z":0.038411},{"x":-0.067646,"y":0.045557,"z":0.042271},{"x":-0.036785,"y":-0.053537,"z":-0.01441},{"x":-0.07173,"y":0.026307,"z":-0.006406},{"x":-0.078312,"y":0.030732,"z":0.000235},{"x":-0.074641,"y":0.035692,"z":-0.007851},{"x":-0.034736,"y":0.063346,"z":0.00219},{"x":-0.032039,"y":0.07013,"z":-0.000774},{"x":0.075146,"y":-0.02413,"z":0.001133},{"x":0.074768,"y":-0.024648,"z":0.007866},{"x":0.069607,"y":-0.018572,"z":-0.00663},{"x":0.058706,"y":0.006357,"z":0.010687},{"x":0.057018,"y":0.013933,"z":0.003505},{"x":0.048874,"y":-0.007075,"z":0.031341},{"x":0.053388,"y":-0.002905,"z":0.025281},{"x":0.048014,"y":0.003356,"z":0.032331},{"x":0.059965,"y":-0.031736,"z":0.023275},{"x":0.021481,"y":0.04487,"z":0.001111},{"x":0.030003,"y":0.042194,"z":0.000919},{"x":0.023948,"y":0.036325,"z":-0.01955},{"x":0.01701,"y":0.038651,"z":-0.016759},{"x":0.018941,"y":0.043062,"z":-0.008787},{"x":0.010096,"y":0.037087,"z":0.025514},{"x":-0.0125,"y":0.024282,"z":0.028748},{"x":-0.01656,"y":0.032685,"z":0.01993},{"x":0.026012,"y":-0.004752,"z":0.04511},{"x":0.031992,"y":-0.009457,"z":0.044076},{"x":0.031121,"y":-0.001221,"z":0.042138},{"x":0.026092,"y":-0.012755,"z":0.045684},{"x":-0.018759,"y":0.078731,"z":-0.024581},{"x":-0.024752,"y":0.081078,"z":-0.021427},{"x":-0.021138,"y":0.072494,"z":-0.021755},{"x":-0.013652,"y":0.036131,"z":0.012669},{"x":-0.015459,"y":0.038803,"z":0.005676},{"x":-0.002884,"y":0.04009,"z":0.013755},{"x":0.054639,"y":-0.043489,"z":-0.011639},{"x":0.065321,"y":-0.035514,"z":-0.011514},{"x":0.055757,"y":-0.008206,"z":-0.015787},{"x":0.053433,"y":-0.003192,"z":-0.022567},{"x":0.072183,"y":-0.020473,"z":-0.005033},{"x":0.064611,"y":-0.027845,"z":-0.013513},{"x":0.030808,"y":-0.04446,"z":0.035436},{"x":0.037031,"y":-0.046485,"z":0.031115},{"x":0.041112,"y":-0.038125,"z":0.028869},{"x":0.033664,"y":-0.051896,"z":0.018402},{"x":0.043456,"y":-0.051665,"z":0.008823},{"x":0.022227,"y":-0.051553,"z":-0.00343},{"x":0.031135,"y":-0.052772,"z":-0.008189},{"x":0.030425,"y":-0.051008,"z":-0.004715},{"x":0.018575,"y":0.032351,"z":-0.024214},{"x":0.003762,"y":0.026657,"z":-0.026652},{"x":0.008952,"y":0.038831,"z":-0.017139},{"x":-0.063802,"y":0.044683,"z":0.043887},{"x":-0.056482,"y":0.060708,"z":0.032603},{"x":-0.076422,"y":0.037813,"z":0.035625},{"x":-0.074696,"y":0.032939,"z":0.038389},{"x":-0.079003,"y":0.036984,"z":0.029905},{"x":-0.07863,"y":0.036061,"z":0.022538},{"x":-0.053453,"y":0.068587,"z":0.018769},{"x":0.007933,"y":0.009085,"z":0.045461},{"x":-0.00878,"y":-0.046641,"z":0.04525},{"x":-0.008248,"y":-0.042405,"z":0.044225},{"x":-0.00566,"y":-0.051268,"z":0.043731},{"x":0.006779,"y":-0.04563,"z":0.039957},{"x":-0.008604,"y":-0.012502,"z":0.043066},{"x":-0.004254,"y":-0.006024,"z":0.048555},{"x":-0.010047,"y":-0.00669,"z":0.045428},{"x":-0.033929,"y":-0.043454,"z":0.034932},{"x":-0.025329,"y":-0.039617,"z":0.031134},{"x":-0.04533,"y":-0.039482,"z":0.028282},{"x":-0.047182,"y":-0.042863,"z":0.03305},{"x":-0.050537,"y":-0.043274,"z":0.026281},{"x":-0.051776,"y":-0.04879,"z":0.029492},{"x":-0.062665,"y":0.091713,"z":-0.058728},{"x":-0.064928,"y":0.082446,"z":-0.045547},{"x":-0.062463,"y":0.067576,"z":-0.011369},{"x":-0.062223,"y":0.065357,"z":-0.01741},{"x":-0.063142,"y":0.062015,"z":-0.015037},{"x":-0.055283,"y":0.054949,"z":-0.018942},{"x":-0.06154,"y":0.057406,"z":-0.015186},{"x":0.032394,"y":-0.05127,"z":0.03098},{"x":0.025271,"y":-0.052354,"z":0.029657},{"x":0.018813,"y":-0.043683,"z":0.03672},{"x":0.026467,"y":-0.050546,"z":0.035552},{"x":-0.051769,"y":0.079616,"z":-0.034408},{"x":-0.056145,"y":0.083479,"z":-0.039367},{"x":-0.066077,"y":0.0307,"z":0.040346},{"x":-0.069798,"y":0.034569,"z":0.040415},{"x":-0.076401,"y":0.025966,"z":0.001043},{"x":0.031933,"y":0.005045,"z":0.039293},{"x":0.028875,"y":0.006011,"z":0.042116},{"x":-0.009672,"y":-0.001041,"z":0.045701},{"x":-0.013987,"y":0.035534,"z":-0.01478},{"x":0.017219,"y":-0.052991,"z":-0.026635},{"x":-0.002704,"y":-0.003098,"z":-0.048355},{"x":0.009149,"y":-0.002734,"z":-0.046389},{"x":-0.075161,"y":0.001719,"z":0.002096},{"x":-0.076709,"y":0.025695,"z":0.007455},{"x":-0.076363,"y":0.049199,"z":0.005513},{"x":0.025993,"y":-0.052786,"z":-0.020018},{"x":0.019083,"y":-0.052944,"z":-0.006753},{"x":0.005519,"y":-0.01385,"z":-0.046404},{"x":-0.005781,"y":-0.015699,"z":-0.04784},{"x":-0.054552,"y":0.0146,"z":-0.023899},{"x":-0.05553,"y":0.007102,"z":-0.025263},{"x":-0.058265,"y":0.038747,"z":-0.017795},{"x":-0.042134,"y":0.03782,"z":-0.016308},{"x":-0.047358,"y":0.033042,"z":-0.018239},{"x":-0.059282,"y":-0.006956,"z":0.029577},{"x":-0.056687,"y":-0.014336,"z":0.026816},{"x":-0.053168,"y":-0.003283,"z":0.034589},{"x":-0.057712,"y":0.038095,"z":0.044364},{"x":-0.0519,"y":0.036435,"z":0.042161},{"x":-0.043556,"y":-0.014221,"z":0.031761},{"x":-0.046809,"y":-0.008824,"z":0.033927},{"x":-0.047942,"y":-0.050105,"z":0.010556},{"x":-0.058106,"y":-0.050843,"z":-0.00064},{"x":-0.054865,"y":-0.052115,"z":-0.014393},{"x":-0.058265,"y":-0.051275,"z":-0.00774},{"x":-0.055207,"y":-0.045703,"z":-0.009443},{"x":-0.063233,"y":0.068612,"z":-0.026927},{"x":-0.064073,"y":0.072022,"z":-0.027967},{"x":-0.004489,"y":0.072643,"z":-0.015079},{"x":0.002268,"y":0.087537,"z":-0.030538},{"x":-0.045019,"y":-0.052227,"z":0.035376},{"x":-0.069501,"y":0.00532,"z":-0.014562},{"x":-0.073383,"y":-0.000231,"z":-0.006326},{"x":-0.07453,"y":0.013816,"z":0.000554},{"x":-0.009608,"y":0.004423,"z":-0.043695},{"x":-0.015618,"y":0.001098,"z":-0.040579},{"x":-0.013317,"y":-0.051835,"z":0.043245},{"x":-0.062653,"y":0.02623,"z":-0.014091},{"x":-0.055013,"y":0.029245,"z":-0.017852},{"x":0.059193,"y":0.007665,"z":-0.002381},{"x":0.0183,"y":-0.003633,"z":-0.043014},{"x":0.024734,"y":0.001465,"z":-0.040465},{"x":0.039289,"y":-0.005422,"z":-0.033535},{"x":-0.04835,"y":0.065208,"z":-0.03674},{"x":0.030447,"y":0.003688,"z":-0.036168},{"x":0.042421,"y":0.00501,"z":-0.029674},{"x":0.025337,"y":-0.051669,"z":0.022774},{"x":0.026339,"y":-0.051868,"z":0.003908},{"x":0.034165,"y":-0.051947,"z":-0.011389},{"x":-0.04717,"y":0.087666,"z":-0.070172},{"x":0.048482,"y":0.025833,"z":-0.01032},{"x":0.053851,"y":0.020002,"z":-0.003947},{"x":-0.020889,"y":-0.052384,"z":-0.03979},{"x":-0.015907,"y":-0.045726,"z":-0.038996},{"x":-0.080456,"y":0.032075,"z":0.009702},{"x":-0.077685,"y":0.030389,"z":0.017916},{"x":-0.080259,"y":0.040919,"z":0.009394},{"x":0.056427,"y":0.007352,"z":0.017238},{"x":-0.077433,"y":0.061121,"z":0.007024},{"x":0.044904,"y":-0.031605,"z":0.029931},{"x":0.043814,"y":-0.040409,"z":0.025503},{"x":0.022987,"y":-0.023088,"z":0.045969},{"x":0.018326,"y":-0.011809,"z":0.047341},{"x":0.012957,"y":-0.019384,"z":0.047652},{"x":-0.05799,"y":0.052621,"z":-0.016348},{"x":0.032216,"y":-0.049705,"z":-0.026318},{"x":-0.038967,"y":0.063276,"z":0.014142},{"x":-0.045677,"y":0.061829,"z":0.027004},{"x":-0.044293,"y":0.05912,"z":0.024783},{"x":-0.047263,"y":0.064972,"z":0.026041},{"x":-0.031963,"y":0.012676,"z":-0.030839},{"x":-0.041092,"y":0.015696,"z":-0.028605},{"x":-0.04221,"y":0.008947,"z":-0.030206},{"x":-0.04722,"y":0.009757,"z":-0.027387},{"x":-0.000721,"y":0.016763,"z":-0.032198},{"x":-0.013255,"y":0.01847,"z":-0.031664},{"x":0.01324,"y":-0.009086,"z":0.049899},{"x":0.008681,"y":-0.014558,"z":0.049675},{"x":-0.052854,"y":0.044459,"z":-0.01779},{"x":-0.048837,"y":0.053905,"z":-0.015794},{"x":-0.029477,"y":0.067258,"z":-0.001834},{"x":-0.025925,"y":0.063694,"z":-0.004972},{"x":0.066299,"y":-0.014915,"z":0.012882},{"x":-0.039342,"y":-0.053671,"z":0.00594},{"x":-0.038269,"y":-0.053568,"z":-0.002509},{"x":0.027659,"y":0.037502,"z":0.022584},{"x":0.032831,"y":0.034128,"z":0.023682},{"x":0.027379,"y":0.041117,"z":0.016764},{"x":-0.007832,"y":0.09384,"z":-0.030118},{"x":-0.040002,"y":0.051325,"z":0.021087},{"x":-0.03594,"y":0.043494,"z":0.022241},{"x":-0.033898,"y":0.046318,"z":0.015127},{"x":-0.042706,"y":0.045398,"z":0.027539},{"x":-0.038084,"y":0.036533,"z":0.026629},{"x":-0.044193,"y":0.038495,"z":0.031816},{"x":-0.046888,"y":0.033411,"z":0.033474},{"x":0.03086,"y":0.035755,"z":-0.016436},{"x":0.041836,"y":0.021471,"z":0.028049},{"x":-0.061718,"y":0.021104,"z":0.028871},{"x":-0.044535,"y":-0.0382,"z":-0.003637},{"x":-0.05162,"y":-0.040972,"z":-0.003386},{"x":-0.051653,"y":-0.043253,"z":0.001319},{"x":-0.077688,"y":0.059085,"z":0.014114},{"x":-0.049984,"y":0.056028,"z":-0.018019},{"x":0.045343,"y":0.023288,"z":-0.018514},{"x":0.033823,"y":0.029861,"z":-0.021267},{"x":0.039358,"y":0.025891,"z":-0.020319},{"x":0.038565,"y":0.017636,"z":-0.02603},{"x":0.049078,"y":0.016011,"z":-0.020031},{"x":0.026387,"y":0.022683,"z":-0.027868},{"x":0.021073,"y":0.026851,"z":-0.027879},{"x":-0.063572,"y":0.089966,"z":-0.059412},{"x":-0.064242,"y":0.082227,"z":-0.050062},{"x":-0.049514,"y":-0.002863,"z":-0.028049},{"x":-0.039933,"y":-0.006251,"z":-0.030103},{"x":-0.06502,"y":-0.002223,"z":-0.018989},{"x":-0.05869,"y":-0.002846,"z":-0.02477},{"x":-0.05076,"y":-0.047804,"z":0.017377},{"x":-0.043117,"y":-0.044668,"z":0.012548},{"x":-0.04098,"y":-0.038907,"z":0.020091},{"x":-0.039691,"y":-0.038158,"z":0.028854},{"x":0.034462,"y":-0.019833,"z":-0.037048},{"x":0.026163,"y":-0.016542,"z":-0.04041},{"x":-0.024379,"y":0.015537,"z":0.031772},{"x":-0.034204,"y":0.019511,"z":0.031069},{"x":-0.026853,"y":0.007335,"z":0.033661},{"x":0.017877,"y":-0.032329,"z":-0.039416},{"x":0.013038,"y":-0.038445,"z":-0.039224},{"x":0.005946,"y":-0.030659,"z":-0.042505},{"x":-0.058558,"y":-0.000128,"z":0.03223},{"x":-0.066144,"y":-0.016185,"z":0.004889},{"x":-0.021375,"y":-0.042791,"z":-0.036645},{"x":-0.030925,"y":-0.046464,"z":-0.028907},{"x":-0.024868,"y":-0.040934,"z":-0.030642},{"x":-0.034517,"y":-0.014761,"z":-0.024926},{"x":-0.044183,"y":-0.016939,"z":-0.024299},{"x":-0.056779,"y":-0.046088,"z":-0.001469},{"x":-0.06324,"y":-0.0181,"z":-0.002001},{"x":-0.049559,"y":-0.041406,"z":-0.008095},{"x":0.048102,"y":0.009089,"z":-0.022648},{"x":-0.034681,"y":0.056182,"z":-0.003393},{"x":-0.015527,"y":0.072599,"z":-0.007602},{"x":0.050059,"y":0.000379,"z":-0.026112},{"x":-0.035657,"y":-0.036493,"z":0.027477},{"x":-0.071324,"y":-0.007624,"z":-0.001489},{"x":-0.016218,"y":-0.045376,"z":0.042897},{"x":0.016574,"y":-0.001179,"z":0.048463},{"x":0.023217,"y":0.000337,"z":0.046928},{"x":0.049337,"y":-0.035715,"z":0.022884},{"x":-0.003174,"y":0.007279,"z":0.044641},{"x":-0.002765,"y":0.000862,"z":0.047918},{"x":0.037613,"y":-0.042263,"z":-0.024487},{"x":0.034293,"y":-0.039626,"z":-0.030694},{"x":0.058839,"y":-0.005529,"z":0.015833},{"x":-0.079765,"y":0.039718,"z":0.016409},{"x":-0.074988,"y":0.049886,"z":0.018248},{"x":-0.07338,"y":0.026396,"z":0.01823},{"x":-0.067604,"y":0.022982,"z":0.021338},{"x":-0.058296,"y":-0.010641,"z":-0.021771},{"x":-0.059104,"y":-0.019875,"z":-0.008367},{"x":-0.018291,"y":-0.005894,"z":-0.038716},{"x":-0.038815,"y":-0.020942,"z":-0.02024},{"x":0.041556,"y":0.033558,"z":0.016398},{"x":0.059563,"y":-0.036637,"z":-0.014701},{"x":0.037316,"y":0.031176,"z":0.023776},{"x":0.035309,"y":0.020268,"z":0.031042},{"x":-0.020141,"y":0.032365,"z":-0.019701},{"x":-0.020502,"y":0.018339,"z":-0.029828},{"x":-0.073022,"y":-0.002372,"z":0.006852},{"x":-0.048538,"y":0.016761,"z":-0.026613},{"x":0.032978,"y":-0.051961,"z":0.012135},{"x":0.037598,"y":-0.00258,"z":0.040368},{"x":0.03142,"y":0.01156,"z":0.038426},{"x":0.047034,"y":-0.017815,"z":-0.026763},{"x":0.041523,"y":-0.021299,"z":-0.030547},{"x":0.042836,"y":-0.011552,"z":-0.031286},{"x":0.024314,"y":-0.033144,"z":-0.038835},{"x":0.034775,"y":-0.027637,"z":-0.035845},{"x":-0.04797,"y":0.004099,"z":0.03641},{"x":0.039923,"y":-0.052475,"z":0.005326},{"x":0.014477,"y":0.011653,"z":0.042767},{"x":0.021771,"y":-0.028244,"z":0.044287},{"x":0.033358,"y":-0.023126,"z":0.039566},{"x":0.016609,"y":-0.031999,"z":0.044907},{"x":-0.037566,"y":0.05362,"z":0.011956},{"x":-0.035771,"y":0.057408,"z":0.001441},{"x":-0.076724,"y":0.048431,"z":0.011717},{"x":-0.0348,"y":0.048403,"z":-0.003712},{"x":-0.048398,"y":0.027596,"z":0.02976},{"x":-0.045845,"y":0.05018,"z":-0.015418},{"x":0.039802,"y":-0.025666,"z":0.035852},{"x":0.050807,"y":-0.023772,"z":0.028115},{"x":0.046041,"y":-0.015389,"z":0.031909},{"x":-0.02317,"y":0.039261,"z":0.011563},{"x":-0.029833,"y":0.042946,"z":-0.000209},{"x":-0.010551,"y":0.034417,"z":0.01918},{"x":-0.074577,"y":0.01578,"z":0.008187},{"x":0.01163,"y":0.026489,"z":-0.028163},{"x":0.014275,"y":0.022141,"z":-0.029676},{"x":-0.002238,"y":0.007716,"z":-0.042591},{"x":-0.010074,"y":0.007917,"z":-0.037149},{"x":0.003712,"y":0.024747,"z":0.03283},{"x":-0.000733,"y":-0.024856,"z":0.044524},{"x":-0.00391,"y":-0.028784,"z":0.04145},{"x":0.001428,"y":-0.016846,"z":0.046046},{"x":-0.061504,"y":-0.016379,"z":0.018939},{"x":-0.052455,"y":-0.027275,"z":0.004489},{"x":-0.056492,"y":-0.023976,"z":0.00959},{"x":-0.056665,"y":-0.024756,"z":-0.000473},{"x":-0.060673,"y":-0.019917,"z":0.009249},{"x":0.031318,"y":0.018811,"z":-0.027149},{"x":-0.018804,"y":0.010079,"z":0.035253},{"x":-0.010954,"y":0.008225,"z":0.035585},{"x":-0.032848,"y":-0.047431,"z":-0.021236},{"x":-0.010997,"y":-0.030956,"z":-0.038213},{"x":0.060651,"y":-0.008871,"z":0.002428},{"x":0.062192,"y":-0.01332,"z":0.003222},{"x":0.059976,"y":-0.014312,"z":-0.005829},{"x":0.05136,"y":-0.024557,"z":-0.020704},{"x":0.056619,"y":-0.032611,"z":-0.015849},{"x":0.045778,"y":-0.037118,"z":-0.01675},{"x":-0.044893,"y":-0.028401,"z":-0.004136},{"x":-0.03957,"y":-0.030587,"z":0.004097},{"x":0.022538,"y":0.008363,"z":-0.037346},{"x":0.048705,"y":-0.037308,"z":-0.015572},{"x":-0.05521,"y":0.089067,"z":-0.065699},{"x":-0.009105,"y":-0.039519,"z":-0.0367},{"x":0.041373,"y":-0.044675,"z":-0.014045},{"x":0.025019,"y":0.017363,"z":0.036344},{"x":0.021196,"y":0.011249,"z":0.040151},{"x":0.041722,"y":-0.009182,"z":0.036905},{"x":-0.04126,"y":0.00071,"z":-0.031037},{"x":-0.023479,"y":-0.053379,"z":-0.00548},{"x":-0.023508,"y":-0.053087,"z":0.000365},{"x":-0.022783,"y":-0.051144,"z":0.004216},{"x":-0.023182,"y":-0.051667,"z":0.014538},{"x":0.060834,"y":-0.013934,"z":0.00963},{"x":0.023098,"y":-0.051027,"z":-0.017271},{"x":0.008252,"y":0.020233,"z":0.035005},{"x":0.017039,"y":0.02471,"z":0.033457},{"x":0.013793,"y":0.014762,"z":0.035374},{"x":-0.060355,"y":0.076253,"z":-0.044461},{"x":-0.068777,"y":0.020095,"z":0.018316},{"x":-0.000052,"y":-0.043066,"z":-0.035966},{"x":0.02434,"y":-0.039951,"z":-0.035513},{"x":-0.033955,"y":0.041949,"z":-0.010355},{"x":-0.039717,"y":0.04402,"z":-0.0139},{"x":-0.037986,"y":0.049781,"z":-0.009755},{"x":-0.040866,"y":-0.005499,"z":0.036102},{"x":-0.071521,"y":0.022687,"z":-0.00256},{"x":0.053428,"y":-0.017514,"z":-0.019985},{"x":-0.006728,"y":0.010355,"z":-0.033894},{"x":-0.021459,"y":0.072961,"z":-0.007844},{"x":-0.003119,"y":0.077776,"z":-0.01958},{"x":-0.034323,"y":0.05047,"z":0.00687},{"x":-0.074971,"y":0.057188,"z":0.002841},{"x":-0.053968,"y":0.022771,"z":0.028843},{"x":0.037639,"y":-0.035979,"z":0.031873},{"x":0.024371,"y":-0.031437,"z":0.043823},{"x":0.019767,"y":-0.036359,"z":0.043651},{"x":0.0293,"y":-0.032579,"z":0.04006},{"x":0.026638,"y":-0.041058,"z":0.035904},{"x":0.059965,"y":-0.020891,"z":-0.009253},{"x":-0.035595,"y":-0.003818,"z":0.036074},{"x":0.040844,"y":-0.016367,"z":0.03475},{"x":0.035343,"y":-0.031138,"z":0.038541},{"x":-0.053412,"y":-0.021162,"z":0.020056},{"x":0.031506,"y":-0.04305,"z":-0.031983},{"x":0.018283,"y":-0.04386,"z":-0.033325},{"x":0.021097,"y":-0.012115,"z":-0.043233},{"x":-0.061295,"y":0.06603,"z":-0.025515},{"x":-0.028544,"y":0.040937,"z":0.007483},{"x":-0.030424,"y":0.034338,"z":0.018171},{"x":-0.031008,"y":0.038275,"z":0.014532},{"x":-0.048108,"y":0.065427,"z":-0.008627},{"x":0.019226,"y":-0.053295,"z":0.003169},{"x":-0.027202,"y":-0.05226,"z":-0.015127},{"x":-0.01968,"y":-0.051041,"z":-0.004541},{"x":-0.071384,"y":-0.0041,"z":-0.005025},{"x":0.035744,"y":-0.047235,"z":-0.016592},{"x":-0.018901,"y":-0.039886,"z":0.035295},{"x":-0.034028,"y":0.003919,"z":0.035429},{"x":0.016338,"y":-0.053014,"z":0.006399},{"x":-0.01618,"y":0.005867,"z":-0.033595},{"x":0.013686,"y":-0.052125,"z":0.000183},{"x":-0.035085,"y":0.002891,"z":-0.030677},{"x":-0.024448,"y":0.002786,"z":-0.032517},{"x":0.000929,"y":0.013884,"z":0.035095},{"x":-0.077844,"y":0.056067,"z":0.008227},{"x":-0.022684,"y":-0.052748,"z":-0.02724},{"x":0.022127,"y":-0.026596,"z":-0.039499},{"x":0.008123,"y":0.0235,"z":-0.030716},{"x":0.021118,"y":0.014435,"z":-0.030332},{"x":0.026142,"y":0.022183,"z":0.031348},{"x":0.006986,"y":0.013024,"z":-0.032894},{"x":0.046903,"y":-0.032221,"z":-0.021054},{"x":0.051597,"y":-0.031285,"z":-0.015195},{"x":-0.032756,"y":-0.051263,"z":-0.00046},{"x":-0.028413,"y":0.000127,"z":-0.030541},{"x":0.001404,"y":-0.040808,"z":-0.038184},{"x":0.057823,"y":-0.017336,"z":0.016607},{"x":0.054572,"y":-0.024767,"z":0.021135},{"x":-0.057586,"y":0.070964,"z":-0.04878},{"x":-0.032535,"y":-0.013703,"z":0.033087},{"x":-0.044689,"y":-0.027042,"z":0.013581},{"x":-0.045993,"y":-0.021218,"z":0.025087},{"x":-0.02961,"y":-0.016335,"z":0.033019},{"x":-0.037364,"y":-0.021134,"z":0.027334},{"x":-0.022026,"y":0.00235,"z":0.034708},{"x":-0.028774,"y":-0.000436,"z":0.033938},{"x":-0.009167,"y":-0.038365,"z":0.04112},{"x":-0.024073,"y":-0.044323,"z":0.032872},{"x":-0.029873,"y":-0.037541,"z":0.030572},{"x":-0.027435,"y":-0.007932,"z":0.034041},{"x":0.002081,"y":-0.040009,"z":0.039156},{"x":-0.025139,"y":-0.022817,"z":0.032872},{"x":-0.018125,"y":-0.00567,"z":0.032687},{"x":-0.032217,"y":-0.033118,"z":0.028867},{"x":-0.023318,"y":-0.002886,"z":0.03488},{"x":-0.021029,"y":-0.003264,"z":-0.032858},{"x":0.036416,"y":-0.050868,"z":0.003121},{"x":-0.043476,"y":0.016882,"z":0.032823},{"x":-0.03579,"y":0.032484,"z":0.023081},{"x":-0.007657,"y":0.009979,"z":0.036271},{"x":-0.058603,"y":0.080954,"z":-0.054893},{"x":-0.060331,"y":0.01737,"z":0.027706},{"x":-0.014298,"y":-0.035939,"z":-0.03219},{"x":-0.048619,"y":-0.041966,"z":0.021705},{"x":-0.036486,"y":-0.031381,"z":0.023899},{"x":-0.013887,"y":-0.027969,"z":-0.034914},{"x":-0.022762,"y":-0.032994,"z":0.029868},{"x":-0.027758,"y":-0.006702,"z":-0.028863},{"x":-0.020817,"y":-0.013883,"z":-0.0283},{"x":-0.018013,"y":-0.027548,"z":-0.022967},{"x":-0.021727,"y":-0.008465,"z":-0.029201},{"x":-0.030794,"y":-0.023644,"z":-0.022918},{"x":-0.015276,"y":-0.038368,"z":-0.032524},{"x":-0.038737,"y":-0.033349,"z":-0.015738},{"x":-0.042723,"y":-0.028462,"z":-0.010558},{"x":-0.04042,"y":-0.025615,"z":-0.01659},{"x":-0.028263,"y":-0.040878,"z":-0.022463},{"x":-0.03901,"y":-0.026752,"z":0.018745},{"x":-0.037792,"y":-0.030953,"z":0.010499},{"x":-0.038193,"y":-0.035035,"z":0.017337},{"x":-0.072331,"y":0.021935,"z":0.009562},{"x":0.017692,"y":-0.051165,"z":-0.023717},{"x":-0.043352,"y":-0.035203,"z":-0.007723},{"x":-0.04485,"y":-0.026173,"z":-0.011514},{"x":-0.041795,"y":-0.033022,"z":-0.00058},{"x":-0.035731,"y":-0.033959,"z":0.006993},{"x":-0.041241,"y":0.028009,"z":0.026472},{"x":0.015925,"y":-0.049838,"z":-0.00846},{"x":0.004552,"y":-0.049353,"z":-0.000737},{"x":-0.022995,"y":0.076711,"z":-0.010102},{"x":-0.012899,"y":0.080027,"z":-0.017848},{"x":-0.006721,"y":0.088656,"z":-0.024205},{"x":-0.024336,"y":-0.015284,"z":-0.025977},{"x":-0.025642,"y":-0.026217,"z":-0.021381},{"x":-0.020162,"y":-0.02908,"z":-0.019991},{"x":-0.018149,"y":-0.035386,"z":-0.020145},{"x":-0.037813,"y":-0.038767,"z":0.005322},{"x":-0.042908,"y":-0.044626,"z":0.008909},{"x":-0.037072,"y":-0.040689,"z":0.01045},{"x":0.054822,"y":-0.025167,"z":-0.013054},{"x":-0.006287,"y":-0.036245,"z":0.037008},{"x":-0.017121,"y":-0.03497,"z":0.028456},{"x":-0.012586,"y":-0.034059,"z":0.029657},{"x":-0.014658,"y":-0.031292,"z":0.027401},{"x":-0.012059,"y":-0.020589,"z":0.031519},{"x":-0.018533,"y":-0.017696,"z":0.031673},{"x":-0.023235,"y":-0.048727,"z":-0.017676},{"x":-0.01543,"y":-0.048519,"z":-0.025588},{"x":0.005512,"y":-0.048568,"z":-0.024222},{"x":0.010277,"y":-0.047889,"z":-0.02035},{"x":0.019679,"y":-0.0484,"z":-0.020321},{"x":0.017041,"y":-0.047797,"z":-0.014696},{"x":-0.019751,"y":-0.048711,"z":-0.009667},{"x":0.011526,"y":-0.049075,"z":0.000612}],"normals":[{"x":-0.812052,"y":-0.555941,"z":-0.177485},{"x":-0.836664,"y":-0.298683,"z":-0.459109},{"x":-0.64037,"y":-0.604072,"z":-0.474365},{"x":0.260865,"y":-0.248509,"z":0.932841},{"x":-0.276322,"y":-0.578377,"z":0.767546},{"x":0.349008,"y":-0.795773,"z":0.494913},{"x":-0.081159,"y":0.562624,"z":-0.82272},{"x":-0.146359,"y":0.3514,"z":-0.924715},{"x":-0.343681,"y":0.462334,"z":-0.817392},{"x":0.729021,"y":-0.177065,"z":-0.661193},{"x":0.710451,"y":-0.459865,"z":-0.532714},{"x":0.556702,"y":-0.262896,"z":-0.788015},{"x":-0.219307,"y":0.727418,"z":0.650206},{"x":-0.357062,"y":0.764123,"z":0.537236},{"x":0.265014,"y":0.478761,"z":0.836992},{"x":0.750256,"y":0.647347,"z":0.134381},{"x":0.844992,"y":0.447326,"z":0.293065},{"x":0.848611,"y":0.527781,"z":0.036142},{"x":0.007087,"y":-0.349682,"z":0.936842},{"x":-0.276583,"y":-0.489122,"z":0.827201},{"x":0.004615,"y":-0.646954,"z":0.762515},{"x":-0.849292,"y":-0.455004,"z":0.267721},{"x":-0.888098,"y":-0.41811,"z":0.190962},{"x":-0.836659,"y":-0.542918,"z":0.072408},{"x":0.631494,"y":0.355198,"z":0.689239},{"x":0.779888,"y":0.252136,"z":0.572889},{"x":0.529898,"y":0.375569,"z":0.760366},{"x":0.321019,"y":0.534919,"z":0.781542},{"x":0.513259,"y":0.271502,"z":0.814157},{"x":0.573794,"y":0.405971,"z":0.7113},{"x":0.745815,"y":-0.053477,"z":0.664003},{"x":-0.108363,"y":0.821003,"z":0.560546},{"x":0.413255,"y":0.281447,"z":0.86603},{"x":-0.740437,"y":0.499154,"z":-0.450109},{"x":-0.592007,"y":0.800897,"z":0.089949},{"x":-0.666506,"y":0.552953,"z":-0.500013},{"x":-0.467399,"y":-0.857624,"z":-0.214519},{"x":-0.156192,"y":-0.923903,"z":-0.349294},{"x":0.347258,"y":-0.900385,"z":-0.262143},{"x":-0.947249,"y":-0.300449,"z":-0.111574},{"x":-0.986438,"y":0.086531,"z":-0.13947},{"x":-0.855655,"y":-0.471386,"z":-0.213657},{"x":-0.818522,"y":0.227565,"z":-0.52748},{"x":-0.63289,"y":0.660648,"z":-0.403725},{"x":-0.805764,"y":0.161505,"z":-0.569789},{"x":-0.521516,"y":0.852659,"z":0.031523},{"x":0.468946,"y":0.720567,"z":0.510758},{"x":-0.928411,"y":-0.365564,"z":-0.066458},{"x":-0.558562,"y":-0.822428,"z":-0.107798},{"x":-0.577343,"y":-0.789764,"z":0.20724},{"x":-0.099966,"y":0.994917,"z":0.012097},{"x":-0.253742,"y":0.964424,"z":0.074177},{"x":-0.376788,"y":0.925276,"z":0.043541},{"x":0.413267,"y":-0.862165,"z":-0.293056},{"x":0.278823,"y":-0.959452,"z":-0.041355},{"x":0.284658,"y":-0.787286,"z":-0.546946},{"x":0.041492,"y":0.593253,"z":-0.803946},{"x":-0.033795,"y":0.348703,"z":-0.936624},{"x":0.130083,"y":0.988365,"z":-0.078822},{"x":0.549538,"y":0.778629,"z":-0.302893},{"x":0.175014,"y":0.813944,"z":-0.553955},{"x":0.30858,"y":-0.430448,"z":0.84823},{"x":0.254561,"y":-0.575975,"z":0.776821},{"x":0.399652,"y":-0.789662,"z":0.465523},{"x":-0.485635,"y":-0.243524,"z":-0.839556},{"x":-0.801697,"y":-0.326122,"z":-0.500925},{"x":-0.843836,"y":-0.19115,"z":-0.5014},{"x":0.157788,"y":-0.960241,"z":-0.230303},{"x":-0.263777,"y":-0.916456,"z":-0.300882},{"x":0.071814,"y":-0.918984,"z":-0.387701},{"x":-0.874684,"y":-0.138066,"z":-0.464614},{"x":-0.349232,"y":0.318081,"z":-0.881397},{"x":-0.486874,"y":-0.393114,"z":-0.780009},{"x":-0.683136,"y":0.652081,"z":0.328809},{"x":-0.197779,"y":0.890233,"z":0.410329},{"x":-0.096427,"y":0.905283,"z":0.41372},{"x":-0.345338,"y":-0.218237,"z":-0.912751},{"x":0.033883,"y":-0.718245,"z":-0.694965},{"x":0.092641,"y":-0.564149,"z":-0.82046},{"x":0.549529,"y":0.7666,"z":0.332179},{"x":0.070754,"y":0.997032,"z":0.030334},{"x":0.369849,"y":0.842519,"z":0.391629},{"x":0.327962,"y":0.944233,"z":0.029404},{"x":0.712342,"y":0.618927,"z":0.330905},{"x":-0.145951,"y":0.936517,"z":-0.318802},{"x":0.924184,"y":0.365397,"z":0.111217},{"x":0.969379,"y":-0.206282,"z":-0.133235},{"x":0.995959,"y":0.081287,"z":0.03819},{"x":0.038547,"y":0.967267,"z":-0.250818},{"x":0.299801,"y":0.841415,"z":-0.4496},{"x":0.261407,"y":0.947617,"z":-0.183541},{"x":-0.206131,"y":0.967851,"z":0.144135},{"x":-0.203494,"y":0.968012,"z":-0.146776},{"x":0.220862,"y":-0.260575,"z":-0.939852},{"x":-0.44703,"y":0.069714,"z":-0.891798},{"x":-0.380968,"y":-0.122071,"z":-0.916494},{"x":-0.599005,"y":-0.187093,"z":-0.778582},{"x":-0.367386,"y":-0.101366,"z":0.924528},{"x":-0.809613,"y":0.423185,"z":0.406744},{"x":-0.985828,"y":0.04271,"z":0.162233},{"x":-0.9411,"y":0.25018,"z":0.227467},{"x":-1.063484,"y":-0.586479,"z":-1.573127},{"x":-0.438605,"y":-0.201109,"z":-0.875888},{"x":-0.561834,"y":-0.186932,"z":-0.805853},{"x":0.20946,"y":-0.854812,"z":-0.474788},{"x":0.092922,"y":-0.79033,"z":-0.605594},{"x":0.45924,"y":-0.882445,"z":-0.101927},{"x":-0.00875,"y":0.49648,"z":-0.868004},{"x":0.341798,"y":0.406113,"z":-0.847494},{"x":0.194288,"y":0.542648,"z":-0.817181},{"x":0.386619,"y":0.87361,"z":-0.295518},{"x":0.545433,"y":0.833635,"z":-0.086924},{"x":0.694339,"y":0.709792,"z":-0.118692},{"x":-0.849785,"y":0.208333,"z":-0.484214},{"x":-0.844019,"y":0.253182,"z":-0.472791},{"x":-0.714065,"y":0.249776,"z":-0.654006},{"x":-0.119746,"y":0.966188,"z":0.228346},{"x":0.166872,"y":0.969967,"z":0.176969},{"x":-0.09933,"y":0.994896,"z":0.017741},{"x":0.0372,"y":0.533934,"z":0.844707},{"x":0.225365,"y":0.429051,"z":0.874715},{"x":0.123761,"y":0.695182,"z":0.7081},{"x":-0.642847,"y":0.739726,"z":-0.198877},{"x":0.545453,"y":-0.714381,"z":0.438338},{"x":0.374088,"y":-0.845084,"z":0.381957},{"x":0.01529,"y":-0.998638,"z":0.049892},{"x":0.026355,"y":-0.998499,"z":0.048008},{"x":-0.030703,"y":-0.997807,"z":-0.058632},{"x":0.787706,"y":0.305638,"z":0.534887},{"x":0.657308,"y":0.507203,"z":0.557398},{"x":0.092701,"y":0.24238,"z":0.965742},{"x":-0.040908,"y":0.285165,"z":0.957605},{"x":-0.031181,"y":0.068763,"z":0.997146},{"x":0.013672,"y":0.596638,"z":0.802394},{"x":-0.023412,"y":0.774412,"z":0.632248},{"x":0.037721,"y":0.569862,"z":0.820874},{"x":0.688946,"y":0.011542,"z":0.724721},{"x":0.676321,"y":0.137294,"z":0.723699},{"x":0.67835,"y":0.309791,"z":0.666236},{"x":-0.882333,"y":0.151855,"z":0.445453},{"x":-0.981622,"y":-0.073965,"z":0.175921},{"x":-0.849602,"y":-0.13063,"z":0.510991},{"x":-0.457891,"y":0.360687,"z":-0.812552},{"x":-0.681578,"y":-0.253135,"z":-0.686567},{"x":-0.295673,"y":-0.876166,"z":-0.380672},{"x":0.783222,"y":0.231263,"z":0.577131},{"x":0.448628,"y":0.743001,"z":0.496671},{"x":0.126549,"y":-0.226164,"z":-0.965834},{"x":0.231096,"y":-0.137283,"z":-0.963197},{"x":0.258531,"y":-0.185393,"z":-0.948046},{"x":0.036692,"y":0.48454,"z":-0.873999},{"x":0.085064,"y":0.816523,"z":-0.571012},{"x":0.278071,"y":0.409259,"z":-0.869013},{"x":-0.569757,"y":0.730991,"z":-0.37554},{"x":-0.528384,"y":0.848979,"z":0.006681},{"x":0.142036,"y":1.732641,"z":-0.330083},{"x":0.531298,"y":0.841098,"z":0.101376},{"x":0.845566,"y":-0.110625,"z":-0.522283},{"x":0.930134,"y":-0.355547,"z":-0.091854},{"x":0.794799,"y":-0.495891,"z":-0.349839},{"x":0.837267,"y":0.222349,"z":0.499544},{"x":0.929455,"y":0.368762,"z":-0.011276},{"x":0.532225,"y":0.790529,"z":0.302986},{"x":-0.742036,"y":-0.418156,"z":0.523955},{"x":-0.89409,"y":-0.382612,"z":0.232834},{"x":0.151264,"y":0.403715,"z":0.902293},{"x":-0.042811,"y":0.293687,"z":0.954943},{"x":-0.144712,"y":0.052181,"z":0.988097},{"x":-0.578987,"y":0.492268,"z":-0.649959},{"x":0.257925,"y":0.952499,"z":0.161929},{"x":-0.912849,"y":0.25967,"z":-0.315084},{"x":-0.241969,"y":0.968456,"z":0.059537},{"x":-0.406011,"y":-0.771265,"z":-0.49021},{"x":-0.313945,"y":-0.482694,"z":-0.817585},{"x":-0.327751,"y":0.449934,"z":-0.830746},{"x":-0.56775,"y":0.655735,"z":-0.497665},{"x":0.7187,"y":-0.664558,"z":-0.20453},{"x":0.110797,"y":0.113891,"z":-0.987296},{"x":-0.543259,"y":0.429491,"z":-0.721392},{"x":-0.234717,"y":0.697704,"z":0.676844},{"x":-0.609696,"y":-0.022421,"z":0.792318},{"x":0.035807,"y":0.234152,"z":0.97154},{"x":-0.69237,"y":-0.691068,"z":0.207483},{"x":-0.646364,"y":-0.672951,"z":0.359653},{"x":-0.988696,"y":-0.140869,"z":-0.051346},{"x":-0.222967,"y":-0.710584,"z":0.66735},{"x":-0.142205,"y":-0.444335,"z":0.884502},{"x":-0.094242,"y":0.966371,"z":-0.239261},{"x":-0.17886,"y":0.890554,"z":-0.418238},{"x":-0.234062,"y":-0.557609,"z":-0.796422},{"x":0.995103,"y":-0.004675,"z":-0.098736},{"x":0.900227,"y":-0.434743,"z":-0.024297},{"x":0.433455,"y":-0.594828,"z":-0.676976},{"x":-0.140224,"y":0.861805,"z":0.487473},{"x":0.068915,"y":0.882764,"z":0.464735},{"x":-0.29536,"y":0.71766,"z":0.630656},{"x":-0.177138,"y":0.386918,"z":0.90494},{"x":-0.187184,"y":0.583796,"z":0.790028},{"x":0.065105,"y":0.73151,"z":-0.678716},{"x":-0.07993,"y":0.66393,"z":-0.743511},{"x":-0.114279,"y":0.785176,"z":-0.608637},{"x":-0.086373,"y":0.63201,"z":-0.770132},{"x":-0.734457,"y":0.248158,"z":-0.631657},{"x":-0.814627,"y":0.272206,"z":-0.512139},{"x":-0.547526,"y":0.304416,"z":-0.779452},{"x":0.410042,"y":-0.855418,"z":-0.316427},{"x":0.612397,"y":-0.196294,"z":-0.765793},{"x":0.872154,"y":-0.137118,"z":0.469624},{"x":0.650569,"y":-0.166187,"z":0.741041},{"x":0.83301,"y":-0.456499,"z":0.312574},{"x":-0.120427,"y":-0.117208,"z":0.985779},{"x":-0.001978,"y":0.275241,"z":0.961373},{"x":0.340928,"y":0.445019,"z":0.828086},{"x":0.090422,"y":0.630959,"z":0.770529},{"x":0.996038,"y":-0.088094,"z":0.01215},{"x":0.977094,"y":-0.139439,"z":-0.160763},{"x":0.875943,"y":0.379094,"z":0.298347},{"x":0.628495,"y":0.711485,"z":0.314299},{"x":0.90928,"y":0.381521,"z":0.166288},{"x":0.862062,"y":0.467504,"z":0.195678},{"x":0.545949,"y":0.701796,"z":-0.457627},{"x":-0.689243,"y":0.136663,"z":-0.711524},{"x":-0.89976,"y":-0.234797,"z":0.367834},{"x":-0.42853,"y":-0.482146,"z":0.764132},{"x":-0.217057,"y":0.214712,"z":0.952253},{"x":-0.234526,"y":0.277743,"z":0.931588},{"x":-0.473921,"y":0.150948,"z":0.867533},{"x":-0.179796,"y":-0.832979,"z":0.523277},{"x":0.74795,"y":-0.374151,"z":0.548254},{"x":-0.550227,"y":0.54647,"z":0.631364},{"x":-0.238575,"y":0.666408,"z":0.706387},{"x":-0.506615,"y":0.714921,"z":0.481902},{"x":0.66404,"y":0.744482,"z":-0.069255},{"x":0.118919,"y":-0.989313,"z":-0.084369},{"x":0.26619,"y":-4.955281,"z":-0.072044},{"x":0.011282,"y":-0.999491,"z":0.029833},{"x":-1.147655,"y":-4.467609,"z":0.472531},{"x":0.164109,"y":-0.982604,"z":-0.086937},{"x":-0.16226,"y":-0.398635,"z":-0.902642},{"x":-0.470739,"y":-0.366479,"z":-0.802557},{"x":-0.037294,"y":-0.27966,"z":-0.959375},{"x":-0.311983,"y":-0.232391,"z":-0.921228},{"x":-0.27746,"y":0.152851,"z":-0.9485},{"x":-0.572013,"y":0.203342,"z":-0.79464},{"x":-0.732587,"y":0.222187,"z":0.643389},{"x":-0.354447,"y":-0.16755,"z":0.919943},{"x":-0.578931,"y":0.109755,"z":0.807956},{"x":-0.847196,"y":-0.012333,"z":0.531137},{"x":-0.70502,"y":0.43138,"z":0.562902},{"x":-0.870756,"y":-0.258032,"z":-0.418574},{"x":0.131584,"y":-0.82745,"z":-0.545905},{"x":0.69728,"y":-0.551577,"z":-0.45778},{"x":0.485447,"y":-0.871428,"z":0.070389},{"x":0.620605,"y":-0.573604,"z":0.534629},{"x":0.568076,"y":-0.77813,"z":0.267961},{"x":0.582137,"y":-0.744419,"z":-0.327043},{"x":0.734295,"y":-0.678829,"z":0.001509},{"x":-0.666619,"y":0.081999,"z":-0.740874},{"x":-0.716797,"y":0.045206,"z":-0.695815},{"x":-0.427837,"y":0.184436,"z":-0.884838},{"x":0.808313,"y":0.000099,"z":0.588753},{"x":-0.506956,"y":-0.855843,"z":0.102607},{"x":-0.082887,"y":-0.995899,"z":0.036268},{"x":-0.017642,"y":-0.246933,"z":0.968872},{"x":-0.062347,"y":-0.217827,"z":0.973994},{"x":-0.149116,"y":-0.273811,"z":0.950154},{"x":0.831806,"y":0.248598,"z":-0.496285},{"x":0.867516,"y":0.3244,"z":-0.377068},{"x":0.958516,"y":0.061318,"z":-0.278366},{"x":-0.375015,"y":0.153057,"z":-0.914296},{"x":-0.739932,"y":0.168602,"z":-0.65121},{"x":-0.692454,"y":-0.070271,"z":0.718031},{"x":-0.733165,"y":0.145272,"z":0.664353},{"x":-0.239333,"y":0.94584,"z":0.219333},{"x":-0.634595,"y":0.734463,"z":0.240526},{"x":-0.213039,"y":0.877836,"z":0.428974},{"x":0.321537,"y":-0.574674,"z":-0.752571},{"x":0.164153,"y":-0.496073,"z":-0.852623},{"x":0.121786,"y":-0.247909,"z":-0.961098},{"x":-0.002618,"y":-0.899351,"z":0.437219},{"x":-0.747586,"y":0.315114,"z":0.584652},{"x":-0.481219,"y":0.268682,"z":0.834409},{"x":0.013289,"y":-0.999682,"z":-0.021429},{"x":-0.694378,"y":-0.449045,"z":-0.562315},{"x":-0.927879,"y":-0.172385,"z":-0.330642},{"x":-0.837323,"y":-0.089154,"z":-0.53939},{"x":0.638442,"y":-0.044543,"z":0.76838},{"x":0.606895,"y":0.051332,"z":0.793123},{"x":0.982817,"y":-0.018005,"z":-0.183703},{"x":0.982399,"y":-0.092085,"z":0.162517},{"x":0.37054,"y":0.608061,"z":-0.702112},{"x":0.959145,"y":0.221553,"z":0.17594},{"x":0.921263,"y":0.384649,"z":0.05762},{"x":0.681246,"y":-0.062803,"z":0.729356},{"x":0.845639,"y":0.049357,"z":0.531468},{"x":0.68976,"y":0.165948,"z":0.704764},{"x":0.180709,"y":0.049935,"z":0.982268},{"x":0.137174,"y":0.987186,"z":-0.081533},{"x":0.381471,"y":0.924322,"z":-0.010389},{"x":0.203904,"y":0.762701,"z":-0.613767},{"x":0.000865,"y":0.778323,"z":-0.627864},{"x":0.096367,"y":0.920048,"z":-0.379769},{"x":-0.091675,"y":0.733451,"z":0.673532},{"x":-0.198261,"y":0.595331,"z":0.778636},{"x":0.010826,"y":0.792178,"z":0.610194},{"x":0.34213,"y":0.050594,"z":0.93829},{"x":0.420509,"y":0.011027,"z":0.907221},{"x":0.462542,"y":0.207592,"z":0.861951},{"x":0.315451,"y":-0.056588,"z":0.947253},{"x":-0.386416,"y":-0.166761,"z":-0.907124},{"x":-0.569845,"y":0.140834,"z":-0.809594},{"x":-0.147032,"y":-0.484099,"z":-0.862571},{"x":0.035524,"y":0.931212,"z":0.362743},{"x":0.179095,"y":0.976955,"z":0.116116},{"x":-0.311049,"y":0.897253,"z":0.313344},{"x":0.338303,"y":-0.632885,"z":-0.696425},{"x":0.613046,"y":-0.42421,"z":-0.666498},{"x":0.849201,"y":-0.064391,"z":-0.52413},{"x":0.839008,"y":-0.072137,"z":-0.539317},{"x":0.808209,"y":0.283603,"z":-0.516108},{"x":0.441063,"y":0.169212,"z":-0.88138},{"x":0.333247,"y":-0.022666,"z":0.942567},{"x":0.649501,"y":-0.401757,"z":0.645554},{"x":0.53758,"y":-0.18949,"z":0.821645},{"x":0.137728,"y":-0.9857,"z":0.09709},{"x":0.180014,"y":-0.974449,"z":0.134328},{"x":0.185661,"y":-0.976084,"z":0.113092},{"x":-0.068406,"y":-0.975183,"z":0.210569},{"x":-0.038128,"y":-0.982747,"z":0.180981},{"x":-0.017955,"y":0.672827,"z":-0.739582},{"x":-0.077377,"y":0.629074,"z":-0.773484},{"x":-0.083754,"y":0.802854,"z":-0.590264},{"x":-0.003379,"y":0.341297,"z":0.939949},{"x":0.187582,"y":0.654789,"z":0.732164},{"x":-0.749732,"y":0.132602,"z":0.648319},{"x":-0.628753,"y":-0.039286,"z":0.776612},{"x":-0.984986,"y":0.109751,"z":0.133254},{"x":-0.98807,"y":-0.149416,"z":0.037309},{"x":0.025515,"y":0.961593,"z":0.273292},{"x":-0.061109,"y":0.645768,"z":0.761084},{"x":0.131783,"y":0.021951,"z":0.991036},{"x":0.011119,"y":0.405977,"z":0.913816},{"x":0.14422,"y":-0.641458,"z":0.75348},{"x":0.278371,"y":0.171031,"z":0.945123},{"x":-0.701232,"y":-0.308648,"z":0.642659},{"x":-0.240606,"y":-0.136953,"z":0.960912},{"x":-0.694204,"y":-0.206562,"z":0.689502},{"x":0.075285,"y":0.608912,"z":0.789657},{"x":0.158507,"y":0.322206,"z":0.933305},{"x":-0.432081,"y":0.889246,"z":0.150158},{"x":-0.669273,"y":0.544707,"z":0.50534},{"x":-0.843981,"y":0.532898,"z":0.060959},{"x":-0.913854,"y":0.159619,"z":0.373353},{"x":-0.566058,"y":0.818848,"z":0.095215},{"x":-0.952854,"y":0.274855,"z":0.128547},{"x":-0.874875,"y":0.483777,"z":-0.02353},{"x":-0.987328,"y":-0.147044,"z":-0.059685},{"x":-0.965655,"y":-0.067067,"z":-0.251021},{"x":-0.072975,"y":-0.837019,"z":-0.542286},{"x":-0.721404,"y":-0.202603,"z":-0.662215},{"x":0.399809,"y":-0.862099,"z":0.31135},{"x":0.029458,"y":-0.997063,"z":0.070693},{"x":0.116369,"y":-0.316866,"z":0.941305},{"x":0.294356,"y":-0.435912,"z":0.850491},{"x":0.600912,"y":0.735283,"z":0.313472},{"x":0.270864,"y":0.897557,"z":0.347884},{"x":-0.38939,"y":-0.417855,"z":0.820837},{"x":-0.401941,"y":-0.086955,"z":0.911527},{"x":-0.781848,"y":-0.554287,"z":-0.285447},{"x":0.450364,"y":0.227212,"z":0.863451},{"x":0.399525,"y":0.387785,"z":0.830664},{"x":-0.606246,"y":0.228009,"z":0.761891},{"x":-0.137327,"y":0.886344,"z":-0.442195},{"x":-0.106874,"y":-0.964493,"z":0.241519},{"x":-0.020338,"y":0.169926,"z":-0.985247},{"x":0.242285,"y":0.119076,"z":-0.96287},{"x":-0.955888,"y":-0.290981,"z":-0.040106},{"x":-0.766664,"y":-0.640165,"z":0.04914},{"x":-0.952234,"y":0.187533,"z":-0.241001},{"x":-0.245879,"y":-0.96496,"z":0.091634},{"x":-0.24558,"y":-0.960479,"z":-0.131041},{"x":0.206673,"y":-0.114539,"z":-0.971683},{"x":-0.116457,"y":-0.11955,"z":-0.985974},{"x":-0.42557,"y":0.245348,"z":-0.871031},{"x":-0.372237,"y":0.155195,"z":-0.91507},{"x":-0.139565,"y":0.044109,"z":-0.98923},{"x":0.183867,"y":0.304853,"z":-0.934483},{"x":-0.143404,"y":0.468725,"z":-0.871626},{"x":-0.538482,"y":-0.348715,"z":0.767095},{"x":-0.446616,"y":-0.587527,"z":0.674793},{"x":-0.353002,"y":-0.32277,"z":0.878185},{"x":0.196933,"y":0.175248,"z":0.964627},{"x":0.689105,"y":0.167482,"z":0.705042},{"x":-0.16103,"y":-0.519049,"z":0.839439},{"x":-0.18492,"y":-0.268644,"z":0.945323},{"x":-0.679192,"y":0.399196,"z":0.615906},{"x":-0.87411,"y":0.007275,"z":0.485674},{"x":-0.742609,"y":-0.083306,"z":-0.664523},{"x":-0.955599,"y":-0.237737,"z":-0.1741},{"x":-0.696372,"y":0.611649,"z":-0.375434},{"x":-0.84096,"y":-0.50082,"z":-0.204853},{"x":-0.996713,"y":-0.0026,"z":0.080975},{"x":0.678954,"y":-0.249084,"z":0.690636},{"x":0.633113,"y":0.403241,"z":0.66073},{"x":-0.156529,"y":-0.937049,"z":0.312151},{"x":-0.849988,"y":0.02867,"z":-0.526022},{"x":-0.930106,"y":-0.218923,"z":-0.294917},{"x":-0.965534,"y":0.13067,"z":-0.225099},{"x":-0.344463,"y":0.588416,"z":-0.731514},{"x":-0.725123,"y":0.436552,"z":-0.532559},{"x":-0.129743,"y":-0.874803,"z":0.466783},{"x":-0.615871,"y":-0.071956,"z":-0.784554},{"x":-0.356477,"y":0.193827,"z":-0.913978},{"x":0.973306,"y":0.220304,"z":-0.064354},{"x":0.330824,"y":0.062576,"z":-0.941615},{"x":0.416424,"y":0.269787,"z":-0.86822},{"x":0.48759,"y":0.091923,"z":-0.86822},{"x":0.894695,"y":-0.415797,"z":-0.163196},{"x":0.436341,"y":0.422958,"z":-0.794174},{"x":0.481523,"y":0.278446,"z":-0.831025},{"x":-0.026104,"y":-0.999621,"z":-0.008766},{"x":0.086214,"y":-0.996198,"z":-0.012479},{"x":0.348576,"y":-0.899733,"z":-0.262633},{"x":0.838862,"y":0.285407,"z":-0.463524},{"x":0.759258,"y":0.559003,"z":-0.33323},{"x":0.866873,"y":0.48233,"z":-0.126051},{"x":-0.022847,"y":-0.343354,"z":-0.938928},{"x":-0.015803,"y":0.243581,"z":-0.969752},{"x":-0.970233,"y":-0.237294,"z":0.048362},{"x":-0.860277,"y":-0.500517,"z":0.096984},{"x":-0.97231,"y":0.221373,"z":-0.074882},{"x":0.890258,"y":0.219257,"z":0.399209},{"x":-0.943409,"y":0.264582,"z":-0.199939},{"x":0.563548,"y":-0.37887,"z":0.734079},{"x":0.649748,"y":-0.454936,"z":0.608983},{"x":0.294895,"y":-0.182357,"z":0.937967},{"x":0.283565,"y":-0.063202,"z":0.956868},{"x":0.08618,"y":-0.17311,"z":0.981125},{"x":-0.205573,"y":-0.110423,"z":-0.972392},{"x":0.686675,"y":-0.603603,"z":-0.405142},{"x":0.922714,"y":0.221976,"z":0.31516},{"x":0.727934,"y":0.200855,"z":0.655568},{"x":0.766905,"y":-0.027057,"z":0.641191},{"x":0.318056,"y":0.662144,"z":0.678532},{"x":-0.112873,"y":0.175208,"z":-0.97804},{"x":-0.212209,"y":0.215887,"z":-0.953079},{"x":-0.249274,"y":0.139641,"z":-0.958313},{"x":-0.362221,"y":0.133999,"z":-0.92241},{"x":-0.0309,"y":0.371668,"z":-0.927851},{"x":-0.110625,"y":0.356539,"z":-0.927708},{"x":0.170087,"y":-0.039772,"z":0.984626},{"x":-0.13881,"y":-0.228718,"z":0.963546},{"x":0.095439,"y":0.091509,"z":-0.99122},{"x":0.578458,"y":-0.110361,"z":-0.808212},{"x":0.443341,"y":0.247325,"z":0.861556},{"x":0.594976,"y":-0.570483,"z":0.566175},{"x":0.051742,"y":0.903424,"z":0.425615},{"x":0.122201,"y":-0.992483,"z":-0.006601},{"x":0.020226,"y":-0.984296,"z":0.175361},{"x":0.258375,"y":0.720176,"z":0.643886},{"x":0.353988,"y":0.655492,"z":0.6671},{"x":0.333735,"y":0.867841,"z":0.368067},{"x":-0.604484,"y":0.211158,"z":-0.768122},{"x":0.736874,"y":0.328562,"z":0.590816},{"x":0.778771,"y":0.307088,"z":0.547004},{"x":0.836235,"y":0.437963,"z":0.329998},{"x":0.557695,"y":0.400089,"z":0.727259},{"x":0.730855,"y":0.007018,"z":0.682497},{"x":0.542542,"y":0.185151,"z":0.81937},{"x":0.705428,"y":-0.160195,"z":0.690441},{"x":0.38436,"y":0.759247,"z":-0.525178},{"x":0.45353,"y":0.429025,"z":0.781183},{"x":-0.195273,"y":-0.892987,"z":0.405514},{"x":-0.657022,"y":0.725239,"z":0.205792},{"x":-0.537125,"y":0.843204,"z":0.02243},{"x":-0.505908,"y":0.655006,"z":0.56127},{"x":-0.973794,"y":0.13425,"z":0.183583},{"x":0.584578,"y":-0.673,"z":-0.453144},{"x":0.573561,"y":0.538902,"z":-0.616938},{"x":0.397584,"y":0.541386,"z":-0.740829},{"x":0.416103,"y":0.531803,"z":-0.737593},{"x":0.378321,"y":0.510369,"z":-0.772267},{"x":0.673913,"y":0.360141,"z":-0.645089},{"x":0.254714,"y":0.261746,"z":-0.930919},{"x":0.164284,"y":0.459275,"z":-0.872971},{"x":-0.867976,"y":-0.107619,"z":-0.484806},{"x":-0.772997,"y":-0.527061,"z":-0.353103},{"x":-0.335322,"y":-0.039217,"z":-0.941287},{"x":-0.050467,"y":-0.269223,"z":-0.961755},{"x":-0.762028,"y":-0.177007,"z":-0.622882},{"x":-0.494902,"y":-0.132163,"z":-0.858839},{"x":-0.822096,"y":0.402505,"z":-0.402677},{"x":-0.672782,"y":0.712539,"z":-0.19913},{"x":-0.547004,"y":0.816252,"z":-0.185795},{"x":-0.280344,"y":0.942685,"z":0.180974},{"x":0.441099,"y":-0.098844,"z":-0.891999},{"x":0.35637,"y":-0.128776,"z":-0.925428},{"x":-0.084975,"y":0.403379,"z":0.911079},{"x":0.084176,"y":0.425951,"z":0.900822},{"x":0.002027,"y":0.124173,"z":0.992259},{"x":0.195357,"y":-0.265436,"z":-0.944129},{"x":0.131333,"y":-0.44285,"z":-0.886925},{"x":0.136359,"y":-0.322899,"z":-0.936559},{"x":-0.487767,"y":-0.085888,"z":0.868739},{"x":-0.780674,"y":-0.614765,"z":0.112303},{"x":-0.359176,"y":0.591815,"z":-0.721628},{"x":-0.835604,"y":0.446752,"z":-0.319653},{"x":-0.539904,"y":0.734443,"z":-0.411215},{"x":-0.083365,"y":-0.443245,"z":-0.892515},{"x":-0.129273,"y":-0.632585,"z":-0.763626},{"x":-0.82485,"y":0.53305,"z":0.18836},{"x":-0.67942,"y":-0.724732,"z":-0.114687},{"x":-0.438621,"y":0.846062,"z":-0.30297},{"x":0.663252,"y":0.330762,"z":-0.671337},{"x":0.918907,"y":-0.394469,"z":0.002058},{"x":0.374792,"y":0.359311,"z":0.85465},{"x":0.665518,"y":0.206806,"z":-0.71716},{"x":-0.50826,"y":0.652772,"z":0.561748},{"x":-0.910531,"y":-0.394257,"z":-0.124473},{"x":-0.467734,"y":0.436718,"z":0.768441},{"x":0.147199,"y":0.225808,"z":0.962987},{"x":0.361594,"y":0.124299,"z":0.924013},{"x":0.394455,"y":-0.266708,"z":0.879359},{"x":-0.329563,"y":0.624139,"z":0.708405},{"x":-0.154652,"y":0.160258,"z":0.974885},{"x":0.701058,"y":-0.606766,"z":-0.374636},{"x":0.532498,"y":-0.444419,"z":-0.720373},{"x":0.926126,"y":0.050883,"z":0.373767},{"x":-0.982712,"y":0.148646,"z":0.110367},{"x":-0.988034,"y":0.098167,"z":0.118962},{"x":-0.669608,"y":-0.741014,"z":0.050234},{"x":-0.714342,"y":-0.636193,"z":0.291503},{"x":-0.612989,"y":-0.426917,"z":-0.66482},{"x":-0.635176,"y":-0.71536,"z":-0.291223},{"x":-0.892418,"y":0.104316,"z":-0.438986},{"x":-0.410393,"y":-0.486512,"z":-0.771287},{"x":0.586161,"y":0.718923,"z":0.373584},{"x":0.30769,"y":-0.317585,"z":-0.896921},{"x":0.418043,"y":0.595876,"z":0.685691},{"x":0.264699,"y":0.535376,"z":0.802064},{"x":0.141595,"y":0.808819,"z":-0.570757},{"x":-0.115328,"y":0.434109,"z":-0.893448},{"x":-0.949617,"y":-0.298411,"z":0.095803},{"x":-0.343141,"y":0.204889,"z":-0.916665},{"x":-0.024448,"y":-0.999322,"z":-0.027538},{"x":0.39447,"y":0.180602,"z":0.900986},{"x":0.265909,"y":0.342168,"z":0.901229},{"x":0.697133,"y":-0.071169,"z":-0.7134},{"x":0.652835,"y":-0.105744,"z":-0.750083},{"x":0.653822,"y":-0.065372,"z":-0.753819},{"x":0.246837,"y":-0.281756,"z":-0.927192},{"x":0.449059,"y":-0.088684,"z":-0.88909},{"x":-0.149223,"y":0.075898,"z":0.985886},{"x":-0.070673,"y":-0.996505,"z":0.044534},{"x":0.093094,"y":0.798669,"z":0.594526},{"x":0.299854,"y":-0.171548,"z":0.938434},{"x":0.493178,"y":-0.154166,"z":0.856159},{"x":0.126525,"y":-0.32231,"z":0.938141},{"x":0.90233,"y":0.334431,"z":0.27195},{"x":0.952496,"y":0.095833,"z":0.289079},{"x":-0.972777,"y":0.21052,"z":0.096888},{"x":0.931767,"y":0.297604,"z":-0.207949},{"x":0.594348,"y":-0.6197,"z":0.512564},{"x":0.390366,"y":0.232421,"z":-0.89084},{"x":0.572074,"y":-0.166079,"z":0.803212},{"x":0.732773,"y":-0.158649,"z":0.66172},{"x":0.541604,"y":-0.114442,"z":0.832807},{"x":0.142137,"y":0.913871,"z":0.380312},{"x":0.502117,"y":0.86354,"z":-0.046665},{"x":-0.27122,"y":0.839217,"z":0.471332},{"x":-0.956122,"y":0.262454,"z":0.130185},{"x":0.003767,"y":0.55579,"z":-0.831314},{"x":0.151775,"y":0.289613,"z":-0.945034},{"x":-0.145901,"y":0.812636,"z":-0.564212},{"x":-0.42741,"y":0.806715,"z":-0.408083},{"x":-0.102831,"y":0.387184,"z":0.91625},{"x":-0.327142,"y":-0.250798,"z":0.911086},{"x":-0.651989,"y":-0.236383,"z":0.72044},{"x":-0.137103,"y":-0.165986,"z":0.976551},{"x":-0.632657,"y":-0.688256,"z":0.355033},{"x":-0.35687,"y":-0.931604,"z":0.068971},{"x":-0.536073,"y":-0.810111,"z":0.237371},{"x":-0.547121,"y":-0.825873,"z":-0.136352},{"x":-0.644168,"y":-0.748083,"z":0.159437},{"x":0.21798,"y":0.518402,"z":-0.826888},{"x":-0.161177,"y":0.241557,"z":0.956908},{"x":-2.067222,"y":2.5079,"z":5.219454},{"x":-0.636259,"y":0.468631,"z":-0.612829},{"x":-0.671629,"y":-0.294569,"z":-0.679811},{"x":0.984798,"y":0.169815,"z":-0.036552},{"x":0.44887,"y":0.892319,"z":-0.047778},{"x":0.878372,"y":0.219851,"z":-0.424415},{"x":0.783026,"y":-0.277627,"z":-0.55659},{"x":0.056441,"y":0.177139,"z":-0.982566},{"x":0.623362,"y":-0.534675,"z":-0.570563},{"x":-0.5892,"y":-0.802678,"z":-0.092473},{"x":-0.606744,"y":-0.74969,"z":0.264248},{"x":0.350507,"y":0.635417,"z":-0.688033},{"x":0.165073,"y":-0.266,"z":-0.949734},{"x":-0.64217,"y":-0.312314,"z":-0.700056},{"x":-0.337121,"y":0.020371,"z":-0.941241},{"x":0.347255,"y":-0.557381,"z":-0.754149},{"x":-0.010866,"y":0.644175,"z":0.764801},{"x":0.049205,"y":0.671484,"z":0.739384},{"x":0.609477,"y":-0.111476,"z":0.784927},{"x":-0.12992,"y":-0.03503,"z":-0.990906},{"x":0.178821,"y":-0.976565,"z":-0.119762},{"x":-0.25161,"y":-0.868877,"z":0.426317},{"x":-0.258348,"y":-0.954318,"z":0.15011},{"x":-0.173937,"y":-2.814677,"z":-0.27619},{"x":0.820656,"y":0.464849,"z":0.332324},{"x":-0.589167,"y":-0.763829,"z":-0.263529},{"x":-0.045565,"y":0.215886,"z":0.975355},{"x":0.130922,"y":0.320085,"z":0.938299},{"x":0.082831,"y":0.507577,"z":0.857616},{"x":-0.739423,"y":-0.569843,"z":-0.358514},{"x":-0.844623,"y":0.137517,"z":0.517398},{"x":0.107732,"y":-0.219903,"z":-0.969555},{"x":0.207912,"y":-0.358648,"z":-0.910024},{"x":0.44695,"y":0.722484,"z":-0.527497},{"x":0.602239,"y":0.2052,"z":-0.771492},{"x":0.833567,"y":0.194625,"z":-0.516998},{"x":-0.078635,"y":-0.223489,"z":0.971529},{"x":-0.916203,"y":-0.228189,"z":-0.329395},{"x":0.846382,"y":-0.092363,"z":-0.524507},{"x":-0.155611,"y":0.687672,"z":-0.709149},{"x":0.182791,"y":0.702424,"z":0.687886},{"x":0.323522,"y":0.652615,"z":0.685148},{"x":0.881271,"y":0.465066,"z":0.084119},{"x":-0.862018,"y":-0.022075,"z":-0.506397},{"x":0.126468,"y":-0.171683,"z":0.977001},{"x":0.538253,"y":-0.435286,"z":0.721672},{"x":0.372209,"y":-0.164884,"z":0.913386},{"x":0.205824,"y":-0.444834,"z":0.871641},{"x":0.427722,"y":-0.353983,"z":0.831715},{"x":0.389925,"y":-0.360765,"z":0.847235},{"x":0.116765,"y":0.508496,"z":-0.853111},{"x":0.1417,"y":-0.15004,"z":0.978473},{"x":0.541757,"y":-0.094585,"z":0.835196},{"x":0.504479,"y":-0.257757,"z":0.824053},{"x":-0.45439,"y":-0.791365,"z":0.408988},{"x":0.467325,"y":-0.326717,"z":-0.821501},{"x":0.058086,"y":-0.502062,"z":-0.862879},{"x":0.320166,"y":-0.064659,"z":-0.945152},{"x":-0.970691,"y":-0.158291,"z":-0.18084},{"x":0.528745,"y":0.755779,"z":0.386299},{"x":0.349275,"y":0.599974,"z":0.719749},{"x":0.798208,"y":0.324223,"z":0.507684},{"x":0.297096,"y":0.700809,"z":-0.648538},{"x":0.094546,"y":-0.995433,"z":-0.013166},{"x":0.445534,"y":-0.891971,"z":-0.07673},{"x":0.442569,"y":-0.829886,"z":-0.339739},{"x":-0.90551,"y":-0.394225,"z":-0.156965},{"x":0.705963,"y":-0.612521,"z":-0.355574},{"x":-0.576328,"y":0.643685,"z":0.503503},{"x":0.19188,"y":0.036,"z":0.980758},{"x":-0.216798,"y":-0.974251,"z":0.061913},{"x":-0.427999,"y":0.373607,"z":-0.822942},{"x":-0.541647,"y":-0.832405,"z":-0.117132},{"x":-0.04699,"y":-0.077538,"z":-0.995881},{"x":-0.195936,"y":-0.101772,"z":-0.975321},{"x":-0.607542,"y":1.121699,"z":2.356527},{"x":-0.991336,"y":-0.068449,"z":-0.112105},{"x":0.283791,"y":-0.916778,"z":0.281034},{"x":0.270629,"y":-0.164835,"z":-0.948467},{"x":0.036861,"y":0.418505,"z":-0.907466},{"x":0.08894,"y":0.342092,"z":-0.935448},{"x":-0.077959,"y":0.594177,"z":0.800548},{"x":0.058195,"y":0.52677,"z":-0.848013},{"x":0.774817,"y":-0.403774,"z":-0.486441},{"x":0.534563,"y":-0.142995,"z":-0.832944},{"x":0.063837,"y":-0.962827,"z":0.262469},{"x":-0.169557,"y":-0.23037,"z":-0.958217},{"x":-0.043377,"y":-0.6013,"z":-0.797845},{"x":0.77891,"y":0.160428,"z":0.606269},{"x":0.415281,"y":0.203799,"z":0.886571},{"x":-0.967088,"y":-0.076649,"z":-0.242623},{"x":-0.068535,"y":-0.278745,"z":0.957917},{"x":-0.330599,"y":-0.891424,"z":0.309949},{"x":-0.268964,"y":-0.769958,"z":0.578639},{"x":-0.220097,"y":-0.189947,"z":0.956806},{"x":-0.385628,"y":-0.540323,"z":0.747892},{"x":-0.043628,"y":-0.04356,"z":0.998098},{"x":0.162193,"y":-0.033248,"z":0.986199},{"x":-0.165382,"y":0.761456,"z":0.626765},{"x":-0.339954,"y":0.439203,"z":0.831584},{"x":-0.165158,"y":0.243448,"z":0.955749},{"x":-0.101108,"y":-0.03277,"z":0.994336},{"x":0.114956,"y":0.226628,"z":0.967174},{"x":0.007982,"y":-0.117864,"z":0.992998},{"x":-0.169611,"y":-0.172031,"z":0.97038},{"x":-0.551138,"y":0.057324,"z":0.832443},{"x":0.032972,"y":-0.063827,"z":0.997416},{"x":-0.518974,"y":-0.137474,"z":-0.843663},{"x":-0.23785,"y":-0.968058,"z":0.079319},{"x":-0.027807,"y":0.388174,"z":0.921167},{"x":0.71886,"y":0.018803,"z":0.6949},{"x":-0.307911,"y":0.216433,"z":0.92647},{"x":-0.738708,"y":-0.481594,"z":-0.47157},{"x":-0.568415,"y":0.01455,"z":0.822613},{"x":-0.853317,"y":0.021934,"z":-0.520931},{"x":-0.59308,"y":0.750641,"z":-0.291195},{"x":-0.837084,"y":-0.054535,"z":0.544349},{"x":-0.886793,"y":-0.207048,"z":-0.413194},{"x":0.231025,"y":-0.070759,"z":0.970371},{"x":-0.11909,"y":-0.365333,"z":-0.923228},{"x":-0.740399,"y":-0.333841,"z":-0.583403},{"x":-0.869419,"y":-0.229694,"z":-0.437438},{"x":-0.67433,"y":-0.292872,"z":-0.677868},{"x":-0.145143,"y":-0.345781,"z":-0.927022},{"x":-0.46697,"y":0.756764,"z":-0.457435},{"x":-0.698377,"y":-0.153837,"z":-0.699002},{"x":-0.862516,"y":-0.348219,"z":-0.367165},{"x":-0.730315,"y":-0.366244,"z":-0.576633},{"x":-0.566987,"y":0.74663,"z":-0.34795},{"x":-0.721172,"y":-0.584949,"z":0.371142},{"x":-0.766218,"y":-0.639555,"z":0.06228},{"x":-0.996067,"y":0.085459,"z":-0.023378},{"x":-0.917728,"y":-0.317228,"z":0.239043},{"x":-0.24587,"y":-0.692817,"z":0.677903},{"x":-0.936176,"y":0.294674,"z":-0.191681},{"x":-0.4999,"y":-0.741987,"z":-0.446716},{"x":-0.927563,"y":-0.071353,"z":0.36679},{"x":-0.962292,"y":-0.168707,"z":0.213382},{"x":0.494531,"y":-0.192382,"z":0.847601},{"x":-0.650243,"y":-0.677212,"z":-0.344338},{"x":0.08254,"y":-0.987418,"z":-0.134885},{"x":0.582106,"y":0.20829,"z":0.785982},{"x":0.4249,"y":0.467852,"z":0.774967},{"x":0.651922,"y":0.082503,"z":0.753785},{"x":-0.15485,"y":-0.369871,"z":-0.916088},{"x":0.030525,"y":-0.289755,"z":-0.956614},{"x":-0.282855,"y":-0.289397,"z":-0.914463},{"x":-0.647577,"y":0.323679,"z":-0.689838},{"x":-0.768051,"y":0.415927,"z":0.486931},{"x":-0.548634,"y":0.771177,"z":0.322935},{"x":-0.829716,"y":0.552779,"z":-0.0775},{"x":0.709124,"y":0.066945,"z":-0.701899},{"x":-0.435249,"y":0.354551,"z":0.827558},{"x":-0.248407,"y":0.66651,"z":0.702893},{"x":-0.658518,"y":0.230467,"z":0.716407},{"x":-0.010131,"y":0.008267,"z":0.999915},{"x":-0.746206,"y":-0.205905,"z":0.633072},{"x":0.372335,"y":-0.145246,"z":0.916663},{"x":0.522755,"y":-0.852308,"z":0.017275},{"x":0.107607,"y":-0.930207,"z":0.350907},{"x":-0.09263,"y":-0.825132,"z":0.557294},{"x":-0.00591,"y":-0.998033,"z":0.062409},{"x":-0.330467,"y":-0.903304,"z":0.273557},{"x":-0.320316,"y":-0.934448,"z":-0.155576},{"x":0.186118,"y":-0.967608,"z":-0.170574},{"x":-0.503973,"y":-0.852581,"z":-0.138262}],"faces":[0,1,2,0,1,2,3,4,5,3,4,5,6,7,8,6,7,8,9,10,11,9,10,11,12,13,14,12,13,14,15,16,17,15,16,17,18,19,20,18,19,20,21,22,23,21,22,23,24,25,26,24,25,26,27,28,29,27,28,29,30,31,32,30,31,32,33,34,35,33,34,35,36,37,38,36,37,38,39,40,41,39,40,41,42,43,44,42,43,44,45,46,13,45,46,13,47,48,49,47,48,49,50,51,52,50,51,52,53,54,55,53,54,55,6,56,57,6,56,57,58,59,60,58,59,60,61,62,63,61,62,63,64,65,66,64,65,66,67,68,69,67,68,69,70,71,72,70,71,72,73,74,75,73,74,75,76,77,78,76,77,78,79,46,80,79,46,80,81,82,83,81,82,83,82,80,84,82,80,84,85,86,87,85,86,87,88,89,90,88,89,90,88,91,92,88,91,92,93,72,71,93,72,71,94,95,96,94,95,96,97,4,3,97,4,3,98,99,100,98,99,100,101,102,103,101,102,103,104,105,106,104,105,106,107,108,109,107,108,109,110,111,112,110,111,112,113,114,115,113,114,115,116,117,118,116,117,118,119,120,121,119,120,121,51,43,122,51,43,122,62,123,124,62,123,124,125,126,127,125,126,127,128,129,29,128,129,29,130,131,132,130,131,132,133,134,135,133,134,135,136,137,138,136,137,138,139,140,141,139,140,141,142,143,144,142,143,144,145,146,30,145,146,30,147,148,149,147,148,149,150,151,152,150,151,152,146,31,30,146,31,30,153,154,31,153,154,31,155,146,145,155,146,145,153,31,146,153,31,146,15,112,156,15,112,156,157,158,159,157,158,159,160,161,162,160,161,162,21,163,164,21,163,164,165,166,167,165,166,167,71,168,169,71,168,169,113,170,114,113,170,114,118,92,171,118,92,171,172,2,173,172,2,173,174,142,175,174,142,175,176,38,37,176,38,37,177,76,78,177,76,78,178,45,33,178,45,33,179,180,181,179,180,181,182,183,184,182,183,184,185,181,186,185,181,186,187,188,92,187,188,92,101,189,102,101,189,102,190,191,192,190,191,192,193,121,194,193,121,194,195,196,197,195,196,197,198,56,6,198,56,6,199,200,201,199,200,201,202,203,204,202,203,204,205,206,78,205,206,78,207,208,209,207,208,209,210,62,61,210,62,61,211,212,213,211,212,213,214,215,216,214,215,216,217,218,216,217,218,216,217,219,218,217,219,218,112,220,110,112,220,110,115,94,221,115,94,221,39,41,36,39,41,36,222,49,223,222,49,223,224,225,226,224,225,226,5,4,227,5,4,227,3,5,228,3,5,228,229,230,231,229,230,231,194,117,116,194,117,116,216,169,217,216,169,217,232,71,169,232,71,169,233,234,235,233,234,235,236,237,234,236,237,234,238,239,240,238,239,240,241,242,243,241,242,243,244,185,245,244,185,245,246,247,248,246,247,248,249,250,37,249,250,37,72,251,250,72,251,250,53,252,54,53,252,54,209,253,254,209,253,254,255,256,252,255,256,252,257,202,204,257,202,204,64,258,259,64,258,259,191,106,105,191,106,105,191,260,106,191,260,106,190,101,103,190,101,103,190,192,101,190,192,101,182,261,262,182,261,262,112,15,17,112,15,17,263,264,265,263,264,265,266,267,268,266,267,268,269,68,270,269,68,270,271,272,141,271,272,141,153,146,155,153,146,155,273,274,275,273,274,275,45,34,33,45,34,33,13,12,34,13,12,34,276,277,278,276,277,278,279,68,67,279,68,67,280,98,100,280,98,100,281,230,229,281,230,229,262,144,282,262,144,282,283,284,285,283,284,285,286,287,14,286,287,14,288,161,289,288,161,289,290,60,59,290,60,59,291,292,16,291,292,16,293,294,295,293,294,295,296,212,211,296,212,211,110,297,298,110,297,298,299,300,301,299,300,301,171,116,118,171,116,118,195,302,193,195,302,193,303,304,133,303,304,133,52,51,122,52,51,122,305,306,307,305,306,307,305,308,306,305,308,306,309,76,310,309,76,310,309,311,76,309,311,76,312,91,313,312,91,313,195,193,314,195,193,314,53,255,252,53,255,252,315,316,255,315,316,255,316,157,159,316,157,159,268,317,318,268,317,318,290,319,320,290,319,320,321,322,323,321,322,323,324,325,124,324,325,124,326,327,328,326,327,328,318,266,268,318,266,268,329,300,299,329,300,299,330,201,331,330,201,331,332,230,281,332,230,281,26,137,333,26,137,333,334,222,335,334,222,335,336,337,47,336,337,47,215,214,251,215,214,251,160,162,212,160,162,212,275,338,273,275,338,273,275,230,333,275,230,333,16,129,128,16,129,128,166,165,339,166,165,339,245,340,341,245,340,341,340,342,343,340,342,343,344,345,346,344,345,346,347,179,181,347,179,181,181,348,347,181,348,347,349,350,179,349,350,179,351,352,350,351,352,350,104,205,77,104,205,77,105,104,77,105,104,77,353,354,75,353,354,75,355,356,357,355,356,357,357,39,36,357,39,36,358,36,38,358,36,38,358,359,36,358,359,36,360,361,324,360,361,324,362,343,363,362,343,363,81,364,365,81,364,365,51,82,81,51,82,81,223,366,367,223,366,367,368,284,283,368,284,283,307,369,370,307,369,370,105,192,191,105,192,191,371,346,345,371,346,345,252,124,54,252,124,54,254,253,63,254,253,63,372,88,188,372,88,188,279,67,373,279,67,373,97,281,334,97,281,334,281,229,280,281,229,280,374,150,375,374,150,375,353,169,168,353,169,168,164,140,376,164,140,376,164,141,140,164,141,140,249,41,40,249,41,40,37,36,41,37,36,41,377,284,368,377,284,368,378,114,170,378,114,170,298,297,117,298,297,117,379,327,380,379,327,380,381,382,374,381,382,374,240,239,64,240,239,64,204,383,384,204,383,384,385,386,387,385,386,387,388,389,390,388,389,390,3,391,97,3,391,97,3,228,392,3,228,392,80,82,50,80,82,50,274,52,122,274,52,122,98,231,274,98,231,274,288,319,161,288,319,161,390,393,394,390,393,394,72,250,249,72,250,249,182,395,396,182,395,396,397,398,399,397,398,399,400,401,354,400,401,354,277,67,69,277,67,69,277,276,67,277,276,67,238,240,147,238,240,147,260,402,106,260,402,106,403,260,191,403,260,191,103,153,155,103,153,155,83,364,81,83,364,81,219,217,364,219,217,364,45,13,34,45,13,34,217,365,364,217,365,364,217,75,365,217,75,365,404,183,182,404,183,182,405,406,407,405,406,407,160,208,207,160,208,207,374,408,150,374,408,150,259,409,408,259,409,408,342,245,410,342,245,410,245,185,410,245,185,410,411,95,412,411,95,412,157,316,320,157,316,320,396,261,182,396,261,182,332,281,97,332,281,97,360,363,361,360,363,361,413,292,291,413,292,291,414,415,416,414,415,416,375,150,152,375,150,152,230,332,333,230,332,333,38,176,417,38,176,417,105,77,311,105,77,311,144,398,397,144,398,397,144,397,142,144,397,142,297,118,117,297,118,117,187,92,118,187,92,118,77,76,311,77,76,311,256,209,254,256,209,254,158,289,209,158,289,209,418,109,419,418,109,419,414,375,152,414,375,152,352,183,180,352,183,180,352,184,183,352,184,183,420,421,324,420,421,324,404,180,183,404,180,183,404,186,180,404,186,180,55,54,422,55,54,422,93,215,251,93,215,251,93,423,215,93,423,215,423,93,71,423,93,71,14,32,12,14,32,12,214,216,218,214,216,218,33,310,178,33,310,178,33,35,310,33,35,310,154,34,31,154,34,31,53,315,255,53,315,255,53,55,315,53,55,315,216,232,169,216,232,169,112,424,220,112,424,220,112,17,425,112,17,425,426,269,427,426,269,427,277,69,426,277,69,426,28,295,29,28,295,29,255,159,256,255,159,256,255,316,159,255,316,159,417,87,86,417,87,86,83,219,364,83,219,364,85,87,219,85,87,219,337,428,429,337,428,429,430,284,428,430,284,428,16,431,291,16,431,291,42,122,43,42,122,43,432,274,122,432,274,122,212,208,160,212,208,160,212,296,208,212,296,208,253,61,63,253,61,63,208,296,61,208,296,61,181,180,186,181,180,186,433,323,434,433,323,434,435,436,437,435,436,437,438,359,358,438,359,358,276,439,67,276,439,67,365,74,81,365,74,81,365,75,74,365,75,74,440,441,442,440,441,442,79,338,443,79,338,443,46,14,13,46,14,13,46,286,14,46,286,14,80,338,79,80,338,79,80,50,338,80,50,338,444,445,57,444,445,57,446,447,445,446,447,445,201,448,449,201,448,449,450,451,437,450,451,437,450,167,451,450,167,451,42,432,122,42,432,122,231,275,274,231,275,274,231,230,275,231,230,275,391,3,392,391,3,392,85,83,82,85,83,82,452,438,453,452,438,453,438,452,385,438,452,385,286,454,287,286,454,287,286,455,454,286,455,454,141,163,271,141,163,271,141,164,163,141,164,163,335,223,367,335,223,367,335,222,223,335,222,223,363,360,322,363,360,322,58,162,59,58,162,59,456,212,162,456,212,162,160,289,161,160,289,161,160,207,289,160,207,289,423,216,215,423,216,215,423,232,216,423,232,216,103,155,190,103,155,190,76,178,310,76,178,310,207,209,289,207,209,289,284,113,285,284,113,285,161,59,162,161,59,162,161,319,59,161,319,59,457,262,458,457,262,458,457,235,262,457,235,262,459,460,461,459,460,461,116,193,194,116,193,194,116,314,193,116,314,193,71,232,423,71,232,423,103,462,153,103,462,153,103,102,462,103,102,462,463,464,465,463,464,465,466,467,464,466,467,464,467,468,469,467,468,469,250,176,37,250,176,37,110,299,301,110,299,301,110,220,470,110,220,470,129,471,29,129,471,29,472,49,48,472,49,48,472,227,49,472,227,49,473,474,475,473,474,475,186,404,185,186,404,185,124,63,62,124,63,62,124,252,63,124,252,63,324,124,123,324,124,123,98,229,231,98,229,231,98,280,229,98,280,229,274,432,476,274,432,476,477,86,453,477,86,453,83,85,219,83,85,219,374,382,259,374,382,259,355,73,401,355,73,401,355,74,73,355,74,73,302,197,119,302,197,119,302,195,197,302,195,197,478,220,424,478,220,424,479,470,220,479,470,220,478,480,220,478,480,220,478,481,480,478,481,480,481,478,482,481,478,482,483,484,479,483,484,479,73,354,401,73,354,401,73,75,354,73,75,354,354,485,486,354,485,486,354,353,485,354,353,485,280,334,281,280,334,281,154,35,34,154,35,34,26,333,332,26,333,332,301,297,110,301,297,110,187,118,297,187,118,297,214,87,417,214,87,417,173,487,488,173,487,488,489,257,490,489,257,490,182,491,492,182,491,492,182,184,491,182,184,491,493,349,494,493,349,494,351,350,349,351,350,349,416,495,496,416,495,496,158,256,159,158,256,159,158,209,256,158,209,256,252,254,63,252,254,63,252,256,254,252,256,254,497,498,499,497,498,499,500,501,502,500,501,502,503,388,390,503,388,390,503,163,388,503,163,388,504,21,23,504,21,23,389,388,163,389,388,163,505,427,269,505,427,269,446,445,444,446,445,444,143,270,68,143,270,68,506,507,270,506,507,270,508,509,173,508,509,173,510,399,398,510,399,398,474,510,475,474,510,475,474,399,510,474,399,510,511,504,0,511,504,0,512,474,473,512,474,473,512,399,474,512,399,474,208,253,209,208,253,209,208,61,253,208,61,253,441,79,443,441,79,443,37,41,249,37,41,249,513,267,266,513,267,266,51,74,355,51,74,355,51,81,74,51,81,74,514,206,205,514,206,205,402,455,106,402,455,106,402,515,455,402,515,455,52,274,273,52,274,273,194,461,117,194,461,117,194,459,461,194,459,461,516,266,318,516,266,318,517,179,347,517,179,347,494,349,179,494,349,179,180,350,352,180,350,352,180,179,350,180,179,350,518,1,0,518,1,0,38,477,358,38,477,358,38,417,477,38,417,477,417,86,477,417,86,477,341,519,245,341,519,245,503,271,163,503,271,163,370,520,521,370,520,521,221,96,285,221,96,285,221,94,96,221,94,96,273,50,52,273,50,52,273,338,50,273,338,50,522,433,434,522,433,434,261,398,144,261,398,144,153,35,154,153,35,154,153,462,35,153,462,35,310,462,102,310,462,102,310,35,462,310,35,462,102,309,310,102,309,310,309,102,311,309,102,311,338,333,443,338,333,443,338,275,333,338,275,333,166,523,524,166,523,524,166,339,523,166,339,523,525,526,10,525,526,10,378,170,430,378,170,430,294,527,431,294,527,431,401,356,355,401,356,355,401,400,356,401,400,356,334,336,222,334,336,222,334,100,336,334,100,336,222,47,49,222,47,49,222,336,47,222,336,47,337,528,428,337,528,428,336,100,529,336,100,529,530,48,47,530,48,47,531,472,48,531,472,48,64,382,240,64,382,240,64,259,382,64,259,382,173,532,490,173,532,490,173,2,532,173,2,532,511,0,533,511,0,533,66,258,64,66,258,64,66,534,258,66,534,258,535,509,508,535,509,508,111,156,112,111,156,112,15,156,536,15,156,536,31,12,32,31,12,32,31,34,12,31,34,12,185,404,126,185,404,126,374,259,408,374,259,408,316,537,320,316,537,320,316,315,537,316,315,537,538,460,539,538,460,539,460,459,120,460,459,120,440,79,441,440,79,441,440,46,79,440,46,79,218,87,214,218,87,214,218,219,87,218,219,87,25,137,26,25,137,26,136,442,137,136,442,137,466,464,463,466,464,463,540,200,56,540,200,56,313,88,90,313,88,90,313,91,88,313,91,88,214,176,251,214,176,251,214,417,176,214,417,176,158,288,289,158,288,289,157,319,288,157,319,288,479,299,470,479,299,470,199,56,200,199,56,200,199,541,56,199,541,56,384,257,204,384,257,204,384,490,257,384,490,257,21,504,163,21,504,163,21,542,22,21,542,22,158,157,288,158,157,288,84,45,178,84,45,178,72,93,251,72,93,251,357,44,355,357,44,355,357,359,44,357,359,44,82,51,50,82,51,50,355,43,51,355,43,51,355,44,43,355,44,43,169,75,217,169,75,217,169,353,75,169,353,75,387,198,6,387,198,6,8,7,543,8,7,543,544,325,324,544,325,324,536,16,15,536,16,15,536,129,16,536,129,16,545,28,546,545,28,546,547,548,549,547,548,549,11,550,551,11,550,551,224,552,131,224,552,131,111,298,156,111,298,156,111,110,298,111,110,298,459,121,120,459,121,120,459,194,121,459,194,121,106,205,104,106,205,104,106,455,205,106,455,205,137,441,443,137,441,443,137,442,441,137,442,441,157,320,319,157,320,319,439,422,67,439,422,67,274,476,98,274,476,98,424,112,425,424,112,425,128,431,16,128,431,16,187,297,301,187,297,301,299,110,470,299,110,470,553,54,325,553,54,325,553,422,54,553,422,54,554,339,165,554,339,165,490,487,173,490,487,173,189,311,102,189,311,102,189,105,311,189,105,311,435,555,556,435,555,556,435,557,555,435,557,555,267,413,268,267,413,268,425,292,413,425,292,413,503,390,552,503,390,552,78,77,205,78,77,205,465,558,463,465,558,463,559,46,440,559,46,440,430,528,560,430,528,560,430,428,528,430,428,528,514,559,561,514,559,561,562,228,5,562,228,5,562,469,228,562,469,228,7,445,543,7,445,543,563,452,453,563,452,453,564,565,566,564,565,566,433,522,565,433,522,565,426,68,269,426,68,269,301,331,187,301,331,187,331,188,187,331,188,187,312,567,304,312,567,304,313,90,568,313,90,568,569,195,314,569,195,314,134,304,567,134,304,567,407,140,570,407,140,570,407,376,140,407,376,140,272,139,141,272,139,141,570,140,139,570,140,139,360,123,322,360,123,322,360,324,123,360,324,123,359,438,94,359,438,94,571,484,572,571,484,572,330,300,329,330,300,329,399,142,397,399,142,397,399,175,142,399,175,142,455,514,205,455,514,205,455,286,514,455,286,514,267,425,413,267,425,413,17,292,425,17,292,425,17,16,292,17,16,292,363,343,342,363,343,342,573,408,574,573,408,574,573,150,408,573,150,408,549,548,495,549,548,495,505,269,270,505,269,270,333,137,443,333,137,443,450,437,436,450,437,436,371,524,523,371,524,523,371,345,524,371,345,524,575,197,196,575,197,196,576,344,577,576,344,577,576,345,344,576,345,344,576,578,345,576,578,345,91,171,92,91,171,92,314,116,171,314,116,171,92,188,88,92,188,88,325,54,124,325,54,124,434,123,62,434,123,62,433,565,564,433,565,564,389,163,579,389,163,579,580,581,582,580,581,582,511,583,504,511,583,504,579,163,504,579,163,504,284,430,170,284,430,170,94,385,95,94,385,95,94,438,385,94,438,385,319,290,59,319,290,59,156,117,461,156,117,461,156,298,117,156,298,117,422,327,379,422,327,379,481,108,584,481,108,584,196,585,586,196,585,586,303,497,585,303,497,585,489,532,1,489,532,1,489,490,532,489,490,532,143,506,270,143,506,270,587,506,143,587,506,143,405,202,257,405,202,257,518,22,542,518,22,542,334,335,367,334,335,367,334,280,100,334,280,100,261,144,262,261,144,262,428,377,429,428,377,429,428,284,377,428,284,377,588,239,238,588,239,238,385,412,95,385,412,95,461,536,156,461,536,156,461,460,536,461,460,536,283,285,96,283,285,96,329,484,571,329,484,571,587,143,174,587,143,174,589,590,591,589,590,591,526,550,11,526,550,11,9,548,547,9,548,547,592,9,547,592,9,547,320,537,593,320,537,593,594,525,10,594,525,10,391,392,26,391,392,26,392,24,26,392,24,26,392,228,469,392,228,469,223,227,366,223,227,366,223,49,227,223,49,227,515,454,455,515,454,455,321,363,322,321,363,322,363,321,362,363,321,362,342,340,245,342,340,245,396,398,261,396,398,261,396,510,398,396,510,398,595,596,580,595,596,580,267,424,425,267,424,425,267,482,424,267,482,424,597,152,151,597,152,151,597,415,152,597,415,152,315,598,537,315,598,537,557,435,264,557,435,264,282,144,143,282,144,143,168,485,353,168,485,353,168,599,485,168,599,485,600,588,238,600,588,238,147,502,238,147,502,238,538,536,460,538,536,460,601,55,422,601,55,422,27,546,28,27,546,28,27,602,546,27,602,546,546,370,369,546,370,369,546,603,370,546,603,370,565,294,293,565,294,293,293,604,566,293,604,566,446,605,487,446,605,487,606,607,458,606,607,458,608,609,233,608,609,233,244,245,519,244,245,519,133,135,498,133,135,498,589,413,610,589,413,610,337,336,528,337,336,528,67,379,373,67,379,373,379,380,611,379,380,611,539,29,471,539,29,471,575,612,613,575,612,613,613,614,120,613,614,120,540,89,88,540,89,88,198,540,56,198,540,56,198,89,540,198,89,540,192,189,101,192,189,101,192,105,189,192,105,189,486,400,354,486,400,354,615,400,486,615,400,486,351,184,352,351,184,352,570,139,616,570,139,616,240,382,381,240,382,381,617,427,600,617,427,600,550,526,618,550,526,618,516,549,419,516,549,419,394,552,390,394,552,390,619,561,568,619,561,568,619,620,621,619,620,621,306,604,545,306,604,545,306,556,604,306,556,604,307,370,521,307,370,521,479,220,480,479,220,480,91,314,171,91,314,171,91,569,314,91,569,314,175,399,512,175,399,512,393,622,394,393,622,394,516,513,266,516,513,266,516,419,513,516,419,513,623,411,203,623,411,203,357,36,359,357,36,359,11,548,9,11,548,9,11,551,548,11,551,548,418,416,415,418,416,415,71,599,168,71,599,168,556,306,308,556,306,308,129,536,538,129,536,538,538,471,129,538,471,129,538,539,471,538,539,471,547,317,624,547,317,624,128,294,431,128,294,431,128,295,294,128,295,294,240,148,147,240,148,147,148,240,381,148,240,381,597,418,415,597,418,415,573,151,150,573,151,150,625,573,574,625,573,574,572,484,483,572,484,483,584,479,480,584,479,480,584,483,479,584,483,479,484,299,479,484,299,479,302,121,193,302,121,193,302,119,121,302,119,121,482,108,481,482,108,481,482,513,108,482,513,108,436,308,305,436,308,305,524,345,578,524,345,578,578,451,167,578,451,167,520,450,436,520,450,436,626,515,627,626,515,627,402,627,515,402,627,515,402,260,627,402,260,627,620,206,621,620,206,621,620,563,206,620,563,206,206,514,621,206,514,621,559,628,561,559,628,561,561,621,514,561,621,514,561,619,621,561,619,621,155,145,190,155,145,190,387,6,8,387,6,8,629,432,42,629,432,42,560,378,430,560,378,430,99,98,476,99,98,476,24,392,469,24,392,469,630,5,472,630,5,472,630,562,5,630,562,5,304,303,569,304,303,569,26,332,391,26,332,391,317,549,318,317,549,318,182,262,404,182,262,404,604,293,295,604,293,295,631,433,564,631,433,564,555,632,556,555,632,556,632,633,634,632,633,634,635,633,362,635,633,362,635,634,633,635,634,633,526,11,10,526,11,10,434,322,123,434,322,123,434,323,322,434,323,322,125,342,410,125,342,410,497,133,498,497,133,498,60,290,636,60,290,636,132,552,394,132,552,394,132,131,552,132,131,552,542,164,376,542,164,376,403,191,190,403,191,190,422,553,327,422,553,327,533,0,2,533,0,2,132,622,637,132,622,637,557,18,20,557,18,20,482,478,424,482,478,424,638,639,564,638,639,564,174,143,142,174,143,142,303,585,196,303,585,196,303,195,569,303,195,569,303,196,195,303,196,195,29,295,128,29,295,128,312,569,91,312,569,91,583,579,504,583,579,504,583,640,579,583,640,579,396,475,510,396,475,510,313,567,312,313,567,312,200,372,188,200,372,188,359,115,44,359,115,44,359,94,115,359,94,115,419,416,418,419,416,418,641,276,278,641,276,278,641,439,276,641,439,276,501,618,642,501,618,642,381,414,643,381,414,643,381,375,414,381,375,414,148,643,496,148,643,496,148,381,643,148,381,643,509,172,173,509,172,173,221,113,115,221,113,115,221,285,113,221,285,113,251,176,250,251,176,250,644,356,400,644,356,400,374,375,381,374,375,381,568,567,313,568,567,313,645,134,567,645,134,567,603,554,165,603,554,165,646,645,647,646,645,647,376,407,406,376,407,406,575,119,197,575,119,197,575,613,119,575,613,119,379,67,422,379,67,422,571,330,329,571,330,329,420,324,361,420,324,361,539,27,29,539,27,29,177,178,76,177,178,76,648,84,178,648,84,178,436,521,520,436,521,520,436,305,521,436,305,521,305,307,521,305,307,521,447,487,384,447,487,384,238,502,501,238,502,501,200,331,201,200,331,201,200,188,331,200,188,331,23,0,504,23,0,504,513,419,108,513,419,108,482,267,513,482,267,513,326,421,649,326,421,649,165,370,603,165,370,603,265,264,576,265,264,576,68,426,69,68,426,69,606,650,651,606,650,651,282,458,262,282,458,262,490,384,487,490,384,487,466,468,467,466,468,467,138,466,463,138,466,463,24,468,466,24,468,466,113,284,170,113,284,170,652,406,1,652,406,1,652,376,406,652,376,406,542,376,652,542,376,652,422,439,653,422,439,653,405,1,406,405,1,406,405,257,1,405,257,1,654,244,519,654,244,519,606,237,236,606,237,236,167,450,520,167,450,520,541,201,449,541,201,449,544,553,325,544,553,325,426,427,617,426,427,617,367,97,334,367,97,334,404,262,235,404,262,235,126,234,237,126,234,237,126,235,234,126,235,234,556,308,435,556,308,435,57,541,444,57,541,444,57,56,541,57,56,541,97,391,332,97,391,332,213,212,456,213,212,456,609,234,233,609,234,233,655,132,637,655,132,637,416,549,495,416,549,495,629,42,44,629,42,44,421,420,656,421,420,656,608,236,609,608,236,609,127,656,420,127,656,420,541,449,657,541,449,657,435,308,436,435,308,436,511,582,583,511,582,583,511,533,582,511,533,582,658,649,656,658,649,656,488,487,605,488,487,605,149,500,502,149,500,502,409,259,258,409,259,258,659,605,446,659,605,446,659,446,444,659,446,444,657,444,541,657,444,541,657,660,444,657,660,444,282,606,458,282,606,458,282,650,606,282,650,606,68,282,143,68,282,143,612,661,614,612,661,614,612,575,661,612,575,661,235,126,404,235,126,404,415,414,152,415,414,152,383,447,384,383,447,384,299,484,329,299,484,329,300,330,331,300,330,331,603,546,602,603,546,602,560,662,378,560,662,378,518,23,22,518,23,22,68,663,282,68,663,282,68,279,663,68,279,663,185,125,410,185,125,410,185,126,125,185,126,125,664,551,550,664,551,550,551,664,495,551,664,495,551,495,548,551,495,548,638,566,604,638,566,604,545,604,28,545,604,28,604,295,28,604,295,28,318,549,516,318,549,516,317,547,549,317,547,549,268,591,317,268,591,317,589,268,413,589,268,413,589,591,268,589,591,268,644,39,357,644,39,357,641,278,618,641,278,618,199,201,541,199,201,541,236,607,606,236,607,606,520,165,167,520,165,167,520,370,165,520,370,165,371,248,247,371,248,247,371,523,248,371,523,248,452,386,385,452,386,385,383,8,543,383,8,543,412,387,8,412,387,8,386,452,563,386,452,563,502,147,149,502,147,149,448,330,665,448,330,665,120,539,460,120,539,460,659,488,605,659,488,605,508,173,488,508,173,488,133,304,134,133,304,134,534,409,258,534,409,258,574,408,409,574,408,409,206,177,78,206,177,78,652,518,542,652,518,542,652,1,518,652,1,518,57,7,6,57,7,6,624,592,547,624,592,547,501,500,618,501,500,618,463,440,442,463,440,442,453,358,477,453,358,477,453,438,358,453,438,358,666,572,483,666,572,483,270,507,505,270,507,505,643,416,496,643,416,496,120,119,613,120,119,613,539,602,27,539,602,27,539,667,602,539,667,602,648,178,177,648,178,177,84,648,82,84,648,82,85,82,648,85,82,648,453,86,85,453,86,85,85,648,453,85,648,453,556,634,639,556,634,639,419,109,108,419,109,108,145,403,190,145,403,190,421,544,324,421,544,324,498,130,499,498,130,499,498,131,130,498,131,130,566,565,293,566,565,293,201,330,448,201,330,448,625,448,668,625,448,668,625,449,448,625,449,448,634,556,632,634,556,632,556,639,638,556,639,638,421,656,649,421,656,649,315,601,598,315,601,598,315,55,601,315,55,601,669,9,592,669,9,592,669,592,670,669,592,670,664,149,495,664,149,495,518,0,23,518,0,23,263,557,264,263,557,264,557,633,555,557,633,555,557,20,633,557,20,633,555,633,632,555,633,632,578,437,451,578,437,451,639,631,564,639,631,564,233,235,457,233,235,457,671,457,458,671,457,458,378,662,629,378,662,629,623,368,283,623,368,283,623,377,368,623,377,368,643,414,416,643,414,416,411,96,95,411,96,95,203,405,407,203,405,407,203,202,405,203,202,405,204,411,412,204,411,412,204,203,411,204,203,411,672,659,660,672,659,660,672,488,659,672,488,659,659,444,660,659,444,660,2,1,532,2,1,532,437,264,435,437,264,435,673,238,501,673,238,501,89,198,619,89,198,619,529,476,662,529,476,662,662,432,629,662,432,629,662,476,432,662,476,432,366,4,97,366,4,97,366,227,4,366,227,4,558,628,559,558,628,559,673,600,238,673,600,238,636,320,593,636,320,593,636,290,320,636,290,320,623,407,570,623,407,570,533,2,172,533,2,172,545,307,306,545,307,306,545,369,307,545,369,307,545,546,369,545,546,369,416,419,549,416,419,549,445,7,57,445,7,57,655,130,132,655,130,132,224,503,552,224,503,552,622,132,394,622,132,394,584,480,481,584,480,481,108,107,584,108,107,584,10,9,669,10,9,669,164,542,21,164,542,21,291,431,527,291,431,527,674,565,675,674,565,675,456,58,590,456,58,590,456,162,58,456,162,58,294,674,527,294,674,527,294,565,674,294,565,674,456,590,610,456,590,610,676,249,40,676,249,40,497,303,133,497,303,133,637,393,677,637,393,677,583,582,581,583,582,581,678,581,580,678,581,580,389,579,640,389,579,640,679,389,640,679,389,640,680,677,681,680,677,681,586,523,661,586,523,661,586,248,523,586,248,523,585,499,682,585,499,682,683,655,637,683,655,637,412,383,204,412,383,204,412,8,383,412,8,383,642,673,501,642,673,501,148,495,149,148,495,149,440,558,559,440,558,559,440,463,558,440,463,558,224,226,503,224,226,503,224,131,225,224,131,225,372,200,540,372,200,540,19,265,576,19,265,576,19,18,265,19,18,265,684,519,341,684,519,341,685,185,244,685,185,244,181,685,348,181,685,348,517,347,686,517,347,686,494,179,517,494,179,517,497,499,585,497,499,585,677,680,687,677,680,687,343,341,340,343,341,340,688,684,341,688,684,341,682,586,585,682,586,585,680,689,690,680,689,690,688,341,343,688,341,343,685,181,185,685,181,185,684,654,519,684,654,519,244,654,685,244,654,685,686,689,691,686,689,691,246,586,682,246,586,682,246,690,247,246,690,247,499,692,682,499,692,682,663,650,282,663,650,282,571,665,330,571,665,330,571,572,665,571,572,665,387,412,385,387,412,385,239,65,64,239,65,64,136,463,442,136,463,442,664,500,149,664,500,149,657,574,409,657,574,409,625,657,449,625,657,449,657,534,693,657,534,693,657,409,534,657,409,534,683,677,687,683,677,687,637,677,683,637,677,683,499,655,683,499,655,683,499,130,655,499,130,655,328,327,694,328,327,694,326,380,327,326,380,327,439,526,525,439,526,525,439,641,526,439,641,526,641,618,526,641,618,526,645,567,568,645,567,568,498,695,131,498,695,131,628,465,645,628,465,645,628,558,465,628,558,465,498,135,695,498,135,695,646,647,696,646,647,696,646,135,134,646,135,134,372,540,88,372,540,88,597,109,418,597,109,418,151,573,625,151,573,625,151,109,597,151,109,597,668,665,666,668,665,666,668,448,665,668,448,665,665,572,666,665,572,666,247,346,371,247,346,371,586,697,196,586,697,196,246,248,586,246,248,586,563,453,177,563,453,177,395,182,492,395,182,492,524,167,166,524,167,166,642,278,617,642,278,617,300,331,301,300,331,301,127,361,125,127,361,125,80,45,84,80,45,84,80,46,45,80,46,45,429,47,337,429,47,337,429,530,47,429,530,47,286,559,514,286,559,514,286,46,559,286,46,559,489,1,257,489,1,257,599,71,70,599,71,70,698,486,485,698,486,485,698,615,486,698,615,486,599,698,485,599,698,485,697,586,661,697,586,661,575,196,661,575,196,661,697,661,196,697,661,196,661,339,554,661,339,554,661,523,339,661,523,339,528,529,560,528,529,560,528,336,529,528,336,529,629,114,378,629,114,378,629,44,114,629,44,114,114,44,115,114,44,115,653,439,525,653,439,525,594,10,669,594,10,669,667,614,603,667,614,603,380,326,649,380,326,649,653,525,594,653,525,594,653,601,422,653,601,422,619,90,89,619,90,89,619,568,90,619,568,90,386,563,620,386,563,620,25,138,137,25,138,137,136,138,463,136,138,463,138,24,466,138,24,466,271,226,272,271,226,272,271,503,226,271,503,226,695,225,131,695,225,131,695,135,630,695,135,630,699,272,226,699,272,226,699,226,225,699,226,225,472,5,227,472,5,227,531,699,472,531,699,472,557,263,18,557,263,18,120,667,539,120,667,539,614,554,603,614,554,603,614,661,554,614,661,554,500,550,618,500,550,618,500,664,550,500,664,550,312,304,569,312,304,569,688,362,19,688,362,19,635,639,634,635,639,634,635,323,631,635,323,631,20,362,633,20,362,633,700,588,600,700,588,600,491,351,701,491,351,701,491,184,351,491,184,351,287,32,14,287,32,14,32,287,30,32,287,30,198,386,619,198,386,619,198,387,386,198,387,386,386,620,619,386,620,619,627,260,403,627,260,403,686,691,517,686,691,517,691,680,702,691,680,702,691,689,680,691,689,680,582,595,580,582,595,580,389,393,390,389,393,390,349,701,351,349,701,351,588,65,239,588,65,239,588,703,65,588,703,65,505,600,427,505,600,427,617,277,426,617,277,426,617,278,277,617,278,277,578,264,437,578,264,437,578,576,264,578,576,264,348,686,347,348,686,347,348,704,686,348,704,686,693,660,657,693,660,657,693,672,660,693,672,660,488,672,705,488,672,705,706,65,707,706,65,707,708,534,66,708,534,66,706,708,66,706,708,66,693,534,708,693,534,708,395,475,396,395,475,396,591,624,317,591,624,317,638,564,566,638,564,566,679,393,389,679,393,389,323,433,631,323,433,631,631,639,635,631,639,635,283,96,411,283,96,411,172,509,535,172,509,535,508,709,535,508,709,535,693,705,672,693,705,672,508,488,705,508,488,705,705,709,508,705,709,508,637,622,393,637,622,393,446,487,447,446,487,447,499,687,692,499,687,692,499,683,687,499,683,687,529,662,560,529,662,560,529,99,476,529,99,476,529,100,99,529,100,99,249,70,72,249,70,72,507,710,505,507,710,505,247,344,346,247,344,346,18,263,265,18,263,265,568,628,645,568,628,645,568,561,628,568,561,628,447,543,445,447,543,445,447,383,543,447,383,543,676,70,249,676,70,249,698,599,70,698,599,70,698,70,676,698,70,676,711,535,241,711,535,241,711,712,713,711,712,713,713,535,711,713,535,711,243,711,241,243,711,241,714,507,506,714,507,506,587,714,506,587,714,506,587,243,242,587,243,242,587,174,243,587,174,243,468,24,469,468,24,469,138,25,24,138,25,24,421,328,694,421,328,694,421,326,328,421,326,328,553,694,327,553,694,327,640,581,678,640,581,678,640,583,581,640,583,581,681,677,393,681,677,393,533,172,582,533,172,582,175,243,174,175,243,174,712,711,243,712,711,243,678,679,640,678,679,640,715,679,678,715,679,678,716,678,596,716,678,596,715,678,716,715,678,716,492,491,701,492,491,701,493,701,349,493,701,349,517,702,717,517,702,717,517,691,702,517,691,702,679,681,393,679,681,393,679,715,681,679,715,681,367,366,97,367,366,97,233,671,608,233,671,608,556,638,604,556,638,604,614,613,612,614,613,612,616,531,718,616,531,718,531,48,530,531,48,530,377,530,429,377,530,429,272,616,139,272,616,139,272,699,616,272,699,616,616,718,570,616,718,570,623,203,407,623,203,407,718,623,570,718,623,570,109,668,666,109,668,666,668,151,625,668,151,625,668,109,151,668,109,151,625,574,657,625,574,657,719,373,379,719,373,379,473,175,512,473,175,512,720,243,175,720,243,175,535,721,172,535,721,172,582,721,595,582,721,595,582,172,721,582,172,721,720,712,243,720,712,243,678,580,596,678,580,596,596,722,723,596,722,723,696,724,646,696,724,646,647,464,467,647,464,467,647,465,464,647,465,464,467,696,647,467,696,647,724,467,469,724,467,469,696,467,724,696,467,724,135,724,630,135,724,630,135,646,724,135,646,724,148,496,495,148,496,495,380,658,725,380,658,725,380,649,658,380,649,658,726,237,651,726,237,651,127,126,237,127,126,237,19,576,577,19,576,577,595,712,722,595,712,722,595,721,712,595,721,712,601,653,594,601,653,594,727,728,729,727,728,729,727,626,728,727,626,728,454,515,626,454,515,626,729,403,145,729,403,145,729,145,30,729,145,30,728,403,729,728,403,729,727,729,30,727,729,30,287,727,30,287,727,30,65,706,66,65,706,66,708,705,693,708,705,693,702,681,715,702,681,715,702,680,681,702,680,681,644,40,39,644,40,39,667,120,614,667,120,614,642,618,278,642,618,278,673,642,617,673,642,617,617,600,673,617,600,673,730,705,708,730,705,708,709,730,731,709,730,731,709,705,730,709,705,730,709,241,535,709,241,535,709,731,241,709,731,241,703,588,700,703,588,700,505,710,600,505,710,600,587,242,714,587,242,714,710,700,600,710,700,600,242,241,731,242,241,731,703,707,65,703,707,65,730,708,706,730,708,706,730,732,731,730,732,731,706,732,730,706,732,730,733,707,700,733,707,700,703,700,707,703,700,707,732,706,707,732,706,707,733,732,707,733,732,707,507,714,710,507,714,710,732,242,731,732,242,731,732,733,242,732,733,242,733,710,714,733,710,714,242,733,714,242,733,714,177,206,563,177,206,563,453,648,177,453,648,177,602,667,603,602,667,603,695,630,225,695,630,225,562,724,469,562,724,469,225,630,699,225,630,699,472,699,630,472,699,630,630,724,562,630,724,562,647,645,465,647,645,465,646,134,645,646,134,645,710,733,700,710,733,700,167,524,578,167,524,578,644,400,615,644,400,615,676,644,615,676,644,615,676,40,644,676,40,644,698,676,615,698,676,615,721,713,712,721,713,712,721,535,713,721,535,713,596,595,722,596,595,722,720,175,473,720,175,473,722,712,720,722,712,720,473,722,720,473,722,720,734,723,722,734,723,722,734,722,473,734,722,473,717,702,715,717,702,715,395,735,475,395,735,475,395,492,735,395,492,735,735,473,475,735,473,475,735,734,473,735,734,473,517,493,494,517,493,494,517,717,493,517,717,493,736,493,717,736,493,717,717,715,716,717,715,716,723,734,736,723,734,736,723,736,717,723,736,717,493,492,701,493,492,701,736,735,492,736,735,492,736,734,735,736,734,735,736,492,493,736,492,493,716,723,717,716,723,717,716,596,723,716,596,723,610,527,674,610,527,674,291,610,413,291,610,413,291,527,610,291,527,610,522,675,565,522,675,565,456,610,213,456,610,213,598,593,537,598,593,537,598,670,593,598,670,593,592,737,670,592,737,670,592,624,737,592,624,737,594,669,670,594,669,670,594,598,601,594,598,601,594,670,598,594,670,598,60,590,58,60,590,58,591,737,624,591,737,624,670,636,593,670,636,593,60,636,737,60,636,737,210,296,211,210,296,211,210,61,296,210,61,296,591,60,737,591,60,737,591,590,60,591,590,60,522,210,211,522,210,211,522,62,210,522,62,210,737,636,670,737,636,670,610,590,589,610,590,589,522,434,62,522,434,62,211,675,522,211,675,522,211,213,675,211,213,675,674,213,610,674,213,610,674,675,213,674,675,213,531,616,699,531,616,699,283,411,623,283,411,623,531,530,718,531,530,718,718,377,623,718,377,623,718,530,377,718,530,377,644,357,356,644,357,356,109,666,107,109,666,107,584,666,483,584,666,483,584,107,666,584,107,666,728,627,403,728,627,403,728,626,627,728,626,627,727,454,626,727,454,626,727,287,454,727,287,454,544,694,553,544,694,553,544,421,694,544,421,694,738,684,688,738,684,688,348,685,739,348,685,739,740,738,577,740,738,577,704,689,686,704,689,686,739,684,738,739,684,738,739,654,684,739,654,684,739,738,740,739,738,740,739,740,741,739,740,741,577,742,740,577,742,740,738,19,577,738,19,577,323,635,321,323,635,321,692,687,680,692,687,680,689,743,690,689,743,690,742,577,344,742,577,344,692,680,690,692,680,690,690,682,692,690,682,692,690,246,682,690,246,682,690,344,247,690,344,247,742,344,690,742,344,690,743,689,704,743,689,704,741,743,704,741,743,704,362,321,635,362,321,635,362,688,343,362,688,343,362,20,19,362,20,19,688,19,738,688,19,738,348,741,704,348,741,704,348,739,741,348,739,741,654,739,685,654,739,685,740,742,741,740,742,741,741,690,743,741,690,743,742,690,741,742,690,741,342,361,363,342,361,363,342,125,361,342,125,361,719,279,373,719,279,373,651,650,744,651,650,744,663,744,650,663,744,650,663,745,744,663,745,744,611,380,725,611,380,725,745,279,746,745,279,746,745,663,279,745,663,279,747,745,746,747,745,746,608,671,607,608,671,607,746,279,719,746,279,719,747,748,749,747,748,749,750,744,745,750,744,745,750,651,744,750,651,744,608,607,236,608,607,236,234,609,236,234,609,236,233,457,671,233,457,671,671,458,607,671,458,607,606,651,237,606,651,237,726,651,750,726,651,750,746,748,747,746,748,747,747,750,745,747,750,745,747,726,750,747,726,750,751,749,725,751,749,725,747,749,726,747,749,726,379,748,719,379,748,719,379,611,748,379,611,748,746,719,748,746,719,748,611,749,748,611,749,748,611,725,749,611,725,749,725,658,751,725,658,751,127,420,361,127,420,361,656,751,658,656,751,658,127,237,726,127,237,726,127,751,656,127,751,656,726,751,127,726,751,127,726,749,751,726,749,751]}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = [{"name":"Icosphere","vertices":[{"x":-0.011315,"y":0.583982,"z":-0.048788},{"x":0.414007,"y":0.733328,"z":0.260223},{"x":-0.173771,"y":0.733328,"z":0.451207},{"x":0.712292,"y":1.136763,"z":0.476937},{"x":0.839332,"y":1.058246,"z":-0.048788},{"x":-0.537045,"y":0.733331,"z":-0.048788},{"x":-0.173771,"y":0.733328,"z":-0.548783},{"x":0.414007,"y":0.733328,"z":-0.357799},{"x":0.939742,"y":1.583982,"z":0.260225},{"x":-0.287703,"y":1.136762,"z":0.801861},{"x":0.251553,"y":1.058245,"z":0.760224},{"x":-0.011315,"y":1.583982,"z":0.951212},{"x":-0.905742,"y":1.136767,"z":-0.048788},{"x":-0.699505,"y":1.058246,"z":0.451209},{"x":-0.962373,"y":1.583982,"z":0.260225},{"x":-0.287703,"y":1.136762,"z":-0.899437},{"x":-0.699505,"y":1.058246,"z":-0.548785},{"x":-0.599101,"y":1.583982,"z":-0.857805},{"x":0.712292,"y":1.136763,"z":-0.574513},{"x":0.251553,"y":1.058245,"z":-0.8578},{"x":0.57647,"y":1.583982,"z":-0.857805},{"x":0.57647,"y":1.583982,"z":0.760229},{"x":-0.599101,"y":1.583982,"z":0.760229},{"x":-0.962373,"y":1.583982,"z":-0.357801},{"x":-0.011315,"y":1.583982,"z":-1.048788},{"x":0.939742,"y":1.583982,"z":-0.357801},{"x":0.265073,"y":2.031202,"z":0.801861},{"x":0.676874,"y":2.109719,"z":0.451209},{"x":0.15114,"y":2.434637,"z":0.451207},{"x":-0.734923,"y":2.031202,"z":0.476937},{"x":-0.274184,"y":2.10972,"z":0.760224},{"x":-0.436638,"y":2.434637,"z":0.260223},{"x":-0.734923,"y":2.031202,"z":-0.574513},{"x":-0.861963,"y":2.109718,"z":-0.048788},{"x":-0.436638,"y":2.434637,"z":-0.357799},{"x":0.265073,"y":2.031202,"z":-0.899437},{"x":-0.274184,"y":2.10972,"z":-0.8578},{"x":0.15114,"y":2.434637,"z":-0.548783},{"x":0.883111,"y":2.031198,"z":-0.048788},{"x":0.676874,"y":2.109719,"z":-0.548785},{"x":0.514414,"y":2.434634,"z":-0.048788},{"x":-0.011315,"y":2.583982,"z":-0.048788}],"normals":[{"x":0.1024,"y":-0.9435,"z":0.3151},{"x":0.7002,"y":-0.6617,"z":0.268},{"x":-0.268,"y":-0.9435,"z":0.1947},{"x":-0.268,"y":-0.9435,"z":-0.1947},{"x":0.1024,"y":-0.9435,"z":-0.3151},{"x":0.905,"y":-0.3304,"z":0.268},{"x":0.0247,"y":-0.3304,"z":0.9435},{"x":-0.8897,"y":-0.3304,"z":0.3151},{"x":-0.5746,"y":-0.3304,"z":-0.7488},{"x":0.5346,"y":-0.3304,"z":-0.7779},{"x":0.8026,"y":-0.1256,"z":0.5831},{"x":-0.3066,"y":-0.1256,"z":0.9435},{"x":-0.9921,"y":-0.1256,"z":0},{"x":-0.3066,"y":-0.1256,"z":-0.9435},{"x":0.8026,"y":-0.1256,"z":-0.5831},{"x":0.4089,"y":0.6617,"z":0.6284},{"x":-0.4713,"y":0.6617,"z":0.5831},{"x":-0.7002,"y":0.6617,"z":-0.268},{"x":0.0385,"y":0.6617,"z":-0.7488},{"x":0.724,"y":0.6617,"z":-0.1947},{"x":0.268,"y":0.9435,"z":-0.1947},{"x":0.4911,"y":0.7947,"z":-0.3568},{"x":0.4089,"y":0.6617,"z":-0.6284},{"x":-0.1024,"y":0.9435,"z":-0.3151},{"x":-0.1876,"y":0.7947,"z":-0.5773},{"x":-0.4713,"y":0.6617,"z":-0.5831},{"x":-0.3313,"y":0.9435,"z":0},{"x":-0.6071,"y":0.7947,"z":0},{"x":-0.7002,"y":0.6617,"z":0.268},{"x":-0.1024,"y":0.9435,"z":0.3151},{"x":-0.1876,"y":0.7947,"z":0.5773},{"x":0.0385,"y":0.6617,"z":0.7488},{"x":0.268,"y":0.9435,"z":0.1947},{"x":0.4911,"y":0.7947,"z":0.3568},{"x":0.724,"y":0.6617,"z":0.1947},{"x":0.8897,"y":0.3304,"z":-0.3151},{"x":0.7947,"y":0.1876,"z":-0.5773},{"x":0.5746,"y":0.3304,"z":-0.7488},{"x":-0.0247,"y":0.3304,"z":-0.9435},{"x":-0.3035,"y":0.1876,"z":-0.9342},{"x":-0.5346,"y":0.3304,"z":-0.7779},{"x":-0.905,"y":0.3304,"z":-0.268},{"x":-0.9822,"y":0.1876,"z":0},{"x":-0.905,"y":0.3304,"z":0.268},{"x":-0.5346,"y":0.3304,"z":0.7779},{"x":-0.3035,"y":0.1876,"z":0.9342},{"x":-0.0247,"y":0.3304,"z":0.9435},{"x":0.5746,"y":0.3304,"z":0.7488},{"x":0.7947,"y":0.1876,"z":0.5773},{"x":0.8897,"y":0.3304,"z":0.3151},{"x":0.3066,"y":0.1256,"z":-0.9435},{"x":0.3035,"y":-0.1876,"z":-0.9342},{"x":0.0247,"y":-0.3304,"z":-0.9435},{"x":-0.8026,"y":0.1256,"z":-0.5831},{"x":-0.7947,"y":-0.1876,"z":-0.5773},{"x":-0.8897,"y":-0.3304,"z":-0.3151},{"x":-0.8026,"y":0.1256,"z":0.5831},{"x":-0.7947,"y":-0.1876,"z":0.5773},{"x":-0.5746,"y":-0.3304,"z":0.7488},{"x":0.3066,"y":0.1256,"z":0.9435},{"x":0.3035,"y":-0.1876,"z":0.9342},{"x":0.5346,"y":-0.3304,"z":0.7779},{"x":0.9921,"y":0.1256,"z":0},{"x":0.9822,"y":-0.1876,"z":0},{"x":0.905,"y":-0.3304,"z":-0.268},{"x":0.4713,"y":-0.6617,"z":-0.5831},{"x":0.1876,"y":-0.7947,"z":-0.5773},{"x":-0.0385,"y":-0.6617,"z":-0.7488},{"x":-0.4089,"y":-0.6617,"z":-0.6284},{"x":-0.4911,"y":-0.7947,"z":-0.3568},{"x":-0.724,"y":-0.6617,"z":-0.1947},{"x":-0.724,"y":-0.6617,"z":0.1947},{"x":-0.4911,"y":-0.7947,"z":0.3568},{"x":-0.4089,"y":-0.6617,"z":0.6284},{"x":0.7002,"y":-0.6617,"z":-0.268},{"x":0.6071,"y":-0.7947,"z":0},{"x":0.3313,"y":-0.9435,"z":0},{"x":-0.0385,"y":-0.6617,"z":0.7488},{"x":0.1876,"y":-0.7947,"z":0.5773},{"x":0.4713,"y":-0.6617,"z":0.5831}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[3,1,4],"normals":[1,1,1]},{"vertices":[0,2,5],"normals":[2,2,2]},{"vertices":[0,5,6],"normals":[3,3,3]},{"vertices":[0,6,7],"normals":[4,4,4]},{"vertices":[3,4,8],"normals":[5,5,5]},{"vertices":[9,10,11],"normals":[6,6,6]},{"vertices":[12,13,14],"normals":[7,7,7]},{"vertices":[15,16,17],"normals":[8,8,8]},{"vertices":[18,19,20],"normals":[9,9,9]},{"vertices":[3,8,21],"normals":[10,10,10]},{"vertices":[9,11,22],"normals":[11,11,11]},{"vertices":[12,14,23],"normals":[12,12,12]},{"vertices":[15,17,24],"normals":[13,13,13]},{"vertices":[18,20,25],"normals":[14,14,14]},{"vertices":[26,27,28],"normals":[15,15,15]},{"vertices":[29,30,31],"normals":[16,16,16]},{"vertices":[32,33,34],"normals":[17,17,17]},{"vertices":[35,36,37],"normals":[18,18,18]},{"vertices":[38,39,40],"normals":[19,19,19]},{"vertices":[40,37,41],"normals":[20,20,20]},{"vertices":[40,39,37],"normals":[21,21,21]},{"vertices":[39,35,37],"normals":[22,22,22]},{"vertices":[37,34,41],"normals":[23,23,23]},{"vertices":[37,36,34],"normals":[24,24,24]},{"vertices":[36,32,34],"normals":[25,25,25]},{"vertices":[34,31,41],"normals":[26,26,26]},{"vertices":[34,33,31],"normals":[27,27,27]},{"vertices":[33,29,31],"normals":[28,28,28]},{"vertices":[31,28,41],"normals":[29,29,29]},{"vertices":[31,30,28],"normals":[30,30,30]},{"vertices":[30,26,28],"normals":[31,31,31]},{"vertices":[28,40,41],"normals":[32,32,32]},{"vertices":[28,27,40],"normals":[33,33,33]},{"vertices":[27,38,40],"normals":[34,34,34]},{"vertices":[25,39,38],"normals":[35,35,35]},{"vertices":[25,20,39],"normals":[36,36,36]},{"vertices":[20,35,39],"normals":[37,37,37]},{"vertices":[24,36,35],"normals":[38,38,38]},{"vertices":[24,17,36],"normals":[39,39,39]},{"vertices":[17,32,36],"normals":[40,40,40]},{"vertices":[23,33,32],"normals":[41,41,41]},{"vertices":[23,14,33],"normals":[42,42,42]},{"vertices":[14,29,33],"normals":[43,43,43]},{"vertices":[22,30,29],"normals":[44,44,44]},{"vertices":[22,11,30],"normals":[45,45,45]},{"vertices":[11,26,30],"normals":[46,46,46]},{"vertices":[21,27,26],"normals":[47,47,47]},{"vertices":[21,8,27],"normals":[48,48,48]},{"vertices":[8,38,27],"normals":[49,49,49]},{"vertices":[20,24,35],"normals":[50,50,50]},{"vertices":[20,19,24],"normals":[51,51,51]},{"vertices":[19,15,24],"normals":[52,52,52]},{"vertices":[17,23,32],"normals":[53,53,53]},{"vertices":[17,16,23],"normals":[54,54,54]},{"vertices":[16,12,23],"normals":[55,55,55]},{"vertices":[14,22,29],"normals":[56,56,56]},{"vertices":[14,13,22],"normals":[57,57,57]},{"vertices":[13,9,22],"normals":[58,58,58]},{"vertices":[11,21,26],"normals":[59,59,59]},{"vertices":[11,10,21],"normals":[60,60,60]},{"vertices":[10,3,21],"normals":[61,61,61]},{"vertices":[8,25,38],"normals":[62,62,62]},{"vertices":[8,4,25],"normals":[63,63,63]},{"vertices":[4,18,25],"normals":[64,64,64]},{"vertices":[7,19,18],"normals":[65,65,65]},{"vertices":[7,6,19],"normals":[66,66,66]},{"vertices":[6,15,19],"normals":[67,67,67]},{"vertices":[6,16,15],"normals":[68,68,68]},{"vertices":[6,5,16],"normals":[69,69,69]},{"vertices":[5,12,16],"normals":[70,70,70]},{"vertices":[5,13,12],"normals":[71,71,71]},{"vertices":[5,2,13],"normals":[72,72,72]},{"vertices":[2,9,13],"normals":[73,73,73]},{"vertices":[4,7,18],"normals":[74,74,74]},{"vertices":[4,1,7],"normals":[75,75,75]},{"vertices":[1,0,7],"normals":[76,76,76]},{"vertices":[2,10,9],"normals":[77,77,77]},{"vertices":[2,1,10],"normals":[78,78,78]},{"vertices":[1,3,10],"normals":[79,79,79]}]},{"name":"Suzanne","vertices":[{"x":4.118035,"y":1.915483,"z":1.6454},{"x":4.048188,"y":1.766142,"z":1.678779},{"x":3.990161,"y":1.915483,"z":1.649901},{"x":4.813286,"y":1.766142,"z":2.332108},{"x":4.835314,"y":1.915483,"z":2.257895},{"x":4.850896,"y":1.915483,"z":2.384895},{"x":3.940867,"y":1.726842,"z":1.731837},{"x":3.870885,"y":1.915483,"z":1.692751},{"x":4.777692,"y":1.726842,"z":2.446415},{"x":4.827257,"y":1.915483,"z":2.509411},{"x":4.11582,"y":1.648242,"z":1.829554},{"x":4.65378,"y":1.648242,"z":2.288925},{"x":4.147048,"y":1.836883,"z":1.659839},{"x":4.182174,"y":1.703262,"z":1.751848},{"x":4.720133,"y":1.703262,"z":2.21122},{"x":4.816508,"y":1.836883,"z":2.231501},{"x":4.223007,"y":1.805443,"z":1.70403},{"x":4.311056,"y":1.766142,"z":1.830895},{"x":4.621876,"y":1.766142,"z":2.096309},{"x":4.760966,"y":1.805443,"z":2.163401},{"x":4.28567,"y":1.726842,"z":1.933248},{"x":4.524763,"y":1.726842,"z":2.137413},{"x":4.358874,"y":1.915483,"z":1.871728},{"x":4.574058,"y":1.915483,"z":2.055476},{"x":4.470094,"y":1.915483,"z":2.080394},{"x":4.292989,"y":1.836883,"z":1.743116},{"x":4.711401,"y":1.836883,"z":2.100405},{"x":4.316898,"y":1.915483,"z":1.763533},{"x":4.311056,"y":2.064825,"z":1.830895},{"x":4.621876,"y":2.064825,"z":2.096309},{"x":4.687492,"y":1.915483,"z":2.079989},{"x":4.350547,"y":1.915483,"z":1.978311},{"x":4.524763,"y":2.111985,"z":2.137413},{"x":4.182174,"y":2.127705,"z":1.751848},{"x":4.28567,"y":2.111985,"z":1.933248},{"x":4.720133,"y":2.127705,"z":2.21122},{"x":4.65378,"y":2.190586,"z":2.288925},{"x":4.223007,"y":2.033384,"z":1.70403},{"x":4.292989,"y":2.001944,"z":1.743116},{"x":4.760966,"y":2.033384,"z":2.163401},{"x":4.147048,"y":2.001944,"z":1.659839},{"x":4.816508,"y":2.001944,"z":2.231501},{"x":4.813286,"y":2.064825,"z":2.332108},{"x":4.048188,"y":2.064825,"z":1.678779},{"x":4.11582,"y":2.190586,"z":1.829554},{"x":4.777692,"y":2.111984,"z":2.446415},{"x":3.940867,"y":2.111985,"z":1.731837},{"x":4.122266,"y":1.915483,"z":1.628341},{"x":4.851499,"y":1.915483,"z":2.251045},{"x":4.832694,"y":2.009804,"z":2.224651},{"x":4.151279,"y":2.009804,"z":1.64278},{"x":4.776278,"y":2.049104,"z":2.145469},{"x":4.238319,"y":2.049104,"z":1.686098},{"x":4.711401,"y":2.001944,"z":2.100405},{"x":4.720737,"y":2.009804,"z":2.077369},{"x":4.314278,"y":2.009804,"z":1.730289},{"x":4.69085,"y":1.915483,"z":2.051849},{"x":4.314278,"y":1.829023,"z":1.730289},{"x":4.344165,"y":1.915483,"z":1.755809},{"x":4.720737,"y":1.829023,"z":2.077369},{"x":4.238319,"y":1.789723,"z":1.686098},{"x":4.776278,"y":1.789723,"z":2.145469},{"x":4.151279,"y":1.829023,"z":1.64278},{"x":4.832694,"y":1.829023,"z":2.224651},{"x":4.253632,"y":1.915483,"z":1.668166},{"x":4.791591,"y":1.915483,"z":2.127537},{"x":4.269485,"y":0.736475,"z":1.940098},{"x":4.359279,"y":0.681455,"z":2.089126},{"x":4.206489,"y":0.697175,"z":1.989663},{"x":4.520532,"y":0.736475,"z":2.154471},{"x":4.400112,"y":0.720755,"z":2.041307},{"x":4.215689,"y":0.752195,"z":1.894161},{"x":4.072503,"y":0.720755,"z":1.916594},{"x":4.574328,"y":0.752195,"z":2.200408},{"x":4.481445,"y":0.697175,"z":2.224453},{"x":4.04772,"y":0.775775,"z":1.885096},{"x":4.609589,"y":0.775775,"z":2.364884},{"x":4.574598,"y":0.720755,"z":2.34534},{"x":4.085196,"y":0.972277,"z":1.865418},{"x":4.212196,"y":0.846516,"z":1.849835},{"x":4.618654,"y":0.846516,"z":2.196916},{"x":4.623155,"y":0.972277,"z":2.324789},{"x":4.115082,"y":1.231658,"z":1.890938},{"x":4.239463,"y":0.964417,"z":1.842111},{"x":4.622012,"y":0.964417,"z":2.168775},{"x":4.593268,"y":1.231658,"z":2.299268},{"x":4.193661,"y":1.48318,"z":1.968373},{"x":4.115685,"y":1.624661,"z":1.757088},{"x":4.416766,"y":1.569641,"z":1.82814},{"x":4.725372,"y":1.624661,"z":2.277709},{"x":4.504481,"y":1.48318,"z":2.233788},{"x":4.60804,"y":1.569641,"z":1.991472},{"x":3.849596,"y":1.632521,"z":1.705578},{"x":3.993924,"y":1.530341,"z":1.839159},{"x":4.817922,"y":1.632521,"z":2.532447},{"x":4.862113,"y":1.726842,"z":2.456488},{"x":3.818701,"y":1.876183,"z":1.59651},{"x":3.917696,"y":1.726842,"z":1.650036},{"x":4.930483,"y":1.876183,"z":2.545878},{"x":3.711982,"y":2.104125,"z":1.515718},{"x":3.638913,"y":1.821163,"z":1.649703},{"x":5.026993,"y":2.104125,"z":2.638625},{"x":4.978167,"y":2.049103,"z":2.514245},{"x":3.845968,"y":2.159145,"z":1.588787},{"x":3.842475,"y":2.049104,"z":1.544461},{"x":4.933841,"y":2.159145,"z":2.517737},{"x":4.982262,"y":2.088404,"z":2.42472},{"x":4.054166,"y":2.277046,"z":1.683883},{"x":3.930253,"y":2.088405,"z":1.526394},{"x":4.807309,"y":2.277045,"z":2.327003},{"x":4.836925,"y":2.222026,"z":2.207592},{"x":4.288622,"y":2.316346,"z":1.687709},{"x":4.167465,"y":2.222026,"z":1.63593},{"x":4.766809,"y":2.316346,"z":2.09604},{"x":4.357128,"y":2.394947,"z":1.849565},{"x":4.216291,"y":2.434247,"z":1.76031},{"x":4.596221,"y":2.394947,"z":2.05373},{"x":4.693334,"y":2.292766,"z":2.012627},{"x":4.423751,"y":2.167005,"z":1.916792},{"x":4.382514,"y":2.292766,"z":1.747212},{"x":4.519389,"y":2.167005,"z":1.998458},{"x":4.610525,"y":2.104125,"z":1.95225},{"x":4.466466,"y":2.104125,"z":1.963602},{"x":4.455114,"y":2.104125,"z":1.819543},{"x":4.517507,"y":2.025524,"z":1.903829},{"x":4.2854,"y":2.143425,"z":1.788315},{"x":4.361359,"y":2.088405,"z":1.832506},{"x":4.667949,"y":2.143425,"z":2.11498},{"x":4.215418,"y":2.151285,"z":1.749229},{"x":4.122401,"y":2.111985,"z":1.700807},{"x":4.717514,"y":2.151285,"z":2.177975},{"x":3.955171,"y":2.049104,"z":1.630358},{"x":4.779906,"y":2.111984,"z":2.262261},{"x":3.915076,"y":1.970504,"z":1.616792},{"x":4.875679,"y":2.049103,"z":2.416393},{"x":3.927031,"y":1.860463,"z":1.627},{"x":4.895357,"y":1.970504,"z":2.453868},{"x":4.043958,"y":1.734702,"z":1.695838},{"x":4.883402,"y":1.860463,"z":2.44366},{"x":4.154034,"y":1.687542,"z":1.748491},{"x":4.7971,"y":1.734702,"z":2.338958},{"x":4.311056,"y":1.766142,"z":1.830895},{"x":4.727857,"y":1.687542,"z":2.238487},{"x":4.456258,"y":1.718982,"z":1.975557},{"x":4.621876,"y":1.766142,"z":2.096309},{"x":4.386141,"y":1.978364,"z":1.864004},{"x":4.577415,"y":1.978364,"z":2.027336},{"x":4.481778,"y":1.884043,"z":1.94567},{"x":4.37506,"y":1.884043,"z":1.864877},{"x":4.578289,"y":1.884043,"z":2.038418},{"x":4.346046,"y":1.813303,"z":1.850438},{"x":4.597094,"y":1.813303,"z":2.064811},{"x":4.388022,"y":0.783635,"z":1.958633},{"x":4.48366,"y":0.783635,"z":2.040299},{"x":4.35639,"y":0.830796,"z":1.91095},{"x":4.535709,"y":0.830796,"z":2.064073},{"x":4.377679,"y":0.948696,"z":1.898122},{"x":4.284662,"y":1.223799,"z":1.8497},{"x":4.371702,"y":0.980137,"z":1.893018},{"x":4.551022,"y":0.980137,"z":2.046141},{"x":4.607437,"y":1.223799,"z":2.125323},{"x":4.545044,"y":0.948696,"z":2.041037},{"x":4.466466,"y":1.341699,"z":1.963602},{"x":4.411797,"y":1.223799,"z":1.906584},{"x":4.400715,"y":1.381,"z":1.907457},{"x":4.531343,"y":1.223799,"z":2.008666},{"x":4.47157,"y":1.223799,"z":1.957625},{"x":4.461362,"y":0.987997,"z":1.969579},{"x":4.461362,"y":0.901536,"z":1.969579},{"x":4.375933,"y":1.44388,"z":1.875959},{"x":4.420259,"y":1.39672,"z":1.872466},{"x":4.563715,"y":1.39672,"z":1.994965},{"x":4.567207,"y":1.44388,"z":2.039291},{"x":4.532217,"y":1.381,"z":2.019747},{"x":4.388761,"y":1.522481,"z":1.897249},{"x":4.40058,"y":1.44388,"z":1.834991},{"x":4.603809,"y":1.44388,"z":2.008531},{"x":4.544171,"y":1.522481,"z":2.029956},{"x":4.4621,"y":1.546061,"z":1.908195},{"x":4.466466,"y":1.530341,"z":1.963602},{"x":4.521873,"y":1.546061,"z":1.959236},{"x":4.575669,"y":1.538201,"z":2.005173},{"x":4.502195,"y":1.48318,"z":1.921761},{"x":4.47157,"y":1.47532,"z":1.957625},{"x":4.491987,"y":1.349559,"z":1.933716},{"x":4.507299,"y":1.381,"z":1.915784},{"x":4.567072,"y":1.4203,"z":1.966825},{"x":4.476539,"y":1.522481,"z":1.879181},{"x":4.548267,"y":1.522481,"z":1.940431},{"x":4.440675,"y":1.514621,"z":1.848557},{"x":4.408304,"y":1.538201,"z":1.862258},{"x":4.584131,"y":1.514621,"z":1.971056},{"x":4.606294,"y":1.44388,"z":1.969309},{"x":4.447526,"y":1.4203,"z":1.864742},{"x":4.438929,"y":1.44388,"z":1.826394},{"x":4.522612,"y":1.46746,"z":1.897852},{"x":4.320526,"y":1.42816,"z":1.880325},{"x":4.571573,"y":1.42816,"z":2.094698},{"x":4.583528,"y":1.357419,"z":2.104906},{"x":4.308571,"y":1.357419,"z":1.870117},{"x":4.146715,"y":1.357419,"z":1.938622},{"x":4.541219,"y":1.357419,"z":2.275494},{"x":4.164647,"y":1.4203,"z":1.953934},{"x":4.523287,"y":1.4203,"z":2.260182},{"x":4.38453,"y":0.925116,"z":1.914307},{"x":4.527986,"y":0.925116,"z":2.036806},{"x":4.451154,"y":0.893676,"z":1.981534},{"x":4.374321,"y":0.846516,"z":1.926262},{"x":4.517777,"y":0.846516,"z":2.048761},{"x":4.394873,"y":0.799355,"z":1.974819},{"x":4.466601,"y":0.799355,"z":2.036068},{"x":4.430737,"y":0.775775,"z":2.005443},{"x":4.430737,"y":0.791495,"z":2.005443},{"x":4.395008,"y":0.807215,"z":2.047285},{"x":4.430872,"y":0.815076,"z":2.077909},{"x":4.328384,"y":0.854376,"z":1.980058},{"x":4.359144,"y":0.815076,"z":2.01666},{"x":4.47184,"y":0.854376,"z":2.102557},{"x":4.343697,"y":0.917256,"z":1.962126},{"x":4.487153,"y":0.917256,"z":2.084625},{"x":4.410321,"y":0.885816,"z":2.029353},{"x":4.343427,"y":1.829023,"z":1.817194},{"x":4.360486,"y":1.891903,"z":1.821425},{"x":4.630338,"y":1.829023,"z":2.062192},{"x":4.623488,"y":1.891903,"z":2.046006},{"x":4.354508,"y":1.970504,"z":1.816321},{"x":4.629465,"y":1.970504,"z":2.051111},{"x":4.330599,"y":2.049104,"z":1.795904},{"x":4.653374,"y":2.049104,"z":2.071527},{"x":4.665329,"y":1.781862,"z":2.081735},{"x":4.179554,"y":1.734702,"z":1.718604},{"x":4.318644,"y":1.781862,"z":1.785696},{"x":4.753377,"y":1.734702,"z":2.2086},{"x":4.086537,"y":1.774002,"z":1.670182},{"x":4.81577,"y":1.774002,"z":2.292886},{"x":3.983311,"y":1.868323,"z":1.633715},{"x":4.867955,"y":1.868323,"z":2.389126},{"x":3.982438,"y":1.962644,"z":1.622634},{"x":4.879036,"y":1.962644,"z":2.388253},{"x":4.866209,"y":2.025523,"z":2.366963},{"x":4.005474,"y":2.025524,"z":1.631969},{"x":4.809658,"y":2.072685,"z":2.215316},{"x":4.219649,"y":2.104125,"z":1.73217},{"x":4.164107,"y":2.072685,"z":1.66407},{"x":4.733699,"y":2.104125,"z":2.171125},{"x":4.277676,"y":2.096265,"z":1.761048},{"x":4.696089,"y":2.096265,"z":2.118337},{"x":4.266595,"y":2.072685,"z":1.761922},{"x":4.696962,"y":2.072685,"z":2.129419},{"x":4.655994,"y":2.033384,"z":2.104771},{"x":4.214545,"y":2.080545,"z":1.738147},{"x":4.728595,"y":2.080545,"z":2.177102},{"x":4.154772,"y":2.064825,"z":1.687106},{"x":4.788368,"y":2.064825,"z":2.228143},{"x":4.019175,"y":2.009804,"z":1.66434},{"x":4.832091,"y":2.009804,"z":2.358501},{"x":3.996139,"y":1.954784,"z":1.655005},{"x":4.844919,"y":1.954784,"z":2.379791},{"x":4.002116,"y":1.884043,"z":1.660109},{"x":4.838942,"y":1.884043,"z":2.374687},{"x":4.088283,"y":1.789723,"z":1.692345},{"x":4.793608,"y":1.789723,"z":2.294632},{"x":4.169346,"y":1.758282,"z":1.730559},{"x":4.743169,"y":1.758282,"z":2.220555},{"x":4.291377,"y":1.797583,"z":1.79342},{"x":4.661971,"y":1.797583,"z":2.109875},{"x":4.31616,"y":1.844743,"z":1.824918},{"x":4.626981,"y":1.844743,"z":2.090332},{"x":4.327241,"y":1.970504,"z":1.824044},{"x":4.297355,"y":2.033384,"z":1.798524},{"x":4.626107,"y":1.970504,"z":2.079251},{"x":4.322137,"y":1.899763,"z":1.830022},{"x":4.621003,"y":1.899763,"z":2.085228},{"x":4.296013,"y":2.135565,"z":1.993759},{"x":4.374592,"y":2.080545,"z":2.071194},{"x":4.463378,"y":2.135565,"z":2.136674},{"x":4.235367,"y":2.339926,"z":1.931636},{"x":4.534233,"y":2.339926,"z":2.186842},{"x":4.706432,"y":2.434247,"z":2.178849},{"x":4.626513,"y":2.363507,"z":2.296649},{"x":4.112463,"y":2.363507,"z":1.857694},{"x":4.714561,"y":2.229886,"z":2.423514},{"x":3.973373,"y":2.229886,"z":1.790602},{"x":4.823161,"y":2.127705,"z":2.598935},{"x":3.67303,"y":2.080545,"z":1.658165},{"x":3.783107,"y":2.127705,"z":1.710818},{"x":4.892405,"y":2.080544,"z":2.699407},{"x":4.906106,"y":1.821163,"z":2.731778},{"x":4.818327,"y":1.836882,"z":2.749845},{"x":3.791839,"y":1.671822,"z":1.821632},{"x":3.634817,"y":1.836883,"z":1.739228},{"x":4.712347,"y":1.671821,"z":2.607667},{"x":3.953091,"y":1.577501,"z":1.886977},{"x":4.622552,"y":1.577501,"z":2.45864},{"x":4.165323,"y":1.184498,"z":2.316264},{"x":4.120727,"y":1.129478,"z":2.174825},{"x":4.190843,"y":1.098037,"z":2.286378},{"x":4.312001,"y":1.129478,"z":2.338157},{"x":4.287488,"y":1.255239,"z":2.451591},{"x":4.113876,"y":0.909396,"z":2.158639},{"x":4.206156,"y":0.862236,"z":2.268446},{"x":4.32906,"y":0.909396,"z":2.342388},{"x":4.141881,"y":0.720755,"z":2.089531},{"x":4.282718,"y":0.689315,"z":2.178786},{"x":4.392929,"y":0.720755,"z":2.303905},{"x":3.990837,"y":0.752195,"z":2.012231},{"x":4.492932,"y":0.752195,"z":2.440978},{"x":4.010515,"y":0.956556,"z":2.049706},{"x":4.452837,"y":0.956556,"z":2.427412},{"x":4.045506,"y":1.168778,"z":2.06925},{"x":4.428055,"y":1.168778,"z":2.395914},{"x":4.012532,"y":1.255239,"z":2.216801},{"x":4.067669,"y":1.318119,"z":2.067503},{"x":4.426308,"y":1.318119,"z":2.373751},{"x":4.094936,"y":1.38886,"z":2.05978},{"x":4.429666,"y":1.38886,"z":2.345611},{"x":4.449209,"y":1.44388,"z":2.31062},{"x":4.152828,"y":1.4989,"z":2.016192},{"x":4.463648,"y":1.4989,"z":2.281606},{"x":4.663384,"y":1.530341,"z":2.410821},{"x":3.290699,"y":1.726842,"z":2.820043},{"x":3.542619,"y":1.47532,"z":3.045498},{"x":3.440537,"y":1.742562,"z":3.165044},{"x":3.804748,"y":1.726842,"z":3.258998},{"x":3.892392,"y":1.52248,"z":3.168465},{"x":3.366387,"y":1.52248,"z":2.719302},{"x":3.751889,"y":1.286679,"z":2.800427},{"x":4.035172,"y":1.357419,"z":2.928634},{"x":3.927373,"y":1.278819,"z":2.268113},{"x":4.104073,"y":1.208078,"z":2.387992},{"x":4.250148,"y":1.278819,"z":2.543736},{"x":3.465643,"y":1.624661,"z":1.997864},{"x":3.365775,"y":1.907623,"z":1.933257},{"x":4.58938,"y":1.62466,"z":2.95744},{"x":4.668831,"y":1.907623,"z":3.045956},{"x":3.169541,"y":2.111984,"z":2.768264},{"x":3.425224,"y":2.237746,"z":3.182976},{"x":3.874865,"y":2.111984,"z":3.37055},{"x":3.788013,"y":2.528568,"z":2.056089},{"x":3.930533,"y":2.662189,"z":2.591222},{"x":4.170427,"y":2.575727,"z":2.310287},{"x":4.481382,"y":2.528568,"z":2.648167},{"x":4.282322,"y":2.607167,"z":2.881284},{"x":3.384787,"y":2.544287,"z":2.528297},{"x":3.624285,"y":2.575727,"z":2.949862},{"x":4.078156,"y":2.544287,"z":3.120377},{"x":3.64516,"y":2.080545,"z":1.799739},{"x":3.681159,"y":2.127705,"z":1.90283},{"x":4.756943,"y":2.080544,"z":2.749107},{"x":4.649486,"y":2.127705,"z":2.729698},{"x":3.453553,"y":2.237746,"z":1.91519},{"x":3.527162,"y":2.379227,"z":2.071069},{"x":4.672927,"y":2.237746,"z":2.956433},{"x":4.507443,"y":2.379226,"z":2.908145},{"x":3.295325,"y":2.292766,"z":2.100487},{"x":3.36383,"y":2.426387,"z":2.262343},{"x":4.514699,"y":2.292766,"z":3.14173},{"x":4.344111,"y":2.426387,"z":3.09942},{"x":3.137097,"y":2.214165,"z":2.285784},{"x":3.200498,"y":2.355647,"z":2.453618},{"x":4.356471,"y":2.214165,"z":3.327026},{"x":4.180779,"y":2.355647,"z":3.290694},{"x":3.126556,"y":2.001944,"z":2.576521},{"x":3.103988,"y":1.939064,"z":2.36087},{"x":4.070973,"y":2.001944,"z":3.382973},{"x":3.588952,"y":2.607167,"z":2.289206},{"x":3.909639,"y":2.198446,"z":1.901552},{"x":4.614963,"y":2.198446,"z":2.503839},{"x":4.354175,"y":2.245606,"z":2.095104},{"x":3.293444,"y":1.994084,"z":2.005858},{"x":4.608455,"y":1.994084,"z":3.128766},{"x":3.221248,"y":2.001944,"z":2.150925},{"x":4.476486,"y":2.001944,"z":3.222791},{"x":3.580895,"y":1.357419,"z":2.54072},{"x":3.767732,"y":1.4989,"z":2.152464},{"x":4.389373,"y":1.4989,"z":2.683293},{"x":4.172515,"y":1.47532,"z":2.973562},{"x":3.420111,"y":1.546061,"z":2.269058},{"x":4.328664,"y":1.546061,"z":3.044885},{"x":4.126434,"y":1.44388,"z":2.034997},{"x":3.210707,"y":1.663962,"z":2.441662},{"x":4.190988,"y":1.663962,"z":3.278739},{"x":3.994879,"y":1.695402,"z":3.266316},{"x":3.51501,"y":1.47532,"z":2.412109},{"x":3.253691,"y":1.695402,"z":2.633405},{"x":3.147035,"y":2.080545,"z":2.128897},{"x":3.015669,"y":2.088405,"z":2.089072},{"x":2.99438,"y":2.151285,"z":2.1019},{"x":4.509865,"y":2.080544,"z":3.292638},{"x":4.569774,"y":2.088404,"z":3.416145},{"x":4.543983,"y":2.033384,"z":3.3011},{"x":2.817815,"y":2.111985,"z":2.054487},{"x":2.761534,"y":2.182725,"z":2.047771},{"x":4.634921,"y":2.111984,"z":3.606141},{"x":4.560439,"y":2.151284,"z":3.439181},{"x":4.650369,"y":2.182724,"z":3.660675},{"x":2.671874,"y":1.994084,"z":1.97121},{"x":4.740028,"y":1.994083,"z":3.737237},{"x":4.684486,"y":1.962643,"z":3.669137},{"x":2.747833,"y":1.962644,"z":2.0154},{"x":2.720566,"y":1.726842,"z":2.023124},{"x":4.681129,"y":1.726841,"z":3.697277},{"x":4.642645,"y":1.750421,"z":3.633408},{"x":2.789674,"y":1.750422,"z":2.051129},{"x":2.972217,"y":1.569641,"z":2.103647},{"x":4.562185,"y":1.56964,"z":3.461344},{"x":4.57152,"y":1.63252,"z":3.438308},{"x":3.261208,"y":1.601081,"z":2.092025},{"x":3.308153,"y":1.530341,"z":2.121777},{"x":4.5284,"y":1.601081,"z":3.1741},{"x":4.491663,"y":1.530341,"z":3.132394},{"x":2.993506,"y":1.632521,"z":2.090819},{"x":3.168325,"y":1.648242,"z":2.116069},{"x":4.5192,"y":1.648242,"z":3.269602},{"x":2.946696,"y":1.671822,"z":2.133533},{"x":4.536664,"y":1.671821,"z":3.491231},{"x":2.746222,"y":1.923344,"z":2.065704},{"x":4.635056,"y":1.923343,"z":3.678607},{"x":4.599192,"y":1.766141,"z":3.647982},{"x":2.799145,"y":2.033384,"z":2.100559},{"x":4.592341,"y":2.033384,"z":3.631797},{"x":2.963755,"y":2.017664,"z":2.137764},{"x":4.529814,"y":2.017663,"z":3.475045},{"x":3.069465,"y":1.978364,"z":2.13501},{"x":4.515978,"y":1.978363,"z":3.370208},{"x":3.379746,"y":1.671822,"z":2.11056},{"x":4.491528,"y":1.671821,"z":3.059927},{"x":4.419197,"y":1.648242,"z":3.132529},{"x":3.31937,"y":1.648242,"z":2.193369},{"x":3.133334,"y":2.033384,"z":2.096526},{"x":3.181288,"y":1.656102,"z":2.209825},{"x":4.424572,"y":1.656101,"z":3.271483},{"x":3.309161,"y":1.711122,"z":2.205324},{"x":3.157379,"y":1.687542,"z":2.189409},{"x":4.408989,"y":1.711122,"z":3.144483},{"x":3.223129,"y":1.766142,"z":2.245554},{"x":3.175311,"y":1.758282,"z":2.204721},{"x":4.448481,"y":1.687541,"z":3.2919},{"x":4.38273,"y":1.766142,"z":3.235754},{"x":4.430549,"y":1.758281,"z":3.276587},{"x":3.234076,"y":1.876183,"z":2.172215},{"x":3.163356,"y":1.844743,"z":2.194513},{"x":4.45345,"y":1.876183,"z":3.213456},{"x":3.126619,"y":1.915483,"z":2.152807},{"x":3.198212,"y":1.962644,"z":2.14159},{"x":4.489449,"y":1.915482,"z":3.316547},{"x":4.442503,"y":1.844743,"z":3.286796},{"x":4.489314,"y":1.962644,"z":3.244081},{"x":3.09089,"y":1.907623,"z":2.194648},{"x":3.027759,"y":1.962644,"z":2.171747},{"x":4.45372,"y":1.907622,"z":3.358388},{"x":4.486226,"y":1.962643,"z":3.417153},{"x":4.417856,"y":1.844742,"z":3.327764},{"x":3.186527,"y":1.766142,"z":2.276314},{"x":3.126754,"y":1.844743,"z":2.225273},{"x":4.358083,"y":1.766142,"z":3.276722},{"x":4.405901,"y":1.750421,"z":3.317555},{"x":3.138709,"y":1.750422,"z":2.235481},{"x":4.423833,"y":1.687541,"z":3.332868},{"x":3.150663,"y":1.656102,"z":2.245689},{"x":3.120777,"y":1.687542,"z":2.220169},{"x":4.393947,"y":1.656101,"z":3.307347},{"x":3.132596,"y":1.656102,"z":2.157911},{"x":4.483471,"y":1.656101,"z":3.311443},{"x":2.916071,"y":2.001944,"z":2.169397},{"x":4.50604,"y":2.001944,"z":3.527095},{"x":2.756565,"y":2.017664,"z":2.126215},{"x":4.573671,"y":2.017663,"z":3.677869},{"x":2.697665,"y":1.915483,"z":2.086255},{"x":4.622363,"y":1.915482,"z":3.729784},{"x":2.738633,"y":1.758282,"z":2.110903},{"x":2.782086,"y":1.766142,"z":2.096328},{"x":4.591603,"y":1.758281,"z":3.693182},{"x":2.90499,"y":1.671822,"z":2.17027},{"x":4.506913,"y":1.671821,"z":3.538176},{"x":3.085786,"y":1.781862,"z":2.200625},{"x":4.448616,"y":1.781861,"z":3.364366},{"x":4.479375,"y":1.734701,"z":3.400968},{"x":3.044818,"y":1.734702,"z":2.175978},{"x":3.016678,"y":1.844743,"z":2.17262},{"x":4.487099,"y":1.844742,"z":3.428235},{"x":4.506778,"y":1.797582,"z":3.46571},{"x":2.924533,"y":1.860463,"z":2.13528},{"x":2.959524,"y":1.907623,"z":2.154823},{"x":4.538411,"y":1.860462,"z":3.513394},{"x":4.513628,"y":1.907622,"z":3.481896},{"x":2.89552,"y":1.946924,"z":2.120841},{"x":4.557216,"y":1.946923,"z":3.539788},{"x":4.575148,"y":1.884042,"z":3.5551},{"x":2.877588,"y":1.884043,"z":2.105528},{"x":3.163491,"y":1.546061,"z":2.266979},{"x":2.86503,"y":1.585361,"z":2.229171},{"x":4.370911,"y":1.54606,"z":3.298012},{"x":4.454998,"y":1.58536,"z":3.586868},{"x":2.630303,"y":1.726842,"z":2.080413},{"x":4.638684,"y":1.726841,"z":3.795399},{"x":2.608878,"y":1.970504,"z":2.020775},{"x":4.700942,"y":1.970503,"z":3.807219},{"x":2.667913,"y":2.143425,"z":2.1332},{"x":4.580657,"y":2.143424,"z":3.766521},{"x":2.882089,"y":2.111984,"z":2.233402},{"x":4.448148,"y":2.111984,"z":3.570683},{"x":3.073966,"y":2.056963,"z":2.262883},{"x":4.388978,"y":2.056963,"z":3.385791},{"x":4.287498,"y":1.939063,"z":3.371486},{"x":4.612406,"y":2.088405,"z":2.04688},{"x":2.976583,"y":1.797583,"z":2.159054}],"normals":[{"x":-0.0455,"y":-0.1975,"z":-0.9792},{"x":-0.0454,"y":-0.1976,"z":-0.9792},{"x":-0.0344,"y":-0.2026,"z":-0.9787},{"x":0.9743,"y":-0.1975,"z":-0.1086},{"x":0.9743,"y":-0.1974,"z":-0.1085},{"x":0.972,"y":-0.2026,"z":-0.1193},{"x":-0.3302,"y":-0.3022,"z":-0.8942},{"x":-0.3228,"y":-0.305,"z":-0.896},{"x":-0.322,"y":-0.3051,"z":-0.8962},{"x":0.9356,"y":-0.3051,"z":0.1776},{"x":-0.0132,"y":-0.7905,"z":-0.6123},{"x":0.6068,"y":-0.7905,"z":-0.0829},{"x":0.2104,"y":-0.5163,"z":-0.8301},{"x":0.7869,"y":-0.5163,"z":-0.3378},{"x":0.6163,"y":-0.5222,"z":-0.5895},{"x":0.4857,"y":-0.5222,"z":-0.701},{"x":0.4993,"y":-0.8487,"z":-0.1745},{"x":0.0942,"y":-0.8487,"z":-0.5205},{"x":0.9382,"y":-0.3294,"z":0.1062},{"x":-0.2192,"y":-0.34,"z":-0.9145},{"x":0.916,"y":-0.1876,"z":-0.3546},{"x":0.916,"y":-0.1872,"z":-0.3549},{"x":0.9162,"y":-0.1981,"z":-0.3483},{"x":0.2069,"y":-0.1872,"z":-0.9603},{"x":0.2067,"y":-0.1876,"z":-0.9603},{"x":0.2005,"y":-0.1981,"z":-0.9595},{"x":0.9143,"y":0.1958,"z":-0.3547},{"x":0.2071,"y":0.1958,"z":-0.9585},{"x":0.9437,"y":0.3223,"z":0.0737},{"x":-0.2218,"y":0.3235,"z":-0.9198},{"x":-0.2272,"y":0.3287,"z":-0.9167},{"x":-0.2279,"y":0.3293,"z":-0.9163},{"x":0.5399,"y":0.8073,"z":-0.2381},{"x":0.1405,"y":0.8249,"z":-0.5476},{"x":0.5781,"y":0.6023,"z":-0.5505},{"x":0.4602,"y":0.5518,"z":-0.6955},{"x":0.2564,"y":0.5231,"z":-0.8128},{"x":0.7771,"y":0.5446,"z":-0.3155},{"x":-0.0147,"y":0.7711,"z":-0.6366},{"x":0.6343,"y":0.7641,"z":-0.1177},{"x":-0.3152,"y":0.2968,"z":-0.9014},{"x":0.9396,"y":0.2964,"z":0.1713},{"x":0.9391,"y":0.2943,"z":0.1776},{"x":0.939,"y":0.294,"z":0.1783},{"x":-0.0689,"y":0.1868,"z":-0.98},{"x":0.972,"y":0.2026,"z":-0.1193},{"x":-0.9115,"y":0.3436,"z":-0.2261},{"x":0.2413,"y":0.3058,"z":0.921},{"x":-0.4944,"y":0.8296,"z":0.2596},{"x":-0.1978,"y":0.8146,"z":0.5452},{"x":-0.0208,"y":0.7605,"z":0.649},{"x":-0.6008,"y":0.7988,"z":0.029},{"x":0.4021,"y":0.3143,"z":0.86},{"x":-0.9382,"y":0.3276,"z":-0.112},{"x":0.2549,"y":-0.3538,"z":0.8999},{"x":-0.9287,"y":-0.3538,"z":-0.1108},{"x":0.0654,"y":-0.7988,"z":0.598},{"x":-0.6008,"y":-0.7988,"z":0.029},{"x":-0.5075,"y":-0.8146,"z":0.2808},{"x":-0.1978,"y":-0.8146,"z":0.5452},{"x":-0.9407,"y":-0.3293,"z":-0.0816},{"x":0.2279,"y":-0.3293,"z":0.9163},{"x":0.2896,"y":-0.0623,"z":-0.9551},{"x":0.898,"y":-0.0623,"z":-0.4356},{"x":0.374,"y":-0.1754,"z":-0.9107},{"x":0.8409,"y":-0.1754,"z":-0.512},{"x":0.5635,"y":-0.1835,"z":-0.8055},{"x":0.7073,"y":-0.1835,"z":-0.6827},{"x":0.6953,"y":-0.0284,"z":-0.7182},{"x":0.6004,"y":-0.0283,"z":-0.7992},{"x":0.6953,"y":0.026,"z":-0.7182},{"x":0.6005,"y":0.026,"z":-0.7992},{"x":0.5606,"y":0.1729,"z":-0.8098},{"x":0.712,"y":0.1729,"z":-0.6805},{"x":0.3785,"y":0.1656,"z":-0.9107},{"x":0.8402,"y":0.1656,"z":-0.5164},{"x":0.2896,"y":0.0572,"z":-0.9554},{"x":0.8983,"y":0.0572,"z":-0.4357},{"x":0.1978,"y":-0.8748,"z":-0.4422},{"x":0.4224,"y":-0.8433,"z":-0.3323},{"x":0.1136,"y":-0.8656,"z":-0.4877},{"x":0.4504,"y":-0.862,"z":-0.2325},{"x":-0.0243,"y":-0.5049,"z":-0.8628},{"x":0.856,"y":-0.5049,"z":-0.1111},{"x":-0.1831,"y":-0.0633,"z":-0.9811},{"x":0.9976,"y":-0.0633,"z":0.0272},{"x":-0.1428,"y":0.1132,"z":-0.9833},{"x":0.9935,"y":0.1132,"z":-0.013},{"x":-0.0226,"y":-0.8345,"z":-0.5505},{"x":0.5472,"y":-0.8345,"z":-0.0639},{"x":0.1093,"y":-0.729,"z":-0.6757},{"x":0.7744,"y":-0.5751,"z":-0.2636},{"x":-0.1489,"y":-0.4191,"z":-0.8957},{"x":-0.1468,"y":-0.4195,"z":-0.8958},{"x":-0.149,"y":-0.4197,"z":-0.8954},{"x":0.9077,"y":-0.4195,"z":0.0046},{"x":0.9079,"y":-0.419,"z":0.0068},{"x":0.9076,"y":-0.4197,"z":0.0069},{"x":-0.1488,"y":-0.3915,"z":-0.908},{"x":0.9261,"y":-0.2978,"z":-0.2318},{"x":0.3375,"y":0.3425,"z":-0.8768},{"x":0.911,"y":0.3606,"z":0.2},{"x":-0.0177,"y":0.6475,"z":-0.7618},{"x":-0.0119,"y":0.6454,"z":-0.7638},{"x":-0.0194,"y":0.6482,"z":-0.7612},{"x":0.7551,"y":0.6476,"z":-0.1019},{"x":0.7562,"y":0.6454,"z":-0.1079},{"x":0.7564,"y":0.6448,"z":-0.1095},{"x":-0.0798,"y":0.5565,"z":-0.827},{"x":0.8293,"y":0.5565,"z":-0.0507},{"x":0.5261,"y":0.656,"z":-0.5412},{"x":0.4541,"y":0.6685,"z":-0.589},{"x":0.9619,"y":0.2715,"z":-0.0325},{"x":-0.1987,"y":0.3768,"z":-0.9047},{"x":0.8478,"y":0.5262,"z":-0.0668},{"x":-0.0641,"y":0.5773,"z":-0.814},{"x":-0.0023,"y":-0.6281,"z":-0.7781},{"x":0.9142,"y":-0.323,"z":-0.2446},{"x":0.3863,"y":-0.4693,"z":-0.7941},{"x":0.3893,"y":-0.4687,"z":-0.793},{"x":0.3856,"y":-0.4694,"z":-0.7944},{"x":0.7222,"y":-0.4687,"z":-0.5087},{"x":0.7238,"y":-0.4693,"z":-0.5058},{"x":0.7242,"y":-0.4694,"z":-0.5052},{"x":0.5554,"y":-0.5792,"z":-0.5967},{"x":0.476,"y":-0.501,"z":-0.7228},{"x":0.467,"y":-0.7843,"z":-0.4084},{"x":0.47,"y":-0.5759,"z":-0.669},{"x":0.5974,"y":-0.1695,"z":-0.7838},{"x":0.3472,"y":-0.8644,"z":-0.3636},{"x":0.2622,"y":-0.0609,"z":-0.9631},{"x":0.7353,"y":-0.3128,"z":-0.6013},{"x":0.3453,"y":-0.1828,"z":-0.9205},{"x":0.9035,"y":-0.1812,"z":-0.3883},{"x":0.3006,"y":-0.3068,"z":-0.9031},{"x":0.8331,"y":-0.2762,"z":-0.4793},{"x":0.3692,"y":0.2113,"z":-0.905},{"x":0.9134,"y":-0.2408,"z":-0.3281},{"x":0.7103,"y":0.3903,"z":-0.5857},{"x":0.4672,"y":0.3903,"z":-0.7933},{"x":-0.0829,"y":-0.2915,"z":-0.953},{"x":0.692,"y":-0.4956,"z":-0.5249},{"x":0.6018,"y":-0.078,"z":-0.7949},{"x":0.6015,"y":-0.0838,"z":-0.7945},{"x":0.6017,"y":-0.0786,"z":-0.7949},{"x":0.6905,"y":-0.0838,"z":-0.7185},{"x":0.6908,"y":-0.0781,"z":-0.7188},{"x":0.6908,"y":-0.0785,"z":-0.7187},{"x":0.6367,"y":-0.2316,"z":-0.7355},{"x":0.6317,"y":-0.2316,"z":-0.7398},{"x":0.6904,"y":-0.0845,"z":-0.7184},{"x":0.3757,"y":-0.7103,"z":-0.5952},{"x":0.529,"y":-0.7103,"z":-0.4643},{"x":0.4144,"y":-0.5947,"z":-0.6889},{"x":0.6155,"y":-0.5947,"z":-0.5172},{"x":0.3694,"y":-0.1662,"z":-0.9143},{"x":0.8002,"y":-0.3928,"z":-0.4532},{"x":0.3627,"y":-0.036,"z":-0.9312},{"x":0.8629,"y":-0.036,"z":-0.5041},{"x":0.3664,"y":-0.0808,"z":-0.9269},{"x":0.8581,"y":-0.0809,"z":-0.5071},{"x":0.666,"y":0.0511,"z":-0.7442},{"x":0.6479,"y":0.0665,"z":-0.7588},{"x":0.6507,"y":-0.0653,"z":-0.7565},{"x":0.6478,"y":-0.0686,"z":-0.7587},{"x":0.6513,"y":-0.0651,"z":-0.756},{"x":0.6453,"y":-0.0654,"z":-0.7611},{"x":0.6479,"y":-0.0665,"z":-0.7588},{"x":0.6494,"y":0,"z":-0.7605},{"x":-0.6135,"y":-0.5335,"z":-0.5823},{"x":0.6712,"y":-0.5335,"z":0.5147},{"x":-0.8253,"y":0.2692,"z":-0.4965},{"x":0.6196,"y":0.2692,"z":0.7373},{"x":-0.3315,"y":0.9004,"z":0.2816},{"x":-0.1738,"y":0.9165,"z":0.3604},{"x":-0.2194,"y":0.5492,"z":-0.8064},{"x":-0.1933,"y":-0.8956,"z":-0.4006},{"x":0.4968,"y":-0.8639,"z":0.0834},{"x":0.2791,"y":-0.5747,"z":-0.7693},{"x":0.7161,"y":-0.5747,"z":-0.3961},{"x":0.8445,"y":0.5353,"z":-0.0148},{"x":-0.1177,"y":0.5353,"z":-0.8364},{"x":0.3403,"y":0.7758,"z":-0.5313},{"x":0.4714,"y":0.7759,"z":-0.4193},{"x":-0.1885,"y":0.287,"z":-0.9392},{"x":0.9529,"y":0.2971,"z":0.0604},{"x":0.2393,"y":-0.5409,"z":-0.8063},{"x":0.7589,"y":-0.5409,"z":-0.3627},{"x":0.5923,"y":0.2343,"z":-0.7709},{"x":0.6608,"y":0.2247,"z":-0.7161},{"x":0.6074,"y":-0.6087,"z":-0.5105},{"x":0.409,"y":-0.6087,"z":-0.6798},{"x":0.9429,"y":0.0716,"z":-0.3252},{"x":0.1735,"y":0.0716,"z":-0.9822},{"x":0.814,"y":-0.5773,"z":-0.0641},{"x":-0.0642,"y":-0.5774,"z":-0.814},{"x":0.0513,"y":-0.431,"z":-0.9009},{"x":0.8631,"y":0.0738,"z":-0.4996},{"x":0.3685,"y":0.0311,"z":-0.9291},{"x":0.8357,"y":0.0662,"z":-0.5451},{"x":-0.2003,"y":0.391,"z":-0.8983},{"x":0.9498,"y":0.2059,"z":0.2356},{"x":-0.3695,"y":0.318,"z":-0.8731},{"x":0.9381,"y":0.1994,"z":0.2832},{"x":-0.4106,"y":0.3798,"z":-0.829},{"x":0.883,"y":0.3798,"z":0.2757},{"x":0.4434,"y":-0.4161,"z":-0.7939},{"x":0.473,"y":-0.8655,"z":-0.1652},{"x":0.73,"y":-0.1945,"z":-0.6552},{"x":0.5328,"y":-0.1945,"z":-0.8236},{"x":0.9209,"y":0,"z":-0.3898},{"x":0.2407,"y":0,"z":-0.9706},{"x":0.2965,"y":0.9494,"z":-0.1035},{"x":0.0558,"y":0.9494,"z":-0.309},{"x":0.0558,"y":0.9494,"z":-0.3091},{"x":0.6277,"y":0.7337,"z":0.2603},{"x":-0.3554,"y":0.7337,"z":-0.5791},{"x":0.7605,"y":0,"z":0.6494},{"x":-0.7605,"y":0,"z":-0.6494},{"x":-0.1553,"y":-0.945,"z":-0.288},{"x":0.3088,"y":-0.945,"z":0.1083},{"x":0.6022,"y":-0.3031,"z":-0.7386},{"x":0.6351,"y":-0.3031,"z":-0.7104},{"x":0.4995,"y":-0.3479,"z":-0.7934},{"x":0.7053,"y":-0.3479,"z":-0.6176},{"x":0.9111,"y":-0.2239,"z":-0.3461},{"x":0.1991,"y":-0.2239,"z":-0.9541},{"x":0.8309,"y":0.0271,"z":-0.5557},{"x":0.4187,"y":0.0271,"z":-0.9077},{"x":0.7703,"y":-0.009,"z":-0.6376},{"x":0.4262,"y":0.1038,"z":-0.8987},{"x":0.8218,"y":-0.4874,"z":-0.2952},{"x":-0.1285,"y":-0.4595,"z":-0.8788},{"x":0.4125,"y":-0.8797,"z":-0.2367},{"x":0.1692,"y":-0.8797,"z":-0.4444},{"x":0.1628,"y":-0.5895,"z":-0.7912},{"x":0.7559,"y":-0.5895,"z":-0.2847},{"x":-0.1078,"y":-0.4589,"z":-0.8819},{"x":0.8879,"y":-0.4589,"z":-0.0317},{"x":0.1334,"y":-0.1144,"z":-0.9844},{"x":0.9514,"y":-0.1144,"z":-0.286},{"x":0.0996,"y":0.1197,"z":-0.9878},{"x":0.9639,"y":0.1155,"z":-0.2398},{"x":0.2197,"y":0.4083,"z":-0.886},{"x":0.7498,"y":0.6574,"z":-0.0752},{"x":0.2457,"y":0.7882,"z":-0.5643},{"x":0.5188,"y":0.7882,"z":-0.331},{"x":0.4556,"y":0.3387,"z":-0.8233},{"x":0.7417,"y":0.3387,"z":-0.5789},{"x":0.6879,"y":0.2756,"z":-0.6715},{"x":0.5555,"y":0.2756,"z":-0.7845},{"x":0.3937,"y":-0.2181,"z":-0.893},{"x":0.7493,"y":-0.5739,"z":-0.3304},{"x":0.3581,"y":-0.3015,"z":-0.8837},{"x":0.8167,"y":-0.3015,"z":-0.4921},{"x":0.5484,"y":-0.8339,"z":-0.0623},{"x":0.5668,"y":-0.3156,"z":-0.761},{"x":0.3384,"y":-0.7822,"z":-0.5231},{"x":0.0867,"y":-0.9071,"z":-0.4119},{"x":0.8559,"y":-0.2851,"z":-0.4315},{"x":0.2921,"y":-0.2851,"z":-0.9129},{"x":0.829,"y":-0.0577,"z":-0.5563},{"x":0.2294,"y":0.0507,"z":-0.972},{"x":0.7349,"y":0.5245,"z":-0.4299},{"x":0.3095,"y":0.5245,"z":-0.7932},{"x":0.5564,"y":0.5546,"z":-0.6187},{"x":0.4372,"y":0.6815,"z":-0.5869},{"x":0.1508,"y":0.6341,"z":-0.7584},{"x":0.7654,"y":0.5221,"z":-0.3762},{"x":0.066,"y":0.53,"z":-0.8454},{"x":0.0661,"y":0.53,"z":-0.8455},{"x":0.8247,"y":0.5299,"z":-0.1977},{"x":0.0865,"y":-0.3391,"z":-0.9368},{"x":0.9117,"y":-0.3391,"z":-0.2322},{"x":-0.272,"y":-0.0615,"z":-0.9603},{"x":0.9911,"y":-0.0615,"z":0.1183},{"x":-0.2039,"y":0.1197,"z":-0.9716},{"x":-0.1969,"y":0.1129,"z":-0.9739},{"x":-0.1955,"y":0.1116,"z":-0.9743},{"x":0.9929,"y":0.1116,"z":0.0405},{"x":0.2337,"y":0.8888,"z":0.3943},{"x":-0.4261,"y":0.8888,"z":-0.1691},{"x":0.4092,"y":0.3744,"z":0.8321},{"x":-0.8859,"y":0.3744,"z":-0.2739},{"x":-0.0655,"y":0.871,"z":0.4868},{"x":-0.463,"y":0.8626,"z":0.2039},{"x":-0.6494,"y":0.7449,"z":-0.1528},{"x":-0.6448,"y":0.7483,"z":-0.156},{"x":-0.6501,"y":0.7445,"z":-0.1523},{"x":0.2526,"y":0.745,"z":0.6174},{"x":0.255,"y":0.7483,"z":0.6124},{"x":0.2555,"y":0.7489,"z":0.6115},{"x":-0.4957,"y":0.8685,"z":0.0085},{"x":0.087,"y":0.8833,"z":0.4606},{"x":0.0876,"y":0.8835,"z":0.4602},{"x":0.0902,"y":0.8839,"z":0.4589},{"x":-0.4046,"y":0.9141,"z":0.0271},{"x":0.0366,"y":0.9141,"z":0.4038},{"x":-0.9613,"y":0.1343,"z":-0.2406},{"x":0.2225,"y":0.1323,"z":0.9659},{"x":-0.7424,"y":-0.6649,"z":0.0828},{"x":0.0345,"y":-0.6649,"z":0.7462},{"x":-0.5148,"y":-0.8566,"z":0.0339},{"x":0.0472,"y":-0.8566,"z":0.5138},{"x":-0.8262,"y":-0.3858,"z":0.4106},{"x":-0.3479,"y":-0.6644,"z":0.6614},{"x":-0.7822,"y":-0.0976,"z":0.6154},{"x":-0.3902,"y":-0.0125,"z":0.9206},{"x":-0.5283,"y":-0.5633,"z":0.6353},{"x":-0.3994,"y":-0.3112,"z":0.8624},{"x":-0.2552,"y":-0.9649,"z":0.0627},{"x":-0.022,"y":-0.9649,"z":0.2618},{"x":-0.2521,"y":-0.9624,"z":0.1011},{"x":-0.0604,"y":-0.9624,"z":0.2648},{"x":-0.912,"y":0.1573,"z":-0.3789},{"x":0.517,"y":0.1573,"z":0.8414},{"x":-0.9164,"y":0.1838,"z":-0.3557},{"x":0.4948,"y":0.1838,"z":0.8493},{"x":-0.7983,"y":0.0766,"z":0.5973},{"x":-0.4649,"y":0.0766,"z":0.882},{"x":-0.7357,"y":-0.053,"z":0.6752},{"x":-0.7109,"y":-0.3635,"z":0.602},{"x":-0.9466,"y":0.1371,"z":-0.2919},{"x":-0.1305,"y":-0.678,"z":0.7234},{"x":-0.9383,"y":0.1359,"z":-0.318},{"x":-0.9382,"y":0.1373,"z":-0.3177},{"x":-0.9383,"y":0.1355,"z":-0.3183},{"x":0.4607,"y":0.1373,"z":0.8769},{"x":0.4612,"y":0.136,"z":0.8768},{"x":0.4613,"y":0.1355,"z":0.8768},{"x":-0.8279,"y":0.344,"z":-0.4431},{"x":0.599,"y":0.2673,"z":0.7548},{"x":-0.8393,"y":0.3642,"z":-0.4037},{"x":0.5663,"y":0.2813,"z":0.7747},{"x":-0.6098,"y":0.4337,"z":-0.6633},{"x":0.5978,"y":0.2456,"z":0.7631},{"x":-0.2769,"y":-0.9577,"z":0.0784},{"x":-0.2435,"y":-0.7864,"z":0.5677},{"x":-0.801,"y":-0.4715,"z":0.3689},{"x":-0.8008,"y":-0.4754,"z":0.3644},{"x":-0.801,"y":-0.4712,"z":0.3693},{"x":-0.239,"y":-0.4716,"z":0.8488},{"x":-0.2345,"y":-0.4754,"z":0.8479},{"x":-0.2339,"y":-0.4759,"z":0.8478},{"x":-0.5402,"y":-0.8236,"z":0.1727},{"x":-0.0406,"y":-0.8342,"z":0.55},{"x":-0.3167,"y":-0.9442,"z":-0.0904},{"x":-0.3165,"y":-0.9442,"z":-0.0907},{"x":-0.3166,"y":-0.9442,"z":-0.0906},{"x":0.1392,"y":-0.9442,"z":0.2984},{"x":0.1389,"y":-0.9442,"z":0.2986},{"x":0.1394,"y":-0.9443,"z":0.2981},{"x":-0.3987,"y":-0.9162,"z":-0.0392},{"x":0.1012,"y":-0.9162,"z":0.3876},{"x":-0.9214,"y":0.3333,"z":-0.1999},{"x":0.7673,"y":-0.4737,"z":0.4322},{"x":-0.6052,"y":-0.374,"z":-0.7028},{"x":0.7889,"y":-0.374,"z":0.4876},{"x":-0.8441,"y":-0.0454,"z":0.5342},{"x":-0.2524,"y":-0.2265,"z":0.9407},{"x":0.0501,"y":0.9658,"z":-0.2545},{"x":0.2454,"y":0.9626,"z":-0.115},{"x":-0.2164,"y":0.975,"z":0.0502},{"x":-0.0157,"y":0.975,"z":0.2216},{"x":-0.7383,"y":0.6192,"z":0.2674},{"x":-0.1485,"y":0.6192,"z":0.771},{"x":-0.4479,"y":0.8618,"z":-0.2378},{"x":0.3051,"y":0.8618,"z":0.4052},{"x":0.2729,"y":0.6447,"z":-0.714},{"x":0.6625,"y":0.6447,"z":-0.3814},{"x":-0.3576,"y":0.7888,"z":-0.4999},{"x":0.5497,"y":0.7888,"z":0.2749},{"x":-0.6652,"y":0.6755,"z":-0.3182},{"x":0.4184,"y":0.6755,"z":0.6071},{"x":-0.9886,"y":0.1364,"z":0.0637},{"x":0.0026,"y":0.2517,"z":0.9678},{"x":-0.9691,"y":0.2318,"z":0.0842},{"x":0.0686,"y":0.2318,"z":0.9703},{"x":-0.6324,"y":0.7254,"z":-0.2717},{"x":0.3674,"y":0.7254,"z":0.582},{"x":-0.4724,"y":0.6729,"z":-0.5693},{"x":0.6363,"y":0.6729,"z":0.3774},{"x":-0.2831,"y":0.4074,"z":-0.8682},{"x":0.9019,"y":0.4074,"z":0.1436},{"x":-0.4674,"y":0.8839,"z":-0.0172},{"x":-0.4672,"y":0.884,"z":-0.0179},{"x":-0.4683,"y":0.8834,"z":-0.0145},{"x":0.1995,"y":0.9434,"z":0.265},{"x":0.2555,"y":0.6237,"z":-0.7387},{"x":0.668,"y":0.508,"z":-0.5438},{"x":-0.5089,"y":0.1005,"z":0.8549},{"x":-0.7647,"y":0.1005,"z":0.6366},{"x":0.2774,"y":0.5674,"z":-0.7753},{"x":0.7223,"y":0.5674,"z":-0.3954},{"x":0.7524,"y":0.1847,"z":-0.6323},{"x":0.5067,"y":0.1847,"z":-0.8421},{"x":-0.9773,"y":0.0893,"z":-0.1924},{"x":0.8903,"y":0.2255,"z":0.3956},{"x":-0.468,"y":0.0762,"z":-0.8805},{"x":0.9429,"y":0.0762,"z":0.3243},{"x":-0.7096,"y":0.2169,"z":-0.6704},{"x":0.7732,"y":0.2169,"z":0.5959},{"x":-0.8688,"y":-0.0304,"z":-0.4943},{"x":0.7384,"y":0.0893,"z":0.6684},{"x":-0.5493,"y":-0.6646,"z":-0.5065},{"x":0.5441,"y":-0.7651,"z":0.3444},{"x":-0.228,"y":-0.9243,"z":-0.3061},{"x":-0.228,"y":-0.9243,"z":-0.306},{"x":-0.2281,"y":-0.9243,"z":-0.3062},{"x":0.338,"y":-0.9243,"z":0.1773},{"x":0.3379,"y":-0.9243,"z":0.1773},{"x":0.3378,"y":-0.9244,"z":0.1773},{"x":-0.1256,"y":-0.8754,"z":-0.4667},{"x":0.4806,"y":-0.8754,"z":0.0509},{"x":-0.4003,"y":-0.7642,"z":-0.5057},{"x":0.5622,"y":-0.7642,"z":0.3161},{"x":-0.4007,"y":-0.6368,"z":-0.6587},{"x":0.7133,"y":-0.6368,"z":0.2926},{"x":0.3535,"y":-0.4499,"z":-0.8201},{"x":0.7546,"y":-0.4499,"z":-0.4776},{"x":-0.9331,"y":-0.307,"z":0.1872},{"x":-0.1121,"y":-0.329,"z":0.9377},{"x":-0.9088,"y":-0.24,"z":0.3414},{"x":-0.0914,"y":-0.3343,"z":0.938},{"x":-0.5304,"y":-0.8452,"z":-0.0661},{"x":-0.167,"y":-0.8341,"z":0.5257},{"x":-0.7102,"y":-0.661,"z":-0.2421},{"x":0.3778,"y":-0.6154,"z":0.6918},{"x":-0.8634,"y":-0.4408,"z":0.2455},{"x":-0.1072,"y":-0.4408,"z":0.8912},{"x":0.2937,"y":0.2855,"z":-0.9123},{"x":0.7734,"y":0.4866,"z":-0.4061},{"x":0.2378,"y":0.0975,"z":-0.9664},{"x":0.9172,"y":0.0975,"z":-0.3862},{"x":0.3593,"y":0.1993,"z":-0.9117},{"x":0.7767,"y":-0.0079,"z":-0.6298},{"x":0.475,"y":-0.0836,"z":-0.876},{"x":0.8414,"y":-0.0758,"z":-0.535},{"x":0.35,"y":0.0824,"z":-0.9331},{"x":0.9518,"y":-0.2198,"z":-0.2142},{"x":0.0048,"y":-0.385,"z":-0.9229},{"x":0.9108,"y":-0.385,"z":-0.1493},{"x":0.0693,"y":0.558,"z":-0.8269},{"x":0.8059,"y":0.558,"z":-0.1979},{"x":0.5196,"y":0.8313,"z":-0.1974},{"x":0.5204,"y":0.8302,"z":-0.1998},{"x":0.5193,"y":0.8318,"z":-0.1962},{"x":0.1158,"y":0.8302,"z":-0.5453},{"x":0.1135,"y":0.8313,"z":-0.5442},{"x":0.1124,"y":0.8318,"z":-0.5436},{"x":0.9533,"y":0.2223,"z":0.2042},{"x":-0.231,"y":0.2365,"z":-0.9438},{"x":0.9013,"y":-0.3555,"z":-0.2477},{"x":0.901,"y":-0.3573,"z":-0.246},{"x":0.9009,"y":-0.3579,"z":-0.2455},{"x":0.1036,"y":-0.3555,"z":-0.9289},{"x":0.1018,"y":-0.3574,"z":-0.9284},{"x":0.1041,"y":-0.3548,"z":-0.9291},{"x":0.0681,"y":-0.5991,"z":-0.7978},{"x":0.8072,"y":-0.5252,"z":-0.2693},{"x":-0.1924,"y":-0.4567,"z":-0.8686},{"x":0.888,"y":-0.4567,"z":0.054},{"x":-0.7307,"y":-0.6131,"z":-0.3004},{"x":0.5625,"y":-0.7658,"z":0.3117},{"x":0.746,"y":0.2923,"z":-0.5983},{"x":0.4431,"y":0.2733,"z":-0.8538},{"x":-0.8391,"y":-0.3578,"z":-0.4098},{"x":0.5361,"y":-0.3578,"z":0.7645},{"x":0.5798,"y":0.3399,"z":-0.7405},{"x":0.6406,"y":0.3399,"z":-0.6886},{"x":0.0012,"y":0.9064,"z":-0.4225},{"x":0.4171,"y":0.9064,"z":-0.0674},{"x":0.1618,"y":-0.4479,"z":-0.8793},{"x":0.9845,"y":0.1689,"z":-0.0476},{"x":-0.0166,"y":-0.5534,"z":-0.8328},{"x":0.7825,"y":-0.4075,"z":0.4708},{"x":0.0571,"y":-0.3122,"z":-0.9483},{"x":0.8476,"y":-0.5217,"z":-0.0971},{"x":-0.025,"y":-0.5533,"z":-0.8326},{"x":0.9515,"y":-0.2571,"z":-0.1691},{"x":-0.746,"y":0.5323,"z":-0.4001},{"x":0.512,"y":0.5323,"z":0.6741},{"x":-0.7553,"y":-0.3765,"z":-0.5364},{"x":0.5289,"y":-0.4446,"z":0.7229},{"x":-0.8054,"y":-0.0181,"z":-0.5924},{"x":0.7113,"y":-0.0181,"z":0.7027},{"x":-0.3371,"y":-0.6644,"z":-0.667},{"x":0.7116,"y":-0.6644,"z":0.2285},{"x":-0.537,"y":-0.6176,"z":-0.5746},{"x":0.6889,"y":-0.5947,"z":0.4144},{"x":-0.458,"y":-0.7022,"z":-0.545},{"x":0.61,"y":-0.7022,"z":0.367},{"x":-0.0809,"y":0.9921,"z":-0.0962},{"x":0.1049,"y":0.9631,"z":0.2479},{"x":-0.6494,"y":0.3145,"z":-0.6924},{"x":0.8037,"y":0.3469,"z":0.4835},{"x":-0.4053,"y":-0.7767,"z":-0.4822},{"x":0.5398,"y":-0.7767,"z":0.3247},{"x":0,"y":1,"z":0},{"x":-0.2283,"y":-0.6899,"z":-0.687},{"x":0.7143,"y":-0.6899,"z":0.1179},{"x":0.0409,"y":-0.8808,"z":-0.4718},{"x":0.4595,"y":-0.8808,"z":-0.1143},{"x":0.4024,"y":-0.5252,"z":0.7498},{"x":-0.8036,"y":-0.5252,"z":-0.28},{"x":0.2687,"y":0.2429,"z":0.9321},{"x":-0.9517,"y":0.2328,"z":-0.2003},{"x":0.3753,"y":0.8231,"z":0.4261},{"x":-0.7156,"y":0.6985,"z":0.0013},{"x":0.0972,"y":0.9899,"z":-0.103},{"x":0.1035,"y":0.9898,"z":-0.0978},{"x":0.0977,"y":0.9898,"z":-0.1033},{"x":-0.0935,"y":0.9939,"z":-0.0592},{"x":0.5658,"y":0.0392,"z":-0.8236},{"x":0.7716,"y":0.0096,"z":-0.636},{"x":0.4398,"y":0.0852,"z":-0.894},{"x":0.9051,"y":0.0413,"z":-0.4232},{"x":0.3875,"y":0.0926,"z":-0.9172},{"x":0.8452,"y":0.0926,"z":-0.5264},{"x":0.4748,"y":0.0124,"z":-0.88},{"x":0.7366,"y":0.0458,"z":-0.6747},{"x":0.6064,"y":0.3867,"z":-0.6948},{"x":0.5913,"y":0.3867,"z":-0.7077},{"x":0.3126,"y":-0.0364,"z":-0.9492},{"x":0.9104,"y":-0.032,"z":-0.4125},{"x":0.4237,"y":-0.1897,"z":-0.8857},{"x":0.8212,"y":0.0723,"z":-0.566},{"x":0.777,"y":0.6088,"z":-0.1599},{"x":0.1605,"y":0.7454,"z":-0.6471},{"x":-0.0409,"y":0.1802,"z":-0.9828},{"x":0.9771,"y":0.1802,"z":-0.1135},{"x":0.2351,"y":-0.2008,"z":-0.951},{"x":0.9168,"y":-0.1986,"z":-0.3464},{"x":0.0825,"y":-0.1334,"z":-0.9876},{"x":0.7873,"y":-0.4062,"z":-0.4638},{"x":0.151,"y":0.2833,"z":-0.9471},{"x":0.9117,"y":0.2834,"z":-0.2974},{"x":0.2656,"y":0.5802,"z":-0.7699},{"x":0.7188,"y":0.5802,"z":-0.3829},{"x":-0.132,"y":-0.9912,"z":0.0114},{"x":0.0094,"y":-0.9912,"z":0.1321},{"x":-0.2628,"y":-0.8715,"z":-0.4141},{"x":0.4502,"y":-0.8715,"z":0.1947},{"x":-0.5375,"y":-0.2541,"z":-0.8041},{"x":0.8896,"y":-0.246,"z":0.3848},{"x":-0.6824,"y":0.5291,"z":-0.5044},{"x":0.6264,"y":0.5627,"z":0.5394},{"x":0.0516,"y":0.9439,"z":0.3262},{"x":-0.3682,"y":0.9243,"z":0.1007},{"x":0.3447,"y":0.8743,"z":0.3418},{"x":-0.4497,"y":0.8851,"z":-0.1195},{"x":-0.1527,"y":-0.003,"z":0.9883},{"x":-0.9595,"y":-0.0144,"z":0.2813},{"x":-0.5308,"y":0.0104,"z":0.8474},{"x":-0.7538,"y":0.0104,"z":0.657},{"x":-0.9013,"y":0.0266,"z":0.4324},{"x":-0.2859,"y":0.0266,"z":0.9579},{"x":0.6166,"y":0.5901,"z":0.5211},{"x":-0.5268,"y":0.6786,"z":-0.5119},{"x":-0.8896,"y":-0.2291,"z":0.3951},{"x":-0.2509,"y":-0.2291,"z":0.9405},{"x":-0.0009,"y":-0.9943,"z":0.1068},{"x":-0.1053,"y":-0.9943,"z":0.0176},{"x":-0.0466,"y":-0.1971,"z":-0.9793},{"x":0.9745,"y":-0.1971,"z":-0.1074},{"x":-0.3315,"y":-0.3017,"z":-0.8939},{"x":0.9348,"y":-0.3017,"z":0.1874},{"x":-0.0452,"y":-0.7967,"z":-0.6027},{"x":0.6023,"y":-0.7967,"z":-0.0498},{"x":0.2744,"y":-0.4954,"z":-0.8242},{"x":0.771,"y":-0.4954,"z":-0.4001},{"x":0.5806,"y":-0.5714,"z":-0.58},{"x":0.4819,"y":-0.5714,"z":-0.6643},{"x":0.5221,"y":-0.8315,"z":-0.1898},{"x":0.1057,"y":-0.8315,"z":-0.5454},{"x":0.9376,"y":-0.34,"z":0.0733},{"x":-0.2518,"y":-0.3294,"z":-0.91},{"x":0.916,"y":-0.1863,"z":-0.3554},{"x":0.2075,"y":-0.1863,"z":-0.9603},{"x":0.9295,"y":0.1812,"z":-0.3211},{"x":0.1716,"y":0.1812,"z":-0.9684},{"x":0.9407,"y":0.3293,"z":0.0816},{"x":-0.2206,"y":0.3223,"z":-0.9206},{"x":0.5188,"y":0.8249,"z":-0.2245},{"x":0.1506,"y":0.8073,"z":-0.5705},{"x":0.6148,"y":0.5518,"z":-0.5635},{"x":0.4531,"y":0.6023,"z":-0.6571},{"x":0.1899,"y":0.5446,"z":-0.8169},{"x":0.7626,"y":0.5231,"z":-0.3805},{"x":0.0169,"y":0.7641,"z":-0.6449},{"x":0.631,"y":0.7711,"z":-0.0852},{"x":-0.3232,"y":0.294,"z":-0.8995},{"x":0.9397,"y":0.2968,"z":0.1702},{"x":-0.0344,"y":0.2026,"z":-0.9787},{"x":0.9787,"y":0.1868,"z":-0.0854},{"x":-0.9474,"y":0.3058,"z":-0.0941},{"x":0.366,"y":0.3436,"z":0.8648},{"x":-0.5075,"y":0.8146,"z":0.2808},{"x":-0.179,"y":0.8296,"z":0.5289},{"x":0.0654,"y":0.7988,"z":0.598},{"x":-0.6377,"y":0.7605,"z":0.1222},{"x":0.2575,"y":0.3276,"z":0.9091},{"x":-0.9123,"y":0.3143,"z":-0.2625},{"x":0.3897,"y":-0.3408,"z":0.8556},{"x":-0.906,"y":-0.3408,"z":-0.2509},{"x":-0.0208,"y":-0.7605,"z":0.649},{"x":-0.6377,"y":-0.7605,"z":0.1222},{"x":-0.4944,"y":-0.8296,"z":0.2596},{"x":-0.179,"y":-0.8296,"z":0.529},{"x":-0.9004,"y":-0.3734,"z":-0.2233},{"x":0.3616,"y":-0.3734,"z":0.8543},{"x":0.2621,"y":-0.8433,"z":-0.4692},{"x":0.4057,"y":-0.8748,"z":-0.2647},{"x":0.1591,"y":-0.862,"z":-0.4813},{"x":0.4639,"y":-0.8656,"z":-0.1886},{"x":-0.0109,"y":-0.4256,"z":-0.9048},{"x":0.8954,"y":-0.4256,"z":-0.1309},{"x":-0.1508,"y":-0.0299,"z":-0.9881},{"x":0.9995,"y":-0.0299,"z":-0.0058},{"x":-0.2327,"y":0.0689,"z":-0.9701},{"x":0.9946,"y":0.0689,"z":0.0779},{"x":0.2014,"y":-0.7779,"z":-0.5952},{"x":0.5563,"y":-0.7779,"z":-0.2921},{"x":0.1391,"y":-0.5751,"z":-0.8062},{"x":0.6503,"y":-0.729,"z":-0.2138},{"x":-0.1373,"y":-0.4191,"z":-0.8975},{"x":0.9079,"y":-0.4191,"z":-0.005},{"x":0.0839,"y":-0.2978,"z":-0.9509},{"x":0.9202,"y":-0.3915,"z":0.0048},{"x":-0.3402,"y":0.3606,"z":-0.8685},{"x":0.8131,"y":0.3425,"z":-0.4707},{"x":-0.0103,"y":0.6448,"z":-0.7643},{"x":0.7548,"y":0.6482,"z":-0.1001},{"x":-0.0684,"y":0.4924,"z":-0.8677},{"x":0.8677,"y":0.4924,"z":-0.0684},{"x":0.5106,"y":0.6685,"z":-0.5407},{"x":0.4522,"y":0.656,"z":-0.6043},{"x":0.9247,"y":0.3768,"z":0.0546},{"x":-0.1185,"y":0.2715,"z":-0.9551},{"x":0.814,"y":0.5774,"z":-0.0641},{"x":-0.0668,"y":0.5262,"z":-0.8478},{"x":0.0984,"y":-0.323,"z":-0.9413},{"x":0.7689,"y":-0.6281,"z":-0.1196},{"x":0.3901,"y":-0.4685,"z":-0.7927},{"x":0.7218,"y":-0.4685,"z":-0.5095},{"x":0.6393,"y":-0.501,"z":-0.5834},{"x":0.5024,"y":-0.5792,"z":-0.642},{"x":0.5871,"y":-0.5759,"z":-0.5689},{"x":0.3302,"y":-0.7843,"z":-0.5252},{"x":0.3047,"y":-0.8644,"z":-0.3998},{"x":0.6806,"y":-0.1695,"z":-0.7128},{"x":0.4787,"y":-0.3127,"z":-0.8204},{"x":0.9101,"y":-0.0609,"z":-0.4098},{"x":0.242,"y":-0.1812,"z":-0.9532},{"x":0.8551,"y":-0.1828,"z":-0.4852},{"x":0.3429,"y":-0.2762,"z":-0.8978},{"x":0.8449,"y":-0.3068,"z":-0.4383},{"x":0.181,"y":-0.2408,"z":-0.9536},{"x":0.836,"y":0.2113,"z":-0.5064},{"x":0.6613,"y":-0.1899,"z":-0.7257},{"x":0.6131,"y":-0.1899,"z":-0.7668},{"x":0.41,"y":-0.4956,"z":-0.7657},{"x":0.9542,"y":-0.2914,"z":-0.0674},{"x":0.3845,"y":-0.3498,"z":-0.8543},{"x":0.7835,"y":-0.3498,"z":-0.5136},{"x":0.6014,"y":-0.0845,"z":-0.7944},{"x":0.6267,"y":-0.2316,"z":-0.7441},{"x":0.5033,"y":-0.6507,"z":-0.5685},{"x":0.4827,"y":-0.6507,"z":-0.5861},{"x":0.3376,"y":-0.5476,"z":-0.7656},{"x":0.7033,"y":-0.5476,"z":-0.4533},{"x":0.3222,"y":-0.3928,"z":-0.8613},{"x":0.8452,"y":-0.1662,"z":-0.508},{"x":0.4084,"y":-0.0164,"z":-0.9127},{"x":0.8375,"y":-0.0164,"z":-0.5463},{"x":0.3577,"y":-0.1432,"z":-0.9228},{"x":0.8554,"y":-0.1432,"z":-0.4978},{"x":0.6307,"y":0.0511,"z":-0.7744},{"x":0.6447,"y":-0.0651,"z":-0.7617},{"x":-0.6798,"y":-0.6087,"z":-0.409},{"x":0.5105,"y":-0.6087,"z":0.6074},{"x":-0.891,"y":0.1919,"z":-0.4114},{"x":0.5459,"y":0.1919,"z":0.8156},{"x":-0.3287,"y":0.9165,"z":0.2281},{"x":-0.2262,"y":0.9004,"z":0.3716},{"x":0.8308,"y":0.5492,"z":0.0904},{"x":-0.1602,"y":-0.8639,"z":-0.4776},{"x":0.4259,"y":-0.8956,"z":0.1282},{"x":0.7234,"y":0.6667,"z":0.1794},{"x":-0.2905,"y":0.6667,"z":-0.6864},{"x":0.2694,"y":0.8086,"z":-0.5231},{"x":0.4744,"y":0.8086,"z":-0.348},{"x":-0.2089,"y":0.2971,"z":-0.9317},{"x":0.9571,"y":0.287,"z":0.0391},{"x":-0.1125,"y":-0.8575,"z":-0.502},{"x":0.5135,"y":-0.8575,"z":0.0325},{"x":0.6038,"y":0.2247,"z":-0.7648},{"x":0.6686,"y":0.2343,"z":-0.7057},{"x":0.522,"y":-0.2609,"z":-0.8121},{"x":0.7203,"y":-0.2609,"z":-0.6427},{"x":0.4169,"y":-0.8206,"z":-0.391},{"x":0.3209,"y":-0.8206,"z":-0.473},{"x":-0.1545,"y":0.2817,"z":-0.947},{"x":0.9595,"y":0.2817,"z":0.0043},{"x":0.3583,"y":0.0738,"z":-0.9307},{"x":0.8817,"y":-0.431,"z":-0.1918},{"x":0.4075,"y":0.0662,"z":-0.9108},{"x":0.8599,"y":0.0311,"z":-0.5095},{"x":-0.3814,"y":0.2059,"z":-0.9012},{"x":0.9186,"y":0.391,"z":0.0572},{"x":-0.4266,"y":0.1994,"z":-0.8822},{"x":0.9202,"y":0.318,"z":0.2282},{"x":-0.5493,"y":0.0664,"z":-0.833},{"x":0.9087,"y":0.0664,"z":0.4121},{"x":0.089,"y":-0.8655,"z":-0.493},{"x":0.7146,"y":-0.4161,"z":-0.5623},{"x":0.7586,"y":-0.2043,"z":-0.6187},{"x":0.4923,"y":-0.2043,"z":-0.8461},{"x":0.7262,"y":-0.1829,"z":-0.6627},{"x":0.5408,"y":-0.1829,"z":-0.8211},{"x":0.7272,"y":0.3124,"z":-0.6112},{"x":0.4897,"y":0.3124,"z":-0.814},{"x":0.5999,"y":0.6857,"z":0.4121},{"x":-0.501,"y":0.6857,"z":-0.528},{"x":0.5849,"y":-0.287,"z":-0.7586},{"x":0.6577,"y":-0.287,"z":-0.6965},{"x":0.9163,"y":-0.3293,"z":-0.2279},{"x":0.0816,"y":-0.3293,"z":-0.9407},{"x":0.9357,"y":-0.113,"z":-0.3343},{"x":0.1836,"y":-0.113,"z":-0.9765},{"x":0.8208,"y":0.1038,"z":-0.5617},{"x":0.5091,"y":-0.009,"z":-0.8607},{"x":0.8881,"y":-0.4595,"z":-0.0107},{"x":0.1629,"y":-0.4874,"z":-0.8579},{"x":0.5834,"y":-0.6359,"z":-0.5052},{"x":0.4076,"y":-0.6359,"z":-0.6554},{"x":0.1054,"y":-0.6211,"z":-0.7766},{"x":0.7505,"y":-0.6211,"z":-0.2257},{"x":0.1596,"y":-0.3557,"z":-0.9209},{"x":0.8845,"y":-0.3557,"z":-0.3018},{"x":0.0764,"y":-0.0839,"z":-0.9935},{"x":0.9693,"y":-0.0839,"z":-0.2311},{"x":0.0858,"y":0.1155,"z":-0.9896},{"x":0.96,"y":0.1197,"z":-0.2531},{"x":-0.0432,"y":0.6574,"z":-0.7523},{"x":0.8407,"y":0.4083,"z":-0.3558},{"x":0.3131,"y":0.3478,"z":-0.8837},{"x":0.8238,"y":0.3478,"z":-0.4477},{"x":0.4835,"y":0.3775,"z":-0.7898},{"x":0.7043,"y":0.3774,"z":-0.6012},{"x":0.6087,"y":0.2306,"z":-0.7592},{"x":0.6544,"y":0.2306,"z":-0.7201},{"x":0.209,"y":-0.5739,"z":-0.7918},{"x":0.8203,"y":-0.2181,"z":-0.5287},{"x":0.4095,"y":-0.2252,"z":-0.8841},{"x":0.809,"y":-0.2252,"z":-0.5429},{"x":0.6628,"y":-0.3156,"z":-0.679},{"x":-0.0244,"y":-0.8339,"z":-0.5514},{"x":0.3933,"y":-0.9071,"z":-0.1501},{"x":0.4636,"y":-0.7822,"z":-0.4161},{"x":0.8468,"y":-0.2397,"z":-0.4748},{"x":0.3363,"y":-0.2397,"z":-0.9107},{"x":0.9241,"y":0.0507,"z":-0.3788},{"x":0.4196,"y":-0.0577,"z":-0.9059},{"x":0.6117,"y":0.4072,"z":-0.6783},{"x":0.5741,"y":0.4072,"z":-0.7104},{"x":0.5112,"y":0.6815,"z":-0.5237},{"x":0.524,"y":0.5546,"z":-0.6464},{"x":0.2516,"y":0.5221,"z":-0.8149},{"x":0.7254,"y":0.6341,"z":-0.2677},{"x":0.8247,"y":0.53,"z":-0.1977},{"x":-0.2586,"y":-0.3158,"z":-0.9129},{"x":0.9421,"y":-0.3158,"z":0.1124},{"x":-0.2338,"y":-0.0807,"z":-0.9689},{"x":0.9936,"y":-0.0807,"z":0.0791},{"x":-0.2053,"y":0.121,"z":-0.9712},{"x":0.9914,"y":0.121,"z":0.0507},{"x":0.2475,"y":0.6811,"z":0.6891},{"x":-0.7193,"y":0.6811,"z":-0.1366},{"x":0.4013,"y":0.365,"z":0.8401},{"x":-0.8925,"y":0.365,"z":-0.2648},{"x":-0.1288,"y":0.8626,"z":0.4892},{"x":-0.4706,"y":0.871,"z":0.1409},{"x":-0.6439,"y":0.7489,"z":-0.1566},{"x":0.2522,"y":0.7445,"z":0.6182},{"x":-0.4686,"y":0.8833,"z":-0.0138},{"x":0.0692,"y":0.8685,"z":0.4909},{"x":-0.3992,"y":0.9159,"z":0.0424},{"x":0.0206,"y":0.9159,"z":0.401},{"x":-0.9888,"y":0.1323,"z":-0.0685},{"x":0.3882,"y":0.1343,"z":0.9117},{"x":-0.6548,"y":-0.7524,"z":-0.0711},{"x":0.1728,"y":-0.7524,"z":0.6356},{"x":-0.6629,"y":-0.7323,"z":0.1561},{"x":-0.0504,"y":-0.7323,"z":0.6792},{"x":-0.5988,"y":-0.6644,"z":0.4472},{"x":-0.2761,"y":-0.3858,"z":0.8803},{"x":-0.8482,"y":-0.0125,"z":0.5296},{"x":-0.4853,"y":-0.0976,"z":0.8689},{"x":-0.7891,"y":-0.3112,"z":0.5296},{"x":-0.5447,"y":-0.5633,"z":0.6213},{"x":-0.1023,"y":-0.9948,"z":-0.0001},{"x":0.0161,"y":-0.9948,"z":0.101},{"x":-0.2189,"y":-0.9718,"z":0.0878},{"x":-0.0525,"y":-0.9718,"z":0.23},{"x":-0.7111,"y":-0.5621,"z":-0.4224},{"x":0.5286,"y":-0.5621,"z":0.6361},{"x":-0.9218,"y":0.1396,"z":-0.3616},{"x":0.5016,"y":0.1396,"z":0.8538},{"x":-0.731,"y":-0.0274,"z":0.6818},{"x":-0.5589,"y":-0.0274,"z":0.8288},{"x":-0.4833,"y":-0.3635,"z":0.7964},{"x":-0.5516,"y":-0.053,"z":0.8324},{"x":-0.6941,"y":-0.678,"z":0.2422},{"x":0.4365,"y":0.1371,"z":0.8892},{"x":-0.9382,"y":0.1393,"z":-0.3169},{"x":0.46,"y":0.1393,"z":0.8769},{"x":-0.8393,"y":0.2673,"z":-0.4734},{"x":0.5673,"y":0.344,"z":0.7483},{"x":-0.8539,"y":0.2813,"z":-0.4379},{"x":0.5302,"y":0.3642,"z":0.7657},{"x":-0.8473,"y":0.2456,"z":-0.4709},{"x":0.7506,"y":0.4337,"z":0.4984},{"x":-0.5226,"y":-0.7864,"z":0.3294},{"x":-0.0341,"y":-0.9577,"z":0.2857},{"x":-0.8007,"y":-0.4759,"z":0.3638},{"x":-0.2393,"y":-0.4712,"z":0.8489},{"x":-0.5368,"y":-0.8342,"z":0.1262},{"x":-0.086,"y":-0.8236,"z":0.5605},{"x":-0.2782,"y":-0.9574,"z":-0.0776},{"x":0.1202,"y":-0.9574,"z":0.2626},{"x":-0.3163,"y":-0.9443,"z":-0.091},{"x":-0.547,"y":-0.4737,"z":-0.6902},{"x":0.3417,"y":0.3333,"z":0.8787},{"x":-0.2937,"y":-0.6358,"z":-0.7138},{"x":0.751,"y":-0.6358,"z":0.1783},{"x":-0.8896,"y":-0.2265,"z":0.3967},{"x":-0.3954,"y":-0.0454,"z":0.9174},{"x":0.0752,"y":0.9626,"z":-0.2604},{"x":0.2435,"y":0.9658,"z":-0.0893},{"x":-0.2183,"y":0.9734,"z":0.0696},{"x":-0.0345,"y":0.9734,"z":0.2265},{"x":-0.7313,"y":0.5711,"z":0.3729},{"x":-0.7333,"y":0.5705,"z":0.3699},{"x":-0.7333,"y":0.5705,"z":0.3698},{"x":-0.2505,"y":0.5705,"z":0.7822},{"x":-0.2537,"y":0.5711,"z":0.7807},{"x":-0.3637,"y":0.9288,"z":-0.0716},{"x":0.1277,"y":0.9288,"z":0.348},{"x":0.358,"y":0.7955,"z":-0.4889},{"x":0.4268,"y":0.7955,"z":-0.4302},{"x":-0.3544,"y":0.7696,"z":-0.5311},{"x":0.5801,"y":0.7696,"z":0.2668},{"x":-0.671,"y":0.6857,"z":-0.2821},{"x":0.3837,"y":0.6857,"z":0.6185},{"x":-0.9563,"y":0.2517,"z":0.1491},{"x":0.0919,"y":0.1364,"z":0.9864},{"x":-0.7336,"y":0.5704,"z":0.3695},{"x":-0.2501,"y":0.5704,"z":0.7824},{"x":-0.5773,"y":0.7624,"z":-0.2925},{"x":0.3793,"y":0.7624,"z":0.5244},{"x":-0.4253,"y":0.6833,"z":-0.5935},{"x":0.6528,"y":0.6833,"z":0.3271},{"x":-0.1237,"y":0.383,"z":-0.9154},{"x":0.9235,"y":0.383,"z":-0.0212},{"x":-0.293,"y":0.9434,"z":-0.1555},{"x":0.0909,"y":0.884,"z":0.4587},{"x":0.4325,"y":0.508,"z":-0.7449},{"x":0.6896,"y":0.6237,"z":-0.368},{"x":-0.4959,"y":0.1145,"z":0.8608},{"x":-0.7725,"y":0.1145,"z":0.6246},{"x":0.0792,"y":0.9462,"z":0.3136},{"x":-0.3221,"y":0.9462,"z":-0.0291},{"x":-0.5302,"y":0.2255,"z":-0.8174},{"x":0.3431,"y":0.0893,"z":0.9351},{"x":-0.6252,"y":0.1241,"z":-0.7706},{"x":0.859,"y":0.1241,"z":0.4968},{"x":-0.8823,"y":0.1472,"z":-0.4471},{"x":0.5797,"y":0.1472,"z":0.8014},{"x":-0.7758,"y":0.0893,"z":-0.6246},{"x":0.6243,"y":-0.0304,"z":0.7806},{"x":-0.4253,"y":-0.7651,"z":-0.4835},{"x":0.5863,"y":-0.6646,"z":0.4632},{"x":-0.228,"y":-0.9244,"z":-0.3059},{"x":0.3381,"y":-0.9243,"z":0.1773},{"x":-0.3028,"y":-0.8354,"z":-0.4587},{"x":0.5005,"y":-0.8354,"z":0.2272},{"x":0.2825,"y":-0.5237,"z":-0.8037},{"x":0.7495,"y":-0.5237,"z":-0.4049},{"x":-0.9085,"y":-0.329,"z":0.2576},{"x":-0.0387,"y":-0.307,"z":0.9509},{"x":-0.9121,"y":-0.3343,"z":0.2372},{"x":-0.1949,"y":-0.24,"z":0.951},{"x":-0.4931,"y":-0.8341,"z":0.2473},{"x":0.1484,"y":-0.8452,"z":0.5135},{"x":-0.7425,"y":-0.6154,"z":-0.2647},{"x":0.3504,"y":-0.661,"z":0.6635},{"x":0.28,"y":0.4867,"z":-0.8275},{"x":0.855,"y":0.2855,"z":-0.4329},{"x":0.1962,"y":0.2594,"z":-0.9456},{"x":0.9032,"y":0.2593,"z":-0.3419},{"x":0.5004,"y":-0.0079,"z":-0.8658},{"x":0.8442,"y":0.1993,"z":-0.4976},{"x":0.3966,"y":-0.0758,"z":-0.9149},{"x":0.7908,"y":-0.0836,"z":-0.6064},{"x":0.0625,"y":-0.2198,"z":-0.9736},{"x":0.8668,"y":0.0824,"z":-0.4919},{"x":-0.0184,"y":-0.1939,"z":-0.9809},{"x":0.9716,"y":-0.1939,"z":-0.1355},{"x":0.0278,"y":0.7506,"z":-0.6601},{"x":0.6476,"y":0.7506,"z":-0.1309},{"x":0.5208,"y":0.8296,"z":-0.2011},{"x":0.117,"y":0.8296,"z":-0.5459},{"x":0.9683,"y":0.2365,"z":0.0803},{"x":-0.351,"y":0.2223,"z":-0.9096},{"x":0.9013,"y":-0.3548,"z":-0.2483},{"x":0.1014,"y":-0.3579,"z":-0.9282},{"x":0.1396,"y":-0.5252,"z":-0.8395},{"x":0.7773,"y":-0.5991,"z":-0.1922},{"x":-0.1511,"y":-0.4428,"z":-0.8838},{"x":0.8966,"y":-0.4428,"z":0.0108},{"x":-0.396,"y":-0.7658,"z":-0.5068},{"x":0.4111,"y":-0.6131,"z":0.6746},{"x":0.7739,"y":0.2733,"z":-0.5713},{"x":0.4741,"y":0.2923,"z":-0.8305},{"x":-0.8043,"y":-0.3869,"z":-0.4511},{"x":0.5715,"y":-0.3869,"z":0.7237},{"x":0.5009,"y":-0.0891,"z":-0.8609},{"x":0.7719,"y":-0.0891,"z":-0.6295},{"x":0.421,"y":0.8972,"z":-0.1334},{"x":0.0658,"y":0.8972,"z":-0.4367},{"x":-0.1072,"y":0.1689,"z":-0.9798},{"x":0.8431,"y":-0.4479,"z":-0.2975},{"x":-0.0057,"y":0.5844,"z":-0.8114},{"x":0.8023,"y":0.5844,"z":-0.1215},{"x":-0.5875,"y":-0.4075,"z":-0.6991},{"x":0.8251,"y":-0.5534,"z":-0.1141},{"x":-0.0368,"y":-0.5217,"z":-0.8524},{"x":0.9277,"y":-0.3122,"z":-0.2049},{"x":0.018,"y":-0.2571,"z":-0.9662},{"x":0.8262,"y":-0.5533,"z":-0.1057},{"x":-0.6627,"y":-0.4788,"z":-0.5758},{"x":0.6725,"y":-0.4788,"z":0.5643},{"x":-0.7968,"y":-0.4445,"z":-0.4092},{"x":0.6481,"y":-0.3765,"z":0.662},{"x":-0.5236,"y":-0.6363,"z":-0.5666},{"x":0.6416,"y":-0.6363,"z":0.4284},{"x":-0.5172,"y":-0.5947,"z":-0.6154},{"x":0.6516,"y":-0.6176,"z":0.4404},{"x":0.61,"y":-0.7023,"z":0.367},{"x":-0.2613,"y":0.9631,"z":-0.0648},{"x":0.1077,"y":0.9921,"z":0.0648},{"x":-0.6034,"y":0.3469,"z":-0.718},{"x":0.7855,"y":0.3145,"z":0.533},{"x":-0.5377,"y":-0.7071,"z":-0.4592},{"x":0.5377,"y":-0.7071,"z":0.4592},{"x":0.1038,"y":0.9898,"z":-0.0973},{"x":0.0802,"y":0.9898,"z":-0.1174},{"x":0.0863,"y":0.9899,"z":-0.1122},{"x":0.0799,"y":0.9898,"z":-0.1177},{"x":-0.2846,"y":-0.7212,"z":-0.6316},{"x":0.6684,"y":-0.7212,"z":0.1821},{"x":0.0113,"y":-0.9022,"z":-0.4313},{"x":0.4242,"y":-0.9022,"z":-0.0787},{"x":0.5757,"y":-0.4853,"z":0.6581},{"x":-0.7401,"y":-0.4853,"z":-0.4655},{"x":0.3468,"y":0.2328,"z":0.9086},{"x":-0.9627,"y":0.2429,"z":-0.1194},{"x":0.1108,"y":0.6985,"z":0.7069},{"x":-0.4796,"y":0.8231,"z":-0.304},{"x":0.0732,"y":0.9939,"z":0.083},{"x":0.0865,"y":0.9899,"z":-0.1121},{"x":0.5073,"y":0.0097,"z":-0.8617},{"x":0.7249,"y":0.0392,"z":-0.6878},{"x":0.2762,"y":0.0413,"z":-0.9602},{"x":0.8141,"y":0.0852,"z":-0.5744},{"x":0.3684,"y":-0.0461,"z":-0.9285},{"x":0.8594,"y":-0.0461,"z":-0.5093},{"x":0.551,"y":0.0458,"z":-0.8332},{"x":0.7948,"y":0.0124,"z":-0.6068},{"x":0.088,"y":0.1916,"z":-0.9775},{"x":0.9517,"y":0.1916,"z":-0.24},{"x":0.2649,"y":-0.032,"z":-0.9638},{"x":0.8885,"y":-0.0364,"z":-0.4574},{"x":0.4304,"y":0.0723,"z":-0.8997},{"x":0.8084,"y":-0.1897,"z":-0.5572},{"x":0.5405,"y":-0.0225,"z":-0.841},{"x":0.746,"y":-0.0225,"z":-0.6656},{"x":0.6139,"y":0.7454,"z":-0.2598},{"x":0.0363,"y":0.6088,"z":-0.7925},{"x":0.1069,"y":-0.1486,"z":-0.9831},{"x":0.9542,"y":-0.1486,"z":-0.2596},{"x":0.1985,"y":-0.1986,"z":-0.9598},{"x":0.9025,"y":-0.2008,"z":-0.3811},{"x":0.3348,"y":-0.4062,"z":-0.8502},{"x":0.9625,"y":-0.1334,"z":-0.2362},{"x":0.0725,"y":0.2164,"z":-0.9736},{"x":0.9502,"y":0.2164,"z":-0.2241},{"x":-0.1158,"y":-0.9932,"z":-0.0078},{"x":0.0258,"y":-0.9932,"z":0.1131},{"x":-0.4452,"y":-0.8527,"z":-0.2734},{"x":0.3397,"y":-0.8527,"z":0.3969},{"x":-0.5194,"y":-0.246,"z":-0.8184},{"x":0.8783,"y":-0.2541,"z":0.4049},{"x":-0.6309,"y":0.5627,"z":-0.5342},{"x":0.6051,"y":0.5291,"z":0.595},{"x":-0.0418,"y":0.9243,"z":0.3794},{"x":-0.3302,"y":0.9439,"z":0.0001},{"x":0.1884,"y":0.8851,"z":0.4254},{"x":-0.3916,"y":0.8743,"z":-0.2869},{"x":-0.1275,"y":-0.0144,"z":0.9917},{"x":-0.9522,"y":-0.003,"z":0.3056},{"x":-0.4316,"y":-0.0749,"z":0.899},{"x":-0.8203,"y":-0.075,"z":0.567},{"x":0.5881,"y":0.6786,"z":0.4401},{"x":-0.6113,"y":0.5901,"z":-0.5274},{"x":-0.9807,"y":-0.1711,"z":0.0946},{"x":0.0601,"y":-0.1711,"z":0.9834},{"x":-0.0045,"y":-0.8283,"z":0.5603},{"x":-0.5526,"y":-0.8283,"z":0.0922}],"faces":[{"vertices":[0,1,2],"normals":[0,1,2]},{"vertices":[3,4,5],"normals":[3,4,5]},{"vertices":[2,6,7],"normals":[6,7,8]},{"vertices":[8,5,9],"normals":[9,9,9]},{"vertices":[1,10,6],"normals":[10,10,10]},{"vertices":[11,3,8],"normals":[11,11,11]},{"vertices":[12,13,1],"normals":[12,12,12]},{"vertices":[14,15,3],"normals":[13,13,13]},{"vertices":[16,17,13],"normals":[14,14,14]},{"vertices":[18,19,14],"normals":[15,15,15]},{"vertices":[13,20,10],"normals":[16,16,16]},{"vertices":[21,14,11],"normals":[17,17,17]},{"vertices":[22,20,17],"normals":[18,18,18]},{"vertices":[23,21,24],"normals":[19,19,19]},{"vertices":[25,22,17],"normals":[20,21,22]},{"vertices":[23,26,18],"normals":[23,24,25]},{"vertices":[27,28,22],"normals":[26,26,26]},{"vertices":[29,30,23],"normals":[27,27,27]},{"vertices":[28,31,22],"normals":[28,28,28]},{"vertices":[29,24,32],"normals":[29,30,31]},{"vertices":[33,34,28],"normals":[32,32,32]},{"vertices":[35,32,36],"normals":[33,33,33]},{"vertices":[37,28,38],"normals":[34,34,34]},{"vertices":[39,29,35],"normals":[35,35,35]},{"vertices":[40,33,37],"normals":[36,36,36]},{"vertices":[41,35,42],"normals":[37,37,37]},{"vertices":[43,44,33],"normals":[38,38,38]},{"vertices":[42,36,45],"normals":[39,39,39]},{"vertices":[2,46,43],"normals":[40,40,40]},{"vertices":[5,45,9],"normals":[41,42,43]},{"vertices":[0,43,40],"normals":[44,44,44]},{"vertices":[4,42,5],"normals":[45,45,45]},{"vertices":[40,47,0],"normals":[46,46,46]},{"vertices":[41,48,49],"normals":[47,47,47]},{"vertices":[37,50,40],"normals":[48,48,48]},{"vertices":[39,49,51],"normals":[49,49,49]},{"vertices":[38,52,37],"normals":[50,50,50]},{"vertices":[53,51,54],"normals":[51,51,51]},{"vertices":[27,55,38],"normals":[52,52,52]},{"vertices":[30,54,56],"normals":[53,53,53]},{"vertices":[27,57,58],"normals":[54,54,54]},{"vertices":[59,30,56],"normals":[55,55,55]},{"vertices":[25,60,57],"normals":[56,56,56]},{"vertices":[61,26,59],"normals":[57,57,57]},{"vertices":[16,62,60],"normals":[58,58,58]},{"vertices":[63,19,61],"normals":[59,59,59]},{"vertices":[12,47,62],"normals":[60,60,60]},{"vertices":[48,15,63],"normals":[61,61,61]},{"vertices":[64,62,47],"normals":[62,62,62]},{"vertices":[48,63,65],"normals":[63,63,63]},{"vertices":[60,62,64],"normals":[64,64,64]},{"vertices":[65,63,61],"normals":[65,65,65]},{"vertices":[64,57,60],"normals":[66,66,66]},{"vertices":[61,59,65],"normals":[67,67,67]},{"vertices":[64,58,57],"normals":[68,68,68]},{"vertices":[59,56,65],"normals":[69,69,69]},{"vertices":[64,55,58],"normals":[70,70,70]},{"vertices":[56,54,65],"normals":[71,71,71]},{"vertices":[64,52,55],"normals":[72,72,72]},{"vertices":[54,51,65],"normals":[73,73,73]},{"vertices":[64,50,52],"normals":[74,74,74]},{"vertices":[51,49,65],"normals":[75,75,75]},{"vertices":[64,47,50],"normals":[76,76,76]},{"vertices":[49,48,65],"normals":[77,77,77]},{"vertices":[66,67,68],"normals":[78,78,78]},{"vertices":[69,67,70],"normals":[79,79,79]},{"vertices":[71,68,72],"normals":[80,80,80]},{"vertices":[73,74,69],"normals":[81,81,81]},{"vertices":[75,71,72],"normals":[82,82,82]},{"vertices":[73,76,77],"normals":[83,83,83]},{"vertices":[78,79,75],"normals":[84,84,84]},{"vertices":[80,81,76],"normals":[85,85,85]},{"vertices":[82,83,78],"normals":[86,86,86]},{"vertices":[84,85,81],"normals":[87,87,87]},{"vertices":[86,87,88],"normals":[88,88,88]},{"vertices":[89,90,91],"normals":[89,89,89]},{"vertices":[92,87,93],"normals":[90,90,90]},{"vertices":[94,89,95],"normals":[91,91,91]},{"vertices":[92,96,97],"normals":[92,93,94]},{"vertices":[98,94,95],"normals":[95,96,97]},{"vertices":[99,96,100],"normals":[98,98,98]},{"vertices":[101,98,102],"normals":[99,99,99]},{"vertices":[103,104,99],"normals":[100,100,100]},{"vertices":[105,102,106],"normals":[101,101,101]},{"vertices":[107,108,103],"normals":[102,103,104]},{"vertices":[109,106,110],"normals":[105,106,107]},{"vertices":[107,111,112],"normals":[108,108,108]},{"vertices":[113,109,110],"normals":[109,109,109]},{"vertices":[114,111,115],"normals":[110,110,110]},{"vertices":[116,113,117],"normals":[111,111,111]},{"vertices":[118,119,114],"normals":[112,112,112]},{"vertices":[120,117,121],"normals":[113,113,113]},{"vertices":[122,123,118],"normals":[114,114,114]},{"vertices":[122,121,124],"normals":[115,115,115]},{"vertices":[125,123,126],"normals":[116,116,116]},{"vertices":[127,121,117],"normals":[117,117,117]},{"vertices":[125,111,119],"normals":[118,119,120]},{"vertices":[113,127,117],"normals":[121,122,123]},{"vertices":[112,128,129],"normals":[124,124,124]},{"vertices":[110,130,113],"normals":[125,125,125]},{"vertices":[108,129,131],"normals":[126,126,126]},{"vertices":[106,132,110],"normals":[127,127,127]},{"vertices":[104,131,133],"normals":[128,128,128]},{"vertices":[102,134,106],"normals":[129,129,129]},{"vertices":[96,133,135],"normals":[130,130,130]},{"vertices":[98,136,102],"normals":[131,131,131]},{"vertices":[97,135,137],"normals":[132,132,132]},{"vertices":[95,138,98],"normals":[133,133,133]},{"vertices":[87,137,139],"normals":[134,134,134]},{"vertices":[89,140,95],"normals":[135,135,135]},{"vertices":[88,139,141],"normals":[136,136,136]},{"vertices":[91,142,89],"normals":[137,137,137]},{"vertices":[141,143,88],"normals":[138,138,138]},{"vertices":[143,144,91],"normals":[139,139,139]},{"vertices":[123,145,126],"normals":[140,140,140]},{"vertices":[121,146,124],"normals":[141,141,141]},{"vertices":[145,147,148],"normals":[142,143,144]},{"vertices":[147,146,149],"normals":[145,146,147]},{"vertices":[150,147,143],"normals":[148,149,149]},{"vertices":[151,147,149],"normals":[150,145,147]},{"vertices":[152,70,66],"normals":[151,151,151]},{"vertices":[70,153,69],"normals":[152,152,152]},{"vertices":[154,66,71],"normals":[153,153,153]},{"vertices":[69,155,73],"normals":[154,154,154]},{"vertices":[154,79,156],"normals":[155,155,155]},{"vertices":[155,80,73],"normals":[156,156,156]},{"vertices":[157,158,83],"normals":[157,157,157]},{"vertices":[159,160,84],"normals":[158,158,158]},{"vertices":[156,83,158],"normals":[159,159,159]},{"vertices":[84,161,159],"normals":[160,160,160]},{"vertices":[162,163,164],"normals":[161,161,161]},{"vertices":[162,165,166],"normals":[162,162,162]},{"vertices":[163,167,158],"normals":[163,164,165]},{"vertices":[165,167,166],"normals":[166,164,167]},{"vertices":[156,167,168],"normals":[168,168,168]},{"vertices":[161,167,159],"normals":[168,168,168]},{"vertices":[169,170,164],"normals":[169,169,169]},{"vertices":[171,172,173],"normals":[170,170,170]},{"vertices":[174,175,169],"normals":[171,171,171]},{"vertices":[176,177,172],"normals":[172,172,172]},{"vertices":[178,174,179],"normals":[173,173,173]},{"vertices":[180,177,181],"normals":[174,174,174]},{"vertices":[182,179,180],"normals":[175,175,175]},{"vertices":[164,184,162],"normals":[176,176,176]},{"vertices":[173,184,171],"normals":[177,177,177]},{"vertices":[170,185,184],"normals":[178,178,178]},{"vertices":[171,185,186],"normals":[179,179,179]},{"vertices":[182,187,178],"normals":[180,180,180]},{"vertices":[188,182,180],"normals":[181,181,181]},{"vertices":[178,189,190],"normals":[182,182,182]},{"vertices":[191,180,181],"normals":[183,183,183]},{"vertices":[189,175,190],"normals":[184,184,184]},{"vertices":[191,176,192],"normals":[185,185,185]},{"vertices":[175,193,170],"normals":[186,186,186]},{"vertices":[186,176,171],"normals":[187,187,187]},{"vertices":[194,187,195],"normals":[188,188,188]},{"vertices":[192,188,191],"normals":[189,189,189]},{"vertices":[195,193,194],"normals":[190,190,190]},{"vertices":[186,195,192],"normals":[191,191,191]},{"vertices":[179,88,143],"normals":[192,192,192]},{"vertices":[91,179,143],"normals":[193,193,193]},{"vertices":[174,196,88],"normals":[194,194,194]},{"vertices":[197,177,91],"normals":[195,195,195]},{"vertices":[164,196,169],"normals":[196,196,196]},{"vertices":[173,197,198],"normals":[197,197,197]},{"vertices":[163,199,164],"normals":[198,198,198]},{"vertices":[165,198,160],"normals":[199,199,199]},{"vertices":[200,157,82],"normals":[200,200,200]},{"vertices":[201,160,198],"normals":[201,201,201]},{"vertices":[202,199,200],"normals":[202,202,202]},{"vertices":[203,198,197],"normals":[203,203,203]},{"vertices":[86,196,202],"normals":[204,204,204]},{"vertices":[197,90,203],"normals":[205,205,205]},{"vertices":[168,204,156],"normals":[206,206,206]},{"vertices":[168,205,206],"normals":[207,207,207]},{"vertices":[154,204,207],"normals":[208,208,208]},{"vertices":[205,155,208],"normals":[209,209,209]},{"vertices":[152,207,209],"normals":[210,210,210]},{"vertices":[208,153,210],"normals":[211,211,211]},{"vertices":[211,209,212],"normals":[168,168,168]},{"vertices":[210,211,212],"normals":[168,168,168]},{"vertices":[209,213,212],"normals":[212,212,212]},{"vertices":[210,213,214],"normals":[213,213,214]},{"vertices":[209,215,216],"normals":[215,215,215]},{"vertices":[217,210,214],"normals":[216,216,216]},{"vertices":[207,218,215],"normals":[217,217,217]},{"vertices":[219,208,217],"normals":[218,218,218]},{"vertices":[206,218,204],"normals":[219,219,219]},{"vertices":[206,219,220],"normals":[220,220,220]},{"vertices":[220,216,218],"normals":[221,221,221]},{"vertices":[214,220,219],"normals":[222,222,222]},{"vertices":[218,216,215],"normals":[223,223,223]},{"vertices":[217,214,219],"normals":[224,224,224]},{"vertices":[148,221,222],"normals":[225,225,225]},{"vertices":[223,149,224],"normals":[226,226,226]},{"vertices":[145,222,225],"normals":[227,227,227]},{"vertices":[224,146,226],"normals":[228,228,228]},{"vertices":[145,227,126],"normals":[229,229,229]},{"vertices":[146,228,226],"normals":[230,230,230]},{"vertices":[141,221,150],"normals":[231,231,231]},{"vertices":[144,223,229],"normals":[232,232,232]},{"vertices":[141,230,231],"normals":[233,233,233]},{"vertices":[232,144,229],"normals":[234,234,234]},{"vertices":[139,233,230],"normals":[235,235,235]},{"vertices":[234,142,232],"normals":[236,236,236]},{"vertices":[137,235,233],"normals":[237,237,237]},{"vertices":[236,140,234],"normals":[238,238,238]},{"vertices":[135,237,235],"normals":[239,239,239]},{"vertices":[238,138,236],"normals":[240,240,240]},{"vertices":[131,237,133],"normals":[241,241,241]},{"vertices":[134,238,239],"normals":[242,242,242]},{"vertices":[129,240,131],"normals":[243,243,243]},{"vertices":[132,239,241],"normals":[244,244,244]},{"vertices":[129,242,243],"normals":[245,245,245]},{"vertices":[244,132,241],"normals":[246,246,246]},{"vertices":[128,245,242],"normals":[247,247,247]},{"vertices":[246,130,244],"normals":[248,248,248]},{"vertices":[125,227,245],"normals":[249,249,249]},{"vertices":[228,127,246],"normals":[250,250,250]},{"vertices":[227,247,245],"normals":[251,251,251]},{"vertices":[228,248,249],"normals":[252,252,252]},{"vertices":[242,247,250],"normals":[253,253,253]},{"vertices":[248,244,251],"normals":[254,254,254]},{"vertices":[242,252,243],"normals":[255,255,255]},{"vertices":[244,253,251],"normals":[256,256,256]},{"vertices":[243,254,240],"normals":[257,257,257]},{"vertices":[241,255,253],"normals":[258,258,258]},{"vertices":[237,254,256],"normals":[259,259,259]},{"vertices":[255,238,257],"normals":[260,260,260]},{"vertices":[237,258,235],"normals":[261,261,261]},{"vertices":[238,259,257],"normals":[262,262,262]},{"vertices":[233,258,260],"normals":[263,263,263]},{"vertices":[259,234,261],"normals":[264,264,264]},{"vertices":[233,262,230],"normals":[265,265,265]},{"vertices":[234,263,261],"normals":[266,266,266]},{"vertices":[230,264,231],"normals":[267,267,267]},{"vertices":[232,265,263],"normals":[268,268,268]},{"vertices":[221,264,266],"normals":[269,270,269]},{"vertices":[265,223,267],"normals":[271,271,271]},{"vertices":[227,268,269],"normals":[272,272,272]},{"vertices":[270,228,249],"normals":[273,273,273]},{"vertices":[225,271,268],"normals":[274,274,274]},{"vertices":[272,226,270],"normals":[275,275,275]},{"vertices":[222,266,271],"normals":[276,277,278]},{"vertices":[267,224,272],"normals":[279,279,279]},{"vertices":[122,273,274],"normals":[280,280,280]},{"vertices":[275,122,274],"normals":[281,281,281]},{"vertices":[118,276,273],"normals":[282,282,282]},{"vertices":[277,120,275],"normals":[283,283,283]},{"vertices":[115,276,114],"normals":[284,284,284]},{"vertices":[278,277,279],"normals":[285,285,285]},{"vertices":[107,280,115],"normals":[286,287,288]},{"vertices":[109,279,281],"normals":[289,290,291]},{"vertices":[103,282,107],"normals":[292,292,292]},{"vertices":[105,281,283],"normals":[293,294,295]},{"vertices":[103,284,285],"normals":[296,296,296]},{"vertices":[286,105,283],"normals":[297,297,297]},{"vertices":[100,284,99],"normals":[298,298,298]},{"vertices":[287,286,288],"normals":[299,299,299]},{"vertices":[100,289,290],"normals":[300,300,300]},{"vertices":[291,287,288],"normals":[301,301,301]},{"vertices":[92,292,289],"normals":[302,302,302]},{"vertices":[293,94,291],"normals":[303,303,303]},{"vertices":[294,295,296],"normals":[304,304,304]},{"vertices":[294,297,298],"normals":[305,305,305]},{"vertices":[296,299,300],"normals":[306,306,306]},{"vertices":[296,301,297],"normals":[307,307,307]},{"vertices":[300,302,303],"normals":[308,308,308]},{"vertices":[300,304,301],"normals":[309,309,309]},{"vertices":[68,303,302],"normals":[310,310,310]},{"vertices":[303,74,304],"normals":[311,311,311]},{"vertices":[72,302,305],"normals":[312,312,312]},{"vertices":[304,77,306],"normals":[313,313,313]},{"vertices":[75,305,307],"normals":[314,314,314]},{"vertices":[306,76,308],"normals":[315,315,315]},{"vertices":[78,307,309],"normals":[316,316,316]},{"vertices":[308,81,310],"normals":[317,317,317]},{"vertices":[307,295,309],"normals":[318,318,318]},{"vertices":[297,308,310],"normals":[319,319,319]},{"vertices":[305,299,307],"normals":[320,320,320]},{"vertices":[306,301,304],"normals":[321,321,321]},{"vertices":[309,311,312],"normals":[322,322,322]},{"vertices":[310,298,297],"normals":[323,323,323]},{"vertices":[82,309,312],"normals":[324,325,326]},{"vertices":[310,85,313],"normals":[327,328,329]},{"vertices":[314,202,200],"normals":[330,330,330]},{"vertices":[315,203,316],"normals":[331,331,331]},{"vertices":[312,200,82],"normals":[332,332,332]},{"vertices":[313,201,315],"normals":[333,333,333]},{"vertices":[202,317,86],"normals":[334,334,334]},{"vertices":[203,318,316],"normals":[335,335,335]},{"vertices":[317,93,86],"normals":[336,336,336]},{"vertices":[318,319,293],"normals":[337,337,337]},{"vertices":[320,321,322],"normals":[338,339,340]},{"vertices":[323,321,324],"normals":[341,342,343]},{"vertices":[325,326,321],"normals":[344,344,344]},{"vertices":[324,326,327],"normals":[345,345,345]},{"vertices":[326,328,329],"normals":[346,347,348]},{"vertices":[330,326,329],"normals":[349,350,351]},{"vertices":[329,311,294],"normals":[352,352,352]},{"vertices":[298,329,294],"normals":[353,353,353]},{"vertices":[311,314,312],"normals":[354,354,354]},{"vertices":[298,315,330],"normals":[355,355,355]},{"vertices":[290,331,332],"normals":[356,356,356]},{"vertices":[333,288,334],"normals":[357,357,357]},{"vertices":[335,322,336],"normals":[358,358,358]},{"vertices":[337,322,323],"normals":[359,359,359]},{"vertices":[338,339,340],"normals":[360,360,360]},{"vertices":[341,339,342],"normals":[361,361,361]},{"vertices":[339,343,344],"normals":[362,362,362]},{"vertices":[345,339,344],"normals":[363,363,363]},{"vertices":[344,335,336],"normals":[364,364,364]},{"vertices":[337,344,336],"normals":[365,365,365]},{"vertices":[285,346,347],"normals":[366,366,366]},{"vertices":[348,283,349],"normals":[367,367,367]},{"vertices":[347,350,351],"normals":[368,368,368]},{"vertices":[352,349,353],"normals":[369,369,369]},{"vertices":[351,354,355],"normals":[370,370,370]},{"vertices":[356,353,357],"normals":[371,371,371]},{"vertices":[355,358,359],"normals":[372,372,372]},{"vertices":[360,357,361],"normals":[373,373,373]},{"vertices":[362,358,363],"normals":[374,374,374]},{"vertices":[364,360,361],"normals":[375,375,375]},{"vertices":[335,359,362],"normals":[376,376,376]},{"vertices":[361,337,364],"normals":[377,377,377]},{"vertices":[343,355,359],"normals":[378,378,378]},{"vertices":[357,345,361],"normals":[379,379,379]},{"vertices":[365,351,355],"normals":[380,380,380]},{"vertices":[353,342,357],"normals":[381,381,381]},{"vertices":[338,347,351],"normals":[382,382,382]},{"vertices":[349,341,353],"normals":[383,383,383]},{"vertices":[285,366,282],"normals":[384,385,386]},{"vertices":[283,367,349],"normals":[387,387,387]},{"vertices":[366,340,368],"normals":[388,388,388]},{"vertices":[367,340,341],"normals":[389,389,389]},{"vertices":[273,280,282],"normals":[390,390,390]},{"vertices":[279,275,281],"normals":[391,391,391]},{"vertices":[273,366,368],"normals":[392,392,392]},{"vertices":[367,275,368],"normals":[393,393,393]},{"vertices":[274,273,368],"normals":[394,394,394]},{"vertices":[368,275,274],"normals":[395,395,395]},{"vertices":[290,346,284],"normals":[396,396,396]},{"vertices":[288,348,334],"normals":[397,397,397]},{"vertices":[332,350,346],"normals":[398,398,398]},{"vertices":[352,334,348],"normals":[399,399,399]},{"vertices":[369,354,350],"normals":[400,400,400]},{"vertices":[356,370,352],"normals":[401,401,401]},{"vertices":[358,371,363],"normals":[402,402,402]},{"vertices":[360,372,356],"normals":[403,403,403]},{"vertices":[373,374,328],"normals":[404,404,404]},{"vertices":[327,375,376],"normals":[405,405,405]},{"vertices":[374,377,331],"normals":[406,407,408]},{"vertices":[375,378,376],"normals":[409,410,411]},{"vertices":[289,374,331],"normals":[412,412,412]},{"vertices":[375,291,333],"normals":[413,413,413]},{"vertices":[292,314,374],"normals":[414,414,414]},{"vertices":[315,293,375],"normals":[415,415,415]},{"vertices":[314,328,374],"normals":[416,416,416]},{"vertices":[375,330,315],"normals":[417,417,417]},{"vertices":[292,317,379],"normals":[418,418,418]},{"vertices":[316,318,293],"normals":[419,419,419]},{"vertices":[380,362,363],"normals":[420,420,420]},{"vertices":[381,364,382],"normals":[421,421,421]},{"vertices":[362,320,335],"normals":[422,422,422]},{"vertices":[364,323,382],"normals":[423,423,423]},{"vertices":[383,380,377],"normals":[424,424,424]},{"vertices":[376,381,382],"normals":[425,425,425]},{"vertices":[325,383,373],"normals":[426,426,426]},{"vertices":[324,376,382],"normals":[427,427,427]},{"vertices":[320,384,325],"normals":[428,428,428]},{"vertices":[324,382,323],"normals":[429,429,429]},{"vertices":[385,386,387],"normals":[430,430,430]},{"vertices":[388,389,390],"normals":[431,431,431]},{"vertices":[387,391,392],"normals":[432,432,432]},{"vertices":[393,394,395],"normals":[433,433,433]},{"vertices":[391,396,392],"normals":[434,434,434]},{"vertices":[393,397,398],"normals":[435,435,435]},{"vertices":[399,400,396],"normals":[436,436,436]},{"vertices":[398,401,402],"normals":[437,437,437]},{"vertices":[403,404,400],"normals":[438,438,438]},{"vertices":[402,405,406],"normals":[439,439,439]},{"vertices":[404,407,408],"normals":[440,440,440]},{"vertices":[409,405,410],"normals":[441,441,441]},{"vertices":[411,412,407],"normals":[442,442,442]},{"vertices":[413,406,409],"normals":[443,443,443]},{"vertices":[403,414,411],"normals":[444,445,446]},{"vertices":[415,402,406],"normals":[447,448,449]},{"vertices":[416,403,399],"normals":[450,450,450]},{"vertices":[417,402,418],"normals":[451,451,451]},{"vertices":[419,399,391],"normals":[452,453,454]},{"vertices":[420,398,417],"normals":[455,456,457]},{"vertices":[421,391,386],"normals":[458,458,458]},{"vertices":[422,393,420],"normals":[459,459,459]},{"vertices":[386,423,421],"normals":[460,460,460]},{"vertices":[424,389,422],"normals":[461,461,461]},{"vertices":[377,425,331],"normals":[462,462,462]},{"vertices":[378,426,427],"normals":[463,463,463]},{"vertices":[408,428,377],"normals":[464,464,464]},{"vertices":[410,427,409],"normals":[465,465,465]},{"vertices":[332,425,369],"normals":[466,466,466]},{"vertices":[426,334,370],"normals":[467,467,467]},{"vertices":[371,429,385],"normals":[468,468,468]},{"vertices":[390,372,388],"normals":[469,469,469]},{"vertices":[407,430,428],"normals":[470,470,470]},{"vertices":[431,409,427],"normals":[471,471,471]},{"vertices":[432,430,433],"normals":[472,472,472]},{"vertices":[434,431,427],"normals":[473,473,473]},{"vertices":[435,433,436],"normals":[168,168,168]},{"vertices":[437,438,439],"normals":[168,168,168]},{"vertices":[440,435,441],"normals":[474,474,474]},{"vertices":[442,438,434],"normals":[475,475,475]},{"vertices":[440,443,444],"normals":[476,476,476]},{"vertices":[442,445,446],"normals":[477,477,477]},{"vertices":[444,423,429],"normals":[478,478,478]},{"vertices":[447,424,445],"normals":[479,479,479]},{"vertices":[369,444,371],"normals":[480,480,480]},{"vertices":[447,370,372],"normals":[481,481,481]},{"vertices":[425,440,369],"normals":[482,482,482]},{"vertices":[426,442,434],"normals":[483,483,483]},{"vertices":[425,428,432],"normals":[484,484,484]},{"vertices":[434,427,426],"normals":[485,485,485]},{"vertices":[423,448,449],"normals":[486,486,486]},{"vertices":[450,424,451],"normals":[487,487,487]},{"vertices":[441,448,443],"normals":[488,488,488]},{"vertices":[446,450,452],"normals":[489,489,489]},{"vertices":[441,453,454],"normals":[490,490,490]},{"vertices":[455,446,452],"normals":[491,491,491]},{"vertices":[436,453,435],"normals":[492,492,492]},{"vertices":[439,455,456],"normals":[493,493,493]},{"vertices":[433,457,436],"normals":[494,494,494]},{"vertices":[437,456,458],"normals":[495,495,495]},{"vertices":[433,459,460],"normals":[496,496,496]},{"vertices":[461,437,458],"normals":[497,497,497]},{"vertices":[430,462,459],"normals":[498,498,498]},{"vertices":[463,431,461],"normals":[498,498,498]},{"vertices":[421,449,464],"normals":[499,499,499]},{"vertices":[451,422,465],"normals":[500,500,500]},{"vertices":[419,464,466],"normals":[501,501,501]},{"vertices":[465,420,467],"normals":[502,502,502]},{"vertices":[416,466,468],"normals":[503,503,503]},{"vertices":[467,417,469],"normals":[504,504,504]},{"vertices":[416,470,471],"normals":[505,505,505]},{"vertices":[417,472,469],"normals":[506,506,506]},{"vertices":[471,473,414],"normals":[507,507,507]},{"vertices":[418,474,472],"normals":[508,508,508]},{"vertices":[414,462,412],"normals":[509,510,511]},{"vertices":[415,463,474],"normals":[512,512,512]},{"vertices":[460,475,457],"normals":[513,513,513]},{"vertices":[458,476,477],"normals":[514,514,514]},{"vertices":[478,479,475],"normals":[515,515,515]},{"vertices":[477,480,481],"normals":[516,516,516]},{"vertices":[479,482,483],"normals":[517,517,517]},{"vertices":[484,480,485],"normals":[518,518,518]},{"vertices":[482,486,483],"normals":[519,519,519]},{"vertices":[484,487,488],"normals":[520,520,520]},{"vertices":[464,483,486],"normals":[521,521,521]},{"vertices":[485,465,487],"normals":[522,522,522]},{"vertices":[479,449,448],"normals":[523,523,523]},{"vertices":[480,451,485],"normals":[524,524,524]},{"vertices":[454,479,448],"normals":[525,525,525]},{"vertices":[452,480,476],"normals":[526,526,526]},{"vertices":[457,454,453],"normals":[168,168,168]},{"vertices":[452,456,455],"normals":[168,168,168]},{"vertices":[462,460,459],"normals":[527,527,527]},{"vertices":[463,458,477],"normals":[528,528,528]},{"vertices":[473,478,462],"normals":[529,529,529]},{"vertices":[477,474,463],"normals":[530,530,530]},{"vertices":[482,473,470],"normals":[531,531,531]},{"vertices":[484,474,481],"normals":[532,532,532]},{"vertices":[489,470,468],"normals":[533,533,533]},{"vertices":[488,472,484],"normals":[534,534,534]},{"vertices":[466,489,468],"normals":[535,535,535]},{"vertices":[488,467,469],"normals":[536,536,536]},{"vertices":[464,486,466],"normals":[537,537,537]},{"vertices":[467,487,465],"normals":[538,538,538]},{"vertices":[404,490,491],"normals":[539,539,539]},{"vertices":[492,405,493],"normals":[540,540,540]},{"vertices":[400,491,494],"normals":[541,541,541]},{"vertices":[493,401,495],"normals":[542,542,542]},{"vertices":[400,496,396],"normals":[543,543,543]},{"vertices":[401,497,495],"normals":[544,544,544]},{"vertices":[396,498,392],"normals":[545,545,545]},{"vertices":[397,499,497],"normals":[546,546,546]},{"vertices":[392,500,387],"normals":[547,547,547]},{"vertices":[395,501,499],"normals":[548,548,548]},{"vertices":[387,502,385],"normals":[549,549,549]},{"vertices":[394,503,501],"normals":[550,550,550]},{"vertices":[491,502,500],"normals":[551,551,551]},{"vertices":[493,503,492],"normals":[552,552,552]},{"vertices":[500,494,491],"normals":[553,553,553]},{"vertices":[495,501,493],"normals":[554,554,554]},{"vertices":[498,496,494],"normals":[555,555,555]},{"vertices":[495,497,499],"normals":[556,556,556]},{"vertices":[371,502,363],"normals":[557,557,557]},{"vertices":[372,503,388],"normals":[558,558,558]},{"vertices":[363,490,380],"normals":[559,559,559]},{"vertices":[492,504,381],"normals":[560,560,560]},{"vertices":[377,490,408],"normals":[561,561,561]},{"vertices":[492,378,410],"normals":[562,562,562]},{"vertices":[0,12,1],"normals":[0,563,1]},{"vertices":[3,15,4],"normals":[3,564,4]},{"vertices":[2,1,6],"normals":[6,565,7]},{"vertices":[8,3,5],"normals":[566,566,566]},{"vertices":[1,13,10],"normals":[567,567,567]},{"vertices":[11,14,3],"normals":[568,568,568]},{"vertices":[12,16,13],"normals":[569,569,569]},{"vertices":[14,19,15],"normals":[570,570,570]},{"vertices":[16,25,17],"normals":[571,571,571]},{"vertices":[18,26,19],"normals":[572,572,572]},{"vertices":[13,17,20],"normals":[573,573,573]},{"vertices":[21,18,14],"normals":[574,574,574]},{"vertices":[22,31,20],"normals":[575,575,575]},{"vertices":[23,18,21],"normals":[576,576,576]},{"vertices":[25,27,22],"normals":[20,577,21]},{"vertices":[23,30,26],"normals":[23,578,24]},{"vertices":[27,38,28],"normals":[579,579,579]},{"vertices":[29,53,30],"normals":[580,580,580]},{"vertices":[28,34,31],"normals":[581,581,581]},{"vertices":[29,23,24],"normals":[29,582,30]},{"vertices":[33,44,34],"normals":[583,583,583]},{"vertices":[35,29,32],"normals":[584,584,584]},{"vertices":[37,33,28],"normals":[585,585,585]},{"vertices":[39,53,29],"normals":[586,586,586]},{"vertices":[40,43,33],"normals":[587,587,587]},{"vertices":[41,39,35],"normals":[588,588,588]},{"vertices":[43,46,44],"normals":[589,589,589]},{"vertices":[42,35,36],"normals":[590,590,590]},{"vertices":[2,7,46],"normals":[591,591,591]},{"vertices":[5,42,45],"normals":[41,592,42]},{"vertices":[0,2,43],"normals":[593,593,593]},{"vertices":[4,41,42],"normals":[594,594,594]},{"vertices":[40,50,47],"normals":[595,595,595]},{"vertices":[41,4,48],"normals":[596,596,596]},{"vertices":[37,52,50],"normals":[597,597,597]},{"vertices":[39,41,49],"normals":[598,598,598]},{"vertices":[38,55,52],"normals":[599,599,599]},{"vertices":[53,39,51],"normals":[600,600,600]},{"vertices":[27,58,55],"normals":[601,601,601]},{"vertices":[30,53,54],"normals":[602,602,602]},{"vertices":[27,25,57],"normals":[603,603,603]},{"vertices":[59,26,30],"normals":[604,604,604]},{"vertices":[25,16,60],"normals":[605,605,605]},{"vertices":[61,19,26],"normals":[606,606,606]},{"vertices":[16,12,62],"normals":[607,607,607]},{"vertices":[63,15,19],"normals":[608,608,608]},{"vertices":[12,0,47],"normals":[609,609,609]},{"vertices":[48,4,15],"normals":[610,610,610]},{"vertices":[66,70,67],"normals":[611,611,611]},{"vertices":[69,74,67],"normals":[612,612,612]},{"vertices":[71,66,68],"normals":[613,613,613]},{"vertices":[73,77,74],"normals":[614,614,614]},{"vertices":[75,79,71],"normals":[615,615,615]},{"vertices":[73,80,76],"normals":[616,616,616]},{"vertices":[78,83,79],"normals":[617,617,617]},{"vertices":[80,84,81],"normals":[618,618,618]},{"vertices":[82,157,83],"normals":[619,619,619]},{"vertices":[84,160,85],"normals":[620,620,620]},{"vertices":[86,93,87],"normals":[621,621,621]},{"vertices":[89,319,90],"normals":[622,622,622]},{"vertices":[92,97,87],"normals":[623,623,623]},{"vertices":[94,319,89],"normals":[624,624,624]},{"vertices":[92,100,96],"normals":[92,625,93]},{"vertices":[98,287,94],"normals":[95,626,96]},{"vertices":[99,104,96],"normals":[627,627,627]},{"vertices":[101,287,98],"normals":[628,628,628]},{"vertices":[103,108,104],"normals":[629,629,629]},{"vertices":[105,101,102],"normals":[630,630,630]},{"vertices":[107,112,108],"normals":[102,631,103]},{"vertices":[109,105,106],"normals":[105,632,106]},{"vertices":[107,115,111],"normals":[633,633,633]},{"vertices":[113,278,109],"normals":[634,634,634]},{"vertices":[114,119,111],"normals":[635,635,635]},{"vertices":[116,278,113],"normals":[636,636,636]},{"vertices":[118,123,119],"normals":[637,637,637]},{"vertices":[120,116,117],"normals":[638,638,638]},{"vertices":[122,124,123],"normals":[639,639,639]},{"vertices":[122,120,121],"normals":[640,640,640]},{"vertices":[125,119,123],"normals":[641,641,641]},{"vertices":[127,505,121],"normals":[642,642,642]},{"vertices":[125,128,111],"normals":[118,643,119]},{"vertices":[113,130,127],"normals":[121,644,122]},{"vertices":[112,111,128],"normals":[645,645,645]},{"vertices":[110,132,130],"normals":[646,646,646]},{"vertices":[108,112,129],"normals":[647,647,647]},{"vertices":[106,134,132],"normals":[648,648,648]},{"vertices":[104,108,131],"normals":[649,649,649]},{"vertices":[102,136,134],"normals":[650,650,650]},{"vertices":[96,104,133],"normals":[651,651,651]},{"vertices":[98,138,136],"normals":[652,652,652]},{"vertices":[97,96,135],"normals":[653,653,653]},{"vertices":[95,140,138],"normals":[654,654,654]},{"vertices":[87,97,137],"normals":[655,655,655]},{"vertices":[89,142,140],"normals":[656,656,656]},{"vertices":[88,87,139],"normals":[657,657,657]},{"vertices":[91,144,142],"normals":[658,658,658]},{"vertices":[141,150,143],"normals":[659,659,659]},{"vertices":[143,151,144],"normals":[660,660,660]},{"vertices":[123,124,145],"normals":[661,661,661]},{"vertices":[121,505,146],"normals":[662,662,662]},{"vertices":[145,124,147],"normals":[663,663,663]},{"vertices":[147,124,146],"normals":[664,664,664]},{"vertices":[150,148,147],"normals":[665,144,143]},{"vertices":[151,143,147],"normals":[666,149,149]},{"vertices":[152,211,70],"normals":[667,667,667]},{"vertices":[70,211,153],"normals":[668,668,668]},{"vertices":[154,152,66],"normals":[669,669,669]},{"vertices":[69,153,155],"normals":[670,670,670]},{"vertices":[154,71,79],"normals":[671,671,671]},{"vertices":[155,161,80],"normals":[672,672,672]},{"vertices":[157,163,158],"normals":[673,673,673]},{"vertices":[159,165,160],"normals":[674,674,674]},{"vertices":[156,79,83],"normals":[675,675,675]},{"vertices":[84,80,161],"normals":[676,676,676]},{"vertices":[162,166,163],"normals":[162,162,162]},{"vertices":[162,173,165],"normals":[677,677,677]},{"vertices":[163,166,167],"normals":[163,167,164]},{"vertices":[165,159,167],"normals":[166,678,164]},{"vertices":[156,158,167],"normals":[168,168,168]},{"vertices":[161,168,167],"normals":[168,168,168]},{"vertices":[169,175,170],"normals":[679,679,679]},{"vertices":[171,176,172],"normals":[680,680,680]},{"vertices":[174,190,175],"normals":[681,681,681]},{"vertices":[176,181,177],"normals":[682,682,682]},{"vertices":[178,190,174],"normals":[683,683,683]},{"vertices":[180,179,177],"normals":[684,684,684]},{"vertices":[182,178,179],"normals":[685,685,685]},{"vertices":[182,183,179],"normals":[218,218,218]},{"vertices":[164,170,184],"normals":[686,686,686]},{"vertices":[173,162,184],"normals":[687,687,687]},{"vertices":[170,193,185],"normals":[178,178,178]},{"vertices":[171,184,185],"normals":[179,179,179]},{"vertices":[182,195,187],"normals":[688,688,688]},{"vertices":[188,195,182],"normals":[689,689,689]},{"vertices":[178,187,189],"normals":[690,690,690]},{"vertices":[191,188,180],"normals":[691,691,691]},{"vertices":[189,194,175],"normals":[692,692,692]},{"vertices":[191,181,176],"normals":[693,693,693]},{"vertices":[175,194,193],"normals":[694,694,694]},{"vertices":[186,192,176],"normals":[695,695,695]},{"vertices":[194,189,187],"normals":[696,696,696]},{"vertices":[192,195,188],"normals":[697,697,697]},{"vertices":[195,185,193],"normals":[698,698,698]},{"vertices":[186,185,195],"normals":[699,699,699]},{"vertices":[179,174,88],"normals":[700,700,700]},{"vertices":[91,177,179],"normals":[701,701,701]},{"vertices":[174,169,196],"normals":[702,702,702]},{"vertices":[197,172,177],"normals":[703,703,703]},{"vertices":[164,199,196],"normals":[704,704,704]},{"vertices":[173,172,197],"normals":[705,705,705]},{"vertices":[163,157,199],"normals":[706,706,706]},{"vertices":[165,173,198],"normals":[707,707,707]},{"vertices":[200,199,157],"normals":[708,708,708]},{"vertices":[201,85,160],"normals":[709,709,709]},{"vertices":[202,196,199],"normals":[710,710,710]},{"vertices":[203,201,198],"normals":[711,711,711]},{"vertices":[86,88,196],"normals":[712,712,712]},{"vertices":[197,91,90],"normals":[713,713,713]},{"vertices":[168,206,204],"normals":[714,714,714]},{"vertices":[168,161,205],"normals":[715,715,715]},{"vertices":[154,156,204],"normals":[716,716,716]},{"vertices":[205,161,155],"normals":[717,717,717]},{"vertices":[152,154,207],"normals":[718,718,718]},{"vertices":[208,155,153],"normals":[719,719,719]},{"vertices":[211,152,209],"normals":[720,720,720]},{"vertices":[210,153,211],"normals":[721,721,721]},{"vertices":[209,216,213],"normals":[212,212,212]},{"vertices":[210,212,213],"normals":[213,213,213]},{"vertices":[209,207,215],"normals":[722,722,722]},{"vertices":[217,208,210],"normals":[723,723,723]},{"vertices":[207,204,218],"normals":[217,217,217]},{"vertices":[219,205,208],"normals":[218,218,218]},{"vertices":[206,220,218],"normals":[219,219,219]},{"vertices":[206,205,219],"normals":[220,220,220]},{"vertices":[220,213,216],"normals":[724,724,724]},{"vertices":[214,213,220],"normals":[725,725,725]},{"vertices":[148,150,221],"normals":[726,726,726]},{"vertices":[223,151,149],"normals":[727,727,727]},{"vertices":[145,148,222],"normals":[728,728,728]},{"vertices":[224,149,146],"normals":[729,729,729]},{"vertices":[145,225,227],"normals":[730,730,730]},{"vertices":[146,505,228],"normals":[731,731,731]},{"vertices":[141,231,221],"normals":[732,732,732]},{"vertices":[144,151,223],"normals":[733,733,733]},{"vertices":[141,139,230],"normals":[734,734,734]},{"vertices":[232,142,144],"normals":[735,735,735]},{"vertices":[139,137,233],"normals":[736,736,736]},{"vertices":[234,140,142],"normals":[737,737,737]},{"vertices":[137,135,235],"normals":[738,738,738]},{"vertices":[236,138,140],"normals":[739,739,739]},{"vertices":[135,133,237],"normals":[740,740,740]},{"vertices":[238,136,138],"normals":[741,741,741]},{"vertices":[131,240,237],"normals":[742,742,742]},{"vertices":[134,136,238],"normals":[743,743,743]},{"vertices":[129,243,240],"normals":[744,744,744]},{"vertices":[132,134,239],"normals":[745,745,745]},{"vertices":[129,128,242],"normals":[746,746,746]},{"vertices":[244,130,132],"normals":[747,747,747]},{"vertices":[128,125,245],"normals":[748,748,748]},{"vertices":[246,127,130],"normals":[749,749,749]},{"vertices":[125,126,227],"normals":[750,750,750]},{"vertices":[228,505,127],"normals":[751,751,751]},{"vertices":[227,269,247],"normals":[752,752,752]},{"vertices":[228,246,248],"normals":[753,753,753]},{"vertices":[242,245,247],"normals":[754,754,754]},{"vertices":[248,246,244],"normals":[755,755,755]},{"vertices":[242,250,252],"normals":[756,756,756]},{"vertices":[244,241,253],"normals":[757,757,757]},{"vertices":[243,252,254],"normals":[758,758,758]},{"vertices":[241,239,255],"normals":[759,759,759]},{"vertices":[237,240,254],"normals":[760,760,760]},{"vertices":[255,239,238],"normals":[761,761,761]},{"vertices":[237,256,258],"normals":[762,762,762]},{"vertices":[238,236,259],"normals":[763,763,763]},{"vertices":[233,235,258],"normals":[764,764,764]},{"vertices":[259,236,234],"normals":[765,765,765]},{"vertices":[233,260,262],"normals":[766,766,766]},{"vertices":[234,232,263],"normals":[767,767,767]},{"vertices":[230,262,264],"normals":[768,768,768]},{"vertices":[232,229,265],"normals":[769,769,769]},{"vertices":[221,231,264],"normals":[269,270,270]},{"vertices":[265,229,223],"normals":[770,770,770]},{"vertices":[227,225,268],"normals":[771,771,771]},{"vertices":[270,226,228],"normals":[772,772,772]},{"vertices":[225,222,271],"normals":[773,773,773]},{"vertices":[272,224,226],"normals":[774,774,774]},{"vertices":[222,221,266],"normals":[276,775,277]},{"vertices":[267,223,224],"normals":[776,776,776]},{"vertices":[122,118,273],"normals":[777,777,777]},{"vertices":[275,120,122],"normals":[778,778,778]},{"vertices":[118,114,276],"normals":[779,779,779]},{"vertices":[277,116,120],"normals":[780,780,780]},{"vertices":[115,280,276],"normals":[781,781,781]},{"vertices":[278,116,277],"normals":[782,782,782]},{"vertices":[107,282,280],"normals":[286,783,287]},{"vertices":[109,278,279],"normals":[289,784,290]},{"vertices":[103,285,282],"normals":[785,384,386]},{"vertices":[105,109,281],"normals":[786,786,786]},{"vertices":[103,99,284],"normals":[787,787,787]},{"vertices":[286,101,105],"normals":[788,788,788]},{"vertices":[100,290,284],"normals":[789,789,789]},{"vertices":[287,101,286],"normals":[790,790,790]},{"vertices":[100,92,289],"normals":[791,791,791]},{"vertices":[291,94,287],"normals":[792,792,792]},{"vertices":[92,93,292],"normals":[793,793,793]},{"vertices":[293,319,94],"normals":[794,794,794]},{"vertices":[294,311,295],"normals":[795,795,795]},{"vertices":[294,296,297],"normals":[796,796,796]},{"vertices":[296,295,299],"normals":[797,797,797]},{"vertices":[296,300,301],"normals":[798,798,798]},{"vertices":[300,299,302],"normals":[799,799,799]},{"vertices":[300,303,304],"normals":[800,800,800]},{"vertices":[68,67,303],"normals":[801,801,801]},{"vertices":[303,67,74],"normals":[802,802,802]},{"vertices":[72,68,302],"normals":[803,803,803]},{"vertices":[304,74,77],"normals":[804,804,804]},{"vertices":[75,72,305],"normals":[805,805,805]},{"vertices":[306,77,76],"normals":[806,806,806]},{"vertices":[78,75,307],"normals":[807,807,807]},{"vertices":[308,76,81],"normals":[808,808,808]},{"vertices":[307,299,295],"normals":[809,809,809]},{"vertices":[297,301,308],"normals":[810,810,810]},{"vertices":[305,302,299],"normals":[811,811,811]},{"vertices":[306,308,301],"normals":[812,812,812]},{"vertices":[309,295,311],"normals":[813,813,813]},{"vertices":[310,313,298],"normals":[814,814,814]},{"vertices":[82,78,309],"normals":[324,815,325]},{"vertices":[310,81,85],"normals":[327,816,328]},{"vertices":[314,379,202],"normals":[817,817,817]},{"vertices":[315,201,203],"normals":[818,818,818]},{"vertices":[312,314,200],"normals":[819,819,819]},{"vertices":[313,85,201],"normals":[820,820,820]},{"vertices":[202,379,317],"normals":[821,821,821]},{"vertices":[203,90,318],"normals":[822,822,822]},{"vertices":[317,292,93],"normals":[823,823,823]},{"vertices":[318,90,319],"normals":[824,824,824]},{"vertices":[320,325,321],"normals":[338,825,339]},{"vertices":[323,322,321],"normals":[341,826,342]},{"vertices":[325,373,326],"normals":[827,827,827]},{"vertices":[324,321,326],"normals":[828,828,828]},{"vertices":[326,373,328],"normals":[829,829,829]},{"vertices":[330,327,326],"normals":[830,830,830]},{"vertices":[329,328,311],"normals":[348,347,831]},{"vertices":[298,330,329],"normals":[351,349,351]},{"vertices":[311,328,314],"normals":[832,832,832]},{"vertices":[298,313,315],"normals":[833,833,833]},{"vertices":[290,289,331],"normals":[834,834,834]},{"vertices":[333,291,288],"normals":[835,835,835]},{"vertices":[335,320,322],"normals":[836,836,836]},{"vertices":[337,336,322],"normals":[837,837,837]},{"vertices":[338,365,339],"normals":[838,838,838]},{"vertices":[341,340,339],"normals":[839,839,839]},{"vertices":[339,365,343],"normals":[840,840,840]},{"vertices":[345,342,339],"normals":[841,841,841]},{"vertices":[344,343,335],"normals":[842,843,844]},{"vertices":[337,345,344],"normals":[845,845,846]},{"vertices":[285,284,346],"normals":[847,847,847]},{"vertices":[348,286,283],"normals":[848,848,848]},{"vertices":[347,346,350],"normals":[849,849,849]},{"vertices":[352,348,349],"normals":[850,850,850]},{"vertices":[351,350,354],"normals":[851,851,851]},{"vertices":[356,352,353],"normals":[852,852,852]},{"vertices":[355,354,358],"normals":[853,853,853]},{"vertices":[360,356,357],"normals":[854,854,854]},{"vertices":[362,359,358],"normals":[855,855,855]},{"vertices":[364,504,360],"normals":[856,856,856]},{"vertices":[335,343,359],"normals":[844,843,857]},{"vertices":[361,345,337],"normals":[858,845,845]},{"vertices":[343,365,355],"normals":[859,859,859]},{"vertices":[357,342,345],"normals":[860,860,860]},{"vertices":[365,338,351],"normals":[861,861,861]},{"vertices":[353,341,342],"normals":[862,862,862]},{"vertices":[338,366,347],"normals":[863,863,863]},{"vertices":[349,367,341],"normals":[864,864,864]},{"vertices":[285,347,366],"normals":[865,865,865]},{"vertices":[283,281,367],"normals":[295,294,866]},{"vertices":[366,338,340],"normals":[867,867,867]},{"vertices":[367,368,340],"normals":[868,868,868]},{"vertices":[273,276,280],"normals":[869,869,869]},{"vertices":[279,277,275],"normals":[870,870,870]},{"vertices":[273,282,366],"normals":[871,871,871]},{"vertices":[367,281,275],"normals":[872,872,872]},{"vertices":[290,332,346],"normals":[873,873,873]},{"vertices":[288,286,348],"normals":[874,874,874]},{"vertices":[332,369,350],"normals":[875,875,875]},{"vertices":[352,370,334],"normals":[876,876,876]},{"vertices":[369,371,354],"normals":[877,877,877]},{"vertices":[356,372,370],"normals":[878,878,878]},{"vertices":[358,354,371],"normals":[879,879,879]},{"vertices":[360,504,372],"normals":[880,880,880]},{"vertices":[373,383,374],"normals":[881,881,881]},{"vertices":[327,330,375],"normals":[882,882,882]},{"vertices":[374,383,377],"normals":[406,883,407]},{"vertices":[375,333,378],"normals":[409,884,410]},{"vertices":[289,292,374],"normals":[885,885,885]},{"vertices":[375,293,291],"normals":[886,886,886]},{"vertices":[292,379,314],"normals":[887,887,887]},{"vertices":[315,316,293],"normals":[888,888,888]},{"vertices":[380,384,362],"normals":[889,889,889]},{"vertices":[381,504,364],"normals":[890,890,890]},{"vertices":[362,384,320],"normals":[891,891,891]},{"vertices":[364,337,323],"normals":[892,892,892]},{"vertices":[383,384,380],"normals":[893,893,893]},{"vertices":[376,378,381],"normals":[894,894,894]},{"vertices":[325,384,383],"normals":[895,895,895]},{"vertices":[324,327,376],"normals":[896,896,896]},{"vertices":[385,429,386],"normals":[897,897,897]},{"vertices":[388,394,389],"normals":[898,898,898]},{"vertices":[387,386,391],"normals":[899,899,899]},{"vertices":[393,389,394],"normals":[900,900,900]},{"vertices":[391,399,396],"normals":[901,901,901]},{"vertices":[393,395,397],"normals":[902,902,902]},{"vertices":[399,403,400],"normals":[903,903,903]},{"vertices":[398,397,401],"normals":[904,904,904]},{"vertices":[403,411,404],"normals":[905,905,905]},{"vertices":[402,401,405],"normals":[906,906,906]},{"vertices":[404,411,407],"normals":[907,907,907]},{"vertices":[409,406,405],"normals":[908,908,908]},{"vertices":[411,414,412],"normals":[909,909,909]},{"vertices":[413,415,406],"normals":[910,910,910]},{"vertices":[403,471,414],"normals":[444,911,445]},{"vertices":[415,418,402],"normals":[447,912,448]},{"vertices":[416,471,403],"normals":[913,913,913]},{"vertices":[417,398,402],"normals":[914,914,914]},{"vertices":[419,416,399],"normals":[452,915,453]},{"vertices":[420,393,398],"normals":[455,916,456]},{"vertices":[421,419,391],"normals":[917,917,917]},{"vertices":[422,389,393],"normals":[918,918,918]},{"vertices":[386,429,423],"normals":[919,919,919]},{"vertices":[424,390,389],"normals":[920,920,920]},{"vertices":[377,428,425],"normals":[921,921,921]},{"vertices":[378,333,426],"normals":[922,922,922]},{"vertices":[408,407,428],"normals":[923,923,923]},{"vertices":[410,378,427],"normals":[924,924,924]},{"vertices":[332,331,425],"normals":[925,925,925]},{"vertices":[426,333,334],"normals":[926,926,926]},{"vertices":[371,444,429],"normals":[927,927,927]},{"vertices":[390,447,372],"normals":[928,928,928]},{"vertices":[407,412,430],"normals":[929,929,929]},{"vertices":[431,413,409],"normals":[930,930,930]},{"vertices":[432,428,430],"normals":[931,931,931]},{"vertices":[434,437,431],"normals":[932,932,932]},{"vertices":[435,432,433],"normals":[933,933,933]},{"vertices":[437,434,438],"normals":[934,934,934]},{"vertices":[440,432,435],"normals":[935,935,935]},{"vertices":[442,446,438],"normals":[936,936,936]},{"vertices":[440,441,443],"normals":[937,937,937]},{"vertices":[442,447,445],"normals":[938,938,938]},{"vertices":[444,443,423],"normals":[939,939,939]},{"vertices":[447,390,424],"normals":[940,940,940]},{"vertices":[369,440,444],"normals":[941,941,941]},{"vertices":[447,442,370],"normals":[942,942,942]},{"vertices":[425,432,440],"normals":[943,943,943]},{"vertices":[426,370,442],"normals":[944,944,944]},{"vertices":[423,443,448],"normals":[945,945,945]},{"vertices":[450,445,424],"normals":[946,946,946]},{"vertices":[441,454,448],"normals":[947,947,947]},{"vertices":[446,445,450],"normals":[948,948,948]},{"vertices":[441,435,453],"normals":[490,490,490]},{"vertices":[455,438,446],"normals":[491,949,491]},{"vertices":[436,457,453],"normals":[950,950,950]},{"vertices":[439,438,455],"normals":[951,951,951]},{"vertices":[433,460,457],"normals":[952,952,952]},{"vertices":[437,439,456],"normals":[953,953,953]},{"vertices":[433,430,459],"normals":[954,954,954]},{"vertices":[461,431,437],"normals":[955,955,955]},{"vertices":[430,412,462],"normals":[956,511,510]},{"vertices":[463,413,431],"normals":[957,958,959]},{"vertices":[421,423,449],"normals":[960,960,960]},{"vertices":[451,424,422],"normals":[961,961,961]},{"vertices":[419,421,464],"normals":[962,962,962]},{"vertices":[465,422,420],"normals":[963,963,963]},{"vertices":[416,419,466],"normals":[964,964,964]},{"vertices":[467,420,417],"normals":[965,965,965]},{"vertices":[416,468,470],"normals":[966,966,966]},{"vertices":[417,418,472],"normals":[967,967,967]},{"vertices":[471,470,473],"normals":[968,968,968]},{"vertices":[418,415,474],"normals":[969,969,969]},{"vertices":[414,473,462],"normals":[970,970,970]},{"vertices":[415,413,463],"normals":[971,958,957]},{"vertices":[460,478,475],"normals":[972,972,972]},{"vertices":[458,456,476],"normals":[973,973,973]},{"vertices":[478,506,479],"normals":[974,974,974]},{"vertices":[477,476,480],"normals":[975,975,975]},{"vertices":[479,506,482],"normals":[976,976,976]},{"vertices":[484,481,480],"normals":[977,977,977]},{"vertices":[482,489,486],"normals":[978,978,978]},{"vertices":[484,485,487],"normals":[979,979,979]},{"vertices":[464,449,483],"normals":[980,980,980]},{"vertices":[485,451,465],"normals":[981,981,981]},{"vertices":[479,483,449],"normals":[982,982,982]},{"vertices":[480,450,451],"normals":[983,983,983]},{"vertices":[454,475,479],"normals":[984,984,984]},{"vertices":[452,450,480],"normals":[985,985,985]},{"vertices":[457,475,454],"normals":[986,986,986]},{"vertices":[452,476,456],"normals":[987,987,987]},{"vertices":[462,478,460],"normals":[988,988,988]},{"vertices":[463,461,458],"normals":[989,989,989]},{"vertices":[473,506,478],"normals":[990,990,990]},{"vertices":[477,481,474],"normals":[991,991,991]},{"vertices":[482,506,473],"normals":[992,992,992]},{"vertices":[484,472,474],"normals":[993,993,993]},{"vertices":[489,482,470],"normals":[994,994,994]},{"vertices":[488,469,472],"normals":[995,995,995]},{"vertices":[466,486,489],"normals":[996,996,996]},{"vertices":[488,487,467],"normals":[997,997,997]},{"vertices":[404,408,490],"normals":[998,998,998]},{"vertices":[492,410,405],"normals":[999,999,999]},{"vertices":[400,404,491],"normals":[1000,1000,1000]},{"vertices":[493,405,401],"normals":[1001,1001,1001]},{"vertices":[400,494,496],"normals":[1002,1002,1002]},{"vertices":[401,397,497],"normals":[1003,1003,1003]},{"vertices":[396,496,498],"normals":[1004,1004,1004]},{"vertices":[397,395,499],"normals":[1005,1005,1005]},{"vertices":[392,498,500],"normals":[1006,1006,1006]},{"vertices":[395,394,501],"normals":[1007,1007,1007]},{"vertices":[387,500,502],"normals":[1008,1008,1008]},{"vertices":[394,388,503],"normals":[1009,1009,1009]},{"vertices":[491,490,502],"normals":[1010,1010,1010]},{"vertices":[493,501,503],"normals":[1011,1011,1011]},{"vertices":[500,498,494],"normals":[1012,1012,1012]},{"vertices":[495,499,501],"normals":[1013,1013,1013]},{"vertices":[371,385,502],"normals":[1014,1014,1014]},{"vertices":[372,504,503],"normals":[1015,1015,1015]},{"vertices":[363,502,490],"normals":[1016,1016,1016]},{"vertices":[492,503,504],"normals":[1017,1017,1017]},{"vertices":[377,380,490],"normals":[1018,1018,1018]},{"vertices":[492,381,378],"normals":[1019,1019,1019]}]},{"name":"Cylinder","vertices":[{"x":-5.957436,"y":2.009482,"z":-6.971051},{"x":-5.762346,"y":0.009482,"z":-6.951837},{"x":-5.957436,"y":0.009482,"z":-6.971051},{"x":-5.762346,"y":2.009482,"z":-6.951837},{"x":-5.574753,"y":0.009482,"z":-6.894931},{"x":-5.574753,"y":2.009482,"z":-6.89493},{"x":-5.401866,"y":0.009482,"z":-6.802521},{"x":-5.401866,"y":2.009482,"z":-6.802521},{"x":-5.250329,"y":0.009482,"z":-6.678158},{"x":-5.250329,"y":2.009482,"z":-6.678157},{"x":-5.125967,"y":0.009482,"z":-6.526621},{"x":-5.125967,"y":2.009482,"z":-6.52662},{"x":-5.033556,"y":0.009482,"z":-6.353734},{"x":-5.033556,"y":2.009482,"z":-6.353734},{"x":-4.976651,"y":0.009482,"z":-6.166142},{"x":-4.976651,"y":2.009482,"z":-6.166142},{"x":-4.957436,"y":0.009482,"z":-5.971051},{"x":-4.957436,"y":2.009482,"z":-5.971051},{"x":-4.976651,"y":0.009482,"z":-5.775961},{"x":-4.976651,"y":2.009482,"z":-5.77596},{"x":-5.033556,"y":0.009482,"z":-5.588368},{"x":-5.033556,"y":2.009482,"z":-5.588367},{"x":-5.125967,"y":0.009482,"z":-5.415481},{"x":-5.125967,"y":2.009482,"z":-5.415481},{"x":-5.250329,"y":0.009482,"z":-5.263945},{"x":-5.250329,"y":2.009482,"z":-5.263945},{"x":-5.401866,"y":0.009482,"z":-5.139582},{"x":-5.401866,"y":2.009482,"z":-5.139582},{"x":-5.574753,"y":0.009482,"z":-5.047172},{"x":-5.574753,"y":2.009482,"z":-5.047172},{"x":-5.762346,"y":0.009482,"z":-4.990266},{"x":-5.762346,"y":2.009482,"z":-4.990265},{"x":-5.957437,"y":0.009482,"z":-4.971051},{"x":-5.957437,"y":2.009482,"z":-4.971051},{"x":-6.152527,"y":0.009482,"z":-4.990266},{"x":-6.152527,"y":2.009482,"z":-4.990265},{"x":-6.34012,"y":0.009482,"z":-5.047172},{"x":-6.34012,"y":2.009482,"z":-5.047172},{"x":-6.513007,"y":0.009482,"z":-5.139582},{"x":-6.513007,"y":2.009482,"z":-5.139582},{"x":-6.664543,"y":0.009482,"z":-5.263945},{"x":-6.664543,"y":2.009482,"z":-5.263945},{"x":-6.788906,"y":0.009482,"z":-5.415482},{"x":-6.788906,"y":2.009482,"z":-5.415482},{"x":-6.881316,"y":0.009482,"z":-5.588368},{"x":-6.881316,"y":2.009482,"z":-5.588367},{"x":-6.938221,"y":0.009482,"z":-5.775962},{"x":-6.938221,"y":2.009482,"z":-5.775961},{"x":-6.957436,"y":0.009482,"z":-5.971052},{"x":-6.957436,"y":2.009482,"z":-5.971052},{"x":-6.938221,"y":0.009482,"z":-6.166142},{"x":-6.938221,"y":2.009482,"z":-6.166142},{"x":-6.881315,"y":0.009482,"z":-6.353736},{"x":-6.881315,"y":2.009482,"z":-6.353735},{"x":-6.788905,"y":0.009482,"z":-6.526622},{"x":-6.788905,"y":2.009482,"z":-6.526621},{"x":-6.664542,"y":0.009482,"z":-6.678159},{"x":-6.664542,"y":2.009482,"z":-6.678159},{"x":-6.513005,"y":0.009482,"z":-6.802522},{"x":-6.513005,"y":2.009482,"z":-6.802522},{"x":-6.340118,"y":0.009482,"z":-6.894931},{"x":-6.340118,"y":2.009482,"z":-6.89493},{"x":-6.152525,"y":0.009482,"z":-6.951837},{"x":-6.152525,"y":2.009482,"z":-6.951837}],"normals":[{"x":0.098,"y":0,"z":-0.9952},{"x":0.2903,"y":0,"z":-0.9569},{"x":0.4714,"y":0,"z":-0.8819},{"x":0.6344,"y":0,"z":-0.773},{"x":0.773,"y":0,"z":-0.6344},{"x":0.8819,"y":0,"z":-0.4714},{"x":0.9569,"y":0,"z":-0.2903},{"x":0.9952,"y":0,"z":-0.098},{"x":0.9952,"y":0,"z":0.098},{"x":0.9569,"y":0,"z":0.2903},{"x":0.8819,"y":0,"z":0.4714},{"x":0.773,"y":0,"z":0.6344},{"x":0.6344,"y":0,"z":0.773},{"x":0.4714,"y":0,"z":0.8819},{"x":0.2903,"y":0,"z":0.9569},{"x":0.098,"y":0,"z":0.9952},{"x":-0.098,"y":0,"z":0.9952},{"x":-0.2903,"y":0,"z":0.9569},{"x":-0.4714,"y":0,"z":0.8819},{"x":-0.6344,"y":0,"z":0.773},{"x":-0.773,"y":0,"z":0.6344},{"x":-0.8819,"y":0,"z":0.4714},{"x":-0.9569,"y":0,"z":0.2903},{"x":-0.9952,"y":0,"z":0.098},{"x":-0.9952,"y":0,"z":-0.098},{"x":-0.9569,"y":0,"z":-0.2903},{"x":-0.8819,"y":0,"z":-0.4714},{"x":-0.773,"y":0,"z":-0.6344},{"x":-0.6344,"y":0,"z":-0.773},{"x":-0.4714,"y":0,"z":-0.8819},{"x":0,"y":1,"z":0},{"x":-0.2903,"y":0,"z":-0.9569},{"x":-0.098,"y":0,"z":-0.9952},{"x":0,"y":-1,"z":0}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[3,4,1],"normals":[1,1,1]},{"vertices":[5,6,4],"normals":[2,2,2]},{"vertices":[7,8,6],"normals":[3,3,3]},{"vertices":[9,10,8],"normals":[4,4,4]},{"vertices":[11,12,10],"normals":[5,5,5]},{"vertices":[13,14,12],"normals":[6,6,6]},{"vertices":[15,16,14],"normals":[7,7,7]},{"vertices":[17,18,16],"normals":[8,8,8]},{"vertices":[19,20,18],"normals":[9,9,9]},{"vertices":[21,22,20],"normals":[10,10,10]},{"vertices":[23,24,22],"normals":[11,11,11]},{"vertices":[25,26,24],"normals":[12,12,12]},{"vertices":[27,28,26],"normals":[13,13,13]},{"vertices":[29,30,28],"normals":[14,14,14]},{"vertices":[31,32,30],"normals":[15,15,15]},{"vertices":[33,34,32],"normals":[16,16,16]},{"vertices":[35,36,34],"normals":[17,17,17]},{"vertices":[37,38,36],"normals":[18,18,18]},{"vertices":[39,40,38],"normals":[19,19,19]},{"vertices":[41,42,40],"normals":[20,20,20]},{"vertices":[43,44,42],"normals":[21,21,21]},{"vertices":[45,46,44],"normals":[22,22,22]},{"vertices":[47,48,46],"normals":[23,23,23]},{"vertices":[49,50,48],"normals":[24,24,24]},{"vertices":[51,52,50],"normals":[25,25,25]},{"vertices":[53,54,52],"normals":[26,26,26]},{"vertices":[55,56,54],"normals":[27,27,27]},{"vertices":[57,58,56],"normals":[28,28,28]},{"vertices":[59,60,58],"normals":[29,29,29]},{"vertices":[37,21,5],"normals":[30,30,30]},{"vertices":[61,62,60],"normals":[31,31,31]},{"vertices":[63,2,62],"normals":[32,32,32]},{"vertices":[30,46,62],"normals":[33,33,33]},{"vertices":[0,3,1],"normals":[0,0,0]},{"vertices":[3,5,4],"normals":[1,1,1]},{"vertices":[5,7,6],"normals":[2,2,2]},{"vertices":[7,9,8],"normals":[3,3,3]},{"vertices":[9,11,10],"normals":[4,4,4]},{"vertices":[11,13,12],"normals":[5,5,5]},{"vertices":[13,15,14],"normals":[6,6,6]},{"vertices":[15,17,16],"normals":[7,7,7]},{"vertices":[17,19,18],"normals":[8,8,8]},{"vertices":[19,21,20],"normals":[9,9,9]},{"vertices":[21,23,22],"normals":[10,10,10]},{"vertices":[23,25,24],"normals":[11,11,11]},{"vertices":[25,27,26],"normals":[12,12,12]},{"vertices":[27,29,28],"normals":[13,13,13]},{"vertices":[29,31,30],"normals":[14,14,14]},{"vertices":[31,33,32],"normals":[15,15,15]},{"vertices":[33,35,34],"normals":[16,16,16]},{"vertices":[35,37,36],"normals":[17,17,17]},{"vertices":[37,39,38],"normals":[18,18,18]},{"vertices":[39,41,40],"normals":[19,19,19]},{"vertices":[41,43,42],"normals":[20,20,20]},{"vertices":[43,45,44],"normals":[21,21,21]},{"vertices":[45,47,46],"normals":[22,22,22]},{"vertices":[47,49,48],"normals":[23,23,23]},{"vertices":[49,51,50],"normals":[24,24,24]},{"vertices":[51,53,52],"normals":[25,25,25]},{"vertices":[53,55,54],"normals":[26,26,26]},{"vertices":[55,57,56],"normals":[27,27,27]},{"vertices":[57,59,58],"normals":[28,28,28]},{"vertices":[59,61,60],"normals":[29,29,29]},{"vertices":[5,3,0],"normals":[30,30,30]},{"vertices":[0,63,5],"normals":[30,30,30]},{"vertices":[61,59,57],"normals":[30,30,30]},{"vertices":[57,55,53],"normals":[30,30,30]},{"vertices":[53,51,49],"normals":[30,30,30]},{"vertices":[49,47,45],"normals":[30,30,30]},{"vertices":[45,43,37],"normals":[30,30,30]},{"vertices":[41,39,37],"normals":[30,30,30]},{"vertices":[37,35,33],"normals":[30,30,30]},{"vertices":[33,31,29],"normals":[30,30,30]},{"vertices":[29,27,25],"normals":[30,30,30]},{"vertices":[25,23,21],"normals":[30,30,30]},{"vertices":[21,19,17],"normals":[30,30,30]},{"vertices":[17,15,13],"normals":[30,30,30]},{"vertices":[13,11,9],"normals":[30,30,30]},{"vertices":[9,7,5],"normals":[30,30,30]},{"vertices":[5,63,61],"normals":[30,30,30]},{"vertices":[61,57,5],"normals":[30,30,30]},{"vertices":[53,49,37],"normals":[30,30,30]},{"vertices":[43,41,37],"normals":[30,30,30]},{"vertices":[37,33,29],"normals":[30,30,30]},{"vertices":[29,25,37],"normals":[30,30,30]},{"vertices":[21,17,13],"normals":[30,30,30]},{"vertices":[13,9,21],"normals":[30,30,30]},{"vertices":[5,57,53],"normals":[30,30,30]},{"vertices":[49,45,37],"normals":[30,30,30]},{"vertices":[37,25,21],"normals":[30,30,30]},{"vertices":[21,9,5],"normals":[30,30,30]},{"vertices":[5,53,37],"normals":[30,30,30]},{"vertices":[61,63,62],"normals":[31,31,31]},{"vertices":[63,0,2],"normals":[32,32,32]},{"vertices":[62,2,1],"normals":[33,33,33]},{"vertices":[1,4,6],"normals":[33,33,33]},{"vertices":[6,8,14],"normals":[33,33,33]},{"vertices":[10,12,14],"normals":[33,33,33]},{"vertices":[14,16,22],"normals":[33,33,33]},{"vertices":[18,20,22],"normals":[33,33,33]},{"vertices":[22,24,30],"normals":[33,33,33]},{"vertices":[26,28,30],"normals":[33,33,33]},{"vertices":[30,32,34],"normals":[33,33,33]},{"vertices":[34,36,30],"normals":[33,33,33]},{"vertices":[38,40,42],"normals":[33,33,33]},{"vertices":[42,44,46],"normals":[33,33,33]},{"vertices":[46,48,50],"normals":[33,33,33]},{"vertices":[50,52,54],"normals":[33,33,33]},{"vertices":[54,56,62],"normals":[33,33,33]},{"vertices":[58,60,62],"normals":[33,33,33]},{"vertices":[62,1,6],"normals":[33,33,33]},{"vertices":[8,10,14],"normals":[33,33,33]},{"vertices":[16,18,22],"normals":[33,33,33]},{"vertices":[24,26,30],"normals":[33,33,33]},{"vertices":[30,36,38],"normals":[33,33,33]},{"vertices":[38,42,46],"normals":[33,33,33]},{"vertices":[46,50,62],"normals":[33,33,33]},{"vertices":[56,58,62],"normals":[33,33,33]},{"vertices":[62,6,14],"normals":[33,33,33]},{"vertices":[14,22,62],"normals":[33,33,33]},{"vertices":[30,38,46],"normals":[33,33,33]},{"vertices":[50,54,62],"normals":[33,33,33]},{"vertices":[62,22,30],"normals":[33,33,33]}]},{"name":"Cone","vertices":[{"x":-5.938103,"y":0.023065,"z":5.011304},{"x":-5.938103,"y":2.023065,"z":6.011304},{"x":-5.743012,"y":0.023065,"z":5.030519},{"x":-5.555419,"y":0.023065,"z":5.087425},{"x":-5.382533,"y":0.023065,"z":5.179835},{"x":-5.230996,"y":0.023065,"z":5.304198},{"x":-5.106633,"y":0.023065,"z":5.455734},{"x":-5.014223,"y":0.023065,"z":5.628621},{"x":-4.957317,"y":0.023065,"z":5.816214},{"x":-4.938103,"y":0.023065,"z":6.011304},{"x":-4.957317,"y":0.023065,"z":6.206395},{"x":-5.014223,"y":0.023065,"z":6.393988},{"x":-5.106633,"y":0.023065,"z":6.566875},{"x":-5.230996,"y":0.023065,"z":6.718411},{"x":-5.382533,"y":0.023065,"z":6.842774},{"x":-5.555419,"y":0.023065,"z":6.935184},{"x":-5.743012,"y":0.023065,"z":6.99209},{"x":-5.938103,"y":0.023065,"z":7.011304},{"x":-6.133193,"y":0.023065,"z":6.99209},{"x":-6.320786,"y":0.023065,"z":6.935184},{"x":-6.493673,"y":0.023065,"z":6.842773},{"x":-6.64521,"y":0.023065,"z":6.71841},{"x":-6.769573,"y":0.023065,"z":6.566874},{"x":-6.861982,"y":0.023065,"z":6.393987},{"x":-6.918888,"y":0.023065,"z":6.206394},{"x":-6.938103,"y":0.023065,"z":6.011303},{"x":-6.918888,"y":0.023065,"z":5.816213},{"x":-6.861982,"y":0.023065,"z":5.62862},{"x":-6.769572,"y":0.023065,"z":5.455733},{"x":-6.645208,"y":0.023065,"z":5.304197},{"x":-6.493672,"y":0.023065,"z":5.179834},{"x":-6.320785,"y":0.023065,"z":5.087424},{"x":-6.133192,"y":0.023065,"z":5.030519}],"normals":[{"x":0.0878,"y":0.4455,"z":-0.891},{"x":0.2599,"y":0.4455,"z":-0.8567},{"x":0.422,"y":0.4455,"z":-0.7896},{"x":0.568,"y":0.4455,"z":-0.6921},{"x":0.6921,"y":0.4455,"z":-0.568},{"x":0.7896,"y":0.4455,"z":-0.422},{"x":0.8567,"y":0.4455,"z":-0.2599},{"x":0.891,"y":0.4455,"z":-0.0877},{"x":0.891,"y":0.4455,"z":0.0877},{"x":0.8567,"y":0.4455,"z":0.2599},{"x":0.7896,"y":0.4455,"z":0.422},{"x":0.6921,"y":0.4455,"z":0.568},{"x":0.568,"y":0.4455,"z":0.6921},{"x":0.422,"y":0.4455,"z":0.7896},{"x":0.2599,"y":0.4455,"z":0.8567},{"x":0.0877,"y":0.4455,"z":0.891},{"x":-0.0877,"y":0.4455,"z":0.891},{"x":-0.2599,"y":0.4455,"z":0.8567},{"x":-0.422,"y":0.4455,"z":0.7896},{"x":-0.568,"y":0.4455,"z":0.6921},{"x":-0.6921,"y":0.4455,"z":0.568},{"x":-0.7896,"y":0.4455,"z":0.422},{"x":-0.8567,"y":0.4455,"z":0.2599},{"x":-0.891,"y":0.4455,"z":0.0878},{"x":-0.891,"y":0.4455,"z":-0.0878},{"x":-0.8567,"y":0.4455,"z":-0.2599},{"x":-0.7896,"y":0.4455,"z":-0.422},{"x":-0.6921,"y":0.4455,"z":-0.568},{"x":-0.568,"y":0.4455,"z":-0.6921},{"x":-0.422,"y":0.4455,"z":-0.7896},{"x":-0.2599,"y":0.4455,"z":-0.8567},{"x":-0.0878,"y":0.4455,"z":-0.891},{"x":0,"y":-1,"z":0}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[2,1,3],"normals":[1,1,1]},{"vertices":[3,1,4],"normals":[2,2,2]},{"vertices":[4,1,5],"normals":[3,3,3]},{"vertices":[5,1,6],"normals":[4,4,4]},{"vertices":[6,1,7],"normals":[5,5,5]},{"vertices":[7,1,8],"normals":[6,6,6]},{"vertices":[8,1,9],"normals":[7,7,7]},{"vertices":[9,1,10],"normals":[8,8,8]},{"vertices":[10,1,11],"normals":[9,9,9]},{"vertices":[11,1,12],"normals":[10,10,10]},{"vertices":[12,1,13],"normals":[11,11,11]},{"vertices":[13,1,14],"normals":[12,12,12]},{"vertices":[14,1,15],"normals":[13,13,13]},{"vertices":[15,1,16],"normals":[14,14,14]},{"vertices":[16,1,17],"normals":[15,15,15]},{"vertices":[17,1,18],"normals":[16,16,16]},{"vertices":[18,1,19],"normals":[17,17,17]},{"vertices":[19,1,20],"normals":[18,18,18]},{"vertices":[20,1,21],"normals":[19,19,19]},{"vertices":[21,1,22],"normals":[20,20,20]},{"vertices":[22,1,23],"normals":[21,21,21]},{"vertices":[23,1,24],"normals":[22,22,22]},{"vertices":[24,1,25],"normals":[23,23,23]},{"vertices":[25,1,26],"normals":[24,24,24]},{"vertices":[26,1,27],"normals":[25,25,25]},{"vertices":[27,1,28],"normals":[26,26,26]},{"vertices":[28,1,29],"normals":[27,27,27]},{"vertices":[29,1,30],"normals":[28,28,28]},{"vertices":[30,1,31],"normals":[29,29,29]},{"vertices":[31,1,32],"normals":[30,30,30]},{"vertices":[32,1,0],"normals":[31,31,31]},{"vertices":[20,24,32],"normals":[32,32,32]},{"vertices":[32,0,2],"normals":[32,32,32]},{"vertices":[2,3,4],"normals":[32,32,32]},{"vertices":[4,5,8],"normals":[32,32,32]},{"vertices":[6,7,8],"normals":[32,32,32]},{"vertices":[8,9,12],"normals":[32,32,32]},{"vertices":[10,11,12],"normals":[32,32,32]},{"vertices":[12,13,16],"normals":[32,32,32]},{"vertices":[14,15,16],"normals":[32,32,32]},{"vertices":[16,17,18],"normals":[32,32,32]},{"vertices":[18,19,16],"normals":[32,32,32]},{"vertices":[20,21,24],"normals":[32,32,32]},{"vertices":[22,23,24],"normals":[32,32,32]},{"vertices":[24,25,26],"normals":[32,32,32]},{"vertices":[26,27,28],"normals":[32,32,32]},{"vertices":[28,29,32],"normals":[32,32,32]},{"vertices":[30,31,32],"normals":[32,32,32]},{"vertices":[32,2,4],"normals":[32,32,32]},{"vertices":[5,6,8],"normals":[32,32,32]},{"vertices":[9,10,12],"normals":[32,32,32]},{"vertices":[13,14,16],"normals":[32,32,32]},{"vertices":[16,19,20],"normals":[32,32,32]},{"vertices":[21,22,24],"normals":[32,32,32]},{"vertices":[24,26,32],"normals":[32,32,32]},{"vertices":[29,30,32],"normals":[32,32,32]},{"vertices":[32,4,8],"normals":[32,32,32]},{"vertices":[8,12,32],"normals":[32,32,32]},{"vertices":[16,20,32],"normals":[32,32,32]},{"vertices":[26,28,32],"normals":[32,32,32]},{"vertices":[32,12,16],"normals":[32,32,32]}]},{"name":"Plane","vertices":[{"x":7.952124,"y":-0.000001,"z":7.952124},{"x":-7.952124,"y":0.000001,"z":-7.952124},{"x":-7.952124,"y":-0.000001,"z":7.952124},{"x":7.952124,"y":0.000001,"z":-7.952124}],"normals":[{"x":0,"y":1,"z":0}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[0,3,1],"normals":[0,0,0]}]},{"name":"Torus","vertices":[{"x":6.721327,"y":0.799767,"z":6.263827},{"x":6.677426,"y":0.924767,"z":6.105041},{"x":6.687834,"y":0.924767,"z":6.263827},{"x":6.586703,"y":1.016274,"z":6.116985},{"x":6.596327,"y":1.016274,"z":6.263827},{"x":6.471327,"y":1.049767,"z":6.263827},{"x":6.462772,"y":1.049767,"z":6.133301},{"x":6.346327,"y":1.016274,"z":6.263827},{"x":6.248118,"y":0.924767,"z":6.161561},{"x":6.254821,"y":0.924767,"z":6.263827},{"x":6.221327,"y":0.799767,"z":6.263827},{"x":6.248118,"y":0.674767,"z":6.161561},{"x":6.254821,"y":0.674767,"z":6.263827},{"x":6.346327,"y":0.583261,"z":6.263827},{"x":6.462772,"y":0.549767,"z":6.133301},{"x":6.471327,"y":0.549767,"z":6.263827},{"x":6.586703,"y":0.583261,"z":6.116985},{"x":6.596327,"y":0.583261,"z":6.263827},{"x":6.687834,"y":0.674767,"z":6.263827},{"x":6.677426,"y":0.674767,"z":6.105041},{"x":6.678735,"y":0.799767,"z":5.940303},{"x":6.710633,"y":0.799767,"z":6.100669},{"x":6.557994,"y":1.016274,"z":5.972655},{"x":6.437253,"y":1.049767,"z":6.005008},{"x":6.338841,"y":1.016274,"z":6.149616},{"x":6.228124,"y":0.924767,"z":6.061044},{"x":6.195772,"y":0.799767,"z":6.069713},{"x":6.214911,"y":0.799767,"z":6.165932},{"x":6.228124,"y":0.674767,"z":6.061044},{"x":6.338841,"y":0.583261,"z":6.149616},{"x":6.437253,"y":0.549767,"z":6.005008},{"x":6.646382,"y":0.674767,"z":5.948972},{"x":6.626177,"y":0.799767,"z":5.785473},{"x":6.646382,"y":0.924767,"z":5.948972},{"x":6.595233,"y":0.924767,"z":5.79829},{"x":6.395207,"y":1.049767,"z":5.881144},{"x":6.279722,"y":1.016274,"z":5.928979},{"x":6.316513,"y":1.016274,"z":6.03736},{"x":6.164237,"y":0.799767,"z":5.976814},{"x":6.279722,"y":0.583261,"z":5.928979},{"x":6.316513,"y":0.583261,"z":6.03736},{"x":6.395207,"y":0.549767,"z":5.881144},{"x":6.557994,"y":0.583261,"z":5.972655},{"x":6.595233,"y":0.674767,"z":5.79829},{"x":6.524853,"y":0.924767,"z":5.655573},{"x":6.445606,"y":1.016274,"z":5.701327},{"x":6.510692,"y":1.016274,"z":5.833308},{"x":6.337353,"y":1.049767,"z":5.763827},{"x":6.149853,"y":0.924767,"z":5.87208},{"x":6.195181,"y":0.924767,"z":5.963997},{"x":6.120846,"y":0.799767,"z":5.888827},{"x":6.195181,"y":0.674767,"z":5.963997},{"x":6.149853,"y":0.674767,"z":5.87208},{"x":6.337353,"y":0.549767,"z":5.763827},{"x":6.510692,"y":0.583261,"z":5.833308},{"x":6.445606,"y":0.583261,"z":5.701327},{"x":6.553859,"y":0.799767,"z":5.638827},{"x":6.463019,"y":0.799767,"z":5.502875},{"x":6.436447,"y":0.924767,"z":5.523265},{"x":6.264681,"y":1.049767,"z":5.655066},{"x":6.229099,"y":1.016274,"z":5.826327},{"x":6.092915,"y":0.924767,"z":5.786866},{"x":6.092915,"y":0.674767,"z":5.786866},{"x":6.165512,"y":0.583261,"z":5.731161},{"x":6.229099,"y":0.583261,"z":5.826327},{"x":6.264681,"y":0.549767,"z":5.655066},{"x":6.36385,"y":0.583261,"z":5.57897},{"x":6.524853,"y":0.674767,"z":5.655573},{"x":6.331527,"y":0.924767,"z":5.403627},{"x":6.36385,"y":1.016274,"z":5.57897},{"x":6.266822,"y":1.016274,"z":5.468332},{"x":6.178434,"y":1.049767,"z":5.55672},{"x":6.165512,"y":1.016274,"z":5.731161},{"x":6.025341,"y":0.924767,"z":5.709813},{"x":6.066342,"y":0.799767,"z":5.807256},{"x":6.001657,"y":0.799767,"z":5.733497},{"x":6.025341,"y":0.674767,"z":5.709813},{"x":6.178434,"y":0.549767,"z":5.55672},{"x":6.331527,"y":0.674767,"z":5.403627},{"x":6.436447,"y":0.674767,"z":5.523265},{"x":6.355211,"y":0.799767,"z":5.379943},{"x":6.21189,"y":0.924767,"z":5.298707},{"x":6.156184,"y":1.016274,"z":5.371305},{"x":6.003994,"y":1.016274,"z":5.569643},{"x":6.090046,"y":1.016274,"z":5.645108},{"x":5.927898,"y":0.799767,"z":5.668812},{"x":6.003994,"y":0.583261,"z":5.569643},{"x":6.090046,"y":0.583261,"z":5.645108},{"x":6.080089,"y":0.549767,"z":5.470474},{"x":6.156184,"y":0.583261,"z":5.371305},{"x":6.266822,"y":0.583261,"z":5.468332},{"x":6.21189,"y":0.674767,"z":5.298707},{"x":6.096327,"y":0.799767,"z":5.181295},{"x":6.232279,"y":0.799767,"z":5.272135},{"x":6.07958,"y":0.924767,"z":5.210301},{"x":6.033827,"y":1.016274,"z":5.289548},{"x":6.080089,"y":1.049767,"z":5.470474},{"x":5.908827,"y":1.016274,"z":5.506054},{"x":5.863074,"y":0.924767,"z":5.585301},{"x":5.948288,"y":0.924767,"z":5.64224},{"x":5.863074,"y":0.674767,"z":5.585301},{"x":5.948288,"y":0.674767,"z":5.64224},{"x":5.908827,"y":0.583261,"z":5.506054},{"x":6.033827,"y":0.583261,"z":5.289548},{"x":6.07958,"y":0.674767,"z":5.210301},{"x":5.936864,"y":0.924767,"z":5.139922},{"x":5.901846,"y":1.016274,"z":5.224463},{"x":5.971327,"y":1.049767,"z":5.397801},{"x":5.854011,"y":1.049767,"z":5.339947},{"x":5.771158,"y":0.924767,"z":5.539973},{"x":5.846327,"y":0.799767,"z":5.614308},{"x":5.771158,"y":0.674767,"z":5.539973},{"x":5.806176,"y":0.583261,"z":5.455432},{"x":5.971327,"y":0.549767,"z":5.397801},{"x":5.901846,"y":0.583261,"z":5.224463},{"x":5.949682,"y":0.799767,"z":5.108977},{"x":5.794851,"y":0.799767,"z":5.056419},{"x":5.762499,"y":1.016274,"z":5.17716},{"x":5.697794,"y":1.016274,"z":5.418642},{"x":5.806176,"y":1.016274,"z":5.455432},{"x":5.67411,"y":0.924767,"z":5.50703},{"x":5.75834,"y":0.799767,"z":5.570917},{"x":5.67411,"y":0.674767,"z":5.50703},{"x":5.697794,"y":0.583261,"z":5.418642},{"x":5.854011,"y":0.549767,"z":5.339947},{"x":5.730146,"y":0.549767,"z":5.297901},{"x":5.762499,"y":0.583261,"z":5.17716},{"x":5.936864,"y":0.674767,"z":5.139922},{"x":5.630113,"y":0.924767,"z":5.057728},{"x":5.786182,"y":0.924767,"z":5.088772},{"x":5.601853,"y":1.049767,"z":5.272382},{"x":5.730146,"y":1.049767,"z":5.297901},{"x":5.573594,"y":0.924767,"z":5.487036},{"x":5.665442,"y":0.799767,"z":5.539382},{"x":5.569222,"y":0.799767,"z":5.520243},{"x":5.585537,"y":0.583261,"z":5.396313},{"x":5.601853,"y":0.549767,"z":5.272382},{"x":5.618169,"y":0.583261,"z":5.148451},{"x":5.786182,"y":0.674767,"z":5.088772},{"x":5.630113,"y":0.674767,"z":5.057728},{"x":5.471327,"y":0.799767,"z":5.013827},{"x":5.634485,"y":0.799767,"z":5.024521},{"x":5.471327,"y":0.924767,"z":5.04732},{"x":5.618169,"y":1.016274,"z":5.148451},{"x":5.471327,"y":1.049767,"z":5.263827},{"x":5.585537,"y":1.016274,"z":5.396313},{"x":5.471327,"y":0.924767,"z":5.480333},{"x":5.471327,"y":0.799767,"z":5.513827},{"x":5.573594,"y":0.674767,"z":5.487036},{"x":5.471327,"y":0.674767,"z":5.480333},{"x":5.471327,"y":0.549767,"z":5.263827},{"x":5.471327,"y":0.674767,"z":5.04732},{"x":5.308169,"y":0.799767,"z":5.024521},{"x":5.324485,"y":1.016274,"z":5.148451},{"x":5.471327,"y":1.016274,"z":5.138827},{"x":5.357117,"y":1.016274,"z":5.396313},{"x":5.471327,"y":1.016274,"z":5.388827},{"x":5.369061,"y":0.924767,"z":5.487036},{"x":5.373433,"y":0.799767,"z":5.520243},{"x":5.369061,"y":0.674767,"z":5.487036},{"x":5.471327,"y":0.583261,"z":5.388827},{"x":5.340801,"y":0.549767,"z":5.272382},{"x":5.324485,"y":0.583261,"z":5.148451},{"x":5.471327,"y":0.583261,"z":5.138827},{"x":5.312541,"y":0.674767,"z":5.057728},{"x":5.156472,"y":0.924767,"z":5.088772},{"x":5.312541,"y":0.924767,"z":5.057728},{"x":5.180156,"y":1.016274,"z":5.17716},{"x":5.340801,"y":1.049767,"z":5.272382},{"x":5.212508,"y":1.049767,"z":5.297901},{"x":5.268544,"y":0.924767,"z":5.50703},{"x":5.277213,"y":0.799767,"z":5.539382},{"x":5.268544,"y":0.674767,"z":5.50703},{"x":5.357117,"y":0.583261,"z":5.396313},{"x":5.244861,"y":0.583261,"z":5.418642},{"x":5.180156,"y":0.583261,"z":5.17716},{"x":5.147804,"y":0.799767,"z":5.056419},{"x":4.992973,"y":0.799767,"z":5.108977},{"x":5.040808,"y":1.016274,"z":5.224463},{"x":5.088644,"y":1.049767,"z":5.339947},{"x":5.244861,"y":1.016274,"z":5.418642},{"x":5.136479,"y":1.016274,"z":5.455432},{"x":5.184315,"y":0.799767,"z":5.570917},{"x":5.171497,"y":0.674767,"z":5.539973},{"x":5.136479,"y":0.583261,"z":5.455432},{"x":5.088644,"y":0.549767,"z":5.339947},{"x":5.212508,"y":0.549767,"z":5.297901},{"x":5.040808,"y":0.583261,"z":5.224463},{"x":5.00579,"y":0.674767,"z":5.139922},{"x":5.156472,"y":0.674767,"z":5.088772},{"x":4.863074,"y":0.924767,"z":5.210301},{"x":5.00579,"y":0.924767,"z":5.139922},{"x":4.908827,"y":1.016274,"z":5.289548},{"x":5.033827,"y":1.016274,"z":5.506054},{"x":5.079581,"y":0.924767,"z":5.585301},{"x":5.171497,"y":0.924767,"z":5.539973},{"x":5.079581,"y":0.674767,"z":5.585301},{"x":5.033827,"y":0.583261,"z":5.506054},{"x":4.908827,"y":0.583261,"z":5.289548},{"x":4.863074,"y":0.674767,"z":5.210301},{"x":4.846327,"y":0.799767,"z":5.181295},{"x":4.730765,"y":0.924767,"z":5.298707},{"x":4.786471,"y":1.016274,"z":5.371305},{"x":4.971327,"y":1.049767,"z":5.397801},{"x":4.862566,"y":1.049767,"z":5.470473},{"x":4.938661,"y":1.016274,"z":5.569643},{"x":4.994367,"y":0.924767,"z":5.64224},{"x":5.096327,"y":0.799767,"z":5.614308},{"x":4.994367,"y":0.674767,"z":5.64224},{"x":4.938661,"y":0.583261,"z":5.569643},{"x":4.862566,"y":0.549767,"z":5.470473},{"x":4.971327,"y":0.549767,"z":5.397801},{"x":4.786471,"y":0.583261,"z":5.371305},{"x":4.730765,"y":0.674767,"z":5.298707},{"x":4.710376,"y":0.799767,"z":5.272135},{"x":4.611127,"y":0.924767,"z":5.403627},{"x":4.76422,"y":1.049767,"z":5.55672},{"x":4.852609,"y":1.016274,"z":5.645109},{"x":4.940997,"y":0.799767,"z":5.733497},{"x":5.014756,"y":0.799767,"z":5.668812},{"x":4.917314,"y":0.674767,"z":5.709813},{"x":4.76422,"y":0.549767,"z":5.55672},{"x":4.675832,"y":0.583261,"z":5.468332},{"x":4.587443,"y":0.799767,"z":5.379944},{"x":4.506208,"y":0.924767,"z":5.523265},{"x":4.578805,"y":1.016274,"z":5.57897},{"x":4.675832,"y":1.016274,"z":5.468332},{"x":4.677974,"y":1.049767,"z":5.655066},{"x":4.84974,"y":0.924767,"z":5.786866},{"x":4.917314,"y":0.924767,"z":5.709813},{"x":4.876312,"y":0.799767,"z":5.807256},{"x":4.84974,"y":0.674767,"z":5.786866},{"x":4.852609,"y":0.583261,"z":5.645109},{"x":4.677974,"y":0.549767,"z":5.655066},{"x":4.578805,"y":0.583261,"z":5.57897},{"x":4.611127,"y":0.674767,"z":5.403627},{"x":4.506208,"y":0.674767,"z":5.523265},{"x":4.388796,"y":0.799767,"z":5.638826},{"x":4.479636,"y":0.799767,"z":5.502875},{"x":4.497049,"y":1.016274,"z":5.701326},{"x":4.605302,"y":1.049767,"z":5.763826},{"x":4.713555,"y":1.016274,"z":5.826327},{"x":4.777143,"y":1.016274,"z":5.731161},{"x":4.792802,"y":0.924767,"z":5.87208},{"x":4.821808,"y":0.799767,"z":5.888827},{"x":4.792802,"y":0.674767,"z":5.87208},{"x":4.777143,"y":0.583261,"z":5.731161},{"x":4.605302,"y":0.549767,"z":5.763826},{"x":4.497049,"y":0.583261,"z":5.701326},{"x":4.347422,"y":0.924767,"z":5.79829},{"x":4.417802,"y":0.924767,"z":5.655573},{"x":4.431963,"y":1.016274,"z":5.833308},{"x":4.547448,"y":1.049767,"z":5.881144},{"x":4.662933,"y":1.016274,"z":5.928979},{"x":4.747474,"y":0.924767,"z":5.963997},{"x":4.747474,"y":0.674767,"z":5.963997},{"x":4.662933,"y":0.583261,"z":5.928979},{"x":4.713555,"y":0.583261,"z":5.826327},{"x":4.547448,"y":0.549767,"z":5.881144},{"x":4.431963,"y":0.583261,"z":5.833308},{"x":4.417802,"y":0.674767,"z":5.655573},{"x":4.316478,"y":0.799767,"z":5.785472},{"x":4.296272,"y":0.924767,"z":5.948972},{"x":4.505402,"y":1.049767,"z":6.005008},{"x":4.71453,"y":0.924767,"z":6.061044},{"x":4.746883,"y":0.799767,"z":6.069713},{"x":4.778418,"y":0.799767,"z":5.976814},{"x":4.71453,"y":0.674767,"z":6.061044},{"x":4.626142,"y":0.583261,"z":6.03736},{"x":4.505402,"y":0.549767,"z":6.005008},{"x":4.296272,"y":0.674767,"z":5.948972},{"x":4.347422,"y":0.674767,"z":5.79829},{"x":4.26392,"y":0.799767,"z":5.940303},{"x":4.265228,"y":0.924767,"z":6.105041},{"x":4.384661,"y":1.016274,"z":5.972656},{"x":4.479882,"y":1.049767,"z":6.1333},{"x":4.626142,"y":1.016274,"z":6.03736},{"x":4.603813,"y":1.016274,"z":6.149616},{"x":4.727744,"y":0.799767,"z":6.165932},{"x":4.694537,"y":0.674767,"z":6.161561},{"x":4.603813,"y":0.583261,"z":6.149616},{"x":4.479882,"y":0.549767,"z":6.1333},{"x":4.384661,"y":0.583261,"z":5.972656},{"x":4.265228,"y":0.674767,"z":6.105041},{"x":4.232021,"y":0.799767,"z":6.100669},{"x":4.254821,"y":0.924767,"z":6.263827},{"x":4.346327,"y":1.016274,"z":6.263827},{"x":4.355952,"y":1.016274,"z":6.116985},{"x":4.471327,"y":1.049767,"z":6.263827},{"x":4.596327,"y":1.016274,"z":6.263827},{"x":4.687834,"y":0.924767,"z":6.263827},{"x":4.694537,"y":0.924767,"z":6.161561},{"x":4.721327,"y":0.799767,"z":6.263827},{"x":4.596327,"y":0.583261,"z":6.263827},{"x":4.471327,"y":0.549767,"z":6.263827},{"x":4.355952,"y":0.583261,"z":6.116985},{"x":4.254821,"y":0.674767,"z":6.263827},{"x":4.232021,"y":0.799767,"z":6.426985},{"x":4.221327,"y":0.799767,"z":6.263827},{"x":4.265228,"y":0.924767,"z":6.422613},{"x":4.355952,"y":1.016274,"z":6.410669},{"x":4.603813,"y":1.016274,"z":6.378037},{"x":4.694537,"y":0.924767,"z":6.366093},{"x":4.694537,"y":0.674767,"z":6.366093},{"x":4.687834,"y":0.674767,"z":6.263827},{"x":4.603813,"y":0.583261,"z":6.378037},{"x":4.355952,"y":0.583261,"z":6.410669},{"x":4.346327,"y":0.583261,"z":6.263827},{"x":4.296272,"y":0.924767,"z":6.578682},{"x":4.384661,"y":1.016274,"z":6.554998},{"x":4.479882,"y":1.049767,"z":6.394353},{"x":4.505402,"y":1.049767,"z":6.522646},{"x":4.71453,"y":0.924767,"z":6.46661},{"x":4.727744,"y":0.799767,"z":6.361722},{"x":4.746883,"y":0.799767,"z":6.457941},{"x":4.71453,"y":0.674767,"z":6.46661},{"x":4.626142,"y":0.583261,"z":6.490294},{"x":4.479882,"y":0.549767,"z":6.394353},{"x":4.384661,"y":0.583261,"z":6.554998},{"x":4.265228,"y":0.674767,"z":6.422613},{"x":4.296272,"y":0.674767,"z":6.578682},{"x":4.316478,"y":0.799767,"z":6.742181},{"x":4.26392,"y":0.799767,"z":6.58735},{"x":4.431962,"y":1.016274,"z":6.694345},{"x":4.662932,"y":1.016274,"z":6.598675},{"x":4.626142,"y":1.016274,"z":6.490294},{"x":4.747474,"y":0.924767,"z":6.563657},{"x":4.747474,"y":0.674767,"z":6.563657},{"x":4.662932,"y":0.583261,"z":6.598675},{"x":4.505402,"y":0.549767,"z":6.522646},{"x":4.431962,"y":0.583261,"z":6.694345},{"x":4.388795,"y":0.799767,"z":6.888826},{"x":4.347422,"y":0.924767,"z":6.729363},{"x":4.417802,"y":0.924767,"z":6.87208},{"x":4.497048,"y":1.016274,"z":6.826327},{"x":4.547448,"y":1.049767,"z":6.64651},{"x":4.605302,"y":1.049767,"z":6.763827},{"x":4.792802,"y":0.924767,"z":6.655573},{"x":4.821808,"y":0.799767,"z":6.638827},{"x":4.778418,"y":0.799767,"z":6.550839},{"x":4.792802,"y":0.674767,"z":6.655573},{"x":4.713555,"y":0.583261,"z":6.701327},{"x":4.547448,"y":0.549767,"z":6.64651},{"x":4.605302,"y":0.549767,"z":6.763827},{"x":4.417802,"y":0.674767,"z":6.87208},{"x":4.347422,"y":0.674767,"z":6.729363},{"x":4.479636,"y":0.799767,"z":7.024778},{"x":4.506208,"y":0.924767,"z":7.004389},{"x":4.578805,"y":1.016274,"z":6.948683},{"x":4.677974,"y":1.049767,"z":6.872588},{"x":4.713555,"y":1.016274,"z":6.701327},{"x":4.84974,"y":0.924767,"z":6.740788},{"x":4.84974,"y":0.674767,"z":6.740788},{"x":4.777143,"y":0.583261,"z":6.796493},{"x":4.578805,"y":0.583261,"z":6.948683},{"x":4.497048,"y":0.583261,"z":6.826327},{"x":4.506208,"y":0.674767,"z":7.004389},{"x":4.587443,"y":0.799767,"z":7.14771},{"x":4.611127,"y":0.924767,"z":7.124026},{"x":4.76422,"y":1.049767,"z":6.970933},{"x":4.777143,"y":1.016274,"z":6.796493},{"x":4.852609,"y":1.016274,"z":6.882545},{"x":4.917314,"y":0.924767,"z":6.817841},{"x":4.876312,"y":0.799767,"z":6.720398},{"x":4.917314,"y":0.674767,"z":6.817841},{"x":4.852609,"y":0.583261,"z":6.882545},{"x":4.76422,"y":0.549767,"z":6.970933},{"x":4.677974,"y":0.549767,"z":6.872588},{"x":4.675832,"y":0.583261,"z":7.059322},{"x":4.710375,"y":0.799767,"z":7.255518},{"x":4.730764,"y":0.924767,"z":7.228946},{"x":4.675832,"y":1.016274,"z":7.059322},{"x":4.78647,"y":1.016274,"z":7.156349},{"x":4.938661,"y":1.016274,"z":6.958011},{"x":5.014756,"y":0.799767,"z":6.858841},{"x":4.940997,"y":0.799767,"z":6.794157},{"x":4.994366,"y":0.674767,"z":6.885414},{"x":4.938661,"y":0.583261,"z":6.958011},{"x":4.78647,"y":0.583261,"z":7.156349},{"x":4.730764,"y":0.674767,"z":7.228946},{"x":4.611127,"y":0.674767,"z":7.124026},{"x":4.863074,"y":0.924767,"z":7.317352},{"x":4.971327,"y":1.049767,"z":7.129852},{"x":4.862566,"y":1.049767,"z":7.05718},{"x":5.033827,"y":1.016274,"z":7.021599},{"x":4.994366,"y":0.924767,"z":6.885414},{"x":5.079581,"y":0.924767,"z":6.942352},{"x":5.096327,"y":0.799767,"z":6.913346},{"x":5.033827,"y":0.583261,"z":7.021599},{"x":4.862566,"y":0.549767,"z":7.05718},{"x":4.971327,"y":0.549767,"z":7.129852},{"x":4.908827,"y":0.583261,"z":7.238106},{"x":4.863074,"y":0.674767,"z":7.317352},{"x":4.992973,"y":0.799767,"z":7.418676},{"x":4.846327,"y":0.799767,"z":7.346359},{"x":5.00579,"y":0.924767,"z":7.387732},{"x":4.908827,"y":1.016274,"z":7.238106},{"x":5.040808,"y":1.016274,"z":7.303191},{"x":5.136479,"y":1.016274,"z":7.072221},{"x":5.184315,"y":0.799767,"z":6.956737},{"x":5.079581,"y":0.674767,"z":6.942352},{"x":5.136479,"y":0.583261,"z":7.072221},{"x":5.040808,"y":0.583261,"z":7.303191},{"x":5.00579,"y":0.674767,"z":7.387732},{"x":5.147803,"y":0.799767,"z":7.471234},{"x":5.156472,"y":0.924767,"z":7.438882},{"x":5.212508,"y":1.049767,"z":7.229753},{"x":5.088644,"y":1.049767,"z":7.187706},{"x":5.268544,"y":0.924767,"z":7.020624},{"x":5.171497,"y":0.924767,"z":6.98768},{"x":5.277213,"y":0.799767,"z":6.988271},{"x":5.268544,"y":0.674767,"z":7.020624},{"x":5.171497,"y":0.674767,"z":6.98768},{"x":5.24486,"y":0.583261,"z":7.109012},{"x":5.088644,"y":0.549767,"z":7.187706},{"x":5.180156,"y":0.583261,"z":7.350493},{"x":5.156472,"y":0.674767,"z":7.438882},{"x":5.312541,"y":0.924767,"z":7.469926},{"x":5.180156,"y":1.016274,"z":7.350493},{"x":5.3408,"y":1.049767,"z":7.255271},{"x":5.357116,"y":1.016274,"z":7.131341},{"x":5.24486,"y":1.016274,"z":7.109012},{"x":5.369061,"y":0.924767,"z":7.040617},{"x":5.369061,"y":0.674767,"z":7.040617},{"x":5.357116,"y":0.583261,"z":7.131341},{"x":5.3408,"y":0.549767,"z":7.255271},{"x":5.212508,"y":0.549767,"z":7.229753},{"x":5.324485,"y":0.583261,"z":7.379202},{"x":5.312541,"y":0.674767,"z":7.469926},{"x":5.308169,"y":0.799767,"z":7.503133},{"x":5.471327,"y":0.924767,"z":7.480333},{"x":5.324485,"y":1.016274,"z":7.379202},{"x":5.471327,"y":1.049767,"z":7.263827},{"x":5.471327,"y":0.924767,"z":7.04732},{"x":5.373432,"y":0.799767,"z":7.007411},{"x":5.471327,"y":0.799767,"z":7.013827},{"x":5.471327,"y":0.674767,"z":7.04732},{"x":5.471327,"y":0.583261,"z":7.138827},{"x":5.471327,"y":0.583261,"z":7.388827},{"x":5.471327,"y":0.799767,"z":7.513827},{"x":5.630113,"y":0.924767,"z":7.469926},{"x":5.471327,"y":1.016274,"z":7.388827},{"x":5.618169,"y":1.016274,"z":7.379202},{"x":5.585537,"y":1.016274,"z":7.131341},{"x":5.471327,"y":1.016274,"z":7.138827},{"x":5.573594,"y":0.924767,"z":7.040617},{"x":5.569222,"y":0.799767,"z":7.007411},{"x":5.585537,"y":0.583261,"z":7.131341},{"x":5.471327,"y":0.549767,"z":7.263827},{"x":5.618169,"y":0.583261,"z":7.379202},{"x":5.471327,"y":0.674767,"z":7.480333},{"x":5.630113,"y":0.674767,"z":7.469926},{"x":5.79485,"y":0.799767,"z":7.471234},{"x":5.634485,"y":0.799767,"z":7.503133},{"x":5.762498,"y":1.016274,"z":7.350493},{"x":5.601853,"y":1.049767,"z":7.255272},{"x":5.697793,"y":1.016274,"z":7.109012},{"x":5.67411,"y":0.924767,"z":7.020624},{"x":5.665441,"y":0.799767,"z":6.988271},{"x":5.573594,"y":0.674767,"z":7.040617},{"x":5.697793,"y":0.583261,"z":7.109012},{"x":5.601853,"y":0.549767,"z":7.255272},{"x":5.762498,"y":0.583261,"z":7.350493},{"x":5.786182,"y":0.674767,"z":7.438882},{"x":5.949682,"y":0.799767,"z":7.418676},{"x":5.786182,"y":0.924767,"z":7.438882},{"x":5.936864,"y":0.924767,"z":7.387732},{"x":5.854011,"y":1.049767,"z":7.187706},{"x":5.730146,"y":1.049767,"z":7.229753},{"x":5.771158,"y":0.924767,"z":6.98768},{"x":5.75834,"y":0.799767,"z":6.956737},{"x":5.67411,"y":0.674767,"z":7.020624},{"x":5.771158,"y":0.674767,"z":6.98768},{"x":5.854011,"y":0.549767,"z":7.187706},{"x":5.730146,"y":0.549767,"z":7.229753},{"x":5.936864,"y":0.674767,"z":7.387732},{"x":6.096327,"y":0.799767,"z":7.346359},{"x":6.07958,"y":0.924767,"z":7.317352},{"x":5.901846,"y":1.016274,"z":7.303191},{"x":5.971327,"y":1.049767,"z":7.129852},{"x":5.806176,"y":1.016274,"z":7.072221},{"x":5.908827,"y":1.016274,"z":7.021599},{"x":5.846327,"y":0.799767,"z":6.913346},{"x":5.908827,"y":0.583261,"z":7.021599},{"x":5.806176,"y":0.583261,"z":7.072221},{"x":5.971327,"y":0.549767,"z":7.129852},{"x":5.901846,"y":0.583261,"z":7.303191},{"x":6.07958,"y":0.674767,"z":7.317352},{"x":6.232279,"y":0.799767,"z":7.255519},{"x":6.211889,"y":0.924767,"z":7.228947},{"x":6.033827,"y":1.016274,"z":7.238105},{"x":6.080089,"y":1.049767,"z":7.05718},{"x":6.003994,"y":1.016274,"z":6.958011},{"x":5.863074,"y":0.924767,"z":6.942352},{"x":5.948288,"y":0.924767,"z":6.885414},{"x":5.948288,"y":0.674767,"z":6.885414},{"x":5.863074,"y":0.674767,"z":6.942352},{"x":6.003994,"y":0.583261,"z":6.958011},{"x":6.080089,"y":0.549767,"z":7.05718},{"x":6.156184,"y":0.583261,"z":7.15635},{"x":6.033827,"y":0.583261,"z":7.238105},{"x":6.211889,"y":0.674767,"z":7.228947},{"x":6.35521,"y":0.799767,"z":7.147711},{"x":6.266822,"y":1.016274,"z":7.059322},{"x":6.156184,"y":1.016274,"z":7.15635},{"x":6.090045,"y":1.016274,"z":6.882545},{"x":6.025341,"y":0.924767,"z":6.817841},{"x":5.927898,"y":0.799767,"z":6.858842},{"x":6.025341,"y":0.674767,"z":6.817841},{"x":6.090045,"y":0.583261,"z":6.882545},{"x":6.178434,"y":0.549767,"z":6.970934},{"x":6.266822,"y":0.583261,"z":7.059322},{"x":6.331527,"y":0.674767,"z":7.124027},{"x":6.436447,"y":0.924767,"z":7.004389},{"x":6.331527,"y":0.924767,"z":7.124027},{"x":6.264681,"y":1.049767,"z":6.872588},{"x":6.178434,"y":1.049767,"z":6.970934},{"x":6.165512,"y":1.016274,"z":6.796493},{"x":6.066342,"y":0.799767,"z":6.720398},{"x":6.001657,"y":0.799767,"z":6.794157},{"x":6.092915,"y":0.674767,"z":6.740788},{"x":6.165512,"y":0.583261,"z":6.796493},{"x":6.36385,"y":0.583261,"z":6.948683},{"x":6.436447,"y":0.674767,"z":7.004389},{"x":6.463019,"y":0.799767,"z":7.024778},{"x":6.524853,"y":0.924767,"z":6.87208},{"x":6.445606,"y":1.016274,"z":6.826327},{"x":6.36385,"y":1.016274,"z":6.948683},{"x":6.229099,"y":1.016274,"z":6.701327},{"x":6.092915,"y":0.924767,"z":6.740788},{"x":6.149853,"y":0.924767,"z":6.655574},{"x":6.120846,"y":0.799767,"z":6.638827},{"x":6.149853,"y":0.674767,"z":6.655574},{"x":6.229099,"y":0.583261,"z":6.701327},{"x":6.264681,"y":0.549767,"z":6.872588},{"x":6.445606,"y":0.583261,"z":6.826327},{"x":6.524853,"y":0.674767,"z":6.87208},{"x":6.553859,"y":0.799767,"z":6.888827},{"x":6.595232,"y":0.924767,"z":6.729364},{"x":6.510692,"y":1.016274,"z":6.694346},{"x":6.337353,"y":1.049767,"z":6.763827},{"x":6.279722,"y":1.016274,"z":6.598675},{"x":6.195181,"y":0.924767,"z":6.563657},{"x":6.195181,"y":0.674767,"z":6.563657},{"x":6.279722,"y":0.583261,"z":6.598675},{"x":6.337353,"y":0.549767,"z":6.763827},{"x":6.510692,"y":0.583261,"z":6.694346},{"x":6.595232,"y":0.674767,"z":6.729364},{"x":6.678735,"y":0.799767,"z":6.58735},{"x":6.626177,"y":0.799767,"z":6.742182},{"x":6.557994,"y":1.016274,"z":6.554998},{"x":6.437253,"y":1.049767,"z":6.522645},{"x":6.395206,"y":1.049767,"z":6.646511},{"x":6.316513,"y":1.016274,"z":6.490294},{"x":6.228124,"y":0.924767,"z":6.46661},{"x":6.195772,"y":0.799767,"z":6.457941},{"x":6.164237,"y":0.799767,"z":6.55084},{"x":6.228124,"y":0.674767,"z":6.46661},{"x":6.316513,"y":0.583261,"z":6.490294},{"x":6.395206,"y":0.549767,"z":6.646511},{"x":6.437253,"y":0.549767,"z":6.522645},{"x":6.646382,"y":0.674767,"z":6.578681},{"x":6.677426,"y":0.924767,"z":6.422613},{"x":6.646382,"y":0.924767,"z":6.578681},{"x":6.586703,"y":1.016274,"z":6.410669},{"x":6.462772,"y":1.049767,"z":6.394353},{"x":6.338841,"y":1.016274,"z":6.378037},{"x":6.248118,"y":0.924767,"z":6.366093},{"x":6.248118,"y":0.674767,"z":6.366093},{"x":6.338841,"y":0.583261,"z":6.378037},{"x":6.462772,"y":0.549767,"z":6.394353},{"x":6.557994,"y":0.583261,"z":6.554998},{"x":6.586703,"y":0.583261,"z":6.410669},{"x":6.677426,"y":0.674767,"z":6.422613},{"x":6.710633,"y":0.799767,"z":6.426985},{"x":6.214911,"y":0.799767,"z":6.361722}],"normals":[{"x":0.964,"y":0.2583,"z":-0.0632},{"x":0.7064,"y":0.7063,"z":-0.0463},{"x":0.7063,"y":0.7064,"z":-0.0463},{"x":0.2588,"y":0.9658,"z":-0.017},{"x":-0.2588,"y":0.9658,"z":0.017},{"x":-0.7064,"y":0.7063,"z":0.0463},{"x":-0.964,"y":0.2583,"z":0.0632},{"x":-0.964,"y":-0.2583,"z":0.0632},{"x":-0.7064,"y":-0.7063,"z":0.0463},{"x":-0.7063,"y":-0.7063,"z":0.0463},{"x":-0.2588,"y":-0.9658,"z":0.017},{"x":0.2588,"y":-0.9658,"z":-0.017},{"x":0.7063,"y":-0.7063,"z":-0.0463},{"x":0.7063,"y":-0.7064,"z":-0.0463},{"x":0.964,"y":-0.2583,"z":-0.0632},{"x":0.9475,"y":0.2583,"z":-0.1885},{"x":0.6943,"y":0.7063,"z":-0.1381},{"x":0.2543,"y":0.9658,"z":-0.0506},{"x":-0.2543,"y":0.9658,"z":0.0506},{"x":-0.2544,"y":0.9658,"z":0.0506},{"x":-0.6943,"y":0.7063,"z":0.1381},{"x":-0.6943,"y":0.7064,"z":0.1381},{"x":-0.9475,"y":0.2583,"z":0.1885},{"x":-0.9475,"y":-0.2583,"z":0.1885},{"x":-0.6943,"y":-0.7064,"z":0.1381},{"x":-0.6943,"y":-0.7063,"z":0.1381},{"x":-0.2544,"y":-0.9658,"z":0.0506},{"x":0.2544,"y":-0.9658,"z":-0.0506},{"x":0.6943,"y":-0.7063,"z":-0.1381},{"x":0.6943,"y":-0.7064,"z":-0.1381},{"x":0.9475,"y":-0.2583,"z":-0.1885},{"x":0.9148,"y":0.2583,"z":-0.3105},{"x":0.6703,"y":0.7063,"z":-0.2275},{"x":0.2456,"y":0.9658,"z":-0.0834},{"x":-0.2456,"y":0.9658,"z":0.0834},{"x":-0.6703,"y":0.7063,"z":0.2275},{"x":-0.9148,"y":0.2583,"z":0.3105},{"x":-0.9148,"y":-0.2583,"z":0.3105},{"x":-0.6703,"y":-0.7064,"z":0.2275},{"x":-0.2456,"y":-0.9658,"z":0.0834},{"x":0.2456,"y":-0.9658,"z":-0.0834},{"x":0.6703,"y":-0.7064,"z":-0.2275},{"x":0.6703,"y":-0.7063,"z":-0.2275},{"x":0.9148,"y":-0.2583,"z":-0.3105},{"x":0.8664,"y":0.2583,"z":-0.4273},{"x":0.6349,"y":0.7063,"z":-0.3131},{"x":0.2326,"y":0.9658,"z":-0.1147},{"x":-0.2326,"y":0.9658,"z":0.1147},{"x":-0.6349,"y":0.7063,"z":0.3131},{"x":-0.6349,"y":0.7064,"z":0.3131},{"x":-0.8664,"y":0.2583,"z":0.4273},{"x":-0.8664,"y":-0.2583,"z":0.4273},{"x":-0.6349,"y":-0.7063,"z":0.3131},{"x":-0.6349,"y":-0.7064,"z":0.3131},{"x":-0.2326,"y":-0.9658,"z":0.1147},{"x":0.2326,"y":-0.9658,"z":-0.1147},{"x":0.6349,"y":-0.7064,"z":-0.3131},{"x":0.8664,"y":-0.2583,"z":-0.4273},{"x":0.8033,"y":0.2583,"z":-0.5367},{"x":0.5886,"y":0.7063,"z":-0.3933},{"x":0.2156,"y":0.9658,"z":-0.1441},{"x":-0.2156,"y":0.9658,"z":0.1441},{"x":-0.5886,"y":0.7063,"z":0.3933},{"x":-0.8032,"y":0.2583,"z":0.5367},{"x":-0.8033,"y":0.2583,"z":0.5367},{"x":-0.8033,"y":-0.2583,"z":0.5367},{"x":-0.8032,"y":-0.2583,"z":0.5367},{"x":-0.5886,"y":-0.7063,"z":0.3933},{"x":-0.2156,"y":-0.9658,"z":0.1441},{"x":0.2156,"y":-0.9658,"z":-0.1441},{"x":0.5886,"y":-0.7064,"z":-0.3933},{"x":0.8033,"y":-0.2583,"z":-0.5367},{"x":0.7263,"y":0.2583,"z":-0.637},{"x":0.5322,"y":0.7063,"z":-0.4667},{"x":0.195,"y":0.9658,"z":-0.171},{"x":-0.195,"y":0.9658,"z":0.171},{"x":-0.5322,"y":0.7063,"z":0.4667},{"x":-0.7263,"y":0.2583,"z":0.637},{"x":-0.7263,"y":-0.2583,"z":0.637},{"x":-0.5322,"y":-0.7064,"z":0.4667},{"x":-0.195,"y":-0.9658,"z":0.171},{"x":0.195,"y":-0.9658,"z":-0.171},{"x":0.5322,"y":-0.7063,"z":-0.4667},{"x":0.5322,"y":-0.7064,"z":-0.4667},{"x":0.7263,"y":-0.2583,"z":-0.637},{"x":0.637,"y":0.2583,"z":-0.7263},{"x":0.4667,"y":0.7063,"z":-0.5322},{"x":0.171,"y":0.9658,"z":-0.195},{"x":-0.171,"y":0.9658,"z":0.195},{"x":-0.4667,"y":0.7063,"z":0.5322},{"x":-0.637,"y":0.2583,"z":0.7263},{"x":-0.637,"y":-0.2583,"z":0.7263},{"x":-0.4667,"y":-0.7064,"z":0.5322},{"x":-0.171,"y":-0.9658,"z":0.195},{"x":0.171,"y":-0.9658,"z":-0.195},{"x":0.4667,"y":-0.7064,"z":-0.5322},{"x":0.637,"y":-0.2583,"z":-0.7263},{"x":0.5367,"y":0.2583,"z":-0.8033},{"x":0.3933,"y":0.7063,"z":-0.5886},{"x":0.3933,"y":0.7064,"z":-0.5886},{"x":0.1441,"y":0.9658,"z":-0.2156},{"x":-0.1441,"y":0.9658,"z":0.2156},{"x":-0.3933,"y":0.7063,"z":0.5886},{"x":-0.5367,"y":0.2583,"z":0.8032},{"x":-0.5367,"y":0.2583,"z":0.8033},{"x":-0.5367,"y":-0.2583,"z":0.8033},{"x":-0.5367,"y":-0.2583,"z":0.8032},{"x":-0.3933,"y":-0.7064,"z":0.5886},{"x":-0.1441,"y":-0.9658,"z":0.2156},{"x":0.1441,"y":-0.9658,"z":-0.2156},{"x":0.3933,"y":-0.7064,"z":-0.5886},{"x":0.5367,"y":-0.2583,"z":-0.8033},{"x":0.4273,"y":0.2583,"z":-0.8664},{"x":0.3131,"y":0.7063,"z":-0.6349},{"x":0.1147,"y":0.9658,"z":-0.2326},{"x":-0.1147,"y":0.9658,"z":0.2326},{"x":-0.3131,"y":0.7063,"z":0.6349},{"x":-0.4273,"y":0.2583,"z":0.8664},{"x":-0.4273,"y":-0.2583,"z":0.8664},{"x":-0.3131,"y":-0.7064,"z":0.6349},{"x":-0.1147,"y":-0.9658,"z":0.2326},{"x":0.1147,"y":-0.9658,"z":-0.2326},{"x":0.3131,"y":-0.7064,"z":-0.6349},{"x":0.4273,"y":-0.2583,"z":-0.8664},{"x":0.3105,"y":0.2583,"z":-0.9148},{"x":0.2275,"y":0.7063,"z":-0.6703},{"x":0.0834,"y":0.9658,"z":-0.2456},{"x":-0.0834,"y":0.9658,"z":0.2456},{"x":-0.2275,"y":0.7063,"z":0.6703},{"x":-0.3105,"y":0.2583,"z":0.9148},{"x":-0.3105,"y":-0.2583,"z":0.9148},{"x":-0.2275,"y":-0.7064,"z":0.6703},{"x":-0.2275,"y":-0.7063,"z":0.6703},{"x":-0.0834,"y":-0.9658,"z":0.2456},{"x":0.0834,"y":-0.9658,"z":-0.2456},{"x":0.2275,"y":-0.7063,"z":-0.6703},{"x":0.3105,"y":-0.2583,"z":-0.9148},{"x":0.1885,"y":0.2583,"z":-0.9475},{"x":0.1381,"y":0.7063,"z":-0.6943},{"x":0.0506,"y":0.9658,"z":-0.2543},{"x":-0.0506,"y":0.9658,"z":0.2543},{"x":-0.1381,"y":0.7063,"z":0.6943},{"x":-0.1885,"y":0.2583,"z":0.9475},{"x":-0.1885,"y":-0.2583,"z":0.9475},{"x":-0.1381,"y":-0.7063,"z":0.6943},{"x":-0.0506,"y":-0.9658,"z":0.2544},{"x":0.0506,"y":-0.9658,"z":-0.2544},{"x":0.1381,"y":-0.7064,"z":-0.6943},{"x":0.1885,"y":-0.2583,"z":-0.9475},{"x":0.0632,"y":0.2583,"z":-0.964},{"x":0.0463,"y":0.7063,"z":-0.7064},{"x":0.017,"y":0.9658,"z":-0.2588},{"x":-0.017,"y":0.9658,"z":0.2588},{"x":-0.0463,"y":0.7063,"z":0.7064},{"x":-0.0632,"y":0.2583,"z":0.964},{"x":-0.0632,"y":-0.2583,"z":0.964},{"x":-0.0463,"y":-0.7063,"z":0.7063},{"x":-0.017,"y":-0.9658,"z":0.2588},{"x":0.017,"y":-0.9658,"z":-0.2588},{"x":0.0463,"y":-0.7063,"z":-0.7063},{"x":0.0463,"y":-0.7064,"z":-0.7063},{"x":0.0632,"y":-0.2583,"z":-0.964},{"x":-0.0632,"y":0.2583,"z":-0.964},{"x":-0.0463,"y":0.7063,"z":-0.7064},{"x":-0.0463,"y":0.7063,"z":-0.7063},{"x":-0.017,"y":0.9658,"z":-0.2588},{"x":0.017,"y":0.9658,"z":0.2588},{"x":0.0463,"y":0.7063,"z":0.7064},{"x":0.0632,"y":0.2583,"z":0.964},{"x":0.0632,"y":-0.2583,"z":0.964},{"x":0.0463,"y":-0.7063,"z":0.7063},{"x":0.0463,"y":-0.7063,"z":0.7064},{"x":0.017,"y":-0.9658,"z":0.2588},{"x":-0.017,"y":-0.9658,"z":-0.2588},{"x":-0.0463,"y":-0.7064,"z":-0.7063},{"x":-0.0632,"y":-0.2583,"z":-0.964},{"x":-0.1885,"y":0.2583,"z":-0.9475},{"x":-0.1381,"y":0.7063,"z":-0.6943},{"x":-0.0506,"y":0.9658,"z":-0.2543},{"x":0.0506,"y":0.9658,"z":0.2543},{"x":0.1381,"y":0.7063,"z":0.6943},{"x":0.1885,"y":0.2583,"z":0.9475},{"x":0.1885,"y":-0.2583,"z":0.9475},{"x":0.1381,"y":-0.7063,"z":0.6943},{"x":0.0506,"y":-0.9658,"z":0.2544},{"x":-0.0506,"y":-0.9658,"z":-0.2544},{"x":-0.1381,"y":-0.7063,"z":-0.6943},{"x":-0.1885,"y":-0.2583,"z":-0.9475},{"x":-0.3105,"y":0.2583,"z":-0.9148},{"x":-0.2275,"y":0.7063,"z":-0.6703},{"x":-0.0834,"y":0.9658,"z":-0.2456},{"x":0.0834,"y":0.9658,"z":0.2456},{"x":0.2275,"y":0.7063,"z":0.6703},{"x":0.3105,"y":0.2583,"z":0.9148},{"x":0.3105,"y":-0.2583,"z":0.9148},{"x":0.2275,"y":-0.7063,"z":0.6703},{"x":0.0834,"y":-0.9658,"z":0.2456},{"x":-0.0834,"y":-0.9658,"z":-0.2456},{"x":-0.2275,"y":-0.7063,"z":-0.6703},{"x":-0.3105,"y":-0.2583,"z":-0.9148},{"x":-0.4273,"y":0.2583,"z":-0.8664},{"x":-0.3131,"y":0.7063,"z":-0.6349},{"x":-0.1147,"y":0.9658,"z":-0.2326},{"x":0.1147,"y":0.9658,"z":0.2326},{"x":0.3131,"y":0.7063,"z":0.6349},{"x":0.4273,"y":0.2583,"z":0.8664},{"x":0.4273,"y":-0.2583,"z":0.8664},{"x":0.3131,"y":-0.7064,"z":0.6349},{"x":0.3131,"y":-0.7063,"z":0.6349},{"x":0.1147,"y":-0.9658,"z":0.2326},{"x":-0.1147,"y":-0.9658,"z":-0.2326},{"x":-0.3131,"y":-0.7064,"z":-0.6349},{"x":-0.3131,"y":-0.7063,"z":-0.6349},{"x":-0.4273,"y":-0.2583,"z":-0.8664},{"x":-0.5367,"y":0.2583,"z":-0.8033},{"x":-0.3933,"y":0.7063,"z":-0.5886},{"x":-0.1441,"y":0.9658,"z":-0.2156},{"x":0.1441,"y":0.9658,"z":0.2156},{"x":0.3933,"y":0.7063,"z":0.5886},{"x":0.5367,"y":0.2583,"z":0.8032},{"x":0.5367,"y":-0.2583,"z":0.8032},{"x":0.3933,"y":-0.7064,"z":0.5886},{"x":0.1441,"y":-0.9658,"z":0.2156},{"x":-0.1441,"y":-0.9658,"z":-0.2156},{"x":-0.3933,"y":-0.7064,"z":-0.5886},{"x":-0.3933,"y":-0.7063,"z":-0.5886},{"x":-0.5367,"y":-0.2583,"z":-0.8033},{"x":-0.637,"y":0.2583,"z":-0.7263},{"x":-0.4667,"y":0.7063,"z":-0.5322},{"x":-0.171,"y":0.9658,"z":-0.195},{"x":0.171,"y":0.9658,"z":0.195},{"x":0.4667,"y":0.7063,"z":0.5322},{"x":0.637,"y":0.2583,"z":0.7263},{"x":0.637,"y":-0.2583,"z":0.7263},{"x":0.4667,"y":-0.7064,"z":0.5322},{"x":0.4667,"y":-0.7063,"z":0.5322},{"x":0.171,"y":-0.9658,"z":0.195},{"x":-0.171,"y":-0.9658,"z":-0.195},{"x":-0.4667,"y":-0.7064,"z":-0.5322},{"x":-0.637,"y":-0.2583,"z":-0.7263},{"x":-0.7263,"y":0.2583,"z":-0.637},{"x":-0.5322,"y":0.7063,"z":-0.4667},{"x":-0.195,"y":0.9658,"z":-0.171},{"x":0.195,"y":0.9658,"z":0.171},{"x":0.5322,"y":0.7063,"z":0.4667},{"x":0.7263,"y":0.2583,"z":0.637},{"x":0.7263,"y":-0.2583,"z":0.637},{"x":0.5322,"y":-0.7064,"z":0.4667},{"x":0.195,"y":-0.9658,"z":0.171},{"x":-0.195,"y":-0.9658,"z":-0.171},{"x":-0.5322,"y":-0.7063,"z":-0.4667},{"x":-0.7263,"y":-0.2583,"z":-0.637},{"x":-0.8033,"y":0.2583,"z":-0.5367},{"x":-0.8032,"y":0.2583,"z":-0.5367},{"x":-0.5886,"y":0.7063,"z":-0.3933},{"x":-0.2156,"y":0.9658,"z":-0.1441},{"x":0.2156,"y":0.9658,"z":0.1441},{"x":0.5886,"y":0.7063,"z":0.3933},{"x":0.8033,"y":0.2583,"z":0.5367},{"x":0.8033,"y":-0.2583,"z":0.5367},{"x":0.5886,"y":-0.7063,"z":0.3933},{"x":0.5886,"y":-0.7064,"z":0.3933},{"x":0.2156,"y":-0.9658,"z":0.1441},{"x":-0.2156,"y":-0.9658,"z":-0.1441},{"x":-0.5886,"y":-0.7064,"z":-0.3933},{"x":-0.8033,"y":-0.2583,"z":-0.5367},{"x":-0.8032,"y":-0.2583,"z":-0.5367},{"x":-0.8664,"y":0.2583,"z":-0.4273},{"x":-0.6349,"y":0.7063,"z":-0.3131},{"x":-0.2326,"y":0.9658,"z":-0.1147},{"x":0.2326,"y":0.9658,"z":0.1147},{"x":0.6349,"y":0.7063,"z":0.3131},{"x":0.8664,"y":0.2583,"z":0.4273},{"x":0.8664,"y":-0.2583,"z":0.4273},{"x":0.6349,"y":-0.7063,"z":0.3131},{"x":0.6349,"y":-0.7064,"z":0.3131},{"x":0.2326,"y":-0.9658,"z":0.1147},{"x":-0.2326,"y":-0.9658,"z":-0.1147},{"x":-0.6349,"y":-0.7064,"z":-0.3131},{"x":-0.8664,"y":-0.2583,"z":-0.4273},{"x":-0.9148,"y":0.2583,"z":-0.3105},{"x":-0.6703,"y":0.7063,"z":-0.2275},{"x":-0.6703,"y":0.7064,"z":-0.2275},{"x":-0.2456,"y":0.9658,"z":-0.0834},{"x":0.2456,"y":0.9658,"z":0.0834},{"x":0.6703,"y":0.7063,"z":0.2275},{"x":0.6703,"y":0.7064,"z":0.2275},{"x":0.9148,"y":0.2583,"z":0.3105},{"x":0.9148,"y":-0.2583,"z":0.3105},{"x":0.6703,"y":-0.7063,"z":0.2275},{"x":0.6703,"y":-0.7064,"z":0.2275},{"x":0.2456,"y":-0.9658,"z":0.0834},{"x":-0.2456,"y":-0.9658,"z":-0.0834},{"x":-0.6703,"y":-0.7064,"z":-0.2275},{"x":-0.9148,"y":-0.2583,"z":-0.3105},{"x":-0.9475,"y":0.2583,"z":-0.1885},{"x":-0.6943,"y":0.7063,"z":-0.1381},{"x":-0.6943,"y":0.7064,"z":-0.1381},{"x":-0.2543,"y":0.9658,"z":-0.0506},{"x":0.2543,"y":0.9658,"z":0.0506},{"x":0.2544,"y":0.9658,"z":0.0506},{"x":0.6943,"y":0.7063,"z":0.1381},{"x":0.9475,"y":0.2583,"z":0.1885},{"x":0.9475,"y":-0.2583,"z":0.1885},{"x":0.6943,"y":-0.7064,"z":0.1381},{"x":0.6943,"y":-0.7063,"z":0.1381},{"x":0.2544,"y":-0.9658,"z":0.0506},{"x":-0.2544,"y":-0.9658,"z":-0.0506},{"x":-0.6943,"y":-0.7064,"z":-0.1381},{"x":-0.9475,"y":-0.2583,"z":-0.1885},{"x":-0.964,"y":0.2583,"z":-0.0632},{"x":-0.7064,"y":0.7063,"z":-0.0463},{"x":-0.2588,"y":0.9658,"z":-0.017},{"x":0.2588,"y":0.9658,"z":0.017},{"x":0.7064,"y":0.7063,"z":0.0463},{"x":0.964,"y":0.2583,"z":0.0632},{"x":0.964,"y":-0.2583,"z":0.0632},{"x":0.7063,"y":-0.7064,"z":0.0463},{"x":0.7063,"y":-0.7063,"z":0.0463},{"x":0.2588,"y":-0.9658,"z":0.017},{"x":-0.2588,"y":-0.9658,"z":-0.017},{"x":-0.7063,"y":-0.7064,"z":-0.0463},{"x":-0.7063,"y":-0.7063,"z":-0.0463},{"x":-0.964,"y":-0.2583,"z":-0.0632},{"x":-0.7063,"y":0.7063,"z":0.0463},{"x":0.7063,"y":0.7063,"z":-0.0463},{"x":0.6943,"y":0.7064,"z":-0.1381},{"x":-0.6703,"y":0.7064,"z":0.2275},{"x":0.5886,"y":-0.7063,"z":-0.3933},{"x":-0.5886,"y":-0.7064,"z":0.3933},{"x":-0.5322,"y":0.7064,"z":0.4667},{"x":0.4667,"y":-0.7063,"z":-0.5322},{"x":-0.4667,"y":-0.7063,"z":0.5322},{"x":0.5367,"y":-0.2583,"z":-0.8032},{"x":0.3933,"y":-0.7063,"z":-0.5886},{"x":-0.3933,"y":-0.7063,"z":0.5886},{"x":0.3131,"y":0.7064,"z":-0.6349},{"x":-0.3131,"y":-0.7063,"z":0.6349},{"x":-0.0506,"y":0.9658,"z":0.2544},{"x":0.1381,"y":-0.7063,"z":-0.6943},{"x":-0.1381,"y":-0.7064,"z":0.6943},{"x":-0.0463,"y":0.7063,"z":0.7063},{"x":0.0463,"y":0.7063,"z":-0.7063},{"x":0.0463,"y":0.7064,"z":-0.7063},{"x":-0.0463,"y":-0.7064,"z":0.7063},{"x":0.0463,"y":-0.7064,"z":0.7063},{"x":0.0506,"y":0.9658,"z":0.2544},{"x":-0.1381,"y":0.7064,"z":-0.6943},{"x":-0.1381,"y":-0.7064,"z":-0.6943},{"x":0.1381,"y":-0.7064,"z":0.6943},{"x":0.2275,"y":-0.7064,"z":0.6703},{"x":0.5367,"y":0.2583,"z":0.8033},{"x":0.3933,"y":-0.7063,"z":0.5886},{"x":0.5367,"y":-0.2583,"z":0.8033},{"x":-0.4667,"y":-0.7063,"z":-0.5322},{"x":0.5322,"y":0.7064,"z":0.4667},{"x":-0.5886,"y":-0.7063,"z":-0.3933},{"x":-0.6349,"y":-0.7063,"z":-0.3131},{"x":-0.2544,"y":0.9658,"z":-0.0506},{"x":-0.7064,"y":-0.7063,"z":-0.0463},{"x":0.7064,"y":-0.7063,"z":0.0463},{"x":0.7064,"y":-0.7063,"z":-0.0463},{"x":0.8032,"y":0.2583,"z":-0.5367},{"x":0.8032,"y":-0.2583,"z":-0.5367},{"x":0.0506,"y":0.9658,"z":-0.2544},{"x":-0.0463,"y":-0.7063,"z":-0.7063},{"x":-0.2275,"y":-0.7064,"z":-0.6703},{"x":-0.3933,"y":0.7064,"z":-0.5886},{"x":0.5322,"y":-0.7063,"z":0.4667},{"x":-0.5322,"y":-0.7064,"z":-0.4667},{"x":0.8032,"y":0.2583,"z":0.5367},{"x":0.8032,"y":-0.2583,"z":0.5367},{"x":-0.6703,"y":-0.7063,"z":-0.2275},{"x":0.6943,"y":0.7064,"z":0.1381},{"x":-0.7063,"y":0.7063,"z":-0.0463},{"x":0.7063,"y":0.7063,"z":0.0463},{"x":-0.7063,"y":-0.7064,"z":0.0463},{"x":0.2544,"y":0.9658,"z":-0.0506},{"x":0.6703,"y":0.7064,"z":-0.2275},{"x":-0.6703,"y":-0.7063,"z":0.2275},{"x":-0.0506,"y":0.9658,"z":-0.2544},{"x":0.7063,"y":0.7064,"z":0.0463}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[2,3,4],"normals":[1,1,2]},{"vertices":[3,5,4],"normals":[3,3,3]},{"vertices":[6,7,5],"normals":[4,4,4]},{"vertices":[7,8,9],"normals":[5,5,5]},{"vertices":[8,10,9],"normals":[6,6,6]},{"vertices":[10,11,12],"normals":[7,7,7]},{"vertices":[11,13,12],"normals":[8,8,9]},{"vertices":[13,14,15],"normals":[10,10,10]},{"vertices":[15,16,17],"normals":[11,11,11]},{"vertices":[16,18,17],"normals":[12,13,13]},{"vertices":[19,0,18],"normals":[14,14,14]},{"vertices":[20,1,21],"normals":[15,15,15]},{"vertices":[1,22,3],"normals":[16,16,16]},{"vertices":[3,23,6],"normals":[17,17,17]},{"vertices":[23,24,6],"normals":[18,18,19]},{"vertices":[24,25,8],"normals":[20,20,21]},{"vertices":[8,26,27],"normals":[22,22,22]},{"vertices":[26,11,27],"normals":[23,23,23]},{"vertices":[28,29,11],"normals":[24,25,24]},{"vertices":[29,30,14],"normals":[26,26,26]},{"vertices":[30,16,14],"normals":[27,27,27]},{"vertices":[16,31,19],"normals":[28,28,29]},{"vertices":[19,20,21],"normals":[30,30,30]},{"vertices":[32,33,20],"normals":[31,31,31]},{"vertices":[34,22,33],"normals":[32,32,32]},{"vertices":[22,35,23],"normals":[33,33,33]},{"vertices":[23,36,37],"normals":[34,34,34]},{"vertices":[36,25,37],"normals":[35,35,35]},{"vertices":[25,38,26],"normals":[36,36,36]},{"vertices":[38,28,26],"normals":[37,37,37]},{"vertices":[28,39,40],"normals":[38,38,38]},{"vertices":[40,41,30],"normals":[39,39,39]},{"vertices":[41,42,30],"normals":[40,40,40]},{"vertices":[42,43,31],"normals":[41,41,42]},{"vertices":[31,32,20],"normals":[43,43,43]},{"vertices":[32,44,34],"normals":[44,44,44]},{"vertices":[34,45,46],"normals":[45,45,45]},{"vertices":[46,47,35],"normals":[46,46,46]},{"vertices":[47,36,35],"normals":[47,47,47]},{"vertices":[36,48,49],"normals":[48,48,49]},{"vertices":[49,50,38],"normals":[50,50,50]},{"vertices":[50,51,38],"normals":[51,51,51]},{"vertices":[52,39,51],"normals":[52,52,53]},{"vertices":[39,53,41],"normals":[54,54,54]},{"vertices":[53,54,41],"normals":[55,55,55]},{"vertices":[55,43,54],"normals":[56,56,56]},{"vertices":[43,56,32],"normals":[57,57,57]},{"vertices":[57,44,56],"normals":[58,58,58]},{"vertices":[58,45,44],"normals":[59,59,59]},{"vertices":[45,59,47],"normals":[60,60,60]},{"vertices":[59,60,47],"normals":[61,61,61]},{"vertices":[60,61,48],"normals":[62,62,62]},{"vertices":[61,50,48],"normals":[63,64,63]},{"vertices":[50,62,52],"normals":[65,66,66]},{"vertices":[52,63,64],"normals":[67,67,67]},{"vertices":[64,65,53],"normals":[68,68,68]},{"vertices":[65,55,53],"normals":[69,69,69]},{"vertices":[66,67,55],"normals":[70,70,70]},{"vertices":[67,57,56],"normals":[71,71,71]},{"vertices":[57,68,58],"normals":[72,72,72]},{"vertices":[68,69,58],"normals":[73,73,73]},{"vertices":[70,59,69],"normals":[74,74,74]},{"vertices":[71,72,59],"normals":[75,75,75]},{"vertices":[72,73,61],"normals":[76,76,76]},{"vertices":[73,74,61],"normals":[77,77,77]},{"vertices":[75,62,74],"normals":[78,78,78]},{"vertices":[76,63,62],"normals":[79,79,79]},{"vertices":[63,77,65],"normals":[80,80,80]},{"vertices":[77,66,65],"normals":[81,81,81]},{"vertices":[66,78,79],"normals":[82,83,82]},{"vertices":[79,80,57],"normals":[84,84,84]},{"vertices":[80,81,68],"normals":[85,85,85]},{"vertices":[68,82,70],"normals":[86,86,86]},{"vertices":[82,71,70],"normals":[87,87,87]},{"vertices":[71,83,84],"normals":[88,88,88]},{"vertices":[83,73,84],"normals":[89,89,89]},{"vertices":[73,85,75],"normals":[90,90,90]},{"vertices":[85,76,75],"normals":[91,91,91]},{"vertices":[76,86,87],"normals":[92,92,92]},{"vertices":[87,88,77],"normals":[93,93,93]},{"vertices":[77,89,90],"normals":[94,94,94]},{"vertices":[89,78,90],"normals":[95,95,95]},{"vertices":[91,80,78],"normals":[96,96,96]},{"vertices":[92,81,93],"normals":[97,97,97]},{"vertices":[94,82,81],"normals":[98,98,99]},{"vertices":[95,96,82],"normals":[100,100,100]},{"vertices":[96,97,83],"normals":[101,101,101]},{"vertices":[83,98,99],"normals":[102,102,102]},{"vertices":[98,85,99],"normals":[103,104,103]},{"vertices":[85,100,101],"normals":[105,106,106]},{"vertices":[100,86,101],"normals":[107,107,107]},{"vertices":[102,88,86],"normals":[108,108,108]},{"vertices":[88,103,89],"normals":[109,109,109]},{"vertices":[89,104,91],"normals":[110,110,110]},{"vertices":[91,92,93],"normals":[111,111,111]},{"vertices":[92,105,94],"normals":[112,112,112]},{"vertices":[94,106,95],"normals":[113,113,113]},{"vertices":[106,107,95],"normals":[114,114,114]},{"vertices":[108,97,107],"normals":[115,115,115]},{"vertices":[97,109,98],"normals":[116,116,116]},{"vertices":[109,110,98],"normals":[117,117,117]},{"vertices":[110,111,100],"normals":[118,118,118]},{"vertices":[111,102,100],"normals":[119,119,119]},{"vertices":[112,113,102],"normals":[120,120,120]},{"vertices":[113,114,103],"normals":[121,121,121]},{"vertices":[114,104,103],"normals":[122,122,122]},{"vertices":[104,115,92],"normals":[123,123,123]},{"vertices":[116,105,115],"normals":[124,124,124]},{"vertices":[105,117,106],"normals":[125,125,125]},{"vertices":[117,108,106],"normals":[126,126,126]},{"vertices":[108,118,119],"normals":[127,127,127]},{"vertices":[118,109,119],"normals":[128,128,128]},{"vertices":[120,121,109],"normals":[129,129,129]},{"vertices":[121,122,111],"normals":[130,130,130]},{"vertices":[122,112,111],"normals":[131,132,131]},{"vertices":[123,124,112],"normals":[133,133,133]},{"vertices":[125,114,124],"normals":[134,134,134]},{"vertices":[126,127,114],"normals":[135,135,135]},{"vertices":[127,116,115],"normals":[136,136,136]},{"vertices":[116,128,129],"normals":[137,137,137]},{"vertices":[128,117,129],"normals":[138,138,138]},{"vertices":[117,130,131],"normals":[139,139,139]},{"vertices":[130,118,131],"normals":[140,140,140]},{"vertices":[118,132,120],"normals":[141,141,141]},{"vertices":[132,133,120],"normals":[142,142,142]},{"vertices":[134,122,133],"normals":[143,143,143]},{"vertices":[122,135,123],"normals":[144,144,144]},{"vertices":[123,136,125],"normals":[145,145,145]},{"vertices":[136,126,125],"normals":[146,146,146]},{"vertices":[137,138,126],"normals":[147,147,147]},{"vertices":[139,116,138],"normals":[148,148,148]},{"vertices":[140,128,141],"normals":[149,149,149]},{"vertices":[142,143,128],"normals":[150,150,150]},{"vertices":[143,144,130],"normals":[151,151,151]},{"vertices":[144,145,130],"normals":[152,152,152]},{"vertices":[145,146,132],"normals":[153,153,153]},{"vertices":[132,147,134],"normals":[154,154,154]},{"vertices":[147,148,134],"normals":[155,155,155]},{"vertices":[149,135,148],"normals":[156,156,156]},{"vertices":[135,150,136],"normals":[157,157,157]},{"vertices":[150,137,136],"normals":[158,158,158]},{"vertices":[137,151,139],"normals":[159,160,159]},{"vertices":[139,140,141],"normals":[161,161,161]},{"vertices":[152,142,140],"normals":[162,162,162]},{"vertices":[142,153,154],"normals":[163,163,164]},{"vertices":[153,144,154],"normals":[165,165,165]},{"vertices":[144,155,156],"normals":[166,166,166]},{"vertices":[155,146,156],"normals":[167,167,167]},{"vertices":[157,147,146],"normals":[168,168,168]},{"vertices":[158,149,147],"normals":[169,169,169]},{"vertices":[159,160,149],"normals":[170,170,171]},{"vertices":[160,161,150],"normals":[172,172,172]},{"vertices":[150,162,163],"normals":[173,173,173]},{"vertices":[162,151,163],"normals":[174,174,174]},{"vertices":[164,140,151],"normals":[175,175,175]},{"vertices":[152,165,166],"normals":[176,176,176]},{"vertices":[166,167,153],"normals":[177,177,177]},{"vertices":[167,168,153],"normals":[178,178,178]},{"vertices":[169,155,168],"normals":[179,179,179]},{"vertices":[155,170,157],"normals":[180,180,180]},{"vertices":[157,171,158],"normals":[181,181,181]},{"vertices":[171,159,158],"normals":[182,182,182]},{"vertices":[172,173,159],"normals":[183,183,183]},{"vertices":[174,161,173],"normals":[184,184,184]},{"vertices":[161,175,162],"normals":[185,185,185]},{"vertices":[175,164,162],"normals":[186,186,186]},{"vertices":[164,176,152],"normals":[187,187,187]},{"vertices":[177,165,176],"normals":[188,188,188]},{"vertices":[165,178,167],"normals":[189,189,189]},{"vertices":[167,179,169],"normals":[190,190,190]},{"vertices":[179,180,169],"normals":[191,191,191]},{"vertices":[181,170,180],"normals":[192,192,192]},{"vertices":[170,182,171],"normals":[193,193,193]},{"vertices":[171,183,172],"normals":[194,194,194]},{"vertices":[172,184,174],"normals":[195,195,195]},{"vertices":[174,185,186],"normals":[196,196,196]},{"vertices":[186,187,175],"normals":[197,197,197]},{"vertices":[175,188,189],"normals":[198,198,198]},{"vertices":[189,177,176],"normals":[199,199,199]},{"vertices":[177,190,191],"normals":[200,200,200]},{"vertices":[191,192,178],"normals":[201,201,201]},{"vertices":[192,179,178],"normals":[202,202,202]},{"vertices":[179,193,181],"normals":[203,203,203]},{"vertices":[181,194,195],"normals":[204,204,204]},{"vertices":[194,182,195],"normals":[205,205,205]},{"vertices":[182,196,183],"normals":[206,206,206]},{"vertices":[196,184,183],"normals":[207,207,208]},{"vertices":[197,185,184],"normals":[209,209,209]},{"vertices":[185,198,187],"normals":[210,210,210]},{"vertices":[198,188,187],"normals":[211,211,212]},{"vertices":[199,177,188],"normals":[213,213,213]},{"vertices":[200,201,190],"normals":[214,214,214]},{"vertices":[201,192,190],"normals":[215,215,215]},{"vertices":[202,203,192],"normals":[216,216,216]},{"vertices":[204,193,203],"normals":[217,217,217]},{"vertices":[205,194,193],"normals":[218,218,218]},{"vertices":[206,207,194],"normals":[219,219,219]},{"vertices":[207,208,196],"normals":[220,220,220]},{"vertices":[196,209,197],"normals":[221,221,221]},{"vertices":[197,210,211],"normals":[222,222,222]},{"vertices":[211,212,198],"normals":[223,223,223]},{"vertices":[198,213,199],"normals":[224,224,225]},{"vertices":[213,200,199],"normals":[226,226,226]},{"vertices":[214,215,201],"normals":[227,227,227]},{"vertices":[215,202,201],"normals":[228,228,228]},{"vertices":[202,216,204],"normals":[229,229,229]},{"vertices":[216,205,204],"normals":[230,230,230]},{"vertices":[217,206,205],"normals":[231,231,231]},{"vertices":[206,218,219],"normals":[232,232,232]},{"vertices":[218,208,219],"normals":[233,233,233]},{"vertices":[220,209,208],"normals":[234,235,234]},{"vertices":[209,221,210],"normals":[236,236,236]},{"vertices":[221,212,210],"normals":[237,237,237]},{"vertices":[222,213,212],"normals":[238,238,238]},{"vertices":[213,223,214],"normals":[239,239,239]},{"vertices":[223,224,215],"normals":[240,240,240]},{"vertices":[215,225,226],"normals":[241,241,241]},{"vertices":[225,216,226],"normals":[242,242,242]},{"vertices":[227,217,216],"normals":[243,243,243]},{"vertices":[217,228,229],"normals":[244,244,244]},{"vertices":[228,218,229],"normals":[245,245,245]},{"vertices":[230,220,218],"normals":[246,246,246]},{"vertices":[231,232,220],"normals":[247,247,247]},{"vertices":[232,233,221],"normals":[248,248,248]},{"vertices":[221,234,222],"normals":[249,249,249]},{"vertices":[234,235,222],"normals":[250,250,250]},{"vertices":[236,223,235],"normals":[251,251,251]},{"vertices":[237,224,238],"normals":[252,252,253]},{"vertices":[224,239,225],"normals":[254,254,254]},{"vertices":[225,240,227],"normals":[255,255,255]},{"vertices":[227,241,242],"normals":[256,256,256]},{"vertices":[242,243,228],"normals":[257,257,257]},{"vertices":[228,244,230],"normals":[258,258,258]},{"vertices":[244,231,230],"normals":[259,259,259]},{"vertices":[245,246,231],"normals":[260,261,261]},{"vertices":[246,247,233],"normals":[262,262,262]},{"vertices":[233,248,234],"normals":[263,263,263]},{"vertices":[248,236,234],"normals":[264,264,264]},{"vertices":[236,237,238],"normals":[265,265,266]},{"vertices":[237,249,250],"normals":[267,267,267]},{"vertices":[249,239,250],"normals":[268,268,268]},{"vertices":[251,240,239],"normals":[269,269,269]},{"vertices":[252,241,240],"normals":[270,270,270]},{"vertices":[253,243,241],"normals":[271,271,271]},{"vertices":[254,244,243],"normals":[272,272,272]},{"vertices":[244,255,245],"normals":[273,273,273]},{"vertices":[245,256,257],"normals":[274,274,275]},{"vertices":[257,258,247],"normals":[276,276,276]},{"vertices":[247,259,248],"normals":[277,277,277]},{"vertices":[259,260,248],"normals":[278,278,278]},{"vertices":[260,261,237],"normals":[279,279,279]},{"vertices":[261,262,249],"normals":[280,280,280]},{"vertices":[262,251,249],"normals":[281,281,282]},{"vertices":[251,263,252],"normals":[283,283,283]},{"vertices":[263,253,252],"normals":[284,284,284]},{"vertices":[253,264,254],"normals":[285,285,286]},{"vertices":[254,265,266],"normals":[287,287,287]},{"vertices":[265,255,266],"normals":[288,288,288]},{"vertices":[267,256,255],"normals":[289,289,290]},{"vertices":[268,258,256],"normals":[291,291,291]},{"vertices":[269,259,258],"normals":[292,292,292]},{"vertices":[259,270,271],"normals":[293,293,293]},{"vertices":[270,261,271],"normals":[294,294,294]},{"vertices":[272,273,262],"normals":[295,295,295]},{"vertices":[273,274,262],"normals":[296,296,297]},{"vertices":[274,275,263],"normals":[298,298,298]},{"vertices":[275,276,263],"normals":[299,299,300]},{"vertices":[277,264,276],"normals":[301,301,301]},{"vertices":[264,278,265],"normals":[302,302,302]},{"vertices":[265,279,267],"normals":[303,303,303]},{"vertices":[267,280,268],"normals":[304,304,305]},{"vertices":[268,281,269],"normals":[306,306,306]},{"vertices":[281,282,269],"normals":[307,307,307]},{"vertices":[282,283,270],"normals":[308,308,308]},{"vertices":[283,272,270],"normals":[309,309,309]},{"vertices":[284,285,273],"normals":[310,310,310]},{"vertices":[273,286,287],"normals":[311,311,311]},{"vertices":[287,288,275],"normals":[312,312,312]},{"vertices":[275,289,277],"normals":[313,313,313]},{"vertices":[277,290,291],"normals":[314,314,314]},{"vertices":[291,292,278],"normals":[315,315,315]},{"vertices":[292,279,278],"normals":[316,316,316]},{"vertices":[279,293,280],"normals":[317,317,318]},{"vertices":[280,294,281],"normals":[319,319,319]},{"vertices":[294,295,281],"normals":[320,320,320]},{"vertices":[295,296,283],"normals":[321,322,321]},{"vertices":[296,284,283],"normals":[323,323,323]},{"vertices":[297,285,298],"normals":[6,6,6]},{"vertices":[299,286,285],"normals":[5,5,324]},{"vertices":[300,288,286],"normals":[4,4,4]},{"vertices":[288,301,289],"normals":[3,3,3]},{"vertices":[289,302,290],"normals":[325,325,2]},{"vertices":[302,292,290],"normals":[0,0,0]},{"vertices":[292,303,304],"normals":[14,14,14]},{"vertices":[303,293,304],"normals":[13,13,13]},{"vertices":[305,294,293],"normals":[11,11,11]},{"vertices":[294,306,307],"normals":[10,10,10]},{"vertices":[306,296,307],"normals":[9,9,8]},{"vertices":[296,297,298],"normals":[7,7,7]},{"vertices":[297,308,299],"normals":[22,22,22]},{"vertices":[299,309,300],"normals":[20,20,20]},{"vertices":[309,310,300],"normals":[19,19,18]},{"vertices":[311,301,310],"normals":[17,17,17]},{"vertices":[301,312,302],"normals":[16,16,326]},{"vertices":[312,313,302],"normals":[15,15,15]},{"vertices":[314,303,313],"normals":[30,30,30]},{"vertices":[315,305,303],"normals":[29,29,29]},{"vertices":[316,317,305],"normals":[27,27,27]},{"vertices":[317,318,306],"normals":[26,26,26]},{"vertices":[318,319,306],"normals":[24,24,24]},{"vertices":[320,297,319],"normals":[23,23,23]},{"vertices":[321,308,322],"normals":[36,36,36]},{"vertices":[308,323,309],"normals":[35,35,327]},{"vertices":[323,311,309],"normals":[34,34,34]},{"vertices":[311,324,325],"normals":[33,33,33]},{"vertices":[325,326,312],"normals":[32,32,32]},{"vertices":[326,314,312],"normals":[31,31,31]},{"vertices":[314,327,315],"normals":[43,43,43]},{"vertices":[327,316,315],"normals":[42,41,42]},{"vertices":[328,329,316],"normals":[40,40,40]},{"vertices":[329,330,318],"normals":[39,39,39]},{"vertices":[330,320,318],"normals":[38,38,38]},{"vertices":[320,321,322],"normals":[37,37,37]},{"vertices":[331,332,321],"normals":[50,50,50]},{"vertices":[333,323,332],"normals":[48,48,48]},{"vertices":[334,335,323],"normals":[47,47,47]},{"vertices":[336,324,335],"normals":[46,46,46]},{"vertices":[324,337,326],"normals":[45,45,45]},{"vertices":[326,338,339],"normals":[44,44,44]},{"vertices":[338,327,339],"normals":[57,57,57]},{"vertices":[340,328,327],"normals":[56,56,56]},{"vertices":[341,342,328],"normals":[55,55,55]},{"vertices":[343,330,342],"normals":[54,54,54]},{"vertices":[330,344,345],"normals":[52,52,52]},{"vertices":[345,331,321],"normals":[51,51,51]},{"vertices":[346,333,331],"normals":[64,64,64]},{"vertices":[347,334,333],"normals":[62,62,62]},{"vertices":[348,336,334],"normals":[61,61,61]},{"vertices":[349,350,336],"normals":[60,60,60]},{"vertices":[350,351,337],"normals":[59,59,59]},{"vertices":[351,338,337],"normals":[58,58,58]},{"vertices":[338,352,340],"normals":[71,71,71]},{"vertices":[352,341,340],"normals":[328,328,328]},{"vertices":[353,343,341],"normals":[69,69,69]},{"vertices":[343,354,355],"normals":[68,68,68]},{"vertices":[354,344,355],"normals":[329,329,67]},{"vertices":[356,331,344],"normals":[65,65,65]},{"vertices":[357,347,346],"normals":[77,77,77]},{"vertices":[358,348,347],"normals":[76,76,330]},{"vertices":[348,359,349],"normals":[75,75,75]},{"vertices":[359,360,349],"normals":[74,74,74]},{"vertices":[361,351,360],"normals":[73,73,73]},{"vertices":[362,363,351],"normals":[72,72,72]},{"vertices":[363,364,352],"normals":[84,84,84]},{"vertices":[352,365,353],"normals":[82,82,82]},{"vertices":[353,366,367],"normals":[81,81,81]},{"vertices":[366,354,367],"normals":[80,80,80]},{"vertices":[368,356,354],"normals":[79,79,79]},{"vertices":[356,357,346],"normals":[78,78,78]},{"vertices":[369,358,357],"normals":[90,90,90]},{"vertices":[370,371,358],"normals":[89,89,89]},{"vertices":[372,359,371],"normals":[88,88,88]},{"vertices":[359,373,361],"normals":[87,87,87]},{"vertices":[373,362,361],"normals":[86,86,86]},{"vertices":[362,374,375],"normals":[85,85,85]},{"vertices":[374,364,375],"normals":[96,96,96]},{"vertices":[376,365,364],"normals":[331,331,331]},{"vertices":[377,366,365],"normals":[94,94,94]},{"vertices":[366,378,368],"normals":[93,93,93]},{"vertices":[368,379,380],"normals":[332,332,332]},{"vertices":[379,357,380],"normals":[91,91,91]},{"vertices":[369,381,370],"normals":[104,104,104]},{"vertices":[381,372,370],"normals":[102,102,102]},{"vertices":[372,382,383],"normals":[101,101,101]},{"vertices":[383,384,373],"normals":[100,100,100]},{"vertices":[384,385,373],"normals":[98,98,98]},{"vertices":[386,374,385],"normals":[97,97,97]},{"vertices":[387,376,374],"normals":[111,111,333]},{"vertices":[376,388,377],"normals":[334,334,334]},{"vertices":[388,389,377],"normals":[109,109,109]},{"vertices":[390,378,389],"normals":[108,108,108]},{"vertices":[391,379,378],"normals":[335,107,107]},{"vertices":[392,369,379],"normals":[105,105,105]},{"vertices":[393,381,394],"normals":[117,117,117]},{"vertices":[395,396,381],"normals":[116,116,116]},{"vertices":[397,382,396],"normals":[115,115,115]},{"vertices":[382,398,384],"normals":[114,114,114]},{"vertices":[398,386,384],"normals":[113,113,336]},{"vertices":[386,399,387],"normals":[112,112,112]},{"vertices":[399,400,387],"normals":[123,123,123]},{"vertices":[400,401,388],"normals":[122,122,122]},{"vertices":[401,390,388],"normals":[121,121,121]},{"vertices":[390,402,391],"normals":[120,120,120]},{"vertices":[391,403,392],"normals":[337,337,119]},{"vertices":[403,394,392],"normals":[118,118,118]},{"vertices":[404,395,393],"normals":[129,129,129]},{"vertices":[405,397,395],"normals":[128,128,128]},{"vertices":[397,406,407],"normals":[127,127,127]},{"vertices":[406,398,407],"normals":[126,126,126]},{"vertices":[398,408,409],"normals":[125,125,125]},{"vertices":[409,410,399],"normals":[124,124,124]},{"vertices":[399,411,412],"normals":[136,136,136]},{"vertices":[412,413,401],"normals":[135,135,135]},{"vertices":[413,414,401],"normals":[134,134,134]},{"vertices":[414,415,402],"normals":[133,133,133]},{"vertices":[415,403,402],"normals":[131,131,131]},{"vertices":[416,393,403],"normals":[130,130,130]},{"vertices":[404,417,405],"normals":[142,142,142]},{"vertices":[417,418,405],"normals":[141,141,141]},{"vertices":[418,419,406],"normals":[140,140,338]},{"vertices":[406,420,421],"normals":[139,139,139]},{"vertices":[420,408,421],"normals":[138,138,138]},{"vertices":[422,410,408],"normals":[137,137,137]},{"vertices":[410,423,411],"normals":[148,148,148]},{"vertices":[411,424,413],"normals":[147,339,339]},{"vertices":[413,425,426],"normals":[146,146,146]},{"vertices":[426,427,415],"normals":[145,145,145]},{"vertices":[415,428,416],"normals":[340,340,340]},{"vertices":[428,404,416],"normals":[143,143,143]},{"vertices":[429,430,417],"normals":[154,154,154]},{"vertices":[430,431,417],"normals":[153,153,341]},{"vertices":[431,432,419],"normals":[152,152,152]},{"vertices":[432,420,419],"normals":[151,151,151]},{"vertices":[420,433,422],"normals":[342,342,343]},{"vertices":[433,434,422],"normals":[149,149,149]},{"vertices":[435,423,434],"normals":[161,161,161]},{"vertices":[436,424,423],"normals":[160,160,160]},{"vertices":[437,425,424],"normals":[158,158,158]},{"vertices":[425,438,427],"normals":[157,157,157]},{"vertices":[438,428,427],"normals":[156,344,344]},{"vertices":[428,439,429],"normals":[155,155,155]},{"vertices":[439,440,430],"normals":[168,168,168]},{"vertices":[440,441,430],"normals":[167,167,167]},{"vertices":[442,432,441],"normals":[166,166,166]},{"vertices":[432,443,444],"normals":[165,165,165]},{"vertices":[443,433,444],"normals":[163,163,163]},{"vertices":[445,435,433],"normals":[162,162,162]},{"vertices":[446,436,435],"normals":[175,175,175]},{"vertices":[436,447,437],"normals":[174,174,174]},{"vertices":[447,448,437],"normals":[173,173,173]},{"vertices":[448,449,438],"normals":[172,172,172]},{"vertices":[449,450,438],"normals":[345,345,170]},{"vertices":[451,439,450],"normals":[169,169,169]},{"vertices":[452,440,453],"normals":[181,181,181]},{"vertices":[440,454,442],"normals":[180,180,180]},{"vertices":[454,455,442],"normals":[346,346,179]},{"vertices":[455,456,443],"normals":[178,178,178]},{"vertices":[456,445,443],"normals":[177,177,347]},{"vertices":[457,446,445],"normals":[176,176,176]},{"vertices":[458,459,446],"normals":[187,187,187]},{"vertices":[459,460,447],"normals":[186,348,348]},{"vertices":[460,461,447],"normals":[185,185,185]},{"vertices":[461,462,449],"normals":[184,184,184]},{"vertices":[449,463,451],"normals":[349,349,349]},{"vertices":[451,452,453],"normals":[182,182,182]},{"vertices":[464,465,452],"normals":[193,193,193]},{"vertices":[466,454,465],"normals":[192,192,192]},{"vertices":[454,467,468],"normals":[191,191,191]},{"vertices":[467,456,468],"normals":[190,190,190]},{"vertices":[456,469,457],"normals":[189,189,189]},{"vertices":[457,470,458],"normals":[188,188,188]},{"vertices":[470,471,458],"normals":[199,199,199]},{"vertices":[472,460,471],"normals":[198,198,198]},{"vertices":[460,473,474],"normals":[197,197,197]},{"vertices":[473,462,474],"normals":[196,196,196]},{"vertices":[462,475,463],"normals":[350,350,350]},{"vertices":[463,464,452],"normals":[194,194,194]},{"vertices":[476,466,464],"normals":[205,205,205]},{"vertices":[477,478,466],"normals":[204,204,204]},{"vertices":[478,479,467],"normals":[203,203,203]},{"vertices":[479,480,467],"normals":[202,202,202]},{"vertices":[481,469,480],"normals":[201,201,201]},{"vertices":[469,482,470],"normals":[200,200,200]},{"vertices":[482,472,470],"normals":[213,213,213]},{"vertices":[472,483,484],"normals":[211,211,211]},{"vertices":[484,485,473],"normals":[210,210,210]},{"vertices":[485,486,473],"normals":[209,209,209]},{"vertices":[486,487,475],"normals":[208,207,208]},{"vertices":[475,476,464],"normals":[206,206,206]},{"vertices":[488,477,476],"normals":[351,351,351]},{"vertices":[489,490,477],"normals":[218,218,218]},{"vertices":[490,491,479],"normals":[217,217,217]},{"vertices":[491,481,479],"normals":[216,216,216]},{"vertices":[492,493,481],"normals":[215,215,215]},{"vertices":[494,482,493],"normals":[214,214,214]},{"vertices":[482,495,496],"normals":[226,226,226]},{"vertices":[496,497,483],"normals":[224,224,224]},{"vertices":[483,498,485],"normals":[223,223,223]},{"vertices":[485,499,500],"normals":[222,222,222]},{"vertices":[500,501,487],"normals":[352,352,221]},{"vertices":[487,488,476],"normals":[353,353,353]},{"vertices":[502,489,488],"normals":[232,232,232]},{"vertices":[489,503,504],"normals":[231,231,231]},{"vertices":[503,491,504],"normals":[230,230,230]},{"vertices":[491,505,492],"normals":[229,229,229]},{"vertices":[505,494,492],"normals":[228,228,228]},{"vertices":[506,507,494],"normals":[227,227,227]},{"vertices":[507,508,495],"normals":[239,239,239]},{"vertices":[495,509,497],"normals":[354,354,238]},{"vertices":[497,510,498],"normals":[237,237,237]},{"vertices":[498,511,499],"normals":[236,236,236]},{"vertices":[499,512,501],"normals":[234,234,234]},{"vertices":[512,488,501],"normals":[233,233,233]},{"vertices":[502,513,514],"normals":[245,245,245]},{"vertices":[513,503,514],"normals":[244,244,355]},{"vertices":[503,515,516],"normals":[243,243,243]},{"vertices":[516,517,505],"normals":[242,242,242]},{"vertices":[517,506,505],"normals":[241,241,241]},{"vertices":[506,518,519],"normals":[240,240,240]},{"vertices":[518,508,519],"normals":[251,251,251]},{"vertices":[520,509,508],"normals":[250,250,250]},{"vertices":[521,510,509],"normals":[249,249,249]},{"vertices":[510,522,511],"normals":[248,248,248]},{"vertices":[511,523,512],"normals":[247,247,247]},{"vertices":[523,502,512],"normals":[246,246,246]},{"vertices":[524,525,513],"normals":[258,258,258]},{"vertices":[513,526,527],"normals":[257,257,257]},{"vertices":[526,515,527],"normals":[256,256,256]},{"vertices":[515,528,517],"normals":[255,255,255]},{"vertices":[528,529,517],"normals":[254,254,254]},{"vertices":[530,518,529],"normals":[253,253,253]},{"vertices":[531,520,518],"normals":[266,266,265]},{"vertices":[532,521,520],"normals":[264,264,356]},{"vertices":[533,534,521],"normals":[263,263,263]},{"vertices":[534,535,522],"normals":[262,262,262]},{"vertices":[522,536,523],"normals":[261,261,261]},{"vertices":[536,524,523],"normals":[259,259,259]},{"vertices":[537,538,525],"normals":[272,272,272]},{"vertices":[525,539,526],"normals":[271,271,271]},{"vertices":[539,540,526],"normals":[270,270,270]},{"vertices":[540,541,528],"normals":[269,269,269]},{"vertices":[528,542,530],"normals":[268,268,268]},{"vertices":[542,531,530],"normals":[267,267,267]},{"vertices":[531,543,532],"normals":[279,279,279]},{"vertices":[543,533,532],"normals":[357,357,357]},{"vertices":[544,545,533],"normals":[277,277,277]},{"vertices":[545,546,535],"normals":[276,276,276]},{"vertices":[546,536,535],"normals":[274,274,275]},{"vertices":[547,537,536],"normals":[273,273,273]},{"vertices":[548,538,549],"normals":[287,287,287]},{"vertices":[538,550,539],"normals":[285,285,285]},{"vertices":[539,551,552],"normals":[284,284,284]},{"vertices":[552,553,541],"normals":[283,283,283]},{"vertices":[541,554,542],"normals":[281,281,282]},{"vertices":[542,555,556],"normals":[280,280,280]},{"vertices":[555,543,556],"normals":[294,294,294]},{"vertices":[557,544,543],"normals":[293,293,293]},{"vertices":[558,559,544],"normals":[292,292,292]},{"vertices":[560,546,559],"normals":[291,291,291]},{"vertices":[546,561,547],"normals":[289,289,289]},{"vertices":[547,548,549],"normals":[288,288,288]},{"vertices":[548,562,563],"normals":[302,302,302]},{"vertices":[563,564,550],"normals":[301,301,301]},{"vertices":[550,565,551],"normals":[299,299,299]},{"vertices":[551,566,553],"normals":[298,298,358]},{"vertices":[566,554,553],"normals":[296,296,296]},{"vertices":[567,555,554],"normals":[295,295,295]},{"vertices":[555,568,557],"normals":[309,309,309]},{"vertices":[557,569,558],"normals":[308,308,308]},{"vertices":[569,560,558],"normals":[307,307,307]},{"vertices":[570,571,560],"normals":[306,306,306]},{"vertices":[572,561,571],"normals":[305,305,305]},{"vertices":[573,548,561],"normals":[303,303,303]},{"vertices":[0,562,574],"normals":[315,315,315]},{"vertices":[2,564,562],"normals":[314,314,314]},{"vertices":[4,565,564],"normals":[313,313,313]},{"vertices":[565,7,566],"normals":[312,312,312]},{"vertices":[7,567,566],"normals":[311,311,311]},{"vertices":[567,10,575],"normals":[310,310,310]},{"vertices":[10,568,575],"normals":[323,323,323]},{"vertices":[568,13,569],"normals":[359,359,359]},{"vertices":[13,570,569],"normals":[320,320,320]},{"vertices":[570,17,572],"normals":[319,319,319]},{"vertices":[17,573,572],"normals":[317,318,360]},{"vertices":[573,0,574],"normals":[316,316,316]},{"vertices":[0,21,1],"normals":[0,0,0]},{"vertices":[2,1,3],"normals":[1,1,1]},{"vertices":[3,6,5],"normals":[3,3,3]},{"vertices":[6,24,7],"normals":[4,4,4]},{"vertices":[7,24,8],"normals":[5,5,5]},{"vertices":[8,27,10],"normals":[6,6,6]},{"vertices":[10,27,11],"normals":[7,7,7]},{"vertices":[11,29,13],"normals":[8,8,8]},{"vertices":[13,29,14],"normals":[10,10,10]},{"vertices":[15,14,16],"normals":[11,11,11]},{"vertices":[16,19,18],"normals":[12,361,13]},{"vertices":[19,21,0],"normals":[14,14,14]},{"vertices":[20,33,1],"normals":[15,15,15]},{"vertices":[1,33,22],"normals":[16,16,16]},{"vertices":[3,22,23],"normals":[17,17,17]},{"vertices":[23,37,24],"normals":[18,18,18]},{"vertices":[24,37,25],"normals":[20,20,20]},{"vertices":[8,25,26],"normals":[22,22,22]},{"vertices":[26,28,11],"normals":[23,23,23]},{"vertices":[28,40,29],"normals":[24,25,25]},{"vertices":[29,40,30],"normals":[26,26,26]},{"vertices":[30,42,16],"normals":[27,27,27]},{"vertices":[16,42,31],"normals":[28,28,28]},{"vertices":[19,31,20],"normals":[30,30,30]},{"vertices":[32,34,33],"normals":[31,31,31]},{"vertices":[34,46,22],"normals":[32,32,32]},{"vertices":[22,46,35],"normals":[33,33,33]},{"vertices":[23,35,36],"normals":[34,34,34]},{"vertices":[36,49,25],"normals":[35,35,35]},{"vertices":[25,49,38],"normals":[36,36,36]},{"vertices":[38,51,28],"normals":[37,37,37]},{"vertices":[28,51,39],"normals":[38,38,38]},{"vertices":[40,39,41],"normals":[39,39,39]},{"vertices":[41,54,42],"normals":[40,40,40]},{"vertices":[42,54,43],"normals":[41,41,41]},{"vertices":[31,43,32],"normals":[43,43,43]},{"vertices":[32,56,44],"normals":[44,44,44]},{"vertices":[34,44,45],"normals":[45,45,45]},{"vertices":[46,45,47],"normals":[46,46,46]},{"vertices":[47,60,36],"normals":[47,47,47]},{"vertices":[36,60,48],"normals":[48,48,48]},{"vertices":[49,48,50],"normals":[50,50,50]},{"vertices":[50,52,51],"normals":[51,51,51]},{"vertices":[52,64,39],"normals":[52,52,52]},{"vertices":[39,64,53],"normals":[54,54,54]},{"vertices":[53,55,54],"normals":[55,55,55]},{"vertices":[55,67,43],"normals":[56,56,56]},{"vertices":[43,67,56],"normals":[57,57,57]},{"vertices":[57,58,44],"normals":[58,362,58]},{"vertices":[58,69,45],"normals":[59,59,59]},{"vertices":[45,69,59],"normals":[60,60,60]},{"vertices":[59,72,60],"normals":[61,61,61]},{"vertices":[60,72,61],"normals":[62,62,62]},{"vertices":[61,74,50],"normals":[63,64,64]},{"vertices":[50,74,62],"normals":[65,65,66]},{"vertices":[52,62,63],"normals":[67,67,67]},{"vertices":[64,63,65],"normals":[68,68,68]},{"vertices":[65,66,55],"normals":[69,69,69]},{"vertices":[66,79,67],"normals":[70,70,70]},{"vertices":[67,79,57],"normals":[71,363,71]},{"vertices":[57,80,68],"normals":[72,72,72]},{"vertices":[68,70,69],"normals":[73,73,73]},{"vertices":[70,71,59],"normals":[74,74,74]},{"vertices":[71,84,72],"normals":[75,75,75]},{"vertices":[72,84,73],"normals":[76,76,76]},{"vertices":[73,75,74],"normals":[77,77,77]},{"vertices":[75,76,62],"normals":[78,78,78]},{"vertices":[76,87,63],"normals":[79,79,79]},{"vertices":[63,87,77],"normals":[80,80,80]},{"vertices":[77,90,66],"normals":[81,81,81]},{"vertices":[66,90,78],"normals":[82,83,83]},{"vertices":[79,78,80],"normals":[84,84,84]},{"vertices":[80,93,81],"normals":[85,85,85]},{"vertices":[68,81,82],"normals":[86,86,86]},{"vertices":[82,96,71],"normals":[87,87,87]},{"vertices":[71,96,83],"normals":[88,88,88]},{"vertices":[83,99,73],"normals":[89,89,89]},{"vertices":[73,99,85],"normals":[90,90,90]},{"vertices":[85,101,76],"normals":[91,91,91]},{"vertices":[76,101,86],"normals":[92,92,92]},{"vertices":[87,86,88],"normals":[93,93,93]},{"vertices":[77,88,89],"normals":[94,94,94]},{"vertices":[89,91,78],"normals":[95,95,95]},{"vertices":[91,93,80],"normals":[96,96,96]},{"vertices":[92,94,81],"normals":[97,97,97]},{"vertices":[94,95,82],"normals":[98,98,98]},{"vertices":[95,107,96],"normals":[100,100,100]},{"vertices":[96,107,97],"normals":[101,101,101]},{"vertices":[83,97,98],"normals":[102,102,102]},{"vertices":[98,110,85],"normals":[103,104,104]},{"vertices":[85,110,100],"normals":[105,105,106]},{"vertices":[100,102,86],"normals":[107,107,107]},{"vertices":[102,113,88],"normals":[108,108,108]},{"vertices":[88,113,103],"normals":[109,109,109]},{"vertices":[89,103,104],"normals":[110,334,110]},{"vertices":[91,104,92],"normals":[111,111,111]},{"vertices":[92,115,105],"normals":[112,112,112]},{"vertices":[94,105,106],"normals":[113,113,113]},{"vertices":[106,108,107],"normals":[114,114,114]},{"vertices":[108,119,97],"normals":[115,115,115]},{"vertices":[97,119,109],"normals":[116,116,116]},{"vertices":[109,121,110],"normals":[117,117,117]},{"vertices":[110,121,111],"normals":[118,118,118]},{"vertices":[111,112,102],"normals":[119,337,119]},{"vertices":[112,124,113],"normals":[120,120,120]},{"vertices":[113,124,114],"normals":[121,121,121]},{"vertices":[114,127,104],"normals":[122,122,122]},{"vertices":[104,127,115],"normals":[123,123,123]},{"vertices":[116,129,105],"normals":[124,124,124]},{"vertices":[105,129,117],"normals":[125,125,125]},{"vertices":[117,131,108],"normals":[126,126,126]},{"vertices":[108,131,118],"normals":[127,127,127]},{"vertices":[118,120,109],"normals":[128,128,128]},{"vertices":[120,133,121],"normals":[129,129,129]},{"vertices":[121,133,122],"normals":[130,130,130]},{"vertices":[122,123,112],"normals":[131,132,132]},{"vertices":[123,125,124],"normals":[133,133,133]},{"vertices":[125,126,114],"normals":[134,134,134]},{"vertices":[126,138,127],"normals":[135,135,135]},{"vertices":[127,138,116],"normals":[136,136,136]},{"vertices":[116,141,128],"normals":[137,137,137]},{"vertices":[128,143,117],"normals":[138,138,138]},{"vertices":[117,143,130],"normals":[139,364,139]},{"vertices":[130,145,118],"normals":[140,140,140]},{"vertices":[118,145,132],"normals":[141,141,141]},{"vertices":[132,134,133],"normals":[142,142,142]},{"vertices":[134,148,122],"normals":[143,143,143]},{"vertices":[122,148,135],"normals":[144,144,144]},{"vertices":[123,135,136],"normals":[145,145,145]},{"vertices":[136,137,126],"normals":[146,146,146]},{"vertices":[137,139,138],"normals":[147,339,147]},{"vertices":[139,141,116],"normals":[148,148,148]},{"vertices":[140,142,128],"normals":[149,149,149]},{"vertices":[142,154,143],"normals":[150,150,150]},{"vertices":[143,154,144],"normals":[151,151,151]},{"vertices":[144,156,145],"normals":[152,152,152]},{"vertices":[145,156,146],"normals":[153,153,153]},{"vertices":[132,146,147],"normals":[154,154,154]},{"vertices":[147,149,148],"normals":[155,155,155]},{"vertices":[149,160,135],"normals":[156,344,156]},{"vertices":[135,160,150],"normals":[157,157,157]},{"vertices":[150,163,137],"normals":[158,158,158]},{"vertices":[137,163,151],"normals":[159,160,160]},{"vertices":[139,151,140],"normals":[161,161,161]},{"vertices":[152,166,142],"normals":[162,162,162]},{"vertices":[142,166,153],"normals":[163,163,163]},{"vertices":[153,168,144],"normals":[165,165,165]},{"vertices":[144,168,155],"normals":[166,166,166]},{"vertices":[155,157,146],"normals":[167,167,167]},{"vertices":[157,158,147],"normals":[168,168,168]},{"vertices":[158,159,149],"normals":[169,169,169]},{"vertices":[159,173,160],"normals":[170,170,170]},{"vertices":[160,173,161],"normals":[172,172,172]},{"vertices":[150,161,162],"normals":[173,173,173]},{"vertices":[162,164,151],"normals":[174,365,174]},{"vertices":[164,152,140],"normals":[175,175,175]},{"vertices":[152,176,165],"normals":[176,176,176]},{"vertices":[166,165,167],"normals":[177,177,177]},{"vertices":[167,169,168],"normals":[178,178,178]},{"vertices":[169,180,155],"normals":[179,179,179]},{"vertices":[155,180,170],"normals":[180,180,180]},{"vertices":[157,170,171],"normals":[181,181,181]},{"vertices":[171,172,159],"normals":[182,182,182]},{"vertices":[172,174,173],"normals":[183,349,183]},{"vertices":[174,186,161],"normals":[184,184,184]},{"vertices":[161,186,175],"normals":[185,185,185]},{"vertices":[175,189,164],"normals":[186,186,186]},{"vertices":[164,189,176],"normals":[187,187,187]},{"vertices":[177,191,165],"normals":[188,188,188]},{"vertices":[165,191,178],"normals":[189,189,189]},{"vertices":[167,178,179],"normals":[190,190,190]},{"vertices":[179,181,180],"normals":[191,191,191]},{"vertices":[181,195,170],"normals":[192,192,192]},{"vertices":[170,195,182],"normals":[193,193,193]},{"vertices":[171,182,183],"normals":[194,194,194]},{"vertices":[172,183,184],"normals":[195,350,195]},{"vertices":[174,184,185],"normals":[196,196,196]},{"vertices":[186,185,187],"normals":[197,197,197]},{"vertices":[175,187,188],"normals":[198,366,198]},{"vertices":[189,188,177],"normals":[199,199,199]},{"vertices":[177,200,190],"normals":[200,200,200]},{"vertices":[191,190,192],"normals":[201,201,201]},{"vertices":[192,203,179],"normals":[202,202,202]},{"vertices":[179,203,193],"normals":[203,203,203]},{"vertices":[181,193,194],"normals":[204,204,204]},{"vertices":[194,207,182],"normals":[205,205,205]},{"vertices":[182,207,196],"normals":[206,206,206]},{"vertices":[196,197,184],"normals":[207,207,207]},{"vertices":[197,211,185],"normals":[209,209,209]},{"vertices":[185,211,198],"normals":[210,210,210]},{"vertices":[198,199,188],"normals":[211,211,211]},{"vertices":[199,200,177],"normals":[213,213,213]},{"vertices":[200,214,201],"normals":[214,214,214]},{"vertices":[201,202,192],"normals":[215,367,215]},{"vertices":[202,204,203],"normals":[216,216,216]},{"vertices":[204,205,193],"normals":[217,217,217]},{"vertices":[205,206,194],"normals":[218,218,218]},{"vertices":[206,219,207],"normals":[219,351,219]},{"vertices":[207,219,208],"normals":[220,353,220]},{"vertices":[196,208,209],"normals":[221,352,221]},{"vertices":[197,209,210],"normals":[222,222,222]},{"vertices":[211,210,212],"normals":[223,223,223]},{"vertices":[198,212,213],"normals":[224,224,224]},{"vertices":[213,214,200],"normals":[226,226,226]},{"vertices":[214,223,215],"normals":[227,227,227]},{"vertices":[215,226,202],"normals":[228,228,228]},{"vertices":[202,226,216],"normals":[229,229,229]},{"vertices":[216,217,205],"normals":[230,230,230]},{"vertices":[217,229,206],"normals":[231,231,231]},{"vertices":[206,229,218],"normals":[232,232,232]},{"vertices":[218,220,208],"normals":[233,233,233]},{"vertices":[220,232,209],"normals":[234,235,235]},{"vertices":[209,232,221],"normals":[236,236,236]},{"vertices":[221,222,212],"normals":[237,237,237]},{"vertices":[222,235,213],"normals":[238,238,238]},{"vertices":[213,235,223],"normals":[239,239,239]},{"vertices":[223,238,224],"normals":[240,240,240]},{"vertices":[215,224,225],"normals":[241,241,241]},{"vertices":[225,227,216],"normals":[242,242,242]},{"vertices":[227,242,217],"normals":[243,243,243]},{"vertices":[217,242,228],"normals":[244,244,244]},{"vertices":[228,230,218],"normals":[245,245,245]},{"vertices":[230,231,220],"normals":[246,246,246]},{"vertices":[231,246,232],"normals":[247,368,247]},{"vertices":[232,246,233],"normals":[248,248,248]},{"vertices":[221,233,234],"normals":[249,249,249]},{"vertices":[234,236,235],"normals":[250,369,250]},{"vertices":[236,238,223],"normals":[251,251,251]},{"vertices":[237,250,224],"normals":[252,252,252]},{"vertices":[224,250,239],"normals":[254,254,254]},{"vertices":[225,239,240],"normals":[255,255,255]},{"vertices":[227,240,241],"normals":[256,256,256]},{"vertices":[242,241,243],"normals":[257,257,257]},{"vertices":[228,243,244],"normals":[258,370,258]},{"vertices":[244,245,231],"normals":[259,371,259]},{"vertices":[245,257,246],"normals":[260,260,261]},{"vertices":[246,257,247],"normals":[262,262,262]},{"vertices":[233,247,248],"normals":[263,263,263]},{"vertices":[248,260,236],"normals":[264,264,264]},{"vertices":[236,260,237],"normals":[265,265,265]},{"vertices":[237,261,249],"normals":[267,267,267]},{"vertices":[249,251,239],"normals":[268,268,268]},{"vertices":[251,252,240],"normals":[269,269,269]},{"vertices":[252,253,241],"normals":[270,270,270]},{"vertices":[253,254,243],"normals":[271,271,271]},{"vertices":[254,266,244],"normals":[272,272,272]},{"vertices":[244,266,255],"normals":[273,273,273]},{"vertices":[245,255,256],"normals":[274,274,274]},{"vertices":[257,256,258],"normals":[276,276,276]},{"vertices":[247,258,259],"normals":[277,277,277]},{"vertices":[259,271,260],"normals":[278,278,278]},{"vertices":[260,271,261],"normals":[279,279,279]},{"vertices":[261,272,262],"normals":[280,280,280]},{"vertices":[262,274,251],"normals":[281,281,281]},{"vertices":[251,274,263],"normals":[283,283,283]},{"vertices":[263,276,253],"normals":[284,284,284]},{"vertices":[253,276,264],"normals":[285,285,285]},{"vertices":[254,264,265],"normals":[287,287,287]},{"vertices":[265,267,255],"normals":[288,288,288]},{"vertices":[267,268,256],"normals":[289,289,289]},{"vertices":[268,269,258],"normals":[291,291,291]},{"vertices":[269,282,259],"normals":[292,292,292]},{"vertices":[259,282,270],"normals":[293,372,293]},{"vertices":[270,272,261],"normals":[294,294,294]},{"vertices":[272,284,273],"normals":[295,295,295]},{"vertices":[273,287,274],"normals":[296,296,296]},{"vertices":[274,287,275],"normals":[298,298,298]},{"vertices":[275,277,276],"normals":[299,299,299]},{"vertices":[277,291,264],"normals":[301,373,301]},{"vertices":[264,291,278],"normals":[302,302,302]},{"vertices":[265,278,279],"normals":[303,303,303]},{"vertices":[267,279,280],"normals":[304,304,304]},{"vertices":[268,280,281],"normals":[306,306,306]},{"vertices":[281,295,282],"normals":[307,307,307]},{"vertices":[282,295,283],"normals":[308,308,308]},{"vertices":[283,284,272],"normals":[309,309,309]},{"vertices":[284,298,285],"normals":[310,310,310]},{"vertices":[273,285,286],"normals":[311,374,311]},{"vertices":[287,286,288],"normals":[312,312,312]},{"vertices":[275,288,289],"normals":[313,313,313]},{"vertices":[277,289,290],"normals":[314,375,314]},{"vertices":[291,290,292],"normals":[315,315,315]},{"vertices":[292,304,279],"normals":[316,316,316]},{"vertices":[279,304,293],"normals":[317,317,317]},{"vertices":[280,293,294],"normals":[319,319,319]},{"vertices":[294,307,295],"normals":[320,320,320]},{"vertices":[295,307,296],"normals":[321,359,322]},{"vertices":[296,298,284],"normals":[323,323,323]},{"vertices":[297,299,285],"normals":[6,6,6]},{"vertices":[299,300,286],"normals":[5,5,5]},{"vertices":[300,310,288],"normals":[4,4,4]},{"vertices":[288,310,301],"normals":[3,3,3]},{"vertices":[289,301,302],"normals":[325,1,325]},{"vertices":[302,313,292],"normals":[0,0,0]},{"vertices":[292,313,303],"normals":[14,14,14]},{"vertices":[303,305,293],"normals":[13,12,13]},{"vertices":[305,317,294],"normals":[11,11,11]},{"vertices":[294,317,306],"normals":[10,10,10]},{"vertices":[306,319,296],"normals":[9,376,9]},{"vertices":[296,319,297],"normals":[7,7,7]},{"vertices":[297,322,308],"normals":[22,22,22]},{"vertices":[299,308,309],"normals":[20,21,20]},{"vertices":[309,311,310],"normals":[19,19,19]},{"vertices":[311,325,301],"normals":[17,377,17]},{"vertices":[301,325,312],"normals":[16,16,16]},{"vertices":[312,314,313],"normals":[15,15,15]},{"vertices":[314,315,303],"normals":[30,30,30]},{"vertices":[315,316,305],"normals":[29,28,29]},{"vertices":[316,329,317],"normals":[27,27,27]},{"vertices":[317,329,318],"normals":[26,26,26]},{"vertices":[318,320,319],"normals":[24,24,24]},{"vertices":[320,322,297],"normals":[23,23,23]},{"vertices":[321,332,308],"normals":[36,36,36]},{"vertices":[308,332,323],"normals":[35,35,35]},{"vertices":[323,335,311],"normals":[34,34,34]},{"vertices":[311,335,324],"normals":[33,33,33]},{"vertices":[325,324,326],"normals":[32,378,32]},{"vertices":[326,339,314],"normals":[31,31,31]},{"vertices":[314,339,327],"normals":[43,43,43]},{"vertices":[327,328,316],"normals":[42,41,41]},{"vertices":[328,342,329],"normals":[40,40,40]},{"vertices":[329,342,330],"normals":[39,39,39]},{"vertices":[330,345,320],"normals":[38,379,38]},{"vertices":[320,345,321],"normals":[37,37,37]},{"vertices":[331,333,332],"normals":[50,50,50]},{"vertices":[333,334,323],"normals":[48,48,48]},{"vertices":[334,336,335],"normals":[47,47,47]},{"vertices":[336,350,324],"normals":[46,46,46]},{"vertices":[324,350,337],"normals":[45,45,45]},{"vertices":[326,337,338],"normals":[44,44,44]},{"vertices":[338,340,327],"normals":[57,57,57]},{"vertices":[340,341,328],"normals":[56,56,56]},{"vertices":[341,343,342],"normals":[55,55,55]},{"vertices":[343,355,330],"normals":[54,54,54]},{"vertices":[330,355,344],"normals":[52,53,52]},{"vertices":[345,344,331],"normals":[51,51,51]},{"vertices":[346,347,333],"normals":[64,64,64]},{"vertices":[347,348,334],"normals":[62,62,62]},{"vertices":[348,349,336],"normals":[61,61,61]},{"vertices":[349,360,350],"normals":[60,60,60]},{"vertices":[350,360,351],"normals":[59,59,59]},{"vertices":[351,363,338],"normals":[58,58,58]},{"vertices":[338,363,352],"normals":[71,71,71]},{"vertices":[352,353,341],"normals":[328,328,328]},{"vertices":[353,367,343],"normals":[69,69,69]},{"vertices":[343,367,354],"normals":[68,68,68]},{"vertices":[354,356,344],"normals":[329,329,329]},{"vertices":[356,346,331],"normals":[65,65,65]},{"vertices":[357,358,347],"normals":[77,77,77]},{"vertices":[358,371,348],"normals":[76,76,76]},{"vertices":[348,371,359],"normals":[75,75,75]},{"vertices":[359,361,360],"normals":[74,74,74]},{"vertices":[361,362,351],"normals":[73,73,73]},{"vertices":[362,375,363],"normals":[72,72,72]},{"vertices":[363,375,364],"normals":[84,84,84]},{"vertices":[352,364,365],"normals":[82,82,82]},{"vertices":[353,365,366],"normals":[81,81,81]},{"vertices":[366,368,354],"normals":[80,80,80]},{"vertices":[368,380,356],"normals":[79,79,79]},{"vertices":[356,380,357],"normals":[78,78,78]},{"vertices":[369,370,358],"normals":[90,90,90]},{"vertices":[370,372,371],"normals":[89,89,89]},{"vertices":[372,383,359],"normals":[88,88,88]},{"vertices":[359,383,373],"normals":[87,87,87]},{"vertices":[373,385,362],"normals":[86,86,86]},{"vertices":[362,385,374],"normals":[85,85,85]},{"vertices":[374,376,364],"normals":[96,96,96]},{"vertices":[376,377,365],"normals":[331,331,331]},{"vertices":[377,389,366],"normals":[94,94,94]},{"vertices":[366,389,378],"normals":[93,93,93]},{"vertices":[368,378,379],"normals":[332,92,332]},{"vertices":[379,369,357],"normals":[91,91,91]},{"vertices":[369,394,381],"normals":[104,104,104]},{"vertices":[381,396,372],"normals":[102,102,102]},{"vertices":[372,396,382],"normals":[101,101,101]},{"vertices":[383,382,384],"normals":[100,100,100]},{"vertices":[384,386,385],"normals":[98,99,98]},{"vertices":[386,387,374],"normals":[97,97,97]},{"vertices":[387,400,376],"normals":[111,111,111]},{"vertices":[376,400,388],"normals":[334,110,334]},{"vertices":[388,390,389],"normals":[109,109,109]},{"vertices":[390,391,378],"normals":[108,108,108]},{"vertices":[391,392,379],"normals":[335,335,107]},{"vertices":[392,394,369],"normals":[105,105,105]},{"vertices":[393,395,381],"normals":[117,117,117]},{"vertices":[395,397,396],"normals":[116,116,116]},{"vertices":[397,407,382],"normals":[115,115,115]},{"vertices":[382,407,398],"normals":[114,114,114]},{"vertices":[398,409,386],"normals":[113,113,113]},{"vertices":[386,409,399],"normals":[112,112,112]},{"vertices":[399,412,400],"normals":[123,123,123]},{"vertices":[400,412,401],"normals":[122,122,122]},{"vertices":[401,414,390],"normals":[121,121,121]},{"vertices":[390,414,402],"normals":[120,120,120]},{"vertices":[391,402,403],"normals":[337,337,337]},{"vertices":[403,393,394],"normals":[118,118,118]},{"vertices":[404,405,395],"normals":[129,129,129]},{"vertices":[405,418,397],"normals":[128,128,128]},{"vertices":[397,418,406],"normals":[127,127,127]},{"vertices":[406,421,398],"normals":[126,126,126]},{"vertices":[398,421,408],"normals":[125,125,125]},{"vertices":[409,408,410],"normals":[124,124,124]},{"vertices":[399,410,411],"normals":[136,136,136]},{"vertices":[412,411,413],"normals":[135,135,135]},{"vertices":[413,426,414],"normals":[134,134,134]},{"vertices":[414,426,415],"normals":[133,133,133]},{"vertices":[415,416,403],"normals":[131,131,131]},{"vertices":[416,404,393],"normals":[130,130,130]},{"vertices":[404,429,417],"normals":[142,142,142]},{"vertices":[417,431,418],"normals":[141,141,141]},{"vertices":[418,431,419],"normals":[140,140,140]},{"vertices":[406,419,420],"normals":[139,139,139]},{"vertices":[420,422,408],"normals":[138,138,138]},{"vertices":[422,434,410],"normals":[137,137,137]},{"vertices":[410,434,423],"normals":[148,148,148]},{"vertices":[411,423,424],"normals":[147,147,339]},{"vertices":[413,424,425],"normals":[146,146,146]},{"vertices":[426,425,427],"normals":[145,145,145]},{"vertices":[415,427,428],"normals":[340,340,340]},{"vertices":[428,429,404],"normals":[143,143,143]},{"vertices":[429,439,430],"normals":[154,154,154]},{"vertices":[430,441,431],"normals":[153,153,153]},{"vertices":[431,441,432],"normals":[152,152,152]},{"vertices":[432,444,420],"normals":[151,151,151]},{"vertices":[420,444,433],"normals":[342,150,342]},{"vertices":[433,435,434],"normals":[149,149,149]},{"vertices":[435,436,423],"normals":[161,161,161]},{"vertices":[436,437,424],"normals":[160,160,160]},{"vertices":[437,448,425],"normals":[158,158,158]},{"vertices":[425,448,438],"normals":[157,157,157]},{"vertices":[438,450,428],"normals":[156,156,344]},{"vertices":[428,450,439],"normals":[155,155,155]},{"vertices":[439,453,440],"normals":[168,168,168]},{"vertices":[440,442,441],"normals":[167,167,167]},{"vertices":[442,455,432],"normals":[166,166,166]},{"vertices":[432,455,443],"normals":[165,165,165]},{"vertices":[443,445,433],"normals":[163,163,163]},{"vertices":[445,446,435],"normals":[162,162,162]},{"vertices":[446,459,436],"normals":[175,175,175]},{"vertices":[436,459,447],"normals":[174,174,174]},{"vertices":[447,461,448],"normals":[173,173,173]},{"vertices":[448,461,449],"normals":[172,172,172]},{"vertices":[449,451,450],"normals":[345,345,345]},{"vertices":[451,453,439],"normals":[169,169,169]},{"vertices":[452,465,440],"normals":[181,181,181]},{"vertices":[440,465,454],"normals":[180,180,180]},{"vertices":[454,468,455],"normals":[346,346,346]},{"vertices":[455,468,456],"normals":[178,380,178]},{"vertices":[456,457,445],"normals":[177,177,177]},{"vertices":[457,458,446],"normals":[176,176,176]},{"vertices":[458,471,459],"normals":[187,187,187]},{"vertices":[459,471,460],"normals":[186,186,348]},{"vertices":[460,474,461],"normals":[185,185,185]},{"vertices":[461,474,462],"normals":[184,184,184]},{"vertices":[449,462,463],"normals":[349,349,349]},{"vertices":[451,463,452],"normals":[182,182,182]},{"vertices":[464,466,465],"normals":[193,193,193]},{"vertices":[466,478,454],"normals":[192,192,192]},{"vertices":[454,478,467],"normals":[191,191,191]},{"vertices":[467,480,456],"normals":[190,190,190]},{"vertices":[456,480,469],"normals":[189,189,189]},{"vertices":[457,469,470],"normals":[188,188,188]},{"vertices":[470,472,471],"normals":[199,199,199]},{"vertices":[472,484,460],"normals":[198,366,198]},{"vertices":[460,484,473],"normals":[197,197,197]},{"vertices":[473,486,462],"normals":[196,196,196]},{"vertices":[462,486,475],"normals":[350,195,350]},{"vertices":[463,475,464],"normals":[194,194,194]},{"vertices":[476,477,466],"normals":[205,205,205]},{"vertices":[477,490,478],"normals":[204,204,204]},{"vertices":[478,490,479],"normals":[203,203,203]},{"vertices":[479,481,480],"normals":[202,202,202]},{"vertices":[481,493,469],"normals":[201,201,201]},{"vertices":[469,493,482],"normals":[200,200,200]},{"vertices":[482,496,472],"normals":[213,213,213]},{"vertices":[472,496,483],"normals":[211,211,211]},{"vertices":[484,483,485],"normals":[210,210,210]},{"vertices":[485,500,486],"normals":[209,209,209]},{"vertices":[486,500,487],"normals":[208,207,207]},{"vertices":[475,487,476],"normals":[206,206,206]},{"vertices":[488,489,477],"normals":[351,351,351]},{"vertices":[489,504,490],"normals":[218,218,218]},{"vertices":[490,504,491],"normals":[217,217,217]},{"vertices":[491,492,481],"normals":[216,216,216]},{"vertices":[492,494,493],"normals":[215,215,215]},{"vertices":[494,507,482],"normals":[214,214,214]},{"vertices":[482,507,495],"normals":[226,226,226]},{"vertices":[496,495,497],"normals":[224,224,224]},{"vertices":[483,497,498],"normals":[223,223,223]},{"vertices":[485,498,499],"normals":[222,222,222]},{"vertices":[500,499,501],"normals":[352,352,352]},{"vertices":[487,501,488],"normals":[353,353,353]},{"vertices":[502,514,489],"normals":[232,232,232]},{"vertices":[489,514,503],"normals":[231,231,231]},{"vertices":[503,516,491],"normals":[230,230,230]},{"vertices":[491,516,505],"normals":[229,229,229]},{"vertices":[505,506,494],"normals":[228,228,228]},{"vertices":[506,519,507],"normals":[227,227,227]},{"vertices":[507,519,508],"normals":[239,239,239]},{"vertices":[495,508,509],"normals":[354,354,354]},{"vertices":[497,509,510],"normals":[237,237,237]},{"vertices":[498,510,511],"normals":[236,236,236]},{"vertices":[499,511,512],"normals":[234,234,234]},{"vertices":[512,502,488],"normals":[233,233,233]},{"vertices":[502,524,513],"normals":[245,245,245]},{"vertices":[513,527,503],"normals":[244,244,244]},{"vertices":[503,527,515],"normals":[243,243,243]},{"vertices":[516,515,517],"normals":[242,242,242]},{"vertices":[517,529,506],"normals":[241,241,241]},{"vertices":[506,529,518],"normals":[240,240,240]},{"vertices":[518,520,508],"normals":[251,251,251]},{"vertices":[520,521,509],"normals":[250,250,250]},{"vertices":[521,534,510],"normals":[249,249,249]},{"vertices":[510,534,522],"normals":[248,248,248]},{"vertices":[511,522,523],"normals":[247,368,247]},{"vertices":[523,524,502],"normals":[246,246,246]},{"vertices":[524,537,525],"normals":[258,258,258]},{"vertices":[513,525,526],"normals":[257,257,257]},{"vertices":[526,540,515],"normals":[256,256,256]},{"vertices":[515,540,528],"normals":[255,255,255]},{"vertices":[528,530,529],"normals":[254,254,254]},{"vertices":[530,531,518],"normals":[253,253,253]},{"vertices":[531,532,520],"normals":[266,266,266]},{"vertices":[532,533,521],"normals":[264,264,264]},{"vertices":[533,545,534],"normals":[263,263,263]},{"vertices":[534,545,535],"normals":[262,262,262]},{"vertices":[522,535,536],"normals":[261,260,261]},{"vertices":[536,537,524],"normals":[259,259,259]},{"vertices":[537,549,538],"normals":[272,272,272]},{"vertices":[525,538,539],"normals":[271,271,271]},{"vertices":[539,552,540],"normals":[270,270,270]},{"vertices":[540,552,541],"normals":[269,269,269]},{"vertices":[528,541,542],"normals":[268,268,268]},{"vertices":[542,556,531],"normals":[267,267,267]},{"vertices":[531,556,543],"normals":[279,279,279]},{"vertices":[543,544,533],"normals":[357,278,357]},{"vertices":[544,559,545],"normals":[277,277,277]},{"vertices":[545,559,546],"normals":[276,276,276]},{"vertices":[546,547,536],"normals":[274,274,274]},{"vertices":[547,549,537],"normals":[273,273,273]},{"vertices":[548,563,538],"normals":[287,287,287]},{"vertices":[538,563,550],"normals":[285,285,285]},{"vertices":[539,550,551],"normals":[284,284,284]},{"vertices":[552,551,553],"normals":[283,283,283]},{"vertices":[541,553,554],"normals":[281,281,281]},{"vertices":[542,554,555],"normals":[280,280,280]},{"vertices":[555,557,543],"normals":[294,294,294]},{"vertices":[557,558,544],"normals":[293,293,293]},{"vertices":[558,560,559],"normals":[292,292,292]},{"vertices":[560,571,546],"normals":[291,291,291]},{"vertices":[546,571,561],"normals":[289,289,289]},{"vertices":[547,561,548],"normals":[288,288,288]},{"vertices":[548,574,562],"normals":[302,302,302]},{"vertices":[563,562,564],"normals":[301,301,301]},{"vertices":[550,564,565],"normals":[299,299,299]},{"vertices":[551,565,566],"normals":[298,298,298]},{"vertices":[566,567,554],"normals":[296,296,296]},{"vertices":[567,575,555],"normals":[295,295,295]},{"vertices":[555,575,568],"normals":[309,309,309]},{"vertices":[557,568,569],"normals":[308,308,308]},{"vertices":[569,570,560],"normals":[307,307,307]},{"vertices":[570,572,571],"normals":[306,306,306]},{"vertices":[572,573,561],"normals":[305,305,305]},{"vertices":[573,574,548],"normals":[303,303,303]},{"vertices":[0,2,562],"normals":[315,315,315]},{"vertices":[2,4,564],"normals":[314,381,314]},{"vertices":[4,5,565],"normals":[313,313,313]},{"vertices":[565,5,7],"normals":[312,312,312]},{"vertices":[7,9,567],"normals":[311,311,311]},{"vertices":[567,9,10],"normals":[310,310,310]},{"vertices":[10,12,568],"normals":[323,323,323]},{"vertices":[568,12,13],"normals":[359,322,359]},{"vertices":[13,15,570],"normals":[320,320,320]},{"vertices":[570,15,17],"normals":[319,319,319]},{"vertices":[17,18,573],"normals":[317,317,318]},{"vertices":[573,18,0],"normals":[316,316,316]}]},{"name":"Cube","vertices":[{"x":4.972984,"y":2.003551,"z":-5.020239},{"x":4.972984,"y":0.003551,"z":-7.02024},{"x":4.972984,"y":0.003551,"z":-5.02024},{"x":4.972984,"y":2.003551,"z":-7.020239},{"x":6.972984,"y":0.003551,"z":-7.02024},{"x":6.972984,"y":2.003551,"z":-7.020239},{"x":6.972984,"y":0.003551,"z":-5.02024},{"x":6.972984,"y":2.003551,"z":-5.020239}],"normals":[{"x":-1,"y":0,"z":0},{"x":0,"y":0,"z":-1},{"x":1,"y":0,"z":0},{"x":0,"y":0,"z":1},{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0}],"faces":[{"vertices":[0,1,2],"normals":[0,0,0]},{"vertices":[3,4,1],"normals":[1,1,1]},{"vertices":[5,6,4],"normals":[2,2,2]},{"vertices":[7,2,6],"normals":[3,3,3]},{"vertices":[4,2,1],"normals":[4,4,4]},{"vertices":[3,7,5],"normals":[5,5,5]},{"vertices":[0,3,1],"normals":[0,0,0]},{"vertices":[3,5,4],"normals":[1,1,1]},{"vertices":[5,7,6],"normals":[2,2,2]},{"vertices":[7,0,2],"normals":[3,3,3]},{"vertices":[4,6,2],"normals":[4,4,4]},{"vertices":[3,0,7],"normals":[5,5,5]}]}]

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = [{"name":"Plane.003","vertices":[{"x":-3,"y":0.063801,"z":3},{"x":3,"y":0.063801,"z":3},{"x":-3,"y":0.063801,"z":-3},{"x":3,"y":0.063801,"z":-3},{"x":-3,"y":0.152405,"z":3},{"x":3,"y":0.152405,"z":3},{"x":-3,"y":0.152405,"z":-3},{"x":3,"y":0.152405,"z":-3},{"x":-3,"y":-0.297755,"z":3},{"x":3,"y":-0.297755,"z":3},{"x":-3,"y":-0.297755,"z":-3},{"x":3,"y":-0.297755,"z":-3},{"x":-3,"y":-0.209151,"z":3},{"x":3,"y":-0.209151,"z":3},{"x":-3,"y":-0.209151,"z":-3},{"x":3,"y":-0.209151,"z":-3},{"x":-3,"y":-0.149846,"z":3},{"x":3,"y":-0.149846,"z":3},{"x":-3,"y":-0.149846,"z":-3},{"x":3,"y":-0.149846,"z":-3},{"x":-3,"y":-0.061242,"z":3},{"x":3,"y":-0.061242,"z":3},{"x":-3,"y":-0.061242,"z":-3},{"x":3,"y":-0.061242,"z":-3},{"x":-3,"y":0.211711,"z":3},{"x":3,"y":0.211711,"z":3},{"x":-3,"y":0.211711,"z":-3},{"x":3,"y":0.211711,"z":-3},{"x":-3,"y":0.300315,"z":3},{"x":3,"y":0.300315,"z":3},{"x":-3,"y":0.300315,"z":-3},{"x":3,"y":0.300315,"z":-3},{"x":-1.640155,"y":-0.149846,"z":1.203565},{"x":-1.640155,"y":-0.061242,"z":1.203565},{"x":-1.640155,"y":0.152405,"z":1.203565},{"x":-1.640155,"y":0.063801,"z":1.203565},{"x":-1.640155,"y":0.211711,"z":1.203565},{"x":-1.640155,"y":0.300315,"z":1.203565},{"x":-1.640155,"y":-0.209151,"z":1.203565},{"x":-1.640155,"y":-0.297755,"z":1.203565},{"x":1.667709,"y":-0.149846,"z":1.203565},{"x":1.667709,"y":-0.061242,"z":1.203565},{"x":1.667709,"y":0.152405,"z":1.203565},{"x":1.667709,"y":0.063801,"z":1.203565},{"x":1.667709,"y":0.211711,"z":1.203565},{"x":1.667709,"y":0.300315,"z":1.203565},{"x":1.667709,"y":-0.209151,"z":1.203565},{"x":1.667709,"y":-0.297755,"z":1.203565},{"x":-1.640155,"y":-0.149846,"z":-1.18718},{"x":-1.640155,"y":-0.061242,"z":-1.18718},{"x":-1.640155,"y":0.152405,"z":-1.18718},{"x":-1.640155,"y":0.063801,"z":-1.18718},{"x":-1.640155,"y":0.211711,"z":-1.18718},{"x":-1.640155,"y":0.300315,"z":-1.18718},{"x":-1.640155,"y":-0.209151,"z":-1.18718},{"x":-1.640155,"y":-0.297755,"z":-1.18718},{"x":1.667709,"y":-0.149846,"z":-1.18718},{"x":1.667709,"y":-0.061242,"z":-1.18718},{"x":1.667709,"y":0.152405,"z":-1.18718},{"x":1.667709,"y":0.063801,"z":-1.18718},{"x":1.667709,"y":0.211711,"z":-1.18718},{"x":1.667709,"y":0.300315,"z":-1.18718},{"x":1.667709,"y":-0.209151,"z":-1.18718},{"x":1.667709,"y":-0.297755,"z":-1.18718}],"normals":[{"x":0,"y":-1,"z":0},{"x":0,"y":1,"z":0},{"x":0,"y":0,"z":-1},{"x":0,"y":0,"z":1},{"x":1,"y":0,"z":0},{"x":-1,"y":0,"z":0}],"faces":[{"vertices":[0,35,1],"normals":[0,0,0]},{"vertices":[5,58,42],"normals":[1,1,1]},{"vertices":[2,7,3],"normals":[2,2,2]},{"vertices":[1,4,0],"normals":[3,3,3]},{"vertices":[3,5,1],"normals":[4,4,4]},{"vertices":[0,6,2],"normals":[5,5,5]},{"vertices":[8,39,9],"normals":[0,0,0]},{"vertices":[13,62,46],"normals":[1,1,1]},{"vertices":[10,15,11],"normals":[2,2,2]},{"vertices":[9,12,8],"normals":[3,3,3]},{"vertices":[11,13,9],"normals":[4,4,4]},{"vertices":[8,14,10],"normals":[5,5,5]},{"vertices":[16,32,17],"normals":[0,0,0]},{"vertices":[21,57,41],"normals":[1,1,1]},{"vertices":[18,23,19],"normals":[2,2,2]},{"vertices":[17,20,16],"normals":[3,3,3]},{"vertices":[19,21,17],"normals":[4,4,4]},{"vertices":[16,22,18],"normals":[5,5,5]},{"vertices":[24,36,25],"normals":[0,0,0]},{"vertices":[29,61,45],"normals":[1,1,1]},{"vertices":[26,31,27],"normals":[2,2,2]},{"vertices":[25,28,24],"normals":[3,3,3]},{"vertices":[27,29,25],"normals":[4,4,4]},{"vertices":[24,30,26],"normals":[5,5,5]},{"vertices":[55,10,11],"normals":[0,0,0]},{"vertices":[50,7,6],"normals":[1,1,1]},{"vertices":[62,55,63],"normals":[3,3,3]},{"vertices":[57,48,56],"normals":[3,3,3]},{"vertices":[58,51,59],"normals":[3,3,3]},{"vertices":[61,52,60],"normals":[3,3,3]},{"vertices":[53,31,30],"normals":[1,1,1]},{"vertices":[48,18,19],"normals":[0,0,0]},{"vertices":[52,26,27],"normals":[0,0,0]},{"vertices":[46,63,47],"normals":[5,5,5]},{"vertices":[41,56,40],"normals":[5,5,5]},{"vertices":[42,59,43],"normals":[5,5,5]},{"vertices":[45,60,44],"normals":[5,5,5]},{"vertices":[51,2,3],"normals":[0,0,0]},{"vertices":[38,47,39],"normals":[2,2,2]},{"vertices":[33,40,32],"normals":[2,2,2]},{"vertices":[34,43,35],"normals":[2,2,2]},{"vertices":[37,44,36],"normals":[2,2,2]},{"vertices":[54,39,55],"normals":[4,4,4]},{"vertices":[49,32,48],"normals":[4,4,4]},{"vertices":[50,35,51],"normals":[4,4,4]},{"vertices":[52,37,36],"normals":[4,4,4]},{"vertices":[54,15,14],"normals":[1,1,1]},{"vertices":[49,23,22],"normals":[1,1,1]},{"vertices":[0,2,51],"normals":[0,0,0]},{"vertices":[35,43,1],"normals":[0,0,0]},{"vertices":[0,51,35],"normals":[0,0,0]},{"vertices":[34,4,5],"normals":[1,1,1]},{"vertices":[5,7,58],"normals":[1,1,1]},{"vertices":[42,34,5],"normals":[1,1,1]},{"vertices":[2,6,7],"normals":[2,2,2]},{"vertices":[1,5,4],"normals":[3,3,3]},{"vertices":[3,7,5],"normals":[4,4,4]},{"vertices":[0,4,6],"normals":[5,5,5]},{"vertices":[8,10,55],"normals":[0,0,0]},{"vertices":[39,47,9],"normals":[0,0,0]},{"vertices":[8,55,39],"normals":[0,0,0]},{"vertices":[38,12,13],"normals":[1,1,1]},{"vertices":[13,15,62],"normals":[1,1,1]},{"vertices":[46,38,13],"normals":[1,1,1]},{"vertices":[10,14,15],"normals":[2,2,2]},{"vertices":[9,13,12],"normals":[3,3,3]},{"vertices":[11,15,13],"normals":[4,4,4]},{"vertices":[8,12,14],"normals":[5,5,5]},{"vertices":[16,18,48],"normals":[0,0,0]},{"vertices":[32,40,17],"normals":[0,0,0]},{"vertices":[16,48,32],"normals":[0,0,0]},{"vertices":[33,20,21],"normals":[1,1,1]},{"vertices":[21,23,57],"normals":[1,1,1]},{"vertices":[41,33,21],"normals":[1,1,1]},{"vertices":[18,22,23],"normals":[2,2,2]},{"vertices":[17,21,20],"normals":[3,3,3]},{"vertices":[19,23,21],"normals":[4,4,4]},{"vertices":[16,20,22],"normals":[5,5,5]},{"vertices":[24,26,52],"normals":[0,0,0]},{"vertices":[36,44,25],"normals":[0,0,0]},{"vertices":[24,52,36],"normals":[0,0,0]},{"vertices":[37,28,29],"normals":[1,1,1]},{"vertices":[29,31,61],"normals":[1,1,1]},{"vertices":[45,37,29],"normals":[1,1,1]},{"vertices":[26,30,31],"normals":[2,2,2]},{"vertices":[25,29,28],"normals":[3,3,3]},{"vertices":[27,31,29],"normals":[4,4,4]},{"vertices":[24,28,30],"normals":[5,5,5]},{"vertices":[11,9,63],"normals":[0,0,0]},{"vertices":[63,55,11],"normals":[0,0,0]},{"vertices":[9,47,63],"normals":[0,0,0]},{"vertices":[4,34,50],"normals":[1,1,1]},{"vertices":[50,58,7],"normals":[1,1,1]},{"vertices":[6,4,50],"normals":[1,1,1]},{"vertices":[62,54,55],"normals":[3,3,3]},{"vertices":[57,49,48],"normals":[3,3,3]},{"vertices":[58,50,51],"normals":[3,3,3]},{"vertices":[61,53,52],"normals":[3,3,3]},{"vertices":[28,37,53],"normals":[1,1,1]},{"vertices":[53,61,31],"normals":[1,1,1]},{"vertices":[30,28,53],"normals":[1,1,1]},{"vertices":[19,17,56],"normals":[0,0,0]},{"vertices":[56,48,19],"normals":[0,0,0]},{"vertices":[17,40,56],"normals":[0,0,0]},{"vertices":[27,25,60],"normals":[0,0,0]},{"vertices":[60,52,27],"normals":[0,0,0]},{"vertices":[25,44,60],"normals":[0,0,0]},{"vertices":[46,62,63],"normals":[5,5,5]},{"vertices":[41,57,56],"normals":[5,5,5]},{"vertices":[42,58,59],"normals":[5,5,5]},{"vertices":[45,61,60],"normals":[5,5,5]},{"vertices":[3,1,59],"normals":[0,0,0]},{"vertices":[59,51,3],"normals":[0,0,0]},{"vertices":[1,43,59],"normals":[0,0,0]},{"vertices":[38,46,47],"normals":[2,2,2]},{"vertices":[33,41,40],"normals":[2,2,2]},{"vertices":[34,42,43],"normals":[2,2,2]},{"vertices":[37,45,44],"normals":[2,2,2]},{"vertices":[54,38,39],"normals":[4,4,4]},{"vertices":[49,33,32],"normals":[4,4,4]},{"vertices":[50,34,35],"normals":[4,4,4]},{"vertices":[52,53,37],"normals":[4,4,4]},{"vertices":[12,38,54],"normals":[1,1,1]},{"vertices":[54,62,15],"normals":[1,1,1]},{"vertices":[14,12,54],"normals":[1,1,1]},{"vertices":[20,33,49],"normals":[1,1,1]},{"vertices":[49,57,23],"normals":[1,1,1]},{"vertices":[22,20,49],"normals":[1,1,1]}]},{"name":"Cube.001_Cube.003","vertices":[{"x":-1.106432,"y":1.11411,"z":1.126241},{"x":1.12966,"y":1.118437,"z":1.126241},{"x":-1.106432,"y":1.114111,"z":-1.109855},{"x":1.12966,"y":1.118437,"z":-1.109855},{"x":-1.102106,"y":-1.121982,"z":1.126241},{"x":1.133987,"y":-1.117655,"z":1.126241},{"x":-1.102106,"y":-1.121982,"z":-1.109856},{"x":1.133986,"y":-1.117655,"z":-1.109856}],"normals":[{"x":-0.0019,"y":1,"z":0},{"x":0,"y":0,"z":-1},{"x":0.0019,"y":-1,"z":0},{"x":0,"y":0,"z":1},{"x":-1,"y":-0.0019,"z":0},{"x":1,"y":0.0019,"z":0}],"faces":[{"vertices":[0,3,2],"normals":[0,0,0]},{"vertices":[3,6,2],"normals":[1,1,1]},{"vertices":[7,4,6],"normals":[2,2,2]},{"vertices":[5,0,4],"normals":[3,3,3]},{"vertices":[6,0,2],"normals":[4,4,4]},{"vertices":[3,5,7],"normals":[5,5,5]},{"vertices":[0,1,3],"normals":[0,0,0]},{"vertices":[3,7,6],"normals":[1,1,1]},{"vertices":[7,5,4],"normals":[2,2,2]},{"vertices":[5,1,0],"normals":[3,3,3]},{"vertices":[6,4,0],"normals":[4,4,4]},{"vertices":[3,1,5],"normals":[5,5,5]}]}]

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = [{"name":"Torus","vertices":[{"x":0.875,"y":0.109724,"z":0},{"x":0.875,"y":-0.109724,"z":0},{"x":0.788348,"y":0.109724,"z":-0.379648},{"x":0.788348,"y":-0.109724,"z":-0.379648},{"x":0.545553,"y":0.109724,"z":-0.684103},{"x":0.545553,"y":-0.109724,"z":-0.684103},{"x":0.194706,"y":0.109724,"z":-0.853062},{"x":0.194706,"y":-0.109724,"z":-0.853062},{"x":-0.194706,"y":0.109724,"z":-0.853062},{"x":-0.194706,"y":-0.109724,"z":-0.853062},{"x":-0.545554,"y":0.109724,"z":-0.684102},{"x":-0.545554,"y":-0.109724,"z":-0.684102},{"x":-0.788348,"y":0.109724,"z":-0.379648},{"x":-0.788348,"y":-0.109724,"z":-0.379648},{"x":-0.875,"y":0.109724,"z":0},{"x":-0.875,"y":-0.109724,"z":0},{"x":-0.788348,"y":0.109724,"z":0.379648},{"x":-0.788348,"y":-0.109724,"z":0.379648},{"x":-0.545554,"y":0.109724,"z":0.684102},{"x":-0.545554,"y":-0.109724,"z":0.684102},{"x":-0.194706,"y":0.109724,"z":0.853062},{"x":-0.194706,"y":-0.109724,"z":0.853062},{"x":0.194706,"y":0.109724,"z":0.853062},{"x":0.194706,"y":-0.109724,"z":0.853062},{"x":0.545553,"y":0.109724,"z":0.684103},{"x":0.545553,"y":-0.109724,"z":0.684103},{"x":0.788348,"y":0.109724,"z":0.379649},{"x":0.788348,"y":-0.109724,"z":0.379649},{"x":1.058178,"y":0.132694,"z":0},{"x":1.058178,"y":-0.132694,"z":0},{"x":0.953386,"y":0.132694,"z":-0.459126},{"x":0.953386,"y":-0.132694,"z":-0.459126},{"x":0.659763,"y":0.132694,"z":-0.827317},{"x":0.659763,"y":-0.132694,"z":-0.827317},{"x":0.235467,"y":0.132694,"z":-1.031648},{"x":0.235467,"y":-0.132694,"z":-1.031648},{"x":-0.235467,"y":0.132694,"z":-1.031648},{"x":-0.235467,"y":-0.132694,"z":-1.031648},{"x":-0.659764,"y":0.132694,"z":-0.827317},{"x":-0.659764,"y":-0.132694,"z":-0.827317},{"x":-0.953386,"y":0.132694,"z":-0.459127},{"x":-0.953386,"y":-0.132694,"z":-0.459127},{"x":-1.058178,"y":0.132694,"z":0},{"x":-1.058178,"y":-0.132694,"z":0},{"x":-0.953386,"y":0.132694,"z":0.459126},{"x":-0.953386,"y":-0.132694,"z":0.459126},{"x":-0.659764,"y":0.132694,"z":0.827317},{"x":-0.659764,"y":-0.132694,"z":0.827317},{"x":-0.235467,"y":0.132694,"z":1.031648},{"x":-0.235467,"y":-0.132694,"z":1.031648},{"x":0.235467,"y":0.132694,"z":1.031648},{"x":0.235467,"y":-0.132694,"z":1.031648},{"x":0.659763,"y":0.132694,"z":0.827318},{"x":0.659763,"y":-0.132694,"z":0.827318},{"x":0.953386,"y":0.132694,"z":0.459127},{"x":0.953386,"y":-0.132694,"z":0.459127},{"x":-1.319376,"y":0.07224,"z":-0.169652},{"x":-1.319376,"y":-0.07224,"z":-0.169652},{"x":-1.082066,"y":0.042375,"z":0.766739},{"x":-1.082066,"y":-0.042375,"z":0.766739},{"x":0.972525,"y":0.056632,"z":0.9041},{"x":1.097839,"y":0.056632,"z":0.746961},{"x":0.972525,"y":-0.056632,"z":0.9041},{"x":1.097839,"y":-0.056632,"z":0.746961},{"x":1.270045,"y":0.05269,"z":-0.385783},{"x":1.270045,"y":-0.05269,"z":-0.385783},{"x":-0.988298,"y":0.042375,"z":0.88432},{"x":-0.988298,"y":-0.042375,"z":0.88432},{"x":0.667196,"y":-0.05799,"z":-1.148277},{"x":0.481769,"y":-0.05799,"z":-1.237574},{"x":0.078068,"y":0.043994,"z":1.324047},{"x":0.078068,"y":-0.043994,"z":1.324047},{"x":-0.672469,"y":0.061288,"z":-1.145738},{"x":-0.672469,"y":-0.061288,"z":-1.145738},{"x":-0.078067,"y":0.043994,"z":1.324047},{"x":-0.078067,"y":-0.043994,"z":1.324047},{"x":-1.262326,"y":-0.07224,"z":-0.419605},{"x":-0.476497,"y":-0.061288,"z":-1.240113},{"x":1.311656,"y":0.05269,"z":-0.203473},{"x":1.311656,"y":-0.05269,"z":-0.203473},{"x":0.667196,"y":0.05799,"z":-1.148277},{"x":0.481769,"y":0.05799,"z":-1.237574},{"x":-1.262326,"y":0.07224,"z":-0.419605},{"x":-0.476497,"y":0.061288,"z":-1.240113}],"normals":[{"x":0.9749,"y":0,"z":-0.2225},{"x":0.7818,"y":0,"z":-0.6235},{"x":0.4339,"y":0,"z":-0.901},{"x":0,"y":0,"z":-1},{"x":-0.4339,"y":0,"z":-0.901},{"x":-0.7818,"y":0,"z":-0.6235},{"x":-0.9749,"y":0,"z":-0.2225},{"x":-0.9749,"y":0,"z":0.2225},{"x":-0.7818,"y":0,"z":0.6235},{"x":-0.4339,"y":0,"z":0.901},{"x":0,"y":0,"z":1},{"x":0.4339,"y":0,"z":0.901},{"x":0.7818,"y":0,"z":0.6235},{"x":0.9749,"y":0,"z":0.2225},{"x":-0.171,"y":0,"z":-0.9853},{"x":-0.8805,"y":0,"z":-0.474},{"x":-0.2573,"y":0.9645,"z":0.0587},{"x":0.5447,"y":0,"z":-0.8386},{"x":0,"y":-0.9569,"z":-0.2903},{"x":0.1269,"y":0,"z":0.9919},{"x":0.1029,"y":-0.9715,"z":0.2137},{"x":-0.1244,"y":0.9918,"z":0.0284},{"x":-0.0554,"y":0.9918,"z":0.1149},{"x":-0.0997,"y":-0.9918,"z":-0.0795},{"x":-0.1244,"y":-0.9918,"z":-0.0284},{"x":-0.1244,"y":0.9918,"z":-0.0284},{"x":0,"y":0.9918,"z":-0.1276},{"x":-0.0554,"y":0.9918,"z":-0.1149},{"x":0.0997,"y":0.9918,"z":-0.0795},{"x":0.1244,"y":-0.9918,"z":0.0284},{"x":-0.1244,"y":-0.9918,"z":0.0284},{"x":0.0997,"y":-0.9918,"z":0.0795},{"x":0,"y":0.9918,"z":0.1276},{"x":0,"y":-0.9918,"z":-0.1276},{"x":0.0997,"y":0.9918,"z":0.0795},{"x":0.1244,"y":0.9918,"z":0.0284},{"x":-0.0997,"y":0.9918,"z":-0.0795},{"x":0.0554,"y":-0.9918,"z":-0.1149},{"x":-0.0997,"y":-0.9918,"z":0.0795},{"x":0.0554,"y":-0.9918,"z":0.1149},{"x":-0.0554,"y":-0.9918,"z":0.1149},{"x":-0.0997,"y":0.9918,"z":0.0795},{"x":0.0997,"y":-0.9918,"z":-0.0795},{"x":0.1244,"y":-0.9918,"z":-0.0284},{"x":0.0554,"y":0.9918,"z":-0.1149},{"x":-0.0554,"y":-0.9918,"z":-0.1149},{"x":0.0554,"y":0.9918,"z":0.1149},{"x":0,"y":-0.9918,"z":0.1276},{"x":0.1244,"y":0.9918,"z":-0.0284},{"x":-0.6542,"y":0,"z":0.7564},{"x":0.9992,"y":0,"z":-0.0399},{"x":0.9225,"y":0,"z":0.3859},{"x":0.8805,"y":0,"z":-0.474},{"x":0.1974,"y":-0.9793,"z":0.0451},{"x":0.1974,"y":0.9793,"z":0.0451},{"x":0.6414,"y":0,"z":0.7672},{"x":0.1029,"y":0.9715,"z":0.2137},{"x":-0.1968,"y":-0.9678,"z":-0.157},{"x":0,"y":0.9569,"z":-0.2903},{"x":-0.1968,"y":0.9678,"z":-0.157},{"x":-0.626,"y":0,"z":-0.7798},{"x":0.2384,"y":0,"z":-0.9712},{"x":-0.1074,"y":-0.9689,"z":0.223},{"x":-0.2256,"y":0,"z":0.9742},{"x":-0.8938,"y":0,"z":0.4485},{"x":-0.9997,"y":0,"z":-0.0232},{"x":0.2307,"y":-0.9555,"z":-0.184},{"x":0.2307,"y":0.9555,"z":-0.184},{"x":-0.2573,"y":-0.9645,"z":0.0587},{"x":-0.1074,"y":0.9689,"z":0.223}],"faces":[{"vertices":[1,2,0],"normals":[0,0,0]},{"vertices":[3,4,2],"normals":[1,1,1]},{"vertices":[5,6,4],"normals":[2,2,2]},{"vertices":[7,8,6],"normals":[3,3,3]},{"vertices":[9,10,8],"normals":[4,4,4]},{"vertices":[11,12,10],"normals":[5,5,5]},{"vertices":[13,14,12],"normals":[6,6,6]},{"vertices":[15,16,14],"normals":[7,7,7]},{"vertices":[17,18,16],"normals":[8,8,8]},{"vertices":[19,20,18],"normals":[9,9,9]},{"vertices":[21,22,20],"normals":[10,10,10]},{"vertices":[23,24,22],"normals":[11,11,11]},{"vertices":[25,26,24],"normals":[12,12,12]},{"vertices":[27,0,26],"normals":[13,13,13]},{"vertices":[47,66,46],"normals":[14,14,14]},{"vertices":[32,31,30],"normals":[8,8,8]},{"vertices":[51,70,50],"normals":[15,15,15]},{"vertices":[36,35,34],"normals":[10,10,10]},{"vertices":[29,65,31],"normals":[16,16,16]},{"vertices":[40,39,38],"normals":[12,12,12]},{"vertices":[43,56,42],"normals":[17,17,17]},{"vertices":[44,43,42],"normals":[0,0,0]},{"vertices":[50,74,48],"normals":[18,18,18]},{"vertices":[48,47,46],"normals":[2,2,2]},{"vertices":[40,76,41],"normals":[19,19,19]},{"vertices":[52,51,50],"normals":[4,4,4]},{"vertices":[38,83,36],"normals":[20,20,20]},{"vertices":[28,55,54],"normals":[6,6,6]},{"vertices":[17,43,45],"normals":[21,21,21]},{"vertices":[19,49,21],"normals":[22,22,22]},{"vertices":[12,38,10],"normals":[23,23,23]},{"vertices":[12,42,40],"normals":[24,24,24]},{"vertices":[13,43,15],"normals":[25,25,25]},{"vertices":[7,37,9],"normals":[26,26,26]},{"vertices":[9,39,11],"normals":[27,27,27]},{"vertices":[3,33,5],"normals":[28,28,28]},{"vertices":[26,28,54],"normals":[29,29,29]},{"vertices":[16,42,14],"normals":[30,30,30]},{"vertices":[26,52,24],"normals":[31,31,31]},{"vertices":[21,51,23],"normals":[32,32,32]},{"vertices":[8,34,6],"normals":[33,33,33]},{"vertices":[27,53,55],"normals":[34,34,34]},{"vertices":[27,29,1],"normals":[35,35,35]},{"vertices":[11,41,13],"normals":[36,36,36]},{"vertices":[6,32,4],"normals":[37,37,37]},{"vertices":[18,44,16],"normals":[38,38,38]},{"vertices":[24,50,22],"normals":[39,39,39]},{"vertices":[18,48,46],"normals":[40,40,40]},{"vertices":[19,45,47],"normals":[41,41,41]},{"vertices":[2,32,30],"normals":[42,42,42]},{"vertices":[2,28,0],"normals":[43,43,43]},{"vertices":[7,33,35],"normals":[44,44,44]},{"vertices":[10,36,8],"normals":[45,45,45]},{"vertices":[25,51,53],"normals":[46,46,46]},{"vertices":[22,48,20],"normals":[47,47,47]},{"vertices":[1,31,3],"normals":[48,48,48]},{"vertices":[64,79,78],"normals":[7,7,7]},{"vertices":[81,68,80],"normals":[9,9,9]},{"vertices":[72,77,83],"normals":[11,11,11]},{"vertices":[56,76,82],"normals":[13,13,13]},{"vertices":[66,59,58],"normals":[1,1,1]},{"vertices":[70,75,74],"normals":[3,3,3]},{"vertices":[61,62,60],"normals":[5,5,5]},{"vertices":[36,77,37],"normals":[49,49,49]},{"vertices":[39,72,38],"normals":[50,50,50]},{"vertices":[44,59,45],"normals":[51,51,51]},{"vertices":[48,75,49],"normals":[52,52,52]},{"vertices":[42,82,40],"normals":[53,53,53]},{"vertices":[43,76,57],"normals":[54,54,54]},{"vertices":[35,81,34],"normals":[55,55,55]},{"vertices":[37,73,39],"normals":[56,56,56]},{"vertices":[54,60,52],"normals":[57,57,57]},{"vertices":[49,71,51],"normals":[58,58,58]},{"vertices":[55,62,63],"normals":[59,59,59]},{"vertices":[28,79,29],"normals":[60,60,60]},{"vertices":[52,62,53],"normals":[61,61,61]},{"vertices":[34,80,32],"normals":[62,62,62]},{"vertices":[31,64,30],"normals":[63,63,63]},{"vertices":[55,61,54],"normals":[64,64,64]},{"vertices":[32,68,33],"normals":[65,65,65]},{"vertices":[46,58,44],"normals":[66,66,66]},{"vertices":[47,59,67],"normals":[67,67,67]},{"vertices":[28,64,78],"normals":[68,68,68]},{"vertices":[35,68,69],"normals":[69,69,69]},{"vertices":[1,3,2],"normals":[0,0,0]},{"vertices":[3,5,4],"normals":[1,1,1]},{"vertices":[5,7,6],"normals":[2,2,2]},{"vertices":[7,9,8],"normals":[3,3,3]},{"vertices":[9,11,10],"normals":[4,4,4]},{"vertices":[11,13,12],"normals":[5,5,5]},{"vertices":[13,15,14],"normals":[6,6,6]},{"vertices":[15,17,16],"normals":[7,7,7]},{"vertices":[17,19,18],"normals":[8,8,8]},{"vertices":[19,21,20],"normals":[9,9,9]},{"vertices":[21,23,22],"normals":[10,10,10]},{"vertices":[23,25,24],"normals":[11,11,11]},{"vertices":[25,27,26],"normals":[12,12,12]},{"vertices":[27,1,0],"normals":[13,13,13]},{"vertices":[47,67,66],"normals":[14,14,14]},{"vertices":[32,33,31],"normals":[8,8,8]},{"vertices":[51,71,70],"normals":[15,15,15]},{"vertices":[36,37,35],"normals":[10,10,10]},{"vertices":[29,79,65],"normals":[16,16,16]},{"vertices":[40,41,39],"normals":[12,12,12]},{"vertices":[43,57,56],"normals":[17,17,17]},{"vertices":[44,45,43],"normals":[0,0,0]},{"vertices":[50,70,74],"normals":[18,18,18]},{"vertices":[48,49,47],"normals":[2,2,2]},{"vertices":[40,82,76],"normals":[19,19,19]},{"vertices":[52,53,51],"normals":[4,4,4]},{"vertices":[38,72,83],"normals":[20,20,20]},{"vertices":[28,29,55],"normals":[6,6,6]},{"vertices":[17,15,43],"normals":[21,21,21]},{"vertices":[19,47,49],"normals":[22,22,22]},{"vertices":[12,40,38],"normals":[23,23,23]},{"vertices":[12,14,42],"normals":[24,24,24]},{"vertices":[13,41,43],"normals":[25,25,25]},{"vertices":[7,35,37],"normals":[26,26,26]},{"vertices":[9,37,39],"normals":[27,27,27]},{"vertices":[3,31,33],"normals":[28,28,28]},{"vertices":[26,0,28],"normals":[29,29,29]},{"vertices":[16,44,42],"normals":[30,30,30]},{"vertices":[26,54,52],"normals":[31,31,31]},{"vertices":[21,49,51],"normals":[32,32,32]},{"vertices":[8,36,34],"normals":[33,33,33]},{"vertices":[27,25,53],"normals":[34,34,34]},{"vertices":[27,55,29],"normals":[35,35,35]},{"vertices":[11,39,41],"normals":[36,36,36]},{"vertices":[6,34,32],"normals":[37,37,37]},{"vertices":[18,46,44],"normals":[38,38,38]},{"vertices":[24,52,50],"normals":[39,39,39]},{"vertices":[18,20,48],"normals":[40,40,40]},{"vertices":[19,17,45],"normals":[41,41,41]},{"vertices":[2,4,32],"normals":[42,42,42]},{"vertices":[2,30,28],"normals":[43,43,43]},{"vertices":[7,5,33],"normals":[44,44,44]},{"vertices":[10,38,36],"normals":[45,45,45]},{"vertices":[25,23,51],"normals":[46,46,46]},{"vertices":[22,50,48],"normals":[47,47,47]},{"vertices":[1,29,31],"normals":[48,48,48]},{"vertices":[64,65,79],"normals":[7,7,7]},{"vertices":[81,69,68],"normals":[9,9,9]},{"vertices":[72,73,77],"normals":[11,11,11]},{"vertices":[56,57,76],"normals":[13,13,13]},{"vertices":[66,67,59],"normals":[1,1,1]},{"vertices":[70,71,75],"normals":[3,3,3]},{"vertices":[61,63,62],"normals":[5,5,5]},{"vertices":[36,83,77],"normals":[49,49,49]},{"vertices":[39,73,72],"normals":[50,50,50]},{"vertices":[44,58,59],"normals":[51,51,51]},{"vertices":[48,74,75],"normals":[52,52,52]},{"vertices":[42,56,82],"normals":[53,53,53]},{"vertices":[43,41,76],"normals":[54,54,54]},{"vertices":[35,69,81],"normals":[55,55,55]},{"vertices":[37,77,73],"normals":[56,56,56]},{"vertices":[54,61,60],"normals":[57,57,57]},{"vertices":[49,75,71],"normals":[58,58,58]},{"vertices":[55,53,62],"normals":[59,59,59]},{"vertices":[28,78,79],"normals":[60,60,60]},{"vertices":[52,60,62],"normals":[61,61,61]},{"vertices":[34,81,80],"normals":[62,62,62]},{"vertices":[31,65,64],"normals":[63,63,63]},{"vertices":[55,63,61],"normals":[64,64,64]},{"vertices":[32,80,68],"normals":[65,65,65]},{"vertices":[46,66,58],"normals":[66,66,66]},{"vertices":[47,45,59],"normals":[67,67,67]},{"vertices":[28,30,64],"normals":[68,68,68]},{"vertices":[35,33,68],"normals":[69,69,69]}]}]

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "14bd8cd5c9c3b1bcb59e2ec9f4c8ed16.png";

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "2989b3135074a9d7d10f7d6c42cecd4a.png";

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "36fbc222529fa8e2b722e7de1ca8f010.png";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b30d17fb175566e9e20d5584d7ae6bfb.png";

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c4e4b266fe4b4281371e908cb2fa6e89.png";

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "211f2046cf2c6739bad5c6209b09dac4.png";

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bed841884f7920591d4279314a1b53da.png";

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "dad0119c8dd1a33ab48b6870bfa8b432.png";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "f4f2b50d7d886d02949a38f94c217a86.png";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "0009cb245d8a3129bcd470b1c30a2c17.png";

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "47d04e8b7dc74f4980d66796a632547c.png";

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c196269cf8b2fc9593276f497c8ffdd9.png";

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "5c07fbf7949c365c56f8188b02827d6e.png";

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "f1dde6672b0d9b18b4373a26d3803351.png";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "54e31707db0fbae7dec46d063517665a.png";

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b456e9dc15d272b079029a5ca6468305.png";

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "f657ac4e01beddb5085242cb1c20ecb3.png";

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "6a04a9d0a0989ac43da2da2261c14c98.png";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "042200790f9c9b7eb4c1dcdc1bfa6778.png";

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "aecaf306ad634d628614dca09cfab828.png";

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "539826c16dd852792e84c205811ca9f8.png";

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "2047b8a2f49ee5b609dc16ab0e62c014.png";

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "bbaba2795420534ca9f0184e07fb74f8.png";

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "680cc4a9d367653fc466577bbd376590.png";

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "9f73952b51a9a6343babe0c489a2b980.png";

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fa5e6c40cb378f6ee6cab4e16ef0934b.png";

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b01bbcd1860ad00f64ab16cc21569634.png";

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "04259b8d38e7b73dae45b2c29ceeb4d3.png";

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "28310db934c54c285a709a1e980e4efc.png";

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "69adb964e9ef816f3bd99df3b7ddd560.ogg";

/***/ })
/******/ ]);
//# sourceMappingURL=application.bundle.js.map