import { Framebuffer } from '../Framebuffer';
import { Matrix4f } from '../math/Matrix4f';
import { Vector4f } from '../math/Vector4f';
import { AbstractTriangleRasterizer } from '../rasterizer/AbstractTriangleRasterizer';
import { TexturedAlphaBlendingTriangleRasterizer } from '../rasterizer/TexturedAlphaBlendingTriangleRasterizer';
import { TexturedTriangleRasterizer } from '../rasterizer/TexturedTriangleRasterizer';
import { TextureCoordinate } from '../TextureCoordinate';
import { Vertex } from '../Vertex';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';
import { TexturedMesh } from './TexturedMesh';

export class TexturingRenderingPipeline extends AbstractRenderingPipeline {

    public triangleRasterizer: AbstractTriangleRasterizer = null;

    private vertexArray: Array<Vertex> = new Array<Vertex>(
        new Vertex(), new Vertex(), new Vertex()
    );

    private modelViewMatrix: Matrix4f;

    private projectedVertices: Array<Vector4f> = new Array<Vector4f>(
        new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1)
    );

    constructor(framebuffer: Framebuffer) {
        super(framebuffer);
        this.setAlpha(1.0);
        this.triangleRasterizer = new TexturedTriangleRasterizer(framebuffer);
    }

    public setFramebuffer(framebuffer: Framebuffer) {
        this.framebuffer = framebuffer;
    }

    public enableAlphaBlending(): void {
        this.triangleRasterizer = new TexturedAlphaBlendingTriangleRasterizer(this.framebuffer, this);
    }

    public disableAlphaBlending(): void {
        this.triangleRasterizer = new TexturedTriangleRasterizer(this.framebuffer);
    }

    public setModelViewMatrix(matrix: Matrix4f): void {
        this.modelViewMatrix = matrix;
    }

    public drawMeshArray(framebuffer: Framebuffer, meshes: Array<TexturedMesh>): void {
        for (let j: number = 0; j < meshes.length; j++) {
            const model: TexturedMesh = meshes[j];
            this.draw(framebuffer, model);
        }
    }

    public draw(framebuffer: Framebuffer, mesh: TexturedMesh): void {

        for (let i: number = 0; i < mesh.points.length; i++) {
            this.modelViewMatrix.multiplyHomArr(mesh.points[i], mesh.points2[i]);
        }

        for (let i: number = 0; i < mesh.faces.length; i++) {
            const v1: Vector4f = mesh.points2[mesh.faces[i].vertices[0]];
            const v2: Vector4f = mesh.points2[mesh.faces[i].vertices[1]];
            const v3: Vector4f = mesh.points2[mesh.faces[i].vertices[2]];

            if (this.isInFrontOfNearPlane(v1) &&
                this.isInFrontOfNearPlane(v2) &&
                this.isInFrontOfNearPlane(v3)) {

                this.project2(v1, this.projectedVertices[0]);
                this.project2(v2, this.projectedVertices[1]);
                this.project2(v3, this.projectedVertices[2]);

                if (this.isTriangleCCW(
                    this.projectedVertices[0],
                    this.projectedVertices[1],
                    this.projectedVertices[2])) {

                    this.vertexArray[0].position = this.projectedVertices[0]; // p1 is Vector3f
                    this.vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];

                    this.vertexArray[1].position = this.projectedVertices[1];
                    this.vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];

                    this.vertexArray[2].position = this.projectedVertices[2];
                    this.vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];

                    this.clipConvexPolygon2(framebuffer, this.vertexArray);
                }
            } else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                this.vertexArray[0].position = v1; // v1 is Vector4f
                this.vertexArray[0].textureCoordinate = mesh.uv[mesh.faces[i].uv[0]];

                this.vertexArray[1].position = v2;
                this.vertexArray[1].textureCoordinate = mesh.uv[mesh.faces[i].uv[1]];

                this.vertexArray[2].position = v3;
                this.vertexArray[2].textureCoordinate = mesh.uv[mesh.faces[i].uv[2]];

                this.zClipTriangle2(framebuffer, this.vertexArray);
            }
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector4f {
        return new Vector4f(
            Math.round((this.framebuffer.width / 2) + (292 * t1.x / (-t1.z))),
            Math.round((this.framebuffer.height / 2) - (t1.y * 292 / (-t1.z))),
            t1.z
        );
    }

    public project2(t1: { x: number, y: number, z: number }, result: Vector4f): void {
        result.x = Math.round((this.framebuffer.width / 2) + (292 * t1.x / (-t1.z)));
        result.y = Math.round((this.framebuffer.height / 2) - (t1.y * 292 / (-t1.z)));
        result.z = t1.z;
    }

    public computeNearPlaneIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const ratio: number = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        const vertex: Vertex = new Vertex();

        vertex.position = new Vector4f(
            ratio * (p2.position.x - p1.position.x) + p1.position.x,
            ratio * (p2.position.y - p1.position.y) + p1.position.y,
            this.NEAR_PLANE_Z
        );

        vertex.textureCoordinate = new TextureCoordinate(
            ratio * (p2.textureCoordinate.u - p1.textureCoordinate.u) + p1.textureCoordinate.u,
            ratio * (p2.textureCoordinate.v - p1.textureCoordinate.v) + p1.textureCoordinate.v
        );

        return vertex;
    }

    public zClipTriangle2(framebuffer: Framebuffer, subject: Array<Vertex>): void {
        const input: Array<Vertex> = subject;
        const output: Array<Vertex> = new Array<Vertex>();
        let S: Vertex = input[input.length - 1];

        for (let i: number = 0; i < input.length; i++) {
            const point: Vertex = input[i];
            if (this.isInFrontOfNearPlane(point.position)) {
                if (!this.isInFrontOfNearPlane(S.position)) {
                    output.push(this.computeNearPlaneIntersection2(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S.position)) {
                output.push(this.computeNearPlaneIntersection2(S, point));
            }
            S = point;
        }

        if (output.length < 3) {
            return;
        }

        // TODO: remove temp object here
        const projected: Array<Vertex> = output.map<Vertex>((v: Vertex) => {
            v.position = this.project(v.position);
            return v;
        });

        if (output.length === 3 &&
            !this.isTriangleCCW(projected[0].position, projected[1].position, projected[2].position)) {
            return;
        }

        if (output.length === 4 &&
            !this.isTriangleCCW2(
                projected[0].position,
                projected[1].position,
                projected[2].position,
                projected[3].position
            )) {
            return;
        }

        this.clipConvexPolygon2(framebuffer, projected);
    }


    public clipConvexPolygon2(framebuffer: Framebuffer, subject: Array<Vertex>): void {

        let output = subject;

        for (let j = 0; j < framebuffer.clipRegion.length; j++) {
            const edge = framebuffer.clipRegion[j];
            const input = output;
            output = new Array<Vertex>();
            let S = input[input.length - 1];

            for (let i = 0; i < input.length; i++) {
                const point = input[i];
                if (edge.isInside2(point)) {
                    if (!edge.isInside2(S)) {
                        output.push(edge.computeIntersection2(S, point));
                    }
                    output.push(point);
                } else if (edge.isInside2(S)) {
                    output.push(edge.computeIntersection2(S, point));
                }
                S = point;
            }
        };

        if (output.length < 3) {
            return;
        }

        // triangulate new point set
        for (let i = 0; i < output.length - 2; i++) {
            this.triangleRasterizer.drawTriangleDDA(framebuffer, output[0], output[1 + i], output[2 + i]);
        }
    }

}
