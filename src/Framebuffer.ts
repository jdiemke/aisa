import Texture from './Texture';
import Point from './Point';
import Vector3 from './Vector3f';
import Matrix3 from './Matrix3';

declare function require(string): string;
let json = require('./assets/bunny.json');

export default class Framebuffer {

    static PIXEL_SIZE_IN_BYTES = 4;

    private width: number;
    private height: number;
    private imageData: ImageData;
    private framebuffer: Uint32Array;
    private unsignedIntArray: Uint8ClampedArray;

    private sinLUT: Array<number>;
    private cosLUT: Array<number>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.imageData = new ImageData(320, 200);
        let arrayBuffer = new ArrayBuffer(this.width * this.height * Framebuffer.PIXEL_SIZE_IN_BYTES);
        this.unsignedIntArray = new Uint8ClampedArray(arrayBuffer);

        this.framebuffer = new Uint32Array(arrayBuffer);
        this.sinLUT = new Array<number>();
        this.cosLUT = new Array<number>();

        for (let i = 0; i < 512; i++) {
            this.sinLUT.push(Math.sin(Math.PI * 2.0 / 512 * i));
            this.cosLUT.push(Math.cos(Math.PI * 2.0 / 512 * i));
        }

        console.log(json);

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
            new Vector3( 1.0, 1.0,-1.0), new Vector3(-1.0, 1.0,-1.0),
            new Vector3(-1.0, 1.0, 1.0), new Vector3( 1.0, 1.0, 1.0),
            new Vector3( 1.0,-1.0, 1.0), new Vector3(-1.0,-1.0, 1.0),
            new Vector3(-1.0,-1.0,-1.0), new Vector3( 1.0,-1.0,-1.0)
        ];

        let scale = 1.8;

        let modelViewMartrix = Matrix3.constructScaleMatrix(scale, scale, scale).multiplyMatrix(Matrix3.constructYRotationMatrix(elapsedTime * 0.05));
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix3.constructXRotationMatrix(elapsedTime * 0.05));

        let points2: Array<Vector3> = new Array<Vector3>();
        points.forEach(element => {
            let transformed = modelViewMartrix.multiply(element);

            let x = transformed.x;
            let y = transformed.y;
            let z = transformed.z - 6 +Math.sin(elapsedTime); // TODO: use translation matrix!

            let xx = (320 / 2) + (x / (-z * 0.0078));
            let yy = (200 / 2) - (y / (-z * 0.0078));
            points2.push(new Vector3(xx, yy, z));
        });

        for(let i=0; i < index.length; i+=2) {
            this.drawLine(points2[index[i]], points2[index[i+1]]);
        }

    }

    public scene9(elapsedTime: number): void {
        
        let data: any = json;
        
        // console.log(data.faces);
        let index: Array<number> = data.faces;
        
       // console.log(index);
        
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

            let xx = (320 / 2) + (x / (-z * 0.0078));
            let yy = (200 / 2) - (y / (-z * 0.0078));
            points2.push(new Vector3(xx, yy, z));
        });

        for(let i=0; i < index.length; i+=3) {
            this.drawLine(points2[index[i]-1], points2[index[i+1]-1]);
            this.drawLine(points2[index[i+1]-1], points2[index[i+2]-1]);
            this.drawLine(points2[index[i+2]-1], points2[index[i]-1]);
        }
        
    }

    /**
     * TODO: optimize!!
     */
    public drawLine(start: Vector3, end: Vector3) {
//        let start = new Point(this.width / 2, this.height / 2);
  //      let end = new Point(this.width / 2 + Math.sin(Date.now() * 0.0002) * 100, this.height / 2 + Math.cos(Date.now() * 0.0002) * 100);

        let xdist = (end.x - start.x);
        let xdistSig = Math.sign(xdist);
        let ydist = (end.y - start.y);
        let ydistSig = Math.sign(ydist);

        let color = 255 | 0 << 8 | 255 << 16 | 255 << 24;

        let x1 = start.x;
        let y1 = start.y;

        let ystep = ydist / Math.abs(xdist);
        

        if(Math.abs(ystep) < 1) {

            for (let i = 0; i < Math.abs(xdist); i++) {
                this.drawPixel(x1 | 0, y1 | 0, color);
                x1 += xdistSig;
                y1 += ystep;
            }
        } else {
            let xstep = xdist / Math.abs(ydist);
            
            for (let i = 0; i < Math.abs(ydist); i++) {
                this.drawPixel(x1 | 0, y1 | 0, color);
                y1 += ydistSig;
                x1 += xstep;
            }
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

        // works but lags due to limited precision!!!
        // let yStepX = this.sinLUT[((Date.now() * 0.0003 * 512 / (Math.PI * 2)) & 0x1ff) | 0] * scale;//Math.sin(Date.now() * 0.0003) * scale;
        // let yStepY = this.cosLUT[((Date.now() * 0.0003 * 512 / (Math.PI * 2)) & 0x1ff) | 0] * scale;

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