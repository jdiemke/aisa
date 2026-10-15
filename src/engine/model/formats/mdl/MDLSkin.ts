import { Texture } from '@engine/texture';
import { StreamReader } from '@engine/model/formats/md2';
import { MDLHeader } from '@engine/model/formats/mdl';

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
