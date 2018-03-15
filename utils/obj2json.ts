/**
 * Convert Wavefront OBJ to JSON format
 *
 * @author Johannes Diemke
 * @since 2017-04-09
 */
import * as fs from 'fs';

class Vector {

    private x: number;
    private y: number;
    private z: number;

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

const args: Array<string> = process.argv.slice(2);

if (args.length > 0) {
    const fileName: string = args[0];

    fs.readFile(fileName, 'utf8', (err: NodeJS.ErrnoException, data: string) => {

        if (err) {
            throw err;
        }

        let json = [];

        let currentObject = null;

        let normalCount: number = 0;
        let vertexCount: number = 0;
        let normalOffset: number = 0;
        let vertexOffset: number = 0;

        data.toString().split('\n').forEach((line: string) => {

            if (line.startsWith('o ')) {
                let coords = line.split(' ');

                currentObject = {
                    name: coords[1],
                    vertices: [],
                    normals: [],
                    faces: []
                };
                json.push(currentObject);
                normalOffset = normalCount;
                vertexOffset = vertexCount;
            }

            if (line.startsWith('v ')) {
                const coords: Array<string> = line.split(' ');
                const vertex: Vector = new Vector(Number(coords[1]), Number(coords[2]), Number(coords[3]));
                currentObject.vertices.push(vertex);
                vertexCount++;
            }

            if (line.startsWith('vn ')) {
                const coords: Array<string> = line.split(' ');

                let normal = {
                    x: Number(coords[1]),
                    y: Number(coords[2]),
                    z: Number(coords[3]),
                };

                currentObject.normals.push(normal);
                normalCount++;
            }

            if (line.startsWith('f ')) {
                const coords: Array<string> = line.split(' ');

                let face = {
                    vertices: [],
                    normals: []
                };

                // vertex indices
                face.vertices.push(Number(coords[1].split('/')[0]) - 1 - vertexOffset);
                face.vertices.push(Number(coords[2].split('/')[0]) - 1 - vertexOffset);
                face.vertices.push(Number(coords[3].split('/')[0]) - 1 - vertexOffset);

                // normal indices
                face.normals.push(Number(coords[1].split('/')[2]) - 1 - normalOffset);
                face.normals.push(Number(coords[2].split('/')[2]) - 1 - normalOffset);
                face.normals.push(Number(coords[3].split('/')[2]) - 1 - normalOffset);

                currentObject.faces.push(face);
            }
        });

        console.log(json);

        const outputName: string = fileName.substring(0, fileName.lastIndexOf('.')) + '.json';
        fs.writeFile(outputName, JSON.stringify(json, null, 2), (err: NodeJS.ErrnoException) => {
            if (err) {
                console.log(err);
            }
        });

    });
}
