export class Texture {

    public texture: Uint32Array;
    public width: number;
    public height: number;

    constructor(texture?: Uint32Array, width?: number, height?: number) {
        this.texture = texture;
        this.width = width;
        this.height = height;
    }

    public getPixel(texture: Texture, x: number, y: number): number {
        return texture.texture[(x & 0xff) + (y & 0xff) * 256];
    }

    public getBilinearFilteredPixel(x: number, y: number): number {
        const x0 = (((x | 0) % 256) + 256) % 256;
        const x1 = ((((x + 1) | 0) % 256) + 256) % 256;
        const y0 = (((y | 0) % 256) + 256) % 256;
        const y1 = ((((y + 1) | 0) % 256) + 256) % 256;

        const x0y0 = this.getPixel(this, x0, y0) & 0xff;
        const x1y0 = this.getPixel(this, x1, y0) & 0xff;
        const x0y1 = this.getPixel(this, x0, y1) & 0xff;
        const x1y1 = this.getPixel(this, x1, y1) & 0xff;

        const col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        const col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        const col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));

        return col;
    }

    public getBilinearFilteredPixel2(x: number, y: number) {

        const x0 = Math.min(x | 0, this.width - 1);
        const x1 = Math.min((x | 0) + 1, this.width - 1);
        const y0 = Math.min(y | 0, this.height - 1);
        const y1 = Math.min((y | 0) + 1, this.height - 1);

        const x0y0 = this.getPixel2(this, x0, y0);
        const x1y0 = this.getPixel2(this, x1, y0);
        const x0y1 = this.getPixel2(this, x0, y1);
        const x1y1 = this.getPixel2(this, x1, y1);

        return this.interpolateComp(x, y, x0y0 & 0xff, x1y0 & 0xff, x0y1 & 0xff, x1y1 & 0xff) |
            this.interpolateComp(x, y, x0y0 >> 8 & 0xff, x1y0 >> 8 & 0xff, x0y1 >> 8 & 0xff, x1y1 >> 8 & 0xff) << 8 |
            this.interpolateComp(x, y, x0y0 >> 16 & 0xff, x1y0 >> 16 & 0xff, x0y1 >> 16 & 0xff, x1y1 >> 16 & 0xff) << 16;
    }

    public getPixel2(texture: Texture, x: number, y: number): number {
        return this.texture[x + y * this.width];
    }

    public getPixel3(texture: Texture, x: number, y: number): number {
        return this.texture[
            (((x % this.width) + this.width) % this.width) +
            (((y % this.height) + this.height) % this.height) * this.width];
    }

    private interpolateComp(x, y, x0y0, x1y0, x0y1, x1y1): number {
        const col1 = x0y0 * (1 - (x - Math.floor(x))) + (x1y0 * ((x - Math.floor(x))));
        const col2 = x0y1 * (1 - (x - Math.floor(x))) + (x1y1 * ((x - Math.floor(x))));
        const col = col1 * (1 - (y - Math.floor(y))) + (col2 * ((y - Math.floor(y))));

        return col;
    }

}
