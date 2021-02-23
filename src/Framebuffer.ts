
import { ScaleClipBlitter } from './blitter/ScaleClipBlitter';
import { ControllableCamera } from './camera';
import { Color } from './core/Color';
import { CullFace } from './CullFace';
import { Torus } from './geometrical-objects/Torus';
import { Matrix3f, Matrix4f, Vector2f, Vector3f, Vector4f } from './math';
import { Sphere } from './math/Sphere';
import RandomNumberGenerator from './RandomNumberGenerator';
import { FlatShadingTriangleRasterizer } from './rasterizer/FlatShadingTriangleRasterizer';
import { LineRasterizerDda } from './rasterizer/line/LineRasterizer';
import { LineRasterizerNoZ } from './rasterizer/line/LineRasterizerNoZ';
import { TexturedTriangleRasterizer } from './rasterizer/TexturedTriangleRasterizer';
import { FlatShadingRenderingPipeline } from './rendering-pipelines/FlatShadingRenderingPipeline';
import { TexturingRenderingPipeline } from './rendering-pipelines/TexturingRenderingPipeline';
import { AbstractClipEdge } from './screen-space-clipping/AbstractClipEdge';
import { BottomClipEdge } from './screen-space-clipping/BottomClipEdge';
import { CohenSutherlandLineClipper } from './screen-space-clipping/CohenSutherlandLineClipper';
import { LeftClipEdge } from './screen-space-clipping/LeftClipEdge';
import { RightClipEdge } from './screen-space-clipping/RightClipEdge';
import { TopClipEdge } from './screen-space-clipping/TopClipEdge';
import { Texture } from './texture/Texture';
import { TextureCoordinate } from './TextureCoordinate';
import { Vertex } from './Vertex';
import { BlenderJsonParser } from './blender/BlenderJsonParser';
import { Material } from './shading/material/Material';
import { PointLight } from './shading/light/PointLight';


// let labJson2 = <any>require('./assets/lab2.json');
// let bakedJson = <any>require('./assets/abstract.json');

export class Framebuffer {

    public static PIXEL_SIZE_IN_BYTES = 4;

    public static minWindow: Vector2f;
    public static maxWindow: Vector2f;


    public framebuffer: Uint32Array;
    public wBuffer: Float32Array;

    public cullMode: CullFace = CullFace.BACK;

    public camera: ControllableCamera;
    public bob: Texture;
    public triangleRasterizer = new FlatShadingTriangleRasterizer(this);
    public texturedTriangleRasterizer = new TexturedTriangleRasterizer(this);

    public scaleClipBlitter = new ScaleClipBlitter(this);
    public renderingPipeline: FlatShadingRenderingPipeline;
    public texturedRenderingPipeline: TexturingRenderingPipeline;
    public lineRasterizer = new LineRasterizerDda(this);
    public lineRasterizerNo = new LineRasterizerNoZ(this);
    public tmpGlitch: Uint32Array;

    public lensFlareVisible: boolean = false;
    public lensFlareStart = 0;
    public lensFlareEnd = 0;

    public width: number;
    public height: number;
    private imageData: ImageData;
    private unsignedIntArray: Uint8ClampedArray;

    private torus = new Torus();

    private linerClipper = new CohenSutherlandLineClipper(this);
    public clipRegion = Array<AbstractClipEdge>();
    private texture = new Texture();

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(width, height);
        this.wBuffer = new Float32Array(width * height);
        const arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
        this.tmpGlitch = new Uint32Array(width * height);
        this.renderingPipeline = new FlatShadingRenderingPipeline(this);
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(this);
        Framebuffer.minWindow = new Vector2f(0, 0);
        Framebuffer.maxWindow = new Vector2f(width - 1, height - 1);

        this.clipRegion = new Array<AbstractClipEdge>(
            new RightClipEdge(this.width),
            new LeftClipEdge(),
            new BottomClipEdge(),
            new TopClipEdge()
        );
    }

    public setCullFace(face: CullFace): void {
        this.cullMode = face;
    }

    public setTexture(texture: Texture): void {
        this.bob = texture;
    }

    public precompute(): void {
        //this.blengetBlenderScene(hoodlumJson, false);
        // this.sphere = this.createSphere();
        // this.plane = this.createPlane();
        // this.cylinder = this.createCylinder();
        // this.cylinder2 = this.createCylinder2(texture);
        // this.sphereDisp = this.createSphereDistplaced(texture);
    }

    public getImageData(): ImageData {
        this.imageData.data.set(this.unsignedIntArray);
        return this.imageData;
    }

    public clear() {
        const color: number = Color.BLACK.toPackedFormat();
        const count: number = this.width * this.height;
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
    public drawPixel4(x: number, y: number, color: number, alpha: number) {
        const index: number = x + y * this.width;
        const inverseAlpha = 1 - alpha;
        const r = (((this.framebuffer[index] >> 0) & 0xff) * (inverseAlpha)
            + ((color >> 0) & 0xff) * (alpha)) | 0;
        const g = (((this.framebuffer[index] >> 8) & 0xff) * (inverseAlpha) +
            ((color >> 8) & 0xff) * (alpha)) | 0;
        const b = (((this.framebuffer[index] >> 16) & 0xff) * (inverseAlpha) +
            ((color >> 16) & 0xff) * (alpha)) | 0;
        this.framebuffer[x + y * this.width] = r | (g << 8) | (b << 16) | (255 << 24);

    }

    public drawPixel3(x: number, y: number, color: number, alpha2: number) {

        const index: number = x + y * this.width;
        const alpha = ((color >> 24) & 0xff) / 255 * alpha2;
        const inverseAlpha = 1 - alpha;

        const r = (((this.framebuffer[index] >> 0) & 0xff) * (inverseAlpha)
            + ((color >> 0) & 0xff) * (alpha)) | 0;
        const g = (((this.framebuffer[index] >> 8) & 0xff) * (inverseAlpha) +
            ((color >> 8) & 0xff) * (alpha)) | 0;
        const b = (((this.framebuffer[index] >> 16) & 0xff) * (inverseAlpha) +
            ((color >> 16) & 0xff) * (alpha)) | 0;

        this.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);

    }

    public readPixel(x: number, y: number): number {
        return this.framebuffer[x + y * this.width];
    }

    public drawRect(x, y, width, color) {
        let start = x + y * this.width;

        for (let i = 0; i < width; i++) {
            this.framebuffer[start++] = color;
        }
    }

    public drawRect2(x: number, y: number, width: number, height: number, color: number) {
        let start = x + y * this.width;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {

                this.framebuffer[start++] = color;

            }
            start += this.width - width;
        }
    }

    public drawText(x: number, y: number, text: string, texture: Texture): void {
        let xpos = x;
        const firstIndex = ' '.charCodeAt(0);
        for (let i = 0; i < text.length; i++) {
            const index = text.charCodeAt(i) - firstIndex;
            const tx = Math.floor(index % 32) * 8;
            const ty = Math.floor(index / 32) * 8;
            this.drawTextureRectFastAlpha(xpos, y, tx, ty, 8, 8, texture);
            xpos += 8;
        }
    }

    public addReflections() {
        const start = 150;
        for (let i = 0; i < 50; i++) {
            for (let x = 0; x < this.width; x++) {
                this.framebuffer[(start + i) * this.width + x] = this.framebuffer[(start - i * 3 - 1) * this.width + x +
                    this.interpolate(0, 50, i) * (Math.sin(Date.now() * 0.002 + i * 0.2) * 10) | 0];
            }
        }
    }

    public drawTextureRect2(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                const texIndex = (xt + w) + ((yt + h) * texture.width);
                const frIndex = (xs + w) + ((ys + h) * this.width);
                const alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                const inverseAlpha = 1 - alpha;

                const r = (((this.framebuffer[frIndex] >> 0) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 0) & 0xff) * (alpha)) | 0;
                const g = (((this.framebuffer[frIndex] >> 8) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 8) & 0xff) * (alpha)) | 0;
                const b = (((this.framebuffer[frIndex] >> 16) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 16) & 0xff) * (alpha)) | 0;

                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
            }
        }
    }

    public drawTextureRectFastAlpha(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture): void {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * this.width;

        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                const color = texture.texture[texIndex];
                if (color & 0xff000000) {
                    this.framebuffer[frIndex] = color;
                }
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += this.width - width;
        }
    }

    public drawTextureRectNoAlpha(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture): void {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * this.width;

        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                this.framebuffer[frIndex] = texture.texture[texIndex];
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += this.width - width;
        }
    }

    /**
     * Transitions from one pixel to another using alpha
     *
     * @param  {number} c1
     * @param  {number} c2
     * @return {number}     difference between c1 and c2 from 0-255
     */
    public static blend(c1: number, c2: number, nAlpha: number): number {

        if (0 === nAlpha) {
            return c1;
        }

        if (255 === nAlpha) {
            return c2;
        }

        const nInvAlpha: number = 255 - nAlpha;

        const r1: number = (c1 & 0x00FF0000) >> 16;
        const r2: number = (c2 & 0x00FF0000) >> 16;
        const r: number = (r2 * nAlpha + r1 * nInvAlpha) >> 8;

        const g1: number = (c1 & 0x0000FF00) >> 8;
        const g2: number = (c2 & 0x0000FF00) >> 8;
        const g: number = (g2 * nAlpha + g1 * nInvAlpha) >> 8;

        const b1: number = (c1 & 0x000000FF);
        const b2: number = (c2 & 0x000000FF);
        const b: number = (b2 * nAlpha + b1 * nInvAlpha) >> 8;

        return 0xff000000 | r << 16 | g << 8 | b;
    }

    public drawTextureRect(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Uint32Array, pixelWidth: number, alpha2: number): void {
        let texIndex = xt + yt * pixelWidth;
        let frIndex = xs + ys * this.width;

        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                const alpha = ((texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                const inverseAlpha = 1 - alpha;

                const fbPixel = this.framebuffer[frIndex];
                const txPixel = texture[texIndex];

                const r = (fbPixel >> 0 & 0xff) * inverseAlpha + (txPixel >> 0 & 0xff) * alpha;
                const g = (fbPixel >> 8 & 0xff) * inverseAlpha + (txPixel >> 8 & 0xff) * alpha;
                const b = (fbPixel >> 16 & 0xff) * inverseAlpha + (txPixel >> 16 & 0xff) * alpha;

                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                texIndex++;
                frIndex++;
            }
            texIndex += pixelWidth - width;
            frIndex += this.width - width;
        }
    }

    public drawTextureRectAdd(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * this.width;

        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                const alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;

                const fbPixel = this.framebuffer[frIndex];
                const txPixel = texture.texture[texIndex];

                const r = Math.min(255, (fbPixel >> 0 & 0xff) + (txPixel >> 0 & 0xff) * alpha);
                const g = Math.min(255, (fbPixel >> 8 & 0xff) + (txPixel >> 8 & 0xff) * alpha);
                const b = Math.min(255, (fbPixel >> 16 & 0xff) + (txPixel >> 16 & 0xff) * alpha);

                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += this.width - width;
        }
    }

    public pixelate() {
        const xoff = 200;
        const yoff = 50;

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                this.drawBox2(x * 10 + xoff, y * 10 + yoff, 10, 10, this.readPixel(x * 10 + xoff, y * 10 + yoff));
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

    public fastFramebufferCopyOffset(src: Uint32Array, dest: Uint32Array, offset = 0) {
        let i = this.width * this.height / 32 + 1;
        let k = this.width * this.height;
        let l = this.width * (this.height - offset);
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
    public fastFramebufferCopy(src: Uint32Array, dest: Uint32Array) {
        src.set(dest);
    }

    public drawPolarDistotion2(elapsedTime: number, texture: Texture): void {
        let i = 0;
        const distScale = 1.355 * (0.4 + 0.6 * 0.5 * (1 + Math.sin(elapsedTime * 0.00017)));
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const xdist = (x - this.width / 2);
                const ydist = (y - this.height / 2);
                const dist = Math.sqrt(xdist * xdist + ydist * ydist) * distScale;
                const angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256;

                const color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];

                this.framebuffer[i++] = color1;
            }
        }
    }

    public drawPolarDistotion3(elapsedTime: number, texture: Texture): void {
        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const xdist = (x - this.width / 2);
                const ydist = (y - this.height / 2);
                const dist = Math.sqrt(xdist * xdist + ydist * ydist) * 0.8 - (elapsedTime * 0.017);
                const angle = Math.atan2(xdist, ydist) / (Math.PI * 2) * 256 + (elapsedTime * 0.017);

                const color1 = texture.texture[(dist & 0xff) + (angle & 0xff) * 256];

                this.framebuffer[i++] = color1;
            }
        }
    }

    public noise(elapsedTime: number, texture: Texture, scale: number = 0.07): void {
        const rng = new RandomNumberGenerator();
        rng.setSeed(elapsedTime);
        for (let y = 0; y < this.height; y++) {
            this.drawTextureRect(0, y, Math.floor(rng.getFloat() * (texture.texture.length - this.width)), 0, this.width, 1, texture.texture, texture.width, scale);
        }
    }

    public drawTexturedBillboard(xp: number, yp: number, width: number, height: number, texture: Texture, z: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {
                    this.wBuffer[index2] = z;
                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                    const r = (this.framebuffer[index2] >> 0 & 0xff) + (texture.texture[textureIndex] >> 0 & 0xff);
                    const g = (this.framebuffer[index2] >> 8 & 0xff) + (texture.texture[textureIndex] >> 8 & 0xff);
                    const b = (this.framebuffer[index2] >> 16 & 0xff) + (texture.texture[textureIndex] >> 16 & 0xff);

                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += yStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {

                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                    const inverseAlpha = 1 - alpha;
                    const framebufferPixel = this.framebuffer[index2];
                    const texturePixel = texture.texture[textureIndex];

                    const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                    const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                    const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawParticle2(
        xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number,
        imgNum: number = 0, spritH: number): void {
        const xStep = texture.width / width;
        const yStep = spritH / height;
        let xx = 0;
        let yy = 0;
        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;
        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }
        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }
        let xTextureStart: number;
        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }
        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {

                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, spritH - 1) * texture.width +
                        spritH * texture.width * imgNum;

                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                    const inverseAlpha = 1 - alpha;
                    const framebufferPixel = this.framebuffer[index2];
                    const texturePixel = texture.texture[textureIndex];

                    const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                    const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                    const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawParticle2Sub(
        xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number,
        imgNum: number = 0, spritH: number): void {
        const xStep = texture.width / width;
        const yStep = spritH / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > this.height - 1 ||
            xp + width < 0 ||
            xp > this.width - 1) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - (this.height - 1), 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - (this.height - 1), 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = Math.ceil((width + xp) - Math.max(xp + width - (this.width - 1), 0));
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = Math.ceil(width - Math.max(xp + width - (this.width - 1), 0));
        }

        const sub: number = Math.ceil(xp) - xp;
        const suby: number = Math.ceil(yp) - yp;
        xTextureStart += sub * xStep;
        yy += suby * yStep;

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = Math.ceil(xStart) + Math.ceil(yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {

                    const textureIndex = Math.min(Math.round(xx) | 0, texture.width - 1) +
                        Math.min(Math.round(yy) | 0, spritH - 1) * texture.width +
                        spritH * texture.width * imgNum;
                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                    const inverseAlpha = 1 - alpha;
                    const framebufferPixel = this.framebuffer[index2];
                    const texturePixel = texture.texture[textureIndex];
                    const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                    const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                    const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;
                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawParticleNoDepth(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > this.height - 1 ||
            xp + width < 0 ||
            xp > this.width - 1) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {

                const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale;
                const inverseAlpha = 1 - alpha;
                const framebufferPixel = this.framebuffer[index2];
                const texturePixel = texture.texture[textureIndex];

                const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);

                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawSoftParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                if (this.wBuffer[index2] > z) {
                    // float scale = 0.2f;
                    // float fade = clamp((depthMapDepth.x-depth)*scale, 0.0, 1.0);
                    const zDist = Math.min(Math.max(((1 / z - 1 / this.wBuffer[index2])), 0.0), 1.0);
                    // this.wBuffer[index2] = z;
                    const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                    const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * alphaScale * zDist;
                    const inverseAlpha = 1 - alpha;

                    const r = (this.framebuffer[index2] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                    const g = (this.framebuffer[index2] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                    const b = (this.framebuffer[index2] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;

                    this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                }
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawFog(color: Color, fogScale: number, fogOffset: number): void {
        const videoMemorySize: number = this.width * this.height;
        const wBufferScale: number = -fogScale;

        for (let index: number = 0; index < videoMemorySize; index++) {
            const alpha = Math.max(Math.min(wBufferScale * (1 / this.wBuffer[index] + fogOffset), 1.0), 0.0);
            const inverseAlpha = 1.0 - alpha;

            const r = (this.framebuffer[index] >> 0 & 0xff) * inverseAlpha + color.r * alpha;
            const g = (this.framebuffer[index] >> 8 & 0xff) * inverseAlpha + color.g * alpha;
            const b = (this.framebuffer[index] >> 16 & 0xff) * inverseAlpha + color.b * alpha;

            this.framebuffer[index] = r | (g << 8) | (b << 16) | (255 << 24);
        }
    }



    public drawScaledTextureClipBi(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        const alphaScale = 1 / 255 * alphaBlend;
        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                // let textureIndex = //Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                const color = texture.getBilinearFilteredPixel2(xx, yy);

                const alpha = 255 * alphaScale;
                const inverseAlpha = 1 - alpha;

                const framebufferPixel = this.framebuffer[index2];
                const texturePixel = color;

                const r = (framebufferPixel >> 0 & 0xff) * inverseAlpha + (texturePixel >> 0 & 0xff) * alpha;
                const g = (framebufferPixel >> 8 & 0xff) * inverseAlpha + (texturePixel >> 8 & 0xff) * alpha;
                const b = (framebufferPixel >> 16 & 0xff) * inverseAlpha + (texturePixel >> 16 & 0xff) * alpha;

                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawScaledTextureClipBiAdd(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                // let textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;
                const color = texture.getBilinearFilteredPixel2(xx, yy);

                const framebufferPixel = this.framebuffer[index2];
                const texturePixel = color;

                const r = Math.min((framebufferPixel >> 0 & 0xff) + (texturePixel >> 0 & 0xff) * alphaBlend, 255);
                const g = Math.min((framebufferPixel >> 8 & 0xff) + (texturePixel >> 8 & 0xff) * alphaBlend, 255);
                const b = Math.min((framebufferPixel >> 16 & 0xff) + (texturePixel >> 16 & 0xff) * alphaBlend, 255);

                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawScaledTextureClipAdd(xp: number, yp: number, width: number, height: number, texture: Texture, alpha: number = 1.0): void {
        const xStep = texture.width / width;
        const yStep = texture.height / height;
        let xx = 0;
        let yy = 0;

        let newHeight: number;
        let newWidth: number;
        let yStart: number;
        let xStart: number;

        if (yp + height < 0 ||
            yp > (this.height - 1) ||
            xp + width < 0 ||
            xp > (this.width - 1)) {
            return;
        }

        if (yp < 0) {
            yy = yStep * -yp;
            newHeight = (height + yp) - Math.max(yp + height - this.height, 0);
            yStart = 0;
        } else {
            yStart = yp;
            newHeight = height - Math.max(yp + height - this.height, 0);
        }

        let xTextureStart: number;

        if (xp < 0) {
            xTextureStart = xx = xStep * -xp;
            newWidth = (width + xp) - Math.max(xp + width - this.width, 0);
            xStart = 0;
        } else {
            xTextureStart = 0;
            xStart = xp;
            newWidth = width - Math.max(xp + width - this.width, 0);
        }

        let index2 = (xStart) + (yStart) * this.width;
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                const textureIndex = Math.min(xx | 0, texture.width - 1) + Math.min(yy | 0, texture.height - 1) * texture.width;

                const framebufferPixel = this.framebuffer[index2];
                const texturePixel = texture.texture[textureIndex];

                const r = Math.min((framebufferPixel >> 0 & 0xff) + (texturePixel >> 0 & 0xff) * alpha, 255);
                const g = Math.min((framebufferPixel >> 8 & 0xff) + (texturePixel >> 8 & 0xff) * alpha, 255);
                const b = Math.min((framebufferPixel >> 16 & 0xff) + (texturePixel >> 16 & 0xff) * alpha, 255);

                this.framebuffer[index2] = r | (g << 8) | (b << 16) | (255 << 24);
                xx += xStep;
                index2++;
            }
            yy += yStep;
            xx = xTextureStart;
            index2 += -newWidth + this.width;
        }
    }

    public drawTexture(x: number, y: number, texture: Texture, alpha2: number) {
        const SCREEN_WIDTH = this.width;
        const SCREEN_HEIGHT = this.height;

        let framebufferIndex: number = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex: number = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;

        const width: number = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        const height: number = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);

        const textureRowOffset = texture.width - width;
        const framebufferRowOffset = this.width - width;

        const div = 1 / 255 * alpha2;

        for (let yHeight: number = 0; yHeight < height; yHeight++) {
            for (let xWidth: number = 0; xWidth < width; xWidth++) {
                const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * div;
                const inverseAlpha = 1 - alpha;

                const r = (this.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                const g = (this.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                const b = (this.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;

                this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);

                framebufferIndex++;
                textureIndex++;
            }

            textureIndex += textureRowOffset;
            framebufferIndex += framebufferRowOffset;
        }
    }

    public drawTextureFullscreen(texture: Texture, alpha2: number) {

        let framebufferIndex: number = 0;
        const inverseAlpha = 1 - alpha2;
        for (let y: number = 0; y < this.width * this.height; y++) {

            const r = (this.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (texture.texture[framebufferIndex] >> 0 & 0xff) * alpha2;
            const g = (this.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (texture.texture[framebufferIndex] >> 8 & 0xff) * alpha2;
            const b = (this.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (texture.texture[framebufferIndex] >> 16 & 0xff) * alpha2;

            this.framebuffer[framebufferIndex] = r | (g << 8) | (b << 16) | (255 << 24);
            framebufferIndex++;
        }
    }

    public drawTexture3(x: number, y: number, texture: Texture, alpha2: number, time: number) {
        const SCREEN_WIDTH = this.width;
        const SCREEN_HEIGHT = this.height;

        let framebufferIndex: number = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex: number = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;

        const width: number = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        const height: number = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);

        const textureRowOffset = texture.width - width;
        const framebufferRowOffset = this.width - width;

        const div = 1 / 255 * alpha2;

        const mHeight = Math.floor(height * Math.max(Math.min(1, time), 0));

        for (let yHeight: number = 0; yHeight < mHeight; yHeight++) {
            for (let xWidth: number = 0; xWidth < width; xWidth++) {
                const alpha = (texture.texture[textureIndex] >> 24 & 0xff) * div;
                const inverseAlpha = 1 - alpha;

                const r = (this.framebuffer[framebufferIndex] >> 0 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 0 & 0xff) * alpha;
                const g = (this.framebuffer[framebufferIndex] >> 8 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 8 & 0xff) * alpha;
                const b = (this.framebuffer[framebufferIndex] >> 16 & 0xff) * inverseAlpha + (texture.texture[textureIndex] >> 16 & 0xff) * alpha;

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

        const framebufferRowOffset = this.width - texture.width;

        for (let yHeight = 0; yHeight < texture.height; yHeight++) {
            for (let xWidth = 0; xWidth < texture.width; xWidth++) {
                const color = texture.texture[textureIndex];

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

        const index: Array<number> = [
            0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6,
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4,
        ];

        const points: Array<Vector3f> = [
            new Vector3f(1.0, 1.0, -1.0), new Vector3f(-1.0, 1.0, -1.0),
            new Vector3f(-1.0, 1.0, 1.0), new Vector3f(1.0, 1.0, 1.0),
            new Vector3f(1.0, -1.0, 1.0), new Vector3f(-1.0, -1.0, 1.0),
            new Vector3f(-1.0, -1.0, -1.0), new Vector3f(1.0, -1.0, -1.0)
        ];

        const scale = 0.8;

        let modelViewMartrix = Matrix3f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3f.constructXRotationMatrix(elapsedTime * 0.05));

        const points2: Array<Vector3f> = new Array<Vector3f>();
        points.forEach((element) => {
            const transformed = modelViewMartrix.multiply(element);

            const x = transformed.x;
            const y = transformed.y;
            const z = transformed.z - 4 + Math.sin(elapsedTime * 0.09) * 2; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        for (let i = 0; i < index.length; i += 2) {
            const color = 255 | 0 << 16 | 255 << 24;
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector3f {
        return new Vector3f(Math.round((this.width / 2) + (292 * t1.x / (-t1.z))),
            Math.round((this.height / 2) - (t1.y * 292 / (-t1.z))),
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
            const ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            const t3 = new Vector3f(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        } else if (t2.z < NEAR_PLANE_Z) {
            const ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            const t3 = new Vector3f(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
            this.linerClipper.cohenSutherlandLineClipper(this.project(t2), this.project(t3), color);
        }
    }

    public clearDepthBuffer(): void {
        this.wBuffer.fill(-1 / 900);
    }

    public drawBox() {
        const height = Framebuffer.maxWindow.y - Framebuffer.minWindow.y + 1;
        const width = Framebuffer.maxWindow.x - Framebuffer.minWindow.x + 1;
        let index = Framebuffer.minWindow.y * this.width + Framebuffer.minWindow.x;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(255 << 24 | 55 << 16 | 55 << 8 | 55, index, index + width);
            index += this.width;
        }
    }

    public drawBox2(x1: number, y1: number, width: number, height: number, color: number) {

        let index = y1 * this.width + x1;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(color, index, index + width);
            index += this.width;
        }
    }

    // TODO: implement subpixel accuracy
    // https://github.com/specht/cruiser
    public wireFrameSphereClipping(elapsedTime: number): void {

        this.wBuffer.fill(100);

        const points: Array<Vector4f> = [];

        const STEPS = 16;
        const STEPS2 = 16;

        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                points.push(this.sphereFunction2(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2));
            }
        }

        const index: Array<number> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2)); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); // 3

                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2)); // 4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); // 3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 5
            }
        }

        // Create MV Matrix
        const scale = 10.8 + 5 * (Math.sin(elapsedTime * 0.16) + 1) / 2;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0 + 20 * Math.sin(elapsedTime * 0.04), 5 * Math.sin(elapsedTime * 0.06), -22).multiplyMatrix(modelViewMartrix);

        const points2: Array<Vector3f> = new Array<Vector3f>();

        for (let p = 0; p < points.length; p++) {
            const transformed = modelViewMartrix.multiplyHom(points[p]);

            const x = transformed.x;
            const y = transformed.y;
            const z = transformed.z;

            const xx = (this.width * 0.5) + (x / (-z * 0.0078));
            const yy = (this.height * 0.5) + (y / (-z * 0.0078));

            points2.push(new Vector3f(xx, yy, z));
        }

        // draw clip region
        const colred = 255 << 24 | 230 << 16 | this.height << 16 | this.height;
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3f(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), colred);
        this.drawLineDDA(new Vector3f(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), new Vector3f(Framebuffer.maxWindow.x + 2, Framebuffer.maxWindow.y + 1, 0), colred);

        this.drawBox();

        for (let i = 0; i < index.length; i += 3) {
            const v1 = points2[index[i]];
            const v2 = points2[index[i + 1]];
            const v3 = points2[index[i + 2]];

            const colLine = 255 << 24 | 255 << 16 | 255 << 8 | 255;
            if (this.isTriangleCCW(v1, v2, v3)) {
                this.linerClipper.cohenSutherlandLineClipper(v1, v2, colLine);
                this.linerClipper.cohenSutherlandLineClipper(v1, v3, colLine);
                this.linerClipper.cohenSutherlandLineClipper(v3, v2, colLine);
            }
        }
    }

    public isTriangleCCW(v1: { x: number, y: number, z: number },
        v2: { x: number, y: number, z: number },
        v3: { x: number, y: number, z: number }): boolean {
        const det: number =
            v1.x * v2.y - v2.x * v1.y +
            v2.x * v3.y - v3.x * v2.y +
            v3.x * v1.y - v1.x * v3.y;
        if (this.cullMode === CullFace.BACK) {
            return det < 0.0;
        } else {
            return det > 0.0;
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
                let color = (255 * scale) << 8 | 100 * scale | (this.height * scale) << 16 | 255 << 24;
                this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
            }
        }
    */
    public drawBoundingSphere(sphere: Sphere, matrix: Matrix4f, color: number): void {
        const points: Array<Vector4f> = [];

        const STEPS = 8;
        const STEPS2 = 8;

        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {

                const pos = this.sphereFunction2(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2).mul(sphere.getRadius() + 0.01).add(sphere.getCenter());
                pos.w = 1;

                points.push(pos);
            }
        }

        const index: Array<number> = [];

        for (let j = 0; j < STEPS; j++) {
            for (let i = 0; i < STEPS2; i++) {
                index.push(((STEPS2 * j) + (1 + i) % STEPS2)); // 2
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 1
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); // 3

                index.push(((STEPS2 * j) + STEPS2 + (0 + i) % STEPS2)); // 4
                index.push(((STEPS2 * j) + STEPS2 + (1 + i) % STEPS2)); // 3
                index.push(((STEPS2 * j) + (0 + i) % STEPS2)); // 5
            }
        }

        const modelViewMartrix = matrix;

        const points2: Array<Vector3f> = new Array<Vector3f>();

        for (let p = 0; p < points.length; p++) {
            const transformed = modelViewMartrix.multiplyHom(points[p]);
            points2.push(new Vector3f(transformed.x, transformed.y, transformed.z));
        }

        for (let i = 0; i < index.length; i += 3) {

            const v1 = points2[index[i]];
            const v2 = points2[index[i + 1]];
            const v3 = points2[index[i + 2]];

            this.nearPlaneClipping(v1, v2, color);
            this.nearPlaneClipping(v1, v3, color);
            this.nearPlaneClipping(v3, v2, color);

        }
    }
    public drawPlanedeformationTunnelAnim(elapsedTime: number, texture: Texture) {

        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const xdist = (x - this.width / 2);
                const ydist = (y - this.height / 2);
                const dist = 256 * 0.2 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                const dist2 = dist + elapsedTime * 0.002;
                const angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 16 + elapsedTime * 0.00069;

                const color1 = texture.texture[(dist2 & 0x1f) + (angle & 0x1f) * 32];
                // darkening can be done with alpha blended texture
                const scale = 1 - this.cosineInterpolate(1.0, 6.0, dist);
                const r = ((color1 >> 0) & 0xff) * scale;
                const g = ((color1 >> 8) & 0xff) * scale;
                const b = ((color1 >> 16) & 0xff) * scale;
                const final = r | g << 8 | b << 16;

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
    public drawPlanedeformationTunnelV2(elapsedTime: number, texture: Texture) {
        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const scale = 1.2;
                const xdist = (x - this.width / 2) + Math.sin(elapsedTime * 0.0001) * 80 * scale;
                const ydist = (y - this.height / 2) + Math.cos(elapsedTime * 0.0001) * 80 * scale;
                const xdist2 = (x - this.width / 2) + Math.sin(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                const ydist2 = (y - this.height / 2) + Math.cos(elapsedTime * 0.0001 + Math.PI) * 80 * scale;
                let dist = 256 * 20 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist));
                dist += Math.sin(Math.atan2(xdist, ydist) * 5) * 8;
                let dist2 = 256 * 20 / Math.max(1.0, Math.sqrt(xdist2 * xdist2 + ydist2 * ydist2));
                dist2 += Math.sin(Math.atan2(xdist2, ydist2) * 5) * 8;
                const finalDist = dist - dist2 + elapsedTime * 0.019;

                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;
                angle -= (Math.atan2(xdist2, ydist2) / Math.PI + 1.0) * 128.5 + elapsedTime * 0.0069;

                // FIXME: scale by 256
                const color1 = texture.texture[(finalDist & 0xff) + (angle & 0xff) * 255];
                const cScale = Math.min(60 / (dist * 2), 1.0) * Math.min(60 / (dist2 * 2), 1.0);
                const r = (color1 & 0xff) * cScale;
                const g = (color1 >> 8 & 0xff) * cScale;
                const b = (color1 >> 16 & 0xff) * cScale;

                this.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

    public drawLedTunnel(elapsedTime: number, texture: Texture) {
        for (let y = 0; y < 25; y++) {
            for (let x = 0; x < 40; x++) {
                const distance = 160 / (Math.sqrt((x - 40 / 2.0) * (x - 40 / 2.0) + (y - 25 / 2.0) * (y - 25 / 2.0)) * 1.4);
                /*let power = 2.0;
                let distance = Math.pow(Math.pow((x - 40 / 2.0) * (x - 40 / 2.0),power) + Math.pow((y - 25 / 2.0) * (y - 25 / 2.0),power),1/(2*power));
                let waveSum: number =  (Math.sin(distance+elapsedTime*0.005)+1)*0.5*(1-Math.min(distance*0.03, 1.0));
                */
                const waveSum: number = (Math.sin(distance + elapsedTime * 0.005) + 1) * 0.5 * (1 - Math.min(distance * 0.003, 1.0));
                // FIXME: put this into a reusable method to remove
                // code duplications? ie. LedBuffer class wit arrayy and draw method :)
                const intensity = ((waveSum * 15) | 0) % 16;
                this.drawTextureRectNoAlpha(x * 8, y * 8, 0, 8 * intensity, 8, 8, texture);
            }
        }
    }

    public drawParticleWaves(elapsedTime: number, texture: Texture, noClear: boolean = false) {
        if (!noClear) { this.clearColorBuffer(72 | 56 << 8 | 48 << 16 | 255 << 24); }
        this.clearDepthBuffer();

        const points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const scale = 2;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {

                const x = (j - num / 2) * scale;
                const y = 4 * (Math.sin(j * 0.09 * 2 + elapsedTime * 0.0008) + Math.cos(i * 0.08 * 2 + elapsedTime * 0.0009));
                const z = (i - num / 2) * scale;

                points.push(new Vector3f(x, y, z));
            }
        }

        const modelViewMartrix = Matrix4f.constructTranslationMatrix(0, -0.0, -49).multiplyMatrix(

            Matrix4f.constructXRotationMatrix(Math.PI * 0.1).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(elapsedTime * 0.00006))
        );

        const points2: Array<Vector3f> = new Array<Vector3f>(points.length);
        points.forEach((element) => {

            const transformed = this.project(modelViewMartrix.multiply(element));

            points2.push(transformed);
        });

        points2.sort((a, b) => {
            return a.z - b.z;
        });

        points2.forEach((element) => {
            const size = -(1.3 * 192 / (element.z));
            this.drawParticle(
                Math.round(element.x - size / 2),
                Math.round(element.y - size / 2),
                Math.round(size), Math.round(size), texture, 1 / element.z, this.interpolate(-60, -25, element.z));
        });
    }

    public drawScreenBounds(framebuffer: Framebuffer): void {
        const color: number = Color.WHITE.toPackedFormat();
        const width: number = this.width / 2;
        const height: number = this.height / 2;

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

    public drawParticleStreams(framebuffer: Framebuffer, elapsedTime: number, texture: Texture, noClear: boolean = false, light: Vector3f) {

        const points: Array<Vector3f> = new Array<Vector3f>();
        const num = 50;
        const num2 = 10;
        const scale = 2.1;


               

            const points2: Array<Vector3f> = new Array<Vector3f>(points.length);
           

                const transformed = framebuffer.project( light);

                points2.push(transformed);
           

            points2.sort((a, b) => {
                return a.z - b.z;
            });

            points2.forEach(element => {
                // let size = -(2.0 * 192 / (element.z));
                const size = -(80.3 * 192 / (element.z));
                
                    framebuffer.drawParticle2(
                        Math.round(element.x - size / 2),
                        Math.round(element.y - size / 2),
                        Math.round(size), Math.round(size), texture, 1/element.z, 1.0, 0,200);
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

        for (let y = 0; y < this.height; y++) {
            const yy = (-1.00 + 2.00 * y / this.height);

            for (let x = 0; x < this.width; x++) {

                const xx = (-1.00 + 2.00 * x / this.width);

                // magic formulas here
                const u = ((xx / Math.abs(yy)) * IMG_WIDTH * 0.05) | 0;
                const v = (1.0 / Math.abs(yy) * IMG_HEIGHT * 0.05 + elapsedTime * 0.008) | 0;

                const scale = 1 - Math.max(Math.min(1 / Math.abs(yy) * 0.2, 1), 0);
                let color = texture.texture[(u & 0xff) + (v & 0xff) * IMG_WIDTH];
                const r = ((color >> 0) & 0xff) * scale;
                const g = ((color >> 8) & 0xff) * scale;
                const b = ((color >> 16) & 0xff) * scale;
                color = (255 << 24) | (b << 16) | (g << 8) | (r << 0);

                this.framebuffer[framebufferIndex++] = color;
            }
        }
    }

    public shadingSphereClip(elapsedTime: number): void {
        this.clearDepthBuffer();
        const scale = 1.6;

        let modelViewMartrix: Matrix4f = Matrix4f.constructXRotationMatrix(elapsedTime * 0.3).multiplyMatrix(Matrix4f.constructScaleMatrix(scale, scale, scale));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -61+ Math.sin(elapsedTime*0.3)*19).multiplyMatrix(Matrix4f.constructZRotationMatrix(-elapsedTime * 0.2).multiplyMatrix(modelViewMartrix));

        this.renderingPipeline.draw(this, this.torus.getMesh(), modelViewMartrix);
    }

    public torusFunction(alpha: number): Vector3f {
        return new Vector3f(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }

    public cosineInterpolate(y1: number, y2: number, mu: number): number {
        let mu2: number;
        if (mu <= y1) { return 0; }
        if (mu >= y2) { return 1; }
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

            let xx = (this.width * 0.5) + (x / (-z * 0.0078));
            let yy = (this.height * 0.5) + (y / (-z * 0.0078));
            // commented out because it breaks the winding. inversion
            // of y has to be done after back-face culling in the
            // viewport transform
            // yy =(this.height * 0.5) - (y / (-z * 0.0078));

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
            // David H. Eberly (this.height6).
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

    public createPlane() {

        const k = {
            points: []
        };
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
        const points: Array<Vector3f> = [];
        const points2: Array<Vector3f> = [];
        const normals: Array<Vector3f> = [];
        const normals2: Array<Vector3f> = [];

        const index: Array<number> = [];

        k.points.forEach((i) => {
            const p = i;

            const point = points.find((pointVar) => pointVar.sub(p).length() < 0.001);

            if (point) {
                const idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(() => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
        });

        return {
            points,
            points2,
            normals,
            normals2,
            index
        };
    }

    public createCylinder() {
        const k = {
            points: []
        };

        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                const xx = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                const xx2 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                const yy = Math.cos(2 * Math.PI / LOOPX * x) * 30;
                const yy2 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;

                k.points.push(new Vector3f(xx, 0 + y, yy));
                k.points.push(new Vector3f(xx, 1 + y, yy));
                k.points.push(new Vector3f(xx2, 0 + y, yy2));

                k.points.push(new Vector3f(xx2, 0 + y, yy2));
                k.points.push(new Vector3f(xx, 1 + y, yy));
                k.points.push(new Vector3f(xx2, 1 + y, yy2));
            }
        }
        // optimize
        const points: Array<Vector3f> = [];
        const points2: Array<Vector3f> = [];
        const normals: Array<Vector3f> = [];
        const normals2: Array<Vector3f> = [];
        const texture: Array<TextureCoordinate> = [];

        const index: Array<number> = [];

        k.points.forEach((i) => {
            const p = i;

            const point = points.find((pointVar) => pointVar.sub(p).length() < 0.001);

            if (point) {
                const idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(() => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
            texture.push(new TextureCoordinate());
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

    public createCylinder2(texture: Texture) {
        const k = {
            points: []
        };

        const LOOPX = 50;
        const LOOPY = 110;
        for (let y = 0; y < LOOPY; y++) {
            for (let x = 0; x < LOOPX; x++) {
                const xpos = (x / LOOPX * 256) & 0xff;
                const xpos2 = ((x + 1) / LOOPX * 256) & 0xff;
                const ypos = (y * 0.9 / LOOPY * 256) & 0xff;
                const ypos2 = ((y + 1) * 0.9 / LOOPY * 256) & 0xff;

                const x0y0 = 1 + 0.9 * ((texture.texture[xpos + ypos * 256] & 0xff) / 255);
                const x1y0 = 1 + 0.9 * ((texture.texture[xpos2 + ypos * 256] & 0xff) / 255);
                const x0y1 = 1 + 0.9 * ((texture.texture[xpos + ypos2 * 256] & 0xff) / 255);
                const x1y1 = 1 + 0.9 * ((texture.texture[xpos2 + ypos2 * 256] & 0xff) / 255);

                const x0 = Math.sin(2 * Math.PI / LOOPX * x) * 30;
                const z0 = Math.cos(2 * Math.PI / LOOPX * x) * 30;

                const x1 = Math.sin(2 * Math.PI / LOOPX * (x + 1)) * 30;
                const z1 = Math.cos(2 * Math.PI / LOOPX * (x + 1)) * 30;

                k.points.push(new Vector3f(x0 * x0y0, 0 + y, z0 * x0y0));
                k.points.push(new Vector3f(x0 * x0y1, 1 + y, z0 * x0y1));
                k.points.push(new Vector3f(x1 * x1y0, 0 + y, z1 * x1y0));

                k.points.push(new Vector3f(x1 * x1y0, 0 + y, z1 * x1y0));
                k.points.push(new Vector3f(x0 * x0y1, 1 + y, z0 * x0y1));
                k.points.push(new Vector3f(x1 * x1y1, 1 + y, z1 * x1y1));
            }
        }
        // optimize
        const points: Array<Vector3f> = [];
        const points2: Array<Vector3f> = [];
        const normals: Array<Vector3f> = [];
        const normals2: Array<Vector3f> = [];

        const index: Array<number> = [];

        k.points.forEach((i) => {
            const p = i;

            const point = points.find((pointVar) => pointVar.sub(p).length() < 0.001);

            if (point) {
                const idx = points.indexOf(point);
                index.push(idx);
            } else {
                index.push(points.push(p) - 1);
            }
        });

        points.forEach(() => {
            normals.push(new Vector3f(0, 0, 0));
            normals2.push(new Vector3f(0, 0, 0));
            points2.push(new Vector3f(0, 0, 0));
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

            points2[p].x = Math.round((this.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((this.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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
            // David H. Eberly (this.height6).
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

            points2[p].x = Math.round((this.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((this.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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
            // David H. Eberly (this.height6).
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

            points2[p].x = Math.round((this.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((this.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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
            // David H. Eberly (this.height6).
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

            points2[p].x = Math.round((this.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((this.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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

            points2[p].x = Math.round((this.width * 0.5) + (transformed.x / (-transformed.z * 0.0078)));
            points2[p].y = Math.round((this.height * 0.5) - (transformed.y / (-transformed.z * 0.0078)));
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

    public fakeSphere(normal: Vector4f, vertex: Vertex): void {
        // https://www.mvps.org/directx/articles/spheremap.htm
        // vertex.textureCoordinate.u = 0.5 + normal.x * 0.5;
        // vertex.textureCoordinate.v = 0.5 - normal.y * 0.5;
        vertex.textureCoordinate.u = 0.5 + Math.asin(normal.x) / Math.PI;
        vertex.textureCoordinate.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }

    public fakeSphere2(normal: Vector3f, tex: TextureCoordinate): void {
        tex.u = 0.5 + Math.asin(normal.x) / Math.PI;
        tex.v = 0.5 - Math.asin(normal.y) / Math.PI;
    }

    public drawLensFlare(screenPos: Vector3f, elapsedTime: number, texture: Array<{ tex: Texture, scale: number, alpha: number }>, dirt: Texture): void {
        const pos = screenPos;

        if (pos.z < 0 &&
            pos.x > 0 && pos.x < this.width &&
            pos.y > 0 && pos.y < this.height &&
            this.wBuffer[pos.x + (pos.y * this.width)] > (1 / pos.z)) {
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
        if (this.lensFlareVisible !== true) {
            scale *= (1 - this.interpolate(this.lensFlareEnd, this.lensFlareEnd + 100, elapsedTime));
        }
        const dir = new Vector3f(this.width / 2, this.height / 2, 0).sub(pos);

        if (scale > 0) {
            for (let i = 0; i < texture.length; i++) {
                const temp = pos.add(dir.mul(texture[i].scale));
                this.drawTexture(Math.round(temp.x) - texture[i].tex.width / 2, Math.round(temp.y) - texture[i].tex.height / 2, texture[i].tex, texture[i].alpha * scale);
            }
        }

        // this.drawTextureRectAdd(0, 0, 0, 0, this.width, this.height, dirt, 0.03 + 0.15 * scale);
        this.drawScaledTextureClipBi(0, 0, this.width, this.height, dirt, 0.15 + 0.20 * scale);
    }

    public drawLineDDA(start: Vector3f, end: Vector3f, color: number): void {
        this.lineRasterizer.drawLineDDA(start, end, color);
    }

    public drawLineDDANoZ(start: Vector3f, end: Vector3f, color: number): void {
        this.lineRasterizerNo.drawLineDDANoZ(start, end, color);
    }

    private sphereFunction2(theta: number, phi: number): Vector4f {

        const pos = new Vector4f(Math.cos(theta) * Math.cos(phi),
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta), 1.0);

        return pos;
    }

}
