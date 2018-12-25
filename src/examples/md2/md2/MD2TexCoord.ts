import { MD2Header } from './MD2Header';
import { StreamReader } from './StreamReader';

export class MD2TexCoord {

    public s: number;
    public t: number;

    constructor(stream: StreamReader, header: MD2Header) {
        this.s = stream.readSignedShort() / (header.skinWidth - 1);
        this.t = stream.readSignedShort() / (header.skinHeight - 1);
    }

}
