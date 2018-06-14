
import { ComputationalGeometryUtils } from './math/Geometry';
import { Sphere } from './math/Sphere';
import { CullFace } from './CullFace';
import { TextureCoordinate, Vertex } from './Vertex';
import { Texture } from './texture';
import { Matrix3f, Matrix4f, Vector3f, Vector4f } from './math';
import { ControllableCamera } from './camera';
import RandomNumberGenerator from './RandomNumberGenerator';
import { Color } from './core/Color';
import { AbstractClipEdge } from './screen-space-clipping/AbstractClipEdge';
import { RightClipEdge } from './screen-space-clipping/RightClipEdge';
import { LeftClipEdge } from './screen-space-clipping/LeftClipEdge';
import { TopClipEdge } from './screen-space-clipping/TopClipEdge';
import { BottomClipEdge } from './screen-space-clipping/BottomClipEdge';
import { CohenSutherlandLineClipper } from './screen-space-clipping/CohenSutherlandLineClipper';
import { Torus } from './geometrical-objects/Torus';
import { TriangleRasterizer } from './rasterizer/TriangleRasterizer';
import { ScaleClipBlitter } from './blitter/ScaleClipBlitter';
import { TexturedTriangleRasterizer } from './rasterizer/TexturedTriangleRasterizer';
import { FlatShadingRenderingPipeline } from './rendering-pipelines/FlatShadingRenderingPipeline';
import { TexturingRenderingPipeline } from './rendering-pipelines/TexturingRenderingPipeline';

let bunnyJson = <any>require('./assets/bunny.json');
let roomJson = <any>require('./assets/room.json');
let hoodlumJson = <any>require('./assets/hoodlum.json');
let labJson = <any>require('./assets/lab.json');
let labJson2 = <any>require('./assets/lab2.json');
let bakedJson = <any>require('./assets/abstract.json');
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
    private blenderObj4: any;
    private blenderObj5: any;
    private blenderObj6: any;
    private blenderObj7: any;
    public bob: Texture;
    private sphere: any;
    private plane: any;
    private cylinder: any;
    private cylinder2: any;
    private sphereDisp: any;
    private sphereDisp2: any;

    private linerClipper = new CohenSutherlandLineClipper(this);
    public triangleRasterizer = new TriangleRasterizer(this);
    public texturedTriangleRasterizer = new TexturedTriangleRasterizer(this);

    private scaleClipBlitter = new ScaleClipBlitter(this);
    public renderingPipeline = new FlatShadingRenderingPipeline(this);
    public texturedRenderingPipeline = new TexturingRenderingPipeline(this);

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

    public clearColorBuffer(color: number) {
        this.framebuffer.fill(color);
    }

    public drawPixel(x: number, y: number, color: number) {
        this.framebuffer[x + y * this.width] = color;
    }

    public readPixel(x: number, y: number, color: number): number {
        return this.framebuffer[x + y * this.width];
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
            this.scaleClipBlitter.drawScaledTextureClip(
                320 / 2 - width / 2,
                200 / 2 - height / 2,
                width, height, texture, 0.19 * (15 - i) / 15);
            this.fastFramebufferCopy(this.tmpGlitch, this.framebuffer);
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
    public static minWindow: Vector3f = new Vector3f(0, 0, 0);
    public static maxWindow: Vector3f = new Vector3f(319, 199, 0);
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
    
    public drawScreenBounds(framebuffer: Framebuffer): void {
        const color: number = Color.WHITE.toPackedFormat();
        const width: number = 320 / 2;
        const height: number = 200 / 2;

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2, 0),
            new Vector3f(width / 2 + width, height / 2, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2, 0),
            new Vector3f(width / 2, height / 2 + height, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2 + width, height / 2, 0),
            new Vector3f(width / 2 + width, height / 2 + height, -100),
            color
        );

        framebuffer.drawLineDDANoZ(
            new Vector3f(width / 2, height / 2 + height, 0),
            new Vector3f(width / 2 + width, height / 2 + height, -100),
            color
        );
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
                this.renderingPipeline.draw(model, mv, 200, 255, 216);

            if (j === 0)
            this.renderingPipeline.draw(model, mv, 244, 200, 216);
            if (j === 2)
            this.renderingPipeline.draw(model, mv, 244, 225, 216);

        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, 14.2, -4).multiplyMatrix(Matrix4f.constructScaleMatrix(7, 7, 9).multiplyMatrix(
                Matrix4f.constructXRotationMatrix(
                    Math.PI * 2 * this.cosineInterpolate(0, 1300, Math.floor(elapsedTime * 0.7) % 4000)))
            ));

        let model2 = this.blenderObj5[0];
        this.renderingPipeline.draw(model2, mv, 200, 255, 216);

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
            this.renderingPipeline.draw(model, mv, 244 * scal, 225 * scal, 216 * scal);
        }

        mv = camera.multiplyMatrix(
            Matrix4f.constructTranslationMatrix(0, -5.5, 0).multiplyMatrix(
                Matrix4f.constructScaleMatrix(413, 413, 413).multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(Math.PI * 0.5)
                )
            ));

        let model = this.blenderObj7[0];
        this.renderingPipeline.draw(model, mv, 244, 100, 116);

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

            this.renderingPipeline.draw(this.torus.getMesh(), modelViewMartrix, 215, 30, 120);
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
    public fakeSphere(normal: Vector4f, vertex: Vertex): void {
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

    private static clipRegion = new Array<AbstractClipEdge>(
        new RightClipEdge(),
        new LeftClipEdge(),
        new BottomClipEdge(),
        new TopClipEdge()
    );

    public clipConvexPolygon2(subject: Array<Vertex>): void {

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
            this.texturedTriangleRasterizer.drawTriangleDDA2(output[0], output[1 + i], output[2 + i]);
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
