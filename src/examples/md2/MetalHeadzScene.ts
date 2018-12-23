import { Framebuffer } from '../../Framebuffer';
import { AbstractScene } from '../../scenes/AbstractScene';

/**
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 */
export class MetalHeadzScene extends AbstractScene {

    public init(framebuffer: Framebuffer): Promise<any> {
        fetch(require('../../assets/md2/ogro.md2')).then((response: Response) => {
            return response.arrayBuffer();
        }).then((arrayBuffer: ArrayBuffer) => {
            this.loadMd2(arrayBuffer);
        });
        return Promise.all([]);
    }

    public render(framebuffer: Framebuffer): void {
        framebuffer.clear();
     }

    private loadMd2(arrayBuffer: ArrayBuffer): void {

        const stream: StreamReader = new StreamReader(arrayBuffer);

        const header: Md2Header = { };
        header.ident = stream.readInt();
        header.version = stream.readInt();
        header.skinWidth = stream.readInt();
        header.skinHeight = stream.readInt();
        header.frameSize = stream.readInt();
        header.numSkins = stream.readInt();

        header.numVertices = stream.readInt();
        header.numSt = stream.readInt();
        header.numTris = stream.readInt();
        header.numglCommands = stream.readInt();
        header.numFrames = stream.readInt();

        header.offsetSkins = stream.readInt();
        header.offsetSt = stream.readInt();
        header.offsetTris = stream.readInt();
        header.offsetFrames = stream.readInt();
        header.offsetglcms = stream.readInt();
        header.offsetEnd = stream.readInt();

        console.log(JSON.stringify(header, null, 2));
    }

}

// tslint:disable-next-line:max-classes-per-file
class StreamReader {

    private position: number;
    private dataView: DataView;

    constructor(arrayBuffer: ArrayBuffer) {
        this.dataView = new DataView(arrayBuffer, 0);
        this.position = 0;
    }

    public readInt(): number {
        const value: number = this.dataView.getInt32(this.position, true);
        this.position += 4;
        return value;
    }

}

interface Md2Header {
    ident?: number;
    version?: number;

    skinWidth?: number;
    skinHeight?: number;

    frameSize?: number;

    numSkins?: number;
    numVertices?: number;
    numSt?: number;
    numTris?: number;
    numglCommands?: number;
    numFrames?: number;

    offsetSkins?: number;
    offsetSt?: number;
    offsetTris?: number;
    offsetFrames?: number;
    offsetglcms?: number;
    offsetEnd?: number;
}
