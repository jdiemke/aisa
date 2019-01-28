import { StreamReader } from '../md2/StreamReader';

export class MDLTexCoord {

    public onseam: number;
    public s: number;
    public t: number;

    constructor(stream: StreamReader) {
        this.onseam = stream.readInt();
        this.s = stream.readInt();
        this.t = stream.readInt();
    }
}
