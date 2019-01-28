import { Texture } from '../../texture/index';
import { StreamReader } from '../md2/StreamReader';
import { MDLHeader } from './MDLHeader';

export class MDLSkin {

    public group: number;
    public texture: Texture;

    constructor(stream: StreamReader, header: MDLHeader) {
        this.group = stream.readInt();

        for (let i: number = 0; i < header.skinWidth * header.skinHeight; i++) {
            stream.readUnsignedInt8();
        }
    }

}
