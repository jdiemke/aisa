import { Face } from './face';
import { TexCoord } from './tex-coord';
import { Vector } from './vector';

export class Mesh {

    public name: string;
    public vertices: Array<Vector>;
    public normals: Array<Vector>;
    public uv: Array<TexCoord>;
    public faces: Array<Face>;

}
