import { Framebuffer } from '@engine/rendering/Framebuffer';
import { FlatshadedMesh } from '@engine/geometry/objects';
import { Vector4f, Matrix4f } from '@engine/math';
import { FlatShadingTriangleRasterizer } from '@engine/rendering/rasterizer';
import { Vertex } from '@engine/geometry/primitives';
import { LitRenderingPipeline } from '@engine/rendering/pipelines/LitRenderingPipeline';
import { projectToScreen } from '@engine/rendering/Projection';

export class FlatShadingRenderingPipeline extends LitRenderingPipeline {

    public constructor(framebuffer: Framebuffer) {
        super(framebuffer, new FlatShadingTriangleRasterizer(framebuffer));
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

                projectToScreen(this.framebuffer, v1, this.projectedVertices[0], true);
                projectToScreen(this.framebuffer, v2, this.projectedVertices[1], true);
                projectToScreen(this.framebuffer, v3, this.projectedVertices[2], true);

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
                    output[j].projection = new Vector4f(0, 0, 0);
                    projectToScreen(this.framebuffer, output[j].position, output[j].projection, true);
                }

                this.renderConvexPolygon(framebuffer, output, false);
            }
        }
    }

}
