
import { ScaleClipBlitter } from '@primitives/ScaleClipBlitter';
import { ControllableCamera } from './camera';
import { Color } from '@core/Color';
import { CullFace } from '@primitives/CullFace';
import { Vector2f } from './math/Vector2f';
import { AbstractClipEdge } from './screen-space-clipping/AbstractClipEdge';
import { BottomClipEdge } from './screen-space-clipping/BottomClipEdge';
import { LeftClipEdge } from './screen-space-clipping/LeftClipEdge';
import { RightClipEdge } from './screen-space-clipping/RightClipEdge';
import { TopClipEdge } from './screen-space-clipping/TopClipEdge';
import { Texture } from './texture/Texture';

export class Framebuffer {

    public static PIXEL_SIZE_IN_BYTES = 4;
    public minWindow: Vector2f;
    public maxWindow: Vector2f;
    public framebuffer: Uint32Array;
    public wBuffer: Float32Array;
    public cullMode: CullFace = CullFace.BACK;
    public camera: ControllableCamera;
    public bob: Texture;
    public scaleClipBlitter = new ScaleClipBlitter(this);
    public width: number;
    public height: number;
    public clipRegion = Array<AbstractClipEdge>();

    private imageData: ImageData;
    private unsignedIntArray: Uint8ClampedArray;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.imageData = new ImageData(width, height);
        this.wBuffer = new Float32Array(width * height);
        const arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);
        this.framebuffer = new Uint32Array(arrayBuffer);
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

    public clearDepthBuffer(): void {
        this.wBuffer.fill(-1 / 900);
    }
}
