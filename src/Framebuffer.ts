
import { FrustumCuller } from './clustered-culling/FrustumCuller';
import { ComputationalGeometryUtils } from './math/Geometry';

import { Sphere } from './math/Sphere';
import { CameraKeyFrame } from './animation/CameraKeyFrame';
import { CameraAnimator } from './animation/CameraAnimator';

import { CullFace } from './CullFace';
import { TextureCoordinate, Vertex } from './Vertex';

import { Texture, TextureUtils } from './texture';
import Point from './Point';

import { Matrix3f, Matrix4f, Vector3f, Vector4f } from './math';
import { BasicCamera, ControllableCamera } from './camera';

import RandomNumberGenerator from './RandomNumberGenerator';
import { Portal } from './portal-system/Portal';
import { Polygon } from './portal-system/Polygon';
import { Plane } from './math/Plane';
import { SutherlandHodgmanClipper } from './portal-system/SutherlandHodgmanClipper';
import { Color } from './core/Color';
import { AbstractClipEdge } from './screen-space-clipping/AbstractClipEdge';
import { RightClipEdge } from './screen-space-clipping/RightClipEdge';
import { LeftClipEdge } from './screen-space-clipping/LeftClipEdge';
import { TopClipEdge } from './screen-space-clipping/TopClipEdge';
import { BottomClipEdge } from './screen-space-clipping/BottomClipEdge';
import { SutherlandHodgman2DClipper } from './screen-space-clipping/SutherlandHodgman2DClipper';
import { Mesh } from './geometrical-objects/Mesh';
import { CohenSutherlandLineClipper } from './screen-space-clipping/CohenSutherlandLineClipper';
import { Torus } from './geometrical-objects/Torus';
import { TriangleRasterizer } from './rasterizer/TriangleRasterizer';

let json = require('./assets/f16.json');
let bunnyJson = <any>require('./assets/bunny.json');
let worldJson = <any>require('./assets/world2.json');

let torusJson = <any>require('./assets/stravaganza.json');
let gearJson = <any>require('./assets/gear.json');
let roomJson = <any>require('./assets/room.json');
let hoodlumJson = <any>require('./assets/hoodlum.json');
let labJson = <any>require('./assets/lab.json');
let labJson2 = <any>require('./assets/lab2.json');
let bakedJson = <any>require('./assets/abstract.json');
let platonian = <any>require('./assets/platonian_backed.json');
let hlm2018Json = <any>require('./assets/hoodlum2018.json');

export class Framebuffer {

    static PIXEL_SIZE_IN_BYTES = 4;

    private width: number;
    private height: number;
    private imageData: ImageData;
    public framebuffer: Uint32Array;
    private unsignedIntArray: Uint8ClampedArray;
    public wBuffer: Float32Array;

    public cullMode: CullFace = CullFace.BACK;

    public camera: ControllableCamera;

    private torus = new Torus();
    private bunnyObj: any;
    private blenderObj: any;
    private blenderObj2: any;
    private blenderObj3: any;
    private blenderObj4: any;
    private blenderObj5: any;
    private blenderObj6: any;
    private blenderObj7: any;
    private bob: Texture;
    private sphere: any;
    private plane: any;
    private cylinder: any;
    private cylinder2: any;
    private sphereDisp: any;
    private sphereDisp2: any;

    private linerClipper = new CohenSutherlandLineClipper(this);
    private triangleRasterizer = new TriangleRasterizer(this);

    public setCullFace(face: CullFace): void {
        this.cullMode = face;
    }

    setTexture(texture: Texture) {
        this.bob = texture;
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float32Array(320 * 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
    }

    public precompute(texture: Texture, texture2: Texture): void {
        this.bunnyObj = this.createBunny();
        this.blenderObj = this.getBlenderScene(worldJson);
        this.blenderObj2 = this.getBlenderScene(torusJson, false);
        this.blenderObj3 = this.getBlenderScene(gearJson, false);
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

    public getImageData(): ImageData {
        this.imageData.data.set(this.unsignedIntArray);
        return this.imageData;
    }

    public clear() {
        let color: number = this.toColor(0);
        let count: number = this.width * this.height;
        for (let i = 0; i < count; i++) {
            this.framebuffer[i] = color;
        }
    }

    public clearH(col: number, h: number) {
        let color: number = col;
        let count: number = this.width * h;
        for (let i = 0; i < count; i++) {
            this.framebuffer[i] = color;
        }
    }

    public clearColorBuffer(color: number) {
        this.framebuffer.fill(color);
    }

    public drawPixel(x: number, y: number, color: number) {
        this.framebuffer[x + y * this.width] = color;
    }

    public readPixel(x: number, y: number, color: number): number {
        return this.framebuffer[x + y * this.width];
    }

    public readPixel2(fb: Uint32Array, x: number, y: number, color: number): number {
        return fb[x + y * this.width];
    }

    public toColor(red: number): number {
        return (255 << 24) |
            (red << 16) |
            (red << 8) |
            (red);
    }

    public drawRect(x, y, width, color) {
        let start = x + y * this.width;

        for (let i = 0; i < width; i++) {
            this.framebuffer[start++] = color;
        }
    }

    public drawRect2(x, y, width, height, color) {
        let start = x + y * this.width;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {

                this.framebuffer[start++] = color;

            }
            start += 320 - width;
        }
    }

    public drawText(x: number, y: number, text: string, texture: Texture): void {
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

    public addReflections() {
        let start = 150;
        for (let i = 0; i < 50; i++) {
            for (let x = 0; x < 320; x++) {
                this.framebuffer[(start + i) * 320 + x] = this.framebuffer[(start - i * 3 - 1) * 320 + x +
                    this.interpolate(0, 50, i) * (Math.sin(Date.now() * 0.002 + i * 0.2) * 10) | 0]
            }
        }
    }

    public drawTextureRect2(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
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

    public drawTextureRectFastAlpha(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture): void {
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

    public drawTextureRectNoAlpha(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture): void {
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

    public drawTextureRect(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
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

    public drawTextureRectAdd(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
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

    public cinematicScroller(texture: Texture, time: number) {
        let scrollText: Array<string> = [
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

    // optimization:
    // - downscale image to half the size before bluring
    // render result to texture in order to not blur the logo
    tmp = new Uint32Array(320 * 200);
    tmp2 = new Uint32Array(320 * 200);
    public blur() {
        let scale = 1 / (3.1);
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        let index = 1 + 320;
        let sumIndex = 320;
        let color: number;
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
                r *= scale; g *= scale; b *= scale;
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
                r *= scale; g *= scale; b *= scale;
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

    public pixelate() {
        let xoff = 20;
        let yoff = 50;

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                this.drawBox2(x * 10 + xoff, y * 10 + yoff, 10, 10, this.readPixel(x * 10 + xoff, y * 10 + yoff, 0));
            }
        }
        this.drawLineDDA(new Vector3f(xoff, yoff, -0.3), new Vector3f(xoff + 20 * 5, yoff, -0.3), 0xffffffff);
        this.drawLineDDA(new Vector3f(xoff, yoff + 20 * 5, -0.3), new Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
        this.drawLineDDA(new Vector3f(xoff, yoff, -0.3), new Vector3f(xoff, yoff + 20 * 5, -0.3), 0xffffffff);
        this.drawLineDDA(new Vector3f(xoff + 20 * 5, yoff, -0.3), new Vector3f(xoff + 20 * 5, yoff + 20 * 5, -0.3), 0xffffffff);
    }

    public interpolate(start: number, end: number, current: number): number {
        if (current <= start) {
            return 0;
        }
        if (current >= end) {
            return 1;
        }
        return (current - start) / (end - start);
    }

    public scrollingBackground(texture: Texture, time: number) {
        let offset = Math.round(-(1 - this.interpolate(250, 10250, time * 0.25)) * (texture.height - 200));
        this.fastFramebufferCopyOffset(this.framebuffer, texture.texture, offset);
    }

    public drawRaster() {
        let colorLUT = new Array<number>();
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

    public blockFace(texture: Texture, time: number, startTime: number) {
        let fadeArray = new Array<number>(16 * 10);
        let rng = new RandomNumberGenerator();
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
                this.drawTextureRect(x * 20, y * 20, x * 20, y * 20, 20, 20, texture,
                    this.interpolate(startTime + fadeArray[x + y * 16], startTime + fadeArray[x + y * 16] + 700, time));
            }
        }
    }

    public fastFramebufferCopyOffset(src: Uint32Array, dest: Uint32Array, offset = 0) {
        let i = 320 * 200 / 32 + 1;
        let k = 320 * 200;
        let l = 320 * (200 - offset);
        while (--i) {
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];

            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];

            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];

            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
            src[--k] = dest[--l]; src[--k] = dest[--l];
        }
    }

    // 6 times faster than the slow method that clips and does alpha blending
    public fastFramebufferCopy(src: Uint32Array, dest: Uint32Array, offset = 0) {
        src.set(dest);
    }

    tmpGlitch = new Uint32Array(320 * 200);

    public raveMoview(elapsedTime: number, texture: Texture): void {
        this.fastFramebufferCopyOffset(this.framebuffer, texture.texture, -(((elapsedTime / 200) | 0) % 11) * 200);
    }

    public drawPolarDistotion(elapsedTime: number, texture: Texture): void {
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

    public drawPolarDistotion2(elapsedTime: number, texture: Texture): void {
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

    public drawPolarDistotion3(elapsedTime: number, texture: Texture): void {
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

    public noise(elapsedTime: number, texture: Texture, scale: number = 0.07): void {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 10; y++) {
                this.drawTextureRect(x * 20, y * 20, 20 * (Math.round(elapsedTime / 100 + x + y) % 12), 0, 20, 20, texture, scale);
            }
        }
    }

    public glitchScreen(elapsedTime: number, texture: Texture, noise: boolean = true): void {

        const glitchFactor = (Math.sin(elapsedTime * 0.0003) * 0.5 + 0.5);
        let rng = new RandomNumberGenerator();
        rng.setSeed((elapsedTime / 250) | 0);
        let texture2 = new Texture();
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

        let rng2 = new RandomNumberGenerator();

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

    public floodFill(texture: Texture, time: number) {

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


    public drawTexturedBillboard(xp: number, yp: number, width: number, height: number, texture: Texture, z: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawParticleNoDepth(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawSoftParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawRadialBlur(): void {
        this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);

        let texture = new Texture();
        texture.texture = this.tmpGlitch;
        texture.width = 320;
        texture.height = 200;
        let width = 320;
        let height = 200;
        for (let i = 0; i < 16; i++) {
            width += 320 * 0.09;
            height += 200 * 0.09;
            this.drawScaledTextureClip(
                320 / 2 - width / 2,
                200 / 2 - height / 2,
                width, height, texture, 0.19 * (15 - i) / 15);
            this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
        }

    }

    public drawScaledTextureClip(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawScaledTextureClipBi(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawScaledTextureClipBiAdd(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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


    public drawScaledTextureClipAdd(xp: number, yp: number, width: number, height: number, texture: Texture): void {
        let xStep = texture.width / width;
        let yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number
        let yStart: number;
        let xStart: number;

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
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - 200, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - 320, 0);
            xStart = 0;
        } else {
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

    public drawTexture(x: number, y: number, texture: Texture, alpha2: number) {
        const SCREEN_WIDTH = 320;
        const SCREEN_HEIGHT = 200;

        let framebufferIndex: number = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex: number = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;

        const width: number = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        const height: number = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);

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

    public drawTextureNoClipAlpha(x: number, y: number, texture: Texture): void {
        let framebufferIndex: number = x + y * this.width;
        let textureIndex: number = 0;

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
    public scene8(elapsedTime: number): void {

        let index: Array<number> = [
            0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6,
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4,
        ];

        let points: Array<Vector3f> = [
            new Vector3f(1.0, 1.0, -1.0), new Vector3f(-1.0, 1.0, -1.0),
            new Vector3f(-1.0, 1.0, 1.0), new Vector3f(1.0, 1.0, 1.0),
            new Vector3f(1.0, -1.0, 1.0), new Vector3f(-1.0, -1.0, 1.0),
            new Vector3f(-1.0, -1.0, -1.0), new Vector3f(1.0, -1.0, -1.0)
        ];

        let scale = 0.8;

        let modelViewMartrix = Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.05));

        let points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 4 + Math.sin(elapsedTime * 0.09) * 2; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        for (let i = 0; i < index.length; i += 2) {
            let color = 255 | 0 << 16 | 255 << 24;
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector3f {
        return new Vector3f(Math.round((320 / 2) + (292 * t1.x / (-t1.z))),
            Math.round((200 / 2) - (t1.y * 292 / (-t1.z))),
            t1.z);
    }

    // https://math.stackexchange.com/questions/859454/maximum-number-of-vertices-in-intersection-of-triangle-with-box/
    public nearPlaneClipping(t1: Vector3f, t2: Vector3f, color: number): void {
        const NEAR_PLANE_Z = -1.7;

        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t2), color);
        } else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        } else if (t1.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            let t3 = new Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        } else if (t2.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            let t3 = new Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t2), this.project(t3), color);
        }
    }

    public clearDepthBuffer(): void {
        this.wBuffer.fill(-1 / 900);
    }

    public debug(elapsedTime: number): void {
        this.clearDepthBuffer();

        let index: Array<number> = [
            1, 2, 3, 3, 4, 1,
            1 + 8, 2 + 8, 3 + 8, 3 + 8, 4 + 8, 1 + 8,
        ];

        let points: Array<Vector3f> = [
            new Vector3f(-1.0, -1.0, 1.0), new Vector3f(1.0, -1.0, 1.0),
            new Vector3f(1.0, 1.0, 1.0), new Vector3f(-1.0, 1.0, 1.0),
            new Vector3f(-1.0, -1.0, -1.0), new Vector3f(1.0, -1.0, -1.0),
            new Vector3f(1.0, 1.0, -1.0), new Vector3f(-1.0, 1.0, -1.0),

            new Vector3f(-1.0, -1.0, 1.0).add(new Vector3f(2.0, 0.0, 0.0)), new Vector3f(1.0, -1.0, 1.0).add(new Vector3f(2.0, 0.0, 0.0)),
            new Vector3f(1.0, 1.0, 1.0).add(new Vector3f(2.0, 0.0, 0.0)), new Vector3f(-1.0, 1.0, 1.0).add(new Vector3f(2.0, 0.0, 0.0)),
            new Vector3f(-1.0, -1.0, -1.0).add(new Vector3f(2.0, 0.0, 0.0)), new Vector3f(1.0, -1.0, -1.0).add(new Vector3f(2.0, 0.0, 0.0)),
            new Vector3f(1.0, 1.0, -1.0).add(new Vector3f(2.0, 0.0, 0.0)), new Vector3f(-1.0, 1.0, -1.0).add(new Vector3f(2.0, 0.0, 0.0)),
        ];

        let colorAr: Array<number> = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];

        let scale = 3.2;

        let modelViewMartrix = Matrix3f.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3f.constructZRotationMatrix(elapsedTime * 0.08));

        let points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        });

        for (let i = 0; i < index.length; i += 3) {
            // TODO: use eye space triangles for backface culling
            let col = 255 << 24 | 255 << 16;
            let col2 = 255 << 24 | 255;

            this.triangleRasterizer.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], colorAr[(((i) / 3) | 0) % 6]);
        }
    }

    private sphereFunction2(theta: number, phi: number): Vector4f {

        let pos = new Vector4f(Math.cos(theta) * Math.cos(phi),
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta), 1.0);

        return pos;
    }

    public drawBox() {
        let height = Framebuffer.maxWindow.y - Framebuffer.minWindow.y + 1;
        let width = Framebuffer.maxWindow.x - Framebuffer.minWindow.x + 1;
        let index = Framebuffer.minWindow.y * 320 + Framebuffer.minWindow.x;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(255 << 24 | 55 << 16 | 55 << 8 | 55, index, index + width);
            index += 320
        }
    }

    public drawBox2(x1: number, y1: number, width: number, height: number, color: number) {

        let index = y1 * 320 + x1;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(color, index, index + width);
            index += 320
        }
    }

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

    public static minWindow: Vector3f = new Vector3f(0, 0, 0);
    public static maxWindow: Vector3f = new Vector3f(319, 199, 0);

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

    public drawBoundingSphere(sphere: Sphere, matrix: Matrix4f, color: number): void {
        let points: Array<Vector4f> = [];

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


        let modelViewMartrix = matrix;

        let points2: Array<Vector3f> = new Array<Vector3f>();

        for (let p = 0; p < points.length; p++) {
            let transformed = modelViewMartrix.multiplyHom(points[p]);
            points2.push(new Vector3f(transformed.x, transformed.y, transformed.z));
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

    // TODO: if flat shaded, then store only one normal per face!
    public getBlenderScene(file: any, disp: boolean = true, flat: boolean = false): any {
        let scene = [];

        file.forEach(object => {
            let points: Array<Vector4f> = new Array<Vector4f>();
            let normals: Array<Vector4f> = new Array<Vector4f>();
            let faces: Array<{ vertices: number[], normals: number[] }> = new Array();
            let coords: Array<TextureCoordinate>;

            if (object.uv) {
                coords = [];
                object.uv.forEach((v) => {
                    let uv = new TextureCoordinate();
                    uv.u = v.u;
                    uv.v = 1.0 - v.v;
                    coords.push(uv);
                });
            }

            object.vertices.forEach((v) => {
                // some transformation in order for the vertices to be in worldspace
                if (disp)
                    points.push(new Vector4f(v.x, v.y, v.z).mul(2).add(new Vector4f(0, -2.7, 0, 0)));
                else
                    points.push(new Vector4f(v.x, v.y, v.z).mul(2));
            });

            object.normals.forEach((v) => {
                normals.push(new Vector4f(v.x, v.y, v.z));
            });

            let sphere = new ComputationalGeometryUtils().computeBoundingSphere(points);
            sphere.getCenter().w = 1;

            // Create class for objects
            let obj = {
                points: points,
                normals: normals,
                uv: coords,           // NO!!!
                faces: object.faces, // NOO!!!
                points2: points.map(() => new Vector4f(0, 0, 0, 0)),
                normals2: normals.map(() => new Vector4f(0, 0, 0, 0)),
                boundingSphere: sphere, // NO!!!
                name: object.name /// NO!
            };
            scene.push(obj);
        });

        return scene;
    }

    drawPlanedeformationTunnelAnim(elapsedTime: number, texture: Texture) {

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
    drawPlanedeformationTunnelV2(elapsedTime: number, texture: Texture, texture2: Texture) {
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

    drawLedTunnel(elapsedTime: number, texture: Texture) {
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                let distance = 160 / (Math.sqrt((x - 40 / 2.0) * (x - 40 / 2.0) + (y - 25 / 2.0) * (y - 25 / 2.0)) * 1.4);
                /*let power = 2.0;
                let distance = Math.pow(Math.pow((x - 40 / 2.0) * (x - 40 / 2.0),power) + Math.pow((y - 25 / 2.0) * (y - 25 / 2.0),power),1/(2*power));
                let waveSum: number =  (Math.sin(distance+elapsedTime*0.005)+1)*0.5*(1-Math.min(distance*0.03, 1.0));
                */
                let waveSum: number = (Math.sin(distance + elapsedTime * 0.005) + 1) * 0.5 * (1 - Math.min(distance * 0.003, 1.0));
                // FIXME: put this into a reusable method to remove
                // code duplications? ie. LedBuffer class wit arrayy and draw method :)
                let intensity = ((waveSum * 15) | 0) % 16;
                this.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * intensity, 8, 8, texture);
            }
        }
    }


    drawParticleWaves(elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) this.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();

        let points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const scale = 2;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {

                let x = (j - num / 2) * scale;
                let y = 4 * (Math.sin(j * 0.09 * 2 + elapsedTime * 0.0008) + Math.cos(i * 0.08 * 2 + elapsedTime * 0.0009));
                let z = (i - num / 2) * scale;

                points.push(new Vector3f(x, y, z));
            }
        }


        let modelViewMartrix = Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(

            Matrix4f.constructXRotationMatrix(Math.PI * 0.1).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.00006))
        );

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach(element => {


            let transformed = this.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(1.3 * 192 / (element.z));
            this.drawParticle(
                Math.round(element.x - size / 2),
                Math.round(element.y - size / 2),
                Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-60, -25, element.z));
        });
    }

    public drawWormhole(elapsedTime: number, texture: Texture, noClear: boolean = false) {

        let points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const num2 = 10;
        const scale = 2.1;

        for (let i = 0; i < num; i++) {
            let radius = 5.8;

            for (let j = 0; j < num2; j++) {

                let x = ((i - num / 2) * scale - elapsedTime * 0.008) % (num * scale) + (num * scale * 0.5);
                let y = Math.cos(Math.PI * 2 / num2 * j) * radius + Math.cos(Math.PI * 2 / num * i) * 10;
                let z = Math.sin(Math.PI * 2 / num2 * j) * radius + Math.sin(Math.PI * 2 / num * i) * 10;

                points.push(new Vector3f(x, y, z));
            }
        }


        let modelViewMartrix = Matrix4f.constructTranslationMatrix(
            Math.sin(-Math.PI * 0.5 + Math.PI * 2 / num * (elapsedTime * 0.004 * scale)) * 10,
            Math.cos(-Math.PI * 0.5 + Math.PI * 2 / num * (elapsedTime * 0.004 * scale)) * 10
            , -49).multiplyMatrix(

                Matrix4f.constructYRotationMatrix(Math.PI * 0.5));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
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
                this.drawParticleNoDepth(
                    Math.round(element.x - size / 2),
                    Math.round(element.y - size / 2),
                    Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-90, -55, element.z));
        });
    }

    drawParticleTorus(elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) this.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();

        let points: Array<Vector3f> = new Array<Vector3f>();
        const num = 300;
        for (let i = 0; i < num; i++) {
            let radi = 3.4 * (2 + Math.sin((i * Math.PI / (num / 2)) * 2 + elapsedTime * 0.0004));//*sinf(Time*0.0008f)));
            let move = elapsedTime * 0.0015;
            let x = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 7);
            let y = radi * Math.cos(((move + i) * Math.PI / (num / 2)) * 4);
            let z = radi * Math.sin(((move + i) * Math.PI / (num / 2)) * 7);

            points.push(new Vector3f(x, y, z));
        }


        let modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -20)
            .multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.0003)
                .multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.0003)));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach(element => {


            let transformed = this.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(2.2 * 192 / (element.z));
            this.drawParticle(
                Math.round(element.x) - Math.round(size / 2),
                Math.round(element.y) - Math.round(size / 2),
                Math.round(size), Math.round(size), texture, 1 / element.z, 1.0);
        });
    }

    /**
     * todo:
     * - create material class
     * 
     * @param {number} elapsedTime 
     * @memberof Framebuffer
    
     * 
     */
    public drawBlenderScene(elapsedTime: number, texture: Texture, texture2?: Texture): void {
        // camerea:
        // http://graphicsrunner.blogspot.de/search/label/Water
        this.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24);
        this.clearDepthBuffer();

        let keyFrames: Array<CameraKeyFrame> = [
            new CameraKeyFrame(new Vector3f(-5, 3, 10), new Vector3f(0, 0, 0)),
            new CameraKeyFrame(new Vector3f(5, 10, 10), new Vector3f(0, 0, 0.1)),
            new CameraKeyFrame(new Vector3f(5, 10, 0), new Vector3f(1.5, -1, -0.2)),
            new CameraKeyFrame(new Vector3f(5, 3, -10), new Vector3f(2.5, 0, -0.09)),
            new CameraKeyFrame(new Vector3f(-5, 7, -10), new Vector3f(3.5, 0, 1)),
            new CameraKeyFrame(new Vector3f(-5, 3, 10), new Vector3f(4, 0, 0.)),
            new CameraKeyFrame(new Vector3f(5, 3, -2), new Vector3f(3, -0.2, 0.)),
            new CameraKeyFrame(new Vector3f(18, 2, -0), new Vector3f(2, -0.4, 0.)),
            new CameraKeyFrame(new Vector3f(15, 4, -0), new Vector3f(2, -0.5, 0.)),
            new CameraKeyFrame(new Vector3f(5, 7, -10), new Vector3f(2.5, 0, -0.09)),
        ];

        let cameraAnimator = new CameraAnimator();
        cameraAnimator.setKeyFrames(keyFrames);

        let modelViewMartrix: Matrix4f = cameraAnimator.getViewMatrix(elapsedTime);

        let count = 0;

        let frustumCuller = new FrustumCuller();
        frustumCuller.updateFrustum(modelViewMartrix, cameraAnimator.pos);
        let i = 0;

        for (let j = 0; j < this.blenderObj.length; j++) {

            let model = this.blenderObj[j];

            if (frustumCuller.isPotentiallyVisible(model.boundingSphere)) {
                this.drawObject2(model, modelViewMartrix, 144, 165, 116);
                let colLine = 255 << 24 | 255 << 8;
                this.drawBoundingSphere(model.boundingSphere, modelViewMartrix, colLine);
                count++;
            } else {
                let colLine = 255 << 24 | 255;
                this.drawBoundingSphere(model.boundingSphere, modelViewMartrix, colLine);
            }
        }

        if (texture2) {
            let points: Array<Vector3f> = new Array<Vector3f>();

            let rng = new RandomNumberGenerator();
            rng.setSeed(66);
            for (let i = 0; i < 640; i++) {
                //points.push(new Vector3f(rng.getFloat() * 30 - 15, rng.getFloat() * 10 - 1, rng.getFloat() * 30 - 15));
                let x = rng.getFloat() * 30 - 15;
                x += Math.sin(elapsedTime * 0.0008 + x) * 2;
                let y = rng.getFloat() * 30 - 15;
                y += Math.sin(elapsedTime * 0.0009 + y) * 2;
                let z = rng.getFloat() * 30 - 15;
                z += Math.sin(elapsedTime * 0.0011 + z) * 2;
                points.push(new Vector3f(x, y, z));
            }

            let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
            points.forEach(element => {
                let transformed = this.project(modelViewMartrix.multiply(element));
                points2.push(transformed);
            });

            points2.sort(function (a, b) {
                return a.z - b.z;
            });

            points2.forEach(element => {
                let size = -(3.1 * 192 / (element.z));
                this.drawSoftParticle(
                    Math.round(element.x - size * 0.5),
                    Math.round(element.y - size * 0.5),
                    Math.round(size), Math.round(size), texture2, 1 / element.z, 1.0);
            });
        }
        this.drawText(8, 18 + 8, 'RENDERED OBJECTS: ' + count + '/' + this.blenderObj.length, texture);
    }

    /**
     * Requirements for blender export:
     * - Wavefront OBJ
     * - 
     */
    public drawBlenderScene2(elapsedTime: number, texture3: Texture, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {
        this.clearDepthBuffer();

        let camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -12).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(5, 16, 5));
        let model = this.blenderObj2[0];
        this.drawObject2(model, mv, 246, 165, 177);


        mv = camera.multiplyMatrix(Matrix4f.constructZRotationMatrix(
            Math.PI * 0.5 * this.cosineInterpolate(0, 600, Math.floor(elapsedTime * 0.7) % 4000))
            .multiplyMatrix(Matrix4f.constructXRotationMatrix(
                Math.PI * 0.5 * this.cosineInterpolate(2000, 2600, Math.floor(elapsedTime * 0.7) % 4000)))
        );
        model = this.blenderObj2[1];
        this.drawObject2(model, mv, 186, 165, 197);


        let lensflareScreenSpace = this.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));

        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

    public drawBlenderScene5(elapsedTime: number, texture3: Texture, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {

        this.clearDepthBuffer();

        let camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -54 + (Math.sin(elapsedTime * 0.0006) * 0.5 + 0.5) * 9).multiplyMatrix(
                Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.8 - 0.1).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(

                        Matrix4f.constructTranslationMatrix(0, -13, 0)
                    )));


        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(9, 9, 9));

        for (let j = 0; j < this.blenderObj4.length; j++) {
            let model = this.blenderObj4[j];
            if (j !== 0 && j !== 2)
                this.drawObject2(model, mv, 200, 255, 216);

            if (j === 0)
                this.drawObject2(model, mv, 244, 200, 216);
            if (j === 2)
                this.drawObject2(model, mv, 244, 225, 216);

        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, 14.2, -4).multiplyMatrix(Matrix4f.constructScaleMatrix(7, 7, 9).multiplyMatrix(
                Matrix4f.constructXRotationMatrix(
                    Math.PI * 2 * this.cosineInterpolate(0, 1300, Math.floor(elapsedTime * 0.7) % 4000)))
            ));

        let model2 = this.blenderObj5[0];
        this.drawObject2(model2, mv, 200, 255, 216);

        const scale: number = 8;
        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, 19, 0).multiplyMatrix(
                Matrix4f.constructScaleMatrix(scale, scale, scale)))

        //   this.shadingSphereEnvDisp2(elapsedTime * 0.0003, mv);



        let lensflareScreenSpace = this.project(camera.multiply(new Vector3f(20, 19, -90)));

        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.15, texture, dirt);
    }

    public drawBlenderScene6(elapsedTime: number, texture3: Texture, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {

        this.clearDepthBuffer();

        let camera: Matrix4f =
            Matrix4f.constructTranslationMatrix(0, 0, -34 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 7).multiplyMatrix(
                Matrix4f.constructXRotationMatrix((Math.sin(elapsedTime * 0.00014) * 0.5 + 0.5) * 0.5 - 0.2).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0002).multiplyMatrix(

                        Matrix4f.constructTranslationMatrix(0, 1.9, 0)
                    )));


        let mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(13, 13, 13));

        let scal = Math.sin(elapsedTime * 0.003) * 0.5 + 0.5;
        for (let j = 0; j < this.blenderObj6.length; j++) {
            let model = this.blenderObj6[j];
            this.drawObject2(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, -5.5, 0).multiplyMatrix(
                Matrix4f.constructScaleMatrix(413, 413, 413).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(Math.PI * 0.5)
                )
            ));

        let model = this.blenderObj7[0];
        this.drawObject2(model, mv, 244, 100, 116, false, true);

        let points: Array<Vector3f> = new Array<Vector3f>();
        const num = 10;
        const num2 = 6;

        for (let i = 0; i < num; i++) {

            for (let j = 0; j < num2; j++) {
                let y = ((i + elapsedTime * 0.001) % 10) * 2.5 - 12;
                let scale2 = (1 + 4 * this.interpolate(-10, 10, y)) *

                    ((Math.sin(elapsedTime * 0.0012 + Math.PI * 2 / num * i * 2) * 0.5 + 0.5) * 0.5 + 0.5);
                let x = scale2 * Math.sin(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);

                let z = scale2 * Math.cos(Math.PI * 2 / num2 * j + elapsedTime * 0.0008);

                points.push(new Vector3f(x, y, z));
            }
        }


        let modelViewMartrix = camera.multiplyMatrix(Matrix4f.constructTranslationMatrix(0, -0.0, 0));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach(element => {


            let transformed = this.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(4.3 * 192 / (element.z));
            this.drawSoftParticle(
                Math.round(element.x - size / 2),
                Math.round(element.y - size / 2),
                Math.round(size), Math.round(size), texture3, 1 / element.z, 0.7);
        });
    }

    public drawBlenderScene3(elapsedTime: number, texture3: Texture, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {

        this.clearDepthBuffer();

        let camera: Matrix4f = Matrix4f.constructTranslationMatrix(0, 0, -5).multiplyMatrix(
            Matrix4f.constructYRotationMatrix(elapsedTime * 0.0002)
                .multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(elapsedTime * 0.0002)
                )
        );

        for (let i: number = 0; i < 10; i++) {
            const scale = Math.sin(Math.PI * 2 / 10 * i + elapsedTime * 0.002) * 0.2 + 0.2 + 0.3;
            let mv: Matrix4f = camera.multiplyMatrix(
                Matrix4f.constructTranslationMatrix(0, ((i + elapsedTime * 0.0008) % 10) - 5, 0).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix((i * 0.36 + elapsedTime * 0.0016)).multiplyMatrix(
                        Matrix4f.constructScaleMatrix(scale, 1, scale)
                    )
                )
            );
            let model = this.blenderObj3[0];
            this.drawObject2(model, mv, 246, 165, 177);
        }
        let lensflareScreenSpace = this.project(camera.multiply(new Vector3f(16.0 * 20, 16.0 * 20, 0)));

        this.drawLensFlare(lensflareScreenSpace, elapsedTime * 0.3, texture, dirt);
    }

    public drawPlaneDeformation(elapsedTime: number, texture: Texture): void {
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
    public scene7(elapsedTime: number, texture: Texture): void {
        let points: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < 120; i++) {
            points.push(new Vector3f(Math.sin(i * 0.25) * 8, i * 0.3 - 18, Math.cos(i * 0.25) * 8));
        }

        points.push(new Vector3f(0, 0, 5));

        let rotMat = Matrix3f.constructYRotationMatrix(elapsedTime * 0.0005);
        rotMat = rotMat.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.0002));

        let points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach(element => {
            let alpha = -elapsedTime * 0.0013;

            let transformed = rotMat.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 10;
            let xx = 320 / 2 + (x / (z * 0.0058));
            let yy = 200 / 2 + (y / (z * 0.0058));
            points2.push(new Vector3f(xx, yy, z));
        });

        points2.sort(function (a, b) {
            return a.z - b.z;
        });

        points2.forEach(element => {
            let size = -(1.9 / (element.z * 0.0058)) | 0;
            this.drawSoftParticle((element.x - size / 2) | 0, (element.y - size / 2) | 0, size, size, texture, 1 / element.z, 1.0);
        });
    }

    public shadingSphereClip(elapsedTime: number): void {
        this.clearDepthBuffer();
        let scale = 1.6;

        let modelViewMartrix: Matrix4f = Matrix4f.constructYRotationMatrix(elapsedTime * 0.1).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructZRotationMatrix(-elapsedTime * 0.02).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0, -21)
            .multiplyMatrix(modelViewMartrix));

        this.drawObject2(this.torus.getMesh(), modelViewMartrix, 215, 30, 120);
    }

    /**
     * TODO:
     * - object with position, rotation, material, color
     * - remove tempp matrix objects: instead store one global MV  matrix and manipulate it directly without generating temp amtrices every frame
     * - no lighting for culled triangles
     * - only z clip if necessary (no clip, fully visible)
     */
    // compare to drawObject
    // used by blender modells
    public drawObject2(obj: Mesh, modelViewMartrix: Matrix4f, red: number, green: number, blue: number, noLighting: boolean = false, culling: boolean = false) {

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let i = 0; i < obj.normals.length; i++) {
            normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        }

        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr(obj.points[i], obj.points2[i]);
        }

        let lightDirection = new Vector4f(0.5, 0.5, 0.3, 0.0).normalize();

        for (let i = 0; i < obj.faces.length; i++) {
            // this data structure is different as well !!!!
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

                // DIFFERENCE IS cullin variable here!!!!
                if (culling || this.isTriangleCCW(p1, p2, p3)) {
                    // TODO: do lighting only if triangle is visible
                    let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                    scalar = scalar * 0.85 + 0.15;
                    let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                    if (noLighting) {
                        color = 255 << 24 | red | green << 8 | blue << 16;
                    }

                    const clippedPolygon = SutherlandHodgman2DClipper.clipConvexPolygon(new Array<Vector3f>(p1, p2, p3), color);

                    if (clippedPolygon.length < 3) {
                        continue;
                    }

                    // triangulate new point set
                    for (let i = 0; i < clippedPolygon.length - 2; i++) {
                        this.triangleRasterizer.drawTriangleDDA(clippedPolygon[0], clippedPolygon[1 + i], clippedPolygon[2 + i], color);
                    }
                }
            } else if (!this.isInFrontOfNearPlane(v1) && !this.isInFrontOfNearPlane(v2) && !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                let scalar = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
                scalar = scalar * 0.85 + 0.15;
                let color = 255 << 24 | Math.min(scalar * blue, 255) << 16 | Math.min(scalar * green, 255) << 8 | Math.min(scalar * red, 255);
                if (noLighting) {
                    color = 255 << 24 | red | green << 8 | blue << 16;
                }
                this.zClipTriangle(new Array<Vector4f>(v1, v2, v3), color);
            }
        }
    }

    public drawObjectTexture(obj: any, modelViewMartrix: Matrix4f) {

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let i = 0; i < obj.normals.length; i++) {
            normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        }

        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr(obj.points[i], obj.points2[i]);
            obj.points2[i] = this.project(obj.points2[i]);
        }

        let vertexArray = new Array<Vertex>(new Vertex(), new Vertex(), new Vertex());
        for (let i = 0; i < obj.faces.length; i++) {
            let v1 = obj.points2[obj.faces[i].vertices[0]];
            let v2 = obj.points2[obj.faces[i].vertices[1]];
            let v3 = obj.points2[obj.faces[i].vertices[2]];

            if (this.isTriangleCCW(v1, v2, v3)) {
                let color = 255;

                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = obj.uv[obj.faces[i].uv[0]];

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = obj.uv[obj.faces[i].uv[1]];

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = obj.uv[obj.faces[i].uv[2]];

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

    public drawObjectTexture2(obj: any, modelViewMartrix: Matrix4f, red: number, green: number, blue: number, noLighting: boolean = false, culling: boolean = false) {

        let normalMatrix = modelViewMartrix.computeNormalMatrix();

        for (let i = 0; i < obj.normals.length; i++) {
            normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        }

        for (let i = 0; i < obj.points.length; i++) {
            modelViewMartrix.multiplyHomArr(obj.points[i], obj.points2[i]);
        }

        let vertexArray = new Array<Vertex>(new Vertex(), new Vertex(), new Vertex());

        for (let i = 0; i < obj.faces.length; i++) {
            let v1 = obj.points2[obj.faces[i].vertices[0]];
            let v2 = obj.points2[obj.faces[i].vertices[1]];
            let v3 = obj.points2[obj.faces[i].vertices[2]];

            if (this.isInFrontOfNearPlane(v1) && this.isInFrontOfNearPlane(v2) && this.isInFrontOfNearPlane(v3)) {
                let p1 = this.project(v1);
                let p2 = this.project(v2);
                let p3 = this.project(v3);

                if (this.isTriangleCCW(p1, p2, p3)) {
                    let color = 255;

                    vertexArray[0].position = p1;
                    vertexArray[0].textureCoordinate = obj.uv[obj.faces[i].uv[0]];

                    vertexArray[1].position = p2;
                    vertexArray[1].textureCoordinate = obj.uv[obj.faces[i].uv[1]];

                    vertexArray[2].position = p3;
                    vertexArray[2].textureCoordinate = obj.uv[obj.faces[i].uv[2]];

                    this.clipConvexPolygon2(vertexArray, color);
                }
            } else if (!this.isInFrontOfNearPlane(v1) && !this.isInFrontOfNearPlane(v2) && !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                let color = 255;

                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = obj.uv[obj.faces[i].uv[0]];

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = obj.uv[obj.faces[i].uv[1]];

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = obj.uv[obj.faces[i].uv[2]];

                this.zClipTriangle2(vertexArray, color);
            }
        }
    }

    NEAR_PLANE_Z = -1.7;

    public isInFrontOfNearPlane(p: { x: number; y: number; z: number }): boolean {
        return p.z < this.NEAR_PLANE_Z;
    }

    public computeNearPlaneIntersection(p1: Vector4f, p2: Vector4f): Vector4f {
        let ratio = (this.NEAR_PLANE_Z - p1.z) / (p2.z - p1.z);
        return new Vector4f(ratio * (p2.x - p1.x) + p1.x, ratio * (p2.y - p1.y) + p1.y, this.NEAR_PLANE_Z);
    }

    public zClipTriangle(subject: Array<Vector4f>, color: number): void {

        let output = subject;

        let input = output;
        output = new Array<Vector4f>();
        let S = input[input.length - 1];

        for (let i = 0; i < input.length; i++) {
            let point = input[i];
            if (this.isInFrontOfNearPlane(point)) {
                if (!this.isInFrontOfNearPlane(S)) {
                    output.push(this.computeNearPlaneIntersection(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S)) {
                output.push(this.computeNearPlaneIntersection(S, point));
            }
            S = point;
        }

        if (output.length < 3) {
            return;
        }

        let projected: Vector3f[] = output.map<Vector3f>((v) => {
            return this.project(v);
        })

        if (output.length === 3 && !this.isTriangleCCW(projected[0], projected[1], projected[2])) {
            return;
        }

        if (output.length === 4 && !this.isTriangleCCW2(projected[0], projected[1], projected[2], projected[3])) {
            return;
        }

        const clippedPolygon = SutherlandHodgman2DClipper.clipConvexPolygon(projected, color);

        if (clippedPolygon.length < 3) {
            return;
        }

        // triangulate new point set
        for (let i = 0; i < clippedPolygon.length - 2; i++) {
            this.triangleRasterizer.drawTriangleDDA(clippedPolygon[0], clippedPolygon[1 + i], clippedPolygon[2 + i], color);
        }
        // }
    }

    public computeNearPlaneIntersection2(p1: Vertex, p2: Vertex): Vertex {
        let ratio = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        let vertex = new Vertex();
        vertex.position = new Vector3f(ratio * (p2.position.x - p1.position.x) + p1.position.x, ratio * (p2.position.y - p1.position.y) + p1.position.y, this.NEAR_PLANE_Z);

        let tex = new TextureCoordinate();
        tex.u = ratio * (p2.textureCoordinate.u - p1.textureCoordinate.u) + p1.textureCoordinate.u;
        tex.v = ratio * (p2.textureCoordinate.v - p1.textureCoordinate.v) + p1.textureCoordinate.v;
        vertex.textureCoordinate = tex;

        return vertex;
    }

    public zClipTriangle2(subject: Array<Vertex>, color: number): void {

        let output = subject;

        let input = output;
        output = new Array<Vertex>();
        let S = input[input.length - 1];

        for (let i = 0; i < input.length; i++) {
            let point = input[i];
            if (this.isInFrontOfNearPlane(point.position)) {
                if (!this.isInFrontOfNearPlane(S.position)) {
                    output.push(this.computeNearPlaneIntersection2(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S.position)) {
                output.push(this.computeNearPlaneIntersection2(S, point));
            }
            S = point;
        }

        if (output.length < 3) {
            return;
        }

        let projected: Vertex[] = output.map<Vertex>((v) => {
            v.position = this.project(v.position);
            return v;
        })

        if (output.length === 3 && !this.isTriangleCCW(projected[0].position, projected[1].position, projected[2].position)) {
            return;
        }

        if (output.length === 4 && !this.isTriangleCCW2(projected[0].position, projected[1].position, projected[2].position, projected[3].position)) {
            return;
        }
        //if (this.isTriangleCCW(projected[0], projected[1], projected[2])) {
        //this.clipConvexPolygon(projected, color, true);
        this.clipConvexPolygon2(projected, color);
        // }
    }

    public torusFunction(alpha: number): Vector3f {
        return new Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }

    private torusFunction2(alpha: number): Vector3f {
        let p = 2, q = 3;
        let r = 0.5 * (2 + Math.sin(q * alpha));
        return new Vector3f(r * Math.cos(p * alpha),
            r * Math.cos(q * alpha),
            r * Math.sin(p * alpha));
    }

    public cosineInterpolate(y1: number, y2: number, mu: number): number {
        let mu2: number;
        if (mu <= y1) return 0;
        if (mu >= y2) return 1;
        mu2 = (mu - y1) / (y2 - y1);
        return (1 - Math.cos(mu2 * Math.PI)) / 2;
    }

    public shadingTorusDamp(elapsedTime: number, sync: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector3f> = [];

        const STEPS = 80;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);

            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize()
            let right = tangent.cross(up).normalize().mul(1.0);
            up = right.cross(tangent).normalize().mul(1.0);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(10));
            }
        }

        let index: Array<number> = [];

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
        let normals: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        for (let i = 0; i < 7; i++) {
            let scale = 0.1 + 0.1 * i;

            let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.035 + 0.3 * (4 - i)));
            modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.04 + 0.3 * (4 - i)));

            /**
             * Vertex Shader Stage
             */
            let points2: Array<Vector3f> = new Array<Vector3f>();

            let normals2: Array<Vector3f> = new Array<Vector3f>();
            for (let n = 0; n < normals.length; n++) {
                normals2.push(modelViewMartrix.multiply(normals[n]));
            }

            let ukBasslineBpm = 130 / 2;
            let ukBasslineClapMs = 60000 / ukBasslineBpm;
            let smashTime = sync % ukBasslineClapMs;
            let smash = (this.cosineInterpolate(0, 15, smashTime) - this.cosineInterpolate(15, 200, smashTime) +
                0.4 * this.cosineInterpolate(200, 300, smashTime) - 0.4 * this.cosineInterpolate(300, 400, smashTime)
            )
                * 12;
            modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -88).multiplyMatrix(modelViewMartrix);

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

                points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
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
                    let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f(0.5, 0.5, 0.5).normalize()))) + 0.2, 1.0);
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
                        const clippedPolygon = SutherlandHodgman2DClipper.clipConvexPolygon(new Array<Vector3f>(v1, v2, v3), color);

                        if (clippedPolygon.length < 3) {
                            continue;
                        }

                        // triangulate new point set
                        for (let i = 0; i < clippedPolygon.length - 2; i++) {
                            this.triangleRasterizer.drawTriangleDDA(clippedPolygon[0], clippedPolygon[1 + i], clippedPolygon[2 + i], color);
                        }
                    } else {
                        this.triangleRasterizer.drawTriangleDDA(v1, v2, v3, color);
                        //this.drawTriangleDDA2(v1, v2, v3, new Vector3f(0, 0, 0), new Vector3f(0, 16, 0), new Vector3f(16, 16, 0), color);
                    }
                }
            }
        }
    }

    public shadingTorus5(elapsedTime: number, sync: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector3f> = [];

        const STEPS = 80;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction2(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction2(i * 2 * Math.PI / STEPS + 0.1);

            let tangent = frame2.sub(frame);
            let up = frame.add(frame2).normalize()
            let right = tangent.cross(up).normalize().mul(0.4);
            up = right.cross(tangent).normalize().mul(0.4);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos.mul(10));
            }
        }

        let index: Array<number> = [];

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
        let normals: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        let scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.035));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.04));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();

        let normals2: Array<Vector3f> = new Array<Vector3f>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        let ukBasslineBpm = 130 / 2;
        let ukBasslineClapMs = 60000 / ukBasslineBpm;
        let smashTime = sync % ukBasslineClapMs;
        let smash = (this.cosineInterpolate(0, 15, smashTime) - this.cosineInterpolate(15, 200, smashTime) +
            0.4 * this.cosineInterpolate(200, 300, smashTime) - 0.4 * this.cosineInterpolate(300, 400, smashTime)
        )
            * 12;
        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 20,
            Math.sin(elapsedTime * 0.05) * 8 - smash, -28).multiplyMatrix(modelViewMartrix);

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

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
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

                    const clippedPolygon = SutherlandHodgman2DClipper.clipConvexPolygon(new Array<Vector3f>(v1, v2, v3), color);

                    if (clippedPolygon.length < 3) {
                        continue;
                    }

                    // triangulate new point set
                    for (let i = 0; i < clippedPolygon.length - 2; i++) {
                        this.triangleRasterizer.drawTriangleDDA(clippedPolygon[0], clippedPolygon[1 + i], clippedPolygon[2 + i], color);
                    }
                } else {
                    this.triangleRasterizer.drawTriangleDDA(v1, v2, v3, color);
                    //this.drawTriangleDDA2(v1, v2, v3, new Vector3f(0, 0, 0), new Vector3f(0, 16, 0), new Vector3f(16, 16, 0), color);
                }
            }
        }
    }

    public shadingTorus4(elapsedTime: number): void {

        this.wBuffer.fill(100);
        let points: Array<Vector3f> = [];
        let textCoords: Array<TextureCoordinate> = [];

        const STEPS = 15;
        const STEPS2 = 8;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
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

        // compute normals
        let normals: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        let scale = 2.1;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.25));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.3));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();

        let normals2: Array<Vector3f> = new Array<Vector3f>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10
            , -45)
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

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        let vertexArray = new Array<Vertex>(new Vertex(), new Vertex(), new Vertex());

        for (let i = 0; i < index.length; i += 3) {
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];

            if (this.isTriangleCCW(v1, v2, v3)) {
                let normal = normals2[i / 3];
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f(0.2, 0.2, 1).normalize())) * 255), 255);
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;

                vertexArray[0].position = v1;
                vertexArray[0].textureCoordinate = textCoords[index[i]];

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = textCoords[index[i + 1]];

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = textCoords[index[i + 2]];

                if (v1.x < Framebuffer.minWindow.x || v2.x < Framebuffer.minWindow.x || v3.x < Framebuffer.minWindow.x ||
                    v1.x > Framebuffer.maxWindow.x || v2.x > Framebuffer.maxWindow.x || v3.x > Framebuffer.maxWindow.x ||
                    v1.y < Framebuffer.minWindow.y || v2.y < Framebuffer.minWindow.y || v3.y < Framebuffer.minWindow.y ||
                    v1.y > Framebuffer.maxWindow.y || v2.y > Framebuffer.maxWindow.y || v3.y > Framebuffer.maxWindow.y) {
                    this.clipConvexPolygon2(vertexArray, color);
                } else {
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

    public shadingTorusENvironment(elapsedTime: number): void {

        this.wBuffer.fill(100);
        let points: Array<Vector3f> = [];
        let textCoords: Array<TextureCoordinate> = [];

        // compute normals
        let normals: Array<Vector3f> = new Array<Vector3f>();
        const STEPS = 15 * 2;
        const STEPS2 = 8 * 2;
        for (let i = 0; i < STEPS + 1; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2 + 1; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
                normals.push(frame.sub(pos).normalize());
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

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();

        let normals2: Array<Vector3f> = new Array<Vector3f>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.3) * 26, Math.sin(elapsedTime * 0.2) * 10
            , -45)
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

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
        }

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3f(0.1, 0.1, -1).normalize())) * 205 + 50), 255);
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
                } else {
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

    public divideSphere(points: Array<Vector3f>, index: Array<number>, steps: number) {

        let points2: Array<Vector3f> = [];
        let normals2: Array<Vector3f> = [];
        let index2: Array<number> = [];

        let c = 0;
        for (let i = 0; i < index.length; i += 3) {
            let v1 = points[index[i]];
            let v2 = points[index[i + 1]];
            let v3 = points[index[i + 2]];

            let vn1 = v2.sub(v1).mul(0.5).add(v1).normalize();
            let vn2 = v3.sub(v2).mul(0.5).add(v2).normalize();
            let vn3 = v1.sub(v3).mul(0.5).add(v3).normalize();

            points2.push(v1); points2.push(vn1); points2.push(vn3);
            normals2.push(v1); normals2.push(vn1); normals2.push(vn3);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn1); points2.push(v2); points2.push(vn2);
            normals2.push(vn1); normals2.push(v2); normals2.push(vn2);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn1); points2.push(vn2); points2.push(vn3);
            normals2.push(vn1); normals2.push(vn2); normals2.push(vn3);
            index2.push(c++); index2.push(c++); index2.push(c++);

            points2.push(vn3); points2.push(vn2); points2.push(v3);
            normals2.push(vn3); normals2.push(vn2); normals2.push(v3);
            index2.push(c++); index2.push(c++); index2.push(c++);
        }

        if (steps > 0) {
            return this.divideSphere(points2, index2, --steps);
        } else {
            return {
                points: points2,
                normals: normals2,
                index: index2
            }
        }
    }

    public createSphere() {

        let pointsA: Array<Vector3f> = [
            new Vector3f(0.0, -1.0, 0.0),
            new Vector3f(1.0, 0.0, 0.0),
            new Vector3f(0.0, 0.0, 1.0),
            new Vector3f(-1.0, 0.0, 0.0),
            new Vector3f(0.0, 0.0, -1.0),
            new Vector3f(0.0, 1.0, 0.0)
        ];

        let indexA: Array<number> = [
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
        let points: Array<Vector3f> = [];
        let points2: Array<Vector3f> = [];
        let normals: Array<Vector3f> = [];
        let normals2: Array<Vector3f> = [];

        let index: Array<number> = [];

        k.index.forEach(i => {
            let p = k.points[i];

            let point = points.find(point => point.sub(p).length() < 0.001);

            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(p => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
        })

        return {
            points,
            points2,
            normals,
            normals2,
            index
        }
    }


    public createPlane() {


        let k = {
            points: []
        }
        for (let y = 0; y < 60; y++) {
            for (let x = 0; x < 100; x++) {
                k.points.push(new Vector3f(0 + x, 0 + y, 0));
                k.points.push(new Vector3f(0 + x, 1 + y, 0));
                k.points.push(new Vector3f(1 + x, 0 + y, 0));

                k.points.push(new Vector3f(1 + x, 0 + y, 0));
                k.points.push(new Vector3f(0 + x, 1 + y, 0));
                k.points.push(new Vector3f(1 + x, 1 + y, 0));
            }
        }
        // optimize
        let points: Array<Vector3f> = [];
        let points2: Array<Vector3f> = [];
        let normals: Array<Vector3f> = [];
        let normals2: Array<Vector3f> = [];

        let index: Array<number> = [];

        k.points.forEach(i => {
            let p = i;

            let point = points.find(point => point.sub(p).length() < 0.001);

            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(p => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
        })

        return {
            points,
            points2,
            normals,
            normals2,
            index
        }
    }

    public createCylinder() {
        let k = {
            points: []
        }

        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                let xx = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                let xx2 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                let yy = Math.cos(2 * Math.PI / LOOPX * x) * 30;
                let yy2 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;

                k.points.push(new Vector3f(xx, 0 + y, yy));
                k.points.push(new Vector3f(xx, 1 + y, yy));
                k.points.push(new Vector3f(xx2, 0 + y, yy2));

                k.points.push(new Vector3f(xx2, 0 + y, yy2));
                k.points.push(new Vector3f(xx, 1 + y, yy));
                k.points.push(new Vector3f(xx2, 1 + y, yy2));
            }
        }
        // optimize
        let points: Array<Vector3f> = [];
        let points2: Array<Vector3f> = [];
        let normals: Array<Vector3f> = [];
        let normals2: Array<Vector3f> = [];
        let texture: Array<TextureCoordinate> = [];

        let index: Array<number> = [];

        k.points.forEach(i => {
            let p = i;

            let point = points.find(point => point.sub(p).length() < 0.001);

            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(p => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
            texture.push(new TextureCoordinate());
        })

        return {
            points,
            points2,
            normals,
            normals2,
            index,
            texture
        }
    }

    public createSphereDistplaced(texture: Texture) {
        let sphere: {
            points: Array<Vector3f>,
            points2: Array<Vector3f>,
            normals: Array<Vector3f>,
            normals2: Array<Vector3f>,
            index: Array<number>
        } = this.createSphere();
        let newPoints: Array<Vector3f> = new Array<Vector3f>();
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

    public createCylinder2(texture: Texture) {
        let k = {
            points: []
        }

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
                k.points.push(new Vector3f(x0 * disp_x0y0, 0 + y, z0 * disp_x0y0));
                k.points.push(new Vector3f(x0 * disp_x0y1, 1 + y, z0 * disp_x0y1));
                k.points.push(new Vector3f(x1 * disp_x1y0, 0 + y, z1 * disp_x1y0));

                k.points.push(new Vector3f(x1 * disp_x1y0, 0 + y, z1 * disp_x1y0));
                k.points.push(new Vector3f(x0 * disp_x0y1, 1 + y, z0 * disp_x0y1));
                k.points.push(new Vector3f(x1 * disp_x1y1, 1 + y, z1 * disp_x1y1));
            }
        }
        // optimize
        let points: Array<Vector3f> = [];
        let points2: Array<Vector3f> = [];
        let normals: Array<Vector3f> = [];
        let normals2: Array<Vector3f> = [];

        let index: Array<number> = [];

        k.points.forEach(i => {
            let p = i;

            let point = points.find(point => point.sub(p).length() < 0.001);

            if (point) {
                let idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(p => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
        })

        return {
            points,
            points2,
            normals,
            normals2,
            index
        }
    }

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

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

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

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

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

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

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

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

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

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

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

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

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

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], color);
                }
            }
        }
    }

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

        // FIXME: speed up
        // - remove normalie from lighting
        // - remove normalize after normal transformation!
        // - precreate array for transformed vertices and normals

        for (let i = 0; i < normals.length; i++) {
            normals[i].normalize2();
        }

        /**
         * Vertex Shader Stage
         */
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

        /**
         * Primitive Assembly and Rasterization Stage:
         * 1. back-face culling
         * 2. viewport transform
         * 3. scan conversion (rasterization)
         */

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
    public createBunny(): any {
        let points: Array<Vector3f> = new Array<Vector3f>();

        bunnyJson.vertices.forEach(x => {
            points.push(new Vector3f(x.x, x.y, x.z));
        });

        let normals: Array<Vector3f> = new Array<Vector3f>();

        bunnyJson.normals.forEach(x => {
            normals.push(new Vector3f(x.x, x.y, x.z).normalize());
        });

        let index: Array<number> = bunnyJson.faces;

        let points2: Array<Vector3f> = new Array<Vector3f>();
        let normals2: Array<Vector3f> = new Array<Vector3f>();

        for (let i = 0; i < points.length; i++) {
            points2.push(new Vector3f(0, 0, 0));
        }

        for (let i = 0; i < normals.length; i++) {
            normals2.push(new Vector3f(0, 0, 0));
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
                    this.drawTriangleDDA2(vertexArray[0], vertexArray[1], vertexArray[2], 0);
                }
            }
        }
    }

    public fakeSphere(normal: Vector3f, vertex: Vertex): void {
        // https://www.mvps.org/directx/articles/spheremap.htm
        //vertex.textureCoordinate.u = 0.5 + normal.x * 0.5;
        //vertex.textureCoordinate.v = 0.5 - normal.y * 0.5;
        vertex.textureCoordinate.u = 0.5 + Math.asin(normal.x) / Math.PI;
        vertex.textureCoordinate.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }

    public fakeSphere2(normal: Vector3f, tex: TextureCoordinate): void {
        tex.u = 0.5 + Math.asin(normal.x) / Math.PI;
        tex.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }
    public shadingTorus3(elapsedTime: number): void {
        let points: Array<Vector3f> = [];
        const STEPS = 15 * 2;
        const STEPS2 = 12 * 2;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3f(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
            }
        }

        let scale = 1.2;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3f> = new Array<Vector3f>();


        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25,
            Math.sin(elapsedTime * 0.05) * 9, -34).multiplyMatrix(modelViewMartrix);

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

            points2.push(new Vector3f(Math.round(xx), Math.round(yy), z));
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

    // Sutherland-Hodgman
    // http://www.sunshine2k.de/coding/java/SutherlandHodgman/SutherlandHodgman.html
    // http://www.cubic.org/docs/3dclip.htm

    private static clipRegion = new Array<AbstractClipEdge>(
        new RightClipEdge(),
        new LeftClipEdge(),
        new BottomClipEdge(),
        new TopClipEdge()
    );

    public clipConvexPolygon2(subject: Array<Vertex>, color: number): void {

        let output = subject;

        for (let j = 0; j < Framebuffer.clipRegion.length; j++) {
            let edge = Framebuffer.clipRegion[j];
            let input = output;
            output = new Array<Vertex>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                let point = input[i];
                if (edge.isInside2(point)) {
                    if (!edge.isInside2(S)) {
                        output.push(edge.computeIntersection2(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside2(S)) {
                    output.push(edge.computeIntersection2(S, point));
                }
                S = point;
            }
        };

        if (output.length < 3) {
            return;
        }

        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
            this.drawTriangleDDA2(output[0], output[1 + i], output[2 + i], color);
        }
    }

    lensFlareVisible: boolean = false;
    lensFlareStart = 0;
    lensFlareEnd = 0;

    public drawLensFlare(screenPos: Vector3f, elapsedTime: number, texture: { tex: Texture, scale: number, alpha: number }[], dirt: Texture): void {
        let pos = screenPos;

        if (pos.z < 0 &&
            pos.x > 0 && pos.x < 320 &&
            pos.y > 0 && pos.y < 200 &&
            this.wBuffer[pos.x + (pos.y * 320)] > (1 / pos.z)) {
            if (!this.lensFlareVisible) {
                this.lensFlareVisible = true;
                this.lensFlareStart = elapsedTime;
            }
        } else {
            if (this.lensFlareVisible) {
                this.lensFlareVisible = false;
                this.lensFlareEnd = elapsedTime;
            }
        }

        let scale = this.interpolate(this.lensFlareStart, this.lensFlareStart + 100, elapsedTime);
        if (this.lensFlareVisible != true) {
            scale *= (1 - this.interpolate(this.lensFlareEnd, this.lensFlareEnd + 100, elapsedTime));
        }
        let dir = new Vector3f(320 / 2, 200 / 2, 0).sub(pos);

        if (scale > 0) {
            for (let i = 0; i < texture.length; i++) {
                let temp = pos.add(dir.mul(texture[i].scale));
                this.drawTexture(Math.round(temp.x) - texture[i].tex.width / 2, Math.round(temp.y) - texture[i].tex.height / 2, texture[i].tex, texture[i].alpha * scale);
            }
        }

        this.drawTextureRectAdd(0, 0, 0, 0, 320, 200, dirt, 0.03 + 0.15 * scale);
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
    public isTriangleCCW(v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }, v3: { x: number, y: number, z: number }): boolean {
        let det: number =  //(v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x);
            v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v1.y - v1.x * v3.y;
        if (this.cullMode == CullFace.BACK) {
            return det < 0.0;
        } else {
            return det > 0.0;
        }
    }

    private isTriangleCCW2(v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }, v3: { x: number, y: number, z: number },
        v4: { x: number, y: number, z: number }): boolean {
        let det: number = //(v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x) - (v3.y - v2.y) * (v4.x - v2.x);
            v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v4.y - v4.x * v3.y +
            v4.x * v1.y - v1.x * v4.y;
        if (this.cullMode == CullFace.BACK) {
            return det < 0.0;
        } else {
            return det > 0.0;
        }
    }

    fillLongRightTriangle2(v1: Vertex, v2: Vertex, v3: Vertex, color: number): void {
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)

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

    fillLongLeftTriangle2(v1: Vector3f, v2: Vector3f, v3: Vector3f, t1: Vector3f, t2: Vector3f, t3: Vector3f, color: number): void {

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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)


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

    public drawTriangleDDA2(p1: Vertex, p2: Vertex, p3: Vertex, color: number): void {

        let temp: Vertex;

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
        } */else {
            let x = (p3.position.x - p1.position.x) * (p2.position.y - p1.position.y) / (p3.position.y - p1.position.y) + p1.position.x;
            if (x > p2.position.x) {
                this.fillLongRightTriangle2(p1, p2, p3, color);
            } else {
                let tex = p1.textureCoordinate;
                let tex2 = p2.textureCoordinate;
                let tex3 = p3.textureCoordinate;
                this.fillLongLeftTriangle2(p1.position, p2.position, p3.position, new Vector3f(tex.u, tex.v, 0), new Vector3f(tex2.u, tex2.v, 0), new Vector3f(tex3.u, tex3.v, 0), color);
            }
        }
    }

    /**
     * digital differential analyser line drawing algorithm
     * using fixed point math.
     * renders approx 1400 lines per millisecond on my machine
     */
    public drawLineDDA(start: Vector3f, end: Vector3f, color: number): void {
        let xDistance: number = end.x - start.x;
        let yDistance: number = end.y - start.y;

        let dx: number, dy: number, length: number;

        if (Math.abs(xDistance) > Math.abs(yDistance)) {
            dx = Math.sign(xDistance);
            dy = yDistance / Math.abs(xDistance);
            length = Math.abs(xDistance);
        } else {
            dx = xDistance / Math.abs(yDistance);
            dy = Math.sign(yDistance);
            length = Math.abs(yDistance);
        }

        let xPosition: number = start.x;
        let yPosition: number = start.y;

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

    public drawLineDDANoZ(start: Vector3f, end: Vector3f, color: number): void {
        let xDistance: number = end.x - start.x;
        let yDistance: number = end.y - start.y;

        let dx: number, dy: number, length: number;

        if (Math.abs(xDistance) > Math.abs(yDistance)) {
            dx = Math.sign(xDistance);
            dy = yDistance / Math.abs(xDistance);
            length = Math.abs(xDistance);
        } else {
            dx = xDistance / Math.abs(yDistance);
            dy = Math.sign(yDistance);
            length = Math.abs(yDistance);
        }

        let xPosition: number = start.x;
        let yPosition: number = start.y;

        for (let i = 0; i <= length; i++) {

            this.drawPixel(Math.round(xPosition), Math.round(yPosition), color);

            xPosition += dx;
            yPosition += dy;

        }
    }

    drawVoxelLandscape3(texture: Texture, time: number) {
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

    drawVoxelLandscape4(texture: Texture, time: number) {
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
