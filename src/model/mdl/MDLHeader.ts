import { Vector3f } from '../../math/index';
import { InvalidFileFormatException } from './../md2/InvalidFileFormatException';
import { StreamReader } from './../md2/StreamReader';

export class MDLHeader {

    private static readonly IDPO: number = 1330660425;
    private static readonly VERSION: number = 6;

    public ident: number;
    public version: number;

    public scale: Vector3f;
    public translate: Vector3f;

    public boundingRadius: number;

    public eyePosition: Vector3f;
    public numberOfSkins: number;
    public skinWidth: number;
    public skinHeight: number;
    public numberOfVertices: number;
    public numberOfTriangles: number;
    public numberOfFrames: number;

    public syncType: number;
    public flags: number;
    public size: number;

    public constructor(arrayBuffer: ArrayBuffer) {

        if (!this.isValidMD2File(arrayBuffer)) {
            throw new InvalidFileFormatException('Not a valid MD2 file.');
        }

        const stream: StreamReader = new StreamReader(arrayBuffer);

        this.ident = stream.readInt();
        this.version = stream.readInt();

        this.scale = new Vector3f(
            stream.readFloat(),
            stream.readFloat(),
            stream.readFloat()
        );

        this.translate = new Vector3f(
            stream.readFloat(),
            stream.readFloat(),
            stream.readFloat()
        );

        this.boundingRadius = stream.readFloat();

        this.eyePosition = new Vector3f(
            stream.readFloat(),
            stream.readFloat(),
            stream.readFloat()
        );

        this.numberOfSkins = stream.readInt();
        this.skinWidth = stream.readInt();
        this.skinHeight = stream.readInt();
        this.numberOfVertices = stream.readInt();
        this.numberOfTriangles = stream.readInt();
        this.numberOfFrames = stream.readInt();
        this.syncType = stream.readInt();
        this.flags = stream.readInt();
        this.size = stream.readFloat();

        console.log(this.toString());
    }

    public toString(): string {
        return JSON.stringify(this, null, 2);
    }

    private isValidMD2File(arrayBuffer: ArrayBuffer): boolean {
        const dataView: DataView = new DataView(arrayBuffer, 0);

        const magicNumber: number = dataView.getInt32(0, true);
        const version: number = dataView.getInt32(4, true);

        return magicNumber === MDLHeader.IDPO && version === MDLHeader.VERSION;
    }

}
