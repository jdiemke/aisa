import { StreamReader } from './StreamReader';

export class MD2Skin {

    public name: string;

    constructor(arrayBuffer: ArrayBuffer, offset: number = 0) {
        const stream: StreamReader = new StreamReader(arrayBuffer, offset);

        let tempName: string;

        for (let i: number = 0; i < 64; i++) {
            const code: number = stream.readUnsignedInt8();

            if (code === 0) {
                break;
            }

            tempName += String.fromCharCode(code);
        }

        this.name = tempName;
    }

}
