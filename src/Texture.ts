export default class Texture {

    texture: Uint32Array
    width: number;
    height: number;

    constructor(texture?: Uint32Array, width?: number, height?: number) {
        this.texture = texture;
        this.width = width;
        this.height = height;
    }

}
