import { StreamReader } from './StreamReader';

export class MD2Triangle {

    public vertices: [number, number, number];
    public texCoords: [number, number, number];

    constructor(stream2: StreamReader) {
        this.vertices = [
            stream2.readUnsigbnedShort(),
            stream2.readUnsigbnedShort(),
            stream2.readUnsigbnedShort()
        ];
        this.texCoords = [
            stream2.readUnsigbnedShort(),
            stream2.readUnsigbnedShort(),
            stream2.readUnsigbnedShort()
        ];
    }

}
