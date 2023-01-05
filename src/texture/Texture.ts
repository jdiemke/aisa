export class Texture {
 

    public texture: Uint32Array;
    public width: number;
    public height: number;
    public maxWidth: number;
    public maxHeight: number;
    private clamp: boolean = false;

    setClamp(clamp: boolean) {
        this.clamp = clamp;
    }
    constructor(texture?: Uint32Array, width?: number, height?: number) {
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.maxHeight = (height-1) |0;
        this.maxWidth = (width-1)|0;
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

        let x0 = x | 0;
        let x1 = (x | 0) + 1;
        let y0 = y | 0;
        let y1 = (y | 0) + 1;
   
        if (this.clamp) {
             x0 = Math.max(Math.min(x0, this.width - 1), 0);
             x1 = Math.max(Math.min(x1, this.width - 1), 0);
             y0 = Math.max(Math.min(y0, this.height - 1), 0);
             y1 = Math.max(Math.min(y1, this.height - 1), 0);
        }


        const x0y0 = this.getPixel2(this, x0, y0);
        const x1y0 = this.getPixel2(this, x1, y0);
        const x0y1 = this.getPixel2(this, x0, y1);
        const x1y1 = this.getPixel2(this, x1, y1);
        
        return this.interpolateComp(x, y, x0y0 & 0xff, x1y0 & 0xff, x0y1 & 0xff, x1y1 & 0xff)|
            this.interpolateComp(x, y, x0y0 >> 8 & 0xff, x1y0 >> 8 & 0xff, x0y1 >> 8 & 0xff, x1y1 >> 8 & 0xff) << 8 |
           this.interpolateComp(x, y, x0y0 >> 16 & 0xff, x1y0 >> 16 & 0xff, x0y1 >> 16 & 0xff, x1y1 >> 16 & 0xff) << 16
           | 0xff << 24;
    }

    public getPixel2(texture: Texture, x: number, y: number): number {
        return this.texture[x + y * this.width];
    }

    /**
     * highly optimized version only for power of 2 textures
     */
    public getBilinearFilteredPixelRasterizer(x: number, y: number) {
        let x0 = x | 0;
        let x1 = (x | 0) + 1;
        let y0 = y | 0;
        let y1 = (y | 0) + 1;
   
        let x0y0: number;
        let x1y0: number; 
        let x0y1: number;
        let x1y1: number;

        if (this.clamp) {
             x0 = Math.max(Math.min(x0, this.width - 1), 0);
             x1 = Math.max(Math.min(x1, this.width - 1), 0);
             y0 = Math.max(Math.min(y0, this.height - 1), 0);
             y1 = Math.max(Math.min(y1, this.height - 1), 0);

             x0y0 = this.getPixel2(this, x0, y0);
             x1y0 = this.getPixel2(this, x1, y0);
             x0y1 = this.getPixel2(this, x0, y1);
             x1y1 = this.getPixel2(this, x1, y1);
        } else {
            x0y0 = this.getPixelRasterizer(this, x0, y0);
            x1y0 = this.getPixelRasterizer(this, x1, y0);
            x0y1 = this.getPixelRasterizer(this, x0, y1);
            x1y1 = this.getPixelRasterizer(this, x1, y1);
        }
        return this.interpolateComp(x, y, x0y0, x1y0, x0y1, x1y1);
    }

    public getPixelRasterizer(texture: Texture, x: number, y: number): number {
        return this.texture[(x & (this.width-1)) + (y&(this.height-1)) * this.width];
    }

    public getPixel3(texture: Texture, x: number, y: number): number {
        return this.texture[
            (((x % this.width) + this.width) % this.width) +
            (((y % this.height) + this.height) % this.height) * this.width];
    }

    private interpolateComp(x, y, x0y0, x1y0, x0y1, x1y1): number {
        // reuse these values for all color components
        const xFrac = x - (x | 0);
        const yFrac = y - (y | 0);
        const oneMinusXfrac = 1 - xFrac;
        const oneMinusYfrac = 1 - yFrac;

        const x0y0_r = x0y0 & 0xff;
        const x1y0_r = x1y0 & 0xff;
        const x0y1_r = x0y1 & 0xff;
        const x1y1_r = x1y1 & 0xff;
        
        const col1_r = x0y0_r * oneMinusXfrac + x1y0_r * xFrac;
        const col2_r = x0y1_r * oneMinusXfrac + x1y1_r * xFrac;
        const col_r = col1_r * oneMinusYfrac + (col2_r * yFrac);

        const x0y0_g = x0y0 >> 8 & 0xff;
        const x1y0_g = x1y0 >> 8 & 0xff;
        const x0y1_g = x0y1 >> 8 & 0xff;
        const x1y1_g = x1y1 >> 8 & 0xff;
        
        const col1_g = x0y0_g * oneMinusXfrac + x1y0_g * xFrac;
        const col2_g = x0y1_g * oneMinusXfrac + x1y1_g * xFrac;
        const col_g = col1_g * oneMinusYfrac + (col2_g * yFrac);

        const x0y0_b = x0y0 >> 16 & 0xff;
        const x1y0_b = x1y0 >> 16 & 0xff;
        const x0y1_b = x0y1 >> 16 & 0xff;
        const x1y1_b = x1y1 >> 16 & 0xff;
        
        const col1_b = x0y0_b * oneMinusXfrac + x1y0_b * xFrac;
        const col2_b = x0y1_b * oneMinusXfrac + x1y1_b * xFrac;
        const col_b = col1_b * oneMinusYfrac + (col2_b * yFrac);

        return col_r | col_g << 8 | col_b << 16 | 255 << 24;
    }

}
