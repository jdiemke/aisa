import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture, TextureUtils } from '../../texture';

/**
 * Voxel Landscape
 *
 * Integer based for speed.
 * "The ray casting approach for terrain rendering
 * assumes that the terrain is modeled by a Digital Elevation
 * Map (DEM) and Digital Color Map (DCM). The DEM
 * associates an elevation to each position (x,y) in the
 * terrain and the DCM associates a color value to each
 * position in the terrain. These maps are sampling of a
 * height and color field in a uniform grid. A column of the
 * terrain raised with a height and color taken from the
 * DEM and DCM, respectively, is called a voxel"
 *
 */

export class VoxelLandScapeFadeScene extends AbstractScene {
    private MAP_BIT_SIZE: number = 8; // 8  = 256x256 , 9 = 512x512
    private RENDERWIDTH: number;
    private RENDERHEIGHT: number;
    private RENDERLENGTH: number;
    private MAPWIDTH: number; // texture size.  if mapbit is 9 then 2^9 = 512
    private MAPWIDTH_MIN_1: number;
    private MAPSIZE;

    private sinTable: Array<number>;
    private cosTable: Array<number>;
    private heightMap: Uint32Array;
    private texelMap: Uint32Array;
    private colorLut: Uint32Array;

    private playerX: number = 20;
    private playerY: number = 0;
    private playerZ: number = (500 << 12);        // higher number = overhead view
    private playerDistance: number = 277 << 11; // how tall the mountains are
    private playerSpeed: number = 1;            // positiver number faster forward
    private playerAngle: number = 0;
    private angleSpeed: number = 0;              // positive number turns right
    private viewportHeight: number = 0;  // how close to the flor

    private voxelmap: Texture;
    private colormap: Texture;

    public init(framebuffer: Framebuffer): Promise<any> {

        this.MAP_BIT_SIZE = 8; // 8  = 256x256 , 9 = 512x512
        this.RENDERWIDTH = framebuffer.width;
        this.RENDERHEIGHT = framebuffer.height;
        this.RENDERLENGTH = this.RENDERWIDTH * this.RENDERHEIGHT;
        this.MAPWIDTH = 1 << this.MAP_BIT_SIZE; // texture size.  if mapbit is 9 then 2^9 = 512
        this.MAPWIDTH_MIN_1 = this.MAPWIDTH - 1;
        this.MAPSIZE = this.MAPWIDTH * this.MAPWIDTH;

        this.sinTable = [3600];
        this.cosTable = [3600];
        this.heightMap = new Uint32Array(this.MAPSIZE);
        this.texelMap = new Uint32Array(this.RENDERLENGTH);
        this.colorLut = new Uint32Array(65536);

        return Promise.all([
            TextureUtils.load(require('@assets/voxel/height_256.png'), false).then(
                (texture: Texture) => this.voxelmap = texture
            ),
            TextureUtils.load(require('@assets/voxel/lines_256.png'), true).then(
                (texture: Texture) => this.colormap = texture
            ),
        ]).then(
            () => {
                this.setup();
            });
    }

    public render(framebuffer: Framebuffer): void {
        this.playerAngle += this.angleSpeed;

        if (this.playerAngle < 0) {
            this.playerAngle += 3600;
        } else if (this.playerAngle >= 3600) {
            this.playerAngle -= 3600;
        }

        this.playerX += 3600;
        this.playerY += 0;

        // this.playerX += this.cosTable[this.playerAngle] >> 1;
        // this.playerY += this.sinTable[this.playerAngle] >> 1;

        this.renderVoxel(this.playerX, this.playerY, this.playerZ, this.playerAngle, this.playerDistance, framebuffer);
    }

    private setup(): void {
        this.texelMap = this.colormap.texture;
        let k: number = 0;
        do {
            const aByte: number = (0x000000ff & (this.voxelmap.texture[k]));
            this.heightMap[k] = aByte << 12;
        } while (++k < this.MAPSIZE);

        for (let i: number = 0; i < 3600; i++) {
            this.sinTable[i] = this.toFP(Math.sin(2 * Math.PI * i / 3600));
            this.cosTable[i] = this.toFP(Math.cos(2 * Math.PI * i / 3600));
        }

        for (let i: number = 0; i < 256; i++) {
            for (let j: number = 0; j < 256; j++) {
                const idx: number = (i << 8) + j;
                const c: number = i * j / 256;
                this.colorLut[idx] = Math.round(c);
            }
        }
    }

    private toFP(f: number): number {
        const absf: number = Math.abs(f);
        const k: number = Math.round(absf);
        const l: number = Math.round((absf - k) * 10000);
        let i1: number = (k << 12) + (l << 12) / 10000;
        if (f < 0.0) {
            i1 = -1 * i1;
        }
        return i1;
    }

    private renderVoxel(
        eyeX: number,
        eyeY: number,
        eyeZ: number,
        arc: number,
        dpk: number,
        framebuffer: Framebuffer): void {
        // empty the screen
        framebuffer.clearColorBuffer(0);

        let colAngle: number = arc - (this.RENDERWIDTH >> 1); // view from angle-30 to angle+30
        if (colAngle < 0) {
            colAngle += 3600;
        }
        let col: number = 0;
        const pitch: number = eyeZ - this.viewportHeight;
        const invdpk: number = dpk / 20008; // how high the mountains are

        // COL iteration
        do {
            const j3: number = (this.RENDERLENGTH - (this.RENDERWIDTH)) + col;
            const cosA: number = this.cosTable[colAngle];
            const sinA: number = this.sinTable[colAngle];
            const z: number = eyeZ;
            const x: number = eyeX;
            const y: number = eyeY;
            const dz: number = 0;
            const m: number = pitch / dpk << 12;

            this.iterate(y, x, z, m, sinA, cosA, dz, invdpk, j3, 256, framebuffer);

            if (++colAngle >= 3600) {
                colAngle = 0;
            }
        }

        while (++col < this.RENDERWIDTH);
    }

    private iterate(
        y: number,
        x: number,
        z: number,
        m: number,
        sinA: number,
        cosA: number,
        dz: number,
        invdpk: number,
        j3: number,
        amount: number,
        framebuffer: Framebuffer): void {
        // abscis iteration
        for (let i: number = 0; i < amount; i++) {
            y += sinA;
            x += cosA;
            z -= m;
            dz += invdpk;

            const xm: number = (x >> 11) & this.MAPWIDTH_MIN_1;  // mod 512
            const ym: number = (y >> 11) & this.MAPWIDTH_MIN_1;  // mod 512
            const idx: number = (ym << this.MAP_BIT_SIZE) + xm;
            const hi: number = this.heightMap[idx] >> 2;

            // fade out to the distance
            const texel = Framebuffer.blend(this.texelMap[idx], 0xFF000000, i);
            // texel = this.texelMap[idx];

            // while (hi > z && j3 > 0) {
            while (hi > z) {
                framebuffer.framebuffer[j3] = texel;
                j3 -= this.RENDERWIDTH;
                m -= invdpk;
                z += dz;
            }
            if (j3 < 0) {
                break;
            }
        }
    }

    private blend32(c1: number, c2: number, f: number): number {
        const r1: number = (c1 & 0x00FF0000) >> 16;
        const r2: number = (c2 & 0x00FF0000) >> 16;
        const r: number = (this.colorLut[(r1 << 8) + (255 - f)] + this.colorLut[(r2 << 8) + f]) << 16;

        const g1: number = (c1 & 0x0000FF00) >> 8;
        const g2: number = (c2 & 0x0000FF00) >> 8;
        const g: number = (this.colorLut[(g1 << 8) + (255 - f)] + this.colorLut[(g2 << 8) + f]) << 8;

        const b1: number = (c1 & 0x000000FF);
        const b2: number = (c2 & 0x000000FF);
        const b: number = this.colorLut[(b1 << 8) + (255 - f)] + this.colorLut[(b2 << 8) + f];
        return 0xFF000000 + r + g + b;
    }

}
