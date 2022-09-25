import { Vector4f } from '../../math/index';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { TextureCoordinate } from '../../TextureCoordinate';
import { MD2Animation } from './MD2AnimationNames';
import { MD2Frame } from './MD2Frame';
import { MD2Header } from './MD2Header';
import { MD2TexCoord } from './MD2TexCoord';
import { MD2Triangle } from './MD2Triangle';
import { MD2Vertex } from './MD2Vertex';

export class MD2Model {

    private mesh: TexturedMesh;
    private points: Array<Vector4f>;
    private animation: MD2Animation = MD2Animation.STAND;
    private currentFrame: number = 0;
    private loop: boolean = false;

    constructor(public textureCoordinates: Array<MD2TexCoord>,
        public triangles: Array<MD2Triangle>,
        public frames: Array<MD2Frame>, public header: MD2Header) {

        const mesh: TexturedMesh = new TexturedMesh();

        const texCoords2: Array<TextureCoordinate> = new Array<TextureCoordinate>();
        this.textureCoordinates.forEach((textureCoordinate: MD2TexCoord) => {
            texCoords2.push(new TextureCoordinate(textureCoordinate.s, textureCoordinate.t));
        });

        const points: Array<Vector4f> = new Array<Vector4f>();

        for (let i: number = 0; i < header.numberOfVertices; i++) {
            points.push(new Vector4f(0, 0, 0, 1));
        }

        this.points = points;

        mesh.points = points;
        mesh.points2 = points.map(() => new Vector4f(0, 0, 0, 0));
        mesh.uv = texCoords2;
        const faces: Array<{
            vertices: Array<number>,
            uv: Array<number>
        }> = [];

        this.triangles.forEach((triangle: MD2Triangle) => {

            faces.push({
                uv: triangle.texCoords,
                vertices: triangle.vertices
            });
        });

        mesh.faces = faces;
        this.mesh = mesh;

    }

    public getMesh(time: number): TexturedMesh {

        time = time *.006;
        const f1: number = Math.floor(time) % this.frames.length;
        const f2: number = (f1 + 1) % this.frames.length;
        const cframe: MD2Frame = this.frames[f1];
        const cframe2: MD2Frame = this.frames[f2];
        const alpha: number = time - Math.floor(time);
        const oneMinusAlpha: number = 1 - alpha;

        for (let i: number = 0; i < cframe.vertices.length; i++) {
            const x: MD2Vertex = cframe.vertices[i];
            const x2: MD2Vertex = cframe2.vertices[i];
            this.points[i].x = x.vector.x * oneMinusAlpha + x2.vector.x * alpha;
            this.points[i].y = x.vector.y * oneMinusAlpha + x2.vector.y * alpha;
            this.points[i].z = x.vector.z * oneMinusAlpha + x2.vector.z * alpha;
        }

        return this.mesh;
    }

    public setAnim(animation: MD2Animation, time: number, loop: boolean = false): void {
        this.animation = animation;
        this.currentFrame = 0;
        this.loop = loop;
    }

    public getMesh2(delta: number): TexturedMesh {
        this.currentFrame += delta * 0.009;

        if (this.currentFrame > (this.animation.last - this.animation.first)) {
            if (!this.loop) {
                this.currentFrame = this.animation.last - this.animation.first;
            }
        }

        const modulo: number = (this.animation.last - this.animation.first + 1);
        const f1: number = Math.floor(this.currentFrame) % modulo;
        const f2: number = (f1 + 1) % modulo;
        const cframe: MD2Frame = this.frames[f1 + this.animation.first];
        const cframe2: MD2Frame = this.frames[f2 + this.animation.first];
        const alpha: number = this.currentFrame - Math.floor(this.currentFrame);
        const oneMinusAlpha: number = 1 - alpha;

        /**
         * TODO: add animation blending??? expensive :(
         */
        for (let i: number = 0; i < cframe.vertices.length; i++) {
            const x: MD2Vertex = cframe.vertices[i];
            const x2: MD2Vertex = cframe2.vertices[i];
            this.points[i].x = x.vector.x * oneMinusAlpha + x2.vector.x * alpha;
            this.points[i].y = x.vector.y * oneMinusAlpha + x2.vector.y * alpha;
            this.points[i].z = x.vector.z * oneMinusAlpha + x2.vector.z * alpha;
        }

        return this.mesh;
    }

}
