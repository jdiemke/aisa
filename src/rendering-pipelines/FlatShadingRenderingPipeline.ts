import { Framebuffer } from '../Framebuffer';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { FlatShadingTriangleRasterizer } from '../rasterizer/FlatShadingTriangleRasterizer';
import { Vertex } from '../Vertex';
import { LitRenderingPipeline } from './LitRenderingPipeline';

export class FlatShadingRenderingPipeline extends LitRenderingPipeline {

    public constructor(framebuffer: Framebuffer) {
        super(framebuffer, new FlatShadingTriangleRasterizer(framebuffer));
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

    public draw(framebuffer: Framebuffer, mesh: FlatshadedMesh, modelViewMartrix: Matrix4f): void {

        const normalMatrix: Matrix4f = modelViewMartrix.computeNormalMatrix();

        for (let i: number = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }

        for (let i: number = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        for (let i: number = 0; i < mesh.faces.length; i++) {
            const v1: Vector4f = mesh.transformedPoints[mesh.faces[i].v1];
            const v2: Vector4f = mesh.transformedPoints[mesh.faces[i].v2];
            const v3: Vector4f = mesh.transformedPoints[mesh.faces[i].v3];

            const normal1: Vector4f = mesh.transformedNormals[mesh.faces[i].n1];
            const normal2: Vector4f = mesh.transformedNormals[mesh.faces[i].n2];
            const normal3: Vector4f = mesh.transformedNormals[mesh.faces[i].n3];

            if (this.isInFrontOfNearPlane(v1) &&
                this.isInFrontOfNearPlane(v2) &&
                this.isInFrontOfNearPlane(v3)) {

                this.project2(v1, this.projectedVertices[0]);
                this.project2(v2, this.projectedVertices[1]);
                this.project2(v3, this.projectedVertices[2]);

                this.vertexArray[0].position = v1;
                this.vertexArray[0].projection = this.projectedVertices[0];
                this.vertexArray[0].normal = normal1;

                this.vertexArray[1].position = v2;
                this.vertexArray[1].projection = this.projectedVertices[1];
                this.vertexArray[1].normal = normal2;

                this.vertexArray[2].position = v3;
                this.vertexArray[2].projection = this.projectedVertices[2];
                this.vertexArray[2].normal = normal3;

                this.renderConvexPolygon(framebuffer, this.vertexArray, true);
            } else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                this.vertexArray[0].position = v1;
                this.vertexArray[1].position = v2;
                this.vertexArray[2].position = v3;

                if (this.lighting) {
                    this.vertexArray[0].color = this.computeColor(normal1, v1);
                    this.vertexArray[1].color = this.computeColor(normal2, v2);
                    this.vertexArray[2].color = this.computeColor(normal3, v3);
                } else {
                    this.vertexArray[0].color = this.color;
                    this.vertexArray[1].color = this.color;
                    this.vertexArray[2].color = this.color;
                }

                const output: Array<Vertex> = this.zClipTriangle(this.vertexArray);

                if (output.length < 3) {
                    return;
                }

                for (let j: number = 0; j < output.length; j++) {
                    output[j].projection = this.project(output[j].position);
                }

                this.renderConvexPolygon(framebuffer, output, false);
            }
        }
    }

}
