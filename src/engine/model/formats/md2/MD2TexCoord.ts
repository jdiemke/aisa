import { MD2Header, StreamReader } from '@engine/model/formats/md2';

export class MD2TexCoord {

    public s: number;
    public t: number;

    constructor(stream: StreamReader, header: MD2Header) {
        this.s = stream.readSignedShort() / (header.skinWidth - 1);
        this.t = stream.readSignedShort() / (header.skinHeight - 1);
    }

}
