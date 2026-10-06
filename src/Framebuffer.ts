
import { ScaleClipBlitter } from './blitter/ScaleClipBlitter';
import { ControllableCamera } from './camera';
import { Color } from '@core/Color';
import { CullFace } from './CullFace';
import { Fog } from '@effects/fog/Fog';
import { Noise } from '@effects/noise/Noise';
import { Particle } from '@effects/particle/Particle';
import { ParticleNoDepth } from '@effects/particle-no-depth/ParticleNoDepth';
import { ParticleSprite } from '@effects/particle-sprite/ParticleSprite';
import { ParticleSpriteSubpixel } from '@effects/particle-sprite-subpixel/ParticleSpriteSubpixel';
import { Pixelate } from '@effects/pixelate/Pixelate';
import { PlaneDeformNoCalc } from '@effects/plane-deform-no-calc/PlaneDeformNoCalc';
import { PlaneDeformationTunnelAnim } from '@effects/plane-deformation-tunnel-anim/PlaneDeformationTunnelAnim';
import { Reflections } from '@effects/reflections/Reflections';
import { SoftParticle } from '@effects/soft-particle/SoftParticle';
import { Matrix3f, Matrix4f, Vector2f, Vector3f, Vector4f } from './math';
import { ComputationalGeometryUtils } from './math/Geometry';
import { Sphere } from './math/Sphere';
import { Primitives2D } from './primitives/Primitives2D';
import { TexturedAlphaBlendingTriangleRasterizer } from './rasterizer/TexturedAlphaBlendingTriangleRasterizer';
import { TexturingRenderingPipeline } from './rendering-pipelines/TexturingRenderingPipeline';
import { AbstractClipEdge } from './screen-space-clipping/AbstractClipEdge';
import { BottomClipEdge } from './screen-space-clipping/BottomClipEdge';
import { CohenSutherlandLineClipper } from './screen-space-clipping/CohenSutherlandLineClipper';
import { LeftClipEdge } from './screen-space-clipping/LeftClipEdge';
import { RightClipEdge } from './screen-space-clipping/RightClipEdge';
import { TopClipEdge } from './screen-space-clipping/TopClipEdge';
import { Texture } from './texture/Texture';
import { Vertex } from './Vertex';

export class Framebuffer {

    public static PIXEL_SIZE_IN_BYTES = 4;

    public minWindow: Vector2f;
    public maxWindow: Vector2f;


    public framebuffer: Uint32Array;
    public wBuffer: Float32Array;

    public cullMode: CullFace = CullFace.BACK;

    public camera: ControllableCamera;
    public bob: Texture;
    public triangleRasterizer;


    public scaleClipBlitter = new ScaleClipBlitter(this);
    public texturedRenderingPipeline: TexturingRenderingPipeline;
    public texturedTriangleRasterizer;
    public tmpGlitch: Uint32Array;

    public lensFlareVisible: boolean = false;
    public lensFlareStart = 0;
    public lensFlareEnd = 0;

    public width: number;
    public height: number;
    private imageData: ImageData;
    private unsignedIntArray: Uint8ClampedArray;
    private linerClipper = new CohenSutherlandLineClipper(this);
    public clipRegion = Array<AbstractClipEdge>();

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(width, height);
        this.wBuffer = new Float32Array(width * height);
        const arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
        this.tmpGlitch = new Uint32Array(width * height);
        this.texturedRenderingPipeline = new TexturingRenderingPipeline(this);
        this.texturedTriangleRasterizer = new TexturedAlphaBlendingTriangleRasterizer(this, this.texturedRenderingPipeline)
        this.minWindow = new Vector2f(0, 0);
        this.maxWindow = new Vector2f(width - 1, height - 1);

        this.clipRegion = new Array<AbstractClipEdge>(
            new RightClipEdge(this),
            new LeftClipEdge(this),
            new BottomClipEdge(this),
            new TopClipEdge(this)
        );
    }

    public setCullFace(face: CullFace): void {
        this.cullMode = face;
    }

    public setTexture(texture: Texture): void {
        this.bob = texture;
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


    public drawTextureColorized(x: number, y: number, texture: Texture, color: Color): void {

        let frIndex = x + y * this.width;
        let texIndex = 0;

        for (let h = 0; h < texture.height; h++) {
            for (let w = 0; w < texture.width; w++) {
                const txPixel = texture.texture[texIndex];


                const r = (txPixel >> 0 & 0xff) * color.r / 255;
                const g = (txPixel >> 8 & 0xff) * color.g / 255;
                const b = (txPixel >> 16 & 0xff) * color.b / 255;

                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);

                texIndex++;
                frIndex++;
            }

            frIndex += this.width - texture.width;
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

    public fastFramebufferCopyOffset(src: Uint32Array, dest: Uint32Array, offset = 0): void {
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
    public fastFramebufferCopy(dest: Uint32Array, src: Uint32Array) {
        dest.set(src.length > dest.length ? src.subarray(0, dest.length) : src);
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
                // console.log(xx, yy);
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

    public project(t1: { x: number, y: number, z: number }): Vector3f {
        return new Vector3f(Math.round((this.width / 2) + (292 * t1.x / (-t1.z))),
            Math.round((this.height / 2) - (t1.y * 292 / (-t1.z))),
            t1.z);
    }

    public clearDepthBuffer(): void {
        this.wBuffer.fill(-1 / 900);
    }

    public drawBox2(x1: number, y1: number, width: number, height: number, color: number) {

        let index = y1 * this.width + x1;
        for (let i = 0; i < height; i++) {
            this.framebuffer.fill(color, index, index + width);
            index += this.width;
        }
    }

    public wireFrameTerrain(elapsedTime: number, heightmap: Texture): void {

        this.clearDepthBuffer();

        const index: Array<number> = [
        ];

        const points: Array<Vector3f> = [];
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

        const modelViewMartrix = Matrix3f.constructYRotationMatrix(elapsedTime * 0.003);

        const points2: Array<Vector3f> = new Array<Vector3f>();

        const xOff = + Math.cos(elapsedTime * 0.000001) * 128 * 20;
        const zOff = Math.sin(elapsedTime * 0.000001) * 128 * 20;
        points.forEach(element => {
            const transformed = modelViewMartrix.multiply(element);

            const x = transformed.x + xOff;
            const y = transformed.y;
            const z = transformed.z + zOff; // TODO: use translation matrix!

            points2.push(new Vector3f(x, y, z));
        });

        for (let i = 0; i < index.length; i += 2) {
            const scale = (1 - Math.min(255, -points2[index[i]].z * 0.9) / 255);
            const color = (255 * scale) << 8 | 100 * scale | (this.height * scale) << 16 | 255 << 24;
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]], color);
        }
    }

    public drawBoundingSphere(sphere: Sphere, matrix: Matrix4f, color: number): void {
        const points: Array<Vector4f> = [];

        const STEPS = 8;
        const STEPS2 = 8;

        // TODO: move into setup method
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {

                const pos = ComputationalGeometryUtils.spherePoint(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2).mul(sphere.getRadius() + 0.01).add(sphere.getCenter());
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
    public fakeSphere(normal: Vector4f, vertex: Vertex): void {
        const coordinates = ComputationalGeometryUtils.normalMapCoords(normal);
        vertex.textureCoordinate.u = coordinates.u;
        vertex.textureCoordinate.v = coordinates.v;
    }

    public fakeSphere3(normal: Vector4f, eyeSpaceVertex: Vector4f, vertex: Vertex): void {
        const reflectionVector = ComputationalGeometryUtils.reflectionVector(normal, eyeSpaceVertex);

        const result = ComputationalGeometryUtils.sphereMapCoords(reflectionVector);
        vertex.textureCoordinate.u = result.u;
        vertex.textureCoordinate.v = result.v;
    }

    public refrac(normal: Vector4f, eyeSpaceVertex: Vector4f, vertex: Vertex): void {
        const reflectionVector = ComputationalGeometryUtils.reflectionVector(normal, eyeSpaceVertex);

        vertex.textureCoordinate.u = (Math.min(Math.max(Math.round(vertex.projection.x + reflectionVector.x * 35) / 319, 0), 1));
        vertex.textureCoordinate.v = (Math.min(Math.max(Math.round(vertex.projection.y + reflectionVector.y * 35) / 199, 0), 1));
    }

    // ------------------------------------------------------------------
    // TEMPORARY compatibility wrappers. Callers should migrate to the
    // new modules directly; remove these once all callers are updated.
    // ------------------------------------------------------------------

    /** @deprecated Use a rendering pipeline's isTriangleCCW method. */
    public isTriangleCCW(v1: { x: number, y: number, z: number },
        v2: { x: number, y: number, z: number },
        v3: { x: number, y: number, z: number }): boolean {
        this.texturedRenderingPipeline.setCullFace(this.cullMode);
        return this.texturedRenderingPipeline.isTriangleCCW(v1, v2, v3);
    }

    /** @deprecated Use {@link Color.blend}. */
    public static blend(c1: number, c2: number, nAlpha: number): number {
        return Color.blend(c1, c2, nAlpha);
    }

    /** @deprecated Use {@link Color.addColor}. */
    public static addColor(c1: number, c2: number): number {
        return Color.addColor(c1, c2);
    }

    /** @deprecated Use {@link Primitives2D.drawPixel}. */
    public drawPixel(x: number, y: number, color: number): void {
        Primitives2D.drawPixel(this, x, y, color);
    }

    /** @deprecated Use {@link Primitives2D.drawPixel4}. */
    public drawPixel4(x: number, y: number, color: number, alpha: number): void {
        Primitives2D.drawPixel4(this, x, y, color, alpha);
    }

    /** @deprecated Use {@link Primitives2D.drawPixelAntiAliasedSpacial}. */
    public drawPixelAntiAliasedSpacial(x: number, y: number, color: number): void {
        Primitives2D.drawPixelAntiAliasedSpacial(this, x, y, color);
    }

    /** @deprecated Use {@link Primitives2D.drawRect}. */
    public drawRect(x: number, y: number, width: number, color: number): void {
        Primitives2D.drawRect(this, x, y, width, color);
    }

    /** @deprecated Use {@link Primitives2D.drawRect2}. */
    public drawRect2(x: number, y: number, width: number, height: number, color: number): void {
        Primitives2D.drawRect2(this, x, y, width, height, color);
    }

    /** @deprecated Use {@link Primitives2D.drawLineDDA}. */
    public drawLineDDA(start: Vector3f, end: Vector3f, color: number): void {
        Primitives2D.drawLineDDA(this, start, end, color);
    }

    /** @deprecated Use {@link Primitives2D.drawLineDDANoZ}. */
    public drawLineDDANoZ(start: Vector3f, end: Vector3f, color: number): void {
        Primitives2D.drawLineDDANoZ(this, start, end, color);
    }

    /** @deprecated Use {@link ComputationalGeometryUtils.circlePoint}. */
    public torusFunction(alpha: number): Vector3f {
        return ComputationalGeometryUtils.circlePoint(alpha);
    }

    /** @deprecated Use {@link Noise.noise}. */
    public noise(elapsedTime: number, texture: Texture, scale: number = 0.07): void {
        Noise.noise(this, elapsedTime, texture, scale);
    }

    /** @deprecated Use {@link Fog.drawFog}. */
    public drawFog(color: Color, fogScale: number, fogOffset: number): void {
        Fog.drawFog(this, color, fogScale, fogOffset);
    }

    /** @deprecated Use {@link Particle.drawParticle}. */
    public drawParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        Particle.drawParticle(this, xp, yp, width, height, texture, z, alphaBlend);
    }

    /** @deprecated Use {@link ParticleSprite.drawParticle2}. */
    public drawParticle2(
        xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number,
        imgNum: number = 0, spritH: number): void {
        ParticleSprite.drawParticle2(this, xp, yp, width, height, texture, z, alphaBlend, imgNum, spritH);
    }

    /** @deprecated Use {@link ParticleSpriteSubpixel.drawParticle2Sub}. */
    public drawParticle2Sub(
        xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number,
        imgNum: number = 0, spritH: number, rr: number = 1, gg: number = 1, bb: number = 1): void {
        ParticleSpriteSubpixel.drawParticle2Sub(this, xp, yp, width, height, texture, z, alphaBlend, imgNum, spritH, rr, gg, bb);
    }

    /** @deprecated Use {@link ParticleNoDepth.drawParticleNoDepth}. */
    public drawParticleNoDepth(xp: number, yp: number, width: number, height: number, texture: Texture, alphaBlend: number): void {
        ParticleNoDepth.drawParticleNoDepth(this, xp, yp, width, height, texture, alphaBlend);
    }

    /** @deprecated Use {@link SoftParticle.drawSoftParticle}. */
    public drawSoftParticle(xp: number, yp: number, width: number, height: number, texture: Texture, z: number, alphaBlend: number): void {
        SoftParticle.drawSoftParticle(this, xp, yp, width, height, texture, z, alphaBlend);
    }

    /** @deprecated Use {@link PlaneDeformationTunnelAnim.drawPlanedeformationTunnelAnim}. */
    public drawPlanedeformationTunnelAnim(elapsedTime: number, texture: Texture): void {
        PlaneDeformationTunnelAnim.drawPlanedeformationTunnelAnim(this, elapsedTime, texture);
    }

    /** @deprecated Use {@link PlaneDeformNoCalc.drawPlaneDeformation}. */
    public drawPlaneDeformation(elapsedTime: number, texture: Texture): void {
        PlaneDeformNoCalc.drawPlaneDeformation(this, elapsedTime, texture);
    }

    /** @deprecated Use {@link Pixelate.pixelate}. */
    public pixelate(): void {
        Pixelate.pixelate(this);
    }

    /** @deprecated Use {@link Reflections.addReflections}. */
    public addReflections(): void {
        Reflections.addReflections(this);
    }

}
