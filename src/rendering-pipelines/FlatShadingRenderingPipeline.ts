import { Color } from '../core/Color';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector3f, Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { SutherlandHodgman2DClipper } from '../screen-space-clipping/SutherlandHodgman2DClipper';
import { PhongLighting } from '../shading/illumination-models/PhongLighting';
import { PointLight } from '../shading/light/PointLight';
import { Material } from '../shading/material/Material';
import { Vertex } from '../Vertex';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';
import { Fog } from '../shading/fog/Fog';

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

    private projectedVertices: Array<Vector4f> = new Array<Vector4f>(
        new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1)
    );

    private vertexArray: Array<Vertex> = new Array<Vertex>(
        new Vertex(), new Vertex(), new Vertex()
    );

    public draw(mesh: FlatshadedMesh, modelViewMartrix: Matrix4f,
        red: number, green: number, blue: number): void {

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

            const normal: Vector4f = mesh.transformedNormals[mesh.faces[i].normal];

            if (this.isInFrontOfNearPlane(v1) &&
                this.isInFrontOfNearPlane(v2) &&
                this.isInFrontOfNearPlane(v3)) {

                this.project2(v1, this.projectedVertices[0]);
                this.project2(v2, this.projectedVertices[1]);
                this.project2(v3, this.projectedVertices[2]);

                this.vertexArray[0].position = v1;
                this.vertexArray[0].projection = this.projectedVertices[0];
                this.vertexArray[0].normal = normal;
                this.vertexArray[0].color = this.computeColor(normal, v1);

                this.vertexArray[1].position = v2;
                this.vertexArray[1].projection = this.projectedVertices[1];
                this.vertexArray[1].color = this.vertexArray[0].color;

                this.vertexArray[2].position = v3;
                this.vertexArray[2].projection = this.projectedVertices[2];
                this.vertexArray[2].color = this.vertexArray[0].color;

                this.renderConvexPolygon(this.vertexArray);
            } else if (!this.isInFrontOfNearPlane(v1) &&
                !this.isInFrontOfNearPlane(v2) &&
                !this.isInFrontOfNearPlane(v3)) {
                continue;
            } else {
                this.vertexArray[0].position = v1;
                this.vertexArray[0].normal = normal;
                this.vertexArray[0].color = this.computeColor(normal, v1);

                this.vertexArray[1].position = v2;
                this.vertexArray[1].color = this.vertexArray[0].color;

                this.vertexArray[2].position = v3;
                this.vertexArray[2].color = this.vertexArray[0].color;

                const output: Array<Vertex> = this.zClipTriangle(this.vertexArray);

                if (output.length < 3) {
                    return;
                }

                const projected: Array<Vertex> = output.map<Vertex>((v: Vertex) => {
                    v.projection = this.project(v.position);
                    return v;
                });

                this.renderConvexPolygon(projected);
            }
        }
    }

    public project(t1: { x: number, y: number, z: number }): Vector4f {
        return new Vector4f(
            Math.round((320 / 2) + (292 * t1.x / (-t1.z))),
            Math.round((200 / 2) - (t1.y * 292 / (-t1.z))),
            t1.z
        );
    }

    public project2(t1: { x: number, y: number, z: number }, result: Vector4f): void {
        result.x = Math.round((320 / 2) + (292 * t1.x / (-t1.z)));
        result.y = Math.round((200 / 2) - (t1.y * 292 / (-t1.z)));
        result.z = t1.z;
    }

    public computeNearPlaneIntersection(p1: Vertex, p2: Vertex): Vertex {
        const ratio: number = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        const vertex: Vertex = new Vertex();
        vertex.position = new Vector4f(
            ratio * (p2.position.x - p1.position.x) + p1.position.x,
            ratio * (p2.position.y - p1.position.y) + p1.position.y,
            this.NEAR_PLANE_Z
        );
        vertex.color = p1.color;
        return vertex;
    }

    public zClipTriangle(subject: Array<Vertex>): Array<Vertex> {
        const input: Array<Vertex> = subject;
        const output: Array<Vertex> = new Array<Vertex>();
        let S: Vertex = input[input.length - 1];

        for (let i: number = 0; i < input.length; i++) {
            const point: Vertex = input[i];
            if (this.isInFrontOfNearPlane(point.position)) {
                if (!this.isInFrontOfNearPlane(S.position)) {
                    output.push(this.computeNearPlaneIntersection(S, point));
                }
                output.push(point);
            } else if (this.isInFrontOfNearPlane(S.position)) {
                output.push(this.computeNearPlaneIntersection(S, point));
            }
            S = point;
        }

        return output;
    }

    private renderConvexPolygon(projected: Array<Vertex>): void {
        if (projected.length === 3 &&
            !this.isTriangleCCW(
                projected[0].projection,
                projected[1].projection,
                projected[2].projection)) {
            return;
        }

        if (projected.length === 4 &&
            !this.isTriangleCCW2(
                projected[0].projection,
                projected[1].projection,
                projected[2].projection,
                projected[3].projection)
        ) {
            return;
        }

        const clippedPolygon: Array<Vertex> = SutherlandHodgman2DClipper.clipConvexPolygon(projected);

        if (clippedPolygon.length < 3) {
            return;
        }

        this.triangulateConvexPolygon(clippedPolygon, projected[0].color);
    }

    private triangulateConvexPolygon(clippedPolygon: Array<Vertex>, color: Color): void {
        for (let j: number = 0; j < clippedPolygon.length - 2; j++) {
            this.framebuffer.triangleRasterizer.drawTriangleDDA(
                clippedPolygon[0].projection,
                clippedPolygon[1 + j].projection,
                clippedPolygon[2 + j].projection,
                color.toPackedFormat()
            );
        }
    }

    private computeColor(normal: Vector4f, vertex: Vector4f): Color {
        // TODO: do lighting only if triangle is visible
        //let scalar: number = Math.min((Math.max(0.0, normal.dot(lightDirection))), 1.0);
        //scalar = scalar * 0.85 + 0.15;
        //return new Color(scalar * red, scalar * green, scalar * blue, 255).toPackedFormat();

        // do lighting before projecton and clipping and use vertex structure to save
        const pl: PointLight = new PointLight();
        pl.ambientIntensity = new Vector4f(1, 1, 1, 1);
        pl.diffuseIntensity = new Vector4f(1, 1, 1, 1);
        pl.specularIntensity = new Vector4f(1, 1, 1, 1);
        pl.position = new Vector4f(3, 0, -2, 1);
        const mat: Material = new Material();
        mat.ambientColor = new Vector4f(0.12, 0.14, 0.1, 0);
        mat.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat.shininess = 2;
        const color: Vector4f = new Fog().computeVertexColor(
            new PhongLighting().computeColor(mat, pl, normal, vertex), vertex
        );

        return new Color(
            Math.min(255, color.x * 255),
            Math.min(255, color.y * 255),
            Math.min(255, color.z * 255),
            255
        );
    }

}
