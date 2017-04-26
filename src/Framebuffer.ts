import Texture from './Texture';
import Point from './Point';
import Vector3 from './Vector3f';
import Matrix3 from './Matrix3';

declare function require(string): string;
let json = require('./assets/f16.json');

export default class Framebuffer {

    static PIXEL_SIZE_IN_BYTES = 4;

    private width: number;
    private height: number;
    private imageData: ImageData;
    private framebuffer: Uint32Array;
    private unsignedIntArray: Uint8ClampedArray;
    public wBuffer: Float64Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(320, 200);
        this.wBuffer = new Float64Array(320 * 200);
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
            6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4
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

    public scene10(elapsedTime: number): void {

        this.wBuffer.fill(100);

        let index: Array<number> = [
            1, 2, 3, 4, 5, 6
        ];

        let points: Array<Vector3> = [
            new Vector3(-1.0, -1.0, 1.0), new Vector3(1.0, -1.0, 1.0),
            new Vector3(1.0, 1.0, 1.0),
            new Vector3(-1.0, -1.0, -1.0), new Vector3(1.0, -1.0, -1.0),
            new Vector3(1.0, 1.0, -1.0)
        ];

        let colorAr: Array<number> = [
            255 << 24 | 255 << 0,
            255 << 24 | 255 << 8,
        ];

        let scale = 2.2;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.08));

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

        let colindex = 0;
        for (let i = 0; i < index.length; i += 3) {
            // backface culling

            // if (points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1])).z < 0) {
            let color = colorAr[colindex++];

            this.drawTriangleDDA2(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], color);
             this.drawLineDDA(points2[index[i] - 1], points2[index[i + 1] - 1], color);
             this.drawLineDDA(points2[index[i + 1] - 1], points2[index[i + 2] - 1], color);
             this.drawLineDDA(points2[index[i + 2] - 1], points2[index[i] - 1], color);
            // }
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
                let normal = points2[index[i + 1] - 1].sub(points2[index[i] - 1]).cross(points2[index[i + 2] - 1].sub(points2[index[i] - 1]));
                
                let color = (255 * (-points2[index[i] - 1].z - 3) / 14) & 0xff | 255 << 16 | 255 << 24;
                let col3= 255 << 24 | 255;
                this.drawLineDDA(points2[index[i] - 1], points2[index[i + 1] - 1], col3);
                this.drawLineDDA(points2[index[i + 1] - 1], points2[index[i + 2] - 1], col3);
                this.drawLineDDA(points2[index[i + 2] - 1], points2[index[i] - 1], col3);
                this.drawTriangleDDA2(points2[index[i] - 1], points2[index[i + 1] - 1], points2[index[i + 2] - 1], color);
            }
        }

    }

    drawTriangleSpan(dist: number, xpos: number, ypos: number, color: number): void {
        let framebufferIndex = xpos + ypos * this.width;
        this.framebuffer.fill(color, framebufferIndex, framebufferIndex + dist);
    }

    /**
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

    swapVertices(vertices: Array<Vector3>, index1: number, index2: number) {
        let tempVertex: Vector3 = vertices[index1];
        vertices[index1] = vertices[index2];
        vertices[index2] = tempVertex;
    }

    first: boolean;

    fillBottomFlatTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {
        let slope1 = (v2.x - v1.x) / (v2.y - v1.y);
        let slope2 = (v3.x - v1.x) / (v3.y - v1.y);

        let zslope1 = ((1/v2.z - 1/v1.z) / (v2.y - v1.y));
        let zslope2 = ((1/v3.z - 1/v1.z) / (v3.y - v1.y));

        let curx1 = v1.x;
        let curx2 = v1.x + 1;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v1.z;

        for (let i = 0; i < Math.round(v2.y - v1.y); i++) {
     
            for (let j = curx1; j < (curx2); j++) {
                let wStart = (curz2 - curz1) / (curx2 - curx1) * (j - curx1) + curz1;
               
                if (wStart < this.wBuffer[Math.round(j) + Math.round(v1.y + i) * 320]) {
                    this.wBuffer[Math.round(j) + Math.round(v1.y + i) * 320] = wStart;
                    //color = 255 <<24 | (wStart*255) &0xff;
                    this.drawPixel(Math.round(j), Math.round(v1.y + i), color);
                }
            }
            // this.drawTriangleSpan(Math.round(curx2 - curx1), Math.round(curx1), Math.round(v1.y + i), color);
            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }

    fillTopFlatTriangle(v1: Vector3, v2: Vector3, v3: Vector3, color: number): void {
        let slope1 = (v3.x - v1.x) / (v3.y - v1.y);
        let slope2 = (v3.x - v2.x) / (v3.y - v2.y);

        let zslope1 = ((1/v3.z - 1/v1.z) / (v3.y - v1.y));
        let zslope2 = ((1/v3.z - 1/v2.z) / (v3.y - v2.y));

        let curx1 = v1.x;
        let curx2 = v2.x;

        let curz1 = 1.0 / v1.z;
        let curz2 = 1.0 / v2.z;

        for (let i = 0; i < Math.round(v3.y - v1.y); i++) {

            for (let j = curx1; j < (curx2); j++) {
                let wStart = (curz2 - curz1) / (curx2 - curx1) * (j - curx1) + curz1;
                if (wStart < this.wBuffer[Math.round(j) + Math.round(v1.y + i) * 320]) {
                    this.wBuffer[Math.round(j) + Math.round(v1.y + i) * 320] = wStart;
                    this.drawPixel(Math.round(j), Math.round(v1.y + i), color);
                }
            }

            curx1 += slope1;
            curx2 += slope2;

            curz1 += zslope1;
            curz2 += zslope2;
        }
    }

    /**
     * type 1: bottom flat
     * type 2: top flat
     * type 3: MIDP right
     * type 4: MIDP left
     */
    public drawTriangleDDA2(p1: Vector3, p2: Vector3, p3: Vector3, color: number): void {
        if (p1.y > p3.y) {
            [p1, p3] = [p3, p1];
        }

        if (p1.y > p2.y) {
            [p1, p2] = [p2, p1];
        }

        if (p2.y > p3.y) {
            [p2, p3] = [p3, p2];
        }

        if (p1.y == p3.y) {
            return;
        } else if (p2.y == p3.y) {
            if (p2.x > p3.x) {
                [p2, p3] = [p3, p2];
            }
            this.fillBottomFlatTriangle(p1, p2, p3, color);
        } else if (p1.y == p2.y) {
            if (p1.x > p2.x) {
                [p1, p2] = [p2, p1];
            }
            this.fillTopFlatTriangle(p1, p2, p3, color);
        } else {
            let x = (p3.x - p1.x) * (p2.y - p1.y) / (p3.y - p1.y) + p1.x;
            let z = (1/p3.z - 1/p1.z) * (p2.y - p1.y) / (p3.y - p1.y) + 1/p1.z;
            let MIDP: Vector3 = new Vector3(x, p2.y, 1/z);

            if (x > p2.x) {
                this.fillBottomFlatTriangle(p1, p2, MIDP, color);
                this.fillTopFlatTriangle(p2, MIDP, p3, color);
            } else {
                this.fillBottomFlatTriangle(p1, MIDP, p2, color);
                this.fillTopFlatTriangle(MIDP, p2, p3, color);
            }
        }
    }

    /**
     * Triangle rasterization using edge-walking strategy for scan-conversion.
     * Internally DDA is used for edge-walking.
     * TODO: rotate around center and check for correctness!!
     */
    public drawTriangleDDA(vertices: Array<Vector3>): void {
        let color = 255 << 24 | 255;

        if (vertices[1].y > vertices[2].y) {
            this.swapVertices(vertices, 1, 2);
        }

        if (vertices[0].y > vertices[2].y) {
            this.swapVertices(vertices, 0, 2);
        }

        if (vertices[0].y > vertices[1].y) {
            this.swapVertices(vertices, 0, 1);
        }

        if (vertices[1].y == vertices[2].y) {
            if (vertices[1].x > vertices[2].x) this.swapVertices(vertices, 1, 2);
            this.fillBottomFlatTriangle(vertices[0], vertices[1], vertices[2], color);
            //  console.log("flat bottom");
        } else if (vertices[0].y == vertices[1].y) {
            if (vertices[0].x > vertices[1].x) this.swapVertices(vertices, 0, 1);
            this.fillTopFlatTriangle(vertices[0], vertices[1], vertices[2], color);
            // console.log("flat top");
        } else {
            let v4 = new Vector3(vertices[0].x + (vertices[1].y - vertices[0].y) /
                (vertices[2].y - vertices[0].y) * (vertices[2].x - vertices[0].x), vertices[1].y, 0);
            this.fillBottomFlatTriangle(vertices[0], vertices[1], v4, color);
            this.fillTopFlatTriangle(vertices[1], v4, vertices[2], color);
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
        let wStart = 1 / (start.z+0.1) ;
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