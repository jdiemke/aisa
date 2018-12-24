import { MD2Header } from './MD2Header';
import { MD2Skin } from './MD2Skin';
import { MD2TexCoord } from './MD2TexCoord';
import { StreamReader } from './StreamReader';

export class MD2Loader {

    public static load(filename: string): Promise<void> {
        return fetch(filename).then((response: Response) => {
            return response.arrayBuffer();
        }).then((arrayBuffer: ArrayBuffer) => {
            try {
                MD2Loader.parse(arrayBuffer);
            } catch (ex) {
                console.error(ex.message);
            }
        });
    }

    private static parse(arrayBuffer: ArrayBuffer): void {
        const header: MD2Header = new MD2Header(arrayBuffer);

        console.log(header.toString());

        const skins: Array<MD2Skin> = new Array<MD2Skin>();

        for (let k: number = 0; k < header.numberOfSkins; k++) {
            const skin: MD2Skin = new MD2Skin(arrayBuffer, header.skinsOffset + 64 * k);
            console.log(skin.name);
            skins.push(skin);
        }

        const texCoords: Array<MD2TexCoord> = new Array<MD2TexCoord>();
        const stream: StreamReader = new StreamReader(arrayBuffer, header.texCoordsOffset);

        for (let i: number = 0; i < header.numberOfTexCoords; i++) {
            texCoords.push(new MD2TexCoord(stream));
        }
    }

    private constructor() {

    }

}
