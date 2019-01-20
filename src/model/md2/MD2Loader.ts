import { MD2Frame } from './MD2Frame';
import { MD2Header } from './MD2Header';
import { MD2Model } from './MD2Model';
import { MD2Skin } from './MD2Skin';
import { MD2TexCoord } from './MD2TexCoord';
import { MD2Triangle } from './MD2Triangle';
import { StreamReader } from './StreamReader';

export class MD2Loader {

    public static load(filename: string): Promise<MD2Model> {
        return fetch(filename).then((response: Response) => {
            return response.arrayBuffer();
        }).then((arrayBuffer: ArrayBuffer) => {
            try {
                return MD2Loader.parse(arrayBuffer);
            } catch (ex) {
                console.error(ex.message);
            }
        });
    }

    private static parse(arrayBuffer: ArrayBuffer): MD2Model {
        const header: MD2Header = MD2Loader.getHeader(arrayBuffer);

        return new MD2Model(
            MD2Loader.getTextureCoords(arrayBuffer, header),
            MD2Loader.getTriangles(arrayBuffer, header),
            MD2Loader.getFrames(arrayBuffer, header),
            header
        );
    }

    private static getHeader(arrayBuffer: ArrayBuffer): MD2Header {
        return new MD2Header(arrayBuffer);
    }

    private static getSkins(arrayBuffer: ArrayBuffer, header: MD2Header): Array<MD2Skin> {
        const skins: Array<MD2Skin> = new Array<MD2Skin>();

        for (let k: number = 0; k < header.numberOfSkins; k++) {
            const skin: MD2Skin = new MD2Skin(arrayBuffer, header.skinsOffset + 64 * k);
            skins.push(skin);
        }

        return skins;
    }

    private static getTextureCoords(arrayBuffer: ArrayBuffer, header: MD2Header): Array<MD2TexCoord> {
        const texCoords: Array<MD2TexCoord> = new Array<MD2TexCoord>();
        const stream: StreamReader = new StreamReader(arrayBuffer, header.texCoordsOffset);

        for (let i: number = 0; i < header.numberOfTexCoords; i++) {
            texCoords.push(new MD2TexCoord(stream, header));
        }

        return texCoords;
    }

    private static getTriangles(arrayBuffer: ArrayBuffer, header: MD2Header): Array<MD2Triangle> {
        const triangles: Array<MD2Triangle> = new Array<MD2Triangle>();
        const stream: StreamReader = new StreamReader(arrayBuffer, header.triangleOffset);

        for (let i: number = 0; i < header.numberOfTriangles; i++) {
            triangles.push(new MD2Triangle(stream));
        }

        return triangles;
    }

    private static getFrames(arrayBuffer: ArrayBuffer, header: MD2Header): Array<MD2Frame> {
        const frames: Array<MD2Frame> = new Array<MD2Frame>();

        for (let i: number = 0; i < header.numberOfFrames; i++) {
            const frame: MD2Frame = new MD2Frame(arrayBuffer, header.framesOffset + header.frameSize * i, header);
            frames.push(frame);
        }

        return frames;
    }

    private constructor() {

    }

}
