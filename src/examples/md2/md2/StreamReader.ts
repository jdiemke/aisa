export class StreamReader {

    private position: number;
    private dataView: DataView;

    constructor(arrayBuffer: ArrayBuffer, offset: number = 0) {
        this.dataView = new DataView(arrayBuffer, offset);
        this.position = 0;
    }

    public readInt(): number {
        const value: number = this.dataView.getInt32(this.position, true);
        this.position += 4;
        return value;
    }

    public readUnsignedInt8(): number {
        const value: number = this.dataView.getUint8(this.position);
        this.position += 1;
        return value;
    }

    public readSignedShort(): number {
        const value: number = this.dataView.getInt16(this.position, true);
        this.position += 2;
        return value;
    }

}
