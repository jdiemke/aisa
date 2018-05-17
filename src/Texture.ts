export default class Texture {

    public texture: Uint32Array;
    public width: number;
    public height: number;

    constructor(texture?: Uint32Array, width?: number, height?: number) {
        this.texture = texture;
        this.width = width;
        this.height = height;
    }

}
