import { Color } from '../core/Color';
import { Framebuffer } from '../Framebuffer';
import { FlatshadedMesh, Mesh } from '../geometrical-objects/Mesh';
import { Vector3f, Vector4f } from '../math';
import { Matrix4f } from '../math/Matrix4f';
import { SutherlandHodgman2DClipper } from '../screen-space-clipping/SutherlandHodgman2DClipper';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';

/**
 * TODO:
 * - object with position, rotation, material, color
 * - remove tempp matrix objects: instead store one global MV  matrix and manipulate
 *   it directly without generating temp amtrices every frame
 * - no lighting for culled triangles
 * - only z clip if necessary (no clip, fully visible)
 * Optimization:
 * - no shading / only texture mapping (use function pointers to set correct rasterization function)
 * - use delta step method from black art of 3d programming
 * - generate object only once
 * - dont use temp arrays / instead use always the same array preallocated
 */
export class FlatShadingRenderingPipeline extends AbstractRenderingPipeline {

    public flatShading: boolean = false;

    public draw(mesh: FlatshadedMesh, modelViewMartrix: Matrix4f,
                red: number, green: number, blue: number): void {

        const normalMatrix: Matrix4f = modelViewMartrix.computeNormalMatrix();

        for (let i: number = 0; i < mesh.normals.length; i++) {
            normalMatrix.multiplyHomArr(mesh.normals[i], mesh.transformedNormals[i]);
        }

        for (let i: number = 0; i < mesh.points.length; i++) {
            modelViewMartrix.multiplyHomArr(mesh.points[i], mesh.transformedPoints[i]);
        }

        const lightDirection: Vector4f = new Vector4f(0.5, 0.5, 0.3, 0.0).normalize();

        for (let i: number = 0; i < mesh.faces.length; i++) {
            const v1: Vector4f = mesh.transformedPoints[mesh.faces[i].v1];
            const v2: Vector4f = mesh.transformedPoints[mesh.faces[i].v2];
            const v3: Vector4f = mesh.transformedPoints[mesh.faces[i].v3];

            const normal: Vector4f = mesh.transformedNormals[mesh.faces[i].normal];

            if (this.isInFrontOfNearPlane(v1) && this.isInFrontOfNearPlane(v2) && this.isInFrontOfNearPlane(v3)) {
                const p1: Vector3f = this.framebuffer.project(v1);
                const p2: Vector3f = this.framebuffer.project(v2);
                const p3: Vector3f = this.framebuffer.project(v3);

                if (this.isTriangleCCW(p1, p2, p3)) {
                    const clippedPolygon: Array<Vector3f> =
                        SutherlandHodgman2DClipper.clipConvexPolygon(new Array<Vector3f>(p1, p2, p3));

                    if (clippedPolygon.length < 3) {
                        continue;
                    }

                    const color: number = this.computeColor(normal, lightDirection, red, green, blue);

                    // triangulate new point set
                    for (let j: number = 0; j < clippedPolygon.length - 2; j++) {
                        this.framebuffer.triangleRasterizer.drawTriangleDDA(
                            clippedPolygon[0],
                            clippedPolygon[1 + j],
                            clippedPolygon[2 + j], color
                        );
                    }
                }
            } else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                const output: Array<Vector4f> = this.zClipTriangle(new Array<Vector4f>(v1, v2, v3));

                if (output.length < 3) {
                    return;
                }

                const projected: Array<Vector3f> = output.map<Vector3f>((v: Vector4f) => {
                    return this.framebuffer.project(v);
                });

                if (output.length === 3 &&
                    !this.isTriangleCCW(projected[0], projected[1], projected[2])) {
                    return;
                }

                if (output.length === 4 &&
                    !this.isTriangleCCW2(
                        projected[0],
                        projected[1],
                        projected[2],
                        projected[3])
                ) {
                    return;
                }

                const clippedPolygon: Array<Vector3f> = SutherlandHodgman2DClipper.clipConvexPolygon(projected);

                if (clippedPolygon.length < 3) {
                    return;
                }

                const color: number = this.computeColor(normal, lightDirection, red, green, blue);

                // triangulate new point set
                for (let j: number = 0; j < clippedPolygon.length - 2; j++) {
                    this.framebuffer.triangleRasterizer.drawTriangleDDA(
                        clippedPolygon[0],
                        clippedPolygon[1 + j],
                        clippedPolygon[2 + j],
                        color
                    );
                }
            }
        }
    }

    public computeNearPlaneIntersection(p1: Vector4f, p2: Vector4f): Vector4f {
        const ratio: number = (this.NEAR_PLANE_Z - p1.z) / (p2.z - p1.z);
        return new Vector4f(
            ratio * (p2.x - p1.x) + p1.x,
            ratio * (p2.y - p1.y) + p1.y,
            this.NEAR_PLANE_Z
        );
    }

    public zClipTriangle(subject: Array<Vector4f>): Array<Vector4f> {
        const input: Array<Vector4f> = subject;
        const output: Array<Vector4f> = new Array<Vector4f>();
        let S: Vector4f = input[input.length - 1];

        for (let i: number = 0; i < input.length; i++) {
            const point: Vector4f = input[i];
            if (this.isInFrontOfNearPlane(point)) {
                if (!this.isInFrontOfNearPlane(S)) {
                    output.push(this.computeNearPlaneIntersection(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S)) {
                output.push(this.computeNearPlaneIntersection(S, point));
            }
            S = point;
        }

        return output;
    }

    private computeColor(normal: Vector4f, lightDirection: Vector4f, red: number, green: number, blue: number): number {

        if (this.flatShading) {
            return 255 << 24 | blue << 16 | green << 8 | red;
        }

        // TODO: do lighting only if triangle is visible
        let scalar: number = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
        scalar = scalar * 0.85 + 0.15;
        return new Color(scalar * red, scalar * green, scalar * blue, 255).toPackedFormat();
    }

}
