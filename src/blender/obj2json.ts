/**
 * Convert Wavefront OBJ to JSON format
 *
 * TODO:
 *  - implement multiple JSON types
 *  - with normals / with texture coords ...
 *  - move types into modules
 *
 * @author Johannes Diemke
 * @since 2017-04-09
 */
import * as fs from 'fs';
import { Mesh } from './mesh';
import { convertToMeshArray } from './parseUtils';

const args: Array<string> = process.argv.slice(2);

if (args.length <= 0) {
    console.error('Missing input file.');
    console.error('Syntax: obj2json <path to wavefront obj file>');
    process.exit(0);
}

const fileName: string = args[0];

fs.readFile(fileName, 'utf8', (err: NodeJS.ErrnoException, data: string) => {

    if (err) {
        throw err;
    }

    let json: Array<Mesh>;

    try {
        json = convertToMeshArray(data);
        console.log(json);
    } catch (error) {
        console.error(error);
        process.exit(0);
    }

    const outputName: string = fileName.substring(0, fileName.lastIndexOf('.')) + '.json';
    fs.writeFile(outputName, JSON.stringify(json, null, 2), (error: NodeJS.ErrnoException) => {
        if (error) {
            console.log(error);
        }
    });

});

