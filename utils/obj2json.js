/**
 * Convert Wavefront OBJ to JSON format
 * 
 * @author Johannes Diemke
 * @since 2017-04-09
 */
let fs = require('fs');

let args = process.argv.slice(2);

if (args.length > 0) {
    let fileName = args[0];

    fs.readFile(fileName, 'utf8', function (err, data) {

        if (err) {
            throw err;
        }

        let json = [];

        let currentObject = null;

        let normalCount = 0;
        let vertexCount = 0;
        let normalOffset = 0;
        let vertexOffset = 0;

        data.toString().split('\n').forEach(line => {

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
                let coords = line.split(' ');

                let vertex = {
                    x: Number(coords[1]),
                    y: Number(coords[2]),
                    z: Number(coords[3]),
                }

                currentObject.vertices.push(vertex);
                vertexCount++;
            }

            if (line.startsWith('vn ')) {
                let coords = line.split(' ');

                let normal = {
                    x: Number(coords[1]),
                    y: Number(coords[2]),
                    z: Number(coords[3]),
                }

                currentObject.normals.push(normal);
                normalCount++;
            }

            if (line.startsWith('f ')) {
                let coords = line.split(' ');
                let face = {
                    vertices: [],
                    normals: []
                }

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

        //console.log("vertices: " + json.vertices.length);
        //console.log("normals: " + json.normals.length);
        //console.log("faces: " + json.faces.length / 6);

        console.log(json);

        let outputName = fileName.substring(0, fileName.lastIndexOf('.')) + '.json';
        fs.writeFile(outputName, JSON.stringify(json, null, 2), function (err) {
            if (err) {
                return console.log(err);
            }
        });

    });
}