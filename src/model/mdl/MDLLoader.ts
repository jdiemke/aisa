import { StreamReader } from '../md2/StreamReader';
import { MDLHeader } from './MDLHeader';
import { MDLModel } from './MDLModel';
import { MDLSkin } from './MDLSkin';
import { MDLTexCoord } from './MDLTexCoord';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://www.gamers.org/dEngine/quake/spec/quake-spec34/qkspec_5.htm
 * http://www.gamers.org/dEngine/quake/spec/quake-spec32.html#CMDLF
 */
export class MDLLoader {

    public static load(filename: string): Promise<MDLModel> {
        return fetch(filename).then((response: Response) => {
            return response.arrayBuffer();
        }).then((arrayBuffer: ArrayBuffer) => {
            try {
                return MDLLoader.parse(arrayBuffer);
            } catch (ex) {
                console.error(ex.message);
            }
        });
    }

    private static parse(arrayBuffer: ArrayBuffer): MDLModel {
        const stream: StreamReader = new StreamReader(arrayBuffer);
        const header: MDLHeader = MDLLoader.getHeader(arrayBuffer, stream);

        console.log('num skins: ' + header.numberOfSkins);

        const skins: Array<MDLSkin> = new Array<MDLSkin>();
        for (let i: number = 0; i < header.numberOfSkins; i++) {
            skins.push(new MDLSkin(stream, header));
        }
        console.log(skins);
        const coords: Array<MDLTexCoord> = new Array<MDLTexCoord>();
        for (let i: number = 0; i < header.numberOfVertices; i++) {
            coords.push(new MDLTexCoord(stream));
        }

        console.log(coords);
        /*
      fread (mdl->texcoords, sizeof (struct mdl_texcoord_t),
      mdl->header.num_verts, fp);
    fread (mdl->triangles, sizeof (struct mdl_triangle_t),
      mdl->header.num_tris, fp);
      */

        return new MDLModel();
    }

    private static getHeader(arrayBuffer: ArrayBuffer, stream: StreamReader): MDLHeader {
        return new MDLHeader(arrayBuffer, stream);
    }

    private constructor() {

    }

}
