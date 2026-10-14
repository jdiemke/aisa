import { Face } from '@engine/model/formats/blender/face';
import { TexCoord } from '@engine/model/formats/blender/tex-coord';
import { Vector } from '@engine/model/formats/blender/vector';

export class Mesh {

    public name: string;
    public vertices: Array<Vector>;
    public normals: Array<Vector>;
    public uv: Array<TexCoord>;
    public faces: Array<Face>;
    public mtllib?: string;

}
