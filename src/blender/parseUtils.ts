import { Mesh } from './mesh';
import { Vector } from './vector';
import { TexCoord } from './tex-coord';
import { Face } from './face';

export function convertToMeshArray(data: string): Array<Mesh> {
    const json: Array<Mesh> = new Array<Mesh>();

    let currentObject: Mesh = null;
    let currentMaterial: string | undefined = undefined;

    let normalCount: number = 0;
    let vertexCount: number = 0;
    let uvCount: number = 0;
    let normalOffset: number = 0;
    let vertexOffset: number = 0;
    let uvOffset: number = 0;

    data.toString().split('\n').forEach((line: string) => {

        if (line.startsWith('o ')) {
            const coords: Array<string> = line.split(' ');

            currentObject = new Mesh();
            currentObject.name = coords[1];
            currentObject.normals = [];
            currentObject.vertices = [];
            currentObject.faces = [];
            currentObject.uv = []; // OPTIONAL

            json.push(currentObject);
            normalOffset = normalCount;
            vertexOffset = vertexCount;
            uvOffset = uvCount;
        }

        if (line.startsWith('usemtl ')) {
            currentMaterial = line.substring(7).trim();
        }

        if (currentObject === null &&
            (line.startsWith('v ') ||
                line.startsWith('vn ') ||
                line.startsWith('vt '))) {
            console.error('Error: OBJ file does not contain Objects.');
            throw Error();
        }

        if (line.startsWith('v ')) {
            const coords: Array<string> = line.split(' ');

            const vertex: Vector = new Vector(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2]),
                Number.parseFloat(coords[3])
            );

            currentObject.vertices.push(vertex);
            vertexCount++;
        }

        if (line.startsWith('vn ')) {
            const coords: Array<string> = line.split(' ');

            const normal: Vector = new Vector(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2]),
                Number.parseFloat(coords[3])
            );

            currentObject.normals.push(normal);
            normalCount++;
        }

        if (line.startsWith('vt ')) { // OPTIONAL
            const coords: Array<string> = line.split(' ');

            const uv: TexCoord = new TexCoord(
                Number.parseFloat(coords[1]),
                Number.parseFloat(coords[2])
            );

            currentObject.uv.push(uv);
            uvCount++;
        }

        if (line.startsWith('f ')) {
            const coords: Array<string> = line.split(' ');
            const vertexTokenCount: number = coords.length - 1; // exclude the 'f' token

            const face: Face = new Face();
            face.vertices = [];
            face.normals = [];
            face.uv = [];
            face.materialName = currentMaterial;

            // vertex indices
            face.vertices.push(Number(coords[1].split('/')[0]) - 1 - vertexOffset);
            face.vertices.push(Number(coords[2].split('/')[0]) - 1 - vertexOffset);
            face.vertices.push(Number(coords[3].split('/')[0]) - 1 - vertexOffset);

            // uv indices OPTIONAL!
            face.uv.push(Number(coords[1].split('/')[1]) - 1 - uvOffset);
            face.uv.push(Number(coords[2].split('/')[1]) - 1 - uvOffset);
            face.uv.push(Number(coords[3].split('/')[1]) - 1 - uvOffset);

            // normal indices
            face.normals.push(Number(coords[1].split('/')[2]) - 1 - normalOffset);
            face.normals.push(Number(coords[2].split('/')[2]) - 1 - normalOffset);
            face.normals.push(Number(coords[3].split('/')[2]) - 1 - normalOffset);

            currentObject.faces.push(face);

            // Triangulate quads (and higher-order polygons) using fan triangulation
            for (let qi: number = 4; qi <= vertexTokenCount; qi++) {
                const extraFace: Face = new Face();
                extraFace.vertices = [];
                extraFace.normals = [];
                extraFace.uv = [];
                extraFace.materialName = currentMaterial;

                // Fan triangle: vertex 1, vertex (qi-1), vertex qi
                extraFace.vertices.push(Number(coords[1].split('/')[0]) - 1 - vertexOffset);
                extraFace.vertices.push(Number(coords[qi - 1].split('/')[0]) - 1 - vertexOffset);
                extraFace.vertices.push(Number(coords[qi].split('/')[0]) - 1 - vertexOffset);

                extraFace.uv.push(Number(coords[1].split('/')[1]) - 1 - uvOffset);
                extraFace.uv.push(Number(coords[qi - 1].split('/')[1]) - 1 - uvOffset);
                extraFace.uv.push(Number(coords[qi].split('/')[1]) - 1 - uvOffset);

                extraFace.normals.push(Number(coords[1].split('/')[2]) - 1 - normalOffset);
                extraFace.normals.push(Number(coords[qi - 1].split('/')[2]) - 1 - normalOffset);
                extraFace.normals.push(Number(coords[qi].split('/')[2]) - 1 - normalOffset);

                currentObject.faces.push(extraFace);
            }
        }
    });

    return json;
}
