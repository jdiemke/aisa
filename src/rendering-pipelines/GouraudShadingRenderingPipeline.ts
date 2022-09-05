import { Color } from '../core/Color';
import { Framebuffer } from '../Framebuffer';
import { FlatshadedMesh } from '../geometrical-objects/FlatshadedMesh';
import { Vector4f } from '../math/index';
import { Matrix4f } from '../math/Matrix4f';
import { SutherlandHodgman2DClipper } from '../screen-space-clipping/SutherlandHodgman2DClipper';
import { Fog } from '../shading/fog/Fog';
import { PhongLighting } from '../shading/illumination-models/PhongLighting';
import { PointLight } from '../shading/light/PointLight';
import { Material } from '../shading/material/Material';
import { Vertex } from '../Vertex';
import { AbstractRenderingPipeline } from './AbstractRenderingPipeline';
import { AbstractTriangleRasterizer } from '../rasterizer/AbstractTriangleRasterizer';
import { GouraudShadingTriangleRasterizer } from '../rasterizer/GouraudShadingTriangleRasterizer';

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
export class GouraudShadingRenderingPipeline extends AbstractRenderingPipeline {

    private fog: Fog = null;
    private lights: Array<PointLight> = null;
    private material: Material = null;
    private lighting: boolean = true;
    private color: Color = Color.WHITE;

    // it is possible to change the rasterizer here for
    // flat, gouroud, texture mapping etc.. should be done with clipper as well!
    private triangleRasterizer: AbstractTriangleRasterizer = null;
    private clipper: SutherlandHodgman2DClipper;

    private projectedVertices: Array<Vector4f> = new Array<Vector4f>(
        new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1), new Vector4f(0, 0, 0, 1)
    );

    private vertexArray: Array<Vertex> = new Array<Vertex>(
        new Vertex(), new Vertex(), new Vertex()
    );

    public constructor(framebuffer: Framebuffer) {
        super(framebuffer);
        this.clipper = new SutherlandHodgman2DClipper(framebuffer);

        const light1: PointLight = new PointLight();
        light1.ambientIntensity = new Vector4f(1, 1, 1, 1);
        light1.diffuseIntensity = new Vector4f(1, 1, 1, 1);
        light1.specularIntensity = new Vector4f(1, 1, 1, 1);
        light1.position = new Vector4f(3, 0, -2, 1);

        const light2: PointLight = new PointLight();
        light2.ambientIntensity = new Vector4f(0, 0, 1, 1);
        light2.diffuseIntensity = new Vector4f(0, 0.6, 1, 1);
        light2.specularIntensity = new Vector4f(0.8, 0.8, 0.8, 1);
        light2.position = new Vector4f(0, -380, -180, 1);

        this.lights = [light1, light2];

        const mat: Material = new Material();
        mat.ambientColor = new Vector4f(0.12, 0.14, 0.1, 0);
        mat.diffuseColor = new Vector4f(0.38, 0.4, 0.4, 1);
        mat.specularColor = new Vector4f(0.8, 0.5, 0.5, 0);
        mat.shininess = 2;

        this.material = mat;
        this.triangleRasterizer = new GouraudShadingTriangleRasterizer(framebuffer);
    }

    public setFramebuffer(framebuffer: Framebuffer) {
        this.framebuffer = framebuffer;
    }

    public setFog(fog: Fog): void {
        this.fog = fog;
    }

    public setLights(lights: Array<PointLight>): void {
        this.lights = lights;
    }

    public enableLighting(enable: boolean): void {
        this.lighting = enable;
    }

    public setMaterial(material: Material): void {
        this.material = material;
    }

    public setColor(color: Color): void {
        this.color = color;
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
                /*
                                const projected: Array<Vertex> = output.map<Vertex>((v: Vertex) => {
                                    v.projection = this.project(v.position);
                                    return v;
                                });*/

                for (let j: number = 0; j < output.length; j++) {
                    output[j].projection = this.project(output[j].position);
                }

                this.renderConvexPolygon(framebuffer, output, false);
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

    public computeNearPlaneIntersection(p1: Vertex, p2: Vertex): Vertex {
        // TODO: interpolate color linear
        const ratio: number = (this.NEAR_PLANE_Z - p1.position.z) / (p2.position.z - p1.position.z);
        const vertex: Vertex = new Vertex();
        vertex.position = new Vector4f(
            ratio * (p2.position.x - p1.position.x) + p1.position.x,
            ratio * (p2.position.y - p1.position.y) + p1.position.y,
            this.NEAR_PLANE_Z
        );
        vertex.color = p2.color.sub(p1.color).mul(ratio).add(p1.color);
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

    private renderConvexPolygon(framebuffer: Framebuffer, projected: Array<Vertex>, late: boolean = false): void {
        if (projected.length === 3 &&
            !this.isTriangleCCW(
                projected[0].projection,
                projected[1].projection,
                projected[2].projection)) {
            return;
        }

        if (late) {
            if (this.lighting) {
                this.vertexArray[0].color = this.computeColor(this.vertexArray[0].normal, this.vertexArray[0].position);
                this.vertexArray[1].color = this.computeColor(this.vertexArray[1].normal, this.vertexArray[1].position);
                this.vertexArray[2].color = this.computeColor(this.vertexArray[2].normal, this.vertexArray[2].position);
            } else {
                this.vertexArray[0].color = this.color;
                this.vertexArray[1].color = this.color;
                this.vertexArray[2].color = this.color;
            }

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

        const clippedPolygon: Array<Vertex> = this.clipper.clipConvexPolygon(projected);

        if (clippedPolygon.length < 3) {
            return;
        }

        this.triangulateConvexPolygon(framebuffer, clippedPolygon);
    }

    private triangulateConvexPolygon(framebuffer:Framebuffer, clippedPolygon: Array<Vertex>): void {
        for (let j: number = 0; j < clippedPolygon.length - 2; j++) {
            this.triangleRasterizer.drawTriangleDDA(
                framebuffer,
                clippedPolygon[0],
                clippedPolygon[1 + j],
                clippedPolygon[2 + j]
            );
        }
    }

    private computeColor(normal: Vector4f, vertex: Vector4f): Color {

        // TODO: if lighting is enabled use mat and light
        // else use Color set

        let vertexColor: Vector4f = new PhongLighting().computeColor(this.material, this.lights, normal, vertex);

        if (this.fog !== null) {
            vertexColor = this.fog.computeVertexColor(vertexColor, vertex);
        }

        return new Color(
            Math.min(255, vertexColor.x * 255),
            Math.min(255, vertexColor.y * 255),
            Math.min(255, vertexColor.z * 255),
            255
        );
    }

}
