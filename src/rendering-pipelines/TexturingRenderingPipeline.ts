import { Framebuffer } from '../Framebuffer';
import { Vector3f, Vector4f } from '../math';
import { Matrix4f } from '../math/Matrix4f';
import { Vertex } from '../Vertex';
import { TexturedMesh } from './TexturedMesh';

export class TexturingRenderingPipeline {

    constructor(private framebuffer: Framebuffer) { }

    public draw(mesh: TexturedMesh, modelViewMartrix: Matrix4f): void {

        // let normalMatrix = modelViewMartrix.computeNormalMatrix();

        // for (let i = 0; i < obj.normals.length; i++) {
        //     normalMatrix.multiplyHomArr(obj.normals[i], obj.normals2[i]);
        // }

        for (let i: number = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.points2[i]);
        }

        const vertexArray: Array<Vertex> = new Array<Vertex>(new Vertex(), new Vertex(), new Vertex());

        for (let i: number = 0; i < mesh.faces.length; i++) {
            const v1: Vector4f = mesh.points2[mesh.faces[i].vertices[0]];
            const v2: Vector4f = mesh.points2[mesh.faces[i].vertices[1]];
            const v3: Vector4f = mesh.points2[mesh.faces[i].vertices[2]];

            if (this.framebuffer.isInFrontOfNearPlane(v1) &&
                this.framebuffer.isInFrontOfNearPlane(v2) &&
                this.framebuffer.isInFrontOfNearPlane(v3)) {

                const p1: Vector4f = this.project(v1);
                const p2: Vector4f = this.project(v2);
                const p3: Vector4f = this.project(v3);

                if (this.framebuffer.isTriangleCCW(p1, p2, p3)) {
                    vertexArray[0].position = p1; // p1 is Vector3f
                    vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];

                    vertexArray[1].position = p2;
                    vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];

                    vertexArray[2].position = p3;
                    vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];

                    this.framebuffer.clipConvexPolygon2(vertexArray);
                }
            } else if (!this.framebuffer.isInFrontOfNearPlane(v1) &&
                !this.framebuffer.isInFrontOfNearPlane(v2) &&
                !this.framebuffer.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                vertexArray[0].position = v1; // v1 is Vector4f
                vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];

                vertexArray[1].position = v2;
                vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];

                vertexArray[2].position = v3;
                vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];

                this.zClipTriangle2(vertexArray);
            }
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector4f {
        return new Vector4f(Math.round((320 / 2) + (292 * t1.x / (-t1.z))),
            Math.round((200 / 2) - (t1.y * 292 / (-t1.z))),
            t1.z);
    }

    public zClipTriangle2(subject: Array<Vertex>): void {

        let output = subject;

        let input = output;
        output = new Array<Vertex>();
        let S = input[input.length - 1];

        for (let i = 0; i < input.length; i++) {
            let point = input[i];
            if (this.framebuffer.isInFrontOfNearPlane(point.position)) {
                if (!this.framebuffer.isInFrontOfNearPlane(S.position)) {
                    output.push(this.framebuffer.computeNearPlaneIntersection2(S, point));
                }
                output.push(point);
            } else if (this.framebuffer.isInFrontOfNearPlane(S.position)) {
                output.push(this.framebuffer.computeNearPlaneIntersection2(S, point));
            }
            S = point;
        }

        if (output.length < 3) {
            return;
        }

        let projected: Vertex[] = output.map<Vertex>((v) => {
            v.position = this.project(v.position);
            return v;
        })

        if (output.length === 3 && !this.framebuffer.isTriangleCCW(projected[0].position, projected[1].position, projected[2].position)) {
            return;
        }

        if (output.length === 4 && !this.framebuffer.isTriangleCCW2(projected[0].position, projected[1].position, projected[2].position, projected[3].position)) {
            return;
        }

        this.framebuffer.clipConvexPolygon2(projected);
    }

}
