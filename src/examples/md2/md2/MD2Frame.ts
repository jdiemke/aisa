import { Vector3f } from '../../../math/index';
import { MD2Header } from './MD2Header';
import { MD2Vertex } from './MD2Vertex';
import { StreamReader } from './StreamReader';

export class MD2Frame {

    public scale: Vector3f;
    public translate: Vector3f;
    public vertices: Array<MD2Vertex>;

    constructor(arrayBuffer: ArrayBuffer, offset: number = 0, header: MD2Header) {
        const stream: StreamReader = new StreamReader(arrayBuffer, offset);
        const scale: Vector3f = new Vector3f(
            stream.readFloat(),
            stream.readFloat(),
            stream.readFloat()
        );
        this.scale = scale;

        const trans: Vector3f = new Vector3f(
            stream.readFloat(),
            stream.readFloat(),
            stream.readFloat()
        );
        this.translate = trans;

        const streamvert: StreamReader = new StreamReader(arrayBuffer, offset + 40);

        const vertArray: Array<MD2Vertex> = new Array<MD2Vertex>();

        for (let i: number = 0; i < header.numberOfVertices; i++) {
            const px: number = streamvert.readUnsignedInt8();
            const py: number = streamvert.readUnsignedInt8();
            const pz: number = streamvert.readUnsignedInt8();
            const nomralIndex: number = streamvert.readUnsignedInt8();

            vertArray.push(new MD2Vertex(
                new Vector3f(
                    px * scale.x + trans.x,
                    py * scale.y + trans.y,
                    pz * scale.z + trans.z
                ),
                nomralIndex
            ));
        }
        this.vertices = vertArray;

    }

}
