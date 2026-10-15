import { Face, TexCoord, Vector } from '@engine/model/formats/blender';

export class Mesh {

    public name: string;
    public vertices: Array<Vector>;
    public normals: Array<Vector>;
    public uv: Array<TexCoord>;
    public faces: Array<Face>;
    public mtllib?: string;

}
