import { Framebuffer } from '../Framebuffer';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { SubPixelTriangleRasterizer } from '../rasterizer/SubPixelTriangleRasterizer';
import { Vertex } from '../Vertex';
import { LitRenderingPipeline } from './LitRenderingPipeline';

/**
 * TODO:
 * fix backface occlusion / add z-clipping
 */
export class SubPixelRenderingPipeline extends LitRenderingPipeline {

    public constructor(framebuffer: Framebuffer) {
        super(framebuffer, new SubPixelTriangleRasterizer(framebuffer));
    }

    public draw(framebuffer: Framebuffer, mesh: FlatshadedMesh, modelViewMartrix: Matrix4f): void {

        const normalMatrix: Matrix4f = modelViewMartrix.computeNormalMatrix();

        for (let i: number = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }

        for (let i: number = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        // Sort faces back-to-front (painter's algorithm) so that farther faces are
        // drawn first and nearer faces correctly paint over them.
        // In view space z is negative for visible geometry, so ascending sort
        // (most-negative first) gives back-to-front order.
        const faceOrder: Array<number> = Array.from({ length: mesh.faces.length }, (_, k) => k);
        faceOrder.sort((a, b) => {
            const za = mesh.transformedPoints[mesh.faces[a].v1].z
                     + mesh.transformedPoints[mesh.faces[a].v2].z
                     + mesh.transformedPoints[mesh.faces[a].v3].z;
            const zb = mesh.transformedPoints[mesh.faces[b].v1].z
                     + mesh.transformedPoints[mesh.faces[b].v2].z
                     + mesh.transformedPoints[mesh.faces[b].v3].z;
            return za - zb;
        });

        for (let fi: number = 0; fi < faceOrder.length; fi++) {
            this.drawFace(framebuffer, mesh, faceOrder[fi]);
        }
    }

    /**
     * Draws a single face (by index) from a mesh whose vertices and normals
     * have already been transformed into view space.  This allows callers to
     * perform their own global depth-sort across multiple material groups
     * and then draw faces one-by-one, switching material between calls.
     */
    public drawFace(framebuffer: Framebuffer, mesh: FlatshadedMesh, i: number): void {
        const v1: Vector4f = mesh.transformedPoints[mesh.faces[i].v1];
        const v2: Vector4f = mesh.transformedPoints[mesh.faces[i].v2];
        const v3: Vector4f = mesh.transformedPoints[mesh.faces[i].v3];

        const normal1: Vector4f = mesh.transformedNormals[mesh.faces[i].n1];
        const normal2: Vector4f = mesh.transformedNormals[mesh.faces[i].n2];
        const normal3: Vector4f = mesh.transformedNormals[mesh.faces[i].n3];

        const v1Front: boolean = this.isInFrontOfNearPlane(v1);
        const v2Front: boolean = this.isInFrontOfNearPlane(v2);
        const v3Front: boolean = this.isInFrontOfNearPlane(v3);

        if (v1Front && v2Front && v3Front) {
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
        } else if (!v1Front && !v2Front && !v3Front) {
            return;
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
                this.project2(output[j].position, output[j].projection);
            }

            this.renderConvexPolygon(framebuffer, output, false);
        }
    }

}
