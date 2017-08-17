import { ControllableCamera } from './ControllableCamera';
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
import Texture from './Texture';
import Point from './Point';
import Vector3 from './Vector3f';
import Vector4f from './Vector4f';
import Matrix3 from './Matrix3';
import Matrix4f from './Matrix4f';
import RandomNumberGenerator from './RandomNumberGenerator';
declare function require(string): string;
let json = require('./assets/f16.json');

abstract class AbstractClipEdge {

    public abstract isInside(p: Vector3): boolean;
    public abstract computeIntersection(p1: Vector3, p2: Vector3): Vector3;

}

class RightEdge extends AbstractClipEdge {

    public isInside(p: Vector3): boolean {
        return p.x < 320;
    }

    public computeIntersection(p1: Vector3, p2: Vector3): Vector3 {
        return new Vector3(Framebuffer.maxWindow.x + 1,
            Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x)),
            Math.round(1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.maxWindow.x + 1 - p1.x) / (p2.x - p1.x))));
    }

}

class LeftEdge extends AbstractClipEdge {

    public isInside(p: Vector3): boolean {
        return p.x >= 0;
    }

    public computeIntersection(p1: Vector3, p2: Vector3): Vector3 {
        return new Vector3(Framebuffer.minWindow.x,
            Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x)),
            Math.round(1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.x - p1.x) / (p2.x - p1.x))));
    }

}

class TopEdge extends AbstractClipEdge {

    public isInside(p: Vector3): boolean {
        return p.y < Framebuffer.maxWindow.y;
    }

    public computeIntersection(p1: Vector3, p2: Vector3): Vector3 {
        return new Vector3(
            Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y)),
            Framebuffer.maxWindow.y,
            Math.round(1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y))));
    }

}

class BottomEdge extends AbstractClipEdge {

    public isInside(p: Vector3): boolean {
        return p.y >= Framebuffer.minWindow.y;
    }

    public computeIntersection(p1: Vector3, p2: Vector3): Vector3 {
        return new Vector3(
            Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)),
            Framebuffer.minWindow.y,
            Math.round(1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y))));
    }

}

export default class Framebuffer {

    static PIXEL_SIZE_IN_BYTES = 4;

    private width: number;
    private height: number;
    private imageData: ImageData;
    public framebuffer: Uint32Array;
    private unsignedIntArray: Uint8ClampedArray;
    public wBuffer: Float32Array;

    private x: number = 0;

    private camera: ControllableCamera;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float32Array(320 * 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);

        this.framebuffer = new Uint32Array(arrayBuffer);
        this.camera = new ControllableCamera();
        document.addEventListener("keydown", (e) => {
            console.log('key pressed');
            if (e.which == 38) this.camera.moveForward(0.2, 1.0);
            if (e.which == 40) this.camera.moveBackward(0.2, 1.0);
            if (e.which == 37) this.camera.turnLeft(0.05, 1.0);
            if (e.which == 39) this.camera.turnRight(0.05, 1.0);
        });
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

    public clearCol(color: number) {
        this.framebuffer.fill(color);
    }

    public drawPixel(x: number, y: number, color: number) {
        this.framebuffer[x + y * this.width] = color;
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

    public drawTextureRect(xs: number, ys: number, xt: number, yt: number, width: number, height: number, texture: Texture, alpha2: number): void {
        let texIndex = xt + yt * texture.width;
        let frIndex = xs + ys * 320;

        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                let alpha = ((texture.texture[texIndex] >> 24) & 0xff) / 255 * alpha2;
                let inverseAlpha = 1 - alpha;

                let r = (((this.framebuffer[frIndex] >> 0) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 0) & 0xff) * (alpha)) | 0;
                let g = (((this.framebuffer[frIndex] >> 8) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 8) & 0xff) * (alpha)) | 0;
                let b = (((this.framebuffer[frIndex] >> 16) & 0xff) * (inverseAlpha) + ((texture.texture[texIndex] >> 16) & 0xff) * (alpha)) | 0;

                this.framebuffer[frIndex] = r | (g << 8) | (b << 16) | (255 << 24);
                texIndex++;
                frIndex++;
            }
            texIndex += texture.width - width;
            frIndex += 320 - width;
        }
    }

    public drawLens(texture: Texture, tex: Texture, time: number) {

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

    public starField() {
        // plus razor logo
    }

    public planeDeformation() {
        // with lookup
    }

    // Crossfade 2 effects
    public crossFade() {

    }

    public pixelate() {

    }

    private interpolate(start: number, end: number, current: number): number {
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
                fadeArray[x + y * 16] = 500 + Math.round(rng.getInteger() * 600000) % 10000;
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

    public draw3dBobs() {

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
    }

    public drawBobs(texture: Texture, time: number) {
        let scaledTime = time * 0.2;
        const BALL_SIZE = 16;
        for (let i = 0; i < 30; i++) {
            let x = (Math.cos(3 * scaledTime * 0.002 + i * 0.11) * (320 / 2 - BALL_SIZE / 2)) | 0;
            let y = (Math.sin(4 * scaledTime * 0.002 + i * 0.11) * (200 / 2 - BALL_SIZE / 2)) | 0;
            //this.drawTexture(320 / 2 - BALL_SIZE / 2 + x, 200 / 2 - BALL_SIZE / 2 + y, texture, 1.0);
            this.drawTextureNoClipAlpha(320 / 2 - BALL_SIZE / 2 + x, 200 / 2 - BALL_SIZE / 2 + y, texture);
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

    public drawTexture(x: number, y: number, texture: Texture, alpha2: number) {
        const SCREEN_WIDTH = 320;
        const SCREEN_HEIGHT = 200;

        let framebufferIndex: number = Math.max(x, 0) + Math.max(y, 0) * this.width;
        let textureIndex: number = Math.max(0, 0 - x) + Math.max(0, 0 - y) * texture.width;

        let width: number = Math.min(texture.width, SCREEN_WIDTH - x) - Math.max(0, 0 - x);
        let height: number = Math.min(texture.height, SCREEN_HEIGHT - y) - Math.max(0, 0 - y);

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

    public drawTextureNoClipAlpha(x: number, y: number, texture: Texture) {
        const SCREEN_WIDTH = 320;
        const SCREEN_HEIGHT = 200;

        let framebufferIndex: number = x + y * this.width;
        let textureIndex: number = 0;

        let textureRowOffset = 0;
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

            textureIndex += textureRowOffset;
            framebufferIndex += framebufferRowOffset;
        }
    }


    /**
     * Span Renderer
     * 
     * http://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack
     */
    drawSpan(dist: number, xpos: number, ypos: number, scale: number, texture: Texture) {
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
    public scene8(elapsedTime: number): void {

        let index: Array<number> = [
            0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6,
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4,
        ];

        let points: Array<Vector3> = [
            new Vector3(1.0, 1.0, -1.0), new Vector3(-1.0, 1.0, -1.0),
            new Vector3(-1.0, 1.0, 1.0), new Vector3(1.0, 1.0, 1.0),
            new Vector3(1.0, -1.0, 1.0), new Vector3(-1.0, -1.0, 1.0),
            new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, -1.0, -1.0)
        ];

        let scale = 0.8;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.05));

        let points2: Array<Vector3> = new Array<Vector3>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 4 + Math.sin(elapsedTime * 0.09) * 2; // TODO: use translation matrix!

            points2.push(new Vector3(x, y, z));
        });


        for (let i = 0; i < index.length; i += 2) {
            this.nearPlaneClipping(points2[index[i]], points2[index[i + 1]]);
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector3 {
        return new Vector3(Math.round(320 / 2) + (t1.x / (-t1.z * 0.0078)),
            Math.round((200 / 2) - (t1.y / (-t1.z * 0.0078))), t1.z);
    }

    // https://math.stackexchange.com/questions/859454/maximum-number-of-vertices-in-intersection-of-triangle-with-box/
    public nearPlaneClipping(t1: Vector3, t2: Vector3): void {
        const NEAR_PLANE_Z = -1.7;

        let color = 255 | 0 << 16 | 255 << 24;
        if (t1.z < NEAR_PLANE_Z && t2.z < NEAR_PLANE_Z) {
            this.cohenSutherlandLineClipper(this.project(t1), this.project(t2), color);
        } else if (t1.z > NEAR_PLANE_Z && t2.z > NEAR_PLANE_Z) {
            return;
        } else if (t1.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t1.z) / (t2.z - t1.z);
            let t3 = new Vector3(ratio * (t2.x - t1.x) + t1.x, ratio * (t2.y - t1.y) + t1.y, NEAR_PLANE_Z);
            this.cohenSutherlandLineClipper(this.project(t1), this.project(t3), color);
        } else if (t2.z < NEAR_PLANE_Z) {
            let ratio = (NEAR_PLANE_Z - t2.z) / (t1.z - t2.z);
            let t3 = new Vector3(ratio * (t1.x - t2.x) + t2.x, ratio * (t1.y - t2.y) + t2.y, NEAR_PLANE_Z);
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
    private clearDepthBuffer(): void {
        this.wBuffer.fill(100);
    }

    public debug(elapsedTime: number): void {
        this.clearDepthBuffer();

        let index: Array<number> = [
            1, 2, 3, 3, 4, 1,
            1 + 8, 2 + 8, 3 + 8, 3 + 8, 4 + 8, 1 + 8,
        ];

        let points: Array<Vector3> = [
            new Vector3(-1.0, -1.0, 1.0), new Vector3(1.0, -1.0, 1.0),
            new Vector3(1.0, 1.0, 1.0), new Vector3(-1.0, 1.0, 1.0),
            new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, -1.0, -1.0),
            new Vector3(1.0, 1.0, -1.0), new Vector3(-1.0, 1.0, -1.0),

            new Vector3(-1.0, -1.0, 1.0).add(new Vector3(2.0, 0.0, 0.0)), new Vector3(1.0, -1.0, 1.0).add(new Vector3(2.0, 0.0, 0.0)),
            new Vector3(1.0, 1.0, 1.0).add(new Vector3(2.0, 0.0, 0.0)), new Vector3(-1.0, 1.0, 1.0).add(new Vector3(2.0, 0.0, 0.0)),
            new Vector3(-1.0, -1.0, -1.0).add(new Vector3(2.0, 0.0, 0.0)), new Vector3(1.0, -1.0, -1.0).add(new Vector3(2.0, 0.0, 0.0)),
            new Vector3(1.0, 1.0, -1.0).add(new Vector3(2.0, 0.0, 0.0)), new Vector3(-1.0, 1.0, -1.0).add(new Vector3(2.0, 0.0, 0.0)),
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

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructZRotationMatrix(elapsedTime * 0.08));



        let points2: Array<Vector3> = new Array<Vector3>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
        });

        for (let i = 0; i < index.length; i += 3) {
            // TODO: use eye space triangles for backface culling
            let col = 255 << 24 | 255 << 16;
            let col2 = 255 << 24 | 255;

            this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], colorAr[(((i) / 3) | 0) % 6]);
        }
    }




    private sphereFunction(theta: number, phi: number): Vector4f {

        let pos = new Vector4f(Math.cos(theta) * Math.cos(phi),
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta), 1.0);
        let radius = (Math.sin(pos.z * 11 + Date.now() * 0.001) + 1) / 2 +
            (Math.sin(pos.x * 11 + Date.now() * 0.001) + 1) / 3;
        pos.x = pos.x + pos.x * radius;
        pos.y = pos.y + pos.y * radius;
        pos.z = pos.z + pos.z * radius;
        return pos;
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

    public drawOldSchoolPlasma(elapsedTime: number): void {
        let time = elapsedTime * 0.0007 * 1.0;
        let lineDirection = new Vector3(Math.sin(time), Math.cos(time), 0);
        let radialWaveCenter = new Vector3(470.0 / 2.0, 230.0 / 2.0, 0).add(new Vector3(470.0 / 2.0 *
            Math.sin(-time), 230.0 / 2.0 * Math.cos(-time), 0));

        let difference = new Vector3(0, 0, 0);
        // TODO: implement sin/cos lookup tables plus starfield ;)
        let index = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let directionalWave = Math.sin(((x * lineDirection.x + y * lineDirection.y) * 0.02 + time) + 1.0) * 0.5;
                difference.x = x - radialWaveCenter.x;
                difference.y = y - radialWaveCenter.y;
                let radialWave = (Math.cos(difference.length() * 0.03) + 1.0) * 0.5;
                let waveSum: number = (radialWave + directionalWave) * 0.5;

                let red = (Math.cos(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let green = (Math.sin(Math.PI * waveSum / 0.5 + time) + 1.0) * 0.5 * 255;
                let blue = (Math.sin(time) + 1.0) * 0.5 * 255;

                this.framebuffer[index++] = 255 << 24 | blue << 16 | green << 8 | red;
            }
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

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3> = new Array<Vector3>();

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

            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
        }

        // draw clip region
        let colred = 255 << 24 | 230 << 16 | 200 << 16 | 200;
        this.drawLineDDA(new Vector3(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), new Vector3(Framebuffer.maxWindow.x + 1, Framebuffer.maxWindow.y + 1, 0), colred);
        this.drawLineDDA(new Vector3(Framebuffer.minWindow.x - 1, Framebuffer.minWindow.y - 1, 0), new Vector3(Framebuffer.maxWindow.x + 1, Framebuffer.minWindow.y - 1, 0), colred);
        this.drawLineDDA(new Vector3(Framebuffer.minWindow.x - 1, Framebuffer.maxWindow.y + 1, 0), new Vector3(Framebuffer.maxWindow.x + 2, Framebuffer.maxWindow.y + 1, 0), colred);

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

    public static minWindow: Vector3 = new Vector3(0, 0, 0);
    public static maxWindow: Vector3 = new Vector3(319, 199, 0);
    // seems to habe a small bug
    public cohenSutherlandLineClipper(start: Vector3, end: Vector3, col: number) {
        let p1: Vector3 = new Vector3(start.x, start.y, start.z);
        let p2: Vector3 = new Vector3(end.x, end.y, end.z);

        let code1: number = this.computeRegionCode(p1);
        let code2: number = this.computeRegionCode(p2);

        let accept: boolean = false;
        let done: boolean = false;

        while (!done) {

            if (this.isTrivialAccept(code1, code2)) {
                accept = true;
                done = true;
            } else if (this.isTrivialReject(code1, code2)) {
                done = true;
            } else {

                if (code1 == Framebuffer.REGION_CODE_CENTER) {
                    let tempCode: number = code1;
                    code1 = code2;
                    code2 = tempCode;

                    let tempPoint: Vector3 = p1;
                    p1 = p2;
                    p2 = tempPoint;
                }

                if ((code1 & Framebuffer.REGION_CODE_TOP) != Framebuffer.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.maxWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.maxWindow.y;
                } else if ((code1 & Framebuffer.REGION_CODE_BOTTOM) != Framebuffer.REGION_CODE_CENTER) {
                    p1.x = Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y));
                    p1.y = Framebuffer.minWindow.y;
                } else if ((code1 & Framebuffer.REGION_CODE_RIGHT) != Framebuffer.REGION_CODE_CENTER) {
                    p1.y = Math.round(p1.y + (p2.y - p1.y) * (Framebuffer.maxWindow.x - p1.x) / (p2.x - p1.x));
                    p1.x = Framebuffer.maxWindow.x;
                } else if ((code1 & Framebuffer.REGION_CODE_LEFT) != Framebuffer.REGION_CODE_CENTER) {
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

    public isTrivialAccept(code1: number, code2: number): boolean {
        return (code1 | code2) == Framebuffer.REGION_CODE_CENTER;
    }

    public isTrivialReject(code1: number, code2: number): boolean {
        return (code1 & code2) != Framebuffer.REGION_CODE_CENTER;
    }

    public static REGION_CODE_CENTER = 0b0000;
    public static REGION_CODE_LEFT = 0b0001;
    public static REGION_CODE_RIGHT = 0b0010;
    public static REGION_CODE_BOTTOM = 0b0100;
    public static REGION_CODE_TOP = 0b1000;

    public dec2bin(dec: number) {
        return (dec >>> 0).toString(2);
    }

    public computeRegionCode(point: Vector3): number {
        let regionCode: number = Framebuffer.REGION_CODE_CENTER;

        if (point.x < Framebuffer.minWindow.x) {
            regionCode |= Framebuffer.REGION_CODE_LEFT;
        } else if (point.x > Framebuffer.maxWindow.x) {
            regionCode |= Framebuffer.REGION_CODE_RIGHT;
        }

        if (point.y < Framebuffer.minWindow.y) {
            regionCode |= Framebuffer.REGION_CODE_BOTTOM;
        } else if (point.y > Framebuffer.maxWindow.y) {
            regionCode |= Framebuffer.REGION_CODE_TOP;
        }

        return regionCode;
    }

    public shadingSphere(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector4f> = [];

        const STEPS = 16;
        const STEPS2 = 16;
        for (let i = 0; i <= STEPS; i++) {
            for (let r = 0; r < STEPS2; r++) {
                points.push(this.sphereFunction(-i * Math.PI / STEPS - Math.PI / 2, -r * 2 * Math.PI / STEPS2));
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

        // compute normals
        let normals: Array<Vector4f> = new Array<Vector4f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        // Create MV Matrix
        let scale = 5.8;
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -26 + 4 * Math.sin(elapsedTime * 0.7)).multiplyMatrix(modelViewMartrix);

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3> = new Array<Vector3>();

        let normals2: Array<Vector4f> = new Array<Vector4f>();
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

            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector4f(0.5, 0.5, 0.5, 0.0).normalize())) * 100), 255) + 50;
                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar + 100;
                this.drawTriangleDDA(v1, v2, v3, color);
                //this.drawLineDDA(v1, v2, colLine);
                //this.drawLineDDA(v1, v3, colLine);
                //this.drawLineDDA(v3, v2, colLine);
            }
        }
    }


    private clearColorBuffer() {
        this.clear();
    }

    public shadingSphereClip(elapsedTime: number): void {
        this.clearColorBuffer();
        this.clearDepthBuffer();

        let points: Array<Vector4f> = [];

        let STEPS = 16 / 2;
        let STEPS2 = 16;
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

        // compute normals
        let normals: Array<Vector4f> = new Array<Vector4f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        // Create MV Matrix
        let scale = 5.8;

        let viewMatrix = this.camera.getViewMatrix();
        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = viewMatrix.multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0, -9).multiplyMatrix(modelViewMartrix));

        //this.drawObject(points, normals, index, modelViewMartrix, 0, 255, 0);

        // torus starts
        points = [];

        STEPS = 15;
        STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(new Vector4f(pos.x, pos.y, pos.z, 1.0));
            }
        }

        index = [];

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
        normals = new Array<Vector4f>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal.mul(-1));
        }


        scale = 1.6;

        viewMatrix = this.camera.getViewMatrix();
        modelViewMartrix =Matrix4f.constructYRotationMatrix(elapsedTime * 0.1).multiplyMatrix( Matrix4f.constructScaleMatrix(scale, scale, scale));
        //modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(-elapsedTime * 0.2));
        modelViewMartrix = viewMatrix.multiplyMatrix(Matrix4f.constructZRotationMatrix(-elapsedTime * 0.02).multiplyMatrix(Matrix4f.constructTranslationMatrix(0, 0, -21).multiplyMatrix(modelViewMartrix)));


        this.drawObject(points, normals, index, modelViewMartrix, 215, 30,120);
        
    }

    private drawObject(points: Vector4f[], normals: Vector4f[], index: number[], modelViewMartrix: Matrix4f, red: number, green: number, blue: number) {
        let points2: Array<Vector3> = new Array<Vector3>();
        let normals2: Array<Vector4f> = new Array<Vector4f>();

        for (let i = 0; i < normals.length; i++) {
            normals2.push(modelViewMartrix.multiplyHom(normals[i]));
        }

        for (let i = 0; i < points.length; i++) {
            let tmp = modelViewMartrix.multiplyHom(points[i])
            points2.push(new Vector3(tmp.x, tmp.y, tmp.z));
        }

        for (let i = 0; i < index.length; i += 3) {
            let v1 = points2[index[i]];
            let v2 = points2[index[i + 1]];
            let v3 = points2[index[i + 2]];

            let colLine = 255 << 24 | 255 << 16 | 255 << 8 | 255;
            if (true) {
                let normal = normals2[i / 3];
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector4f(0.5, 0.5, 0.3, 0.0).normalize()))), 1.0);
                let ambient = 29;
                let color = 255 << 24 | Math.min(scalar * blue+ambient,255) << 16 | Math.min(scalar * green+ambient,255) << 8 | Math.min(scalar * red+ambient,255);
                this.zClipTriangle(new Array<Vector3>(v1, v2, v3), color);
            }
        }
    }

    NEAR_PLANE_Z = -1.7;

    public isInFrontOfNearPlane(p: Vector3): boolean {
        return p.z < this.NEAR_PLANE_Z;
    }

    public computeNearPlaneIntersection(p1: Vector3, p2: Vector3): Vector3 {
        let ratio = (this.NEAR_PLANE_Z - p1.z) / (p2.z - p1.z);
        return new Vector3(ratio * (p2.x - p1.x) + p1.x, ratio * (p2.y - p1.y) + p1.y, this.NEAR_PLANE_Z);
    }

    public zClipTriangle(subject: Array<Vector3>, color: number): void {

        let output = subject;

        let input = output;
        output = new Array<Vector3>();
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

        let projected: Vector3[] = output.map<Vector3>((v) => {
            return this.project(v);
        })

        this.clipConvexPolygon(projected, color);
    }


    private torusFunction(alpha: number): Vector3 {
        return new Vector3(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
    }


    /**
     * https://www.youtube.com/watch?v=VMD7fsCYO9o
     * http://www.cs.jhu.edu/~misha/Fall16/13.pdf
     * http://www.cubic.org/docs/3dclip.htm
     * 
     * @param {number} elapsedTime 
     * @memberof Framebuffer
     */
    public shadingTorus2(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector3> = [];

        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
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
        let normals: Array<Vector3> = new Array<Vector3>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        let scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.09));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3> = new Array<Vector3>();

        let normals2: Array<Vector3> = new Array<Vector3>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(Math.sin(elapsedTime * 0.04) * 25,
            Math.sin(elapsedTime * 0.05) * 9, -24).multiplyMatrix(modelViewMartrix);

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

            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
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
                    this.clipConvexPolygon(new Array<Vector3>(v1, v2, v3), color);
                } else {
                    this.drawTriangleDDA(v1, v2, v3, color);
                }
            }
        }
    }

    // Sutherland-Hodgman
    // http://www.sunshine2k.de/coding/java/SutherlandHodgman/SutherlandHodgman.html
    // http://www.cubic.org/docs/3dclip.htm

    private static clipRegion = new Array<AbstractClipEdge>(
        new RightEdge(),
        new LeftEdge(),
        new BottomEdge(),
        new TopEdge()
    );

    /**
     * FIXME: optimize by minimizing creation of new arrays
     * https://www.npmjs.com/package/npm-check-updates
     * 
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @param {Vector3} v3 
     * @param {number} color 
     * @returns {void} 
     * @memberof Framebuffer
     */
    public clipConvexPolygon(subject: Array<Vector3>, color: number): void {

        let output = subject;

        for (let j = 0; j < Framebuffer.clipRegion.length; j++) {
            let edge = Framebuffer.clipRegion[j];
            let input = output;
            output = new Array<Vector3>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                let point = input[i];
                if (edge.isInside(point)) {
                    if (!edge.isInside(S)) {
                        output.push(edge.computeIntersection(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside(S)) {
                    output.push(edge.computeIntersection(S, point));
                }
                S = point;
            }
        };

        if (output.length < 3) {
            return;
        }

        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
            this.drawTriangleDDA(output[0], output[1 + i], output[2 + i], color);
        }
    }

    public shadingTorus(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let points: Array<Vector3> = [];

        const STEPS = 15;
        const STEPS2 = 12;
        for (let i = 0; i < STEPS; i++) {
            let frame = this.torusFunction(i * 2 * Math.PI / STEPS);
            let frame2 = this.torusFunction(i * 2 * Math.PI / STEPS + 0.1);
            let up = new Vector3(0.0, 4.0, 0);
            let right = frame2.sub(frame).cross(up);

            for (let r = 0; r < STEPS2; r++) {
                let pos = up.mul(Math.sin(r * 2 * Math.PI / STEPS2)).add(right.mul(Math.cos(r * 2 * Math.PI / STEPS2))).add(frame);
                points.push(pos);
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
        let normals: Array<Vector3> = new Array<Vector3>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1]].sub(points[index[i]]).cross(points[index[i + 2]].sub(points[index[i]]));
            normals.push(normal);
        }

        let scale = 1.0;

        let modelViewMartrix = Matrix4f.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix4f.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage
         */
        let points2: Array<Vector3> = new Array<Vector3>();

        let normals2: Array<Vector3> = new Array<Vector3>();
        for (let n = 0; n < normals.length; n++) {
            normals2.push(modelViewMartrix.multiply(normals[n]));
        }

        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);

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

            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
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
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3(0.5, 0.5, 0.5).normalize())) * 100), 255) + 50;
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
    public shadingDemo(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let index: Array<number> = [
            1, 2, 3, 4, 1, 3,
            5, 7, 6, 8, 7, 5,

            2, 6, 7, 7, 3, 2,
            5, 1, 4, 4, 8, 5,

            4, 3, 7, 7, 8, 4,
            1, 6, 2, 5, 6, 1
        ];

        let points: Array<Vector3> = [
            new Vector3(-1.0, -1.0, 1.0), new Vector3(1.0, -1.0, 1.0),
            new Vector3(1.0, 1.0, 1.0), new Vector3(-1.0, 1.0, 1.0),
            new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, -1.0, -1.0),
            new Vector3(1.0, 1.0, -1.0), new Vector3(-1.0, 1.0, -1.0),
        ];

        // compute normals
        let normals: Array<Vector3> = new Array<Vector3>();

        for (let i = 0; i < index.length; i += 3) {
            let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1]));
            normals.push(normal);
        }


        let colorAr: Array<number> = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
            255 << 24 | 255 << 16,
            255 << 24 | 255 << 16 | 255,
            255 << 24 | 255 << 16 | 255 << 8,
            255 << 24 | 255 << 8 | 128,
        ];

        let scale = 3.2;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.08));

        /**
         * Vertex Shader Stage:
         * 1. Local Space -> World Space -> Eye Space -> Clip Space -> NDC Space -> Screen Space
         * 2. Computes Lighting per Vertex
         */
        let points2: Array<Vector3> = new Array<Vector3>();

        let normals2: Array<Vector3> = new Array<Vector3>();
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

            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
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

                let light = new Vector3(0.5, 0.5, 0.5);
                let ambient = new Vector3(50, 100, 50);
                let diffuse = new Vector3(90, 90, 90).mul(Math.max(0.0, normal.normalize().dot(light.normalize())));
                let reflection = new Vector3(0, 0, 1).sub(light.mul(-1).normalize());
                // http://www.lighthouse3d.com/tutorials/glsl-tutorial/directional-lights-per-vertex-ii/
                let specular = new Vector3(0, 0, 0);
                let phong: Vector3 = ambient.add(diffuse).add(specular);
                let color = 255 << 24 | (phong.z & 0xff) << 16 | (phong.y & 0xff) << 8 | (phong.x & 0xff);
                this.drawTriangleDDA(v1, v2, v3, color);
            }
        }
    }

    private isTriangleCCW(v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }, v3: { x: number, y: number, z: number }): boolean {
        let det: number = (v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x);
        return det > 0;
    }

    public scene10(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let index: Array<number> = [
            1, 2, 3, 4, 1, 3,
            5, 7, 6, 8, 7, 5,

            2, 6, 7, 7, 3, 2,
            5, 1, 4, 4, 8, 5,

            4, 3, 7, 7, 8, 4,
            1, 6, 2, 5, 6, 1
        ];

        let points: Array<Vector3> = [
            new Vector3(-1.0, -1.0, 1.0), new Vector3(1.0, -1.0, 1.0),
            new Vector3(1.0, 1.0, 1.0), new Vector3(-1.0, 1.0, 1.0),
            new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, -1.0, -1.0),
            new Vector3(1.0, 1.0, -1.0), new Vector3(-1.0, 1.0, -1.0),
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

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.08));

        for (let i = 0; i < 2; i++) {

            let points2: Array<Vector3> = new Array<Vector3>();
            points.forEach(element => {
                let transformed = modelViewMartrix.multiply(element);

                let x = transformed.x + i * 4 - 2;
                let y = transformed.y;
                let z = transformed.z - 9; // TODO: use translation matrix!

                let xx = (320 * 0.5) + (x / (-z * 0.0078));
                let yy = (200 * 0.5) - (y / (-z * 0.0078));
                points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
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

    public scene9(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let data: any = json;

        let index: Array<number> = data.faces;

        let points: Array<Vector3> = new Array<Vector3>();
        data.vertices.forEach(x => {
            points.push(new Vector3(x.x, x.y, x.z));
        });

        let scale = 4.0;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.05));

        let points2: Array<Vector3> = new Array<Vector3>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 9; // TODO: use translation matrix!

            let xx = (320 * 0.5) + (x / (-z * 0.0078));
            let yy = (200 * 0.5) - (y / (-z * 0.0078));
            points2.push(new Vector3(Math.round(xx), Math.round(yy), z));
        });

        let color = 255 | 255 << 16 | 255 << 24;

        for (let i = 0; i < index.length; i += 3) {
            // backface culling
            if (points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1])).z < 0) {
                let normal = points[index[i + 1] - 1].sub(points[index[i] - 1]).cross(points[index[i + 2] - 1].sub(points[index[i] - 1])).mul(-1);
                let scalar = Math.min((Math.max(0.0, normal.normalize().dot(new Vector3(1, -1, 0).normalize())) * 155), 255) + 100;

                let color = 255 << 24 | scalar << 16 | scalar << 8 | scalar;
                let col3 = 255 << 24 | 0;
                this.drawTriangleDDA(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], color);
                //       this.drawLineDDA(points2[index[i] - 1], points2[index[i + 1] - 1], col3);
                //      this.drawLineDDA(points2[index[i + 1] - 1], points2[index[i + 2] - 1], col3);
                //    this.drawLineDDA(points2[index[i + 2] - 1], points2[index[i] - 1], col3);
            }
        }

    }

    drawTriangleSpan(dist: number, xpos: number, ypos: number, color: number): void {
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

    fillLongRightTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {

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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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

    fillLongLeftTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {

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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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

    fillBottomFlatTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {

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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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


    fillTopFlatTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {
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
            let framebufferIndex = Math.round(yPosition) * 320 + Math.round(xPosition)
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
    public drawTriangleDDA(p1: Vector3, p2: Vector3, p3: Vector3, color: number): void {
        if (p1.y > p3.y) {
            let temp: Vector3 = p1;
            p1 = p3;
            p3 = temp;
        }

        if (p1.y > p2.y) {
            let temp: Vector3 = p1;
            p1 = p2;
            p2 = temp;
        }

        if (p2.y > p3.y) {
            let temp: Vector3 = p2;
            p2 = p3;
            p3 = temp;
        }

        if (p1.y == p3.y) {
            return;
        } else if (p2.y == p3.y) {
            if (p2.x > p3.x) {
                let temp: Vector3 = p2;
                p2 = p3;
                p3 = temp;
            }
            this.fillBottomFlatTriangle(p1, p2, p3, color);
        } else if (p1.y == p2.y) {
            if (p1.x > p2.x) {
                let temp: Vector3 = p1;
                p1 = p2;
                p2 = temp;
            }
            this.fillTopFlatTriangle(p1, p2, p3, color);
        } else {
            let x = (p3.x - p1.x) * (p2.y - p1.y) / (p3.y - p1.y) + p1.x;
            if (x > p2.x) {
                this.fillLongRightTriangle(p1, p2, p3, color);
            } else {
                this.fillLongLeftTriangle(p1, p2, p3, color);
            }
        }
    }

    /**
     * digital differential analyser line drawing algorithm
     * using fixed point math.
     * renders approx 1400 lines per millisecond on my machine
     */
    public drawLineDDA(start: Vector3, end: Vector3, color: number): void {
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
    drawRotoZoomer(texture: Texture) {
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
    drawVoxelLandscape2(texture: Texture, time: number) {
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

    getPixel(texture: Texture, x: number, y: number) {
        return texture.texture[(x & 0xff) + (y & 0xff) * 256];
    }

    getBilinearFilteredPixel(texture: Texture, x: number, y: number) {
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
        let balls: Array<Vector3> = [
            new Vector3(Math.sin(Date.now() * 0.002) * 100 + 150,
                Math.cos(Date.now() * 0.003) * 100 + 100, 0),
            new Vector3(Math.sin(Date.now() * 0.001) * 100 + 150,
                Math.cos(Date.now() * 0.002) * 100 + 100, 0)
        ]

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
                this.framebuffer[index++] = 255 << 24 | Math.min(intensity, 255);;
            }
        }
    }

    draw(texture: Texture, time: number) {
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