import { InvalidFileFormatException } from './InvalidFileFormatException';
import { StreamReader } from './StreamReader';

export class MD2Header {

    private static readonly IDP2: number = 844121161;
    private static readonly VERSION: number = 8;

    public identifier: number;
    public version: number;

    public skinWidth: number;
    public skinHeight: number;

    // framesize in bytes
    public frameSize: number;

    public numberOfSkins: number;
    public numberOfVertices: number;
    public numberOfTexCoords: number;
    public numberOfTriangles: number;
    public numberOfGlCommands: number;
    public numberOfFrames: number;

    public skinsOffset: number;
    public texCoordsOffset: number;
    public triangleOffset: number;
    public framesOffset: number;
    public glCommandsOffset: number;
    public endOffset: number;

    public constructor(arrayBuffer: ArrayBuffer) {

        if (!this.isValidMD2File(arrayBuffer)) {
            throw new InvalidFileFormatException('Not a valid MD2 file.');
        }

        const stream: StreamReader = new StreamReader(arrayBuffer);

        this.identifier = stream.readInt();
        this.version = stream.readInt();
        this.skinWidth = stream.readInt();
        this.skinHeight = stream.readInt();
        this.frameSize = stream.readInt();
        this.numberOfSkins = stream.readInt();

        this.numberOfVertices = stream.readInt();
        this.numberOfTexCoords = stream.readInt();
        this.numberOfTriangles = stream.readInt();
        this.numberOfGlCommands = stream.readInt();
        this.numberOfFrames = stream.readInt();

        this.skinsOffset = stream.readInt();
        this.texCoordsOffset = stream.readInt();
        this.triangleOffset = stream.readInt();
        this.framesOffset = stream.readInt();
        this.glCommandsOffset = stream.readInt();
        this.endOffset = stream.readInt();
    }

    public toString(): string {
        return JSON.stringify(this, null, 2);
    }

    private isValidMD2File(arrayBuffer: ArrayBuffer): boolean {
        const dataView: DataView = new DataView(arrayBuffer, 0);

        const magicNumber: number = dataView.getInt32(0, true);
        const version: number = dataView.getInt32(4, true);
        console.log(magicNumber);
        console.log(version);

        return magicNumber === MD2Header.IDP2 && version === MD2Header.VERSION;
    }

}
