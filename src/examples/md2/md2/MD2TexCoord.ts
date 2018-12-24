import { StreamReader } from './StreamReader';

export class MD2TexCoord {

    public s: number;
    public t: number;

    constructor(stream: StreamReader) {
        this.s = stream.readSignedShort();
        this.t = stream.readSignedShort();
    }

}
