/**
 * 3d polygon clipping:
 * http://www.gamers.org/dEngine/quake/papers/ddjclip.html
 * http://www.jagregory.com/abrash-black-book/#chapter-65-3-d-clipping-and-other-thoughts
 * http://downloads.gamedev.net/pdf/gpbb/gpbb65.pdf
 * http://www.cubic.org/docs/3dclip.htm
 * http://fabiensanglard.net/polygon_codec/
 * 
 * http://fabiensanglard.net/quake2/quake2_software_renderer.php
 */
import Texture from './Texture';
import Point from './Point';
import Vector3 from './Vector3f';
import Vector4f from './Vector4f';
import Matrix3 from './Matrix3';
import Matrix4f from './Matrix4f';

declare function require(string): string;
let json = require('./assets/f16.json');

export default class Framebuffer {

    static PIXEL_SIZE_IN_BYTES = 4;

    private width: number;
    private height: number;
    private imageData: ImageData;
    private framebuffer: Uint32Array;
    private unsignedIntArray: Uint8ClampedArray;
    public wBuffer: Float32Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float32Array(320 * 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);

        this.framebuffer = new Uint32Array(arrayBuffer);
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

    public drawTexture(x, y, texture: Texture) {
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
                let alpha = ((texture.texture[textureIndex] >> 24) & 0xff) / 255;
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

        let scale = 1.8;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.05));

        let points2: Array<Vector3> = new Array<Vector3>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 6 + Math.sin(elapsedTime); // TODO: use translation matrix!

            let xx = (320 / 2) + (x / (-z * 0.0078));
            let yy = (200 / 2) - (y / (-z * 0.0078));
            points2.push(new Vector3(xx, yy, z));
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
    public debug(elapsedTime: number): void {

        this.wBuffer.fill(100);

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

    private torusFunction(alpha: number): Vector3 {
        return new Vector3(Math.sin(alpha) * 10, 0, Math.cos(alpha) * 10);
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
        normals.forEach(element => {
            normals2.push(modelViewMartrix.multiply(element));
        });

        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);

        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

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

    private isTriangleCCW(v1: Vector3, v2: Vector3, v3: Vector3): boolean {
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
            if (wStart < this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320]) {
                this.wBuffer[Math.round(xPosition) + Math.round(yPosition) * 320] = wStart;
                this.drawPixel(Math.round(xPosition), Math.round(yPosition), color);
            }
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

    draw(texture: Texture) {
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