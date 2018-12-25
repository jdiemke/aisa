import { Vector4f } from '../../../math/index';
import { TexturedMesh } from '../../../rendering-pipelines/TexturedMesh';
import { TextureCoordinate } from '../../../Vertex';
import { MD2Frame } from './MD2Frame';
import { MD2Header } from './MD2Header';
import { MD2Skin } from './MD2Skin';
import { MD2TexCoord } from './MD2TexCoord';
import { MD2Triangle } from './MD2Triangle';
import { MD2Vertex } from './MD2Vertex';
import { StreamReader } from './StreamReader';

export class MD2Loader {

    public static load(filename: string): Promise<TexturedMesh> {
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

    private static parse(arrayBuffer: ArrayBuffer): TexturedMesh {
        // 7load header
        const header: MD2Header = new MD2Header(arrayBuffer);

        // load skins
        const skins: Array<MD2Skin> = new Array<MD2Skin>();

        for (let k: number = 0; k < header.numberOfSkins; k++) {
            const skin: MD2Skin = new MD2Skin(arrayBuffer, header.skinsOffset + 64 * k);
            skins.push(skin);
        }

        // load tex coords
        const texCoords: Array<MD2TexCoord> = new Array<MD2TexCoord>();
        const stream: StreamReader = new StreamReader(arrayBuffer, header.texCoordsOffset);

        for (let i: number = 0; i < header.numberOfTexCoords; i++) {
            texCoords.push(new MD2TexCoord(stream, header));
        }

        // load triangles
        const trianfgles: Array<MD2Triangle> = new Array<MD2Triangle>();
        const stream2: StreamReader = new StreamReader(arrayBuffer, header.triangleOffset);

        for (let i: number = 0; i < header.numberOfTriangles; i++) {
            trianfgles.push(new MD2Triangle(stream2));
        }

        // load frame
        const frames: Array<MD2Frame> = new Array<MD2Frame>();

        for (let i: number = 0; i < header.numberOfFrames; i++) {
            const frame: MD2Frame = new MD2Frame(arrayBuffer, header.framesOffset + header.frameSize * i, header);
            frames.push(frame);
        }
        const mesh: TexturedMesh = new TexturedMesh();
        const cframe: MD2Frame = frames[99];
        const points: Array<Vector4f> = new Array<Vector4f>();
        cframe.vertices.forEach( (x: MD2Vertex) => {
            points.push(new Vector4f(
                x.vector.x * cframe.scale.x + cframe.translate.x,
                x.vector.y * cframe.scale.y + cframe.translate.y,
                x.vector.z * cframe.scale.z + cframe.translate.z,
                1
            ));
        });

        const texCoords2: Array<TextureCoordinate> = new Array<TextureCoordinate>();
        texCoords.forEach((tc: MD2TexCoord) => {
            texCoords2.push(new TextureCoordinate(tc.s, tc.t));
        });
        mesh.points = points;
        mesh.points2 = points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.uv = texCoords2;
        const faces: Array<{
            vertices: Array<number>,
            uv: Array<number>
        }> = new Array();

        trianfgles.forEach((t: MD2Triangle) => {

            faces.push({
                uv: t.texCoords,
                vertices:  t.vertices
            });
        });

        mesh.faces = faces;

        return mesh;
    }

    private constructor() {

    }

}
