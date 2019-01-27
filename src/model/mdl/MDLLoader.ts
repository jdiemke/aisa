import { MDLHeader } from './MDLHeader';
import { MDLModel } from './MDLModel';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
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
        const header: MDLHeader = MDLLoader.getHeader(arrayBuffer);

        return new MDLModel();
    }

    private static getHeader(arrayBuffer: ArrayBuffer): MDLHeader {
        return new MDLHeader(arrayBuffer);
    }

    private constructor() {

    }

}
