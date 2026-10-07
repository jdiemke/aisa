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
/// <reference types="node" />
import { readFile, writeFile } from 'node:fs/promises';
import type { Mesh } from '../src/model/blender/mesh';
import { convertToMeshArray } from '../src/model/blender/parseUtils';

const args: Array<string> = process.argv.slice(2);

async function main(): Promise<void> {
    if (args.length <= 0) {
        console.error('Missing input file.');
        console.error('Syntax: obj2json <path to wavefront obj file>');
        return;
    }

    const fileName: string = args[0];

    try {
        const data: string = await readFile(fileName, 'utf8');
        const json: Array<Mesh> = convertToMeshArray(data);
        console.log(json);

        const outputName: string = fileName.substring(0, fileName.lastIndexOf('.')) + '.json';
        await writeFile(outputName, JSON.stringify(json, null, 2));
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

void main();

